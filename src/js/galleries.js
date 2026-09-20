// 4 Distinct Romantic Photo Gallery Styles

export function initGalleries() {
  initPolaroidGallery();
  initFilmStripGallery();
  initHeartCollageGallery();
  initCarousel3D();
}

// Style 1: Vintage Floating Polaroids
function initPolaroidGallery() {
  const polaroids = document.querySelectorAll('.polaroid-card');
  polaroids.forEach((card) => {
    card.addEventListener('click', () => {
      card.classList.toggle('flipped');
    });
  });
}

// Style 2: Cinema Film Strip Reel
function initFilmStripGallery() {
  const container = document.querySelector('.film-strip-reel');
  const prevBtn = document.getElementById('film-prev-btn');
  const nextBtn = document.getElementById('film-next-btn');

  if (!container) return;

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      container.scrollBy({ left: -320, behavior: 'smooth' });
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      container.scrollBy({ left: 320, behavior: 'smooth' });
    });
  }
}

// Style 3: Heart Shaped Collage
function initHeartCollageGallery() {
  const items = document.querySelectorAll('.heart-photo-item');
  items.forEach((item) => {
    item.addEventListener('mouseenter', () => {
      item.style.zIndex = '20';
    });
    item.addEventListener('mouseleave', () => {
      item.style.zIndex = '1';
    });
  });
}

// Style 4: 3D Rotating Memory Carousel
let currentCarouselAngle = 0;

export function updateCarousel3DLayout() {
  const spinner = document.getElementById('carousel-3d-spinner');
  if (!spinner) return;

  const cards = spinner.children;
  const count = cards.length;
  if (count === 0) return;

  const angleStep = 360 / count;
  const cardWidth = window.innerWidth < 600 ? 200 : 250;
  const tz = Math.round((cardWidth / 2) / Math.tan(Math.PI / count)) + 30;

  Array.from(cards).forEach((card, idx) => {
    const angle = idx * angleStep;
    card.style.transform = `rotateY(${angle}deg) translateZ(${tz}px)`;
  });
}

function initCarousel3D() {
  const spinner = document.getElementById('carousel-3d-spinner');
  const stage = document.querySelector('.carousel-3d-stage');
  const prevBtn = document.getElementById('carousel-prev-btn');
  const nextBtn = document.getElementById('carousel-next-btn');

  if (!spinner) return;

  updateCarousel3DLayout();

  const getStep = () => {
    const count = spinner.children.length || 8;
    return 360 / count;
  };

  const rotate = (angleChange) => {
    currentCarouselAngle += angleChange;
    spinner.style.transform = `rotateY(${currentCarouselAngle}deg)`;
  };

  if (prevBtn) {
    prevBtn.addEventListener('click', (e) => {
      e.preventDefault();
      rotate(getStep());
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', (e) => {
      e.preventDefault();
      rotate(-getStep());
    });
  }

  // Touch and Mouse Drag spinning
  let isDragging = false;
  let startX = 0;

  const handleStart = (clientX) => {
    isDragging = true;
    startX = clientX;
    spinner.style.transition = 'none';
  };

  const handleMove = (clientX) => {
    if (!isDragging) return;
    const deltaX = clientX - startX;
    startX = clientX;
    currentCarouselAngle += deltaX * 0.5;
    spinner.style.transform = `rotateY(${currentCarouselAngle}deg)`;
  };

  const handleEnd = () => {
    if (!isDragging) return;
    isDragging = false;
    spinner.style.transition = 'transform 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
  };

  if (stage) {
    stage.addEventListener('mousedown', (e) => handleStart(e.clientX));
    window.addEventListener('mousemove', (e) => handleMove(e.clientX));
    window.addEventListener('mouseup', handleEnd);

    stage.addEventListener('touchstart', (e) => {
      if (e.touches.length > 0) handleStart(e.touches[0].clientX);
    }, { passive: true });

    window.addEventListener('touchmove', (e) => {
      if (e.touches.length > 0) handleMove(e.touches[0].clientX);
    }, { passive: true });

    window.addEventListener('touchend', handleEnd);
  }

  // Recalculate on window resize
  window.addEventListener('resize', updateCarousel3DLayout);
}
