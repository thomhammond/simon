// Variables
var gamePattern = [];
var playerPattern = [];
var level = 1;
var index = 0;
var padColors = ["red", "blue", "green", "yellow"];
var gameModes = ["classic", "single", "graymode", "reverse", "freestyle"];
var currentMode = "classic";
var playPattern = defaultPattern;
var intervalHandle = null;

const triviaText = [
  "SIMON is an electronic game of memory skill invented by Ralph H. Baer and Howard J. Morrison and released by the American board game company Milton Bradley in 1978.",
  "Simon debuted in 1978 at a retail price of $24.95 (equivalent to $98 in 2020) and became one of the top-selling toys that Christmas.",
  "The creators of SIMON were originally inspired by Atari's arcade game TOUCH ME which they felt had 'nice gameplay' but 'terrible exectution'",
  "The SIMON prototype used the low cost Texas Instruments TMS 1000 microcontroller chip, which was used in many popular games of the 1970s",
  "SIMON's tones were designed to always be harmonic, no matter the sequence, and consisted of an A major triad in second inversion, resembling a trumpet fanfare",
];

const gameModeText = {
  classic:
    "Classic Mode is just like the real Simon game! Repeat the full pattern every round to advance!",
  single:
    "Press the play button to begin a game.\nSingle Mode only shows you the last color and sound but you must repeat the full pattern every round to advance!\nPress the refresh button to restart the game.",
  reverse:
    "Press the play button to begin a game.\nIn Reverse Mode, you must play the pattern backwards  every round to advance!\nPress the refresh button to restart the game.",
  graymode:
    "Press the play button to begin a game.\nGray Mode is just like Classic Mode but all the pads are gray! Repeat the full pattern every round to advance!\nPress the refresh button to restart the game.",
  freestyle:
    "Press the play button to begin a game.\nFreestyle Mode lets you play without worrying about a pattern. Just have fun!\nPress the refresh button to restart the game.",
};

// Adds a new random color to the gamePattern
function updatePattern() {
  let randomNum = Math.floor(Math.random() * 4);
  let randomColor = padColors[randomNum];
  currentMode !== "reverse"
    ? gamePattern.push(randomColor)
    : gamePattern.unshift(randomColor);
  return randomNum;
}

function checkAnswer(currentIndex) {
  if (playerPattern[currentIndex] != gamePattern[currentIndex]) {
    let audio = new Audio("my_simon_sounds/wrong.mp3");
    audio.play();
    gameOver();
    return;
  }
  // Check if current sequence is complete
  if (currentIndex === level - 1) {
    playerPattern = [];
    index = 0;
    level += 1;
    updateRound();
    setTimeout(() => {
      updatePattern();
      playPattern();
    }, 500);
  } else {
    index += 1;
  }
}

function setGameMode(mode) {
  // Do nothing if mode is currentMode
  if (!mode) {
    return;
  }
  resetGame();
  let pBtn = document.querySelector(".play");
  pBtn.classList.remove("fa-sync");
  pBtn.classList.add("fa-play");
  document.getElementById("mode-title").textContent = mode.toUpperCase();
  document.querySelector("#round").textContent = "THINK FAST!";
  currentMode = mode;
  gameModes.forEach((gamemode) => {
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
  // Deal with graymode
  currentMode === "graymode"
    ? padColors.forEach((color) => {
        document.getElementById(color).classList.add("gray");
      })
    : padColors.forEach((color) => {
        document.getElementById(color).classList.remove("gray");
      });
  // Assign playPattern to currentMode
  if (currentMode === "single") {
    playPattern = singlePattern;
  } else if (currentMode === "reverse") {
    playPattern = reversePattern;
  } else {
    playPattern = defaultPattern;
  }
}

function resetGame() {
  clearInterval(intervalHandle);
  gamePattern = [];
  playerPattern = [];
  level = 1;
  index = 0;
}

function gameOver() {
  let gameBoard = document.querySelector(".outer");
  let triviaMenu = document.querySelector(".trivia");
  let twitter = document.querySelector(".twitter-wrapper");
  let finalRound = document.querySelector("#final-round");
  finalRound.textContent = "Total Rounds: " + (level - 1);
  gameBoard.classList.add("invisible");
  let randomNum = Math.floor(Math.random() * triviaText.length);
  document.getElementById("trivia-text").textContent = triviaText[randomNum];
  triviaMenu.classList.remove("invisible");
  twitter.classList.remove("invisible");
  document.querySelector("#round").textContent = "GAME OVER";
  document.querySelector(".play-again").addEventListener(
    "click",
    () => {
      gameBoard.classList.remove("invisible");
      triviaMenu.classList.add("invisible");
      twitter.classList.add("invisible");

      updatePattern();
      playPattern();
      updateRound();
    },
    { once: true }
  );
  resetGame();
}

function showInfo() {
  let gameBoard = document.querySelector(".outer");
  let info = document.querySelector(".info");
  let infoText = document.querySelector(".info-text");
  let infoBtn = document.querySelector(".far");
  gameBoard.classList.add("invisible");
  info.classList.remove("invisible");
  infoText.textContent = gameModeText[currentMode];
  infoBtn.classList.remove("fa-question-circle");
  infoBtn.classList.add("fa-times-circle");

  document.querySelector(".info-icon").addEventListener("click", () => {
    gameBoard.classList.remove("invisible");
    info.classList.add("invisible");
    infoBtn.classList.remove("fa-times-circle");
    infoBtn.classList.add("fa-question-circle");

    document.querySelector(".info-icon").addEventListener("click", () => {
      showInfo();
    });
  });
}

function clickHandler(color) {
  playSound(color);
  animatePad(color);
  playerPattern.push(color);
  checkAnswer(index);
}

// Functions to assign to playPattern depending on gamemode
function singlePattern() {
  setTimeout(() => {
    playSound(gamePattern[gamePattern.length - 1]);
    animatePad(gamePattern[gamePattern.length - 1]);
  }, 500);
}

function reversePattern() {
  var i = gamePattern.length - 1;
  intervalHandle = setInterval(function () {
    if (i >= 0) {
      playSound(gamePattern[i]);
      animatePad(gamePattern[i]);
      i--;
    } else {
      return;
    }
  }, 500);
}

function defaultPattern() {
  var i = 0;
  var len = gamePattern.length;
  intervalHandle = setInterval(() => {
    if (i < len) {
      playSound(gamePattern[i]);
      animatePad(gamePattern[i]);
      i++;
    } else {
      return;
    }
  }, 500);
}

// UI handlers
function playSound(color) {
  let audio = new Audio("my_simon_sounds/" + color + ".mp3");
  audio.play();
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

function updateRound() {
  document.getElementById("round").textContent = "ROUND: " + level;
}

/*** Initialization ***/

// Set up game pads
padColors.forEach((pad) => {
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
  updateRound();
  updatePattern();
  playPattern();
  let pBtn = document.querySelector(".play");
  pBtn.classList.remove("fa-play");
  pBtn.classList.add("fa-sync");
});

// Set up gamemode buttons
document.querySelectorAll(".gamemode-btn").forEach((btn) => {
  btn.addEventListener("click", (event) => {
    setGameMode(event.target.id);
    event.preventDefault();
  });
});

document.querySelector(".info-icon").addEventListener("click", () => {
  showInfo();
});
