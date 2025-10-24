document.addEventListener('DOMContentLoaded', function() {
    console.log('Комикс загружен!'); // Для проверки
    
    const frames = document.querySelectorAll('.comic-frame');
    let lastScrollY = window.scrollY;
    let ticking = false;

    function updateFrames() {
        const currentScrollY = window.scrollY;
        const scrollDirection = currentScrollY > lastScrollY ? 'down' : 'up';
        
        frames.forEach((frame, index) => {
            const frameTop = frame.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;
            
            if (scrollDirection === 'down') {
                if (frameTop < windowHeight * 0.8) {
                    frame.classList.add('active');
                    frame.classList.remove('fade-out');
                } else {
                    frame.classList.remove('active');
                }
            }
            
            if (scrollDirection === 'up') {
                if (frameTop > windowHeight * 0.3) {
                    frame.classList.add('fade-out');
                } else {
                    frame.classList.remove('fade-out');
                }
            }
        });
        
        lastScrollY = currentScrollY;
        ticking = false;
    }

    function onScroll() {
        if (!ticking) {
            requestAnimationFrame(updateFrames);
            ticking = true;
        }
    }

    window.addEventListener('scroll', onScroll);
    frames[0].classList.add('active');
});