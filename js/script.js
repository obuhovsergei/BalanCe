// ===== БУРГЕР-МЕНЮ =====
document.getElementById('menuToggle').addEventListener('click', function() {
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
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();

        const targetId = this.getAttribute('href');
        if (targetId === '#') return;

        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            // Закрываем мобильное меню если открыто
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
        // Показать первый слайд
        this.showSlide(this.currentSlide);

        // Навешиваем обработчики событий
        this.prevBtn.addEventListener('click', () => this.prevSlide());
        this.nextBtn.addEventListener('click', () => this.nextSlide());

        // Обработчики для точек
        this.dots.forEach(dot => {
            dot.addEventListener('click', (e) => {
                const slideIndex = parseInt(e.target.dataset.slide);
                this.showSlide(slideIndex);
            });
        });

        // Автопрокрутка
        this.startAutoSlide();

        // Остановка автопрокрутки при наведении
        this.carousel.addEventListener('mouseenter', () => this.stopAutoSlide());
        this.carousel.addEventListener('mouseleave', () => this.startAutoSlide());

        // Свайпы для мобильных устройств
        this.setupTouchEvents();
    }

    showSlide(index) {
        // Скрыть все слайды
        this.slides.forEach(slide => slide.classList.remove('active'));
        this.dots.forEach(dot => dot.classList.remove('active'));

        // Показать выбранный слайд
        this.slides[index].classList.add('active');
        this.dots[index].classList.add('active');

        this.currentSlide = index;
    }

    nextSlide() {
        let nextIndex = this.currentSlide + 1;
        if (nextIndex >= this.slides.length) {
            nextIndex = 0;
        }
        this.showSlide(nextIndex);
    }

    prevSlide() {
        let prevIndex = this.currentSlide - 1;
        if (prevIndex < 0) {
            prevIndex = this.slides.length - 1;
        }
        this.showSlide(prevIndex);
    }

    startAutoSlide() {
        this.stopAutoSlide(); // Останавливаем предыдущий интервал если есть
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
            // Свайп влево - следующий слайд
            this.nextSlide();
        } else if (endX - startX > swipeThreshold) {
            // Свайп вправо - предыдущий слайд
            this.prevSlide();
        }
    }
}

// Инициализация карусели когда DOM загружен
document.addEventListener('DOMContentLoaded', () => {
    new ReviewsCarousel();
});
