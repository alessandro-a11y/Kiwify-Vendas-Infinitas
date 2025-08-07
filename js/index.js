document.addEventListener('DOMContentLoaded', () => {

    // 1. Interseções e animações
    // ------------------------------------------------
    const sections = document.querySelectorAll('section');
    const cards = document.querySelectorAll('.card'); // Seleção de cards e animações

    const observerOptions = {
        root: null, // view port
        rootMargin: '0px',
        threshold: 0.2 // Trigger when 20% of the element is visible
    };

    const sectionObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('in-view');
                // For staggered card animation, apply a delay to each card
                if (entry.target.id === 'o-que-e' || entry.target.classList.contains('how-to-earn')) {
                    const cardsInSection = entry.target.querySelectorAll('.card');
                    cardsInSection.forEach((card, index) => {
                        card.style.animationDelay = `${0.1 + index * 0.15}s`; // Staggered delay
                        card.classList.add('in-view'); // Add in-view to cards
                    });
                } else if (entry.target.id === 'depoimentos-reais') {
                     const testimonialsInGrid = entry.target.querySelectorAll('.depoimento');
                     testimonialsInGrid.forEach((testimonial, index) => {
                         testimonial.style.animationDelay = `${0.1 + index * 0.2}s`;
                         testimonial.classList.add('in-view'); // Add in-view to testimonials
                     });
                }
                observer.unobserve(entry.target); // Stop observing once it's in view
            }
        });
    }, observerOptions);

    // observar a seção
    sections.forEach(section => {
        sectionObserver.observe(section);
    });

    // Observe hero content separately for its slide-in animation
    const heroContent = document.querySelector('.hero-header-content');
    if (heroContent) {
        const heroObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // The CSS handles the initial slideInUp and animation-delay for hero-header-content
                    // We just need to make sure the observer adds 'in-view' if you decide to trigger other animations this way
                    // For now, the animation is directly on the element in CSS with fixed delays.
                    // If you want to use JS to trigger, you'd remove `opacity: 0; animation: slideInUp ...` from CSS
                    // and add `entry.target.classList.add('in-view');` here.
                    // Given the current CSS, the animation is already handled.
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 }); // Less threshold for hero to appear quickly
        heroObserver.observe(heroContent);
    }


    // 2. Smooth Scrolling for Anchor Links
    // ------------------------------------
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();

            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                // Scroll smoothly to the target element
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start' // Align the top of the element with the top of the viewport
                });

                // Optional: Update the URL hash without a jump
                history.pushState(null, null, targetId);
            }
        });
    });

    // 3. Dynamic Typing Effect (Optional)
    // ------------------------------------
    // This requires a specific HTML element to apply the effect.
    // Let's assume you have a <span id="typing-text"> in your H1 or P in the hero section.

    const typingTextElement = document.getElementById('typing-text');
    if (typingTextElement) {
        const texts = JSON.parse(typingTextElement.dataset.texts); // Get texts from data-texts attribute
        let textIndex = 0;
        let charIndex = 0;
        let isDeleting = false;
        const typingSpeed = 100; // milliseconds per character
        const deletingSpeed = 50; // milliseconds per character when deleting
        const pauseBeforeDelete = 2000; // milliseconds pause before starting to delete
        const pauseBeforeType = 1000; // milliseconds pause before typing next text

        function type() {
            const currentText = texts[textIndex];
            if (!isDeleting) {
                // Typing
                typingTextElement.textContent = currentText.substring(0, charIndex + 1);
                charIndex++;
                if (charIndex === currentText.length) {
                    isDeleting = true;
                    setTimeout(type, pauseBeforeDelete); // Pause before deleting
                } else {
                    setTimeout(type, typingSpeed);
                }
            } else {
                // Deleting
                typingTextElement.textContent = currentText.substring(0, charIndex - 1);
                charIndex--;
                if (charIndex === 0) {
                    isDeleting = false;
                    textIndex = (textIndex + 1) % texts.length; // Move to the next text
                    setTimeout(type, pauseBeforeType); // Pause before typing next
                } else {
                    setTimeout(type, deletingSpeed);
                }
            }
        }

        // Start the typing animation after a small delay to allow other hero animations
        setTimeout(type, 1500);
    }

    // You might also want to add a "back to top" button with smooth scroll
    const backToTopButton = document.querySelector('#back-to-top'); // Assuming you'll add an ID to a button
    if (backToTopButton) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) { // Show button after scrolling down 300px
                backToTopButton.classList.add('show');
            } else {
                backToTopButton.classList.remove('show');
            }
        });

        backToTopButton.addEventListener('click', (e) => {
            e.preventDefault();
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
});

// Helper function to check if an element is in viewport (alternative if IntersectionObserver is too complex for specific cases)
function isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

// Example of how you might trigger an animation for a single element if needed
// const myAnimatedElement = document.querySelector('.my-animated-element');
// if (myAnimatedElement) {
//     window.addEventListener('scroll', () => {
//         if (isInViewport(myAnimatedElement) && !myAnimatedElement.classList.contains('in-view')) {
//             myAnimatedElement.classList.add('in-view');
//         }
//     });
// }