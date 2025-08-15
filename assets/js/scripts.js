// Функция для получения DOM элементов
const getElements = () => ({
    html: document.documentElement,
    body: document.body,
    themeToggle: document.getElementById('theme-toggle'),
    moonIcon: document.getElementById('moon-icon'),
    sunIcon: document.getElementById('sun-icon'),
    contactForm: document.getElementById('contactForm'),
    preloader: document.querySelector('.preloader'),
    nav: document.getElementById('main-nav'),
    navTitle: document.getElementById('nav-section-title'),
    toastRoot: document.querySelector('.toast-root'),
});

// Конфигурация Tailwind
window.tailwind.config = {
    darkMode: 'class',
    theme: {
        extend: {
            colors: {
                'profi-red': '#E72541',
                'telegram-blue': '#28A8E9',
            },
        }
    }
};

// Изображения для предзагрузки
const imagesToCache = [
    'https://i.postimg.cc/tTgrWQbR/photo-5242688122792310119-y-1.png',
    'https://i.postimg.cc/MG2M1Wmq/image-1.png',
    'https://i.postimg.cc/mZ5rQLTJ/image-2.png'
];

// Функции
const preloadImages = () => {
    imagesToCache.forEach(src => {
        const img = new Image();
        img.src = src;
    });
};

const updateThemeIcons = (elements) => {
    const isDark = elements.html.classList.contains('dark');
    if (elements.moonIcon && elements.sunIcon) {
        elements.moonIcon.classList.toggle('hidden', isDark);
        elements.sunIcon.classList.toggle('hidden', !isDark);
    }
};

const setupThemeToggle = (elements) => {
    if (elements.themeToggle) {
        elements.themeToggle.addEventListener('click', () => {
            elements.html.classList.toggle('dark');
            elements.html.classList.toggle('light');
            localStorage.setItem('theme', elements.html.classList.contains('dark') ? 'dark' : 'light');
            updateThemeIcons(elements);
        });
    }
};

// menu logic removed

const initSwiper = () => {
    const swiperElement = document.querySelector('.testimonials-slider');
    if (swiperElement) {
        const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const hoverCapable = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    const sw = new Swiper('.testimonials-slider', {
            slidesPerView: 'auto',
            spaceBetween: 16,
            loop: true,
            allowTouchMove: true,
            speed: reduce ? 600 : 14000,
            autoplay: reduce ? false : {
                delay: 0,
                disableOnInteraction: false,
        pauseOnMouseEnter: hoverCapable,
            },
            freeMode: {
                enabled: !reduce,
                momentum: false,
            },
            on: {
                init(sw) {
                    if (!reduce) sw.wrapperEl.style.transitionTimingFunction = 'linear';
                },
                slideChangeTransitionStart(sw) {
                    if (!reduce) sw.wrapperEl.style.transitionTimingFunction = 'linear';
                },
            },
            a11y: true,
    });
    if (!reduce && hoverCapable && sw && sw.autoplay) {
        swiperElement.addEventListener('mouseenter', () => sw.autoplay.stop());
        swiperElement.addEventListener('mouseleave', () => sw.autoplay.start());
    }
    return sw;
    }
};

const initTrustSwiper = () => {
    const el = document.querySelector('.trust-slider');
    if (!el) return null;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const hoverCapable = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    const sw = new Swiper('.trust-slider', {
        slidesPerView: 'auto',
        spaceBetween: 16,
        loop: true,
        allowTouchMove: true,
        speed: reduce ? 600 : 14000,
        autoplay: reduce ? false : {
            delay: 0,
            disableOnInteraction: false,
            pauseOnMouseEnter: hoverCapable,
        },
        freeMode: {
            enabled: !reduce,
            momentum: false,
        },
        // линейное движение без ускорений
        on: {
            init(sw) {
                if (!reduce) sw.wrapperEl.style.transitionTimingFunction = 'linear';
            },
            slideChangeTransitionStart(sw) {
                if (!reduce) sw.wrapperEl.style.transitionTimingFunction = 'linear';
            },
        },
        a11y: true,
    });
    if (!reduce && hoverCapable && sw && sw.autoplay) {
        el.addEventListener('mouseenter', () => sw.autoplay.stop());
        el.addEventListener('mouseleave', () => sw.autoplay.start());
    }
    return sw;
};

const setupForm = (elements) => {
    if (elements.contactForm) {
        elements.contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const formData = new FormData(elements.contactForm);
            const data = Object.fromEntries(formData);
            // простая валидация телефона
            const phone = (data.phone || '').toString().trim();
            if (phone.length < 6) {
                showToast('Проверьте телефон', 'Введите корректный номер.', 'error');
                return;
            }
            
            // TODO: Добавить отправку данных на сервер
            console.log('Форма отправлена:', data);
            
            // Демонстрация успеха (можно заменить на реальный ответ)
            showToast('Заявка отправлена', 'Спасибо! Мы ответим в течение 1–3 часов.', 'success');
            elements.contactForm.reset();
        });
    }
};

const initSmoothScroll = (elements) => {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (!href || href === '#') return;
            e.preventDefault();
            const targetId = href.substring(1);
            const targetElement = document.getElementById(targetId);

            if (targetElement) {
                targetElement.scrollIntoView({ behavior: 'smooth' });
                if (elements.mobileMenu && !elements.mobileMenu.classList.contains('hidden')) {
                    elements.mobileMenu.classList.add('hidden');
                }
            }
        });
    });
};

// Анимация появления секций
function animateSections() {
    const sections = document.querySelectorAll('.section-animate');
    const trigger = window.innerHeight * 0.85;
    sections.forEach(section => {
        const rect = section.getBoundingClientRect();
        if (rect.top < trigger) {
            section.classList.add('visible');
        }
    });
}
window.addEventListener('scroll', animateSections);
document.addEventListener('DOMContentLoaded', animateSections);

// Инициализация
document.addEventListener('DOMContentLoaded', () => {
    const elements = getElements();
    // Загрузка сохраненной темы
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        elements.html.classList.add(savedTheme);
    } else {
        elements.html.classList.add('light');
    }
    updateThemeIcons(elements);

    // Настройка всех обработчиков событий
    setupThemeToggle(elements);
    // menu logic removed
    setupForm(elements);
    
    // Инициализация компонентов
    initSwiper();
    initTrustSwiper();
    initSmoothScroll(elements);

    // Навбар: прозрачный вверху, заливка при скролле
    setupDynamicNavbar(elements);
    setupSectionTitleObserver(elements);

    // Настройка кнопок CTA
    // удалены переопределения: ссылки работают по умолчанию
});

// Обработка загрузки страницы
window.addEventListener('load', () => {
    const elements = getElements();
    preloadImages();
    if (elements.preloader) {
        elements.preloader.classList.add('hidden');
    }
});

// Прозрачная шапка при загрузке и смена фона при прокрутке
window.addEventListener('scroll', () => {
    // Кнопка наверх
    const scrollBtn = document.getElementById('scrollToTopBtn');
    if (scrollBtn) {
        if (window.scrollY > 300) {
            scrollBtn.style.display = 'block';
        } else {
            scrollBtn.style.display = 'none';
        }
    }
});

// Клик по кнопке наверх (безопасный доступ)
document.addEventListener('DOMContentLoaded', () => {
    const scrollBtn = document.getElementById('scrollToTopBtn');
    if (scrollBtn) {
        scrollBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }
});

// Переключение формы студент/родитель (wait DOM)
document.addEventListener('DOMContentLoaded', () => {
    const roleRadios = document.querySelectorAll('input[name="role"]');
    const studentFields = document.getElementById('student-fields');
    const parentFields = document.getElementById('parent-fields');
    if (roleRadios.length && studentFields && parentFields) {
        roleRadios.forEach(radio => {
            radio.addEventListener('change', () => {
                if (radio.value === 'student' && radio.checked) {
                    studentFields.style.display = '';
                    parentFields.style.display = 'none';
                } else if (radio.value === 'parent' && radio.checked) {
                    studentFields.style.display = 'none';
                    parentFields.style.display = '';
                }
            });
        });
    }
});

// Анимация открытия/закрытия мобильного меню
// menu logic removed

// --- Navbar helpers ---
function setupDynamicNavbar(elements) {
    const { nav, body } = elements;
    if (!nav) return;

    const applyState = () => {
        const solid = window.scrollY > 60;
        nav.classList.toggle('nav--solid', solid);
        nav.classList.toggle('nav--transparent', !solid);
        body.classList.toggle('nav-solid-offset', solid);
    };

    // initial
    applyState();
    window.addEventListener('scroll', applyState, { passive: true });
}

function setupSectionTitleObserver(elements) {
    const { navTitle, nav } = elements;
    if (!navTitle || !nav) return;

    const sections = Array.from(document.querySelectorAll('main section[id]'));
    if (!sections.length) return;

    const titlesMap = new Map();
    sections.forEach(sec => {
        const h = sec.querySelector('h2, h1');
        const title = (h && h.textContent.trim()) || sec.id || '';
        titlesMap.set(sec, title);
    });

    const getNavHeight = () => Math.max(0, nav.getBoundingClientRect().height || 0);
    let lastTitle = '';

    const update = () => {
        const y = getNavHeight() + 8; // порог под шапкой
        let current = null;
        for (const sec of sections) {
            const r = sec.getBoundingClientRect();
            if (r.top <= y && r.bottom > y) {
                current = sec;
                break;
            }
        }

        let newTitle = '';
        if (current && current.id !== 'hero') {
            newTitle = titlesMap.get(current) || '';
        }

        if (newTitle !== lastTitle) {
            if (!newTitle) {
                navTitle.style.opacity = '0';
                navTitle.style.transform = 'translateY(4px)';
                navTitle.textContent = '';
                lastTitle = '';
            } else {
                navTitle.style.opacity = '0';
                navTitle.style.transform = 'translateY(4px)';
                setTimeout(() => {
                    navTitle.textContent = newTitle;
                    navTitle.style.opacity = '1';
                    navTitle.style.transform = 'translateY(0)';
                    lastTitle = newTitle;
                }, 120);
            }
        } else {
            if (newTitle) {
                navTitle.style.opacity = '1';
                navTitle.style.transform = 'translateY(0)';
            } else {
                navTitle.style.opacity = '0';
                navTitle.style.transform = 'translateY(4px)';
            }
        }
    };

    // initial and listeners
    update();
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
}

// --- Toast helper ---
function showToast(title, desc = '', type = 'success', timeout = 3500) {
    const root = document.querySelector('.toast-root');
    if (!root) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const el = document.createElement('div');
    el.className = `toast toast--${type}`;
    el.innerHTML = `
        <div class="toast__title">${title}</div>
        ${desc ? `<div class="toast__desc">${desc}</div>` : ''}
    `;
    root.appendChild(el);
    // force layout
    void el.offsetWidth;
    el.classList.add('show');
    const t = setTimeout(() => {
        el.classList.remove('show');
        const removeDelay = reduce ? 0 : 220;
        setTimeout(() => el.remove(), removeDelay);
    }, timeout);
    // Allow click to dismiss
    el.addEventListener('click', () => {
        clearTimeout(t);
        el.classList.remove('show');
        setTimeout(() => el.remove(), reduce ? 0 : 180);
    });
}
window.showToast = showToast;
