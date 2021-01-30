// Variables
var simonPattern = [];
var playerPattern = [];
var level = 0;
var index = 0;
var padColors = ["red", "blue", "green", "yellow"];
var gameModes = ["classic", "single", "graymode", "reverse", "creator"];
var currentMode = "classic";

// logic functions
function updateSimonPattern() {
  let randomNum = Math.floor(Math.random() * 4);
  let randomColor = this.padColors[randomNum];
  this.currentMode !== "reverse"
    ? this.simonPattern.push(randomColor)
    : this.simonPattern.unshift(randomColor);
  playPattern(randomColor);
  return randomNum;
}

function checkAnswer(currentIndex) {
  // Check for correct sequence element
  if (this.playerPattern[currentIndex] != this.simonPattern[currentIndex]) {
    let audio = new Audio("simon_sounds/wrong.mp3");
    audio.play();
    gameOver();
    resetGame();
    return;
  }
  // Check if pattern is complete
  if (currentIndex === this.level) {
    this.playerPattern = [];
    this.index = 0;
    level += 1;
    updateScore();
    setTimeout(() => {
      updateSimonPattern();
    }, 500);
  } else {
    this.index += 1;
  }
}

function playPattern(randomColor) {
  switch (this.currentMode) {
    case "single":
      setTimeout(() => {
        playSound(randomColor);
        animatePad(randomColor);
      }, 500);
      break;
    case "reverse":
      var i = this.simonPattern.length - 1;
      setInterval(function () {
        if (i >= 0) {
          playSound(this.simonPattern[i]);
          animatePad(this.simonPattern[i]);
          i--;
        } else {
          return;
        }
      }, 500);
      break;
    default:
      var i = 0;
      var len = this.simonPattern.length;
      setInterval(function () {
        if (i < len) {
          playSound(this.simonPattern[i]);
          animatePad(this.simonPattern[i]);
          i++;
        } else {
          return;
        }
      }, 500);
      break;
  }
}

function setGameMode(mode) {
  if (!mode) {
    return;
  }
  resetGame();
  document.getElementById("mode-title").textContent = mode.toUpperCase();
  document.querySelector("#score").textContent = "THINK FAST!";
  this.currentMode = mode;
  this.gameModes.forEach((gamemode) => {
    if (gamemode !== mode) {
      document
        .getElementById(gamemode)
        .children[0].classList.add("gamemode-inactive");
      document
        .getElementById(gamemode)
        .children[0].classList.remove("gamemode-active");
    } else {
      document
        .getElementById(gamemode)
        .children[0].classList.remove("gamemode-inactive");
      document
        .getElementById(gamemode)
        .children[0].classList.add("gamemode-active");
    }
  });
  setGrayMode(this.currentMode === "graymode");
}

function resetGame() {
  this.simonPattern = [];
  this.playerPattern = [];
  this.level = 0;
  this.index = 0;
}

// UI handlers
function playSound(color) {
  new Audio("simon_sounds/" + color + ".mp3").play();
}

function animatePad(color) {
  let pad = document.getElementById(color);
  pad.classList.add("hide");
  pad.classList.remove("show");
  setTimeout(() => {
    pad.classList.add("show");
    pad.classList.remove("hide");
  }, 100);
}

function updateScore() {
  document.getElementById("score").textContent = "SCORE: " + this.level;
}

function clickHandler(color) {
  playSound(color);
  animatePad(color);
  this.playerPattern.push(color);
  checkAnswer(this.index);
}

function gameOver() {
  let gameBoard = document.querySelector(".outer");
  let triviaMenu = document.querySelector(".trivia");
  let finalScore = document.querySelector("#final-score");
  finalScore.textContent = "SCORE: " + this.level;
  gameBoard.classList.add("invisible");
  setTriviaText();
  triviaMenu.classList.remove("invisible");
  document.querySelector("#score").textContent = "GAME OVER";
  document.querySelector(".play-again").addEventListener(
    "click",
    () => {
      gameBoard.classList.remove("invisible");
      triviaMenu.classList.add("invisible");
      updateSimonPattern();
      updateScore();
    },
    { once: true }
  );
}

function setTriviaText() {
  let randomNum = Math.floor(Math.random() * triviaText.length);
  document.getElementById("trivia-text").textContent = triviaText[randomNum];
}

function setGrayMode(graymode) {
  graymode
    ? this.padColors.forEach((color) => {
        document.getElementById(color).classList.add("gray");
      })
    : this.padColors.forEach((color) => {
        document.getElementById(color).classList.remove("gray");
      });
}

/*** Initialization ***/

// Set up game pads
this.padColors.forEach((pad) => {
  document.getElementById(pad).addEventListener("touchstart", (event) => {
    clickHandler(event.target.id);
    event.stopPropagation();
    event.preventDefault();
  });
  document.getElementById(pad).addEventListener("click", (event) => {
    clickHandler(event.target.id);
    event.stopPropagation();
    event.preventDefault();
  });
});

// Set up power button
document.querySelector(".power-btn").addEventListener("click", () => {
  resetGame();
  updateSimonPattern();
  updateScore();
});

// Set up gamemode buttons
document.querySelectorAll(".gamemode-btn").forEach((btn) => {
  btn.addEventListener("click", (event) => {
    setGameMode(event.target.id);
    event.preventDefault();
  });
});

const triviaText = [
  "SIMON is an electronic game of memory skill invented by Ralph H. Baer and Howard J. Morrison and released by the American board game company Milton Bradley in 1978.",
  "Simon debuted in 1978 at a retail price of $24.95 (equivalent to $98 in 2020) and became one of the top-selling toys that Christmas.",
  "The creators of SIMON were originally inspired by Atari's arcade game TOUCH ME which they felt had 'nice gameplay' but 'terrible exectution'",
  "The SIMON prototype used the low cost Texas Instruments TMS 1000 microcontroller chip, which was used in many popular games of the 1970s",
  "SIMON's tones were designed to always be harmonic, no matter the sequence, and consisted of an A major triad in second inversion, resembling a trumpet fanfare",
];
