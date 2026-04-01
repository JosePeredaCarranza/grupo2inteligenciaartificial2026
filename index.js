document.addEventListener("DOMContentLoaded", () => {
    const slides = document.querySelectorAll(".slide");
    const dots = document.querySelectorAll(".dot");
    const hero = document.getElementById("hero");
    const nextSection = document.getElementById("contenido");
    const contentBox = document.querySelector(".content-box");
    const carousel = document.querySelector(".carousel");

    let currentIndex = 0;
    let autoPlay = null;
    let locked = false;

    function showSlide(index) {
        if (!slides.length || !dots.length) return;

        slides.forEach((slide, i) => {
            slide.classList.toggle("active", i === index);
        });

        dots.forEach((dot, i) => {
            dot.classList.toggle("active", i === index);
        });

        currentIndex = index;
    }

    function nextSlide() {
        if (!slides.length) return;
        const nextIndex = (currentIndex + 1) % slides.length;
        showSlide(nextIndex);
    }

    function stopAutoPlay() {
        if (autoPlay) {
            clearInterval(autoPlay);
            autoPlay = null;
        }
    }

    function startAutoPlay() {
        if (slides.length <= 1) return;
        stopAutoPlay();
        autoPlay = setInterval(nextSlide, 4500);
    }

    function goToNextSection() {
        if (!nextSection || locked) return;

        locked = true;

        nextSection.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });

        setTimeout(() => {
            locked = false;
        }, 1200);
    }

    if (hero && nextSection) {
        hero.addEventListener("wheel", (e) => {
            if (window.scrollY < 50 && e.deltaY > 0) {
                e.preventDefault();
                goToNextSection();
            }
        }, { passive: false });

        let touchStartY = 0;

        hero.addEventListener("touchstart", (e) => {
            touchStartY = e.touches[0].clientY;
        }, { passive: true });

        hero.addEventListener("touchend", (e) => {
            const touchEndY = e.changedTouches[0].clientY;
            const diff = touchStartY - touchEndY;

            if (window.scrollY < 50 && diff > 50) {
                goToNextSection();
            }
        }, { passive: true });
    }

    if (nextSection && contentBox) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    contentBox.classList.add("show");
                }
            });
        }, {
            threshold: 0.25
        });

        observer.observe(nextSection);
    }

    dots.forEach((dot) => {
        dot.addEventListener("click", () => {
            const index = Number(dot.dataset.index);
            if (Number.isNaN(index)) return;

            showSlide(index);
            startAutoPlay();
        });
    });

    if (carousel) {
        carousel.addEventListener("mouseenter", stopAutoPlay);
        carousel.addEventListener("mouseleave", startAutoPlay);
    }

    if (slides.length && dots.length) {
        showSlide(0);
        startAutoPlay();
    }
});