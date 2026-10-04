# ⚡ FocusFlow - Smart Daily Productivity Dashboard

FocusFlow is a modern, responsive, and visually engaging web application designed to help students, professionals, and creators optimize their daily productivity, manage tasks, track progress, and build deep focus habits.

Built with clean HTML5, CSS3, and Vanilla JavaScript, FocusFlow offers a complete productivity suite—including a Pomodoro focus timer, ambient sound generator, task filters, analytics, and browser `localStorage` persistence—all operating seamlessly offline with zero external dependencies.

---

## 🌟 Key Features

- **📊 Productivity Dashboard & Daily Summary**:
  - Live clock, date display, and motivational quote bubble.
  - Real-time **Daily Productivity Summary** showing total tasks, completed tasks, remaining tasks, and completion percentage.
  - Interactive circular SVG progress rings for daily goal tracking.
  - Quick statistics badges for completed tasks, total focus minutes, active streak, and productivity score level (`Master Flow ⚡`, `Steady Focus 🎯`, `Getting Started 🌱`).

- **📝 Daily Task Management**:
  - **Create & Categorize**: Create tasks with titles, priority levels (`High 🔴`, `Medium 🟡`, `Low 🟢`), optional categories (`Study 📚`, `Work 💼`, `Personal 🏠`, `Health 🌿`, `General 🏷️`), estimated Pomodoro counts, and sub-notes.
  - **Edit & Update**: Modal dialog interface (`✏️ Edit Task`) to update existing task titles, priorities, categories, or notes on the fly.
  - **Complete & Restore**: Mark tasks complete with custom checkmarks and celebratory sound effects. Completed tasks automatically move to a dedicated history accordion.
  - **Delete & Clear**: Single-click task deletion (`🗑️`) and bulk "Clear Completed" option.

- **🔍 Advanced Multi-Filtering System**:
  - **Status Filters**: Switch between `All`, `Active`, and `Completed` task views.
  - **Category Filters**: Filter by `Study`, `Work`, `Personal`, `Health`, `General`, or `All`.
  - **Priority Filters**: Filter by `High Priority`, `Medium Priority`, `Low Priority`, or `All Priorities`.
  - **Live Text Search**: Real-time search matching titles and notes.

- **⏱️ Focus Pomodoro Timer**:
  - **Session Modes**: Toggle between `Pomodoro (25m)`, `Short Break (5m)`, and `Long Break (15m)`.
  - **Task Binding**: Select any task (`🎯 Focus`) to bind it directly to the active timer session and automatically increment its actual Pomodoro count upon completion.
  - **Visual Countdown**: Large, high-contrast countdown digits with an animated SVG progress ring.
  - **Controls**: Full `Start` / `Pause` / `Resume` / `Reset` / `Skip` session controls.

- **🎧 Web Audio API Ambient Soundscapes**:
  - Built-in audio synthesizer using native Web Audio API nodes (`🌧️ Soft Rain`, `🌊 Gentle Waves`, `📻 White Noise`, `🧘 432Hz Zen Tone`).
  - 100% offline playback with zero external MP3/audio file dependencies.
  - Volume slider with real-time audio gain adjustment.

- **📈 Productivity Analytics & Streak Tracker**:
  - Daily momentum streak counter 🔥.
  - Weekly focus minutes bar chart breakdown across Monday–Sunday.

- **🌙 Modern Dark & Light Themes**:
  - One-click toggle between Slate Dark Mode and Crisp Light Mode with CSS custom properties.

- **💾 LocalStorage Persistence**:
  - Tasks, completion status, timer sessions, streak counts, and theme preferences automatically persist in the browser.

---

## 🛠️ Technologies Used

| Technology | Purpose |
| :--- | :--- |
| **HTML5** | Semantic structure, accessible modal dialogs, and ARIA attributes |
| **CSS3** | CSS Variables, Flexbox, Grid, Glassmorphic UI, animations & responsive media queries |
| **Vanilla JavaScript (ES6+)** | Task state machine, Pomodoro controller, UI router, and event listeners |
| **Web Audio API** | Synthesized sound effects (chimes, bell alarms) and ambient noise generators |
| **Browser LocalStorage API** | Persistent client-side storage for tasks, analytics, and settings |

---

## ⚙️ How the Application Works

1. **State Orchestration**:
   - `TaskManager` (`js/tasks.js`) handles CRUD operations, filtering, category/priority management, and `localStorage` JSON serialization.
   - `FocusTimer` (`js/timer.js`) manages the Pomodoro countdown interval, session modes, SVG ring offset calculations, and active task bindings.
   - `AnalyticsEngine` (`js/analytics.js`) tracks daily active logs, calculates productivity scores, and formats weekly chart data.
   - `SoundEngine` (`js/audio.js`) initializes native Web Audio `AudioContext`, oscillator nodes, and biquad filter nodes for audio synthesis.
   - `App Controller` (`js/app.js`) binds UI event listeners, tab navigation routing, live clock updates, and toast notifications.

---

## 📁 Project Structure

```text
FocusFlow/
├── index.html        # Main HTML application markup with ARIA accessibility
├── README.md         # Documentation & repository overview
├── .gitignore        # Git ignore rule specifications
├── css/
│   └── styles.css    # Complete stylesheet (CSS variables, glassmorphism, responsive rules)
└── js/
    ├── audio.js      # Web Audio API sound synthesizer engine
    ├── tasks.js      # Task data model & LocalStorage controller
    ├── timer.js      # Pomodoro focus timer controller & SVG ring animation
    ├── analytics.js  # Streak calculation & weekly analytics tracker
    └── app.js        # Main UI event orchestrator, live clock & tab router
```

---

## 🚀 How to Run Locally

Because FocusFlow is built using pure web standards without external libraries or build tools, running it is simple:

### Option 1: Direct File Launch
Double-click `index.html` or open it directly in any modern web browser (Google Chrome, Mozilla Firefox, Microsoft Edge, Apple Safari).

### Option 2: Local HTTP Server
Using Python (built-in):
```bash
# Navigate to project directory
cd FocusFlow

# Start local server on port 8080
python -m http.server 8080
```
Then open your browser and navigate to `http://localhost:8080`.

Using Node.js (`npx server` or `live-server`):
```bash
npx http-server -p 8080
```

---

## 🔮 Future Improvements & Roadmap

- [ ] **Custom Categories & Tags**: Allow users to create custom category names with personalized color pills.
- [ ] **Web Notifications API**: Native desktop browser notifications when focus sessions or breaks complete.
- [ ] **Data Export & Import**: Export daily tasks and focus logs as `.json` or `.csv` files for backup or analysis.
- [ ] **Drag & Drop Reordering**: Reorder active tasks via drag-and-drop handles.
- [ ] **Calendar Integration**: Sync tasks and focus sessions with Google Calendar or iCal feeds.

---

