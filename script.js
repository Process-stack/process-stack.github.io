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

// --- UPDATED AI SOLVER LOGIC ---
const fileInput = document.getElementById('file-upload');
const statusText = document.getElementById('status');
const interactiveCard = document.getElementById('interactive-card');

if (fileInput) {
    fileInput.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (!file) return;

        statusText.innerText = "NEURAL ANALYSIS IN PROGRESS...";
        statusText.style.color = "cyan";
        interactiveCard.style.borderColor = "cyan";

        const reader = new FileReader();

        reader.onload = function(event) {
            const content = event.target.result.toLowerCase();
            
            // Simulation delay to "solve" the problem
            setTimeout(() => {
                // SOLUTION FOR QUESTION 1: Random Max Finder
                if (content.includes("question 1") || content.includes("random")) {
                    statusText.innerHTML = `
                        <span style="color: #00ff00; font-weight: bold;">✔ Q1 SOLVED: MULTITHREADED MAX</span><br>
                        <div style="text-align: left; font-size: 0.7rem; background: rgba(0,0,0,0.5); padding: 5px; border-radius: 4px; margin-top: 5px;">
                            <strong>LOGIC:</strong> Spawn <em>n</em> threads using <code>pthread_create</code>.<br>
                            <strong>TASK:</strong> Each thread generates 500 numbers via <code>rand_r()</code>.<br>
                            <strong>EXIT:</strong> Return max value using <code>pthread_exit()</code>.
                        </div>
                    `;
                } 
                // SOLUTION FOR QUESTION 3: Prime Slicing
                else if (content.includes("question 3") || content.includes("prime") || content.includes("500,000,000")) {
                    statusText.innerHTML = `
                        <span style="color: #00ff00; font-weight: bold;">✔ Q3 SOLVED: PRIME SLICING</span><br>
                        <div style="text-align: left; font-size: 0.7rem; background: rgba(0,0,0,0.5); padding: 5px; border-radius: 4px; margin-top: 5px;">
                            <strong>LOGIC:</strong> Divide range (1-500M) by <code>n</code> threads.<br>
                            <strong>TASK:</strong> Each thread checks a "slice" of the total range.<br>
                            <strong>JOIN:</strong> Main thread aggregates all prime counts.
                        </div>
                    `;
                } 
                else {
                    statusText.innerText = "SCAN COMPLETE: Assignment patterns found, but no specific Workshop 9 question detected.";
                    statusText.style.color = "yellow";
                }
                interactiveCard.style.borderColor = "#00ff00";
            }, 2000);
        };

        reader.readAsText(file); // Reads file to identify the question
    });
}

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