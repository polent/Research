(() => {
  "use strict";

  const STORAGE_KEY = "hh-cv-theme";
  const root = document.documentElement;
  const toggle = document.getElementById("themeToggle");
  const printBtn = document.getElementById("printBtn");
  const yearEl = document.getElementById("year");

  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  const mql = window.matchMedia("(prefers-color-scheme: dark)");

  const stored = (() => {
    try { return localStorage.getItem(STORAGE_KEY); }
    catch { return null; }
  })();

  const applyTheme = (theme) => {
    root.dataset.theme = theme;
    const effective = theme === "auto" ? (mql.matches ? "dark" : "light") : theme;
    if (toggle) {
      toggle.setAttribute("aria-pressed", effective === "dark" ? "true" : "false");
      toggle.setAttribute("aria-label",
        effective === "dark" ? "Switch to light theme" : "Switch to dark theme");
    }
    const meta = document.querySelector('meta[name="theme-color"]:not([media])');
    if (meta) meta.setAttribute("content", effective === "dark" ? "#0b0d10" : "#fafaf7");
  };

  applyTheme(stored === "light" || stored === "dark" ? stored : "auto");

  mql.addEventListener("change", () => {
    if (root.dataset.theme === "auto") applyTheme("auto");
  });

  if (toggle) {
    toggle.addEventListener("click", () => {
      const current = root.dataset.theme === "auto"
        ? (mql.matches ? "dark" : "light")
        : root.dataset.theme;
      const next = current === "dark" ? "light" : "dark";
      applyTheme(next);
      try { localStorage.setItem(STORAGE_KEY, next); } catch { /* ignore */ }
    });
  }

  if (printBtn) {
    printBtn.addEventListener("click", () => window.print());
  }
})();
