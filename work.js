// work.js

import Pet from './pet.js';
import { updateBalanceDisplay } from './shop.js';
import { updateStatsDisplay } from './inventory.js';

const workBtn = document.getElementById('work-btn');
const workModal = document.getElementById('work-modal');
const closeWorkModal = document.getElementById('close-work-modal');
const hireBabysitterBtn = document.getElementById('hire-babysitter-btn');
const noBabysitterBtn = document.getElementById('no-babysitter-btn');
const babysitterPriceElem = document.getElementById('babysitter-price');

let pet = null;

const babysitterPrice = 20; // Pris for at hyre babysitter

function openWorkModal() {
    workModal.style.display = 'block';
    babysitterPriceElem.textContent = babysitterPrice;
}

function closeWorkModalFunc() {
    workModal.style.display = 'none';
}

function startWork(hireBabysitter) {
    closeWorkModalFunc();

    const workDuration = 10000; // 10.000 ms = 10 sekunder
    alert('Du er nu på arbejde. Vent venligst mens du tjener penge.');
    workBtn.disabled = true;

    let workInterval;
    if (hireBabysitter) {
        if (pet.hasEnoughBalance(babysitterPrice)) {
            pet.subtractBalance(babysitterPrice);
            updateBalanceDisplay();
            pet.save();
            alert(`Du har hyret en babysitter for ${babysitterPrice} mønter.`);
            // Kæledyrets stats falder ikke, eller falder mindre
            workInterval = setInterval(() => {
                pet.hunger = Math.max(0, pet.hunger - 0.5); // Falder mindre
                pet.happiness = Math.max(0, pet.happiness - 0.5);
                pet.cleanliness = Math.max(0, pet.cleanliness - 0.2);
                pet.energy = Math.max(0, pet.energy - 0.2);
                pet.save();
                updateStatsDisplay();
            }, 2000);
        } else {
            alert('Du har ikke nok penge til at hyre en babysitter.');
            // Fortsæt uden babysitter
            startWork(false);
            return;
        }
    } else {
        // Ingen babysitter; stats falder normalt
        workInterval = setInterval(() => {
            pet.hunger = Math.max(0, pet.hunger - 2);
            pet.happiness = Math.max(0, pet.happiness - 2);
            pet.cleanliness = Math.max(0, pet.cleanliness - 1);
            pet.energy = Math.max(0, pet.energy - 1);
            pet.save();
            updateStatsDisplay();
        }, 2000);
    }

    setTimeout(() => {
        clearInterval(workInterval);
        const earnings = 50; // Spilleren tjener 50 mønter
        pet.addBalance(earnings);
        updateBalanceDisplay();
        pet.save();
        alert(`Du er færdig med at arbejde og har tjent ${earnings} mønter.`);
        workBtn.disabled = false;
    }, workDuration);
}

workBtn.addEventListener('click', () => {
    openWorkModal();
});

closeWorkModal.addEventListener('click', closeWorkModalFunc);

window.addEventListener('click', (event) => {
    if (event.target === workModal) {
        closeWorkModalFunc();
    }
});

hireBabysitterBtn.addEventListener('click', () => {
    startWork(true);
});

noBabysitterBtn.addEventListener('click', () => {
    startWork(false);
});

// Eksporter funktion for at sætte pet reference
export function setPet(petInstance) {
    pet = petInstance;
}
