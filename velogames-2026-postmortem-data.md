# Velogames TdF 2026 — Post-Race Data for Follow-Up Post

Working notes for the sequel to `quantum-tour-de-france-fantasy`. Not a draft — raw material, all numbers verified.

**Data pulled:** 2026-07-29 from `velogames.com/velogame/2026/riders.php` (final points) and `.../teamscore.php` (Classic leaderboard, top 299) and `.../rules.php`.

---

## 1. Headline numbers

| Thing | Points | Credits |
|---|---|---|
| My quantum-picked team (Main/Classic contest) | **11,924** | 100/100 |
| Hindsight-optimal team (ILP on actual points) | **14,783** | 98/100 |
| Best possible team *containing* Pogačar | 14,699 | 100/100 |
| Global leaderboard winner ("Plofhol", Freek de volwassen vader) | 14,030 | — |
| 299th place (last visible on public board) | 12,138 | — |

- My gap vs hindsight optimum: **2,859 pts (19.3%)**.
- My gap vs the human winner: **2,106 pts (15.0%)**.
- My team finished **outside the public top 299** (299th scored 12,138, I scored 11,924).
- The hindsight optimum beat the actual human winner by 753 pts, so nobody found it.

## 2. THE PUNCHLINE: "don't buy Pogačar" was right, by 84 points

The ex-post optimal team — computed with perfect knowledge of every rider's final score — **still does not contain Tadej Pogačar.**

- Unconstrained hindsight optimum: **14,783**
- Best team forced to include Pogačar: **14,699**
- Cost of buying Pogačar, with hindsight: **84 points (0.6%)**

Pogačar scored 3,695, by far the most of any rider — and was still, marginally, the wrong buy at 34 credits. The pre-race model reached the same conclusion for the same reason (credits, not form), and got the right answer with a 0.6% margin it had no way of knowing was that thin. Honest framing: the model was right, but the margin means it was **right by luck, not by resolution** — 84 points is well inside the model's error bars, given it missed Vingegaard's actual result by 612.

**Both** the quantum computer and the exact ILP said no to Pogačar. Reality agreed, barely.

## 3. My nine, actual vs projected

Projections shown only where the original post published them.

| Rider | Class | Cost | Projected | Actual | Pts/credit | Owned by |
|---|---|---|---|---|---|---|
| Remco Evenepoel | All Rounder | 16 | 1,406 | **2,697** | 168.6 | 19.8% |
| Mads Pedersen | Sprinter | 10 | — | 1,797 | 179.7 | 23.8% |
| Mattias Skjelmose | All Rounder (wildcard) | 10 | — | 1,611 | 161.1 | 5.9% |
| Juan Ayuso | Climber | 12 | 1,182 | 1,468 | 122.3 | 15.3% |
| Lenny Martinez | Climber | 10 | — | 1,449 | 144.9 | 13.1% |
| Jonas Vingegaard | All Rounder | 24 | 1,891 | 1,279 | 53.3 | 29.4% |
| Thomas Pidcock | Unclassed | 10 | — | 1,138 | 113.8 | 27.2% |
| Sean Quinn | Unclassed | 4 | — | 367 | 91.8 | 4.3% |
| Edoardo Affini | Unclassed | 4 | — | 118 | 29.5 | 14.1% |
| **Total** | | **100** | **8,014** | **11,924** | 119.2 | |

Projection accuracy on the four riders with published numbers:

| Rider | Projected | Actual | Error |
|---|---|---|---|
| Tadej Pogačar (not picked) | 2,565 | 3,695 | −1,130 (under by 31%) |
| Jonas Vingegaard | 1,891 | 1,279 | +612 (over by 48%) |
| Remco Evenepoel | 1,406 | 2,697 | −1,291 (under by 48%) |
| Juan Ayuso | 1,182 | 1,468 | −286 (under by 19%) |

The model systematically under-projected the top of the board (absolute scale was low — 8,014 projected vs 11,924 actual for the same nine, so the whole point scale was compressed ~33%) but got the **ordering wrong in exactly one important place**: it ranked Vingegaard 2nd overall and he finished 11th among all riders. Evenepoel was the single biggest miss in the right direction — the model had him 3rd, he finished 2nd and returned 168.6 pts/credit.

Key nuance for the writeup: **relative order within a price bracket is what the optimizer actually consumes**, not absolute magnitude. A uniformly compressed scale changes nothing about the chosen team. Getting Vingegaard's rank wrong at 24 credits is what cost real points.

## 4. kingston vs fez, settled by reality

The original post's two hardware results differed by one rider: ibm_kingston's best sample was the exact ILP optimum (Skjelmose as wildcard); ibm_fez's best sample swapped in Max Kanter.

| Variant | Projected | Actual | Credits |
|---|---|---|---|
| ibm_kingston 21q best sample (= ILP optimum, Skjelmose) | 8,014 | **11,924** | 100 |
| ibm_fez 21q best sample (Kanter for Skjelmose) | 7,615 | 11,190 | 96 |

Skjelmose 1,611 vs Kanter 877 → kingston's run was **734 points better in reality too**. The chip that found the optimum found the genuinely better team. n=1, and it does not make kingston a better chip, but it's a satisfying coda: the noise that ate fez's answer cost 734 real points.

## 5. Hindsight-optimal team (ILP, actual points)

**14,783 pts, 98/100 credits, wildcard spent on a Climber.**

| Rider | Team | Class | Cost | Actual | Pts/cr | Owned |
|---|---|---|---|---|---|---|
| Remco Evenepoel | Red Bull - BORA - hansgrohe | All Rounder | 16 | 2,697 | 168.6 | 19.8% |
| Isaac Del Toro | UAE Team Emirates - XRG | Climber | 14 | 2,464 | 176.0 | 36.5% |
| Paul Seixas | Decathlon CMA CGM Team | Climber | 18 | 1,919 | 106.6 | 31.0% |
| Mads Pedersen | Lidl - Trek | Sprinter | 10 | 1,797 | 179.7 | 23.8% |
| Richard Carapaz | EF Education - EasyPost | Climber (wildcard) | 8 | 1,777 | 222.1 | 24.2% |
| Mattias Skjelmose | Lidl - Trek | All Rounder | 10 | 1,611 | 161.1 | 5.9% |
| Thomas Pidcock | Pinarello-Q36.5 | Unclassed | 10 | 1,138 | 113.8 | 27.2% |
| Quinn Simmons | Lidl - Trek | Unclassed | 6 | 698 | 116.3 | 9.6% |
| Mauro Schmid | Team Jayco AlUla | Unclassed | 6 | 682 | 113.7 | 5.5% |

**Overlap with my team: 4 riders** (Evenepoel, Pedersen, Skjelmose, Pidcock — all bought at the same price the optimum pays). Note it leaves 2 credits unspent — the budget constraint was not binding on the true optimum, which is a nice detail given how much of the original post was about budget slack bits.

Best team that includes Pogačar (14,699, 100 credits): Pogačar, Evenepoel, Del Toro, Pedersen, Carapaz, Max Kanter, Huub Artz, Clément Russo, Sean Quinn. Buying Pogačar forces you down to 4-credit filler in three Unclassed slots — exactly the mechanism the pre-race post described.

## 6. Field-wide stats

184 riders in the final list (the pre-race pool the post optimized over was 172 — the gap is Velogames' automatic replacements for non-starters, plus late additions; **flag this discrepancy in the post rather than papering over it**).

- Total points scored across the whole field: 54,616
- Riders who scored exactly 0: 13

By class:

| Class | n | Mean pts | Max |
|---|---|---|---|
| All Rounder | 15 | 896.7 | 3,695 (Pogačar) |
| Climber | 28 | 546.7 | 2,464 (Del Toro) |
| Sprinter | 19 | 527.4 | 1,797 (Pedersen) |
| Unclassed | 122 | 129.8 | 1,138 (Pidcock) |

By price bracket:

| Cost | n | Mean pts | Max | Mean pts/credit |
|---|---|---|---|---|
| 4 | 47 | 72.3 | 555 | 18.1 |
| 6 | 98 | 178.1 | 877 | 29.7 |
| 8 | 21 | 357.2 | 1,777 | 44.7 |
| 10 | 9 | 1,047.0 | 1,797 | 104.7 |
| 12 | 4 | 1,196.0 | 1,512 | 99.7 |
| 14 | 1 | 2,464.0 | 2,464 | 176.0 |
| 16 | 1 | 2,697.0 | 2,697 | 168.6 |
| 18 | 1 | 1,919.0 | 1,919 | 106.6 |
| 24 | 1 | 1,279.0 | 1,279 | 53.3 |
| 34 | 1 | 3,695.0 | 3,695 | 108.7 |

**Big finding for the writeup:** mean points-per-credit rises monotonically from the 4cr bracket (18.1) to the 10cr bracket (104.7) and then *plateaus*. Velogames' pricing is not efficient — cheap riders are systematically bad value, and the "value per credit beats star power" thesis from the original post is only true *within* the expensive tiers, not across the whole board. The 10cr bracket is the sweet spot: 9 riders, mean 1,047 points. The original team took **four** riders from that bracket, which is the single biggest reason it scored as well as it did.

## 7. Top 20 scorers

| Pts | Cost | Pts/cr | Class | Rider | Owned |
|---|---|---|---|---|---|
| 3,695 | 34 | 108.7 | All Rounder | Tadej Pogačar | 70.4% |
| 2,697 | 16 | 168.6 | All Rounder | Remco Evenepoel | 19.8% |
| 2,464 | 14 | 176.0 | Climber | Isaac Del Toro | 36.5% |
| 1,919 | 18 | 106.6 | Climber | Paul Seixas | 31.0% |
| 1,797 | 10 | 179.7 | Sprinter | Mads Pedersen | 23.8% |
| 1,777 | 8 | 222.1 | Climber | Richard Carapaz | 24.2% |
| 1,611 | 10 | 161.1 | All Rounder | Mattias Skjelmose | 5.9% |
| 1,512 | 12 | 126.0 | Sprinter | Jasper Philipsen | 28.7% |
| 1,468 | 12 | 122.3 | Climber | Juan Ayuso | 15.3% |
| 1,449 | 10 | 144.9 | Climber | Lenny Martinez | 13.1% |
| 1,279 | 24 | 53.3 | All Rounder | Jonas Vingegaard | 29.4% |
| 1,268 | 10 | 126.8 | Climber | Tobias Halland Johannessen | 11.7% |
| 1,138 | 10 | 113.8 | Unclassed | Thomas Pidcock | 27.2% |
| 1,123 | 10 | 112.3 | Sprinter | Olav Kooij | 7.8% |
| 1,096 | 8 | 137.0 | Sprinter | Biniam Girmay | 16.0% |
| 918 | 12 | 76.5 | Sprinter | Tim Merlier | 18.5% |
| 886 | 12 | 73.8 | All Rounder | Florian Lipowitz | 41.3% |
| 877 | 6 | 146.2 | Sprinter | Max Kanter | 5.1% |
| 836 | 6 | 139.3 | Climber | Sepp Kuss | 10.7% |
| 698 | 6 | 116.3 | Unclassed | Quinn Simmons | 9.6% |

## 8. Best value (pts per credit)

| Pts/cr | Pts | Cost | Rider | Owned |
|---|---|---|---|---|
| 222.1 | 1,777 | 8 | Richard Carapaz | 24.2% |
| 179.7 | 1,797 | 10 | Mads Pedersen | 23.8% |
| 176.0 | 2,464 | 14 | Isaac Del Toro | 36.5% |
| 168.6 | 2,697 | 16 | Remco Evenepoel | 19.8% |
| 161.1 | 1,611 | 10 | Mattias Skjelmose | 5.9% |
| 146.2 | 877 | 6 | Max Kanter | 5.1% |
| 144.9 | 1,449 | 10 | Lenny Martinez | 13.1% |
| 139.3 | 836 | 6 | Sepp Kuss | 10.7% |
| 138.8 | 555 | 4 | Huub Artz | 1.2% |
| 137.0 | 1,096 | 8 | Biniam Girmay | 16.0% |
| 126.8 | 1,268 | 10 | Tobias Halland Johannessen | 11.7% |
| 126.0 | 1,512 | 12 | Jasper Philipsen | 28.7% |

Pogačar's 108.7 pts/credit puts him **19th** on this list despite scoring the most points of anyone.

## 9. Busts and differentials

**Biggest busts** (owned by ≥10% of the field, worst value):

| Owned | Pts | Cost | Pts/cr | Rider |
|---|---|---|---|---|
| 17.2% | 32 | 6 | 5.3 | Jonas Abrahamsen |
| 10.9% | 42 | 4 | 10.5 | Emiel Verstrynge |
| 18.0% | 45 | 4 | 11.2 | Kasper Asgreen |
| 23.0% | 128 | 8 | 16.0 | Ben Healy |
| 12.0% | 135 | 8 | 16.9 | Romain Grégoire |
| **14.1%** | **118** | **4** | **29.5** | **Edoardo Affini (mine)** |
| 13.1% | 300 | 8 | 37.5 | Thymen Arensman |
| 12.9% | 244 | 6 | 40.7 | Filippo Ganna |
| **29.4%** | **1,279** | **24** | **53.3** | **Jonas Vingegaard (mine)** |
| 29.8% | 630 | 10 | 63.0 | Mathieu Van Der Poel |
| 41.3% | 886 | 12 | 73.8 | Florian Lipowitz |

I owned two of the eleven biggest busts in the game. Affini at 29.5 pts/credit was the worst pick in my nine by value; Vingegaard was the worst by absolute credits wasted.

**Best differentials** (owned by <10%, highest scoring):

| Owned | Pts | Cost | Pts/cr | Rider |
|---|---|---|---|---|
| 5.9% | 1,611 | 10 | 161.1 | Mattias Skjelmose **(mine)** |
| 7.8% | 1,123 | 10 | 112.3 | Olav Kooij |
| 5.1% | 877 | 6 | 146.2 | Max Kanter |
| 9.6% | 698 | 6 | 116.3 | Quinn Simmons |
| 5.5% | 682 | 6 | 113.7 | Mauro Schmid |
| 3.9% | 638 | 6 | 106.3 | Jordan Jegat |
| 5.7% | 596 | 8 | 74.5 | Adam Yates |
| 1.2% | 555 | 4 | 138.8 | Huub Artz |
| 2.6% | 553 | 6 | 92.2 | Søren Wærenskjold |
| 4.8% | 517 | 6 | 86.2 | Davide Piganzoli |

Skjelmose is the story here: the single best differential in the game, owned by 5.9% of the field, and the QUBO found him. The optimizer's edge was not the expensive picks — everyone gets those roughly right — it was pricing an unfashionable 10-credit All-Rounder correctly.

**Most-owned riders:** Pogačar 70.4%, Lipowitz 41.3%, Del Toro 36.5%, Seixas 31.0%, Van Der Poel 29.8%, Vingegaard 29.4%, Philipsen 28.7%, Pidcock 27.2%, Carapaz 24.2%, Pedersen 23.8%.

## 10. Rules (confirmed from the 2026 rules page)

Unchanged from what the original post assumed:

- 9 riders, 100 credits
- 2 All-Rounders, 2 Climbers, 1 Sprinter, 3 Unclassed, 1 Wildcard (any class)
- Entry deadline 17:00 CEST, Sat 4 July 2026
- Scoring: daily stage performance (finish, intermediate sprints, summits, breakaway, team assists) + daily classification standings (GC, KOM, points, teams) + final end-of-tour classifications

**New wrinkle worth a paragraph:** 2026 runs a parallel **Replacements contest** — 7 transfers across three windows (2 after stage 3, 3 after stage 9, 2 after stage 15). This is a separate leaderboard; the Main/Classic leaderboard is still fixed-team, which is the one the original post's optimizer targeted. A follow-up angle: the Replacements contest is a *sequential* decision problem under uncertainty, which is a fundamentally harder and more interesting optimization than the one-shot knapsack — and one where the QUBO formulation genuinely does not apply cleanly.

## 11. Methodology for these numbers

- Rider data scraped from the public rider list on 2026-07-29 (final, post-race).
- Hindsight optimum computed two ways and cross-checked:
  1. Exact per-class 0/1 knapsack DP over (riders chosen, credits spent), combined across the four classes for each of the four wildcard placements.
  2. PuLP/CBC ILP with binary rider variables, `sum(x)==9`, budget ≤100, and a binary wildcard indicator per class enforcing `count(class) == base + w[class]`, `sum(w)==1`.
  - Both return **14,783** and the identical nine riders. First DP attempt used an unsound canonical-ordering prune and was discarded.
- Scripts: `solve2.py` and `riders.txt` in the session scratchpad.

## 12. Caveats to state plainly in the post

- **Hindsight optimum is not a fair benchmark.** It's computed with the answer key. It exists to bound how much of the 19.3% gap is model error vs irreducible variance — not to grade the method.
- **184 riders in the final list vs 172 in the optimized pool.** Automatic replacements for non-starters changed the field after the pool was fixed. The provably-lossless 172→45 pruning argument holds for the pool as it stood at optimization time, not for the final field.
- **The 84-point Pogačar margin is inside the model's error.** Do not claim vindication; claim a coin-flip that landed right, and show the error table that proves it.
- **n=1 tour.** One edition, one team. Everything here is an anecdote with good arithmetic.
- **Team assist points** were a large part of the pre-race model (UAE ≈ 204, Lidl-Trek ≈ 154, Visma ≈ 108). The per-rider actuals scraped here bundle assists into the total, so the assist model can't be validated separately from this data. Would need stage-by-stage breakdowns to isolate.

## 13. Candidate angles for the follow-up

1. **"The quantum computer was right about Pogačar by 84 points."** Lead with the hindsight ILP. Strongest, most honest framing: right answer, wrong confidence.
2. **The 19.3% gap decomposition.** How much did each bad pick cost? Vingegaard and Affini alone account for most of it. Chase it: swap each of my nine for the best legal alternative at the same price and report the counterfactual deltas.
3. **Velogames' pricing is inefficient in a specific direction.** Mean pts/credit climbs from 18.1 at 4cr to 104.7 at 10cr, then flattens. The optimal strategy is to avoid the cheap brackets entirely — which is the *opposite* of the "value picks" folk wisdom, and it falls straight out of the price-bracket table.
4. **Skjelmose as the vindication.** 5.9% owned, best differential in the game, found by a 21-qubit circuit on real hardware. The one pick that no consensus would have produced.
5. **kingston vs fez, graded by reality.** The chip that found the ILP optimum also found the team that scored 734 more real points.
6. **The Replacements contest as the sequel problem.** One-shot knapsack is solved; sequential re-optimization under uncertainty is not, and is a much better argument for sampling methods than a static QUBO ever was.
