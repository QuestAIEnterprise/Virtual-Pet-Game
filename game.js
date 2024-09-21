// game.js

import Pet from './pet.js';
import { setPet as setInventoryPet, updateStatsDisplay } from './inventory.js';
import { setPet as setShopPet, updateBalanceDisplay } from './shop.js';
import { setPet as setWorkPet } from './work.js';

document.addEventListener('DOMContentLoaded', () => {
    // DOM-elementer
    const animalSelection = document.getElementById('animal-selection');
    const gameScreen = document.getElementById('game-screen');
    const petNameElem = document.getElementById('pet-name');
    const petAgeElem = document.getElementById('pet-age');
    const feedBtn = document.getElementById('feed-btn');
    const playBtn = document.getElementById('play-btn');
    const cleanBtn = document.getElementById('clean-btn');
    const sleepBtn = document.getElementById('sleep-btn');

    // 3D-scene elementer
    let scene, camera, renderer, petModel, controls;

    let pet = null;

    // Indlæs spiltilstand
    function loadGame() {
        pet = Pet.load();
        if (pet) {
            startGame();
        }
    }

    // Start spillet
    function startGame() {
        animalSelection.style.display = 'none';
        gameScreen.style.display = 'block';
        petNameElem.textContent = pet.name || 'Dit Kæledyr';
        petAgeElem.textContent = `Alder: ${pet.age} måneder`;

        // Sæt pet-referencer i andre moduler
        setInventoryPet(pet);
        setShopPet(pet);
        setWorkPet(pet);

        updateStatsDisplay();
        updateBalanceDisplay();
        init3D();
        gameLoop();
    }

    // Initialiser 3D-scenen
    function init3D() {
        // Eksisterende kode for at initialisere Three.js scenen
    }

    // Spil-loop
    function gameLoop() {
        setInterval(() => {
            pet.updateStats();
            updateStatsDisplay();
        }, 5000); // Opdater hver 5. sekund
    }

    // Kæledyrsvalg event lyttere
    document.querySelectorAll('.animal-options img').forEach(img => {
        img.addEventListener('click', () => {
            const petData = {
                type: img.dataset.animal,
                name: prompt('Navngiv dit kæledyr:') || 'Kæledyr'
            };
            pet = new Pet(petData);
            pet.save();
            startGame();
        });
    });

    // Handlinger
    // ... (resten af din kode for handlinger, f.eks. feedBtn, playBtn, osv.)

    // Start spillet
    loadGame();
});
