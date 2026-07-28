"""Spot-check the local database against the live Velogames pages.

Samples random rows out of velogames.db and re-fetches the same numbers from
velogames.com. Reads the database, not the raw JSONs, so it exercises the whole
chain: scrape, raw file, build, CSV, database. Exits non-zero on any mismatch.

    python velogames/scripts/verify.py            # 10 samples
    python velogames/scripts/verify.py -n 25      # more
    python velogames/scripts/verify.py --seed 39  # reproducible

Hits the network, roughly one page fetch per sample.
"""

import argparse
import os
import re
import sqlite3
import sys

import requests
from bs4 import BeautifulSoup

DB = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "data", "velogames.db")
SLUG = {"tdf": "velogame", "giro": "italy", "vuelta": "spain"}
COLS = ["stg", "gc", "pc", "kom", "spr", "smt", "bky", "ass", "tot"]

session = requests.Session()
session.headers.update({"User-Agent": "Mozilla/5.0 (ap39 velogames verify)"})
cache = {}


def cell(td):
    t = td.get_text(strip=True)
    return 0 if t in {"-", ""} else int(t.replace(",", ""))


def live_profile(race, year, rider_id):
    """(meta, rounds) straight off the rider's profile page."""
    key = (race, year, rider_id)
    if key in cache:
        return cache[key]
    url = f"https://www.velogames.com/{SLUG[race]}/{year}/riderprofile.php?rider={rider_id}"
    soup = BeautifulSoup(session.get(url, timeout=40).text, "lxml")
    rounds = [
        [cell(c) for c in tds[1:]]
        for tr in soup.find("table").find_all("tr")
        if len(tds := tr.find_all("td")) == 10
    ]
    lines = soup.get_text("\n", strip=True).split("\n")
    meta = {}
    for i, l in enumerate(lines):
        if l == "Overall Score:":
            meta["total_points"] = int(lines[i + 1].replace(",", ""))
        elif l == "Selected by:":
            meta["selected_pct"] = float(lines[i + 1].rstrip("%"))
        elif l.endswith(" credits") and "cost" not in meta:
            meta["cost"] = int(l.split()[0])
    cache[key] = (meta, rounds)
    return meta, rounds


def live_winning_score(race, year):
    base = f"https://www.velogames.com/{SLUG[race]}/{year}"
    ga = re.search(r"teamscore\.php\?ga=(\d+)", session.get(f"{base}/teamscore.php", timeout=40).text)
    board = session.get(f"{base}/teamscore.php?ga={ga.group(1)}", timeout=40).text
    return int(re.findall(r"(\d[\d,]*) points", board.replace(",", ""))[0])


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("-n", type=int, default=10, help="how many samples (default 10)")
    ap.add_argument("--seed", type=int, help="seed the sampling for a repeatable run")
    args = ap.parse_args()
    sys.stdout.reconfigure(encoding="utf-8")

    if not os.path.exists(DB):
        sys.exit(f"{DB} not found. Run: python velogames/scripts/build.py")
    db = sqlite3.connect(f"file:{DB}?mode=ro", uri=True)
    db.row_factory = sqlite3.Row
    if args.seed is not None:
        db.execute("SELECT 1")
        db.create_function("seeded", 0, __import__("random").Random(args.seed).random)
    rnd = "seeded()" if args.seed is not None else "random()"

    checks = []

    # rounds that actually scored, so a match means something
    n_scores = max(1, args.n // 2)
    for r in db.execute(
        f"SELECT race, year, rider_id, name, round, round_label, {','.join(COLS)} "
        f"FROM scores WHERE tot > 50 ORDER BY {rnd} LIMIT {n_scores}"
    ):
        _, rounds = live_profile(r["race"], r["year"], r["rider_id"])
        got, want = [r[c] for c in COLS], rounds[r["round"] - 1]
        checks.append((f'scores   {r["race"]} {r["year"]} {r["name"]}, {r["round_label"]}', got, want))

    n_riders = max(1, (args.n - n_scores) // 2)
    for r in db.execute(
        f"SELECT race, year, rider_id, name, cost, selected_pct, total_points "
        f"FROM riders ORDER BY {rnd} LIMIT {n_riders}"
    ):
        meta, _ = live_profile(r["race"], r["year"], r["rider_id"])
        got = [r["cost"], r["selected_pct"], r["total_points"]]
        want = [meta.get("cost"), meta.get("selected_pct"), meta.get("total_points")]
        checks.append((f'riders   {r["race"]} {r["year"]} {r["name"]}, cost/pick%/total', got, want))

    for e in db.execute(f"SELECT race, year, winning_score FROM editions ORDER BY {rnd} LIMIT 1"):
        checks.append(
            (f'editions {e["race"]} {e["year"]} winning score', [e["winning_score"]], [live_winning_score(e["race"], e["year"])])
        )

    # internal consistency, no network needed
    for s in db.execute(f"SELECT * FROM stages ORDER BY {rnd} LIMIT {max(1, args.n - len(checks))}"):
        tot = db.execute(
            "SELECT sum(stg) s FROM scores WHERE race=? AND year=? AND round=?",
            (s["race"], s["year"], s["round"]),
        ).fetchone()["s"]
        checks.append((f'stages   {s["race"]} {s["year"]} {s["label"]}, stage points', [s["stage_points"]], [tot]))

    fails = 0
    for i, (label, got, want) in enumerate(checks, 1):
        ok = got == want
        fails += not ok
        print(f"{i:<3} {label:<52} {'PASS' if ok else 'FAIL'}")
        print(f"    {got}" if ok else f"    db     : {got}\n    velogames: {want}")

    print(f"\n{len(checks) - fails}/{len(checks)} passed")
    sys.exit(1 if fails else 0)


if __name__ == "__main__":
    main()
