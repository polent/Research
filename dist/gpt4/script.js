const themeToggle = document.getElementById('theme-toggle');
const pageShell = document.querySelector('.page-shell');
const storedTheme = localStorage.getItem('preferred-theme');

function applyTheme(theme) {
  if (theme === 'dark') {
    pageShell.dataset.theme = 'dark';
    themeToggle.setAttribute('aria-pressed', 'true');
    themeToggle.querySelector('.theme-label').textContent = 'Dark';
  } else if (theme === 'light') {
    pageShell.dataset.theme = 'light';
    themeToggle.setAttribute('aria-pressed', 'false');
    themeToggle.querySelector('.theme-label').textContent = 'Light';
  } else {
    pageShell.dataset.theme = 'auto';
    themeToggle.setAttribute('aria-pressed', 'false');
    themeToggle.querySelector('.theme-label').textContent = 'Auto';
  }
}

function detectSystemTheme() {
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function initTheme() {
  if (storedTheme === 'light' || storedTheme === 'dark') {
    applyTheme(storedTheme);
  } else {
    applyTheme('auto');
  }
}

themeToggle.addEventListener('click', () => {
  const current = pageShell.dataset.theme;
  const next = current === 'dark' ? 'light' : current === 'light' ? 'auto' : 'dark';
  localStorage.setItem('preferred-theme', next);
  applyTheme(next);
});

window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
  if (!localStorage.getItem('preferred-theme')) {
    applyTheme('auto');
  }
});

initTheme();
