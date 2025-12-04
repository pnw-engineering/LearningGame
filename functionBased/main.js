// Addition Game - Function-Based Version
// All game logic is implemented using simple functions and shared state objects

// Shared game state
const gameState = {
  currentgame: 0,
  beginnersPracticeMode: true,
  stats: {
    beginners: { correct: 0, wrong: 0 },
    SimpleAddition: { correct: 0, wrong: 0 },
  },
  userName: localStorage.getItem("userName") || "",
  settings: {
    theme: "auto",
    quietMode: false,
    difficulty: "normal",
  },
  currentProblem: null,
  speechSynthesis: window.speechSynthesis,
};

// Utility functions
// Load settings from storage
function loadSettings() {
  gameState.settings = gameStorage.getSettings();
  // Add any additional settings logic here if needed
}
function showScreen(screenId) {
  if (window.speechSynthesis) window.speechSynthesis.cancel();
  document.querySelectorAll(".screen").forEach((screen) => {
    screen.classList.add("hidden");
  });
  const target = document.getElementById(screenId);
  if (target) target.classList.remove("hidden");
}

function updateUserNameDisplay() {
  const name =
    gameState.userName || localStorage.getItem("userName") || "Not Entered";
  [
    "user-name-display",
    "beginners-user-name",
    "SimpleAddition-user-name",
  ].forEach((id) => {
    const el = document.getElementById(id);
    if (el) el.textContent = name;
  });
}

function setbeginnersMode(practice) {
  gameState.beginnersPracticeMode = practice;
  if (window.speechSynthesis) window.speechSynthesis.cancel();
  const btn = document.getElementById("beginners-mode-btn");
  const instruction = document.getElementById("beginners-instruction");
  if (btn) {
    btn.textContent = practice
      ? "Mode: Practice (Switch to Test Mode)"
      : "Mode: Test (Switch to Practice Mode)";
  }
  if (practice) {
    if (instruction)
      instruction.textContent =
        "Touch a number and I will tell you what it is.";
    // ...clear prompt timer logic...
    if (!gameState.settings.quietMode)
      speak("Touch a number and I will tell you what it is.");
  } else {
    // Test mode: always set a valid targetNumber
    gameState.currentProblem = {
      targetNumber: Math.floor(Math.random() * 10),
    };
    if (instruction)
      instruction.textContent = `Find the number ${gameState.currentProblem.targetNumber}`;
    if (!gameState.settings.quietMode)
      speak(`Find the number ${gameState.currentProblem.targetNumber}`);
  }
}

function getAmericanFemaleVoice() {
  const voices = window.speechSynthesis.getVoices();
  // Prefer Google US English or Microsoft voices, fallback to first female en-US
  let preferred = voices.find(
    (v) => v.lang === "en-US" && v.name.includes("Google US English")
  );
  if (!preferred) {
    preferred = voices.find(
      (v) => v.lang === "en-US" && v.name.includes("Microsoft")
    );
  }
  if (!preferred) {
    preferred = voices.find((v) => v.lang === "en-US" && v.gender === "female");
  }
  if (!preferred) {
    preferred = voices.find(
      (v) => v.lang === "en-US" && v.name.toLowerCase().includes("female")
    );
  }
  if (!preferred) {
    preferred = voices.find((v) => v.lang === "en-US");
  }
  return preferred || voices[0];
}

function speak(text, onend) {
  if (!window.speechSynthesis) return;
  const utter = new SpeechSynthesisUtterance(text);
  utter.rate = 0.8;
  const setVoice = () => {
    const voice = getAmericanFemaleVoice();
    if (voice) utter.voice = voice;
    if (onend) utter.onend = onend;
    window.speechSynthesis.speak(utter);
  };
  // Voices may not be loaded yet
  if (window.speechSynthesis.getVoices().length === 0) {
    window.speechSynthesis.onvoiceschanged = setVoice;
  } else {
    setVoice();
  }
}

function clearUserName() {
  gameState.userName = "";
  localStorage.removeItem("userName");
  updateUserNameDisplay();
  promptForUserName();
}

// Personalization: Prompt for name with TTS and speech recognition
function promptForUserName() {
  speak(
    "Hi, I'm going to play some number games with you. What's your name?",
    () => {
      listenForUserName();
    }
  );
}

function startgame(game) {
  gameState.currentgame = game;
  gameState.settings.gamegame = game;
  // ...save settings logic...
  if (game === 0) {
    showScreen("beginners-screen");
    initbeginners();
  } else if (game === 1) {
    showScreen("SimpleAddition-screen");
    initSimpleAddition();
  }
}

function initbeginners() {
  // gameState.stats.beginners = { correct: 0, wrong: 0 };
  updatebeginnersDisplay();
  setbeginnersMode(gameState.beginnersPracticeMode);
  // Hide scoring arrays by default
  // document.querySelectorAll("#SimpleAddition-screen .scoring-display").forEach((el) => {
  document.querySelectorAll(".scoring-display").forEach((el) => {
    el.classList.add("hidden");
  });
  gameState.autoTestMode = false;
}

function updatebeginnersDisplay() {
  const total =
    gameState.stats.beginners.correct + gameState.stats.beginners.wrong;
  const accuracy =
    total > 0
      ? Math.round((gameState.stats.beginners.correct / total) * 100)
      : 100;
  const correctEl = document.getElementById("beginners-correct");
  const wrongEl = document.getElementById("beginners-wrong");
  const accuracyEl = document.getElementById("beginners-accuracy");
  if (correctEl) correctEl.textContent = gameState.stats.beginners.correct;
  if (wrongEl) wrongEl.textContent = gameState.stats.beginners.wrong;
  if (accuracyEl) accuracyEl.textContent = `${accuracy}%`;
}

function handlebeginnersPractice(number) {
  // Speak the number when clicked in practice mode
  if (!gameState.settings.quietMode) {
    speak(`That is ${number}`);
  }
  // Optionally, update feedback area or UI here
}

function checkbeginnersAnswer(number) {
  if (
    !gameState.currentProblem ||
    typeof gameState.currentProblem.targetNumber !== "number"
  ) {
    gameState.currentProblem = { targetNumber: Math.floor(Math.random() * 10) };
  }
  const isCorrect = number === gameState.currentProblem.targetNumber;
  const feedbackArea = document.getElementById("beginners-feedback-area");
  if (isCorrect) {
    gameState.stats.beginners.correct++;
    if (feedbackArea) {
      feedbackArea.innerHTML = `<div class='feedback correct'>🎉 Correct! You found ${number}!</div>`;
    }
    if (!gameState.settings.quietMode) {
      speak(`Correct! You found ${number}`);
    }
    // Generate next target number and prompt
    gameState.currentProblem = { targetNumber: Math.floor(Math.random() * 10) };
    const instruction = document.getElementById("beginners-instruction");
    if (instruction)
      instruction.textContent = `Find the number ${gameState.currentProblem.targetNumber}`;
    if (!gameState.settings.quietMode)
      speak(`Find the number ${gameState.currentProblem.targetNumber}`);
  } else {
    gameState.stats.beginners.wrong++;
    if (feedbackArea) {
      feedbackArea.innerHTML = `<div class='feedback incorrect'>Try again! That was ${number}, but we're looking for ${gameState.currentProblem.targetNumber}.</div>`;
    }
    if (!gameState.settings.quietMode) {
      speak(
        `Try again! That was ${number}, but we're looking for ${gameState.currentProblem.targetNumber}`
      );
    }
  }
  updatebeginnersDisplay();
  gameStorage.saveGameStats(gameState.stats);
  // console.log("beginners stats:", gameState.stats);
}

function initSimpleAddition() {
  // gameState.stats.SimpleAddition = { correct: 0, wrong: 0 };
  updateSimpleAdditionDisplay();
  // console.log(
  //   "Initializing SimpleAddition, quiet mode:",
  //   gameState.settings.quietMode
  // );
  if (!gameState.settings.quietMode && gameState.userName != "Not Entered") {
    speak(
      "Hi " +
        gameState.userName +
        "! Welcome to SimpleAddition! Let's get started."
    );
  } else if (!gameState.settings.quietMode) {
    speak("Welcome to SimpleAddition! Let's get started.");
  }
  generateSimpleAdditionProblem();
  // Hide scoring arrays by default
  document
    .querySelectorAll("#SimpleAddition-screen .scoring-display")
    .forEach((el) => {
      el.classList.add("hidden");
      // el.classList.remove("hidden");
    });
  gameState.autoTestMode = false;
}

// Add SimpleAddition scoring arrays and helpers
if (!gameState.progressMatrix) {
  gameState.progressMatrix = {
    1: {
      tries: Array(10)
        .fill(null)
        .map(() => Array(10).fill(0)),
      errors: Array(10)
        .fill(null)
        .map(() => Array(10).fill(0)),
    },
  };
}

function formatMatrix(matrix) {
  if (Array.isArray(matrix[0])) {
    // 2D matrix (SimpleAddition)
    return matrix.map((row) => row.join(", ")).join("\n");
  } else {
    // 1D array (beginners)
    return matrix.join(", ");
  }
}

function recordTry(game, i, j) {
  if (game === 1) {
    gameState.progressMatrix[1].tries[i][j]++;
  }
}

function recordError(game, i, j) {
  if (game === 1) {
    gameState.progressMatrix[1].errors[i][j]++;
  }
}

function decrementError(game, i, j) {
  if (game === 1) {
    gameState.progressMatrix[1].errors[i][j] = Math.max(
      0,
      gameState.progressMatrix[1].errors[i][j] - 1
    );
  }
}

function updateSimpleAdditionScoringArrays() {
  const hitsDisplay = document.getElementById("SimpleAddition-hits-display");
  const errorsDisplay = document.getElementById(
    "SimpleAddition-errors-display"
  );
  if (hitsDisplay)
    hitsDisplay.textContent = formatMatrix(gameState.progressMatrix[1].tries);
  if (errorsDisplay)
    errorsDisplay.textContent = formatMatrix(
      gameState.progressMatrix[1].errors
    );
}

function updateSimpleAdditionDisplay() {
  const total =
    gameState.stats.SimpleAddition.correct +
    gameState.stats.SimpleAddition.wrong;
  const accuracy =
    total > 0
      ? Math.round((gameState.stats.SimpleAddition.correct / total) * 100)
      : 100;
  const correctEl = document.getElementById("SimpleAddition-correct");
  const wrongEl = document.getElementById("SimpleAddition-wrong");
  const accuracyEl = document.getElementById("SimpleAddition-accuracy");
  if (correctEl) correctEl.textContent = gameState.stats.SimpleAddition.correct;
  if (wrongEl) wrongEl.textContent = gameState.stats.SimpleAddition.wrong;
  if (accuracyEl) accuracyEl.textContent = `${accuracy}%`;
  updateSimpleAdditionScoringArrays();
  // Hide scoring arrays unless auto-test mode is active
  document
    .querySelectorAll("#SimpleAddition-screen .scoring-display")
    .forEach((el) => {
      if (gameState.autoTestMode) {
        el.classList.remove("hidden");
      } else {
        el.classList.add("hidden");
      }
    });
}

function generateSimpleAdditionProblem() {
  // Adaptive selection using scoring rules
  const tries = gameState.progressMatrix[1].tries;
  const errors = gameState.progressMatrix[1].errors;
  // Build Selection array
  const selection = Array(10)
    .fill(null)
    .map((_, i) =>
      Array(10)
        .fill(null)
        .map((_, j) => tries[i][j] - errors[i][j])
    );

  // Find row(s) with smallest sum of columns
  const rowSums = selection.map((row) => row.reduce((a, b) => a + b, 0));
  const minRowSum = Math.min(...rowSums);
  const candidateRows = [];
  rowSums.forEach((sum, idx) => {
    if (sum === minRowSum) candidateRows.push(idx);
  });
  // Randomly select a row from candidates
  const rowIdx =
    candidateRows[Math.floor(Math.random() * candidateRows.length)];

  // In that row, find columns with smallest value
  const minColVal = Math.min(...selection[rowIdx]);
  const candidateCols = [];
  selection[rowIdx].forEach((val, idx) => {
    if (val === minColVal) candidateCols.push(idx);
  });
  // Randomly select a column from candidates
  const colIdx =
    candidateCols[Math.floor(Math.random() * candidateCols.length)];

  // Set problem
  gameState.currentProblem = {
    num1: rowIdx,
    num2: colIdx,
    correctAnswer: rowIdx + colIdx,
  };
  // Update UI numbers
  const num1El = document.getElementById("SimpleAddition-num1");
  const num2El = document.getElementById("SimpleAddition-num2");
  if (num1El) num1El.textContent = rowIdx;
  if (num2El) num2El.textContent = colIdx;

  if (!gameState.settings.quietMode) {
    speak(`What is ${rowIdx} plus ${colIdx}?`);
  }
  // Clear answer input
  const input = document.getElementById("SimpleAddition-answer-input");
  if (input) {
    input.value = "";
  }
  clearSimpleAdditionFeedback();
}
// Testing Mode Methods for Scoring Logic Observation
function startAutoTest() {
  gameState.autoTestMode = true;

  // Show scoring displays during testing
  // showScoringDisplays();

  // Show SimpleAddition if not already showing
  if (
    !document
      .getElementById("SimpleAddition-screen")
      .classList.contains("hidden")
  ) {
    generateSimpleAdditionProblem();
  } else {
    showScreen("SimpleAddition-screen");
    generateSimpleAdditionProblem();
  }

  scheduleAutoAnswer();
}

function stopAutoTest() {
  gameState.autoTestMode = false;

  // Hide scoring displays when not testing
  hideScoringDisplays();

  if (gameState.autoTestInterval) {
    clearTimeout(gameState.autoTestInterval);
    gameState.autoTestInterval = null;
  }
}

// Scoring Display Visibility Control
function showScoringDisplays() {
  const displays = document.querySelectorAll(".scoring-display");
  displays.forEach((display) => {
    display.classList.remove("hidden");
  });
}

function hideScoringDisplays() {
  // Only hide if auto-test is not running
  if (gameState.autoTestMode) {
    const displays = document.querySelectorAll(".scoring-display");
    displays.forEach((display) => {
      display.classList.add("hidden");
    });
    return;
  }

  const displays = document.querySelectorAll(".scoring-display");
  displays.forEach((display) => {
    display.classList.add("hidden");
  });
}

function scheduleAutoAnswer() {
  if (!gameState.autoTestMode) return;

  gameState.autoTestInterval = setTimeout(() => {
    generateAutoAnswer();
  }, gameState.autoAnswerDelay);
}

function generateAutoAnswer() {
  if (!gameState.autoTestMode || !gameState.currentProblem) return;

  const input = document.getElementById("SimpleAddition-answer-input");
  if (!input) return;

  let answer;
  const errorRate = 0.1; // 10% error rate

  if (Math.random() < errorRate) {
    // Generate wrong answer (within reasonable range)
    const correctAnswer = gameState.currentProblem.correctAnswer;
    const wrongOptions = [];

    // Add some plausible wrong answers
    for (let i = Math.max(0, correctAnswer - 3); i <= correctAnswer + 3; i++) {
      if (i !== correctAnswer && i >= 0 && i <= 18) {
        wrongOptions.push(i);
      }
    }

    answer =
      wrongOptions.length > 0
        ? wrongOptions[Math.floor(Math.random() * wrongOptions.length)]
        : correctAnswer + 1;
  } else {
    // Generate correct answer
    answer = gameState.currentProblem.correctAnswer;
  }

  // Fill the input and trigger answer check
  input.value = answer;
  checkSimpleAdditionAnswer();

  // Schedule next auto answer only if we're still in auto-test mode
  // The timeout accounts for feedback display time
  if (gameState.autoTestMode) {
    setTimeout(() => {
      scheduleAutoAnswer();
    }, 200); // Fast iteration for rapid testing
  }
}

// Auto-test interval ID
let SimpleAdditionAutoTestIntervalId = null;

function scheduleSimpleAdditionAutoAnswer() {
  // If already running, do nothing
  if (SimpleAdditionAutoTestIntervalId) return;
  SimpleAdditionAutoTestIntervalId = setInterval(() => {
    if (!gameState.autoTestMode) return;
    // Generate a new problem
    generateSimpleAdditionProblem();
    // Decide if this answer should be correct (90%) or incorrect (10%)
    let answer;
    if (Math.random() < 0.9) {
      answer = gameState.currentProblem.correctAnswer;
    } else {
      // Generate a random incorrect answer
      let wrong;
      do {
        wrong = Math.floor(Math.random() * 19); // 0-18 possible sums
      } while (wrong === gameState.currentProblem.correctAnswer);
      answer = wrong;
    }
    const input = document.getElementById("SimpleAddition-answer-input");
    if (input && gameState.currentProblem) {
      input.value = answer;
      checkSimpleAdditionAnswer();
    }
  }, 5); // 5ms per problem
}

function clearSimpleAdditionAutoTestInterval() {
  if (SimpleAdditionAutoTestIntervalId) {
    clearInterval(SimpleAdditionAutoTestIntervalId);
    SimpleAdditionAutoTestIntervalId = null;
  }
}

function checkSimpleAdditionAnswer() {
  input = document.getElementById("SimpleAddition-answer-input");
  if (!input) return;
  const userAnswer = parseInt(input.value);
  if (isNaN(userAnswer)) {
    showSimpleAdditionFeedback("Please enter a number!", "incorrect");
    if (!gameState.quietMode) speak("Please enter a number!");
    return;
  }
  // Assume gameState.currentProblem has num1, num2, correctAnswer
  const isCorrect = userAnswer === gameState.currentProblem.correctAnswer;
  if (isCorrect) {
    gameState.stats.SimpleAddition.correct++;
    recordTry(1, gameState.currentProblem.num1, gameState.currentProblem.num2);
    decrementError(
      1,
      gameState.currentProblem.num1,
      gameState.currentProblem.num2
    );
    showSimpleAdditionFeedback(
      `🎉 Excellent! ${gameState.currentProblem.num1} + ${gameState.currentProblem.num2} = ${gameState.currentProblem.correctAnswer}`,
      "correct"
    );
    if (!gameState.settings.quietMode) {
      speak(
        `Excellent! ${gameState.currentProblem.num1} plus ${gameState.currentProblem.num2} equals ${gameState.currentProblem.correctAnswer}`
      );
    }
    setTimeout(
      () => {
        generateSimpleAdditionProblem();
      },
      gameState.autoTestMode ? 50 : 1000
    );
  } else {
    gameState.stats.SimpleAddition.wrong++;
    recordTry(1, gameState.currentProblem.num1, gameState.currentProblem.num2);
    recordError(
      1,
      gameState.currentProblem.num1,
      gameState.currentProblem.num2
    );
    showSimpleAdditionFeedback(
      `Not quite! ${gameState.currentProblem.num1} + ${gameState.currentProblem.num2} = ${gameState.currentProblem.correctAnswer}, not ${userAnswer}. Try the next one!`,
      "incorrect"
    );
    if (!gameState.quietMode) {
      speak(
        `Not quite! ${gameState.currentProblem.num1} plus ${gameState.currentProblem.num2} equals ${gameState.currentProblem.correctAnswer}, not ${userAnswer}. Let's try the next one.`
      );
    }
    generateSimpleAdditionProblem();
  }
  updateSimpleAdditionDisplay();
  gameStorage.saveGameStats(gameState.stats);
  // console.log("SimpleAddition stats:", gameState.stats);
}

function showSimpleAdditionFeedback(message, type) {
  const feedbackArea = document.getElementById("SimpleAddition-feedback-area");
  if (feedbackArea) {
    feedbackArea.innerHTML = `<div class='feedback ${type}'>${message}</div>`;
  }
}
function showSimpleAdditionHint() {
  const helper = document.getElementById("SimpleAddition-visual-helper");
  if (helper) {
    helper.classList.remove("hidden");
    helper.innerHTML = `
        <div class="visual-dots">
          <div class="dot-group">
            ${Array(gameState.currentProblem.num1)
              .fill("")
              .map(() => '<span class="dot blue">●</span>')
              .join("")}
          </div>
          <span class="plus-sign">+</span>
          <div class="dot-group">
            ${Array(gameState.currentProblem.num2)
              .fill("")
              .map(() => '<span class="dot red">●</span>')
              .join("")}
          </div>
        </div>
      `;
  }
}

function hideSimpleAdditionHint() {
  const helper = document.getElementById("SimpleAddition-visual-helper");
  if (helper) {
    helper.classList.add("hidden");
  }
}

function toggleSimpleAdditionHint() {
  const helper = document.getElementById("SimpleAddition-visual-helper");
  if (helper) {
    if (helper.classList.contains("hidden")) {
      helper.classList.remove("hidden");
      showSimpleAdditionHint();
    } else {
      helper.classList.add("hidden");
    }
  }
}

function clearSimpleAdditionFeedback() {
  const feedbackArea = document.getElementById("SimpleAddition-feedback-area");
  if (feedbackArea) {
    feedbackArea.innerHTML = "";
  }
}

function listenForSimpleAdditionAnswer() {
  const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) {
    alert("Speech recognition not supported in this browser.");
    return;
  }
  const recognition = new SpeechRecognition();
  recognition.lang = "en-US";
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;
  recognition.continuous = false;
  recognition.onresult = (event) => {
    let spoken = event.results[0][0].transcript.trim().toLowerCase();
    const digitMatch = spoken.match(/\d+/);
    let answer = digitMatch ? digitMatch[0] : null;
    if (answer !== null) {
      const input = document.getElementById("SimpleAddition-answer-input");
      if (input) {
        input.value = answer;
        input.focus();
      }
      checkSimpleAdditionAnswer();
    } else {
      const feedbackArea = document.getElementById(
        "SimpleAddition-feedback-area"
      );
      if (feedbackArea) {
        feedbackArea.innerHTML = `<div class='feedback incorrect'>Sorry, I didn't hear a number. Please try again.</div>`;
      }
    }
  };
  recognition.onerror = (err) => {
    const feedbackArea = document.getElementById(
      "SimpleAddition-feedback-area"
    );
    if (feedbackArea) {
      feedbackArea.innerHTML = `<div class='feedback incorrect'>Speech recognition error. Please try again.</div>`;
    }
  };
  recognition.start();
  const feedbackArea = document.getElementById("SimpleAddition-feedback-area");
  if (feedbackArea) {
    feedbackArea.innerHTML = `<div class='feedback hint'>Listening... Please say your answer.</div>`;
  }
}

function listenForUserName() {
  const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) {
    alert("Speech recognition not supported in this browser.");
    return;
  }
  const recognition = new SpeechRecognition();
  recognition.lang = "en-US";
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;
  recognition.onresult = (event) => {
    let spoken = event.results[0][0].transcript.trim();
    // Use only the first word if the phrase is long
    const words = spoken.split(" ");
    if (words.length > 2) {
      spoken = words[0];
    }
    gameState.userName = spoken.charAt(0).toUpperCase() + spoken.slice(1);
    localStorage.setItem("userName", gameState.userName);
    updateUserNameDisplay();
    if (!gameState.settings.quietMode) {
      speak(
        `Hi ${gameState.userName}, let's get started. First pick the game.`
      );
    }
  };
  recognition.onerror = () => {
    speak("Sorry, I didn't catch that. Please say your name again.");
  };
  recognition.start();
}

// Theme Management Methods
function applyTheme(theme) {
  const html = document.documentElement;

  // Remove existing theme attributes
  html.removeAttribute("data-theme");

  if (theme === "auto") {
    // Use system preference
    if (
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches
    ) {
      html.setAttribute("data-theme", "dark");
    } else {
      html.setAttribute("data-theme", "light");
    }

    // Listen for system theme changes
    if (window.matchMedia) {
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
      mediaQuery.addEventListener("change", (e) => {
        if (gameState.settings.theme === "auto") {
          html.setAttribute("data-theme", e.matches ? "dark" : "light");
        }
      });
    }
  } else {
    // Use explicit theme
    html.setAttribute("data-theme", theme);
  }
}

// Initialization (replaces class constructor)
function initializeGame() {
  addEventListeners();
  showScreen("welcome-screen");
  gameStorage = window.AdditionGameStorage;
  console.log("Game Storage Loaded:", gameStorage);
  const defaultSettings = {
    soundEnabled: true,
    quietMode: false,
    theme: "auto",
    difficulty: "normal",
    gamegame: 0,
  };
  gameStorage.settings = {
    ...defaultSettings,
    ...gameStorage.getSettings(),
  };

  // Initialize default stats structure
  const defaultStats = {
    beginners: { correct: 0, wrong: 0 },
    SimpleAddition: { correct: 0, wrong: 0 },
  };

  // Load stats from storage and merge with defaults
  const loadedStats = gameStorage.getGameStats() || {};
  gameState.stats = {
    beginners: { ...defaultStats.beginners, ...(loadedStats.beginners || {}) },
    SimpleAddition: {
      ...defaultStats.SimpleAddition,
      ...(loadedStats.SimpleAddition || {}),
    },
  };

  // console.log("Loaded Game Stats:", gameState.stats);
  // settings = gameStorage.getSettings();
  updateUserNameDisplay();

  // Welcome Screen Settings - Auto-save on change
  const quietMode = document.getElementById("quiet-mode");
  if (quietMode) {
    quietMode.addEventListener("change", (e) => {
      gameStorage.settings.quietMode = e.target.checked;
      gameStorage.saveSettings(gameStorage.settings);
      // console.log("Quiet Mode set to:", e.target.checked);
      gameState.settings.quietMode = e.target.checked;
    });
  }

  // Play welcome audio
  // if (!gameState.settings.quietMode) {
  //   if (!gameState.userName || gameState.userName === "Not Entered") {
  //     speak("Welcome! Please enter your name to begin.");
  //   } else {
  //     speak(`Welcome back, ${gameState.userName}!`, () => {
  //       speak("First, pick the game you want to play.");
  //     });
  //   }
  // }

  const difficulty = document.getElementById("difficulty-game");
  if (difficulty) {
    difficulty.addEventListener("change", (e) => {
      gameState.settings.difficulty = e.target.value;
      gameStorage.saveSettings(gameState.settings);
    });
  }

  // Theme Selector - Live Preview and Auto-save
  const themeSelect = document.getElementById("theme-select");
  if (themeSelect) {
    themeSelect.addEventListener("change", (e) => {
      gameState.theme = e.target.value;
      applyTheme(e.target.value);
      gameStorage.saveSettings(gameState.settings);
    });
  }

  // Automatically trigger voice input if no userName
  if (!gameState.userName || gameState.userName === "Not Entered") {
    listenForUserName();
  }

  // Ensure interaction prompt overlay is visible and on top at page load
  const interactionPrompt = document.getElementById("interaction-prompt");
  if (interactionPrompt) {
    interactionPrompt.classList.remove("hidden");
    interactionPrompt.style.zIndex = "9999";
    interactionPrompt.style.pointerEvents = "auto";
    interactionPrompt.style.visibility = "visible";
    interactionPrompt.style.opacity = "1";
    interactionPrompt.addEventListener("click", function () {
      interactionPrompt.classList.add("hidden");
      interactionPrompt.style.pointerEvents = "none";
      interactionPrompt.style.visibility = "hidden";
      interactionPrompt.style.opacity = "0";
      // Play welcome audio
      if (!gameState.settings.quietMode) {
        if (!gameState.userName || gameState.userName === "Not Entered") {
          speak("Welcome! Please enter your name to begin.");
        } else {
          speak(`Welcome back, ${gameState.userName}!`, () => {
            speak("First, pick the game you want to play.");
          });
        }
      }
    });
  }
  // beginners hint button
  const beginnersHintBtn = document.getElementById("beginners-hint-btn");
  if (beginnersHintBtn) {
    beginnersHintBtn.onclick = () => {
      // Remove any previous hint borders
      document
        .querySelectorAll("#beginners-number-grid .number-tile")
        .forEach((tile) => {
          tile.style.border = "";
        });
      // Highlight the correct number
      if (
        gameState.currentProblem &&
        typeof gameState.currentProblem.targetNumber === "number"
      ) {
        const correctTile = document.querySelector(
          `#beginners-number-grid .number-tile[data-number='${gameState.currentProblem.targetNumber}']`
        );
        if (correctTile) {
          correctTile.style.border = "1px solid red";
        }
      }
    };
  }
}
// Start the app when DOM is ready
window.addEventListener("DOMContentLoaded", initializeGame);

function startSimpleAdditionAutoTest() {
  if (typeof gameState !== "undefined") {
    gameState.autoTestMode = true;
  }
  // Show scoring arrays
  document
    .querySelectorAll("#SimpleAddition-screen .scoring-display")
    .forEach((el) => {
      el.classList.remove("hidden");
    });
  if (typeof scheduleSimpleAdditionAutoAnswer === "function") {
    scheduleSimpleAdditionAutoAnswer();
  }
}

function updateScoringDisplays(specificgame = null) {
  // Update displays for specific game or all games
  const gamesToUpdate =
    specificgame !== null
      ? [specificgame.toString()]
      : Object.keys(this.progressMatrix);

  gamesToUpdate.forEach((game) => {
    const hitsDisplay = document.getElementById(`game${game}-hits-display`);
    const errorsDisplay = document.getElementById(`game${game}-errors-display`);

    if (hitsDisplay) {
      const formattedTries = this.formatMatrix(this.progressMatrix[game].tries);
      hitsDisplay.textContent = formattedTries;
    }
    if (errorsDisplay) {
      const formattedErrors = this.formatMatrix(
        this.progressMatrix[game].errors
      );
      errorsDisplay.textContent = formattedErrors;
    }
  });
}

function stopSimpleAdditionAutoTest() {
  if (typeof gameState !== "undefined") {
    gameState.autoTestMode = false;
  }
  // Hide scoring arrays
  document
    .querySelectorAll("#SimpleAddition-screen .scoring-display")
    .forEach((el) => {
      el.classList.add("hidden");
    });
  if (typeof clearSimpleAdditionAutoTestInterval === "function") {
    clearSimpleAdditionAutoTestInterval();
  }
}

function addEventListeners() {
  // Attach event listeners
  document.getElementById("beginners-mode-btn").onclick = () =>
    setbeginnersMode(!gameState.beginnersPracticeMode);
  document.querySelectorAll(".game-card").forEach((card) => {
    card.onclick = (e) => startgame(parseInt(e.currentTarget.dataset.game));
  });
  document
    .querySelectorAll("#beginners-number-grid .number-tile")
    .forEach((tile) => {
      tile.onclick = () => {
        // Remove any hint borders when a number is clicked
        document
          .querySelectorAll("#beginners-number-grid .number-tile")
          .forEach((t) => {
            t.style.border = "";
          });
        const number = parseInt(tile.getAttribute("data-number"), 10);
        if (gameState.beginnersPracticeMode) {
          handlebeginnersPractice(number);
        } else {
          checkbeginnersAnswer(number);
        }
      };
    });

  document.getElementById("beginners-back-btn").onclick = () =>
    showScreen("welcome-screen");
  document.getElementById("SimpleAddition-back-btn").onclick = () =>
    showScreen("welcome-screen");

  const startAutoTestBtn = document.getElementById("start-auto-test-btn");
  if (startAutoTestBtn) {
    startAutoTestBtn.addEventListener("click", () => {
      startAutoTest();
      startAutoTestBtn.classList.add("hidden");
      const stopBtn = document.getElementById("stop-auto-test-btn");
      if (stopBtn) stopBtn.classList.remove("hidden");
    });
  }

  const stopAutoTestBtn = document.getElementById("stop-auto-test-btn");
  if (stopAutoTestBtn) {
    stopAutoTestBtn.addEventListener("click", () => {
      stopAutoTest();
      stopAutoTestBtn.classList.add("hidden");
      const startBtn = document.getElementById("start-auto-test-btn");
      if (startBtn) startBtn.classList.remove("hidden");
    });
  }

  const scoresOnBtn = document.getElementById("scoresOnBtn");
  if (scoresOnBtn) {
    scoresOnBtn.addEventListener("click", () => {
      showScoringDisplays();
      scoresOnBtn.classList.add("hidden");
      const scoresOffBtn = document.getElementById("scoresOffBtn");
      if (scoresOffBtn) scoresOffBtn.classList.remove("hidden");
    });
  }

  const scoresOffBtn = document.getElementById("scoresOffBtn");
  if (scoresOffBtn) {
    scoresOffBtn.addEventListener("click", () => {
      hideScoringDisplays();
      scoresOffBtn.classList.add("hidden");
      const scoresOnBtn = document.getElementById("scoresOnBtn");
      if (scoresOnBtn) scoresOnBtn.classList.remove("hidden");
    });
  }

  // beginners - Reset Button
  const beginnersResetBtn = document.getElementById("beginners-reset-btn");
  if (beginnersResetBtn) {
    beginnersResetBtn.addEventListener("click", () => {
      gameState.stats.beginners.correct = 0;
      gameState.stats.beginners.wrong = 0;
      // gameState.progressMatrix[0].tries = Array(10).fill(0);
      // gameState.progressMatrix[0].errors = Array(10).fill(0);
      updatebeginnersDisplay();
      updateScoringDisplays(0);
      gameStorage.saveGameStats(gameState.stats);
    });
  }

  // SimpleAddition - Reset Button
  const SimpleAdditionResetBtn = document.getElementById(
    "SimpleAddition-reset-btn"
  );
  if (SimpleAdditionResetBtn) {
    SimpleAdditionResetBtn.addEventListener("click", () => {
      gameState.stats.SimpleAddition.correct = 0;
      gameState.stats.SimpleAddition.wrong = 0;
      // gameState.progressMatrix[0].tries = Array(10).fill(0);
      // gameState.progressMatrix[0].errors = Array(10).fill(0);
      updateSimpleAdditionDisplay();
      updateScoringDisplays(0);
      gameStorage.saveGameStats(gameState.stats);
    });
  }
  // SimpleAddition submit answer button
  // document
  //   .getElementById("SimpleAddition-submit-btn")
  //   .addEventListener("click", checkSimpleAdditionAnswer);

  document.getElementById("SimpleAddition-new-problem-btn").onclick = () => {
    generateSimpleAdditionProblem();
    // Clear feedback area
    document.getElementById("SimpleAddition-feedback-area").innerHTML = "";
  };

  document.getElementById("SimpleAddition-submit-btn").onclick = () => {
    checkSimpleAdditionAnswer();
  };

  document
    .getElementById("SimpleAddition-hint-btn")
    .addEventListener("click", toggleSimpleAdditionHint);

  document.getElementById("SimpleAddition-speech-btn").onclick = () =>
    listenForSimpleAdditionAnswer();

  document
    .getElementById("SimpleAddition-answer-input")
    .addEventListener("keydown", function (e) {
      if (e.key === "Enter") {
        checkSimpleAdditionAnswer();
      }
    });
  // Personalization: Clear Name button
  const clearNameBtn = document.getElementById("clear-user-name-btn");
  if (clearNameBtn) {
    clearNameBtn.addEventListener("click", () => {
      clearUserName();
    });
  }
  document.querySelectorAll(".game-card").forEach((card) => {
    card.addEventListener("click", (e) => {
      const game = parseInt(e.currentTarget.dataset.game);
      startgame(game);
    });
  });
}
