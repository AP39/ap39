"""Re-solve and verify the hindsight-optimal squad for every edition.

Solves each edition twice from the raw rider data, a PuLP/CBC integer program and
an independent per-class knapsack DP, and checks both against the value stored in
the raw JSON. Exits non-zero if any of the three disagree.

    python velogames/scripts/optimal.py
"""

import json
import os
import sys
from collections import defaultdict
from itertools import product

import pulp

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
RAW = os.path.join(ROOT, "raw")
FILES = ["tdf-2023-2026.json", "giro-2023-2026.json", "vuelta-2023-2025.json"]

SQUAD = 9
BUDGET = 100
# minimum per class; the 9th slot is the free wildcard
QUOTA = {"All Rounder": 2, "Climber": 2, "Sprinter": 1, "Unclassed": 3}
CLASSES = list(QUOTA)


def solve_ilp(riders):
    prob = pulp.LpProblem("velogames", pulp.LpMaximize)
    x = {r["rider_id"]: pulp.LpVariable(r["rider_id"], cat="Binary") for r in riders}
    prob += pulp.lpSum(x[r["rider_id"]] * r["total_points"] for r in riders)
    prob += pulp.lpSum(x.values()) == SQUAD
    prob += pulp.lpSum(x[r["rider_id"]] * r["cost"] for r in riders) <= BUDGET
    for cls, lo in QUOTA.items():
        prob += pulp.lpSum(x[r["rider_id"]] for r in riders if r["class"] == cls) >= lo
    prob.solve(pulp.PULP_CBC_CMD(msg=0))
    assert pulp.LpStatus[prob.status] == "Optimal"
    return [r for r in riders if x[r["rider_id"]].value() > 0.5]


def knapsack(pool, k, budget):
    """best[(n, cost)] -> (points, [riders]) for a single class pool."""
    best = {(0, 0): (0, [])}
    for r in pool:
        for (n, c), (p, sel) in list(best.items()):
            if n + 1 > k or c + r["cost"] > budget:
                continue
            key = (n + 1, c + r["cost"])
            cand = (p + r["total_points"], sel + [r])
            if key not in best or cand[0] > best[key][0]:
                best[key] = cand
    return best


def solve_dp(riders):
    """Independent check: per-class knapsack tables, then combine."""
    pools = defaultdict(list)
    for r in riders:
        pools[r["class"]].append(r)
    # each class may take its quota plus at most the one wildcard slot
    tables = {c: knapsack(pools[c], QUOTA[c] + 1, BUDGET) for c in CLASSES}
    counts = [
        combo
        for combo in product(*[[QUOTA[c], QUOTA[c] + 1] for c in CLASSES])
        if sum(combo) == SQUAD
    ]
    best = (-1, None)
    for combo in counts:
        opts = [
            [(c, p, sel) for (n, c), (p, sel) in tables[cls].items() if n == want]
            for cls, want in zip(CLASSES, combo)
        ]
        for pick in product(*opts):
            if sum(p[0] for p in pick) > BUDGET:
                continue
            pts = sum(p[1] for p in pick)
            if pts > best[0]:
                best = (pts, [r for p in pick for r in p[2]])
    return best[1]


def main():
    sys.stdout.reconfigure(encoding="utf-8")
    failures = 0
    for fname in FILES:
        with open(os.path.join(RAW, fname), encoding="utf-8") as f:
            doc = json.load(f)
        by_year = defaultdict(list)
        for r in doc["riders"]:
            by_year[r["year"]].append(r)
        race = fname.split("-")[0]
        for year in sorted(by_year):
            riders = by_year[year]
            team = solve_ilp(riders)
            ilp = sum(r["total_points"] for r in team)
            dp = sum(r["total_points"] for r in solve_dp(riders))
            stored = doc["editions"][str(year)]["hindsight_optimum"]["points"]
            ok = ilp == dp == stored
            failures += not ok
            print(
                f"{race:7} {year}  ILP {ilp:6,}  DP {dp:6,}  stored {stored:6,}  "
                f"credits {sum(r['cost'] for r in team):3}  {'OK' if ok else 'MISMATCH'}"
            )
    print("\nall three agree on every edition" if not failures else f"\n{failures} MISMATCHES")
    sys.exit(1 if failures else 0)


if __name__ == "__main__":
    main()
