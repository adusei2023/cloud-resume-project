class ResumeApp {
    constructor() {
        this.apiEndpoint = 'https://your-api-gateway-url.amazonaws.com/prod/visitor-count';
        this.visitorCountElement = document.getElementById('visitor-count');
        this.init();
    }

    async init() {
        this.addSmoothScrolling();
        this.addScrollAnimations();
        this.addPrintFunctionality();
        await this.updateVisitorCount();
        this.addInteractiveElements();
    }

    // Smooth scrolling for navigation links
    addSmoothScrolling() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(anchor.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }

    // Add scroll-triggered animations
    addScrollAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, observerOptions);

        // Apply animation to sections
        document.querySelectorAll('section').forEach(section => {
            section.style.opacity = '0';
            section.style.transform = 'translateY(30px)';
            section.style.transition = 'all 0.8s ease-out';
            observer.observe(section);
        });

        // Animate cards on scroll
        document.querySelectorAll('.job, .project, .cert-item').forEach((card, index) => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(30px)';
            card.style.transition = `all 0.6s ease-out ${index * 0.1}s`;
            observer.observe(card);
        });
    }

    // Add print functionality
    addPrintFunctionality() {
        const printBtn = document.createElement('button');
        printBtn.innerHTML = '<i class="fas fa-print"></i> Print Resume';
        printBtn.className = 'print-btn';
        printBtn.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: var(--secondary-color);
            color: white;
            border: none;
            padding: 12px 20px;
            border-radius: 25px;
            cursor: pointer;
            font-size: 14px;
            font-weight: 500;
            box-shadow: var(--shadow);
            z-index: 1000;
            display: flex;
            align-items: center;
            gap: 8px;
            transition: all 0.3s ease;
        `;
        
        printBtn.addEventListener('mouseenter', () => {
            printBtn.style.transform = 'translateY(-2px)';
            printBtn.style.boxShadow = '0 4px 15px rgba(0,0,0,0.2)';
        });
        
        printBtn.addEventListener('mouseleave', () => {
            printBtn.style.transform = 'translateY(0)';
            printBtn.style.boxShadow = 'var(--shadow)';
        });
        
        printBtn.addEventListener('click', () => {
            window.print();
        });
        
        document.body.appendChild(printBtn);

        // Hide print button on mobile
        if (window.innerWidth <= 768) {
            printBtn.style.display = 'none';
        }
    }

    // Update visitor count via API
    async updateVisitorCount() {
        try {
            this.visitorCountElement.textContent = 'Loading...';
            
            const response = await fetch(this.apiEndpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    action: 'increment'
                })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            
            if (data.count !== undefined) {
                this.animateCounterUpdate(data.count);
                this.logVisit(data.count);
            } else {
                throw new Error('Invalid response format');
            }
            
        } catch (error) {
            console.error('Error fetching visitor count:', error);
            this.handleVisitorCountError();
        }
    }

    // Animate counter update
    animateCounterUpdate(finalCount) {
        const startCount = 0;
        const duration = 2000; // 2 seconds
        const steps = 60;
        const increment = finalCount / steps;
        let currentCount = startCount;
        
        const timer = setInterval(() => {
            currentCount += increment;
            this.visitorCountElement.textContent = Math.floor(currentCount).toLocaleString();
            
            if (currentCount >= finalCount) {
                clearInterval(timer);
                this.visitorCountElement.textContent = finalCount.toLocaleString();
            }
        }, duration / steps);
    }

    // Handle visitor count error
    handleVisitorCountError() {
        // Fallback to localStorage for development/offline
        let count = parseInt(localStorage.getItem('visitorCount') || '0');
        count++;
        localStorage.setItem('visitorCount', count.toString());
        
        this.visitorCountElement.textContent = `${count.toLocaleString()} (offline)`;
        this.visitorCountElement.style.color = '#e74c3c';
        
        // Show retry button
        const retryBtn = document.createElement('button');
        retryBtn.innerHTML = '<i class="fas fa-redo"></i>';
        retryBtn.style.cssText = `
            margin-left: 10px;
            background: transparent;
            border: 1px solid currentColor;
            color: inherit;
            padding: 4px 8px;
            border-radius: 3px;
            cursor: pointer;
            font-size: 12px;
        `;
        retryBtn.title = 'Retry loading visitor count';
        retryBtn.addEventListener('click', () => {
            retryBtn.remove();
            this.visitorCountElement.style.color = '';
            this.updateVisitorCount();
        });
        
        this.visitorCountElement.parentNode.appendChild(retryBtn);
    }

    // Log visit for analytics
    logVisit(count) {
        const visitData = {
            timestamp: new Date().toISOString(),
            count: count,
            userAgent: navigator.userAgent,
            referrer: document.referrer || 'direct',
            viewport: `${window.innerWidth}x${window.innerHeight}`
        };
        
        // Store locally for analytics
        const visits = JSON.parse(localStorage.getItem('visitHistory') || '[]');
        visits.push(visitData);
        
        // Keep only last 10 visits
        if (visits.length > 10) {
            visits.splice(0, visits.length - 10);
        }
        
        localStorage.setItem('visitHistory', JSON.stringify(visits));
        
        console.log('Visit logged:', visitData);
    }

    // Add interactive elements
    addInteractiveElements() {
        // Add hover effects to skill items
        document.querySelectorAll('.skill').forEach(skill => {
            skill.addEventListener('mouseenter', () => {
                skill.style.transform = 'scale(1.05)';
            });
            
            skill.addEventListener('mouseleave', () => {
                skill.style.transform = 'scale(1)';
            });
        });

        // Add click effects to contact items
        document.querySelectorAll('.contact-item').forEach(item => {
            item.addEventListener('click', () => {
                const text = item.querySelector('span').textContent;
                
                if (text.includes('@')) {
                    window.open(`mailto:${text}`, '_blank');
                } else if (text.includes('linkedin')) {
                    window.open(`https://${text}`, '_blank');
                } else if (text.includes('github')) {
                    window.open(`https://${text}`, '_blank');
                } else if (text.includes('+')) {
                    window.open(`tel:${text}`, '_blank');
                }
            });
            
            item.style.cursor = 'pointer';
            item.title = 'Click to open';
        });

        // Add typing effect to title
        this.addTypingEffect();
    }

    // Add typing effect to main title
    addTypingEffect() {
        const titleElement = document.querySelector('.title');
        const originalText = titleElement.textContent;
        titleElement.textContent = '';
        
        let i = 0;
        const typingTimer = setInterval(() => {
            if (i < originalText.length) {
                titleElement.textContent += originalText.charAt(i);
                i++;
            } else {
                clearInterval(typingTimer);
            }
        }, 100);
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new ResumeApp();
});

// Handle window resize for responsive adjustments
window.addEventListener('resize', () => {
    const printBtn = document.querySelector('.print-btn');
    if (printBtn) {
        printBtn.style.display = window.innerWidth <= 768 ? 'none' : 'flex';
    }
});

// Service Worker registration for offline functionality (optional)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('SW registered: ', registration);
            })
            .catch(registrationError => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}
