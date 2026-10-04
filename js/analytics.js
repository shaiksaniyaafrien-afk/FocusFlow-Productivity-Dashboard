/**
 * FocusFlow Analytics & Streak Tracker
 */

class AnalyticsEngine {
    constructor() {
        this.STREAK_KEY = 'focusflow_streak_data';
        this.streakData = this.loadStreakData();
        this.updateTodayActivity();
    }

    loadStreakData() {
        try {
            const data = localStorage.getItem(this.STREAK_KEY);
            return data ? JSON.parse(data) : { currentStreak: 1, lastActiveDate: new Date().toISOString().split('T')[0], dailyLog: {} };
        } catch (e) {
            return { currentStreak: 1, lastActiveDate: new Date().toISOString().split('T')[0], dailyLog: {} };
        }
    }

    saveStreakData() {
        try {
            localStorage.setItem(this.STREAK_KEY, JSON.stringify(this.streakData));
        } catch (e) {
            console.error('Error saving streak data', e);
        }
    }

    updateTodayActivity() {
        const today = new Date().toISOString().split('T')[0];
        const lastDate = this.streakData.lastActiveDate;

        if (lastDate !== today) {
            const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
            if (lastDate === yesterday) {
                this.streakData.currentStreak += 1;
            } else if (new Date(today) - new Date(lastDate) > 86400000 * 2) {
                this.streakData.currentStreak = 1;
            }
            this.streakData.lastActiveDate = today;
            this.saveStreakData();
        }
    }

    logDailyProgress(taskCount, focusMinutes) {
        const today = new Date().toISOString().split('T')[0];
        if (!this.streakData.dailyLog) {
            this.streakData.dailyLog = {};
        }

        this.streakData.dailyLog[today] = {
            tasks: taskCount,
            focusMinutes: focusMinutes
        };
        this.saveStreakData();
    }

    getWeeklyData() {
        const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
        const result = [];
        const now = new Date();

        const currentDayOfWeek = now.getDay();
        const distToMon = (currentDayOfWeek + 6) % 7;
        const monday = new Date(now);
        monday.setDate(now.getDate() - distToMon);

        for (let i = 0; i < 7; i++) {
            const dayDate = new Date(monday);
            dayDate.setDate(monday.getDate() + i);
            const dateStr = dayDate.toISOString().split('T')[0];
            const log = (this.streakData.dailyLog && this.streakData.dailyLog[dateStr]) || { tasks: 0, focusMinutes: 0 };

            result.push({
                day: days[i],
                date: dateStr,
                isToday: dateStr === now.toISOString().split('T')[0],
                tasks: log.tasks,
                focusMinutes: log.focusMinutes
            });
        }

        return result;
    }

    calculateProductivityScore(stats, completedSessions) {
        const taskScore = stats.total > 0 ? Math.round((stats.completed / stats.total) * 60) : 30;
        const focusMinutes = completedSessions * 25;
        const focusScore = Math.min(40, Math.round((focusMinutes / 100) * 40));

        const score = Math.min(100, taskScore + focusScore);
        return {
            score,
            level: score >= 80 ? 'Master Flow ⚡' : score >= 50 ? 'Steady Focus 🎯' : 'Getting Started 🌱',
            focusMinutes
        };
    }
}

window.analyticsEngine = new AnalyticsEngine();

