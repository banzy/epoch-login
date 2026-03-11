const q = (sel) => document.querySelector(sel);

// Theme Toggle
let isDark = true;
const themeToggle = q('#theme-toggle');
const themeSun = q('#theme-sun');
const themeMoon = q('#theme-moon');

function applyTheme() {
  if (isDark) {
    document.documentElement.classList.add('dark');
    themeSun.style.display = 'none';
    themeMoon.style.display = 'block';
  } else {
    document.documentElement.classList.remove('dark');
    themeSun.style.display = 'block';
    themeMoon.style.display = 'none';
  }
}
themeToggle.addEventListener('click', () => {
  isDark = !isDark;
  applyTheme();
});
applyTheme();

// Clock & Server Sync
let time = new Date();
let isSynced = true; // force true temporarily
let localInterval = null;
let ws = null;

const clockH = q('#clock-h');
const clockM = q('#clock-m');
const clockS = q('#clock-s');

function updateClockDisplay(date) {
  clockH.textContent = date.getHours().toString().padStart(2, '0');
  clockM.textContent = date.getMinutes().toString().padStart(2, '0');
  clockS.textContent = date.getSeconds().toString().padStart(2, '0');
}

function startLocal() {
  if (!localInterval) {
    localInterval = setInterval(() => {
      time = new Date();
      updateClockDisplay(time);
    }, 1000);
  }
}

function stopLocal() {
  if (localInterval) {
    clearInterval(localInterval);
    localInterval = null;
  }
}

function connectWs() {
  ws = new WebSocket('ws://localhost:3007');
  ws.onopen = () => {
    console.log('Clock sync connected, stopping local fallback');
    isSynced = true;
    updateStatusUI();
    stopLocal();
  };
  ws.onmessage = (e) => {
    time = new Date(e.data);
    updateClockDisplay(time);
  };
  ws.onclose = () => {
    console.log('Clock sync disconnected, starting local fallback');
    isSynced = false;
    updateStatusUI();
    startLocal();
    setTimeout(connectWs, 3000);
  };
  ws.onerror = () => {
    console.log('Clock sync error, ensuring local fallback');
    isSynced = false;
    updateStatusUI();
    startLocal();
  };
}
startLocal();
// connectWs();

// Form & Status State
let statusState = 'idle'; // idle | processing | success
const statusText = q('#status-text');
const emailInput = q('#email-input');
const microcopyText = q('#microcopy-text');

const holdWrap = q('#hold-wrap');
const holdTrigger = q('#hold-trigger');
const holdFill = q('#hold-fill');
const holdShimmer = q('#hold-shimmer');
const holdPct = q('#hold-pct');
const holdLblIdleText = q('#hold-lbl-idle-text');
const particlesContainer = q('#hold-particles');

function updateStatusUI() {
  const isValidEmail = emailInput.value.includes('@') && emailInput.value.includes('.');
  emailInput.disabled = (statusState !== 'idle' || !isSynced);

  if (!isSynced) {
    statusText.textContent = 'OUT OF SYNC';
    microcopyText.textContent = 'Connection to temporal server lost. Login restricted.';
    holdLblIdleText.textContent = 'Syncing...';
    holdTrigger.disabled = true;
  } else {
    if (statusState === 'idle') {
      statusText.textContent = 'SYSTEM READY';
      microcopyText.textContent = 'Secure logging system';
      holdLblIdleText.textContent = 'Log in';
      holdTrigger.disabled = !isValidEmail;
    } else if (statusState === 'processing') {
      statusText.textContent = 'VERIFYING';
      microcopyText.textContent = 'Temporal verification in progress.';
      holdLblIdleText.textContent = 'Verifying...';
      holdTrigger.disabled = true;
    } else if (statusState === 'success') {
      statusText.textContent = 'ACCESS GRANTED';
      microcopyText.textContent = 'Identity confirmed. Welcome back.';
      holdLblIdleText.textContent = 'Access Granted';
      holdTrigger.disabled = true;
    }
  }
}

emailInput.addEventListener('input', updateStatusUI);
updateStatusUI();

// Form Actions
function handleLogin() {
  if (!emailInput.value.trim() || !isSynced) return;
  statusState = 'processing';
  updateStatusUI();
  
  // Simulate authentication
  setTimeout(() => {
    statusState = 'success';
    updateStatusUI();
  }, 800);
}

// Hold Button Logic
let holdAnimId;
let holdStartTime = 0;
const holdDuration = 2000;

function spawnParticles() {
  if (!particlesContainer) return;
  particlesContainer.innerHTML = '';
  for(let i=0; i<16; i++) {
    const p = document.createElement('div');
    p.className = 'hold-particle';
    const angle = (i / 16) * 360;
    const dist = 40 + Math.random() * 50;
    const tx = Math.cos((angle * Math.PI) / 180) * dist;
    const ty = Math.sin((angle * Math.PI) / 180) * dist;
    p.style.setProperty('--tx', `${tx}px`);
    p.style.setProperty('--ty', `${ty}px`);
    p.style.left = '50%';
    p.style.top = '50%';
    particlesContainer.appendChild(p);
  }
}

function updateProgress() {
  const elapsed = Date.now() - holdStartTime;
  const pct = Math.min(elapsed / holdDuration, 1);
  
  holdFill.style.transform = `scaleX(${pct})`;
  if (holdShimmer) holdShimmer.style.transform = `scaleX(${pct})`;
  holdPct.textContent = `${Math.round(pct * 100)}%`;

  if (pct >= 1) {
    holdWrap.classList.remove('running');
    holdWrap.classList.add('done');
    spawnParticles();
    handleLogin();
  } else {
    holdAnimId = requestAnimationFrame(updateProgress);
  }
}

holdWrap.addEventListener('click', () => {
    if (holdTrigger.disabled || holdWrap.classList.contains('running') || holdWrap.classList.contains('done')) return;
    if (!isSynced || statusState !== 'idle') return;
    
    holdWrap.classList.add('running');
    holdStartTime = Date.now();
    holdAnimId = requestAnimationFrame(updateProgress);
});
