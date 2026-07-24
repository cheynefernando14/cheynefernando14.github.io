// js/audio.js
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

export let isMuted = false;
export function toggleMute() { isMuted = !isMuted; return isMuted; }

function playTone(frequency, type, duration, vol = 0.1) {
  if (isMuted || audioCtx.state === 'suspended') return;
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(frequency, audioCtx.currentTime);
  
  gain.gain.setValueAtTime(vol, audioCtx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);
  
  osc.connect(gain);
  gain.connect(audioCtx.destination);
  osc.start();
  osc.stop(audioCtx.currentTime + duration);
}

export const sound = {
  correct: () => {
    playTone(600, 'sine', 0.1);
    setTimeout(() => playTone(800, 'sine', 0.15), 100);
  },
  wrong: () => {
    playTone(300, 'sawtooth', 0.3, 0.05);
    setTimeout(() => playTone(250, 'sawtooth', 0.3, 0.05), 150);
  },
  achievement: () => {
    [400, 500, 600, 800].forEach((freq, i) => {
      setTimeout(() => playTone(freq, 'square', 0.2, 0.05), i * 100);
    });
  },
  levelup: () => {
    [300, 400, 500, 600, 800, 1000].forEach((freq, i) => {
      setTimeout(() => playTone(freq, 'sine', 0.3, 0.1), i * 80);
    });
  }
};
