// JavaScript for Cloud Resume functionality

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all functionality
    initializeNavigation();
    loadVisitorCount();
    initializeSmoothScrolling();
    initializeProfileImage();
});

/**
 * Initialize navigation functionality
 */
function initializeNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('.section');

    // Handle navigation clicks
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Remove active class from all links
            navLinks.forEach(l => l.classList.remove('active'));
            
            // Add active class to clicked link
            this.classList.add('active');
            
            // Get target section
            const targetId = this.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);
            
            if (targetSection) {
                // Smooth scroll to section
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Handle scroll-based navigation highlighting
    window.addEventListener('scroll', function() {
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            
            if (window.pageYOffset >= (sectionTop - 200)) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').substring(1) === current) {
                link.classList.add('active');
            }
        });
    });
}

/**
 * Load visitor count from API
 */
async function loadVisitorCount() {
    const visitorCountElement = document.getElementById('visitor-count');
    
    try {
        // Replace this URL with your actual API Gateway endpoint
        // This will be set during deployment
        const apiUrl = 'https://ufx4t82h6a.execute-api.us-east-1.amazonaws.com/prod/visitor-count';
        
        // Show loading state
        visitorCountElement.textContent = 'Loading...';
        
        const response = await fetch(apiUrl, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        
        // Update visitor count with animation
        animateCounterUpdate(visitorCountElement, data.count);
        
        // Remove loading animation
        visitorCountElement.classList.add('loaded');
        
        console.log('Visitor count updated successfully:', data.count);
        
    } catch (error) {
        console.error('Error fetching visitor count:', error);
        
        // Fallback display
        visitorCountElement.textContent = '---';
        visitorCountElement.classList.add('loaded');
        
        // You might want to show this error in development only
        if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
            visitorCountElement.textContent = 'API Not Connected';
            visitorCountElement.style.fontSize = '0.8rem';
        }
    }
}

/**
 * Animate counter update
 */
function animateCounterUpdate(element, targetCount) {
    const startCount = 0;
    const duration = 1000; // 1 second
    const startTime = performance.now();
    
    function updateCounter(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function for smooth animation
        const easeOut = 1 - Math.pow(1 - progress, 3);
        const currentCount = Math.floor(easeOut * targetCount);
        
        element.textContent = currentCount.toLocaleString();
        
        if (progress < 1) {
            requestAnimationFrame(updateCounter);
        } else {
            element.textContent = targetCount.toLocaleString();
        }
    }
    
    requestAnimationFrame(updateCounter);
}

/**
 * Initialize smooth scrolling for all internal links
 */
function initializeSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
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
 * Initialize profile image with fallback
 */
function initializeProfileImage() {
    const profileImg = document.getElementById('profile-img');
    
    // Add error handler for profile image
    profileImg.addEventListener('error', function() {
        // Fallback to a gradient background with initials
        this.style.background = 'linear-gradient(135deg, #3498db, #2980b9)';
        this.style.color = 'white';
        this.style.display = 'flex';
        this.style.alignItems = 'center';
        this.style.justifyContent = 'center';
        this.style.fontSize = '3rem';
        this.style.fontWeight = 'bold';
        this.textContent = 'SA';
        this.alt = 'Samuel Adusei Boateng';
    });
}

/**
 * Utility function to show loading state
 */
function showLoading(element, text = 'Loading...') {
    element.innerHTML = `
        <div class="loading-spinner">
            <i class="fas fa-spinner fa-spin"></i>
            ${text}
        </div>
    `;
}

/**
 * Utility function to format numbers
 */
function formatNumber(num) {
    if (num >= 1000000) {
        return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
        return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
}

/**
 * Add intersection observer for scroll animations
 */
function initializeScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);

    // Observe all sections for scroll animations
    document.querySelectorAll('.section').forEach(section => {
        observer.observe(section);
    });
}

/**
 * Initialize theme toggle (if you want to add dark mode in the future)
 */
function initializeTheme() {
    // Check for saved theme preference or default to light mode
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
}

/**
 * Handle form submissions (if you add contact forms later)
 */
function handleFormSubmissions() {
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
        form.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const formData = new FormData(this);
            const formObject = Object.fromEntries(formData);
            
            try {
                // Handle form submission
                console.log('Form data:', formObject);
                
                // Show success message
                showNotification('Message sent successfully!', 'success');
                
            } catch (error) {
                console.error('Form submission error:', error);
                showNotification('Error sending message. Please try again.', 'error');
            }
        });
    });
}

/**
 * Show notification messages
 */
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // Style the notification
    Object.assign(notification.style, {
        position: 'fixed',
        top: '20px',
        right: '20px',
        padding: '1rem 1.5rem',
        borderRadius: '8px',
        color: 'white',
        fontWeight: '500',
        zIndex: '9999',
        transform: 'translateX(100%)',
        transition: 'transform 0.3s ease',
        backgroundColor: type === 'success' ? '#27ae60' : type === 'error' ? '#e74c3c' : '#3498db'
    });
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

/**
 * Performance monitoring (optional)
 */
function initializePerformanceMonitoring() {
    // Log page load time
    window.addEventListener('load', () => {
        const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
        console.log(`Page loaded in ${loadTime}ms`);
    });
}

// Initialize performance monitoring
initializePerformanceMonitoring();

// Add scroll animations if supported
if ('IntersectionObserver' in window) {
    initializeScrollAnimations();
}

// Export functions for testing (if needed)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        loadVisitorCount,
        animateCounterUpdate,
        formatNumber,
        showNotification
    };
}
