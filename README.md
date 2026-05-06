# XE Research — AI Agent CV Generation

A small research project comparing how different AI coding agents tackle the
same zero-shot frontend task: generate a state-of-the-art static CV / résumé
website from a shared prompt and source data.

Each agent receives the identical brief and the same inputs, then produces its
own static site. The outputs sit side by side so the results can be compared
on design quality, accessibility, print styling, and overall execution.

## Repository layout

- [prompt.md](prompt.md) — the prompt every agent is given (constraints,
  design requirements, accessibility, print, SEO, JSON-LD).
- [src/](src/) — shared input data:
  - [src/index.json](src/index.json) — CV content
  - [src/HolgerHellinger640.png](src/HolgerHellinger640.png) — profile picture
- `dist/<agent-name>/` — each agent's generated static site (one directory
  per agent, e.g. `claude-opus-4-7`, `claude-sonnet-4`, `gemini-cli`, `gpt4`).

## How to use

1. Pick an agent and hand it the contents of [prompt.md](prompt.md).
2. The agent reads from [src/](src/) and writes its output to
   `dist/<its-name>/` so the result can be browsed statically (e.g.
   `dist/<agent>/index.html`).
3. Open the generated `index.html` files to compare the results.
