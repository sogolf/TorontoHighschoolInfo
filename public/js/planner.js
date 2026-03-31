/**
 * Find your Highschool — Application Planner client-side logic
 * Manages:
 *   - Monthly checklist accordion (open/close months)
 *   - Task checkbox state persisted to localStorage
 *   - Task completion counter
 *   - School comparison table notes persistence
 *   - Reset functionality
 */

(function () {

  const CHECKLIST_KEY = 'pathfinder-checklist-v1';
  const COMPARISON_KEY = 'pathfinder-comparison-v1';

  // ── Checklist state ──────────────────────────────────────────────────────

  function loadChecklist() {
    let state = {};
    try {
      const raw = localStorage.getItem(CHECKLIST_KEY);
      if (raw) state = JSON.parse(raw);
    } catch (e) { /* ignore */ }
    return state;
  }

  function saveChecklistState(state) {
    try { localStorage.setItem(CHECKLIST_KEY, JSON.stringify(state)); } catch (e) { /* ignore */ }
  }

  function applyChecklistState() {
    const state = loadChecklist();
    document.querySelectorAll('.checklist-checkbox').forEach(cb => {
      const id = cb.dataset.task;
      if (state[id]) {
        cb.checked = true;
        cb.closest('.checklist-task').classList.add('checklist-done');
      }
    });
    updateCounters();
  }

  // Called on each checkbox change
  window.toggleTask = function (checkbox) {
    const state = loadChecklist();
    const id = checkbox.dataset.task;
    const taskEl = checkbox.closest('.checklist-task');
    if (checkbox.checked) {
      state[id] = true;
      taskEl.classList.add('checklist-done');
    } else {
      delete state[id];
      taskEl.classList.remove('checklist-done');
    }
    saveChecklistState(state);
    updateCounters();
  };

  function updateCounters() {
    const total = document.querySelectorAll('.checklist-checkbox').length;
    const done = document.querySelectorAll('.checklist-checkbox:checked').length;

    // Global counter
    const countEl = document.getElementById('task-count');
    if (countEl) {
      countEl.textContent = done;
      countEl.className = 'credit-count' + (done >= total ? ' complete' : '');
    }

    // Per-month progress labels
    document.querySelectorAll('.checklist-month').forEach((monthEl, mi) => {
      const monthBoxes = monthEl.querySelectorAll('.checklist-checkbox');
      const monthDone = monthEl.querySelectorAll('.checklist-checkbox:checked').length;
      const prog = document.getElementById(`mprog-${mi}`);
      if (prog && monthBoxes.length > 0) {
        prog.textContent = `(${monthDone}/${monthBoxes.length})`;
        prog.style.color = monthDone === monthBoxes.length ? 'var(--green-700)' : 'var(--teal-700)';
      }
    });
  }

  // ── Month accordion ──────────────────────────────────────────────────────

  window.toggleMonth = function (mi) {
    const monthEl = document.getElementById(`month-${mi}`);
    const toggle = document.getElementById(`month-toggle-${mi}`);
    if (!monthEl) return;
    const isOpen = monthEl.classList.toggle('open');
    if (toggle) toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    // Override the CSS ::after from faq-question by adding class
    if (toggle) toggle.classList.toggle('active-toggle', isOpen);
  };

  // Open the first month automatically
  window.toggleMonth(0);

  // Keyboard support for month toggles
  document.querySelectorAll('.faq-question').forEach(q => {
    q.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); q.click(); }
    });
  });

  // ── School comparison ────────────────────────────────────────────────────

  function loadComparison() {
    try {
      const raw = localStorage.getItem(COMPARISON_KEY);
      return raw ? JSON.parse(raw) : {};
    } catch (e) { return {}; }
  }

  window.saveComparison = function () {
    const data = {};
    document.querySelectorAll('.school-name-input').forEach(inp => {
      data[`name-${inp.dataset.school}`] = inp.value;
    });
    document.querySelectorAll('.comparison-cell').forEach(inp => {
      data[`${inp.dataset.crit}-${inp.dataset.school}`] = inp.value;
    });
    try { localStorage.setItem(COMPARISON_KEY, JSON.stringify(data)); } catch (e) { /* ignore */ }
  };

  function applyComparison() {
    const data = loadComparison();
    document.querySelectorAll('.school-name-input').forEach(inp => {
      const val = data[`name-${inp.dataset.school}`];
      if (val) inp.value = val;
    });
    document.querySelectorAll('.comparison-cell').forEach(inp => {
      const val = data[`${inp.dataset.crit}-${inp.dataset.school}`];
      if (val) inp.value = val;
    });
  }

  // ── Reset ────────────────────────────────────────────────────────────────

  window.resetChecklist = function () {
    if (!confirm('Reset your entire planner? All checked tasks and comparison notes will be cleared.')) return;
    try {
      localStorage.removeItem(CHECKLIST_KEY);
      localStorage.removeItem(COMPARISON_KEY);
    } catch (e) { /* ignore */ }

    // Uncheck all boxes
    document.querySelectorAll('.checklist-checkbox').forEach(cb => {
      cb.checked = false;
      cb.closest('.checklist-task').classList.remove('checklist-done');
    });

    // Clear comparison table
    document.querySelectorAll('.school-name-input, .comparison-cell').forEach(inp => {
      inp.value = '';
    });

    updateCounters();
  };

  // ── Init ─────────────────────────────────────────────────────────────────

  applyChecklistState();
  applyComparison();

})();
