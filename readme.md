# Year Progress Tracker
![preview](preview.png)
A beautifully designed, highly responsive, real-time year progress tracking web application. Watch the days and percentage of the current year pass by with smooth updates and 8 distinctive UI themes.

## 🚀 Features

- **Offline Capability**
  As a single HTML file, it runs without an internet connection once loaded. An external CDN is only required for the image export feature.

- **Real-Time Tracking**
  Calculates the exact percentage of the year elapsed, up to 2 decimal places, with seamless updates.

- **8 Unique Themes**
  - **Default**: Sleek, dark terminal-style interface
  - **Shadcn**: Minimal, modern enterprise aesthetic
  - **GitHub**: Full 365-day grid simulating a contribution graph, mapped accurately by weekday
  - **Windows 7 Aero**: Recreation of the classic file copy dialog with translucent glass effects and glowing progress bars
  - **Cyberpunk**: Dark sci-fi HUD with animated scanlines
  - **Claymorphism**: Premium 3D dark-mint neumorphism style
  - **Windows 95**: Retro classic UI
  - **Brutalism**: Bold, high-contrast, blocky layout

- **Theme Persistence**
  Uses `localStorage` to remember your selected theme for future visits.

- **HD Image Export**
  Built-in screenshot support via `dom-to-image-more`, allowing high-resolution image downloads of your current progress.

- **Fully Responsive**
  Optimized for desktops, tablets, and mobile devices.

## 🛠️ Technology Stack

- **HTML5**
  Single-page structure

- **CSS3 (Vanilla)**
  Flexbox, Grid, custom keyframe animations, and UI styling

- **JavaScript (Vanilla ES6)**
  Handles date/time logic, theme switching, and DOM manipulation

- **External Library**
  `dom-to-image-more` for high-resolution screenshots

## 💻 How to Use

1. Open the [index.html](https://nahian.pro.bd/year) file in any modern web browser.
2. Double-click anywhere on the screen, or click the 🎨 (palette) button to switch themes.
3. Click the 📥 (download) button to capture and save a high-resolution screenshot of your current view.

## 👤 Author

- **Name**: Al Nahian
- **Website**: https://nahian.pro.bd
- **GitHub**: https://github.com/alnahian2003

---

Handcrafted with HTML, CSS, and JavaScript. No heavy frameworks involved.