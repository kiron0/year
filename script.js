/*
        =========================================================
          * Core Logic & Interactivity
          * Author: Al Nahian (@alnahian2003)
        =========================================================
*/

// Array of available themes corresponding to CSS classes, sorted by popularity
const themes = [
  "theme-default",
  "theme-shadcn",
  "theme-github",
  "theme-win7",
  "theme-cyberpunk",
  "theme-clay",
  "theme-win95",
  "theme-brutal",
];

// Retrieve saved theme from localStorage, default to 0 if none exists
let currentThemeIndex =
  parseInt(localStorage.getItem("yearProgressThemeIndex"), 10) || 0;
if (currentThemeIndex < 0 || currentThemeIndex >= themes.length) {
  currentThemeIndex = 0;
}
let lastDaysPassed = -1;
let currentYear = new Date().getFullYear();

const pageUrlParams = new URLSearchParams(window.location.search);

function themeIndexFromQuery(value) {
  if (value === null || value === "") return null;
  const raw = String(value).trim().toLowerCase();
  const className = raw.startsWith("theme-") ? raw : "theme-" + raw;
  const idx = themes.indexOf(className);
  return idx >= 0 ? idx : null;
}

const themeFromQuery = themeIndexFromQuery(pageUrlParams.get("theme"));
if (themeFromQuery !== null) {
  currentThemeIndex = themeFromQuery;
  localStorage.setItem("yearProgressThemeIndex", currentThemeIndex);
}

const hideConfigFromQuery = pageUrlParams.has("hide_config");

// Apply theme immediately on load (after URL override)
document.body.className = themes[currentThemeIndex];

const actionButtonsEl = document.getElementById("action-buttons");
if (hideConfigFromQuery && actionButtonsEl) {
  actionButtonsEl.classList.add("hide-config-ui");
}

// Theme Switcher Logic (Button + Double Click)
function switchTheme() {
  document.body.classList.remove(themes[currentThemeIndex]);
  currentThemeIndex = (currentThemeIndex + 1) % themes.length;
  document.body.classList.add(themes[currentThemeIndex]);

  // Save the newly selected theme to localStorage
  localStorage.setItem("yearProgressThemeIndex", currentThemeIndex);
}

document
  .getElementById("btn-switch-theme")
  .addEventListener("click", switchTheme);
document.body.addEventListener("dblclick", (e) => {
  if (hideConfigFromQuery) return;
  // Prevent theme switch if clicking on the action buttons
  if (!e.target.closest(".action-buttons")) {
    switchTheme();
  }
});

function buildUrlWithHideConfig() {
  const u = new URL(window.location.href);
  u.searchParams.set("hide_config", "1");
  const slug = themes[currentThemeIndex].replace(/^theme-/, "");
  u.searchParams.set("theme", slug);
  return u.toString();
}

function showCopyToast(message, isError) {
  if (typeof Toastify === "undefined") return;
  Toastify({
    text: message,
    duration: isError ? 4200 : 2600,
    gravity: "top",
    position: "right",
    stopOnFocus: true,
    className: isError ? "toast-error" : "toast-success",
  }).showToast();
}

document
  .getElementById("btn-copy-hide-config-url")
  .addEventListener("click", () => {
    const text = buildUrlWithHideConfig();
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard
        .writeText(text)
        .then(() => {
          showCopyToast("Copied to clipboard", false);
        })
        .catch(() => {
          showCopyToast("Could not copy — use the dialog", true);
          window.prompt("Copy this URL:", text);
        });
    } else {
      showCopyToast("Clipboard unavailable — copy from the dialog", true);
      window.prompt("Copy this URL:", text);
    }
  });

// Download Image Logic
document.getElementById("btn-download-img").addEventListener("click", () => {
  const actionBtns = document.getElementById("action-buttons");

  // Temporarily hide the action buttons so they don't appear in the screenshot
  actionBtns.style.display = "none";

  // Wait for all fonts to be fully loaded before rendering
  document.fonts.ready.then(() => {
    // Slight delay to ensure DOM has updated and repainted
    setTimeout(() => {
      const scale = 2; // High resolution/HD capture
      const node = document.body;

      domtoimage
        .toPng(node, {
          width: node.clientWidth * scale,
          height: node.clientHeight * scale,
          style: {
            transform: `scale(${scale})`,
            transformOrigin: "top left",
            width: node.clientWidth + "px",
            height: node.clientHeight + "px",
          },
        })
        .then((dataUrl) => {
          const link = document.createElement("a");
          link.download = `year-progress-${themes[currentThemeIndex]}.png`;
          link.href = dataUrl;
          link.click();

          // Restore the buttons immediately after capture
          actionBtns.style.display = "";
        })
        .catch((err) => {
          console.error("Screenshot failed:", err);
          actionBtns.style.display = "";
        });
    }, 300); // 300ms delay gives the browser time to paint fonts properly
  });
});

function isLeapYear(year) {
  return (year % 4 === 0 && year % 100 > 0) || year % 400 === 0;
}

// Initialize GitHub Graph Layout
function initGithub() {
  const grid = document.getElementById("gh-grid");
  grid.innerHTML = "";

  const year = new Date().getFullYear();
  const startOfYear = new Date(year, 0, 1);
  const offset = startOfYear.getDay(); // Day of week, 0 is Sunday

  // Add blank invisible cells to align Jan 1st to the correct day row
  for (let i = 0; i < offset; i++) {
    let cell = document.createElement("div");
    cell.className = "gh-cell";
    cell.style.visibility = "hidden";
    grid.appendChild(cell);
  }

  // Generate cells for all days in the year
  const daysInYear = isLeapYear(year) ? 366 : 365;

  for (let i = 0; i < daysInYear; i++) {
    let cell = document.createElement("div");
    cell.className = "gh-cell gh-future";
    cell.id = "gh-day-" + i;
    grid.appendChild(cell);
  }
}

initGithub(); // Run on startup

// Core Time/Percentage Logic
function updateProgress() {
  const now = new Date();
  const year = now.getFullYear();

  // Handle year change automatically if tab is left open
  if (year !== currentYear) {
    currentYear = year;
    initGithub();
    lastDaysPassed = -1; // force UI refresh for the new year
  }

  const startOfYear = new Date(year, 0, 1).getTime();
  const endOfYear = new Date(year + 1, 0, 1).getTime();

  const totalMsInYear = endOfYear - startOfYear;
  const msPassed = now.getTime() - startOfYear;

  const percentage = (msPassed / totalMsInYear) * 100;

  // Safe day calculation avoiding Daylight Saving Time (DST) shift bugs
  const startOfToday = new Date(year, now.getMonth(), now.getDate()).getTime();
  const daysPassed = Math.round(
    (startOfToday - startOfYear) / (1000 * 60 * 60 * 24),
  );

  const daysInYear = isLeapYear(year) ? 366 : 365;
  const daysRemaining = daysInYear - daysPassed;

  // Standard Text Updates
  document.getElementById("pct").textContent = percentage.toFixed(2);
  document.getElementById("year").textContent = year;

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  document.getElementById("date").textContent =
    `${months[now.getMonth()]} ${now.getDate()}, ${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}:${String(now.getSeconds()).padStart(2, "0")}`;

  // Win7 specific dynamic updates
  const win7PctText = document.getElementById("win7-pct-text");
  if (win7PctText) win7PctText.textContent = percentage.toFixed(2);

  // Performance Fix: Only update DOM elements related to daily counts when the day actually changes
  if (daysPassed !== lastDaysPassed) {
    const win7TitleEl = document.getElementById("win7-title-time");
    if (win7TitleEl)
      win7TitleEl.textContent = `${daysRemaining} Days remaining`;

    const win7SubEl = document.getElementById("win7-subtitle-time");
    if (win7SubEl) win7SubEl.textContent = `${daysRemaining} days`;

    const win7HeaderYear = document.getElementById("win7-header-year");
    if (win7HeaderYear) win7HeaderYear.textContent = year;

    const win7Items = document.getElementById("win7-items");
    if (win7Items) win7Items.textContent = daysPassed;

    // GitHub Theme Dynamic Updates
    const ghDaysPassedEl = document.getElementById("gh-days-passed");
    if (ghDaysPassedEl) ghDaysPassedEl.textContent = daysPassed;
    const ghYearEl = document.getElementById("gh-year");
    if (ghYearEl) ghYearEl.textContent = year;

    // Color the github grid cells up to the current day
    for (let i = 0; i < daysInYear; i++) {
      const cell = document.getElementById("gh-day-" + i);
      if (!cell) continue;

      if (i < daysPassed) {
        cell.className = "gh-cell gh-past";
      } else if (i === daysPassed) {
        cell.className = "gh-cell gh-today";
      } else {
        cell.className = "gh-cell gh-future";
      }
    }

    lastDaysPassed = daysPassed;
  }

  // Update progress bars widths
  const standardFill = document.getElementById("fill");
  if (standardFill) standardFill.style.width = percentage + "%";

  const win7Fill = document.getElementById("fill-win7");
  if (win7Fill) win7Fill.style.width = percentage + "%";
}

// Run immediately, then once per second (matches second-level clock; lighter on CPU)
updateProgress();
setInterval(updateProgress, 1000);
