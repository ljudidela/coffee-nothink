import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import confetti from "canvas-confetti";

gsap.registerPlugin(ScrollTrigger);

// --- 1. COSMIC BACKGROUND CANVAS ---
const canvas = document.getElementById('cosmos');
const ctx = canvas.getContext('2d');

let width, height;
const particles = [];

function resize() {
  width = canvas.width = window.innerWidth;
  height = canvas.height = window.innerHeight;
}

class BeanParticle {
  constructor() {
    this.reset();
  }

  reset() {
    this.x = Math.random() * width;
    this.y = Math.random() * height - height; // Start above or random
    this.size = Math.random() * 3 + 1;
    this.speedY = Math.random() * 1 + 0.2;
    this.speedX = (Math.random() - 0.5) * 0.5;
    this.rotation = Math.random() * Math.PI * 2;
    this.rotationSpeed = (Math.random() - 0.5) * 0.02;
    this.opacity = Math.random() * 0.5 + 0.1;
  }

  update() {
    this.y += this.speedY;
    this.x += this.speedX;
    this.rotation += this.rotationSpeed;

    if (this.y > height) {
      this.reset();
      this.y = -10;
    }
  }

  draw() {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.rotation);
    ctx.globalAlpha = this.opacity;
    ctx.fillStyle = '#d4a373'; // Coffee bean color
    
    // Draw simplified bean shape (oval with line)
    ctx.beginPath();
    ctx.ellipse(0, 0, this.size, this.size * 0.6, 0, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.strokeStyle = 'rgba(0,0,0,0.3)';
    ctx.lineWidth = 0.5;
    ctx.beginPath();
    ctx.moveTo(-this.size * 0.8, 0);
    ctx.quadraticCurveTo(0, this.size * 0.3, this.size * 0.8, 0);
    ctx.stroke();
    
    ctx.restore();
  }
}

function initParticles() {
  for(let i = 0; i < 100; i++) {
    particles.push(new BeanParticle());
    // Distribute initially
    particles[i].y = Math.random() * height;
  }
}

function animateCanvas() {
  ctx.clearRect(0, 0, width, height);
  particles.forEach(p => {
    p.update();
    p.draw();
  });
  requestAnimationFrame(animateCanvas);
}

resize();
window.addEventListener('resize', resize);
initParticles();
animateCanvas();

// --- 2. GSAP ANIMATIONS ---

// Hero
gsap.from("#hero h1", { opacity: 0, y: 50, duration: 1.5, ease: "power3.out" });
gsap.from("#hero p", { opacity: 0, y: 30, duration: 1.5, delay: 0.3, ease: "power3.out" });
gsap.from(".btn-glow", { opacity: 0, scale: 0.8, duration: 1, delay: 0.6, ease: "elastic.out(1, 0.5)" });

// Section: Beans (Simulate filling the cup)
const beanTl = gsap.timeline({
  scrollTrigger: {
    trigger: "#beans",
    start: "top center",
    end: "bottom bottom",
    scrub: 1
  }
});

// Create DOM elements for falling beans into cup
const beanStream = document.querySelector('.bean-stream');
for(let i=0; i<20; i++) {
  const b = document.createElement('div');
  b.style.position = 'absolute';
  b.style.width = '8px';
  b.style.height = '12px';
  b.style.background = '#6f4e37';
  b.style.borderRadius = '50%';
  b.style.left = (Math.random() * 40 - 20) + 'px';
  b.style.top = -(Math.random() * 200) + 'px';
  b.classList.add('falling-bean');
  beanStream.appendChild(b);
}

// Animate falling beans
gsap.to(".falling-bean", {
  y: 300,
  rotation: 360,
  stagger: 0.05,
  scrollTrigger: {
    trigger: "#beans",
    start: "top 60%",
    end: "bottom 80%",
    scrub: true
  }
});

gsap.from(".cup", {
  y: 100,
  opacity: 0,
  duration: 1,
  scrollTrigger: {
    trigger: "#beans",
    start: "top 70%"
  }
});

// Recipes Cards Stagger
gsap.from(".card", {
  y: 100,
  opacity: 0,
  stagger: 0.2,
  duration: 0.8,
  ease: "back.out(1.7)",
  scrollTrigger: {
    trigger: "#recipes",
    start: "top 75%"
  }
});

// --- 3. FORM HANDLING & CONFETTI ---
document.getElementById('launch-form').addEventListener('submit', (e) => {
  e.preventDefault();
  const btn = document.querySelector('.btn-launch');
  
  // Launch Effect
  btn.innerHTML = "LAUNCHING... 🛸";
  
  // Confetti Explosion
  const rect = btn.getBoundingClientRect();
  const x = (rect.left + rect.width / 2) / window.innerWidth;
  const y = (rect.top + rect.height / 2) / window.innerHeight;

  confetti({
    particleCount: 150,
    spread: 70,
    origin: { x, y },
    colors: ['#d97b60', '#ffd700', '#ffffff'],
    shapes: ['circle', 'star'],
    gravity: 1.2,
    scalar: 1.2
  });

  // Reset after delay
  setTimeout(() => {
    btn.innerHTML = "LAUNCH ORDER 🚀";
    e.target.reset();
    alert("Order received! Preparing for liftoff.");
  }, 2000);
});