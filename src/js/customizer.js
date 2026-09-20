// Husband's Customization Hub & LocalStorage State Manager

import { updateLetterContent } from './envelope.js';
import { setCustomBgMusic, setCustomVoiceNote } from './audioPlayer.js';

export function initCustomizer() {
  const modal = document.getElementById('customizer-modal');
  const openBtn = document.getElementById('open-customizer-btn');
  const footerOpenBtn = document.getElementById('footer-customize-btn');
  const closeBtn = document.getElementById('close-customizer-btn');
  const saveBtn = document.getElementById('save-customizer-btn');
  const resetBtn = document.getElementById('reset-customizer-btn');

  if (!modal) return;

  // Open modal handlers
  const openModal = () => modal.classList.remove('hidden');
  const closeModal = () => modal.classList.add('hidden');

  if (openBtn) openBtn.addEventListener('click', openModal);
  if (footerOpenBtn) footerOpenBtn.addEventListener('click', openModal);
  if (closeBtn) closeBtn.addEventListener('click', closeModal);

  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  // Load existing state from localStorage
  loadSavedSettings();

  // Handle Photo File Upload previews
  setupPhotoUpload('upload-scratch-photo', 'preview-scratch-photo', 'gy_scratch_photo_1');
  setupPhotoUpload('upload-gallery-1', 'preview-gallery-1', 'gy_gallery_photo_1');

  // Handle Audio File Uploads
  setupAudioUpload('upload-bg-music', 'gy_bg_music_base64', (src) => setCustomBgMusic(src));
  setupAudioUpload('upload-voice-note', 'gy_voice_note_base64', (src) => setCustomVoiceNote(src));

  // Save Settings Click
  if (saveBtn) {
    saveBtn.addEventListener('click', () => {
      saveSettings();
      closeModal();
    });
  }

  // Reset Defaults
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      if (confirm("Reset all custom settings back to defaults?")) {
        localStorage.clear();
        window.location.reload();
      }
    });
  }
}

function safeGet(key) {
  try {
    return localStorage.getItem(key);
  } catch (e) {
    return null;
  }
}

function safeSet(key, val) {
  try {
    localStorage.setItem(key, val);
  } catch (e) {
    console.warn("Storage write skipped:", e);
  }
}

function loadSavedSettings() {
  const wifeName = safeGet('gy_wife_name') || "My Dearest Wife";
  const husbandName = safeGet('gy_husband_name') || "Your Loving Husband";
  const anniversaryDate = safeGet('gy_anniversary_date') || "2023-03-09";
  const letterBody = safeGet('gy_letter_body') || "My Love,\n\nFrom the moment you entered my life, everything became brighter, warmer, and infinitely more beautiful. Your smile is my daily inspiration, and your touch is my greatest comfort.\n\nThank you for being my soulmate, my best friend, and my queen. I love you more than words could ever convey.";
  const scratchCaption = safeGet('gy_scratch_caption') || '"Every moment spent with you is like a beautiful dream come true."';
  const defaultGeluuPromise = `Geluu, I don’t promise you a perfect life. I promise you me—my heart, my hand, and my presence, through every beautiful moment and every difficult one.\n\nI promise that no matter how many years pass, I will never stop choosing you. I will still want to hear your voice, hold your hand, make you smile, and come home to you.\n\nAnd when life changes us, when we grow old and our faces carry the story of everything we’ve been through, I promise to look at you and remember the woman who became my home.\n\nIf my heart gets one final wish at the end of my life, it will be to have your hand in mine.\n\nI found my forever in you—and I promise, with everything I am, I will spend my forever loving you.`;

  let scratchPromise = safeGet('gy_scratch_promise');
  if (!scratchPromise || !scratchPromise.includes("Geluu, I don’t promise you a perfect life")) {
    scratchPromise = defaultGeluuPromise;
    safeSet('gy_scratch_promise', defaultGeluuPromise);
  }

  // Fill input fields
  setInputValue('input-wife-name', wifeName);
  setInputValue('input-husband-name', husbandName);
  setInputValue('input-anniversary', anniversaryDate);
  setInputValue('input-letter-body', letterBody);
  setInputValue('input-scratch-caption', scratchCaption);
  setInputValue('input-scratch-promise', scratchPromise);

  // Apply to UI
  applySettingsToUI({
    wifeName,
    husbandName,
    anniversaryDate,
    letterBody,
    scratchCaption,
    scratchPromise
  });

  // Check custom photos
  const scratchPhoto1 = safeGet('gy_scratch_photo_1');
  if (scratchPhoto1) {
    const imgEl = document.getElementById('scratch-photo-1');
    const previewEl = document.getElementById('preview-scratch-photo');
    if (imgEl) imgEl.src = scratchPhoto1;
    if (previewEl) previewEl.src = scratchPhoto1;
  }

  const galleryPhoto1 = safeGet('gy_gallery_photo_1');
  if (galleryPhoto1) {
    const galleryImgs = document.querySelectorAll('.gallery-img');
    if (galleryImgs[0]) galleryImgs[0].src = galleryPhoto1;
    const previewEl = document.getElementById('preview-gallery-1');
    if (previewEl) previewEl.src = galleryPhoto1;
  }

  // Check saved audio
  const savedBgMusic = safeGet('gy_bg_music_base64');
  if (savedBgMusic) setCustomBgMusic(savedBgMusic);

  const savedVoice = safeGet('gy_voice_note_base64');
  if (savedVoice) setCustomVoiceNote(savedVoice);
}

function saveSettings() {
  const wifeName = getInputValue('input-wife-name') || "My Dearest Wife";
  const husbandName = getInputValue('input-husband-name') || "Your Loving Husband";
  const anniversaryDate = getInputValue('input-anniversary') || "2023-03-09";
  const letterBody = getInputValue('input-letter-body');
  const scratchCaption = getInputValue('input-scratch-caption');
  const scratchPromise = getInputValue('input-scratch-promise');

  safeSet('gy_wife_name', wifeName);
  safeSet('gy_husband_name', husbandName);
  safeSet('gy_anniversary_date', anniversaryDate);
  if (letterBody) safeSet('gy_letter_body', letterBody);
  if (scratchCaption) safeSet('gy_scratch_caption', scratchCaption);
  if (scratchPromise) safeSet('gy_scratch_promise', scratchPromise);

  applySettingsToUI({
    wifeName,
    husbandName,
    anniversaryDate,
    letterBody,
    scratchCaption,
    scratchPromise
  });
}

function applySettingsToUI(data) {
  const heroName = document.getElementById('wife-hero-name');
  if (heroName) heroName.textContent = `To My Dearest ${data.wifeName}`;

  const finaleWife = document.getElementById('finale-wife-name');
  if (finaleWife && data.wifeName) finaleWife.textContent = data.wifeName;

  const finaleHusband = document.getElementById('finale-husband-name');
  if (finaleHusband && data.husbandName) finaleHusband.textContent = data.husbandName;

  if (data.letterBody) {
    updateLetterContent(data.letterBody, data.husbandName);
  }

  const captionEl = document.getElementById('scratch-caption-1');
  if (captionEl && data.scratchCaption) captionEl.textContent = data.scratchCaption;

  const promiseEl = document.getElementById('scratch-text-2');
  if (promiseEl && data.scratchPromise) {
    const paragraphs = data.scratchPromise.split(/\n+/).filter(p => p.trim());
    if (paragraphs.length > 1) {
      promiseEl.innerHTML = paragraphs.map(p => `<p style="margin-bottom: 0.75rem;">${p.trim()}</p>`).join('');
    } else {
      promiseEl.textContent = data.scratchPromise;
    }
  }

  // Restart Anniversary Timer
  if (data.anniversaryDate) {
    initLoveTimer(data.anniversaryDate);
  }
}

function setInputValue(id, val) {
  const el = document.getElementById(id);
  if (el) el.value = val;
}

function getInputValue(id) {
  const el = document.getElementById(id);
  return el ? el.value : '';
}

function setupPhotoUpload(inputId, previewId, storageKey) {
  const input = document.getElementById(inputId);
  const preview = document.getElementById(previewId);

  if (!input) return;

  input.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64 = event.target.result;
        if (preview) preview.src = base64;
        try {
          localStorage.setItem(storageKey, base64);
        } catch(err) {
          alert("Image file is large for local storage. Try a smaller photo!");
        }
      };
      reader.readAsDataURL(file);
    }
  });
}

function setupAudioUpload(inputId, storageKey, callback) {
  const input = document.getElementById(inputId);
  if (!input) return;

  input.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64 = event.target.result;
        try {
          localStorage.setItem(storageKey, base64);
        } catch(err) {
          console.warn("Audio storage limit exceeded");
        }
        if (callback) callback(base64);
      };
      reader.readAsDataURL(file);
    }
  });
}

// Live Love Counter calculation
let timerInterval = null;
export function initLoveTimer(startDateStr) {
  const yearsEl = document.getElementById('timer-years');
  const daysEl = document.getElementById('timer-days');
  const hoursEl = document.getElementById('timer-hours');
  const minsEl = document.getElementById('timer-minutes');
  const secsEl = document.getElementById('timer-seconds');
  const sinceDateEl = document.getElementById('together-since-date');

  if (sinceDateEl) {
    const rawDate = startDateStr || "2023-03-09";
    const parts = rawDate.split('-');
    if (parts.length === 3) {
      const d = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
      if (!isNaN(d.getTime())) {
        sinceDateEl.textContent = d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
      } else {
        sinceDateEl.textContent = rawDate;
      }
    } else {
      sinceDateEl.textContent = rawDate;
    }
  }

  if (!daysEl || !hoursEl || !minsEl || !secsEl) return;

  const startDate = new Date(startDateStr || "2023-03-09").getTime();

  if (timerInterval) clearInterval(timerInterval);

  function updateTimer() {
    const now = new Date().getTime();
    const diff = Math.max(0, now - startDate);

    const totalSeconds = Math.floor(diff / 1000);
    const seconds = totalSeconds % 60;
    const totalMinutes = Math.floor(totalSeconds / 60);
    const minutes = totalMinutes % 60;
    const totalHours = Math.floor(totalMinutes / 60);
    const hours = totalHours % 24;
    const totalDays = Math.floor(totalHours / 24);

    const years = Math.floor(totalDays / 365);
    const days = totalDays % 365;

    if (yearsEl) yearsEl.textContent = String(years).padStart(2, '0');
    daysEl.textContent = String(days).padStart(3, '0');
    hoursEl.textContent = String(hours).padStart(2, '0');
    minsEl.textContent = String(minutes).padStart(2, '0');
    secsEl.textContent = String(seconds).padStart(2, '0');
  }

  updateTimer();
  timerInterval = setInterval(updateTimer, 1000);
}
