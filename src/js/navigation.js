// Multi-Page Screen Navigation Controller (13 Pages)
import { updateCarousel3DLayout } from './galleries.js';
import confetti from 'canvas-confetti';

let currentPage = 1;
const totalPages = 13;

export function initNavigation() {
  updatePageVisibility();

  // Next page buttons with custom dataset action
  document.addEventListener('click', (e) => {
    const nextBtn = e.target.closest('[data-next-page]');
    if (nextBtn) {
      const target = nextBtn.getAttribute('data-next-page');
      if (target === 'next') {
        goToPage(currentPage + 1);
      } else {
        goToPage(parseInt(target));
      }
    }

    const prevBtn = e.target.closest('[data-prev-page]');
    if (prevBtn) {
      goToPage(currentPage - 1);
    }
  });

  // Drawer / Menu toggles
  const menuBtn = document.getElementById('nav-menu-btn');
  const drawer = document.getElementById('nav-drawer');
  const closeDrawerBtn = document.getElementById('close-drawer-btn');

  if (menuBtn && drawer) {
    menuBtn.addEventListener('click', () => drawer.classList.remove('hidden'));
  }
  if (closeDrawerBtn && drawer) {
    closeDrawerBtn.addEventListener('click', () => drawer.classList.add('hidden'));
  }

  // Drawer item clicks
  const drawerLinks = document.querySelectorAll('.drawer-link');
  drawerLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const pageNum = parseInt(e.currentTarget.getAttribute('data-page'));
      if (pageNum) {
        goToPage(pageNum);
        if (drawer) drawer.classList.add('hidden');
      }
    });
  });

  // Page 13 Crystal Heart Interactive Listener & Thank You Modal
  const crystalHeart = document.getElementById('crystal-heart-btn');
  const secretMsg = document.getElementById('crystal-secret-message');
  const thankyouModal = document.getElementById('thankyou-modal');
  const thankyouReplayBtn = document.getElementById('thankyou-replay-btn');
  const thankyouCloseBtn = document.getElementById('thankyou-close-btn');

  if (crystalHeart) {
    crystalHeart.addEventListener('click', () => {
      if (secretMsg) secretMsg.classList.remove('hidden');
      confetti({
        particleCount: 120,
        spread: 90,
        origin: { y: 0.6 },
        colors: ['#ff758c', '#ffd166', '#ff477e', '#ffffff']
      });

      // Show Thank You modal in the middle of the screen after 1s delay
      setTimeout(() => {
        if (thankyouModal) {
          thankyouModal.classList.remove('hidden');
          confetti({
            particleCount: 150,
            spread: 100,
            origin: { y: 0.5 },
            colors: ['#ffd166', '#ff758c', '#ffffff']
          });
        }
      }, 1000);
    });
  }

  if (thankyouReplayBtn) {
    thankyouReplayBtn.addEventListener('click', () => {
      if (thankyouModal) thankyouModal.classList.add('hidden');
      goToPage(1);
    });
  }

  if (thankyouCloseBtn) {
    thankyouCloseBtn.addEventListener('click', () => {
      if (thankyouModal) thankyouModal.classList.add('hidden');
    });
  }
}

export function goToPage(pageNum) {
  if (pageNum < 1) pageNum = 1;
  if (pageNum > totalPages) pageNum = totalPages;

  currentPage = pageNum;
  updatePageVisibility();

  if (currentPage === 13) {
    confetti({
      particleCount: 140,
      spread: 100,
      origin: { y: 0.5 },
      colors: ['#ff758c', '#ffd166', '#ff477e', '#ffffff']
    });
  }

  // Scroll smoothly to top of main container
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function updatePageVisibility() {
  const pages = document.querySelectorAll('.page-screen');
  pages.forEach((page, idx) => {
    const pageNum = idx + 1;
    if (pageNum === currentPage) {
      page.classList.remove('hidden');
      page.classList.add('active-page');
    } else {
      page.classList.add('hidden');
      page.classList.remove('active-page');
    }
  });

  // Update Header Progress Bar
  const stepText = document.getElementById('nav-step-text');
  const progressBar = document.getElementById('nav-progress-fill');

  if (stepText) stepText.textContent = `Page ${currentPage} of ${totalPages}`;
  if (progressBar) {
    const pct = (currentPage / totalPages) * 100;
    progressBar.style.width = `${pct}%`;
  }

  // Dispatch resize event so canvas elements and 3D carousel calculate correct width/height on page display
  setTimeout(() => {
    window.dispatchEvent(new Event('resize'));
    updateCarousel3DLayout();
  }, 50);
}
