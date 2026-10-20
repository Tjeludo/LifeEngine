// Follow-up runs: longer and drier runs for the overgrazing hypothesis, denser leopard populations,
// and stronger fire. Run with Savanna.queue(FOLLOWUP) (split across tabs as needed).
const LONG_FRAMES = [0, 10000, 25000, 50000, 100000, 150000, 200000];
const FRAMES = [0, 5000, 10000, 20000, 40000, 60000];
const FOLLOWUP = [];
const FIRE_STRONG = {fireProb: 0.002, fireSpread: 1.0, fireMaxCells: 4000};
const FIRE_EXTREME = {fireProb: 0.004, fireSpread: 1.0, fireMaxCells: 8000, treeFireResist: 0.6};
for (const s of [1, 2, 3]) {
    FOLLOWUP.push({variant: 'full', seed: s, total: 200000, frames: LONG_FRAMES, eventFrames: true, dir: `extra/long-default-${s}`});
    FOLLOWUP.push({variant: 'full', seed: s, total: 200000, frames: LONG_FRAMES, eventFrames: true, overrides: {rainRate: 0.0008}, dir: `extra/long-dry-${s}`});
    FOLLOWUP.push({variant: 'leopards32', seed: s, total: 60000, frames: FRAMES, eventFrames: true, dir: `extra/leopards32-${s}`});
    FOLLOWUP.push({variant: 'leopards48', seed: s, total: 60000, frames: FRAMES, eventFrames: true, dir: `extra/leopards48-${s}`});
    FOLLOWUP.push({variant: 'full', seed: s, total: 40000, frames: FRAMES, eventFrames: true, overrides: FIRE_STRONG, dir: `extra/fire-strong-${s}`});
    FOLLOWUP.push({variant: 'full', seed: s, total: 40000, frames: FRAMES, eventFrames: true, overrides: FIRE_EXTREME, dir: `extra/fire-extreme-${s}`});
}
FOLLOWUP;
