// The experiment matrix run by the harness (Savanna.queue(JOBS)).
const MAIN_FRAMES = [0, 1000, 2500, 5000, 10000, 20000, 40000, 60000, 80000, 100000];
const SHORT_FRAMES = [0, 2500, 10000, 20000, 40000];
const JOBS = [];
// 1. Base engine (original rules and cells only), 3 seeds x 40k
for (const v of ['base-default', 'base-plantkill', 'base-plantkill-control', 'base-clog', 'base-harsh', 'base-nomut'])
    for (const s of [1, 2, 3]) JOBS.push({variant: v, seed: s, total: 40000, frames: SHORT_FRAMES, eventFrames: true, dir: `base/${v}-${s}`});
// 2. Modified engine, full design, 5 seeds x 100k
for (const s of [1, 2, 3, 4, 5]) JOBS.push({variant: 'full', seed: s, total: 100000, frames: MAIN_FRAMES, eventFrames: true, dir: `main/full-${s}`});
// 3. Ablations, 3 seeds x 40k
for (const v of ['nostripe', 'nohorn', 'nocache', 'nowater', 'nograze', 'noleopard', 'mouthcap', 'noriver', 'notrees', 'nofire'])
    for (const s of [1, 2, 3]) JOBS.push({variant: v, seed: s, total: 40000, frames: SHORT_FRAMES, eventFrames: true, dir: `ablation/${v}-${s}`});
// 4. Food and tuning sweeps on the full design, 3 seeds x 40k
const SWEEPS = {
    'food-low': {foodProdProb: 3}, 'food-high': {foodProdProb: 8},
    'rain-low': {rainRate: 0.001}, 'rain-high': {rainRate: 0.004},
    'drought-seasons': {rainSeasonPeriod: 4000, rainSeasonAmplitude: 0.9},
    'graze-high': {grazeProb: 0.05}, 'browse-good': {browseNutrition: 0.7},
    'bite-weak': {killerDamage: 2}, 'camo-weak': {stripeCamoMax: 0.3},
    'hunger-harsh': {starvationTolerance: 6}, 'mutation-low': {useGlobalMutability: true, globalMutability: 1},
    'mutation-high': {useGlobalMutability: true, globalMutability: 10},
};
for (const name in SWEEPS)
    for (const s of [1, 2, 3]) JOBS.push({variant: 'full', seed: s, total: 40000, frames: [0, 20000, 40000], eventFrames: false, overrides: SWEEPS[name], dir: `sweep/${name}-${s}`});
JOBS;
