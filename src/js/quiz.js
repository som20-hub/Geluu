// Interactive Romantic Quiz Module
import confetti from 'canvas-confetti';

const quizQuestions = [
  {
    question: "If I could choose only one thing to do with you forever, what would I choose?",
    options: ["Travel the whole world together ✈️", "Build a beautiful home together 🏡", "Grow old sitting beside you and talking about everything ❤️", "Just spend every ordinary day with you"],
    correct: 4,
    loveMessage: "Correct! Because with the right person, even an ordinary day feels special."
  },
  {
    question: "What is my absolute favorite thing about you?",
    options: ["Your beautiful radiant smile 😁", "Your kind and gentle heart 💖", "The way you hold my hand 🤝", "Literally everything about you! 🌟"],
    correct: 3,
    loveMessage: "Spot on, my queen! I fall in love with everything about you more every day!"
  },
  {
    question: "How much do I love you?",
    options: ["To the moon and back 🌙", "More than all the stars in the universe ✨", "Beyond infinity ♾️", "More than words could ever describe! 💕"],
    correct: 3,
    loveMessage: "Exactly! Words will never be enough to express how deeply you are loved!"
  }
];

let currentQuestionIdx = 0;
let score = 0;

export function initQuiz() {
  const container = document.getElementById('quiz-card-container');
  if (!container) return;

  renderQuestion();
}

function renderQuestion() {
  const container = document.getElementById('quiz-card-container');
  if (!container) return;

  if (currentQuestionIdx >= quizQuestions.length) {
    // Quiz completed!
    container.innerHTML = `
      <div class="quiz-results">
        <div class="quiz-heart-badge">🏆 Perfect Score! 100/100</div>
        <h3>You Won My Whole Heart! ❤️</h3>
        <p>You know our love story better than anyone else in the world. You are my forever soulmate!</p>
        <button id="restart-quiz-btn" class="quiz-btn-next">Play Quiz Again 🔄</button>
      </div>
    `;

    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#ff758c', '#ffd166', '#ffffff']
    });

    const restartBtn = document.getElementById('restart-quiz-btn');
    if (restartBtn) {
      restartBtn.addEventListener('click', () => {
        currentQuestionIdx = 0;
        score = 0;
        renderQuestion();
      });
    }
    return;
  }

  const q = quizQuestions[currentQuestionIdx];
  container.innerHTML = `
    <div class="quiz-step-tag">Question ${currentQuestionIdx + 1} of ${quizQuestions.length}</div>
    <h3 class="quiz-question-title">${q.question}</h3>
    <div class="quiz-options-grid">
      ${q.options.map((opt, i) => `
        <button class="quiz-option-btn" data-index="${i}">${opt}</button>
      `).join('')}
    </div>
    <div id="quiz-feedback" class="quiz-feedback hidden"></div>
  `;

  const optionBtns = container.querySelectorAll('.quiz-option-btn');
  optionBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      const selected = parseInt(e.currentTarget.getAttribute('data-index'));
      handleAnswer(selected, q);
    });
  });
}

function handleAnswer(selectedIdx, question) {
  const feedbackEl = document.getElementById('quiz-feedback');
  const container = document.getElementById('quiz-card-container');

  if (feedbackEl) {
    feedbackEl.classList.remove('hidden');
    feedbackEl.innerHTML = `
      <div class="feedback-msg">💖 ${question.loveMessage}</div>
      <button id="next-quiz-q-btn" class="quiz-btn-next">Next Question →</button>
    `;

    confetti({
      particleCount: 30,
      spread: 40,
      origin: { y: 0.7 },
      colors: ['#ff758c', '#ffd166']
    });

    const nextBtn = document.getElementById('next-quiz-q-btn');
    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        currentQuestionIdx++;
        renderQuestion();
      });
    }
  }
}
