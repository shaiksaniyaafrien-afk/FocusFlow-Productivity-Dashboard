/**
 * FocusFlow Task Management State & Controller
 */

class TaskManager {
    constructor() {
        this.STORAGE_KEY = 'focusflow_tasks_v1';
        this.tasks = this.loadTasks();

        if (this.tasks.length === 0) {
            this.seedInitialTasks();
        }
    }

    loadTasks() {
        try {
            const data = localStorage.getItem(this.STORAGE_KEY);
            return data ? JSON.parse(data) : [];
        } catch (e) {
            console.error('Failed to load tasks from localStorage', e);
            return [];
        }
    }

    saveTasks() {
        try {
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.tasks));
        } catch (e) {
            console.error('Failed to save tasks to localStorage', e);
        }
    }

    seedInitialTasks() {
        const today = new Date().toISOString().split('T')[0];
        this.tasks = [
            {
                id: 'task-1',
                title: 'Welcome to FocusFlow! Explore your dashboard',
                category: 'Work',
                priority: 'high',
                estPomodoros: 1,
                actPomodoros: 0,
                completed: false,
                createdAt: today,
                notes: 'Try adding tasks, using the focus timer, and toggling themes.'
            },
            {
                id: 'task-2',
                title: 'Review daily study & project goals',
                category: 'Study',
                priority: 'medium',
                estPomodoros: 2,
                actPomodoros: 1,
                completed: false,
                createdAt: today,
                notes: 'Prioritize top 3 tasks for maximum efficiency.'
            },
            {
                id: 'task-3',
                title: '30-minute deep work session',
                category: 'Health',
                priority: 'low',
                estPomodoros: 1,
                actPomodoros: 1,
                completed: true,
                createdAt: today,
                completedAt: new Date().toISOString(),
                notes: 'Listen to ambient rain soundscape.'
            }
        ];
        this.saveTasks();
    }

    addTask(taskData) {
        const newTask = {
            id: 'task-' + Date.now() + '-' + Math.floor(Math.random() * 1000),
            title: taskData.title.trim(),
            category: taskData.category || 'General',
            priority: taskData.priority || 'medium',
            estPomodoros: parseInt(taskData.estPomodoros, 10) || 1,
            actPomodoros: 0,
            completed: false,
            createdAt: new Date().toISOString().split('T')[0],
            notes: taskData.notes ? taskData.notes.trim() : ''
        };

        this.tasks.unshift(newTask);
        this.saveTasks();
        if (window.soundEngine) window.soundEngine.playChime('click');
        return newTask;
    }

    toggleTask(id) {
        const task = this.tasks.find(t => t.id === id);
        if (task) {
            task.completed = !task.completed;
            task.completedAt = task.completed ? new Date().toISOString() : null;
            this.saveTasks();

            if (task.completed && window.soundEngine) {
                window.soundEngine.playChime('success');
            }
        }
        return task;
    }

    deleteTask(id) {
        this.tasks = this.tasks.filter(t => t.id !== id);
        this.saveTasks();
        if (window.soundEngine) window.soundEngine.playChime('click');
    }

    updateTask(id, updatedFields) {
        const task = this.tasks.find(t => t.id === id);
        if (task) {
            Object.assign(task, updatedFields);
            this.saveTasks();
        }
        return task;
    }

    incrementTaskPomodoro(id) {
        const task = this.tasks.find(t => t.id === id);
        if (task) {
            task.actPomodoros = (task.actPomodoros || 0) + 1;
            this.saveTasks();
        }
        return task;
    }

    clearCompleted() {
        this.tasks = this.tasks.filter(t => !t.completed);
        this.saveTasks();
    }

    getFilteredTasks(filterCategory = 'All', filterPriority = 'All', filterStatus = 'All', searchQuery = '') {
        return this.tasks.filter(t => {
            const matchesCategory = filterCategory === 'All' || (t.category || 'General').toLowerCase() === filterCategory.toLowerCase();
            const matchesPriority = filterPriority === 'All' || t.priority.toLowerCase() === filterPriority.toLowerCase();
            
            let matchesStatus = true;
            if (filterStatus === 'Active') matchesStatus = !t.completed;
            else if (filterStatus === 'Completed') matchesStatus = t.completed;

            const matchesSearch = searchQuery === '' || 
                t.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                (t.notes && t.notes.toLowerCase().includes(searchQuery.toLowerCase()));

            return matchesCategory && matchesPriority && matchesStatus && matchesSearch;
        });
    }

    getStats() {
        const total = this.tasks.length;
        const completed = this.tasks.filter(t => t.completed).length;
        const remaining = total - completed;
        const percent = total > 0 ? Math.round((completed / total) * 100) : 0;

        const estTotalPoms = this.tasks.reduce((acc, t) => acc + (t.estPomodoros || 1), 0);
        const actTotalPoms = this.tasks.reduce((acc, t) => acc + (t.actPomodoros || 0), 0);

        return {
            total,
            completed,
            remaining,
            percent,
            estTotalPoms,
            actTotalPoms
        };
    }
}

window.taskManager = new TaskManager();
