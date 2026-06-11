(function () {
  var STORAGE_KEY = 'medhub-theme';

  function getPreferredTheme () {
    try {
      var stored = localStorage.getItem(STORAGE_KEY);
      if (stored === 'light' || stored === 'dark') return stored;
    } catch (e) { /* ignore */ }
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light';
  }

  function applyTheme (theme) {
    document.documentElement.setAttribute('data-theme', theme === 'dark' ? 'dark' : 'light');
  }

  applyTheme(getPreferredTheme());

  function updateToggleButtons (theme) {
    document.querySelectorAll('[data-theme-toggle]').forEach(function (btn) {
      var isDark = theme === 'dark';
      btn.setAttribute('aria-pressed', isDark ? 'true' : 'false');
      btn.title = isDark ? 'Ativar modo claro' : 'Ativar modo escuro';
      btn.setAttribute('aria-label', btn.title);
      var label = btn.querySelector('.theme-toggle-label');
      if (label) label.textContent = isDark ? 'Claro' : 'Escuro';
      var icon = btn.querySelector('.theme-toggle-icon');
      if (icon) icon.textContent = isDark ? '☀️' : '🌙';
    });
  }

  function setTheme (theme) {
    var next = theme === 'dark' ? 'dark' : 'light';
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch (e) { /* ignore */ }
    applyTheme(next);
    updateToggleButtons(next);
  }

  function toggleTheme () {
    var current = document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
    setTheme(current === 'dark' ? 'light' : 'dark');
  }

  function createToggleButton () {
    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'theme-toggle';
    btn.setAttribute('data-theme-toggle', '');
    btn.innerHTML = '<span class="theme-toggle-icon" aria-hidden="true">🌙</span><span class="theme-toggle-label">Escuro</span>';
    btn.addEventListener('click', toggleTheme);
    return btn;
  }

  function mountThemeToggle () {
    if (document.querySelector('[data-theme-toggle]')) {
      updateToggleButtons(document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light');
      document.querySelectorAll('[data-theme-toggle]').forEach(function (btn) {
        if (!btn.dataset.themeBound) {
          btn.dataset.themeBound = '1';
          btn.addEventListener('click', toggleTheme);
        }
      });
      return;
    }

    var target = document.querySelector('.landing-header-actions')
      || document.querySelector('.header-actions')
      || document.querySelector('header');
    if (!target) return;

    var btn = createToggleButton();
    target.appendChild(btn);
    updateToggleButtons(document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light');
  }

  window.toggleTheme = toggleTheme;
  window.setMedhubTheme = setTheme;

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', mountThemeToggle);
  } else {
    mountThemeToggle();
  }
})();
