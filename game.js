// game.js

// DOM Elements
const animalSelection = document.getElementById('animal-selection');
const gameScreen = document.getElementById('game-screen');
const petNameElem = document.getElementById('pet-name');
const petImage = document.getElementById('pet-image');
const hungerElem = document.getElementById('hunger');
const happinessElem = document.getElementById('happiness');
const cleanlinessElem = document.getElementById('cleanliness');
const energyElem = document.getElementById('energy');
const experienceElem = document.getElementById('experience');
const feedBtn = document.getElementById('feed-btn');
const playBtn = document.getElementById('play-btn');
const cleanBtn = document.getElementById('clean-btn');
const sleepBtn = document.getElementById('sleep-btn');
const customizeBtn = document.getElementById('customize-btn');
const itemList = document.getElementById('item-list');

// Modal Elements
const customizationModal = document.getElementById('customization-modal');
const closeModal = document.getElementById('close-modal');
const colorOptions = document.querySelectorAll('.color-btn');

// Sound Effects
const feedSound = document.getElementById('feed-sound');
const playSound = document.getElementById('play-sound');
const cleanSound = document.getElementById('clean-sound');
const sleepSound = document.getElementById('sleep-sound');

// Game Variables
let pet = {
    name: '',
    type: '',
    color: '',
    hunger: 50,
    happiness: 50,
    cleanliness: 50,
    energy: 50,
    experience: 0,
    level: 1,
    items: []
};

// Load Game State from localStorage
function loadGame() {
    const savedPet = JSON.parse(localStorage.getItem('pet'));
    if (savedPet) {
        pet = savedPet;
        startGame();
    }
}

// Save Game State to localStorage
function saveGame() {
    localStorage.setItem('pet', JSON.stringify(pet));
}

// Start the Game
function startGame() {
    animalSelection.style.display = 'none';
    gameScreen.style.display = 'block';
    petNameElem.textContent = pet.name || 'Your Pet';
    updatePetImage();
    updateStats();
    updateItems();
    gameLoop();
    updateBackground();
}

// Update Pet Image
function updatePetImage() {
    petImage.src = `images/${pet.type}.png`;
    if (pet.color) {
        petImage.style.filter = `hue-rotate(${pet.color}deg)`;
    }
}

// Update Stats Display
function updateStats() {
    hungerElem.textContent = pet.hunger;
    happinessElem.textContent = pet.happiness;
    cleanlinessElem.textContent = pet.cleanliness;
    energyElem.textContent = pet.energy;
    experienceElem.textContent = pet.experience;

    document.getElementById('hunger-bar').style.width = `${pet.hunger}%`;
    document.getElementById('happiness-bar').style.width = `${pet.happiness}%`;
    document.getElementById('cleanliness-bar').style.width = `${pet.cleanliness}%`;
    document.getElementById('energy-bar').style.width = `${pet.energy}%`;
}

// Update Items Display
function updateItems() {
    itemList.innerHTML = '';
    pet.items.forEach(item => {
        const img = document.createElement('img');
        img.src = `images/items/${item}.png`;
        img.alt = item;
        itemList.appendChild(img);
    });
}

// Game Loop
function gameLoop() {
    setInterval(() => {
        pet.hunger = Math.max(0, pet.hunger - 1);
        pet.happiness = Math.max(0, pet.happiness - 1);
        pet.cleanliness = Math.max(0, pet.cleanliness - 1);
        pet.energy = Math.max(0, pet.energy - 1);
        updateStats();
        saveGame();
    }, 5000); // Decrease stats every 5 seconds
}

// Event Listeners for Animal Selection
document.querySelectorAll('.animal-options img').forEach(img => {
    img.addEventListener('click', () => {
        pet.type = img.dataset.animal;
        pet.name = prompt('Name your pet:') || 'Pet';
        startGame();
    });
});

// Action Buttons
feedBtn.addEventListener('click', () => {
    if (pet.hunger < 100) {
        pet.hunger = Math.min(100, pet.hunger + 10);
        pet.experience += 5;
        checkForItems();
        updateStats();
        saveGame();
        feedSound.play();
    } else {
        alert('Your pet is not hungry.');
    }
});

playBtn.addEventListener('click', () => {
    if (pet.happiness < 100 && pet.energy >= 10) {
        pet.happiness = Math.min(100, pet.happiness + 10);
        pet.energy = Math.max(0, pet.energy - 10);
        pet.experience += 5;
        checkForItems();
        updateStats();
        saveGame();
        playSound.play();
    } else if (pet.energy < 10) {
        alert('Your pet is too tired to play.');
    } else {
        alert('Your pet is already very happy.');
    }
});

cleanBtn.addEventListener('click', () => {
    if (pet.cleanliness < 100) {
        pet.cleanliness = 100;
        pet.experience += 5;
        checkForItems();
        updateStats();
        saveGame();
        cleanSound.play();
    } else {
        alert('Your pet is already clean.');
    }
});

sleepBtn.addEventListener('click', () => {
    if (pet.energy < 100) {
        pet.energy = 100;
        pet.hunger = Math.max(0, pet.hunger - 10);
        pet.cleanliness = Math.max(0, pet.cleanliness - 10);
        pet.experience += 5;
        checkForItems();
        updateStats();
        saveGame();
        sleepSound.play();
    } else {
        alert('Your pet is not tired.');
    }
});

// Customization
customizeBtn.addEventListener('click', () => {
    customizationModal.style.display = 'block';
});

closeModal.addEventListener('click', () => {
    customizationModal.style.display = 'none';
});

window.addEventListener('click', (event) => {
    if (event.target === customizationModal) {
        customizationModal.style.display = 'none';
    }
});

colorOptions.forEach(btn => {
    btn.addEventListener('click', () => {
        const color = btn.getAttribute('data-color');
        pet.color = getHueRotation(color);
        updatePetImage();
        saveGame();
        customizationModal.style.display = 'none';
    });
});

// Convert Color to Hue Rotation
function getHueRotation(color) {
    // Example function, you might need to adjust this
    switch (color) {
        case '#FFD700':
            return 50; // Gold
        case '#FF69B4':
            return 330; // Pink
        case '#1E90FF':
            return 210; // Blue
        default:
            return 0;
    }
}

// Check for Experience-Based Items
function checkForItems() {
    const itemThresholds = [50, 100, 200, 400];
    itemThresholds.forEach(threshold => {
        if (pet.experience >= threshold && !pet.items.includes(`item${threshold}`)) {
            pet.items.push(`item${threshold}`);
            alert(`You have earned a new item!`);
            updateItems();
        }
    });
    checkForLevelUp();
}

// Check for Level Up
function checkForLevelUp() {
    const levelThresholds = [100, 300, 600];
    levelThresholds.forEach((threshold, index) => {
        if (pet.experience >= threshold && pet.level === index + 1) {
            pet.level += 1;
            alert(`Your pet has evolved to Level ${pet.level}!`);
            petImage.style.transform = `scale(${1 + index * 0.1})`;
        }
    });
}

// Update Background Based on Time
function updateBackground() {
    const hour = new Date().getHours();
    if (hour >= 6 && hour < 18) {
        document.body.style.backgroundColor = '#f0f8ff'; // Day
    } else {
        document.body.style.backgroundColor = '#2c3e50'; // Night
    }
}

// Initialize Game
loadGame();
