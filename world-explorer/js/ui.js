// js/ui.js
import { COUNTRY_DATA, ACHIEVEMENTS, LEVELS } from './data.js';
import { loadStats } from './storage.js';

const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => [...document.querySelectorAll(sel)];

const screens = {
  home: $('#screen-home'), quiz: $('#screen-quiz'), results: $('#screen-results'),
  encyclopedia: $('#screen-encyclopedia'), passport: $('#screen-passport'), map: $('#screen-map'), stats: $('#screen-stats')
};

export function showScreen(name) {
  // 1. Unfocus active element to prevent the ARIA warning
  if (document.activeElement && document.activeElement instanceof HTMLElement) {
    document.activeElement.blur();
  }

  // 2. Hide inactive screens and reveal target screen
  Object.entries(screens).forEach(([key, el]) => {
    if (!el) return;
    if (key === name) {
      setTimeout(() => { 
        el.classList.add('active'); 
        el.classList.remove('exit'); 
        el.removeAttribute('aria-hidden');
        el.removeAttribute('inert');
      }, 20);
    } else {
      el.classList.add('exit'); 
      el.classList.remove('active');
      el.setAttribute('aria-hidden', 'true');
      el.setAttribute('inert', ''); // Prevents descendant focus completely
    }
  });

  $$('.nav-tab').forEach(t => t.classList.toggle('active', t.dataset.target === name));
}

export function switchScreen(targetScreenId) {
    // 1. Remove focus from active elements to clear the ARIA warning
    if (document.activeElement) {
        document.activeElement.blur();
    }

    // 2. Hide all screens and show target screen
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
        screen.setAttribute('aria-hidden', 'true');
    });

    const activeScreen = document.getElementById(targetScreenId);
    activeScreen.classList.add('active');
    activeScreen.removeAttribute('aria-hidden');
}

export function updateNavXP() {
  const stats = loadStats();
  $('#nav-level').textContent = `Lvl ${stats.level}`;
  const currLvlInfo = LEVELS[stats.level - 1];
  const nextLvlInfo = LEVELS[stats.level] || currLvlInfo;
  
  const xpInLevel = stats.xp - currLvlInfo.xp;
  const xpNeeded = nextLvlInfo.xp === currLvlInfo.xp ? 1 : nextLvlInfo.xp - currLvlInfo.xp;
  const pct = Math.min(100, Math.max(0, (xpInLevel / xpNeeded) * 100));
  
  $('#nav-xp-fill').style.width = `${pct}%`;
  $('#nav-xp-text').textContent = stats.level === LEVELS.length ? 'MAX LEVEL' : `${stats.xp} / ${nextLvlInfo.xp} XP`;

  if(screens.home.classList.contains('active')){
    $('#home-lvl-num').textContent = stats.level;
    $('#home-lvl-name').textContent = currLvlInfo.name;
    $('#home-xp-fill').style.width = `${pct}%`;
    $('#home-xp-text').textContent = stats.level === LEVELS.length ? 'MAX' : `${xpNeeded - xpInLevel} XP to next rank`;
  }
}

export function updateHomeScreenUI() {
  const s = loadStats();
  $('#stat-high-score').textContent = s.highScore !== null ? s.highScore : '—';
  $('#stat-games-played').textContent = s.gamesPlayed;
  $('#stat-best-accuracy').textContent = s.bestAccuracy !== null ? s.bestAccuracy + '%' : '—';
  $('#daily-streak-badge').textContent = `${s.dailyStreak}🔥`;
  updateNavXP();
}

// Keep an alias in case other files call refreshHomeStats
export const refreshHomeStats = updateHomeScreenUI;

export function popXPNotif(amount) {
  const notif = $('#xp-notif');
  notif.textContent = `+${amount} XP`;
  notif.classList.remove('pop');
  void notif.offsetWidth;
  notif.classList.add('pop');
}

export function generateStars() {
  const container = $('#bg-stars');
  for (let i = 0; i < 60; i++) {
    const star = document.createElement('div');
    star.style.cssText = `position:absolute; width:2px; height:2px; background:rgba(255,255,255,${0.2+Math.random()*0.4}); border-radius:50%; left:${Math.random()*100}%; top:${Math.random()*100}%; box-shadow: 0 0 4px rgba(255,255,255,0.4);`;
    container.appendChild(star);
  }
}

export function triggerConfetti() {
  const canvas = $('#confetti-canvas');
  const ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth; canvas.height = window.innerHeight;
  const COLORS = ['#c9a227','#1a2744','#1d4a2f','#e8c547'];
  const particles = Array.from({ length: 140 }, () => ({
    x: Math.random() * canvas.width, y: -Math.random() * canvas.height * 0.5,
    size: 6 + Math.random() * 8, color: COLORS[Math.floor(Math.random() * COLORS.length)],
    speedX: (Math.random() - 0.5) * 3, speedY: 2 + Math.random() * 4,
    spin: (Math.random() - 0.5) * 0.3, angle: Math.random() * Math.PI * 2, opacity: 1,
  }));
  let animId;
  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    let active = 0;
    particles.forEach(p => {
      p.x += p.speedX; p.y += p.speedY; p.angle += p.spin; p.speedY += 0.06;
      if (p.y > canvas.height * 0.8) p.opacity -= 0.02;
      if (p.opacity > 0) {
        active++; ctx.save(); ctx.globalAlpha = Math.max(0, p.opacity);
        ctx.translate(p.x, p.y); ctx.rotate(p.angle); ctx.fillStyle = p.color;
        ctx.fillRect(-p.size/2, -p.size/4, p.size, p.size/2); ctx.restore();
      }
    });
    if (active > 0) animId = requestAnimationFrame(draw);
    else { ctx.clearRect(0,0,canvas.width,canvas.height); cancelAnimationFrame(animId); }
  }
  draw();
  setTimeout(() => { cancelAnimationFrame(animId); ctx.clearRect(0,0,canvas.width,canvas.height); }, 5000);
}

export function renderEncyclopedia() {
  const grid = $('#enc-grid');
  grid.innerHTML = '';
  const s = loadStats();
  Object.entries(COUNTRY_DATA).forEach(([name, c]) => {
    const isMastered = s.stamps[name];
    grid.innerHTML += `
      <div class="enc-card" data-cont="${c.cont}">
        <div class="enc-card-header">
          <span class="enc-flag">${c.emoji}</span>
          <div>
            <div class="enc-country-name">${name}</div>
            <div class="enc-continent-tag">${c.cont} ${isMastered ? '<span class="enc-mastered-badge">✓ Explored</span>' : ''}</div>
          </div>
        </div>
        <div class="enc-card-body">
          <div class="enc-fact"><span class="enc-fact-key">Capital</span><span class="enc-fact-val">${c.capital}</span></div>
          <div class="enc-fact"><span class="enc-fact-key">Population</span><span class="enc-fact-val">${c.pop}</span></div>
          <div class="enc-fact"><span class="enc-fact-key">Currency</span><span class="enc-fact-val">${c.curr}</span></div>
          <div class="enc-funfact-snip">"${c.fact}"</div>
        </div>
      </div>
    `;
  });
}

export function renderPassport() {
  const grid = $('#stamps-grid');
  grid.innerHTML = '';
  const s = loadStats();
  let count = 0;
  Object.entries(COUNTRY_DATA).forEach(([name, c]) => {
    if (s.stamps[name]) {
      count++;
      grid.innerHTML += `
        <div class="stamp-card">
          <span class="sc-flag">${c.emoji}</span>
          <span class="sc-name">${name}</span>
          <div class="sc-stamp-ring"><span class="sc-stamp-text">VISITED<br>✓</span></div>
          <span class="sc-date">${new Date(s.stamps[name]).toLocaleDateString()}</span>
        </div>`;
    } else {
      grid.innerHTML += `
        <div class="stamp-card empty">
          <span class="sc-flag">❓</span><span class="sc-name">Unknown</span>
        </div>`;
    }
  });
  const pct = Math.round((count / Object.keys(COUNTRY_DATA).length) * 100);
  $('#passport-fill').style.width = `${pct}%`;
  $('#passport-pct').textContent = `${pct}% Complete`;
}

export function renderMap() {
  const container = $('#map-container');
  container.innerHTML = '<div class="map-tooltip" id="map-tooltip"></div>';
  const tooltip = $('#map-tooltip');
  const s = loadStats();

  Object.entries(COUNTRY_DATA).forEach(([name, c]) => {
    const isMastered = !!s.stamps[name];
    const dot = document.createElement('div');
    dot.className = `map-dot ${isMastered ? 'ml-dot-mastered' : 'ml-dot-visited'}`;
    dot.style.left = `${c.x}%`;
    dot.style.top = `${c.y}%`;
    
    dot.addEventListener('mouseenter', () => {
      tooltip.innerHTML = `${c.emoji} <strong>${name}</strong><br>${isMastered ? '✓ Explored' : 'Unexplored'}`;
      tooltip.style.left = `${c.x}%`;
      tooltip.style.top = `${c.y}%`;
      tooltip.style.opacity = 1;
    });
    dot.addEventListener('mouseleave', () => tooltip.style.opacity = 0);
    container.appendChild(dot);
  });
}

export function renderStats() {
  const s = loadStats();
  $('#full-stats-grid').innerHTML = `
    <div class="rs-box"><span class="rs-num">${s.gamesPlayed}</span><span class="rs-lbl">Games Played</span></div>
    <div class="rs-box"><span class="rs-num">${s.qsAnswered}</span><span class="rs-lbl">Questions</span></div>
    <div class="rs-box"><span class="rs-num">${s.totalCorrect}</span><span class="rs-lbl">Correct Answers</span></div>
    <div class="rs-box"><span class="rs-num">${s.qsAnswered ? Math.round((s.totalCorrect/s.qsAnswered)*100) : 0}%</span><span class="rs-lbl">Overall Accuracy</span></div>
    <div class="rs-box"><span class="rs-num">${s.xp}</span><span class="rs-lbl">Total XP</span></div>
    <div class="rs-box"><span class="rs-num">${s.level}</span><span class="rs-lbl">Current Rank</span></div>
  `;
  const badgesGrid = $('#badges-grid-full');
  badgesGrid.innerHTML = '';
  ACHIEVEMENTS.forEach(a => {
    const unlocked = s.unlockedBadges.includes(a.id);
    badgesGrid.innerHTML += `
      <div class="badge-card ${unlocked ? 'unlocked' : 'locked'}">
        <span class="badge-icon">${a.icon}</span>
        <div class="badge-info">
          <span class="badge-name">${a.name}${unlocked ? '' : ' 🔒'}</span>
          <span class="badge-desc">${a.desc}</span>
        </div>
      </div>
    `;
  });
}
