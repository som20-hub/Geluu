// HTML5 Canvas Scratch Card Engine with ResizeObserver & Touch Support
import confetti from 'canvas-confetti';

export function setupScratchCard(canvasId, containerId, onComplete) {
  const canvas = document.getElementById(canvasId);
  const container = document.getElementById(containerId);
  if (!canvas || !container) return;

  const ctx = canvas.getContext('2d');
  let isScratching = false;
  let isCompleted = false;

  // Adjust container aspect ratio to match inner revealed photo if present
  const imgEl = container.querySelector('img');
  if (imgEl) {
    const adjustImageAspect = () => {
      const img = new Image();
      img.src = imgEl.src;
      const applyAspect = (w, h) => {
        if (w && h) {
          const aspect = w / h;
          container.style.aspectRatio = `${w} / ${h}`;
          const cardParent = container.closest('.single-scratch') || container.closest('.scratch-card-box');
          if (cardParent) {
            if (aspect < 0.8) {
              cardParent.style.maxWidth = '380px';
            } else if (aspect > 1.3) {
              cardParent.style.maxWidth = '560px';
            } else {
              cardParent.style.maxWidth = '440px';
            }
          }
        }
        resizeCanvas();
      };
      if (img.complete && img.naturalWidth) {
        applyAspect(img.naturalWidth, img.naturalHeight);
      } else {
        img.onload = () => applyAspect(img.naturalWidth, img.naturalHeight);
      }
    };
    adjustImageAspect();
  }

  function resizeCanvas() {
    if (isCompleted) return;
    const rect = container.getBoundingClientRect();
    const width = container.clientWidth || rect.width || 350;
    const height = container.clientHeight || rect.height || 280;

    if (width > 0 && height > 0 && (canvas.width !== width || canvas.height !== height)) {
      canvas.width = width;
      canvas.height = height;
      drawScratchCover();
    }
  }

  function drawScratchCover() {
    if (!canvas.width || !canvas.height) return;
    ctx.globalCompositeOperation = 'source-over';

    // Elegant gradient rose gold overlay
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, '#e8a598');
    gradient.addColorStop(0.5, '#ffcad4');
    gradient.addColorStop(1, '#ff758c');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Decorative sparkling heart pattern
    ctx.fillStyle = 'rgba(255, 255, 255, 0.25)';
    for (let i = 0; i < canvas.width; i += 25) {
      for (let j = 0; j < canvas.height; j += 25) {
        ctx.beginPath();
        ctx.arc(i + 12, j + 12, 3, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // Text on scratch surface
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 16px "Inter", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.shadowColor = 'rgba(0,0,0,0.5)';
    ctx.shadowBlur = 4;
    ctx.fillText('✨ Scratch Here With Mouse/Finger ✨', canvas.width / 2, canvas.height / 2);
  }

  // Use ResizeObserver to auto-size when container becomes visible
  if (window.ResizeObserver) {
    const observer = new ResizeObserver(() => {
      resizeCanvas();
    });
    observer.observe(container);
  }

  // Window resize fallback
  window.addEventListener('resize', resizeCanvas);

  // Initial attempt
  resizeCanvas();

  // Scratch action
  function scratch(x, y) {
    if (isCompleted || !canvas.width || !canvas.height) return;

    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();
    ctx.arc(x, y, 25, 0, Math.PI * 2);
    ctx.fill();

    checkScratchPercentage();
  }

  function getPointerPos(e) {
    const rect = canvas.getBoundingClientRect();
    let clientX, clientY;
    if (e.touches && e.touches.length > 0) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }
    return {
      x: clientX - rect.left,
      y: clientY - rect.top
    };
  }

  // Mouse Events
  canvas.addEventListener('mousedown', (e) => {
    e.preventDefault();
    if (canvas.width === 0 || canvas.height === 0) resizeCanvas();
    isScratching = true;
    const pos = getPointerPos(e);
    scratch(pos.x, pos.y);
  });

  window.addEventListener('mousemove', (e) => {
    if (!isScratching) return;
    const pos = getPointerPos(e);
    scratch(pos.x, pos.y);
  });

  window.addEventListener('mouseup', () => {
    isScratching = false;
  });

  // Touch Events for Mobile
  canvas.addEventListener('touchstart', (e) => {
    e.preventDefault();
    if (canvas.width === 0 || canvas.height === 0) resizeCanvas();
    isScratching = true;
    const pos = getPointerPos(e);
    scratch(pos.x, pos.y);
  }, { passive: false });

  canvas.addEventListener('touchmove', (e) => {
    e.preventDefault();
    if (!isScratching) return;
    const pos = getPointerPos(e);
    scratch(pos.x, pos.y);
  }, { passive: false });

  canvas.addEventListener('touchend', () => {
    isScratching = false;
  });

  function checkScratchPercentage() {
    if (isCompleted || !canvas || canvas.width <= 0 || canvas.height <= 0) return;

    try {
      const w = Math.floor(canvas.width);
      const h = Math.floor(canvas.height);
      if (w <= 0 || h <= 0) return;
      const imgData = ctx.getImageData(0, 0, w, h);
      let transparentCount = 0;
      const step = 8;
      let totalSampled = 0;

      for (let x = 0; x < canvas.width; x += step) {
        for (let y = 0; y < canvas.height; y += step) {
          totalSampled++;
          const index = (y * canvas.width + x) * 4;
          if (imgData.data[index + 3] === 0) {
            transparentCount++;
          }
        }
      }

      if (totalSampled > 0) {
        const percent = (transparentCount / totalSampled) * 100;
        if (percent > 40 && !isCompleted) {
          isCompleted = true;
          canvas.style.transition = 'opacity 0.6s ease';
          canvas.style.opacity = '0';
          setTimeout(() => {
            canvas.style.display = 'none';
          }, 600);

          confetti({
            particleCount: 90,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#ff758c', '#ffd166', '#ff477e', '#ffffff']
          });

          if (onComplete) onComplete();
        }
      }
    } catch(err) {
      console.warn("Scratch percentage error", err);
    }
  }
}
