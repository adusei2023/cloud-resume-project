/**
 * Cloud Resume - Modern JavaScript Application
 * @author Samuel Adusei-Boateng
 * @version 2.0.0
 */

'use strict';

// Configuration
const CONFIG = {
    apiEndpoint: 'https://ufx4t82h6a.execute-api.us-east-1.amazonaws.com/prod/visitor-count',
    animationDuration: 1000,
    notificationTimeout: 3000,
    scrollOffset: 200
};

/**
 * Main Application Class
 */
class CloudResumeApp {
    constructor() {
        this.visitorCountElement = document.getElementById('visitor-count');
        this.navLinks = document.querySelectorAll('.nav-link');
        this.sections = document.querySelectorAll('.section');
        this.init();
    }

    /**
     * Initialize all application functionality
     */
    init() {
        this.initializeNavigation();
        this.loadVisitorCount();
        this.initializeSmoothScrolling();
        this.initializeProfileImage();
        this.initializeScrollAnimations();
        this.initializePerformanceMonitoring();
    }

    /**
     * Initialize navigation functionality with active state management
     */
    initializeNavigation() {
        // Handle navigation clicks
        this.navLinks.forEach(link => {
            link.addEventListener('click', e => {
                e.preventDefault();

                // Update active state
                this.navLinks.forEach(l => l.classList.remove('active'));
                link.classList.add('active');

                // Smooth scroll to target
                const targetId = link.getAttribute('href').substring(1);
                const targetSection = document.getElementById(targetId);

                if (targetSection) {
                    targetSection.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });

        // Handle scroll-based navigation highlighting
        window.addEventListener(
            'scroll',
            this.throttle(() => {
                this.updateActiveNavigation();
            }, 100)
        );
    }

    /**
     * Update active navigation based on scroll position
     */
    updateActiveNavigation() {
        let current = '';

        this.sections.forEach(section => {
            const sectionTop = section.offsetTop;
            if (window.pageYOffset >= sectionTop - CONFIG.scrollOffset) {
                current = section.getAttribute('id');
            }
        });

        this.navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').substring(1) === current) {
                link.classList.add('active');
            }
        });
    }

    /**
     * Load visitor count from API with error handling
     */
    async loadVisitorCount() {
        if (!this.visitorCountElement) {
            return;
        }

        try {
            this.visitorCountElement.textContent = 'Loading...';

            const response = await fetch(CONFIG.apiEndpoint, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                },
                cache: 'no-cache'
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            const count = data.count || 0;

            // Animate counter update
            this.animateCounterUpdate(this.visitorCountElement, count);

            console.log('✅ Visitor count updated successfully:', count);
        } catch (error) {
            console.error('❌ Error fetching visitor count:', error);
            this.handleVisitorCountError();
        }
    }

    /**
     * Handle visitor count loading error
     */
    handleVisitorCountError() {
        this.visitorCountElement.textContent = '---';

        // Show detailed error in development
        if (this.isDevelopmentMode()) {
            this.visitorCountElement.textContent = 'API Not Connected';
            this.visitorCountElement.style.fontSize = '0.8rem';
        }
    }

    /**
     * Animate counter with easing
     * @param {HTMLElement} element - Target element
     * @param {number} targetCount - Target count value
     */
    animateCounterUpdate(element, targetCount) {
        const startTime = performance.now();

        const updateCounter = currentTime => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / CONFIG.animationDuration, 1);

            // Cubic easing out for smooth animation
            const easeOut = 1 - Math.pow(1 - progress, 3);
            const currentCount = Math.floor(easeOut * targetCount);

            element.textContent = currentCount.toLocaleString();

            if (progress < 1) {
                requestAnimationFrame(updateCounter);
            } else {
                element.textContent = targetCount.toLocaleString();
                element.classList.add('loaded');
            }
        };

        requestAnimationFrame(updateCounter);
    }

    /**
     * Initialize smooth scrolling for all anchor links
     */
    initializeSmoothScrolling() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                const href = this.getAttribute('href');
                if (href === '#') return;

                e.preventDefault();
                const target = document.querySelector(href);

                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }

    /**
     * Initialize profile image with error handling
     */
    initializeProfileImage() {
        const profileImg = document.getElementById('profile-img');

        if (!profileImg) return;

        profileImg.addEventListener('error', function () {
            this.style.cssText = `
                background: linear-gradient(135deg, #3498db, #2980b9);
                color: white;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 3rem;
                font-weight: bold;
            `;
            this.textContent = 'SA';
            this.alt = 'Samuel Adusei Boateng';
        });
    }

    /**
     * Initialize scroll animations using Intersection Observer
     */
    initializeScrollAnimations() {
        if (!('IntersectionObserver' in window)) {
            return;
        }

        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -100px 0px'
        };

        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        this.sections.forEach(section => {
            observer.observe(section);
        });
    }

    /**
     * Initialize performance monitoring
     */
    initializePerformanceMonitoring() {
        window.addEventListener('load', () => {
            if (!window.performance || !window.performance.timing) {
                return;
            }

            const loadTime =
                window.performance.timing.loadEventEnd - window.performance.timing.navigationStart;

            console.log(`📊 Page loaded in ${loadTime}ms`);

            // Log additional metrics if available
            if (window.performance.getEntriesByType) {
                const perfData = window.performance.getEntriesByType('navigation')[0];
                if (perfData) {
                    console.log(
                        `📈 DOM Content Loaded: ${Math.round(perfData.domContentLoadedEventEnd)}ms`
                    );
                }
            }
        });
    }

    /**
     * Throttle function to limit function calls
     * @param {Function} func - Function to throttle
     * @param {number} limit - Time limit in ms
     */
    throttle(func, limit) {
        let inThrottle;
        return function (...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => (inThrottle = false), limit);
            }
        };
    }

    /**
     * Check if running in development mode
     * @returns {boolean}
     */
    isDevelopmentMode() {
        return (
            window.location.hostname === 'localhost' ||
            window.location.hostname === '127.0.0.1' ||
            window.location.hostname === ''
        );
    }

    /**
     * Format numbers with K/M suffixes
     * @param {number} num - Number to format
     * @returns {string}
     */
    static formatNumber(num) {
        if (num >= 1000000) {
            return (num / 1000000).toFixed(1) + 'M';
        } else if (num >= 1000) {
            return (num / 1000).toFixed(1) + 'K';
        }
        return num.toString();
    }

    /**
     * Show notification message
     * @param {string} message - Notification message
     * @param {string} type - Notification type (success/error/info)
     */
    static showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;

        const bgColors = {
            success: '#27ae60',
            error: '#e74c3c',
            info: '#3498db'
        };

        Object.assign(notification.style, {
            position: 'fixed',
            top: '20px',
            right: '20px',
            padding: '1rem 1.5rem',
            borderRadius: '8px',
            color: 'white',
            fontWeight: '500',
            zIndex: '9999',
            backgroundColor: bgColors[type] || bgColors.info,
            transform: 'translateX(400px)',
            transition: 'transform 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
        });

        document.body.appendChild(notification);

        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);

        // Remove after timeout
        setTimeout(() => {
            notification.style.transform = 'translateX(400px)';
            setTimeout(() => {
                if (document.body.contains(notification)) {
                    document.body.removeChild(notification);
                }
            }, 300);
        }, CONFIG.notificationTimeout);
    }
}

// Initialize application when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.cloudResumeApp = new CloudResumeApp();
    });
} else {
    window.cloudResumeApp = new CloudResumeApp();
}

// Export for testing/modules if needed
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { CloudResumeApp, CONFIG };
}
