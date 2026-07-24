// js/game.js
import { saveGameState } from './storage.js';
import { showScreen, switchScreen, updateHomeScreenUI, popXPNotif, updateNavXP, triggerConfetti } from './ui.js';
import { QUESTIONS, COUNTRY_DATA, ACHIEVEMENTS } from './data.js';
import { loadStats, saveStats, calculateLevel } from './storage.js';
import { sound } from './audio.js';

const CONFIG = { Q_PER_GAME: 10, TIMER: 20, BASE_XP: 100, BONUS_XP: 50 };

let state = { diff: 'medium', pool: [], idx: 0, xp: 0, answered: false, timer: null, timeLeft: 0, startT: 0, wrongs: [], fasts: 0, correct: 0, isDaily: false };

const $ = (s) => document.querySelector(s);
const $$ = (s) => [...document.querySelectorAll(s)];

function shuffle(arr) {
  let a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function startGame(isDaily = false) {
  state.isDaily = isDaily;
  if(isDaily){
    // Use fixed daily subset based on date (simple pseudo-random representation)
    const daySeed = new Date().getDate();
    state.pool = shuffle(QUESTIONS).slice(0, CONFIG.Q_PER_GAME);
  } else {
    let diff = $('.diff-btn.selected').dataset.diff;
    let filtered = QUESTIONS.filter(q => q.difficulty === diff);
    state.pool = shuffle(filtered).slice(0, CONFIG.Q_PER_GAME);
  }
  
  if(state.pool.length < CONFIG.Q_PER_GAME) state.pool = [...state.pool, ...shuffle(QUESTIONS).slice(0, CONFIG.Q_PER_GAME - state.pool.length)];

  state.idx = 0; state.xp = 0; state.wrongs = []; state.fasts = 0; state.correct = 0; state.startT = Date.now();
  $('#score-display').textContent = '0';
  showScreen('quiz');
  setTimeout(() => loadQuestion(), 300);
}

function loadQuestion() {
  let q = state.pool[state.idx];
  state.answered = false; state.timeLeft = CONFIG.TIMER;
  $('#category-badge').textContent = q.category;
  $('#difficulty-badge').textContent = q.difficulty;
  
  let pct = ((state.idx + 1) / CONFIG.Q_PER_GAME) * 100;
  $('#progress-fill').style.width = `${pct}%`;
  $('#progress-label').textContent = `${state.idx + 1} / ${CONFIG.Q_PER_GAME}`;
  $('#fp-plane').style.left = `calc(${pct}% - 10px)`;

  $('#question-icon').textContent = q.emoji;
  $('#question-text').textContent = q.question;
  
  const opts = $$('.option-btn');
  opts.forEach((btn, i) => {
    btn.disabled = false; btn.className = 'opt-btn option-btn';
    btn.innerHTML = `<span class="opt-letter">${['A','B','C','D'][i]}</span>${q.options[i]}`;
  });
  
  $('#feedback-bar').className = 'feedback-bar'; $('#feedback-text').textContent = '';
  $('#next-btn').disabled = true; $('#skip-btn').disabled = false;
  
  updateTimerUI(CONFIG.TIMER);
  startTimer();
}

function startTimer() {
  clearInterval(state.timer);
  state.qStart = Date.now();
  state.timer = setInterval(() => {
    state.timeLeft--; updateTimerUI(state.timeLeft);
    if(state.timeLeft <= 0) { clearInterval(state.timer); onTimeUp(); }
  }, 1000);
}

function updateTimerUI(sec) {
  let offset = (175.9) * (1 - (sec / CONFIG.TIMER));
  $('#timer-ring').style.strokeDashoffset = offset;
  $('#timer-num').textContent = sec;
  $('#timer-ring').classList.remove('warn', 'danger');
  if (sec <= 5) $('#timer-ring').classList.add('danger');
  else if (sec <= 10) $('#timer-ring').classList.add('warn');
}

function onTimeUp() {
  state.answered = true;
  let q = state.pool[state.idx];
  $$('.option-btn')[q.correct].classList.add('correct');
  state.wrongs.push({ q: q.question, c: null, a: q.options[q.correct] });
  sound.wrong();
  $('#feedback-bar').className = 'feedback-bar show skip-fb'; $('#feedback-text').textContent = '⏱ Time out!';
  $('#next-btn').disabled = false; $('#skip-btn').disabled = true;
}

function recordAnswerScore(isCorrect) {
    if (isCorrect) {
        gameState.totalCorrect++;
        gameState.xp += 100; // Add XP for correct answers
    }
    gameState.qsAnswered++;
}

function endExpedition() {
    gameState.gamesPlayed++;
    
    // 1. Save updated state to localStorage (storage.js)
    saveGameState(gameState); 
    
    // 2. Force the home screen UI to re-render the new XP & stats
    updateHomeScreenUI(); 

    // 3. Switch back to home
    switchScreen('screen-home');
}

export function handleAnswer(idx) {
  if (state.answered) return;
  state.answered = true; clearInterval(state.timer);
  
  let q = state.pool[state.idx];
  let isC = (idx === q.correct);
  let el = (Date.now() - state.qStart) / 1000;
  
  let opts = $$('.option-btn');
  opts.forEach(b => b.disabled = true);
  opts[idx].classList.add(isC ? 'correct' : 'wrong');
  
  if (isC) {
    opts[idx].classList.add('correct');
    state.correct++;
    if(el < 5) state.fasts++;
    sound.correct();
    let bonus = Math.round((state.timeLeft / CONFIG.TIMER) * CONFIG.BONUS_XP);
    let pts = CONFIG.BASE_XP + bonus;
    state.xp += pts;
    $('#score-display').textContent = state.xp;
    popXPNotif(pts);
    $('#feedback-bar').className = 'feedback-bar show correct-fb'; $('#feedback-text').textContent = `✅ Correct! +${pts} XP`;
  } else {
    opts[q.correct].classList.add('correct');
    state.wrongs.push({ q: q.question, c: q.options[idx], a: q.options[q.correct] });
    sound.wrong();
    $('#feedback-bar').className = 'feedback-bar show wrong-fb'; $('#feedback-text').textContent = `❌ Wrong answer`;
  }
  
  $('#next-btn').disabled = false; $('#skip-btn').disabled = true;
  
  // Show learn card after brief delay
  setTimeout(() => showLearnCard(q, isC, isC ? (CONFIG.BASE_XP + Math.round((state.timeLeft / CONFIG.TIMER) * CONFIG.BONUS_XP)) : 0), 1200);
}

export function handleSkip() {
  if (state.answered) return;
  state.answered = true; clearInterval(state.timer);
  let q = state.pool[state.idx];
  $$('.option-btn')[q.correct].classList.add('correct');
  state.wrongs.push({ q: q.question, c: 'Skipped', a: q.options[q.correct] });
  $('#feedback-bar').className = 'feedback-bar show skip-fb'; $('#feedback-text').textContent = `⏭ Skipped.`;
  $('#next-btn').disabled = false; $('#skip-btn').disabled = true;
  setTimeout(() => showLearnCard(q, false, 0), 1000);
}

function showLearnCard(q, isC, xpEarned) {
  let cData = COUNTRY_DATA[q.country];
  if(!cData) { advanceQuestion(); return; } // fallback
  
  $('#learn-flag').textContent = cData.emoji;
  $('#learn-country').textContent = q.country;
  $('#learn-continent').textContent = cData.cont;
  $('#learn-fact').textContent = cData.fact;
  $('#learn-cap').textContent = cData.capital;
  $('#learn-pop').textContent = cData.pop;
  $('#learn-cur').textContent = cData.curr;
  $('#learn-ani').textContent = cData.anim;
  
  let stamp = $('#learn-stamp');
  if(isC) {
    stamp.className = 'lc-stamp';
    stamp.innerHTML = '<div class="lc-stamp-inner">STAMPED<br>✓</div>';
    $('#learn-xp-earned').textContent = `+${xpEarned} XP Earned!`;
    $('#learn-xp-earned').style.color = 'var(--correct)';
  } else {
    stamp.className = 'lc-stamp wrong';
    stamp.innerHTML = '<div class="lc-stamp-inner">MISSED<br>✗</div>';
    $('#learn-xp-earned').textContent = 'Study this for next time!';
    $('#learn-xp-earned').style.color = 'var(--wrong)';
  }
  
  $('#learn-overlay').classList.remove('hidden');
}

export function advanceQuestion() {
  $('#learn-overlay').classList.add('hidden');
  
  // Save passport stamp immediately if correct
  if(state.answered && $$('.option-btn')[state.pool[state.idx].correct].classList.contains('correct') && !state.wrongs.find(w => w.q === state.pool[state.idx].question)){
    let s = loadStats();
    let c = state.pool[state.idx].country;
    if(c && !s.stamps[c]) {
      s.stamps[c] = Date.now();
      saveStats(s);
    }
  }

  state.idx++;
  if (state.idx >= CONFIG.Q_PER_GAME) endGame();
  else loadQuestion();
}

function endGame() {
  let s = loadStats();
  let acc = Math.round((state.correct / CONFIG.Q_PER_GAME) * 100);
  let time = Math.round((Date.now() - state.startT) / 1000);
  
  let isHigh = state.xp > (s.highScore || 0);
  if(isHigh) s.highScore = state.xp;
  
  s.gamesPlayed++;
  s.qsAnswered += CONFIG.Q_PER_GAME;
  s.totalCorrect += state.correct;
  s.totalTime += time;
  s.xp += state.xp;
  if(acc > (s.bestAccuracy || 0)) s.bestAccuracy = acc;
  
  let oldLvl = s.level;
  s.level = calculateLevel(s.xp);
  if(s.level > oldLvl) sound.levelup();
  else sound.achievement();

  if(state.isDaily) {
    s.dailyStreak++;
    s.lastPlayedDate = new Date().toDateString();
  }

  // Check achievements
  let newBadges = [];
  let resObj = { accuracy: acc, fastAnswers: state.fasts, correct: state.correct };
  ACHIEVEMENTS.forEach(a => {
    if(a.check(s, resObj) && !s.unlockedBadges.includes(a.id)) {
      s.unlockedBadges.push(a.id);
      newBadges.push(a);
    }
  });
  
  saveStats(s);
  updateNavXP();
  
  // Populate results
  $('#final-score').textContent = state.xp;
  $('#res-accuracy').textContent = `${acc}%`;
  $('#res-time').textContent = `${time}s`;
  $('#res-fast').textContent = state.fasts;
  $('#res-streak').textContent = s.dailyStreak;
  $('#new-high-badge').style.display = isHigh ? 'inline-block' : 'none';
  
  // Review list
  const rev = $('#review-list');
  rev.innerHTML = '';
  if(state.wrongs.length === 0) {
    rev.innerHTML = '<div style="text-align:center; padding:10px;">Flawless expedition!</div>';
  } else {
    state.wrongs.forEach(w => {
      rev.innerHTML += `<div class="review-item"><div class="review-q">${w.q}</div><div class="review-answers"><span class="your-ans">❌ Yours: ${w.c || 'Time Out'}</span><span class="right-ans">✅ Correct: ${w.a}</span></div></div>`;
    });
  }

  // Badges list
  const bg = $('#badges-grid-results');
  bg.innerHTML = '';
  if(newBadges.length === 0) $('#res-achievements-sec').style.display = 'none';
  else {
    $('#res-achievements-sec').style.display = 'block';
    newBadges.forEach(b => bg.innerHTML += `<div class="badge-card unlocked"><span class="badge-icon">${b.icon}</span><div class="badge-info"><span class="badge-name">${b.name}</span><span class="badge-desc">${b.desc}</span></div></div>`);
  }
  
  showScreen('results');
  if(acc >= 70) setTimeout(triggerConfetti, 400);
}
