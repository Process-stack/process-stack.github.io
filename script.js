const canvas = document.getElementById('canvas-bg');
const ctx = canvas.getContext('2d');
const cursor = document.querySelector('.cursor');
let particlesArray;

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// --- CURSOR MOVEMENT ---
window.addEventListener('mousemove', (e) => {
    cursor.style.left = e.clientX + 'px';
    cursor.style.top = e.clientY + 'px';
});

// --- AI SIMULATION LOGIC ---
const interactiveCard = document.getElementById('interactive-card');
const statusText = document.getElementById('status');

interactiveCard.addEventListener('click', () => {
    // UPDATE THIS ARRAY HERE:
    const steps = [
        "SPAWNING N THREADS...",       // Workshop 9, Q1
        "GENERATING 500 RANDOM #S...",  // Workshop 9, Q1
        "EXECUTING PTHREAD_EXIT()...",  // Workshop 9, Q1[cite: 1]
        "PTHREAD_JOIN SUCCESS!"         // Workshop 9, Q1[cite: 1]
    ];
    
    let i = 0;
    
    // This part stays the same...
    interactiveCard.style.pointerEvents = "none";
    
    const interval = setInterval(() => {
        statusText.innerText = steps[i];
        statusText.style.color = `hsla(${Math.random() * 360}, 100%, 50%, 1)`;
        i++;
        
        if (i >= steps.length) {
            clearInterval(interval);
            // Change this final message to match the assignment result
            statusText.innerText = "MAX VALUE FOUND!"; 
            statusText.style.color = "#00ff00";
            interactiveCard.style.pointerEvents = "all";
        }
    }, 600);
});
// --- BACKGROUND ANIMATION ---
class Particle {
    constructor(x, y, dirX, dirY, size) {
        this.x = x;
        this.y = y;
        this.dirX = dirX;
        this.dirY = dirY;
        this.size = size;
        this.hue = Math.random() * 360;
    }
    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${this.hue}, 100%, 50%, 0.8)`;
        ctx.fill();
    }
    update() {
        if (this.x > canvas.width || this.x < 0) this.dirX = -this.dirX;
        if (this.y > canvas.height || this.y < 0) this.dirY = -this.dirY;
        this.x += this.dirX;
        this.y += this.dirY;
        this.hue += 0.5;
        this.draw();
    }
}

function init() {
    particlesArray = [];
    let count = (canvas.width * canvas.height) / 15000;
    for (let i = 0; i < count; i++) {
        let size = Math.random() * 2 + 1;
        let x = Math.random() * canvas.width;
        let y = Math.random() * canvas.height;
        let dx = (Math.random() * 0.5) - 0.25;
        let dy = (Math.random() * 0.5) - 0.25;
        particlesArray.push(new Particle(x, y, dx, dy, size));
    }
}

function animate() {
    ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    particlesArray.forEach(p => {
        p.update();
        particlesArray.forEach(p2 => {
            let dist = ((p.x - p2.x)**2) + ((p.y - p2.y)**2);
            if (dist < 15000) {
                ctx.strokeStyle = `hsla(${p.hue}, 100%, 50%, ${1 - dist/15000})`;
                ctx.beginPath();
                ctx.moveTo(p.x, p.y);
                ctx.lineTo(p2.x, p2.y);
                ctx.stroke();
            }
        });
    });
    requestAnimationFrame(animate);
}

window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    init();
});

init();
animate();