// Addition Game for Elementary Kids - Single Screen Implementation
class AdditionGame {
  // beginners: Generate and prompt a random number for test mode
  generateAndPromptbeginnersNumber() {
    // Pick a random number 0-9
    const targetNumber = Math.floor(Math.random() * 10);
    this.currentProblem = { targetNumber };
    const instruction = document.getElementById("beginners-instruction");
    if (instruction) {
      instruction.textContent = `Find the number ${targetNumber}!`;
    }
    if (!this.settings.quietMode) {
      this.speak(`Find the number ${targetNumber}!`);
    }
    // Reset feedback and tile highlights
    this.clearbeginnersFeedback();
    this.resetbeginnersTiles();
    this._beginnersFeedbackSpoken = false;
  }
  handlebeginnersPractice(number) {
    // Announce the number touched only once
    const instruction = document.getElementById("beginners-instruction");
    if (instruction)
      instruction.textContent = `That is the number ${number}. Touch another number!`;
    if (!this.settings.quietMode) {
      // Cancel any ongoing speech before speaking the new number
      if (window.speechSynthesis) window.speechSynthesis.cancel();
      this.speak(`That is the number ${number}. Touch another number!`);
    }
  }
  setbeginnersMode(practice) {
    console.log("setbeginnersMode called with practice:", practice);
    this.beginnersPracticeMode = practice;
    // Cancel any ongoing speech immediately when toggling mode
    if (window.speechSynthesis) window.speechSynthesis.cancel();
    const btn = document.getElementById("beginners-mode-btn");
    const instruction = document.getElementById("beginners-instruction");
    console.log("Button element:", btn);
    console.log("Instruction element:", instruction);
    if (btn) {
      btn.textContent = practice
        ? "Mode: Practice (Switch to Test Mode)"
        : "Mode: Test (Switch to Practice Mode)";
      console.log("Button text set to:", btn.textContent);
    }
    if (practice) {
      // Practice mode: prompt and wait for touch
      if (instruction)
        instruction.textContent =
          "Touch a number and I will tell you what it is.";
      this.clearbeginnersPromptTimer();
      if (!this.settings.quietMode) {
        this.speak("Touch a number and I will tell you what it is.");
      }
    } else {
      // Test mode: start normal prompt loop
      this.generateAndPromptbeginnersNumber();
    }
  }
  // beginners - Number Recognition Methods
  initbeginners() {
    this.resetbeginnersStats();
    this.updatebeginnersDisplay();
    this.clearbeginnersPromptTimer();
    // Always update button to show current mode
    this.setbeginnersMode(
      this.beginnersPracticeMode === undefined
        ? true
        : this.beginnersPracticeMode
    );
  }
  // Utility: Format matrix for display
  formatMatrix(matrix) {
    if (Array.isArray(matrix[0])) {
      // 2D matrix (SimpleAddition)
      return matrix.map((row) => row.join(", ")).join(" | ");
    } else {
      // 1D array (beginners)
      return matrix.join(", ");
    }
  }

  // Utility: Record a try for a given game/problem
  recordTry(game, i, j) {
    if (game === 0) {
      this.progressMatrix[0].tries[i]++;
    } else if (game === 1) {
      this.progressMatrix[1].tries[i][j]++;
    }
  }

  // Utility: Record an error for a given game/problem
  recordError(game, i, j) {
    if (game === 0) {
      this.progressMatrix[0].errors[i]++;
    } else if (game === 1) {
      this.progressMatrix[1].errors[i][j]++;
    }
  }

  // Utility: Decrement error count (minimum 0)
  decrementError(game, i, j) {
    if (game === 0) {
      this.progressMatrix[0].errors[i] = Math.max(
        0,
        this.progressMatrix[0].errors[i] - 1
      );
    } else if (game === 1) {
      this.progressMatrix[1].errors[i][j] = Math.max(
        0,
        this.progressMatrix[1].errors[i][j] - 1
      );
    }
  }
  // Load settings from storage
  loadSettings() {
    this.settings = this.gameStorage.getSettings();
    // Add any additional settings logic here if needed
  }
  // Show the requested screen and hide others
  showScreen(screenId) {
    // Cancel any ongoing speech immediately when changing screens
    if (window.speechSynthesis) window.speechSynthesis.cancel();
    // Hide all screens
    document.querySelectorAll(".screen").forEach((screen) => {
      screen.classList.add("hidden");
    });
    // Show the requested screen
    const target = document.getElementById(screenId);
    if (target) target.classList.remove("hidden");
  }
  // beginners prompt repeat timer
  beginnersPromptTimer = null;
  beginnersPracticeMode = true;
  constructor() {
    this.currentProblem = null;
    this.startTime = null;
    this.gameStorage = window.AdditionGameStorage;
    const defaultSettings = {
      soundEnabled: true,
      quietMode: false,
      theme: "auto",
      difficulty: "normal",
      gamegame: 0,
    };
    this.settings = { ...defaultSettings, ...this.gameStorage.getSettings() };
    this.stats = this.gameStorage.getGameStats();
    this.currentGamegame = this.settings.gamegame || 0;
    this.speechSynthesis = window.speechSynthesis;

    // Testing mode for scoring logic observation
    this.autoTestMode = false;
    this.autoTestInterval = null;
    this.autoAnswerDelay = 100; // Fast speed for rapid testing

    // Backend Guidelines: Internal Scoring Arrays
    // Simple tracking for adaptive problem selection
    this.progressMatrix = {
      // beginners (Number Recognition): 1D array for numbers 0-9
      0: {
        tries: Array(10).fill(0),
        errors: Array(10).fill(0),
      },
      // SimpleAddition (Single Addition): 10x10 matrix for number combinations
      1: {
        tries: Array(10)
          .fill(null)
          .map(() => Array(10).fill(0)),
        errors: Array(10)
          .fill(null)
          .map(() => Array(10).fill(0)),
      },
    }; // game definitions
    this.games = {
      0: {
        name: "Number Recognition",
        description: "Touch the number you hear! 🔢",
        icon: "🔤",
      },
      1: {
        name: "Single Digit Addition",
        description: "Add two numbers (0-9) 🧮",
        icon: "➕",
      },
    };

    // Personalization: User Name
    this.userName = localStorage.getItem("userName") || "";

    this.init();
  }

  init() {
    this.showScreen("welcome-screen");
    this.setupEventListeners();
    // this.loadSettings(); // Already done in constructor
    this.checkOnlineStatus();
    this.updateScoringDisplays();

    // Personalization: Show name on all screens
    this.updateUserNameDisplay();
    // Name prompting now happens after user interaction in init.js

    // Hide scoring displays (only show during auto-test)
    setTimeout(() => {
      this.hideScoringDisplays();
    }, 100);
  }

  updateScoringDisplays(specificgame = null) {
    // Update displays for specific game or all games
    const gamesToUpdate =
      specificgame !== null
        ? [specificgame.toString()]
        : Object.keys(this.progressMatrix);

    gamesToUpdate.forEach((game) => {
      const hitsDisplay = document.getElementById(`game${game}-hits-display`);
      const errorsDisplay = document.getElementById(
        `game${game}-errors-display`
      );

      if (hitsDisplay) {
        const formattedTries = this.formatMatrix(
          this.progressMatrix[game].tries
        );
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

  setupEventListeners() {
    // Cancel speech on any button press
    document.querySelectorAll("button").forEach((btn) => {
      btn.addEventListener("click", () => {
        if (window.speechSynthesis) window.speechSynthesis.cancel();
      });
    });
    // Personalization: Clear Name button
    const clearNameBtn = document.getElementById("clear-user-name-btn");
    if (clearNameBtn) {
      clearNameBtn.addEventListener("click", () => {
        this.clearUserName();
      });
    }
    // Welcome Screen - game Selection
    document.querySelectorAll(".game-card").forEach((card) => {
      card.addEventListener("click", (e) => {
        const game = parseInt(e.currentTarget.dataset.game);
        this.startgame(game);
      });
    });

    // Settings Button
    // Welcome Screen Settings - Auto-save on change
    const quietMode = document.getElementById("quiet-mode");
    if (quietMode) {
      quietMode.addEventListener("change", (e) => {
        this.settings.quietMode = e.target.checked;
        this.gameStorage.saveSettings(this.settings);
      });
    }

    const difficulty = document.getElementById("difficulty-game");
    if (difficulty) {
      difficulty.addEventListener("change", (e) => {
        this.settings.difficulty = e.target.value;
        this.gameStorage.saveSettings(this.settings);
      });
    }

    // Theme Selector - Live Preview and Auto-save
    const themeSelect = document.getElementById("theme-select");
    if (themeSelect) {
      themeSelect.addEventListener("change", (e) => {
        this.settings.theme = e.target.value;
        this.applyTheme(e.target.value);
        this.gameStorage.saveSettings(this.settings);
      });
    }

    // beginners - Number Recognition
    const beginnersBackBtn = document.getElementById("beginners-back-btn");
    if (beginnersBackBtn) {
      beginnersBackBtn.addEventListener("click", () => {
        if (window.speechSynthesis) window.speechSynthesis.cancel();
        this.showScreen("welcome-screen");
      });
    }

    const beginnersPlayBtn = document.getElementById("beginners-play-btn");
    if (beginnersPlayBtn) {
      beginnersPlayBtn.addEventListener("click", () => {
        this.playbeginnersNumber();
      });
    }

    const beginnersHintBtn = document.getElementById("beginners-hint-btn");
    if (beginnersHintBtn) {
      beginnersHintBtn.addEventListener("click", () => {
        this.showbeginnersHint();
      });
    }

    document
      .querySelectorAll("#beginners-number-grid .number-tile")
      .forEach((tile) => {
        tile.addEventListener("click", (e) => {
          const number = parseInt(e.currentTarget.dataset.number);
          if (this.beginnersPracticeMode) {
            this.handlebeginnersPractice(number);
          } else {
            this.checkbeginnersAnswer(number);
          }
        });
      });

    // SimpleAddition - Addition
    const SimpleAdditionBackBtn = document.getElementById(
      "SimpleAddition-back-btn"
    );
    if (SimpleAdditionBackBtn) {
      SimpleAdditionBackBtn.addEventListener("click", () => {
        this.showScreen("welcome-screen");
      });
    }

    const SimpleAdditionSubmitBtn = document.getElementById(
      "SimpleAddition-submit-btn"
    );
    if (SimpleAdditionSubmitBtn) {
      SimpleAdditionSubmitBtn.addEventListener("click", () => {
        this.checkSimpleAdditionAnswer();
      });
    }

    const SimpleAdditionHintBtn = document.getElementById(
      "SimpleAddition-hint-btn"
    );
    if (SimpleAdditionHintBtn) {
      SimpleAdditionHintBtn.addEventListener("click", () => {
        this.toggleSimpleAdditionHint();
      });
    }

    const SimpleAdditionNewProblemBtn = document.getElementById(
      "SimpleAddition-new-problem-btn"
    );
    if (SimpleAdditionNewProblemBtn) {
      SimpleAdditionNewProblemBtn.addEventListener("click", () => {
        this.generateSimpleAdditionProblem();
      });
    }

    const SimpleAdditionAnswerInput = document.getElementById(
      "SimpleAddition-answer-input"
    );
    if (SimpleAdditionAnswerInput) {
      SimpleAdditionAnswerInput.addEventListener("keypress", (e) => {
        if (e.key === "Enter") {
          this.checkSimpleAdditionAnswer();
        }
      });
    }

    // SimpleAddition Speech Recognition Button
    const SimpleAdditionSpeechBtn = document.getElementById(
      "SimpleAddition-speech-btn"
    );
    if (SimpleAdditionSpeechBtn) {
      SimpleAdditionSpeechBtn.addEventListener("click", () => {
        this.listenForSimpleAdditionAnswer();
      });
    }

    // Auto-test controls
    const startAutoTestBtn = document.getElementById("start-auto-test-btn");
    if (startAutoTestBtn) {
      startAutoTestBtn.addEventListener("click", () => {
        this.startAutoTest();
        startAutoTestBtn.classList.add("hidden");
        const stopBtn = document.getElementById("stop-auto-test-btn");
        if (stopBtn) stopBtn.classList.remove("hidden");
      });
    }

    const stopAutoTestBtn = document.getElementById("stop-auto-test-btn");
    if (stopAutoTestBtn) {
      stopAutoTestBtn.addEventListener("click", () => {
        this.stopAutoTest();
        stopAutoTestBtn.classList.add("hidden");
        const startBtn = document.getElementById("start-auto-test-btn");
        if (startBtn) startBtn.classList.remove("hidden");
      });
    }

    // beginners - Reset Button
    const beginnersResetBtn = document.getElementById("beginners-reset-btn");
    if (beginnersResetBtn) {
      beginnersResetBtn.addEventListener("click", () => {
        this.stats.beginners.correct = 0;
        this.stats.beginners.wrong = 0;
        this.progressMatrix[0].tries = Array(10).fill(0);
        this.progressMatrix[0].errors = Array(10).fill(0);
        this.updatebeginnersDisplay();
        this.updateScoringDisplays(0);
        this.gameStorage.saveGameStats(this.stats);
      });
    }

    // SimpleAddition - Reset Button
    const SimpleAdditionResetBtn = document.getElementById(
      "SimpleAddition-reset-btn"
    );
    if (SimpleAdditionResetBtn) {
      SimpleAdditionResetBtn.addEventListener("click", () => {
        this.stats.SimpleAddition.correct = 0;
        this.stats.SimpleAddition.wrong = 0;
        this.progressMatrix[0].tries = Array(10).fill(0);
        this.progressMatrix[0].errors = Array(10).fill(0);
        this.updateSimpleAdditionDisplay();
        this.updateScoringDisplays(0);
        this.gameStorage.saveGameStats(this.stats);
      });
    }

    // beginners Practice/Test Toggle
    // const beginnersModeBtn = document.getElementById("beginners-mode-btn");
    // if (beginnersModeBtn) {
    //   beginnersModeBtn.addEventListener("click", () => {
    //     console.log(
    //       "Mode button clicked, current mode:",
    //       this.beginnersPracticeMode
    //     );
    //     this.setbeginnersMode(!this.beginnersPracticeMode);
    //   });
    // }
  }

  // SimpleAddition: Listen for spoken answer and fill input
  listenForSimpleAdditionAnswer() {
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

    console.log("[SimpleAddition] Speech recognition started");

    recognition.onresult = (event) => {
      console.log("[SimpleAddition] Speech recognition result:", event);
      let spoken = event.results[0][0].transcript.trim().toLowerCase();
      // Extract first number from spoken string
      let answer = null;
      const digitMatch = spoken.match(/\d+/);
      if (digitMatch) {
        answer = digitMatch[0];
      } else {
        // Try to convert number words to digits
        const numberWords = {
          zero: 0,
          one: 1,
          two: 2,
          three: 3,
          four: 4,
          five: 5,
          six: 6,
          seven: 7,
          eight: 8,
          nine: 9,
          ten: 10,
          eleven: 11,
          twelve: 12,
          thirteen: 13,
          fourteen: 14,
          fifteen: 15,
          sixteen: 16,
          seventeen: 17,
          eighteen: 18,
        };
        for (const [word, num] of Object.entries(numberWords)) {
          if (spoken.includes(word)) {
            answer = num;
            break;
          }
        }
      }
      if (answer !== null) {
        const input = document.getElementById("SimpleAddition-answer-input");
        if (input) {
          input.value = answer;
          input.focus();
        }
        this.checkSimpleAdditionAnswer();
      } else {
        this.showSimpleAdditionFeedback(
          "Sorry, I didn't hear a number. Please try again.",
          "incorrect"
        );
      }
    };
    recognition.onerror = (err) => {
      console.log("[SimpleAddition] Speech recognition error:", err);
      this.showSimpleAdditionFeedback(
        "Speech recognition error. Please try again.",
        "incorrect"
      );
    };
    recognition.onend = () => {
      console.log("[SimpleAddition] Speech recognition ended");
    };
    recognition.onaudiostart = () => {
      console.log("[SimpleAddition] Speech recognition audio started");
    };
    recognition.onspeechstart = () => {
      console.log("[SimpleAddition] Speech recognition speech started");
    };
    recognition.onspeechend = () => {
      console.log("[SimpleAddition] Speech recognition speech ended");
    };
    recognition.start();
    this.showSimpleAdditionFeedback(
      "Listening... Please say your answer.",
      "hint"
    );
  }

  // ...existing code...
  // }

  startgame(game) {
    this.currentGamegame = game;
    this.settings.gamegame = game;
    this.gameStorage.saveSettings(this.settings);

    if (game === 0) {
      this.showScreen("beginners-screen");
      this.initbeginners();
    } else if (game === 1) {
      this.showScreen("SimpleAddition-screen");
      this.initSimpleAddition();
    }
  }

  // Clear the repeat timer
  clearbeginnersPromptTimer() {
    if (this.beginnersPromptTimer) {
      clearTimeout(this.beginnersPromptTimer);
      this.beginnersPromptTimer = null;
    }
  }

  checkbeginnersAnswer(selectedNumber) {
    if (!this.currentProblem) {
      this.showbeginnersFeedback("Click 'Play Number' first!", "incorrect");
      return;
    }

    const isCorrect = selectedNumber === this.currentProblem.targetNumber;
    const tile = document.querySelector(`[data-number="${selectedNumber}"]`);

    if (!this._beginnersFeedbackSpoken) this._beginnersFeedbackSpoken = false;
    if (isCorrect) {
      this.clearbeginnersPromptTimer();
      if (tile) tile.classList.add("correct");
      this.stats.beginners.correct++;
      this.recordTry(0, this.currentProblem.targetNumber, 0);
      this.decrementError(0, this.currentProblem.targetNumber, 0);
      this.showbeginnersFeedback(
        `🎉 Correct! You found ${selectedNumber}!`,
        "correct"
      );
      if (!this.settings.quietMode && !this._beginnersFeedbackSpoken) {
        this.speak("Good job!", undefined, 1);
        this._beginnersFeedbackSpoken = true;
      }
      setTimeout(() => {
        this.resetbeginnersTiles();
        this.clearbeginnersFeedback();
        const instruction = document.getElementById("beginners-instruction");
        if (instruction) {
          instruction.textContent = "Great job!";
        }
        // Automatically start next round
        this.generateAndPromptbeginnersNumber();
      }, 2000);
    } else {
      if (tile) tile.classList.add("incorrect");
      this.stats.beginners.wrong++;
      this.recordTry(0, this.currentProblem.targetNumber, 0);
      this.recordError(0, this.currentProblem.targetNumber, 0);
      const errorMsg = `Try again! That was ${selectedNumber}, but we're looking for ${this.currentProblem.targetNumber}.`;
      this.showbeginnersFeedback(errorMsg, "incorrect");
      if (!this.settings.quietMode && !this._beginnersFeedbackSpoken) {
        this.speak(errorMsg, undefined, 1);
        this._beginnersFeedbackSpoken = true;
      }
      setTimeout(() => {
        if (tile) tile.classList.remove("incorrect");
      }, 1000);
    }
    this.updatebeginnersDisplay();
    this.gameStorage.saveGameStats(this.stats);
  }

  showbeginnersHint() {
    if (!this.currentProblem) {
      this.showbeginnersFeedback(
        "Click 'Play Number' first to get a hint!",
        "incorrect"
      );
      return;
    }

    const instruction = document.getElementById("beginners-instruction");
    if (instruction) {
      instruction.textContent = `Hint: Look for the number ${this.currentProblem.targetNumber}! 👀`;
    }
  }

  resetbeginnersTiles() {
    document
      .querySelectorAll("#beginners-number-grid .number-tile")
      .forEach((tile) => {
        tile.classList.remove("correct", "incorrect", "selected");
      });
  }

  clearbeginnersFeedback() {
    const feedbackArea = document.getElementById("beginners-feedback-area");
    if (feedbackArea) {
      feedbackArea.innerHTML = "";
    }
  }

  showbeginnersFeedback(message, type) {
    const feedbackArea = document.getElementById("beginners-feedback-area");
    if (feedbackArea) {
      feedbackArea.innerHTML = `
        <div class="feedback ${type}">
          <div class="feedback-text">${message}</div>
        </div>
      `;
    }
  }

  resetbeginnersStats() {
    if (!this.stats.beginners) {
      this.stats.beginners = { correct: 0, wrong: 0 };
    }
  }

  updatebeginnersDisplay() {
    const total = this.stats.beginners.correct + this.stats.beginners.wrong;
    const accuracy =
      total > 0
        ? Math.round((this.stats.beginners.correct / total) * 100)
        : 100;

    const correctEl = document.getElementById("beginners-correct");
    const wrongEl = document.getElementById("beginners-wrong");
    const accuracyEl = document.getElementById("beginners-accuracy");

    if (correctEl) correctEl.textContent = this.stats.beginners.correct;
    if (wrongEl) wrongEl.textContent = this.stats.beginners.wrong;
    if (accuracyEl) accuracyEl.textContent = `${accuracy}%`;
  }

  // SimpleAddition - Addition Methods
  initSimpleAddition() {
    this.resetSimpleAdditionStats();
    this.updateSimpleAdditionDisplay();
    this.generateSimpleAdditionProblem();
  }

  generateSimpleAdditionProblem() {
    // Intelligent selection: prioritize least-attempted combinations
    const { num1, num2 } = this.selectBalancedCombination();

    this.currentProblem = {
      num1: num1,
      num2: num2,
      correctAnswer: num1 + num2,
      startTime: Date.now(),
    };

    const num1El = document.getElementById("SimpleAddition-num1");
    const num2El = document.getElementById("SimpleAddition-num2");
    const answerInput = document.getElementById("SimpleAddition-answer-input");

    if (num1El) num1El.textContent = num1;
    if (num2El) num2El.textContent = num2;
    if (answerInput) {
      answerInput.value = "";
      // Skip focus during auto-test to prevent screen jumping
      if (!this.autoTestMode) {
        answerInput.focus();
      }
    }

    this.clearSimpleAdditionFeedback();

    // Update hint content if hint is currently visible
    const helper = document.getElementById("SimpleAddition-visual-helper");
    if (helper && !helper.classList.contains("hidden")) {
      this.showSimpleAdditionHint();
    }
  }

  // Backend Guidelines: Balanced Combination Selection
  // Selects number combinations using intelligent algorithm to ensure even coverage
  // Prioritizes combinations with errors by using success score (tries - errors)
  selectBalancedCombination() {
    const triesMatrix = this.progressMatrix[1].tries;
    const errorsMatrix = this.progressMatrix[1].errors;

    // Calculate success score matrix (tries - errors)
    // Lower scores indicate combinations needing more practice
    const successMatrix = triesMatrix.map((row, i) =>
      row.map((tries, j) => tries - errorsMatrix[i][j])
    );

    // Step 1: Calculate sum of success scores for each row (num1)
    const rowSums = successMatrix.map((row) =>
      row.reduce((sum, val) => sum + val, 0)
    );

    // Step 2: Find minimum row sum and all rows with that sum
    const minRowSum = Math.min(...rowSums);
    const candidateRows = [];
    for (let i = 0; i < rowSums.length; i++) {
      if (rowSums[i] === minRowSum) {
        candidateRows.push(i);
      }
    }

    // Step 3: Randomly select one of the lowest-scoring rows
    const selectedRow =
      candidateRows[Math.floor(Math.random() * candidateRows.length)];

    // Step 4: Within selected row, find all columns with minimum success score
    const rowData = successMatrix[selectedRow];
    const minColValue = Math.min(...rowData);
    const candidateCols = [];
    for (let j = 0; j < rowData.length; j++) {
      if (rowData[j] === minColValue) {
        candidateCols.push(j);
      }
    }

    // Step 5: Randomly select one of the lowest-scoring columns
    const selectedCol =
      candidateCols[Math.floor(Math.random() * candidateCols.length)];

    const tries = triesMatrix[selectedRow][selectedCol];
    const errors = errorsMatrix[selectedRow][selectedCol];
    const successScore = successMatrix[selectedRow][selectedCol];

    return {
      num1: selectedRow,
      num2: selectedCol,
    };
  }

  checkSimpleAdditionAnswer() {
    const input = document.getElementById("SimpleAddition-answer-input");
    if (!input) return;

    const userAnswer = parseInt(input.value);

    if (isNaN(userAnswer)) {
      this.showSimpleAdditionFeedback("Please enter a number!", "incorrect");
      return;
    }

    const isCorrect = userAnswer === this.currentProblem.correctAnswer;

    if (isCorrect) {
      this.stats.SimpleAddition.correct++;

      // Backend Guidelines: Record try (+1 attempt)
      this.recordTry(1, this.currentProblem.num1, this.currentProblem.num2);

      // Backend Guidelines: Decrement error count for correct answers (minimum 0)
      this.decrementError(
        1,
        this.currentProblem.num1,
        this.currentProblem.num2
      );

      this.showSimpleAdditionFeedback(
        `🎉 Excellent! ${this.currentProblem.num1} + ${this.currentProblem.num2} = ${this.currentProblem.correctAnswer}`,
        "correct"
      );

      setTimeout(
        () => {
          this.generateSimpleAdditionProblem();
        },
        this.autoTestMode ? 50 : 2000
      );
    } else {
      this.stats.SimpleAddition.wrong++;

      // Backend Guidelines: Record try (+1 attempt) and error (-1 point, minimum 0)
      this.recordTry(1, this.currentProblem.num1, this.currentProblem.num2);
      this.recordError(1, this.currentProblem.num1, this.currentProblem.num2);

      this.showSimpleAdditionFeedback(
        `Not quite! ${this.currentProblem.num1} + ${this.currentProblem.num2} = ${this.currentProblem.correctAnswer}, not ${userAnswer}. Try the next one!`,
        "incorrect"
      );

      setTimeout(
        () => {
          this.generateSimpleAdditionProblem();
        },
        this.autoTestMode ? 50 : 2000
      );
    }

    this.updateSimpleAdditionDisplay();
    this.gameStorage.saveGameStats(this.stats);
  }

  showSimpleAdditionHint() {
    const helper = document.getElementById("SimpleAddition-visual-helper");
    if (helper) {
      helper.classList.remove("hidden");
      helper.innerHTML = `
        <div class="visual-dots">
          <div class="dot-group">
            ${Array(this.currentProblem.num1)
              .fill("")
              .map(() => '<span class="dot blue">●</span>')
              .join("")}
          </div>
          <span class="plus-sign">+</span>
          <div class="dot-group">
            ${Array(this.currentProblem.num2)
              .fill("")
              .map(() => '<span class="dot red">●</span>')
              .join("")}
          </div>
        </div>
      `;
    }
  }

  hideSimpleAdditionHint() {
    const helper = document.getElementById("SimpleAddition-visual-helper");
    if (helper) {
      helper.classList.add("hidden");
    }
  }

  toggleSimpleAdditionHint() {
    const helper = document.getElementById("SimpleAddition-visual-helper");
    if (helper) {
      if (helper.classList.contains("hidden")) {
        helper.classList.remove("hidden");
        this.showSimpleAdditionHint();
      } else {
        helper.classList.add("hidden");
      }
    }
  }

  clearSimpleAdditionFeedback() {
    const feedbackArea = document.getElementById(
      "SimpleAddition-feedback-area"
    );
    if (feedbackArea) {
      feedbackArea.innerHTML = "";
    }
  }

  showSimpleAdditionFeedback(message, type) {
    const feedbackArea = document.getElementById(
      "SimpleAddition-feedback-area"
    );
    if (feedbackArea) {
      feedbackArea.innerHTML = `
        <div class="feedback ${type}">
          <div class="feedback-text">${message}</div>
        </div>
      `;
    }
  }

  resetSimpleAdditionStats() {
    if (!this.stats.SimpleAddition) {
      this.stats.SimpleAddition = { correct: 0, wrong: 0 };
    }
  }

  updateSimpleAdditionDisplay() {
    const total =
      this.stats.SimpleAddition.correct + this.stats.SimpleAddition.wrong;
    const accuracy =
      total > 0
        ? Math.round((this.stats.SimpleAddition.correct / total) * 100)
        : 100;

    const correctEl = document.getElementById("SimpleAddition-correct");
    const wrongEl = document.getElementById("SimpleAddition-wrong");
    const accuracyEl = document.getElementById("SimpleAddition-accuracy");

    if (correctEl) correctEl.textContent = this.stats.SimpleAddition.correct;
    if (wrongEl) wrongEl.textContent = this.stats.SimpleAddition.wrong;
    if (accuracyEl) accuracyEl.textContent = `${accuracy}%`;
  }

  // Testing Mode Methods for Scoring Logic Observation
  startAutoTest() {
    this.autoTestMode = true;

    // Show scoring displays during testing
    this.showScoringDisplays();

    // Show SimpleAddition if not already showing
    if (
      !document
        .getElementById("SimpleAddition-screen")
        .classList.contains("hidden")
    ) {
      this.generateSimpleAdditionProblem();
    } else {
      this.showScreen("SimpleAddition-screen");
      this.generateSimpleAdditionProblem();
    }

    this.scheduleAutoAnswer();
  }

  stopAutoTest() {
    this.autoTestMode = false;

    // Hide scoring displays when not testing
    this.hideScoringDisplays();

    if (this.autoTestInterval) {
      clearTimeout(this.autoTestInterval);
      this.autoTestInterval = null;
    }
  }

  // Scoring Display Visibility Control
  showScoringDisplays() {
    const displays = document.querySelectorAll(".scoring-display");
    displays.forEach((display) => {
      display.classList.remove("hidden");
    });
  }

  hideScoringDisplays() {
    // Only hide if auto-test is not running
    if (this.autoTestMode) {
      return;
    }

    const displays = document.querySelectorAll(".scoring-display");
    displays.forEach((display) => {
      display.classList.add("hidden");
    });
  }

  scheduleAutoAnswer() {
    if (!this.autoTestMode) return;

    this.autoTestInterval = setTimeout(() => {
      this.generateAutoAnswer();
    }, this.autoAnswerDelay);
  }

  generateAutoAnswer() {
    if (!this.autoTestMode || !this.currentProblem) return;

    const input = document.getElementById("SimpleAddition-answer-input");
    if (!input) return;

    let answer;
    const errorRate = 0.1; // 10% error rate

    if (Math.random() < errorRate) {
      // Generate wrong answer (within reasonable range)
      const correctAnswer = this.currentProblem.correctAnswer;
      const wrongOptions = [];

      // Add some plausible wrong answers
      for (
        let i = Math.max(0, correctAnswer - 3);
        i <= correctAnswer + 3;
        i++
      ) {
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
      answer = this.currentProblem.correctAnswer;
    }

    // Fill the input and trigger answer check
    input.value = answer;
    this.checkSimpleAdditionAnswer();

    // Schedule next auto answer only if we're still in auto-test mode
    // The timeout accounts for feedback display time
    if (this.autoTestMode) {
      setTimeout(() => {
        this.scheduleAutoAnswer();
      }, 200); // Fast iteration for rapid testing
    }
  }

  // Utility Methods
  // Personalization: Update name display everywhere
  updateUserNameDisplay() {
    // Always use the latest userName, fallback to localStorage if needed
    let name = this.userName;
    if (!name) {
      name = localStorage.getItem("userName") || "";
    }
    const displayName = name && name.length > 0 ? name : "Not Entered";
    const nameDisplay = document.getElementById("user-name-display");
    if (nameDisplay) nameDisplay.textContent = displayName;
    const beginnersName = document.getElementById("beginners-user-name");
    if (beginnersName) beginnersName.textContent = displayName;
    const SimpleAdditionName = document.getElementById(
      "SimpleAddition-user-name"
    );
    if (SimpleAdditionName) SimpleAdditionName.textContent = displayName;
  }

  // Personalization: Prompt for name with TTS and speech recognition
  promptForUserName() {
    this.speak(
      "Hi, I'm going to play some number games with you. What's your name?",
      () => {
        this.listenForUserName();
      },
      1
    );
  }

  listenForUserName() {
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
      // Remove any leading greeting if present (e.g., "I'm going to play ...")
      // Only keep the first word if the phrase is long and not a likely name
      if (spoken.toLowerCase().startsWith("i'm going to play")) {
        spoken = spoken.replace(/^i'm going to play/i, "").trim();
      }
      // If the phrase is more than 2 words, just use the first word
      const words = spoken.split(" ");
      if (words.length > 2) {
        spoken = words[0];
      }
      this.userName = spoken.charAt(0).toUpperCase() + spoken.slice(1);
      localStorage.setItem("userName", this.userName);
      this.updateUserNameDisplay();
      this.speak(
        `Hi ${this.userName}, let's get started. First pick the game.`,
        undefined,
        1
      );
    };
    recognition.onerror = () => {
      this.speak(
        "Sorry, I didn't catch that. Please say your name again.",
        () => {
          setTimeout(() => {
            this.listenForUserName();
          }, 5000);
        },
        1
      );
    };
    recognition.start();
  }

  clearUserName() {
    this.userName = "";
    localStorage.removeItem("userName");
    this.updateUserNameDisplay();
    this.promptForUserName();
  }

  speak(text, onEndCallback, repeatCountOverride) {
    console.log("speak called with text:", text);
    if (this.speechSynthesis && !this.settings.quietMode) {
      // Simple single utterance
      const utterance = new SpeechSynthesisUtterance(text);

      // Voice selection: Prefer American female voice
      const voices = this.speechSynthesis.getVoices();
      let preferred = null;

      // First, try to find a female American voice
      preferred = voices.find(
        (v) =>
          v.lang === "en-US" &&
          (v.name.toLowerCase().includes("female") ||
            v.name.toLowerCase().includes("zira") ||
            v.name.toLowerCase().includes("susan") ||
            v.name.toLowerCase().includes("samantha") ||
            v.name.toLowerCase().includes("victoria"))
      );

      // If no female voice found, try any American voice
      if (!preferred) {
        preferred = voices.find((v) => v.lang === "en-US");
      }

      // Fallback to any English voice
      if (!preferred) {
        preferred = voices.find((v) => v.lang.startsWith("en"));
      }

      // Final fallback to first available voice
      if (!preferred) {
        preferred = voices[0];
      }

      utterance.voice = preferred;
      utterance.rate = 0.75; // 75% speed as requested
      utterance.pitch = 1.0;
      utterance.volume = 1.0;

      utterance.onstart = () => {
        console.log("Speech started");
      };
      utterance.onend = () => {
        console.log("Speech ended");
        if (typeof onEndCallback === "function") {
          onEndCallback();
        }
      };
      utterance.onerror = (event) => {
        console.log("Speech error:", event.error);
      };

      console.log("Speaking with voice:", preferred ? preferred.name : "none");
      this.speechSynthesis.speak(utterance);
    } else {
      console.log("Speech synthesis not available or quiet mode enabled");
    }
  }

  // Theme Management Methods
  applyTheme(theme) {
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
          if (this.settings.theme === "auto") {
            html.setAttribute("data-theme", e.matches ? "dark" : "light");
          }
        });
      }
    } else {
      // Use explicit theme
      html.setAttribute("data-theme", theme);
    }
  }

  checkOnlineStatus() {
    // Placeholder for online/offline status
  }

  initUserName() {
    // Load from storage
    this.userName = localStorage.getItem("userName") || "";
    this.updateUserNameDisplay();

    // If not entered, prompt for name
    if (!this.userName) {
      this.promptForUserName();
    }
  }

  // ...existing code...

  // Start beginners game (Number Recognition) in practice mode
  // startPracticeMode() {
  //   const welcome = document.getElementById("welcome-screen");
  //   const beginners = document.getElementById("beginners-screen");
  //   if (welcome) welcome.classList.add("hidden");
  //   if (beginners) beginners.classList.remove("hidden");
  //   this.setbeginnersMode(true); // Start in practice mode
  // }

  // Start SimpleAddition game (Addition)
  startGame() {
    const welcome = document.getElementById("welcome-screen");
    const SimpleAddition = document.getElementById("SimpleAddition-screen");
    if (welcome) welcome.classList.add("hidden");
    if (SimpleAddition) SimpleAddition.classList.remove("hidden");
    // Add SimpleAddition initialization if needed
  }

  // Go back to welcome screen from beginners
  goToWelcomeFrombeginners() {
    const welcome = document.getElementById("welcome-screen");
    const beginners = document.getElementById("beginners-screen");
    if (beginners) beginners.classList.add("hidden");
    if (welcome) welcome.classList.remove("hidden");
  }

  // Go back to welcome screen from SimpleAddition
  goToWelcomeFromSimpleAddition() {
    const welcome = document.getElementById("welcome-screen");
    const SimpleAddition = document.getElementById("SimpleAddition-screen");
    if (SimpleAddition) SimpleAddition.classList.add("hidden");
    if (welcome) welcome.classList.remove("hidden");
  }

  // Start speech recognition for player name
  // REMOVED: startNameRecognition functionality
  /*
  startNameRecognition() {
    if ("webkitSpeechRecognition" in window || "SpeechRecognition" in window) {
      const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = "en-US";
      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript.trim();
        this.userName = transcript;
        if (
          window.AdditionGameStorage &&
          window.AdditionGameStorage.setPlayerName
        ) {
          window.AdditionGameStorage.setPlayerName(transcript);
        }
        this.updateUserNameDisplay();
        if (this.settings.soundEnabled) {
          this.speak(`Hello, ${transcript}!`);
        }
      };
      recognition.onerror = (event) => {
        console.error("Speech recognition error:", event.error);
      };
      recognition.start();
    } else {
      console.warn("Speech recognition not supported");
    }
  }
  */
}
// Make AdditionGame globally available
window.AdditionGame = AdditionGame;
