// ===== БУРГЕР-МЕНЮ =====
document.getElementById('menuToggle').addEventListener('click', function(e) {
    e.stopPropagation();
    document.getElementById('navMenu').classList.toggle('active');
});

document.addEventListener('click', function(e) {
    const navMenu = document.getElementById('navMenu');
    const menuToggle = document.getElementById('menuToggle');

    if (navMenu.classList.contains('active') &&
        !navMenu.contains(e.target) &&
        !menuToggle.contains(e.target)) {
        navMenu.classList.remove('active');
    }
});

// ===== ПЛАВНАЯ ПРОКРУТКА И ЗАКРЫТИЕ МЕНЮ =====
document.querySelectorAll('nav a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();

        const targetId = this.getAttribute('href');
        if (targetId === '#') return;

        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            document.getElementById('navMenu').classList.remove('active');
            window.scrollTo({
                top: targetElement.offsetTop - 80,
                behavior: 'smooth'
            });
        }
    });
});

// Карусель отзывов
class ReviewsCarousel {
    constructor() {
        this.carousel = document.querySelector('.reviews-carousel');
        if (!this.carousel) return;

        this.slides = document.querySelectorAll('.carousel-slide');
        this.dots = document.querySelectorAll('.dot');
        this.prevBtn = document.querySelector('.carousel-btn.prev');
        this.nextBtn = document.querySelector('.carousel-btn.next');
        this.currentSlide = 0;
        this.autoSlideInterval = null;

        this.init();
    }

    init() {
        this.showSlide(this.currentSlide);
        this.prevBtn.addEventListener('click', () => this.prevSlide());
        this.nextBtn.addEventListener('click', () => this.nextSlide());

        this.dots.forEach(dot => {
            dot.addEventListener('click', (e) => {
                const slideIndex = parseInt(e.target.dataset.slide);
                this.showSlide(slideIndex);
            });
        });

        this.startAutoSlide();
        this.carousel.addEventListener('mouseenter', () => this.stopAutoSlide());
        this.carousel.addEventListener('mouseleave', () => this.startAutoSlide());
        this.setupTouchEvents();
    }

    showSlide(index) {
        this.slides.forEach(slide => slide.classList.remove('active'));
        this.dots.forEach(dot => dot.classList.remove('active'));
        this.slides[index].classList.add('active');
        this.dots[index].classList.add('active');
        this.currentSlide = index;
    }

    nextSlide() {
        let nextIndex = this.currentSlide + 1;
        if (nextIndex >= this.slides.length) nextIndex = 0;
        this.showSlide(nextIndex);
    }

    prevSlide() {
        let prevIndex = this.currentSlide - 1;
        if (prevIndex < 0) prevIndex = this.slides.length - 1;
        this.showSlide(prevIndex);
    }

    startAutoSlide() {
        this.stopAutoSlide();
        this.autoSlideInterval = setInterval(() => this.nextSlide(), 5000);
    }

    stopAutoSlide() {
        if (this.autoSlideInterval) {
            clearInterval(this.autoSlideInterval);
            this.autoSlideInterval = null;
        }
    }

    setupTouchEvents() {
        let touchStartX = 0;
        let touchEndX = 0;

        this.carousel.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        });

        this.carousel.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            this.handleSwipe(touchStartX, touchEndX);
        });
    }

    handleSwipe(startX, endX) {
        const swipeThreshold = 50;
        if (startX - endX > swipeThreshold) {
            this.nextSlide();
        } else if (endX - startX > swipeThreshold) {
            this.prevSlide();
        }
    }
}

// ===== СЧЕТЧИКИ АНИМАЦИИ =====
class CountersAnimation {
    constructor() {
        this.counters = document.querySelectorAll('.counter, .client-counter');
        this.stats = document.querySelectorAll('.stat, .client-stat');
        this.animated = false;

        this.init();
    }

    init() {
        if (this.counters.length === 0) return;

        // Создаем наблюдатель за появлением элементов
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !this.animated) {
                    this.animateCounters();
                    this.animated = true;
                }
            });
        }, {
            threshold: 0.5,
            rootMargin: '0px 0px -100px 0px'
        });

        // Наблюдаем за секцией about
        const aboutSection = document.querySelector('#about');
        if (aboutSection) {
            observer.observe(aboutSection);
        }

        // Наблюдаем за секцией clients
        const clientsSection = document.querySelector('#clients');
        if (clientsSection) {
            observer.observe(clientsSection);
        }
    }

    animateCounters() {
        this.counters.forEach(counter => {
            const parent = counter.closest('.stat, .client-stat');
            if (!parent) return;

            const target = parseInt(parent.getAttribute('data-count')) || 0;
            const suffix = parent.getAttribute('data-suffix') || '';
            const duration = 2000; // 2 секунды на анимацию
            const stepTime = Math.abs(Math.floor(duration / target));

            this.animateCounter(counter, 0, target, stepTime, suffix);
        });
    }

    animateCounter(element, start, end, duration, suffix) {
        let startTimestamp = null;

        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            const value = Math.floor(progress * (end - start) + start);

            element.textContent = value + suffix;

            if (progress < 1) {
                window.requestAnimationFrame(step);
            }
        };

        window.requestAnimationFrame(step);
    }
}

// ===== АНИМАЦИЯ ПРИ СКРОЛЛЕ =====
class ScrollAnimations {
    constructor() {
        this.animatedElements = [];
        this.init();
    }

    init() {
        // Собираем все элементы для анимации
        this.animatedElements = Array.from(document.querySelectorAll(
            '.service-card, .reason-card, .why-card, .client-stat'
        ));

        // Добавляем классы для начального состояния
        this.animatedElements.forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
        });

        // Создаем наблюдатель
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateElement(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        // Начинаем наблюдение
        this.animatedElements.forEach(el => observer.observe(el));
    }

    animateElement(element) {
        element.style.transition = 'all 0.6s ease';
        element.style.opacity = '1';
        element.style.transform = 'translateY(0)';

        // Добавляем небольшую задержку для эффекта каскада
        const index = this.animatedElements.indexOf(element);
        element.style.transitionDelay = `${(index % 4) * 0.1}s`;
    }
}

// ===== ИНИЦИАЛИЗАЦИЯ ВСЕХ АНИМАЦИЙ =====
document.addEventListener('DOMContentLoaded', () => {
    new ReviewsCarousel();
    new CountersAnimation();
    new ScrollAnimations();

    // Добавляем анимацию при загрузке для хиро-секции
    setTimeout(() => {
        document.querySelector('.hero h1').style.opacity = '1';
        document.querySelector('.hero p').style.opacity = '1';
    }, 100);

    // Анимация для логотипа при загрузке
    const logo = document.querySelector('.logo-img');
    if (logo) {
        logo.style.animation = 'fadeInUp 0.8s ease';
    }
});

// ===== АНИМАЦИЯ ХЕДЕРА ПРИ СКРОЛЛЕ =====
window.addEventListener('scroll', () => {
    const header = document.querySelector('header');
    if (window.scrollY > 50) {
        header.style.background = 'rgba(255, 255, 255, 0.98)';
        header.style.boxShadow = '0 5px 20px rgba(0, 0, 0, 0.1)';
    } else {
        header.style.background = 'rgba(255, 255, 255, 0.95)';
        header.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.1)';
    }
});
