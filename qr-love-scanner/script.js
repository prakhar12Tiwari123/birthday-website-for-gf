// DOM Elements
const slides = document.querySelectorAll('.slide');
const indicators = document.querySelectorAll('.indicator');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const replayBtn = document.getElementById('replayBtn');
const musicToggle = document.getElementById('musicToggle');
const birthdayMusic = document.getElementById('birthdayMusic');

// Current slide index
let currentSlide = 0;
let isMusicPlaying = false;

// Initialize the slideshow
function initSlideshow() {
    // Show the first slide
    showSlide(currentSlide);
    
    // Set up event listeners
    setupEventListeners();
    
    // Replace placeholder names
    replacePlaceholderNames();
}

// Show specific slide
function showSlide(index) {
    // Hide all slides
    slides.forEach(slide => {
        slide.classList.remove('active', 'previous');
    });
    
    // Update indicators
    indicators.forEach(indicator => {
        indicator.classList.remove('active');
    });
    
    // Show current slide
    slides[index].classList.add('active');
    indicators[index].classList.add('active');
    
    // Trigger animations for elements in the current slide
    triggerAnimations(index);
    
    // Update current slide index
    currentSlide = index;
    
    // Update button states
    updateButtonStates();
    
    // Create confetti on the last slide
    if (currentSlide === slides.length - 1) {
        setTimeout(() => {
            createConfetti();
        }, 500);
    }
}

// Trigger animations for elements in the current slide
function triggerAnimations(slideIndex) {
    const slide = slides[slideIndex];
    
    // Remove animation classes first, then add them after a short delay
    const animatedElements = slide.querySelectorAll('[class*="animate-"]');
    
    animatedElements.forEach(element => {
        // Remove any existing animation classes
        element.classList.remove('animate-pop', 'animate-fade-in', 'animate-slide-left', 
                                'animate-slide-right', 'animate-slide-up', 'animate-bounce');
        
        // Force reflow to restart animation
        void element.offsetWidth;
        
        // Get the original animation class
        const classes = element.className.split(' ');
        const animationClass = classes.find(cls => cls.startsWith('animate-'));
        
        // Re-add the animation class
        if (animationClass) {
            setTimeout(() => {
                element.classList.add(animationClass);
            }, 100);
        }
    });
}

// Go to next slide
function nextSlide() {
    if (currentSlide < slides.length - 1) {
        // Mark current slide as previous
        slides[currentSlide].classList.add('previous');
        
        // Show next slide
        showSlide(currentSlide + 1);
        return true;
    }
    return false;
}

// Go to previous slide
function prevSlide() {
    if (currentSlide > 0) {
        // Show previous slide
        showSlide(currentSlide - 1);
        return true;
    }
    return false;
}

// Update button states
function updateButtonStates() {
    // Hide/show previous button
    if (currentSlide === 0) {
        prevBtn.style.opacity = '0.5';
        prevBtn.style.cursor = 'not-allowed';
    } else {
        prevBtn.style.opacity = '1';
        prevBtn.style.cursor = 'pointer';
    }
    
    // Hide/show next button
    if (currentSlide === slides.length - 1) {
        nextBtn.style.opacity = '0.5';
        nextBtn.style.cursor = 'not-allowed';
    } else {
        nextBtn.style.opacity = '1';
        nextBtn.style.cursor = 'pointer';
    }
}

// Set up all event listeners
function setupEventListeners() {
    // Previous button - FIXED EVENT LISTENER
    prevBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        console.log("Prev button clicked");
        prevSlide();
    });
    
    // Next button - FIXED EVENT LISTENER
    nextBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        console.log("Next button clicked");
        nextSlide();
    });
    
    // Replay button
    if (replayBtn) {
        replayBtn.addEventListener('click', () => {
            showSlide(0);
        });
    }
    
    // Indicators
    indicators.forEach(indicator => {
        indicator.addEventListener('click', () => {
            const slideIndex = parseInt(indicator.getAttribute('data-slide'));
            showSlide(slideIndex);
        });
    });
    
    // Music toggle
    if (musicToggle) {
        musicToggle.addEventListener('click', toggleMusic);
    }
    
    // Keyboard navigation - FIXED
    document.addEventListener('keydown', (e) => {
        console.log("Key pressed:", e.key);
        if (e.key === 'ArrowLeft') {
            prevSlide();
        } else if (e.key === 'ArrowRight' || e.key === ' ') {
            nextSlide();
        } else if (e.key === 'Home') {
            showSlide(0);
        } else if (e.key === 'End') {
            showSlide(slides.length - 1);
        } else if (e.key === 'm' || e.key === 'M') {
            toggleMusic();
        }
    });
    
    // Mouse wheel navigation - FIXED
    let wheelTimeout;
    document.addEventListener('wheel', (e) => {
        clearTimeout(wheelTimeout);
        
        wheelTimeout = setTimeout(() => {
            if (e.deltaY > 0) {
                // Scrolling down - go to next slide
                nextSlide();
            } else if (e.deltaY < 0) {
                // Scrolling up - go to previous slide
                prevSlide();
            }
        }, 100);
    }, { passive: true });
    
    // Swipe support for touch devices - FIXED
    let touchStartX = 0;
    let touchEndX = 0;
    
    document.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });
    
    document.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    }, { passive: true });
    
    function handleSwipe() {
        const swipeThreshold = 50;
        
        if (touchEndX < touchStartX - swipeThreshold) {
            // Swipe left - go to next slide
            nextSlide();
        } else if (touchEndX > touchStartX + swipeThreshold) {
            // Swipe right - go to previous slide
            prevSlide();
        }
    }
    
    // Click on slide to go next (optional)
    document.querySelector('.slides-container').addEventListener('click', (e) => {
        // Only trigger if clicking directly on the slide container, not on buttons
        if (e.target.classList.contains('slides-container') || 
            e.target.classList.contains('slide-content')) {
            nextSlide();
        }
    });
}

// Toggle music playback
function toggleMusic() {
    if (isMusicPlaying) {
        birthdayMusic.pause();
        if (musicToggle) {
            musicToggle.innerHTML = '<i class="fas fa-music"></i> <span>Play Music</span>';
        }
        isMusicPlaying = false;
    } else {
        // Play music with user interaction
        const playPromise = birthdayMusic.play();
        
        if (playPromise !== undefined) {
            playPromise.then(() => {
                // Autoplay started successfully
                if (musicToggle) {
                    musicToggle.innerHTML = '<i class="fas fa-pause"></i> <span>Pause Music</span>';
                }
                isMusicPlaying = true;
            }).catch(error => {
                console.log("Autoplay prevented. User interaction required.");
                if (musicToggle) {
                    musicToggle.innerHTML = '<i class="fas fa-music"></i> <span>Click to Play</span>';
                }
            });
        }
    }
}

// Add confetti effect on final slide
function createConfetti() {
    // Check if confetti already exists
    if (document.querySelector('.confetti-container')) {
        return;
    }
    
    const confettiContainer = document.createElement('div');
    confettiContainer.className = 'confetti-container';
    confettiContainer.style.position = 'fixed';
    confettiContainer.style.top = '0';
    confettiContainer.style.left = '0';
    confettiContainer.style.width = '100%';
    confettiContainer.style.height = '100%';
    confettiContainer.style.pointerEvents = 'none';
    confettiContainer.style.zIndex = '9999';
    document.body.appendChild(confettiContainer);
    
    const emojis = ['🎉', '🎊', '🎈', '🎁', '❤️', '💖', '🥳', '🎂', '✨', '🌟'];
    
    for (let i = 0; i < 60; i++) {
        const confetti = document.createElement('div');
        confetti.style.position = 'absolute';
        confetti.style.fontSize = Math.random() * 25 + 20 + 'px';
        confetti.style.left = Math.random() * 100 + 'vw';
        confetti.style.top = '-50px';
        confetti.textContent = emojis[Math.floor(Math.random() * emojis.length)];
        confettiContainer.appendChild(confetti);
        
        // Animation
        const animation = confetti.animate([
            { transform: `translateY(0) rotate(0deg)`, opacity: 1 },
            { transform: `translateY(${window.innerHeight + 100}px) rotate(${Math.random() * 720}deg)`, opacity: 0 }
        ], {
            duration: Math.random() * 4000 + 3000,
            delay: Math.random() * 2000,
            easing: 'cubic-bezier(0.215, 0.610, 0.355, 1)'
        });
        
        // Remove confetti after animation completes
        animation.onfinish = () => {
            confetti.remove();
        };
    }
    
    // Remove container after all confetti is gone
    setTimeout(() => {
        if (confettiContainer.parentNode) {
            confettiContainer.remove();
        }
    }, 10000);
}

// Function to replace placeholder names with actual names
function replacePlaceholderNames() {
    // Replace [Her Name] with your girlfriend's name
    const herName = "My Love"; // Change this to your girlfriend's name
    const yourName = "Your Boyfriend"; // Change this to your name
    
    // Replace all instances
    const elements = document.body.querySelectorAll('*');
    elements.forEach(element => {
        if (element.childNodes.length === 1 && element.childNodes[0].nodeType === 3) {
            // Element only contains text
            element.textContent = element.textContent.replace(/\[Her Name\]/g, herName);
            element.textContent = element.textContent.replace(/\[Your Name\]/g, yourName);
        }
    });
}

// Add floating hearts animation to the background
function addFloatingHearts() {
    // Check if hearts already exist
    if (document.querySelector('.floating-hearts')) {
        return;
    }
    
    const heartsContainer = document.createElement('div');
    heartsContainer.className = 'floating-hearts';
    heartsContainer.style.position = 'fixed';
    heartsContainer.style.top = '0';
    heartsContainer.style.left = '0';
    heartsContainer.style.width = '100%';
    heartsContainer.style.height = '100%';
    heartsContainer.style.pointerEvents = 'none';
    heartsContainer.style.zIndex = '-1';
    document.body.appendChild(heartsContainer);
    
    const heartEmojis = ['❤️', '💖', '💝', '💕', '💘', '💗', '💓', '💞'];
    
    // Create floating hearts
    for (let i = 0; i < 20; i++) {
        const heart = document.createElement('div');
        heart.style.position = 'absolute';
        heart.style.fontSize = Math.random() * 30 + 20 + 'px';
        heart.style.left = Math.random() * 100 + 'vw';
        heart.style.top = '100vh';
        heart.textContent = heartEmojis[Math.floor(Math.random() * heartEmojis.length)];
        heart.style.opacity = Math.random() * 0.5 + 0.3;
        heartsContainer.appendChild(heart);
        
        // Animate the heart
        animateHeart(heart);
    }
}

function animateHeart(heart) {
    const duration = Math.random() * 15 + 20;
    const delay = Math.random() * 10;
    
    const keyframes = [
        { 
            transform: `translateY(0) rotate(0deg)`, 
            opacity: parseFloat(heart.style.opacity) 
        },
        { 
            transform: `translateY(-120vh) rotate(${Math.random() * 720}deg)`, 
            opacity: 0 
        }
    ];
    
    const options = {
        duration: duration * 1000,
        delay: delay * 1000,
        fill: 'forwards',
        easing: 'cubic-bezier(0.215, 0.610, 0.355, 1)'
    };
    
    const animation = heart.animate(keyframes, options);
    
    // When animation completes, reset and restart
    animation.onfinish = () => {
        heart.style.left = Math.random() * 100 + 'vw';
        heart.style.top = '100vh';
        setTimeout(() => {
            animateHeart(heart);
        }, 1000);
    };
}

// Initialize when the page loads
document.addEventListener('DOMContentLoaded', () => {
    console.log("Page loaded, initializing slideshow...");
    initSlideshow();
    addFloatingHearts();
    
    // Make sure buttons are visible
    if (prevBtn && nextBtn) {
        prevBtn.style.display = 'flex';
        nextBtn.style.display = 'flex';
    }
});

// Fallback initialization in case DOMContentLoaded doesn't fire
window.onload = function() {
    console.log("Window loaded");
    if (slides.length > 0 && !slides[0].classList.contains('active')) {
        initSlideshow();
        addFloatingHearts();
    }
};