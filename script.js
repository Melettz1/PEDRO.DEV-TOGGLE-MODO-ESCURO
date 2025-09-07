document.documentElement.classList.remove("no-js");

document.addEventListener('DOMContentLoaded', function() {
    const body = document.body;

    function applySketchStyles() {
        const isDarkMode = body.classList.contains('dark-mode');

        const skillColors = [
            '#FFECB3', '#C8F7C5', '#B3E0FF', '#FFC0CB', '#E0BBE4', 
            '#FFD8B3', '#F0D9FF', '#BEE3DB', '#FFD6A5', '#A9DEF9', 
            '#FAD2E1', '#FFF2B2', '#D4F0F0', '#C1E1C1', '#FFBFB5'
        ];
        
        const skillColorsDark = [
            '#7D2E5A', 
            '#004D40', 
            '#1A237E', 
            '#4527A0', 
            '#6A5C8E', 
            '#285C34', 
            '#6E2138', 
            '#8C2B4A'   ,
            '#27166B',
        ];

        const currentPalette = isDarkMode ? skillColorsDark : skillColors;

        const elementsToColor = [
            ...document.querySelectorAll('.skill-card'),
            ...document.querySelectorAll('.tool-card'),
            ...document.querySelectorAll('.philosophy-card'),
            ...document.querySelectorAll('.contact-card'),
            ...document.querySelectorAll('.nav-links a'),
            ...document.querySelectorAll('.nav-links-mobile a'),
            ...document.querySelectorAll('.project-tags span')
        ];

        elementsToColor.forEach(el => {
            const randomColor = currentPalette[Math.floor(Math.random() * currentPalette.length)];
            el.style.backgroundColor = randomColor;

            if (el.matches('.project-tags span')) {
                el.style.color = 'var(--title-color)';
            }

            if (!el.classList.contains('philosophy-card')) {
                const randomRotation = (Math.random() * 8 - 4).toFixed(1);
                el.style.setProperty('--rotation', randomRotation);
            }

            if (el.matches('.nav-links a, .tool-card, .skill-card, .contact-card, .philosophy-card')) {
                 const randomTapeRotation = (Math.random() * 40 - 20).toFixed(1);
                 el.style.setProperty('--rotation-tape', randomTapeRotation);
            }
        });
    }

    if (document.getElementById("typed-text")) {
        new Typed("#typed-text", {
            strings: ["Java/Spring Boot.", "Python.", "JavaScript."],
            typeSpeed: 70,
            backSpeed: 40,
            loop: true,
            showCursor: true,
            cursorChar: '|',
        });
    }
    
    const menuHamburger = document.querySelector(".menu-hamburger");
    const navLinksMobile = document.querySelector(".nav-links-mobile");

    if (menuHamburger && navLinksMobile) {
        menuHamburger.addEventListener("click", () => {
            navLinksMobile.classList.toggle("active");
        });

        document.querySelectorAll('.nav-links-mobile a').forEach(link => {
            link.addEventListener('click', () => {
                if (navLinksMobile.classList.contains('active')) {
                    navLinksMobile.classList.remove('active');
                }
            });
        });
    }

    const sections = document.querySelectorAll('.section');
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1
    });

    sections.forEach(section => {
        observer.observe(section);
    });

    const carouselContainer = document.querySelector('.carousel-container');
    if (carouselContainer) {
      const track = carouselContainer.querySelector('.carousel-track');
      const prevButton = carouselContainer.querySelector('.carousel-button.prev');
      const nextButton = carouselContainer.querySelector('.carousel-button.next');

      if (track && prevButton && nextButton) {
        let currentIndex = 0;
        let isTransitioning = false;
        let slideWidth = 0;
        let originalCardCount = 0;
        let cloneCount = 3;

        const setupCarousel = () => {
            const oldClones = track.querySelectorAll('.clone');
            oldClones.forEach(clone => clone.remove());

            const originalCards = Array.from(track.children).filter(card => !card.classList.contains('clone'));
            originalCardCount = originalCards.length;
            
            if (originalCardCount === 0) return;

            for (let i = originalCardCount - 1; i >= originalCardCount - cloneCount && i >= 0; i--) {
                const clone = originalCards[i].cloneNode(true);
                clone.classList.add('clone');
                track.prepend(clone);
            }
            for (let i = 0; i < cloneCount && i < originalCardCount; i++) {
                const clone = originalCards[i].cloneNode(true);
                clone.classList.add('clone');
                track.appendChild(clone);
            }

            currentIndex = cloneCount;
            updatePosition(false);
        };

        const updatePosition = (useTransition = true) => {
            const card = track.querySelector('.card:not(.clone)');
            if (!card) return;

            const gap = parseInt(window.getComputedStyle(track).gap) || 20;
            slideWidth = card.offsetWidth + gap;

            if (useTransition) {
                track.style.transition = 'transform 0.5s ease-in-out';
            } else {
                track.style.transition = 'none';
            }

            track.style.transform = `translateX(-${currentIndex * slideWidth}px)`;
        };

        const handleNext = () => {
            if (isTransitioning) return;
            isTransitioning = true;
            currentIndex++;
            updatePosition();
        };

        const handlePrev = () => {
            if (isTransitioning) return;
            isTransitioning = true;
            currentIndex--;
            updatePosition();
        };

        const handleTransitionEnd = () => {
            isTransitioning = false;
            if (currentIndex >= originalCardCount + cloneCount) {
                currentIndex = cloneCount;
                updatePosition(false);
            } else if (currentIndex < cloneCount) {
                currentIndex = originalCardCount + cloneCount -1;
                updatePosition(false);
            }
        };

        nextButton.addEventListener('click', handleNext);
        prevButton.addEventListener('click', handlePrev);
        track.addEventListener('transitionend', handleTransitionEnd);

        window.addEventListener('resize', () => {
          setTimeout(setupCarousel, 100);
        });

        setTimeout(setupCarousel, 100);
      }
    }

    const themeToggleDesktop = document.getElementById('theme-toggle-desktop');
    const themeToggleMobile = document.getElementById('theme-toggle-mobile');

    const applyTheme = (theme) => {
        if (theme === 'dark') {
            body.classList.add('dark-mode');
        } else {
            body.classList.remove('dark-mode');
        }
        applySketchStyles();
    };

    const toggleTheme = () => {
        const currentTheme = body.classList.contains('dark-mode') ? 'light' : 'dark';
        localStorage.setItem('theme', currentTheme);
        applyTheme(currentTheme);
    };

    themeToggleDesktop.addEventListener('click', toggleTheme);
    themeToggleMobile.addEventListener('click', toggleTheme);

    const savedTheme = localStorage.getItem('theme') || 'light';
    applyTheme(savedTheme);

});