document.addEventListener('DOMContentLoaded', () => {
    // Agora o seletor `'.section'` vai encontrar todas as seções, incluindo a nova.
    const sections = document.querySelectorAll('.section'); 

    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.2 
    };

    const observerCallback = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('in-view');
                observer.unobserve(entry.target); 
            }
        });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    sections.forEach(section => {
        observer.observe(section);
    });
});