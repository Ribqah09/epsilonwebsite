/**
 * Optimized Carousel with Auto-slide, Keyboard Navigation, and Lazy Loading
 */

(function() {
  'use strict';

  // Wait for DOM to be ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCarousel);
  } else {
    initCarousel();
  }

  function initCarousel() {
    const carousel = document.querySelector('.image-carousel');
    if (!carousel) return;

    const heroSection = document.querySelector('.hero-section');
    const slides = carousel.querySelectorAll('.slide');
    const dotsContainer = heroSection ? heroSection.querySelector('.carousel-dots') : document.querySelector('.carousel-dots');
    const prevBtn = carousel.querySelector('.carousel-btn.prev');
    const nextBtn = carousel.querySelector('.carousel-btn.next');

    if (slides.length === 0 || !dotsContainer) return;

    let currentIndex = 0;
    let autoSlideInterval = null;
    let isPaused = false;
    let isAnimating = false; // Prevent rapid clicks during animation
    const SLIDE_INTERVAL = 3500; // 3.5 seconds
    const ANIMATION_DURATION = 700; // Match CSS animation duration

    // Create dots dynamically
    slides.forEach((_, index) => {
      const dot = document.createElement('button');
      dot.setAttribute('role', 'tab');
      dot.setAttribute('aria-label', `Go to slide ${index + 1}`);
      dot.setAttribute('aria-selected', index === 0 ? 'true' : 'false');
      dot.setAttribute('tabindex', index === 0 ? '0' : '-1');
      if (index === 0) dot.classList.add('active');
      dotsContainer.appendChild(dot);
    });

    const dots = dotsContainer.querySelectorAll('button');

    // Lazy load images (except first one)
    function lazyLoadImages() {
      slides.forEach((slide, index) => {
        if (index > 0) {
          const img = slide.querySelector('img');
          if (img && img.getAttribute('loading') === 'lazy') {
            // Use Intersection Observer for better performance
            if ('IntersectionObserver' in window) {
              const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                  if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) {
                      img.src = img.dataset.src;
                      img.removeAttribute('data-src');
                    }
                    observer.unobserve(img);
                  }
                });
              }, { rootMargin: '50px' });
              observer.observe(img);
            }
          }
        }
      });
    }

    // Show specific slide with animations
    function showSlide(index) {
      // Ensure index is within bounds
      if (index < 0) index = slides.length - 1;
      if (index >= slides.length) index = 0;

      const prevIndex = currentIndex;
      
      // Skip if same slide or animation already in progress
      if (prevIndex === index || isAnimating) return;
      
      // Lock animation
      isAnimating = true;
      
      const prevSlide = slides[prevIndex];
      const nextSlide = slides[index];
      const nextSlideIndex = parseInt(nextSlide.getAttribute('data-slide')) || index;
      
      // STEP 1: Clean up ALL slides first
      slides.forEach(slide => {
        slide.classList.remove(
          'active', 'entering', 'exiting',
          'slide-in-left', 'slide-out-right', 
          'slide-in-bottom', 'slide-out-top'
        );
        slide.style.zIndex = '';
      });
      
      // STEP 2: Set up the exiting slide (current)
      prevSlide.classList.add('exiting');
      
      // STEP 3: Set up the entering slide (next)
      nextSlide.classList.add('entering');
      
      // STEP 4: Force browser reflow before adding animation classes
      // This is CRITICAL - without it, the browser batches the changes
      // Use getComputedStyle to force synchronous style calculation
      window.getComputedStyle(nextSlide).opacity;
      window.getComputedStyle(prevSlide).opacity;
      
      // STEP 5: Use requestAnimationFrame to ensure styles are applied before animation
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          // Apply animation classes based on incoming slide
          if (nextSlideIndex === 0) {
            // Image 1: Slides in from Left
            nextSlide.classList.add('slide-in-left');
            prevSlide.classList.add('slide-out-right');
          } else {
            // Images 2 & 3: Slides in from Bottom
            nextSlide.classList.add('slide-in-bottom');
            prevSlide.classList.add('slide-out-top');
          }
        });
      });

      // STEP 6: Update dots immediately for responsive feel
      dots.forEach((dot, i) => {
        dot.classList.toggle('active', i === index);
        dot.setAttribute('aria-selected', i === index ? 'true' : 'false');
      });

      // STEP 7: After animation completes, clean up and set final state
      setTimeout(() => {
        // Remove all animation-related classes
        prevSlide.classList.remove(
          'exiting', 'slide-out-right', 'slide-out-top'
        );
        nextSlide.classList.remove(
          'entering', 'slide-in-left', 'slide-in-bottom'
        );
        
        // Set the new slide as active
        nextSlide.classList.add('active');
        
        // Update current index
        currentIndex = index;
        
        // Unlock animation
        isAnimating = false;
      }, ANIMATION_DURATION + 50); // Small buffer for safety
    }

    // Next slide
    function nextSlide() {
      const nextIndex = (currentIndex + 1) % slides.length;
      showSlide(nextIndex);
    }

    // Previous slide
    function prevSlide() {
      const prevIndex = (currentIndex - 1 + slides.length) % slides.length;
      showSlide(prevIndex);
    }

    // Start auto-slide
    function startAutoSlide() {
      if (autoSlideInterval) return;
      autoSlideInterval = setInterval(() => {
        if (!isPaused) {
          nextSlide();
        }
      }, SLIDE_INTERVAL);
    }

    // Stop auto-slide
    function stopAutoSlide() {
      if (autoSlideInterval) {
        clearInterval(autoSlideInterval);
        autoSlideInterval = null;
      }
    }

    // Pause on hover
    carousel.addEventListener('mouseenter', () => {
      isPaused = true;
    });

    carousel.addEventListener('mouseleave', () => {
      isPaused = false;
    });

    // Touch events for mobile
    let touchStartX = 0;
    let touchEndX = 0;

    carousel.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    carousel.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      handleSwipe();
    }, { passive: true });

    function handleSwipe() {
      const swipeThreshold = 50;
      const diff = touchStartX - touchEndX;
      
      if (Math.abs(diff) > swipeThreshold) {
        if (diff > 0) {
          nextSlide();
        } else {
          prevSlide();
        }
      }
    }

    // Dot events
    dots.forEach((dot, index) => {
      dot.addEventListener('click', () => {
        showSlide(index);
        stopAutoSlide();
        startAutoSlide();
      });

      // Keyboard navigation for dots
      dot.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          showSlide(index);
          stopAutoSlide();
          startAutoSlide();
        }
      });
    });

    // Keyboard navigation (arrow keys)
    carousel.addEventListener('keydown', (e) => {
      if (document.activeElement === carousel || carousel.contains(document.activeElement)) {
        switch(e.key) {
          case 'ArrowLeft':
            e.preventDefault();
            prevSlide();
            stopAutoSlide();
            startAutoSlide();
            break;
          case 'ArrowRight':
            e.preventDefault();
            nextSlide();
            stopAutoSlide();
            startAutoSlide();
            break;
        }
      }
    });

    // Make carousel focusable for keyboard navigation
    carousel.setAttribute('tabindex', '0');
    carousel.setAttribute('role', 'region');
    carousel.setAttribute('aria-label', 'Image carousel');

    // Initialize - set first slide as active without animation
    slides[0].classList.add('active');
    lazyLoadImages();
    startAutoSlide();

    // Pause auto-slide when page is hidden (better performance)
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        stopAutoSlide();
      } else {
        startAutoSlide();
      }
    });

    // Cleanup on page unload
    window.addEventListener('beforeunload', () => {
      stopAutoSlide();
    });
  }
})();

