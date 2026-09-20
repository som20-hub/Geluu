// Particle engine: Floating glowing hearts, rose petals, and click heart bursts

export function initParticleEngine() {
  const canvas = document.getElementById('particle-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  const particles = [];
  const maxParticles = 50;

  class Particle {
    constructor(x, y, type = 'heart') {
      this.reset(x, y, type);
    }

    reset(x, y, type) {
      this.x = x || Math.random() * width;
      this.y = y || Math.random() * height + height;
      this.size = Math.random() * 14 + 8;
      this.speedY = Math.random() * 1.2 + 0.4;
      this.speedX = Math.random() * 0.8 - 0.4;
      this.opacity = Math.random() * 0.6 + 0.3;
      this.rotation = Math.random() * Math.PI * 2;
      this.rotSpeed = (Math.random() - 0.5) * 0.03;
      this.type = type || (Math.random() > 0.4 ? 'heart' : 'petal');
      this.color = Math.random() > 0.3 ? '#ff758c' : '#ffd166';
    }

    update() {
      this.y -= this.speedY;
      this.x += Math.sin(this.y * 0.01) + this.speedX;
      this.rotation += this.rotSpeed;

      if (this.y < -30) {
        this.reset(Math.random() * width, height + 20);
      }
    }

    draw() {
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate(this.rotation);
      ctx.globalAlpha = this.opacity;

      if (this.type === 'heart') {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        const topCurveHeight = this.size * 0.3;
        ctx.moveTo(0, topCurveHeight);
        // top left curve
        ctx.bezierCurveTo(
          0, 0, 
          -this.size / 2, 0, 
          -this.size / 2, topCurveHeight
        );
        // bottom left curve
        ctx.bezierCurveTo(
          -this.size / 2, (this.size + topCurveHeight) / 2, 
          0, this.size, 
          0, this.size
        );
        // bottom right curve
        ctx.bezierCurveTo(
          0, this.size, 
          this.size / 2, (this.size + topCurveHeight) / 2, 
          this.size / 2, topCurveHeight
        );
        // top right curve
        ctx.bezierCurveTo(
          this.size / 2, 0, 
          0, 0, 
          0, topCurveHeight
        );
        ctx.closePath();
        ctx.fill();
      } else {
        // Petal shape
        ctx.fillStyle = '#ff477e';
        ctx.beginPath();
        ctx.ellipse(0, 0, this.size * 0.4, this.size * 0.8, Math.PI / 4, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.restore();
    }
  }

  // Populate initial particles
  for (let i = 0; i < maxParticles; i++) {
    particles.push(new Particle());
  }

  // Interactive mouse click heart burst
  window.addEventListener('click', (e) => {
    // Ignore clicks on buttons or modals
    if (e.target.closest('button, input, textarea, a, .modal-content')) return;

    for (let i = 0; i < 6; i++) {
      const p = new Particle(e.clientX, e.clientY, 'heart');
      p.speedY = (Math.random() - 0.5) * 4;
      p.speedX = (Math.random() - 0.5) * 4;
      particles.push(p);
      if (particles.length > 80) particles.shift();
    }
  });

  function animate() {
    ctx.clearRect(0, 0, width, height);
    particles.forEach((p) => {
      p.update();
      p.draw();
    });
    requestAnimationFrame(animate);
  }

  animate();
}
