# Declaration of AI assistance

CSC4044Z Artificial Life, 2026: Reproducing Evolutionary Suicide

This project used an AI assistant. This file records what we did and what the assistant helped with, so that markers can judge the work fairly.

## Tool used

- Claude (Anthropic), used through the Claude Code desktop app, between 5 and 20 October 2026.

## What we did

- We chose the research question, the hypotheses and the evidence rule we used to decide whether a collapse counts as evolutionary suicide (Assignment 3).
- We chose the species (zebra, rhino, leopard, grass and bush) and split the features between the three of us: the Horn cell (Vimbai), the Stripe cell (Moreblessing) and the Cache cell (Ashley). We designed the soil water and fertility system together as a shared feature.
- We based the species on real animals and plants, decided their strengths and weaknesses, and approved the final body plans for the base and modified engines.
- We decided which changes the engine needed, including the river, trees and fire, and planned the experiments: the food and tuning sweeps, the ablations, the run lengths and the follow-up runs.
- We checked the work against the source material. While watching the Life Engine creator's explanation video we found that extra mover cells add no speed in the original engine. We then had the base runs redone with one-mover species and made sure the sprint rule is described as our own addition.
- We decided how the report and presentation are structured (base engine first, then our changes, then whether we achieved suicide or failure to adapt) and reviewed the results and the wording.

## What the AI assistant helped with

- Writing the code changes in `src/` and the experiment scripts in `savanna-experiments/` from our specifications.
- Debugging problems found during testing, for example leopards that could not make a kill because of where their killer cell and eye were placed, zebra kicks killing rhinos, and slow runs when the browser tab was hidden.
- Setting up and running the experiments (115 runs), including the world files, the run harness and the screenshots.
- Analysing the logs and results, and producing the charts, summary tables and observation log.
- Writing first drafts of the report and slides, which we then reviewed and revised.

## How the results were produced

All results come from running the Life Engine simulation. Every number, chart and screenshot in the report and presentation is read from the run outputs in `savanna-experiments/output/` (`log.csv`, `events.json` and the saved frames), and anyone can regenerate them with the steps in the report. No outcome is hard-coded: deaths follow the same per-organism rules (old age, cell damage and hunger), and the world files only set the starting organisms and settings.

## Confirmation

The group has three members. Each member confirms they have read the code for their own feature and the shared soil-water system, and can explain it.

Each member signs and dates their own row.

| Member | Feature | Confirmed | Signature | Date |
| --- | --- | --- | --- | --- |
| Vimbai | Horn cell | | | |
| Moreblessing | Stripe cell | | | |
| Ashley | Cache cell | Yes | | |
