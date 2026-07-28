# Velogames TdF 2026 — Full Field Deep Dive

Companion to `velogames-2026-postmortem-data.md`. Every rider, every stage, every scoring component.

## Data

Two CSVs in the repo root, scraped 2026-07-29 from `velogames.com/velogame/2026/riderprofile.php?rider=<id>` for all 184 riders:

**`velogames-2026-riders.csv`** — 184 rows
`rider_id, name, team, class, cost, selected_pct, total_points, overall_rank`

**`velogames-2026-scores.csv`** — 4,048 rows (184 riders x 22 rounds: stages 1-21 plus "Final Classifications")
`rider_id, name, round, round_label, stg, gc, pc, kom, spr, sum, bky, ass, tot`

| Column | Meaning |
|---|---|
| `stg` | Stage result (top 20 finishers) |
| `gc` | Daily general classification standing |
| `pc` | Daily points classification standing |
| `kom` | Daily mountains classification standing |
| `spr` | Intermediate sprints |
| `sum` | Mountain summits |
| `bky` | Breakaway participation |
| `ass` | Team assists (teammate stage wins, team classification) |
| `tot` | Row total |

**Validation (passed, zero exceptions):** every row's 8 components sum to `tot`; every rider's 22 `tot` values sum to the `total_points` on the public rider list. Scraped twice by independent paths (in-browser `fetch` and a standalone Python client) with identical results.

---

## 1. Where all 54,616 points in the game came from

| Component | Points | Share |
|---|---|---|
| Stage result | 29,500 | 54.0% |
| Daily GC | 9,070 | 16.6% |
| **Team assists** | **8,354** | **15.3%** |
| Breakaway | 2,340 | 4.3% |
| Intermediate sprints | 1,919 | 3.5% |
| Summits | 1,153 | 2.1% |
| Points classification | 1,140 | 2.1% |
| KOM classification | 1,140 | 2.1% |

Two things fall out immediately:

- **Team assists are the third-largest source of points in the entire game (15.3%).** The original post treated the assist model as a garnish on top of rider projections. It is not a garnish. It is bigger than breakaway, sprints, summits, points class and KOM class *combined* (14.1%).
- **The "Final Classifications" round is worth 6,470 points — 11.8% of the entire game in a single round**, about 4.4x an average stage. Velogames is endgame-weighted, and any model that treats stages as interchangeable draws is mis-shaped.

## 2. The assist model, graded

Total team-assist points earned by each pro team's riders across the tour:

| Pro team | Assist pts | Per rider | Post's model | Error |
|---|---|---|---|---|
| UAE Team Emirates - XRG | 2,542 | **318** | ~204 | −36% |
| Lidl - Trek | 1,830 | **229** | ~154 | −33% |
| Red Bull - BORA - hansgrohe | 1,048 | 131 | — | — |
| Team Visma \| Lease a Bike | 954 | **119** | ~108 | −9% |
| Decathlon CMA CGM Team | 448 | 56 | — | — |
| Netcompany INEOS | 352 | 44 | — | — |
| Alpecin-Premier Tech | 284 | 36 | — | — |
| EF Education - EasyPost | 228 | 28 | — | — |
| Uno-X Mobility | 208 | 26 | — | — |
| Soudal Quick-Step | 158 | 20 | — | — |
| Team Jayco AlUla | 96 | 12 | — | — |
| XDS Astana Team | 56 | 7 | — | — |
| NSN Cycling Team | 42 | 5 | — | — |
| Groupama - FDJ United | 40 | 5 | — | — |
| Bahrain - Victorious | 28 | 4 | — | — |
| Pinarello-Q36.5 | 26 | 3 | — | — |
| Movistar Team | 14 | 2 | — | — |
| TotalEnergies, Lotto Intermarché, Cofidis, Tudor, Picnic PostNL, Caja Rural | 0 | 0 | — | — |

Every team fielded exactly 8 riders, so per-rider is directly comparable.

**The model got the ranking exactly right — UAE > Lidl-Trek > Visma — and under-estimated all three magnitudes, worst on the teams that mattered most.** Six of 23 teams scored literally zero assist points. The distribution is brutally top-heavy: UAE and Lidl-Trek alone took 52% of all assist points in the game.

This is the strongest vindication in the dataset for the *structure* of the original approach. The whole argument for a QUBO was that team-assist correlations make the objective genuinely quadratic. The data says assists are 15.3% of all points and concentrated in two teams — exactly the regime where "which teammates you stack" is a real coupled decision rather than nine independent picks.

## 3. My nine: how each earned its points

| Rider | Total | Stage | GC | Points | KOM | Sprints | Summits | Bkwy | Assists |
|---|---|---|---|---|---|---|---|---|---|
| Remco Evenepoel | 2,697 | 1,532 | 936 | 21 | 62 | 0 | 56 | 0 | 90 |
| Mads Pedersen | 1,797 | 895 | 0 | 340 | 0 | 299 | 2 | 40 | 221 |
| Mattias Skjelmose | 1,611 | 865 | 495 | 0 | 0 | 12 | 8 | 0 | 231 |
| Juan Ayuso | 1,468 | 656 | 531 | 0 | 0 | 3 | 27 | 20 | 231 |
| Lenny Martinez | 1,449 | 779 | 556 | 0 | 58 | 0 | 56 | 0 | 0 |
| Jonas Vingegaard | 1,279 | 743 | 352 | 15 | 68 | 0 | 41 | 0 | 60 |
| Thomas Pidcock | 1,138 | 666 | 389 | 0 | 5 | 13 | 25 | 40 | 0 |
| Sean Quinn | 367 | 163 | 180 | 0 | 0 | 0 | 0 | 0 | 24 |
| Edoardo Affini | 118 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | **118** |

**Edoardo Affini scored zero points of his own for three weeks.** All 118 of his points are team-assist credit for riding on Vingegaard's team. He was a pure bet on Visma's team classification, and Visma delivered 119/rider — almost exactly what the model predicted (108). The pick worked as designed and was still the worst value in the squad at 29.5 pts/credit.

**The Lidl-Trek assist stack paid.** Ayuso and Skjelmose each collected 231 assist points, Pedersen 221 — 683 points, 5.7% of my total, purely from stacking one team. That was a deliberate quadratic play by the optimizer, and it was correct.

## 4. Race shape: I was ahead of the hindsight-optimal team until stage 12

Cumulative points. "Gap" is optimal minus mine; negative means I was **ahead**.

| Round | Mine | Optimal | Gap | Pogačar |
|---|---|---|---|---|
| Stage 1 | 225 | 140 | −85 | 30 |
| Stage 2 | 946 | 917 | −29 | 259 |
| Stage 3 | 1,539 | 1,626 | +87 | 529 |
| Stage 4 | 2,036 | 2,184 | +148 | 555 |
| Stage 5 | 2,280 | 2,406 | +126 | 574 |
| Stage 6 | 3,104 | 3,130 | +26 | 874 |
| Stage 7 | 3,346 | 3,339 | **−7** | 921 |
| Stage 8 | 3,552 | 3,514 | **−38** | 967 |
| Stage 9 | 4,138 | 4,088 | **−50** | 1,068 |
| Stage 10 | 4,971 | 4,940 | **−31** | 1,351 |
| Stage 11 | 5,186 | 5,137 | **−49** | 1,397 |
| Stage 12 | 5,444 | 5,375 | **−69** | 1,443 |
| Stage 13 | 5,804 | 5,944 | +140 | 1,489 |
| Stage 14 | 6,473 | 6,780 | +307 | 1,774 |
| Stage 15 | 7,222 | 7,874 | +652 | 2,029 |
| Stage 16 (ITT) | 7,773 | 8,682 | +909 | 2,252 |
| Stage 17 | 8,001 | 9,155 | +1,154 | 2,301 |
| Stage 18 | 8,459 | 10,068 | +1,609 | 2,385 |
| Stage 19 | 9,031 | 10,863 | +1,832 | 2,680 |
| Stage 20 | 9,704 | 11,884 | +2,180 | 2,880 |
| Stage 21 | 10,019 | 12,243 | +2,224 | 2,925 |
| **Final Classifications** | **11,924** | **14,783** | **+2,859** | 3,695 |

For six stages in the middle of the race my team was outscoring the team that a perfect oracle would have picked. That is not a paradox — the hindsight optimum maximizes the *final* total and is free to be behind at any intermediate point — but it is the single most useful chart in this dataset. It says the loss was not a bad squad. It was a squad whose riders stopped scoring in the third week.

**The gap opens at stage 13 and never closes.** Stages 13-21 plus the final classifications account for all 2,859 points of it.

Biggest single-round losses vs the optimum:

| Round | Mine | Optimal | Delta |
|---|---|---|---|
| Final Classifications | 1,905 | 2,540 | **−635** |
| Stage 18 | 458 | 913 | −455 |
| Stage 20 | 673 | 1,021 | −348 |
| Stage 15 | 749 | 1,094 | −345 |
| Stage 16 (ITT) | 551 | 808 | −257 |
| Stage 17 | 228 | 473 | −245 |

Biggest gains: Stage 6 (+100), Stage 1 TTT (+85, the Visma pair), Stage 7 (+33), Stage 8 (+31).

## 5. The picks were right. The budget allocation was wrong.

Swap each of my riders for the best available alternative at the **same cost and same class**:

| My pick | Scored | Best same-cost, same-class alternative | Scored | Delta |
|---|---|---|---|---|
| Mattias Skjelmose (10cr AR) | 1,611 | Matteo Jorgenson | 373 | **−1,238** |
| Mads Pedersen (10cr SP) | 1,797 | Olav Kooij | 1,123 | −674 |
| Thomas Pidcock (10cr UN) | 1,138 | Mathieu Van Der Poel | 630 | −508 |
| Lenny Martinez (10cr CL) | 1,449 | Tobias Halland Johannessen | 1,268 | −181 |
| Sean Quinn (4cr UN) | 367 | Huub Artz | 555 | +188 |
| Edoardo Affini (4cr UN) | 118 | Huub Artz | 555 | **+437** |

Vingegaard (24cr), Evenepoel (16cr) and Ayuso (12cr) have no same-cost, same-class alternative — those price points are unique or near-unique in the field.

**In four of the six slots where a genuine same-price choice existed, the optimizer picked the single best rider available.** The only improvable picks were the two 4-credit Unclassed filler slots, worth +625 combined.

So the 19.3% gap vs the hindsight optimum is almost entirely a **bracket-allocation** error, not a rider-selection error. Specifically: spending 24 credits on Vingegaard instead of buying into the 14/16/18-credit tier (Del Toro, Seixas) and the 8-credit tier (Carapaz). The model chose the right riders and the wrong shape of team.

## 6. Velogames pricing is only ~64% informative

- Pearson r (cost, final points) across 184 riders: **0.801**
- Pearson r (ownership %, final points): **0.797**

Price explains about 64% of the variance in points (r² = 0.64). The crowd's ownership is essentially as predictive as the price — r = 0.797 vs 0.801 — which means the field collectively adds almost no information beyond reading the price list. The remaining 36% is where any edge lives, and the price-bracket table in the postmortem file shows where it concentrates: the 10-credit bracket, which returns 104.7 mean pts/credit against 18.1 at 4 credits.

## 7. Specialist leaderboards

**Stage results (the 54% component):**

| Pts | Rider | Cost | % of his total |
|---|---|---|---|
| 1,865 | Tadej Pogačar | 34 | 50% |
| 1,532 | Remco Evenepoel | 16 | 57% |
| 1,256 | Isaac Del Toro | 14 | 51% |
| 1,105 | Paul Seixas | 18 | 58% |
| 1,100 | Jasper Philipsen | 12 | 73% |
| 1,020 | Olav Kooij | 10 | **91%** |
| 960 | Richard Carapaz | 8 | 54% |
| 895 | Mads Pedersen | 10 | 50% |

**Intermediate sprints:** Pedersen 299 (17% of his total), Philipsen 180, Girmay 151, Kanter 114, Veistroffer 80 (**57% of his total**), Planckaert 53 (56%).

**KOM classification:** Pogačar 281, Carapaz 210, Valentin Paret-Peintre 157 (**34% of his total**), Vingegaard 68, Kuss 68.

**Summits:** Carapaz 200 (11%), Pogačar 132, V. Paret-Peintre 99 (21%), Kuss 80, Evenepoel 56, Martinez 56.

**Breakaway:** capped low and spread wide — Tobias Halland Johannessen and Alex Baudin lead on 80, then a cluster on 60 (Carapaz, Simmons, Schmid, García Pierna, Bernal, Castrillo). Baudin got 22% of his total from breakaways; García Pierna 14%; Castrillo 18%.

The pattern: **cheap riders live on the marginal components.** Veistroffer got 57% of his points from intermediate sprints, Paret-Peintre 34% from KOM. Expensive riders live on stage results and GC. If you want value below 8 credits, you are betting on sprints, KOM and breakaways — the 12% of the points pool that the expensive riders mostly ignore.

## 8. Attrition and the final-round cliff

- **13 riders scored zero points across the entire tour** (De Lie, De Kleijn, B. Thomas, Biesterbos, Degenkolb, Parra, Van Den Berg, O'Brien, Trentin, Märkl, Allegaert, Dhondt, Berwick).
- **64 of 184 riders (35%) scored their last point on or before stage 15.** This is a proxy — it cannot distinguish an abandon from a rider who finished in total anonymity — but a third of the field was fantasy-dead with a week to go.
- **130 of 184 riders (71%) scored zero final-classification points.** Only 54 riders scored anything in the round worth 11.8% of the game; mean 120 points among those who did.

Final-round dependence at the top:

| Final-round pts | % of his total | Rider |
|---|---|---|
| 770 | 20.8% | Tadej Pogačar |
| 585 | 21.7% | Remco Evenepoel |
| 470 | 19.1% | Isaac Del Toro |
| 385 | 20.1% | Paul Seixas |
| 330 | 22.8% | Lenny Martinez |
| 320 | 18.0% | Richard Carapaz |
| 310 | 19.2% | Mattias Skjelmose |
| 270 | 18.4% | Juan Ayuso |

Roughly **a fifth of every good rider's score arrives in one lump at the end.** Combined with the 35% attrition rate, this is the mathematical case for the Replacements contest: the Main contest asks you to pick, on 4 July, nine riders who will still be racing and still be classified on 26 July.

## 9. What this changes for the follow-up post

1. **Lead with the assist finding.** 15.3% of all points, ranking predicted correctly, magnitudes under-estimated by a third on the two teams that mattered. This is the quadratic-coupling argument surviving contact with reality, and it is a better story than the Pogačar coin-flip.
2. **The "ahead until stage 12" chart is the spine of the piece.** It reframes the 19.3% gap from "bad model" to "right riders, wrong tier allocation, third-week collapse."
3. **The counterfactual table kills the obvious objection.** Four of six contestable slots took the literal best rider at that price and class. Nobody can say the optimizer picked badly; it allocated badly.
4. **r = 0.801 for price, r = 0.797 for the crowd.** The field, in aggregate, knows nothing the price list doesn't. That is a clean, quotable justification for optimizing at all.
5. **The Vingegaard slot is the whole loss.** 24 credits, 1,279 points, 53.3 pts/credit — against Del Toro at 14cr/2,464 and Carapaz at 8cr/1,777 in the same money. Trace what the model believed about him and why.
6. **Cheap riders live on sprints, KOM and breakaways.** A concrete, testable strategy note for next year that falls straight out of the component table.
