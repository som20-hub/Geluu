// Romantic Background Music Engine & Voice Note Player

let bgAudioEl = null;
let voiceAudioEl = null;
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

  // Keep background music active state in sync
  if (bgAudioEl) {
    bgAudioEl.loop = true;

    bgAudioEl.addEventListener('play', () => {
      isBgMusicActive = true;
    });

    bgAudioEl.addEventListener('pause', () => {
      if (!wasBgMusicPlayingBeforeVoice) {
        isBgMusicActive = false;
      }
    });

    // Try playing immediately as soon as media metadata or enough data is ready
    ['canplay', 'canplaythrough', 'loadedmetadata', 'load'].forEach(evt => {
      bgAudioEl.addEventListener(evt, () => {
        if (bgAudioEl.paused) {
          playBgMusic();
        }
      });
    });
  }

  // Attempt Autoplay Background Music on load + background & interaction triggers
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

// Automatically start background music on page load, background tab activation, or first gesture fallback
function attemptAutoPlayMusic() {
  bgAudioEl = bgAudioEl || document.getElementById('bg-audio');
  if (!bgAudioEl) return;

  bgAudioEl.loop = true;

  const tryStartAudio = () => {
    if (!bgAudioEl) return;
    const promise = bgAudioEl.play();
    if (promise !== undefined) {
      promise.then(() => {
        isBgMusicActive = true;
        console.log("🎵 Background music playing automatically!");
      }).catch((err) => {
        console.log("🎵 Autoplay waiting for background tab activation or user interaction:", err.message);
        attachInteractionUnlock();
      });
    }
  };

  const unlockAudio = () => {
    if (bgAudioEl && bgAudioEl.paused) {
      bgAudioEl.play().then(() => {
        isBgMusicActive = true;
        console.log("🎵 Background music started!");
        removeUnlockListeners();
      }).catch(err => {
        console.warn("Audio unlock waiting:", err);
      });
    } else if (bgAudioEl && !bgAudioEl.paused) {
      removeUnlockListeners();
    }
  };

  const events = [
    'click', 'touchstart', 'touchend', 'pointerdown', 'mousedown',
    'keydown', 'scroll', 'mousemove', 'wheel', 'visibilitychange',
    'focus', 'pageshow'
  ];

  const attachInteractionUnlock = () => {
    events.forEach(evt => {
      window.addEventListener(evt, unlockAudio, { passive: true, once: false });
      document.addEventListener(evt, unlockAudio, { passive: true, once: false });
      if (document.body) {
        document.body.addEventListener(evt, unlockAudio, { passive: true, once: false });
      }
    });
  };

  const removeUnlockListeners = () => {
    events.forEach(evt => {
      window.removeEventListener(evt, unlockAudio);
      document.removeEventListener(evt, unlockAudio);
      if (document.body) {
        document.body.removeEventListener(evt, unlockAudio);
      }
    });
  };

  // Immediate start attempt
  tryStartAudio();

  // Retry when page becomes visible or focused (e.g., opened in background)
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden && bgAudioEl && bgAudioEl.paused) {
      tryStartAudio();
    }
  });

  window.addEventListener('focus', () => {
    if (bgAudioEl && bgAudioEl.paused) {
      tryStartAudio();
    }
  });
}

export function playBgMusic() {
  isBgMusicActive = true;
  if (bgAudioEl && bgAudioEl.src) {
    const promise = bgAudioEl.play();
    if (promise !== undefined) {
      return promise.then(() => {
        isBgMusicActive = true;
      }).catch(err => {
        console.warn("playBgMusic blocked:", err);
      });
    }
  }
}

export function pauseBgMusic() {
  isBgMusicActive = false;
  if (bgAudioEl && !bgAudioEl.paused) {
    bgAudioEl.pause();
  }
}

function pauseBgMusicForVoice() {
  wasBgMusicPlayingBeforeVoice = isBgMusicActive;
  if (bgAudioEl && !bgAudioEl.paused) {
    bgAudioEl.pause();
  }
}

function resumeBgMusicAfterVoice() {
  if (wasBgMusicPlayingBeforeVoice) {
    playBgMusic();
    wasBgMusicPlayingBeforeVoice = false;
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

// Immediate execution attempt as soon as script is parsed
if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => attemptAutoPlayMusic());
  } else {
    attemptAutoPlayMusic();
  }
}
