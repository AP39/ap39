# Everyone Argues About Pogačar. Velogames Is Decided by the Three Riders Nobody Thinks About.

*2026-07-29*

> **Excerpt:** Four editions of Velogames Tour de France data, 720 riders and 15,840 rider-rounds, on how the game is actually won. The three mandatory Unclassed slots are the worst assets in the game and a quarter of their points are team assists, so a rule you can apply before the race starts is worth 2x to 4x on those slots. It beat the field four years out of four.

---

The last post graded my quantum-picked fantasy team against a perfect-hindsight solver and four editions of results. It finished off the public leaderboard. This post is the part that was actually worth the scraping.

I have every rider from the last four Tours de France on Velogames: 720 riders, 15,840 rider-rounds, every point broken out by how it was earned. Stage results, daily classification standings, intermediate sprints, summits, breakaways and team assists, for 2023, 2024, 2025 and 2026.

Here is what it says about winning, starting with the thing nobody talks about.

## The three slots that decide the game

Velogames gives you 100 credits and makes you pick 2 All-Rounders, 2 Climbers, 1 Sprinter, 3 Unclassed riders and 1 wildcard.

Those three mandatory Unclassed slots are the worst assets in the game. Pooled across four editions:

| Class | Points per credit |
|---|---|
| All Rounder | 77.9 |
| Climber | 62.9 |
| Sprinter | 57.9 |
| **Unclassed** | **24.1** |

An Unclassed rider returns roughly a third of what an All-Rounder returns per credit, and the format forces you to buy three of them. That is the tax. A third of your squad is legally required to be bad.

So the question is not whether to buy Unclassed riders. It is how to make a forced bad buy less bad, and that turns out to have a clean answer.

## Unclassed riders do not score. Their leaders score for them.

Velogames pays team-assist points: when a rider's teammate wins a stage or his team places well in the team classification, he collects. Look at what share of each class's points arrive that way:

| Class | Share of points from team assists |
|---|---|
| Unclassed | **24.8%** |
| Climber | 10.4% |
| All Rounder | 10.2% |
| Sprinter | 4.1% |

A quarter of everything Unclassed riders score is credit for work someone else did. They are not really riders in this game. They are shares in a pro team.

And team assists are not a rounding error. Across the four editions they are 11.9% to 15.3% of every point scored, the third-largest source in the game after stage results and daily GC, and bigger than breakaways, intermediate sprints, summits, the points classification and the mountains classification combined.

They are also savagely concentrated. Two teams take 52% to 60% of the entire assist pool every year. Three to six teams take literally none.

## The 2x to 4x rule

Split every Unclassed rider by whether his pro team finished top two in assist points that year:

| Year | On a top-2 assist team | Everyone else | Ratio |
|---|---|---|---|
| 2023 | 58.6 pts/credit | 20.6 | 2.84x |
| 2024 | 41.0 | 22.2 | 1.84x |
| 2025 | 81.1 | 20.6 | 3.94x |
| 2026 | 63.3 | 21.5 | 2.95x |

Same class, same price bracket, roughly triple the return, four editions out of four.

Restrict it to genuinely cheap riders, 6 credits and under, and the effect holds on raw points:

| Year | Cheap rider on a top-2 team | Cheap rider elsewhere | Ratio |
|---|---|---|---|
| 2023 | 325 pts | 133 | 2.44x |
| 2024 | 310 | 129 | 2.41x |
| 2025 | 431 | 139 | 3.10x |
| 2026 | 396 | 129 | 3.07x |

## The part that makes it usable

All of that is hindsight. You cannot know in July which team will top the assist table in three weeks.

Except you nearly can:

| Year | Top two assist teams |
|---|---|
| 2023 | Jumbo-Visma, UAE |
| 2024 | UAE, Visma |
| 2025 | Visma, UAE |
| 2026 | UAE, Lidl-Trek |

UAE has been a top-two assist team in all four editions. Visma in three of four. This is not a subtle signal you need a model to extract. It is the two strongest teams in professional cycling being the two strongest teams in professional cycling.

So I backtested the dumbest possible version of the rule, using only information available before any of these races started: **buy the three cheapest Unclassed riders from UAE or Visma.** No projections, no judgement, no knowledge of results.

Against the field's actual behaviour, measured as the ownership-weighted average Unclassed pick that year, multiplied by three slots:

| Year | Rule | Credits | What the field did | Credits | Delta |
|---|---|---|---|---|---|
| 2023 | 1,145 | 16 | 733 | 20.3 | +412 |
| 2024 | 1,008 | 18 | 754 | 19.5 | +254 |
| 2025 | 1,891 | 18 | 1,067 | 20.7 | +824 |
| 2026 | 925 | 16 | 870 | 18.3 | +55 |

Four editions, four wins, 1,545 points total, and it spent 2 to 4 credits *less* each year than the average manager did on the same three slots. Those spare credits go straight into the expensive brackets where the real points live.

Two honest caveats. 2026 barely worked, because the number two assist team that year was Lidl-Trek, not Visma, and the rule's cheapest Visma pick was Edoardo Affini at 4 credits, who scored 118 points across three weeks, every single one of them assist credit and not one of them his own. And the "what the field did" column is an ownership-weighted average, not a real opponent. It tells you what the typical manager's slot was worth, not what the winner's was.

The rule is still 4 for 4, and it costs nothing to follow.

## Everything else the data says

**The most expensive rider is a coin flip, and always has been.** I spent an entire post on whether to buy Pogačar. Across four editions, the field's priciest rider is in the perfect-hindsight team twice, and leaving him out of the other two cost 0.25% and 0.57%. His points-per-credit ranked 10th, 8th, 7th and 19th out of about 180. Velogames prices him almost exactly right every year. Stop arguing about him.

**Cheap riders are cheap because they do not score.** Mean points per credit by bracket, and it is close to monotone every edition: the 4-credit bracket returns 13 to 24, the 6-credit bracket 25 to 31, and the top brackets 112 to 137. The popular idea that value hides at the bottom of the price list is backwards. The only cheap riders worth owning are the ones attached to a winning team, which is the rule above.

**All-Rounders are the best class, including on mountains.** Pooled points per credit by stage type:

| Stage type | All Rounder | Climber | Sprinter | Unclassed |
|---|---|---|---|---|
| Sprint | 1.04 | 0.76 | **6.73** | 0.95 |
| Mountain | **5.01** | 4.43 | 0.44 | 0.75 |
| Time trial | **5.13** | 1.60 | 0.34 | 0.60 |

All-Rounders beat Climbers on mountain stages, which sounds wrong until you remember they take the stage result and the daily GC points on the same afternoon. The class labels describe a role, not who cashes in.

**Sprinters are a variance decision, not a value decision.** The highest single number in that table and the lowest, in the same column. A sprinter is a concentrated bet on five to eight days out of twenty-one.

**Buy riders who will still be classified on the final Sunday.** The Final Classifications round is worth 11.7% to 12.2% of the entire game, awarded in one lump at the end, and only about 30% of the field scores anything in it. Meanwhile 27% to 35% of riders score their last point on or before stage 15, and 3% to 7% score nothing all tour. You are picking on the first Saturday for a payout that lands three weeks later.

**Ignore ownership.** Price correlates with final points at r = 0.775 to 0.818 across the four editions. Ownership correlates at 0.680 to 0.797, weaker every single year. The crowd adds no information the price list does not already carry. Roughly a third of the outcome is unexplained by price, and that residual is the entire game.

## How good is good?

Worth knowing what you are aiming at. The winning score on the public leaderboard, against the best team it was possible to pick:

| Year | Winner | Perfect hindsight | Gap |
|---|---|---|---|
| 2023 | 12,231 | 13,444 | 9.0% |
| 2024 | 12,684 | 14,768 | 14.1% |
| 2025 | 13,585 | 14,216 | 4.4% |
| 2026 | 14,030 | 14,783 | 5.1% |

Out of a field of many thousands, nobody has ever come within 4% of the optimum. And in three of four editions the top five teams finish within about 1.5% of each other, which is 200 points or so. The leaderboard is dense at the top. A rule worth 400 points on three slots is not a marginal improvement, it is the whole margin.

## The solver

None of the above requires a quantum computer. It requires an integer program, which runs in about a second on a laptop. Feed it your own projections and the current rider list:

```python
import csv, pulp

riders = list(csv.DictReader(open('riders.csv', encoding='utf-8')))
QUOTA = {'All Rounder': 2, 'Climber': 2, 'Sprinter': 1, 'Unclassed': 3}
BUDGET = 100

prob = pulp.LpProblem('velogames', pulp.LpMaximize)
x = [pulp.LpVariable(f'x{i}', cat='Binary') for i in range(len(riders))]
w = {c: pulp.LpVariable(f'w_{c}', cat='Binary') for c in QUOTA}

prob += pulp.lpSum(x[i] * float(riders[i]['projection']) for i in range(len(riders)))
prob += pulp.lpSum(x) == 9
prob += pulp.lpSum(x[i] * int(riders[i]['cost']) for i in range(len(riders))) <= BUDGET
prob += pulp.lpSum(w.values()) == 1
for c in QUOTA:
    prob += pulp.lpSum(x[i] for i in range(len(riders))
                       if riders[i]['class'] == c) == QUOTA[c] + w[c]

prob.solve(pulp.PULP_CBC_CMD(msg=0))
for i, v in enumerate(x):
    if v.value() > 0.5:
        print(riders[i]['cost'], riders[i]['class'], riders[i]['name'])
```

The binary `w` variables are the wildcard: exactly one class gets its quota raised by one, and the solver decides which. That is the whole trick, and it is the part people get wrong when they try to do this by hand.

The optimizer is not where your edge is. It will faithfully return the best team under whatever projections you hand it, and if your projections rank a 24-credit rider second when he finishes eleventh, it will faithfully buy him. Mine did. What the solver buys you is that you will never leave credits on the table or misuse the wildcard, which is worth a few hundred points a year on its own.

## What I still cannot tell you

The Replacements contest, the side game with seven transfers across three windows, is untouched by all of this. It is a sequential decision under uncertainty rather than a one-shot knapsack, and the attrition numbers are exactly why it exists. That is a harder problem and a better one.

I also have no snapshot of what the field expected before each race, only what riders cost and what they scored. So I can tell you Velogames priced someone wrong, but I cannot tell you whether that is mispricing or three bad weeks.

And one edition of anything is an anecdote. Four is barely a trend. The Unclassed rule is 4 for 4, which is the strongest thing in here, and it is still four data points.

The short version, if you skipped to the end: stop arguing about the yellow jersey favourite, spend your bottom three slots on domestiques from UAE or Visma, and put the change into the 8-to-18 credit range.
