// project-slider.js - Coverflow Architectural Showcase

document.addEventListener("DOMContentLoaded", () => {
    const container = document.getElementById('carousel-container');
    const pagination = document.getElementById('carousel-pagination');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    
    if (!container) return;

    // --- 1. Reusable Project Data Array ---
    const projectsData = [
        {
            title: "Luxe Apartments",
            location: "Modern Living. Elevated.",
            category: "01",
            image: "assets/images/Screenshot 2026-05-20 163623.png",
            description: "A defining monument of luxury."
        },
        {
            title: "Oceanview Residences",
            location: "Coastal Modernism.",
            category: "02",
            image: "assets/images/Screenshot 2026-05-20 163634.png",
            description: "Seamless integration with the sea."
        },
        {
            title: "Skyline Towers",
            location: "Urban Verticality.",
            category: "03",
            image: "assets/images/Screenshot 2026-05-20 163644.png",
            description: "Touching the clouds."
        },
        {
            title: "Aether Eco-Tower",
            location: "Sustainable Future.",
            category: "04",
            image: "assets/images/Screenshot 2026-05-20 163654.png",
            description: "Nature meets glass."
        },
        {
            title: "The Obsidian HQ",
            location: "Commercial Core.",
            category: "05",
            image: "assets/images/Screenshot 2026-05-20 163706.png",
            description: "Power and presence."
        }
    ];

    const numCards = projectsData.length;
    let cards = [];
    let dots = [];
    
    // --- 2. Build DOM ---
    projectsData.forEach((project, i) => {
        // Card
        const card = document.createElement('div');
        card.className = 'coverflow-card';
        card.innerHTML = `
            <img src="${project.image}" alt="${project.title}">
            <div class="card-content">
                <h3>${project.title}</h3>
                <p>${project.location}</p>
                <div class="index">${project.category}</div>
            </div>
        `;
        container.appendChild(card);
        cards.push(card);

        // Dot
        const dot = document.createElement('div');
        dot.className = 'dot';
        dot.addEventListener('click', () => snapTo(i));
        pagination.appendChild(dot);
        dots.push(dot);
    });

    // --- 3. Physics & State ---
    let progress = 0; // Continuous value representing current position (0 to numCards - 1)
    let targetProgress = 0;
    
    let isDragging = false;
    let startX = 0;
    let startProgress = 0;
    
    // Auto-play
    let autoPlayTimer;
    const autoPlayDelay = 5000;

    function render() {
        // Smoothly interpolate progress towards targetProgress
        if (!isDragging) {
            progress += (targetProgress - progress) * 0.1;
        }

        cards.forEach((card, i) => {
            // Calculate distance from current continuous progress
            // Handling wrapping for infinite feel (optional, but let's stick to clamped for simplicity like the image)
            let d = i - progress; 

            // Clamp d to avoid extreme values on far cards
            const clampedD = Math.max(-2, Math.min(2, d)); 
            const absD = Math.abs(clampedD);

            // Calculate Coverflow properties
            const x = d * 60; // Spread on X axis (percentage of parent width essentially via pixel or rem)
            const scale = 1 - (absD * 0.15); // Center is 1, sides are smaller
            const rotateY = -clampedD * 25; // Tilt towards center
            const z = -absD * 100; // Push back
            const opacity = 1 - (absD * 0.4);
            const blur = absD * 4; // pixels
            const zIndex = Math.round(100 - absD * 10);

            // Apply via GSAP for performant transforms
            gsap.set(card, {
                x: `${x}%`,
                z: z,
                scale: scale,
                rotateY: rotateY,
                opacity: opacity,
                zIndex: zIndex,
                filter: `blur(${blur}px) drop-shadow(0 0 ${absD === 0 ? 30 : 0}px rgba(0,0,0,0.8))`
            });
        });

        // Update Dots
        const activeIndex = Math.round(progress);
        dots.forEach((dot, i) => {
            if (i === activeIndex) {
                dot.classList.add('active');
            } else {
                dot.classList.remove('active');
            }
        });

        // Keep loop running
        requestAnimationFrame(render);
    }

    // --- 4. Interactions ---
    function snapTo(index) {
        targetProgress = Math.max(0, Math.min(numCards - 1, index));
        resetAutoPlay();
    }

    // Buttons
    if(prevBtn) prevBtn.addEventListener('click', () => snapTo(Math.round(targetProgress) - 1));
    if(nextBtn) nextBtn.addEventListener('click', () => snapTo(Math.round(targetProgress) + 1));

    // Dragging Logic
    container.addEventListener('mousedown', dragStart);
    container.addEventListener('touchstart', dragStart, {passive: true});

    window.addEventListener('mousemove', dragMove);
    window.addEventListener('touchmove', dragMove, {passive: true});

    window.addEventListener('mouseup', dragEnd);
    window.addEventListener('touchend', dragEnd);

    function dragStart(e) {
        isDragging = true;
        startX = e.type.includes('mouse') ? e.pageX : e.touches[0].pageX;
        startProgress = progress;
        container.style.cursor = 'grabbing';
        clearTimeout(autoPlayTimer);
    }

    function dragMove(e) {
        if (!isDragging) return;
        const currentX = e.type.includes('mouse') ? e.pageX : e.touches[0].pageX;
        const diff = currentX - startX;
        
        // Convert pixel drag to progress drag (sensitivity)
        const progressDiff = diff / (window.innerWidth * 0.3); 
        
        // Clamp dragging to array bounds
        progress = Math.max(-0.5, Math.min(numCards - 0.5, startProgress - progressDiff));
        targetProgress = progress;
    }

    function dragEnd() {
        if (!isDragging) return;
        isDragging = false;
        container.style.cursor = 'grab';
        
        // Snap to nearest integer
        snapTo(Math.round(progress));
    }

    // --- 5. Auto Play ---
    function nextSlide() {
        let next = Math.round(targetProgress) + 1;
        if (next >= numCards) next = 0; // Loop back
        snapTo(next);
    }

    function resetAutoPlay() {
        clearTimeout(autoPlayTimer);
        autoPlayTimer = setTimeout(nextSlide, autoPlayDelay);
    }

    // Pause on hover
    const frame = document.querySelector('.showcase-frame');
    if (frame) {
        frame.addEventListener('mouseenter', () => clearTimeout(autoPlayTimer));
        frame.addEventListener('mouseleave', resetAutoPlay);
    }

    // --- 6. Particles ---
    const canvas = document.getElementById('particles-canvas');
    if(canvas) {
        const ctx = canvas.getContext('2d');
        let particles = [];
        
        function resizeCanvas() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }
        window.addEventListener('resize', resizeCanvas);
        resizeCanvas();

        class Particle {
            constructor() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.size = Math.random() * 2 + 0.5;
                this.speedY = Math.random() * -0.5 - 0.1; // Float up
                this.alpha = Math.random() * 0.5 + 0.1;
            }
            update() {
                this.y += this.speedY;
                if (this.y < 0) {
                    this.y = canvas.height;
                    this.x = Math.random() * canvas.width;
                }
            }
            draw() {
                ctx.fillStyle = `rgba(255, 215, 0, ${this.alpha})`; // Gold dust
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        for (let i = 0; i < 40; i++) particles.push(new Particle());

        function animateParticles() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            particles.forEach(p => { p.update(); p.draw(); });
            requestAnimationFrame(animateParticles);
        }
        animateParticles();
    }

    // Initialize
    snapTo(0);
    requestAnimationFrame(render);
});
