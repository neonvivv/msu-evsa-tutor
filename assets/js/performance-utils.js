/**
 * Утилиты для улучшения производительности и UX
 */

// Debounce функция для оптимизации частых вызовов
function debounce(func, delay) {
    let timeoutId;
    return function (...args) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => func.apply(this, args), delay);
    };
}

// Throttle функция с requestAnimationFrame для smooth анимаций
function throttleRAF(func) {
    let rafId = null;
    let lastArgs = null;
    
    return function (...args) {
        lastArgs = args;
        if (rafId) return;
        
        rafId = requestAnimationFrame(() => {
            func.apply(this, lastArgs);
            rafId = null;
        });
    };
}

// Intersection Observer для ленивой загрузки анимаций
class LazyAnimationObserver {
    constructor() {
        this.observer = new IntersectionObserver(
            (entries) => this.handleIntersection(entries),
            {
                threshold: 0.1,
                rootMargin: '50px 0px -50px 0px'
            }
        );
    }
    
    observe(element, animationClass = 'animate-in') {
        element.dataset.animationClass = animationClass;
        this.observer.observe(element);
    }
    
    handleIntersection(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const element = entry.target;
                const animationClass = element.dataset.animationClass;
                
                element.classList.add(animationClass);
                this.observer.unobserve(element);
            }
        });
    }
    
    disconnect() {
        this.observer.disconnect();
    }
}

// Улучшенный менеджер локального хранилища с обработкой ошибок
class SafeStorage {
    static get(key, defaultValue = null) {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : defaultValue;
        } catch (error) {
            console.warn(`Ошибка чтения ${key} из localStorage:`, error);
            return defaultValue;
        }
    }
    
    static set(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
            return true;
        } catch (error) {
            console.warn(`Ошибка записи ${key} в localStorage:`, error);
            return false;
        }
    }
    
    static remove(key) {
        try {
            localStorage.removeItem(key);
            return true;
        } catch (error) {
            console.warn(`Ошибка удаления ${key} из localStorage:`, error);
            return false;
        }
    }
}

// Менеджер очистки ресурсов для предотвращения memory leaks
class CleanupManager {
    constructor() {
        this.cleanupFunctions = new Set();
        this.intervals = new Set();
        this.timeouts = new Set();
        this.observers = new Set();
    }
    
    addCleanup(func) {
        this.cleanupFunctions.add(func);
        return () => this.cleanupFunctions.delete(func);
    }
    
    addInterval(intervalId) {
        this.intervals.add(intervalId);
        return intervalId;
    }
    
    addTimeout(timeoutId) {
        this.timeouts.add(timeoutId);
        return timeoutId;
    }
    
    addObserver(observer) {
        this.observers.add(observer);
        return observer;
    }
    
    cleanup() {
        // Очистка функций
        this.cleanupFunctions.forEach(func => {
            try {
                func();
            } catch (error) {
                console.warn('Ошибка при очистке:', error);
            }
        });
        this.cleanupFunctions.clear();
        
        // Очистка интервалов
        this.intervals.forEach(id => clearInterval(id));
        this.intervals.clear();
        
        // Очистка таймаутов
        this.timeouts.forEach(id => clearTimeout(id));
        this.timeouts.clear();
        
        // Очистка наблюдателей
        this.observers.forEach(observer => {
            if (observer.disconnect) observer.disconnect();
        });
        this.observers.clear();
    }
}

// Менеджер производительности для мониторинга
class PerformanceMonitor {
    constructor() {
        this.marks = new Map();
        this.measures = new Map();
    }
    
    startMark(name) {
        const markName = `${name}-start`;
        performance.mark(markName);
        this.marks.set(name, Date.now());
        return markName;
    }
    
    endMark(name) {
        const startMarkName = `${name}-start`;
        const endMarkName = `${name}-end`;
        const measureName = name;
        
        performance.mark(endMarkName);
        
        try {
            performance.measure(measureName, startMarkName, endMarkName);
            const measure = performance.getEntriesByName(measureName)[0];
            this.measures.set(name, measure.duration);
            
            if (measure.duration > 16) { // Превышает 1 кадр (60fps)
                console.warn(`Медленная операция ${name}: ${measure.duration.toFixed(2)}ms`);
            }
            
            return measure.duration;
        } catch (error) {
            console.warn(`Ошибка измерения производительности ${name}:`, error);
            return null;
        }
    }
    
    getReport() {
        return {
            marks: Object.fromEntries(this.marks),
            measures: Object.fromEntries(this.measures)
        };
    }
    
    clear() {
        try {
            performance.clearMarks();
            performance.clearMeasures();
        } catch (error) {
            console.warn('Ошибка очистки performance API:', error);
        }
        this.marks.clear();
        this.measures.clear();
    }
}

// Экспорт для использования в других файлах
window.PerformanceUtils = {
    debounce,
    throttleRAF,
    LazyAnimationObserver,
    SafeStorage,
    CleanupManager,
    PerformanceMonitor
};
