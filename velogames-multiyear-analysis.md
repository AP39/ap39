# Velogames Tour de France, 2023-2026, Four-Edition Analysis

Material for the strategy post. This is where single-edition observations either become advice or get thrown out.

## Data

Scraped 2026-07-29 from `velogames.com/velogame/<year>/`, same schema for every edition:

| File | Rows |
|---|---|
| `velogames-all-riders.csv` | 720 (4 editions) |
| `velogames-all-scores.csv` | 15,840 (rider x round x 8 components) |
| `velogames-all-stages.csv` | 84 (every stage, classified by type) |
| `velogames-<year>-riders.csv`, `velogames-<year>-scores.csv` | per-edition splits |

**Validation:** every rider's 22 round totals sum to their published season total, in all four editions, zero exceptions (720/720).

**One documented data flaw, not mine:** in 2024 and 2025, 46 rows out of 15,840 (0.29%) have component columns that don't sum to their own row total, 40 of them in the "Final Classifications" round. Net discrepancy −25 pts (2024) and −495 pts (2025). Examples: 2025 Roglič's final row lists 200 GC + 30 assists = 230 against a stated total of 245; 2025 Meurisse shows all dashes against a stated total of 45; 2024 Vingegaard's components sum to 625 against a stated 620. **Round totals and season totals are authoritative; the component split for those 46 rows is not.** 2023 and 2026 are internally perfect. Any component-level claim below carries a ≤0.9% uncertainty in the two affected editions.

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

**In two of four editions the most expensive rider belongs in the perfect team, and in the other two, leaving him out is worth 0.25% and 0.57%.** The decision is nearly free in every direction, every year. Velogames prices the marquee rider almost exactly right, his points-per-credit ranked 10th, 8th, 7th and 19th out of ~180 riders, which is to say consistently good but never the best value on the board.

This substantially deflates the original post's punchline. "The quantum computer says don't buy Pogačar" was not a bold contrarian call, it was picking a side in a decision that has been within 0.6% of a tie for four straight years. The honest version: **the marquee rider is the single most correctly-priced asset in the game, and agonising over him is wasted effort.** The 2026 model got the right side of a coin flip; it did not find an edge.

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
| 20 | | 30.4 | | |
| 24 | 124.1 | 112.6 | 133.3 | 53.3 |
| 26 | 113.3 | | | |
| 28 | | 137.2 | | |
| 32 | | | 129.8 | |
| 34 | | | | 108.7 |

I called the 10cr bracket a sweet spot off the 2026 data alone. Four editions say no, 10cr returns 67.0, 42.2, 70.7, 104.7. It's noise. The brackets above 12 credits hold single riders in most years, so those cells are one rider's season, not a population.

**What does survive all four editions:** the two cheapest brackets are consistently terrible value. 4cr returns 13-24 pts/credit and 6cr returns 25-31, against 44-104 at 8-10cr and 112-137 at the top. The durable rule is monotone and boring, *points per credit rises with price*, which is the exact opposite of the "hunt for cheap value" folk wisdom. Cheap riders are cheap because they don't score.

The practical form: your budget floor matters more than your ceiling. Every 4-credit filler slot you're forced into is a slot returning a sixth of what the top bracket returns.

## 3. Price is ~64% informative and the crowd knows slightly less

| Year | r(cost, points) | r(ownership %, points) | r² for price |
|---|---|---|---|
| 2023 | 0.775 | 0.680 | 0.601 |
| 2024 | 0.811 | 0.700 | 0.657 |
| 2025 | 0.818 | 0.774 | 0.669 |
| 2026 | 0.801 | 0.797 | 0.642 |

Price explains 60-67% of the variance in final points, remarkably stable across editions. Ownership tracks it but has been **consistently the weaker predictor in all four years**, the crowd adds nothing to the price list and in three of four editions actively knows less. The gap has narrowed each year (0.095 → 0.111 → 0.044 → 0.004), which is either the field getting sharper or noise.

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

Three quarters of the game is stage results plus daily GC, every year, within a couple of points. **Team assists are the third pillar in all four editions (11.9-15.3%)**, this was not a 2026 quirk, and 2026 was the highest of the four.

The final-classification round is worth 11.7-12.2% of the edition every year, in a single round, and only 54-60 riders out of ~180 score anything in it. That is the most concentrated, most predictable payout in the game.

## 5. Team assists are always top-heavy, and always in a different place

| Year | Assist pool | Top-2 teams' share | Teams scoring zero | Leader |
|---|---|---|---|---|
| 2023 | 7,064 | 55% | 3/22 | Jumbo-Visma, 286/rider |
| 2024 | 6,388 | 59% | 3/22 | UAE, 324/rider |
| 2025 | 6,470 | 60% | 4/23 | Visma, 261/rider |
| 2026 | 8,354 | 52% | 6/23 | UAE, 318/rider |

Two teams take 52-60% of all assist points, every year, and 3-6 teams take literally none. The leader alternates between UAE and Visma in three of four editions; 2026's runner-up (Lidl-Trek, 229/rider) is the first time a third team broke into the top two in this sample.

**Strategy implication:** picking the winning team's domestiques is worth roughly 250-320 points per rider, and picking the wrong team's is worth zero. This is a large, repeatable, quadratic effect, your rider choices are not independent, and the assist structure is the reason. It is also the single strongest argument that this problem deserves an optimizer rather than a ranked shortlist.

## 6. A third of the field is dead by stage 15, every year

| Year | Zero points all tour | Last points on/before stage 15 | No final-classification points |
|---|---|---|---|
| 2023 | 8 (4.5%) | 53 (30.1%) | 121 (68.8%) |
| 2024 | 6 (3.4%) | 47 (26.7%) | 122 (69.3%) |
| 2025 | 6 (3.3%) | 52 (28.3%) | 124 (67.4%) |
| 2026 | 13 (7.1%) | 64 (34.8%) | 130 (70.7%) |

("Last points on/before stage 15" is a proxy, it cannot distinguish an abandon from a rider who finished anonymously.)

Stable base rates: **~3-7% of the field scores nothing at all, ~27-35% is fantasy-dead entering week three, and ~68-71% scores nothing in the round worth 12% of the game.** 2026 was the worst edition on all three counts.

This is the quantitative case for the Replacements contest and against treating the Main contest as a pure static knapsack: you are picking on 4 July, and a third of your candidate pool will be irrelevant by 21 July.

---

## 7. The best human in the world gets within 4-14% of perfect

Winning score on the public Classic leaderboard against the hindsight-optimal ILP:

| Year | Winner | Hindsight optimum | Gap | Gap % | Top 5 spread |
|---|---|---|---|---|---|
| 2023 | 12,231 | 13,444 | 1,213 | 9.0% | 12,231 / 12,193 / 12,165 / 12,094 / 12,052 |
| 2024 | 12,684 | 14,768 | 2,084 | 14.1% | 12,684 / 12,557 / 12,394 / 11,960 / 11,938 |
| 2025 | 13,585 | 14,216 | 631 | 4.4% | 13,585 / 13,548 / 13,336 / 13,322 / 13,282 |
| 2026 | 14,030 | 14,783 | 753 | 5.1% | 14,030 / 13,651 / 13,548 / 13,476 / 13,418 |

Out of a field of many thousands, the single best team of the year lands 4.4-14.1% short of the perfect squad. Nobody has ever found the optimum, and nobody has come within 4%.

Useful calibration for the wrap-up post: my 11,924 was 15.0% off the 2026 winner and 19.3% off the optimum. **The distance from "won the whole game" to "perfect" (5.1%) is a quarter of the distance from my team to the winner (15.0%).** The top 5 cluster inside ~1.5% of each other in three of four editions, the leaderboard is dense at the top, so small edges move you a long way.

## 8. Stage types: which archetypes actually pay where

`velogames-all-stages.csv` classifies all 84 stages. ITT/TTT come from Velogames' own stage labels; the rest are classified empirically by which rider class took the stage-result points (sprint = sprinters took ≥40%; mountain = climbers + all-rounders took ≥65%; otherwise mixed). This is derived from outcomes, not from published parcours profiles, a stage where the sprinters got shelled reads as "mountain" here regardless of its official profile.

| Year | sprint | mountain | mixed | ITT | TTT |
|---|---|---|---|---|---|
| 2023 | 7 | 7 | 6 | 1 | 0 |
| 2024 | 8 | 6 | 5 | 2 | 0 |
| 2025 | 5 | 9 | 5 | 2 | 0 |
| 2026 | 7 | 9 | 3 | 1 | 1 |

Where the points sit, pooled across four editions:

| Type | Total pts | Stages | Pts/stage | Share |
|---|---|---|---|---|
| mountain | 75,594 | 31 | 2,439 | 39.6% |
| sprint | 59,367 | 27 | 2,199 | 31.1% |
| mixed | 43,543 | 19 | 2,292 | 22.8% |
| ITT | 10,638 | 6 | 1,773 | 5.6% |
| TTT | 1,590 | 1 | 1,590 | 0.8% |

**Mean points per credit, by class and stage type (pooled):**

| Stage type | All Rounder | Climber | Sprinter | Unclassed |
|---|---|---|---|---|
| sprint | 1.04 | 0.76 | **6.73** | 0.95 |
| mixed | 2.14 | 2.19 | 1.35 | 1.86 |
| mountain | **5.01** | 4.43 | 0.44 | 0.75 |
| ITT | **5.13** | 1.60 | 0.34 | 0.60 |
| TTT | 2.29 | 1.36 | 0.34 | 1.30 |

Season-long, pooled: All Rounder 77.9 pts/credit, Climber 62.9, Sprinter 57.9, **Unclassed 24.1**.

Three findings worth the post:

1. **All-Rounders are the best class on mountain stages *and* time trials, and are never bad anywhere.** They beat Climbers on mountain stages (5.01 vs 4.43 pts/credit) because the GC contenders take the mountain stage results *and* the daily GC points on the same day. The "Climber" label is about role, not about who cashes in on climbing days.
2. **Sprinters are the most extreme asset in the game.** 6.73 pts/credit on sprint stages, the highest single number in the table by a factor of 1.3, and 0.44 and 0.34 on mountains and ITTs. They are a concentrated bet on roughly 5-8 stages a year. That is a variance decision, not a value decision.
3. **Unclassed riders are structurally poor everywhere** (0.60-1.86 pts/credit, best on mixed stages), and you are forced to buy three of them. This is the same finding as the cheap-bracket result from a different angle: the mandatory Unclassed slots are the tax the format charges you, and minimising what you spend there while maximising what you get is a large part of the game.

## 9. What the strategy post can actually claim

Ranked by how well the evidence holds across four editions.

**Strong (holds all four years):**
1. Cheap riders are bad value, monotonically. The 4cr and 6cr brackets return a fraction of what 8cr+ returns, every single edition. Minimise forced filler slots.
2. Team assists are 12-15% of the game and 52-60% of them go to two teams. Stack the right team's domestiques; this is where correlated picks pay.
3. Price explains ~64% of outcome and ownership explains less. The crowd is not information.
4. ~30% of the field is dead by stage 15 and ~69% score nothing in the final round.
5. Stage results + daily GC = ~74% of all points, every year. Everything else is rounding.

6. All-Rounders are the best value class overall (77.9 pts/credit) and the best on both mountain stages and time trials. Unclassed riders are the worst (24.1) and you must buy three.
7. Sprinters are a concentrated bet on 5-8 stages: 6.73 pts/credit on sprint days, 0.44 on mountains.
8. The best human in the field lands 4.4-14.1% short of the hindsight optimum, and the top 5 cluster within ~1.5% of each other.

**Weak (2026-only, do not generalise):**
9. The "10-credit sweet spot", noise across four editions.

**Strongest rule of all (see section 10):** Unclassed riders on a top-2 assist team return 1.8x to 3.9x, every edition, and the qualifying teams are knowable in advance.

**The counter-intuitive lead:** the most expensive rider is the most correctly-priced asset in the game. Four editions, and the decision to buy him or not was worth between 0% and 0.57%. Everyone argues about him; the argument is worthless. The money is in the 8-14 credit band and in the assist structure.

## 10. The strongest single rule: your Unclassed slots are shares in a pro team

Computed after the rest of this document, and it is the biggest edge in the dataset.

The format forces 3 Unclassed riders, the worst class in the game at 24.1 pts/credit against 77.9 for All-Rounders. But 24.8% of all Unclassed points are team assists, against 10.4% for Climbers, 10.2% for All-Rounders and 4.1% for Sprinters. Unclassed riders barely score on their own; they collect on their leader.

Split every Unclassed rider by whether his pro team finished top two in assist points that year:

| Year | On a top-2 assist team | Everyone else | Ratio |
|---|---|---|---|
| 2023 | 58.6 pts/credit | 20.6 | 2.84x |
| 2024 | 41.0 | 22.2 | 1.84x |
| 2025 | 81.1 | 20.6 | 3.94x |
| 2026 | 63.3 | 21.5 | 2.95x |

Riders at 6 credits or under, same split, on raw points: 325 vs 133 (2023), 310 vs 129 (2024), 431 vs 139 (2025), 396 vs 129 (2026).

Top-two assist teams by edition: Jumbo-Visma and UAE (2023), UAE and Visma (2024), Visma and UAE (2025), UAE and Lidl-Trek (2026). **UAE is top-two in all four editions, Visma in three of four**, so the rule is applicable before a race starts rather than only in hindsight.

Backtest of the crudest usable form, buy the 3 cheapest Unclassed riders from UAE or Visma, against the ownership-weighted average Unclassed pick multiplied by three slots:

| Year | Rule pts | Rule credits | Field pts | Field credits | Delta |
|---|---|---|---|---|---|
| 2023 | 1,145 | 16 | 733 | 20.3 | +412 |
| 2024 | 1,008 | 18 | 754 | 19.5 | +254 |
| 2025 | 1,891 | 18 | 1,067 | 20.7 | +824 |
| 2026 | 925 | 16 | 870 | 18.3 | +55 |

4 for 4, +1,545 pts total, spending 2-4 credits less each year than the field did on the same slots.

Caveats: 2026 barely worked because Lidl-Trek displaced Visma as the number two assist team, and the rule's cheapest Visma pick (Affini, 4cr) scored 118. The comparison baseline is an ownership-weighted average, which is what the typical manager's slot was worth, not what the winner's was. And it is still four data points.

## 11. What's still missing

- **The Replacements contest.** Scored on a separate leaderboard; none of the above touches it. It is a sequential decision problem under uncertainty rather than a static knapsack, and the attrition numbers in section 6 are the case for why it matters.
- **Published parcours profiles.** The stage types in section 8 are derived from outcomes, not from official route data. They answer "who actually scored" rather than "what was the stage meant to be", good enough for strategy, not for a claim about route design. Joining an external profile table would let the post separate the two.
- **Pre-race prices vs pre-race expectations.** I have final points and final prices but no snapshot of the projections the field was working from, so I can't separate "Velogames mispriced him" from "he had a bad three weeks."
