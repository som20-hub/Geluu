// Romantic Background Music Engine & Voice Note Player

let bgAudioEl = null;
let voiceAudioEl = null;
let audioCtx = null;
let isSynthesizerPlaying = false;
let synthInterval = null;
let isBgMusicActive = false;
let wasBgMusicPlayingBeforeVoice = false;

export function initAudioSystem() {
  bgAudioEl = document.getElementById('bg-audio');
  voiceAudioEl = document.getElementById('voice-audio');

  const voiceQuickBtn = document.getElementById('voice-note-play-btn');
  const mainVoicePlayBtn = document.getElementById('main-voice-play-btn');
  const voiceSeekBar = document.getElementById('voice-seek-bar');
  const voicePlayIcon = document.getElementById('voice-play-icon');
  const voiceStatus = document.getElementById('voice-status');

  const musicToggleBtn = document.getElementById('music-toggle-btn');
  const musicIcon = document.getElementById('music-icon');
  const musicText = document.getElementById('music-text');

  if (musicToggleBtn) {
    musicToggleBtn.addEventListener('click', () => {
      if (bgAudioEl) {
        if (bgAudioEl.paused) {
          playBgMusic().then(() => {
            if (musicIcon) musicIcon.textContent = '🎶';
            if (musicText) musicText.textContent = 'Music On';
          });
        } else {
          pauseBgMusic();
          if (musicIcon) musicIcon.textContent = '🔇';
          if (musicText) musicText.textContent = 'Muted';
        }
      }
    });
  }

  // Attempt Autoplay Background Music on load + user interaction fallback
  attemptAutoPlayMusic();

  // Voice Note Event Listeners: Auto-pause background music on voice play, auto-resume on finish/pause
  if (voiceAudioEl) {
    voiceAudioEl.addEventListener('play', () => {
      pauseBgMusicForVoice();
    });

    voiceAudioEl.addEventListener('pause', () => {
      if (voiceAudioEl.ended || voiceAudioEl.paused) {
        resumeBgMusicAfterVoice();
      }
    });

    voiceAudioEl.addEventListener('ended', () => {
      if (voicePlayIcon) voicePlayIcon.textContent = '▶';
      if (voiceStatus) voiceStatus.textContent = 'Playback finished ❤️';
      stopVisualizer();
      resumeBgMusicAfterVoice();
    });

    voiceAudioEl.addEventListener('timeupdate', () => {
      if (voiceAudioEl.duration) {
        const pct = (voiceAudioEl.currentTime / voiceAudioEl.duration) * 100;
        if (voiceSeekBar) voiceSeekBar.value = pct;
        updateTimeDisplays(voiceAudioEl.currentTime, voiceAudioEl.duration);
      }
    });
  }

  // Quick Voice Play button (Page 6 scroll & play)
  if (voiceQuickBtn) {
    voiceQuickBtn.addEventListener('click', () => {
      const voiceSection = document.getElementById('voice-section');
      if (voiceSection) {
        voiceSection.scrollIntoView({ behavior: 'smooth' });
      }
      playVoiceNote();
    });
  }

  // Main Voice Note Play button
  if (mainVoicePlayBtn) {
    mainVoicePlayBtn.addEventListener('click', () => {
      toggleVoiceNote();
    });
  }

  if (voiceSeekBar) {
    voiceSeekBar.addEventListener('input', () => {
      if (voiceAudioEl && voiceAudioEl.duration) {
        voiceAudioEl.currentTime = (voiceSeekBar.value / 100) * voiceAudioEl.duration;
      }
    });
  }

  generateVisualizerBars();
}

// Automatically start background music on page load, with interaction fallback for browser autoplay rules
function attemptAutoPlayMusic() {
  const tryStartAudio = () => {
    if (!bgAudioEl) return;
    
    // Attempt play
    const promise = bgAudioEl.play();
    if (promise !== undefined) {
      promise.then(() => {
        isBgMusicActive = true;
        console.log("🎵 Background music playing automatically!");
      }).catch(() => {
        console.log("🎵 Autoplay waiting for user tap/click...");
      });
    }
  };

  // 1. Try immediate autoplay
  tryStartAudio();

  // 2. Attach global one-time interaction handler on document & window for instant playback on first tap/click/keydown/scroll
  const unlockAudio = () => {
    if (bgAudioEl && bgAudioEl.paused) {
      bgAudioEl.play().then(() => {
        isBgMusicActive = true;
        console.log("🎵 Background music started on user interaction!");
      }).catch(err => console.warn("Audio unlock failed:", err));
    }

    // Clean up event listeners after unlocking
    ['click', 'touchstart', 'pointerdown', 'keydown', 'scroll'].forEach(evt => {
      window.removeEventListener(evt, unlockAudio);
      document.removeEventListener(evt, unlockAudio);
    });
  };

  ['click', 'touchstart', 'pointerdown', 'keydown', 'scroll'].forEach(evt => {
    window.addEventListener(evt, unlockAudio, { once: true });
    document.addEventListener(evt, unlockAudio, { once: true });
  });
}

export function playBgMusic() {
  isBgMusicActive = true;
  if (bgAudioEl && bgAudioEl.src) {
    return bgAudioEl.play().catch(err => {
      console.warn("playBgMusic blocked:", err);
    });
  }
}

export function pauseBgMusic() {
  isBgMusicActive = false;
  if (bgAudioEl && !bgAudioEl.paused) {
    bgAudioEl.pause();
  }
  stopAmbientSynth();
}

function pauseBgMusicForVoice() {
  wasBgMusicPlayingBeforeVoice = isBgMusicActive;
  pauseBgMusic();
}

function resumeBgMusicAfterVoice() {
  if (wasBgMusicPlayingBeforeVoice) {
    playBgMusic();
  }
}

export function setCustomBgMusic(src) {
  if (bgAudioEl) {
    bgAudioEl.src = src;
    playBgMusic();
  }
}

export function setCustomVoiceNote(src) {
  if (voiceAudioEl) {
    voiceAudioEl.src = src;
    const voiceCardTitle = document.getElementById('voice-card-title');
    if (voiceCardTitle) voiceCardTitle.textContent = "Your Special Voice Note";
  }
}

// Web Audio API Synthesizer (Fallback procedural chords if no audio file is provided)
function startAmbientSynth() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }

  isSynthesizerPlaying = true;
  const notes = [261.63, 329.63, 392.00, 493.88, 523.25]; // C4, E4, G4, B4, C5
  let idx = 0;

  function playChord() {
    if (!isSynthesizerPlaying) return;
    const freq = notes[idx % notes.length];
    idx++;

    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, audioCtx.currentTime);

    gain.gain.setValueAtTime(0.01, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.12, audioCtx.currentTime + 1);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 3.5);

    osc.connect(gain);
    gain.connect(audioCtx.destination);

    osc.start();
    osc.stop(audioCtx.currentTime + 3.6);
  }

  playChord();
  synthInterval = setInterval(playChord, 2200);
}

function stopAmbientSynth() {
  isSynthesizerPlaying = false;
  if (synthInterval) clearInterval(synthInterval);
}

// Voice Note Controls
function toggleVoiceNote() {
  const voicePlayIcon = document.getElementById('voice-play-icon');
  const voiceStatus = document.getElementById('voice-status');

  if (!voiceAudioEl || (!voiceAudioEl.src && !voiceAudioEl.currentSrc)) {
    if (voiceStatus) voiceStatus.textContent = "Add a voice note file in code to play! ✨";
    return;
  }

  if (voiceAudioEl.paused) {
    playVoiceNote();
  } else {
    voiceAudioEl.pause();
    if (voicePlayIcon) voicePlayIcon.textContent = '▶';
    if (voiceStatus) voiceStatus.textContent = 'Paused';
    stopVisualizer();
  }
}

function playVoiceNote() {
  const voicePlayIcon = document.getElementById('voice-play-icon');
  const voiceStatus = document.getElementById('voice-status');

  if (voiceAudioEl && (voiceAudioEl.src || voiceAudioEl.currentSrc)) {
    voiceAudioEl.play().then(() => {
      if (voicePlayIcon) voicePlayIcon.textContent = '⏸';
      if (voiceStatus) voiceStatus.textContent = 'Playing your voice note... ❤️';
      startVisualizer();
    }).catch(err => {
      console.warn("Audio play blocked", err);
    });
  }
}

function updateTimeDisplays(current, duration) {
  const currentEl = document.getElementById('voice-current-time');
  const durationEl = document.getElementById('voice-duration');
  if (currentEl) currentEl.textContent = formatTime(current);
  if (durationEl) durationEl.textContent = formatTime(duration);
}

function formatTime(secs) {
  if (isNaN(secs)) return "0:00";
  const m = Math.floor(secs / 60);
  const s = Math.floor(secs % 60);
  return `${m}:${s < 10 ? '0' : ''}${s}`;
}

// Waveform visualizer animation
function generateVisualizerBars() {
  const container = document.getElementById('visualizer-bars');
  if (!container) return;
  container.innerHTML = '';
  for (let i = 0; i < 36; i++) {
    const bar = document.createElement('div');
    bar.className = 'v-bar';
    container.appendChild(bar);
  }
}

let visInterval = null;
function startVisualizer() {
  const bars = document.querySelectorAll('.v-bar');
  visInterval = setInterval(() => {
    bars.forEach(b => {
      const h = Math.floor(Math.random() * 75) + 15;
      b.style.height = `${h}%`;
    });
  }, 120);
}

function stopVisualizer() {
  if (visInterval) clearInterval(visInterval);
  const bars = document.querySelectorAll('.v-bar');
  bars.forEach(b => b.style.height = '20%');
}
