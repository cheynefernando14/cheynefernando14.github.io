// js/app.js
import { showScreen, refreshHomeStats, generateStars, renderEncyclopedia, renderPassport, renderMap, renderStats } from './ui.js';
import { startGame, handleAnswer, handleSkip, advanceQuestion } from './game.js';
import { toggleMute } from './audio.js';
import { loadStats } from './storage.js';

const $ = (s) => document.querySelector(s);
const $$ = (s) => [...document.querySelectorAll(s)];

document.addEventListener('DOMContentLoaded', () => {
  generateStars();
  refreshHomeStats();
  
  // Check Daily 
  const s = loadStats();
  const today = new Date().toDateString();
  if(s.lastPlayedDate === today) {
    $('#daily-btn').disabled = true;
    $('#daily-btn').innerHTML = '📅 Come back tomorrow <span class="daily-streak">✓</span>';
  }

  // Nav listeners
  $$('.nav-tab').forEach(btn => {
    btn.addEventListener('click', () => {
      const target = btn.dataset.target;
      showScreen(target);
      if(target === 'encyclopedia') renderEncyclopedia();
      if(target === 'passport') renderPassport();
      if(target === 'map') renderMap();
      if(target === 'stats') renderStats();
      if(target === 'home') refreshHomeStats();
    });
  });

  // Home actions
  $$('.diff-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      $$('.diff-btn').forEach(b => { b.classList.remove('selected'); b.setAttribute('aria-pressed', 'false'); });
      btn.classList.add('selected'); btn.setAttribute('aria-pressed', 'true');
    });
  });
  
  $('#play-btn').addEventListener('click', () => startGame(false));
  $('#daily-btn').addEventListener('click', () => startGame(true));

  // Audio mute
  $('#mute-btn').addEventListener('click', (e) => {
    const isMuted = toggleMute();
    e.target.textContent = isMuted ? '🔇' : '🔊';
  });

  // Quiz Options
  $$('.option-btn').forEach(btn => {
    btn.addEventListener('click', () => handleAnswer(parseInt(btn.dataset.idx, 10)));
  });
  
  $('#skip-btn').addEventListener('click', handleSkip);
  $('#next-btn').addEventListener('click', () => { 
    // Usually next just triggers showLearnCard fallback if not caught, but here handleAnswer triggers it directly.
    // If we clicked Next manually, do nothing if disabled.
  });
  
  $('#learn-continue-btn').addEventListener('click', advanceQuestion);

  // Results actions
  $('#home-btn').addEventListener('click', () => { refreshHomeStats(); showScreen('home'); });
  $('#restart-btn').addEventListener('click', () => startGame(false));

  // Encyclopedia filters
  $$('.enc-filter').forEach(btn => {
    btn.addEventListener('click', () => {
      $$('.enc-filter').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.dataset.filter;
      $$('.enc-card').forEach(card => {
        if(filter === 'all' || card.dataset.cont === filter) card.style.display = 'block';
        else card.style.display = 'none';
      });
    });
  });

  // Encyclopedia search
  $('#enc-search').addEventListener('input', (e) => {
    const q = e.target.value.toLowerCase();
    $$('.enc-card').forEach(card => {
      const text = card.textContent.toLowerCase();
      card.style.display = text.includes(q) ? 'block' : 'none';
    });
  });

  // Shortcuts
  document.addEventListener('keydown', (e) => {
    if(document.activeElement.tagName === 'INPUT') return;
    if($('#screen-quiz').classList.contains('active') && !$('#learn-overlay').classList.contains('hidden')) {
      if(e.key === 'Enter' || e.key === ' ') advanceQuestion();
      return;
    }
    if($('#screen-quiz').classList.contains('active')) {
      const keys = {'1':0, '2':1, '3':2, '4':3};
      if(keys[e.key] !== undefined && !$$('.option-btn')[keys[e.key]].disabled) handleAnswer(keys[e.key]);
      if((e.key === 'Enter' || e.key === ' ') && !$('#skip-btn').disabled) handleSkip();
    }
  });
});
