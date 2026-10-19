# Observation log

Every state line below is read from the logger at the tick of a saved screenshot. Screenshot paths are relative to `savanna-experiments/output/`. Ablations and sweeps (40,000 ticks, 3 seeds each) are summarised in `summary.md`; their screenshots are in `output/ablation/` and `output/sweep/`.

## Part 1: base engine

### What the base engine can and cannot do

The base engine is the original Life Engine rules (plus our Assignment 2 change that lets plants reproduce from the food they make). None of the new settings are on, and mutation cannot create the new cell types. As the engine's creator explains, an organism needs only one mover cell, and extra movers do not make it faster, so base zebras and leopards have one mover each.

What the base engine allows:
- Killer cells damage anything they touch, plants included, and a dead plant turns into food. A plant-killing trait is therefore rewarded with a meal, while each kill removes a producer for good.
- Uneaten food blocks births, so plants can choke the world.

What it cannot do:
- Nothing starves. Animals die only of old age or killer damage, so scarcity only bites through failure to breed.
- Grass and bush drop identical food, so there is no worse fallback food.
- Leopards can eat plant food and carcasses become plant food, so predators never depend on prey.
- Mouths cannot hurt plants, so grazing cannot deplete them (more grazing frees space and raises production).
- All animals move one cell per tick, so a predator cannot outrun prey.

### How we tried to get suicide or failure to adapt

| Condition | Aim |
| --- | --- |
| base-default | The original settings as shipped (food production 5, lifespan multiplier 100, food blocks births). Baseline: does anything collapse on its own? |
| base-plantkill-control | Route to suicide 1. Zebras start WITHOUT a killer cell; insta-kill is on, killers reach all 8 neighbours and food production is 3. If a killer evolves, each plant it destroys is a meal, so the trait should spread and then remove the producers. |
| base-plantkill | Same as route 1 but zebras start WITH the rear killer. The same mechanism, with the trait given rather than evolved. |
| base-harsh | Scarcity: food production 2. Does a species fail, or adapt? |
| base-nomut | Failure-to-adapt baseline: food production 2 and mutation switched off, so no species can change. |
| base-clog | Route to suicide 2. Fast plants (food production 10, growing into all 8 neighbours) with few grazers: can plants choke themselves with their own food? |

### What happened in each condition

### base-default

**What we tried:** The original settings as shipped (food production 5, lifespan multiplier 100, food blocks births). Baseline: does anything collapse on its own?

**Outcome across seeds:**

- zebra: boom then collapse, no trait (unresolved) x3
- rhino: collapse under predation x3
- leopard: boom-bust: over-predation x2; boom-bust: cohort aged out x1

#### base/base-default-1

- **zebra: boom then collapse, no trait (unresolved).** 36 -> peak 95 at tick 400; extinct at tick 4912; food plants 165 at the peak -> 0 at extinction; main cause of death after the peak: attack (935).
- **rhino: collapse under predation.** 12 -> peak 29 at tick 500; extinct at tick 2800; food plants 97 at the peak -> 0 at extinction; main cause of death after the peak: attack (70).
- **leopard: boom-bust: over-predation.** 16 -> peak 31 at tick 200; extinct at tick 1100; food plants 331 at the peak -> 10 at extinction; main cause of death after the peak: attack (154).

| tick | screenshot | state | events since previous frame |
|---|---|---|---|
| 0 | `base/base-default-1/frame-000000.png` | zebra 36, rhino 12, leopard 16; grass 140, bush 45; food cells 0; mouths/zebra 1.00; zebras with killer 100% | - |
| 900 | `base/base-default-1/event-000900-leopard-collapse.png` | zebra 68, rhino 18, leopard 2; grass 17, bush 6; food cells 155; mouths/zebra 1.00; zebras with killer 100%. Change since last frame: zebra +32 (+89%), rhino +6 (+50%), leopard -14 (-88%), grass -123 (-88%), bush -39 (-87%) | leopard collapse at 900 (peak 31 at 200) |
| 1000 | `base/base-default-1/event-001000-bush-collapse.png` | zebra 56, rhino 12, leopard 2; grass 10, bush 2; food cells 113; mouths/zebra 0.98; zebras with killer 100%. Change since last frame: rhino -6 (-33%), grass -7 (-41%), bush -4 (-67%) | bush collapse at 1000 (peak 71 at 100) |
| 1100 | `base/base-default-1/event-001100-leopard-extinct.png` | zebra 52, rhino 11, leopard 0; grass 9, bush 1; food cells 90; mouths/zebra 1.00; zebras with killer 100% | leopard extinct at 1100 (peak 31 at 200) |
| 1200 | `base/base-default-1/event-001200-bush-extinct.png` | zebra 44, rhino 10, leopard 0; grass 7, bush 0; food cells 64; mouths/zebra 1.00; zebras with killer 100% | bush extinct at 1200 (peak 71 at 100) |
| 1700 | `base/base-default-1/event-001700-grass-collapse.png` | zebra 30, rhino 2, leopard 0; grass 1, bush 0; food cells 37; mouths/zebra 1.00; zebras with killer 100%. Change since last frame: zebra -14 (-32%), rhino -8 (-80%), grass -6 (-86%) | rhino collapse at 1700 (peak 29 at 500); grass collapse at 1700 (peak 272 at 100) |
| 1700 | `base/base-default-1/event-001700-rhino-collapse.png` | zebra 30, rhino 2, leopard 0; grass 1, bush 0; food cells 37; mouths/zebra 1.00; zebras with killer 100% | - |
| 1900 | `base/base-default-1/event-001900-grass-extinct.png` | zebra 24, rhino 1, leopard 0; grass 0, bush 0; food cells 43; mouths/zebra 1.00; zebras with killer 100% | grass extinct at 1900 (peak 272 at 100) |
| 2500 | `base/base-default-1/frame-002500.png` | zebra 14, rhino 1, leopard 0; grass 0, bush 0; food cells 25; mouths/zebra 1.00; zebras with killer 100%. Change since last frame: zebra -10 (-42%) | - |
| 2800 | `base/base-default-1/event-002800-rhino-extinct.png` | zebra 11, rhino 0, leopard 0; grass 0, bush 0; food cells 31; mouths/zebra 1.00; zebras with killer 100% | rhino extinct at 2800 (peak 29 at 500) |
| 4200 | `base/base-default-1/event-004200-zebra-collapse.png` | zebra 2, rhino 0, leopard 0; grass 0, bush 0; food cells 50; mouths/zebra 1.00; zebras with killer 100%. Change since last frame: zebra -9 (-82%) | zebra collapse at 4200 (peak 95 at 400) |
| 4912 | `base/base-default-1/frame-004912.png` | zebra 0, rhino 0, leopard 0; grass 0, bush 0; food cells 56; mouths/zebra 0.00 | zebra extinct at 4912 (peak 95 at 400) |

#### base/base-default-2

- **zebra: boom then collapse, no trait (unresolved).** 36 -> peak 114 at tick 300; extinct at tick 8001; food plants 170 at the peak -> 0 at extinction; main cause of death after the peak: attack (1466).
- **rhino: collapse under predation.** 12 -> peak 28 at tick 400; extinct at tick 2400; food plants 85 at the peak -> 3 at extinction; main cause of death after the peak: attack (66).
- **leopard: boom-bust: over-predation.** 16 -> peak 35 at tick 200; extinct at tick 1300; food plants 295 at the peak -> 12 at extinction; main cause of death after the peak: attack (146).

| tick | screenshot | state | events since previous frame |
|---|---|---|---|
| 0 | `base/base-default-2/frame-000000.png` | zebra 36, rhino 12, leopard 16; grass 140, bush 45; food cells 0; mouths/zebra 1.00; zebras with killer 100% | - |
| 1000 | `base/base-default-2/event-001000-leopard-collapse.png` | zebra 58, rhino 17, leopard 2; grass 9, bush 6; food cells 125; mouths/zebra 0.98; zebras with killer 98%. Change since last frame: zebra +22 (+61%), rhino +5 (+42%), leopard -14 (-88%), grass -131 (-94%), bush -39 (-87%) | leopard collapse at 1000 (peak 35 at 200) |
| 1100 | `base/base-default-2/event-001100-bush-collapse.png` | zebra 48, rhino 15, leopard 2; grass 7, bush 2; food cells 91; mouths/zebra 1.00; zebras with killer 100%. Change since last frame: bush -4 (-67%) | bush collapse at 1100 (peak 73 at 100) |
| 1300 | `base/base-default-2/event-001300-leopard-extinct.png` | zebra 40, rhino 12, leopard 0; grass 10, bush 2; food cells 96; mouths/zebra 1.00; zebras with killer 100%. Change since last frame: grass +3 (+43%) | leopard extinct at 1300 (peak 35 at 200) |
| 1500 | `base/base-default-2/event-001500-bush-extinct.png` | zebra 50, rhino 5, leopard 0; grass 8, bush 0; food cells 103; mouths/zebra 1.00; zebras with killer 100%. Change since last frame: zebra +10 (+25%), rhino -7 (-58%) | bush extinct at 1500 (peak 73 at 100) |
| 2100 | `base/base-default-2/event-002100-rhino-collapse.png` | zebra 37, rhino 1, leopard 0; grass 3, bush 0; food cells 64; mouths/zebra 0.97; zebras with killer 100%. Change since last frame: zebra -13 (-26%), rhino -4 (-80%), grass -5 (-62%) | rhino collapse at 2100 (peak 28 at 400) |
| 2300 | `base/base-default-2/event-002300-grass-collapse.png` | zebra 24, rhino 1, leopard 0; grass 1, bush 0; food cells 58; mouths/zebra 1.00; zebras with killer 100%. Change since last frame: zebra -13 (-35%) | grass collapse at 2300 (peak 255 at 100) |
| 2400 | `base/base-default-2/event-002400-rhino-extinct.png` | zebra 23, rhino 0, leopard 0; grass 3, bush 0; food cells 47; mouths/zebra 1.00; zebras with killer 100% | rhino extinct at 2400 (peak 28 at 400) |
| 2500 | `base/base-default-2/frame-002500.png` | zebra 22, rhino 0, leopard 0; grass 6, bush 0; food cells 45; mouths/zebra 1.00; zebras with killer 100%. Change since last frame: grass +3 (+100%) | - |
| 6100 | `base/base-default-2/event-006100-grass-extinct.png` | zebra 13, rhino 0, leopard 0; grass 0, bush 0; food cells 25; mouths/zebra 1.15; zebras with killer 92%. Change since last frame: zebra -9 (-41%), grass -6 (-100%) | grass extinct at 6100 (peak 255 at 100) |
| 7200 | `base/base-default-2/event-007200-zebra-collapse.png` | zebra 1, rhino 0, leopard 0; grass 0, bush 0; food cells 45; mouths/zebra 1.00; zebras with killer 100%. Change since last frame: zebra -12 (-92%) | zebra collapse at 7200 (peak 114 at 300) |
| 8001 | `base/base-default-2/frame-008001.png` | zebra 0, rhino 0, leopard 0; grass 0, bush 0; food cells 45; mouths/zebra 0.00 | zebra extinct at 8001 (peak 114 at 300) |

#### base/base-default-3

- **zebra: boom then collapse, no trait (unresolved).** 36 -> peak 152 at tick 400; extinct at tick 3985; food plants 94 at the peak -> 0 at extinction; main cause of death after the peak: attack (927).
- **rhino: collapse under predation.** 12 -> peak 21 at tick 500; extinct at tick 2300; food plants 46 at the peak -> 0 at extinction; main cause of death after the peak: attack (31).
- **leopard: boom-bust: cohort aged out.** 16 -> peak 32 at tick 100; extinct at tick 700; food plants 311 at the peak -> 16 at extinction; main cause of death after the peak: attack (126).

| tick | screenshot | state | events since previous frame |
|---|---|---|---|
| 0 | `base/base-default-3/frame-000000.png` | zebra 36, rhino 12, leopard 16; grass 140, bush 45; food cells 0; mouths/zebra 1.00; zebras with killer 100% | - |
| 700 | `base/base-default-3/event-000700-bush-collapse.png` | zebra 91, rhino 13, leopard 0; grass 16, bush 0; food cells 176; mouths/zebra 1.00; zebras with killer 100%. Change since last frame: zebra +55 (+153%), leopard -16 (-100%), grass -124 (-89%), bush -45 (-100%) | leopard collapse at 700 (peak 32 at 100); leopard extinct at 700 (peak 32 at 100); bush collapse at 700 (peak 46 at 100); bush extinct at 700 (peak 46 at 100) |
| 700 | `base/base-default-3/event-000700-bush-extinct.png` | zebra 91, rhino 13, leopard 0; grass 16, bush 0; food cells 176; mouths/zebra 1.00; zebras with killer 100% | - |
| 700 | `base/base-default-3/event-000700-leopard-collapse.png` | zebra 91, rhino 13, leopard 0; grass 16, bush 0; food cells 176; mouths/zebra 1.00; zebras with killer 100% | - |
| 700 | `base/base-default-3/event-000700-leopard-extinct.png` | zebra 91, rhino 13, leopard 0; grass 16, bush 0; food cells 176; mouths/zebra 1.00; zebras with killer 100% | - |
| 1200 | `base/base-default-3/event-001200-grass-collapse.png` | zebra 45, rhino 5, leopard 0; grass 1, bush 0; food cells 22; mouths/zebra 1.00; zebras with killer 100%. Change since last frame: zebra -46 (-51%), rhino -8 (-62%), grass -15 (-94%) | grass collapse at 1200 (peak 268 at 200) |
| 1300 | `base/base-default-3/event-001300-grass-extinct.png` | zebra 39, rhino 4, leopard 0; grass 0, bush 0; food cells 24; mouths/zebra 1.00; zebras with killer 100% | grass extinct at 1300 (peak 268 at 200) |
| 1900 | `base/base-default-3/event-001900-rhino-collapse.png` | zebra 17, rhino 1, leopard 0; grass 0, bush 0; food cells 28; mouths/zebra 1.00; zebras with killer 100%. Change since last frame: zebra -22 (-56%), rhino -3 (-75%) | rhino collapse at 1900 (peak 21 at 500) |
| 2300 | `base/base-default-3/event-002300-rhino-extinct.png` | zebra 10, rhino 0, leopard 0; grass 0, bush 0; food cells 31; mouths/zebra 1.00; zebras with killer 100%. Change since last frame: zebra -7 (-41%) | rhino extinct at 2300 (peak 21 at 500) |
| 2500 | `base/base-default-3/frame-002500.png` | zebra 11, rhino 0, leopard 0; grass 0, bush 0; food cells 22; mouths/zebra 1.00; zebras with killer 100% | - |
| 3700 | `base/base-default-3/event-003700-zebra-collapse.png` | zebra 2, rhino 0, leopard 0; grass 0, bush 0; food cells 49; mouths/zebra 1.00; zebras with killer 100%. Change since last frame: zebra -9 (-82%) | zebra collapse at 3700 (peak 152 at 400) |
| 3985 | `base/base-default-3/frame-003985.png` | zebra 0, rhino 0, leopard 0; grass 0, bush 0; food cells 58; mouths/zebra 0.00 | zebra extinct at 3985 (peak 152 at 400) |

### base-plantkill-control

**What we tried:** Route to suicide 1. Zebras start WITHOUT a killer cell; insta-kill is on, killers reach all 8 neighbours and food production is 3. If a killer evolves, each plant it destroys is a meal, so the trait should spread and then remove the producers.

**Outcome across seeds:**

- zebra: suicide candidate (3 of 4) x2; evolutionary suicide (all 4 criteria) x1
- rhino: boom then collapse, no trait (unresolved) x3
- leopard: not seeded x3

#### base/base-plantkill-control-1

- **zebra: suicide candidate (3 of 4).** 36 -> peak 594 at tick 8000; extinct at tick 28000; mouths per animal rose by 0.77; food plants 523 at the peak -> 654 at extinction; main cause of death after the peak: attack (29020).
- **rhino: boom then collapse, no trait (unresolved).** 12 -> peak 54 at tick 700; extinct at tick 4400; food plants 477 at the peak -> 411 at extinction; main cause of death after the peak: age (64).

| tick | screenshot | state | events since previous frame |
|---|---|---|---|
| 0 | `base/base-plantkill-control-1/frame-000000.png` | zebra 36, rhino 12, leopard 0; grass 140, bush 45; food cells 0; mouths/zebra 1.00 | - |
| 2500 | `base/base-plantkill-control-1/frame-002500.png` | zebra 533, rhino 6, leopard 0; grass 323, bush 102; food cells 708; mouths/zebra 1.04. Change since last frame: zebra +497 (+1381%), rhino -6 (-50%), grass +183 (+131%), bush +57 (+127%) | - |
| 3000 | `base/base-plantkill-control-1/event-003000-rhino-collapse.png` | zebra 534, rhino 2, leopard 0; grass 309, bush 120; food cells 734; mouths/zebra 1.10; zebras with killer 1%. Change since last frame: rhino -4 (-67%) | rhino collapse at 3000 (peak 54 at 700) |
| 4400 | `base/base-plantkill-control-1/event-004400-rhino-extinct.png` | zebra 517, rhino 0, leopard 0; grass 239, bush 172; food cells 698; mouths/zebra 1.34; zebras with killer 1%. Change since last frame: bush +52 (+43%) | rhino extinct at 4400 (peak 54 at 700) |
| 10000 | `base/base-plantkill-control-1/frame-010000.png` | zebra 317, rhino 0, leopard 0; grass 180, bush 80; food cells 489; mouths/zebra 1.54; zebras with killer 8%. Change since last frame: zebra -200 (-39%), bush -92 (-53%) | - |
| 20000 | `base/base-plantkill-control-1/frame-020000.png` | zebra 241, rhino 0, leopard 0; grass 568, bush 67; food cells 3917; mouths/zebra 1.54; zebras with killer 8%. Change since last frame: grass +388 (+216%) | - |
| 22400 | `base/base-plantkill-control-1/event-022400-bush-collapse.png` | zebra 103, rhino 0, leopard 0; grass 567, bush 1; food cells 4922; mouths/zebra 0.98; zebras with killer 9%. Change since last frame: zebra -138 (-57%), bush -66 (-99%) | bush collapse at 22400 (peak 181 at 4300) |
| 22500 | `base/base-plantkill-control-1/event-022500-bush-extinct.png` | zebra 90, rhino 0, leopard 0; grass 582, bush 0; food cells 5054; mouths/zebra 0.96; zebras with killer 6% | bush extinct at 22500 (peak 181 at 4300) |
| 27400 | `base/base-plantkill-control-1/event-027400-zebra-collapse.png` | zebra 2, rhino 0, leopard 0; grass 592, bush 0; food cells 7103; mouths/zebra 1.00. Change since last frame: zebra -88 (-98%) | zebra collapse at 27400 (peak 594 at 8000) |
| 28000 | `base/base-plantkill-control-1/event-028000-zebra-extinct.png` | zebra 0, rhino 0, leopard 0; grass 654, bush 0; food cells 7378; mouths/zebra 0.00 | zebra extinct at 28000 (peak 594 at 8000) |
| 28000 | `base/base-plantkill-control-1/frame-028000.png` | zebra 0, rhino 0, leopard 0; grass 654, bush 0; food cells 7378; mouths/zebra 0.00 | - |

#### base/base-plantkill-control-2

- **zebra: evolutionary suicide (all 4 criteria).** 36 -> peak 528 at tick 1500; extinct at tick 14005; share with a killer cell rose by 100%; mouths per animal rose by 1.20; food plants 386 at the peak -> 0 at extinction; main cause of death after the peak: attack (4732).
- **rhino: boom then collapse, no trait (unresolved).** 12 -> peak 70 at tick 700; extinct at tick 4400; food plants 424 at the peak -> 112 at extinction; main cause of death after the peak: age (133).

| tick | screenshot | state | events since previous frame |
|---|---|---|---|
| 0 | `base/base-plantkill-control-2/frame-000000.png` | zebra 36, rhino 12, leopard 0; grass 140, bush 45; food cells 0; mouths/zebra 1.00 | - |
| 2500 | `base/base-plantkill-control-2/frame-002500.png` | zebra 377, rhino 8, leopard 0; grass 248, bush 51; food cells 530; mouths/zebra 1.07; zebras with killer 5%. Change since last frame: zebra +341 (+947%), rhino -4 (-33%), grass +108 (+77%) | - |
| 4200 | `base/base-plantkill-control-2/event-004200-rhino-collapse.png` | zebra 226, rhino 1, leopard 0; grass 120, bush 34; food cells 354; mouths/zebra 1.40; zebras with killer 14%. Change since last frame: zebra -151 (-40%), rhino -7 (-88%), grass -128 (-52%), bush -17 (-33%) | rhino collapse at 4200 (peak 70 at 700) |
| 4400 | `base/base-plantkill-control-2/event-004400-rhino-extinct.png` | zebra 170, rhino 0, leopard 0; grass 75, bush 37; food cells 405; mouths/zebra 1.42; zebras with killer 21%. Change since last frame: grass -45 (-38%) | rhino extinct at 4400 (peak 70 at 700) |
| 4900 | `base/base-plantkill-control-2/event-004900-bush-collapse.png` | zebra 59, rhino 0, leopard 0; grass 21, bush 0; food cells 197; mouths/zebra 1.80; zebras with killer 58%. Change since last frame: zebra -111 (-65%), grass -54 (-72%), bush -37 (-100%) | bush collapse at 4900 (peak 121 at 400); bush extinct at 4900 (peak 121 at 400) |
| 4900 | `base/base-plantkill-control-2/event-004900-bush-extinct.png` | zebra 59, rhino 0, leopard 0; grass 21, bush 0; food cells 197; mouths/zebra 1.80; zebras with killer 58% | - |
| 5100 | `base/base-plantkill-control-2/event-005100-grass-collapse.png` | zebra 41, rhino 0, leopard 0; grass 2, bush 0; food cells 82; mouths/zebra 1.85; zebras with killer 78%. Change since last frame: zebra -18 (-31%), grass -19 (-90%) | grass collapse at 5100 (peak 431 at 300) |
| 10000 | `base/base-plantkill-control-2/frame-010000.png` | zebra 134, rhino 0, leopard 0; grass 63, bush 0; food cells 132; mouths/zebra 1.96; zebras with killer 11%. Change since last frame: zebra +93 (+227%), grass +61 (+3050%) | - |
| 11700 | `base/base-plantkill-control-2/event-011700-grass-extinct.png` | zebra 15, rhino 0, leopard 0; grass 0, bush 0; food cells 50; mouths/zebra 2.00; zebras with killer 100%. Change since last frame: zebra -119 (-89%), grass -63 (-100%) | grass extinct at 11700 (peak 431 at 300) |
| 13700 | `base/base-plantkill-control-2/event-013700-zebra-collapse.png` | zebra 2, rhino 0, leopard 0; grass 0, bush 0; food cells 47; mouths/zebra 2.00; zebras with killer 100%. Change since last frame: zebra -13 (-87%) | zebra collapse at 13700 (peak 528 at 1500) |
| 14005 | `base/base-plantkill-control-2/frame-014005.png` | zebra 0, rhino 0, leopard 0; grass 0, bush 0; food cells 59; mouths/zebra 0.00 | zebra extinct at 14005 (peak 528 at 1500) |

#### base/base-plantkill-control-3

- **zebra: suicide candidate (3 of 4).** 36 -> peak 582 at tick 1300; extinct at tick 11850; share with a killer cell rose by 100%; mouths per animal rose by 0.79; food plants 390 at the peak -> 567 at extinction; main cause of death after the peak: attack (12349).
- **rhino: boom then collapse, no trait (unresolved).** 12 -> peak 62 at tick 700; extinct at tick 3900; food plants 490 at the peak -> 339 at extinction; main cause of death after the peak: age (90).

| tick | screenshot | state | events since previous frame |
|---|---|---|---|
| 0 | `base/base-plantkill-control-3/frame-000000.png` | zebra 36, rhino 12, leopard 0; grass 140, bush 45; food cells 0; mouths/zebra 1.00 | - |
| 2500 | `base/base-plantkill-control-3/frame-002500.png` | zebra 502, rhino 12, leopard 0; grass 196, bush 151; food cells 528; mouths/zebra 1.02; zebras with killer 1%. Change since last frame: zebra +466 (+1294%), grass +56 (+40%), bush +106 (+236%) | - |
| 3800 | `base/base-plantkill-control-3/event-003800-rhino-collapse.png` | zebra 292, rhino 1, leopard 0; grass 178, bush 125; food cells 693; mouths/zebra 1.04; zebras with killer 5%. Change since last frame: zebra -210 (-42%), rhino -11 (-92%) | rhino collapse at 3800 (peak 62 at 700) |
| 3900 | `base/base-plantkill-control-3/event-003900-rhino-extinct.png` | zebra 293, rhino 0, leopard 0; grass 208, bush 131; food cells 706; mouths/zebra 1.04; zebras with killer 3% | rhino extinct at 3900 (peak 62 at 700) |
| 10000 | `base/base-plantkill-control-3/frame-010000.png` | zebra 131, rhino 0, leopard 0; grass 429, bush 10; food cells 2090; mouths/zebra 1.11; zebras with killer 12%. Change since last frame: zebra -162 (-55%), grass +221 (+106%), bush -121 (-92%) | - |
| 10800 | `base/base-plantkill-control-3/event-010800-bush-collapse.png` | zebra 78, rhino 0, leopard 0; grass 402, bush 2; food cells 3444; mouths/zebra 1.40; zebras with killer 45%. Change since last frame: zebra -53 (-40%), bush -8 (-80%) | bush collapse at 10800 (peak 179 at 5900) |
| 11100 | `base/base-plantkill-control-3/event-011100-bush-extinct.png` | zebra 23, rhino 0, leopard 0; grass 461, bush 0; food cells 3986; mouths/zebra 1.65; zebras with killer 100%. Change since last frame: zebra -55 (-71%) | bush extinct at 11100 (peak 179 at 5900) |
| 11800 | `base/base-plantkill-control-3/event-011800-zebra-collapse.png` | zebra 1, rhino 0, leopard 0; grass 542, bush 0; food cells 5235; mouths/zebra 1.00; zebras with killer 100%. Change since last frame: zebra -22 (-96%) | zebra collapse at 11800 (peak 582 at 1300) |
| 11850 | `base/base-plantkill-control-3/frame-011850.png` | zebra 0, rhino 0, leopard 0; grass 567, bush 0; food cells 5321; mouths/zebra 0.00 | zebra extinct at 11850 (peak 582 at 1300) |

### base-plantkill

**What we tried:** Same as route 1 but zebras start WITH the rear killer. The same mechanism, with the trait given rather than evolved.

**Outcome across seeds:**

- zebra: boom then collapse, no trait (unresolved) x3; suicide candidate (3 of 4) x2; evolutionary suicide (all 4 criteria) x1
- rhino: collapse under predation x3; boom then collapse, no trait (unresolved) x3
- leopard: not seeded x6

#### base/base-plantkill-1

- **zebra: boom then collapse, no trait (unresolved).** 36 -> peak 73 at tick 300; extinct at tick 3428; food plants 142 at the peak -> 0 at extinction; main cause of death after the peak: attack (688).
- **rhino: collapse under predation.** 12 -> peak 14 at tick 200; extinct at tick 600; food plants 244 at the peak -> 7 at extinction; main cause of death after the peak: attack (26).

| tick | screenshot | state | events since previous frame |
|---|---|---|---|
| 0 | `base/base-plantkill-1/frame-000000.png` | zebra 36, rhino 12, leopard 0; grass 140, bush 45; food cells 0; mouths/zebra 1.00; zebras with killer 100% | - |
| 500 | `base/base-plantkill-1/event-000500-bush-collapse.png` | zebra 47, rhino 1, leopard 0; grass 11, bush 0; food cells 424; mouths/zebra 1.00; zebras with killer 87%. Change since last frame: zebra +11 (+31%), rhino -11 (-92%), grass -129 (-92%), bush -45 (-100%) | rhino collapse at 500 (peak 14 at 200); bush collapse at 500 (peak 45 at 0); bush extinct at 500 (peak 45 at 0) |
| 500 | `base/base-plantkill-1/event-000500-bush-extinct.png` | zebra 47, rhino 1, leopard 0; grass 11, bush 0; food cells 424; mouths/zebra 1.00; zebras with killer 87% | - |
| 500 | `base/base-plantkill-1/event-000500-rhino-collapse.png` | zebra 47, rhino 1, leopard 0; grass 11, bush 0; food cells 424; mouths/zebra 1.00; zebras with killer 87% | - |
| 600 | `base/base-plantkill-1/event-000600-rhino-extinct.png` | zebra 44, rhino 0, leopard 0; grass 7, bush 0; food cells 152; mouths/zebra 1.00; zebras with killer 89%. Change since last frame: grass -4 (-36%) | rhino extinct at 600 (peak 14 at 200) |
| 700 | `base/base-plantkill-1/event-000700-grass-collapse.png` | zebra 35, rhino 0, leopard 0; grass 0, bush 0; food cells 76; mouths/zebra 1.00; zebras with killer 94%. Change since last frame: grass -7 (-100%) | grass collapse at 700 (peak 205 at 200); grass extinct at 700 (peak 205 at 200) |
| 700 | `base/base-plantkill-1/event-000700-grass-extinct.png` | zebra 35, rhino 0, leopard 0; grass 0, bush 0; food cells 76; mouths/zebra 1.00; zebras with killer 94% | - |
| 1600 | `base/base-plantkill-1/event-001600-zebra-collapse.png` | zebra 1, rhino 0, leopard 0; grass 0, bush 0; food cells 76; mouths/zebra 1.00; zebras with killer 100%. Change since last frame: zebra -34 (-97%) | zebra collapse at 1600 (peak 73 at 300) |
| 2500 | `base/base-plantkill-1/frame-002500.png` | zebra 2, rhino 0, leopard 0; grass 0, bush 0; food cells 52; mouths/zebra 1.00; zebras with killer 100% | - |
| 3428 | `base/base-plantkill-1/frame-003428.png` | zebra 0, rhino 0, leopard 0; grass 0, bush 0; food cells 50; mouths/zebra 0.00 | zebra extinct at 3428 (peak 73 at 300) |

#### base/base-plantkill-2

- **zebra: boom then collapse, no trait (unresolved).** 36 -> peak 61 at tick 400; extinct at tick 3178; food plants 119 at the peak -> 0 at extinction; main cause of death after the peak: attack (625).
- **rhino: collapse under predation.** 12 -> peak 15 at tick 200; extinct at tick 1000; mouths per animal rose by 1.00; food plants 286 at the peak -> 0 at extinction; main cause of death after the peak: attack (42).

| tick | screenshot | state | events since previous frame |
|---|---|---|---|
| 0 | `base/base-plantkill-2/frame-000000.png` | zebra 36, rhino 12, leopard 0; grass 140, bush 45; food cells 0; mouths/zebra 1.00; zebras with killer 100% | - |
| 700 | `base/base-plantkill-2/event-000700-bush-collapse.png` | zebra 34, rhino 4, leopard 0; grass 2, bush 2; food cells 251; mouths/zebra 1.00; zebras with killer 100%. Change since last frame: rhino -8 (-67%), grass -138 (-99%), bush -43 (-96%) | bush collapse at 700 (peak 53 at 100); grass collapse at 700 (peak 239 at 200) |
| 700 | `base/base-plantkill-2/event-000700-grass-collapse.png` | zebra 34, rhino 4, leopard 0; grass 2, bush 2; food cells 251; mouths/zebra 1.00; zebras with killer 100% | - |
| 800 | `base/base-plantkill-2/event-000800-grass-extinct.png` | zebra 28, rhino 1, leopard 0; grass 0, bush 1; food cells 142; mouths/zebra 1.00; zebras with killer 100%. Change since last frame: rhino -3 (-75%) | rhino collapse at 800 (peak 15 at 200); grass extinct at 800 (peak 239 at 200) |
| 800 | `base/base-plantkill-2/event-000800-rhino-collapse.png` | zebra 28, rhino 1, leopard 0; grass 0, bush 1; food cells 142; mouths/zebra 1.00; zebras with killer 100% | - |
| 900 | `base/base-plantkill-2/event-000900-bush-extinct.png` | zebra 23, rhino 2, leopard 0; grass 0, bush 0; food cells 44; mouths/zebra 1.00; zebras with killer 100% | bush extinct at 900 (peak 53 at 100) |
| 1000 | `base/base-plantkill-2/event-001000-rhino-extinct.png` | zebra 16, rhino 0, leopard 0; grass 0, bush 0; food cells 71; mouths/zebra 1.00; zebras with killer 100%. Change since last frame: zebra -7 (-30%) | rhino extinct at 1000 (peak 15 at 200) |
| 2500 | `base/base-plantkill-2/frame-002500.png` | zebra 10, rhino 0, leopard 0; grass 0, bush 0; food cells 9; mouths/zebra 1.00; zebras with killer 100%. Change since last frame: zebra -6 (-38%) | - |
| 2900 | `base/base-plantkill-2/event-002900-zebra-collapse.png` | zebra 2, rhino 0, leopard 0; grass 0, bush 0; food cells 38; mouths/zebra 1.00; zebras with killer 100%. Change since last frame: zebra -8 (-80%) | zebra collapse at 2900 (peak 61 at 400) |
| 3178 | `base/base-plantkill-2/frame-003178.png` | zebra 0, rhino 0, leopard 0; grass 0, bush 0; food cells 48; mouths/zebra 0.00 | zebra extinct at 3178 (peak 61 at 400) |

#### base/base-plantkill-3

- **zebra: boom then collapse, no trait (unresolved).** 36 -> peak 67 at tick 400; extinct at tick 2773; food plants 91 at the peak -> 0 at extinction; main cause of death after the peak: attack (681).
- **rhino: collapse under predation.** 12 -> peak 19 at tick 400; extinct at tick 1200; food plants 91 at the peak -> 1 at extinction; main cause of death after the peak: attack (46).

| tick | screenshot | state | events since previous frame |
|---|---|---|---|
| 0 | `base/base-plantkill-3/frame-000000.png` | zebra 36, rhino 12, leopard 0; grass 140, bush 45; food cells 0; mouths/zebra 1.00; zebras with killer 100% | - |
| 800 | `base/base-plantkill-3/event-000800-bush-collapse.png` | zebra 26, rhino 8, leopard 0; grass 17, bush 2; food cells 295; mouths/zebra 1.04; zebras with killer 100%. Change since last frame: zebra -10 (-28%), rhino -4 (-33%), grass -123 (-88%), bush -43 (-96%) | bush collapse at 800 (peak 53 at 100) |
| 1000 | `base/base-plantkill-3/event-001000-bush-extinct.png` | zebra 26, rhino 2, leopard 0; grass 8, bush 0; food cells 168; mouths/zebra 1.00; zebras with killer 100%. Change since last frame: rhino -6 (-75%), grass -9 (-53%) | rhino collapse at 1000 (peak 19 at 400); bush extinct at 1000 (peak 53 at 100) |
| 1000 | `base/base-plantkill-3/event-001000-rhino-collapse.png` | zebra 26, rhino 2, leopard 0; grass 8, bush 0; food cells 168; mouths/zebra 1.00; zebras with killer 100% | - |
| 1200 | `base/base-plantkill-3/event-001200-grass-collapse.png` | zebra 23, rhino 0, leopard 0; grass 1, bush 0; food cells 92; mouths/zebra 1.00; zebras with killer 100%. Change since last frame: grass -7 (-88%) | grass collapse at 1200 (peak 217 at 200); rhino extinct at 1200 (peak 19 at 400) |
| 1200 | `base/base-plantkill-3/event-001200-rhino-extinct.png` | zebra 23, rhino 0, leopard 0; grass 1, bush 0; food cells 92; mouths/zebra 1.00; zebras with killer 100% | - |
| 1500 | `base/base-plantkill-3/event-001500-grass-extinct.png` | zebra 16, rhino 0, leopard 0; grass 0, bush 0; food cells 60; mouths/zebra 1.00; zebras with killer 100%. Change since last frame: zebra -7 (-30%) | grass extinct at 1500 (peak 217 at 200) |
| 2500 | `base/base-plantkill-3/frame-002500.png` | zebra 6, rhino 0, leopard 0; grass 0, bush 0; food cells 33; mouths/zebra 1.00; zebras with killer 100%. Change since last frame: zebra -10 (-62%) | - |
| 2700 | `base/base-plantkill-3/event-002700-zebra-collapse.png` | zebra 1, rhino 0, leopard 0; grass 0, bush 0; food cells 55; mouths/zebra 1.00; zebras with killer 100%. Change since last frame: zebra -5 (-83%) | zebra collapse at 2700 (peak 67 at 400) |
| 2773 | `base/base-plantkill-3/frame-002773.png` | zebra 0, rhino 0, leopard 0; grass 0, bush 0; food cells 59; mouths/zebra 0.00 | zebra extinct at 2773 (peak 67 at 400) |

#### base/base-plantkill-control-1

- **zebra: suicide candidate (3 of 4).** 36 -> peak 594 at tick 8000; extinct at tick 28000; mouths per animal rose by 0.77; food plants 523 at the peak -> 654 at extinction; main cause of death after the peak: attack (29020).
- **rhino: boom then collapse, no trait (unresolved).** 12 -> peak 54 at tick 700; extinct at tick 4400; food plants 477 at the peak -> 411 at extinction; main cause of death after the peak: age (64).

| tick | screenshot | state | events since previous frame |
|---|---|---|---|
| 0 | `base/base-plantkill-control-1/frame-000000.png` | zebra 36, rhino 12, leopard 0; grass 140, bush 45; food cells 0; mouths/zebra 1.00 | - |
| 2500 | `base/base-plantkill-control-1/frame-002500.png` | zebra 533, rhino 6, leopard 0; grass 323, bush 102; food cells 708; mouths/zebra 1.04. Change since last frame: zebra +497 (+1381%), rhino -6 (-50%), grass +183 (+131%), bush +57 (+127%) | - |
| 3000 | `base/base-plantkill-control-1/event-003000-rhino-collapse.png` | zebra 534, rhino 2, leopard 0; grass 309, bush 120; food cells 734; mouths/zebra 1.10; zebras with killer 1%. Change since last frame: rhino -4 (-67%) | rhino collapse at 3000 (peak 54 at 700) |
| 4400 | `base/base-plantkill-control-1/event-004400-rhino-extinct.png` | zebra 517, rhino 0, leopard 0; grass 239, bush 172; food cells 698; mouths/zebra 1.34; zebras with killer 1%. Change since last frame: bush +52 (+43%) | rhino extinct at 4400 (peak 54 at 700) |
| 10000 | `base/base-plantkill-control-1/frame-010000.png` | zebra 317, rhino 0, leopard 0; grass 180, bush 80; food cells 489; mouths/zebra 1.54; zebras with killer 8%. Change since last frame: zebra -200 (-39%), bush -92 (-53%) | - |
| 20000 | `base/base-plantkill-control-1/frame-020000.png` | zebra 241, rhino 0, leopard 0; grass 568, bush 67; food cells 3917; mouths/zebra 1.54; zebras with killer 8%. Change since last frame: grass +388 (+216%) | - |
| 22400 | `base/base-plantkill-control-1/event-022400-bush-collapse.png` | zebra 103, rhino 0, leopard 0; grass 567, bush 1; food cells 4922; mouths/zebra 0.98; zebras with killer 9%. Change since last frame: zebra -138 (-57%), bush -66 (-99%) | bush collapse at 22400 (peak 181 at 4300) |
| 22500 | `base/base-plantkill-control-1/event-022500-bush-extinct.png` | zebra 90, rhino 0, leopard 0; grass 582, bush 0; food cells 5054; mouths/zebra 0.96; zebras with killer 6% | bush extinct at 22500 (peak 181 at 4300) |
| 27400 | `base/base-plantkill-control-1/event-027400-zebra-collapse.png` | zebra 2, rhino 0, leopard 0; grass 592, bush 0; food cells 7103; mouths/zebra 1.00. Change since last frame: zebra -88 (-98%) | zebra collapse at 27400 (peak 594 at 8000) |
| 28000 | `base/base-plantkill-control-1/event-028000-zebra-extinct.png` | zebra 0, rhino 0, leopard 0; grass 654, bush 0; food cells 7378; mouths/zebra 0.00 | zebra extinct at 28000 (peak 594 at 8000) |
| 28000 | `base/base-plantkill-control-1/frame-028000.png` | zebra 0, rhino 0, leopard 0; grass 654, bush 0; food cells 7378; mouths/zebra 0.00 | - |

#### base/base-plantkill-control-2

- **zebra: evolutionary suicide (all 4 criteria).** 36 -> peak 528 at tick 1500; extinct at tick 14005; share with a killer cell rose by 100%; mouths per animal rose by 1.20; food plants 386 at the peak -> 0 at extinction; main cause of death after the peak: attack (4732).
- **rhino: boom then collapse, no trait (unresolved).** 12 -> peak 70 at tick 700; extinct at tick 4400; food plants 424 at the peak -> 112 at extinction; main cause of death after the peak: age (133).

| tick | screenshot | state | events since previous frame |
|---|---|---|---|
| 0 | `base/base-plantkill-control-2/frame-000000.png` | zebra 36, rhino 12, leopard 0; grass 140, bush 45; food cells 0; mouths/zebra 1.00 | - |
| 2500 | `base/base-plantkill-control-2/frame-002500.png` | zebra 377, rhino 8, leopard 0; grass 248, bush 51; food cells 530; mouths/zebra 1.07; zebras with killer 5%. Change since last frame: zebra +341 (+947%), rhino -4 (-33%), grass +108 (+77%) | - |
| 4200 | `base/base-plantkill-control-2/event-004200-rhino-collapse.png` | zebra 226, rhino 1, leopard 0; grass 120, bush 34; food cells 354; mouths/zebra 1.40; zebras with killer 14%. Change since last frame: zebra -151 (-40%), rhino -7 (-88%), grass -128 (-52%), bush -17 (-33%) | rhino collapse at 4200 (peak 70 at 700) |
| 4400 | `base/base-plantkill-control-2/event-004400-rhino-extinct.png` | zebra 170, rhino 0, leopard 0; grass 75, bush 37; food cells 405; mouths/zebra 1.42; zebras with killer 21%. Change since last frame: grass -45 (-38%) | rhino extinct at 4400 (peak 70 at 700) |
| 4900 | `base/base-plantkill-control-2/event-004900-bush-collapse.png` | zebra 59, rhino 0, leopard 0; grass 21, bush 0; food cells 197; mouths/zebra 1.80; zebras with killer 58%. Change since last frame: zebra -111 (-65%), grass -54 (-72%), bush -37 (-100%) | bush collapse at 4900 (peak 121 at 400); bush extinct at 4900 (peak 121 at 400) |
| 4900 | `base/base-plantkill-control-2/event-004900-bush-extinct.png` | zebra 59, rhino 0, leopard 0; grass 21, bush 0; food cells 197; mouths/zebra 1.80; zebras with killer 58% | - |
| 5100 | `base/base-plantkill-control-2/event-005100-grass-collapse.png` | zebra 41, rhino 0, leopard 0; grass 2, bush 0; food cells 82; mouths/zebra 1.85; zebras with killer 78%. Change since last frame: zebra -18 (-31%), grass -19 (-90%) | grass collapse at 5100 (peak 431 at 300) |
| 10000 | `base/base-plantkill-control-2/frame-010000.png` | zebra 134, rhino 0, leopard 0; grass 63, bush 0; food cells 132; mouths/zebra 1.96; zebras with killer 11%. Change since last frame: zebra +93 (+227%), grass +61 (+3050%) | - |
| 11700 | `base/base-plantkill-control-2/event-011700-grass-extinct.png` | zebra 15, rhino 0, leopard 0; grass 0, bush 0; food cells 50; mouths/zebra 2.00; zebras with killer 100%. Change since last frame: zebra -119 (-89%), grass -63 (-100%) | grass extinct at 11700 (peak 431 at 300) |
| 13700 | `base/base-plantkill-control-2/event-013700-zebra-collapse.png` | zebra 2, rhino 0, leopard 0; grass 0, bush 0; food cells 47; mouths/zebra 2.00; zebras with killer 100%. Change since last frame: zebra -13 (-87%) | zebra collapse at 13700 (peak 528 at 1500) |
| 14005 | `base/base-plantkill-control-2/frame-014005.png` | zebra 0, rhino 0, leopard 0; grass 0, bush 0; food cells 59; mouths/zebra 0.00 | zebra extinct at 14005 (peak 528 at 1500) |

#### base/base-plantkill-control-3

- **zebra: suicide candidate (3 of 4).** 36 -> peak 582 at tick 1300; extinct at tick 11850; share with a killer cell rose by 100%; mouths per animal rose by 0.79; food plants 390 at the peak -> 567 at extinction; main cause of death after the peak: attack (12349).
- **rhino: boom then collapse, no trait (unresolved).** 12 -> peak 62 at tick 700; extinct at tick 3900; food plants 490 at the peak -> 339 at extinction; main cause of death after the peak: age (90).

| tick | screenshot | state | events since previous frame |
|---|---|---|---|
| 0 | `base/base-plantkill-control-3/frame-000000.png` | zebra 36, rhino 12, leopard 0; grass 140, bush 45; food cells 0; mouths/zebra 1.00 | - |
| 2500 | `base/base-plantkill-control-3/frame-002500.png` | zebra 502, rhino 12, leopard 0; grass 196, bush 151; food cells 528; mouths/zebra 1.02; zebras with killer 1%. Change since last frame: zebra +466 (+1294%), grass +56 (+40%), bush +106 (+236%) | - |
| 3800 | `base/base-plantkill-control-3/event-003800-rhino-collapse.png` | zebra 292, rhino 1, leopard 0; grass 178, bush 125; food cells 693; mouths/zebra 1.04; zebras with killer 5%. Change since last frame: zebra -210 (-42%), rhino -11 (-92%) | rhino collapse at 3800 (peak 62 at 700) |
| 3900 | `base/base-plantkill-control-3/event-003900-rhino-extinct.png` | zebra 293, rhino 0, leopard 0; grass 208, bush 131; food cells 706; mouths/zebra 1.04; zebras with killer 3% | rhino extinct at 3900 (peak 62 at 700) |
| 10000 | `base/base-plantkill-control-3/frame-010000.png` | zebra 131, rhino 0, leopard 0; grass 429, bush 10; food cells 2090; mouths/zebra 1.11; zebras with killer 12%. Change since last frame: zebra -162 (-55%), grass +221 (+106%), bush -121 (-92%) | - |
| 10800 | `base/base-plantkill-control-3/event-010800-bush-collapse.png` | zebra 78, rhino 0, leopard 0; grass 402, bush 2; food cells 3444; mouths/zebra 1.40; zebras with killer 45%. Change since last frame: zebra -53 (-40%), bush -8 (-80%) | bush collapse at 10800 (peak 179 at 5900) |
| 11100 | `base/base-plantkill-control-3/event-011100-bush-extinct.png` | zebra 23, rhino 0, leopard 0; grass 461, bush 0; food cells 3986; mouths/zebra 1.65; zebras with killer 100%. Change since last frame: zebra -55 (-71%) | bush extinct at 11100 (peak 179 at 5900) |
| 11800 | `base/base-plantkill-control-3/event-011800-zebra-collapse.png` | zebra 1, rhino 0, leopard 0; grass 542, bush 0; food cells 5235; mouths/zebra 1.00; zebras with killer 100%. Change since last frame: zebra -22 (-96%) | zebra collapse at 11800 (peak 582 at 1300) |
| 11850 | `base/base-plantkill-control-3/frame-011850.png` | zebra 0, rhino 0, leopard 0; grass 567, bush 0; food cells 5321; mouths/zebra 0.00 | zebra extinct at 11850 (peak 582 at 1300) |

### base-harsh

**What we tried:** Scarcity: food production 2. Does a species fail, or adapt?

**Outcome across seeds:**

- zebra: boom then collapse, no trait (unresolved) x3
- rhino: collapse under predation x3
- leopard: failure to adapt x2; boom-bust: over-predation x1

#### base/base-harsh-1

- **zebra: boom then collapse, no trait (unresolved).** 36 -> peak 106 at tick 400; extinct at tick 4150; food plants 33 at the peak -> 0 at extinction; main cause of death after the peak: attack (505).
- **rhino: collapse under predation.** 12 -> peak 24 at tick 400; extinct at tick 1500; food plants 33 at the peak -> 0 at extinction; main cause of death after the peak: attack (35).
- **leopard: failure to adapt.** 16 -> peak 22 at tick 200; extinct at tick 1100; food plants 177 at the peak -> 0 at extinction; main cause of death after the peak: attack (54).

| tick | screenshot | state | events since previous frame |
|---|---|---|---|
| 0 | `base/base-harsh-1/frame-000000.png` | zebra 36, rhino 12, leopard 16; grass 140, bush 45; food cells 0; mouths/zebra 1.00; zebras with killer 100% | - |
| 500 | `base/base-harsh-1/event-000500-bush-collapse.png` | zebra 70, rhino 21, leopard 9; grass 10, bush 1; food cells 166; mouths/zebra 1.00; zebras with killer 99%; rhinos with killer 5%. Change since last frame: zebra +34 (+94%), rhino +9 (+75%), leopard -7 (-44%), grass -130 (-93%), bush -44 (-98%) | bush collapse at 500 (peak 46 at 100) |
| 600 | `base/base-harsh-1/event-000600-bush-extinct.png` | zebra 64, rhino 20, leopard 5; grass 5, bush 0; food cells 70; mouths/zebra 1.00; zebras with killer 100%; rhinos with killer 5%. Change since last frame: leopard -4 (-44%), grass -5 (-50%) | bush extinct at 600 (peak 46 at 100) |
| 800 | `base/base-harsh-1/event-000800-grass-collapse.png` | zebra 48, rhino 13, leopard 2; grass 2, bush 0; food cells 51; mouths/zebra 1.00; zebras with killer 100%; rhinos with killer 8%. Change since last frame: zebra -16 (-25%), rhino -7 (-35%), leopard -3 (-60%), grass -3 (-60%) | leopard collapse at 800 (peak 22 at 200); grass collapse at 800 (peak 155 at 100) |
| 800 | `base/base-harsh-1/event-000800-leopard-collapse.png` | zebra 48, rhino 13, leopard 2; grass 2, bush 0; food cells 51; mouths/zebra 1.00; zebras with killer 100%; rhinos with killer 8% | - |
| 900 | `base/base-harsh-1/event-000900-grass-extinct.png` | zebra 43, rhino 11, leopard 1; grass 0, bush 0; food cells 34; mouths/zebra 1.00; zebras with killer 100%; rhinos with killer 9% | grass extinct at 900 (peak 155 at 100) |
| 1100 | `base/base-harsh-1/event-001100-leopard-extinct.png` | zebra 39, rhino 5, leopard 0; grass 0, bush 0; food cells 19; mouths/zebra 1.00; zebras with killer 100%; rhinos with killer 20%. Change since last frame: rhino -6 (-55%) | leopard extinct at 1100 (peak 22 at 200) |
| 1300 | `base/base-harsh-1/event-001300-rhino-collapse.png` | zebra 36, rhino 2, leopard 0; grass 0, bush 0; food cells 6; mouths/zebra 1.00; zebras with killer 100%. Change since last frame: rhino -3 (-60%) | rhino collapse at 1300 (peak 24 at 400) |
| 1500 | `base/base-harsh-1/event-001500-rhino-extinct.png` | zebra 27, rhino 0, leopard 0; grass 0, bush 0; food cells 35; mouths/zebra 1.00; zebras with killer 100%. Change since last frame: zebra -9 (-25%) | rhino extinct at 1500 (peak 24 at 400) |
| 2500 | `base/base-harsh-1/frame-002500.png` | zebra 10, rhino 0, leopard 0; grass 0, bush 0; food cells 34; mouths/zebra 1.00; zebras with killer 100%. Change since last frame: zebra -17 (-63%) | - |
| 4000 | `base/base-harsh-1/event-004000-zebra-collapse.png` | zebra 1, rhino 0, leopard 0; grass 0, bush 0; food cells 39; mouths/zebra 1.00; zebras with killer 100%. Change since last frame: zebra -9 (-90%) | zebra collapse at 4000 (peak 106 at 400) |
| 4150 | `base/base-harsh-1/frame-004150.png` | zebra 0, rhino 0, leopard 0; grass 0, bush 0; food cells 44; mouths/zebra 0.00 | zebra extinct at 4150 (peak 106 at 400) |

#### base/base-harsh-2

- **zebra: boom then collapse, no trait (unresolved).** 36 -> peak 120 at tick 400; extinct at tick 5902; food plants 39 at the peak -> 0 at extinction; main cause of death after the peak: attack (627).
- **rhino: collapse under predation.** 12 -> peak 17 at tick 500; extinct at tick 1600; food plants 10 at the peak -> 0 at extinction; main cause of death after the peak: attack (20).
- **leopard: boom-bust: over-predation.** 16 -> peak 27 at tick 300; extinct at tick 900; food plants 117 at the peak -> 0 at extinction; main cause of death after the peak: attack (72).

| tick | screenshot | state | events since previous frame |
|---|---|---|---|
| 0 | `base/base-harsh-2/frame-000000.png` | zebra 36, rhino 12, leopard 16; grass 140, bush 45; food cells 0; mouths/zebra 1.00; zebras with killer 100% | - |
| 500 | `base/base-harsh-2/event-000500-bush-collapse.png` | zebra 104, rhino 17, leopard 7; grass 10, bush 0; food cells 127; mouths/zebra 1.05; zebras with killer 99%. Change since last frame: zebra +68 (+189%), rhino +5 (+42%), leopard -9 (-56%), grass -130 (-93%), bush -45 (-100%) | bush collapse at 500 (peak 52 at 100); bush extinct at 500 (peak 52 at 100) |
| 500 | `base/base-harsh-2/event-000500-bush-extinct.png` | zebra 104, rhino 17, leopard 7; grass 10, bush 0; food cells 127; mouths/zebra 1.05; zebras with killer 99% | - |
| 700 | `base/base-harsh-2/event-000700-grass-collapse.png` | zebra 72, rhino 9, leopard 3; grass 0, bush 0; food cells 53; mouths/zebra 1.07; zebras with killer 100%. Change since last frame: zebra -32 (-31%), rhino -8 (-47%), leopard -4 (-57%), grass -10 (-100%) | grass collapse at 700 (peak 164 at 200); grass extinct at 700 (peak 164 at 200) |
| 700 | `base/base-harsh-2/event-000700-grass-extinct.png` | zebra 72, rhino 9, leopard 3; grass 0, bush 0; food cells 53; mouths/zebra 1.07; zebras with killer 100% | - |
| 800 | `base/base-harsh-2/event-000800-leopard-collapse.png` | zebra 57, rhino 6, leopard 2; grass 0, bush 0; food cells 61; mouths/zebra 1.09; zebras with killer 100%. Change since last frame: rhino -3 (-33%) | leopard collapse at 800 (peak 27 at 300) |
| 900 | `base/base-harsh-2/event-000900-leopard-extinct.png` | zebra 53, rhino 4, leopard 0; grass 0, bush 0; food cells 53; mouths/zebra 1.08; zebras with killer 100% | leopard extinct at 900 (peak 27 at 300) |
| 1200 | `base/base-harsh-2/event-001200-rhino-collapse.png` | zebra 39, rhino 2, leopard 0; grass 0, bush 0; food cells 14; mouths/zebra 1.15; zebras with killer 100%. Change since last frame: zebra -14 (-26%) | rhino collapse at 1200 (peak 17 at 500) |
| 1600 | `base/base-harsh-2/event-001600-rhino-extinct.png` | zebra 29, rhino 0, leopard 0; grass 0, bush 0; food cells 23; mouths/zebra 1.07; zebras with killer 100%. Change since last frame: zebra -10 (-26%) | rhino extinct at 1600 (peak 17 at 500) |
| 2500 | `base/base-harsh-2/frame-002500.png` | zebra 14, rhino 0, leopard 0; grass 0, bush 0; food cells 22; mouths/zebra 1.00; zebras with killer 100%. Change since last frame: zebra -15 (-52%) | - |
| 4500 | `base/base-harsh-2/event-004500-zebra-collapse.png` | zebra 2, rhino 0, leopard 0; grass 0, bush 0; food cells 44; mouths/zebra 1.00; zebras with killer 100%. Change since last frame: zebra -12 (-86%) | zebra collapse at 4500 (peak 120 at 400) |
| 5902 | `base/base-harsh-2/frame-005902.png` | zebra 0, rhino 0, leopard 0; grass 0, bush 0; food cells 42; mouths/zebra 0.00 | zebra extinct at 5902 (peak 120 at 400) |

#### base/base-harsh-3

- **zebra: boom then collapse, no trait (unresolved).** 36 -> peak 114 at tick 400; extinct at tick 5071; food plants 29 at the peak -> 0 at extinction; main cause of death after the peak: attack (555).
- **rhino: collapse under predation.** 12 -> peak 22 at tick 300; extinct at tick 1600; food plants 92 at the peak -> 0 at extinction; main cause of death after the peak: attack (27).
- **leopard: failure to adapt.** 16 -> peak 22 at tick 200; extinct at tick 900; food plants 191 at the peak -> 4 at extinction; main cause of death after the peak: attack (52).

| tick | screenshot | state | events since previous frame |
|---|---|---|---|
| 0 | `base/base-harsh-3/frame-000000.png` | zebra 36, rhino 12, leopard 16; grass 140, bush 45; food cells 0; mouths/zebra 1.00; zebras with killer 100% | - |
| 500 | `base/base-harsh-3/event-000500-bush-collapse.png` | zebra 93, rhino 14, leopard 6; grass 3, bush 0; food cells 129; mouths/zebra 1.01; zebras with killer 96%. Change since last frame: zebra +57 (+158%), leopard -10 (-62%), grass -137 (-98%), bush -45 (-100%) | bush collapse at 500 (peak 45 at 0); bush extinct at 500 (peak 45 at 0) |
| 500 | `base/base-harsh-3/event-000500-bush-extinct.png` | zebra 93, rhino 14, leopard 6; grass 3, bush 0; food cells 129; mouths/zebra 1.01; zebras with killer 96% | - |
| 600 | `base/base-harsh-3/event-000600-grass-collapse.png` | zebra 65, rhino 14, leopard 2; grass 2, bush 0; food cells 43; mouths/zebra 1.02; zebras with killer 97%. Change since last frame: zebra -28 (-30%), leopard -4 (-67%) | leopard collapse at 600 (peak 22 at 200); grass collapse at 600 (peak 157 at 100) |
| 600 | `base/base-harsh-3/event-000600-leopard-collapse.png` | zebra 65, rhino 14, leopard 2; grass 2, bush 0; food cells 43; mouths/zebra 1.02; zebras with killer 97% | - |
| 900 | `base/base-harsh-3/event-000900-leopard-extinct.png` | zebra 42, rhino 5, leopard 0; grass 4, bush 0; food cells 47; mouths/zebra 1.00; zebras with killer 98%. Change since last frame: zebra -23 (-35%), rhino -9 (-64%) | leopard extinct at 900 (peak 22 at 200) |
| 1200 | `base/base-harsh-3/event-001200-rhino-collapse.png` | zebra 39, rhino 2, leopard 0; grass 1, bush 0; food cells 37; mouths/zebra 1.00; zebras with killer 100%. Change since last frame: rhino -3 (-60%), grass -3 (-75%) | rhino collapse at 1200 (peak 22 at 300) |
| 1300 | `base/base-harsh-3/event-001300-grass-extinct.png` | zebra 33, rhino 2, leopard 0; grass 0, bush 0; food cells 32; mouths/zebra 1.00; zebras with killer 100% | grass extinct at 1300 (peak 157 at 100) |
| 1600 | `base/base-harsh-3/event-001600-rhino-extinct.png` | zebra 24, rhino 0, leopard 0; grass 0, bush 0; food cells 29; mouths/zebra 0.96; zebras with killer 100%. Change since last frame: zebra -9 (-27%) | rhino extinct at 1600 (peak 22 at 300) |
| 2500 | `base/base-harsh-3/frame-002500.png` | zebra 8, rhino 0, leopard 0; grass 0, bush 0; food cells 30; mouths/zebra 1.00; zebras with killer 100%. Change since last frame: zebra -16 (-67%) | - |
| 3600 | `base/base-harsh-3/event-003600-zebra-collapse.png` | zebra 2, rhino 0, leopard 0; grass 0, bush 0; food cells 41; mouths/zebra 1.00; zebras with killer 100%. Change since last frame: zebra -6 (-75%) | zebra collapse at 3600 (peak 114 at 400) |
| 5071 | `base/base-harsh-3/frame-005071.png` | zebra 0, rhino 0, leopard 0; grass 0, bush 0; food cells 45; mouths/zebra 0.00 | zebra extinct at 5071 (peak 114 at 400) |

### base-nomut

**What we tried:** Failure-to-adapt baseline: food production 2 and mutation switched off, so no species can change.

**Outcome across seeds:**

- zebra: boom then collapse, no trait (unresolved) x3
- rhino: collapse under predation x3
- leopard: boom-bust: cohort aged out x1; boom-bust: over-predation x1; failure to adapt x1

#### base/base-nomut-1

- **zebra: boom then collapse, no trait (unresolved).** 36 -> peak 76 at tick 400; extinct at tick 5507; food plants 70 at the peak -> 0 at extinction; main cause of death after the peak: attack (600).
- **rhino: collapse under predation.** 12 -> peak 30 at tick 500; extinct at tick 2000; food plants 36 at the peak -> 0 at extinction; main cause of death after the peak: attack (47).
- **leopard: boom-bust: cohort aged out.** 16 -> peak 33 at tick 200; extinct at tick 1200; food plants 196 at the peak -> 1 at extinction; main cause of death after the peak: attack (102).

| tick | screenshot | state | events since previous frame |
|---|---|---|---|
| 0 | `base/base-nomut-1/frame-000000.png` | zebra 36, rhino 12, leopard 16; grass 140, bush 45; food cells 0; mouths/zebra 1.00; zebras with killer 100% | - |
| 700 | `base/base-nomut-1/event-000700-bush-collapse.png` | zebra 70, rhino 17, leopard 7; grass 9, bush 0; food cells 126; mouths/zebra 1.00; zebras with killer 100%. Change since last frame: zebra +34 (+94%), rhino +5 (+42%), leopard -9 (-56%), grass -131 (-94%), bush -45 (-100%) | bush collapse at 700 (peak 45 at 0); bush extinct at 700 (peak 45 at 0) |
| 700 | `base/base-nomut-1/event-000700-bush-extinct.png` | zebra 70, rhino 17, leopard 7; grass 9, bush 0; food cells 126; mouths/zebra 1.00; zebras with killer 100% | - |
| 900 | `base/base-nomut-1/event-000900-leopard-collapse.png` | zebra 54, rhino 9, leopard 1; grass 5, bush 0; food cells 86; mouths/zebra 1.00; zebras with killer 100%. Change since last frame: rhino -8 (-47%), leopard -6 (-86%), grass -4 (-44%) | leopard collapse at 900 (peak 33 at 200) |
| 1100 | `base/base-nomut-1/event-001100-grass-collapse.png` | zebra 39, rhino 8, leopard 1; grass 2, bush 0; food cells 60; mouths/zebra 1.00; zebras with killer 100%. Change since last frame: zebra -15 (-28%), grass -3 (-60%) | grass collapse at 1100 (peak 165 at 200) |
| 1200 | `base/base-nomut-1/event-001200-leopard-extinct.png` | zebra 42, rhino 7, leopard 0; grass 1, bush 0; food cells 21; mouths/zebra 1.00; zebras with killer 100% | leopard extinct at 1200 (peak 33 at 200) |
| 1400 | `base/base-nomut-1/event-001400-grass-extinct.png` | zebra 37, rhino 2, leopard 0; grass 0, bush 0; food cells 27; mouths/zebra 1.00; zebras with killer 100%. Change since last frame: rhino -5 (-71%) | rhino collapse at 1400 (peak 30 at 500); grass extinct at 1400 (peak 165 at 200) |
| 1400 | `base/base-nomut-1/event-001400-rhino-collapse.png` | zebra 37, rhino 2, leopard 0; grass 0, bush 0; food cells 27; mouths/zebra 1.00; zebras with killer 100% | - |
| 2000 | `base/base-nomut-1/event-002000-rhino-extinct.png` | zebra 22, rhino 0, leopard 0; grass 0, bush 0; food cells 23; mouths/zebra 1.00; zebras with killer 100%. Change since last frame: zebra -15 (-41%) | rhino extinct at 2000 (peak 30 at 500) |
| 2500 | `base/base-nomut-1/frame-002500.png` | zebra 16, rhino 0, leopard 0; grass 0, bush 0; food cells 25; mouths/zebra 1.00; zebras with killer 100%. Change since last frame: zebra -6 (-27%) | - |
| 4200 | `base/base-nomut-1/event-004200-zebra-collapse.png` | zebra 1, rhino 0, leopard 0; grass 0, bush 0; food cells 64; mouths/zebra 1.00; zebras with killer 100%. Change since last frame: zebra -15 (-94%) | zebra collapse at 4200 (peak 76 at 400) |
| 5507 | `base/base-nomut-1/frame-005507.png` | zebra 0, rhino 0, leopard 0; grass 0, bush 0; food cells 59; mouths/zebra 0.00 | zebra extinct at 5507 (peak 76 at 400) |

#### base/base-nomut-2

- **zebra: boom then collapse, no trait (unresolved).** 36 -> peak 107 at tick 300; extinct at tick 4511; food plants 65 at the peak -> 0 at extinction; main cause of death after the peak: attack (581).
- **rhino: collapse under predation.** 12 -> peak 15 at tick 100; extinct at tick 1300; food plants 193 at the peak -> 0 at extinction; main cause of death after the peak: attack (26).
- **leopard: boom-bust: over-predation.** 16 -> peak 24 at tick 200; extinct at tick 1100; food plants 183 at the peak -> 0 at extinction; main cause of death after the peak: attack (70).

| tick | screenshot | state | events since previous frame |
|---|---|---|---|
| 0 | `base/base-nomut-2/frame-000000.png` | zebra 36, rhino 12, leopard 16; grass 140, bush 45; food cells 0; mouths/zebra 1.00; zebras with killer 100% | - |
| 600 | `base/base-nomut-2/event-000600-bush-collapse.png` | zebra 73, rhino 8, leopard 5; grass 3, bush 2; food cells 89; mouths/zebra 1.00; zebras with killer 100%. Change since last frame: zebra +37 (+103%), rhino -4 (-33%), leopard -11 (-69%), grass -137 (-98%), bush -43 (-96%) | bush collapse at 600 (peak 47 at 100) |
| 700 | `base/base-nomut-2/event-000700-grass-collapse.png` | zebra 65, rhino 8, leopard 3; grass 2, bush 2; food cells 61; mouths/zebra 1.00; zebras with killer 100% | grass collapse at 700 (peak 146 at 100) |
| 900 | `base/base-nomut-2/event-000900-grass-extinct.png` | zebra 48, rhino 3, leopard 1; grass 0, bush 2; food cells 48; mouths/zebra 1.00; zebras with killer 100%. Change since last frame: zebra -17 (-26%), rhino -5 (-62%) | leopard collapse at 900 (peak 24 at 200); grass extinct at 900 (peak 146 at 100) |
| 900 | `base/base-nomut-2/event-000900-leopard-collapse.png` | zebra 48, rhino 3, leopard 1; grass 0, bush 2; food cells 48; mouths/zebra 1.00; zebras with killer 100% | - |
| 1000 | `base/base-nomut-2/event-001000-bush-extinct.png` | zebra 42, rhino 2, leopard 1; grass 0, bush 0; food cells 28; mouths/zebra 1.00; zebras with killer 100% | rhino collapse at 1000 (peak 15 at 100); bush extinct at 1000 (peak 47 at 100) |
| 1000 | `base/base-nomut-2/event-001000-rhino-collapse.png` | zebra 42, rhino 2, leopard 1; grass 0, bush 0; food cells 28; mouths/zebra 1.00; zebras with killer 100% | - |
| 1100 | `base/base-nomut-2/event-001100-leopard-extinct.png` | zebra 37, rhino 2, leopard 0; grass 0, bush 0; food cells 12; mouths/zebra 1.00; zebras with killer 100% | leopard extinct at 1100 (peak 24 at 200) |
| 1300 | `base/base-nomut-2/event-001300-rhino-extinct.png` | zebra 26, rhino 0, leopard 0; grass 0, bush 0; food cells 24; mouths/zebra 1.00; zebras with killer 100%. Change since last frame: zebra -11 (-30%) | rhino extinct at 1300 (peak 15 at 100) |
| 2500 | `base/base-nomut-2/frame-002500.png` | zebra 12, rhino 0, leopard 0; grass 0, bush 0; food cells 12; mouths/zebra 1.00; zebras with killer 100%. Change since last frame: zebra -14 (-54%) | - |
| 2900 | `base/base-nomut-2/event-002900-zebra-collapse.png` | zebra 2, rhino 0, leopard 0; grass 0, bush 0; food cells 59; mouths/zebra 1.00; zebras with killer 100%. Change since last frame: zebra -10 (-83%) | zebra collapse at 2900 (peak 107 at 300) |
| 4511 | `base/base-nomut-2/frame-004511.png` | zebra 0, rhino 0, leopard 0; grass 0, bush 0; food cells 49; mouths/zebra 0.00 | zebra extinct at 4511 (peak 107 at 300) |

#### base/base-nomut-3

- **zebra: boom then collapse, no trait (unresolved).** 36 -> peak 97 at tick 300; extinct at tick 4652; food plants 95 at the peak -> 0 at extinction; main cause of death after the peak: attack (578).
- **rhino: collapse under predation.** 12 -> peak 18 at tick 300; extinct at tick 1900; food plants 95 at the peak -> 0 at extinction; main cause of death after the peak: attack (42).
- **leopard: failure to adapt.** 16 -> peak 22 at tick 200; extinct at tick 800; food plants 168 at the peak -> 0 at extinction; main cause of death after the peak: attack (58).

| tick | screenshot | state | events since previous frame |
|---|---|---|---|
| 0 | `base/base-nomut-3/frame-000000.png` | zebra 36, rhino 12, leopard 16; grass 140, bush 45; food cells 0; mouths/zebra 1.00; zebras with killer 100% | - |
| 600 | `base/base-nomut-3/event-000600-bush-collapse.png` | zebra 68, rhino 14, leopard 4; grass 7, bush 2; food cells 116; mouths/zebra 1.00; zebras with killer 100%. Change since last frame: zebra +32 (+89%), leopard -12 (-75%), grass -133 (-95%), bush -43 (-96%) | bush collapse at 600 (peak 46 at 200) |
| 700 | `base/base-nomut-3/event-000700-bush-extinct.png` | zebra 57, rhino 12, leopard 1; grass 2, bush 0; food cells 48; mouths/zebra 1.00; zebras with killer 100%. Change since last frame: leopard -3 (-75%), grass -5 (-71%) | grass collapse at 700 (peak 142 at 100); leopard collapse at 700 (peak 22 at 200); bush extinct at 700 (peak 46 at 200) |
| 700 | `base/base-nomut-3/event-000700-grass-collapse.png` | zebra 57, rhino 12, leopard 1; grass 2, bush 0; food cells 48; mouths/zebra 1.00; zebras with killer 100% | - |
| 700 | `base/base-nomut-3/event-000700-leopard-collapse.png` | zebra 57, rhino 12, leopard 1; grass 2, bush 0; food cells 48; mouths/zebra 1.00; zebras with killer 100% | - |
| 800 | `base/base-nomut-3/event-000800-grass-extinct.png` | zebra 47, rhino 12, leopard 0; grass 0, bush 0; food cells 52; mouths/zebra 1.00; zebras with killer 100% | leopard extinct at 800 (peak 22 at 200); grass extinct at 800 (peak 142 at 100) |
| 800 | `base/base-nomut-3/event-000800-leopard-extinct.png` | zebra 47, rhino 12, leopard 0; grass 0, bush 0; food cells 52; mouths/zebra 1.00; zebras with killer 100% | - |
| 1400 | `base/base-nomut-3/event-001400-rhino-collapse.png` | zebra 21, rhino 2, leopard 0; grass 0, bush 0; food cells 60; mouths/zebra 1.00; zebras with killer 100%. Change since last frame: zebra -26 (-55%), rhino -10 (-83%) | rhino collapse at 1400 (peak 18 at 300) |
| 1900 | `base/base-nomut-3/event-001900-rhino-extinct.png` | zebra 17, rhino 0, leopard 0; grass 0, bush 0; food cells 40; mouths/zebra 1.00; zebras with killer 100% | rhino extinct at 1900 (peak 18 at 300) |
| 2500 | `base/base-nomut-3/frame-002500.png` | zebra 11, rhino 0, leopard 0; grass 0, bush 0; food cells 26; mouths/zebra 1.00; zebras with killer 100%. Change since last frame: zebra -6 (-35%) | - |
| 4000 | `base/base-nomut-3/event-004000-zebra-collapse.png` | zebra 2, rhino 0, leopard 0; grass 0, bush 0; food cells 54; mouths/zebra 1.00; zebras with killer 100%. Change since last frame: zebra -9 (-82%) | zebra collapse at 4000 (peak 97 at 300) |
| 4652 | `base/base-nomut-3/frame-004652.png` | zebra 0, rhino 0, leopard 0; grass 0, bush 0; food cells 58; mouths/zebra 0.00 | zebra extinct at 4652 (peak 97 at 300) |

### base-clog

**What we tried:** Route to suicide 2. Fast plants (food production 10, growing into all 8 neighbours) with few grazers: can plants choke themselves with their own food?

**Outcome across seeds:**

- zebra: boom then collapse, no trait (unresolved) x3
- rhino: collapse under predation x3
- leopard: not seeded x3

#### base/base-clog-1

- **zebra: boom then collapse, no trait (unresolved).** 6 -> peak 348 at tick 600; extinct at tick 12800; food plants 266 at the peak -> 1781 at extinction; main cause of death after the peak: attack (29387).
- **rhino: collapse under predation.** 3 -> peak 13 at tick 400; extinct at tick 1900; food plants 422 at the peak -> 366 at extinction; main cause of death after the peak: attack (36).

| tick | screenshot | state | events since previous frame |
|---|---|---|---|
| 0 | `base/base-clog-1/frame-000000.png` | zebra 6, rhino 3, leopard 0; grass 140, bush 45; food cells 0; mouths/zebra 1.00; zebras with killer 100% | - |
| 1300 | `base/base-clog-1/event-001300-rhino-collapse.png` | zebra 275, rhino 2, leopard 0; grass 318, bush 10; food cells 1543; mouths/zebra 1.00; zebras with killer 79%. Change since last frame: zebra +269 (+4483%), grass +178 (+127%), bush -35 (-78%) | rhino collapse at 1300 (peak 13 at 400) |
| 1700 | `base/base-clog-1/event-001700-bush-collapse.png` | zebra 261, rhino 1, leopard 0; grass 286, bush 2; food cells 1171; mouths/zebra 1.00; zebras with killer 86%. Change since last frame: bush -8 (-80%) | bush collapse at 1700 (peak 119 at 200) |
| 1900 | `base/base-clog-1/event-001900-rhino-extinct.png` | zebra 255, rhino 0, leopard 0; grass 363, bush 3; food cells 1510; mouths/zebra 1.01; zebras with killer 87%. Change since last frame: grass +77 (+27%) | rhino extinct at 1900 (peak 13 at 400) |
| 2200 | `base/base-clog-1/event-002200-bush-extinct.png` | zebra 249, rhino 0, leopard 0; grass 482, bush 0; food cells 1952; mouths/zebra 1.08; zebras with killer 100%. Change since last frame: grass +119 (+33%), bush -3 (-100%) | bush extinct at 2200 (peak 119 at 200) |
| 2500 | `base/base-clog-1/frame-002500.png` | zebra 250, rhino 0, leopard 0; grass 486, bush 0; food cells 1629; mouths/zebra 1.06; zebras with killer 96% | - |
| 10000 | `base/base-clog-1/frame-010000.png` | zebra 33, rhino 0, leopard 0; grass 1548, bush 0; food cells 6200; mouths/zebra 1.00; zebras with killer 97%. Change since last frame: zebra -217 (-87%), grass +1062 (+219%) | - |
| 12200 | `base/base-clog-1/event-012200-zebra-collapse.png` | zebra 2, rhino 0, leopard 0; grass 1771, bush 0; food cells 6517; mouths/zebra 1.00; zebras with killer 100%. Change since last frame: zebra -31 (-94%) | zebra collapse at 12200 (peak 348 at 600) |
| 12800 | `base/base-clog-1/event-012800-zebra-extinct.png` | zebra 0, rhino 0, leopard 0; grass 1781, bush 0; food cells 6508; mouths/zebra 0.00 | zebra extinct at 12800 (peak 348 at 600) |
| 20000 | `base/base-clog-1/frame-020000.png` | zebra 0, rhino 0, leopard 0; grass 2121, bush 0; food cells 4571; mouths/zebra 0.00 | - |
| 40000 | `base/base-clog-1/frame-040000.png` | zebra 0, rhino 0, leopard 0; grass 2228, bush 0; food cells 3349; mouths/zebra 0.00 | - |

#### base/base-clog-2

- **zebra: boom then collapse, no trait (unresolved).** 6 -> peak 242 at tick 3000; extinct at tick 8700; food plants 792 at the peak -> 1083 at extinction; main cause of death after the peak: attack (8616).
- **rhino: collapse under predation.** 3 -> peak 6 at tick 500; extinct at tick 900; food plants 234 at the peak -> 237 at extinction; main cause of death after the peak: attack (8).

| tick | screenshot | state | events since previous frame |
|---|---|---|---|
| 0 | `base/base-clog-2/frame-000000.png` | zebra 6, rhino 3, leopard 0; grass 140, bush 45; food cells 0; mouths/zebra 1.00; zebras with killer 100% | - |
| 800 | `base/base-clog-2/event-000800-bush-collapse.png` | zebra 188, rhino 1, leopard 0; grass 203, bush 1; food cells 1223; mouths/zebra 1.01; zebras with killer 99%. Change since last frame: zebra +182 (+3033%), grass +63 (+45%), bush -44 (-98%) | bush collapse at 800 (peak 124 at 200) |
| 900 | `base/base-clog-2/event-000900-bush-extinct.png` | zebra 192, rhino 0, leopard 0; grass 237, bush 0; food cells 1327; mouths/zebra 0.99; zebras with killer 98% | rhino extinct at 900 (peak 6 at 500); bush extinct at 900 (peak 124 at 200) |
| 900 | `base/base-clog-2/event-000900-rhino-extinct.png` | zebra 192, rhino 0, leopard 0; grass 237, bush 0; food cells 1327; mouths/zebra 0.99; zebras with killer 98% | - |
| 2500 | `base/base-clog-2/frame-002500.png` | zebra 207, rhino 0, leopard 0; grass 799, bush 0; food cells 2445; mouths/zebra 1.00; zebras with killer 89%. Change since last frame: grass +562 (+237%) | - |
| 8600 | `base/base-clog-2/event-008600-zebra-collapse.png` | zebra 1, rhino 0, leopard 0; grass 1086, bush 0; food cells 8324; mouths/zebra 1.00. Change since last frame: zebra -206 (-100%), grass +287 (+36%) | zebra collapse at 8600 (peak 242 at 3000) |
| 8700 | `base/base-clog-2/event-008700-zebra-extinct.png` | zebra 0, rhino 0, leopard 0; grass 1083, bush 0; food cells 8294; mouths/zebra 0.00 | zebra extinct at 8700 (peak 242 at 3000) |
| 9800 | `base/base-clog-2/frame-009800.png` | zebra 0, rhino 0, leopard 0; grass 1149, bush 0; food cells 8166; mouths/zebra 0.00 | - |

#### base/base-clog-3

- **zebra: boom then collapse, no trait (unresolved).** 6 -> peak 243 at tick 5600; extinct at tick 30600; food plants 315 at the peak -> 1497 at extinction; main cause of death after the peak: attack (28108).
- **rhino: collapse under predation.** 3 -> peak 14 at tick 400; extinct at tick 2000; food plants 335 at the peak -> 110 at extinction; main cause of death after the peak: attack (46).

| tick | screenshot | state | events since previous frame |
|---|---|---|---|
| 0 | `base/base-clog-3/frame-000000.png` | zebra 6, rhino 3, leopard 0; grass 140, bush 45; food cells 0; mouths/zebra 1.00; zebras with killer 100% | - |
| 1200 | `base/base-clog-3/event-001200-bush-collapse.png` | zebra 162, rhino 7, leopard 0; grass 102, bush 1; food cells 439; mouths/zebra 1.07; zebras with killer 93%. Change since last frame: zebra +156 (+2600%), rhino +4 (+133%), grass -38 (-27%), bush -44 (-98%) | bush collapse at 1200 (peak 148 at 200) |
| 1300 | `base/base-clog-3/event-001300-bush-extinct.png` | zebra 157, rhino 6, leopard 0; grass 111, bush 0; food cells 446; mouths/zebra 1.06; zebras with killer 96% | bush extinct at 1300 (peak 148 at 200) |
| 1500 | `base/base-clog-3/event-001500-rhino-collapse.png` | zebra 170, rhino 2, leopard 0; grass 63, bush 0; food cells 263; mouths/zebra 1.02; zebras with killer 98%. Change since last frame: rhino -4 (-67%), grass -48 (-43%) | rhino collapse at 1500 (peak 14 at 400) |
| 2000 | `base/base-clog-3/event-002000-rhino-extinct.png` | zebra 125, rhino 0, leopard 0; grass 110, bush 0; food cells 435; mouths/zebra 1.05; zebras with killer 100%. Change since last frame: zebra -45 (-26%), grass +47 (+75%) | rhino extinct at 2000 (peak 14 at 400) |
| 2500 | `base/base-clog-3/frame-002500.png` | zebra 143, rhino 0, leopard 0; grass 183, bush 0; food cells 830; mouths/zebra 1.01; zebras with killer 98%. Change since last frame: grass +73 (+66%) | - |
| 10000 | `base/base-clog-3/frame-010000.png` | zebra 152, rhino 0, leopard 0; grass 768, bush 0; food cells 2868; mouths/zebra 1.02; zebras with killer 100%. Change since last frame: grass +585 (+320%) | - |
| 20000 | `base/base-clog-3/frame-020000.png` | zebra 49, rhino 0, leopard 0; grass 1590, bush 0; food cells 5153; mouths/zebra 1.04; zebras with killer 98%. Change since last frame: zebra -103 (-68%), grass +822 (+107%) | - |
| 22300 | `base/base-clog-3/event-022300-zebra-collapse.png` | zebra 2, rhino 0, leopard 0; grass 1911, bush 0; food cells 5502; mouths/zebra 1.00; zebras with killer 100%. Change since last frame: zebra -47 (-96%) | zebra collapse at 22300 (peak 243 at 5600) |
| 30600 | `base/base-clog-3/event-030600-zebra-extinct.png` | zebra 0, rhino 0, leopard 0; grass 1497, bush 0; food cells 7215; mouths/zebra 0.00 | zebra extinct at 30600 (peak 243 at 5600) |
| 40000 | `base/base-clog-3/frame-040000.png` | zebra 0, rhino 0, leopard 0; grass 1842, bush 0; food cells 5585; mouths/zebra 0.00 | - |

### What the base runs showed, and why

**The base engine destroyed itself through killer cells, every time the kick was present.** In the original engine a killer cell hurts everything it touches: plants, rhinos and the zebra's own herd. In every condition where zebras started with the rear kick (default, harsh, no mutation, seeded plant-kill), all bushes were gone by tick 500-1,500 and all grass by tick 700-6,100, and the zebras died out by tick 2,800-8,000. The seeded plant-kill runs had no leopards at all, so zebra kicks alone were enough. Other zebras' kicks caused 81-100% of zebra deaths in those conditions (leopards 0-10%), and kicks killed most rhinos too (69 of 90 rhino deaths in default seed 1). Because the kick was given at the start rather than evolved, these runs fail our "trait spread" criterion: they show a self-destroying design, not evolutionary suicide.

**Evolutionary suicide did happen when the killer had to evolve.** In the plant-kill control, zebras started without a killer cell. In seed 2 one evolved, spread to 89-100% of the herd, destroyed every bush (by tick 4,900) and every grass plant (by tick 11,700), and the zebras died out at tick 14,005: all four criteria. In seeds 1 and 3 the evolved killers mostly killed other zebras instead of plants. Each carcass became food, food piled up to 5,000-7,400 cells, and because uneaten food blocks births the herd stopped breeding and died out (ticks 28,000 and 11,850) while grass survived. That is a self-made collapse, but it misses the "food plants fell" criterion.

**Failure to adapt:** with mutation switched off, zebras still died out by about tick 5,000 (no change was possible), and leopards in every base condition boomed to 22-35 and died out by tick 1,300, because they could not catch prey moving at their own speed. Clogging (fast plants, few grazers) killed the animals while grass covered the map: an engine artefact of food blocking births.

**Why the base engine cannot test our hypothesis:** zebras cannot overgraze (mouths do not hurt plants), bush food is the same as grass food, nothing starves, and leopards do not need prey. The only road to collapse in the base engine is killer cells, which is why we built the modifications in Part 2.

## Part 2: modified engine

### What we changed and why

Each change answers a base-engine limit, and each adds an escape so collapse stays possible but not automatic. All are off by default.

| Base-engine limit | Our change | Who |
| --- | --- | --- |
| Grazing cannot hurt plants | Mouths next to grass damage the plant (2% per tick) | Shared |
| Bush food is the same as grass food | Bushes drop browse worth 0.35 of grass | Shared |
| Nothing starves | Hunger: pay 1 food every 80 ticks, die after 10 misses | Shared |
| Leopards eat plants | Carcasses become meat; jaws (killer beside mouth) digest only meat; leopards eat their kill on the spot | Shared |
| Every animal moves 1 cell per tick (extra movers do nothing in the original engine) | **Our own rule:** each extra mover adds one step per tick, only while chasing or fleeing | Shared |
| Rhinos have nothing special | Horn cell: immune to killers, gores attackers, tramples plants | Vimbai |
| Zebras have no herd defence | Stripe cell: leopards miss striped zebras in a herd (up to 85%) | Moreblessing |
| Predators cannot store energy | Cache cell: banks surplus food near trees, spent when starving | Ashley |
| Plant growth is unlimited | Soil water and fertility; deep-rooted bushes use less water | Fourth member |
| The map is uniform | River (only 9-cell animals cross), trees (cover and caching sites), fire | Shared |

### Did we achieve it?

**Did we achieve evolutionary suicide in the modified engine? No.** Zebras did evolve a second mouth (up to 2.8 mouths per zebra), but grass food never collapsed because of it: water-limited regrowth, the bush fallback and the river refuge kept the trait from removing its own food. Where food did fall (long dry runs), it kept falling after the zebras died, so plant crowding caused it, not grazing. Capping zebras at one mouth made them die out more often, so the trait was adaptive.

**Did we achieve failure to adapt? Yes.** Rhinos failed in every main seed: they bred too slowly (16 food per calf) and died of old age without replacing themselves. Zebra lineages that never evolved the second mouth faded out the same way, with food still on the map.

**What we got instead of suicide:** leopards boomed and crashed every time. With 16 leopards the first generation aged out or was kicked to death before the prey crashed. With 48 leopards they ate every zebra within about 1,300 ticks and then starved, which is ecological over-exploitation set up by the starting density, not an evolved trait.

### What happened in each condition

### full

**What we tried:** The full modified design for 100,000 ticks: every feature on, 36 zebras, 12 rhinos, 16 leopards, river, trees and fire.

**Outcome across seeds:**

- zebra: persisted x1; boom then collapse, no trait (unresolved) x4
- rhino: boom then collapse, no trait (unresolved) x4; suicide candidate (3 of 4) x1
- leopard: boom-bust: cohort aged out x5

#### main/full-1

- **zebra: persisted.** 35 -> peak 290 at tick 67800; 199 alive at the end; mouths per animal rose by 0.99.
- **rhino: boom then collapse, no trait (unresolved).** 12 -> peak 80 at tick 2600; extinct at tick 12600; food plants 542 at the peak -> 741 at extinction; main cause of death after the peak: age (328).
- **leopard: boom-bust: cohort aged out.** 16 -> peak 35 at tick 900; extinct at tick 4400; food plants 444 at the peak -> 527 at extinction; main cause of death after the peak: age (31).

| tick | screenshot | state | events since previous frame |
|---|---|---|---|
| 0 | `main/full-1/frame-000000.png` | zebra 35, rhino 12, leopard 16; grass 140, bush 45, tree 14; food cells 0; mouths/zebra 1.00; zebras with killer 100%; striped 100%; horned rhinos 100%; leopards with cache 100%; soil water 0.62 | - |
| 1000 | `main/full-1/frame-001000.png` | zebra 9, rhino 23, leopard 30; grass 412, bush 47, tree 19; food cells 1861, browse 511; mouths/zebra 1.00; zebras with killer 100%; striped 100%; horned rhinos 100%; leopards with cache 100%; soil water 0.48. Change since last frame: zebra -26 (-74%), rhino +11 (+92%), leopard +14 (+88%), grass +272 (+194%), tree +5 (+36%) | - |
| 2500 | `main/full-1/frame-002500.png` | zebra 47, rhino 77, leopard 7; grass 520, bush 20, tree 26; food cells 1205, browse 143; mouths/zebra 1.00; zebras with killer 87%; striped 100%; horned rhinos 100%; leopards with cache 100%; soil water 0.43. Change since last frame: zebra +38 (+422%), rhino +54 (+235%), leopard -23 (-77%), grass +108 (+26%), bush -27 (-57%), tree +7 (+37%) | - |
| 2800 | `main/full-1/event-002800-leopard-collapse.png` | zebra 52, rhino 76, leopard 2; grass 531, bush 13, tree 28; food cells 1084, browse 145; mouths/zebra 1.00; zebras with killer 81%; striped 100%; horned rhinos 100%; leopards with cache 100%; soil water 0.43. Change since last frame: leopard -5 (-71%), bush -7 (-35%) | leopard collapse at 2800 (peak 35 at 900) |
| 4400 | `main/full-1/event-004400-leopard-extinct.png` | zebra 65, rhino 56, leopard 0; grass 521, bush 6, tree 36; food cells 1239, browse 152; mouths/zebra 1.00; zebras with killer 88%; striped 100%; horned rhinos 100%; soil water 0.43. Change since last frame: zebra +13 (+25%), rhino -20 (-26%), bush -7 (-54%), tree +8 (+29%) | leopard extinct at 4400 (peak 35 at 900); 1 fire(s), 11 cells burnt |
| 5000 | `main/full-1/frame-005000.png` | zebra 69, rhino 59, leopard 0; grass 537, bush 3, tree 37; food cells 1076, browse 100; mouths/zebra 1.00; zebras with killer 88%; striped 100%; horned rhinos 100%; soil water 0.43. Change since last frame: bush -3 (-50%) | - |
| 5100 | `main/full-1/event-005100-bush-collapse.png` | zebra 64, rhino 60, leopard 0; grass 552, bush 2, tree 39; food cells 1143, browse 104; mouths/zebra 1.00; zebras with killer 86%; striped 100%; horned rhinos 100%; soil water 0.43 | bush collapse at 5100 (peak 117 at 600) |
| 5400 | `main/full-1/event-005400-bush-extinct.png` | zebra 70, rhino 61, leopard 0; grass 548, bush 0, tree 40; food cells 1103, browse 110; mouths/zebra 1.00; zebras with killer 86%; striped 100%; horned rhinos 100%; soil water 0.43 | bush extinct at 5400 (peak 117 at 600) |
| 10000 | `main/full-1/frame-010000.png` | zebra 126, rhino 19, leopard 0; grass 684, bush 0, tree 53; food cells 1290, browse 254; mouths/zebra 1.18; zebras with killer 60%; striped 100%; horned rhinos 100%; soil water 0.45. Change since last frame: zebra +56 (+80%), rhino -42 (-69%), tree +13 (+32%) | 2 fire(s), 8 cells burnt |
| 11800 | `main/full-1/event-011800-rhino-collapse.png` | zebra 143, rhino 2, leopard 0; grass 729, bush 0, tree 67; food cells 1471, browse 404; mouths/zebra 1.27; zebras with killer 60%; striped 100%; horned rhinos 100%; soil water 0.45. Change since last frame: rhino -17 (-89%), tree +14 (+26%) | rhino collapse at 11800 (peak 80 at 2600) |
| 12600 | `main/full-1/event-012600-rhino-extinct.png` | zebra 163, rhino 0, leopard 0; grass 741, bush 0, tree 69; food cells 1095, browse 352; mouths/zebra 1.28; zebras with killer 60%; striped 100%; soil water 0.45 | rhino extinct at 12600 (peak 80 at 2600) |
| 20000 | `main/full-1/frame-020000.png` | zebra 123, rhino 0, leopard 0; grass 886, bush 0, tree 72; food cells 1477, browse 476; mouths/zebra 1.23; zebras with killer 78%; striped 92%; soil water 0.47 | 2 fire(s), 4 cells burnt |
| 40000 | `main/full-1/frame-040000.png` | zebra 208, rhino 0, leopard 0; grass 996, bush 0, tree 55; food cells 549, browse 508; mouths/zebra 1.84; striped 2%; soil water 0.47. Change since last frame: zebra +85 (+69%) | 4 fire(s), 22 cells burnt |
| 60000 | `main/full-1/frame-060000.png` | zebra 252, rhino 0, leopard 0; grass 1213, bush 0, tree 27; food cells 397, browse 969; mouths/zebra 0.88; soil water 0.47. Change since last frame: tree -28 (-51%) | 8 fire(s), 70 cells burnt |
| 80000 | `main/full-1/frame-080000.png` | zebra 203, rhino 0, leopard 0; grass 1106, bush 0, tree 41; food cells 217, browse 2033; mouths/zebra 0.98; soil water 0.51. Change since last frame: tree +14 (+52%) | 4 fire(s), 42 cells burnt |
| 100000 | `main/full-1/frame-100000.png` | zebra 199, rhino 0, leopard 0; grass 1009, bush 0, tree 30; food cells 49, browse 2579; mouths/zebra 0.90; soil water 0.54. Change since last frame: tree -11 (-27%) | 8 fire(s), 94 cells burnt |

#### main/full-2

- **zebra: boom then collapse, no trait (unresolved).** 32 -> peak 120 at tick 7200; extinct at tick 48700; food plants 567 at the peak -> 951 at extinction; main cause of death after the peak: age (946).
- **rhino: boom then collapse, no trait (unresolved).** 12 -> peak 38 at tick 1700; extinct at tick 13900; food plants 514 at the peak -> 694 at extinction; main cause of death after the peak: age (205).
- **leopard: boom-bust: cohort aged out.** 16 -> peak 26 at tick 900; extinct at tick 4600; food plants 483 at the peak -> 585 at extinction; main cause of death after the peak: age (35).

| tick | screenshot | state | events since previous frame |
|---|---|---|---|
| 0 | `main/full-2/frame-000000.png` | zebra 32, rhino 12, leopard 16; grass 140, bush 45, tree 14; food cells 0; mouths/zebra 1.00; zebras with killer 100%; striped 100%; horned rhinos 100%; leopards with cache 100%; soil water 0.62 | - |
| 1000 | `main/full-2/frame-001000.png` | zebra 34, rhino 22, leopard 20; grass 410, bush 72, tree 21; food cells 1600, browse 548; mouths/zebra 1.00; zebras with killer 82%; striped 100%; horned rhinos 100%; leopards with cache 100%; soil water 0.47. Change since last frame: rhino +10 (+83%), leopard +4 (+25%), grass +270 (+193%), bush +27 (+60%), tree +7 (+50%) | - |
| 2500 | `main/full-2/frame-002500.png` | zebra 43, rhino 30, leopard 9; grass 517, bush 53, tree 27; food cells 1844, browse 435; mouths/zebra 1.00; zebras with killer 91%; striped 100%; horned rhinos 100%; leopards with cache 100%; soil water 0.45. Change since last frame: zebra +9 (+26%), rhino +8 (+36%), leopard -11 (-55%), grass +107 (+26%), bush -19 (-26%), tree +6 (+29%) | - |
| 4200 | `main/full-2/event-004200-leopard-collapse.png` | zebra 99, rhino 32, leopard 2; grass 546, bush 37, tree 35; food cells 1201, browse 295; mouths/zebra 0.99; zebras with killer 91%; striped 100%; horned rhinos 100%; leopards with cache 100%; soil water 0.43. Change since last frame: zebra +56 (+130%), leopard -7 (-78%), bush -16 (-30%), tree +8 (+30%) | leopard collapse at 4200 (peak 26 at 900); 1 fire(s), 32 cells burnt |
| 4600 | `main/full-2/event-004600-leopard-extinct.png` | zebra 105, rhino 34, leopard 0; grass 541, bush 44, tree 36; food cells 1140, browse 355; mouths/zebra 1.01; zebras with killer 95%; striped 100%; horned rhinos 100%; soil water 0.43 | leopard extinct at 4600 (peak 26 at 900) |
| 5000 | `main/full-2/frame-005000.png` | zebra 106, rhino 30, leopard 0; grass 499, bush 29, tree 40; food cells 1004, browse 279; mouths/zebra 1.01; zebras with killer 98%; striped 100%; horned rhinos 100%; soil water 0.44. Change since last frame: bush -15 (-34%) | - |
| 10000 | `main/full-2/frame-010000.png` | zebra 98, rhino 15, leopard 0; grass 577, bush 40, tree 59; food cells 1385, browse 514; mouths/zebra 1.00; zebras with killer 99%; striped 100%; horned rhinos 100%; soil water 0.47. Change since last frame: rhino -15 (-50%), bush +11 (+38%), tree +19 (+48%) | 1 fire(s), 2 cells burnt |
| 13000 | `main/full-2/event-013000-rhino-collapse.png` | zebra 83, rhino 1, leopard 0; grass 613, bush 49, tree 81; food cells 1689, browse 933; mouths/zebra 1.00; zebras with killer 100%; striped 100%; horned rhinos 100%; soil water 0.50. Change since last frame: rhino -14 (-93%), tree +22 (+37%) | rhino collapse at 13000 (peak 38 at 1700); 2 fire(s), 52 cells burnt |
| 13900 | `main/full-2/event-013900-rhino-extinct.png` | zebra 70, rhino 0, leopard 0; grass 643, bush 51, tree 82; food cells 1856, browse 1098; mouths/zebra 1.00; zebras with killer 100%; striped 100%; soil water 0.51 | rhino extinct at 13900 (peak 38 at 1700) |
| 20000 | `main/full-2/frame-020000.png` | zebra 19, rhino 0, leopard 0; grass 933, bush 27, tree 85; food cells 1120, browse 840; mouths/zebra 1.05; zebras with killer 100%; striped 100%; soil water 0.47. Change since last frame: zebra -51 (-73%), grass +290 (+45%), bush -24 (-47%) | 1 fire(s), 2 cells burnt |
| 40000 | `main/full-2/frame-040000.png` | zebra 4, rhino 0, leopard 0; grass 855, bush 143, tree 76; food cells 593, browse 1428; mouths/zebra 1.00; zebras with killer 100%; striped 100%; soil water 0.51. Change since last frame: zebra -15 (-79%), bush +116 (+430%) | 4 fire(s), 12 cells burnt |
| 47200 | `main/full-2/event-047200-zebra-collapse.png` | zebra 2, rhino 0, leopard 0; grass 796, bush 227, tree 55; food cells 620, browse 1725; mouths/zebra 1.00; zebras with killer 100%; striped 100%; soil water 0.51. Change since last frame: bush +84 (+59%), tree -21 (-28%) | zebra collapse at 47200 (peak 120 at 7200); 2 fire(s), 10 cells burnt |
| 48700 | `main/full-2/event-048700-zebra-extinct.png` | zebra 0, rhino 0, leopard 0; grass 733, bush 218, tree 57; food cells 665, browse 1978; mouths/zebra 0.00; soil water 0.52 | zebra extinct at 48700 (peak 120 at 7200); 1 fire(s), 1 cells burnt |
| 60000 | `main/full-2/frame-060000.png` | zebra 0, rhino 0, leopard 0; grass 739, bush 274, tree 17; food cells 491, browse 2055; mouths/zebra 0.00; soil water 0.52. Change since last frame: bush +56 (+26%), tree -40 (-70%) | 2 fire(s), 5 cells burnt |
| 80000 | `main/full-2/frame-080000.png` | zebra 0, rhino 0, leopard 0; grass 767, bush 220, tree 7; food cells 510, browse 2106; mouths/zebra 0.00; soil water 0.53. Change since last frame: tree -10 (-59%) | 8 fire(s), 115 cells burnt |
| 94000 | `main/full-2/event-094000-tree-collapse.png` | zebra 0, rhino 0, leopard 0; grass 795, bush 180, tree 2; food cells 481, browse 2219; mouths/zebra 0.00; soil water 0.54. Change since last frame: tree -5 (-71%) | tree collapse at 94000 (peak 94 at 16100); 8 fire(s), 77 cells burnt |
| 96800 | `main/full-2/event-096800-tree-extinct.png` | zebra 0, rhino 0, leopard 0; grass 833, bush 161; food cells 480, browse 2348; mouths/zebra 0.00; soil water 0.54 | tree extinct at 96800 (peak 94 at 16100); 1 fire(s), 20 cells burnt |
| 100000 | `main/full-2/frame-100000.png` | zebra 0, rhino 0, leopard 0; grass 796, bush 145; food cells 466, browse 2082; mouths/zebra 0.00; soil water 0.54 | 4 fire(s), 53 cells burnt |

#### main/full-3

- **zebra: boom then collapse, no trait (unresolved).** 34 -> peak 67 at tick 4700; extinct at tick 94400; food plants 510 at the peak -> 1260 at extinction; main cause of death after the peak: age (1248).
- **rhino: boom then collapse, no trait (unresolved).** 12 -> peak 67 at tick 2800; extinct at tick 9600; food plants 492 at the peak -> 594 at extinction; main cause of death after the peak: age (117).
- **leopard: boom-bust: cohort aged out.** 16 -> peak 26 at tick 800; extinct at tick 12800; food plants 489 at the peak -> 771 at extinction; main cause of death after the peak: age (115).

| tick | screenshot | state | events since previous frame |
|---|---|---|---|
| 0 | `main/full-3/frame-000000.png` | zebra 34, rhino 12, leopard 16; grass 140, bush 45, tree 14; food cells 0; mouths/zebra 1.00; zebras with killer 100%; striped 100%; horned rhinos 100%; leopards with cache 100%; soil water 0.60 | - |
| 1000 | `main/full-3/frame-001000.png` | zebra 26, rhino 20, leopard 19; grass 398, bush 69, tree 17; food cells 1498, browse 588; mouths/zebra 1.00; zebras with killer 100%; striped 100%; horned rhinos 100%; leopards with cache 100%; soil water 0.46. Change since last frame: rhino +8 (+67%), grass +258 (+184%), bush +24 (+53%) | - |
| 2500 | `main/full-3/frame-002500.png` | zebra 28, rhino 57, leopard 10; grass 436, bush 52, tree 26; food cells 1229, browse 459; mouths/zebra 1.00; zebras with killer 100%; striped 100%; horned rhinos 100%; leopards with cache 100%; soil water 0.45. Change since last frame: rhino +37 (+185%), leopard -9 (-47%), tree +9 (+53%) | 1 fire(s), 3 cells burnt |
| 5000 | `main/full-3/frame-005000.png` | zebra 59, rhino 19, leopard 11; grass 463, bush 62, tree 43; food cells 1474, browse 442; mouths/zebra 1.00; zebras with killer 98%; striped 100%; horned rhinos 100%; leopards with cache 100%; soil water 0.44. Change since last frame: zebra +31 (+111%), rhino -38 (-67%), tree +17 (+65%) | 1 fire(s), 1 cells burnt |
| 8700 | `main/full-3/event-008700-rhino-collapse.png` | zebra 19, rhino 2, leopard 22; grass 504, bush 62, tree 73; food cells 1191, browse 728; mouths/zebra 1.00; zebras with killer 100%; striped 100%; horned rhinos 100%; leopards with cache 100%; soil water 0.47. Change since last frame: zebra -40 (-68%), rhino -17 (-89%), leopard +11 (+100%), tree +30 (+70%) | rhino collapse at 8700 (peak 67 at 2800) |
| 9600 | `main/full-3/event-009600-rhino-extinct.png` | zebra 25, rhino 0, leopard 15; grass 534, bush 60, tree 76; food cells 1503, browse 856; mouths/zebra 0.96; zebras with killer 100%; striped 100%; leopards with cache 100%; soil water 0.48. Change since last frame: zebra +6 (+32%), leopard -7 (-32%) | rhino extinct at 9600 (peak 67 at 2800); 1 fire(s), 2 cells burnt |
| 10000 | `main/full-3/frame-010000.png` | zebra 23, rhino 0, leopard 7; grass 635, bush 64, tree 77; food cells 1086, browse 588; mouths/zebra 0.96; zebras with killer 100%; striped 100%; leopards with cache 100%; soil water 0.47. Change since last frame: leopard -8 (-53%) | - |
| 12700 | `main/full-3/event-012700-leopard-collapse.png` | zebra 24, rhino 0, leopard 1; grass 717, bush 69, tree 94; food cells 1298, browse 811; mouths/zebra 0.96; zebras with killer 96%; striped 100%; leopards with cache 100%; soil water 0.46. Change since last frame: leopard -6 (-86%) | leopard collapse at 12700 (peak 26 at 800); 1 fire(s), 3 cells burnt |
| 12800 | `main/full-3/event-012800-leopard-extinct.png` | zebra 24, rhino 0, leopard 0; grass 703, bush 68, tree 94; food cells 1361, browse 848; mouths/zebra 0.96; zebras with killer 96%; striped 100%; soil water 0.46 | leopard extinct at 12800 (peak 26 at 800) |
| 20000 | `main/full-3/frame-020000.png` | zebra 21, rhino 0, leopard 0; grass 882, bush 60, tree 88; food cells 1134, browse 658; mouths/zebra 1.00; zebras with killer 100%; striped 100%; soil water 0.46. Change since last frame: grass +179 (+25%) | 4 fire(s), 37 cells burnt |
| 40000 | `main/full-3/frame-040000.png` | zebra 39, rhino 0, leopard 0; grass 1131, bush 38, tree 36; food cells 1001, browse 696; mouths/zebra 1.00; zebras with killer 3%; striped 79%; soil water 0.46. Change since last frame: zebra +18 (+86%), grass +249 (+28%), bush -22 (-37%), tree -52 (-59%) | 9 fire(s), 52 cells burnt |
| 60000 | `main/full-3/frame-060000.png` | zebra 37, rhino 0, leopard 0; grass 1295, bush 14, tree 22; food cells 770, browse 871; mouths/zebra 1.00; striped 100%; soil water 0.46. Change since last frame: bush -24 (-63%), tree -14 (-39%) | 12 fire(s), 40 cells burnt |
| 80000 | `main/full-3/frame-080000.png` | zebra 7, rhino 0, leopard 0; grass 1203, bush 50, tree 5; food cells 543, browse 1330; mouths/zebra 1.00; striped 100%; soil water 0.48. Change since last frame: zebra -30 (-81%), bush +36 (+257%), tree -17 (-77%) | 9 fire(s), 43 cells burnt |
| 88900 | `main/full-3/event-088900-tree-collapse.png` | zebra 5, rhino 0, leopard 0; grass 1221, bush 24, tree 2; food cells 616, browse 1642; mouths/zebra 1.00; striped 100%; soil water 0.48. Change since last frame: bush -26 (-52%), tree -3 (-60%) | tree collapse at 88900 (peak 96 at 15400); 1 fire(s), 6 cells burnt |
| 89000 | `main/full-3/event-089000-zebra-collapse.png` | zebra 2, rhino 0, leopard 0; grass 1226, bush 27, tree 2; food cells 605, browse 1635; mouths/zebra 1.00; striped 100%; soil water 0.48. Change since last frame: zebra -3 (-60%) | zebra collapse at 89000 (peak 67 at 4700) |
| 94300 | `main/full-3/event-094300-tree-extinct.png` | zebra 1, rhino 0, leopard 0; grass 1232, bush 34; food cells 613, browse 1504; mouths/zebra 1.00; striped 100%; soil water 0.48. Change since last frame: bush +7 (+26%) | tree extinct at 94300 (peak 96 at 15400) |
| 94400 | `main/full-3/event-094400-zebra-extinct.png` | zebra 0, rhino 0, leopard 0; grass 1224, bush 36; food cells 686, browse 1591; mouths/zebra 0.00; soil water 0.48 | zebra extinct at 94400 (peak 67 at 4700) |
| 100000 | `main/full-3/frame-100000.png` | zebra 0, rhino 0, leopard 0; grass 1238, bush 36; food cells 734, browse 1614; mouths/zebra 0.00; soil water 0.48 | 1 fire(s), 2 cells burnt |

#### main/full-4

- **zebra: boom then collapse, no trait (unresolved).** 36 -> peak 136 at tick 7200; extinct at tick 55900; food plants 477 at the peak -> 1208 at extinction; main cause of death after the peak: age (1595).
- **rhino: boom then collapse, no trait (unresolved).** 12 -> peak 27 at tick 1900; extinct at tick 5100; food plants 486 at the peak -> 499 at extinction; main cause of death after the peak: age (48).
- **leopard: boom-bust: cohort aged out.** 16 -> peak 26 at tick 400; extinct at tick 5900; food plants 626 at the peak -> 506 at extinction; main cause of death after the peak: attack (43).

| tick | screenshot | state | events since previous frame |
|---|---|---|---|
| 0 | `main/full-4/frame-000000.png` | zebra 36, rhino 12, leopard 16; grass 140, bush 45, tree 14; food cells 0; mouths/zebra 1.00; zebras with killer 100%; striped 100%; horned rhinos 100%; leopards with cache 100%; soil water 0.60 | - |
| 1000 | `main/full-4/frame-001000.png` | zebra 52, rhino 14, leopard 11; grass 406, bush 87, tree 18; food cells 1337, browse 544; mouths/zebra 1.00; zebras with killer 100%; striped 100%; horned rhinos 100%; leopards with cache 100%; soil water 0.46. Change since last frame: zebra +16 (+44%), leopard -5 (-31%), grass +266 (+190%), bush +42 (+93%), tree +4 (+29%) | - |
| 2500 | `main/full-4/frame-002500.png` | zebra 97, rhino 25, leopard 10; grass 437, bush 78, tree 25; food cells 978, browse 432; mouths/zebra 1.00; zebras with killer 100%; striped 99%; horned rhinos 100%; leopards with cache 100%; soil water 0.43. Change since last frame: zebra +45 (+87%), rhino +11 (+79%), tree +7 (+39%) | - |
| 4700 | `main/full-4/event-004700-rhino-collapse.png` | zebra 109, rhino 2, leopard 4; grass 410, bush 71, tree 42; food cells 914, browse 541; mouths/zebra 1.00; zebras with killer 100%; striped 96%; horned rhinos 100%; leopards with cache 100%; soil water 0.44. Change since last frame: rhino -23 (-92%), leopard -6 (-60%), tree +17 (+68%) | rhino collapse at 4700 (peak 27 at 1900) |
| 5000 | `main/full-4/frame-005000.png` | zebra 116, rhino 1, leopard 5; grass 432, bush 76, tree 44; food cells 893, browse 488; mouths/zebra 1.00; zebras with killer 100%; striped 97%; horned rhinos 100%; leopards with cache 100%; soil water 0.44 | - |
| 5100 | `main/full-4/event-005100-rhino-extinct.png` | zebra 113, rhino 0, leopard 3; grass 422, bush 77, tree 44; food cells 870, browse 501; mouths/zebra 0.99; zebras with killer 100%; striped 96%; leopards with cache 100%; soil water 0.44 | rhino extinct at 5100 (peak 27 at 1900) |
| 5400 | `main/full-4/event-005400-leopard-collapse.png` | zebra 107, rhino 0, leopard 2; grass 400, bush 86, tree 45; food cells 973, browse 611; mouths/zebra 0.99; zebras with killer 100%; striped 98%; leopards with cache 100%; soil water 0.44 | leopard collapse at 5400 (peak 26 at 400) |
| 5900 | `main/full-4/event-005900-leopard-extinct.png` | zebra 111, rhino 0, leopard 0; grass 428, bush 78, tree 48; food cells 880, browse 626; mouths/zebra 1.00; zebras with killer 100%; striped 99%; soil water 0.45 | leopard extinct at 5900 (peak 26 at 400) |
| 10000 | `main/full-4/frame-010000.png` | zebra 94, rhino 0, leopard 0; grass 506, bush 66, tree 67; food cells 1164, browse 714; mouths/zebra 1.00; zebras with killer 100%; striped 100%; soil water 0.45. Change since last frame: tree +19 (+40%) | 3 fire(s), 35 cells burnt |
| 20000 | `main/full-4/frame-020000.png` | zebra 59, rhino 0, leopard 0; grass 569, bush 26, tree 112; food cells 1579, browse 1001; mouths/zebra 1.00; zebras with killer 100%; striped 100%; soil water 0.50. Change since last frame: zebra -35 (-37%), bush -40 (-61%), tree +45 (+67%) | 7 fire(s), 25 cells burnt |
| 40000 | `main/full-4/frame-040000.png` | zebra 14, rhino 0, leopard 0; grass 532, bush 415, tree 91; food cells 798, browse 1005; mouths/zebra 1.00; zebras with killer 100%; striped 100%; soil water 0.49. Change since last frame: zebra -45 (-76%), bush +389 (+1496%) | 5 fire(s), 12 cells burnt |
| 55500 | `main/full-4/event-055500-zebra-collapse.png` | zebra 2, rhino 0, leopard 0; grass 493, bush 715, tree 49; food cells 405, browse 1224; mouths/zebra 1.00; striped 100%; soil water 0.48. Change since last frame: zebra -12 (-86%), bush +300 (+72%), tree -42 (-46%) | zebra collapse at 55500 (peak 136 at 7200); 5 fire(s), 24 cells burnt |
| 55900 | `main/full-4/event-055900-zebra-extinct.png` | zebra 0, rhino 0, leopard 0; grass 501, bush 707, tree 51; food cells 343, browse 1104; mouths/zebra 0.00; soil water 0.48 | zebra extinct at 55900 (peak 136 at 7200) |
| 60000 | `main/full-4/frame-060000.png` | zebra 0, rhino 0, leopard 0; grass 530, bush 869, tree 46; food cells 343, browse 1266; mouths/zebra 0.00; soil water 0.47 | 3 fire(s), 62 cells burnt |
| 80000 | `main/full-4/frame-080000.png` | zebra 0, rhino 0, leopard 0; grass 515, bush 1050, tree 6; food cells 249, browse 1661; mouths/zebra 0.00; soil water 0.47. Change since last frame: tree -40 (-87%) | 4 fire(s), 28 cells burnt |
| 90200 | `main/full-4/event-090200-tree-collapse.png` | zebra 0, rhino 0, leopard 0; grass 472, bush 1037, tree 2; food cells 311, browse 1804; mouths/zebra 0.00; soil water 0.48. Change since last frame: tree -4 (-67%) | tree collapse at 90200 (peak 126 at 26400); 4 fire(s), 23 cells burnt |
| 95400 | `main/full-4/event-095400-tree-extinct.png` | zebra 0, rhino 0, leopard 0; grass 558, bush 966; food cells 323, browse 1586; mouths/zebra 0.00; soil water 0.48 | tree extinct at 95400 (peak 126 at 26400); 3 fire(s), 28 cells burnt |
| 100000 | `main/full-4/frame-100000.png` | zebra 0, rhino 0, leopard 0; grass 593, bush 896; food cells 262, browse 1624; mouths/zebra 0.00; soil water 0.48 | 3 fire(s), 36 cells burnt |

#### main/full-5

- **zebra: boom then collapse, no trait (unresolved).** 36 -> peak 121 at tick 5100; extinct at tick 18200; food plants 501 at the peak -> 896 at extinction; main cause of death after the peak: age (827).
- **rhino: suicide candidate (3 of 4).** 12 -> peak 31 at tick 3800; extinct at tick 17300; share with a killer cell rose by 100%; food plants 557 at the peak -> 945 at extinction; main cause of death after the peak: age (116).
- **leopard: boom-bust: cohort aged out.** 16 -> peak 26 at tick 800; extinct at tick 3600; food plants 504 at the peak -> 571 at extinction; main cause of death after the peak: age (21).

| tick | screenshot | state | events since previous frame |
|---|---|---|---|
| 0 | `main/full-5/frame-000000.png` | zebra 36, rhino 12, leopard 16; grass 140, bush 45, tree 14; food cells 0; mouths/zebra 1.00; zebras with killer 100%; striped 100%; horned rhinos 100%; leopards with cache 100%; soil water 0.62 | - |
| 1000 | `main/full-5/frame-001000.png` | zebra 59, rhino 27, leopard 21; grass 365, bush 98, tree 13; food cells 1093, browse 585; mouths/zebra 1.00; zebras with killer 100%; striped 100%; horned rhinos 100%; leopards with cache 100%; soil water 0.47. Change since last frame: zebra +23 (+64%), rhino +15 (+125%), leopard +5 (+31%), grass +225 (+161%), bush +53 (+118%) | 1 fire(s), 1 cells burnt |
| 2500 | `main/full-5/frame-002500.png` | zebra 82, rhino 22, leopard 3; grass 457, bush 66, tree 23; food cells 1236, browse 510; mouths/zebra 1.00; zebras with killer 100%; striped 100%; horned rhinos 100%; leopards with cache 100%; soil water 0.45. Change since last frame: zebra +23 (+39%), leopard -18 (-86%), grass +92 (+25%), bush -32 (-33%), tree +10 (+77%) | 1 fire(s), 1 cells burnt |
| 3000 | `main/full-5/event-003000-leopard-collapse.png` | zebra 94, rhino 27, leopard 2; grass 465, bush 76, tree 27; food cells 1146, browse 398; mouths/zebra 1.00; zebras with killer 100%; striped 100%; horned rhinos 100%; leopards with cache 100%; soil water 0.44 | leopard collapse at 3000 (peak 26 at 800) |
| 3600 | `main/full-5/event-003600-leopard-extinct.png` | zebra 92, rhino 27, leopard 0; grass 480, bush 91, tree 31; food cells 1158, browse 539; mouths/zebra 1.00; zebras with killer 100%; striped 100%; horned rhinos 100%; soil water 0.44 | leopard extinct at 3600 (peak 26 at 800) |
| 5000 | `main/full-5/frame-005000.png` | zebra 114, rhino 17, leopard 0; grass 414, bush 95, tree 39; food cells 923, browse 618; mouths/zebra 0.99; zebras with killer 100%; striped 100%; horned rhinos 100%; soil water 0.45. Change since last frame: rhino -10 (-37%), tree +8 (+26%) | - |
| 10000 | `main/full-5/frame-010000.png` | zebra 80, rhino 8, leopard 0; grass 519, bush 60, tree 69; food cells 1282, browse 793; mouths/zebra 0.99; zebras with killer 100%; striped 100%; horned rhinos 100%; soil water 0.48. Change since last frame: zebra -34 (-30%), rhino -9 (-53%), grass +105 (+25%), bush -35 (-37%), tree +30 (+77%) | 3 fire(s), 9 cells burnt |
| 14000 | `main/full-5/event-014000-rhino-collapse.png` | zebra 47, rhino 2, leopard 0; grass 623, bush 49, tree 106; food cells 1515, browse 957; mouths/zebra 1.00; zebras with killer 100%; striped 100%; horned rhinos 100%; soil water 0.50. Change since last frame: zebra -33 (-41%), rhino -6 (-75%), tree +37 (+54%) | rhino collapse at 14000 (peak 31 at 3800); 2 fire(s), 2 cells burnt |
| 17300 | `main/full-5/event-017300-rhino-extinct.png` | zebra 12, rhino 0, leopard 0; grass 886, bush 59, tree 117; food cells 769, browse 407; mouths/zebra 1.00; zebras with killer 100%; striped 100%; soil water 0.47. Change since last frame: zebra -35 (-74%), grass +263 (+42%) | rhino extinct at 17300 (peak 31 at 3800) |
| 18100 | `main/full-5/event-018100-zebra-collapse.png` | zebra 1, rhino 0, leopard 0; grass 839, bush 61, tree 119; food cells 724, browse 411; mouths/zebra 1.00; zebras with killer 100%; striped 100%; soil water 0.47. Change since last frame: zebra -11 (-92%) | zebra collapse at 18100 (peak 121 at 5100) |
| 18200 | `main/full-5/event-018200-zebra-extinct.png` | zebra 0, rhino 0, leopard 0; grass 832, bush 64, tree 120; food cells 749, browse 445; mouths/zebra 0.00; soil water 0.46 | zebra extinct at 18200 (peak 121 at 5100) |
| 20000 | `main/full-5/frame-020000.png` | zebra 0, rhino 0, leopard 0; grass 944, bush 81, tree 123; food cells 767, browse 438; mouths/zebra 0.00; soil water 0.46. Change since last frame: bush +17 (+27%) | 1 fire(s), 13 cells burnt |
| 40000 | `main/full-5/frame-040000.png` | zebra 0, rhino 0, leopard 0; grass 1185, bush 91, tree 85; food cells 330, browse 662; mouths/zebra 0.00; soil water 0.48. Change since last frame: grass +241 (+26%), tree -38 (-31%) | 5 fire(s), 18 cells burnt |
| 60000 | `main/full-5/frame-060000.png` | zebra 0, rhino 0, leopard 0; grass 1246, bush 19, tree 34; food cells 374, browse 908; mouths/zebra 0.00; soil water 0.48. Change since last frame: bush -72 (-79%), tree -51 (-60%) | 6 fire(s), 15 cells burnt |
| 69700 | `main/full-5/event-069700-bush-collapse.png` | zebra 0, rhino 0, leopard 0; grass 1306, bush 2, tree 8; food cells 382, browse 1175; mouths/zebra 0.00; soil water 0.49. Change since last frame: bush -17 (-89%), tree -26 (-76%) | bush collapse at 69700 (peak 164 at 34800); 6 fire(s), 22 cells burnt |
| 71700 | `main/full-5/event-071700-bush-extinct.png` | zebra 0, rhino 0, leopard 0; grass 1345, bush 0, tree 5; food cells 387, browse 1252; mouths/zebra 0.00; soil water 0.49. Change since last frame: tree -3 (-38%) | bush extinct at 71700 (peak 164 at 34800); 1 fire(s), 1 cells burnt |
| 72400 | `main/full-5/event-072400-tree-collapse.png` | zebra 0, rhino 0, leopard 0; grass 1290, bush 0, tree 2; food cells 407, browse 1418; mouths/zebra 0.00; soil water 0.49. Change since last frame: tree -3 (-60%) | tree collapse at 72400 (peak 131 at 22800) |
| 79800 | `main/full-5/event-079800-tree-extinct.png` | zebra 0, rhino 0, leopard 0; grass 1392, bush 0; food cells 356, browse 1495; mouths/zebra 0.00; soil water 0.49 | tree extinct at 79800 (peak 131 at 22800); 4 fire(s), 10 cells burnt |
| 80000 | `main/full-5/frame-080000.png` | zebra 0, rhino 0, leopard 0; grass 1386, bush 0; food cells 374, browse 1481; mouths/zebra 0.00; soil water 0.49 | - |
| 100000 | `main/full-5/frame-100000.png` | zebra 0, rhino 0, leopard 0; grass 1320, bush 0; food cells 462, browse 1511; mouths/zebra 0.00; soil water 0.51 | 11 fire(s), 62 cells burnt |

### full

**What we tried:** Mechanism check with extra logging (cells per zebra), default settings, 40,000 ticks.

**Outcome across seeds:**

- zebra: persisted x2; boom then collapse, no trait (unresolved) x1
- rhino: boom then collapse, no trait (unresolved) x3
- leopard: failure to adapt x1; boom-bust: cohort aged out x2

#### mech/full-3

- **zebra: persisted.** 34 -> peak 95 at tick 8600; 25 alive at the end.
- **rhino: boom then collapse, no trait (unresolved).** 12 -> peak 51 at tick 2300; extinct at tick 14600; food plants 519 at the peak -> 844 at extinction; main cause of death after the peak: age (165).
- **leopard: failure to adapt.** 16 -> peak 23 at tick 200; extinct at tick 6600; food plants 475 at the peak -> 537 at extinction; main cause of death after the peak: age (38).

| tick | screenshot | state | events since previous frame |
|---|---|---|---|
| 0 | `mech/full-3/frame-000000.png` | zebra 34, rhino 12, leopard 16; grass 140, bush 45, tree 14; food cells 0; mouths/zebra 1.00; zebras with killer 100%; striped 100%; eyes/zebra 2.00; horned rhinos 100%; leopards with cache 100%; soil water 0.62 | - |
| 2500 | `mech/full-3/frame-002500.png` | zebra 47, rhino 50, leopard 6; grass 406, bush 100, tree 26; food cells 1360, browse 697; mouths/zebra 1.00; zebras with killer 100%; striped 100%; eyes/zebra 2.00; horned rhinos 100%; leopards with cache 100%; soil water 0.47. Change since last frame: zebra +13 (+38%), rhino +38 (+317%), leopard -10 (-62%), grass +266 (+190%), bush +55 (+122%), tree +12 (+86%) | 2 fire(s), 13 cells burnt |
| 3100 | `mech/full-3/event-003100-leopard-collapse.png` | zebra 46, rhino 45, leopard 2; grass 429, bush 95, tree 31; food cells 1295, browse 607; mouths/zebra 1.00; zebras with killer 100%; striped 100%; eyes/zebra 2.00; horned rhinos 100%; leopards with cache 100%; soil water 0.47. Change since last frame: leopard -4 (-67%) | leopard collapse at 3100 (peak 23 at 200) |
| 5000 | `mech/full-3/frame-005000.png` | zebra 49, rhino 25, leopard 18; grass 415, bush 72, tree 48; food cells 1269, browse 598; mouths/zebra 1.00; zebras with killer 88%; striped 100%; eyes/zebra 2.00; horned rhinos 100%; leopards with cache 100%; soil water 0.47. Change since last frame: rhino -20 (-44%), leopard +16 (+800%), tree +17 (+55%) | - |
| 6600 | `mech/full-3/event-006600-leopard-extinct.png` | zebra 79, rhino 22, leopard 0; grass 457, bush 80, tree 65; food cells 1151, browse 742; mouths/zebra 0.99; zebras with killer 81%; striped 100%; eyes/zebra 2.00; horned rhinos 100%; soil water 0.48. Change since last frame: zebra +30 (+61%), leopard -18 (-100%), tree +17 (+35%) | leopard extinct at 6600 (peak 23 at 200) |
| 10000 | `mech/full-3/frame-010000.png` | zebra 71, rhino 10, leopard 0; grass 553, bush 27, tree 78; food cells 1429, browse 879; mouths/zebra 1.00; zebras with killer 66%; striped 100%; eyes/zebra 2.00; horned rhinos 100%; soil water 0.50. Change since last frame: rhino -12 (-55%), bush -53 (-66%) | - |
| 12800 | `mech/full-3/event-012800-rhino-collapse.png` | zebra 60, rhino 2, leopard 0; grass 720, bush 14, tree 81; food cells 946, browse 576; mouths/zebra 1.00; zebras with killer 42%; striped 100%; eyes/zebra 2.00; horned rhinos 100%; soil water 0.49. Change since last frame: rhino -8 (-80%), grass +167 (+30%), bush -13 (-48%) | rhino collapse at 12800 (peak 51 at 2300) |
| 14600 | `mech/full-3/event-014600-rhino-extinct.png` | zebra 34, rhino 0, leopard 0; grass 833, bush 11, tree 95; food cells 849, browse 496; mouths/zebra 1.00; zebras with killer 3%; striped 100%; eyes/zebra 2.00; soil water 0.48. Change since last frame: zebra -26 (-43%) | rhino extinct at 14600 (peak 51 at 2300); 1 fire(s), 3 cells burnt |
| 15000 | `mech/full-3/frame-015000.png` | zebra 34, rhino 0, leopard 0; grass 832, bush 13, tree 98; food cells 901, browse 576; mouths/zebra 1.00; striped 100%; eyes/zebra 2.00; soil water 0.48 | - |
| 20000 | `mech/full-3/frame-020000.png` | zebra 39, rhino 0, leopard 0; grass 844, bush 15, tree 107; food cells 997, browse 632; mouths/zebra 1.00; striped 100%; eyes/zebra 1.72; soil water 0.48 | 6 fire(s), 84 cells burnt |
| 25000 | `mech/full-3/frame-025000.png` | zebra 35, rhino 0, leopard 0; grass 836, bush 11, tree 96; food cells 1101, browse 696; mouths/zebra 1.00; striped 100%; eyes/zebra 1.69; soil water 0.49. Change since last frame: bush -4 (-27%) | 2 fire(s), 3 cells burnt |
| 27800 | `mech/full-3/event-027800-bush-collapse.png` | zebra 35, rhino 0, leopard 0; grass 954, bush 2, tree 97; food cells 999, browse 629; mouths/zebra 1.00; striped 100%; eyes/zebra 1.80; soil water 0.48. Change since last frame: bush -9 (-82%) | bush collapse at 27800 (peak 130 at 600) |
| 28300 | `mech/full-3/event-028300-bush-extinct.png` | zebra 40, rhino 0, leopard 0; grass 926, bush 0, tree 95; food cells 1000, browse 614; mouths/zebra 1.00; striped 100%; eyes/zebra 1.80; soil water 0.48 | bush extinct at 28300 (peak 130 at 600) |
| 30000 | `mech/full-3/frame-030000.png` | zebra 36, rhino 0, leopard 0; grass 954, bush 0, tree 83; food cells 1013, browse 642; mouths/zebra 1.00; striped 100%; eyes/zebra 1.69; soil water 0.49 | 1 fire(s), 1 cells burnt |
| 40000 | `mech/full-3/frame-040000.png` | zebra 25, rhino 0, leopard 0; grass 1028, bush 0, tree 67; food cells 1032, browse 614; mouths/zebra 1.00; striped 100%; eyes/zebra 2.00; soil water 0.49. Change since last frame: zebra -11 (-31%) | 3 fire(s), 8 cells burnt |

#### mech/full-4

- **zebra: boom then collapse, no trait (unresolved).** 36 -> peak 127 at tick 4800; extinct at tick 31200; food plants 500 at the peak -> 985 at extinction; main cause of death after the peak: age (1466).
- **rhino: boom then collapse, no trait (unresolved).** 12 -> peak 29 at tick 2000; extinct at tick 9300; food plants 555 at the peak -> 570 at extinction; main cause of death after the peak: age (70).
- **leopard: boom-bust: cohort aged out.** 16 -> peak 28 at tick 900; extinct at tick 5300; food plants 473 at the peak -> 468 at extinction; main cause of death after the peak: attack (25).

| tick | screenshot | state | events since previous frame |
|---|---|---|---|
| 0 | `mech/full-4/frame-000000.png` | zebra 36, rhino 12, leopard 16; grass 140, bush 45, tree 14; food cells 0; mouths/zebra 1.00; zebras with killer 100%; striped 100%; eyes/zebra 2.00; horned rhinos 100%; leopards with cache 100%; soil water 0.60 | - |
| 2500 | `mech/full-4/frame-002500.png` | zebra 97, rhino 29, leopard 8; grass 432, bush 83, tree 24; food cells 873, browse 519; mouths/zebra 1.00; zebras with killer 99%; striped 100%; eyes/zebra 2.00; horned rhinos 100%; leopards with cache 100%; soil water 0.44. Change since last frame: zebra +61 (+169%), rhino +17 (+142%), leopard -8 (-50%), grass +292 (+209%), bush +38 (+84%), tree +10 (+71%) | - |
| 3700 | `mech/full-4/event-003700-leopard-collapse.png` | zebra 89, rhino 12, leopard 2; grass 430, bush 97, tree 32; food cells 1101, browse 653; mouths/zebra 1.00; zebras with killer 100%; striped 100%; eyes/zebra 1.96; horned rhinos 100%; leopards with cache 100%; soil water 0.43. Change since last frame: rhino -17 (-59%), leopard -6 (-75%), tree +8 (+33%) | leopard collapse at 3700 (peak 28 at 900); 1 fire(s), 1 cells burnt |
| 5000 | `mech/full-4/frame-005000.png` | zebra 125, rhino 6, leopard 1; grass 415, bush 85, tree 43; food cells 970, browse 506; mouths/zebra 1.00; zebras with killer 100%; striped 100%; eyes/zebra 1.92; horned rhinos 100%; leopards with cache 100%; soil water 0.44. Change since last frame: zebra +36 (+40%), rhino -6 (-50%), tree +11 (+34%) | 2 fire(s), 10 cells burnt |
| 5300 | `mech/full-4/event-005300-leopard-extinct.png` | zebra 106, rhino 5, leopard 0; grass 386, bush 82, tree 45; food cells 916, browse 619; mouths/zebra 1.00; zebras with killer 100%; striped 100%; eyes/zebra 1.92; horned rhinos 100%; soil water 0.45 | leopard extinct at 5300 (peak 28 at 900) |
| 5900 | `mech/full-4/event-005900-rhino-collapse.png` | zebra 106, rhino 2, leopard 0; grass 420, bush 86, tree 48; food cells 841, browse 642; mouths/zebra 0.99; zebras with killer 100%; striped 100%; eyes/zebra 1.96; horned rhinos 100%; soil water 0.45. Change since last frame: rhino -3 (-60%) | rhino collapse at 5900 (peak 29 at 2000); 2 fire(s), 14 cells burnt |
| 9300 | `mech/full-4/event-009300-rhino-extinct.png` | zebra 103, rhino 0, leopard 0; grass 482, bush 88, tree 56; food cells 1009, browse 744; mouths/zebra 1.00; zebras with killer 100%; striped 100%; eyes/zebra 1.99; soil water 0.47 | rhino extinct at 9300 (peak 29 at 2000); 1 fire(s), 1 cells burnt |
| 10000 | `mech/full-4/frame-010000.png` | zebra 87, rhino 0, leopard 0; grass 528, bush 97, tree 61; food cells 1162, browse 953; mouths/zebra 1.00; zebras with killer 99%; striped 100%; eyes/zebra 2.01; soil water 0.47 | - |
| 15000 | `mech/full-4/frame-015000.png` | zebra 50, rhino 0, leopard 0; grass 561, bush 23, tree 86; food cells 1890, browse 1649; mouths/zebra 1.00; zebras with killer 86%; striped 100%; eyes/zebra 2.12; soil water 0.52. Change since last frame: zebra -37 (-43%), bush -74 (-76%), tree +25 (+41%) | 1 fire(s), 1 cells burnt |
| 20000 | `mech/full-4/frame-020000.png` | zebra 42, rhino 0, leopard 0; grass 688, bush 6, tree 92; food cells 1805, browse 1568; mouths/zebra 1.00; zebras with killer 100%; striped 100%; eyes/zebra 1.55; soil water 0.52. Change since last frame: bush -17 (-74%) | - |
| 25000 | `mech/full-4/frame-025000.png` | zebra 86, rhino 0, leopard 0; grass 708, bush 9, tree 81; food cells 1285, browse 1261; mouths/zebra 1.12; zebras with killer 100%; striped 100%; eyes/zebra 1.98; soil water 0.51. Change since last frame: zebra +44 (+105%), bush +3 (+50%) | 2 fire(s), 6 cells burnt |
| 27300 | `mech/full-4/event-027300-bush-collapse.png` | zebra 49, rhino 0, leopard 0; grass 773, bush 1, tree 78; food cells 1352, browse 1073; mouths/zebra 1.00; zebras with killer 100%; striped 100%; eyes/zebra 1.96; soil water 0.51. Change since last frame: zebra -37 (-43%), bush -8 (-89%) | bush collapse at 27300 (peak 132 at 600); 2 fire(s), 10 cells burnt |
| 30000 | `mech/full-4/frame-030000.png` | zebra 5, rhino 0, leopard 0; grass 1028, bush 1, tree 78; food cells 1395, browse 1183; mouths/zebra 1.00; zebras with killer 100%; striped 100%; eyes/zebra 2.00; soil water 0.48. Change since last frame: zebra -44 (-90%), grass +255 (+33%) | 2 fire(s), 10 cells burnt |
| 30700 | `mech/full-4/event-030700-zebra-collapse.png` | zebra 2, rhino 0, leopard 0; grass 1012, bush 2, tree 78; food cells 1513, browse 1261; mouths/zebra 1.00; zebras with killer 100%; striped 100%; eyes/zebra 2.00; soil water 0.48. Change since last frame: zebra -3 (-60%) | zebra collapse at 30700 (peak 127 at 4800) |
| 31200 | `mech/full-4/event-031200-zebra-extinct.png` | zebra 0, rhino 0, leopard 0; grass 984, bush 1, tree 78; food cells 1172, browse 912; mouths/zebra 0.00; soil water 0.48 | zebra extinct at 31200 (peak 127 at 4800) |
| 32800 | `mech/full-4/event-032800-bush-extinct.png` | zebra 0, rhino 0, leopard 0; grass 1063, bush 0, tree 69; food cells 837, browse 750; mouths/zebra 0.00; soil water 0.46 | bush extinct at 32800 (peak 132 at 600) |
| 40000 | `mech/full-4/frame-040000.png` | zebra 0, rhino 0, leopard 0; grass 1240, bush 0, tree 56; food cells 815, browse 979; mouths/zebra 0.00; soil water 0.46 | 3 fire(s), 4 cells burnt |

#### mech/full-5

- **zebra: persisted.** 36 -> peak 161 at tick 20200; 123 alive at the end; mouths per animal rose by 1.02.
- **rhino: boom then collapse, no trait (unresolved).** 12 -> peak 37 at tick 1800; extinct at tick 10400; food plants 546 at the peak -> 607 at extinction; main cause of death after the peak: age (83).
- **leopard: boom-bust: cohort aged out.** 16 -> peak 24 at tick 900; extinct at tick 3400; food plants 465 at the peak -> 496 at extinction; main cause of death after the peak: age (21).

| tick | screenshot | state | events since previous frame |
|---|---|---|---|
| 0 | `mech/full-5/frame-000000.png` | zebra 36, rhino 12, leopard 16; grass 140, bush 45, tree 14; food cells 0; mouths/zebra 1.00; zebras with killer 100%; striped 100%; eyes/zebra 2.00; horned rhinos 100%; leopards with cache 100%; soil water 0.62 | - |
| 2500 | `mech/full-5/frame-002500.png` | zebra 96, rhino 19, leopard 7; grass 472, bush 60, tree 24; food cells 1228, browse 296; mouths/zebra 1.01; zebras with killer 100%; striped 100%; eyes/zebra 2.00; horned rhinos 100%; leopards with cache 100%; soil water 0.45. Change since last frame: zebra +60 (+167%), rhino +7 (+58%), leopard -9 (-56%), grass +332 (+237%), bush +15 (+33%), tree +10 (+71%) | 1 fire(s), 8 cells burnt |
| 3300 | `mech/full-5/event-003300-leopard-collapse.png` | zebra 130, rhino 11, leopard 1; grass 451, bush 61, tree 28; food cells 1252, browse 383; mouths/zebra 1.00; zebras with killer 98%; striped 100%; eyes/zebra 2.00; horned rhinos 100%; leopards with cache 100%; soil water 0.44. Change since last frame: zebra +34 (+35%), rhino -8 (-42%), leopard -6 (-86%) | leopard collapse at 3300 (peak 24 at 900) |
| 3400 | `mech/full-5/event-003400-leopard-extinct.png` | zebra 130, rhino 11, leopard 0; grass 436, bush 60, tree 28; food cells 1284, browse 377; mouths/zebra 1.00; zebras with killer 98%; striped 100%; eyes/zebra 1.99; horned rhinos 100%; soil water 0.44 | leopard extinct at 3400 (peak 24 at 900) |
| 5000 | `mech/full-5/frame-005000.png` | zebra 131, rhino 7, leopard 0; grass 435, bush 91, tree 42; food cells 873, browse 527; mouths/zebra 0.98; zebras with killer 96%; striped 100%; eyes/zebra 2.01; horned rhinos 100%; soil water 0.45. Change since last frame: rhino -4 (-36%), bush +31 (+52%), tree +14 (+50%) | - |
| 9000 | `mech/full-5/event-009000-rhino-collapse.png` | zebra 104, rhino 2, leopard 0; grass 475, bush 77, tree 57; food cells 1120, browse 639; mouths/zebra 1.00; zebras with killer 82%; striped 100%; eyes/zebra 1.99; horned rhinos 100%; soil water 0.48. Change since last frame: rhino -5 (-71%), tree +15 (+36%) | rhino collapse at 9000 (peak 37 at 1800); 1 fire(s), 22 cells burnt |
| 10000 | `mech/full-5/frame-010000.png` | zebra 96, rhino 1, leopard 0; grass 513, bush 65, tree 64; food cells 1295, browse 851; mouths/zebra 1.00; zebras with killer 82%; striped 100%; eyes/zebra 1.99; horned rhinos 100%; soil water 0.49 | - |
| 10400 | `mech/full-5/event-010400-rhino-extinct.png` | zebra 95, rhino 0, leopard 0; grass 535, bush 72, tree 68; food cells 1411, browse 909; mouths/zebra 1.00; zebras with killer 78%; striped 100%; eyes/zebra 2.00; soil water 0.49 | rhino extinct at 10400 (peak 37 at 1800) |
| 15000 | `mech/full-5/frame-015000.png` | zebra 111, rhino 0, leopard 0; grass 586, bush 42, tree 77; food cells 1600, browse 894; mouths/zebra 1.26; zebras with killer 29%; striped 100%; eyes/zebra 1.72; soil water 0.50. Change since last frame: bush -30 (-42%) | 2 fire(s), 11 cells burnt |
| 20000 | `mech/full-5/frame-020000.png` | zebra 156, rhino 0, leopard 0; grass 588, bush 50, tree 83; food cells 936, browse 865; mouths/zebra 1.78; zebras with killer 7%; striped 99%; eyes/zebra 1.23; soil water 0.50. Change since last frame: zebra +45 (+41%) | 3 fire(s), 5 cells burnt |
| 25000 | `mech/full-5/frame-025000.png` | zebra 142, rhino 0, leopard 0; grass 587, bush 35, tree 95; food cells 1072, browse 861; mouths/zebra 1.99; striped 100%; eyes/zebra 1.08; soil water 0.49. Change since last frame: bush -15 (-30%) | 1 fire(s), 1 cells burnt |
| 30000 | `mech/full-5/frame-030000.png` | zebra 115, rhino 0, leopard 0; grass 656, bush 33, tree 105; food cells 842, browse 664; mouths/zebra 1.98; striped 99%; eyes/zebra 1.00; soil water 0.50 | 5 fire(s), 28 cells burnt |
| 40000 | `mech/full-5/frame-040000.png` | zebra 123, rhino 0, leopard 0; grass 760, bush 32, tree 122; food cells 729, browse 1029; mouths/zebra 2.00; striped 2%; eyes/zebra 0.49; soil water 0.51 | 3 fire(s), 6 cells burnt |

### rain-high

**What we tried:** Mechanism check with double rain, 40,000 ticks.

**Outcome across seeds:**

- zebra: persisted x1; boom then collapse, no trait (unresolved) x4
- rhino: suicide candidate (3 of 4) x2; boom then collapse, no trait (unresolved) x3
- leopard: boom-bust: cohort aged out x4; boom-bust: over-predation x1

#### mech/rain-high-1

- **zebra: persisted.** 35 -> peak 294 at tick 40000; 294 alive at the end; mouths per animal rose by 0.68.
- **rhino: suicide candidate (3 of 4).** 12 -> peak 44 at tick 2900; extinct at tick 11900; share with a killer cell rose by 56%; food plants 584 at the peak -> 600 at extinction; main cause of death after the peak: age (146).
- **leopard: boom-bust: cohort aged out.** 16 -> peak 28 at tick 700; extinct at tick 5700; food plants 484 at the peak -> 596 at extinction; main cause of death after the peak: age (28).

| tick | screenshot | state | events since previous frame |
|---|---|---|---|
| 0 | `mech/rain-high-1/frame-000000.png` | zebra 35, rhino 12, leopard 16; grass 140, bush 45, tree 14; food cells 0; mouths/zebra 1.00; zebras with killer 100%; striped 100%; eyes/zebra 2.00; horned rhinos 100%; leopards with cache 100%; soil water 0.63 | - |
| 2500 | `mech/rain-high-1/frame-002500.png` | zebra 101, rhino 39, leopard 4; grass 523, bush 76, tree 25; food cells 1384, browse 413; mouths/zebra 1.00; zebras with killer 97%; striped 100%; eyes/zebra 2.00; horned rhinos 97%; leopards with cache 100%; soil water 0.51. Change since last frame: zebra +66 (+189%), rhino +27 (+225%), leopard -12 (-75%), grass +383 (+274%), bush +31 (+69%), tree +11 (+79%) | - |
| 3800 | `mech/rain-high-1/event-003800-leopard-collapse.png` | zebra 100, rhino 33, leopard 2; grass 515, bush 71, tree 36; food cells 1342, browse 535; mouths/zebra 1.00; zebras with killer 100%; striped 100%; eyes/zebra 2.00; horned rhinos 97%; leopards with cache 100%; soil water 0.51. Change since last frame: tree +11 (+44%) | leopard collapse at 3800 (peak 28 at 700) |
| 5000 | `mech/rain-high-1/frame-005000.png` | zebra 108, rhino 25, leopard 3; grass 571, bush 52, tree 43; food cells 1570, browse 414; mouths/zebra 1.01; zebras with killer 99%; striped 100%; eyes/zebra 1.97; horned rhinos 76%; leopards with cache 100%; soil water 0.51. Change since last frame: bush -19 (-27%) | - |
| 5700 | `mech/rain-high-1/event-005700-leopard-extinct.png` | zebra 123, rhino 30, leopard 0; grass 557, bush 39, tree 49; food cells 1378, browse 464; mouths/zebra 1.05; zebras with killer 98%; striped 99%; eyes/zebra 1.94; horned rhinos 83%; soil water 0.50. Change since last frame: leopard -3 (-100%), bush -13 (-25%) | leopard extinct at 5700 (peak 28 at 700) |
| 8000 | `mech/rain-high-1/event-008000-bush-collapse.png` | zebra 160, rhino 8, leopard 0; grass 592, bush 2, tree 63; food cells 1225, browse 377; mouths/zebra 1.45; zebras with killer 54%; rhinos with killer 25%; striped 97%; eyes/zebra 1.55; horned rhinos 100%; soil water 0.51. Change since last frame: zebra +37 (+30%), rhino -22 (-73%), bush -37 (-95%), tree +14 (+29%) | bush collapse at 8000 (peak 114 at 600) |
| 8600 | `mech/rain-high-1/event-008600-bush-extinct.png` | zebra 176, rhino 9, leopard 0; grass 558, bush 0, tree 54; food cells 1257, browse 319; mouths/zebra 1.45; zebras with killer 52%; rhinos with killer 44%; striped 94%; eyes/zebra 1.55; horned rhinos 100%; soil water 0.52 | bush extinct at 8600 (peak 114 at 600); 1 fire(s), 2 cells burnt |
| 10000 | `mech/rain-high-1/frame-010000.png` | zebra 150, rhino 5, leopard 0; grass 609, bush 0, tree 63; food cells 1409, browse 359; mouths/zebra 1.45; zebras with killer 52%; rhinos with killer 20%; striped 96%; eyes/zebra 1.55; horned rhinos 100%; soil water 0.53. Change since last frame: rhino -4 (-44%) | 1 fire(s), 1 cells burnt |
| 10500 | `mech/rain-high-1/event-010500-rhino-collapse.png` | zebra 176, rhino 2, leopard 0; grass 621, bush 0, tree 65; food cells 1555, browse 450; mouths/zebra 1.49; zebras with killer 48%; striped 99%; eyes/zebra 1.49; horned rhinos 100%; soil water 0.53. Change since last frame: rhino -3 (-60%) | rhino collapse at 10500 (peak 44 at 2900); 1 fire(s), 12 cells burnt |
| 11900 | `mech/rain-high-1/event-011900-rhino-extinct.png` | zebra 126, rhino 0, leopard 0; grass 600, bush 0, tree 67; food cells 1894, browse 599; mouths/zebra 1.55; zebras with killer 44%; striped 100%; eyes/zebra 1.44; soil water 0.54. Change since last frame: zebra -50 (-28%) | rhino extinct at 11900 (peak 44 at 2900) |
| 15000 | `mech/rain-high-1/frame-015000.png` | zebra 121, rhino 0, leopard 0; grass 646, bush 0, tree 81; food cells 2244, browse 839; mouths/zebra 1.57; zebras with killer 42%; striped 100%; eyes/zebra 1.39; soil water 0.56 | 1 fire(s), 3 cells burnt |
| 20000 | `mech/rain-high-1/frame-020000.png` | zebra 135, rhino 0, leopard 0; grass 715, bush 0, tree 95; food cells 1570, browse 756; mouths/zebra 1.44; zebras with killer 12%; striped 99%; eyes/zebra 1.55; soil water 0.55 | 1 fire(s), 1 cells burnt |
| 25000 | `mech/rain-high-1/frame-025000.png` | zebra 171, rhino 0, leopard 0; grass 834, bush 0, tree 85; food cells 1346, browse 875; mouths/zebra 1.43; zebras with killer 2%; striped 97%; eyes/zebra 1.46; soil water 0.55. Change since last frame: zebra +36 (+27%) | 4 fire(s), 64 cells burnt |
| 30000 | `mech/rain-high-1/frame-030000.png` | zebra 169, rhino 0, leopard 0; grass 973, bush 0, tree 63; food cells 1069, browse 1226; mouths/zebra 1.57; zebras with killer 1%; striped 99%; eyes/zebra 1.28; soil water 0.56. Change since last frame: tree -22 (-26%) | 3 fire(s), 27 cells burnt |
| 40000 | `mech/rain-high-1/frame-040000.png` | zebra 294, rhino 0, leopard 0; grass 1078, bush 0, tree 30; food cells 494, browse 1104; mouths/zebra 1.68; zebras with killer 1%; striped 32%; eyes/zebra 0.17; soil water 0.55. Change since last frame: zebra +125 (+74%), tree -33 (-52%) | 4 fire(s), 15 cells burnt |

#### mech/rain-high-2

- **zebra: boom then collapse, no trait (unresolved).** 32 -> peak 119 at tick 18800; extinct at tick 28900; food plants 799 at the peak -> 1211 at extinction; main cause of death after the peak: age (328).
- **rhino: boom then collapse, no trait (unresolved).** 12 -> peak 70 at tick 3100; extinct at tick 26200; food plants 619 at the peak -> 1159 at extinction; main cause of death after the peak: age (514).
- **leopard: boom-bust: cohort aged out.** 16 -> peak 29 at tick 900; extinct at tick 2600; food plants 536 at the peak -> 587 at extinction; main cause of death after the peak: age (21).

| tick | screenshot | state | events since previous frame |
|---|---|---|---|
| 0 | `mech/rain-high-2/frame-000000.png` | zebra 32, rhino 12, leopard 16; grass 140, bush 45, tree 14; food cells 0; mouths/zebra 1.00; zebras with killer 100%; striped 100%; eyes/zebra 2.00; horned rhinos 100%; leopards with cache 100%; soil water 0.60 | - |
| 2100 | `mech/rain-high-2/event-002100-leopard-collapse.png` | zebra 58, rhino 35, leopard 2; grass 461, bush 87, tree 19; food cells 2102, browse 566; mouths/zebra 1.00; zebras with killer 100%; striped 100%; eyes/zebra 2.00; horned rhinos 100%; leopards with cache 100%; soil water 0.51. Change since last frame: zebra +26 (+81%), rhino +23 (+192%), leopard -14 (-88%), grass +321 (+229%), bush +42 (+93%), tree +5 (+36%) | leopard collapse at 2100 (peak 29 at 900); 2 fire(s), 18 cells burnt |
| 2500 | `mech/rain-high-2/frame-002500.png` | zebra 74, rhino 51, leopard 1; grass 502, bush 84, tree 22; food cells 1292, browse 457; mouths/zebra 1.00; zebras with killer 100%; striped 100%; eyes/zebra 2.00; horned rhinos 100%; leopards with cache 100%; soil water 0.49. Change since last frame: zebra +16 (+28%), rhino +16 (+46%) | - |
| 2600 | `mech/rain-high-2/event-002600-leopard-extinct.png` | zebra 80, rhino 56, leopard 0; grass 502, bush 85, tree 22; food cells 1211, browse 435; mouths/zebra 1.00; zebras with killer 100%; striped 100%; eyes/zebra 1.99; horned rhinos 100%; soil water 0.49 | leopard extinct at 2600 (peak 29 at 900) |
| 5000 | `mech/rain-high-2/frame-005000.png` | zebra 86, rhino 43, leopard 0; grass 501, bush 79, tree 38; food cells 1193, browse 427; mouths/zebra 1.00; zebras with killer 99%; striped 100%; eyes/zebra 1.99; horned rhinos 100%; soil water 0.49. Change since last frame: tree +16 (+73%) | - |
| 10000 | `mech/rain-high-2/frame-010000.png` | zebra 72, rhino 42, leopard 0; grass 643, bush 50, tree 51; food cells 1646, browse 799; mouths/zebra 1.00; zebras with killer 100%; striped 97%; eyes/zebra 1.99; horned rhinos 95%; soil water 0.52. Change since last frame: grass +142 (+28%), bush -29 (-37%), tree +13 (+34%) | 4 fire(s), 65 cells burnt |
| 14300 | `mech/rain-high-2/event-014300-bush-collapse.png` | zebra 92, rhino 24, leopard 0; grass 745, bush 2, tree 55; food cells 1695, browse 600; mouths/zebra 1.00; zebras with killer 96%; striped 100%; eyes/zebra 1.97; horned rhinos 100%; soil water 0.53. Change since last frame: zebra +20 (+28%), rhino -18 (-43%), bush -48 (-96%) | bush collapse at 14300 (peak 133 at 600) |
| 14900 | `mech/rain-high-2/event-014900-bush-extinct.png` | zebra 83, rhino 21, leopard 0; grass 795, bush 0, tree 55; food cells 1857, browse 587; mouths/zebra 1.00; zebras with killer 96%; striped 100%; eyes/zebra 1.96; horned rhinos 100%; soil water 0.52 | bush extinct at 14900 (peak 133 at 600) |
| 15000 | `mech/rain-high-2/frame-015000.png` | zebra 87, rhino 18, leopard 0; grass 814, bush 0, tree 55; food cells 1910, browse 590; mouths/zebra 1.00; zebras with killer 95%; striped 100%; eyes/zebra 1.97; horned rhinos 100%; soil water 0.53 | - |
| 20000 | `mech/rain-high-2/frame-020000.png` | zebra 87, rhino 14, leopard 0; grass 870, bush 0, tree 60; food cells 1871, browse 651; mouths/zebra 1.00; zebras with killer 100%; striped 85%; eyes/zebra 1.92; horned rhinos 100%; soil water 0.53 | 2 fire(s), 19 cells burnt |
| 25000 | `mech/rain-high-2/frame-025000.png` | zebra 44, rhino 5, leopard 0; grass 1063, bush 0, tree 66; food cells 1068, browse 452; mouths/zebra 1.09; zebras with killer 100%; striped 18%; eyes/zebra 0.77; horned rhinos 100%; soil water 0.51. Change since last frame: zebra -43 (-49%), rhino -9 (-64%) | 1 fire(s), 5 cells burnt |
| 25600 | `mech/rain-high-2/event-025600-rhino-collapse.png` | zebra 27, rhino 1, leopard 0; grass 1095, bush 0, tree 64; food cells 1130, browse 422; mouths/zebra 1.07; zebras with killer 100%; striped 11%; eyes/zebra 0.67; horned rhinos 100%; soil water 0.51. Change since last frame: zebra -17 (-39%), rhino -4 (-80%) | rhino collapse at 25600 (peak 70 at 3100) |
| 26200 | `mech/rain-high-2/event-026200-rhino-extinct.png` | zebra 18, rhino 0, leopard 0; grass 1159, bush 0, tree 67; food cells 1103, browse 368; mouths/zebra 1.17; zebras with killer 100%; striped 11%; eyes/zebra 0.72; soil water 0.51. Change since last frame: zebra -9 (-33%) | rhino extinct at 26200 (peak 70 at 3100) |
| 28100 | `mech/rain-high-2/event-028100-zebra-collapse.png` | zebra 2, rhino 0, leopard 0; grass 1186, bush 0, tree 62; food cells 961, browse 382; mouths/zebra 1.00; zebras with killer 100%; soil water 0.51. Change since last frame: zebra -16 (-89%) | zebra collapse at 28100 (peak 119 at 18800); 1 fire(s), 4 cells burnt |
| 28900 | `mech/rain-high-2/event-028900-zebra-extinct.png` | zebra 0, rhino 0, leopard 0; grass 1211, bush 0, tree 63; food cells 754, browse 355; mouths/zebra 0.00; soil water 0.51 | zebra extinct at 28900 (peak 119 at 18800) |
| 30000 | `mech/rain-high-2/frame-030000.png` | zebra 0, rhino 0, leopard 0; grass 1218, bush 0, tree 58; food cells 601, browse 232; mouths/zebra 0.00; soil water 0.51 | 3 fire(s), 6 cells burnt |
| 40000 | `mech/rain-high-2/frame-040000.png` | zebra 0, rhino 0, leopard 0; grass 1323, bush 0, tree 38; food cells 699, browse 614; mouths/zebra 0.00; soil water 0.51. Change since last frame: tree -20 (-34%) | 4 fire(s), 44 cells burnt |

#### mech/rain-high-3

- **zebra: boom then collapse, no trait (unresolved).** 34 -> peak 77 at tick 6100; extinct at tick 27800; food plants 586 at the peak -> 1243 at extinction; main cause of death after the peak: age (812).
- **rhino: suicide candidate (3 of 4).** 12 -> peak 98 at tick 4300; extinct at tick 21700; mouths per animal rose by 1.03; food plants 586 at the peak -> 1114 at extinction; main cause of death after the peak: age (662).
- **leopard: boom-bust: cohort aged out.** 16 -> peak 25 at tick 900; extinct at tick 3800; food plants 485 at the peak -> 622 at extinction; main cause of death after the peak: age (28).

| tick | screenshot | state | events since previous frame |
|---|---|---|---|
| 0 | `mech/rain-high-3/frame-000000.png` | zebra 34, rhino 12, leopard 16; grass 140, bush 45, tree 14; food cells 0; mouths/zebra 1.00; zebras with killer 100%; striped 100%; eyes/zebra 2.00; horned rhinos 100%; leopards with cache 100%; soil water 0.61 | - |
| 2500 | `mech/rain-high-3/frame-002500.png` | zebra 40, rhino 60, leopard 7; grass 581, bush 73, tree 25; food cells 1761, browse 414; mouths/zebra 1.00; zebras with killer 100%; striped 100%; eyes/zebra 1.98; horned rhinos 100%; leopards with cache 100%; soil water 0.48. Change since last frame: rhino +48 (+400%), leopard -9 (-56%), grass +441 (+315%), bush +28 (+62%), tree +11 (+79%) | 1 fire(s), 9 cells burnt |
| 3500 | `mech/rain-high-3/event-003500-leopard-collapse.png` | zebra 45, rhino 70, leopard 2; grass 581, bush 51, tree 32; food cells 1597, browse 356; mouths/zebra 1.00; zebras with killer 100%; striped 100%; eyes/zebra 2.00; horned rhinos 100%; leopards with cache 100%; soil water 0.48. Change since last frame: leopard -5 (-71%), bush -22 (-30%), tree +7 (+28%) | leopard collapse at 3500 (peak 25 at 900) |
| 3800 | `mech/rain-high-3/event-003800-leopard-extinct.png` | zebra 44, rhino 84, leopard 0; grass 572, bush 50, tree 32; food cells 1460, browse 301; mouths/zebra 1.00; zebras with killer 100%; striped 100%; eyes/zebra 2.00; horned rhinos 100%; soil water 0.48 | leopard extinct at 3800 (peak 25 at 900) |
| 5000 | `mech/rain-high-3/frame-005000.png` | zebra 61, rhino 76, leopard 0; grass 521, bush 67, tree 43; food cells 1279, browse 482; mouths/zebra 1.00; zebras with killer 100%; striped 100%; eyes/zebra 2.00; horned rhinos 99%; soil water 0.49. Change since last frame: zebra +17 (+39%), bush +17 (+34%), tree +11 (+34%) | - |
| 10000 | `mech/rain-high-3/frame-010000.png` | zebra 67, rhino 42, leopard 0; grass 597, bush 31, tree 63; food cells 1589, browse 519; mouths/zebra 0.99; zebras with killer 100%; striped 100%; eyes/zebra 2.00; horned rhinos 100%; soil water 0.51. Change since last frame: rhino -34 (-45%), bush -36 (-54%), tree +20 (+47%) | 2 fire(s), 26 cells burnt |
| 15000 | `mech/rain-high-3/frame-015000.png` | zebra 67, rhino 17, leopard 0; grass 625, bush 32, tree 76; food cells 1982, browse 915; mouths/zebra 1.00; zebras with killer 100%; striped 100%; eyes/zebra 1.97; horned rhinos 100%; soil water 0.54. Change since last frame: rhino -25 (-60%) | 2 fire(s), 4 cells burnt |
| 20000 | `mech/rain-high-3/frame-020000.png` | zebra 32, rhino 21, leopard 0; grass 882, bush 10, tree 85; food cells 1288, browse 662; mouths/zebra 1.00; zebras with killer 63%; striped 100%; eyes/zebra 1.66; horned rhinos 100%; soil water 0.53. Change since last frame: zebra -35 (-52%), grass +257 (+41%), bush -22 (-69%) | - |
| 21200 | `mech/rain-high-3/event-021200-rhino-collapse.png` | zebra 20, rhino 2, leopard 0; grass 1053, bush 13, tree 81; food cells 1408, browse 655; mouths/zebra 1.00; zebras with killer 30%; striped 100%; eyes/zebra 1.60; horned rhinos 100%; soil water 0.51. Change since last frame: zebra -12 (-38%), rhino -19 (-90%), bush +3 (+30%) | rhino collapse at 21200 (peak 98 at 4300) |
| 21700 | `mech/rain-high-3/event-021700-rhino-extinct.png` | zebra 12, rhino 0, leopard 0; grass 1104, bush 10, tree 83; food cells 1437, browse 675; mouths/zebra 1.00; zebras with killer 17%; striped 100%; eyes/zebra 1.58; soil water 0.51. Change since last frame: zebra -8 (-40%) | rhino extinct at 21700 (peak 98 at 4300) |
| 23700 | `mech/rain-high-3/event-023700-bush-collapse.png` | zebra 12, rhino 0, leopard 0; grass 1088, bush 2, tree 84; food cells 1780, browse 913; mouths/zebra 1.00; striped 100%; eyes/zebra 1.08; soil water 0.52. Change since last frame: bush -8 (-80%) | bush collapse at 23700 (peak 114 at 600); 2 fire(s), 26 cells burnt |
| 24100 | `mech/rain-high-3/event-024100-bush-extinct.png` | zebra 19, rhino 0, leopard 0; grass 1102, bush 0, tree 82; food cells 1837, browse 873; mouths/zebra 1.00; striped 100%; eyes/zebra 1.00; soil water 0.51. Change since last frame: zebra +7 (+58%) | bush extinct at 24100 (peak 114 at 600) |
| 25000 | `mech/rain-high-3/frame-025000.png` | zebra 17, rhino 0, leopard 0; grass 1183, bush 0, tree 73; food cells 1593, browse 704; mouths/zebra 1.00; striped 100%; eyes/zebra 1.00; soil water 0.51 | - |
| 27000 | `mech/rain-high-3/event-027000-zebra-collapse.png` | zebra 2, rhino 0, leopard 0; grass 1285, bush 0, tree 66; food cells 862, browse 351; mouths/zebra 1.00; striped 100%; eyes/zebra 1.00; soil water 0.50. Change since last frame: zebra -15 (-88%) | zebra collapse at 27000 (peak 77 at 6100); 1 fire(s), 2 cells burnt |
| 27800 | `mech/rain-high-3/event-027800-zebra-extinct.png` | zebra 0, rhino 0, leopard 0; grass 1243, bush 0, tree 64; food cells 887, browse 331; mouths/zebra 0.00; soil water 0.51 | zebra extinct at 27800 (peak 77 at 6100) |
| 30000 | `mech/rain-high-3/frame-030000.png` | zebra 0, rhino 0, leopard 0; grass 1258, bush 0, tree 59; food cells 693, browse 227; mouths/zebra 0.00; soil water 0.51 | 2 fire(s), 9 cells burnt |
| 40000 | `mech/rain-high-3/frame-040000.png` | zebra 0, rhino 0, leopard 0; grass 1350, bush 0, tree 35; food cells 494, browse 623; mouths/zebra 0.00; soil water 0.52. Change since last frame: tree -24 (-41%) | 3 fire(s), 5 cells burnt |

#### mech/rain-high-4

- **zebra: boom then collapse, no trait (unresolved).** 36 -> peak 56 at tick 11200; extinct at tick 18200; food plants 602 at the peak -> 889 at extinction; main cause of death after the peak: age (104).
- **rhino: boom then collapse, no trait (unresolved).** 12 -> peak 99 at tick 6100; extinct at tick 22500; food plants 632 at the peak -> 1058 at extinction; main cause of death after the peak: age (594).
- **leopard: boom-bust: over-predation.** 16 -> peak 31 at tick 800; extinct at tick 6700; food plants 557 at the peak -> 634 at extinction; main cause of death after the peak: age (42).

| tick | screenshot | state | events since previous frame |
|---|---|---|---|
| 0 | `mech/rain-high-4/frame-000000.png` | zebra 36, rhino 12, leopard 16; grass 140, bush 45, tree 14; food cells 0; mouths/zebra 1.00; zebras with killer 100%; striped 100%; eyes/zebra 2.00; horned rhinos 100%; leopards with cache 100%; soil water 0.62 | - |
| 2500 | `mech/rain-high-4/frame-002500.png` | zebra 20, rhino 77, leopard 8; grass 498, bush 97, tree 27; food cells 1204, browse 641; mouths/zebra 1.00; zebras with killer 100%; rhinos with killer 1%; striped 100%; eyes/zebra 2.00; horned rhinos 100%; leopards with cache 100%; soil water 0.51. Change since last frame: zebra -16 (-44%), rhino +65 (+542%), leopard -8 (-50%), grass +358 (+256%), bush +52 (+116%), tree +13 (+93%) | 2 fire(s), 14 cells burnt |
| 5000 | `mech/rain-high-4/frame-005000.png` | zebra 10, rhino 85, leopard 6; grass 513, bush 63, tree 37; food cells 1413, browse 491; mouths/zebra 1.00; zebras with killer 100%; striped 100%; eyes/zebra 2.00; horned rhinos 100%; leopards with cache 100%; soil water 0.51. Change since last frame: zebra -10 (-50%), bush -34 (-35%), tree +10 (+37%) | 1 fire(s), 27 cells burnt |
| 6200 | `mech/rain-high-4/event-006200-leopard-collapse.png` | zebra 12, rhino 95, leopard 2; grass 557, bush 77, tree 43; food cells 1431, browse 562; mouths/zebra 1.00; zebras with killer 100%; striped 100%; eyes/zebra 2.00; horned rhinos 100%; leopards with cache 100%; soil water 0.50. Change since last frame: leopard -4 (-67%) | leopard collapse at 6200 (peak 31 at 800) |
| 6700 | `mech/rain-high-4/event-006700-leopard-extinct.png` | zebra 10, rhino 96, leopard 0; grass 555, bush 79, tree 46; food cells 1548, browse 700; mouths/zebra 1.00; zebras with killer 100%; striped 100%; eyes/zebra 2.00; horned rhinos 100%; soil water 0.50 | leopard extinct at 6700 (peak 31 at 800); 1 fire(s), 23 cells burnt |
| 10000 | `mech/rain-high-4/frame-010000.png` | zebra 48, rhino 52, leopard 0; grass 642, bush 39, tree 52; food cells 1733, browse 792; mouths/zebra 1.00; zebras with killer 100%; striped 100%; eyes/zebra 2.00; horned rhinos 100%; soil water 0.51. Change since last frame: zebra +38 (+380%), rhino -44 (-46%), bush -40 (-51%) | 1 fire(s), 7 cells burnt |
| 14100 | `mech/rain-high-4/event-014100-bush-collapse.png` | zebra 12, rhino 22, leopard 0; grass 821, bush 2, tree 67; food cells 1473, browse 588; mouths/zebra 1.00; zebras with killer 100%; striped 100%; eyes/zebra 2.00; horned rhinos 100%; soil water 0.53. Change since last frame: zebra -36 (-75%), rhino -30 (-58%), grass +179 (+28%), bush -37 (-95%), tree +15 (+29%) | bush collapse at 14100 (peak 138 at 600); 1 fire(s), 66 cells burnt |
| 14700 | `mech/rain-high-4/event-014700-bush-extinct.png` | zebra 7, rhino 20, leopard 0; grass 826, bush 0, tree 68; food cells 1354, browse 567; mouths/zebra 1.00; zebras with killer 100%; striped 100%; eyes/zebra 2.00; horned rhinos 100%; soil water 0.54. Change since last frame: zebra -5 (-42%) | bush extinct at 14700 (peak 138 at 600) |
| 15000 | `mech/rain-high-4/frame-015000.png` | zebra 3, rhino 19, leopard 0; grass 822, bush 0, tree 68; food cells 1408, browse 613; mouths/zebra 1.00; zebras with killer 100%; striped 100%; eyes/zebra 2.00; horned rhinos 100%; soil water 0.54. Change since last frame: zebra -4 (-57%) | - |
| 15100 | `mech/rain-high-4/event-015100-zebra-collapse.png` | zebra 2, rhino 19, leopard 0; grass 822, bush 0, tree 68; food cells 1463, browse 624; mouths/zebra 1.00; zebras with killer 100%; striped 100%; eyes/zebra 2.00; horned rhinos 100%; soil water 0.54 | zebra collapse at 15100 (peak 56 at 11200) |
| 18200 | `mech/rain-high-4/event-018200-zebra-extinct.png` | zebra 0, rhino 20, leopard 0; grass 889, bush 0, tree 78; food cells 1407, browse 659; mouths/zebra 0.00; horned rhinos 100%; soil water 0.54 | zebra extinct at 18200 (peak 56 at 11200); 1 fire(s), 4 cells burnt |
| 20000 | `mech/rain-high-4/frame-020000.png` | zebra 0, rhino 19, leopard 0; grass 919, bush 0, tree 91; food cells 1233, browse 601; mouths/zebra 0.00; horned rhinos 100%; soil water 0.53 | - |
| 22000 | `mech/rain-high-4/event-022000-rhino-collapse.png` | zebra 0, rhino 2, leopard 0; grass 1039, bush 0, tree 91; food cells 884, browse 544; mouths/zebra 0.00; horned rhinos 100%; soil water 0.52. Change since last frame: rhino -17 (-89%) | rhino collapse at 22000 (peak 99 at 6100) |
| 22500 | `mech/rain-high-4/event-022500-rhino-extinct.png` | zebra 0, rhino 0, leopard 0; grass 1058, bush 0, tree 90; food cells 870, browse 494; mouths/zebra 0.00; soil water 0.52 | rhino extinct at 22500 (peak 99 at 6100) |
| 25000 | `mech/rain-high-4/frame-025000.png` | zebra 0, rhino 0, leopard 0; grass 1089, bush 0, tree 95; food cells 821, browse 618; mouths/zebra 0.00; soil water 0.53 | 1 fire(s), 5 cells burnt |
| 30000 | `mech/rain-high-4/frame-030000.png` | zebra 0, rhino 0, leopard 0; grass 1230, bush 0, tree 75; food cells 909, browse 727; mouths/zebra 0.00; soil water 0.51 | 1 fire(s), 4 cells burnt |
| 40000 | `mech/rain-high-4/frame-040000.png` | zebra 0, rhino 0, leopard 0; grass 1371, bush 0, tree 47; food cells 969, browse 900; mouths/zebra 0.00; soil water 0.52. Change since last frame: tree -28 (-37%) | 3 fire(s), 15 cells burnt |

#### mech/rain-high-5

- **zebra: boom then collapse, no trait (unresolved).** 36 -> peak 62 at tick 3200; extinct at tick 8600; food plants 627 at the peak -> 902 at extinction; main cause of death after the peak: age (187).
- **rhino: boom then collapse, no trait (unresolved).** 12 -> peak 77 at tick 3100; extinct at tick 25000; food plants 643 at the peak -> 1250 at extinction; main cause of death after the peak: age (487).
- **leopard: boom-bust: cohort aged out.** 16 -> peak 32 at tick 900; extinct at tick 4300; food plants 516 at the peak -> 704 at extinction; main cause of death after the peak: age (32).

| tick | screenshot | state | events since previous frame |
|---|---|---|---|
| 0 | `mech/rain-high-5/frame-000000.png` | zebra 36, rhino 12, leopard 16; grass 140, bush 45, tree 14; food cells 0; mouths/zebra 1.00; zebras with killer 100%; striped 100%; eyes/zebra 2.00; horned rhinos 100%; leopards with cache 100%; soil water 0.62 | - |
| 2500 | `mech/rain-high-5/frame-002500.png` | zebra 56, rhino 58, leopard 4; grass 582, bush 42, tree 21; food cells 1627, browse 271; mouths/zebra 1.00; zebras with killer 100%; striped 100%; eyes/zebra 2.00; horned rhinos 100%; leopards with cache 100%; soil water 0.49. Change since last frame: zebra +20 (+56%), rhino +46 (+383%), leopard -12 (-75%), grass +442 (+316%), tree +7 (+50%) | - |
| 3900 | `mech/rain-high-5/event-003900-leopard-collapse.png` | zebra 53, rhino 69, leopard 2; grass 635, bush 35, tree 29; food cells 1422, browse 198; mouths/zebra 1.00; zebras with killer 100%; striped 100%; eyes/zebra 2.00; horned rhinos 100%; leopards with cache 100%; soil water 0.49. Change since last frame: tree +8 (+38%) | leopard collapse at 3900 (peak 32 at 900) |
| 4300 | `mech/rain-high-5/event-004300-leopard-extinct.png` | zebra 52, rhino 57, leopard 0; grass 666, bush 38, tree 30; food cells 1376, browse 212; mouths/zebra 1.00; zebras with killer 100%; striped 100%; eyes/zebra 2.00; horned rhinos 100%; soil water 0.49 | leopard extinct at 4300 (peak 32 at 900); 1 fire(s), 21 cells burnt |
| 5000 | `mech/rain-high-5/frame-005000.png` | zebra 51, rhino 49, leopard 0; grass 699, bush 39, tree 36; food cells 1471, browse 264; mouths/zebra 1.00; zebras with killer 100%; striped 100%; eyes/zebra 2.00; horned rhinos 100%; soil water 0.48 | - |
| 8300 | `mech/rain-high-5/event-008300-zebra-collapse.png` | zebra 2, rhino 36, leopard 0; grass 811, bush 45, tree 56; food cells 873, browse 269; mouths/zebra 1.00; zebras with killer 100%; striped 100%; eyes/zebra 2.00; horned rhinos 100%; soil water 0.49. Change since last frame: zebra -49 (-96%), rhino -13 (-27%), tree +20 (+56%) | zebra collapse at 8300 (peak 62 at 3200); 1 fire(s), 1 cells burnt |
| 8600 | `mech/rain-high-5/event-008600-zebra-extinct.png` | zebra 0, rhino 33, leopard 0; grass 845, bush 57, tree 59; food cells 1085, browse 300; mouths/zebra 0.00; horned rhinos 100%; soil water 0.49. Change since last frame: bush +12 (+27%) | zebra extinct at 8600 (peak 62 at 3200); 1 fire(s), 9 cells burnt |
| 10000 | `mech/rain-high-5/frame-010000.png` | zebra 0, rhino 35, leopard 0; grass 882, bush 95, tree 66; food cells 851, browse 348; mouths/zebra 0.00; horned rhinos 100%; soil water 0.48. Change since last frame: bush +38 (+67%) | - |
| 15000 | `mech/rain-high-5/frame-015000.png` | zebra 0, rhino 17, leopard 0; grass 963, bush 89, tree 69; food cells 992, browse 558; mouths/zebra 0.00; horned rhinos 100%; soil water 0.51. Change since last frame: rhino -18 (-51%) | 5 fire(s), 28 cells burnt |
| 20000 | `mech/rain-high-5/frame-020000.png` | zebra 0, rhino 9, leopard 0; grass 1061, bush 23, tree 51; food cells 1083, browse 693; mouths/zebra 0.00; horned rhinos 100%; soil water 0.52. Change since last frame: rhino -8 (-47%), bush -66 (-74%), tree -18 (-26%) | 1 fire(s), 3 cells burnt |
| 22400 | `mech/rain-high-5/event-022400-rhino-collapse.png` | zebra 0, rhino 2, leopard 0; grass 1173, bush 16, tree 52; food cells 701, browse 310; mouths/zebra 0.00; horned rhinos 100%; soil water 0.52. Change since last frame: rhino -7 (-78%), bush -7 (-30%) | rhino collapse at 22400 (peak 77 at 3100) |
| 25000 | `mech/rain-high-5/event-025000-rhino-extinct.png` | zebra 0, rhino 0, leopard 0; grass 1212, bush 38, tree 47; food cells 703, browse 452; mouths/zebra 0.00; soil water 0.52. Change since last frame: bush +22 (+138%) | rhino extinct at 25000 (peak 77 at 3100); 1 fire(s), 2 cells burnt |
| 25000 | `mech/rain-high-5/frame-025000.png` | zebra 0, rhino 0, leopard 0; grass 1212, bush 38, tree 47; food cells 703, browse 452; mouths/zebra 0.00; soil water 0.52 | - |
| 30000 | `mech/rain-high-5/frame-030000.png` | zebra 0, rhino 0, leopard 0; grass 1196, bush 46, tree 53; food cells 476, browse 498; mouths/zebra 0.00; soil water 0.52 | 5 fire(s), 13 cells burnt |
| 40000 | `mech/rain-high-5/frame-040000.png` | zebra 0, rhino 0, leopard 0; grass 1299, bush 70, tree 29; food cells 492, browse 1009; mouths/zebra 0.00; soil water 0.53. Change since last frame: bush +24 (+52%), tree -24 (-45%) | 4 fire(s), 12 cells burnt |

### long-default

**What we tried:** Follow-up: the full design for 200,000 ticks, to give overgrazing more time.

**Outcome across seeds:**

- zebra: suicide candidate (3 of 4) x2; boom then collapse, no trait (unresolved) x1
- rhino: suicide candidate (3 of 4) x1; boom then collapse, no trait (unresolved) x2
- leopard: boom-bust: cohort aged out x2; failure to adapt x1

#### extra/long-default-1

- **zebra: suicide candidate (3 of 4).** 35 -> peak 70 at tick 37700; extinct at tick 78600; mouths per animal rose by 1.03; food plants 1005 at the peak -> 1402 at extinction; main cause of death after the peak: age (1117).
- **rhino: suicide candidate (3 of 4).** 12 -> peak 93 at tick 18500; extinct at tick 23000; share with a killer cell rose by 41%; mouths per animal rose by 1.00; food plants 606 at the peak -> 773 at extinction; main cause of death after the peak: age (160).
- **leopard: boom-bust: cohort aged out.** 16 -> peak 28 at tick 400; extinct at tick 3700; food plants 622 at the peak -> 468 at extinction; main cause of death after the peak: age (24).

| tick | screenshot | state | events since previous frame |
|---|---|---|---|
| 0 | `extra/long-default-1/frame-000000.png` | zebra 35, rhino 12, leopard 16; grass 140, bush 45, tree 14; food cells 0; mouths/zebra 1.00; zebras with killer 100%; striped 100%; eyes/zebra 2.00; horned rhinos 100%; leopards with cache 100%; soil water 0.64 | - |
| 2000 | `extra/long-default-1/event-002000-leopard-collapse.png` | zebra 16, rhino 68, leopard 1; grass 361, bush 104, tree 28; food cells 983, browse 715; mouths/zebra 1.00; zebras with killer 100%; striped 100%; eyes/zebra 2.13; horned rhinos 100%; leopards with cache 100%; soil water 0.49. Change since last frame: zebra -19 (-54%), rhino +56 (+467%), leopard -15 (-94%), grass +221 (+158%), bush +59 (+131%), tree +14 (+100%) | leopard collapse at 2000 (peak 28 at 400) |
| 3700 | `extra/long-default-1/event-003700-leopard-extinct.png` | zebra 53, rhino 64, leopard 0; grass 413, bush 55, tree 42; food cells 1181, browse 458; mouths/zebra 1.00; zebras with killer 91%; rhinos with killer 6%; striped 100%; eyes/zebra 2.09; horned rhinos 100%; soil water 0.46. Change since last frame: zebra +37 (+231%), bush -49 (-47%), tree +14 (+50%) | leopard extinct at 3700 (peak 28 at 400); 1 fire(s), 8 cells burnt |
| 10000 | `extra/long-default-1/frame-010000.png` | zebra 30, rhino 64, leopard 0; grass 581, bush 12, tree 82; food cells 1586, browse 506; mouths/zebra 1.00; zebras with killer 100%; rhinos with killer 22%; striped 100%; eyes/zebra 2.00; horned rhinos 98%; soil water 0.47. Change since last frame: zebra -23 (-43%), grass +168 (+41%), bush -43 (-78%), tree +40 (+95%) | 3 fire(s), 23 cells burnt |
| 12700 | `extra/long-default-1/event-012700-bush-collapse.png` | zebra 16, rhino 57, leopard 0; grass 623, bush 2, tree 93; food cells 2006, browse 788; mouths/zebra 1.06; zebras with killer 94%; rhinos with killer 28%; striped 100%; eyes/zebra 1.94; horned rhinos 100%; soil water 0.50. Change since last frame: zebra -14 (-47%), bush -10 (-83%) | bush collapse at 12700 (peak 153 at 600); 1 fire(s), 3 cells burnt |
| 13400 | `extra/long-default-1/event-013400-bush-extinct.png` | zebra 21, rhino 60, leopard 0; grass 613, bush 0, tree 90; food cells 1839, browse 743; mouths/zebra 1.00; zebras with killer 100%; rhinos with killer 37%; striped 100%; eyes/zebra 2.00; horned rhinos 100%; soil water 0.50. Change since last frame: zebra +5 (+31%) | bush extinct at 13400 (peak 153 at 600); 1 fire(s), 22 cells burnt |
| 22600 | `extra/long-default-1/event-022600-rhino-collapse.png` | zebra 28, rhino 2, leopard 0; grass 759, bush 0, tree 116; food cells 773, browse 479; mouths/zebra 1.68; zebras with killer 32%; striped 100%; eyes/zebra 1.68; horned rhinos 100%; soil water 0.50. Change since last frame: zebra +7 (+33%), rhino -58 (-97%), tree +26 (+29%) | rhino collapse at 22600 (peak 93 at 18500); 2 fire(s), 45 cells burnt |
| 23000 | `extra/long-default-1/event-023000-rhino-extinct.png` | zebra 29, rhino 0, leopard 0; grass 773, bush 0, tree 117; food cells 708, browse 442; mouths/zebra 1.69; zebras with killer 31%; striped 100%; eyes/zebra 1.66; soil water 0.50 | rhino extinct at 23000 (peak 93 at 18500) |
| 25000 | `extra/long-default-1/frame-025000.png` | zebra 12, rhino 0, leopard 0; grass 832, bush 0, tree 121; food cells 975, browse 471; mouths/zebra 1.83; zebras with killer 8%; striped 92%; eyes/zebra 1.50; soil water 0.50. Change since last frame: zebra -17 (-59%) | - |
| 50000 | `extra/long-default-1/frame-050000.png` | zebra 45, rhino 0, leopard 0; grass 1094, bush 0, tree 153; food cells 276, browse 833; mouths/zebra 2.02; striped 2%; soil water 0.49. Change since last frame: zebra +33 (+275%), grass +262 (+31%), tree +32 (+26%) | 9 fire(s), 73 cells burnt |
| 76500 | `extra/long-default-1/event-076500-zebra-collapse.png` | zebra 2, rhino 0, leopard 0; grass 1339, bush 0, tree 87; food cells 201, browse 1404; mouths/zebra 1.50; striped 50%; soil water 0.50. Change since last frame: zebra -43 (-96%), tree -66 (-43%) | zebra collapse at 76500 (peak 70 at 37700); 14 fire(s), 62 cells burnt |
| 78600 | `extra/long-default-1/event-078600-zebra-extinct.png` | zebra 0, rhino 0, leopard 0; grass 1402, bush 0, tree 78; food cells 185, browse 1523; mouths/zebra 0.00; soil water 0.50 | zebra extinct at 78600 (peak 70 at 37700); 1 fire(s), 17 cells burnt |
| 100000 | `extra/long-default-1/frame-100000.png` | zebra 0, rhino 0, leopard 0; grass 1495, bush 0, tree 16; food cells 51, browse 2353; mouths/zebra 0.00; soil water 0.52. Change since last frame: tree -62 (-79%) | 15 fire(s), 117 cells burnt |
| 139100 | `extra/long-default-1/event-139100-tree-collapse.png` | zebra 0, rhino 0, leopard 0; grass 1463, bush 0, tree 2; food cells 42, browse 3057; mouths/zebra 0.00; soil water 0.54. Change since last frame: tree -14 (-88%) | tree collapse at 139100 (peak 155 at 37300); 14 fire(s), 82 cells burnt |
| 144600 | `extra/long-default-1/event-144600-tree-extinct.png` | zebra 0, rhino 0, leopard 0; grass 1460, bush 0; food cells 64, browse 2630; mouths/zebra 0.00; soil water 0.54 | tree extinct at 144600 (peak 155 at 37300); 1 fire(s), 4 cells burnt |
| 150000 | `extra/long-default-1/frame-150000.png` | zebra 0, rhino 0, leopard 0; grass 1459, bush 0; food cells 41, browse 3044; mouths/zebra 0.00; soil water 0.54 | 2 fire(s), 14 cells burnt |
| 200000 | `extra/long-default-1/frame-200000.png` | zebra 0, rhino 0, leopard 0; grass 1376, bush 0; food cells 25, browse 3038; mouths/zebra 0.00; soil water 0.56 | 26 fire(s), 193 cells burnt |

#### extra/long-default-2

- **zebra: boom then collapse, no trait (unresolved).** 32 -> peak 98 at tick 6600; extinct at tick 86400; food plants 517 at the peak -> 1248 at extinction; main cause of death after the peak: age (1026).
- **rhino: boom then collapse, no trait (unresolved).** 12 -> peak 58 at tick 3000; extinct at tick 9900; food plants 546 at the peak -> 614 at extinction; main cause of death after the peak: age (132).
- **leopard: boom-bust: cohort aged out.** 16 -> peak 25 at tick 800; extinct at tick 2400; food plants 543 at the peak -> 552 at extinction; main cause of death after the peak: age (21).

| tick | screenshot | state | events since previous frame |
|---|---|---|---|
| 0 | `extra/long-default-2/frame-000000.png` | zebra 32, rhino 12, leopard 16; grass 140, bush 45, tree 14; food cells 0; mouths/zebra 1.00; zebras with killer 100%; striped 100%; eyes/zebra 2.00; horned rhinos 100%; leopards with cache 100%; soil water 0.62 | - |
| 2200 | `extra/long-default-2/event-002200-leopard-collapse.png` | zebra 36, rhino 39, leopard 2; grass 405, bush 105, tree 26; food cells 1279, browse 653; mouths/zebra 1.00; zebras with killer 100%; striped 100%; eyes/zebra 2.00; horned rhinos 100%; leopards with cache 100%; soil water 0.46. Change since last frame: rhino +27 (+225%), leopard -14 (-88%), grass +265 (+189%), bush +60 (+133%), tree +12 (+86%) | leopard collapse at 2200 (peak 25 at 800); 2 fire(s), 32 cells burnt |
| 2400 | `extra/long-default-2/event-002400-leopard-extinct.png` | zebra 35, rhino 42, leopard 0; grass 466, bush 86, tree 27; food cells 1305, browse 639; mouths/zebra 1.00; zebras with killer 100%; striped 100%; eyes/zebra 2.00; horned rhinos 100%; soil water 0.45 | leopard extinct at 2400 (peak 25 at 800) |
| 8500 | `extra/long-default-2/event-008500-rhino-collapse.png` | zebra 92, rhino 2, leopard 0; grass 444, bush 92, tree 69; food cells 863, browse 710; mouths/zebra 1.00; zebras with killer 100%; striped 100%; eyes/zebra 1.92; horned rhinos 100%; soil water 0.48. Change since last frame: zebra +57 (+163%), rhino -40 (-95%), tree +42 (+156%) | rhino collapse at 8500 (peak 58 at 3000); 3 fire(s), 47 cells burnt |
| 9900 | `extra/long-default-2/event-009900-rhino-extinct.png` | zebra 63, rhino 0, leopard 0; grass 513, bush 101, tree 84; food cells 804, browse 797; mouths/zebra 1.00; zebras with killer 100%; striped 100%; eyes/zebra 1.76; soil water 0.48. Change since last frame: zebra -29 (-32%) | rhino extinct at 9900 (peak 58 at 3000); 1 fire(s), 1 cells burnt |
| 10000 | `extra/long-default-2/frame-010000.png` | zebra 64, rhino 0, leopard 0; grass 552, bush 101, tree 88; food cells 795, browse 768; mouths/zebra 1.00; zebras with killer 100%; striped 100%; eyes/zebra 1.75; soil water 0.47 | - |
| 25000 | `extra/long-default-2/frame-025000.png` | zebra 24, rhino 0, leopard 0; grass 776, bush 109, tree 127; food cells 671, browse 747; mouths/zebra 1.00; zebras with killer 100%; striped 100%; eyes/zebra 1.00; soil water 0.49. Change since last frame: zebra -40 (-62%), grass +224 (+41%), tree +39 (+44%) | 5 fire(s), 20 cells burnt |
| 50000 | `extra/long-default-2/frame-050000.png` | zebra 11, rhino 0, leopard 0; grass 691, bush 196, tree 111; food cells 368, browse 1448; mouths/zebra 1.00; zebras with killer 100%; striped 100%; eyes/zebra 1.00; soil water 0.51. Change since last frame: zebra -13 (-54%), bush +87 (+80%) | 8 fire(s), 33 cells burnt |
| 85000 | `extra/long-default-2/event-085000-zebra-collapse.png` | zebra 2, rhino 0, leopard 0; grass 1136, bush 77, tree 66; food cells 402, browse 2134; mouths/zebra 1.00; zebras with killer 100%; striped 100%; eyes/zebra 1.00; soil water 0.52. Change since last frame: zebra -9 (-82%), grass +445 (+64%), bush -119 (-61%), tree -45 (-41%) | zebra collapse at 85000 (peak 98 at 6600); 14 fire(s), 186 cells burnt |
| 86400 | `extra/long-default-2/event-086400-zebra-extinct.png` | zebra 0, rhino 0, leopard 0; grass 1192, bush 56, tree 66; food cells 381, browse 1886; mouths/zebra 0.00; soil water 0.52. Change since last frame: bush -21 (-27%) | zebra extinct at 86400 (peak 98 at 6600) |
| 100000 | `extra/long-default-2/frame-100000.png` | zebra 0, rhino 0, leopard 0; grass 1246, bush 9, tree 54; food cells 341, browse 2324; mouths/zebra 0.00; soil water 0.54. Change since last frame: bush -47 (-84%) | 3 fire(s), 41 cells burnt |
| 101600 | `extra/long-default-2/event-101600-bush-collapse.png` | zebra 0, rhino 0, leopard 0; grass 1247, bush 2, tree 44; food cells 307, browse 2267; mouths/zebra 0.00; soil water 0.53. Change since last frame: bush -7 (-78%) | bush collapse at 101600 (peak 215 at 74800); 2 fire(s), 23 cells burnt |
| 102000 | `extra/long-default-2/event-102000-bush-extinct.png` | zebra 0, rhino 0, leopard 0; grass 1245, bush 0, tree 45; food cells 310, browse 2455; mouths/zebra 0.00; soil water 0.54 | bush extinct at 102000 (peak 215 at 74800) |
| 150000 | `extra/long-default-2/frame-150000.png` | zebra 0, rhino 0, leopard 0; grass 1270, bush 0, tree 7; food cells 317, browse 2849; mouths/zebra 0.00; soil water 0.56. Change since last frame: tree -38 (-84%) | 14 fire(s), 82 cells burnt |
| 162500 | `extra/long-default-2/event-162500-tree-collapse.png` | zebra 0, rhino 0, leopard 0; grass 1318, bush 0, tree 2; food cells 191, browse 2295; mouths/zebra 0.00; soil water 0.55. Change since last frame: tree -5 (-71%) | tree collapse at 162500 (peak 158 at 35500); 1 fire(s), 7 cells burnt |
| 168300 | `extra/long-default-2/event-168300-tree-extinct.png` | zebra 0, rhino 0, leopard 0; grass 1375, bush 0; food cells 256, browse 2812; mouths/zebra 0.00; soil water 0.56 | tree extinct at 168300 (peak 158 at 35500); 2 fire(s), 19 cells burnt |
| 200000 | `extra/long-default-2/frame-200000.png` | zebra 0, rhino 0, leopard 0; grass 1281, bush 0; food cells 321, browse 3005; mouths/zebra 0.00; soil water 0.57 | 11 fire(s), 37 cells burnt |

#### extra/long-default-3

- **zebra: suicide candidate (3 of 4).** 34 -> peak 126 at tick 8700; extinct at tick 31300; mouths per animal rose by 1.00; food plants 603 at the peak -> 1210 at extinction; main cause of death after the peak: age (685).
- **rhino: boom then collapse, no trait (unresolved).** 12 -> peak 68 at tick 1800; extinct at tick 10900; food plants 535 at the peak -> 739 at extinction; main cause of death after the peak: age (265).
- **leopard: failure to adapt.** 16 -> peak 20 at tick 900; extinct at tick 7400; food plants 469 at the peak -> 567 at extinction; main cause of death after the peak: age (39).

| tick | screenshot | state | events since previous frame |
|---|---|---|---|
| 0 | `extra/long-default-3/frame-000000.png` | zebra 34, rhino 12, leopard 16; grass 140, bush 45, tree 14; food cells 0; mouths/zebra 1.00; zebras with killer 100%; striped 100%; eyes/zebra 2.00; horned rhinos 100%; leopards with cache 100%; soil water 0.62 | - |
| 6900 | `extra/long-default-3/event-006900-leopard-collapse.png` | zebra 71, rhino 29, leopard 2; grass 503, bush 49, tree 56; food cells 1084, browse 581; mouths/zebra 1.32; zebras with killer 99%; striped 100%; eyes/zebra 1.99; horned rhinos 100%; leopards with cache 100%; soil water 0.46. Change since last frame: zebra +37 (+109%), rhino +17 (+142%), leopard -14 (-88%), grass +363 (+259%), tree +42 (+300%) | leopard collapse at 6900 (peak 20 at 900); 4 fire(s), 116 cells burnt |
| 7400 | `extra/long-default-3/event-007400-leopard-extinct.png` | zebra 80, rhino 31, leopard 0; grass 525, bush 42, tree 58; food cells 1139, browse 661; mouths/zebra 1.44; zebras with killer 100%; striped 100%; eyes/zebra 2.00; horned rhinos 100%; soil water 0.46 | leopard extinct at 7400 (peak 20 at 900) |
| 10000 | `extra/long-default-3/frame-010000.png` | zebra 95, rhino 5, leopard 0; grass 633, bush 44, tree 61; food cells 1139, browse 498; mouths/zebra 1.86; zebras with killer 100%; striped 100%; eyes/zebra 1.99; horned rhinos 80%; soil water 0.46. Change since last frame: rhino -26 (-84%) | - |
| 10300 | `extra/long-default-3/event-010300-rhino-collapse.png` | zebra 82, rhino 2, leopard 0; grass 661, bush 43, tree 65; food cells 1117, browse 503; mouths/zebra 1.85; zebras with killer 100%; striped 100%; eyes/zebra 2.00; horned rhinos 100%; soil water 0.46. Change since last frame: rhino -3 (-60%) | rhino collapse at 10300 (peak 68 at 1800) |
| 10900 | `extra/long-default-3/event-010900-rhino-extinct.png` | zebra 59, rhino 0, leopard 0; grass 690, bush 49, tree 65; food cells 1140, browse 624; mouths/zebra 1.90; zebras with killer 100%; striped 100%; eyes/zebra 2.02; soil water 0.46. Change since last frame: zebra -23 (-28%) | rhino extinct at 10900 (peak 68 at 1800); 1 fire(s), 9 cells burnt |
| 25000 | `extra/long-default-3/frame-025000.png` | zebra 32, rhino 0, leopard 0; grass 1023, bush 33, tree 75; food cells 1000, browse 632; mouths/zebra 2.00; zebras with killer 100%; striped 100%; eyes/zebra 2.00; soil water 0.47. Change since last frame: zebra -27 (-46%), grass +333 (+48%), bush -16 (-33%) | 7 fire(s), 40 cells burnt |
| 30200 | `extra/long-default-3/event-030200-zebra-collapse.png` | zebra 2, rhino 0, leopard 0; grass 1167, bush 11, tree 66; food cells 847, browse 476; mouths/zebra 2.00; zebras with killer 100%; striped 100%; eyes/zebra 2.00; soil water 0.46. Change since last frame: zebra -30 (-94%), bush -22 (-67%) | zebra collapse at 30200 (peak 126 at 8700); 3 fire(s), 12 cells burnt |
| 31300 | `extra/long-default-3/event-031300-zebra-extinct.png` | zebra 0, rhino 0, leopard 0; grass 1194, bush 16, tree 62; food cells 828, browse 451; mouths/zebra 0.00; soil water 0.46. Change since last frame: bush +5 (+45%) | zebra extinct at 31300 (peak 126 at 8700) |
| 39800 | `extra/long-default-3/event-039800-bush-collapse.png` | zebra 0, rhino 0, leopard 0; grass 1233, bush 2, tree 49; food cells 810, browse 650; mouths/zebra 0.00; soil water 0.46. Change since last frame: bush -14 (-88%) | bush collapse at 39800 (peak 130 at 600); 2 fire(s), 22 cells burnt |
| 42500 | `extra/long-default-3/event-042500-bush-extinct.png` | zebra 0, rhino 0, leopard 0; grass 1280, bush 0, tree 49; food cells 828, browse 639; mouths/zebra 0.00; soil water 0.47 | bush extinct at 42500 (peak 130 at 600) |
| 50000 | `extra/long-default-3/frame-050000.png` | zebra 0, rhino 0, leopard 0; grass 1248, bush 0, tree 49; food cells 639, browse 702; mouths/zebra 0.00; soil water 0.48 | 2 fire(s), 26 cells burnt |
| 75900 | `extra/long-default-3/event-075900-tree-collapse.png` | zebra 0, rhino 0, leopard 0; grass 1406, bush 0, tree 2; food cells 508, browse 1099; mouths/zebra 0.00; soil water 0.47. Change since last frame: tree -47 (-96%) | tree collapse at 75900 (peak 78 at 24300); 8 fire(s), 13 cells burnt |
| 78900 | `extra/long-default-3/event-078900-tree-extinct.png` | zebra 0, rhino 0, leopard 0; grass 1466, bush 0; food cells 536, browse 1142; mouths/zebra 0.00; soil water 0.47 | tree extinct at 78900 (peak 78 at 24300); 1 fire(s), 21 cells burnt |
| 100000 | `extra/long-default-3/frame-100000.png` | zebra 0, rhino 0, leopard 0; grass 1404, bush 0; food cells 377, browse 1784; mouths/zebra 0.00; soil water 0.49 | 7 fire(s), 37 cells burnt |
| 150000 | `extra/long-default-3/frame-150000.png` | zebra 0, rhino 0, leopard 0; grass 1348, bush 0; food cells 231, browse 2001; mouths/zebra 0.00; soil water 0.52 | 19 fire(s), 156 cells burnt |
| 200000 | `extra/long-default-3/frame-200000.png` | zebra 0, rhino 0, leopard 0; grass 1365, bush 0; food cells 135, browse 2329; mouths/zebra 0.00; soil water 0.56 | 21 fire(s), 132 cells burnt |

### long-dry

**What we tried:** Follow-up: 200,000 ticks with 40% of normal rain, to make regrowth slower than grazing.

**Outcome across seeds:**

- zebra: persisted x1; suicide candidate (3 of 4) x2
- rhino: boom then collapse, no trait (unresolved) x2; persisted x1
- leopard: boom-bust: cohort aged out x2; boom-bust: over-predation x1

#### extra/long-dry-1

- **zebra: persisted.** 35 -> peak 80 at tick 82400; 33 alive at the end.
- **rhino: boom then collapse, no trait (unresolved).** 12 -> peak 45 at tick 2200; extinct at tick 7900; food plants 352 at the peak -> 435 at extinction; main cause of death after the peak: age (92).
- **leopard: boom-bust: cohort aged out.** 16 -> peak 33 at tick 300; extinct at tick 2000; food plants 565 at the peak -> 331 at extinction; main cause of death after the peak: age (21).

| tick | screenshot | state | events since previous frame |
|---|---|---|---|
| 0 | `extra/long-dry-1/frame-000000.png` | zebra 35, rhino 12, leopard 16; grass 140, bush 45, tree 14; food cells 0; mouths/zebra 1.00; zebras with killer 100%; striped 100%; eyes/zebra 2.00; horned rhinos 100%; leopards with cache 100%; soil water 0.60 | - |
| 1800 | `extra/long-dry-1/event-001800-leopard-collapse.png` | zebra 54, rhino 37, leopard 2; grass 300, bush 56, tree 23; food cells 629, browse 421; mouths/zebra 1.00; zebras with killer 93%; striped 100%; eyes/zebra 2.00; horned rhinos 100%; leopards with cache 100%; soil water 0.41. Change since last frame: zebra +19 (+54%), rhino +25 (+208%), leopard -14 (-88%), grass +160 (+114%), tree +9 (+64%) | leopard collapse at 1800 (peak 33 at 300); 2 fire(s), 9 cells burnt |
| 2000 | `extra/long-dry-1/event-002000-leopard-extinct.png` | zebra 57, rhino 43, leopard 0; grass 270, bush 61, tree 24; food cells 485, browse 388; mouths/zebra 1.00; zebras with killer 93%; striped 100%; eyes/zebra 2.00; horned rhinos 100%; soil water 0.41 | leopard extinct at 2000 (peak 33 at 300) |
| 7500 | `extra/long-dry-1/event-007500-rhino-collapse.png` | zebra 58, rhino 1, leopard 0; grass 387, bush 68, tree 71; food cells 579, browse 506; mouths/zebra 1.09; zebras with killer 59%; striped 100%; eyes/zebra 2.00; horned rhinos 100%; soil water 0.40. Change since last frame: rhino -42 (-98%), grass +117 (+43%), tree +47 (+196%) | rhino collapse at 7500 (peak 45 at 2200); 4 fire(s), 102 cells burnt |
| 7900 | `extra/long-dry-1/event-007900-rhino-extinct.png` | zebra 64, rhino 0, leopard 0; grass 361, bush 74, tree 76; food cells 620, browse 607; mouths/zebra 1.08; zebras with killer 55%; striped 100%; eyes/zebra 1.97; soil water 0.40 | rhino extinct at 7900 (peak 45 at 2200) |
| 10000 | `extra/long-dry-1/frame-010000.png` | zebra 23, rhino 0, leopard 0; grass 470, bush 91, tree 85; food cells 885, browse 648; mouths/zebra 1.00; zebras with killer 26%; striped 100%; eyes/zebra 2.00; soil water 0.40. Change since last frame: zebra -41 (-64%), grass +109 (+30%) | - |
| 25000 | `extra/long-dry-1/frame-025000.png` | zebra 27, rhino 0, leopard 0; grass 376, bush 276, tree 138; food cells 599, browse 1119; mouths/zebra 1.00; striped 33%; eyes/zebra 1.85; soil water 0.41. Change since last frame: bush +185 (+203%), tree +53 (+62%) | 1 fire(s), 11 cells burnt |
| 50000 | `extra/long-dry-1/frame-050000.png` | zebra 40, rhino 0, leopard 0; grass 310, bush 510, tree 95; food cells 250, browse 1298; mouths/zebra 0.97; striped 3%; eyes/zebra 0.97; soil water 0.39. Change since last frame: zebra +13 (+48%), bush +234 (+85%), tree -43 (-31%) | 11 fire(s), 63 cells burnt |
| 100000 | `extra/long-dry-1/frame-100000.png` | zebra 41, rhino 0, leopard 0; grass 386, bush 672, tree 20; food cells 108, browse 1730; mouths/zebra 0.98; soil water 0.39. Change since last frame: bush +162 (+32%), tree -75 (-79%) | 18 fire(s), 77 cells burnt |
| 150000 | `extra/long-dry-1/frame-150000.png` | zebra 38, rhino 0, leopard 0; grass 417, bush 734, tree 5; food cells 30, browse 2056; mouths/zebra 1.00; soil water 0.40. Change since last frame: tree -15 (-75%) | 17 fire(s), 132 cells burnt |
| 165400 | `extra/long-dry-1/event-165400-tree-collapse.png` | zebra 34, rhino 0, leopard 0; grass 422, bush 734, tree 2; food cells 33, browse 2579; mouths/zebra 1.00; soil water 0.41. Change since last frame: tree -3 (-60%) | tree collapse at 165400 (peak 143 at 26600); 7 fire(s), 58 cells burnt |
| 171900 | `extra/long-dry-1/event-171900-tree-extinct.png` | zebra 28, rhino 0, leopard 0; grass 434, bush 717; food cells 29, browse 2372; mouths/zebra 1.00; soil water 0.41 | tree extinct at 171900 (peak 143 at 26600); 1 fire(s), 3 cells burnt |
| 200000 | `extra/long-dry-1/frame-200000.png` | zebra 33, rhino 0, leopard 0; grass 442, bush 678; food cells 13, browse 2059; mouths/zebra 1.00; soil water 0.41 | 9 fire(s), 74 cells burnt |

#### extra/long-dry-2

- **zebra: suicide candidate (3 of 4).** 32 -> peak 129 at tick 27800; extinct at tick 94200; mouths per animal rose by 1.06; food plants 545 at the peak -> 637 at extinction; main cause of death after the peak: age (2769).
- **rhino: boom then collapse, no trait (unresolved).** 12 -> peak 36 at tick 2500; extinct at tick 8000; food plants 418 at the peak -> 425 at extinction; main cause of death after the peak: age (67).
- **leopard: boom-bust: cohort aged out.** 16 -> peak 29 at tick 900; extinct at tick 7100; food plants 454 at the peak -> 450 at extinction; main cause of death after the peak: age (43).

| tick | screenshot | state | events since previous frame |
|---|---|---|---|
| 0 | `extra/long-dry-2/frame-000000.png` | zebra 32, rhino 12, leopard 16; grass 140, bush 45, tree 14; food cells 0; mouths/zebra 1.00; zebras with killer 100%; striped 100%; eyes/zebra 2.00; horned rhinos 100%; leopards with cache 100%; soil water 0.61 | - |
| 5700 | `extra/long-dry-2/event-005700-leopard-collapse.png` | zebra 79, rhino 4, leopard 2; grass 406, bush 10, tree 56; food cells 1206, browse 385; mouths/zebra 1.00; zebras with killer 100%; striped 100%; eyes/zebra 2.00; horned rhinos 100%; leopards with cache 100%; soil water 0.39. Change since last frame: zebra +47 (+147%), rhino -8 (-67%), leopard -14 (-88%), grass +266 (+190%), bush -35 (-78%), tree +42 (+300%) | leopard collapse at 5700 (peak 29 at 900); 5 fire(s), 56 cells burnt |
| 7100 | `extra/long-dry-2/event-007100-leopard-extinct.png` | zebra 87, rhino 3, leopard 0; grass 439, bush 11, tree 76; food cells 945, browse 387; mouths/zebra 1.00; zebras with killer 100%; striped 100%; eyes/zebra 2.00; horned rhinos 100%; soil water 0.38. Change since last frame: tree +20 (+36%) | leopard extinct at 7100 (peak 29 at 900); 1 fire(s), 2 cells burnt |
| 7200 | `extra/long-dry-2/event-007200-rhino-collapse.png` | zebra 82, rhino 2, leopard 0; grass 439, bush 11, tree 78; food cells 1030, browse 408; mouths/zebra 1.00; zebras with killer 100%; striped 100%; eyes/zebra 2.00; horned rhinos 100%; soil water 0.38 | rhino collapse at 7200 (peak 36 at 2500) |
| 8000 | `extra/long-dry-2/event-008000-rhino-extinct.png` | zebra 79, rhino 0, leopard 0; grass 415, bush 10, tree 88; food cells 1056, browse 494; mouths/zebra 1.00; zebras with killer 100%; striped 100%; eyes/zebra 2.00; soil water 0.40 | rhino extinct at 8000 (peak 36 at 2500); 1 fire(s), 1 cells burnt |
| 9500 | `extra/long-dry-2/event-009500-bush-collapse.png` | zebra 70, rhino 0, leopard 0; grass 523, bush 2, tree 94; food cells 1206, browse 569; mouths/zebra 1.00; zebras with killer 100%; striped 100%; eyes/zebra 2.00; soil water 0.40. Change since last frame: grass +108 (+26%), bush -8 (-80%) | bush collapse at 9500 (peak 128 at 600); 1 fire(s), 2 cells burnt |
| 10000 | `extra/long-dry-2/frame-010000.png` | zebra 66, rhino 0, leopard 0; grass 516, bush 1, tree 96; food cells 1387, browse 721; mouths/zebra 1.00; zebras with killer 100%; striped 100%; eyes/zebra 2.00; soil water 0.40 | - |
| 12300 | `extra/long-dry-2/event-012300-bush-extinct.png` | zebra 65, rhino 0, leopard 0; grass 560, bush 0, tree 112; food cells 1402, browse 994; mouths/zebra 1.00; zebras with killer 100%; striped 100%; eyes/zebra 1.88; soil water 0.42 | bush extinct at 12300 (peak 128 at 600) |
| 25000 | `extra/long-dry-2/frame-025000.png` | zebra 85, rhino 0, leopard 0; grass 611, bush 0, tree 107; food cells 1217, browse 892; mouths/zebra 1.36; zebras with killer 68%; striped 100%; eyes/zebra 1.58; soil water 0.42. Change since last frame: zebra +20 (+31%) | 4 fire(s), 162 cells burnt |
| 50000 | `extra/long-dry-2/frame-050000.png` | zebra 82, rhino 0, leopard 0; grass 595, bush 0, tree 118; food cells 268, browse 1826; mouths/zebra 1.96; striped 88%; eyes/zebra 0.43; soil water 0.46 | 6 fire(s), 67 cells burnt |
| 94000 | `extra/long-dry-2/event-094000-zebra-collapse.png` | zebra 1, rhino 0, leopard 0; grass 671, bush 0, tree 169; food cells 228, browse 3207; mouths/zebra 1.00; soil water 0.48. Change since last frame: zebra -81 (-99%), tree +51 (+43%) | zebra collapse at 94000 (peak 129 at 27800); 18 fire(s), 104 cells burnt |
| 94200 | `extra/long-dry-2/event-094200-zebra-extinct.png` | zebra 0, rhino 0, leopard 0; grass 637, bush 0, tree 169; food cells 251, browse 3375; mouths/zebra 0.00; soil water 0.48 | zebra extinct at 94200 (peak 129 at 27800) |
| 100000 | `extra/long-dry-2/frame-100000.png` | zebra 0, rhino 0, leopard 0; grass 759, bush 0, tree 79; food cells 511, browse 2700; mouths/zebra 0.00; soil water 0.47. Change since last frame: tree -90 (-53%) | 3 fire(s), 5 cells burnt |
| 148300 | `extra/long-dry-2/event-148300-tree-collapse.png` | zebra 0, rhino 0, leopard 0; grass 853, bush 0, tree 2; food cells 215, browse 1493; mouths/zebra 0.00; soil water 0.43. Change since last frame: tree -77 (-97%) | tree collapse at 148300 (peak 206 at 79900); 18 fire(s), 51 cells burnt |
| 150000 | `extra/long-dry-2/frame-150000.png` | zebra 0, rhino 0, leopard 0; grass 893, bush 0, tree 1; food cells 159, browse 1445; mouths/zebra 0.00; soil water 0.43 | 1 fire(s), 2 cells burnt |
| 155500 | `extra/long-dry-2/event-155500-tree-extinct.png` | zebra 0, rhino 0, leopard 0; grass 896, bush 0; food cells 172, browse 1328; mouths/zebra 0.00; soil water 0.44 | tree extinct at 155500 (peak 206 at 79900); 2 fire(s), 8 cells burnt |
| 200000 | `extra/long-dry-2/frame-200000.png` | zebra 0, rhino 0, leopard 0; grass 847, bush 0; food cells 130, browse 1548; mouths/zebra 0.00; soil water 0.45 | 17 fire(s), 51 cells burnt |

#### extra/long-dry-3

- **zebra: suicide candidate (3 of 4).** 34 -> peak 53 at tick 30300; extinct at tick 160100; mouths per animal rose by 1.80; food plants 499 at the peak -> 1008 at extinction; main cause of death after the peak: age (1397).
- **rhino: persisted.** 12 -> peak 169 at tick 65100; 87 alive at the end; mouths per animal rose by 0.65.
- **leopard: boom-bust: over-predation.** 16 -> peak 28 at tick 800; extinct at tick 3100; food plants 448 at the peak -> 397 at extinction; main cause of death after the peak: age (28).

| tick | screenshot | state | events since previous frame |
|---|---|---|---|
| 0 | `extra/long-dry-3/frame-000000.png` | zebra 34, rhino 12, leopard 16; grass 140, bush 45, tree 14; food cells 0; mouths/zebra 1.00; zebras with killer 100%; striped 100%; eyes/zebra 2.00; horned rhinos 100%; leopards with cache 100%; soil water 0.62 | - |
| 2400 | `extra/long-dry-3/event-002400-leopard-collapse.png` | zebra 9, rhino 60, leopard 2; grass 358, bush 44, tree 22; food cells 911, browse 337; mouths/zebra 1.00; zebras with killer 100%; striped 100%; eyes/zebra 2.00; horned rhinos 100%; leopards with cache 100%; soil water 0.38. Change since last frame: zebra -25 (-74%), rhino +48 (+400%), leopard -14 (-88%), grass +218 (+156%), tree +8 (+57%) | leopard collapse at 2400 (peak 28 at 800); 2 fire(s), 26 cells burnt |
| 3100 | `extra/long-dry-3/event-003100-leopard-extinct.png` | zebra 16, rhino 56, leopard 0; grass 358, bush 39, tree 30; food cells 834, browse 299; mouths/zebra 1.00; zebras with killer 100%; striped 100%; eyes/zebra 2.00; horned rhinos 100%; soil water 0.37. Change since last frame: zebra +7 (+78%), tree +8 (+36%) | leopard extinct at 3100 (peak 28 at 800) |
| 10000 | `extra/long-dry-3/frame-010000.png` | zebra 21, rhino 55, leopard 0; grass 356, bush 22, tree 87; food cells 638, browse 414; mouths/zebra 1.00; zebras with killer 100%; striped 100%; eyes/zebra 2.00; horned rhinos 98%; soil water 0.39. Change since last frame: zebra +5 (+31%), bush -17 (-44%), tree +57 (+190%) | 4 fire(s), 18 cells burnt |
| 25000 | `extra/long-dry-3/frame-025000.png` | zebra 45, rhino 34, leopard 0; grass 461, bush 8, tree 145; food cells 950, browse 1211; mouths/zebra 1.00; zebras with killer 18%; striped 100%; eyes/zebra 1.00; horned rhinos 38%; soil water 0.48. Change since last frame: zebra +24 (+114%), rhino -21 (-38%), grass +105 (+29%), bush -14 (-64%), tree +58 (+67%) | 9 fire(s), 54 cells burnt |
| 29700 | `extra/long-dry-3/event-029700-bush-collapse.png` | zebra 49, rhino 33, leopard 0; grass 483, bush 2, tree 149; food cells 1057, browse 1099; mouths/zebra 1.00; striped 100%; eyes/zebra 1.00; soil water 0.47. Change since last frame: bush -6 (-75%) | bush collapse at 29700 (peak 116 at 600); 1 fire(s), 23 cells burnt |
| 34300 | `extra/long-dry-3/event-034300-bush-extinct.png` | zebra 38, rhino 55, leopard 0; grass 538, bush 0, tree 172; food cells 736, browse 983; mouths/zebra 1.24; striped 100%; eyes/zebra 0.97; horned rhinos 2%; soil water 0.45. Change since last frame: rhino +22 (+67%) | bush extinct at 34300 (peak 116 at 600); 1 fire(s), 13 cells burnt |
| 50000 | `extra/long-dry-3/frame-050000.png` | zebra 34, rhino 71, leopard 0; grass 563, bush 0, tree 208; food cells 595, browse 1149; mouths/zebra 2.00; rhinos with killer 1%; striped 100%; eyes/zebra 1.00; horned rhinos 1%; soil water 0.42. Change since last frame: rhino +16 (+29%) | 8 fire(s), 73 cells burnt |
| 100000 | `extra/long-dry-3/frame-100000.png` | zebra 28, rhino 127, leopard 0; grass 749, bush 0, tree 152; food cells 274, browse 1113; mouths/zebra 2.00; striped 100%; eyes/zebra 1.86; horned rhinos 2%; soil water 0.43. Change since last frame: rhino +56 (+79%), grass +186 (+33%), tree -56 (-27%) | 20 fire(s), 145 cells burnt |
| 150000 | `extra/long-dry-3/frame-150000.png` | zebra 15, rhino 105, leopard 0; grass 945, bush 0, tree 58; food cells 171, browse 2013; mouths/zebra 1.93; striped 100%; eyes/zebra 1.93; soil water 0.45. Change since last frame: zebra -13 (-46%), grass +196 (+26%), tree -94 (-62%) | 16 fire(s), 104 cells burnt |
| 157900 | `extra/long-dry-3/event-157900-zebra-collapse.png` | zebra 2, rhino 119, leopard 0; grass 988, bush 0, tree 49; food cells 157, browse 1777; mouths/zebra 2.00; striped 100%; eyes/zebra 2.00; horned rhinos 1%; soil water 0.44. Change since last frame: zebra -13 (-87%) | zebra collapse at 157900 (peak 53 at 30300); 3 fire(s), 36 cells burnt |
| 160100 | `extra/long-dry-3/event-160100-zebra-extinct.png` | zebra 0, rhino 119, leopard 0; grass 1008, bush 0, tree 54; food cells 157, browse 1693; mouths/zebra 0.00; soil water 0.43 | zebra extinct at 160100 (peak 53 at 30300) |
| 200000 | `extra/long-dry-3/frame-200000.png` | zebra 0, rhino 87, leopard 0; grass 1099, bush 0, tree 3; food cells 104, browse 3002; mouths/zebra 0.00; rhinos with killer 1%; soil water 0.43. Change since last frame: rhino -32 (-27%), tree -51 (-94%) | 18 fire(s), 189 cells burnt |

### leopards32

**What we tried:** Follow-up: twice the starting leopards, to see if a denser predator persists.

**Outcome across seeds:**

- zebra: boom then collapse, no trait (unresolved) x3
- rhino: boom then collapse, no trait (unresolved) x3
- leopard: boom-bust: cohort aged out x1; failure to adapt x2

#### extra/leopards32-1

- **zebra: boom then collapse, no trait (unresolved).** 35 -> peak 134 at tick 4000; extinct at tick 47000; food plants 521 at the peak -> 1177 at extinction; main cause of death after the peak: age (1468).
- **rhino: boom then collapse, no trait (unresolved).** 12 -> peak 38 at tick 2400; extinct at tick 14100; food plants 538 at the peak -> 926 at extinction; main cause of death after the peak: age (125).
- **leopard: boom-bust: cohort aged out.** 32 -> peak 48 at tick 800; extinct at tick 3200; food plants 523 at the peak -> 523 at extinction; main cause of death after the peak: age (39).

| tick | screenshot | state | events since previous frame |
|---|---|---|---|
| 0 | `extra/leopards32-1/frame-000000.png` | zebra 35, rhino 12, leopard 32; grass 140, bush 45, tree 14; food cells 0; mouths/zebra 1.00; zebras with killer 100%; striped 100%; eyes/zebra 2.00; horned rhinos 100%; leopards with cache 100%; soil water 0.62 | - |
| 2900 | `extra/leopards32-1/event-002900-leopard-collapse.png` | zebra 115, rhino 29, leopard 2; grass 450, bush 55, tree 24; food cells 1017, browse 276; mouths/zebra 1.00; zebras with killer 98%; striped 100%; eyes/zebra 2.00; horned rhinos 100%; leopards with cache 100%; soil water 0.44. Change since last frame: zebra +80 (+229%), rhino +17 (+142%), leopard -30 (-94%), grass +310 (+221%), tree +10 (+71%) | leopard collapse at 2900 (peak 48 at 800); 1 fire(s), 1 cells burnt |
| 3200 | `extra/leopards32-1/event-003200-leopard-extinct.png` | zebra 115, rhino 19, leopard 0; grass 467, bush 56, tree 26; food cells 1050, browse 310; mouths/zebra 1.00; zebras with killer 98%; striped 100%; eyes/zebra 2.00; horned rhinos 100%; soil water 0.44. Change since last frame: rhino -10 (-34%) | leopard extinct at 3200 (peak 48 at 800) |
| 5000 | `extra/leopards32-1/frame-005000.png` | zebra 102, rhino 8, leopard 0; grass 499, bush 62, tree 39; food cells 1335, browse 572; mouths/zebra 1.00; zebras with killer 89%; striped 100%; eyes/zebra 1.90; horned rhinos 100%; soil water 0.45. Change since last frame: rhino -11 (-58%), tree +13 (+50%) | - |
| 10000 | `extra/leopards32-1/frame-010000.png` | zebra 116, rhino 8, leopard 0; grass 648, bush 23, tree 61; food cells 1473, browse 627; mouths/zebra 1.00; zebras with killer 34%; striped 100%; eyes/zebra 2.02; horned rhinos 100%; soil water 0.48. Change since last frame: grass +149 (+30%), bush -39 (-63%), tree +22 (+56%) | 3 fire(s), 9 cells burnt |
| 11900 | `extra/leopards32-1/event-011900-rhino-collapse.png` | zebra 69, rhino 2, leopard 0; grass 764, bush 29, tree 69; food cells 1611, browse 763; mouths/zebra 1.00; zebras with killer 22%; striped 100%; eyes/zebra 2.06; horned rhinos 100%; soil water 0.48. Change since last frame: zebra -47 (-41%), rhino -6 (-75%), bush +6 (+26%) | rhino collapse at 11900 (peak 38 at 2400) |
| 14100 | `extra/leopards32-1/event-014100-rhino-extinct.png` | zebra 37, rhino 0, leopard 0; grass 920, bush 6, tree 76; food cells 979, browse 467; mouths/zebra 1.00; zebras with killer 76%; striped 100%; eyes/zebra 2.00; soil water 0.47. Change since last frame: zebra -32 (-46%), bush -23 (-79%) | rhino extinct at 14100 (peak 38 at 2400) |
| 18500 | `extra/leopards32-1/event-018500-bush-collapse.png` | zebra 21, rhino 0, leopard 0; grass 1006, bush 2, tree 80; food cells 1075, browse 428; mouths/zebra 0.95; zebras with killer 100%; striped 95%; eyes/zebra 2.00; soil water 0.47. Change since last frame: zebra -16 (-43%), bush -4 (-67%) | bush collapse at 18500 (peak 136 at 600) |
| 20000 | `extra/leopards32-1/frame-020000.png` | zebra 24, rhino 0, leopard 0; grass 983, bush 1, tree 74; food cells 1026, browse 473; mouths/zebra 1.00; zebras with killer 96%; striped 100%; eyes/zebra 2.00; soil water 0.48 | 1 fire(s), 1 cells burnt |
| 20400 | `extra/leopards32-1/event-020400-bush-extinct.png` | zebra 31, rhino 0, leopard 0; grass 959, bush 0, tree 70; food cells 811, browse 384; mouths/zebra 1.00; zebras with killer 100%; striped 100%; eyes/zebra 2.00; soil water 0.48. Change since last frame: zebra +7 (+29%) | bush extinct at 20400 (peak 136 at 600) |
| 40000 | `extra/leopards32-1/frame-040000.png` | zebra 20, rhino 0, leopard 0; grass 1079, bush 0, tree 53; food cells 1041, browse 726; mouths/zebra 1.00; zebras with killer 100%; striped 100%; eyes/zebra 0.55; soil water 0.48. Change since last frame: zebra -11 (-35%) | 10 fire(s), 50 cells burnt |
| 46200 | `extra/leopards32-1/event-046200-zebra-collapse.png` | zebra 2, rhino 0, leopard 0; grass 1199, bush 0, tree 42; food cells 850, browse 796; mouths/zebra 1.00; zebras with killer 50%; striped 100%; eyes/zebra 0.50; soil water 0.48. Change since last frame: zebra -18 (-90%) | zebra collapse at 46200 (peak 134 at 4000) |
| 47000 | `extra/leopards32-1/event-047000-zebra-extinct.png` | zebra 0, rhino 0, leopard 0; grass 1177, bush 0, tree 39; food cells 923, browse 1001; mouths/zebra 0.00; soil water 0.48 | zebra extinct at 47000 (peak 134 at 4000) |
| 60000 | `extra/leopards32-1/frame-060000.png` | zebra 0, rhino 0, leopard 0; grass 1284, bush 0, tree 25; food cells 387, browse 1343; mouths/zebra 0.00; soil water 0.49. Change since last frame: tree -14 (-36%) | 5 fire(s), 32 cells burnt |

#### extra/leopards32-2

- **zebra: boom then collapse, no trait (unresolved).** 32 -> peak 58 at tick 3300; extinct at tick 17700; food plants 537 at the peak -> 808 at extinction; main cause of death after the peak: age (304).
- **rhino: boom then collapse, no trait (unresolved).** 12 -> peak 90 at tick 4700; extinct at tick 32700; food plants 520 at the peak -> 1008 at extinction; main cause of death after the peak: age (969).
- **leopard: failure to adapt.** 32 -> peak 44 at tick 700; extinct at tick 3500; food plants 524 at the peak -> 533 at extinction; main cause of death after the peak: age (42).

| tick | screenshot | state | events since previous frame |
|---|---|---|---|
| 0 | `extra/leopards32-2/frame-000000.png` | zebra 32, rhino 12, leopard 32; grass 140, bush 45, tree 14; food cells 0; mouths/zebra 1.00; zebras with killer 100%; striped 100%; eyes/zebra 2.00; horned rhinos 100%; leopards with cache 100%; soil water 0.62 | - |
| 2800 | `extra/leopards32-2/event-002800-leopard-collapse.png` | zebra 43, rhino 68, leopard 2; grass 554, bush 52, tree 28; food cells 1344, browse 331; mouths/zebra 1.00; zebras with killer 100%; striped 100%; eyes/zebra 2.00; horned rhinos 100%; leopards with cache 100%; soil water 0.43. Change since last frame: zebra +11 (+34%), rhino +56 (+467%), leopard -30 (-94%), grass +414 (+296%), tree +14 (+100%) | leopard collapse at 2800 (peak 44 at 700) |
| 3500 | `extra/leopards32-2/event-003500-leopard-extinct.png` | zebra 54, rhino 73, leopard 0; grass 496, bush 37, tree 37; food cells 1063, browse 258; mouths/zebra 1.00; zebras with killer 100%; striped 100%; eyes/zebra 2.00; horned rhinos 100%; soil water 0.43. Change since last frame: zebra +11 (+26%), bush -15 (-29%), tree +9 (+32%) | leopard extinct at 3500 (peak 44 at 700); 2 fire(s), 61 cells burnt |
| 5000 | `extra/leopards32-2/frame-005000.png` | zebra 45, rhino 83, leopard 0; grass 490, bush 40, tree 56; food cells 949, browse 310; mouths/zebra 1.00; zebras with killer 96%; striped 100%; eyes/zebra 2.00; horned rhinos 99%; soil water 0.44. Change since last frame: tree +19 (+51%) | 2 fire(s), 7 cells burnt |
| 10000 | `extra/leopards32-2/frame-010000.png` | zebra 28, rhino 47, leopard 0; grass 588, bush 24, tree 99; food cells 1488, browse 829; mouths/zebra 1.00; zebras with killer 100%; striped 100%; eyes/zebra 1.86; horned rhinos 89%; soil water 0.48. Change since last frame: zebra -17 (-38%), rhino -36 (-43%), bush -16 (-40%), tree +43 (+77%) | 2 fire(s), 25 cells burnt |
| 15000 | `extra/leopards32-2/event-015000-bush-collapse.png` | zebra 5, rhino 48, leopard 0; grass 803, bush 2, tree 129; food cells 1641, browse 1002; mouths/zebra 1.00; zebras with killer 100%; rhinos with killer 2%; striped 100%; eyes/zebra 2.00; horned rhinos 65%; soil water 0.50. Change since last frame: zebra -23 (-82%), grass +215 (+37%), bush -22 (-92%), tree +30 (+30%) | bush collapse at 15000 (peak 135 at 600); 4 fire(s), 42 cells burnt |
| 15500 | `extra/leopards32-2/event-015500-bush-extinct.png` | zebra 4, rhino 48, leopard 0; grass 817, bush 0, tree 127; food cells 1903, browse 1065; mouths/zebra 1.00; zebras with killer 100%; rhinos with killer 2%; striped 100%; eyes/zebra 2.00; horned rhinos 65%; soil water 0.50 | bush extinct at 15500 (peak 135 at 600) |
| 16100 | `extra/leopards32-2/event-016100-zebra-collapse.png` | zebra 2, rhino 44, leopard 0; grass 817, bush 0, tree 129; food cells 1982, browse 1105; mouths/zebra 1.00; zebras with killer 100%; striped 100%; eyes/zebra 2.00; horned rhinos 61%; soil water 0.50 | zebra collapse at 16100 (peak 58 at 3300) |
| 17700 | `extra/leopards32-2/event-017700-zebra-extinct.png` | zebra 0, rhino 56, leopard 0; grass 808, bush 0, tree 135; food cells 1876, browse 939; mouths/zebra 0.00; horned rhinos 50%; soil water 0.50. Change since last frame: rhino +12 (+27%) | zebra extinct at 17700 (peak 58 at 3300); 1 fire(s), 10 cells burnt |
| 20000 | `extra/leopards32-2/frame-020000.png` | zebra 0, rhino 30, leopard 0; grass 761, bush 0, tree 135; food cells 2243, browse 1105; mouths/zebra 0.00; horned rhinos 10%; soil water 0.52. Change since last frame: rhino -26 (-46%) | - |
| 32600 | `extra/leopards32-2/event-032600-rhino-collapse.png` | zebra 0, rhino 1, leopard 0; grass 1006, bush 0, tree 134; food cells 834, browse 915; mouths/zebra 0.00; soil water 0.50. Change since last frame: rhino -29 (-97%), grass +245 (+32%) | rhino collapse at 32600 (peak 90 at 4700); 7 fire(s), 33 cells burnt |
| 32700 | `extra/leopards32-2/event-032700-rhino-extinct.png` | zebra 0, rhino 0, leopard 0; grass 1008, bush 0, tree 135; food cells 744, browse 935; mouths/zebra 0.00; soil water 0.50 | rhino extinct at 32700 (peak 90 at 4700) |
| 40000 | `extra/leopards32-2/frame-040000.png` | zebra 0, rhino 0, leopard 0; grass 1127, bush 0, tree 123; food cells 394, browse 577; mouths/zebra 0.00; soil water 0.49 | 3 fire(s), 50 cells burnt |
| 60000 | `extra/leopards32-2/frame-060000.png` | zebra 0, rhino 0, leopard 0; grass 1197, bush 0, tree 79; food cells 390, browse 1130; mouths/zebra 0.00; soil water 0.51. Change since last frame: tree -44 (-36%) | 11 fire(s), 44 cells burnt |

#### extra/leopards32-3

- **zebra: boom then collapse, no trait (unresolved).** 34 -> peak 80 at tick 4500; extinct at tick 25600; food plants 513 at the peak -> 897 at extinction; main cause of death after the peak: age (514).
- **rhino: boom then collapse, no trait (unresolved).** 12 -> peak 34 at tick 9400; extinct at tick 26600; food plants 706 at the peak -> 901 at extinction; main cause of death after the peak: age (113).
- **leopard: failure to adapt.** 32 -> peak 44 at tick 400; extinct at tick 5800; food plants 635 at the peak -> 578 at extinction; main cause of death after the peak: age (43).

| tick | screenshot | state | events since previous frame |
|---|---|---|---|
| 0 | `extra/leopards32-3/frame-000000.png` | zebra 34, rhino 12, leopard 32; grass 140, bush 45, tree 14; food cells 0; mouths/zebra 1.00; zebras with killer 100%; striped 100%; eyes/zebra 2.00; horned rhinos 100%; leopards with cache 100%; soil water 0.61 | - |
| 500 | `extra/leopards32-3/event-000500-rhino-collapse.png` | zebra 5, rhino 2, leopard 44; grass 503, bush 113, tree 15; food cells 2451, browse 646; mouths/zebra 1.00; zebras with killer 100%; striped 100%; eyes/zebra 2.00; horned rhinos 100%; leopards with cache 100%; soil water 0.49. Change since last frame: zebra -29 (-85%), rhino -10 (-83%), leopard +12 (+38%), grass +363 (+259%), bush +68 (+151%) | rhino collapse at 500 (peak 12 at 0) |
| 1400 | `extra/leopards32-3/event-001400-leopard-collapse.png` | zebra 24, rhino 13, leopard 2; grass 381, bush 30, tree 21; food cells 2546, browse 469; mouths/zebra 1.00; zebras with killer 100%; striped 100%; eyes/zebra 2.00; horned rhinos 100%; leopards with cache 100%; soil water 0.48. Change since last frame: zebra +19 (+380%), rhino +11 (+550%), leopard -42 (-95%), bush -83 (-73%), tree +6 (+40%) | leopard collapse at 1400 (peak 44 at 400) |
| 5000 | `extra/leopards32-3/frame-005000.png` | zebra 73, rhino 23, leopard 3; grass 494, bush 39, tree 45; food cells 1044, browse 345; mouths/zebra 1.00; zebras with killer 97%; striped 100%; eyes/zebra 1.97; horned rhinos 100%; leopards with cache 100%; soil water 0.45. Change since last frame: zebra +49 (+204%), rhino +10 (+77%), grass +113 (+30%), bush +9 (+30%), tree +24 (+114%) | 3 fire(s), 17 cells burnt |
| 5800 | `extra/leopards32-3/event-005800-leopard-extinct.png` | zebra 75, rhino 18, leopard 0; grass 527, bush 51, tree 53; food cells 802, browse 429; mouths/zebra 1.00; zebras with killer 96%; striped 100%; eyes/zebra 1.97; horned rhinos 100%; soil water 0.45. Change since last frame: leopard -3 (-100%), bush +12 (+31%) | leopard extinct at 5800 (peak 44 at 400) |
| 10000 | `extra/leopards32-3/frame-010000.png` | zebra 39, rhino 25, leopard 0; grass 710, bush 25, tree 66; food cells 1192, browse 545; mouths/zebra 1.00; zebras with killer 72%; striped 100%; eyes/zebra 1.72; horned rhinos 100%; soil water 0.46. Change since last frame: zebra -36 (-48%), rhino +7 (+39%), grass +183 (+35%), bush -26 (-51%) | 2 fire(s), 16 cells burnt |
| 14200 | `extra/leopards32-3/event-014200-bush-collapse.png` | zebra 19, rhino 13, leopard 0; grass 823, bush 1, tree 79; food cells 1390, browse 874; mouths/zebra 1.00; striped 100%; eyes/zebra 1.00; horned rhinos 100%; soil water 0.47. Change since last frame: zebra -20 (-51%), rhino -12 (-48%), bush -24 (-96%) | bush collapse at 14200 (peak 117 at 600) |
| 14300 | `extra/leopards32-3/event-014300-bush-extinct.png` | zebra 16, rhino 12, leopard 0; grass 799, bush 0, tree 76; food cells 1398, browse 909; mouths/zebra 1.00; striped 100%; eyes/zebra 1.00; horned rhinos 100%; soil water 0.47 | bush extinct at 14300 (peak 117 at 600) |
| 20000 | `extra/leopards32-3/frame-020000.png` | zebra 14, rhino 7, leopard 0; grass 887, bush 0, tree 88; food cells 1211, browse 720; mouths/zebra 1.00; striped 100%; eyes/zebra 1.00; horned rhinos 100%; soil water 0.48. Change since last frame: rhino -5 (-42%) | - |
| 21600 | `extra/leopards32-3/event-021600-rhino-collapse.png` | zebra 7, rhino 2, leopard 0; grass 834, bush 0, tree 94; food cells 1410, browse 964; mouths/zebra 1.00; striped 100%; eyes/zebra 1.00; horned rhinos 100%; soil water 0.49. Change since last frame: zebra -7 (-50%), rhino -5 (-71%) | rhino collapse at 21600 (peak 34 at 9400) |
| 23000 | `extra/leopards32-3/event-023000-zebra-collapse.png` | zebra 2, rhino 2, leopard 0; grass 866, bush 0, tree 94; food cells 1058, browse 860; mouths/zebra 1.00; striped 100%; eyes/zebra 1.00; horned rhinos 100%; soil water 0.48. Change since last frame: zebra -5 (-71%) | zebra collapse at 23000 (peak 80 at 4500); 2 fire(s), 14 cells burnt |
| 25600 | `extra/leopards32-3/event-025600-zebra-extinct.png` | zebra 0, rhino 1, leopard 0; grass 897, bush 0, tree 95; food cells 730, browse 689; mouths/zebra 0.00; horned rhinos 100%; soil water 0.48 | zebra extinct at 25600 (peak 80 at 4500) |
| 26600 | `extra/leopards32-3/event-026600-rhino-extinct.png` | zebra 0, rhino 0, leopard 0; grass 901, bush 0, tree 89; food cells 595, browse 504; mouths/zebra 0.00; soil water 0.48 | rhino extinct at 26600 (peak 34 at 9400); 1 fire(s), 7 cells burnt |
| 40000 | `extra/leopards32-3/frame-040000.png` | zebra 0, rhino 0, leopard 0; grass 1014, bush 0, tree 68; food cells 756, browse 843; mouths/zebra 0.00; soil water 0.48 | 4 fire(s), 15 cells burnt |
| 60000 | `extra/leopards32-3/frame-060000.png` | zebra 0, rhino 0, leopard 0; grass 1109, bush 0, tree 11; food cells 995, browse 1281; mouths/zebra 0.00; soil water 0.48. Change since last frame: tree -57 (-84%) | 10 fire(s), 40 cells burnt |

### leopards48

**What we tried:** Follow-up: three times the starting leopards.

**Outcome across seeds:**

- zebra: collapse under predation x2; suicide candidate (3 of 4) x1
- rhino: persisted x1; boom then collapse, no trait (unresolved) x2
- leopard: failure to adapt x3

#### extra/leopards48-1

- **zebra: collapse under predation.** 35 -> peak 35 at tick 0; extinct at tick 1300; food plants 185 at the peak -> 493 at extinction; main cause of death after the peak: attack (40).
- **rhino: persisted.** 12 -> peak 118 at tick 52800; 98 alive at the end; mouths per animal rose by 0.66.
- **leopard: failure to adapt.** 48 -> peak 66 at tick 800; extinct at tick 3800; food plants 522 at the peak -> 367 at extinction; main cause of death after the peak: age (58).

| tick | screenshot | state | events since previous frame |
|---|---|---|---|
| 0 | `extra/leopards48-1/frame-000000.png` | zebra 35, rhino 12, leopard 48; grass 140, bush 45, tree 14; food cells 0; mouths/zebra 1.00; zebras with killer 100%; striped 100%; eyes/zebra 2.00; horned rhinos 100%; leopards with cache 100%; soil water 0.62 | - |
| 500 | `extra/leopards48-1/event-000500-zebra-collapse.png` | zebra 1, rhino 7, leopard 65; grass 446, bush 143, tree 15; food cells 1954, browse 710; mouths/zebra 1.00; zebras with killer 100%; striped 100%; eyes/zebra 2.00; horned rhinos 100%; leopards with cache 100%; soil water 0.50. Change since last frame: zebra -34 (-97%), rhino -5 (-42%), leopard +17 (+35%), grass +306 (+219%), bush +98 (+218%) | zebra collapse at 500 (peak 35 at 0) |
| 1300 | `extra/leopards48-1/event-001300-zebra-extinct.png` | zebra 0, rhino 16, leopard 6; grass 393, bush 100, tree 21; food cells 2539, browse 978; mouths/zebra 0.00; horned rhinos 100%; leopards with cache 100%; soil water 0.48. Change since last frame: rhino +9 (+129%), leopard -59 (-91%), bush -43 (-30%), tree +6 (+40%) | zebra extinct at 1300 (peak 35 at 0) |
| 2900 | `extra/leopards48-1/event-002900-leopard-collapse.png` | zebra 0, rhino 77, leopard 2; grass 359, bush 36, tree 29; food cells 2041, browse 709; mouths/zebra 0.00; horned rhinos 100%; leopards with cache 100%; soil water 0.48. Change since last frame: rhino +61 (+381%), leopard -4 (-67%), bush -64 (-64%), tree +8 (+38%) | leopard collapse at 2900 (peak 66 at 800); 2 fire(s), 62 cells burnt |
| 3800 | `extra/leopards48-1/event-003800-leopard-extinct.png` | zebra 0, rhino 59, leopard 0; grass 348, bush 19, tree 31; food cells 2122, browse 683; mouths/zebra 0.00; horned rhinos 100%; soil water 0.49. Change since last frame: bush -17 (-47%) | leopard extinct at 3800 (peak 66 at 800); 1 fire(s), 14 cells burnt |
| 5000 | `extra/leopards48-1/frame-005000.png` | zebra 0, rhino 68, leopard 0; grass 365, bush 10, tree 41; food cells 1006, browse 306; mouths/zebra 0.00; horned rhinos 100%; soil water 0.49. Change since last frame: bush -9 (-47%), tree +10 (+32%) | 1 fire(s), 13 cells burnt |
| 7300 | `extra/leopards48-1/event-007300-bush-collapse.png` | zebra 0, rhino 52, leopard 0; grass 428, bush 2, tree 67; food cells 1233, browse 507; mouths/zebra 0.00; horned rhinos 98%; soil water 0.51. Change since last frame: bush -8 (-80%), tree +26 (+63%) | bush collapse at 7300 (peak 155 at 600); 1 fire(s), 2 cells burnt |
| 8800 | `extra/leopards48-1/event-008800-bush-extinct.png` | zebra 0, rhino 49, leopard 0; grass 488, bush 0, tree 67; food cells 1401, browse 658; mouths/zebra 0.00; horned rhinos 96%; soil water 0.52 | bush extinct at 8800 (peak 155 at 600) |
| 10000 | `extra/leopards48-1/frame-010000.png` | zebra 0, rhino 43, leopard 0; grass 440, bush 0, tree 76; food cells 1335, browse 837; mouths/zebra 0.00; horned rhinos 84%; soil water 0.53 | 1 fire(s), 5 cells burnt |
| 20000 | `extra/leopards48-1/frame-020000.png` | zebra 0, rhino 53, leopard 0; grass 542, bush 0, tree 57; food cells 1301, browse 929; mouths/zebra 0.00; horned rhinos 100%; soil water 0.53. Change since last frame: tree -19 (-25%) | 7 fire(s), 187 cells burnt |
| 40000 | `extra/leopards48-1/frame-040000.png` | zebra 0, rhino 66, leopard 0; grass 592, bush 0, tree 86; food cells 1050, browse 1191; mouths/zebra 0.00; horned rhinos 50%; soil water 0.55. Change since last frame: tree +29 (+51%) | 9 fire(s), 71 cells burnt |
| 60000 | `extra/leopards48-1/frame-060000.png` | zebra 0, rhino 98, leopard 0; grass 566, bush 0, tree 54; food cells 527, browse 1224; mouths/zebra 0.00; horned rhinos 56%; soil water 0.56. Change since last frame: rhino +32 (+48%), tree -32 (-37%) | 11 fire(s), 45 cells burnt |

#### extra/leopards48-2

- **zebra: collapse under predation.** 32 -> peak 32 at tick 0; extinct at tick 900; food plants 185 at the peak -> 480 at extinction; main cause of death after the peak: attack (40).
- **rhino: boom then collapse, no trait (unresolved).** 12 -> peak 115 at tick 4200; extinct at tick 19800; food plants 584 at the peak -> 898 at extinction; main cause of death after the peak: age (625).
- **leopard: failure to adapt.** 48 -> peak 70 at tick 600; extinct at tick 2000; food plants 576 at the peak -> 484 at extinction; main cause of death after the peak: age (58).

| tick | screenshot | state | events since previous frame |
|---|---|---|---|
| 0 | `extra/leopards48-2/frame-000000.png` | zebra 32, rhino 12, leopard 48; grass 140, bush 45, tree 14; food cells 0; mouths/zebra 1.00; zebras with killer 100%; striped 100%; eyes/zebra 2.00; horned rhinos 100%; leopards with cache 100%; soil water 0.62 | - |
| 600 | `extra/leopards48-2/event-000600-zebra-collapse.png` | zebra 2, rhino 8, leopard 70; grass 434, bush 142, tree 14; food cells 1992, browse 697; mouths/zebra 1.00; zebras with killer 100%; striped 100%; eyes/zebra 2.00; horned rhinos 100%; leopards with cache 100%; soil water 0.48. Change since last frame: zebra -30 (-94%), rhino -4 (-33%), leopard +22 (+46%), grass +294 (+210%), bush +97 (+216%) | zebra collapse at 600 (peak 32 at 0) |
| 900 | `extra/leopards48-2/event-000900-zebra-extinct.png` | zebra 0, rhino 9, leopard 62; grass 388, bush 92, tree 17; food cells 1832, browse 587; mouths/zebra 0.00; horned rhinos 100%; leopards with cache 100%; soil water 0.48. Change since last frame: bush -50 (-35%) | zebra extinct at 900 (peak 32 at 0); 2 fire(s), 29 cells burnt |
| 1900 | `extra/leopards48-2/event-001900-leopard-collapse.png` | zebra 0, rhino 59, leopard 1; grass 410, bush 36, tree 24; food cells 1479, browse 523; mouths/zebra 0.00; horned rhinos 100%; leopards with cache 100%; soil water 0.49. Change since last frame: rhino +50 (+556%), leopard -61 (-98%), bush -56 (-61%), tree +7 (+41%) | leopard collapse at 1900 (peak 70 at 600); 1 fire(s), 1 cells burnt |
| 2000 | `extra/leopards48-2/event-002000-leopard-extinct.png` | zebra 0, rhino 67, leopard 0; grass 452, bush 32, tree 24; food cells 1575, browse 490; mouths/zebra 0.00; horned rhinos 100%; soil water 0.48 | leopard extinct at 2000 (peak 70 at 600) |
| 5000 | `extra/leopards48-2/frame-005000.png` | zebra 0, rhino 88, leopard 0; grass 561, bush 42, tree 49; food cells 1487, browse 404; mouths/zebra 0.00; horned rhinos 100%; soil water 0.43. Change since last frame: rhino +21 (+31%), bush +10 (+31%), tree +25 (+104%) | - |
| 10000 | `extra/leopards48-2/frame-010000.png` | zebra 0, rhino 67, leopard 0; grass 583, bush 10, tree 85; food cells 1523, browse 859; mouths/zebra 0.00; horned rhinos 100%; soil water 0.49. Change since last frame: bush -32 (-76%), tree +36 (+73%) | 4 fire(s), 63 cells burnt |
| 11000 | `extra/leopards48-2/event-011000-bush-collapse.png` | zebra 0, rhino 44, leopard 0; grass 705, bush 1, tree 91; food cells 1431, browse 829; mouths/zebra 0.00; horned rhinos 100%; soil water 0.50. Change since last frame: rhino -23 (-34%), bush -9 (-90%) | bush collapse at 11000 (peak 142 at 600) |
| 11100 | `extra/leopards48-2/event-011100-bush-extinct.png` | zebra 0, rhino 45, leopard 0; grass 726, bush 0, tree 89; food cells 1397, browse 768; mouths/zebra 0.00; horned rhinos 100%; soil water 0.50 | bush extinct at 11100 (peak 142 at 600) |
| 19000 | `extra/leopards48-2/event-019000-rhino-collapse.png` | zebra 0, rhino 2, leopard 0; grass 929, bush 0, tree 117; food cells 1262, browse 1091; mouths/zebra 0.00; horned rhinos 100%; soil water 0.50. Change since last frame: rhino -43 (-96%), grass +203 (+28%), tree +28 (+31%) | rhino collapse at 19000 (peak 115 at 4200); 1 fire(s), 7 cells burnt |
| 19800 | `extra/leopards48-2/event-019800-rhino-extinct.png` | zebra 0, rhino 0, leopard 0; grass 898, bush 0, tree 119; food cells 1402, browse 1245; mouths/zebra 0.00; soil water 0.51 | rhino extinct at 19800 (peak 115 at 4200) |
| 20000 | `extra/leopards48-2/frame-020000.png` | zebra 0, rhino 0, leopard 0; grass 902, bush 0, tree 119; food cells 1426, browse 1309; mouths/zebra 0.00; soil water 0.51 | - |
| 40000 | `extra/leopards48-2/frame-040000.png` | zebra 0, rhino 0, leopard 0; grass 925, bush 0, tree 30; food cells 1108, browse 2583; mouths/zebra 0.00; soil water 0.55. Change since last frame: tree -89 (-75%) | 13 fire(s), 90 cells burnt |
| 60000 | `extra/leopards48-2/frame-060000.png` | zebra 0, rhino 0, leopard 0; grass 904, bush 0, tree 13; food cells 934, browse 2500; mouths/zebra 0.00; soil water 0.57. Change since last frame: tree -17 (-57%) | 7 fire(s), 60 cells burnt |

#### extra/leopards48-3

- **zebra: suicide candidate (3 of 4).** 34 -> peak 96 at tick 7100; extinct at tick 31900; mouths per animal rose by 1.00; food plants 504 at the peak -> 1009 at extinction; main cause of death after the peak: age (1104).
- **rhino: boom then collapse, no trait (unresolved).** 12 -> peak 73 at tick 2500; extinct at tick 14000; food plants 511 at the peak -> 672 at extinction; main cause of death after the peak: age (246).
- **leopard: failure to adapt.** 48 -> peak 67 at tick 400; extinct at tick 3700; food plants 606 at the peak -> 512 at extinction; main cause of death after the peak: age (52).

| tick | screenshot | state | events since previous frame |
|---|---|---|---|
| 0 | `extra/leopards48-3/frame-000000.png` | zebra 34, rhino 12, leopard 48; grass 140, bush 45, tree 14; food cells 0; mouths/zebra 1.00; zebras with killer 100%; striped 100%; eyes/zebra 2.00; horned rhinos 100%; leopards with cache 100%; soil water 0.60 | - |
| 700 | `extra/leopards48-3/event-000700-rhino-collapse.png` | zebra 6, rhino 2, leopard 67; grass 401, bush 115, tree 15; food cells 2028, browse 679; mouths/zebra 1.00; zebras with killer 100%; striped 100%; eyes/zebra 2.00; horned rhinos 100%; leopards with cache 99%; soil water 0.47. Change since last frame: zebra -28 (-82%), rhino -10 (-83%), leopard +19 (+40%), grass +261 (+186%), bush +70 (+156%) | rhino collapse at 700 (peak 12 at 0) |
| 1000 | `extra/leopards48-3/event-001000-zebra-collapse.png` | zebra 2, rhino 5, leopard 35; grass 384, bush 71, tree 16; food cells 2028, browse 603; mouths/zebra 1.00; zebras with killer 100%; striped 100%; eyes/zebra 2.00; horned rhinos 100%; leopards with cache 100%; soil water 0.46. Change since last frame: zebra -4 (-67%), rhino +3 (+150%), leopard -32 (-48%), bush -44 (-38%) | zebra collapse at 1000 (peak 34 at 0) |
| 1400 | `extra/leopards48-3/event-001400-leopard-collapse.png` | zebra 11, rhino 11, leopard 2; grass 357, bush 52, tree 21; food cells 2955, browse 736; mouths/zebra 1.00; zebras with killer 100%; striped 100%; eyes/zebra 2.00; horned rhinos 100%; leopards with cache 100%; soil water 0.47. Change since last frame: zebra +9 (+450%), rhino +6 (+120%), leopard -33 (-94%), bush -19 (-27%), tree +5 (+31%) | leopard collapse at 1400 (peak 67 at 400); 1 fire(s), 1 cells burnt |
| 3700 | `extra/leopards48-3/event-003700-leopard-extinct.png` | zebra 54, rhino 42, leopard 0; grass 480, bush 32, tree 36; food cells 1296, browse 271; mouths/zebra 1.00; zebras with killer 100%; striped 100%; eyes/zebra 1.98; horned rhinos 100%; soil water 0.43. Change since last frame: zebra +43 (+391%), rhino +31 (+282%), grass +123 (+34%), bush -20 (-38%), tree +15 (+71%) | leopard extinct at 3700 (peak 67 at 400); 1 fire(s), 3 cells burnt |
| 5000 | `extra/leopards48-3/frame-005000.png` | zebra 84, rhino 25, leopard 0; grass 512, bush 39, tree 44; food cells 1293, browse 319; mouths/zebra 1.06; zebras with killer 100%; striped 100%; eyes/zebra 1.99; horned rhinos 100%; soil water 0.43. Change since last frame: zebra +30 (+56%), rhino -17 (-40%) | - |
| 10000 | `extra/leopards48-3/frame-010000.png` | zebra 74, rhino 21, leopard 0; grass 510, bush 9, tree 78; food cells 1175, browse 487; mouths/zebra 1.31; zebras with killer 100%; striped 100%; eyes/zebra 2.04; horned rhinos 100%; soil water 0.47. Change since last frame: bush -30 (-77%), tree +34 (+77%) | 3 fire(s), 23 cells burnt |
| 13100 | `extra/leopards48-3/event-013100-rhino-collapse.png` | zebra 56, rhino 2, leopard 0; grass 654, bush 9, tree 89; food cells 1420, browse 880; mouths/zebra 1.75; zebras with killer 100%; striped 100%; eyes/zebra 1.98; horned rhinos 100%; soil water 0.48. Change since last frame: rhino -19 (-90%), grass +144 (+28%) | rhino collapse at 13100 (peak 73 at 2500) |
| 14000 | `extra/leopards48-3/event-014000-bush-collapse.png` | zebra 71, rhino 0, leopard 0; grass 670, bush 2, tree 93; food cells 1173, browse 698; mouths/zebra 1.66; zebras with killer 100%; striped 100%; eyes/zebra 1.94; soil water 0.47. Change since last frame: zebra +15 (+27%), bush -7 (-78%) | bush collapse at 14000 (peak 129 at 600); rhino extinct at 14000 (peak 73 at 2500); 1 fire(s), 4 cells burnt |
| 14000 | `extra/leopards48-3/event-014000-rhino-extinct.png` | zebra 71, rhino 0, leopard 0; grass 670, bush 2, tree 93; food cells 1173, browse 698; mouths/zebra 1.66; zebras with killer 100%; striped 100%; eyes/zebra 1.94; soil water 0.47 | - |
| 18300 | `extra/leopards48-3/event-018300-bush-extinct.png` | zebra 72, rhino 0, leopard 0; grass 744, bush 0, tree 94; food cells 1259, browse 606; mouths/zebra 1.69; zebras with killer 100%; striped 100%; eyes/zebra 1.69; soil water 0.48 | bush extinct at 18300 (peak 129 at 600); 3 fire(s), 13 cells burnt |
| 20000 | `extra/leopards48-3/frame-020000.png` | zebra 40, rhino 0, leopard 0; grass 712, bush 0, tree 104; food cells 1710, browse 898; mouths/zebra 1.60; zebras with killer 78%; striped 100%; eyes/zebra 1.73; soil water 0.48. Change since last frame: zebra -32 (-44%) | 1 fire(s), 5 cells burnt |
| 29800 | `extra/leopards48-3/event-029800-zebra-collapse.png` | zebra 2, rhino 0, leopard 0; grass 953, bush 0, tree 97; food cells 1444, browse 616; mouths/zebra 2.00; zebras with killer 100%; striped 100%; eyes/zebra 1.50; soil water 0.46. Change since last frame: zebra -38 (-95%), grass +241 (+34%) | zebra collapse at 29800 (peak 96 at 7100); 3 fire(s), 33 cells burnt |
| 31900 | `extra/leopards48-3/event-031900-zebra-extinct.png` | zebra 0, rhino 0, leopard 0; grass 1009, bush 0, tree 95; food cells 1207, browse 521; mouths/zebra 0.00; soil water 0.46 | zebra extinct at 31900 (peak 96 at 7100) |
| 40000 | `extra/leopards48-3/frame-040000.png` | zebra 0, rhino 0, leopard 0; grass 1047, bush 0, tree 81; food cells 1014, browse 556; mouths/zebra 0.00; soil water 0.45 | 2 fire(s), 4 cells burnt |
| 60000 | `extra/leopards48-3/frame-060000.png` | zebra 0, rhino 0, leopard 0; grass 1219, bush 0, tree 70; food cells 337, browse 1094; mouths/zebra 0.00; soil water 0.48 | 3 fire(s), 16 cells burnt |

### fire-strong

**What we tried:** Follow-up: 5 times the fire chance with full spread.

**Outcome across seeds:**

- zebra: persisted x2; boom then collapse, no trait (unresolved) x1
- rhino: failure to adapt x1; boom then collapse, no trait (unresolved) x2
- leopard: boom-bust: cohort aged out x2; failure to adapt x1

#### extra/fire-strong-1

- **zebra: persisted.** 35 -> peak 164 at tick 4400; 71 alive at the end; mouths per animal rose by 1.01.
- **rhino: failure to adapt.** 12 -> peak 13 at tick 1100; extinct at tick 3300; food plants 472 at the peak -> 468 at extinction; main cause of death after the peak: age (13).
- **leopard: boom-bust: cohort aged out.** 16 -> peak 29 at tick 800; extinct at tick 3500; food plants 504 at the peak -> 513 at extinction; main cause of death after the peak: attack (39).

| tick | screenshot | state | events since previous frame |
|---|---|---|---|
| 0 | `extra/fire-strong-1/frame-000000.png` | zebra 35, rhino 12, leopard 16; grass 140, bush 45, tree 14; food cells 0; mouths/zebra 1.00; zebras with killer 100%; striped 100%; eyes/zebra 2.00; horned rhinos 100%; leopards with cache 100%; soil water 0.62 | - |
| 2300 | `extra/fire-strong-1/event-002300-rhino-collapse.png` | zebra 94, rhino 2, leopard 15; grass 454, bush 38, tree 19; food cells 1238, browse 297; mouths/zebra 1.00; zebras with killer 100%; striped 100%; eyes/zebra 1.99; horned rhinos 100%; leopards with cache 100%; soil water 0.47. Change since last frame: zebra +59 (+169%), rhino -10 (-83%), grass +314 (+224%), tree +5 (+36%) | rhino collapse at 2300 (peak 13 at 1100); 2 fire(s), 26 cells burnt |
| 3300 | `extra/fire-strong-1/event-003300-rhino-extinct.png` | zebra 121, rhino 0, leopard 4; grass 429, bush 39, tree 31; food cells 881, browse 261; mouths/zebra 1.00; zebras with killer 99%; striped 100%; eyes/zebra 1.98; leopards with cache 100%; soil water 0.46. Change since last frame: zebra +27 (+29%), leopard -11 (-73%), tree +12 (+63%) | rhino extinct at 3300 (peak 13 at 1100); 3 fire(s), 13 cells burnt |
| 3400 | `extra/fire-strong-1/event-003400-leopard-collapse.png` | zebra 127, rhino 0, leopard 1; grass 436, bush 41, tree 32; food cells 924, browse 266; mouths/zebra 1.00; zebras with killer 99%; striped 100%; eyes/zebra 1.98; leopards with cache 100%; soil water 0.46. Change since last frame: leopard -3 (-75%) | leopard collapse at 3400 (peak 29 at 800); 1 fire(s), 9 cells burnt |
| 3500 | `extra/fire-strong-1/event-003500-leopard-extinct.png` | zebra 129, rhino 0, leopard 0; grass 475, bush 38, tree 32; food cells 1056, browse 298; mouths/zebra 1.00; zebras with killer 99%; striped 100%; eyes/zebra 1.97; soil water 0.45 | leopard extinct at 3500 (peak 29 at 800); 1 fire(s), 5 cells burnt |
| 5000 | `extra/fire-strong-1/frame-005000.png` | zebra 152, rhino 0, leopard 0; grass 507, bush 38, tree 41; food cells 921, browse 271; mouths/zebra 1.00; zebras with killer 100%; striped 100%; eyes/zebra 1.97; soil water 0.44. Change since last frame: tree +9 (+28%) | 3 fire(s), 65 cells burnt |
| 10000 | `extra/fire-strong-1/frame-010000.png` | zebra 116, rhino 0, leopard 0; grass 498, bush 10, tree 56; food cells 1129, browse 533; mouths/zebra 1.00; zebras with killer 96%; striped 100%; eyes/zebra 1.85; soil water 0.47. Change since last frame: bush -28 (-74%), tree +15 (+37%) | 11 fire(s), 127 cells burnt |
| 14800 | `extra/fire-strong-1/event-014800-bush-collapse.png` | zebra 97, rhino 0, leopard 0; grass 616, bush 2, tree 68; food cells 1506, browse 856; mouths/zebra 1.07; zebras with killer 32%; striped 100%; eyes/zebra 1.71; soil water 0.49. Change since last frame: bush -8 (-80%) | bush collapse at 14800 (peak 128 at 600); 14 fire(s), 235 cells burnt |
| 16400 | `extra/fire-strong-1/event-016400-bush-extinct.png` | zebra 131, rhino 0, leopard 0; grass 598, bush 0, tree 72; food cells 1172, browse 749; mouths/zebra 1.18; zebras with killer 23%; striped 100%; eyes/zebra 1.56; soil water 0.49. Change since last frame: zebra +34 (+35%) | bush extinct at 16400 (peak 128 at 600) |
| 20000 | `extra/fire-strong-1/frame-020000.png` | zebra 153, rhino 0, leopard 0; grass 704, bush 0, tree 77; food cells 939, browse 913; mouths/zebra 1.23; zebras with killer 5%; striped 100%; eyes/zebra 1.33; soil water 0.49 | 9 fire(s), 88 cells burnt |
| 40000 | `extra/fire-strong-1/frame-040000.png` | zebra 71, rhino 0, leopard 0; grass 1054, bush 0, tree 52; food cells 686, browse 1360; mouths/zebra 1.99; striped 70%; eyes/zebra 0.41; soil water 0.48. Change since last frame: zebra -82 (-54%), grass +350 (+50%), tree -25 (-32%) | 50 fire(s), 575 cells burnt |

#### extra/fire-strong-2

- **zebra: boom then collapse, no trait (unresolved).** 32 -> peak 60 at tick 3500; extinct at tick 23900; food plants 477 at the peak -> 721 at extinction; main cause of death after the peak: age (520).
- **rhino: boom then collapse, no trait (unresolved).** 12 -> peak 68 at tick 8000; extinct at tick 30200; food plants 487 at the peak -> 996 at extinction; main cause of death after the peak: age (561).
- **leopard: failure to adapt.** 16 -> peak 23 at tick 800; extinct at tick 7300; food plants 501 at the peak -> 478 at extinction; main cause of death after the peak: age (48).

| tick | screenshot | state | events since previous frame |
|---|---|---|---|
| 0 | `extra/fire-strong-2/frame-000000.png` | zebra 32, rhino 12, leopard 16; grass 140, bush 45, tree 14; food cells 0; mouths/zebra 1.00; zebras with killer 100%; striped 100%; eyes/zebra 2.00; horned rhinos 100%; leopards with cache 100%; soil water 0.61 | - |
| 5000 | `extra/fire-strong-2/frame-005000.png` | zebra 42, rhino 40, leopard 8; grass 454, bush 67, tree 43; food cells 1175, browse 588; mouths/zebra 1.00; zebras with killer 93%; striped 100%; eyes/zebra 1.98; horned rhinos 100%; leopards with cache 100%; soil water 0.45. Change since last frame: zebra +10 (+31%), rhino +28 (+233%), leopard -8 (-50%), grass +314 (+224%), bush +22 (+49%), tree +29 (+207%) | 19 fire(s), 308 cells burnt |
| 7100 | `extra/fire-strong-2/event-007100-leopard-collapse.png` | zebra 30, rhino 44, leopard 2; grass 391, bush 79, tree 63; food cells 1083, browse 784; mouths/zebra 1.00; zebras with killer 53%; striped 100%; eyes/zebra 2.00; horned rhinos 100%; leopards with cache 100%; soil water 0.48. Change since last frame: zebra -12 (-29%), leopard -6 (-75%), tree +20 (+47%) | leopard collapse at 7100 (peak 23 at 800); 3 fire(s), 84 cells burnt |
| 7300 | `extra/fire-strong-2/event-007300-leopard-extinct.png` | zebra 30, rhino 50, leopard 0; grass 399, bush 79, tree 65; food cells 1020, browse 863; mouths/zebra 1.00; zebras with killer 57%; striped 100%; eyes/zebra 2.00; horned rhinos 100%; soil water 0.48 | leopard extinct at 7300 (peak 23 at 800) |
| 10000 | `extra/fire-strong-2/frame-010000.png` | zebra 30, rhino 55, leopard 0; grass 524, bush 53, tree 66; food cells 1121, browse 744; mouths/zebra 0.97; striped 100%; eyes/zebra 2.00; horned rhinos 100%; soil water 0.48. Change since last frame: grass +125 (+31%), bush -26 (-33%) | 3 fire(s), 21 cells burnt |
| 20000 | `extra/fire-strong-2/frame-020000.png` | zebra 29, rhino 39, leopard 0; grass 760, bush 7, tree 89; food cells 1910, browse 1097; mouths/zebra 1.00; striped 100%; eyes/zebra 1.97; horned rhinos 95%; soil water 0.50. Change since last frame: rhino -16 (-29%), grass +236 (+45%), bush -46 (-87%), tree +23 (+35%) | 14 fire(s), 192 cells burnt |
| 21300 | `extra/fire-strong-2/event-021300-bush-collapse.png` | zebra 21, rhino 23, leopard 0; grass 655, bush 2, tree 93; food cells 2053, browse 1309; mouths/zebra 1.00; striped 100%; eyes/zebra 1.95; horned rhinos 83%; soil water 0.52. Change since last frame: zebra -8 (-28%), rhino -16 (-41%), bush -5 (-71%) | bush collapse at 21300 (peak 144 at 600); 2 fire(s), 35 cells burnt |
| 22300 | `extra/fire-strong-2/event-022300-bush-extinct.png` | zebra 6, rhino 18, leopard 0; grass 673, bush 0, tree 95; food cells 2033, browse 1261; mouths/zebra 1.00; striped 100%; eyes/zebra 1.83; horned rhinos 94%; soil water 0.53. Change since last frame: zebra -15 (-71%) | bush extinct at 22300 (peak 144 at 600) |
| 22800 | `extra/fire-strong-2/event-022800-zebra-collapse.png` | zebra 2, rhino 14, leopard 0; grass 689, bush 0, tree 96; food cells 2086, browse 1231; mouths/zebra 1.00; striped 100%; eyes/zebra 2.00; horned rhinos 100%; soil water 0.53. Change since last frame: zebra -4 (-67%) | zebra collapse at 22800 (peak 60 at 3500); 1 fire(s), 2 cells burnt |
| 23900 | `extra/fire-strong-2/event-023900-zebra-extinct.png` | zebra 0, rhino 29, leopard 0; grass 721, bush 0, tree 94; food cells 1456, browse 899; mouths/zebra 0.00; rhinos with killer 3%; horned rhinos 100%; soil water 0.52. Change since last frame: rhino +15 (+107%) | zebra extinct at 23900 (peak 60 at 3500); 1 fire(s), 10 cells burnt |
| 26800 | `extra/fire-strong-2/event-026800-rhino-collapse.png` | zebra 0, rhino 2, leopard 0; grass 967, bush 0, tree 102; food cells 1107, browse 513; mouths/zebra 0.00; horned rhinos 100%; soil water 0.47. Change since last frame: rhino -27 (-93%), grass +246 (+34%) | rhino collapse at 26800 (peak 68 at 8000); 6 fire(s), 82 cells burnt |
| 30200 | `extra/fire-strong-2/event-030200-rhino-extinct.png` | zebra 0, rhino 0, leopard 0; grass 996, bush 0, tree 107; food cells 1517, browse 660; mouths/zebra 0.00; soil water 0.47 | rhino extinct at 30200 (peak 68 at 8000); 3 fire(s), 31 cells burnt |
| 40000 | `extra/fire-strong-2/frame-040000.png` | zebra 0, rhino 0, leopard 0; grass 1125, bush 0, tree 111; food cells 679, browse 386; mouths/zebra 0.00; soil water 0.46 | 24 fire(s), 253 cells burnt |

#### extra/fire-strong-3

- **zebra: persisted.** 34 -> peak 106 at tick 3800; 8 alive at the end; mouths per animal rose by 1.00.
- **rhino: boom then collapse, no trait (unresolved).** 12 -> peak 32 at tick 1100; extinct at tick 6700; food plants 483 at the peak -> 616 at extinction; main cause of death after the peak: age (81).
- **leopard: boom-bust: cohort aged out.** 16 -> peak 26 at tick 700; extinct at tick 15600; food plants 546 at the peak -> 982 at extinction; main cause of death after the peak: age (94).

| tick | screenshot | state | events since previous frame |
|---|---|---|---|
| 0 | `extra/fire-strong-3/frame-000000.png` | zebra 34, rhino 12, leopard 16; grass 140, bush 45, tree 14; food cells 0; mouths/zebra 1.00; zebras with killer 100%; striped 100%; eyes/zebra 2.00; horned rhinos 100%; leopards with cache 100%; soil water 0.60 | - |
| 2500 | `extra/fire-strong-3/event-002500-leopard-collapse.png` | zebra 83, rhino 26, leopard 2; grass 475, bush 67, tree 31; food cells 1280, browse 457; mouths/zebra 0.99; zebras with killer 100%; striped 100%; eyes/zebra 2.00; horned rhinos 100%; leopards with cache 100%; soil water 0.43. Change since last frame: zebra +49 (+144%), rhino +14 (+117%), leopard -14 (-88%), grass +335 (+239%), bush +22 (+49%), tree +17 (+121%) | leopard collapse at 2500 (peak 26 at 700); 9 fire(s), 66 cells burnt |
| 5000 | `extra/fire-strong-3/frame-005000.png` | zebra 61, rhino 12, leopard 7; grass 495, bush 93, tree 51; food cells 1210, browse 644; mouths/zebra 1.00; zebras with killer 100%; striped 100%; eyes/zebra 1.98; horned rhinos 100%; leopards with cache 100%; soil water 0.44. Change since last frame: zebra -22 (-27%), rhino -14 (-54%), leopard +5 (+250%), bush +26 (+39%), tree +20 (+65%) | 9 fire(s), 92 cells burnt |
| 6100 | `extra/fire-strong-3/event-006100-rhino-collapse.png` | zebra 60, rhino 1, leopard 8; grass 510, bush 79, tree 57; food cells 874, browse 596; mouths/zebra 0.98; zebras with killer 98%; striped 98%; eyes/zebra 1.98; horned rhinos 100%; leopards with cache 100%; soil water 0.45. Change since last frame: rhino -11 (-92%) | rhino collapse at 6100 (peak 32 at 1100); 4 fire(s), 56 cells burnt |
| 6700 | `extra/fire-strong-3/event-006700-rhino-extinct.png` | zebra 33, rhino 0, leopard 21; grass 538, bush 78, tree 66; food cells 1252, browse 724; mouths/zebra 1.03; zebras with killer 100%; striped 94%; eyes/zebra 2.00; leopards with cache 100%; soil water 0.45. Change since last frame: zebra -27 (-45%), leopard +13 (+162%) | rhino extinct at 6700 (peak 32 at 1100); 1 fire(s), 2 cells burnt |
| 10000 | `extra/fire-strong-3/frame-010000.png` | zebra 29, rhino 0, leopard 10; grass 661, bush 92, tree 67; food cells 1145, browse 818; mouths/zebra 1.00; zebras with killer 100%; striped 100%; eyes/zebra 1.76; leopards with cache 100%; soil water 0.46. Change since last frame: leopard -11 (-52%) | 11 fire(s), 321 cells burnt |
| 15600 | `extra/fire-strong-3/event-015600-leopard-extinct.png` | zebra 26, rhino 0, leopard 0; grass 848, bush 134, tree 76; food cells 1076, browse 753; mouths/zebra 1.00; zebras with killer 100%; striped 100%; eyes/zebra 1.08; soil water 0.45. Change since last frame: leopard -10 (-100%), grass +187 (+28%), bush +42 (+46%) | leopard extinct at 15600 (peak 26 at 700); 9 fire(s), 92 cells burnt |
| 20000 | `extra/fire-strong-3/frame-020000.png` | zebra 27, rhino 0, leopard 0; grass 796, bush 152, tree 89; food cells 706, browse 630; mouths/zebra 1.00; zebras with killer 100%; striped 100%; eyes/zebra 1.00; soil water 0.46 | 7 fire(s), 41 cells burnt |
| 40000 | `extra/fire-strong-3/frame-040000.png` | zebra 8, rhino 0, leopard 0; grass 741, bush 319, tree 76; food cells 436, browse 1116; mouths/zebra 2.00; striped 100%; soil water 0.47. Change since last frame: zebra -19 (-70%), bush +167 (+110%) | 37 fire(s), 231 cells burnt |

### fire-extreme

**What we tried:** Follow-up: 10 times the fire chance.

**Outcome across seeds:**

- zebra: suicide candidate (3 of 4) x2; persisted x1
- rhino: boom then collapse, no trait (unresolved) x2; suicide candidate (3 of 4) x1
- leopard: failure to adapt x1; boom-bust: cohort aged out x2

#### extra/fire-extreme-1

- **zebra: suicide candidate (3 of 4).** 35 -> peak 132 at tick 4500; extinct at tick 40000; mouths per animal rose by 1.00; food plants 437 at the peak -> 1094 at extinction; main cause of death after the peak: age (2082).
- **rhino: boom then collapse, no trait (unresolved).** 12 -> peak 28 at tick 1100; extinct at tick 6500; food plants 477 at the peak -> 473 at extinction; main cause of death after the peak: age (71).
- **leopard: failure to adapt.** 16 -> peak 20 at tick 800; extinct at tick 3300; food plants 464 at the peak -> 465 at extinction; main cause of death after the peak: age (21).

| tick | screenshot | state | events since previous frame |
|---|---|---|---|
| 0 | `extra/fire-extreme-1/frame-000000.png` | zebra 35, rhino 12, leopard 16; grass 140, bush 45, tree 14; food cells 0; mouths/zebra 1.00; zebras with killer 100%; striped 100%; eyes/zebra 2.00; horned rhinos 100%; leopards with cache 100%; soil water 0.61 | - |
| 2900 | `extra/fire-extreme-1/event-002900-leopard-collapse.png` | zebra 86, rhino 15, leopard 1; grass 378, bush 127, tree 29; food cells 1028, browse 677; mouths/zebra 1.00; zebras with killer 98%; striped 97%; eyes/zebra 2.08; horned rhinos 100%; leopards with cache 100%; soil water 0.45. Change since last frame: zebra +51 (+146%), rhino +3 (+25%), leopard -15 (-94%), grass +238 (+170%), bush +82 (+182%), tree +15 (+107%) | leopard collapse at 2900 (peak 20 at 800); 14 fire(s), 193 cells burnt |
| 3300 | `extra/fire-extreme-1/event-003300-leopard-extinct.png` | zebra 98, rhino 19, leopard 0; grass 334, bush 131, tree 28; food cells 771, browse 659; mouths/zebra 0.99; zebras with killer 96%; striped 96%; eyes/zebra 2.05; horned rhinos 100%; soil water 0.45. Change since last frame: rhino +4 (+27%) | leopard extinct at 3300 (peak 20 at 800); 2 fire(s), 109 cells burnt |
| 5000 | `extra/fire-extreme-1/frame-005000.png` | zebra 124, rhino 6, leopard 0; grass 341, bush 133, tree 40; food cells 804, browse 677; mouths/zebra 1.00; zebras with killer 80%; striped 87%; eyes/zebra 1.99; horned rhinos 100%; soil water 0.46. Change since last frame: zebra +26 (+27%), rhino -13 (-68%), tree +12 (+43%) | 6 fire(s), 64 cells burnt |
| 5900 | `extra/fire-extreme-1/event-005900-rhino-collapse.png` | zebra 116, rhino 2, leopard 0; grass 315, bush 151, tree 48; food cells 744, browse 864; mouths/zebra 0.99; zebras with killer 87%; striped 79%; eyes/zebra 2.00; horned rhinos 100%; soil water 0.46. Change since last frame: rhino -4 (-67%) | rhino collapse at 5900 (peak 28 at 1100); 4 fire(s), 29 cells burnt |
| 6500 | `extra/fire-extreme-1/event-006500-rhino-extinct.png` | zebra 115, rhino 0, leopard 0; grass 313, bush 160, tree 50; food cells 767, browse 915; mouths/zebra 1.00; zebras with killer 82%; striped 83%; eyes/zebra 2.00; soil water 0.46 | rhino extinct at 6500 (peak 28 at 1100); 5 fire(s), 34 cells burnt |
| 10000 | `extra/fire-extreme-1/frame-010000.png` | zebra 109, rhino 0, leopard 0; grass 282, bush 189, tree 70; food cells 633, browse 1185; mouths/zebra 1.00; zebras with killer 58%; striped 55%; eyes/zebra 1.98; soil water 0.49. Change since last frame: tree +20 (+40%) | 14 fire(s), 163 cells burnt |
| 20000 | `extra/fire-extreme-1/frame-020000.png` | zebra 82, rhino 0, leopard 0; grass 521, bush 110, tree 96; food cells 860, browse 904; mouths/zebra 1.02; zebras with killer 16%; striped 84%; eyes/zebra 1.80; soil water 0.49. Change since last frame: grass +239 (+85%), bush -79 (-42%), tree +26 (+37%) | 43 fire(s), 573 cells burnt |
| 38400 | `extra/fire-extreme-1/event-038400-zebra-collapse.png` | zebra 2, rhino 0, leopard 0; grass 777, bush 310, tree 101; food cells 432, browse 951; mouths/zebra 2.00; eyes/zebra 1.00; soil water 0.47. Change since last frame: zebra -80 (-98%), grass +256 (+49%), bush +200 (+182%) | zebra collapse at 38400 (peak 132 at 4500); 76 fire(s), 657 cells burnt |
| 40000 | `extra/fire-extreme-1/event-040000-zebra-extinct.png` | zebra 0, rhino 0, leopard 0; grass 760, bush 334, tree 97; food cells 501, browse 1167; mouths/zebra 0.00; soil water 0.47 | zebra extinct at 40000 (peak 132 at 4500); 7 fire(s), 46 cells burnt |
| 40000 | `extra/fire-extreme-1/frame-040000.png` | zebra 0, rhino 0, leopard 0; grass 760, bush 334, tree 97; food cells 501, browse 1167; mouths/zebra 0.00; soil water 0.47 | - |

#### extra/fire-extreme-2

- **zebra: suicide candidate (3 of 4).** 32 -> peak 144 at tick 7100; extinct at tick 27900; mouths per animal rose by 1.00; food plants 522 at the peak -> 1129 at extinction; main cause of death after the peak: age (911).
- **rhino: boom then collapse, no trait (unresolved).** 12 -> peak 59 at tick 2400; extinct at tick 8900; food plants 494 at the peak -> 591 at extinction; main cause of death after the peak: age (143).
- **leopard: boom-bust: cohort aged out.** 16 -> peak 27 at tick 900; extinct at tick 3300; food plants 498 at the peak -> 520 at extinction; main cause of death after the peak: age (19).

| tick | screenshot | state | events since previous frame |
|---|---|---|---|
| 0 | `extra/fire-extreme-2/frame-000000.png` | zebra 32, rhino 12, leopard 16; grass 140, bush 45, tree 14; food cells 0; mouths/zebra 1.00; zebras with killer 100%; striped 100%; eyes/zebra 2.00; horned rhinos 100%; leopards with cache 100%; soil water 0.62 | - |
| 1900 | `extra/fire-extreme-2/event-001900-leopard-collapse.png` | zebra 41, rhino 53, leopard 2; grass 454, bush 66, tree 20; food cells 1304, browse 459; mouths/zebra 1.20; zebras with killer 100%; rhinos with killer 4%; striped 100%; eyes/zebra 2.00; horned rhinos 100%; leopards with cache 100%; soil water 0.45. Change since last frame: zebra +9 (+28%), rhino +41 (+342%), leopard -14 (-88%), grass +314 (+224%), bush +21 (+47%), tree +6 (+43%) | leopard collapse at 1900 (peak 27 at 900); 8 fire(s), 81 cells burnt |
| 3300 | `extra/fire-extreme-2/event-003300-leopard-extinct.png` | zebra 86, rhino 44, leopard 0; grass 468, bush 52, tree 25; food cells 988, browse 292; mouths/zebra 1.15; zebras with killer 87%; rhinos with killer 5%; striped 100%; eyes/zebra 2.00; horned rhinos 100%; soil water 0.44. Change since last frame: zebra +45 (+110%), tree +5 (+25%) | leopard extinct at 3300 (peak 27 at 900); 7 fire(s), 100 cells burnt |
| 5000 | `extra/fire-extreme-2/frame-005000.png` | zebra 116, rhino 26, leopard 0; grass 497, bush 22, tree 45; food cells 987, browse 282; mouths/zebra 1.25; zebras with killer 89%; striped 100%; eyes/zebra 1.99; horned rhinos 100%; soil water 0.44. Change since last frame: zebra +30 (+35%), rhino -18 (-41%), bush -30 (-58%), tree +20 (+80%) | 6 fire(s), 87 cells burnt |
| 7900 | `extra/fire-extreme-2/event-007900-rhino-collapse.png` | zebra 120, rhino 2, leopard 0; grass 523, bush 23, tree 69; food cells 1026, browse 501; mouths/zebra 1.43; zebras with killer 94%; striped 100%; eyes/zebra 1.94; horned rhinos 100%; soil water 0.47. Change since last frame: rhino -24 (-92%), tree +24 (+53%) | rhino collapse at 7900 (peak 59 at 2400); 7 fire(s), 131 cells burnt |
| 8900 | `extra/fire-extreme-2/event-008900-rhino-extinct.png` | zebra 123, rhino 0, leopard 0; grass 576, bush 15, tree 71; food cells 1314, browse 561; mouths/zebra 1.45; zebras with killer 94%; striped 100%; eyes/zebra 1.89; soil water 0.47. Change since last frame: bush -8 (-35%) | rhino extinct at 8900 (peak 59 at 2400); 1 fire(s), 2 cells burnt |
| 10000 | `extra/fire-extreme-2/frame-010000.png` | zebra 135, rhino 0, leopard 0; grass 603, bush 10, tree 77; food cells 1153, browse 477; mouths/zebra 1.60; zebras with killer 87%; striped 100%; eyes/zebra 1.71; soil water 0.47. Change since last frame: bush -5 (-33%) | 3 fire(s), 18 cells burnt |
| 13300 | `extra/fire-extreme-2/event-013300-bush-collapse.png` | zebra 48, rhino 0, leopard 0; grass 940, bush 2, tree 86; food cells 551, browse 290; mouths/zebra 1.92; zebras with killer 94%; striped 100%; eyes/zebra 1.94; soil water 0.46. Change since last frame: zebra -87 (-64%), grass +337 (+56%), bush -8 (-80%) | bush collapse at 13300 (peak 136 at 600); 12 fire(s), 66 cells burnt |
| 13900 | `extra/fire-extreme-2/event-013900-bush-extinct.png` | zebra 33, rhino 0, leopard 0; grass 1002, bush 0, tree 84; food cells 586, browse 348; mouths/zebra 1.94; zebras with killer 97%; striped 100%; eyes/zebra 1.94; soil water 0.46. Change since last frame: zebra -15 (-31%) | bush extinct at 13900 (peak 136 at 600); 2 fire(s), 2 cells burnt |
| 20000 | `extra/fire-extreme-2/frame-020000.png` | zebra 23, rhino 0, leopard 0; grass 1066, bush 0, tree 89; food cells 814, browse 523; mouths/zebra 2.00; zebras with killer 100%; striped 100%; eyes/zebra 2.00; soil water 0.46. Change since last frame: zebra -10 (-30%) | 23 fire(s), 175 cells burnt |
| 27800 | `extra/fire-extreme-2/event-027800-zebra-collapse.png` | zebra 1, rhino 0, leopard 0; grass 1138, bush 0, tree 82; food cells 695, browse 430; mouths/zebra 2.00; zebras with killer 100%; striped 100%; eyes/zebra 2.00; soil water 0.45. Change since last frame: zebra -22 (-96%) | zebra collapse at 27800 (peak 144 at 7100); 20 fire(s), 163 cells burnt |
| 27900 | `extra/fire-extreme-2/event-027900-zebra-extinct.png` | zebra 0, rhino 0, leopard 0; grass 1129, bush 0, tree 82; food cells 710, browse 407; mouths/zebra 0.00; soil water 0.46 | zebra extinct at 27900 (peak 144 at 7100) |
| 40000 | `extra/fire-extreme-2/frame-040000.png` | zebra 0, rhino 0, leopard 0; grass 1241, bush 0, tree 44; food cells 479, browse 582; mouths/zebra 0.00; soil water 0.45. Change since last frame: tree -38 (-46%) | 40 fire(s), 292 cells burnt |

#### extra/fire-extreme-3

- **zebra: persisted.** 34 -> peak 65 at tick 38200; 50 alive at the end; mouths per animal rose by 1.00.
- **rhino: suicide candidate (3 of 4).** 12 -> peak 87 at tick 7600; extinct at tick 39400; mouths per animal rose by 1.00; food plants 554 at the peak -> 1122 at extinction; main cause of death after the peak: age (990).
- **leopard: boom-bust: cohort aged out.** 16 -> peak 33 at tick 900; extinct at tick 10900; food plants 459 at the peak -> 533 at extinction; main cause of death after the peak: age (63).

| tick | screenshot | state | events since previous frame |
|---|---|---|---|
| 0 | `extra/fire-extreme-3/frame-000000.png` | zebra 34, rhino 12, leopard 16; grass 140, bush 45, tree 14; food cells 0; mouths/zebra 1.00; zebras with killer 100%; striped 100%; eyes/zebra 2.00; horned rhinos 100%; leopards with cache 100%; soil water 0.63 | - |
| 5000 | `extra/fire-extreme-3/frame-005000.png` | zebra 28, rhino 51, leopard 7; grass 485, bush 38, tree 46; food cells 1400, browse 467; mouths/zebra 1.00; zebras with killer 100%; striped 100%; eyes/zebra 2.00; horned rhinos 100%; leopards with cache 100%; soil water 0.45. Change since last frame: rhino +39 (+325%), leopard -9 (-56%), grass +345 (+246%), tree +32 (+229%) | 26 fire(s), 343 cells burnt |
| 7000 | `extra/fire-extreme-3/event-007000-leopard-collapse.png` | zebra 39, rhino 78, leopard 2; grass 533, bush 23, tree 55; food cells 1074, browse 372; mouths/zebra 1.00; zebras with killer 100%; striped 100%; eyes/zebra 2.00; horned rhinos 100%; leopards with cache 100%; soil water 0.45. Change since last frame: zebra +11 (+39%), rhino +27 (+53%), leopard -5 (-71%), bush -15 (-39%) | leopard collapse at 7000 (peak 33 at 900); 9 fire(s), 118 cells burnt |
| 10000 | `extra/fire-extreme-3/frame-010000.png` | zebra 29, rhino 66, leopard 2; grass 479, bush 21, tree 61; food cells 1190, browse 456; mouths/zebra 1.00; zebras with killer 100%; striped 100%; eyes/zebra 2.10; horned rhinos 100%; leopards with cache 100%; soil water 0.45. Change since last frame: zebra -10 (-26%) | 10 fire(s), 76 cells burnt |
| 10900 | `extra/fire-extreme-3/event-010900-leopard-extinct.png` | zebra 28, rhino 75, leopard 0; grass 515, bush 18, tree 67; food cells 1139, browse 510; mouths/zebra 1.00; zebras with killer 100%; striped 100%; eyes/zebra 2.00; horned rhinos 99%; soil water 0.46 | leopard extinct at 10900 (peak 33 at 900); 4 fire(s), 41 cells burnt |
| 16300 | `extra/fire-extreme-3/event-016300-bush-collapse.png` | zebra 28, rhino 58, leopard 0; grass 644, bush 2, tree 88; food cells 1759, browse 989; mouths/zebra 1.00; zebras with killer 82%; striped 100%; eyes/zebra 2.00; horned rhinos 100%; soil water 0.49. Change since last frame: grass +129 (+25%), bush -16 (-89%), tree +21 (+31%) | bush collapse at 16300 (peak 130 at 600); 25 fire(s), 410 cells burnt |
| 18500 | `extra/fire-extreme-3/event-018500-bush-extinct.png` | zebra 11, rhino 66, leopard 0; grass 610, bush 0, tree 87; food cells 1768, browse 1083; mouths/zebra 1.00; zebras with killer 64%; striped 100%; eyes/zebra 2.00; horned rhinos 92%; soil water 0.51. Change since last frame: zebra -17 (-61%) | bush extinct at 18500 (peak 130 at 600); 7 fire(s), 129 cells burnt |
| 20000 | `extra/fire-extreme-3/frame-020000.png` | zebra 9, rhino 58, leopard 0; grass 714, bush 0, tree 89; food cells 2075, browse 1056; mouths/zebra 1.00; zebras with killer 33%; striped 100%; eyes/zebra 2.00; horned rhinos 76%; soil water 0.51 | 6 fire(s), 30 cells burnt |
| 37900 | `extra/fire-extreme-3/event-037900-rhino-collapse.png` | zebra 60, rhino 2, leopard 0; grass 1191, bush 0, tree 71; food cells 451, browse 1540; mouths/zebra 1.87; zebras with killer 2%; striped 100%; eyes/zebra 0.98; soil water 0.49. Change since last frame: zebra +51 (+567%), rhino -56 (-97%), grass +477 (+67%) | rhino collapse at 37900 (peak 87 at 7600); 64 fire(s), 497 cells burnt |
| 39400 | `extra/fire-extreme-3/event-039400-rhino-extinct.png` | zebra 43, rhino 0, leopard 0; grass 1122, bush 0, tree 77; food cells 481, browse 1644; mouths/zebra 1.93; striped 93%; eyes/zebra 0.98; soil water 0.50. Change since last frame: zebra -17 (-28%) | rhino extinct at 39400 (peak 87 at 7600); 3 fire(s), 7 cells burnt |
| 40000 | `extra/fire-extreme-3/frame-040000.png` | zebra 50, rhino 0, leopard 0; grass 1184, bush 0, tree 73; food cells 498, browse 1660; mouths/zebra 2.00; striped 80%; eyes/zebra 1.00; soil water 0.50 | 2 fire(s), 3 cells burnt |
