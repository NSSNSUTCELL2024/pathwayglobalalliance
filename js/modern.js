/* =============================================
   MODERN.JS - Pathway Global Alliance
   Modern Interactions, Animations & 3D Effects
   ============================================= */

document.addEventListener('DOMContentLoaded', function () {
    'use strict';

    // ---- Page Loader ----
    const loader = document.querySelector('.page-loader');
    if (loader) {
        window.addEventListener('load', function () {
            setTimeout(function () {
                loader.classList.add('loaded');
            }, 400);
        });
        // Fallback: remove after 3s
        setTimeout(function () {
            loader.classList.add('loaded');
        }, 3000);
    }

    // ---- Navbar Scroll Effect ----
    const navbar = document.querySelector('.modern-navbar');
    if (navbar) {
        function handleNavScroll() {
            if (window.scrollY > 60) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        }
        window.addEventListener('scroll', handleNavScroll, { passive: true });
        handleNavScroll();
    }

    // ---- Mobile Menu Toggle ----
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function () {
            navToggle.classList.toggle('active');
            navMenu.classList.toggle('open');
            document.body.style.overflow = navMenu.classList.contains('open') ? 'hidden' : '';
        });

        // Close on link click (except language links)
        navMenu.querySelectorAll('a:not(.lang-link)').forEach(function (link) {
            link.addEventListener('click', function () {
                navToggle.classList.remove('active');
                navMenu.classList.remove('open');
                document.body.style.overflow = '';
            });
        });
    }

    // ---- Hero Slider (variable timing) ----
    const heroSlides = document.querySelectorAll('.hero-slide');
    const heroIndicators = document.querySelectorAll('.hero-slide-indicators .indicator');
    const heroTitles = document.querySelectorAll('.hero-text-slide');
    let currentSlide = 0;
    let slideTimeout;

    function getSlideDelay() {
        return currentSlide === 0 ? 10000 : 5000;
    }

    // Lazy load hero slide images
    function loadSlideImage(index) {
        const slide = heroSlides[index];
        if (slide) {
            const img = slide.querySelector('img');
            if (img && img.dataset.src && !img.src) {
                img.src = img.dataset.src;
            }
        }
    }

    function showSlide(index) {
        heroSlides.forEach(function (s) { s.classList.remove('active'); });
        heroIndicators.forEach(function (i) { i.classList.remove('active'); });
        heroTitles.forEach(function (t) { t.classList.remove('active'); });

        currentSlide = index % heroSlides.length;
        
        // Load current and next slide images
        loadSlideImage(currentSlide);
        loadSlideImage((currentSlide + 1) % heroSlides.length);
        
        if (heroSlides[currentSlide]) heroSlides[currentSlide].classList.add('active');
        if (heroIndicators[currentSlide]) {
            heroIndicators[currentSlide].classList.add('active');
            heroIndicators[currentSlide].style.setProperty('--ind-dur', getSlideDelay() + 'ms');
        }
        if (heroTitles[currentSlide]) heroTitles[currentSlide].classList.add('active');
    }

    function nextSlide() {
        showSlide(currentSlide + 1);
        startSlideTimer();
    }

    function startSlideTimer() {
        clearTimeout(slideTimeout);
        slideTimeout = setTimeout(nextSlide, getSlideDelay());
    }

    if (heroSlides.length > 0) {
        showSlide(0);
        startSlideTimer();

        heroIndicators.forEach(function (ind, i) {
            ind.addEventListener('click', function () {
                clearTimeout(slideTimeout);
                showSlide(i);
                startSlideTimer();
            });
        });
    }

    // ---- Scroll Reveal Observer ----
    const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale, .img-reveal');

    if ('IntersectionObserver' in window) {
        const revealObserver = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                    revealObserver.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.12,
            rootMargin: '0px 0px -40px 0px'
        });

        revealElements.forEach(function (el) {
            revealObserver.observe(el);
        });
    } else {
        // Fallback for old browsers
        revealElements.forEach(function (el) {
            el.classList.add('revealed');
        });
    }

    // ---- Counter Animation ----
    const counters = document.querySelectorAll('.stat-number[data-count]');
    if (counters.length > 0) {
        const counterObserver = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    animateCounter(entry.target);
                    counterObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        counters.forEach(function (c) {
            counterObserver.observe(c);
        });
    }

    function animateCounter(el) {
        var target = parseInt(el.getAttribute('data-count'), 10);
        var suffix = el.getAttribute('data-suffix') || '';
        var duration = 2000;
        var start = 0;
        var startTime = null;

        function step(timestamp) {
            if (!startTime) startTime = timestamp;
            var progress = Math.min((timestamp - startTime) / duration, 1);
            // Ease out quad
            var eased = 1 - (1 - progress) * (1 - progress);
            var current = Math.floor(eased * target);
            el.textContent = current + suffix;
            if (progress < 1) {
                requestAnimationFrame(step);
            } else {
                el.textContent = target + suffix;
            }
        }
        requestAnimationFrame(step);
    }

    // ---- 3D Tilt Effect on Cards ----
    const tiltCards = document.querySelectorAll('.modern-card, .service-item');
    tiltCards.forEach(function (card) {
        card.addEventListener('mousemove', function (e) {
            var rect = card.getBoundingClientRect();
            var x = e.clientX - rect.left;
            var y = e.clientY - rect.top;
            var centerX = rect.width / 2;
            var centerY = rect.height / 2;
            var rotateX = ((y - centerY) / centerY) * -6;
            var rotateY = ((x - centerX) / centerX) * 6;

            card.style.transform = 'perspective(800px) rotateX(' + rotateX + 'deg) rotateY(' + rotateY + 'deg) translateY(-8px)';
        });

        card.addEventListener('mouseleave', function () {
            card.style.transform = 'perspective(800px) rotateX(0) rotateY(0) translateY(0)';
        });
    });

    // ---- Cursor Glow Effect (desktop only) ----
    var cursorGlow = document.querySelector('.cursor-glow');
    if (cursorGlow && window.matchMedia('(min-width: 769px)').matches) {
        document.addEventListener('mousemove', function (e) {
            cursorGlow.style.left = e.clientX + 'px';
            cursorGlow.style.top = e.clientY + 'px';
            cursorGlow.classList.add('active');
        });

        document.addEventListener('mouseleave', function () {
            cursorGlow.classList.remove('active');
        });
    }

    // ---- Scroll to Top ----
    var scrollTopBtn = document.querySelector('.scroll-top');
    if (scrollTopBtn) {
        window.addEventListener('scroll', function () {
            if (window.scrollY > 400) {
                scrollTopBtn.classList.add('visible');
            } else {
                scrollTopBtn.classList.remove('visible');
            }
        }, { passive: true });

        scrollTopBtn.addEventListener('click', function () {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // ---- Scroll Progress Bar ----
    var scrollProgress = document.querySelector('.scroll-progress');
    if (scrollProgress) {
        window.addEventListener('scroll', function () {
            var scrollTop = window.scrollY;
            var docHeight = document.documentElement.scrollHeight - window.innerHeight;
            if (docHeight > 0) {
                scrollProgress.style.width = (scrollTop / docHeight * 100) + '%';
            }
        }, { passive: true });
    }

    // ---- Parallax on Hero (overlay shift only) ----
    var heroSection = document.querySelector('.modern-hero');
    if (heroSection) {
        var heroOverlay = heroSection.querySelector('.hero-overlay');
        window.addEventListener('scroll', function () {
            var scrolled = window.scrollY;
            if (scrolled < window.innerHeight && heroOverlay) {
                heroOverlay.style.opacity = Math.min(1, 0.7 + scrolled * 0.001);
            }
        }, { passive: true });
    }

    // ---- Smooth Anchor Links ----
    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
        anchor.addEventListener('click', function (e) {
            var href = this.getAttribute('href');
            if (href && href !== '#') {
                var target = document.querySelector(href);
                if (target) {
                    e.preventDefault();
                    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            }
        });
    });

    // ---- Particles Canvas ----
    var canvas = document.getElementById('particles-canvas');
    if (canvas) {
        var ctx = canvas.getContext('2d');
        var particles = [];
        var particleCount = 15;

        function resizeCanvas() {
            canvas.width = canvas.parentElement.offsetWidth;
            canvas.height = canvas.parentElement.offsetHeight;
        }
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        function Particle() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 2 + 0.5;
            this.speedX = (Math.random() - 0.5) * 0.5;
            this.speedY = (Math.random() - 0.5) * 0.5;
            this.opacity = Math.random() * 0.3 + 0.1;
        }

        Particle.prototype.update = function () {
            this.x += this.speedX;
            this.y += this.speedY;
            if (this.x > canvas.width) this.x = 0;
            if (this.x < 0) this.x = canvas.width;
            if (this.y > canvas.height) this.y = 0;
            if (this.y < 0) this.y = canvas.height;
        };

        Particle.prototype.draw = function () {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(230, 32, 38, ' + this.opacity + ')';
            ctx.fill();
        };

        for (var i = 0; i < particleCount; i++) {
            particles.push(new Particle());
        }

        function connectParticles() {
            for (var a = 0; a < particles.length; a++) {
                for (var b = a + 1; b < particles.length; b++) {
                    var dx = particles[a].x - particles[b].x;
                    var dy = particles[a].y - particles[b].y;
                    var dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < 120) {
                        ctx.beginPath();
                        ctx.strokeStyle = 'rgba(230, 32, 38, ' + (0.08 * (1 - dist / 120)) + ')';
                        ctx.lineWidth = 0.5;
                        ctx.moveTo(particles[a].x, particles[a].y);
                        ctx.lineTo(particles[b].x, particles[b].y);
                        ctx.stroke();
                    }
                }
            }
        }

        function animateParticles() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            particles.forEach(function (p) {
                p.update();
                p.draw();
            });
            connectParticles();
            requestAnimationFrame(animateParticles);
        }
        animateParticles();
    }

    // ---- Typing Effect for Hero ----
    var typingElements = document.querySelectorAll('.typing-text');
    typingElements.forEach(function (el) {
        var text = el.textContent;
        el.textContent = '';
        el.style.borderRight = '2px solid var(--red-primary)';
        var index = 0;
        function type() {
            if (index < text.length) {
                el.textContent += text.charAt(index);
                index++;
                setTimeout(type, 40 + Math.random() * 30);
            } else {
                setTimeout(function () {
                    el.style.borderRight = 'none';
                }, 1000);
            }
        }
        // Start typing when element is visible
        var typingObserver = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    setTimeout(type, 500);
                    typingObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        typingObserver.observe(el);
    });

    // ---- Magnetic Hover on Buttons ----
    var magneticButtons = document.querySelectorAll('.btn-modern');
    magneticButtons.forEach(function (btn) {
        btn.addEventListener('mousemove', function (e) {
            var rect = btn.getBoundingClientRect();
            var x = e.clientX - rect.left - rect.width / 2;
            var y = e.clientY - rect.top - rect.height / 2;
            btn.style.transform = 'translate(' + (x * 0.15) + 'px, ' + (y * 0.15 - 3) + 'px)';
        });
        btn.addEventListener('mouseleave', function () {
            btn.style.transform = 'translate(0, 0)';
        });
    });

    // ---- Active nav link highlight ----
    var navLinks = document.querySelectorAll('.nav-menu li a');
    var currentPage = window.location.pathname.split('/').pop() || 'index.html';
    navLinks.forEach(function (link) {
        var href = link.getAttribute('href');
        if (href) {
            var linkPage = href.split('/').pop();
            if (linkPage === currentPage) {
                link.parentElement.classList.add('active');
            }
        }
    });

    // ---- Dark / Light Theme Toggle ----
    var themeToggle = document.querySelector('.theme-toggle');
    var savedTheme = localStorage.getItem('pga-theme');

    // Apply saved theme on load
    if (savedTheme) {
        document.documentElement.setAttribute('data-theme', savedTheme);
    }

    if (themeToggle) {
        themeToggle.addEventListener('click', function () {
            var current = document.documentElement.getAttribute('data-theme');
            var next = current === 'dark' ? 'light' : 'dark';

            document.documentElement.setAttribute('data-theme', next);
            localStorage.setItem('pga-theme', next);
        });
    }
});
