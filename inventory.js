// inventory.js

import Pet from './pet.js';

const inventoryModal = document.getElementById('inventory-modal');
const closeInventoryModal = document.getElementById('close-inventory-modal');
const inventoryItemsContainer = document.getElementById('inventory-items');
const inventoryBtn = document.getElementById('inventory-btn');

let pet = null;

function updateInventory() {
    inventoryItemsContainer.innerHTML = '';
    pet.inventory.forEach(item => {
        const itemDiv = document.createElement('div');
        itemDiv.classList.add('inventory-item');
        const img = document.createElement('img');
        img.src = `images/items/${item.image}`;
        img.alt = item.name;
        itemDiv.appendChild(img);
        const name = document.createElement('p');
        name.textContent = item.name;
        itemDiv.appendChild(name);
        const btn = document.createElement('button');
        btn.textContent = 'Brug';
        btn.addEventListener('click', () => {
            pet.useItem(item);
            updateInventory();
            // Opdater statsvisning
            updateStatsDisplay();
        });
        itemDiv.appendChild(btn);
        inventoryItemsContainer.appendChild(itemDiv);
    });
}

inventoryBtn.addEventListener('click', () => {
    inventoryModal.style.display = 'block';
    updateInventory();
});

closeInventoryModal.addEventListener('click', () => {
    inventoryModal.style.display = 'none';
});

window.addEventListener('click', (event) => {
    if (event.target === inventoryModal) {
        inventoryModal.style.display = 'none';
    }
});

// Eksporter funktion for at sætte pet reference
export function setPet(petInstance) {
    pet = petInstance;
}

export function updateStatsDisplay() {
    // Opdater statsvisning
    const hungerElem = document.getElementById('hunger-bar');
    const happinessElem = document.getElementById('happiness-bar');
    const cleanlinessElem = document.getElementById('cleanliness-bar');
    const energyElem = document.getElementById('energy-bar');
    const experienceElem = document.getElementById('experience');
    const levelElem = document.getElementById('level');
    const petAgeElem = document.getElementById('pet-age');
    const balanceElem = document.getElementById('balance');

    hungerElem.style.width = `${pet.hunger}%`;
    happinessElem.style.width = `${pet.happiness}%`;
    cleanlinessElem.style.width = `${pet.cleanliness}%`;
    energyElem.style.width = `${pet.energy}%`;
    experienceElem.textContent = pet.experience;
    levelElem.textContent = pet.level;
    petAgeElem.textContent = `Alder: ${pet.age} måneder`;

    // Opdater saldoen
    balanceElem.textContent = pet.balance;
}
