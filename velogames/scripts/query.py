"""Search the Velogames dataset.

    python velogames/scripts/query.py rider pogacar
    python velogames/scripts/query.py top --race giro --year 2025 --class Climber -n 10
    python velogames/scripts/query.py value --max-cost 8 -n 15
    python velogames/scripts/query.py optimum --race vuelta
    python velogames/scripts/query.py editions
    python velogames/scripts/query.py stages --type mountain --year 2026
    python velogames/scripts/query.py sql "select name, sum(tot) from scores group by 1 order by 2 desc limit 5"

Anything the subcommands do not cover, `sql` will. Schema: see the README, or
run `python velogames/scripts/query.py schema`.
"""

import argparse
import os
import sqlite3
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

DB = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "data", "velogames.db")
RACES = ("tdf", "giro", "vuelta")


def show(rows, headers):
    if not rows:
        print("no rows")
        return
    cells = [[("" if v is None else str(v)) for v in r] for r in rows]
    width = [max(len(h), *(len(c[i]) for c in cells)) for i, h in enumerate(headers)]
    numeric = [
        all(c[i].replace(".", "").replace("-", "").isdigit() or not c[i] for c in cells)
        for i in range(len(headers))
    ]
    def line(vals):
        return "  ".join(
            v.rjust(width[i]) if numeric[i] else v.ljust(width[i]) for i, v in enumerate(vals)
        ).rstrip()
    print(line(headers))
    print("  ".join("-" * w for w in width))
    for c in cells:
        print(line(c))
    print(f"\n{len(rows)} rows")


def run(db, sql, params=()):
    cur = db.execute(sql, params)
    show(cur.fetchall(), [d[0] for d in cur.description])


def scope(args, alias=""):
    """Shared --race/--year filter, returned as a WHERE fragment + params."""
    p = alias + "." if alias else ""
    where, params = [], []
    if args.race:
        where.append(f"{p}race = ?")
        params.append(args.race)
    if args.year:
        where.append(f"{p}year = ?")
        params.append(args.year)
    return (" AND " + " AND ".join(where) if where else ""), params


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    sub = ap.add_subparsers(dest="cmd", required=True)

    def common(p):
        p.add_argument("--race", choices=RACES, help="tdf, giro or vuelta")
        p.add_argument("--year", type=int)
        p.add_argument("-n", type=int, default=20, help="row limit")
        return p

    q = common(sub.add_parser("rider", help="every ride by riders matching a name"))
    q.add_argument("name")
    q.add_argument("--rounds", action="store_true", help="also print the round-by-round breakdown")

    q = common(sub.add_parser("top", help="highest scorers"))
    q.add_argument("--class", dest="klass", help="All Rounder, Climber, Sprinter, Unclassed")
    q.add_argument("--team", help="pro team, substring match")

    q = common(sub.add_parser("value", help="best points per credit"))
    q.add_argument("--max-cost", type=int)
    q.add_argument("--min-points", type=int, default=0)

    common(sub.add_parser("optimum", help="the hindsight-optimal squads"))
    common(sub.add_parser("editions", help="one row per race edition"))

    q = common(sub.add_parser("stages", help="stage list with the class split of stage points"))
    q.add_argument("--type", help="sprint, mountain, mixed, ITT, TTT, no_result")

    q = sub.add_parser("sql", help="run arbitrary read-only SQL")
    q.add_argument("statement")

    sub.add_parser("schema", help="print the table definitions")

    args = ap.parse_args()
    sys.stdout.reconfigure(encoding="utf-8")
    if not os.path.exists(DB):
        # the db is derived and not committed; build it on first use
        print("building velogames.db from raw/ ...", file=sys.stderr)
        import build

        build.main()
        print(file=sys.stderr)
    db = sqlite3.connect(f"file:{DB}?mode=ro", uri=True)

    if args.cmd == "schema":
        for (s,) in db.execute("SELECT sql FROM sqlite_master WHERE sql IS NOT NULL ORDER BY name"):
            print(s + ";\n")

    elif args.cmd == "sql":
        if not args.statement.lstrip().lower().startswith(("select", "with")):
            sys.exit("read-only: statement must start with SELECT or WITH")
        run(db, args.statement)

    elif args.cmd == "rider":
        w, p = scope(args)
        run(
            db,
            f"""SELECT race, year, name, rider_class, pro_team, cost, total_points,
                       pts_per_credit, selected_pct, overall_rank
                FROM riders WHERE name LIKE ? {w}
                ORDER BY total_points DESC LIMIT ?""",
            [f"%{args.name}%", *p, args.n],
        )
        if args.rounds:
            print()
            run(
                db,
                f"""SELECT race, year, name, round_label, stg, gc, pc, kom, spr, smt, bky, ass, tot
                    FROM scores WHERE name LIKE ? {w}
                    ORDER BY race, year, round""",
                [f"%{args.name}%", *p],
            )

    elif args.cmd == "top":
        w, p = scope(args)
        if args.klass:
            w += " AND rider_class = ?"
            p.append(args.klass)
        if args.team:
            w += " AND pro_team LIKE ?"
            p.append(f"%{args.team}%")
        run(
            db,
            f"""SELECT race, year, name, rider_class, pro_team, cost, total_points, pts_per_credit
                FROM riders WHERE 1=1 {w} ORDER BY total_points DESC LIMIT ?""",
            [*p, args.n],
        )

    elif args.cmd == "value":
        w, p = scope(args)
        if args.max_cost:
            w += " AND cost <= ?"
            p.append(args.max_cost)
        run(
            db,
            f"""SELECT race, year, name, rider_class, cost, total_points, pts_per_credit, selected_pct
                FROM riders WHERE total_points >= ? {w}
                ORDER BY pts_per_credit DESC LIMIT ?""",
            [args.min_points, *p, args.n],
        )

    elif args.cmd == "optimum":
        w, p = scope(args, "o")
        run(
            db,
            f"""SELECT o.race, o.year, o.slot, o.name, o.rider_class, o.pro_team,
                       o.cost, o.points, o.pts_per_credit,
                       e.optimum_points AS squad_total, e.winning_score, e.winner_gap_pct
                FROM optimal_teams o
                JOIN editions e ON e.race = o.race AND e.year = o.year
                WHERE 1=1 {w} ORDER BY o.race, o.year, o.slot""",
            p,
        )

    elif args.cmd == "editions":
        w, p = scope(args)
        run(
            db,
            f"""SELECT race_name, year, riders, pro_teams, field_points, max_cost,
                       winning_score, optimum_points, optimum_credits, winner_gap_pct
                FROM editions WHERE 1=1 {w} ORDER BY race, year""",
            p,
        )

    elif args.cmd == "stages":
        w, p = scope(args)
        if args.type:
            w += " AND type = ?"
            p.append(args.type)
        run(
            db,
            f"""SELECT race, year, round, label, type, stage_points, round_points,
                       share_all_rounder, share_climber, share_sprinter, share_unclassed
                FROM stages WHERE 1=1 {w} ORDER BY race, year, round LIMIT ?""",
            [*p, args.n],
        )


if __name__ == "__main__":
    main()
