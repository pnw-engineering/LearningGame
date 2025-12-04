// Local Storage API replacement for Addition Game
class LocalStorageAPI {
  constructor() {
    this.storageKey = "addition-game-data";
    this.currentUser = null;
    this.initializeStorage();
  }

  initializeStorage() {
    if (!localStorage.getItem(this.storageKey)) {
      const initialData = {
        users: [],
        games: [],
        lastUserId: 0,
        lastGameId: 0,
      };
      localStorage.setItem(this.storageKey, JSON.stringify(initialData));
    }
  }

  getData() {
    return JSON.parse(localStorage.getItem(this.storageKey) || "{}");
  }

  saveData(data) {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(data));
      console.log("Data saved to localStorage:", data);
    } catch (error) {
      console.error("Error saving to localStorage:", error);
    }
  }

  // User management
  async getUsers() {
    const data = this.getData();
    return { success: true, users: data.users || [] };
  }

  async createUser(userData) {
    const data = this.getData();
    const newUser = {
      id: ++data.lastUserId,
      username: userData.username,
      total_games: 0,
      average_score: 0,
      best_score: 0,
      created_at: new Date().toISOString(),
    };

    data.users.push(newUser);
    this.saveData(data);
    console.log("User created and saved:", newUser);
    console.log("Current localStorage data:", this.getData());
    return { success: true, user: newUser };
  }

  async getUser(userId) {
    const data = this.getData();
    const user = data.users.find((u) => u.id == userId);
    if (user) {
      return { success: true, user };
    }
    return { success: false, error: "User not found" };
  }

  async deleteUser(userId) {
    const data = this.getData();
    const userIndex = data.users.findIndex((u) => u.id == userId);
    if (userIndex !== -1) {
      data.users.splice(userIndex, 1);
      // Also remove user's games
      data.games = data.games.filter((g) => g.user_id != userId);
      this.saveData(data);
      return { success: true };
    }
    return { success: false, error: "User not found" };
  }

  // Game management
  async saveGameResult(gameData) {
    const data = this.getData();
    const newGame = {
      id: ++data.lastGameId,
      user_id: gameData.user_id,
      score: gameData.score,
      total_questions: gameData.total_questions,
      correct_answers: gameData.correct_answers,
      time_taken: gameData.time_taken,
      difficulty: gameData.difficulty || "medium",
      created_at: new Date().toISOString(),
    };

    data.games.push(newGame);

    // Update user statistics
    const user = data.users.find((u) => u.id == gameData.user_id);
    if (user) {
      user.total_games++;
      const userGames = data.games.filter((g) => g.user_id == gameData.user_id);
      const totalScore = userGames.reduce((sum, g) => sum + g.score, 0);
      user.average_score = Math.round(totalScore / user.total_games);
      user.best_score = Math.max(user.best_score, gameData.score);
    }

    this.saveData(data);
    return { success: true, game: newGame };
  }

  async getUserGames(userId) {
    const data = this.getData();
    const games = data.games.filter((g) => g.user_id == userId);
    return { success: true, games };
  }

  async getLeaderboard(limit = 10) {
    const data = this.getData();
    const users = [...data.users]
      .sort((a, b) => b.best_score - a.best_score)
      .slice(0, limit);
    return { success: true, users };
  }

  // Health check (for compatibility)
  async health() {
    return { success: true, status: "OK", storage: "localStorage" };
  }

  // Database inspection (for compatibility with debug pages)
  async inspect() {
    const data = this.getData();
    const totalRecords = data.users.length + data.games.length;

    return {
      success: true,
      database: "localStorage",
      timestamp: new Date().toISOString(),
      summary: {
        totalTables: 2,
        totalRecords: totalRecords,
      },
      tables: {
        users: {
          count: data.users.length,
          columns: [
            "id",
            "username",
            "total_games",
            "average_score",
            "best_score",
            "created_at",
          ],
          schema: [
            { name: "id", type: "INTEGER", nullable: false },
            { name: "username", type: "TEXT", nullable: false },
            {
              name: "total_games",
              type: "INTEGER",
              nullable: true,
              defaultValue: "0",
            },
            {
              name: "average_score",
              type: "INTEGER",
              nullable: true,
              defaultValue: "0",
            },
            {
              name: "best_score",
              type: "INTEGER",
              nullable: true,
              defaultValue: "0",
            },
            { name: "created_at", type: "TEXT", nullable: false },
          ],
          data: data.users,
        },
        games: {
          count: data.games.length,
          columns: [
            "id",
            "user_id",
            "score",
            "total_questions",
            "correct_answers",
            "time_taken",
            "difficulty",
            "created_at",
          ],
          schema: [
            { name: "id", type: "INTEGER", nullable: false },
            { name: "user_id", type: "INTEGER", nullable: false },
            { name: "score", type: "INTEGER", nullable: false },
            { name: "total_questions", type: "INTEGER", nullable: false },
            { name: "correct_answers", type: "INTEGER", nullable: false },
            { name: "time_taken", type: "INTEGER", nullable: true },
            {
              name: "difficulty",
              type: "TEXT",
              nullable: true,
              defaultValue: "medium",
            },
            { name: "created_at", type: "TEXT", nullable: false },
          ],
          data: data.games,
        },
      },
      data: data,
    };
  }

  // Export data
  exportData() {
    return this.getData();
  }

  // Import data
  importData(data) {
    this.saveData(data);
    return { success: true };
  }

  // Clear all data
  clearData() {
    localStorage.removeItem(this.storageKey);
    this.initializeStorage();
    return { success: true };
  }
}

// Create global API instance
window.api = new LocalStorageAPI();
