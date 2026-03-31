# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Running the App

Node.js is **not in the system PATH** on this machine. It is installed at `/Users/fathian/.local/node/`. Always prefix Node commands with the PATH export:

```bash
export PATH="/Users/fathian/.local/node/bin:$PATH"
```

```bash
# Install dependencies (first time only)
npm install

# Start the server
node server.js
# or
npm start
```

Server runs at **http://localhost:3000**. There are no tests, no linter, and no build step — the app runs directly from source.

To restart after code changes, kill the existing process and relaunch:
```bash
pkill -f "node.*server.js"
export PATH="/Users/fathian/.local/node/bin:$PATH" && node server.js &
```

## Architecture

**Single-file server** (`server.js`) loads all four JSON data files synchronously at startup, then serves them to EJS templates via route handlers. There is no database, no ORM, no session state, and no build pipeline.

### Data flow

```
data/*.json  →  server.js (loaded at startup)  →  EJS templates  →  browser
```

All quiz scoring happens **server-side**: the quiz form POSTs `answers[qN]=<optionIndex>` to `POST /results`, which tallies scores against `quiz.json`'s option weights and renders `results.ejs` in one request. No client-side scoring logic exists.

### Routes and their data dependencies

| Route | Method | Template | Data passed |
|-------|--------|----------|-------------|
| `/` | GET | `index.ejs` | `pathways` |
| `/quiz` | GET | `quiz.ejs` | `quiz` |
| `/results` | POST | `results.ejs` | computed: `topPathway`, `also`, `breakdown`, `scores` |
| `/results` | GET | — | redirects to `/quiz` |
| `/explore` | GET | `explore.ejs` | `pathways`, `shsm` |
| `/planner` | GET | `planner.ejs` | `courses`, `pathways` |
| `/about` | GET | `about.ejs` | none |

### Template system

Views use **EJS partials** — no layout engine. Every page template begins and ends with:
```ejs
<%- include('header', { title: 'Page Title', currentPage: 'routeId' }) %>
...
<%- include('footer') %>
```

`header.ejs` opens `<html>`, renders the nav, and opens `<main>`. `footer.ejs` closes `</main>` and `</html>`. The `currentPage` value is matched against nav link IDs (`home`, `quiz`, `explore`, `planner`, `about`) to set the `.active` class.

### Data file schemas

**`data/pathways.json`** — Array of 4 school option objects (`local`, `specialized`, `outofarea`, `gifted`). Each has: `id`, `label`, `code`, `emoji`, `color` (hex), `description`, `details`, `pros[]`, `cons[]`, `applicationProcess`, `whoItsFor`, `keyFeatures[]`, `admissionAvg`, `interests[]`, `quizWeight{}`.

**`data/quiz.json`** — Object with `questions[]` (12 items) and `sections[]`. Each question has `id`, `section`, `sectionLabel`, `text`, `icon`, `options[]`. Each option has `label`, `icon`, `scores{}` — the scores object maps pathway IDs (`local`, `specialized`, `outofarea`, `gifted`) to integer point values (0–3). Only pathways that receive points need to be listed; missing keys default to 0.

**`data/shsm.json`** — Object with `description`, `applyNote`, `programs[]`. Each program has `id`, `name`, `icon`, `description`, `pathways[]`, `applicationProcess`, `whatToExpect`, `careers[]`. The `/explore` route passes the entire object as `shsm`; templates access `shsm.programs`.

**`data/courses.json`** — Object with `timeline[]` and `comparisonCriteria[]`. Timeline is an array of months, each with `month`, `emoji`, `year`, `description`, `tasks[]`. Each task has `id` (e.g. `sep-1`), `text`, `tip`. Task IDs are used as localStorage keys in `planner.js`.

### Client-side JavaScript

**`public/js/quiz.js`** — IIFE. Manages the multi-step wizard: shows one `.quiz-step` div at a time, updates the progress bar, validates that a radio is selected before advancing, and calls `form.submit()` on the final step. Section label mapping (question index → section name string) is hardcoded in the `sections` array — update it if quiz structure changes.

**`public/js/planner.js`** — IIFE. Two independent subsystems sharing one reset button:
1. **Checklist**: persists checkbox state to `localStorage` key `pathfinder-checklist-v1` (object of `taskId → true`). Task IDs come from `data-task` attributes on checkboxes, which match the `id` fields in `courses.json`.
2. **Comparison table**: persists school name inputs and cell values to `localStorage` key `pathfinder-comparison-v1` (object of `name-{N}` and `{critId}-{N}` keys).

### CSS conventions

`public/css/style.css` uses CSS custom properties defined on `:root`. Pathway accent colours are applied via utility classes that follow the pattern `accent-{id}`, `bg-{id}`, and `bar-{id}` — where `{id}` is one of `local`, `specialized`, `outofarea`, `gifted`. If a new pathway ID is added, add corresponding CSS classes for all three patterns.

## Content Updates

All user-facing content (quiz questions, pathway descriptions, program types, application timeline tasks) lives entirely in `data/*.json`. The server and templates require no changes for content-only edits. After editing a JSON file, restart the server — data is loaded once at startup, not on each request.

The quiz scoring keys in `quiz.json` option `scores` objects must exactly match the `id` values in `pathways.json` and the `scores` initializer object in `server.js` (line 38). Mismatches silently drop points.
