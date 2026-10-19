# Life Engine: Savanna Modifications

This repository ([Tjeludo/LifeEngine](https://github.com/Tjeludo/LifeEngine)) is a modified fork of
[MaxRobinsonTheGreat/LifeEngine](https://github.com/MaxRobinsonTheGreat/LifeEngine), made for
CSC4044Z Artificial Life (2026). This file lists every change we made to the original code. For how
the original engine works, see `README.md`, which is still the upstream readme.

The fork starts from upstream commit `cacd6ce` ("Merge pull request #169", *improved zooming*).
Everything after that commit is ours.

## Where the changes live

| Branch / folder | Contents |
|---|---|
| `master` | Assignment 2: the rhino–leopard savanna world, a producer reproduction fix, observation reports |
| `assignment-2` working copy and `final/` | Assignment 3: the **Horn cell** (Vimbai), with the `savanna-horn-rhino` world |
| `savanna-evolutionary-suicide` | Final project: savanna ecology (soil water, river, trees, fire, diets, hunger), the **Horn**, **Stripe** and **Cache** cells, the `EcoStats` logger, the experiment harness, and the report and slides |

**Every new setting defaults to the original engine's behaviour.** With default hyperparameters and
only the original cell types, the modified engine runs the same rules as upstream. The `base-*`
experiment worlds depend on this.

---

## 1. Assignment 2 (`master`)

### Engine changes

| File | Change | Effect |
|---|---|---|
| `src/Organism/Cell/BodyCells/ProducerCell.js` | `this.org.food_collected++` each time a producer drops food | Plants earn reproduction energy by producing, so grass and bushes spread without needing a mouth |
| `src/Organism/Organism.js` | Producers ignore `foodBlocksReproduction` when placing offspring | Plants surrounded by their own food can still reproduce |
| `src/WorldConfig.js` | `auto_reset: false`, `auto_pause: true` | When everything dies, the simulation pauses instead of resetting, so you can see the final state |

### Content

- `dist/assets/worlds/assignment2_rhino_leopard.json`: the **Rhino–Leopard Savanna** world (rhino herbivore, leopard predator, grass and bush producers). It is first in the world list.
- The worlds list (`dist/assets/worlds/_list.json`) now includes *Survival of the Fittest*, *Computer Zoo*, *Bob Breeder* and *Huggers*. Their files were added to `dist/assets/worlds/`, along with organisms `Ball`, `Bob`, `TropicalFish` and `dna_plant` in `dist/assets/organisms/`.
- `assignment 2/`: the world files, `Zebra.json`, species images, `ecosystem-roles.svg`, `organism-gallery.html` (also copied to `dist/`), `observations.md` and `project-brief-compliance.md`.
- `Ass 2 MTSVIM006/` and `Ass 2 Mwyash001/`: each member's weekly observation report, staged screenshots and population graphs.

---

## 2. Assignment 3: Horn cell (`assignment-2` working copy, `final/`)

`final/CHANGES.md` describes this version in full. In short:

- **New `horn` cell** (`HornCell.js`, colour `#C9C3B5`). Killer cells cannot harm it, as with armour, and it may gore the attacker (`hornGoreProb`, default 50%).
- **Pushing through.** A horned mover that is blocked clears food and damages plants in its way, then tries the move again. Walls and animals still block it (`hornCanPush`, default on).
- **Trampling.** After each move, every horn cell may damage each adjacent plant (`tramplingProb`, default 25%).
- The horn is part of the mutation pool. It can be placed in the editor, eyes can see it, and its three settings are in the control panel and saved with the world.
- New worlds: `savanna-horn-rhino.json` (the test world) and `savanna-with-zebra.json` (the control world, without a horn). Both are in `assignment 3/` and the world list.

Files touched: `HornCell.js` (new), `CellStates.js`, `BodyCellFactory.js`, `KillerCell.js`,
`Organism.js`, `Anatomy.js`, `Brain.js`, `Hyperparameters.js`, `ControlPanel.js`,
`EditorController.js`, `ColorScheme.js`, `dist/index.html`.

---

## 3. Final project: evolutionary suicide (`savanna-evolutionary-suicide`)

The research question is whether evolution in a savanna food web can drive a lineage to extinction
(evolutionary suicide). The group assigned one new cell to each member. The soil-water system is a
shared feature.

| Member | Feature |
|---|---|
| Vimbai | Horn cell (rhino) |
| Moreblessing | Stripe cell (zebra) |
| Ashley | Cache cell (leopard) |
| Group | Soil water and fertility |

### 3.1 New cell types

| Cell | Kind | Behaviour | File |
|---|---|---|---|
| `horn` | body | Killer cells cannot harm it. Gores adjacent killer cells (`hornGoreProb`). Tramples adjacent grass and bush cells and crushes loose food and browse (`trampleProb`). Horned organisms can move through food and browse. | `HornCell.js` |
| `stripe` | body | No active function. When a carnivore's eye looks at a striped organism, it may miss it. The chance grows with the number of other striped organisms within `stripeHerdRadius` (`stripeCamoPerNeighbor`, capped at `stripeCamoMax`). | `StripeCell.js` |
| `cache` | body | Stores surplus energy. When an organism holds at least `cacheSurplusFraction × foodNeeded`, each cache cell may bank 1 unit (`cacheDepositProb`), up to `cacheCapacity` per cell. Hunger draws on the store before it causes starvation. If `cacheNeedsTree` is on, the cache only fills near trees. | `CacheCell.js` |
| `woody` | producer | Bush producer. Produces **browse** instead of food and uses less soil water (`woodyWaterUse`). | `WoodyCell.js` |
| `tree` | producer | Slow, thirsty producer (`treeProdFactor`, `treeWaterUse`). Gives cover (`treeCoverProb`), is a cache site, resists fire (`treeFireResist`) and lives longer (`treeLifespanFactor`). | `TreeCell.js` |
| `browse` | grid | Food dropped by bushes and trees, with its own nutrition value (`browseNutrition`) | `CellStates.js` |
| `meat` | grid | A carcass left by a dead mover when `carcassMeat` is on. It rots back into the soil (`meatDecayProb`). | `CellStates.js` |
| `water` | terrain | River. Blocks movement unless an organism has at least `riverCrossCells` cells. It comes back when an organism or food leaves the cell. | `CellStates.js`, `GridMap.js` |

`horn`, `stripe`, `cache`, `woody` and `tree` are in the mutation pool. `disabledCells` removes cell
types from the mutation pool for ablation runs.

### 3.2 Environment (`src/Environments/WorldEnvironment.js`)

- **Soil fertility and water.** Each grid cell has a `capacity` (fertility) set from a Perlin noise field (new `Utils/Perlin`) and a `water` level. Rain refills water towards capacity (`rainRate`). Optional wet and dry seasons follow a sine wave (`rainSeasonPeriod`, `rainSeasonAmplitude`). When the system is on, empty ground is shaded from dry brown to wet dark.
- **Water-limited production.** With `waterEnabled`, a producer only succeeds with probability equal to the soil water, and producing uses up water (`grassWaterUse`, `woodyWaterUse`, `treeWaterUse`).
- **Riverbank.** Soil within `riparianWidth` cells of water is more fertile and refills `riparianRefill` times faster.
- **Fire.** Fire starts at random (`fireProb`, more often in the dry season) and spreads through connected, dry vegetation (`fireSpread`, at most `fireMaxCells` cells). Wet soil, bare ground and the river stop it.
- **Decay.** Meat rots and slightly increases soil fertility where it lay.
- Saved worlds now store browse, meat and river cells (`GridMap.js`).

### 3.3 Organism rules

- **Diet (`Anatomy.isCarnivore`).** An organism is a carnivore if it has *jaws*, meaning a killer cell orthogonally next to a mouth. Carnivores digest meat. Everything else digests grass food and browse. Nutrition per item is set by `grassNutrition`, `browseNutrition`, `meatNutrition`, `carnivorePlantNutrition` and `herbivoreMeatNutrition` (`MouthCell.js`).
- **Grazing.** A herbivore's mouth may bite a neighbouring grass plant directly (`grazeProb`).
- **Weapons and kills (`KillerCell.js`).**
  - Damage per hit is `killerDamage`.
  - A killer cell that is not part of jaws (e.g. a zebra's kick) is a *weapon*. It can deal different damage (`weaponDamage`) and can be limited to hitting predators only (`weaponsOnlyHitPredators`).
  - `killersHarmPlants` controls whether killers damage plants. `noFriendlyFire` stops killers harming their own lineage.
  - `killFeedFraction` lets a predator eat part of its kill straight away.
- **Hunger (`Organism.metabolise`).** Every `metabolismInterval` ticks, a mover pays `metabolismCost` from food in hand, or from its cache. Each payment it misses adds hunger, and after `starvationTolerance` misses in a row it dies.
- **Sprinting.** With `moversAddSpeed`, extra mover cells give extra steps per tick (up to `maxSpeed`), but only while chasing or fleeing another organism. `Brain.reacting_to_organism` tracks this. The original engine has no such rule, so this is our own addition.
- **Armour costs.** Armour can cost extra food to reproduce (`armorFoodCost`) and give extra health (`armorHealth`).
- **Lineages.** Each organism carries the name of the species it descends from. Offspring inherit it. `lineageCellCaps` limits a lineage's cell counts, e.g. `{zebra: {mouth: 1}}` for the mouth-cap control.
- Every harm now records its cause (`attack`, `gored`, `trampled`, `grazed`, `fire`, starvation) so deaths can be explained afterwards.

### 3.4 Logging (`src/Stats/EcoStats.js`, new)

`EcoStats` only observes and does not change the simulation. Every 100 ticks it records population
per lineage, producer and food counts, average soil water, trait frequencies, births, deaths by cause,
kills, cache withdrawals and fires. It also flags **collapse** and **extinction** events. `src/index.js`
exposes `window.lifeEngine` and `window.lifeEngineConfig` so the harness and the browser console can
reach the engine.

### 3.5 User interface (`dist/index.html`, `EditorController.js`, `ColorScheme.js`)

- New cells appear in the cell legend, the editor palette (woody, horn, stripe, cache) and the brain's observation list, with their own colours.
- New world in the list: `savanna-full-1`.

### 3.6 Experiment tooling (`savanna-experiments/`, new)

| File | Purpose |
|---|---|
| `make-world.js` | Builds reproducible, seeded 160×100 savanna worlds: `node make-world.js <variant> [seed]` |
| `server.py` | Local server for `dist/`. It also saves the harness's CSV, JSON and PNG output to `output/` |
| `harness.js` | Runs inside the page. Steps the engine as fast as possible, logs with `EcoStats`, saves frames, and stops when everything is extinct |
| `jobs.js`, `jobs-followup.js` | The run list (115 runs in total) |
| `analyze.py`, `summarize.py`, `make_figures.py`, `obs_log.py`, `progress.py` | Analysis, summary tables, figures and the observation log |
| `worlds/` | Seeded worlds for every variant |
| `output/` | Results: `base/`, `main/`, `ablation/`, `sweep/`, `extra/`, figures and `summary.*` |

**Variants**

- **Base engine.** These use original rules and cells only: `base-default`, `base-plantkill`, `base-plantkill-control`, `base-clog`, `base-harsh`, `base-nomut`. 3 seeds × 40k ticks.
- **Full design.** `full`, 5 seeds × 100k ticks.
- **Ablations.** Each turns off one feature: `nostripe`, `nohorn`, `nocache`, `nowater`, `nograze`, `noleopard`, `mouthcap`, `noriver`, `notrees`, `nofire`. 3 seeds × 40k ticks.
- **Sweeps** on the full design. These change food production, rain, drought seasons, grazing, browse quality, bite strength, camouflage strength, hunger and mutation rate.
- **Follow-up runs.** 200k ticks, drier conditions, 32 or 48 leopards, and stronger fire.

### 3.7 Other additions

- `presentation/`: the written report (PDF and Word), the slide deck and `build-deck.js`.
- `AI-DECLARATION.md`: what the AI assistant did and what the group did.

---

## Settings reference (final project)

All of these are in `src/Hyperparameters.js` and are saved with the world.

| Group | Settings (default) |
|---|---|
| Diet | `grassNutrition` 1, `browseNutrition` 1, `meatNutrition` 1, `carnivorePlantNutrition` 1, `herbivoreMeatNutrition` 1, `carcassMeat` false, `meatDecayProb` 0, `grazeProb` 0 |
| Combat | `killerDamage` 1, `weaponDamage` −1 (same as killer), `weaponsOnlyHitPredators` false, `killFeedFraction` 0, `killersHarmPlants` true, `noFriendlyFire` false, `armorFoodCost` 0, `armorHealth` 0 |
| Hunger | `metabolismInterval` 0 (off), `metabolismCost` 1, `starvationTolerance` 4 |
| Soil | `waterEnabled` false, `rainRate` 0.004, `rainSeasonPeriod` 0, `rainSeasonAmplitude` 0, `grassWaterUse` 0.3, `woodyWaterUse` 0.15, `soilUpdateInterval` 10 |
| Horn | `hornGoreProb` 0.5, `trampleProb` 0.05 |
| Stripe | `stripeCamoPerNeighbor` 0.25, `stripeCamoMax` 0.85, `stripeHerdRadius` 4 |
| Cache | `cacheCapacity` 3, `cacheDepositProb` 0.1, `cacheSurplusFraction` 0.5, `cacheNeedsTree` false, `cacheTreeRadius` 5 |
| Movement | `moversAddSpeed` false, `maxSpeed` 3, `riverCrossCells` 0 |
| River / trees / fire | `riparianWidth` 6, `riparianRefill` 3, `treeProdFactor` 0.3, `treeWaterUse` 0.4, `treeCoverProb` 0, `treeLifespanFactor` 1, `fireProb` 0, `fireSpread` 0.45, `treeFireResist` 0.3, `fireMaxCells` 1500 |
| Experiments | `lineageCellCaps` {}, `disabledCells` [] |

---

## How to run

```
npm install
npm run build
python -m http.server --directory dist     # then open http://localhost:8000
```

To reproduce the experiments (on the `savanna-evolutionary-suicide` branch):

```
cd savanna-experiments
node make-world.js full 1                 # or any variant / seed
python server.py                          # serves dist/ and saves results
```

Open the page, load `harness.js` from the browser console as described at the top of the file, then
run `Savanna.queue(JOBS)`. Results are saved to `savanna-experiments/output/`. Then run `analyze.py`
and `make_figures.py` to rebuild the tables and figures.

## License

Same as the original project. See `LICENSE`.
