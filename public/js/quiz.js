/**
 * Find your Highschool — Quiz client-side logic
 * Multi-step wizard: shows one question at a time, tracks answers,
 * validates selection before advancing, submits to /results.
 */

(function () {
  const form = document.getElementById('quiz-form');
  const steps = Array.from(document.querySelectorAll('.quiz-step'));
  const btnBack = document.getElementById('btn-back');
  const btnNext = document.getElementById('btn-next');
  const progressBar = document.getElementById('progress-bar');
  const sectionLabel = document.getElementById('section-label');
  const qCounter = document.getElementById('q-counter');
  const stepDisplay = document.getElementById('step-display');

  const total = steps.length;
  let current = 0;

  // Section info baked into DOM via data attrs (we'll read from the labels)
  const sections = [
    { start: 0, end: 1, label: 'Section 1 of 3 — Your Interests & Strengths' },
    { start: 2, end: 3, label: 'Section 2 of 3 — Your Preferences & Situation' },
    { start: 4, end: 5, label: 'Section 3 of 3 — Your Goals & Next Steps' }
  ];

  function getSectionLabel(idx) {
    for (const s of sections) {
      if (idx >= s.start && idx <= s.end) return s.label;
    }
    return '';
  }

  function updateUI() {
    // Show current step
    steps.forEach((s, i) => s.classList.toggle('active', i === current));

    // Update progress bar
    const pct = ((current + 1) / total) * 100;
    progressBar.style.width = pct + '%';
    progressBar.parentElement.setAttribute('aria-valuenow', current + 1);

    // Update labels
    sectionLabel.textContent = getSectionLabel(current);
    qCounter.textContent = `Question ${current + 1} of ${total}`;
    stepDisplay.textContent = `${current + 1} / ${total}`;

    // Back button
    btnBack.disabled = current === 0;

    // Next/Submit button
    if (current === total - 1) {
      btnNext.textContent = '✅ See My Results';
      btnNext.className = 'btn btn-secondary';
    } else {
      btnNext.textContent = 'Next →';
      btnNext.className = 'btn btn-primary';
    }

    // Focus first option for accessibility
    const firstOption = steps[current].querySelector('.quiz-option');
    if (firstOption) firstOption.focus();
  }

  function getSelectedInput(stepEl) {
    return stepEl.querySelector('input[type="radio"]:checked');
  }

  function showError(stepEl) {
    // Brief shake animation on unanswered question
    stepEl.style.animation = 'none';
    stepEl.offsetHeight; // reflow
    stepEl.style.animation = '';

    let msg = stepEl.querySelector('.quiz-error-msg');
    if (!msg) {
      msg = document.createElement('p');
      msg.className = 'quiz-error-msg';
      msg.style.cssText = 'color:#b91c1c;font-size:.9rem;margin-top:.75rem;font-weight:600';
      msg.textContent = '⚠️ Please select an answer before continuing.';
      stepEl.appendChild(msg);
    }
    msg.style.display = 'block';
    setTimeout(() => { if (msg) msg.style.display = 'none'; }, 3000);
  }

  // Navigate forward/back
  window.quizNav = function (direction) {
    if (direction === 1) {
      // Validate current step has an answer
      if (!getSelectedInput(steps[current])) {
        showError(steps[current]);
        return;
      }
      if (current === total - 1) {
        // Final step — submit the form
        form.submit();
        return;
      }
      current++;
    } else {
      current = Math.max(0, current - 1);
    }
    updateUI();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Style selected option with visual feedback
  function setupOptionListeners() {
    document.querySelectorAll('.quiz-option').forEach(label => {
      label.addEventListener('click', () => {
        const input = label.querySelector('input');
        const stepEl = label.closest('.quiz-step');
        // Clear siblings
        stepEl.querySelectorAll('.quiz-option').forEach(l => l.classList.remove('selected'));
        label.classList.add('selected');
        if (input) input.checked = true;
        // Clear error
        const msg = stepEl.querySelector('.quiz-error-msg');
        if (msg) msg.style.display = 'none';
      });

      // Keyboard: space/enter selects option
      label.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          label.click();
        }
      });

      // Make labels keyboard-focusable
      if (!label.getAttribute('tabindex')) {
        label.setAttribute('tabindex', '0');
      }
    });
  }

  // Keyboard navigation: arrow keys move between options within a step
  document.addEventListener('keydown', e => {
    const stepEl = steps[current];
    const options = Array.from(stepEl.querySelectorAll('.quiz-option'));
    const focused = document.activeElement;
    const focusedIdx = options.indexOf(focused);

    if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
      e.preventDefault();
      const next = options[(focusedIdx + 1) % options.length];
      if (next) next.focus();
    } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
      e.preventDefault();
      const prev = options[(focusedIdx - 1 + options.length) % options.length];
      if (prev) prev.focus();
    } else if (e.key === 'Enter' && !focused.closest('.btn')) {
      // Don't conflict with button Enter
      if (options.includes(focused)) focused.click();
    }
  });

  // Restore previously selected answers (back button)
  function restoreSelections() {
    document.querySelectorAll('.quiz-option input[type="radio"]').forEach(input => {
      if (input.checked) {
        input.closest('.quiz-option').classList.add('selected');
      }
    });
  }

  setupOptionListeners();
  restoreSelections();
  updateUI();
})();
