# Velogames Fantasy Cycling dataset

Every rider, every round, every point from the Velogames fantasy game across all
three Grand Tours, 2023 onwards. 1,976 rider-editions, 43,472 rider-rounds, 11
race editions, plus the perfect-hindsight optimal squad for each one.

| Race | Editions | Riders | Slug |
|---|---|---|---|
| Tour de France | 2023, 2024, 2025, 2026 | 720 | `tdf` |
| Giro d'Italia | 2023, 2024, 2025, 2026 | 720 | `giro` |
| Vuelta a España | 2023, 2024, 2025 | 536 | `vuelta` |

Velogames has purged rider data for every edition before 2023, so that is the
floor. The 2026 Vuelta had not been run when this was scraped.

## Search it

```
python velogames/scripts/query.py editions
python velogames/scripts/query.py rider vingegaard
python velogames/scripts/query.py rider "del toro" --rounds
python velogames/scripts/query.py top --race giro --year 2025 --class Climber -n 10
python velogames/scripts/query.py value --max-cost 8 --min-points 500
python velogames/scripts/query.py optimum --race vuelta
python velogames/scripts/query.py stages --type mountain --year 2026
python velogames/scripts/query.py schema
```

Anything the subcommands miss, use SQL:

```
python velogames/scripts/query.py sql "
  SELECT race, rider_class, round(1.0*sum(total_points)/sum(cost),1) ppc
  FROM riders GROUP BY 1,2 ORDER BY 1,3 DESC"
```

`sql` is read-only; the statement must start with `SELECT` or `WITH`.

## Layout

```
velogames/
  data/      the searchable layer, all races in one place
    velogames.db      SQLite, 5 tables, indexed. Not committed; query.py
                      builds it on first run, takes about a second.
    editions.csv      11 rows,     one per race edition
    riders.csv        1,976 rows,  one per rider per edition
    scores.csv        43,472 rows, one per rider per round
    stages.csv        231 rows,    one per stage
    optimal_teams.csv 99 rows,     the hindsight-optimal squads, 9 riders each
  raw/       source of truth, one self-describing JSON per race
    tdf-2023-2026.json  giro-2023-2026.json  vuelta-2023-2025.json
  docs/      the written analysis
  scripts/   scrape.py, build.py, optimal.py, query.py
```

`data/` is fully derived from `raw/`. Rebuild it any time with
`python velogames/scripts/build.py`.

## Tables

**editions** — `race, race_name, year, riders, pro_teams, field_points, max_cost,
rounds, winning_score, top5, optimum_points, optimum_credits, winner_gap_pct`

**riders** — `race, year, rider_id, name, pro_team, rider_class, cost,
selected_pct, total_points, pts_per_credit, overall_rank`

**scores** — `race, year, rider_id, name, round, round_label,` then the eight
scoring components and the row total:

| Column | Points from |
|---|---|
| `stg` | stage result, top 20 finishers |
| `gc` | daily general classification standing |
| `pc` | daily points classification standing |
| `kom` | daily mountains classification standing |
| `spr` | intermediate sprints |
| `smt` | mountain summits (called `sum` in the raw JSON, renamed for SQL) |
| `bky` | breakaway participation |
| `ass` | team assists |
| `tot` | row total, authoritative |

Rounds 1-21 are the stages. Round 22 is a final round labelled
"Final Classifications" that pays out the end-of-race jerseys.

**stages** — `race, year, round, label, type, stage_points, round_points,` and
the share of that stage's result points taken by each rider class. Round 22 is
not a stage and is excluded.

**optimal_teams** — `race, year, slot, name, rider_class, pro_team, cost, points,
pts_per_credit`. Nine rows per edition.

## Game rules

Identical in all three games, confirmed from each edition's own rules page:
9 riders, 100 credits, at least 2 All Rounders, 2 Climbers, 1 Sprinter and
3 Unclassed, plus one wildcard slot from any class.

Recent editions also run a separate Replacements contest (transfers across three
windows). No data here covers it.

## The optimal squads

`optimal_teams` holds the exact hindsight optimum for each edition: the
highest-scoring legal 9-rider squad given the final published points. Solved two
independent ways, a PuLP/CBC integer program and a per-class knapsack DP, with
identical answers for all 11 editions.

These are not pickable in advance. They are the ceiling the field is measured
against, and `editions.winner_gap_pct` is how far the best real entrant fell
short: 4.4% to 18.3%, never closer.

Re-verify all 11 from scratch, both solvers against the stored value:

```
python velogames/scripts/optimal.py
```

## Data quality

- Every rider's round totals sum to their published season total. 1,976 of 1,976.
- 118 component rows of 43,472 (0.27%) do not sum to their own row total. This is
  Velogames' own published data, reproduced identically by two independent
  scrapers, and it is concentrated in the Final Classifications round. The row
  total (`tot`) and the season total are authoritative; the eight-way split is
  not, for those rows.
- Vuelta 2025 stages 11 and 21 awarded no stage points. Those are the
  protest-disrupted stages, typed `no_result`.
- `stage_type` is empirical, not official. `ITT` and `TTT` come from Velogames'
  own stage labels. Everything else is classified from outcomes: `sprint` means
  sprinters took at least 40% of the stage-result points, `mountain` means
  climbers plus all-rounders took at least 65%, otherwise `mixed`. It describes
  who scored, not the parcours profile.
- `winning_score` is the top score on the public Classic leaderboard, which shows
  roughly the top 300 teams only.

## Rescraping

```
python velogames/scripts/scrape.py italy 2023 2024 2025 2026    # Giro
python velogames/scripts/scrape.py spain 2023 2024 2025         # Vuelta
python velogames/scripts/scrape.py velogame 2023 2024 2025 2026 # Tour
python velogames/scripts/build.py                               # rebuild data/
```

`italy`, `spain` and `velogame` are Velogames' own URL slugs. The scraper writes
to the working directory, so run it from `velogames/raw/`. It validates as it
goes and prints the reconciliation counts per edition.

Source: `https://www.velogames.com/<slug>/<year>/` — riders.php, riderprofile.php,
teamscore.php, rules.php.

## Docs

| File | What |
|---|---|
| `docs/how-to-win.md` | The strategy post. Why the three Unclassed slots decide the game. |
| `docs/multiyear-analysis.md` | Four editions of Tour data, cross-cut. |
| `docs/optimal-teams-all-races.md` | All 11 optimal squads, all three races. |
| `docs/optimal-teams-tdf.md` | The four Tour squads, with pick rates and field ranks. |
| `docs/tdf-2026-deep-dive.md` | 2026 Tour, in detail. |
| `docs/tdf-2026-postmortem-data.md` | 2026 Tour, the numbers behind the wrap-up post. |
