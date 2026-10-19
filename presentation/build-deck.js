// Builds the final presentation: node deck.js
const pptxgen = require('pptxgenjs');
const fs = require('fs');
const path = require('path');

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
pres.company = 'University of Cape Town';
pres.subject = 'CSC4044Z Artificial Life project';

// ---------- layouts ----------
pres.defineSlideMaster({
    title: 'TITLE_DARK', background: {color: HEX.dk1},
    objects: [
        {placeholder: {options: {name: 'title', type: 'title', x: 0.7, y: 1.2, w: 11.9, h: 1.7, fontSize: 44, bold: true, color: 'FFFFFF', valign: 'top', align: 'left'}, text: 'Title'}},
        {placeholder: {options: {name: 'body', type: 'body', x: 0.7, y: 3.0, w: 11.9, h: 1.0, fontSize: 20, color: 'D98E04'}, text: 'Subtitle'}},
    ],
});
pres.defineSlideMaster({
    title: 'SECTION_DARK', background: {color: HEX.dk2},
    objects: [
        {placeholder: {options: {name: 'title', type: 'title', x: 0.7, y: 2.5, w: 11.9, h: 1.3, fontSize: 40, bold: true, color: 'FFFFFF', align: 'left'}, text: 'Section'}},
        {placeholder: {options: {name: 'body', type: 'body', x: 0.7, y: 3.9, w: 11.9, h: 1.2, fontSize: 20, color: 'D98E04'}, text: 'Subtitle'}},
    ],
});
pres.defineSlideMaster({
    title: 'CONTENT', background: {color: HEX.lt1},
    objects: [
        {placeholder: {options: {name: 'title', type: 'title', x: 0.6, y: 0.35, w: 12.1, h: 0.85, fontSize: 30, bold: true, color: '1F1A14', valign: 'top', align: 'left'}, text: 'Title'}},
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
s.addText('Our evidence rule for evolutionary suicide', {placeholder: 'title'});
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

// 3. Species: base vs modified
s = slide('CONTENT', 'Introduction');
s.addText('Species in the base and modified engine', {placeholder: 'title'});
img(s, FIG + '/species-base.png', 0.6, 1.3, 5.9, 1446 / 450);
img(s, FIG + '/species-modified.png', 6.75, 1.3, 5.95, 1732 / 450);
card(s, 0.6, 3.35, 12.1, 1.0, 'FFF4DC');
text(s, [{text: 'About movers. ', options: {bold: true}}, {text: 'In the original Life Engine one mover is enough and extra movers add nothing: every animal moves one cell per tick. So base zebras and leopards have one mover. Sprinting with extra movers is our own rule, used only in the modified engine.'}],
    {x: 0.9, y: 3.47, w: 11.5, h: 0.8, fontSize: 15});
const sp = [['Zebra', HEX.dk1, 'Herd grazer with a rear kick. Modified: stripes for herd camouflage, sprint', 'One mouth; in the base engine its kick also hurts its own herd'],
    ['Rhino', HEX.accent5, 'Armoured grazer. Modified: horn, armour adds health', 'Slow; modified armour costs food, so calves are expensive'],
    ['Leopard', HEX.accent1, 'Jaws beside the mouth. Modified: meat-only, strong bite, cache near trees', 'Base: no faster than prey. Modified: no armour, kicked and gored']];
sp.forEach((r, i) => {
    const x = 0.6 + i * 4.1;
    card(s, x, 4.6, 3.85, 2.1);
    text(s, r[0], {x: x + 0.25, y: 4.75, w: 3.4, h: 0.4, fontSize: 18, bold: true, color: r[1], fontFace: 'Cambria'});
    text(s, r[2], {x: x + 0.25, y: 5.2, w: 3.4, h: 0.7, fontSize: 13});
    text(s, [{text: 'Weakness  ', options: {bold: true}}, {text: r[3]}], {x: x + 0.25, y: 5.95, w: 3.4, h: 0.7, fontSize: 13});
});
s.addNotes('Base species use only original cells. Grass is 3 producers, bush 5 (producers in the base engine, woody cells in the modified one). Trees exist only in the modified engine.');

// Part 1 divider
s = slide('SECTION_DARK', 'Part 1: base engine');
s.addText('Part 1: the base engine', {placeholder: 'title'});
s.addText('What it can and cannot do, how we tried to get suicide or failure to adapt, and what happened', {placeholder: 'body'});

// 4. Base engine limits
s = slide('CONTENT', 'Part 1: base engine');
s.addText('What the base engine can and cannot do', {placeholder: 'title'});
card(s, 0.6, 1.4, 5.9, 3.3, 'EEF5EA');
text(s, 'It allows', {x: 0.9, y: 1.6, w: 5.3, h: 0.5, fontSize: 20, bold: true, color: HEX.accent2, fontFace: 'Cambria'});
text(s, [
    {text: 'Killer cells hurt everything they touch: plants, other species and their own kind', options: {bullet: true, breakLine: true}},
    {text: 'Anything that dies becomes food, so killing is rewarded with a meal', options: {bullet: true, breakLine: true}},
    {text: 'Uneaten food blocks births', options: {bullet: true, breakLine: true}},
    {text: 'Mutation can add, change or remove any cell', options: {bullet: true}}], {x: 0.9, y: 2.2, w: 5.3, h: 3.1, fontSize: 15, paraSpaceAfter: 8});
card(s, 6.8, 1.4, 5.9, 3.3, 'F8ECEC');
text(s, 'It cannot do', {x: 7.1, y: 1.6, w: 5.3, h: 0.5, fontSize: 20, bold: true, color: HEX.accent4, fontFace: 'Cambria'});
text(s, [
    {text: 'Starvation: animals only die of age or damage', options: {bullet: true, breakLine: true}},
    {text: 'Worse food: grass and bush food are identical', options: {bullet: true, breakLine: true}},
    {text: 'Predator dependence: leopards eat plant food too', options: {bullet: true, breakLine: true}},
    {text: 'Overgrazing: mouths cannot hurt plants', options: {bullet: true, breakLine: true}},
    {text: 'Speed: every animal moves one cell per tick', options: {bullet: true}}], {x: 7.1, y: 2.2, w: 5.3, h: 3.1, fontSize: 15, paraSpaceAfter: 8});
text(s, 'In the base engine a species can only destroy its food through killer cells, so our grazing hypothesis cannot be tested.', {x: 0.6, y: 5.05, w: 12.1, h: 0.7, fontSize: 18, bold: true, color: HEX.dk2});
s.addNotes('Base runs: original rules plus our Assignment 2 plant-reproduction change. Every new setting off; mutation cannot create our new cells.');

// 5. How we tried
s = slide('CONTENT', 'Part 1: base engine');
s.addText('How we tried to get suicide or failure to adapt', {placeholder: 'title'});
const tries = [['Default', 'Original settings as shipped: does anything collapse on its own?'],
    ['Plant-kill control', 'Zebras start without a killer; insta-kill on. Will a plant-killing trait evolve, spread and destroy the food?'],
    ['Plant-kill, seeded', 'The same, but zebras start with the killer'],
    ['Harsh food', 'Food production 2: does anyone fail, or adapt?'],
    ['No mutation', 'Food production 2 and no mutation: the failure-to-adapt baseline'],
    ['Clogging', 'Fast plants and few grazers. Can plants choke on their own food?']];
tries.forEach((t, i) => {
    const x = 0.6 + (i % 3) * 4.1, y = 1.4 + Math.floor(i / 3) * 2.6;
    card(s, x, y, 3.85, 2.35);
    badge(s, x + 0.3, y + 0.3, String(i + 1), i === 1 || i === 5 ? HEX.accent4 : HEX.accent1);
    text(s, t[0], {x: x + 0.3, y: y + 0.95, w: 3.3, h: 0.45, fontSize: 18, bold: true, fontFace: 'Cambria'});
    text(s, t[1], {x: x + 0.3, y: y + 1.4, w: 3.3, h: 0.9, fontSize: 13, color: '444444'});
});
s.addNotes('Each condition: 3 seeds of 40,000 ticks, screenshots at fixed ticks and at every collapse.');

// 6. Evolved killer
s = slide('CONTENT', 'Part 1: base engine');
s.addText('Plant-kill control: an evolved killer destroyed the food supply', {placeholder: 'title'});
img(s, FIG + '/timeline-base-suicide.png', 0.6, 1.3, 8.9, 2448 / 1234);
stat(s, 9.9, 1.4, 2.9, '1 of 3', 'seeds met all four criteria; the other 2 collapsed but kept their grass', HEX.accent4);
stat(s, 9.9, 3.1, 2.9, '528', 'zebras at the peak, seed 2; killers then on 89-100% of the herd', HEX.dk1);
stat(s, 9.9, 4.8, 2.9, '14,005', 'tick the last zebra died; the last grass went at 11,700', HEX.accent1);
s.addNotes('Seed 2: a killer evolved and spread because every plant or zebra it killed became food. Bushes gone by 4,900, grass by 11,700, zebras by 14,005. Seeds 1 and 3: killers mostly hit other zebras; carcasses piled up as food and blocked births, so the herd died out while grass survived.');

// 7. Seeded kick
s = slide('CONTENT', 'Part 1: base engine');
s.addText('Seeded kick: zebras destroyed the plants and their own herd', {placeholder: 'title'});
img(s, FIG + '/base-zebra-deaths.png', 0.6, 1.35, 7.6, 1200 / 480);
stat(s, 8.7, 1.4, 4.0, '81-97%', 'of zebra deaths caused by other zebras\' kicks (leopards 0-10%)', HEX.accent4);
stat(s, 8.7, 3.1, 4.0, 'tick 6,100', 'latest point by which all grass was gone; bushes by 1,500', HEX.accent2);
stat(s, 8.7, 4.8, 4.0, 'tick 8,000', 'latest zebra extinction in every condition with the kick', HEX.dk1);
text(s, 'The kick was given, not evolved, so this is a self-destroying design, not evolutionary suicide.', {x: 0.6, y: 4.6, w: 7.6, h: 0.8, fontSize: 15, bold: true, color: HEX.dk2});
s.addNotes('Default, harsh, no-mutation and seeded plant-kill. The seeded plant-kill runs had no leopards, so zebra kicks alone destroyed the plants. Kicks also killed most rhinos (69 of 90 deaths in default seed 1).');

// 8. Base outcomes + why
s = slide('CONTENT', 'Part 1: base engine');
s.addText('Base engine results and why we changed the engine', {placeholder: 'title'});
const bl = DATA.base.map(b => b[0]);
s.addChart(pres.charts.BAR, [
    {name: 'Suicide (all 4 criteria)', labels: bl, values: DATA.base.map(b => b[1])},
    {name: 'Suicide candidate (3 of 4)', labels: bl, values: DATA.base.map(b => b[2])},
    {name: 'Other collapse', labels: bl, values: DATA.base.map(b => b[3])},
    {name: 'Survived', labels: bl, values: DATA.base.map(b => b[4])}],
    Object.assign({x: 0.6, y: 1.35, w: 7.2, h: 5.3, barDir: 'bar', barGrouping: 'stacked', chartColors: [HEX.accent4, 'E59A9A', '9CA3AF', HEX.accent2],
        showLegend: true, legendPos: 'b', showTitle: true, title: 'Zebra outcome, 3 seeds per condition', valAxisMaxVal: 3, valAxisMajorUnit: 1, catAxisOrientation: 'maxMin',
        showValue: true, dataLabelPosition: 'ctr', dataLabelColor: 'FFFFFF', dataLabelFontSize: 11, dataLabelFontFace: '+mn-lt', dataLabelFormatCode: '0;;;'}, axis));
text(s, [
    {text: 'Suicide: ', options: {bold: true}}, {text: 'yes, once, when the killer evolved', options: {breakLine: true}},
    {text: ' ', options: {breakLine: true}},
    {text: 'Failure to adapt: ', options: {bold: true}}, {text: 'zebras with no mutation; leopards in every condition (no speed advantage), extinct by tick 1,300', options: {breakLine: true}},
    {text: ' ', options: {breakLine: true}},
    {text: 'Clogging failed: ', options: {bold: true}}, {text: 'grass never choked; the zebras kicked each other to death first', options: {breakLine: true}},
    {text: ' ', options: {breakLine: true}},
    {text: 'Why change the engine: ', options: {bold: true}}, {text: 'the base engine can only collapse through killers. To test overgrazing we needed grazing, worse food, hunger and real predators'}],
    {x: 8.2, y: 1.5, w: 4.5, h: 5.2, fontSize: 14});

// Part 2 divider
s = slide('SECTION_DARK', 'Part 2: modifications');
s.addText('Part 2: what we changed', {placeholder: 'title'});
s.addText('Changes made to address the limits of the base engine. All are off by default.', {placeholder: 'body'});

// 9. Limit -> change
s = slide('CONTENT', 'Part 2: modifications');
s.addText('Changes we made to the engine', {placeholder: 'title'});
const lim = [['Mouths cannot hurt plants', 'Grazing damages grass plants'], ['Grass and bush food identical', 'Bush browse worth 0.35 of grass'],
    ['Nothing starves', 'Hunger: 1 food per 80 ticks, 10 misses and it dies'], ['Leopards eat plants', 'Meat, jaws (killer beside mouth), feeding at the kill'],
    ['Killers hurt plants and kin', 'Killers spare plants and own lineage; weapons strike only predators'], ['Everyone moves 1 cell per tick', 'Our sprint rule: extra movers add steps, only when chasing or fleeing'],
    ['Plant growth unlimited, map uniform', 'Soil water, river, trees and fire']];
lim.forEach((l, i) => {
    const y = 1.35 + i * 0.72;
    card(s, 0.6, y, 5.2, 0.6, 'F8ECEC');
    text(s, l[0], {x: 0.8, y: y + 0.13, w: 4.9, h: 0.4, fontSize: 14});
    text(s, '→', {x: 5.9, y: y + 0.08, w: 0.5, h: 0.45, fontSize: 20, bold: true, color: HEX.dk2, align: 'center'});
    card(s, 6.5, y, 6.2, 0.6, 'EEF5EA');
    text(s, l[1], {x: 6.7, y: y + 0.13, w: 5.9, h: 0.4, fontSize: 14, bold: i === 5});
});
text(s, 'Sprinting is our invention: in the original engine extra movers do nothing. At equal speed, leopards almost never caught zebras.', {x: 0.6, y: 6.45, w: 12.1, h: 0.45, fontSize: 13, color: '555555'});

// 8. Member features
s = slide('CONTENT', 'Part 2: modifications');
s.addText('Member features', {placeholder: 'title'});
const feats = [['Horn cell', 'Vimbai', HEX.accent5, 'Horned rhinos trample plants and food around them', 'Immune to killers; gores attackers 50% per tick'],
    ['Stripe cell', 'Moreblessing', HEX.dk1, 'More surviving zebras means more grazing pressure', 'Leopard eyes miss a striped zebra 25% per striped neighbour, up to 85%'],
    ['Cache cell', 'Ashley', HEX.accent1, 'Banking food delays breeding', 'Surplus banked near trees, spent automatically to stave off starvation'],
    ['Soil water', 'Shared (group)', HEX.accent3, 'Grass needs water to produce; dry soil recovers slowly', 'Rain refills soil; deep-rooted bushes take over freed water']];
feats.forEach((f, i) => {
    const x = 0.6 + (i % 2) * 6.15, y = 1.4 + Math.floor(i / 2) * 2.75;
    card(s, x, y, 5.95, 2.5);
    text(s, f[0], {x: x + 0.3, y: y + 0.2, w: 3.5, h: 0.5, fontSize: 21, bold: true, color: f[2], fontFace: 'Cambria'});
    text(s, f[1], {x: x + 3.6, y: y + 0.27, w: 2.1, h: 0.4, fontSize: 13, color: '666666', align: 'right'});
    text(s, [{text: 'Can lead to collapse:  ', options: {bold: true, color: HEX.accent4}}, {text: f[3]}], {x: x + 0.3, y: y + 0.85, w: 5.4, h: 0.7, fontSize: 15});
    text(s, [{text: 'Prevents easy collapse:  ', options: {bold: true, color: HEX.accent2}}, {text: f[4]}], {x: x + 0.3, y: y + 1.55, w: 5.4, h: 0.8, fontSize: 15});
});

// Verdict
s = slide('SECTION_DARK', 'Part 2: did we achieve it?');
s.addText('Part 2: results', {placeholder: 'title'});
s.addText('Results of the main runs, ablations, sweeps, mechanism check and follow-up runs', {placeholder: 'body'});

s = slide('CONTENT', 'Part 2: did we achieve it?');
s.addText('What the modified engine produced', {placeholder: 'title'});
const vd = [['Zebra overgrazing suicide', 'No', HEX.accent4, 'Zebras evolved up to 2.8 mouths, but water-limited regrowth, bush food and the river kept grass from collapsing'],
    ['Rhino failure to adapt', 'Yes', HEX.accent2, 'Died out in every seed, mostly of old age: 16 food per calf was too slow'],
    ['Zebra failure to adapt', 'Yes', HEX.accent2, 'Where no second mouth evolved, herds faded with food still on the map'],
    ['Leopard collapse', 'Yes, but not suicide', HEX.accent1, 'Boom and bust in every run. With 48 leopards they ate every zebra and then starved, caused by starting density rather than an evolved trait'],
    ['Horn or fire collapse', 'No', HEX.accent4, 'Rhinos stayed rare; fires never passed 160 cells on patchy, wet ground']];
vd.forEach((v, i) => {
    const y = 1.35 + i * 1.08;
    card(s, 0.6, y, 12.1, 0.95);
    text(s, v[0], {x: 0.85, y: y + 0.25, w: 3.6, h: 0.5, fontSize: 16, bold: true, fontFace: 'Cambria'});
    text(s, v[1], {x: 4.5, y: y + 0.25, w: 1.9, h: 0.5, fontSize: 16, bold: true, color: v[2]});
    text(s, v[3], {x: 6.4, y: y + 0.17, w: 6.1, h: 0.7, fontSize: 13});
});
s.addNotes('Our changes removed the collapse route the base engine used and made overgrazing possible. Overgrazing needs grass to regrow more slowly than it is eaten, and in every setting we tried, regrowth and fallback foods kept pace with the zebras.');

// 10. Main timeline
s = slide('CONTENT', 'Part 2: did we achieve it?');
s.addText('Main run, seed 1', {placeholder: 'title'});
img(s, FIG + '/timeline-main-full-1.png', 1.0, 1.25, 11.3, 2448 / 1234);
s.addNotes('Leopards rose from 16 to 35 by eating the herd, then died out by tick 4,400. Rhinos faded by 12,600. Zebras evolved a second mouth and held at about 200 to 290 to tick 100,000.');

// 11. Five seeds
s = slide('CONTENT', 'Part 2: did we achieve it?');
s.addText('Main runs across five seeds', {placeholder: 'title'});
const ticks = DATA.main['1'].tick.map(t => String(t / 1000));
s.addChart(pres.charts.LINE, [1, 2, 3, 4, 5].map(k => ({name: 'Seed ' + k, labels: ticks, values: DATA.main[String(k)].zebra})),
    Object.assign({x: 0.6, y: 1.35, w: 7.6, h: 5.3, showTitle: true, title: 'Zebras per seed (x: thousand ticks)', lineSize: 2, lineDataSymbol: 'none',
        chartColors: [HEX.dk1, HEX.accent1, HEX.accent2, HEX.accent3, HEX.accent4], showLegend: true, legendPos: 'b', catAxisLabelFrequency: 5}, axis));
stat(s, 8.7, 1.4, 4.0, '26 to 35', 'leopard peak, then extinct by tick 3,600 to 12,800', HEX.accent1);
stat(s, 8.7, 3.1, 4.0, '5 of 5', 'rhino populations faded out by tick 17,300', HEX.accent5);
stat(s, 8.7, 4.8, 4.0, '1 of 5', 'zebra lineages alive at 100k: the one that evolved a second mouth', HEX.dk1);

// 12. Three ways to disappear
s = slide('CONTENT', 'Part 2: did we achieve it?');
s.addText('How each species declined', {placeholder: 'title'});
const ways = [['Leopards', 'Boom then bust', HEX.accent1, 'Killed 57 to 144 zebras per run, then aged out or were kicked to death. The zebras did not crash first, so the leopards failed to persist rather than over-hunting.'],
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
s = slide('CONTENT', 'Part 2: did we achieve it?');
s.addText('Ablations and sweeps', {placeholder: 'title'});
const barOpts = (title, color) => Object.assign({barDir: 'bar', chartColors: [color], showLegend: false, showTitle: true, title, valAxisMaxVal: 1.2, valAxisMinVal: 0, valAxisMajorUnit: 0.5,
    valAxisHidden: true, showValue: true, dataLabelFormatCode: '0%', dataLabelPosition: 'outEnd', dataLabelFontSize: 10, dataLabelFontFace: '+mn-lt', dataLabelColor: '444444', catAxisOrientation: 'maxMin'}, axis);
s.addChart(pres.charts.BAR, [{name: 'alive', labels: DATA.ablation.map(a => a[0]), values: DATA.ablation.map(a => a[1])}],
    Object.assign({x: 0.6, y: 1.3, w: 6.0, h: 5.5}, barOpts('Ablations: zebra lineages alive at 40k', HEX.dk2)));
s.addChart(pres.charts.BAR, [{name: 'alive', labels: DATA.sweep.map(a => a[0]), values: DATA.sweep.map(a => a[1])}],
    Object.assign({x: 6.8, y: 1.3, w: 6.0, h: 5.5}, barOpts('Sweeps: zebra lineages alive at 40k', HEX.accent2)));
s.addNotes('3 seeds per condition, so only 0% or 100% is a clear signal. No river, no soil water, weak camouflage and harsh hunger: 0 of 3. No cache: 3 of 3, because leopards died sooner. Mouth cap: 1 of 3, so the extra mouth helped zebras.');

// 14. Mechanism (native line + screenshots)
s = slide('CONTENT', 'Part 2: did we achieve it?');
s.addText('Mechanism check: how surviving zebras changed', {placeholder: 'title'});
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
s = slide('CONTENT', 'Part 2: did we achieve it?');
s.addText('Follow-up runs', {placeholder: 'title'});
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
const qa = [['Did extinction occur?', 'Yes: zebras in every base condition; every leopard and rhino population in the main modified runs.'],
    ['Suicide or failure?', 'Suicide in the base engine when a killer evolved (1 of 3 meets all criteria). Failure to adapt: base leopards, modified rhinos and non-adapting zebras.'],
    ['Environment or species?', 'The engine rules decided how collapse could happen. Removing the river or soil water had as large an effect as removing a species trait.'],
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
s.addText('Limitations', {placeholder: 'title'});
card(s, 0.6, 1.4, 5.9, 4.2, 'F8ECEC');
text(s, 'Limits', {x: 0.9, y: 1.6, w: 5.3, h: 0.5, fontSize: 20, bold: true, color: HEX.accent4, fontFace: 'Cambria'});
text(s, [
    {text: '3 seeds per ablation and sweep: one seed of difference is noise', options: {bullet: true, breakLine: true}},
    {text: 'Rules were rebalanced during testing (leopard body, sprint, armour, weapons) before the final runs', options: {bullet: true, breakLine: true}},
    {text: 'Base runs redone with one-mover species after checking that extra movers do nothing', options: {bullet: true, breakLine: true}},
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
s.addText('Conclusion', {placeholder: 'title'});
s.addText('Evolutionary suicide occurred in the base engine through an evolved killer cell. In the modified engine we saw failure to adapt and predator boom-and-bust, but not the overgrazing suicide we predicted.', {placeholder: 'body'});
text(s, 'Report, logs, screenshots and code: savanna-experiments/ in the project repository', {x: 0.7, y: 6.4, w: 11.9, h: 0.4, fontSize: 14, color: 'BFBFBF'});

(async () => {
    await pres.writeFile({fileName: DEST});
    console.log('written', DEST);
})();
