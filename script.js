// script.js

// Initialize variables
let antimatter = 0;
let clickPower = 1;
let autoCollectors = 0;
let investments = 0;
let offlineAntimatter = 0;
let lastSaveTime = Date.now();
let antimatterPerSecond = 0;

// Load saved data from localStorage
function loadGame() {
    const savedData = JSON.parse(localStorage.getItem('gameData'));
    if (savedData) {
        antimatter = savedData.antimatter;
        clickPower = savedData.clickPower || 1;
        autoCollectors = savedData.autoCollectors || 0;
        investments = savedData.investments || 0;
        lastSaveTime = savedData.lastSaveTime;
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
    const timeDifference = now - lastSaveTime;
    offlineAntimatter = Math.floor(timeDifference / 1000) * antimatterPerSecond; // Calculate based on antimatterPerSecond
    antimatter += offlineAntimatter;
    document.getElementById('offline-antimatter-earned').innerText = offlineAntimatter;
    document.getElementById('offline-investments').innerText = offlineAntimatter * 0.1 * investments; // Placeholder for investment returns
    showOfflineEarningsModal();
}

// Show offline earnings modal
function showOfflineEarningsModal() {
    const modal = document.getElementById('offline-earnings-modal');
    modal.style.display = 'block';
}

// Update antimatter count on screen
function updateAntimatterDisplay() {
    document.getElementById('antimatter-count').innerText = antimatter;
    document.getElementById('antimatter-ps').innerText = antimatterPerSecond;
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

   particlesJS('particles-js', {
        particles: {
            number: { value: 80, density: { enable: true, value_area: 800 } },
            color: { value: "#00ff00" },
            shape: { type: "circle", stroke: { width: 0, color: "#000000" } },
            opacity: { value: 0.5, anim: { enable: false } },
            size: { value: 3, random: true, anim: { enable: false } },
            line_linked: { enable: true, distance: 150, color: "#00ff00", opacity: 0.4, width: 1 },
            move: { enable: true, speed: 6, direction: "none", random: false, straight: false, out_mode: "out", bounce: false, attract: { enable: false, rotateX: 600, rotateY: 1200 } },
        },
        interactivity: {
            detect_on: "canvas",
            events: {
                onhover: { enable: true, mode: "repulse" },
                onclick: { enable: true, mode: "push" },
                resize: true
            },
            modes: {
                grab: { distance: 400, line_linked: { opacity: 1 } },
                bubble: { distance: 400, size: 40, duration: 2, opacity: 8, speed: 3 },
                repulse: { distance: 200, duration: 0.4 },
                push: { particles_nb: 4 },
                remove: { particles_nb: 2 }
            }
        },
        retina_detect: true,
        // Set initial background image based on current seasonal event
        background: {
            color: "#000000",
            image: currentBackgroundImage, // Set initial background image
            position: "50% 50%",
            repeat: "no-repeat",
            size: "cover"
        }
    });
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
