# Project Brief Compliance

## Initial environmental setup

The seeded world satisfies the brief's minimum requirements:

| Species | Category | Mouth | Producer | Mover | Distinct design |
| --- | --- | ---: | ---: | ---: | --- |
| Rhino | Animal | Yes | No | Yes | 7 cells: armour, eye, mouth and mover |
| Leopard | Animal | Yes | No | Yes | 5 cells: armour, eye, mouth, killer and mover |
| Zebra |Animal |2 Mouth | Yes | Yes | 5 producers in a plus form |
| Grass | Plant | No | Yes | No | 3 producers in a horizontal form |
| Bush | Plant | No | Yes | No | 5 producers in a plus form |


The animals are mobile and consume food. They do not contain producer cells. The plants are stationary because they contain no mover cells, and they produce food through their producer cells. Grass and bush are distinct because their morphologies contain different numbers and arrangements of cells.

## Scope note

This world satisfies the per-run minimum of at least one animal species and two distinct plant species. The project timeline separately asks the group to select four distinct animal species for Week 1. Rhino and leopard are two of those possible animal choices; the remaining two should be selected and tested as separate experimental species or added to a later comparison world rather than silently changing this rhino-leopard trial.

## Evolution is not hard-coded

The world only sets the initial population, positions, anatomies, food, and controls. Reproduction, mutation, predation, food depletion, death, and population change remain controlled by the existing engine. No extinction or survival result is scripted.
