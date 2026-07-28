# Velogames Tour de France, 2023-2026 — Four-Edition Analysis

Material for the strategy post. This is where single-edition observations either become advice or get thrown out.

## Data

Scraped 2026-07-29 from `velogames.com/velogame/<year>/`, same schema for every edition:

| File | Rows |
|---|---|
| `velogames-all-riders.csv` | 720 (4 editions) |
| `velogames-all-scores.csv` | 15,840 (rider x round x 8 components) |
| `velogames-<year>-riders.csv`, `velogames-<year>-scores.csv` | per-edition splits |

**Validation:** every rider's 22 round totals sum to their published season total, in all four editions, zero exceptions (720/720).

**One documented data flaw, not mine:** in 2024 and 2025, 46 rows out of 15,840 (0.29%) have component columns that don't sum to their own row total — 40 of them in the "Final Classifications" round. Net discrepancy −25 pts (2024) and −495 pts (2025). Examples: 2025 Roglič's final row lists 200 GC + 30 assists = 230 against a stated total of 245; 2025 Meurisse shows all dashes against a stated total of 45; 2024 Vingegaard's components sum to 625 against a stated 620. **Round totals and season totals are authoritative; the component split for those 46 rows is not.** 2023 and 2026 are internally perfect. Any component-level claim below carries a ≤0.9% uncertainty in the two affected editions.

---

## 1. The headline: "don't buy the most expensive rider" is a coin flip, every single year

I ran the hindsight-optimal ILP (perfect knowledge of final scores) on all four editions, then re-ran it forcing the field's most expensive rider into the team.

| Year | Most expensive rider | Cost | His points | His pts/cr | In the optimum? | Cost of buying him |
|---|---|---|---|---|---|---|
| 2023 | Jonas Vingegaard | 26 | 2,946 | 113.3 | **No** | 33 pts (0.25%) |
| 2024 | Tadej Pogačar | 28 | 3,841 | 137.2 | **Yes** | 0 |
| 2025 | Tadej Pogačar | 32 | 4,153 | 129.8 | **Yes** | 0 |
| 2026 | Tadej Pogačar | 34 | 3,695 | 108.7 | **No** | 84 pts (0.57%) |

Hindsight-optimal totals: 13,444 (2023), 14,768 (2024), 14,216 (2025), 14,783 (2026).

**In two of four editions the most expensive rider belongs in the perfect team, and in the other two, leaving him out is worth 0.25% and 0.57%.** The decision is nearly free in every direction, every year. Velogames prices the marquee rider almost exactly right — his points-per-credit ranked 10th, 8th, 7th and 19th out of ~180 riders, which is to say consistently good but never the best value on the board.

This substantially deflates the original post's punchline. "The quantum computer says don't buy Pogačar" was not a bold contrarian call — it was picking a side in a decision that has been within 0.6% of a tie for four straight years. The honest version: **the marquee rider is the single most correctly-priced asset in the game, and agonising over him is wasted effort.** The 2026 model got the right side of a coin flip; it did not find an edge.

Hindsight-optimal squads, for reference:

- **2023:** Pogačar, Adam Yates, Simon Yates, Felix Gall, Pello Bilbao, Jasper Philipsen, Thomas Pidcock, Matej Mohorič, Tiesj Benoot
- **2024:** Pogačar, Evenepoel, João Almeida, Mikel Landa, Richard Carapaz, Biniam Girmay, Derek Gee, Anthony Turgis, Jonas Abrahamsen
- **2025:** Pogačar, Vingegaard, Ben Healy, Oscar Onley, Kévin Vauquelin, Biniam Girmay, Jordan Jegat, Tim Wellens, Pascal Eenkhoorn
- **2026:** Evenepoel, Del Toro, Seixas, Pedersen, Carapaz, Skjelmose, Pidcock, Simmons, Schmid

## 2. Correction: the "10-credit sweet spot" was a 2026 artifact

Mean points-per-credit by price bracket:

| Cost | 2023 | 2024 | 2025 | 2026 |
|---|---|---|---|---|
| 4 | 13.1 | 23.8 | 12.9 | 18.1 |
| 6 | 31.4 | 24.7 | 30.3 | 29.7 |
| 8 | 60.0 | 59.9 | 67.0 | 44.7 |
| 10 | 67.0 | 42.2 | 70.7 | **104.7** |
| 12 | 46.3 | 66.8 | 81.3 | 99.7 |
| 14 | 62.5 | 78.8 | 82.6 | 176.0 |
| 16 | 92.7 | 92.6 | 21.8 | 168.6 |
| 18 | 80.2 | 145.5 | 50.0 | 106.6 |
| 20 | — | 30.4 | — | — |
| 24 | 124.1 | 112.6 | 133.3 | 53.3 |
| 26 | 113.3 | — | — | — |
| 28 | — | 137.2 | — | — |
| 32 | — | — | 129.8 | — |
| 34 | — | — | — | 108.7 |

I called the 10cr bracket a sweet spot off the 2026 data alone. Four editions say no — 10cr returns 67.0, 42.2, 70.7, 104.7. It's noise. The brackets above 12 credits hold single riders in most years, so those cells are one rider's season, not a population.

**What does survive all four editions:** the two cheapest brackets are consistently terrible value. 4cr returns 13-24 pts/credit and 6cr returns 25-31, against 44-104 at 8-10cr and 112-137 at the top. The durable rule is monotone and boring — *points per credit rises with price*, which is the exact opposite of the "hunt for cheap value" folk wisdom. Cheap riders are cheap because they don't score.

The practical form: your budget floor matters more than your ceiling. Every 4-credit filler slot you're forced into is a slot returning a sixth of what the top bracket returns.

## 3. Price is ~64% informative and the crowd knows slightly less

| Year | r(cost, points) | r(ownership %, points) | r² for price |
|---|---|---|---|
| 2023 | 0.775 | 0.680 | 0.601 |
| 2024 | 0.811 | 0.700 | 0.657 |
| 2025 | 0.818 | 0.774 | 0.669 |
| 2026 | 0.801 | 0.797 | 0.642 |

Price explains 60-67% of the variance in final points, remarkably stable across editions. Ownership tracks it but has been **consistently the weaker predictor in all four years** — the crowd adds nothing to the price list and in three of four editions actively knows less. The gap has narrowed each year (0.095 → 0.111 → 0.044 → 0.004), which is either the field getting sharper or noise.

Roughly a third of the outcome is unexplained by price. That residual is the entire game.

## 4. Scoring structure is stable enough to build a strategy on

Share of each edition's points by component:

| Component | 2023 | 2024 | 2025 | 2026 |
|---|---|---|---|---|
| Stage result | 56.7% | 57.5% | 58.6% | 54.0% |
| Daily GC | 17.0% | 17.2% | 17.0% | 16.6% |
| **Team assists** | **12.9%** | **11.9%** | **12.2%** | **15.3%** |
| Breakaway | 4.1% | 4.4% | 3.0% | 4.3% |
| Int. sprints | 2.8% | 2.7% | 2.8% | 3.5% |
| Summits | 2.1% | 1.9% | 2.0% | 2.1% |
| Points class | 2.1% | 2.2% | 2.2% | 2.1% |
| KOM class | 2.1% | 2.2% | 2.1% | 2.1% |

Three quarters of the game is stage results plus daily GC, every year, within a couple of points. **Team assists are the third pillar in all four editions (11.9-15.3%)** — this was not a 2026 quirk, and 2026 was the highest of the four.

The final-classification round is worth 11.7-12.2% of the edition every year, in a single round, and only 54-60 riders out of ~180 score anything in it. That is the most concentrated, most predictable payout in the game.

## 5. Team assists are always top-heavy, and always in a different place

| Year | Assist pool | Top-2 teams' share | Teams scoring zero | Leader |
|---|---|---|---|---|
| 2023 | 7,064 | 55% | 3/22 | Jumbo-Visma, 286/rider |
| 2024 | 6,388 | 59% | 3/22 | UAE, 324/rider |
| 2025 | 6,470 | 60% | 4/23 | Visma, 261/rider |
| 2026 | 8,354 | 52% | 6/23 | UAE, 318/rider |

Two teams take 52-60% of all assist points, every year, and 3-6 teams take literally none. The leader alternates between UAE and Visma in three of four editions; 2026's runner-up (Lidl-Trek, 229/rider) is the first time a third team broke into the top two in this sample.

**Strategy implication:** picking the winning team's domestiques is worth roughly 250-320 points per rider, and picking the wrong team's is worth zero. This is a large, repeatable, quadratic effect — your rider choices are not independent, and the assist structure is the reason. It is also the single strongest argument that this problem deserves an optimizer rather than a ranked shortlist.

## 6. A third of the field is dead by stage 15, every year

| Year | Zero points all tour | Last points on/before stage 15 | No final-classification points |
|---|---|---|---|
| 2023 | 8 (4.5%) | 53 (30.1%) | 121 (68.8%) |
| 2024 | 6 (3.4%) | 47 (26.7%) | 122 (69.3%) |
| 2025 | 6 (3.3%) | 52 (28.3%) | 124 (67.4%) |
| 2026 | 13 (7.1%) | 64 (34.8%) | 130 (70.7%) |

("Last points on/before stage 15" is a proxy — it cannot distinguish an abandon from a rider who finished anonymously.)

Stable base rates: **~3-7% of the field scores nothing at all, ~27-35% is fantasy-dead entering week three, and ~68-71% scores nothing in the round worth 12% of the game.** 2026 was the worst edition on all three counts.

This is the quantitative case for the Replacements contest and against treating the Main contest as a pure static knapsack: you are picking on 4 July, and a third of your candidate pool will be irrelevant by 21 July.

---

## 7. What the strategy post can actually claim

Ranked by how well the evidence holds across four editions.

**Strong (holds all four years):**
1. Cheap riders are bad value, monotonically. The 4cr and 6cr brackets return a fraction of what 8cr+ returns, every single edition. Minimise forced filler slots.
2. Team assists are 12-15% of the game and 52-60% of them go to two teams. Stack the right team's domestiques; this is where correlated picks pay.
3. Price explains ~64% of outcome and ownership explains less. The crowd is not information.
4. ~30% of the field is dead by stage 15 and ~69% score nothing in the final round.
5. Stage results + daily GC = ~74% of all points, every year. Everything else is rounding.

**Weak (2026-only, do not generalise):**
6. The "10-credit sweet spot" — noise across four editions.

**The counter-intuitive lead:** the most expensive rider is the most correctly-priced asset in the game. Four editions, and the decision to buy him or not was worth between 0% and 0.57%. Everyone argues about him; the argument is worthless. The money is in the 8-14 credit band and in the assist structure.

## 8. What's still missing

- **Leaderboard context for 2023-2025.** The 2026 winner scored 14,030 against a hindsight optimum of 14,783. The archived `teamscore.php` pages for older editions didn't yield a winning score to the same parse; worth one manual pass if the post wants "how close did the best human get" as a four-year series.
- **Stage profile data.** I have when points were scored but not what kind of stage it was. Joining a stage-type table (flat/hill/mountain/ITT) would let the post say which rider archetypes pay on which parcours — the natural next question after the component analysis.
- **The Replacements contest.** Introduced recently and scored on a separate leaderboard; none of the above touches it.
