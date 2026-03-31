const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// Load data
const pathways = JSON.parse(fs.readFileSync(path.join(__dirname, 'data/pathways.json'), 'utf8'));
const quiz = JSON.parse(fs.readFileSync(path.join(__dirname, 'data/quiz.json'), 'utf8'));
const courses = JSON.parse(fs.readFileSync(path.join(__dirname, 'data/courses.json'), 'utf8'));
const shsm = JSON.parse(fs.readFileSync(path.join(__dirname, 'data/shsm.json'), 'utf8'));

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// View engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// ── Routes ──────────────────────────────────────────────────────────────────

// Landing page
app.get('/', (req, res) => {
  res.render('index', { pathways });
});

// Quiz page
app.get('/quiz', (req, res) => {
  res.render('quiz', { quiz });
});

// Results page (POST from quiz form)
app.post('/results', (req, res) => {
  const scores = { local: 0, specialized: 0, outofarea: 0, gifted: 0 };

  // Tally scores from submitted answers
  const answers = req.body.answers || {};
  quiz.questions.forEach(q => {
    const selectedIndex = parseInt(answers[`q${q.id}`], 10);
    if (!isNaN(selectedIndex) && q.options[selectedIndex]) {
      const optionScores = q.options[selectedIndex].scores;
      Object.keys(optionScores).forEach(key => {
        if (scores[key] !== undefined) {
          scores[key] += optionScores[key];
        }
      });
    }
  });

  // Sort pathways by score descending
  const ranked = Object.entries(scores)
    .sort((a, b) => b[1] - a[1])
    .map(([id, score]) => ({ id, score }));

  const total = Object.values(scores).reduce((s, v) => s + v, 0) || 1;
  const topId = ranked[0].id;
  const topPathway = pathways.find(p => p.id === topId);
  const also = ranked.slice(1).map(r => ({
    ...pathways.find(p => p.id === r.id),
    score: r.score,
    pct: Math.round((r.score / total) * 100)
  }));

  const breakdown = ranked.map(r => ({
    ...pathways.find(p => p.id === r.id),
    score: r.score,
    pct: Math.round((r.score / total) * 100)
  }));

  res.render('results', { topPathway, also, breakdown, scores });
});

// Results GET (allow direct visit with empty scores)
app.get('/results', (req, res) => {
  res.redirect('/quiz');
});

// Pathway explorer
app.get('/explore', (req, res) => {
  res.render('explore', { pathways, shsm });
});

// Course planner
app.get('/planner', (req, res) => {
  res.render('planner', { courses, pathways });
});

// About page
app.get('/about', (req, res) => {
  res.render('about');
});

// ── Start server ─────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`Find your Highschool running at http://localhost:${PORT}`);
});
