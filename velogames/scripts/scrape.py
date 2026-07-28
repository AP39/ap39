"""Scrape a Velogames grand tour edition: riders, per-round score breakdowns,
stage labels and the public leaderboard.

    python velogames_scrape.py italy 2023 2024 2025 2026
    python velogames_scrape.py spain 2023 2024 2025

Races are Velogames' own URL slugs: velogame (Tour), italy (Giro), spain (Vuelta).
Writes velogames-<race>-<first>-<last>.json plus flat riders/scores CSVs.
"""

import json
import re
import sys
import time
from collections import defaultdict
from concurrent.futures import ThreadPoolExecutor

import requests
from bs4 import BeautifulSoup

BASE = "https://www.velogames.com"
RACE_NAMES = {"velogame": "Tour de France", "italy": "Giro d'Italia", "spain": "Vuelta a España"}
COLS = ["stg", "gc", "pc", "kom", "spr", "sum", "bky", "ass", "tot"]
WORKERS = 6

session = requests.Session()
session.headers.update({"User-Agent": "Mozilla/5.0 (ap39 velogames research scraper)"})


def get(url, tries=4):
    for n in range(tries):
        try:
            r = session.get(url, timeout=40)
            if r.status_code == 200:
                return r.text
            if r.status_code == 404:
                return None
        except requests.RequestException:
            pass
        time.sleep(1.5 * (n + 1))
    raise RuntimeError(f"failed: {url}")


def num(s):
    s = s.strip().replace(",", "")
    return 0 if s in {"-", "", "–"} else int(s)


def scrape_riders(race, year):
    html = get(f"{BASE}/{race}/{year}/riders.php")
    if html is None:
        return []
    table = BeautifulSoup(html, "lxml").find("table")
    if table is None:
        return []
    riders = []
    for tr in table.find_all("tr"):
        cells = tr.find_all("td")
        if len(cells) < 7:
            continue
        link = tr.find("a", href=re.compile(r"rider=(\d+)"))
        if not link:
            continue
        vals = [c.get_text(" ", strip=True) for c in cells]
        riders.append(
            {
                "year": year,
                "rider_id": re.search(r"rider=(\d+)", link["href"]).group(1),
                "name": vals[1],
                "team": vals[2],
                "class": vals[3],
                "cost": num(vals[4]),
                "selected_pct": float(vals[5].rstrip("%") or 0),
                "total_points": num(vals[6]),
            }
        )
    riders.sort(key=lambda r: -r["total_points"])
    for i, r in enumerate(riders, 1):
        r["overall_rank"] = i
    return riders


def scrape_profile(race, year, rider):
    html = get(f"{BASE}/{race}/{year}/riderprofile.php?rider={rider['rider_id']}")
    table = BeautifulSoup(html, "lxml").find("table")
    rounds, labels = [], []
    for tr in table.find_all("tr"):
        cells = tr.find_all("td")
        if len(cells) != 10:
            continue
        labels.append(cells[0].get_text(" ", strip=True))
        rounds.append([num(c.get_text()) for c in cells[1:]])
    rider["rounds"] = rounds
    return labels


def scrape_meta(race, year):
    """Leaderboard top scores and the stage labels (which carry ITT/TTT tags)."""
    html = get(f"{BASE}/{race}/{year}/teamscore.php")
    ga = re.search(r"teamscore\.php\?ga=(\d+)", html or "")
    labels = re.findall(r'teamscore\.php\?ga=\d+&st=\d+">([^<]+)</a>', html or "")
    scores = []
    if ga:
        board = get(f"{BASE}/{race}/{year}/teamscore.php?ga={ga.group(1)}")
        scores = [int(x) for x in re.findall(r"(\d[\d,]*) points", board.replace(",", ""))]
    return scores, labels


def stage_type(round_idx, riders, labels):
    label = labels[round_idx] if round_idx < len(labels) else ""
    if "TTT" in label:
        return "TTT"
    if "ITT" in label:
        return "ITT"
    by_class = defaultdict(int)
    for r in riders:
        by_class[r["class"]] += r["rounds"][round_idx][0]
    total = sum(by_class.values())
    if not total:
        return "no_result"  # stage run but neutralised/abandoned, no stage points awarded
    spr = 100 * by_class["Sprinter"] / total
    clm = 100 * (by_class["Climber"] + by_class["All Rounder"]) / total
    if spr >= 40:
        return "sprint"
    if clm >= 65:
        return "mountain"
    return "mixed"


def optimum(riders):
    import pulp

    quota = {"All Rounder": 2, "Climber": 2, "Sprinter": 1, "Unclassed": 3}
    prob = pulp.LpProblem("opt", pulp.LpMaximize)
    x = {r["rider_id"]: pulp.LpVariable(r["rider_id"], cat="Binary") for r in riders}
    prob += pulp.lpSum(x[r["rider_id"]] * r["total_points"] for r in riders)
    prob += pulp.lpSum(x.values()) == 9
    prob += pulp.lpSum(x[r["rider_id"]] * r["cost"] for r in riders) <= 100
    for cls, lo in quota.items():
        prob += pulp.lpSum(x[r["rider_id"]] for r in riders if r["class"] == cls) >= lo
    prob.solve(pulp.PULP_CBC_CMD(msg=0))
    team = [r for r in riders if x[r["rider_id"]].value() > 0.5]
    team.sort(key=lambda r: -r["total_points"])
    return {
        "points": sum(r["total_points"] for r in team),
        "credits": sum(r["cost"] for r in team),
        "team": [
            {
                "name": r["name"],
                "class": r["class"],
                "pro_team": r["team"],
                "cost": r["cost"],
                "points": r["total_points"],
            }
            for r in team
        ],
    }


def scrape_edition(race, year):
    riders = scrape_riders(race, year)
    if not riders:
        print(f"  {race} {year}: no rider data published, skipped")
        return None
    scores, stage_labels = scrape_meta(race, year)
    labels_holder = []
    with ThreadPoolExecutor(WORKERS) as pool:
        for lab in pool.map(lambda r: scrape_profile(race, year, r), riders):
            labels_holder.append(lab)
    round_labels = max(labels_holder, key=len)

    bad = [r["name"] for r in riders if sum(x[8] for x in r["rounds"]) != r["total_points"]]
    ragged = [r["name"] for r in riders if len(r["rounds"]) != len(round_labels)]
    mismatch = sum(
        1 for r in riders for row in r["rounds"] if sum(row[:8]) != row[8]
    )

    ed = {
        "riders": len(riders),
        "pro_teams": len({r["team"] for r in riders}),
        "total_points": sum(r["total_points"] for r in riders),
        "max_cost": max(r["cost"] for r in riders),
        "round_labels": round_labels,
        "winning_score": scores[0] if scores else None,
        "top5_scores": scores[:5],
        "hindsight_optimum": optimum(riders),
        "validation": {
            "rider_totals_ok": len(riders) - len(bad),
            "rider_totals_bad": bad,
            "ragged_round_counts": ragged,
            "component_rows_not_summing": mismatch,
        },
        "component_totals": {
            c: sum(row[i] for r in riders for row in r["rounds"]) for i, c in enumerate(COLS[:8])
        },
    }
    ed["gap_winner_to_optimum_pct"] = (
        round(100 * (ed["hindsight_optimum"]["points"] - scores[0]) / ed["hindsight_optimum"]["points"], 1)
        if scores
        else None
    )
    stages = [
        {
            "year": year,
            "round": i + 1,
            "label": round_labels[i],
            "type": stage_type(i, riders, stage_labels),
            "stage_points": sum(r["rounds"][i][0] for r in riders),
            "round_points": sum(r["rounds"][i][8] for r in riders),
        }
        for i in range(len(round_labels) - 1)
    ]
    print(
        f"  {race} {year}: {len(riders)} riders, {len(round_labels)} rounds, "
        f"winner {ed['winning_score']}, optimum {ed['hindsight_optimum']['points']}, "
        f"totals {len(riders)-len(bad)}/{len(riders)} valid"
    )
    return ed, riders, stages


def main():
    sys.stdout.reconfigure(encoding="utf-8")
    race = sys.argv[1]
    years = [int(y) for y in sys.argv[2:]]
    editions, all_riders, all_stages = {}, [], []
    print(f"{RACE_NAMES.get(race, race)}:")
    for y in years:
        got = scrape_edition(race, y)
        if not got:
            continue
        ed, riders, stages = got
        editions[str(y)] = ed
        all_riders += riders
        all_stages += stages

    tag = f"{min(int(y) for y in editions)}-{max(int(y) for y in editions)}"
    doc = {
        "_readme": {
            "what": f"Velogames Fantasy Cycling {RACE_NAMES.get(race, race)} full-field data, {tag}.",
            "source": f"{BASE}/{race}/<year>/ (riders.php, riderprofile.php, teamscore.php, rules.php)",
            "scraped": time.strftime("%Y-%m-%d"),
            "editions": sorted(editions),
            "rounds_column_order": COLS,
            "game_rules": {
                "squad_size": 9,
                "budget_credits": 100,
                "class_quotas": {
                    "All Rounder": 2,
                    "Climber": 2,
                    "Sprinter": 1,
                    "Unclassed": 3,
                    "Wildcard (any class)": 1,
                },
                "note": "Confirmed from each edition's rules.php. Identical to the Tour de France game.",
            },
            "derived_fields": {
                "hindsight_optimum": "Exact ILP over final points under the real squad constraints.",
                "stage_type": "ITT/TTT from Velogames' own stage labels. Others empirical: sprint = sprinters took >=40% of stage-result points, mountain = climbers + all-rounders took >=65%, else mixed. Describes who scored, not the official parcours.",
                "winning_score": "Top score on the public Classic (Main) leaderboard, which shows the top ~300 teams only.",
            },
            "not_available": "Velogames has purged rider data for editions before 2023; riders.php returns an empty table.",
        },
        "editions": editions,
        "riders": all_riders,
        "stages": all_stages,
    }
    stem = f"velogames-{'tdf' if race == 'velogame' else 'giro' if race == 'italy' else 'vuelta'}"
    with open(f"{stem}-{tag}.json", "w", encoding="utf-8") as f:
        json.dump(doc, f, indent=1, ensure_ascii=False)
    with open(f"{stem}-riders.csv", "w", encoding="utf-8", newline="") as f:
        f.write("year,rider_id,name,team,class,cost,selected_pct,total_points,overall_rank\n")
        for r in all_riders:
            f.write(
                f'{r["year"]},{r["rider_id"]},"{r["name"]}","{r["team"]}",{r["class"]},'
                f'{r["cost"]},{r["selected_pct"]},{r["total_points"]},{r["overall_rank"]}\n'
            )
    with open(f"{stem}-scores.csv", "w", encoding="utf-8", newline="") as f:
        f.write("year,rider_id,name,round,round_label,{}\n".format(",".join(COLS)))
        for r in all_riders:
            labels = editions[str(r["year"])]["round_labels"]
            for i, row in enumerate(r["rounds"]):
                f.write(
                    f'{r["year"]},{r["rider_id"]},"{r["name"]}",{i+1},"{labels[i]}",'
                    + ",".join(str(v) for v in row)
                    + "\n"
                )
    print(f"wrote {stem}-{tag}.json, {stem}-riders.csv, {stem}-scores.csv")


if __name__ == "__main__":
    main()
