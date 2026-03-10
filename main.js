/* ====================================
   ADVANCED JAVASCRIPT ANIMATIONS
   ==================================== */

// ====== ANIMATION CONFIGURATION ======
const AnimationConfig = {
  staggerDelay: 100,
  defaultDuration: 600,
  easingFunctions: {
    easeInOutCubic: t => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2,
    easeOutQuad: t => 1 - (1 - t) * (1 - t),
    easeInQuad: t => t * t,
    easeOutCubic: t => 1 - Math.pow(1 - t, 3),
    easeInCubic: t => t * t * t,
    linear: t => t
  }
};

// ====== INTERSECTION OBSERVER FOR SCROLL ANIMATIONS ======
class ScrollAnimationObserver {
  constructor() {
    this.observer = new IntersectionObserver(
      (entries) => this.handleIntersection(entries),
      {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
      }
    );
    this.init();
  }

  init() {
    document.querySelectorAll('.slide-in-left, .slide-in-right, .slide-in-up, .fade-in, .scale-up').forEach(el => {
      this.observer.observe(el);
    });
  }

  handleIntersection(entries) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.animation = 'none';
        setTimeout(() => {
          const classes = entry.target.className;
          if (classes.includes('slide-in-left')) entry.target.style.animation = 'slideInLeft 0.6s ease-out forwards';
          else if (classes.includes('slide-in-right')) entry.target.style.animation = 'slideInRight 0.6s ease-out forwards';
          else if (classes.includes('slide-in-up')) entry.target.style.animation = 'slideInUp 0.6s ease-out forwards';
          else if (classes.includes('fade-in')) entry.target.style.animation = 'fadeIn 0.8s ease-out forwards';
          else if (classes.includes('scale-up')) entry.target.style.animation = 'scaleUp 0.5s ease-out forwards';
        }, 10);
        this.observer.unobserve(entry.target);
      }
    });
  }
}

// ====== PARALLAX EFFECT ======
class ParallaxEffect {
  constructor() {
    this.elements = document.querySelectorAll('.parallax');
    this.init();
  }

  init() {
    window.addEventListener('scroll', () => this.updateParallax());
  }

  updateParallax() {
    this.elements.forEach(el => {
      const scrollPosition = window.pageYOffset;
      const offset = scrollPosition * 0.5;
      el.style.backgroundPosition = `center ${offset}px`;
    });
  }
}

// ====== SMOOTH SCROLL TO SECTION ======
class SmoothScroller {
  constructor() {
    this.init();
  }

  init() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', (e) => this.handleScroll(e));
    });
  }

  handleScroll(e) {
    const href = e.currentTarget.getAttribute('href');
    if (href && href !== '#') {
      e.preventDefault();
      const target = document.querySelector(href);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  }
}

// ====== GSAP-LIKE ANIMATION LIBRARY ======
class Animator {
  static animate(element, props, duration = 600, easing = 'easeInOutCubic') {
    return new Promise((resolve) => {
      const startTime = performance.now();
      const startValues = {};
      const endValues = props;

      // Get initial values
      Object.keys(props).forEach(key => {
        const currentValue = getComputedStyle(element)[key];
        startValues[key] = this.parseValue(currentValue);
      });

      const easingFunc = AnimationConfig.easingFunctions[easing] || AnimationConfig.easingFunctions.easeInOutCubic;

      const animate = (currentTime) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easeProgress = easingFunc(progress);

        Object.keys(props).forEach(key => {
          const start = startValues[key].value;
          const end = endValues[key].value || endValues[key];
          const unit = startValues[key].unit || 'px';
          const current = start + (end - start) * easeProgress;
          element.style[key] = current + unit;
        });

        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          resolve();
        }
      };

      requestAnimationFrame(animate);
    });
  }

  static parseValue(value) {
    const match = value.match(/^([-+]?[0-9]*\.?[0-9]+)([a-z%]*)$/i);
    if (match) {
      return { value: parseFloat(match[1]), unit: match[2] };
    }
    return { value: 0, unit: 'px' };
  }
}

// ====== COUNTER ANIMATION ======
class CounterAnimation {
  static animateCounter(element, target, duration = 2000) {
    const startValue = parseInt(element.textContent) || 0;
    const startTime = performance.now();

    const animate = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const currentValue = Math.floor(startValue + (target - startValue) * progress);
      element.textContent = currentValue.toLocaleString();

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }

  static init() {
    const counters = document.querySelectorAll('[data-counter]');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const target = parseInt(entry.target.getAttribute('data-counter'));
          this.animateCounter(entry.target, target);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    counters.forEach(counter => observer.observe(counter));
  }
}

// ====== WAVE TEXT ANIMATION ======
class WaveTextAnimation {
  static init() {
    document.querySelectorAll('.wave-text').forEach(element => {
      const text = element.textContent;
      element.textContent = '';
      
      text.split('').forEach((char, index) => {
        const span = document.createElement('span');
        span.textContent = char;
        span.style.display = 'inline-block';
        span.style.animation = `wave 0.6s ease-in-out ${index * 0.05}s infinite`;
        element.appendChild(span);
      });
    });
  }
}

// ====== TYPING ANIMATION ======
class TypingAnimation {
  static type(element, text, speed = 50) {
    return new Promise((resolve) => {
      element.textContent = '';
      let index = 0;

      const typeChar = () => {
        if (index < text.length) {
          element.textContent += text[index];
          index++;
          setTimeout(typeChar, speed);
        } else {
          resolve();
        }
      };

      typeChar();
    });
  }

  static init() {
    const elements = document.querySelectorAll('[data-typing]');
    elements.forEach(el => {
      const text = el.getAttribute('data-typing');
      const speed = parseInt(el.getAttribute('data-typing-speed')) || 50;
      this.type(el, text, speed);
    });
  }
}

// ====== MOUSE FOLLOW ANIMATION ======
class MouseFollowEffect {
  constructor(selector = '.mouse-follow') {
    this.elements = document.querySelectorAll(selector);
    this.mouseX = 0;
    this.mouseY = 0;
    this.init();
  }

  init() {
    document.addEventListener('mousemove', (e) => this.onMouseMove(e));
  }

  onMouseMove(e) {
    this.mouseX = e.clientX;
    this.mouseY = e.clientY;

    this.elements.forEach((element, index) => {
      const speed = 1 - (index + 1) * 0.1;
      const x = this.mouseX * speed;
      const y = this.mouseY * speed;
      element.style.transform = `translate(${x}px, ${y}px)`;
    });
  }
}

// ====== BLUR SCROLL EFFECT ======
class BlurScrollEffect {
  constructor() {
    this.init();
  }

  init() {
    const elements = document.querySelectorAll('[data-blur-scroll]');
    window.addEventListener('scroll', () => {
      const scrolled = window.pageYOffset;
      elements.forEach(el => {
        const blurAmount = Math.min(scrolled / 100, 10);
        el.style.filter = `blur(${blurAmount}px)`;
      });
    });
  }
}

// ====== TILT EFFECT (3D) ======
class TiltEffect {
  constructor(selector = '.tilt-element') {
    this.elements = document.querySelectorAll(selector);
    this.init();
  }

  init() {
    this.elements.forEach(element => {
      element.addEventListener('mousemove', (e) => this.onMouseMove(e, element));
      element.addEventListener('mouseleave', (e) => this.onMouseLeave(e, element));
    });
  }

  onMouseMove(e, element) {
    const rect = element.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const rotateX = (y - centerY) / 10;
    const rotateY = (centerX - x) / 10;

    element.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
  }

  onMouseLeave(e, element) {
    element.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale(1)';
  }
}

// ====== SWIPE ANIMATION ======
class SwipeAnimation {
  constructor(selector = '[data-swipe]') {
    this.elements = Array.from(document.querySelectorAll(selector));
    this.touchStartX = 0;
    this.touchEndX = 0;
    this.init();
  }

  init() {
    this.elements.forEach(el => {
      el.addEventListener('touchstart', (e) => this.handleTouchStart(e));
      el.addEventListener('touchend', (e) => this.handleTouchEnd(e, el));
    });
  }

  handleTouchStart(e) {
    this.touchStartX = e.changedTouches[0].screenX;
  }

  handleTouchEnd(e, element) {
    this.touchEndX = e.changedTouches[0].screenX;
    this.handleSwipe(element);
  }

  handleSwipe(element) {
    const diff = this.touchStartX - this.touchEndX;
    const threshold = 50;

    if (Math.abs(diff) > threshold) {
      if (diff > 0) {
        this.animateSwipe(element, -100);
      } else {
        this.animateSwipe(element, 100);
      }
    }
  }

  animateSwipe(element, direction) {
    element.style.transform = `translateX(${direction}px)`;
    element.style.opacity = '0';
    setTimeout(() => {
      element.remove();
    }, 300);
  }
}

// ====== SPRING ANIMATION ======
class SpringAnimation {
  static animate(element, property, targetValue, duration = 800) {
    const startValue = parseFloat(getComputedStyle(element)[property]);
    const startTime = performance.now();
    const spring = 0.3;
    const friction = 0.8;

    const animate = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Spring easing
      const springEasing = Math.exp(-friction * progress) * Math.cos(spring * progress * 10);
      const value = startValue + (targetValue - startValue) * (1 - springEasing);

      element.style[property] = value;

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }
}

// ====== LAZY LOADING WITH ANIMATION ======
class LazyloadAnimation {
  constructor() {
    this.images = document.querySelectorAll('img[data-lazy]');
    this.init();
  }

  init() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.getAttribute('data-lazy');
          img.style.animation = 'fadeIn 0.6s ease-out';
          img.removeAttribute('data-lazy');
          observer.unobserve(img);
        }
      });
    }, { threshold: 0.1 });

    this.images.forEach(img => observer.observe(img));
  }
}

// ====== STAGGER ANIMATION HELPER ======
class StaggerAnimator {
  static stagger(elements, animationName, baseDelay = 100) {
    elements.forEach((element, index) => {
      element.style.animationDelay = `${index * baseDelay}ms`;
      element.style.animation = `${animationName} 0.6s ease-out forwards`;
    });
  }

  static init() {
    const staggerGroups = document.querySelectorAll('[data-stagger]');
    staggerGroups.forEach(group => {
      const items = group.querySelectorAll('[data-stagger-item]');
      const animation = group.getAttribute('data-stagger') || 'slideInUp';
      const delay = parseInt(group.getAttribute('data-stagger-delay')) || 100;
      this.stagger(items, animation, delay);
    });
  }
}

// ====== REVEAL ANIMATION ON SCROLL ======
class RevealAnimation {
  constructor() {
    this.reveals = document.querySelectorAll('[data-reveal]');
    this.init();
  }

  init() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const animation = entry.target.getAttribute('data-reveal') || 'slideInUp';
          entry.target.style.animation = `${animation} 0.8s ease-out forwards`;
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2 });

    this.reveals.forEach(reveal => observer.observe(reveal));
  }
}

// ====== SCROLL PROGRESS BAR ======
class ScrollProgressBar {
  constructor(selector = '.scroll-progress') {
    this.progressBar = document.querySelector(selector);
    if (this.progressBar) this.init();
  }

  init() {
    window.addEventListener('scroll', () => this.updateProgress());
  }

  updateProgress() {
    const windowHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrolled = window.pageYOffset;
    const progress = (scrolled / windowHeight) * 100;
    this.progressBar.style.width = `${progress}%`;
  }
}

// ====== DEBOUNCE UTILITY ======
function debounce(func, wait) {
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

// ====== THROTTLE UTILITY ======
function throttle(func, limit) {
  let inThrottle;
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

// ====== INITIALIZE ALL ANIMATIONS ======
function initializeAllAnimations() {
  // Wait for DOM to be fully loaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setupAnimations);
  } else {
    setupAnimations();
  }
}

function setupAnimations() {
  // Initialize all animation systems
  new ScrollAnimationObserver();
  new ParallaxEffect();
  new SmoothScroller();
  new BlurScrollEffect();
  WaveTextAnimation.init();
  TypingAnimation.init();
  CounterAnimation.init();
  new MouseFollowEffect();
  new TiltEffect();
  new SwipeAnimation();
  new LazyloadAnimation();
  StaggerAnimator.init();
  new RevealAnimation();
  new ScrollProgressBar();

  // Add scroll event with throttling
  window.addEventListener('scroll', throttle(() => {
    // Custom scroll logic here
  }, 100));
}

// ====== AUTO-INITIALIZE ON LOAD ======
initializeAllAnimations();

// ====== UTILITY FUNCTIONS ======

// Animate scroll to position
function scrollToPosition(targetPosition, duration = 800) {
  const startPosition = window.pageYOffset;
  const distance = targetPosition - startPosition;
  let start = null;

  const animation = (currentTime) => {
    if (start === null) start = currentTime;
    const timeElapsed = currentTime - start;
    const easeInOutQuad = Math.min(timeElapsed / duration, 1) < 0.5
      ? 2 * Math.pow(Math.min(timeElapsed / duration, 1), 2)
      : 1 - Math.pow(2 - 2 * Math.min(timeElapsed / duration, 1), 2) / 2;

    window.scrollTo(0, startPosition + distance * easeInOutQuad);

    if (timeElapsed < duration) {
      requestAnimationFrame(animation);
    }
  };

  requestAnimationFrame(animation);
}

// Add class with transition
function addClassWithTransition(element, className, duration = 300) {
  element.style.transition = `all ${duration}ms ease-out`;
  element.classList.add(className);
}

// Remove class with transition
function removeClassWithTransition(element, className, duration = 300) {
  element.style.transition = `all ${duration}ms ease-out`;
  element.classList.remove(className);
  setTimeout(() => {
    element.style.transition = '';
  }, duration);
}

// Toggle animation
function toggleAnimation(element, animationName, duration = 600) {
  element.style.animation = `${animationName} ${duration}ms ease-out`;
  setTimeout(() => {
    element.style.animation = '';
  }, duration);
}

// Expose to global scope for easy access
window.AnimationUtils = {
  animate: Animator.animate,
  scrollToPosition,
  addClassWithTransition,
  removeClassWithTransition,
  toggleAnimation,
  debounce,
  throttle,
  SpringAnimation,
  CounterAnimation,
  TypingAnimation
};

console.log('✨ Advanced Animations Loaded Successfully!');
