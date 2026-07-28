"""Build the searchable layer from the three raw per-race JSON files.

Reads velogames/raw/*.json, writes velogames/data/*.csv and velogames.db.
Everything downstream is derived; the raw JSONs are the source of truth.

    python velogames/scripts/build.py
"""

import csv
import json
import os
import sqlite3
import sys
from collections import defaultdict

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
RAW = os.path.join(ROOT, "raw")
DATA = os.path.join(ROOT, "data")

RACES = [
    ("tdf", "Tour de France", "tdf-2023-2026.json"),
    ("giro", "Giro d'Italia", "giro-2023-2026.json"),
    ("vuelta", "Vuelta a España", "vuelta-2023-2025.json"),
]
# "sum" (mountain summits) is renamed smt so it is safe as a SQL column name
COMPONENTS = ["stg", "gc", "pc", "kom", "spr", "smt", "bky", "ass"]
CLASS_KEY = {
    "All Rounder": "all_rounder",
    "Climber": "climber",
    "Sprinter": "sprinter",
    "Unclassed": "unclassed",
}
QUOTA_ORDER = {"All Rounder": 0, "Climber": 1, "Sprinter": 2, "Unclassed": 3}

TABLES = {
    "editions": """
        race TEXT, race_name TEXT, year INT, riders INT, pro_teams INT,
        field_points INT, max_cost INT, rounds INT,
        winning_score INT, top5 TEXT,
        optimum_points INT, optimum_credits INT, winner_gap_pct REAL,
        PRIMARY KEY (race, year)""",
    "riders": """
        race TEXT, year INT, rider_id TEXT, name TEXT, pro_team TEXT,
        rider_class TEXT, cost INT, selected_pct REAL,
        total_points INT, pts_per_credit REAL, overall_rank INT,
        PRIMARY KEY (race, year, rider_id)""",
    "scores": """
        race TEXT, year INT, rider_id TEXT, name TEXT, round INT, round_label TEXT,
        """
    + ", ".join(f"{c} INT" for c in COMPONENTS)
    + """, tot INT,
        PRIMARY KEY (race, year, rider_id, round)""",
    "stages": """
        race TEXT, year INT, round INT, label TEXT, type TEXT,
        stage_points INT, round_points INT,
        share_all_rounder REAL, share_climber REAL,
        share_sprinter REAL, share_unclassed REAL,
        PRIMARY KEY (race, year, round)""",
    "optimal_teams": """
        race TEXT, year INT, slot INT, name TEXT, rider_class TEXT, pro_team TEXT,
        cost INT, points INT, pts_per_credit REAL,
        PRIMARY KEY (race, year, slot)""",
}


def load():
    editions, riders, scores, stages, optimal = [], [], [], [], []
    for race, race_name, fname in RACES:
        with open(os.path.join(RAW, fname), encoding="utf-8") as f:
            doc = json.load(f)

        by_year = defaultdict(list)
        for r in doc["riders"]:
            by_year[r["year"]].append(r)
        index = {(r["year"], r["name"]): r for r in doc["riders"]}

        for ystr, ed in sorted(doc["editions"].items()):
            year = int(ystr)
            labels = ed["round_labels"]
            opt = ed["hindsight_optimum"]
            editions.append(
                {
                    "race": race,
                    "race_name": race_name,
                    "year": year,
                    "riders": ed["riders"],
                    "pro_teams": ed["pro_teams"],
                    "field_points": ed["total_points"],
                    "max_cost": ed["max_cost"],
                    "rounds": len(labels),
                    "winning_score": ed["winning_score"],
                    "top5": ",".join(str(s) for s in ed["top5_scores"]),
                    "optimum_points": opt["points"],
                    "optimum_credits": opt["credits"],
                    "winner_gap_pct": ed["gap_winner_to_optimum_pct"],
                }
            )

            # the Tour file stores optimum members as bare names; the others as dicts
            team = [
                index[(year, m)] if isinstance(m, str) else index[(year, m["name"])]
                for m in opt["team"]
            ]
            team.sort(key=lambda r: (QUOTA_ORDER[r["class"]], -r["total_points"]))
            for slot, r in enumerate(team, 1):
                optimal.append(
                    {
                        "race": race,
                        "year": year,
                        "slot": slot,
                        "name": r["name"],
                        "rider_class": r["class"],
                        "pro_team": r["team"],
                        "cost": r["cost"],
                        "points": r["total_points"],
                        "pts_per_credit": round(r["total_points"] / r["cost"], 1),
                    }
                )

            # stage rows, with the class split of stage-result points recomputed
            # from the rider rows so every race reports it the same way
            for i in range(len(labels) - 1):
                split = defaultdict(int)
                for r in by_year[year]:
                    split[r["class"]] += r["rounds"][i][0]
                stage_pts = sum(split.values())
                src = next(
                    (s for s in doc["stages"] if s["year"] == year and s["round"] == i + 1), {}
                )
                stages.append(
                    {
                        "race": race,
                        "year": year,
                        "round": i + 1,
                        "label": labels[i],
                        "type": src.get("type", ""),
                        "stage_points": stage_pts,
                        "round_points": sum(r["rounds"][i][8] for r in by_year[year]),
                        **{
                            f"share_{k}": round(100 * split[c] / stage_pts, 1) if stage_pts else 0.0
                            for c, k in CLASS_KEY.items()
                        },
                    }
                )

        for r in doc["riders"]:
            riders.append(
                {
                    "race": race,
                    "year": r["year"],
                    "rider_id": r["rider_id"],
                    "name": r["name"],
                    "pro_team": r["team"],
                    "rider_class": r["class"],
                    "cost": r["cost"],
                    "selected_pct": r["selected_pct"],
                    "total_points": r["total_points"],
                    "pts_per_credit": round(r["total_points"] / r["cost"], 1),
                    "overall_rank": r["overall_rank"],
                }
            )
            labels = doc["editions"][str(r["year"])]["round_labels"]
            for i, row in enumerate(r["rounds"]):
                scores.append(
                    {
                        "race": race,
                        "year": r["year"],
                        "rider_id": r["rider_id"],
                        "name": r["name"],
                        "round": i + 1,
                        "round_label": labels[i],
                        **dict(zip(COMPONENTS, row[:8])),
                        "tot": row[8],
                    }
                )
    return {
        "editions": editions,
        "riders": riders,
        "scores": scores,
        "stages": stages,
        "optimal_teams": optimal,
    }


def write_csv(name, rows):
    path = os.path.join(DATA, f"{name}.csv")
    with open(path, "w", encoding="utf-8", newline="") as f:
        w = csv.DictWriter(f, fieldnames=list(rows[0]))
        w.writeheader()
        w.writerows(rows)
    return path


def write_db(tables):
    path = os.path.join(DATA, "velogames.db")
    if os.path.exists(path):
        os.remove(path)
    db = sqlite3.connect(path)
    for name, cols in TABLES.items():
        db.execute(f"CREATE TABLE {name} ({cols})")
        rows = tables[name]
        keys = list(rows[0])
        db.executemany(
            f"INSERT INTO {name} ({','.join(keys)}) VALUES ({','.join('?' * len(keys))})",
            [tuple(r[k] for k in keys) for r in rows],
        )
    for stmt in [
        "CREATE INDEX ix_riders_name ON riders(name)",
        "CREATE INDEX ix_riders_pts ON riders(total_points DESC)",
        "CREATE INDEX ix_riders_class ON riders(rider_class, race, year)",
        "CREATE INDEX ix_scores_rider ON scores(race, year, rider_id)",
        "CREATE INDEX ix_scores_name ON scores(name)",
        "CREATE INDEX ix_stages_type ON stages(type)",
    ]:
        db.execute(stmt)
    db.commit()
    db.close()
    return path


def main():
    sys.stdout.reconfigure(encoding="utf-8")
    os.makedirs(DATA, exist_ok=True)
    tables = load()

    # every rider's round totals must equal their published season total
    seen = {(r["race"], r["year"], r["rider_id"]): 0 for r in tables["riders"]}
    for s in tables["scores"]:
        seen[(s["race"], s["year"], s["rider_id"])] += s["tot"]
    bad = [r for r in tables["riders"] if seen[(r["race"], r["year"], r["rider_id"])] != r["total_points"]]
    assert not bad, f"{len(bad)} riders whose rounds do not sum to their total"

    for name, rows in tables.items():
        print(f"{write_csv(name, rows)}  {len(rows):,} rows")
    print(f"{write_db(tables)}  {len(TABLES)} tables")
    print(f"validation: {len(tables['riders']):,}/{len(tables['riders']):,} rider totals reconcile")


if __name__ == "__main__":
    main()
