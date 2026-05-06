/**
 * CV Website Theme Manager and Interactions
 * Handles theme switching, accessibility, and smooth user interactions
 */

class CVWebsite {
  constructor() {
    this.themeToggle = document.getElementById('theme-toggle');
    this.body = document.body;
    this.prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
    
    this.init();
  }

  init() {
    this.setupTheme();
    this.setupEventListeners();
    this.setupAnimations();
    this.setupAccessibility();
    this.setupPrintOptimization();
  }

  /**
   * Theme Management
   */
  setupTheme() {
    // Get saved theme or use system preference
    const savedTheme = localStorage.getItem('cv-theme');
    const systemTheme = this.prefersDark.matches ? 'dark' : 'light';
    const initialTheme = savedTheme || systemTheme;
    
    this.setTheme(initialTheme);
    
    // Listen for system theme changes
    this.prefersDark.addEventListener('change', (e) => {
      if (!localStorage.getItem('cv-theme')) {
        this.setTheme(e.matches ? 'dark' : 'light');
      }
    });
  }

  setTheme(theme) {
    this.body.setAttribute('data-theme', theme);
    
    // Update theme toggle aria-label
    if (this.themeToggle) {
      const label = theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode';
      this.themeToggle.setAttribute('aria-label', label);
      this.themeToggle.setAttribute('title', label);
    }
    
    // Save theme preference
    localStorage.setItem('cv-theme', theme);
    
    // Dispatch custom event for other components
    window.dispatchEvent(new CustomEvent('themeChanged', { detail: { theme } }));
  }

  toggleTheme() {
    const currentTheme = this.body.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    this.setTheme(newTheme);
  }

  /**
   * Event Listeners
   */
  setupEventListeners() {
    // Theme toggle
    if (this.themeToggle) {
      this.themeToggle.addEventListener('click', () => this.toggleTheme());
      
      // Keyboard support
      this.themeToggle.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          this.toggleTheme();
        }
      });
    }

    // Smooth scrolling for anchor links
    document.addEventListener('click', (e) => {
      const link = e.target.closest('a[href^="#"]');
      if (link) {
        e.preventDefault();
        const target = document.querySelector(link.getAttribute('href'));
        if (target) {
          this.smoothScrollTo(target);
        }
      }
    });

    // External link handling
    document.addEventListener('click', (e) => {
      const link = e.target.closest('a[href^="http"]');
      if (link && !link.hasAttribute('target')) {
        link.setAttribute('target', '_blank');
        link.setAttribute('rel', 'noopener noreferrer');
      }
    });

    // Intersection Observer for animations
    this.setupIntersectionObserver();
  }

  /**
   * Smooth Scrolling
   */
  smoothScrollTo(target) {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    if (reducedMotion) {
      target.scrollIntoView();
    } else {
      target.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
    
    // Focus management for accessibility
    target.focus({ preventScroll: true });
  }

  /**
   * Animation Setup
   */
  setupAnimations() {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    if (reducedMotion) {
      // Disable animations for users who prefer reduced motion
      document.documentElement.style.setProperty('--transition-fast', '0ms');
      document.documentElement.style.setProperty('--transition-normal', '0ms');
      document.documentElement.style.setProperty('--transition-slow', '0ms');
      return;
    }

    // Add entrance animations to sections
    this.animateOnScroll();
  }

  animateOnScroll() {
    const sections = document.querySelectorAll('.section');
    
    sections.forEach((section, index) => {
      section.style.opacity = '0';
      section.style.transform = 'translateY(20px)';
      section.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
      section.style.transitionDelay = `${index * 0.1}s`;
    });
  }

  setupIntersectionObserver() {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    if (reducedMotion) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
      }
    );

    document.querySelectorAll('.section').forEach((section) => {
      observer.observe(section);
    });
  }

  /**
   * Accessibility Enhancements
   */
  setupAccessibility() {
    // Add skip link
    this.addSkipLink();
    
    // Enhance focus management
    this.enhanceFocusManagement();
    
    // Add keyboard navigation for interactive elements
    this.setupKeyboardNavigation();
    
    // Announce theme changes to screen readers
    this.setupThemeAnnouncements();
  }

  addSkipLink() {
    const skipLink = document.createElement('a');
    skipLink.href = '#main';
    skipLink.className = 'skip-link';
    skipLink.textContent = 'Skip to main content';
    skipLink.setAttribute('aria-label', 'Skip to main content');
    
    document.body.insertBefore(skipLink, document.body.firstChild);
    
    // Add id to main content if it doesn't exist
    const main = document.querySelector('.main');
    if (main && !main.id) {
      main.id = 'main';
      main.setAttribute('tabindex', '-1');
    }
  }

  enhanceFocusManagement() {
    // Ensure all interactive elements are focusable
    const interactiveElements = document.querySelectorAll('a, button, [tabindex]');
    
    interactiveElements.forEach((element) => {
      if (!element.hasAttribute('tabindex') && element.tagName !== 'A' && element.tagName !== 'BUTTON') {
        element.setAttribute('tabindex', '0');
      }
    });

    // Add focus indicators for keyboard users
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Tab') {
        document.body.classList.add('keyboard-navigation');
      }
    });

    document.addEventListener('mousedown', () => {
      document.body.classList.remove('keyboard-navigation');
    });
  }

  setupKeyboardNavigation() {
    // Enhanced keyboard support for custom interactive elements
    document.addEventListener('keydown', (e) => {
      const activeElement = document.activeElement;
      
      // Handle Enter and Space for custom buttons
      if ((e.key === 'Enter' || e.key === ' ') && 
          activeElement.hasAttribute('role') && 
          activeElement.getAttribute('role') === 'button') {
        e.preventDefault();
        activeElement.click();
      }
    });
  }

  setupThemeAnnouncements() {
    // Create a live region for theme announcements
    const liveRegion = document.createElement('div');
    liveRegion.setAttribute('aria-live', 'polite');
    liveRegion.setAttribute('aria-atomic', 'true');
    liveRegion.className = 'sr-only';
    liveRegion.style.cssText = `
      position: absolute;
      width: 1px;
      height: 1px;
      padding: 0;
      margin: -1px;
      overflow: hidden;
      clip: rect(0, 0, 0, 0);
      white-space: nowrap;
      border: 0;
    `;
    document.body.appendChild(liveRegion);

    // Announce theme changes
    window.addEventListener('themeChanged', (e) => {
      const theme = e.detail.theme;
      liveRegion.textContent = `Theme switched to ${theme} mode`;
      
      // Clear the announcement after a delay
      setTimeout(() => {
        liveRegion.textContent = '';
      }, 1000);
    });
  }

  /**
   * Print Optimization
   */
  setupPrintOptimization() {
    // Listen for print events
    window.addEventListener('beforeprint', () => {
      this.optimizeForPrint();
    });

    window.addEventListener('afterprint', () => {
      this.restoreAfterPrint();
    });
  }

  optimizeForPrint() {
    // Expand any collapsed content
    const collapsedElements = document.querySelectorAll('[aria-expanded="false"]');
    collapsedElements.forEach((element) => {
      element.setAttribute('aria-expanded', 'true');
      element.setAttribute('data-was-collapsed', 'true');
    });

    // Ensure all images are loaded
    const images = document.querySelectorAll('img');
    images.forEach((img) => {
      if (!img.complete) {
        img.loading = 'eager';
      }
    });

    // Add print-specific classes
    document.body.classList.add('printing');
  }

  restoreAfterPrint() {
    // Restore collapsed state
    const expandedElements = document.querySelectorAll('[data-was-collapsed="true"]');
    expandedElements.forEach((element) => {
      element.setAttribute('aria-expanded', 'false');
      element.removeAttribute('data-was-collapsed');
    });

    // Remove print-specific classes
    document.body.classList.remove('printing');
  }

  /**
   * Utility Methods
   */
  debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  throttle(func, limit) {
    let inThrottle;
    return function() {
      const args = arguments;
      const context = this;
      if (!inThrottle) {
        func.apply(context, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  }
}

/**
 * Performance Monitoring
 */
class PerformanceMonitor {
  constructor() {
    this.metrics = {};
    this.init();
  }

  init() {
    // Monitor Core Web Vitals
    this.monitorCLS();
    this.monitorFID();
    this.monitorLCP();
    
    // Monitor custom metrics
    this.monitorThemeSwitch();
  }

  monitorCLS() {
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (!entry.hadRecentInput) {
            this.metrics.cls = (this.metrics.cls || 0) + entry.value;
          }
        }
      });
      observer.observe({ entryTypes: ['layout-shift'] });
    }
  }

  monitorFID() {
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          this.metrics.fid = entry.processingStart - entry.startTime;
        }
      });
      observer.observe({ entryTypes: ['first-input'] });
    }
  }

  monitorLCP() {
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          this.metrics.lcp = entry.startTime;
        }
      });
      observer.observe({ entryTypes: ['largest-contentful-paint'] });
    }
  }

  monitorThemeSwitch() {
    let themeSwitchStart;
    
    window.addEventListener('themeChanged', () => {
      if (themeSwitchStart) {
        const duration = performance.now() - themeSwitchStart;
        this.metrics.themeSwitchDuration = duration;
      }
    });

    document.addEventListener('click', (e) => {
      if (e.target.closest('#theme-toggle')) {
        themeSwitchStart = performance.now();
      }
    });
  }

  getMetrics() {
    return { ...this.metrics };
  }
}

/**
 * Error Handling
 */
class ErrorHandler {
  constructor() {
    this.setupErrorHandling();
  }

  setupErrorHandling() {
    // Global error handler
    window.addEventListener('error', (e) => {
      this.logError('JavaScript Error', e.error);
    });

    // Unhandled promise rejection handler
    window.addEventListener('unhandledrejection', (e) => {
      this.logError('Unhandled Promise Rejection', e.reason);
    });
  }

  logError(type, error) {
    const errorInfo = {
      type,
      message: error.message || error,
      stack: error.stack,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href
    };

    // Log to console in development
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
      console.error('CV Website Error:', errorInfo);
    }

    // In production, you might want to send this to an error tracking service
    // this.sendErrorToService(errorInfo);
  }
}

/**
 * Initialize Application
 */
document.addEventListener('DOMContentLoaded', () => {
  try {
    // Initialize main application
    const cvWebsite = new CVWebsite();
    
    // Initialize performance monitoring
    const performanceMonitor = new PerformanceMonitor();
    
    // Initialize error handling
    const errorHandler = new ErrorHandler();
    
    // Make instances available globally for debugging
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
      window.cvWebsite = cvWebsite;
      window.performanceMonitor = performanceMonitor;
    }
    
    // Log successful initialization
    console.log('CV Website initialized successfully');
    
  } catch (error) {
    console.error('Failed to initialize CV Website:', error);
    
    // Fallback: at least make theme toggle work
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
      themeToggle.addEventListener('click', () => {
        const body = document.body;
        const currentTheme = body.getAttribute('data-theme') || 'light';
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        body.setAttribute('data-theme', newTheme);
        localStorage.setItem('cv-theme', newTheme);
      });
    }
  }
});

// Service Worker Registration (if available)
if ('serviceWorker' in navigator && window.location.protocol === 'https:') {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js')
      .then((registration) => {
        console.log('ServiceWorker registration successful');
      })
      .catch((error) => {
        console.log('ServiceWorker registration failed');
      });
  });
}