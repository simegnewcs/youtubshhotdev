// Ultimate Presentation Controller
class UltimatePresentation {
    constructor() {
        this.currentSlide = 1;
        this.totalSlides = 8;
        this.isLaserActive = false;
        this.isRecording = true;
        this.isNotesVisible = false;
        this.animationDelays = new Map();
        
        this.init();
    }

    init() {
        this.setupSlides();
        this.setupControls();
        this.setupLaserPointer();
        this.setupAnimations();
        this.setupDemo();
        this.setupQuiz();
        this.setupParticles();
        this.startRecordingIndicator();
        
        // Auto-advance for demo purposes (remove in production)
        this.setupAutoAdvance();
    }

    setupSlides() {
        this.slides = document.querySelectorAll('.slide');
        this.totalSlides = this.slides.length;
        this.showSlide(1);
        
        // Update slide counter
        this.updateSlideCounter();
    }

    showSlide(slideNumber) {
        // Hide all slides
        this.slides.forEach(slide => {
            slide.classList.remove('active');
        });
        
        // Show current slide
        const currentSlide = document.querySelector(`[data-slide="${slideNumber}"]`);
        if (currentSlide) {
            currentSlide.classList.add('active');
            this.currentSlide = slideNumber;
            
            // Update progress
            this.updateProgress();
            this.updateSlideCounter();
            this.updatePresenterNotes();
            
            // Trigger animations
            this.triggerSlideAnimations(currentSlide);
        }
    }

    nextSlide() {
        if (this.currentSlide < this.totalSlides) {
            this.showSlide(this.currentSlide + 1);
        }
    }

    prevSlide() {
        if (this.currentSlide > 1) {
            this.showSlide(this.currentSlide - 1);
        }
    }

    updateProgress() {
        const progress = (this.currentSlide / this.totalSlides) * 100;
        const progressBar = document.getElementById('progressBar');
        if (progressBar) {
            progressBar.style.width = `${progress}%`;
        }
        
        const slideProgress = (this.currentSlide / this.totalSlides) * 100;
        const slideProgressBar = document.querySelector('.slide-progress-bar');
        if (slideProgressBar) {
            slideProgressBar.style.width = `${slideProgress}%`;
        }
    }

    updateSlideCounter() {
        const slideCounter = document.getElementById('slideCounter');
        if (slideCounter) {
            slideCounter.textContent = `${this.currentSlide}/${this.totalSlides}`;
        }
        
        const currentSlideElem = document.getElementById('currentSlide');
        const totalSlidesElem = document.getElementById('totalSlides');
        
        if (currentSlideElem) currentSlideElem.textContent = this.currentSlide;
        if (totalSlidesElem) totalSlidesElem.textContent = this.totalSlides;
    }

    setupControls() {
        // Safe element selection with null checks
        const elements = {
            slideNext: document.getElementById('slideNext'),
            slidePrev: document.getElementById('slidePrev'),
            startCourse: document.getElementById('startCourse'),
            nextChapter: document.getElementById('nextChapter'),
            toggleTheme: document.getElementById('toggleTheme'),
            toggleLaser: document.getElementById('toggleLaser'),
            toggleGrid: document.getElementById('toggleGrid'),
            toggleNotes: document.getElementById('toggleNotes')
        };

        // Add event listeners only if elements exist
        if (elements.slideNext) {
            elements.slideNext.addEventListener('click', () => this.nextSlide());
        }
        
        if (elements.slidePrev) {
            elements.slidePrev.addEventListener('click', () => this.prevSlide());
        }

        // Keyboard navigation (always available)
        document.addEventListener('keydown', (e) => {
            switch(e.key) {
                case 'ArrowRight':
                case ' ':
                    e.preventDefault();
                    this.nextSlide();
                    break;
                case 'ArrowLeft':
                    e.preventDefault();
                    this.prevSlide();
                    break;
                case 'l':
                case 'L':
                    e.preventDefault();
                    this.toggleLaser();
                    break;
                case 't':
                case 'T':
                    e.preventDefault();
                    this.toggleTheme();
                    break;
                case 'g':
                case 'G':
                    e.preventDefault();
                    this.toggleGrid();
                    break;
                case 'n':
                case 'N':
                    e.preventDefault();
                    this.toggleNotes();
                    break;
            }
        });

        // Optional buttons with null checks
        if (elements.startCourse) {
            elements.startCourse.addEventListener('click', () => {
                this.nextSlide();
            });
        }

        if (elements.nextChapter) {
            elements.nextChapter.addEventListener('click', () => {
                alert('Starting CSS Fundamentals! 🎨');
            });
        }

        if (elements.toggleTheme) {
            elements.toggleTheme.addEventListener('click', () => this.toggleTheme());
        }
        
        if (elements.toggleLaser) {
            elements.toggleLaser.addEventListener('click', () => this.toggleLaser());
        }
        
        if (elements.toggleGrid) {
            elements.toggleGrid.addEventListener('click', () => this.toggleGrid());
        }
        
        if (elements.toggleNotes) {
            elements.toggleNotes.addEventListener('click', () => this.toggleNotes());
        }
    }

    setupLaserPointer() {
        const laser = document.getElementById('laserPointer');
        if (!laser) return;
        
        // Only create logo once if it doesn't exist
        if (!laser.querySelector('img')) {
            const logoImg = document.createElement('img');
            logoImg.src = 'images/logodev3.jp'; // Your logo path here
            logoImg.alt = 'DevVoltz Laser Pointer';
            laser.appendChild(logoImg);
            laser.classList.add('logo-pointer');
        }
        
        document.addEventListener('mousemove', (e) => {
            if (this.isLaserActive && laser) {
                laser.style.left = `${e.clientX - 15}px`; // Centered for 30px width
                laser.style.top = `${e.clientY - 15}px`;
                
                // Create branded trail effect
                if (Math.random() > 0.8) {
                    this.createBrandedTrail(e.clientX, e.clientY);
                }
            }
        });
    }

    toggleLaser() {
        this.isLaserActive = !this.isLaserActive;
        const laser = document.getElementById('laserPointer');
        const laserBtn = document.getElementById('toggleLaser');
        
        if (this.isLaserActive) {
            if (laser) laser.classList.add('active');
            if (laserBtn) laserBtn.classList.add('active');
            document.body.style.cursor = 'none'; // Hide default cursor
            
            // Add activation effect
            this.createActivationEffect();
        } else {
            if (laser) laser.classList.remove('active');
            if (laserBtn) laserBtn.classList.remove('active');
            document.body.style.cursor = 'default'; // Restore cursor
        }
    }

    createBrandedTrail(x, y) {
        const trail = document.createElement('div');
        trail.className = 'laser-trail';
        trail.style.left = `${x - 3}px`;
        trail.style.top = `${y - 3}px`;
        
        // Add subtle animation
        trail.style.background = `var(--gradient-primary)`;
        
        document.body.appendChild(trail);
        
        setTimeout(() => {
            trail.remove();
        }, 1000);
    }

    createActivationEffect() {
        const laser = document.getElementById('laserPointer');
        if (!laser) return;
        
        laser.style.transform = 'scale(0)';
        
        setTimeout(() => {
            laser.style.transition = 'transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)';
            laser.style.transform = 'scale(1)';
        }, 10);
        
        // Create ripple effect
        this.createRippleEffect(laser);
    }

    createRippleEffect(element) {
        const rect = element.getBoundingClientRect();
        const x = rect.left + rect.width / 2;
        const y = rect.top + rect.height / 2;
        
        for (let i = 0; i < 3; i++) {
            setTimeout(() => {
                const ripple = document.createElement('div');
                ripple.style.position = 'fixed';
                ripple.style.left = `${x}px`;
                ripple.style.top = `${y}px`;
                ripple.style.width = '4px';
                ripple.style.height = '4px';
                ripple.style.background = 'var(--primary)';
                ripple.style.borderRadius = '50%';
                ripple.style.pointerEvents = 'none';
                ripple.style.zIndex = '9999';
                ripple.style.transform = 'translate(-50%, -50%)';
                
                document.body.appendChild(ripple);
                
                // Animate ripple
                const duration = 800;
                const startTime = Date.now();
                
                const animateRipple = () => {
                    const elapsed = Date.now() - startTime;
                    const progress = elapsed / duration;
                    
                    if (progress < 1) {
                        const scale = 1 + progress * 20;
                        const opacity = 1 - progress;
                        
                        ripple.style.transform = `translate(-50%, -50%) scale(${scale})`;
                        ripple.style.opacity = opacity.toString();
                        
                        requestAnimationFrame(animateRipple);
                    } else {
                        ripple.remove();
                    }
                };
                
                animateRipple();
            }, i * 200);
        }
    }

    toggleTheme() {
        document.body.classList.toggle('light-theme');
        const themeBtn = document.getElementById('toggleTheme');
        if (!themeBtn) return;
        
        const icon = themeBtn.querySelector('i');
        if (!icon) return;
        
        if (document.body.classList.contains('light-theme')) {
            icon.classList.remove('fa-moon');
            icon.classList.add('fa-sun');
        } else {
            icon.classList.remove('fa-sun');
            icon.classList.add('fa-moon');
        }
    }

    toggleGrid() {
        document.body.classList.toggle('show-grid');
        const gridBtn = document.getElementById('toggleGrid');
        if (gridBtn) {
            gridBtn.classList.toggle('active');
        }
    }

    toggleNotes() {
        this.isNotesVisible = !this.isNotesVisible;
        const notes = document.getElementById('presenterNotes');
        const toggleBtn = document.getElementById('toggleNotes');
        
        if (notes) {
            if (this.isNotesVisible) {
                notes.classList.add('show');
            } else {
                notes.classList.remove('show');
            }
        }
        
        if (toggleBtn) {
            const icon = toggleBtn.querySelector('i');
            if (icon) {
                if (this.isNotesVisible) {
                    icon.classList.remove('fa-chevron-up');
                    icon.classList.add('fa-chevron-down');
                } else {
                    icon.classList.remove('fa-chevron-down');
                    icon.classList.add('fa-chevron-up');
                }
            }
        }
    }

    updatePresenterNotes() {
        const notes = document.querySelectorAll('.note');
        notes.forEach(note => note.classList.remove('active'));
        
        const currentNote = document.querySelector(`.note[data-slide="${this.currentSlide}"]`);
        if (currentNote) {
            currentNote.classList.add('active');
        }
    }

    setupAnimations() {
        // Intersection Observer for scroll animations
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const delay = entry.target.getAttribute('data-delay') || 0;
                    setTimeout(() => {
                        entry.target.classList.add('visible');
                    }, delay * 1000);
                }
            });
        }, { threshold: 0.1 });

        // Observe all animatable elements
        document.querySelectorAll('.curriculum-item, .concept-card').forEach(el => {
            observer.observe(el);
        });
    }

    setupDemo() {
        const runBtn = document.getElementById('runCode');
        const resetBtn = document.getElementById('resetCode');
        const livePreview = document.getElementById('livePreview');

        if (runBtn && livePreview) {
            runBtn.addEventListener('click', () => {
                // Simulate code execution
                livePreview.innerHTML = `
                    <div style="padding: 2rem; font-family: system-ui;">
                        <header style="background: #6366f1; color: white; padding: 2rem; text-align: center;">
                            <h1 style="margin: 0;">Welcome</h1>
                        </header>
                        <main style="padding: 2rem;">
                            <p style="font-size: 1.2rem;">Building amazing websites!</p>
                        </main>
                    </div>
                `;
                
                // Add success animation
                runBtn.innerHTML = '<i class="fas fa-check"></i> Executed';
                runBtn.style.background = 'var(--gradient-accent)';
                
                setTimeout(() => {
                    runBtn.innerHTML = '<i class="fas fa-play"></i> Run Code';
                    runBtn.style.background = 'var(--gradient-primary)';
                }, 2000);
            });
        }

        if (resetBtn && livePreview) {
            resetBtn.addEventListener('click', () => {
                livePreview.innerHTML = '';
            });
        }
    }

    setupQuiz() {
        const options = document.querySelectorAll('.quiz-option');
        const feedback = document.getElementById('quizFeedback');

        options.forEach(option => {
            option.addEventListener('click', () => {
                const isCorrect = option.getAttribute('data-correct') === 'true';
                
                // Show feedback
                if (feedback) {
                    feedback.classList.add('show');
                }
                
                // Mark options
                options.forEach(opt => {
                    if (opt.getAttribute('data-correct') === 'true') {
                        opt.classList.add('correct');
                    } else {
                        opt.classList.add('incorrect');
                    }
                });
                
                // Disable further clicks
                options.forEach(opt => {
                    opt.style.pointerEvents = 'none';
                });
            });
        });
    }

    setupParticles() {
        const container = document.getElementById('particles');
        if (!container) return;
        
        const particleCount = 50;

        for (let i = 0; i < particleCount; i++) {
            this.createParticle(container);
        }
    }

    createParticle(container) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        
        // Random properties
        const size = Math.random() * 4 + 2;
        const left = Math.random() * 100;
        const delay = Math.random() * 20;
        const duration = Math.random() * 10 + 10;
        
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        particle.style.left = `${left}%`;
        particle.style.animationDelay = `${delay}s`;
        particle.style.animationDuration = `${duration}s`;
        particle.style.background = this.getRandomColor();
        
        container.appendChild(particle);
        
        // Remove and recreate particle after animation
        setTimeout(() => {
            particle.remove();
            this.createParticle(container);
        }, duration * 1000);
    }

    getRandomColor() {
        const colors = [
            '#6366f1', '#8b5cf6', '#f59e0b', '#10b981', '#ef4444'
        ];
        return colors[Math.floor(Math.random() * colors.length)];
    }

    triggerSlideAnimations(slide) {
        // Reset animations
        const animatables = slide.querySelectorAll('.curriculum-item, .concept-card');
        animatables.forEach(el => {
            el.classList.remove('visible');
        });

        // Trigger with delay
        animatables.forEach((el, index) => {
            setTimeout(() => {
                el.classList.add('visible');
            }, index * 200);
        });

        // Special animations for specific slides
        switch(this.currentSlide) {
            case 1:
                this.animateIntro();
                break;
            case 8:
                this.animateConfetti();
                break;
        }
    }

    animateIntro() {
        // Title sequence already handled by CSS
        console.log('Intro animations activated');
    }

    animateConfetti() {
        const container = document.querySelector('.confetti-container');
        if (!container) return;
        
        const confettiCount = 100;

        for (let i = 0; i < confettiCount; i++) {
            setTimeout(() => {
                this.createConfetti(container);
            }, i * 30);
        }
    }

    createConfetti(container) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';
        
        const colors = ['#6366f1', '#8b5cf6', '#f59e0b', '#10b981', '#ef4444'];
        const color = colors[Math.floor(Math.random() * colors.length)];
        
        confetti.style.background = color;
        confetti.style.left = `${Math.random() * 100}%`;
        confetti.style.animationDuration = `${Math.random() * 3 + 2}s`;
        
        container.appendChild(confetti);
        
        setTimeout(() => {
            confetti.remove();
        }, 5000);
    }

    startRecordingIndicator() {
        // Simulate recording state
        setInterval(() => {
            this.isRecording = !this.isRecording;
            const indicator = document.getElementById('recordingIndicator');
            
            if (indicator) {
                if (this.isRecording) {
                    indicator.style.display = 'flex';
                } else {
                    indicator.style.display = 'none';
                }
            }
        }, 5000);
    }

    setupAutoAdvance() {
        // Auto-advance every 30 seconds for demo
        setInterval(() => {
            if (this.currentSlide < this.totalSlides) {
                this.nextSlide();
            }
        }, 30000);
    }
}

// Initialize the presentation when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new UltimatePresentation();
});

// Additional utility functions
function createParticleEffect(x, y, color = '#6366f1') {
    for (let i = 0; i < 10; i++) {
        setTimeout(() => {
            const particle = document.createElement('div');
            particle.style.position = 'fixed';
            particle.style.left = `${x}px`;
            particle.style.top = `${y}px`;
            particle.style.width = '4px';
            particle.style.height = '4px';
            particle.style.background = color;
            particle.style.borderRadius = '50%';
            particle.style.pointerEvents = 'none';
            particle.style.zIndex = '10000';
            
            document.body.appendChild(particle);
            
            const angle = Math.random() * Math.PI * 2;
            const velocity = 2 + Math.random() * 2;
            const vx = Math.cos(angle) * velocity;
            const vy = Math.sin(angle) * velocity;
            
            let opacity = 1;
            const animate = () => {
                opacity -= 0.02;
                particle.style.opacity = opacity;
                particle.style.transform = `translate(${vx * (1 - opacity) * 50}px, ${vy * (1 - opacity) * 50}px)`;
                
                if (opacity > 0) {
                    requestAnimationFrame(animate);
                } else {
                    particle.remove();
                }
            };
            
            animate();
        }, i * 100);
    }
}

// Add click effects for interactive elements
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('interactive')) {
        createParticleEffect(e.clientX, e.clientY);
    }
});

// Export for global access
window.UltimatePresentation = UltimatePresentation;

// --- FIX: Prevent 'AbortError' play/pause warnings in Chrome/Edge ---
(function() {
    const originalPlay = HTMLMediaElement.prototype.play;
    HTMLMediaElement.prototype.play = function(...args) {
        const playPromise = originalPlay.apply(this, args);
        if (playPromise !== undefined && typeof playPromise.catch === "function") {
            playPromise.catch(err => {
                if (err.name !== "AbortError") {
                    console.warn("Media play blocked:", err);
                }
                // Silently ignore AbortError (normal browser behavior)
            });
        }
        return playPromise;
    };
})();