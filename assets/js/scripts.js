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
    navName: document.getElementById('nav-name'),
    navSubtitle: document.getElementById('nav-subtitle'),
    menuBtn: document.getElementById('menu-btn'),
    notificationsBtn: document.getElementById('notifications-btn'),
    dropdownMenu: document.getElementById('dropdown-menu'),
    notificationsPanel: document.getElementById('notifications-panel'),
    notificationBadge: document.getElementById('notification-badge'),
    clearNotifications: document.getElementById('clear-notifications'),
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
    const lightIcon = document.getElementById('theme-icon-light');
    const darkIcon = document.getElementById('theme-icon-dark');
    
    console.log('Updating theme icons - isDark:', isDark, 'lightIcon:', !!lightIcon, 'darkIcon:', !!darkIcon);
    
    if (lightIcon && darkIcon) {
        if (isDark) {
            lightIcon.classList.add('hidden');
            lightIcon.classList.remove('block');
            darkIcon.classList.remove('hidden');
            darkIcon.classList.add('block');
            console.log('Icons updated for dark theme');
        } else {
            lightIcon.classList.remove('hidden');
            lightIcon.classList.add('block');
            darkIcon.classList.add('hidden');
            darkIcon.classList.remove('block');
            console.log('Icons updated for light theme');
        }
    } else {
        console.warn('Theme icons not found');
    }
};

const setupThemeToggle = (elements) => {
    if (elements.themeToggle) {
        elements.themeToggle.addEventListener('click', () => {
            const isDark = elements.html.classList.contains('dark');
            
            if (isDark) {
                elements.html.classList.remove('dark');
                localStorage.setItem('theme', 'light');
            } else {
                elements.html.classList.add('dark');
                localStorage.setItem('theme', 'dark');
            }
            updateThemeIcons(elements);
        });
    }
    
    // Инициализация темы при загрузке
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
        elements.html.classList.add('dark');
    } else {
        elements.html.classList.remove('dark');
    }
    updateThemeIcons(elements);
};

// Модальное окно записи
const setupBookingModal = () => {
    const modal = document.getElementById('booking-modal');
    const openButton = document.getElementById('cta-header-desktop');
    const closeButton = document.getElementById('close-modal');
    const form = document.getElementById('modal-booking-form');
    
    if (!modal || !openButton || !closeButton) return;
    
    // Функция открытия модального окна
    const openModal = () => {
        modal.classList.remove('opacity-0', 'invisible');
        modal.classList.add('opacity-100', 'visible');
        const modalContent = modal.querySelector('div > div');
        if (modalContent) {
            modalContent.classList.remove('scale-95');
            modalContent.classList.add('scale-100');
        }
        document.body.style.overflow = 'hidden';
        
        // Фокус на первом поле
        setTimeout(() => {
            const firstInput = modal.querySelector('input');
            if (firstInput) firstInput.focus();
        }, 100);
    };
    
    // Функция закрытия модального окна
    const closeModal = () => {
        modal.classList.add('opacity-0', 'invisible');
        modal.classList.remove('opacity-100', 'visible');
        const modalContent = modal.querySelector('div > div');
        if (modalContent) {
            modalContent.classList.add('scale-95');
            modalContent.classList.remove('scale-100');
        }
        document.body.style.overflow = '';
    };
    
    // Обработчики событий
    openButton.addEventListener('click', (e) => {
        e.preventDefault();
        openModal();
    });
    
    closeButton.addEventListener('click', closeModal);
    
    // Закрытие по клику на фон
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });
    
    // Закрытие по Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && !modal.classList.contains('invisible')) {
            closeModal();
        }
    });
    
    // Обработка кнопки "К ценам" - закрывает модальное окно и переходит к ценам
    const priceButton = modal.querySelector('a[href="#pricing"]');
    if (priceButton) {
        priceButton.addEventListener('click', () => {
            closeModal();
        });
    }
    
    // Обработка отправки формы
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const formData = new FormData(form);
            const data = Object.fromEntries(formData);
            
            console.log('Form submitted:', data);
            
            // Здесь можно добавить отправку данных на сервер
            // После успешной отправки:
            alert('Заявка отправлена! Мы свяжемся с вами в ближайшее время.');
            closeModal();
            form.reset();
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

// Настройка интерактивных эффектов для hero CTA кнопок
const setupHeroCTAEffects = () => {
    const heroPrimary = document.querySelector('.hero-cta-primary');
    const heroSecondary = document.querySelector('.hero-cta-secondary');
    
    // Обработка клика по основной CTA
    if (heroPrimary) {
        heroPrimary.addEventListener('click', (e) => {
            // Добавляем эффект пульсации
            heroPrimary.style.transform = 'scale(0.96)';
            setTimeout(() => {
                heroPrimary.style.transform = '';
            }, 150);
            
            // Отслеживание клика (для аналитики)
            console.log('Hero CTA: Записаться на пробное');
        });
    }
    
    // Обработка клика по вторичной CTA
    if (heroSecondary) {
        heroSecondary.addEventListener('click', (e) => {
            // Отслеживание клика
            console.log('Hero CTA: Задать вопрос в Telegram');
        });
    }
};

// Исправленная компактная CTA кнопка с корректным переключением
function setupCompactCTA() {
    const ctaButton = document.getElementById('cta-header-desktop');
    const ctaIcon = document.getElementById('cta-icon');
    const ctaText = document.getElementById('cta-text');
    
    if (!ctaButton || !ctaIcon || !ctaText) return;
    
    let isCompact = false;
    let isTransitioning = false;
    
    const updateCTAState = () => {
        const scrollY = window.scrollY;
        const shouldBeCompact = scrollY > 400; // Увеличили порог срабатывания
        
        // Предотвращаем множественные анимации
        if (isTransitioning || (shouldBeCompact === isCompact)) return;
        
        isTransitioning = true;
        
        if (shouldBeCompact) {
            // Переход в компактный режим
            isCompact = true;
            ctaButton.classList.add('compact');
            
            setTimeout(() => {
                isTransitioning = false;
            }, 400);
            
        } else {
            // Переход в полный режим
            isCompact = false;
            ctaButton.classList.remove('compact');
            
            setTimeout(() => {
                isTransitioning = false;
            }, 400);
        }
    };
    
    // Упрощенный debounced scroll handler
    let scrollTimeout;
    const debouncedUpdateCTA = () => {
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(updateCTAState, 100);
    };
    
    // Начальное состояние
    updateCTAState();
    
    // Обработчик скролла
    window.addEventListener('scroll', debouncedUpdateCTA, { passive: true });
    
    // Cleanup function
    return () => {
        window.removeEventListener('scroll', debouncedUpdateCTA);
        clearTimeout(scrollTimeout);
    };
}

// Настройка полноэкранного меню и уведомлений с улучшенной анимацией
const setupMenuAndNotifications = (elements) => {
    const { menuBtn, notificationsBtn, dropdownMenu, notificationsPanel, notificationBadge, clearNotifications } = elements;
    const ctaButton = document.getElementById('cta-header-desktop');
    const menuIcon = menuBtn?.querySelector('svg');
    
    let isMenuOpen = false;
    let isNotificationsOpen = false;
    let focusedIndex = -1;
    let menuItems = [];
    
    // Функции для показа/скрытия панелей с улучшенными анимациями
    const showPanel = (panel) => {
        panel.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
        panel.classList.remove('opacity-0', 'invisible');
        panel.classList.add('opacity-100', 'visible');
        
        // Добавляем фокус для доступности
        if (panel === dropdownMenu) {
            menuItems = panel.querySelectorAll('a, button');
            focusedIndex = 0;
            if (menuItems[0]) menuItems[0].focus();
        }
    };
    
    const hidePanel = (panel) => {
        panel.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
        panel.classList.add('opacity-0', 'invisible');
        panel.classList.remove('opacity-100', 'visible');
        focusedIndex = -1;
    };
    
    const hideBothPanels = () => {
        if (dropdownMenu) hidePanel(dropdownMenu);
        if (notificationsPanel) hidePanel(notificationsPanel);
        isMenuOpen = false;
        isNotificationsOpen = false;
        
        // Возвращаем кнопку записаться при закрытии меню
        if (ctaButton) {
            ctaButton.style.display = 'flex';
        }
        
        // Возвращаем иконку гамбургера
        if (menuIcon) {
            menuIcon.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>';
        }
    };
    
    // Улучшенная клавиатурная навигация
    const handleKeyNavigation = (e) => {
        if (!isMenuOpen || menuItems.length === 0) return;
        
        switch (e.key) {
            case 'ArrowDown':
                e.preventDefault();
                focusedIndex = Math.min(focusedIndex + 1, menuItems.length - 1);
                menuItems[focusedIndex].focus();
                break;
            case 'ArrowUp':
                e.preventDefault();
                focusedIndex = Math.max(focusedIndex - 1, 0);
                menuItems[focusedIndex].focus();
                break;
            case 'Home':
                e.preventDefault();
                focusedIndex = 0;
                menuItems[focusedIndex].focus();
                break;
            case 'End':
                e.preventDefault();
                focusedIndex = menuItems.length - 1;
                menuItems[focusedIndex].focus();
                break;
        }
    };
    
    // Клик обработчик для меню
    if (menuBtn && dropdownMenu) {
        menuBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            
            if (isNotificationsOpen) {
                hidePanel(notificationsPanel);
                isNotificationsOpen = false;
            }
            
            if (isMenuOpen) {
                hidePanel(dropdownMenu);
                isMenuOpen = false;
                
                // Показываем кнопку записаться обратно
                if (ctaButton) {
                    ctaButton.style.display = 'flex';
                }
                
                // Возвращаем иконку гамбургера
                if (menuIcon) {
                    menuIcon.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>';
                }
            } else {
                showPanel(dropdownMenu);
                isMenuOpen = true;
                
                // Скрываем кнопку записаться на мобильных
                if (ctaButton) {
                    ctaButton.style.display = 'none';
                }
                
                // Меняем иконку на крестик
                if (menuIcon) {
                    menuIcon.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>';
                }
            }
        });
    }
    
    // Обработчик кнопки уведомлений (остается без изменений)
    if (notificationsBtn && notificationsPanel) {
        notificationsBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            
            if (isMenuOpen) {
                hidePanel(dropdownMenu);
                isMenuOpen = false;
            }
            
            if (isNotificationsOpen) {
                hidePanel(notificationsPanel);
                isNotificationsOpen = false;
            } else {
                showPanel(notificationsPanel);
                isNotificationsOpen = true;
                // Скрыть индикатор новых уведомлений при открытии панели
                if (notificationBadge) {
                    notificationBadge.classList.add('hidden');
                }
            }
        });
    }
    
    // Обработчик очистки уведомлений
    if (clearNotifications) {
        clearNotifications.addEventListener('click', () => {
            const notificationsList = document.getElementById('notifications-list');
            if (notificationsList) {
                // Плавная анимация очистки
                notificationsList.style.transition = 'opacity 0.3s ease';
                notificationsList.style.opacity = '0';
                
                setTimeout(() => {
                    notificationsList.innerHTML = '<p class="text-sm text-gray-500 dark:text-gray-400 text-center py-4">Нет новых уведомлений</p>';
                    notificationsList.style.opacity = '1';
                }, 300);
            }
            if (notificationBadge) {
                notificationBadge.classList.add('hidden');
            }
        });
    }
    
    // Закрытие панелей при клике вне их (улучшенное)
    document.addEventListener('click', (e) => {
        const isClickInsideMenu = dropdownMenu?.contains(e.target) || menuBtn?.contains(e.target);
        const isClickInsideNotifications = notificationsPanel?.contains(e.target) || notificationsBtn?.contains(e.target);
        
        if (!isClickInsideMenu && !isClickInsideNotifications) {
            hideBothPanels();
        }
    });
    
    // Улучшенная клавиатурная навигация
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            hideBothPanels();
            // Возвращаем фокус на кнопку меню
            if (menuBtn) menuBtn.focus();
        } else {
            handleKeyNavigation(e);
        }
    });
    
    // Симуляция новых уведомлений + интеграция с dashboard
    if (notificationBadge) {
        setTimeout(() => {
            loadDashboardNotifications();
        }, 1000);
    }
    
    // Cleanup function для предотвращения memory leaks
    return () => {
        document.removeEventListener('click', hideBothPanels);
        document.removeEventListener('keydown', handleKeyNavigation);
    };
};

// Улучшенная функция загрузки уведомлений из dashboard с обработкой ошибок
function loadDashboardNotifications() {
    try {
        const dashboardNotifications = JSON.parse(localStorage.getItem('mainSiteNotifications') || '[]');
        const notificationsList = document.getElementById('notifications-list');
        const notificationBadge = document.getElementById('notification-badge');
        
        if (!notificationsList) return;
        
        if (dashboardNotifications.length === 0) {
            // Показать уведомления по умолчанию если нет dashboard уведомлений
            return;
        }
        
        // Очистить существующие уведомления с анимацией
        const existingNotifications = notificationsList.children;
        Array.from(existingNotifications).forEach((child, index) => {
            setTimeout(() => {
                child.style.transition = 'all 0.3s ease';
                child.style.opacity = '0';
                child.style.transform = 'translateX(-20px)';
            }, index * 50);
        });
        
        setTimeout(() => {
            notificationsList.innerHTML = '';
            
            // Показать уведомления из dashboard с анимацией появления
            dashboardNotifications.slice(0, 5).forEach((notification, index) => {
                setTimeout(() => {
                    const notificationElement = createNotificationElement(notification);
                    notificationElement.style.opacity = '0';
                    notificationElement.style.transform = 'translateX(20px)';
                    notificationsList.appendChild(notificationElement);
                    
                    // Анимация появления
                    requestAnimationFrame(() => {
                        notificationElement.style.transition = 'all 0.3s ease';
                        notificationElement.style.opacity = '1';
                        notificationElement.style.transform = 'translateX(0)';
                    });
                }, index * 100);
            });
        }, 300);
        
        // Показать badge если есть уведомления
        if (dashboardNotifications.length > 0 && notificationBadge) {
            notificationBadge.classList.remove('hidden');
            notificationBadge.textContent = Math.min(dashboardNotifications.length, 9);
        }
    } catch (error) {
        console.error('Ошибка загрузки уведомлений:', error);
        // Fallback для случая ошибки
        const notificationsList = document.getElementById('notifications-list');
        if (notificationsList) {
            notificationsList.innerHTML = '<p class="text-sm text-red-500 text-center py-4">Ошибка загрузки уведомлений</p>';
        }
    }
}

// Создание элемента уведомления
function createNotificationElement(notification) {
    const div = document.createElement('div');
    const colorClasses = {
        'blue': 'rgba(37, 99, 235, 0.05) #2563eb #1d4ed8 #2563eb',
        'green': 'rgba(34, 197, 94, 0.05) #22c55e #16a34a #22c55e',
        'yellow': 'rgba(245, 158, 11, 0.05) #f59e0b #d97706 #f59e0b',
        'purple': 'rgba(168, 85, 247, 0.05) #a855f7 #9333ea #a855f7',
        'orange': 'rgba(249, 115, 22, 0.05) #f97316 #ea580c #f97316'
    };
    
    const colors = colorClasses[notification.color] || colorClasses['blue'];
    const [bgColor, borderColor, titleColor, textColor] = colors.split(' ');
    
    div.className = `p-3 rounded-lg border-l-4`;
    div.style.backgroundColor = bgColor;
    div.style.borderLeftColor = borderColor;
    
    div.innerHTML = `
        <div class="flex items-start">
            <div class="flex-shrink-0">
                <span style="color: ${borderColor}; font-size: 18px;">${notification.icon}</span>
            </div>
            <div class="ml-3 flex-1">
                <p class="text-sm font-medium" style="color: ${titleColor};">${notification.title}</p>
                <p class="text-xs mt-1" style="color: ${textColor};">${notification.message}</p>
                <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">${notification.timeAgo || 'только что'}</p>
            </div>
        </div>
    `;
    
    return div;
}

// Автообновление уведомлений каждые 30 секунд
setInterval(loadDashboardNotifications, 30000);

// Загрузка баннера формата из панели управления
function loadFormatBanner() {
    const storedBanner = localStorage.getItem('formatBanner');
    const bannerContainer = document.getElementById('format-banner-container');
    
    if (!bannerContainer) return;
    
    if (!storedBanner) {
        bannerContainer.innerHTML = '';
        return;
    }
    
    try {
        const banner = JSON.parse(storedBanner);
        const bannerElement = createFormatBannerElement(banner);
        bannerContainer.innerHTML = '';
        bannerContainer.appendChild(bannerElement);
    } catch (e) {
        console.error('Error loading format banner:', e);
        bannerContainer.innerHTML = '';
    }
}

// Создание элемента баннера формата
function createFormatBannerElement(banner) {
    const div = document.createElement('div');
    
    const colorClasses = {
        'blue': 'rgba(37, 99, 235, 0.05) #2563eb #1d4ed8 #2563eb',
        'green': 'rgba(34, 197, 94, 0.05) #22c55e #16a34a #22c55e',
        'yellow': 'rgba(245, 158, 11, 0.05) #f59e0b #d97706 #f59e0b',
        'purple': 'rgba(168, 85, 247, 0.05) #a855f7 #9333ea #a855f7',
        'orange': 'rgba(249, 115, 22, 0.05) #f97316 #ea580c #f97316',
        'red': 'rgba(239, 68, 68, 0.05) #ef4444 #dc2626 #ef4444'
    };
    
    const colors = colorClasses[banner.color] || colorClasses['blue'];
    const [bgColor, borderColor, titleColor, textColor] = colors.split(' ');
    
    div.className = `p-3 rounded-lg border-l-4 text-center`;
    div.style.backgroundColor = bgColor;
    div.style.borderLeftColor = borderColor;
    
    div.innerHTML = `
        <div class="flex items-center justify-center">
            <span style="color: ${borderColor}; font-size: 16px; margin-right: 8px;">${banner.icon}</span>
            <p class="text-sm font-medium" style="color: ${titleColor};">${banner.text}</p>
        </div>
    `;
    
    return div;
}

// Автообновление баннера формата каждые 30 секунд
setInterval(loadFormatBanner, 30000);

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

// Анимация счетчиков статистики в hero
function animateCounters() {
    const heroStats = document.querySelectorAll('.glass-card-enhanced .text-3xl, .glass-card-enhanced .text-4xl');
    const isHeroVisible = document.querySelector('#hero.visible');
    
    if (isHeroVisible && heroStats.length > 0) {
        heroStats.forEach((stat, index) => {
            setTimeout(() => {
                const text = stat.textContent.trim();
                if (text.includes('+') || text.includes('%') || /^\d+$/.test(text)) {
                    stat.style.animation = `countUp 1s ease-out both`;
                }
            }, index * 200);
        });
    }
    
    // Анимация для новой секции результатов
    const studentResultsStats = document.querySelectorAll('.text-4xl.font-black, .text-5xl.font-black');
    const studentResultsSection = document.querySelector('section');
    
    studentResultsStats.forEach((stat, index) => {
        const rect = stat.getBoundingClientRect();
        const trigger = window.innerHeight * 0.8;
        
        if (rect.top < trigger && rect.bottom > 0) {
            setTimeout(() => {
                stat.style.animation = `countUp 1.5s ease-out both`;
            }, index * 100);
        }
    });
}

// Улучшенная анимация появления с добавлением hero счетчиков
function enhancedAnimateSections() {
    animateSections();
    animateCounters();
}

window.addEventListener('scroll', enhancedAnimateSections);
document.addEventListener('DOMContentLoaded', enhancedAnimateSections);

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
    setupBookingModal();
    setupForm(elements);
    setupHeroCTAEffects();
    setupMenuAndNotifications(elements);
    setupCompactCTA();
    
    // Инициализация компонентов
    initSwiper();
    initTrustSwiper();
    initSmoothScroll(elements);

    // Навбар: фиксированный белый с переходами названий и динамической тенью
    setupDynamicShadow(elements);
    setupSectionTitleObserver(elements);

    // Настройка кнопок CTA
    // удалены переопределения: ссылки работают по умолчанию
    
    // Загрузка баннера формата
    loadFormatBanner();
});

// Обработка загрузки страницы
window.addEventListener('load', () => {
    const elements = getElements();
    preloadImages();
    if (elements.preloader) {
        elements.preloader.classList.add('hidden');
    }
});

// Улучшенная кнопка "наверх" с плавными анимациями
window.addEventListener('scroll', () => {
    // Кнопка наверх
    const scrollBtn = document.getElementById('scrollToTopBtn');
    if (scrollBtn) {
        if (window.scrollY > 300) {
            // Показать кнопку с плавной анимацией
            scrollBtn.classList.remove('opacity-0', 'invisible', 'translate-y-4');
            scrollBtn.classList.add('opacity-100', 'visible', 'translate-y-0');
        } else {
            // Скрыть кнопку с плавной анимацией
            scrollBtn.classList.remove('opacity-100', 'visible', 'translate-y-0');
            scrollBtn.classList.add('opacity-0', 'invisible', 'translate-y-4');
        }
    }
});

// Улучшенный обработчик клика с анимационной обратной связью
document.addEventListener('DOMContentLoaded', () => {
    const scrollBtn = document.getElementById('scrollToTopBtn');
    if (scrollBtn) {
        scrollBtn.addEventListener('click', () => {
            // Добавить анимацию клика
            scrollBtn.classList.add('animate-pulse');
            setTimeout(() => {
                scrollBtn.classList.remove('animate-pulse');
            }, 600);
            
            // Плавная прокрутка наверх
            window.scrollTo({ 
                top: 0, 
                behavior: 'smooth' 
            });
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

// Улучшенная настройка динамической тени для шапки с разделением hero/other sections
function setupDynamicShadow(elements) {
    const { nav } = elements;
    if (!nav) return;

    const heroSection = document.getElementById('hero');
    if (!heroSection) return;

    const updateShadow = () => {
        const heroRect = heroSection.getBoundingClientRect();
        const navHeight = nav.offsetHeight;
        const scrollY = window.scrollY;
        
        // Определяем, находится ли шапка над hero секцией
        const isOverHero = heroRect.bottom > navHeight;
        
        if (isOverHero) {
            // Шапка над hero секцией - прозрачная без тени
            nav.classList.remove('with-shadow', 'after-hero');
            nav.classList.add('no-shadow', 'over-hero');
        } else {
            // Шапка после hero секции - с тенью
            nav.classList.remove('no-shadow', 'over-hero');
            nav.classList.add('with-shadow', 'after-hero');
        }
    };

    // Начальное состояние
    nav.classList.add('no-shadow', 'over-hero');
    
    let updateTimeout;
    const throttledUpdateShadow = () => {
        clearTimeout(updateTimeout);
        updateTimeout = setTimeout(updateShadow, 50);
    };

    updateShadow();
    window.addEventListener('scroll', throttledUpdateShadow, { passive: true });
    window.addEventListener('resize', throttledUpdateShadow);
    
    return () => {
        clearTimeout(updateTimeout);
        window.removeEventListener('scroll', throttledUpdateShadow);
        window.removeEventListener('resize', throttledUpdateShadow);
    };
}

// Упрощенная и надежная настройка наблюдателя названий разделов
function setupSectionTitleObserver(elements) {
    const { navTitle, navName, navSubtitle, nav } = elements;
    if (!navTitle || !navName || !navSubtitle || !nav) return;

    const sections = Array.from(document.querySelectorAll('main section[id]'));
    if (!sections.length) return;

    const titlesMap = new Map();
    sections.forEach(sec => {
        const h = sec.querySelector('h2, h1');
        const title = (h && h.textContent.trim()) || sec.id || '';
        titlesMap.set(sec, title);
    });

    let lastTitle = '';
    let isShowingSection = false;
    let isTransitioning = false;

    const update = () => {
        if (isTransitioning) return;
        
        const scrollY = window.scrollY;
        const navHeight = nav.getBoundingClientRect().height || 0;
        let current = null;
        
        // Упрощенное определение текущей секции
        for (const sec of sections) {
            const rect = sec.getBoundingClientRect();
            const sectionTop = rect.top + scrollY;
            const sectionBottom = sectionTop + rect.height;
            
            if (scrollY + navHeight >= sectionTop && scrollY < sectionBottom) {
                current = sec;
                break;
            }
        }

        let newTitle = '';
        if (current && current.id !== 'hero') {
            newTitle = titlesMap.get(current) || '';
        }

        const shouldShowName = !current || current.id === 'hero';

        if (shouldShowName && isShowingSection) {
            // Переход к имени
            isTransitioning = true;
            
            navTitle.style.opacity = '0';
            
            setTimeout(() => {
                navTitle.textContent = '';
                navTitle.classList.add('opacity-0');
                navName.classList.remove('hidden');
                navSubtitle.classList.remove('hidden');
                navName.style.opacity = '1';
                navSubtitle.style.opacity = '1';
                
                isShowingSection = false;
                isTransitioning = false;
            }, 100);
            
        } else if (!shouldShowName && newTitle && newTitle !== lastTitle) {
            // Переход к названию секции
            isTransitioning = true;
            
            navName.style.opacity = '0';
            navSubtitle.style.opacity = '0';
            
            setTimeout(() => {
                navName.classList.add('hidden');
                navSubtitle.classList.add('hidden');
                navTitle.textContent = newTitle;
                navTitle.classList.remove('opacity-0');
                navTitle.style.opacity = '1';
                
                lastTitle = newTitle;
                isShowingSection = true;
                isTransitioning = false;
            }, 100);
        }
    };

    // Простой throttled update
    let updateTimeout;
    const throttledUpdate = () => {
        clearTimeout(updateTimeout);
        updateTimeout = setTimeout(update, 50);
    };

    // Начальное состояние
    update();
    window.addEventListener('scroll', throttledUpdate, { passive: true });
    window.addEventListener('resize', throttledUpdate);
    
    return () => {
        clearTimeout(updateTimeout);
        window.removeEventListener('scroll', throttledUpdate);
        window.removeEventListener('resize', throttledUpdate);
    };
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
