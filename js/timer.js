/**
 * FocusFlow Pomodoro & Focus Timer Controller
 */

class FocusTimer {
    constructor() {
        this.STORAGE_KEY = 'focusflow_timer_settings';
        this.settings = this.loadSettings();

        this.currentMode = 'pomodoro'; // 'pomodoro', 'shortBreak', 'longBreak'
        this.timeLeft = this.settings.pomodoro * 60;
        this.totalDuration = this.timeLeft;
        this.isRunning = false;
        this.isPaused = false;
        this.timerInterval = null;
        this.activeTaskId = null;
        this.completedSessionsToday = this.loadCompletedSessions();

        this.onTickCallbacks = [];
        this.onCompleteCallbacks = [];
    }

    loadSettings() {
        const defaults = {
            pomodoro: 25,
            shortBreak: 5,
            longBreak: 15,
            autoStartBreaks: false
        };
        try {
            const saved = localStorage.getItem(this.STORAGE_KEY);
            return saved ? { ...defaults, ...JSON.parse(saved) } : defaults;
        } catch (e) {
            return defaults;
        }
    }

    saveSettings(newSettings) {
        this.settings = { ...this.settings, ...newSettings };
        try {
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.settings));
        } catch (e) {
            console.error('Error saving timer settings', e);
        }
        if (!this.isRunning && !this.isPaused) {
            this.setMode(this.currentMode);
        }
    }

    loadCompletedSessions() {
        const today = new Date().toISOString().split('T')[0];
        try {
            const data = localStorage.getItem('focusflow_sessions_' + today);
            return data ? parseInt(data, 10) : 0;
        } catch (e) {
            return 0;
        }
    }

    incrementCompletedSessions() {
        const today = new Date().toISOString().split('T')[0];
        this.completedSessionsToday += 1;
        try {
            localStorage.setItem('focusflow_sessions_' + today, this.completedSessionsToday.toString());
        } catch (e) {
            console.error('Error saving session count', e);
        }
    }

    setMode(mode) {
        this.pause();
        this.isPaused = false;
        this.currentMode = mode;

        let minutes = 25;
        if (mode === 'pomodoro') minutes = this.settings.pomodoro;
        else if (mode === 'shortBreak') minutes = this.settings.shortBreak;
        else if (mode === 'longBreak') minutes = this.settings.longBreak;

        this.timeLeft = minutes * 60;
        this.totalDuration = this.timeLeft;
        this.notifyTick();
    }

    start() {
        if (this.isRunning) return;
        this.isRunning = true;
        this.isPaused = false;

        if (window.soundEngine) {
            window.soundEngine.playChime('click');
        }

        this.timerInterval = setInterval(() => {
            if (this.timeLeft > 0) {
                this.timeLeft--;
                this.notifyTick();
            } else {
                this.completeSession();
            }
        }, 1000);
    }

    pause() {
        if (!this.isRunning) return;
        this.isRunning = false;
        this.isPaused = true;
        clearInterval(this.timerInterval);
        this.timerInterval = null;
        this.notifyTick();
    }

    toggle() {
        if (this.isRunning) {
            this.pause();
        } else {
            this.start();
        }
    }

    reset() {
        this.pause();
        this.isPaused = false;
        this.setMode(this.currentMode);
    }

    setActiveTask(taskId) {
        this.activeTaskId = taskId;
        this.notifyTick();
    }

    completeSession() {
        this.pause();
        this.isPaused = false;

        if (window.soundEngine) {
            window.soundEngine.playChime('timerComplete');
        }

        if (this.currentMode === 'pomodoro') {
            this.incrementCompletedSessions();
            if (this.activeTaskId && window.taskManager) {
                window.taskManager.incrementTaskPomodoro(this.activeTaskId);
            }
        }

        this.onCompleteCallbacks.forEach(cb => cb(this.currentMode));

        if (this.currentMode === 'pomodoro') {
            if (this.completedSessionsToday % 4 === 0) {
                this.setMode('longBreak');
            } else {
                this.setMode('shortBreak');
            }
        } else {
            this.setMode('pomodoro');
        }
    }

    getFormattedTime() {
        const mins = Math.floor(this.timeLeft / 60);
        const secs = this.timeLeft % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }

    getProgressRatio() {
        if (this.totalDuration === 0) return 0;
        return (this.totalDuration - this.timeLeft) / this.totalDuration;
    }

    subscribeTick(callback) {
        this.onTickCallbacks.push(callback);
    }

    subscribeComplete(callback) {
        this.onCompleteCallbacks.push(callback);
    }

    notifyTick() {
        this.onTickCallbacks.forEach(cb => cb({
            timeLeft: this.timeLeft,
            formatted: this.getFormattedTime(),
            progressRatio: this.getProgressRatio(),
            isRunning: this.isRunning,
            isPaused: this.isPaused,
            mode: this.currentMode,
            activeTaskId: this.activeTaskId,
            completedSessionsToday: this.completedSessionsToday
        }));
    }
}

window.focusTimer = new FocusTimer();
