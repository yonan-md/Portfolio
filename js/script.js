// ===== Theme toggle (default: night mode) =====
        const themeToggle = document.getElementById('themeToggle');
        const THEME_KEY = 'portfolio-theme';

        function applyTheme(isLight) {
            document.documentElement.classList.toggle('light-mode', isLight);
            if (themeToggle) {
                themeToggle.setAttribute('aria-label', isLight ? 'Switch to night mode' : 'Switch to light mode');
                themeToggle.setAttribute('title', isLight ? 'Night mode' : 'Light mode');
            }
        }

        function isLightMode() {
            return document.documentElement.classList.contains('light-mode');
        }

        themeToggle?.addEventListener('click', () => {
            const nextLight = !isLightMode();
            applyTheme(nextLight);
            try {
                localStorage.setItem(THEME_KEY, nextLight ? 'light' : 'dark');
            } catch (e) { /* ignore */ }
        });

        applyTheme(isLightMode());

        // ===== Mobile Navigation Toggle =====
        const hamburger = document.getElementById('navHamburger');
        const navLinks = document.getElementById('navLinks');

        hamburger.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            hamburger.classList.toggle('active');
        });

        // Close menu when a link is clicked
        document.querySelectorAll('.nav-links a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
                hamburger.classList.remove('active');
            });
        });

        // ===== Intersection Observer for Fade-Up Animations =====
        const fadeElements = document.querySelectorAll('.fade-up');
        const fadeObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    fadeObserver.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.15,
            rootMargin: '0px 0px -40px 0px'
        });

        fadeElements.forEach(el => fadeObserver.observe(el));

        // ===== Skill Bar Animation =====
        const skillFills = document.querySelectorAll('.skill-fill');
        const skillObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const fill = entry.target;
                    fill.style.width = fill.getAttribute('data-width');
                    fill.classList.add('animated');
                    skillObserver.unobserve(fill);
                }
            });
        }, { threshold: 0.5 });

        skillFills.forEach(el => skillObserver.observe(el));

        // ===== Portfolio Filter =====
        const filterBtns = document.querySelectorAll('.filter-btn');
        const portfolioCards = document.querySelectorAll('.portfolio-card');

        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                const filter = btn.getAttribute('data-filter');
                portfolioCards.forEach(card => {
                    if (filter === 'all' || card.getAttribute('data-category').includes(filter)) {
                        card.style.display = 'block';
                        card.style.opacity = '0';
                        card.style.transform = 'translateY(20px)';
                        setTimeout(() => {
                            card.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
                            card.style.opacity = '1';
                            card.style.transform = 'translateY(0)';
                        }, 50);
                    } else {
                        card.style.opacity = '0';
                        card.style.transform = 'translateY(20px)';
                        setTimeout(() => {
                            card.style.display = 'none';
                        }, 400);
                    }
                });
            });
        });

        // ===== Active Nav Link on Scroll =====
        const sections = document.querySelectorAll('section');
        const navAnchors = document.querySelectorAll('.nav-links a:not(.btn-lets-talk)');

        const navbar = document.querySelector('.navbar');

        window.addEventListener('scroll', () => {
            if (navbar) {
                navbar.classList.toggle('navbar-scrolled', window.scrollY > 24);
            }

            let current = '';
            sections.forEach(section => {
                const sectionTop = section.offsetTop - 100;
                if (window.scrollY >= sectionTop) {
                    current = section.getAttribute('id');
                }
            });

            navAnchors.forEach(a => {
                a.classList.remove('active');
                if (a.getAttribute('href') === '#' + current) {
                    a.classList.add('active');
                }
            });
        });

        // ===== Certificate lightbox =====
        const certLightbox = document.getElementById('certLightbox');
        const certLightboxImg = document.getElementById('certLightboxImg');
        const certLightboxTitle = document.getElementById('certLightboxTitle');
        const certLightboxClose = document.getElementById('certLightboxClose');

        function openCertLightbox(src, title) {
            if (!certLightbox || !certLightboxImg || !certLightboxTitle) return;

            const isPdf = src.toLowerCase().endsWith('.pdf');
            certLightboxImg.style.display = isPdf ? 'none' : 'block';

            if (isPdf) {
                const currentView = certLightbox.querySelector('.cert-lightbox-pdf');
                if (!currentView) {
                    const pdfFrame = document.createElement('iframe');
                    pdfFrame.className = 'cert-lightbox-pdf';
                    pdfFrame.setAttribute('title', title);
                    pdfFrame.setAttribute('src', src);
                    pdfFrame.setAttribute('loading', 'lazy');
                    pdfFrame.setAttribute('allow', 'fullscreen');
                    certLightbox.querySelector('.cert-lightbox-content').appendChild(pdfFrame);
                } else {
                    currentView.src = src;
                    currentView.style.display = 'block';
                }
            } else {
                const pdfView = certLightbox.querySelector('.cert-lightbox-pdf');
                if (pdfView) {
                    pdfView.style.display = 'none';
                    pdfView.removeAttribute('src');
                }
                certLightboxImg.src = src;
                certLightboxImg.alt = title;
            }

            certLightboxTitle.textContent = title;
            certLightbox.hidden = false;
            document.body.style.overflow = 'hidden';
        }

        function closeCertLightbox() {
            if (!certLightbox || !certLightboxImg) return;
            certLightbox.hidden = true;
            certLightboxImg.src = '';
            certLightboxImg.style.display = 'block';
            const pdfView = certLightbox.querySelector('.cert-lightbox-pdf');
            if (pdfView) {
                pdfView.style.display = 'none';
                pdfView.removeAttribute('src');
            }
            document.body.style.overflow = '';
        }

        document.querySelectorAll('.cert-open-lightbox').forEach(btn => {
            btn.addEventListener('click', () => {
                openCertLightbox(
                    btn.getAttribute('data-cert-src'),
                    btn.getAttribute('data-cert-title') || 'Certificate'
                );
            });
        });

        certLightboxClose?.addEventListener('click', closeCertLightbox);

        certLightbox?.addEventListener('click', (e) => {
            if (e.target === certLightbox) closeCertLightbox();
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && certLightbox && !certLightbox.hidden) {
                closeCertLightbox();
            }
        });