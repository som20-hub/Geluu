// Love Jar Notes & Interactive Newspaper Gazette
import confetti from 'canvas-confetti';

const defaultLoveNotes = [
  "You make my heart smile every single day.",
  "I love the way your eyes sparkle when you laugh.",
  "You are my safest home and my happiest adventure.",
  "Your kindness and warmth inspire me to be a better man every day.",
  "I still get butterflies every time you walk into the room.",
  "Holding your hand is my favorite place in the entire world.",
  "You are the most beautiful person I have ever known, inside and out.",
  "No matter how hard my day gets, coming home to you makes everything right.",
  "Thank you for loving me unconditionally.",
  "My love for you grows stronger with every single sunrise.",
  "You are my dream come true, my today, and all of my tomorrows.",
  "Your laughter is the sweetest melody my ears have ever heard.",
  "I love your gentle heart and the way you care for everyone around you.",
  "With you, even the simplest moments turn into golden memories.",
  "You are my queen, my soulmate, and my best friend for life.",
  "Your warm hugs can heal any bad day in a second.",
  "Out of 8 billion people on Earth, finding you was my life's greatest miracle.",
  "I love the way you look at me with so much love in your eyes.",
  "Everything is sweeter and brighter when I share it with you.",
  "You make our house feel like a warm, loving home.",
  "I love how passionate and strong you are about the things you care about.",
  "You are my anchor in the storm and my sunshine after the rain.",
  "I cherish every single hug, kiss, and quiet moment we share.",
  "Your intelligence, grace, and beauty leave me speechless every day.",
  "I promise to love, protect, and cherish you for all of eternity.",
  "You bring out the absolute best version of me.",
  "Every love story is special, but ours is my absolute favorite.",
  "If I had to live my life over again, I would find you even sooner.",
  "You are the beat in my heart and the peace in my soul.",
  "I loved you yesterday, I love you still, I always have, I always will."
];

let drawnCount = 0;
const drawnHistory = [];

export function initCouponsAndJar() {
  initLoveJar();
}

function initLoveJar() {
  const drawBtn = document.getElementById('draw-note-btn');
  const jarEl = document.getElementById('glass-jar');
  const jarLid = document.getElementById('jar-lid-top') || document.querySelector('.jar-lid');
  const display = document.getElementById('love-note-display');
  const noteText = document.getElementById('note-text');
  const counterEl = document.getElementById('jar-counter-text');
  const historyList = document.getElementById('drawn-history-list');
  const newspaperModal = document.getElementById('love-newspaper-modal');
  const closeNewspaperBtn = document.getElementById('close-newspaper-btn');

  if (!drawBtn || !display || !noteText) return;

  function pullNote() {
    // Shake jar & pop lid animation
    if (jarEl) {
      jarEl.classList.add('shake-jar');
      setTimeout(() => jarEl.classList.remove('shake-jar'), 500);
    }
    if (jarLid) {
      jarLid.classList.add('lid-pop');
      setTimeout(() => jarLid.classList.remove('lid-pop'), 600);
    }

    // Get random note
    const unusedNotes = defaultLoveNotes.filter(n => !drawnHistory.includes(n));
    const pool = unusedNotes.length > 0 ? unusedNotes : defaultLoveNotes;
    const randomNote = pool[Math.floor(Math.random() * pool.length)];

    drawnHistory.push(randomNote);
    drawnCount++;

    // Display note with animation
    noteText.textContent = `"${randomNote}"`;
    display.classList.remove('hidden');

    if (counterEl) {
      counterEl.textContent = `✨ Note #${drawnCount} Drawn • Tap to pull another! ✨`;
    }

    // Add to history list UI
    if (historyList) {
      const historyItem = document.createElement('div');
      historyItem.className = 'history-note-item';
      historyItem.innerHTML = `<span class="history-heart">💖</span> "${randomNote}"`;
      historyList.prepend(historyItem);

      const historySection = document.getElementById('jar-history-section');
      if (historySection) historySection.classList.remove('hidden');
    }

    // Confetti Fireworks Burst!
    confetti({
      particleCount: 45,
      spread: 60,
      origin: { y: 0.75 },
      colors: ['#ff758c', '#ffd166', '#ff477e', '#ffffff']
    });
  }

  function openLoveNewspaper() {
    if (jarEl) {
      jarEl.classList.add('shake-jar');
      setTimeout(() => jarEl.classList.remove('shake-jar'), 800);
    }
    if (jarLid) {
      jarLid.classList.add('lid-pop');
      setTimeout(() => jarLid.classList.remove('lid-pop'), 1200);
    }

    if (newspaperModal) {
      newspaperModal.classList.remove('hidden');
      newspaperModal.classList.remove('newspaper-emerging');
      // Trigger reflow to restart slow unrolling animation cleanly
      void newspaperModal.offsetWidth;
      newspaperModal.classList.add('newspaper-emerging');
      newspaperModal.scrollTop = 0;
    }

    setTimeout(() => {
      confetti({
        particleCount: 90,
        spread: 100,
        origin: { y: 0.5 },
        colors: ['#ffd166', '#ff758c', '#ff477e', '#ffffff']
      });
    }, 600);
  }

  function closeLoveNewspaper() {
    if (newspaperModal) {
      newspaperModal.classList.remove('newspaper-emerging');
      newspaperModal.classList.add('hidden');
    }
  }

  if (newspaperModal) {
    newspaperModal.addEventListener('click', (e) => {
      if (e.target === newspaperModal) {
        closeLoveNewspaper();
      }
    });
  }

  // Event Listeners
  if (jarLid) {
    jarLid.addEventListener('click', (e) => {
      e.stopPropagation();
      openLoveNewspaper();
    });
  }

  if (closeNewspaperBtn) {
    closeNewspaperBtn.addEventListener('click', () => {
      closeLoveNewspaper();
    });
  }

  drawBtn.addEventListener('click', pullNote);
  if (jarEl) {
    jarEl.addEventListener('click', (e) => {
      // If click was on lid or lid badge, open newspaper; otherwise pull single note
      if (e.target.closest('#jar-lid-top') || e.target.closest('.jar-lid') || e.target.closest('.lid-newspaper-badge')) {
        openLoveNewspaper();
        return;
      }
      pullNote();
    });
  }
}
