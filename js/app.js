/**
 * FocusFlow Main UI Application Controller
 */

document.addEventListener('DOMContentLoaded', () => {
    // UI Elements
    const navItems = document.querySelectorAll('.nav-item');
    const viewSections = document.querySelectorAll('.view-section');
    const themeToggleBtn = document.getElementById('theme-toggle-btn');
    const liveClockEl = document.getElementById('live-clock');
    const liveDateEl = document.getElementById('live-date');
    const quoteEl = document.getElementById('motivational-quote');

    // Task Elements
    const taskInputForm = document.getElementById('add-task-form');
    const taskTitleInput = document.getElementById('task-title-input');
    const taskCategoryInput = document.getElementById('task-category-input');
    const taskPriorityInput = document.getElementById('task-priority-input');
    const taskEstInput = document.getElementById('task-est-input');
    const taskNotesInput = document.getElementById('task-notes-input');

    const activeTasksContainer = document.getElementById('active-tasks-list');
    const completedTasksContainer = document.getElementById('completed-tasks-list');
    const completedSectionWrap = document.getElementById('completed-section-wrap');
    const activeTasksHeading = document.getElementById('active-tasks-heading');
    const dashboardTaskPreview = document.getElementById('dashboard-task-preview');

    // Modal Elements
    const editModal = document.getElementById('edit-task-modal');
    const editTaskForm = document.getElementById('edit-task-form');
    const editTaskIdInput = document.getElementById('edit-task-id');
    const editTaskTitleInput = document.getElementById('edit-task-title');
    const editTaskCategoryInput = document.getElementById('edit-task-category');
    const editTaskPriorityInput = document.getElementById('edit-task-priority');
    const editTaskEstInput = document.getElementById('edit-task-est');
    const editTaskNotesInput = document.getElementById('edit-task-notes');
    const modalCloseBtn = document.getElementById('modal-close-btn');
    const modalCancelBtn = document.getElementById('modal-cancel-btn');

    // Summary Elements
    const summaryTotalEl = document.getElementById('summary-total-tasks');
    const summaryCompletedEl = document.getElementById('summary-completed-tasks');
    const summaryRemainingEl = document.getElementById('summary-remaining-tasks');
    const summaryPercentEl = document.getElementById('summary-completion-percent');
    const summaryProgressBarFill = document.getElementById('summary-progress-bar-fill');

    // Filter Elements
    const categoryFilterPills = document.querySelectorAll('#category-filter-pills .filter-pill');
    const statusFilterPills = document.querySelectorAll('#status-filter-pills .filter-pill');
    const priorityFilterSelect = document.getElementById('priority-filter-select');
    const taskSearchInput = document.getElementById('task-search');
    const clearCompletedBtn = document.getElementById('clear-completed-btn');

    // Timer Elements
    const timerDisplay = document.getElementById('timer-display');
    const timerProgressRing = document.getElementById('timer-ring-circle');
    const timerStartBtn = document.getElementById('timer-start-btn');
    const timerResetBtn = document.getElementById('timer-reset-btn');
    const timerSkipBtn = document.getElementById('timer-skip-btn');
    const timerModeTabs = document.querySelectorAll('.timer-mode-btn');
    const activeTaskLabel = document.getElementById('timer-active-task');

    // Quick Stats Elements
    const statStreakEl = document.getElementById('stat-streak');
    const statFocusMinsEl = document.getElementById('stat-focus-mins');
    const statTasksDoneEl = document.getElementById('stat-tasks-done');
    const statScoreEl = document.getElementById('stat-score');
    const statScoreLevelEl = document.getElementById('stat-score-level');
    const progressRingCircle = document.getElementById('progress-ring-circle');
    const progressRingPercent = document.getElementById('progress-ring-percent');

    // Soundscape Elements
    const ambientSelect = document.getElementById('ambient-sound-select');
    const ambientVolumeSlider = document.getElementById('ambient-volume');

    // State Variables
    let currentCategoryFilter = 'All';
    let currentStatusFilter = 'All';
    let currentPriorityFilter = 'All';
    let currentSearchQuery = '';

    // Quotes Array
    const quotes = [
        "“Focus is a muscle. The more you practice, the stronger it gets.”",
        "“Small daily improvements over time lead to stunning results.”",
        "“Eliminate distractions and make room for deep work.”",
        "“Your future is created by what you do today, not tomorrow.”",
        "“Flow happens when challenge matches your skill level.”"
    ];

    // --- 1. INITIALIZATION & LIVE CLOCK ---
    function initApp() {
        updateClock();
        setInterval(updateClock, 1000);
        setRandomQuote();
        setupNavigation();
        setupThemeToggle();
        setupTaskEvents();
        setupEditModalEvents();
        setupTimerEvents();
        setupSoundscape();
        renderAllViews();

        // Autoplay Policy Audio Resume
        window.addEventListener('click', () => {
            if (window.soundEngine) window.soundEngine.init();
        }, { once: true });

        // Listen for Timer Ticks & Completion
        window.focusTimer.subscribeTick(onTimerTick);
        window.focusTimer.subscribeComplete(onTimerComplete);
    }

    function updateClock() {
        const now = new Date();
        if (liveClockEl) {
            liveClockEl.textContent = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
        }
        if (liveDateEl) {
            liveDateEl.textContent = now.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
        }
    }

    function setRandomQuote() {
        if (quoteEl) {
            const idx = Math.floor(Math.random() * quotes.length);
            quoteEl.textContent = quotes[idx];
        }
    }

    // --- 2. NAVIGATION & THEME ---
    function setupNavigation() {
        navItems.forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const targetViewId = item.getAttribute('data-view');

                navItems.forEach(n => n.classList.remove('active'));
                viewSections.forEach(v => v.classList.remove('active'));

                item.classList.add('active');
                const targetView = document.getElementById(targetViewId);
                if (targetView) {
                    targetView.classList.add('active');
                }
                if (window.soundEngine) window.soundEngine.playChime('click');
            });
        });
    }

    function setupThemeToggle() {
        const savedTheme = localStorage.getItem('focusflow_theme') || 'dark';
        document.documentElement.setAttribute('data-theme', savedTheme);
        updateThemeToggleIcon(savedTheme);

        if (themeToggleBtn) {
            themeToggleBtn.addEventListener('click', () => {
                const currentTheme = document.documentElement.getAttribute('data-theme');
                const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
                document.documentElement.setAttribute('data-theme', newTheme);
                localStorage.setItem('focusflow_theme', newTheme);
                updateThemeToggleIcon(newTheme);
                if (window.soundEngine) window.soundEngine.playChime('click');
            });
        }
    }

    function updateThemeToggleIcon(theme) {
        if (!themeToggleBtn) return;
        if (theme === 'dark') {
            themeToggleBtn.innerHTML = `
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
                    <circle cx="12" cy="12" r="5"></circle>
                    <line x1="12" y1="1" x2="12" y2="3"></line>
                    <line x1="12" y1="21" x2="12" y2="23"></line>
                    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
                    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
                    <line x1="1" y1="12" x2="3" y2="12"></line>
                    <line x1="21" y1="12" x2="23" y2="12"></line>
                    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
                    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
                </svg>
            `;
        } else {
            themeToggleBtn.innerHTML = `
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
                    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
                </svg>
            `;
        }
    }

    // --- 3. TASK MANAGMENT & EDIT MODAL ---
    function setupTaskEvents() {
        if (taskInputForm) {
            taskInputForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const title = taskTitleInput.value.trim();
                if (!title) return;

                window.taskManager.addTask({
                    title,
                    category: taskCategoryInput.value,
                    priority: taskPriorityInput.value,
                    estPomodoros: taskEstInput.value,
                    notes: taskNotesInput.value
                });

                taskTitleInput.value = '';
                if (taskNotesInput) taskNotesInput.value = '';
                renderAllViews();
                showToast('Task added successfully!');
            });
        }

        categoryFilterPills.forEach(pill => {
            pill.addEventListener('click', () => {
                categoryFilterPills.forEach(p => p.classList.remove('active'));
                pill.classList.add('active');
                currentCategoryFilter = pill.getAttribute('data-category');
                renderTaskList();
            });
        });

        statusFilterPills.forEach(pill => {
            pill.addEventListener('click', () => {
                statusFilterPills.forEach(p => p.classList.remove('active'));
                pill.classList.add('active');
                currentStatusFilter = pill.getAttribute('data-status');
                renderTaskList();
            });
        });

        if (priorityFilterSelect) {
            priorityFilterSelect.addEventListener('change', (e) => {
                currentPriorityFilter = e.target.value;
                renderTaskList();
            });
        }

        if (taskSearchInput) {
            taskSearchInput.addEventListener('input', (e) => {
                currentSearchQuery = e.target.value.trim();
                renderTaskList();
            });
        }

        if (clearCompletedBtn) {
            clearCompletedBtn.addEventListener('click', () => {
                window.taskManager.clearCompleted();
                renderAllViews();
                showToast('Cleared completed tasks');
            });
        }
    }

    function setupEditModalEvents() {
        if (editTaskForm) {
            editTaskForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const id = editTaskIdInput.value;
                const title = editTaskTitleInput.value.trim();
                if (!id || !title) return;

                window.taskManager.updateTask(id, {
                    title,
                    category: editTaskCategoryInput.value,
                    priority: editTaskPriorityInput.value,
                    estPomodoros: parseInt(editTaskEstInput.value, 10) || 1,
                    notes: editTaskNotesInput.value.trim()
                });

                closeEditModal();
                renderAllViews();
                showToast('Task updated successfully!');
            });
        }

        if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeEditModal);
        if (modalCancelBtn) modalCancelBtn.addEventListener('click', closeEditModal);
        if (editModal) {
            editModal.addEventListener('click', (e) => {
                if (e.target === editModal) closeEditModal();
            });
        }
    }

    function openEditModal(task) {
        if (!editModal) return;
        editTaskIdInput.value = task.id;
        editTaskTitleInput.value = task.title;
        editTaskCategoryInput.value = task.category || 'General';
        editTaskPriorityInput.value = task.priority || 'medium';
        editTaskEstInput.value = task.estPomodoros || 1;
        editTaskNotesInput.value = task.notes || '';

        editModal.classList.add('active');
        editModal.setAttribute('aria-hidden', 'false');
    }

    function closeEditModal() {
        if (!editModal) return;
        editModal.classList.remove('active');
        editModal.setAttribute('aria-hidden', 'true');
    }

    function renderTaskList() {
        const filteredTasks = window.taskManager.getFilteredTasks(
            currentCategoryFilter,
            currentPriorityFilter,
            currentStatusFilter,
            currentSearchQuery
        );

        const activeTasks = filteredTasks.filter(t => !t.completed);
        const completedTasks = filteredTasks.filter(t => t.completed);

        // Manage Section Visibility based on status filter
        if (currentStatusFilter === 'Completed') {
            if (activeTasksHeading) activeTasksHeading.style.display = 'none';
            if (activeTasksContainer) activeTasksContainer.style.display = 'none';
            if (completedSectionWrap) completedSectionWrap.style.display = 'flex';
            if (completedTasksContainer) completedTasksContainer.style.display = 'flex';
        } else if (currentStatusFilter === 'Active') {
            if (activeTasksHeading) activeTasksHeading.style.display = 'flex';
            if (activeTasksContainer) activeTasksContainer.style.display = 'flex';
            if (completedSectionWrap) completedSectionWrap.style.display = 'none';
            if (completedTasksContainer) completedTasksContainer.style.display = 'none';
        } else {
            if (activeTasksHeading) activeTasksHeading.style.display = 'flex';
            if (activeTasksContainer) activeTasksContainer.style.display = 'flex';
            if (completedSectionWrap) completedSectionWrap.style.display = 'flex';
            if (completedTasksContainer) completedTasksContainer.style.display = 'flex';
        }

        // Render Active Tasks
        if (activeTasksContainer) {
            if (activeTasks.length === 0) {
                if (window.taskManager.tasks.length === 0) {
                    activeTasksContainer.innerHTML = `<div class="empty-state">🌟 No tasks created yet. Add a goal above to get started!</div>`;
                } else if (currentStatusFilter === 'Active' || currentCategoryFilter !== 'All' || currentSearchQuery !== '' || currentPriorityFilter !== 'All') {
                    activeTasksContainer.innerHTML = `<div class="empty-state">🔍 No active tasks matching your current filters.</div>`;
                } else {
                    activeTasksContainer.innerHTML = `<div class="empty-state">🎉 All active tasks completed! Take a well-deserved break.</div>`;
                }
            } else {
                activeTasksContainer.innerHTML = activeTasks.map(t => createTaskHTML(t)).join('');
            }
        }

        // Render Completed Tasks
        if (completedTasksContainer) {
            if (completedTasks.length === 0) {
                if (currentStatusFilter === 'Completed') {
                    completedTasksContainer.innerHTML = `<div class="empty-state">🚀 Completed tasks will appear here as you check them off.</div>`;
                } else {
                    completedTasksContainer.innerHTML = `<div class="empty-state">No completed tasks yet.</div>`;
                }
            } else {
                completedTasksContainer.innerHTML = completedTasks.map(t => createTaskHTML(t)).join('');
            }
        }

        // Render Dashboard Task Preview (Top 4 active)
        if (dashboardTaskPreview) {
            const top4 = window.taskManager.tasks.filter(t => !t.completed).slice(0, 4);
            if (top4.length === 0) {
                dashboardTaskPreview.innerHTML = `<div class="empty-state">All caught up! Excellent work today.</div>`;
            } else {
                dashboardTaskPreview.innerHTML = top4.map(t => createTaskHTML(t, true)).join('');
            }
        }

        bindTaskItemEvents();
    }

    function createTaskHTML(task, isMini = false) {
        const priorityColors = {
            high: 'priority-badge-high',
            medium: 'priority-badge-med',
            low: 'priority-badge-low'
        };

        const activeTaskId = window.focusTimer.activeTaskId;
        const isFocused = activeTaskId === task.id;

        return `
            <div class="task-card ${task.completed ? 'completed' : ''} ${isFocused ? 'focused-active' : ''}" data-id="${task.id}">
                <div class="task-left">
                    <label class="custom-checkbox" aria-label="Mark task '${escapeHTML(task.title)}' as ${task.completed ? 'incomplete' : 'complete'}">
                        <input type="checkbox" class="task-toggle-cb" data-id="${task.id}" ${task.completed ? 'checked' : ''}>
                        <span class="checkmark"></span>
                    </label>
                    <div class="task-details">
                        <div class="task-title">${escapeHTML(task.title)}</div>
                        <div class="task-meta">
                            <span class="category-tag">${task.category || 'General'}</span>
                            <span class="priority-badge ${priorityColors[task.priority]}">${task.priority.toUpperCase()}</span>
                            <span class="pomodoro-count">🍅 ${task.actPomodoros || 0}/${task.estPomodoros || 1}</span>
                            ${task.notes ? `<span class="task-notes-icon" title="${escapeHTML(task.notes)}">📝</span>` : ''}
                        </div>
                    </div>
                </div>
                <div class="task-actions">
                    ${!task.completed ? `
                        <button class="btn-icon focus-task-btn ${isFocused ? 'active' : ''}" data-id="${task.id}" aria-label="Focus on task: ${escapeHTML(task.title)}" title="Focus on this task">
                            🎯
                        </button>
                    ` : ''}
                    <button class="btn-icon edit-task-btn" data-id="${task.id}" aria-label="Edit task: ${escapeHTML(task.title)}" title="Edit Task">
                        ✏️
                    </button>
                    <button class="btn-icon delete-task-btn" data-id="${task.id}" aria-label="Delete task: ${escapeHTML(task.title)}" title="Delete Task">
                        🗑️
                    </button>
                </div>
            </div>
        `;
    }

    function bindTaskItemEvents() {
        document.querySelectorAll('.task-toggle-cb').forEach(cb => {
            cb.addEventListener('change', (e) => {
                const id = e.target.getAttribute('data-id');
                window.taskManager.toggleTask(id);
                renderAllViews();
                triggerCelebrationEffect();
            });
        });

        document.querySelectorAll('.edit-task-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = btn.getAttribute('data-id');
                const task = window.taskManager.tasks.find(t => t.id === id);
                if (task) {
                    openEditModal(task);
                }
            });
        });

        document.querySelectorAll('.delete-task-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = btn.getAttribute('data-id');
                window.taskManager.deleteTask(id);
                renderAllViews();
            });
        });

        document.querySelectorAll('.focus-task-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = btn.getAttribute('data-id');
                const task = window.taskManager.tasks.find(t => t.id === id);
                if (task) {
                    window.focusTimer.setActiveTask(id);
                    if (activeTaskLabel) {
                        activeTaskLabel.textContent = `Focusing on: ${task.title}`;
                    }
                    showToast(`Timer set to: "${task.title}"`);
                    document.querySelector('[data-view="timer-view"]').click();
                }
            });
        });
    }

    // --- 4. TIMER UI ---
    function setupTimerEvents() {
        if (timerStartBtn) {
            timerStartBtn.addEventListener('click', () => {
                window.focusTimer.toggle();
            });
        }

        if (timerResetBtn) {
            timerResetBtn.addEventListener('click', () => {
                window.focusTimer.reset();
                document.title = "FocusFlow | Smart Daily Productivity Dashboard";
            });
        }

        if (timerSkipBtn) {
            timerSkipBtn.addEventListener('click', () => {
                window.focusTimer.completeSession();
            });
        }

        timerModeTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                timerModeTabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                const mode = tab.getAttribute('data-mode');
                window.focusTimer.setMode(mode);
            });
        });
    }

    function onTimerTick(data) {
        if (timerDisplay) {
            timerDisplay.textContent = data.formatted;
        }

        if (data.isRunning || data.isPaused) {
            document.title = `(${data.formatted}) FocusFlow`;
        } else {
            document.title = "FocusFlow | Smart Daily Productivity Dashboard";
        }

        if (timerStartBtn) {
            if (data.isRunning) {
                timerStartBtn.innerHTML = `<span>⏸️ Pause</span>`;
                timerStartBtn.classList.add('running');
                timerStartBtn.setAttribute('aria-label', 'Pause focus timer');
            } else if (data.isPaused) {
                timerStartBtn.innerHTML = `<span>▶️ Resume</span>`;
                timerStartBtn.classList.remove('running');
                timerStartBtn.setAttribute('aria-label', 'Resume focus timer');
            } else {
                timerStartBtn.innerHTML = `<span>▶️ Start</span>`;
                timerStartBtn.classList.remove('running');
                timerStartBtn.setAttribute('aria-label', 'Start focus timer');
            }
        }

        if (timerProgressRing) {
            const radius = 130;
            const circumference = 2 * Math.PI * radius;
            const offset = circumference - (data.progressRatio * circumference);
            timerProgressRing.style.strokeDasharray = `${circumference}`;
            timerProgressRing.style.strokeDashoffset = `${offset}`;
        }
    }

    function onTimerComplete(mode) {
        const msg = mode === 'pomodoro' ? '🎉 Focus session complete! Take a break.' : '⏰ Break time finished! Ready to focus?';
        showToast(msg);
        triggerCelebrationEffect();
        renderStats();
    }

    // --- 5. SOUNDSCAPE UI ---
    function setupSoundscape() {
        if (ambientSelect) {
            ambientSelect.addEventListener('change', (e) => {
                window.soundEngine.setAmbientSound(e.target.value, ambientVolumeSlider.value);
            });
        }

        if (ambientVolumeSlider) {
            ambientVolumeSlider.addEventListener('input', (e) => {
                window.soundEngine.setVolume(e.target.value);
            });
        }
    }

    // --- 6. STATS & RENDER ORCHESTRATION ---
    function renderStats() {
        const stats = window.taskManager.getStats();
        const streak = window.analyticsEngine.streakData.currentStreak;
        const sessions = window.focusTimer.completedSessionsToday;
        const prod = window.analyticsEngine.calculateProductivityScore(stats, sessions);

        window.analyticsEngine.logDailyProgress(stats.completed, prod.focusMinutes);

        // Update Daily Summary Card
        if (summaryTotalEl) summaryTotalEl.textContent = stats.total;
        if (summaryCompletedEl) summaryCompletedEl.textContent = stats.completed;
        if (summaryRemainingEl) summaryRemainingEl.textContent = stats.remaining;
        if (summaryPercentEl) summaryPercentEl.textContent = `${stats.percent}% Completed`;
        if (summaryProgressBarFill) summaryProgressBarFill.style.width = `${stats.percent}%`;

        // Update Quick Stat Cards
        if (statStreakEl) statStreakEl.textContent = `${streak} Days 🔥`;
        if (statFocusMinsEl) statFocusMinsEl.textContent = `${prod.focusMinutes} mins`;
        if (statTasksDoneEl) statTasksDoneEl.textContent = `${stats.completed}/${stats.total}`;
        if (statScoreEl) statScoreEl.textContent = `${prod.score}%`;
        if (statScoreLevelEl) statScoreLevelEl.textContent = prod.level;

        // Circular progress ring on dashboard
        if (progressRingCircle) {
            const radius = 52;
            const circumference = 2 * Math.PI * radius;
            const offset = circumference - ((stats.percent / 100) * circumference);
            progressRingCircle.style.strokeDasharray = `${circumference}`;
            progressRingCircle.style.strokeDashoffset = `${offset}`;
        }
        if (progressRingPercent) {
            progressRingPercent.textContent = `${stats.percent}%`;
        }

        renderWeeklyChart();
    }

    function renderWeeklyChart() {
        const chartContainer = document.getElementById('weekly-chart-bars');
        if (!chartContainer) return;

        const weeklyData = window.analyticsEngine.getWeeklyData();
        const maxMins = Math.max(100, ...weeklyData.map(d => d.focusMinutes));

        chartContainer.innerHTML = weeklyData.map(d => {
            const heightPercent = Math.max(8, Math.round((d.focusMinutes / maxMins) * 100));
            return `
                <div class="chart-bar-column ${d.isToday ? 'today' : ''}">
                    <div class="chart-bar-fill" style="height: ${heightPercent}%;" title="${d.focusMinutes} mins focus on ${d.day}"></div>
                    <span class="chart-bar-label">${d.day}</span>
                </div>
            `;
        }).join('');
    }

    function renderAllViews() {
        renderTaskList();
        renderStats();
    }

    // --- HELPER UTILITIES ---
    function showToast(msg) {
        const toast = document.createElement('div');
        toast.className = 'toast-notification';
        toast.setAttribute('role', 'status');
        toast.setAttribute('aria-live', 'polite');
        toast.textContent = msg;
        document.body.appendChild(toast);
        setTimeout(() => toast.classList.add('show'), 10);
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300);
        }, 3500);
    }

    function triggerCelebrationEffect() {
        const stats = window.taskManager.getStats();
        if (stats.completed > 0 && stats.completed === stats.total) {
            showToast(' 🎉 All daily tasks completed! Outstanding flow state!');
        }
    }

    function escapeHTML(str) {
        if (!str) return '';
        return str.replace(/[&<>'"]/g, 
            tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)
        );
    }

    // Launch Application
    initApp();
});
