// shop.js

import Pet from './pet.js';

const shopModal = document.getElementById('shop-modal');
const closeShopModal = document.getElementById('close-shop-modal');
const foodItemsContainer = document.getElementById('food-items');
const toyItemsContainer = document.getElementById('toy-items');
const openShopBtn = document.getElementById('open-shop-btn');

let pet = null;

const foodItems = [
    { name: 'Standard Foder', effect: 10, level: 1, image: 'food1.png', type: 'food' },
    { name: 'Premium Foder', effect: 20, level: 2, image: 'food2.png', type: 'food' },
    { name: 'Delikatesse', effect: 30, level: 3, image: 'food3.png', type: 'food' }
];

const toyItems = [
    { name: 'Legetøjsmus', effect: 10, level: 1, image: 'toy1.png', type: 'toy' },
    { name: 'Stofslange på pind', effect: 15, level: 2, image: 'toy2.png', type: 'toy' },
    { name: 'Plastikkugle', effect: 20, level: 3, image: 'toy3.png', type: 'toy' },
    { name: 'Legetøjsmus med vibrator', effect: 25, level: 4, image: 'toy4.png', type: 'toy' },
    { name: 'Plastikkugle med lys', effect: 30, level: 5, image: 'toy5.png', type: 'toy' }
];

function populateShop() {
    // Ryd tidligere indhold
    foodItemsContainer.innerHTML = '';
    toyItemsContainer.innerHTML = '';

    // Tilføj foder genstande
    foodItems.forEach(item => {
        if (pet.level >= item.level) {
            const itemDiv = createShopItem(item);
            foodItemsContainer.appendChild(itemDiv);
        }
    });

    // Tilføj legetøj genstande
    toyItems.forEach(item => {
        if (pet.level >= item.level) {
            const itemDiv = createShopItem(item);
            toyItemsContainer.appendChild(itemDiv);
        }
    });
}

function createShopItem(item) {
    const itemDiv = document.createElement('div');
    itemDiv.classList.add('shop-item');
    const img = document.createElement('img');
    img.src = `images/items/${item.image}`;
    img.alt = item.name;
    itemDiv.appendChild(img);
    const name = document.createElement('p');
    name.textContent = item.name;
    itemDiv.appendChild(name);
    const btn = document.createElement('button');
    btn.textContent = 'Køb';
    btn.addEventListener('click', () => {
        pet.inventory.push(item);
        alert(`${item.name} er tilføjet til din inventarliste.`);
        pet.save();
    });
    itemDiv.appendChild(btn);
    return itemDiv;
}

openShopBtn.addEventListener('click', () => {
    shopModal.style.display = 'block';
    populateShop();
});

closeShopModal.addEventListener('click', () => {
    shopModal.style.display = 'none';
});

window.addEventListener('click', (event) => {
    if (event.target === shopModal) {
        shopModal.style.display = 'none';
    }
});

// Eksporter funktion for at sætte pet reference
export function setPet(petInstance) {
    pet = petInstance;
}
