document.addEventListener("DOMContentLoaded", () => {
    const slides = document.querySelectorAll(".slide");
    const dots = document.querySelectorAll(".dot");
    const hero = document.getElementById("hero");
    const nextSection = document.getElementById("contenido");
    const contentBox = document.querySelector(".content-box");
    const carousel = document.querySelector(".carousel");
    const iosNav = document.querySelector(".ios-nav");
    const navLinks = document.querySelectorAll(".nav-link");
    const sections = document.querySelectorAll("#hero, #contenido, #curso, #planta");
    let currentIndex = 0;
    let autoPlay = null;
    let locked = false;
    navLinks.forEach((link) => {
        link.addEventListener("click", (e) => {
            const destino = link.getAttribute("href");

            if (!destino || !destino.startsWith("#")) return;

            const seccion = document.querySelector(destino);
            if (!seccion) return;

            e.preventDefault();

            activarLink(seccion.id);

            seccion.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });
        });
    });
    function activarLink(idSeccion) {
        navLinks.forEach((link) => {
            const href = link.getAttribute("href");
            link.classList.toggle("active", href === `#${idSeccion}`);
        });
    }

    if (sections.length && navLinks.length) {
        const observerSecciones = new IntersectionObserver((entries) => {
            let visible = null;

            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    visible = entry.target.id;
                }
            });

            if (visible) {
                activarLink(visible);
            }
        }, {
            threshold: 0.2,
            rootMargin: "-10% 0px -50% 0px"
        });

        sections.forEach((section) => observerSecciones.observe(section));
    }
    
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

    function actualizarNavScroll() {
        if (!iosNav) return;

        if (window.scrollY > 40) {
            iosNav.classList.add("scrolled");
        } else {
            iosNav.classList.remove("scrolled");
        }
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

    function actualizarProgresoPlanta() {
        const inicio = new Date("2026-03-30");
        const semanas = 16;
        const fin = new Date(inicio);
        fin.setDate(fin.getDate() + semanas * 7);

        const hoy = new Date();

        const total = fin - inicio;
        const actual = hoy - inicio;

        let progreso = (actual / total) * 100;

        if (progreso < 0) progreso = 0;
        if (progreso > 100) progreso = 100;

        const barra = document.getElementById("barra-fill");
        const texto = document.getElementById("progreso-texto");

        if (barra && texto) {
            barra.style.width = progreso + "%";
            texto.textContent = Math.round(progreso) + "%";
        }
    }

    window.addEventListener("scroll", actualizarNavScroll);
    actualizarNavScroll();
    actualizarProgresoPlanta();
});