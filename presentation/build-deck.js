// Builds the final presentation: node deck.js
const pptxgen = require('pptxgenjs');
const fs = require('fs');
const path = require('path');
const SKILL = 'C:/Users/Ashley/AppData/Local/Packages/Claude_pzs8sxrjxfjjc/LocalCache/Roaming/Claude/local-agent-mode-sessions/skills-plugin/d2e10a28-177a-463d-a31e-9e912fe4a4ba/a154f6f0-861f-4e47-be48-4249f5829341/skills/pptx';
const { applyTheme } = require(SKILL + '/scripts/apply_theme.js');

const ROOT = 'C:/Users/Ashley/Documents/LifeEngine';
const OUT = ROOT + '/savanna-experiments/output';
const FIG = OUT + '/figures';
const DATA = JSON.parse(fs.readFileSync(OUT + '/deck-data.json', 'utf8'));
const DEST = ROOT + '/presentation/Evolutionary-Suicide-LifeEngine.pptx';
fs.mkdirSync(path.dirname(DEST), {recursive: true});

const THEME = {
    name: 'Savanna Dusk', headFontFace: 'Cambria', bodyFontFace: 'Calibri',
    colors: {
        dk1: '1F1A14', lt1: 'FFFFFF', dk2: '3B2F22', lt2: 'F1F3F2',
        accent1: 'D98E04', accent2: '4E7D32', accent3: '2F6FA8', accent4: 'B23A3A', accent5: '7A5C3E', accent6: '6B7280',
        hlink: '2F6FA8', folHlink: '7A5C3E',
    },
};
const HEX = THEME.colors;

const pres = new pptxgen();
pres.layout = 'LAYOUT_WIDE'; // 13.33 x 7.5
pres.theme = {headFontFace: THEME.headFontFace, bodyFontFace: THEME.bodyFontFace};
pres.title = 'Reproducing Evolutionary Suicide in a Digital Savanna';
pres.author = 'CSC4044Z group';
const C = pres.SchemeColor;

// ---------- layouts ----------
pres.defineSlideMaster({
    title: 'TITLE_DARK', background: {color: HEX.dk1},
    objects: [
        {placeholder: {options: {name: 'title', type: 'title', x: 0.7, y: 1.2, w: 11.9, h: 1.7, fontSize: 44, bold: true, color: C.background1, valign: 'top', align: 'left'}, text: 'Title'}},
        {placeholder: {options: {name: 'body', type: 'body', x: 0.7, y: 3.0, w: 11.9, h: 1.0, fontSize: 20, color: C.accent1}, text: 'Subtitle'}},
    ],
});
pres.defineSlideMaster({
    title: 'SECTION_DARK', background: {color: HEX.dk2},
    objects: [
        {placeholder: {options: {name: 'title', type: 'title', x: 0.7, y: 2.5, w: 11.9, h: 1.3, fontSize: 40, bold: true, color: C.background1, align: 'left'}, text: 'Section'}},
        {placeholder: {options: {name: 'body', type: 'body', x: 0.7, y: 3.9, w: 11.9, h: 1.2, fontSize: 20, color: C.accent1}, text: 'Subtitle'}},
    ],
});
pres.defineSlideMaster({
    title: 'CONTENT', background: {color: HEX.lt1},
    objects: [
        {placeholder: {options: {name: 'title', type: 'title', x: 0.6, y: 0.35, w: 12.1, h: 0.85, fontSize: 30, bold: true, color: C.text1, valign: 'top', align: 'left'}, text: 'Title'}},
        {text: {text: 'CSC4044Z Artificial Life 2026  ·  Reproducing evolutionary suicide', options: {x: 0.6, y: 7.0, w: 8, h: 0.3, fontSize: 10, color: '8A8A8A'}}},
    ],
    slideNumber: {x: 12.4, y: 7.0, w: 0.6, h: 0.3, fontSize: 10, color: '8A8A8A'},
});

let section = null;
function slide(master, sec) {
    if (sec && sec !== section) { pres.addSection({title: sec}); section = sec; }
    return pres.addSlide({masterName: master, sectionTitle: section});
}
const text = (s, t, o) => s.addText(t, Object.assign({isTextBox: true, fontSize: 15, color: HEX.dk1, valign: 'top', margin: 0}, o));
function card(s, x, y, w, h, fill = HEX.lt2) {
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, {x, y, w, h, fill: {color: fill}, line: {color: fill}, rectRadius: 0.12});
}
function badge(s, x, y, label, fill = HEX.accent1, size = 0.5) {
    s.addShape(pres.shapes.OVAL, {x, y, w: size, h: size, fill: {color: fill}, line: {color: fill}});
    text(s, label, {x, y, w: size, h: size, align: 'center', valign: 'middle', bold: true, color: 'FFFFFF', fontSize: 16});
}
function stat(s, x, y, w, big, small, color = HEX.accent1) {
    text(s, big, {x, y, w, h: 0.8, fontSize: 40, bold: true, color, fontFace: 'Cambria'});
    text(s, small, {x, y: y + 0.8, w, h: 0.6, fontSize: 13, color: '444444'});
}
function img(s, file, x, y, w, ratio) { s.addImage({path: file, x, y, w, h: w / ratio}); }
const axis = {catAxisLabelColor: '555555', valAxisLabelColor: '555555', catAxisLabelFontFace: '+mn-lt', valAxisLabelFontFace: '+mn-lt',
    catAxisLabelFontSize: 11, valAxisLabelFontSize: 11, valGridLine: {color: 'E3E3E3', size: 0.5}, catGridLine: {style: 'none'},
    legendFontFace: '+mn-lt', legendFontSize: 11, titleFontFace: '+mn-lt', titleFontSize: 13, titleColor: '333333'};

// 1. Title
let s = slide('TITLE_DARK', 'Introduction');
s.addText('Reproducing Evolutionary Suicide in a Digital Savanna', {placeholder: 'title'});
s.addText('Zebras, rhinos, leopards, grass and bushes in the Life Engine  ·  115 runs, base vs modified engine', {placeholder: 'body'});
img(s, FIG + '/species-modified.png', 0.7, 4.3, 10.0, 1732 / 450);
s.addNotes('We seeded a savanna in the Life Engine and asked whether a species can adapt its way into extinction. We ran the unmodified engine and our modified savanna: 115 runs in total, including 18 follow-ups.');

// 2. Question and evidence rule
s = slide('CONTENT', 'Introduction');
s.addText('Suicide needs four things to happen in order', {placeholder: 'title'});
text(s, 'Evolutionary suicide: a trait spreads because it helps individuals, and the same trait removes what the population depends on. Failure to adapt: the species lacks the traits it needs and declines without succeeding first.', {x: 0.6, y: 1.35, w: 12.1, h: 0.9, fontSize: 16, color: '333333'});
const crit = [['1', 'It grew', 'Population reached at least 1.5x its start'], ['2', 'A trait spread', 'Mouths per animal +0.4, or killer share +0.3'],
    ['3', 'Its food fell', 'Grass plus bush plants down 25% from the peak'], ['4', 'It killed itself', 'Decline from starvation, ageing or its own killers, not other species']];
crit.forEach((c, i) => {
    const x = 0.6 + i * 3.08;
    card(s, x, 2.55, 2.85, 2.9);
    badge(s, x + 0.25, 2.8, c[0]);
    text(s, c[1], {x: x + 0.25, y: 3.5, w: 2.4, h: 0.5, fontSize: 20, bold: true, fontFace: 'Cambria'});
    text(s, c[2], {x: x + 0.25, y: 4.1, w: 2.4, h: 1.2, fontSize: 14, color: '444444'});
});
text(s, 'All four: evolutionary suicide.  Three, with growth and a trait: suicide candidate.  No growth: failure to adapt.  Mostly killed by another species: predation.', {x: 0.6, y: 5.8, w: 12.1, h: 0.8, fontSize: 15, bold: true, color: HEX.dk2});
s.addNotes('This is the evidence rule we committed to in Assignment 3, now applied automatically by our analysis script to every run.');

// 3. Species
s = slide('CONTENT', 'Introduction');
s.addText('Five species built on real strengths and weaknesses', {placeholder: 'title'});
img(s, FIG + '/species-modified.png', 0.6, 1.3, 12.1, 1732 / 450);
const sp = [['Zebra', HEX.dk1, 'Sprints when chasing or fleeing; herd stripes; rear kick wounds leopards', 'One mouth; bush food worth 0.35; no armour'],
    ['Rhino', HEX.accent5, 'Horn immune to killers and gores attackers; 20 health', 'Slow; 16 food per calf because armour is costly'],
    ['Leopard', HEX.accent1, 'Sprint; bite does 4 damage; eats its kill on the spot; caches surplus near trees', 'Meat only; no armour; kicked and gored by prey']];
sp.forEach((r, i) => {
    const x = 0.6 + i * 4.1;
    card(s, x, 4.65, 3.85, 2.15);
    text(s, r[0], {x: x + 0.25, y: 4.8, w: 3.4, h: 0.45, fontSize: 20, bold: true, color: r[1], fontFace: 'Cambria'});
    text(s, [{text: 'Strength  ', options: {bold: true}}, {text: r[2]}], {x: x + 0.25, y: 5.3, w: 3.4, h: 0.75, fontSize: 13});
    text(s, [{text: 'Weakness  ', options: {bold: true}}, {text: r[3]}], {x: x + 0.25, y: 6.05, w: 3.4, h: 0.7, fontSize: 13});
});
s.addNotes('Grass: 3 producers, spreads fast, needs water. Bush: 5 woody cells, cannot be grazed, poor food. Trees: long-lived cover. Base runs use the same body plans without the new cells.');

// 4. Base engine limits
s = slide('CONTENT', 'Base engine');
s.addText('The base engine leaves only one road to suicide: killers', {placeholder: 'title'});
card(s, 0.6, 1.4, 5.9, 3.9, 'EEF5EA');
text(s, 'What the base engine allows', {x: 0.9, y: 1.6, w: 5.3, h: 0.5, fontSize: 20, bold: true, color: HEX.accent2, fontFace: 'Cambria'});
text(s, [
    {text: 'Killer cells damage plants, and a dead plant becomes food: a windfall that rewards the trait', options: {bullet: true, breakLine: true}},
    {text: 'Each kill removes a producer for good', options: {bullet: true, breakLine: true}},
    {text: 'Plants can choke the world with uneaten food', options: {bullet: true}}], {x: 0.9, y: 2.25, w: 5.3, h: 3.8, fontSize: 16, paraSpaceAfter: 10});
card(s, 6.8, 1.4, 5.9, 3.9, 'F8ECEC');
text(s, 'What it cannot do', {x: 7.1, y: 1.6, w: 5.3, h: 0.5, fontSize: 20, bold: true, color: HEX.accent4, fontFace: 'Cambria'});
text(s, [
    {text: 'Nothing starves: animals only die of age or damage', options: {bullet: true, breakLine: true}},
    {text: 'Grass and bush drop identical food, so there is no worse food to fall back on', options: {bullet: true, breakLine: true}},
    {text: 'Leopards eat plant food, so they never depend on prey', options: {bullet: true, breakLine: true}},
    {text: 'Mouths cannot hurt plants, so overgrazing is impossible', options: {bullet: true}}], {x: 7.1, y: 2.25, w: 5.3, h: 3.8, fontSize: 16, paraSpaceAfter: 10});
text(s, 'So in the base engine, suicide can only run through evolved killer cells that destroy plants.', {x: 0.6, y: 5.65, w: 12.1, h: 0.6, fontSize: 18, bold: true, color: HEX.dk2});
s.addNotes('Base runs: 6 conditions x 3 seeds x 40k ticks, original rules only; mutation could not create our new cell types.');

// 5. Base suicide timeline
s = slide('CONTENT', 'Base engine');
s.addText('Base engine: zebras evolved a plant-killer and ate their world', {placeholder: 'title'});
img(s, FIG + '/timeline-base-suicide.png', 0.6, 1.3, 8.9, 2448 / 1234);
stat(s, 9.9, 1.4, 2.9, '3 of 3', 'seeds met all four criteria in the plant-kill control', HEX.accent4);
stat(s, 9.9, 3.1, 2.9, '560', 'zebras at the peak (seed 2, tick 8,200)', HEX.dk1);
stat(s, 9.9, 4.8, 2.9, '14,881', 'tick when the last zebra died; the last grass went at 11,900', HEX.accent1);
s.addNotes('Zebras started without a killer cell. One evolved, spread, destroyed bushes by tick 6,000 and grass by 11,900; zebras collapsed at 14,100. Seeds 1 and 3 peaked at 307 and 312 and were extinct by about tick 6,000.');

// 6. Base all conditions (native stacked bar)
s = slide('CONTENT', 'Base engine');
s.addText('Only the evolved plant-killer met every criterion', {placeholder: 'title'});
const bl = DATA.base.map(b => b[0]);
s.addChart(pres.charts.BAR, [
    {name: 'Evolutionary suicide', labels: bl, values: DATA.base.map(b => b[1])},
    {name: 'Other extinction', labels: bl, values: DATA.base.map(b => b[2])},
    {name: 'Survived', labels: bl, values: DATA.base.map(b => b[3])}],
    Object.assign({x: 0.6, y: 1.35, w: 7.4, h: 5.3, barDir: 'bar', barGrouping: 'stacked', chartColors: [HEX.accent4, '9CA3AF', HEX.accent2],
        showLegend: true, legendPos: 'b', showTitle: true, title: 'Zebra outcome, 3 seeds per condition', valAxisMaxVal: 3, valAxisMajorUnit: 1,
        showValue: true, dataLabelPosition: 'ctr', dataLabelColor: 'FFFFFF', dataLabelFontSize: 11, dataLabelFontFace: '+mn-lt', dataLabelFormatCode: '0;;;'}, axis));
text(s, [
    {text: 'Seeded killer: ', options: {bold: true}}, {text: 'same collapse, but the trait was given, not evolved, so it fails criterion 2', options: {breakLine: true}},
    {text: ' ', options: {breakLine: true}},
    {text: 'Default and harsh: ', options: {bold: true}}, {text: 'booms then collapses with no trait. Rhinos crowded zebras out; in one harsh seed rhinos evolved killers and met all four criteria', options: {breakLine: true}},
    {text: ' ', options: {breakLine: true}},
    {text: 'No mutation: ', options: {bold: true}}, {text: 'extinct in 3 of 3 seeds: the failure-to-adapt baseline', options: {breakLine: true}},
    {text: ' ', options: {breakLine: true}},
    {text: 'Clogging: ', options: {bold: true}}, {text: 'grass filled the map and blocked births, an engine artefact'}],
    {x: 8.4, y: 1.5, w: 4.3, h: 5.2, fontSize: 14});
s.addNotes('This contrast is the base-engine evidence: an evolved trait plus no regrowth limit gives suicide; everything else is failure to adapt or an artefact.');

// 7. Section
s = slide('SECTION_DARK', 'Modifications');
s.addText('What we changed', {placeholder: 'title'});
s.addText('Each change opens a road to collapse and adds an escape from it. All default to off.', {placeholder: 'body'});

// 8. Member features
s = slide('CONTENT', 'Modifications');
s.addText('Each member feature opens a route and an escape', {placeholder: 'title'});
const feats = [['Horn cell', 'Vimbai', HEX.accent5, 'Horned rhinos trample plants and food around them', 'Immune to killers; gores attackers 50% per tick'],
    ['Stripe cell', 'Moreblessing', HEX.dk1, 'More surviving zebras means more grazing pressure', 'Leopard eyes miss a striped zebra 25% per striped neighbour, up to 85%'],
    ['Cache cell', 'Ashley', HEX.accent1, 'Banking food delays breeding', 'Surplus banked near trees, spent automatically to stave off starvation'],
    ['Soil water', 'Fourth member', HEX.accent3, 'Grass needs water to produce; dry soil recovers slowly', 'Rain refills soil; deep-rooted bushes take over freed water']];
feats.forEach((f, i) => {
    const x = 0.6 + (i % 2) * 6.15, y = 1.4 + Math.floor(i / 2) * 2.75;
    card(s, x, y, 5.95, 2.5);
    text(s, f[0], {x: x + 0.3, y: y + 0.2, w: 3.5, h: 0.5, fontSize: 21, bold: true, color: f[2], fontFace: 'Cambria'});
    text(s, f[1], {x: x + 3.6, y: y + 0.27, w: 2.1, h: 0.4, fontSize: 13, color: '666666', align: 'right'});
    text(s, [{text: 'Route  ', options: {bold: true, color: HEX.accent4}}, {text: f[3]}], {x: x + 0.3, y: y + 0.85, w: 5.4, h: 0.7, fontSize: 15});
    text(s, [{text: 'Escape  ', options: {bold: true, color: HEX.accent2}}, {text: f[4]}], {x: x + 0.3, y: y + 1.55, w: 5.4, h: 0.8, fontSize: 15});
});

// 9. Shared ecology
s = slide('CONTENT', 'Modifications');
s.addText('Shared rules turned the map into a food web', {placeholder: 'title'});
const eco = [['Worse food', 'Bush browse worth 0.35 of grass'], ['Grazing', 'Mouths beside grass bite the plant (2% per tick)'], ['Hunger', 'Pay 1 food every 80 ticks; die after 10 misses'],
    ['Meat and jaws', 'Carcasses become meat; a killer beside a mouth digests only meat'], ['River and trees', 'Only 9-cell animals wade; trees hide animals and host caches'], ['Fire', 'Starts in dry vegetation; grazed ground stops it']];
eco.forEach((e, i) => {
    const x = 0.6 + (i % 3) * 4.1, y = 1.45 + Math.floor(i / 3) * 2.65;
    card(s, x, y, 3.85, 2.4);
    badge(s, x + 0.3, y + 0.3, String(i + 1), [HEX.accent1, HEX.accent2, HEX.accent4, HEX.accent5, HEX.accent3, HEX.dk2][i]);
    text(s, e[0], {x: x + 0.3, y: y + 0.95, w: 3.3, h: 0.45, fontSize: 19, bold: true, fontFace: 'Cambria'});
    text(s, e[1], {x: x + 0.3, y: y + 1.45, w: 3.3, h: 0.85, fontSize: 14, color: '444444'});
});
s.addNotes('Also: sprinting only when chasing or fleeing, armour that costs 2 food and adds 3 health, and weapons (killers away from the mouth) that only strike predators.');

// 10. Main timeline
s = slide('CONTENT', 'Modified engine');
s.addText('Seed 1: predators boom and vanish, zebras adapt', {placeholder: 'title'});
img(s, FIG + '/timeline-main-full-1.png', 1.0, 1.25, 11.3, 2448 / 1234);
s.addNotes('Leopards rose from 16 to 35 by eating the herd, then died out by tick 4,400. Rhinos faded by 12,600. Zebras evolved a second mouth and held at about 200 to 290 to tick 100,000.');

// 11. Five seeds
s = slide('CONTENT', 'Modified engine');
s.addText('Every leopard and rhino population died out', {placeholder: 'title'});
const ticks = DATA.main['1'].tick.map(t => String(t / 1000));
s.addChart(pres.charts.LINE, [1, 2, 3, 4, 5].map(k => ({name: 'Seed ' + k, labels: ticks, values: DATA.main[String(k)].zebra})),
    Object.assign({x: 0.6, y: 1.35, w: 7.6, h: 5.3, showTitle: true, title: 'Zebras per seed (x: thousand ticks)', lineSize: 2, lineDataSymbol: 'none',
        chartColors: [HEX.dk1, HEX.accent1, HEX.accent2, HEX.accent3, HEX.accent4], showLegend: true, legendPos: 'b', catAxisLabelFrequency: 5}, axis));
stat(s, 8.7, 1.4, 4.0, '26 to 35', 'leopard peak, then extinct by tick 3,600 to 12,800', HEX.accent1);
stat(s, 8.7, 3.1, 4.0, '5 of 5', 'rhino populations faded out by tick 17,300', HEX.accent5);
stat(s, 8.7, 4.8, 4.0, '1 of 5', 'zebra lineages alive at 100k: the one that evolved a second mouth', HEX.dk1);

// 12. Three ways to disappear
s = slide('CONTENT', 'Modified engine');
s.addText('Three different ways to disappear', {placeholder: 'title'});
const ways = [['Leopards', 'Boom then bust', HEX.accent1, 'Killed 57 to 144 zebras per run, then aged out or were kicked to death. Zebras never crashed first: a predator that failed to persist, not over-predation.'],
    ['Rhinos', 'Failure to adapt', HEX.accent5, 'Rose to 27 to 80, then died of old age (54 to 358 per run, versus 17 to 66 killed). At 16 food per calf they could not keep up with zebras.'],
    ['Zebras', 'Adapt or fade', HEX.dk1, 'Where a second mouth spread, zebras thrived. Where it did not, they faded over tens of thousands of ticks with food still on the map.']];
ways.forEach((w, i) => {
    const x = 0.6 + i * 4.1;
    card(s, x, 1.45, 3.85, 3.9);
    text(s, w[0], {x: x + 0.3, y: 1.7, w: 3.3, h: 0.55, fontSize: 24, bold: true, color: w[2], fontFace: 'Cambria'});
    text(s, w[1], {x: x + 0.3, y: 2.3, w: 3.3, h: 0.45, fontSize: 17, bold: true, color: '555555'});
    text(s, w[3], {x: x + 0.3, y: 3.0, w: 3.3, h: 3.4, fontSize: 15});
});

// 13. Ablations and sweeps (native bars)
s = slide('CONTENT', 'Experiments');
s.addText('Without the river or soil water, every zebra lineage died', {placeholder: 'title'});
const barOpts = (title, color) => Object.assign({barDir: 'bar', chartColors: [color], showLegend: false, showTitle: true, title, valAxisMaxVal: 1.2, valAxisMinVal: 0, valAxisMajorUnit: 0.5,
    valAxisHidden: true, showValue: true, dataLabelFormatCode: '0%', dataLabelPosition: 'outEnd', dataLabelFontSize: 10, dataLabelFontFace: '+mn-lt', dataLabelColor: '444444', catAxisOrientation: 'maxMin'}, axis);
s.addChart(pres.charts.BAR, [{name: 'alive', labels: DATA.ablation.map(a => a[0]), values: DATA.ablation.map(a => a[1])}],
    Object.assign({x: 0.6, y: 1.3, w: 6.0, h: 5.5}, barOpts('Ablations: zebra lineages alive at 40k', HEX.dk2)));
s.addChart(pres.charts.BAR, [{name: 'alive', labels: DATA.sweep.map(a => a[0]), values: DATA.sweep.map(a => a[1])}],
    Object.assign({x: 6.8, y: 1.3, w: 6.0, h: 5.5}, barOpts('Sweeps: zebra lineages alive at 40k', HEX.accent2)));
s.addNotes('3 seeds per condition, so only 0% or 100% is a clear signal. No river, no soil water, weak camouflage and harsh hunger: 0 of 3. No cache: 3 of 3, because leopards died sooner. Mouth cap: 1 of 3, so the extra mouth helped zebras.');

// 14. Mechanism (native line + screenshots)
s = slide('CONTENT', 'Experiments');
s.addText('Zebras streamlined instead of overgrazing', {placeholder: 'title'});
img(s, FIG + '/timeline-mech-full-5.png', 0.6, 1.25, 12.1, 3260 / 648);
const mt = DATA.mech.tick.map(t => String(t / 1000));
s.addChart(pres.charts.LINE, [
    {name: 'Mouths', labels: mt, values: DATA.mech.zebra_mouths}, {name: 'Eyes', labels: mt, values: DATA.mech.zebra_n_eye},
    {name: 'Stripes', labels: mt, values: DATA.mech.zebra_n_stripe}, {name: 'Kick', labels: mt, values: DATA.mech.zebra_n_killer}],
    Object.assign({x: 0.6, y: 3.85, w: 7.4, h: 3.0, showTitle: true, title: 'Cells per zebra, seed 5 (x: thousand ticks)', lineSize: 2, lineDataSymbol: 'none',
        chartColors: [HEX.dk1, HEX.accent3, '9CA3AF', HEX.accent4], showLegend: true, legendPos: 'r', catAxisLabelFrequency: 5}, axis));
text(s, 'Once leopards are gone, eyes, stripes and the kick are dead weight. A smaller body breeds on less food and a second mouth eats faster. Grass food never crashed (500 to 2,000 cells), so the trait never destroyed its own food: adaptation, not suicide.',
    {x: 8.3, y: 4.0, w: 4.4, h: 2.8, fontSize: 15});

// 14b. Follow-up runs
s = slide('CONTENT', 'Experiments');
s.addText('Longer, drier, more predators, more fire: same verdict', {placeholder: 'title'});
const fu = [['200k ticks, 40% rain', HEX.dk1, 'Zebras evolved up to 2.8 mouths as food fell, then died out. Food kept falling after they were gone: grass crowding, not grazing.'],
    ['32 and 48 leopards', HEX.accent1, '48 leopards ate the whole herd in about 1,300 ticks, then starved: over-exploitation from density, not an evolved trait.'],
    ['10x fire chance', HEX.accent4, 'Burning rose only 2.6x and no fire passed 160 cells. Patchy plants on wet soil starve fires of fuel.']];
fu.forEach((f, i) => {
    const x = 0.6 + i * 4.1;
    card(s, x, 1.35, 3.85, 1.7);
    text(s, f[0], {x: x + 0.25, y: 1.5, w: 3.4, h: 0.45, fontSize: 18, bold: true, color: f[1], fontFace: 'Cambria'});
    text(s, f[2], {x: x + 0.25, y: 2.0, w: 3.4, h: 1.0, fontSize: 13});
});
img(s, FIG + '/timeline-long-dry-3.png', 0.6, 3.3, 5.95, 2448 / 1234);
img(s, FIG + '/timeline-leopards48.png', 6.75, 3.3, 5.95, 2448 / 1234);
s.addNotes('18 follow-up runs, 3 seeds each: 200k default, 200k dry, 32 and 48 leopards, strong and extreme fire. None produced zebra overgrazing suicide or a persistent predator.');

// 15. Answers
s = slide('CONTENT', 'Conclusions');
s.addText('Answers to the brief', {placeholder: 'title'});
const qa = [['Did extinction occur?', 'Yes: every leopard and rhino population in the main runs, and zebras in 4 of 5 main seeds.'],
    ['Suicide or failure?', 'Suicide in the base engine (evolved plant-killers, 3 of 3). Failure to adapt for rhinos and non-adapting zebras; boom-bust for leopards.'],
    ['Environment or species?', 'The same zebras killed themselves in the base engine and adapted in the savanna. Removing the river or soil water was as decisive as removing a trait.'],
    ['Instrumental traits', 'Toward collapse: evolved killers, costly armour, single-prey diet. Away: river, water regrowth, stripes, kick, the second mouth.']];
qa.forEach((q, i) => {
    const x = 0.6 + (i % 2) * 6.15, y = 1.45 + Math.floor(i / 2) * 2.55;
    card(s, x, y, 5.95, 2.3);
    badge(s, x + 0.3, y + 0.3, String(i + 1));
    text(s, q[0], {x: x + 1.0, y: y + 0.33, w: 4.7, h: 0.5, fontSize: 19, bold: true, fontFace: 'Cambria'});
    text(s, q[1], {x: x + 0.3, y: y + 1.0, w: 5.4, h: 1.4, fontSize: 15});
});

// 16. Limits + no hard-coding
s = slide('CONTENT', 'Conclusions');
s.addText('What we can and cannot claim', {placeholder: 'title'});
card(s, 0.6, 1.4, 5.9, 4.2, 'F8ECEC');
text(s, 'Limits', {x: 0.9, y: 1.6, w: 5.3, h: 0.5, fontSize: 20, bold: true, color: HEX.accent4, fontFace: 'Cambria'});
text(s, [
    {text: '3 seeds per ablation and sweep: one seed of difference is noise', options: {bullet: true, breakLine: true}},
    {text: 'Rules were rebalanced during testing (leopard body, sprint, armour, weapons) before the final runs', options: {bullet: true, breakLine: true}},
    {text: 'Our overgrazing hypothesis was not observed in 100k ticks', options: {bullet: true, breakLine: true}},
    {text: 'Fires stayed small and leopards never persisted, even with 10x fire and 3x leopards', options: {bullet: true}}], {x: 0.9, y: 2.2, w: 5.3, h: 4.2, fontSize: 15, paraSpaceAfter: 8});
card(s, 6.8, 1.4, 5.9, 4.2, 'EEF5EA');
text(s, 'No outcome is hard-coded', {x: 7.1, y: 1.6, w: 5.3, h: 0.5, fontSize: 20, bold: true, color: HEX.accent2, fontFace: 'Cambria'});
text(s, [
    {text: 'Every death comes from per-organism rules: age, cell damage or hunger', options: {bullet: true, breakLine: true}},
    {text: 'Variants only change starting organisms and settings', options: {bullet: true, breakLine: true}},
    {text: 'Seeds of one condition reach different outcomes', options: {bullet: true, breakLine: true}},
    {text: 'Code: src/Organism/Cell/BodyCells, savanna-experiments/', options: {bullet: true}}], {x: 7.1, y: 2.2, w: 5.3, h: 4.2, fontSize: 15, paraSpaceAfter: 8});

// 17. Conclusion
s = slide('TITLE_DARK', 'Conclusions');
s.addText('The trait that wins is not always the trait that kills', {placeholder: 'title'});
s.addText('A killer that pays in food today destroyed the base-engine world. In a savanna with water, refuges and fallbacks, the same pressure produced adaptation instead.', {placeholder: 'body'});
text(s, 'Report, logs, screenshots and code: savanna-experiments/ in the project repository', {x: 0.7, y: 6.4, w: 11.9, h: 0.4, fontSize: 14, color: 'BFBFBF'});

(async () => {
    await pres.writeFile({fileName: DEST});
    await applyTheme(DEST, THEME);
    console.log('written', DEST);
})();
