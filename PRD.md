aaaaaaaaasadhot# Ontario Pathfinder — Product Requirements Document

**Version:** 1.0 (MVP)
**Date:** 2025
**Status:** Draft — ready for review

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Problem Statement](#2-problem-statement)
3. [Target Users & Personas](#3-target-users--personas)
4. [Goals & Success Metrics](#4-goals--success-metrics)
5. [Functional Requirements](#5-functional-requirements)
6. [Non-Functional Requirements](#6-non-functional-requirements)
7. [User Stories](#7-user-stories)
8. [Feature Specifications](#8-feature-specifications)
9. [Information Architecture](#9-information-architecture)
10. [Data Requirements](#10-data-requirements)
11. [Technical Requirements](#11-technical-requirements)
12. [Out of Scope](#12-out-of-scope)
13. [Risks & Mitigations](#13-risks--mitigations)
14. [Timeline](#14-timeline)

---

## 1. Executive Summary

**Ontario Pathfinder** is a free, interactive web tool designed to help Ontario Grade 9 and 10 students navigate the province's complex high school pathway system. The tool offers:

- A **12-question interest and learning-style quiz** that recommends one of four OSSD destination pathways (University, College, Apprenticeship/Trades, Workplace)
- A **Pathway Explorer** with detailed descriptions, career outcomes, and SHSM program information
- An **interactive 4-year Course Planner** that tracks the 30-credit OSSD requirement

Ontario's school guidance system averages just **38 minutes of 1-on-1 counselor time per student per year**. Ontario Pathfinder fills this gap with an always-available, personalized, and engaging exploration experience — helping students make better-informed pathway decisions at the critical Grade 9 inflection point.

The MVP is a **Node.js + Express** web application using EJS templates, vanilla CSS/JS, and JSON flat files — no database or login required.

---

## 2. Problem Statement

### 2.1 The complexity challenge

Ontario's OSSD pathway system is one of the most multidimensional in Canada:

- **4 destination codes** (U, C, E, O) applied across Grade 11–12 courses
- **18 mandatory + 12 elective credits** required for graduation (30 total)
- **14 SHSM sectors** available alongside any pathway
- **Prerequisite chains** that lock or unlock post-secondary options
- **Destreaming changes** (2021) that altered the Grade 9 landscape

### 2.2 The guidance gap

- Ontario guidance counselors serve 400–600+ students each
- Average counselor-to-student time: **38 minutes/year** (Ontario School Counsellors' Association data)
- Most students make pathway-defining choices in Grade 9 **without adequate information**

### 2.3 Consequences of poor early choices

- Students who select the wrong destination code in Grade 9/10 often lack prerequisite courses needed for Grade 11/12
- Switching from Workplace to University pathway in Grade 11 may require repeating multiple courses
- Students from lower socioeconomic backgrounds or without university-educated parents are disproportionately affected

### 2.4 Existing solutions gap

Existing resources (ontario.ca, school board websites) are information-dense and not interactive. No free, student-centred, quiz-driven tool exists to bridge this gap.

---

## 3. Target Users & Personas

### Primary: Grade 9–10 Ontario Students

**Persona A — "Undecided Alex" (Grade 9, age 14)**
- Has no clear career direction
- Feels overwhelmed by pathway choices
- Needs: a low-pressure, engaging way to explore options
- Motivation: wants to keep options open but needs a starting point

**Persona B — "Trades-curious Taylor" (Grade 10, age 15)**
- Loves working with hands, not academically motivated
- Parents expect university; Taylor is unsure
- Needs: validation that trades/apprenticeship is a legitimate, well-paying path
- Motivation: understand what apprenticeship actually looks like

**Persona C — "Ambitious Priya" (Grade 9, age 14)**
- High-achieving, interested in medicine or engineering
- Needs: to understand which Grade 9/10 choices are critical for university
- Motivation: avoid missing prerequisites for competitive programs

### Secondary: Parents

**Persona D — "Skeptical Parent"**
- May not understand modern Ontario curriculum (vs. their own experience)
- Needs: clear explanation of pathways, reassurance about child's choices
- Use case: reviews tool together with child, shares results

### Tertiary: Guidance Counselors

**Persona E — "Overloaded Counselor"**
- Serves 400+ students with limited time
- Needs: a tool to recommend to students for self-directed exploration before 1-on-1 appointments
- Use case: assigns Ontario Pathfinder as pre-appointment homework

---

## 4. Goals & Success Metrics

### Product Goals

| Goal | Metric | MVP Target |
|------|--------|------------|
| Students complete the quiz | Quiz completion rate | ≥ 65% |
| Students find value | Bounce rate on results page | < 40% |
| Meaningful engagement | Avg. time on site | ≥ 4 minutes |
| Return use | Return visitor rate | ≥ 20% |
| Planner adoption | Planner page visits / total visits | ≥ 25% |
| User satisfaction | Post-session survey (optional) | ≥ 4.0 / 5.0 |

### Business Goals (post-MVP)

- Establish Ontario Pathfinder as a trusted, recommended resource for Ontario school boards
- Maintain zero cost to students (ad-free, no freemium upsell)

---

## 5. Functional Requirements

### FR-01: Pathway Quiz Engine

| ID | Requirement |
|----|-------------|
| FR-01.1 | Present 12 questions across 3 sections (interests, learning style, goals) |
| FR-01.2 | One question visible at a time (multi-step wizard) |
| FR-01.3 | Show progress bar with section and question count |
| FR-01.4 | Require answer before advancing; show inline error if skipped |
| FR-01.5 | Allow back navigation to change answers |
| FR-01.6 | Calculate scores across 4 pathway buckets (university, college, trades, workplace) |
| FR-01.7 | Submit scores to server and render personalized results page |
| FR-01.8 | Support keyboard navigation (arrow keys, Enter, Tab) |

### FR-02: Results Page

| ID | Requirement |
|----|-------------|
| FR-02.1 | Display top recommended pathway with name, emoji, and description |
| FR-02.2 | Show confidence breakdown bar chart (CSS-only, no canvas/D3) |
| FR-02.3 | List "also consider" pathways with percentage scores |
| FR-02.4 | Show key courses, careers, and post-secondary route for top pathway |
| FR-02.5 | Provide CTAs to Pathway Explorer and Course Planner |
| FR-02.6 | If quiz not completed (GET /results), redirect to /quiz |

### FR-03: Pathway Explorer

| ID | Requirement |
|----|-------------|
| FR-03.1 | Display all 4 pathways as expandable cards |
| FR-03.2 | Each card includes: destination code, description, key subjects, careers, post-secondary, admission average, interests |
| FR-03.3 | Filter/highlight individual pathways via filter bar |
| FR-03.4 | Display SHSM program sidebar with all 14 sectors |
| FR-03.5 | Click SHSM program to show inline detail panel |
| FR-03.6 | Deep link to specific pathway via URL hash (#university, #college, etc.) |

### FR-04: Course Planner

| ID | Requirement |
|----|-------------|
| FR-04.1 | Display 4-column grid: Grade 9 | 10 | 11 | 12 |
| FR-04.2 | Pre-populate mandatory courses per grade with credit values |
| FR-04.3 | Provide elective dropdown slots per grade (2–4 slots each) |
| FR-04.4 | Adding an elective creates a course card with remove button |
| FR-04.5 | Credit counter updates in real time as electives are added/removed |
| FR-04.6 | Persist plan in localStorage (survives page refresh) |
| FR-04.7 | "Reset" button clears all electives with confirmation |
| FR-04.8 | Print-friendly CSS for saving plan to PDF |
| FR-04.9 | Pathway selector filters context (saves preference to localStorage) |

### FR-05: About Page

| ID | Requirement |
|----|-------------|
| FR-05.1 | Explain OSSD structure, destination codes, credit requirements |
| FR-05.2 | Explain Grade 9 destreaming (2021 changes) |
| FR-05.3 | Explain SHSM program structure and benefits |
| FR-05.4 | FAQ section with at least 6 common questions |
| FR-05.5 | Links to official Ontario government resources |
| FR-05.6 | Prominent disclaimer that tool is not official Ontario advice |

### FR-06: Navigation

| ID | Requirement |
|----|-------------|
| FR-06.1 | Persistent top navigation on all pages |
| FR-06.2 | Active state for current page |
| FR-06.3 | Mobile hamburger menu for screens < 768px |
| FR-06.4 | "Find My Path →" CTA button always visible in nav |
| FR-06.5 | Footer with quick links and disclaimer |

---

## 6. Non-Functional Requirements

### 6.1 Accessibility (WCAG 2.1 AA)

- All interactive elements keyboard-accessible
- ARIA labels on progress bars, option groups, buttons
- Colour contrast ratio ≥ 4.5:1 for all text
- Focus indicators visible on all interactive elements
- Form elements have associated labels
- Error messages announced to screen readers

### 6.2 Performance

- Page load ≤ 2s on a 4G connection (no external CDN dependencies)
- No JavaScript frameworks — vanilla JS only
- CSS ≤ 20KB unminified
- No blocking render resources

### 6.3 Mobile-Friendliness

- Responsive layout from 320px to 1440px
- Touch-friendly tap targets (≥ 44×44px)
- No horizontal scrolling on any viewport
- Planner grid collapses to single column on small screens

### 6.4 Privacy & Security

- No user accounts or login
- No personal data collected or stored on server
- Quiz answers calculated server-side from POST body — no persistence
- localStorage used only for course planner state (no PII)
- No third-party trackers or analytics (MVP)

### 6.5 Internationalisation

- English only for MVP
- Architecture prepared for French (Canadian French) as a future addition
- String content in EJS templates (not hardcoded in JS) for future i18n

### 6.6 Compatibility

- Modern browsers: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
- No IE11 support required

---

## 7. User Stories

**US-01** As an undecided Grade 9 student, I want to answer a short quiz about my interests so that I can get a pathway recommendation tailored to me.

**US-02** As a student who wants to understand my results, I want to see a visual breakdown of how I scored across all four pathways so that I can understand why I was recommended a particular path.

**US-03** As a student considering trades, I want to read about the Apprenticeship pathway in detail — including careers and typical earnings — so that I can see it is a respected and well-paying choice.

**US-04** As a Grade 10 student who changed my mind about university, I want to explore the College pathway and see which Grade 11 courses I should take instead.

**US-05** As a parent, I want to review my child's quiz results with them so that we can discuss pathway options at home before visiting the guidance counselor.

**US-06** As a guidance counselor, I want to recommend a self-service tool to students before appointments so that our limited time together is spent on nuanced advice, not basic explanations.

**US-07** As a student interested in a career in tech, I want to explore the SHSM ICT program so that I can see how it overlaps with both College and University pathways.

**US-08** As a student, I want to build my 4-year course plan so that I can see how many credits I have and what I still need to fill.

**US-09** As a student, I want to save my course plan so that it's still there when I return to the site.

**US-10** As a student, I want to print my course plan so that I can bring it to my guidance counselor appointment.

**US-11** As a keyboard user, I want to complete the quiz using only keyboard navigation so that the tool is accessible to me.

**US-12** As a mobile user, I want the quiz and planner to work well on my phone so that I can use the tool anywhere.

**US-13** As a student, I want clear language explaining what "destination codes" mean so that I understand the course system without jargon.

**US-14** As a student, I want to be told clearly that this tool gives suggestions, not official advice, so that I know to also consult my school.

**US-15** As a student who took the quiz, I want to retake it so that I can see how different answers change the recommendation.

---

## 8. Feature Specifications

### 8.1 Quiz Engine

**Scoring algorithm:**
Each question has 4 options. Each option has a `scores` object mapping pathway IDs to point values (0–3). On form submission, the server iterates through all 12 submitted answers, looks up the corresponding option's scores, and accumulates totals for each pathway. The pathway with the highest total score is recommended. Percentage displayed = `(pathway_score / total_score_all_pathways) × 100`.

**Tie handling:** If two pathways tie, the first in the JSON array order wins (University > College > Trades > Workplace). A tie message ("You're equally matched for these two pathways") is shown on the results page.

**Edge case — no answers submitted:** GET /results redirects to /quiz. This prevents direct URL access to results.

### 8.2 SHSM Detail Panel

The SHSM sidebar embeds the full program data as a JSON `<script type="application/json">` tag, which the client-side JS reads without an additional API call. Clicking a program name renders a detail card with description, sample courses, careers, and compatible pathways.

### 8.3 Planner Persistence

The planner saves the current elective selections to `localStorage` under the key `pathfinder-plan-v1`. The data structure is:
```json
{
  "9":  [{ "code": "AVI1O", "name": "Visual Arts", "credits": "1" }],
  "10": [],
  "11": [],
  "12": []
}
```
On page load, saved electives are re-injected into the DOM before mandatory credits are counted, giving an accurate running total.

### 8.4 Credit Counter

Credits are counted by scanning `.planner-course-credits` elements in the DOM. Mandatory credits are pre-rendered server-side. Elective credits are added/removed dynamically. The counter turns green when the total reaches 30.

---

## 9. Information Architecture

```
/ (Home)
├── /quiz              → Multi-step pathway quiz
│   └── POST /results  → Quiz results + recommendation
├── /explore           → Pathway Explorer
│   └── #university, #college, #trades, #workplace, #shsm
├── /planner           → 4-year course planner
└── /about             → About, FAQ, OSSD explanation
    └── #destreaming, #switching, #shsm, #tool, #faq
```

**Navigation priority order:** Home → Quiz → Explore → Planner → About

---

## 10. Data Requirements

### 10.1 Pathway Data Model (`data/pathways.json`)

```typescript
interface Pathway {
  id: 'university' | 'college' | 'trades' | 'workplace';
  label: string;           // Display name
  code: 'U' | 'C' | 'E' | 'O';
  emoji: string;           // Single emoji icon
  color: string;           // CSS hex colour for accents
  description: string;     // One-paragraph overview
  details: string;         // Extended details (course codes, application process)
  careers: string[];       // 8–10 career examples
  postSecondary: string;   // Post-secondary route description
  keySubjects: string[];   // 5–6 key Grade 11/12 courses with codes
  admissionAvg: string;    // Admission average range or note
  interests: string[];     // 4 interest descriptors for matching
  quizWeight: {            // Legacy: not used in current scoring
    academic: number;
    handson: number;
    creative: number;
    social: number;
  };
}
```

### 10.2 Quiz Data Model (`data/quiz.json`)

```typescript
interface Question {
  id: number;              // 1–12
  section: 'interests' | 'learning' | 'goals';
  sectionLabel: string;
  text: string;            // Question text
  icon: string;            // Single emoji
  options: Option[];       // Always 4 options
}

interface Option {
  label: string;
  icon: string;
  scores: Partial<Record<'university' | 'college' | 'trades' | 'workplace', number>>;
}
```

**Scoring range per question:** 0–3 points per pathway. Maximum possible score per pathway = 36 (12 questions × 3 max points). Actual max lower due to score distribution across pathways.

### 10.3 Courses Data Model (`data/courses.json`)

Two arrays: `mandatory` (pre-rendered in planner) and `electives` (available in dropdowns). Each course has `subject`, `code`, `grade`, `destination`, `pathway`, `area`, and `description` fields.

### 10.4 SHSM Data Model (`data/shsm.json`)

14 programs, each with `id`, `name`, `icon`, `description`, `pathways[]`, `careers[]`, and `sampleCourses[]`.

---

## 11. Technical Requirements

### 11.1 Stack

| Layer | Choice | Version |
|-------|--------|---------|
| Runtime | Node.js | ≥ 18.0.0 |
| Server | Express | ^4.18 |
| Templates | EJS | ^3.1 |
| Styling | Vanilla CSS | N/A |
| Interactivity | Vanilla JS | ES2020+ |
| Data | JSON flat files | N/A |
| Database | None | — |
| Auth | None | — |

### 11.2 Dependencies

```json
{
  "express": "^4.18.2",
  "ejs": "^3.1.9",
  "body-parser": "^1.20.2"
}
```

No dev dependencies required for MVP.

### 11.3 Server Architecture

- Single `server.js` file handles all routing
- Data files loaded synchronously at startup (acceptable for flat JSON files)
- EJS templates include `header.ejs` and `footer.ejs` partials (no layout engine)
- Static files served from `public/` via `express.static`
- POST body parsed via `body-parser` (urlencoded + json)

### 11.4 File Structure

```
/Users/fathian/myproject/
├── PRD.md
├── package.json
├── server.js
├── data/
│   ├── pathways.json
│   ├── quiz.json
│   ├── courses.json
│   └── shsm.json
├── views/
│   ├── header.ejs
│   ├── footer.ejs
│   ├── layout.ejs      (placeholder)
│   ├── index.ejs
│   ├── quiz.ejs
│   ├── results.ejs
│   ├── explore.ejs
│   ├── planner.ejs
│   └── about.ejs
└── public/
    ├── css/
    │   └── style.css
    └── js/
        ├── quiz.js
        └── planner.js
```

### 11.5 Port & Environment

- Default port: `3000`
- Environment variable `PORT` can override (for future deployment)
- No `.env` file required for MVP

---

## 12. Out of Scope

The following items are **explicitly excluded from the MVP**:

| Feature | Reason Excluded |
|---------|-----------------|
| User accounts / login | Increases complexity, reduces privacy |
| Real-time school lookup | Requires live data API from school boards |
| OUAC live integration | OUAC data is private and API-restricted |
| Ontario school board data | Each board has different elective offerings |
| Course prerequisite validation | Requires complex rules engine |
| Bilingual (French) support | Content translation deferred to v1.1 |
| Analytics / tracking | Privacy-first approach for MVP |
| Admin dashboard | No CMS or content management needed |
| Mobile app (iOS/Android) | Web-first approach |
| AI chat / counselor simulation | Out of scope; raises liability concerns |
| Real-time grade calculator | Requires student login and school data |
| Sharing / social features | Out of scope for MVP |

---

## 13. Risks & Mitigations

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| Ontario curriculum changes invalidating data | Medium | High | Add "Data last updated: [date]" notice; establish annual review process |
| Quiz scoring perceived as biased toward university | Medium | Medium | Ensure equal question weight across all 4 pathways; add disclaimer on results page |
| Students treating quiz result as prescriptive | High | Medium | Prominent messaging: "This is a starting point, not a final answer" on results page |
| Guidance counselors discouraging use (liability) | Low | Medium | Maintain clear disclaimer; position as exploration tool, not decision tool |
| Outdated SHSM program list | Medium | Low | SHSM programs listed as of 2024–25; link to official Ontario SHSM page for current list |
| LocalStorage unavailable (private browsing) | Low | Low | Graceful fail — planner works without persistence; warn user if save fails |
| Screen reader compatibility issues | Low | High | Test with NVDA/VoiceOver; use semantic HTML and ARIA attributes throughout |

---

## 14. Timeline

### Phase 1 — MVP (Completed)

| Milestone | Deliverable |
|-----------|-------------|
| ✅ Data architecture | pathways.json, quiz.json, courses.json, shsm.json |
| ✅ Server setup | Express routes, EJS template system |
| ✅ Design system | CSS custom properties, component library |
| ✅ Landing page | Hero, pathway cards, how-it-works, SHSM teaser |
| ✅ Quiz engine | 12-question wizard, scoring, results page |
| ✅ Pathway explorer | All 4 pathways + SHSM sidebar with detail panel |
| ✅ Course planner | 4-year grid, credit counter, localStorage persistence |
| ✅ About page | OSSD explainer, FAQ, official resource links |
| ✅ PRD | This document |

### Phase 2 — v1.1 (Future)

- French (Canadian French) language support
- Expanded elective options in planner (all 150+ Ontario courses)
- SHSM program detail pages
- Prerequisite chain visualizer
- Shareable plan via URL (base64-encoded state, no login)

### Phase 3 — v2.0 (Future)

- School board customization layer (each board can add local electives)
- Counselor dashboard (assign quiz to students, see aggregate results)
- Career pathway map (visual mind-map of career to courses)
- Bilingual admin interface

---

*This PRD was authored for the Ontario Pathfinder MVP. All curriculum information is based on Ontario Ministry of Education policy as of the 2024–25 school year. Always verify current requirements with your school.*
