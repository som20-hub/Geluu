// Interactive 3D Envelope & Typewriter Love Letter

let currentLetterText = "";
let typingTimeout = null;

export function initEnvelope(defaultText, husbandName) {
  const envelope = document.getElementById('envelope');
  const waxSeal = document.getElementById('wax-seal');
  const letterBody = document.getElementById('letter-body-text');
  const signatureEl = document.getElementById('letter-signature');

  if (!envelope || !waxSeal || !letterBody) return;

  if (defaultText) {
    currentLetterText = defaultText;
  }

  if (husbandName && signatureEl) {
    signatureEl.textContent = husbandName;
  }

  // Pre-fill text immediately so your custom letter is always ready
  letterBody.textContent = currentLetterText;

  // Wax seal click event
  waxSeal.addEventListener('click', (e) => {
    e.stopPropagation();
    openEnvelope();
  });

  envelope.addEventListener('click', () => {
    if (!envelope.classList.contains('open')) {
      openEnvelope();
    }
  });

  function openEnvelope() {
    envelope.classList.add('open');
    startTypewriter(currentLetterText);
  }
}

export function updateLetterContent(newText, husbandName) {
  currentLetterText = newText;
  const signatureEl = document.getElementById('letter-signature');
  if (husbandName && signatureEl) {
    signatureEl.textContent = husbandName;
  }
  const letterBody = document.getElementById('letter-body-text');
  if (letterBody) {
    letterBody.textContent = newText;
  }
}

function startTypewriter(text) {
  const letterBody = document.getElementById('letter-body-text');
  const letterPreview = document.querySelector('.letter-preview') || document.querySelector('.envelope-wrapper');
  if (!letterBody) return;

  if (typingTimeout) clearTimeout(typingTimeout);

  letterBody.textContent = "";
  let i = 0;
  const speed = 20; // ms per char

  function type() {
    if (i < text.length) {
      letterBody.textContent += text.charAt(i);
      i++;
      if (letterPreview) {
        letterPreview.scrollTop = letterPreview.scrollHeight;
      }
      typingTimeout = setTimeout(type, speed);
    }
  }

  type();
}
