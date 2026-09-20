// Main Application Entry Point - 13 Pages of Love
import { initParticleEngine } from './js/particles.js';
import { initNavigation } from './js/navigation.js';
import { initEnvelope } from './js/envelope.js';
import { initPuzzle } from './js/puzzle.js';
import { setupScratchCard } from './js/scratchCard.js';
import { initGalleries } from './js/galleries.js';
import { initAudioSystem } from './js/audioPlayer.js';
import { initCouponsAndJar } from './js/couponsAndJar.js';
import { initQuiz } from './js/quiz.js';
import { initCustomizer, initLoveTimer } from './js/customizer.js';

document.addEventListener('DOMContentLoaded', () => {
  console.log("💖 Initializing 13-Page Romantic Experience...");

  // Global resilience safety net so minor runtime errors never freeze the app
  window.addEventListener('error', (e) => {
    console.warn("App warning handled:", e.message);
  });
  window.addEventListener('unhandledrejection', (e) => {
    console.warn("Unhandled promise handled:", e.reason);
  });

  const safeRun = (name, fn) => {
    try {
      fn();
    } catch (err) {
      console.warn(`[Geluu] Module '${name}' initialization warning:`, err);
    }
  };

  // 1. Canvas particle background
  safeRun('Particle Engine', () => initParticleEngine());

  // 2. Multi-Page Navigation Controller (Pages 1 to 13)
  safeRun('Navigation', () => initNavigation());

  // 3. 3D Sealed Love Envelope & Letter (Page 2)
  const defaultLetter = "My Dearest Sweetheart,\n\nFrom the moment you came into my life, every day has felt brighter, sweeter, and infinitely more meaningful for me. Your laugh is my favorite melody, and your smile is my daily inspiration.\n\nThank you for being my soulmate, my best friend, and my queen. As you get placed in my Heart and live as a Queen in my heart for forever So I created this special 13-page journey just to remind you how deeply and unconditionally I Love you and what you mean to me actually in real life.\n\nForever yours,";
  safeRun('Envelope', () => initEnvelope(defaultLetter, "Your Loving Husband"));

  // 4. Interactive Photo Jigsaw Puzzle (Page 3)
  safeRun('Puzzle', () => initPuzzle("/assets/AS1.jpeg"));

  // 5. Canvas Scratch Cards (Pages 4 & 8)
  safeRun('Scratch Card 1', () => setupScratchCard('scratch-canvas-1', 'scratch-container-1'));
  safeRun('Scratch Card 2', () => setupScratchCard('scratch-canvas-2', 'scratch-container-2'));

  // 6. 4 Distinct Photo Galleries (Pages 5, 7, 9, 11)
  safeRun('Galleries', () => initGalleries());

  // 7. Background Music & Voice Note Recorder (Page 6)
  safeRun('Audio System', () => initAudioSystem());

  // 8. Love Jar & Coupons (Pages 10 & 13)
  safeRun('Coupons & Jar', () => initCouponsAndJar());

  // 9. Interactive Love Story Quiz (Page 12)
  safeRun('Quiz', () => initQuiz());

  // 10. Live Love Anniversary Counter (Page 1)
  safeRun('Love Timer', () => initLoveTimer("2023-03-09"));

  // 11. Customizer State & Modal Hub
  safeRun('Customizer', () => initCustomizer());
});
