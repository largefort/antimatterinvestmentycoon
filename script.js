// script.js

// Initialize variables
let antimatter = 0;
let clickPower = 1;
let autoCollectors = 0;
let investments = 0;
let offlineAntimatter = 0;
let lastSaveTime = Date.now();
let antimatterPerSecond = 0;
const investmentMultiplier = 0.1; // Multiplier for earnings from investments

// Load saved data from localStorage
function loadGame() {
    const savedData = JSON.parse(localStorage.getItem('gameData'));
    if (savedData) {
        antimatter = savedData.antimatter || 0;
        clickPower = savedData.clickPower || 1;
        autoCollectors = savedData.autoCollectors || 0;
        investments = savedData.investments || 0;
        lastSaveTime = savedData.lastSaveTime || Date.now();
        calculateOfflineEarnings();
    }
    calculateAntimatterPerSecond(); // Ensure antimatterPerSecond is updated after loading game
    updateUI(); // Immediately update UI upon loading
}

// Save game data to localStorage
function saveGame() {
    const gameData = {
        antimatter: antimatter,
        clickPower: clickPower,
        autoCollectors: autoCollectors,
        investments: investments,
        lastSaveTime: Date.now()
    };
    localStorage.setItem('gameData', JSON.stringify(gameData));
}

// Calculate offline earnings
function calculateOfflineEarnings() {
    const now = Date.now();
    const timeDifferenceInSeconds = (now - lastSaveTime) / 1000;

    // Calculate offline antimatter from auto collectors
    const offlineCollectorEarnings = autoCollectors * timeDifferenceInSeconds;

    // Calculate offline antimatter from investments
    const offlineInvestmentEarnings = investments * investmentMultiplier * timeDifferenceInSeconds;

    // Total offline antimatter earnings
    offlineAntimatter = offlineCollectorEarnings + offlineInvestmentEarnings;

    // Add offline earnings to the current antimatter
    antimatter += offlineAntimatter;

    // Update the modal with offline earnings information
    document.getElementById('offline-antimatter-earned').innerText = Math.floor(offlineAntimatter);
    document.getElementById('offline-investments').innerText = Math.floor(offlineInvestmentEarnings);

    showOfflineEarningsModal();
}

// Show offline earnings modal
function showOfflineEarningsModal() {
    const modal = document.getElementById('offline-earnings-modal');
    modal.style.display = 'block';
}

// Update antimatter count on screen
function updateAntimatterDisplay() {
    document.getElementById('antimatter-count').innerText = Math.floor(antimatter);
    document.getElementById('antimatter-ps').innerText = Math.floor(antimatterPerSecond);
}

// Handle click on the screen
document.getElementById('click-area').addEventListener('click', function(event) {
    antimatter += clickPower;
    updateAntimatterDisplay();
    showFloatingText(event.clientX, event.clientY, `+${clickPower}`);
});

// Display floating text
function showFloatingText(x, y, text) {
    const textElement = document.createElement('div');
    textElement.innerText = text;
    textElement.style.position = 'absolute';
    textElement.style.left = `${x}px`;
    textElement.style.top = `${y}px`;
    textElement.style.color = '#00FF00';
    textElement.style.pointerEvents = 'none';
    textElement.style.animation = 'floatUp 1s ease-out';
    document.getElementById('floating-text-container').appendChild(textElement);

    setTimeout(() => {
        textElement.remove();
    }, 1000);
}

// Handle modal close event
document.getElementById('close-modal').addEventListener('click', function() {
    document.getElementById('offline-earnings-modal').style.display = 'none';
});

// Handle tab switching
document.querySelectorAll('.nav-tab').forEach(button => {
    button.addEventListener('click', function() {
        document.querySelectorAll('.tab-content').forEach(tab => {
            tab.classList.remove('active-tab');
        });
        document.querySelectorAll('.nav-tab').forEach(tab => {
            tab.classList.remove('active-tab');
        });
        const targetTabContent = button.id.replace('-tab', '-content');
        document.getElementById(targetTabContent).classList.add('active-tab');
        button.classList.add('active-tab');
        updateUI(); // Ensure UI updates immediately upon switching tabs
    });
});

// Skilling: Upgrade click power
function upgradeSkill(skill) {
    if (skill === 'clickPower' && antimatter >= 10) {
        antimatter -= 10;
        clickPower += 1;
        document.getElementById('click-power').innerText = clickPower;
        updateAntimatterDisplay();
    }
}

// Shop: Buy auto collectors
function buyUpgrade(upgrade) {
    if (upgrade === 'autoCollector' && antimatter >= 100) {
        antimatter -= 100;
        autoCollectors += 1;
        document.getElementById('auto-collectors').innerText = autoCollectors;
        calculateAntimatterPerSecond(); // Update antimatterPerSecond whenever autoCollectors change
        updateAntimatterDisplay();
    }
}

// Marketing: Invest antimatter
function investAntimatter() {
    if (antimatter >= 50) {
        antimatter -= 50;
        investments += 1;
        document.getElementById('investments').innerText = investments;
        updateAntimatterDisplay();
    }
}

// Calculate antimatter per second
function calculateAntimatterPerSecond() {
    antimatterPerSecond = autoCollectors; // 1 antimatter per auto collector per second
}

// Automatically add antimatter per second
function autoCollect() {
    antimatter += antimatterPerSecond;
    updateAntimatterDisplay();
}

// Chart.js setup for earnings graph
function setupEarningsGraph() {
    const ctx = document.getElementById('earnings-graph').getContext('2d');
    const earningsGraph = new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Start', 'Mid', 'End'],
            datasets: [{
                label: 'Antimatter Earnings',
                data: [0, 10, 50], // Placeholder data
                borderColor: '#00FF00',
                backgroundColor: 'rgba(0, 255, 0, 0.2)',
                fill: true
            }]
        },
        options: {
            scales: {
                x: {
                    beginAtZero: true,
                    grid: {
                        color: '#444'
                    }
                },
                y: {
                    beginAtZero: true,
                    grid: {
                        color: '#444'
                    }
                }
            }
        }
    });
}

// Function to update the UI instantly
function updateUI() {
    // Update the Skilling tab
    document.getElementById('click-power').innerText = clickPower;

    // Update the Shop tab
    document.getElementById('auto-collectors').innerText = autoCollectors;

    // Update the Marketing tab
    document.getElementById('investments').innerText = investments;

    updateAntimatterDisplay(); // Ensure the main display is up-to-date
}

// Initialize particles.js
particlesJS.load('particles-js', 'particles.json', function() {
    console.log('particles.js loaded');
});

// Load game and start the game loop
loadGame();
setupEarningsGraph();
setInterval(autoCollect, 1000); // Automatically collect antimatter every second
setInterval(saveGame, 1000); // Autosave every 10 seconds

// Add CSS animation for floating text
const style = document.createElement('style');
style.innerHTML = `
    @keyframes floatUp {
        0% { transform: translateY(0); opacity: 1; }
        100% { transform: translateY(-50px); opacity: 0; }
    }
`;
document.head.appendChild(style);

