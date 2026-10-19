# Declaration of AI assistance

CSC4044Z Artificial Life, 2026: Reproducing Evolutionary Suicide

This project used an AI assistant. This file records what it was used for and what the group did, so that markers can judge the work fairly.

## Tool used

- Claude (Anthropic), used through the Claude Code desktop app, between 5 and 19 October 2026.

## What the group did

- Chose the research question, the hypotheses and the evidence rule for evolutionary suicide (Assignment 3).
- Chose the species (zebra, rhino, leopard, grass, bush) and the feature each of the three members owns: Horn cell (Vimbai), Stripe cell (Moreblessing) and Cache cell (Ashley). The soil water and fertility system was a shared group feature.
- Directed the work: asked for realistic species designs, approved the designs and the planned modifications, asked for the river, trees, fire and the food and tuning experiments, and decided the run lengths.
- Checked the work against the source material. For example, a group member found in the Life Engine creator's explanation video that extra mover cells add no speed in the original engine. This led to the base runs being redone and the sprint rule being labelled as our own addition.
- Decided the structure of the report and presentation, and reviewed the results and wording.

## What the AI assistant did

- Wrote most of the code changes in `src/` (new cells, environment rules, hunger, diet, sprint rule, river, trees, fire and the `EcoStats.js` logger) from the group's specifications.
- Wrote the experiment code in `savanna-experiments/` (world generator, in-browser harness, local server, analysis, figure and observation-log scripts).
- Ran the 115 simulation runs, tuned settings during testing, and analysed the logs.
- Drafted the report, the presentation and the observation log, which the group then reviewed and revised.

## How the results were produced

All results come from running the Life Engine simulation. Every number, chart and screenshot in the report and presentation is read from the run outputs in `savanna-experiments/output/` (`log.csv`, `events.json` and the saved frames), and anyone can regenerate them with the steps in the report. No outcome is hard-coded: deaths follow the same per-organism rules (old age, cell damage and hunger), and the world files only set the starting organisms and settings.

## Confirmation

The group has three members. Each member confirms they have read the code for their own feature and the shared soil-water system, and can explain it.

| Member | Feature | Confirmed |
| --- | --- | --- |
| Vimbai | Horn cell | |
| Moreblessing | Stripe cell | |
| Ashley | Cache cell | |
