// Interactive Photo Jigsaw Puzzle Module
import confetti from 'canvas-confetti';

let gridRows = 3;
let gridCols = 3;
let tiles = [];
let originalOrder = [];
let currentOrder = [];
let isSolved = false;
let moveCount = 0;
let puzzleImgSrc = "/assets/photo1.jpg";

export function initPuzzle(imageSrc) {
  if (imageSrc) puzzleImgSrc = imageSrc;

  const container = document.getElementById('puzzle-board');
  const shuffleBtn = document.getElementById('shuffle-puzzle-btn');
  const hintBtn = document.getElementById('hint-puzzle-btn');
  const movesEl = document.getElementById('puzzle-moves');
  const statusEl = document.getElementById('puzzle-status');

  if (!container) return;

  setupBoard();

  if (shuffleBtn) {
    shuffleBtn.addEventListener('click', () => {
      shufflePuzzle();
    });
  }

  if (hintBtn) {
    let showingHint = false;
    hintBtn.addEventListener('click', () => {
      showingHint = !showingHint;
      const hintImg = document.getElementById('puzzle-hint-img');
      if (hintImg) {
        hintImg.style.display = showingHint ? 'block' : 'none';
      }
      hintBtn.textContent = showingHint ? '👁️ Hide Hint' : '👁️ Show Hint';
    });
  }
}

export function updatePuzzleImage(newSrc) {
  puzzleImgSrc = newSrc;
  setupBoard();
}

function setupBoard() {
  const container = document.getElementById('puzzle-board');
  const gameArea = document.querySelector('.puzzle-game-area');
  const puzzleWrapper = document.querySelector('.puzzle-container');
  const hintImg = document.getElementById('puzzle-hint-img');
  const movesEl = document.getElementById('puzzle-moves');
  const statusEl = document.getElementById('puzzle-status');
  if (!container) return;

  const buildBoard = (w, h) => {
    const validW = (w && w > 0) ? w : 400;
    const validH = (h && h > 0) ? h : 300;
    if (gameArea) {
      const aspect = validW / validH;
      gameArea.style.aspectRatio = `${validW} / ${validH}`;
      if (puzzleWrapper) {
        if (aspect < 0.8) {
          puzzleWrapper.style.maxWidth = '380px';
        } else if (aspect > 1.3) {
          puzzleWrapper.style.maxWidth = '600px';
        } else {
          puzzleWrapper.style.maxWidth = '460px';
        }
      }
    }

    if (hintImg) {
      hintImg.src = puzzleImgSrc;
    }

    container.innerHTML = '';
    tiles = [];
    originalOrder = [];
    currentOrder = [];
    moveCount = 0;
    isSolved = false;

    if (movesEl) movesEl.textContent = '0';
    if (statusEl) statusEl.textContent = 'Swap tiles to rebuild our memory ❤️';

    const totalTiles = gridRows * gridCols;
    for (let i = 0; i < totalTiles; i++) {
      originalOrder.push(i);
      currentOrder.push(i);
    }

    const tileWidth = 100 / gridCols;
    const tileHeight = 100 / gridRows;

    originalOrder.forEach((idx) => {
      const tile = document.createElement('div');
      tile.className = 'puzzle-tile';
      tile.dataset.index = idx;
      tile.style.width = `${tileWidth}%`;
      tile.style.height = `${tileHeight}%`;

      const row = Math.floor(idx / gridCols);
      const col = idx % gridCols;

      tile.style.backgroundImage = `url("${puzzleImgSrc}")`;
      tile.style.backgroundSize = `${gridCols * 100}% ${gridRows * 100}%`;
      tile.style.backgroundPosition = `${(col / (gridCols - 1)) * 100}% ${(row / (gridRows - 1)) * 100}%`;

      tile.addEventListener('click', () => handleTileClick(tile));
      container.appendChild(tile);
      tiles.push(tile);
    });

    shufflePuzzle();
  };

  const img = new Image();
  img.src = puzzleImgSrc;
  if (img.complete && img.naturalWidth) {
    buildBoard(img.naturalWidth, img.naturalHeight);
  } else {
    img.onload = () => buildBoard(img.naturalWidth, img.naturalHeight);
    img.onerror = () => buildBoard(0, 0);
  }
}

let selectedTile = null;

function handleTileClick(tile) {
  if (isSolved) return;

  if (!selectedTile) {
    selectedTile = tile;
    tile.classList.add('selected');
  } else if (selectedTile === tile) {
    selectedTile.classList.remove('selected');
    selectedTile = null;
  } else {
    // Swap tiles
    swapTiles(selectedTile, tile);
    selectedTile.classList.remove('selected');
    selectedTile = null;

    moveCount++;
    const movesEl = document.getElementById('puzzle-moves');
    if (movesEl) movesEl.textContent = moveCount;

    checkWin();
  }
}

function swapTiles(tileA, tileB) {
  const container = document.getElementById('puzzle-board');
  const indexA = Array.from(container.children).indexOf(tileA);
  const indexB = Array.from(container.children).indexOf(tileB);

  // Swap in DOM
  const nextA = tileA.nextSibling;
  const nextB = tileB.nextSibling;

  if (nextA === tileB) {
    container.insertBefore(tileB, tileA);
  } else if (nextB === tileA) {
    container.insertBefore(tileA, tileB);
  } else {
    container.insertBefore(tileA, nextB);
    container.insertBefore(tileB, nextA);
  }

  // Swap in array
  const temp = currentOrder[indexA];
  currentOrder[indexA] = currentOrder[indexB];
  currentOrder[indexB] = temp;
}

function shufflePuzzle() {
  const container = document.getElementById('puzzle-board');
  if (!container) return;

  for (let i = container.children.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    swapTiles(container.children[i], container.children[j]);
  }
  isSolved = false;
  moveCount = 0;
  const movesEl = document.getElementById('puzzle-moves');
  const statusEl = document.getElementById('puzzle-status');
  if (movesEl) movesEl.textContent = '0';
  if (statusEl) statusEl.textContent = 'Swap tiles to rebuild our memory ❤️';
}

function checkWin() {
  const container = document.getElementById('puzzle-board');
  const currentTiles = Array.from(container.children);
  
  let correct = true;
  currentTiles.forEach((tile, idx) => {
    if (parseInt(tile.dataset.index) !== idx) {
      correct = false;
    }
  });

  if (correct) {
    isSolved = true;
    const statusEl = document.getElementById('puzzle-status');
    if (statusEl) statusEl.textContent = '🎉 YOU DID IT! Our picture of love is complete! ❤️';

    confetti({
      particleCount: 100,
      spread: 80,
      origin: { y: 0.6 },
      colors: ['#ff758c', '#ffd166', '#ff477e', '#ffffff']
    });
  }
}
