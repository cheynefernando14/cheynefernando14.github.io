// --- DOM Elements ---
const currentDisplay = document.getElementById('current-expr');
const historyDisplay = document.getElementById('history-expr');
const historyList = document.getElementById('history-list');
const themeToggle = document.getElementById('theme-toggle');
const degRadToggle = document.getElementById('deg-rad-toggle');
const memoryIndicator = document.getElementById('memory-indicator');
const copyBtn = document.getElementById('copy-btn');
const keypad = document.querySelector('.keypad');

// --- State Variables ---
let tokens = []; // Array to hold { display: string, eval: string } objects
let memory = 0;
let isDegrees = true;
let isEvaluated = false;

// --- Global Math Helpers (Safe Eval Wrappers) ---
// We attach these to window so the Function constructor can access them
window.calcSin = (val) => Math.sin(isDegrees ? val * (Math.PI / 180) : val);
window.calcCos = (val) => Math.cos(isDegrees ? val * (Math.PI / 180) : val);
window.calcTan = (val) => Math.tan(isDegrees ? val * (Math.PI / 180) : val);
window.calcFact = (n) => {
    if (n < 0 || !Number.isInteger(n)) return NaN;
    if (n === 0 || n === 1) return 1;
    let result = 1;
    for (let i = 2; i <= n; i++) result *= i;
    return result;
};

// --- Core Functionality ---

// Update the visual display based on our token array
function updateDisplay() {
    const displayString = tokens.map(t => t.display).join('');
    currentDisplay.innerText = displayString || '0';
}

// Safely evaluate the mathematical expression
function calculate() {
    if (tokens.length === 0) return;
    
    try {
        let evalString = tokens.map(t => t.eval).join('');
        
        // Auto-insert multiplication between numbers and functions/parentheses 
        // e.g. "5sin(30)" becomes "5*calcSin(30)"
        evalString = evalString.replace(/(\d|\))([a-zA-Z\(])/g, "$1*$2");

        // Use modern safe alternative to eval() by creating an isolated Function
        // Using "use strict" prevents accessing outside scoped variables unintentionally
        const result = new Function('"use strict"; return (' + evalString + ')')();
        
        // Format Result (Handle JS floating point weirdness)
        let formattedResult = Number.isInteger(result) ? result : parseFloat(result.toFixed(8));
        
        if (isNaN(formattedResult) || !isFinite(formattedResult)) throw new Error("Math Error");

        // Save to History UI
        addToHistory(tokens.map(t => t.display).join(''), formattedResult);
        
        // Setup state for next operation
        historyDisplay.innerText = tokens.map(t => t.display).join('') + ' =';
        tokens = [{ display: String(formattedResult), eval: String(formattedResult) }];
        isEvaluated = true;
        updateDisplay();
        
    } catch (error) {
        currentDisplay.innerText = "Error";
        setTimeout(() => {
            if (currentDisplay.innerText === "Error") updateDisplay();
        }, 1500);
    }
}

// Add token to the current mathematical expression
function handleToken(displayStr, evalStr) {
    // If we just calculated and press a number, start fresh
    if (isEvaluated && !isNaN(displayStr)) {
        tokens = [];
    }
    isEvaluated = false;
    tokens.push({ display: displayStr, eval: evalStr });
    updateDisplay();
}

// --- Memory Functions ---
function handleMemory(action) {
    const currentValue = parseFloat(currentDisplay.innerText) || 0;
    
    switch(action) {
        case 'mc': // Memory Clear
            memory = 0;
            break;
        case 'mr': // Memory Recall
            handleToken(String(memory), String(memory));
            break;
        case 'm-plus': // Memory Add
            calculate(); 
            memory += parseFloat(currentDisplay.innerText) || 0;
            break;
        case 'm-minus': // Memory Subtract
            calculate();
            memory -= parseFloat(currentDisplay.innerText) || 0;
            break;
    }
    
    // Update Memory UI Indicator
    if (memory !== 0) {
        memoryIndicator.classList.remove('hidden');
    } else {
        memoryIndicator.classList.add('hidden');
    }
}

// --- History Functions ---
function addToHistory(expr, result) {
    const li = document.createElement('li');
    li.innerHTML = `
        <div class="hist-expr">${expr}</div>
        <div class="hist-res">${result}</div>
    `;
    // Clicking history items pulls them back into the current screen
    li.addEventListener('click', () => {
        tokens = [{ display: String(result), eval: String(result) }];
        updateDisplay();
    });
    historyList.prepend(li);
}

document.getElementById('clear-history').addEventListener('click', () => {
    historyList.innerHTML = '';
});

// --- Event Listeners ---

// Master Click Listener using Event Delegation on Keypad
keypad.addEventListener('click', (e) => {
    const btn = e.target.closest('.btn');
    if (!btn) return;

    // Handle Actions (Clear, Delete, Equals, Memory)
    if (btn.hasAttribute('data-action')) {
        const action = btn.getAttribute('data-action');
        if (action === 'calculate') calculate();
        if (action === 'clear') {
            tokens = [];
            historyDisplay.innerText = '';
            updateDisplay();
        }
        if (action === 'delete') {
            tokens.pop();
            updateDisplay();
        }
        if (['mc', 'mr', 'm-plus', 'm-minus'].includes(action)) {
            handleMemory(action);
        }
        return;
    }

    // Handle Scientific & Number Inputs
    if (btn.hasAttribute('data-eval')) {
        const display = btn.getAttribute('data-display');
        const evalStr = btn.getAttribute('data-eval');
        handleToken(display, evalStr);
    }
});

// Copy to Clipboard feature
copyBtn.addEventListener('click', () => {
    navigator.clipboard.writeText(currentDisplay.innerText);
    copyBtn.innerText = "✅";
    setTimeout(() => copyBtn.innerText = "📋", 2000);
});

// DEG / RAD Toggle
degRadToggle.addEventListener('click', () => {
    isDegrees = !isDegrees;
    degRadToggle.innerText = isDegrees ? "DEG" : "RAD";
});

// Theme Toggle
themeToggle.addEventListener('click', () => {
    const body = document.documentElement;
    const isDark = body.getAttribute('data-theme') === 'dark';
    body.setAttribute('data-theme', isDark ? 'light' : 'dark');
    themeToggle.innerText = isDark ? "☀️" : "🌙";
});

// --- Keyboard Support mapping ---
document.addEventListener('keydown', (e) => {
    const keyMap = {
        '0': { d: '0', e: '0' }, '1': { d: '1', e: '1' }, '2': { d: '2', e: '2' },
        '3': { d: '3', e: '3' }, '4': { d: '4', e: '4' }, '5': { d: '5', e: '5' },
        '6': { d: '6', e: '6' }, '7': { d: '7', e: '7' }, '8': { d: '8', e: '8' },
        '9': { d: '9', e: '9' }, '.': { d: '.', e: '.' }, '+': { d: '+', e: '+' },
        '-': { d: '-', e: '-' }, '*': { d: '×', e: '*' }, '/': { d: '÷', e: '/' },
        '(': { d: '(', e: '(' }, ')': { d: ')', e: ')' }, '%': { d: '%', e: '/100' },
        '^': { d: '^', e: '**' }
    };

    if (keyMap[e.key]) {
        e.preventDefault();
        handleToken(keyMap[e.key].d, keyMap[e.key].e);
    } else if (e.key === 'Enter' || e.key === '=') {
        e.preventDefault();
        calculate();
    } else if (e.key === 'Backspace') {
        e.preventDefault();
        tokens.pop();
        updateDisplay();
    } else if (e.key === 'Escape') {
        e.preventDefault();
        tokens = [];
        historyDisplay.innerText = '';
        updateDisplay();
    }
});
