// animations.js - GSAP ScrollTrigger Logic

if (typeof gsap !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);

    document.addEventListener("DOMContentLoaded", () => {
        // 1. Hero Parallax (Index & Subpages)
        const heroBg = document.querySelector('.hero-bg') || document.querySelector('.page-header::before');
        if (heroBg && document.querySelector('.hero')) {
            gsap.to('.hero-bg', {
                yPercent: 30,
                ease: "none",
                scrollTrigger: {
                    trigger: ".hero",
                    start: "top top",
                    end: "bottom top",
                    scrub: true
                }
            });
        }

        // 2. Reveal Animations
        // gs_reveal: Fades and slides up slightly
        gsap.utils.toArray('.gs_reveal').forEach(function(elem) {
            ScrollTrigger.create({
                trigger: elem,
                start: "top 85%",
                onEnter: function() {
                    gsap.fromTo(elem, 
                        { y: 50, autoAlpha: 0 }, 
                        { duration: 1.2, y: 0, autoAlpha: 1, ease: "power3.out", overwrite: "auto" }
                    );
                }
            });
        });

        // 3. Counter Animation
        const counters = document.querySelectorAll('.counter');
        counters.forEach(counter => {
            ScrollTrigger.create({
                trigger: counter,
                start: "top 85%",
                once: true,
                onEnter: () => {
                    const target = +counter.getAttribute('data-target');
                    gsap.to(counter, {
                        innerHTML: target,
                        duration: 2,
                        snap: { innerHTML: 1 },
                        ease: "power2.inOut"
                    });
                }
            });
        });
        
        // 4. Custom Cursor or Magnetic buttons (Optional advanced feel)
        const magneticBtns = document.querySelectorAll('.btn-primary, .btn-secondary');
        magneticBtns.forEach(btn => {
            btn.addEventListener('mousemove', (e) => {
                const rect = btn.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;
                gsap.to(btn, { x: x * 0.2, y: y * 0.2, duration: 0.3, ease: 'power2.out' });
            });
            btn.addEventListener('mouseleave', () => {
                gsap.to(btn, { x: 0, y: 0, duration: 0.7, ease: 'elastic.out(1, 0.3)' });
            });
        });
    });
}
