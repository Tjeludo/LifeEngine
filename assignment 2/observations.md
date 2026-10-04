# Assignment 2: Rhino-Leopard Savanna

## What the simulation represents

| Element | Life Engine representation | Ecological role |
| --- | --- | --- |
| Rhino | Large, armoured producer-free organism with a mover, mouth, and eye | Herbivore. It follows food and eats nearby food cells. |
| Leopard | Smaller organism with a mover, eye, mouth, and killer cell | Predator. It searches and damages neighbouring organisms. |
| Grass | Three-cell producer organism | Plant-like food source. It produces food in adjacent empty cells. |
| Bush | Five-cell producer organism in a plus shape | Larger plant-like food patch. It produces food around a wider body. |

Grass and bushes are not animals. They are stationary producer organisms because that is the closest built-in Life Engine mechanism for a living plant: they occupy space and generate food. The grey-blue food cells are the edible vegetation resource that rhinos consume. In the updated engine, each successful producer event also contributes to the plant's reproduction threshold, so grass and bushes can produce new plant individuals over time rather than remaining only as the initial patches.

## Visual observations

The companion graphic shows the cell-level silhouettes. A rhino has a long armoured body, a forward mouth, and an eye. A leopard has a compact body, a forward-facing eye, a mouth, and a killer cell. Grass is a short horizontal producer; a bush is a five-cell producer patch.

## Predictions to record while running

1. Rhino numbers should increase when grass and bush food is plentiful, because rhinos can eat and reproduce.
2. Leopard numbers should increase when rhinos are close enough to be found and damaged.
3. Heavy grazing should reduce nearby food production, eventually slowing rhino reproduction.
4. If leopards become too numerous, rhino deaths should reduce the predators' food opportunities and their population should later fall.
5. Bush patches should create local hotspots of food, while the empty spaces between patches make movement and survival less certain.

## Observation table

Record the values at the same interval, such as every 100 ticks.

| Tick | Rhino count | Leopard count | Grass/bush count | Food cells | Observation |
| ---: | ---: | ---: | ---: | ---: | --- |
| 0 | 1 | 1 | 2 | 27 | One rhino, one leopard, one grass patch, one bush patch, and reachable starting food. |
| 100 |  |  |  |  |  |
| 200 |  |  |  |  |  |
| 300 |  |  |  |  |  |
