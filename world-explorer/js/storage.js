// js/storage.js
import { LEVELS } from './data.js';

const CONFIG = { LS_KEY: 'countriesQuiz_v3' };

export function loadStats() {
  const defaults = {
    gamesPlayed: 0, qsAnswered: 0, totalCorrect: 0, totalTime: 0, 
    highScore: null, bestAccuracy: null, xp: 0, level: 1, 
    unlockedBadges: [], stamps: {}, dailyStreak: 0, lastPlayedDate: null
  };
  try {
    const raw = localStorage.getItem(CONFIG.LS_KEY);
    return raw ? { ...defaults, ...JSON.parse(raw) } : defaults;
  } catch { return defaults; }
}

export function saveStats(stats) {
  try { localStorage.setItem(CONFIG.LS_KEY, JSON.stringify(stats)); } catch {}
}

export function calculateLevel(xp) {
  let levelIdx = 0;
  for (let i = 0; i < LEVELS.length; i++) {
    if (xp >= LEVELS[i].xp) levelIdx = i;
  }
  return levelIdx + 1;
}
