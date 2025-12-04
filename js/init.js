// Simple game initialization
console.log("🎮 TRULY Simple - Just load and play!");

window.addEventListener("DOMContentLoaded", () => {
  // beginners mode switch button
  const beginnersModeBtn = document.getElementById("beginners-mode-btn");
  if (beginnersModeBtn) {
    beginnersModeBtn.onclick = () => {
      console.log(
        "Mode button clicked, current mode:",
        gameState.beginnersPracticeMode
      );
      setbeginnersMode(!gameState.beginnersPracticeMode);
    };
  }
  // beginners number tile click listeners
  document
    .querySelectorAll("#beginners-number-grid .number-tile")
    .forEach((tile) => {
      tile.onclick = () => {
        const number = parseInt(tile.getAttribute("data-number"), 10);
        if (gameState.beginnersPracticeMode) {
          handlebeginnersPractice(number);
        } else {
          checkbeginnersAnswer(number);
        }
      };
    });
  // Back button event listeners
  const beginnersBackBtn = document.getElementById("beginners-back-btn");
  if (beginnersBackBtn) {
    beginnersBackBtn.onclick = () => {
      console.log("🔙 beginners Back button clicked");
      showScreen("welcome-screen");
    };
  }
  const SimpleAdditionBackBtn = document.getElementById(
    "SimpleAddition-back-btn"
  );
  if (SimpleAdditionBackBtn) {
    SimpleAdditionBackBtn.onclick = () => {
      console.log("🔙 SimpleAddition Back button clicked");
      showScreen("welcome-screen");
    };
  }
  // Initialize game and load persistent data
  console.log("🏯 Initializing function-based game...");
  initializeGame();
  console.log("✅ Game ready!");
});
