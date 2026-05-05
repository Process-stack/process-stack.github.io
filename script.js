const canvas = document.getElementById('canvas-bg');
const ctx = canvas.getContext('2d');
let particlesArray;

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

class Particle {
    constructor(x, y, dirX, dirY, size) {
        this.x = x;
        this.y = y;
        this.dirX = dirX;
        this.dirY = dirY;
        this.size = size;
        this.hue = Math.random() * 360; // Random starting color
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
        
        // Cycle the color slowly
        this.hue += 0.5; 
        if (this.hue > 360) this.hue = 0;
        
        this.draw();
    }
}

function initBackground() {
    particlesArray = [];
    let count = (canvas.width * canvas.height) / 12000;
    for (let i = 0; i < count; i++) {
        let size = Math.random() * 2 + 1;
        let x = Math.random() * canvas.width;
        let y = Math.random() * canvas.height;
        let dx = (Math.random() * 0.6) - 0.3;
        let dy = (Math.random() * 0.6) - 0.3;
        particlesArray.push(new Particle(x, y, dx, dy, size));
    }
}

function animate() {
    // Semi-transparent clear creates a "trail" effect
    ctx.fillStyle = 'rgba(255, 255, 255, 0.1)'; 
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    particlesArray.forEach(p => {
        p.update();
        particlesArray.forEach(p2 => {
            let dist = ((p.x - p2.x)**2) + ((p.y - p2.y)**2);
            if (dist < 20000) {
                // Lines take the color of the particle with a fade
                ctx.strokeStyle = `hsla(${p.hue}, 100%, 50%, ${1 - dist/20000})`;
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.moveTo(p.x, p.y);
                ctx.lineTo(p2.x, p2.y);
                ctx.stroke();
            }
        });
    });
    requestAnimationFrame(animate);
}

// Re-initialize on window resize
window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    initBackground();
});

initBackground();
animate();