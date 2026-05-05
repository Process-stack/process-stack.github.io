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

// --- NEW FUNCTIONAL AI LOGIC (Replaces Old Simulation) ---
const fileInput = document.getElementById('file-upload');
const statusText = document.getElementById('status');
const interactiveCard = document.getElementById('interactive-card');

if (fileInput) {
    fileInput.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (!file) return;

        // Feedback that the scan is starting
        statusText.innerText = "INITIALIZING NEURAL SCAN...";
        statusText.style.color = "cyan";
        interactiveCard.style.borderColor = "cyan";

        const reader = new FileReader();

        reader.onload = function(event) {
            const content = event.target.result.toLowerCase();
            
            // Simulated delay to show the "Scan" animation
            setTimeout(() => {
                // Check for Workshop 9 requirements
                if (content.includes("pthread") || content.includes("thread")) {
                    statusText.innerHTML = `
                        <span style="color: #00ff00; font-weight: bold;">✔ THREAD LOGIC DETECTED</span><br>
                        <small>Requirement: Spawn n threads</small><br>
                        <small>Function: pthread_exit & join</small>
                    `;
                    interactiveCard.style.borderColor = "#00ff00";
                } else if (content.includes("prime") || content.includes("slicing")) {
                    statusText.innerHTML = `
                        <span style="color: #00ff00; font-weight: bold;">✔ ALGORITHM DETECTED</span><br>
                        <small>Task: Prime Slicing</small><br>
                        <small>Range: 1 to 500M</small>
                    `;
                    interactiveCard.style.borderColor = "#00ff00";
                } else {
                    statusText.innerText = "SCAN COMPLETE: No multithreading patterns found.";
                    statusText.style.color = "yellow";
                    interactiveCard.style.borderColor = "yellow";
                }
            }, 1500);
        };

        reader.readAsText(file); // Reads file content for keyword detection
    });
}

// --- BACKGROUND ANIMATION (Preserved) ---
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