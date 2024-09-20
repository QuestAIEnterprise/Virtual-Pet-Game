// game.js

// DOM-elementer
const animalSelection = document.getElementById('animal-selection');
const gameScreen = document.getElementById('game-screen');
const petNameElem = document.getElementById('pet-name');
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

// Modal-elementer
const customizationModal = document.getElementById('customization-modal');
const closeModal = document.getElementById('close-modal');
const colorOptions = document.querySelectorAll('.color-btn');

// Lyd effekter
const feedSound = document.getElementById('feed-sound');
const playSound = document.getElementById('play-sound');
const cleanSound = document.getElementById('clean-sound');
const sleepSound = document.getElementById('sleep-sound');

// Spilvariabler
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

// 3D-scene elementer
let scene, camera, renderer, petModel, mixer, controls, clock;

// Indlæs spiltilstand fra localStorage
function loadGame() {
    const savedPet = JSON.parse(localStorage.getItem('pet'));
    if (savedPet) {
        pet = savedPet;
        startGame();
    }
}

// Gem spiltilstand til localStorage
function saveGame() {
    localStorage.setItem('pet', JSON.stringify(pet));
}

// Start spillet
function startGame() {
    animalSelection.style.display = 'none';
    gameScreen.style.display = 'block';
    petNameElem.textContent = pet.name || 'Dit Kæledyr';
    updateStats();
    updateItems();
    init3D();
    gameLoop();
    updateBackground();
}

// Opdater kæledyrets billede
function updatePetModel() {
    // Fjern eksisterende model
    if (petModel) {
        scene.remove(petModel);
    }

    const loader = new THREE.GLTFLoader();
    let modelPath = '';

    // Vælg modellen baseret på kæledyrstype
    switch (pet.type) {
        case 'kat':
            modelPath = 'models/cat.gltf';
            break;
        case 'hund':
            modelPath = 'models/dog.gltf';
            break;
        case 'fugl':
            modelPath = 'models/bird.gltf';
            break;
        // Tilføj flere kæledyrstyper efter behov
    }

    loader.load(modelPath, function (gltf) {
        petModel = gltf.scene;
        petModel.scale.set(1.5, 1.5, 1.5); // Juster skala efter behov

        // Anvend farvetilpasning
        if (pet.color) {
            petModel.traverse(function (child) {
                if (child.isMesh) {
                    child.material.color.set(pet.color);
                }
            });
        }

        scene.add(petModel);

        // Opret AnimationMixer
        mixer = new THREE.AnimationMixer(petModel);

        // Indlæs animationer, hvis tilgængelige
        if (gltf.animations.length > 0) {
            const action = mixer.clipAction(gltf.animations[0]);
            action.play();
        }
    }, undefined, function (error) {
        console.error(error);
    });
}

// Initialiser 3D-scenen
function init3D() {
    // Opret scene
    scene = new THREE.Scene();

    // Opret kamera
    camera = new THREE.PerspectiveCamera(75, 400 / 400, 0.1, 1000);
    camera.position.z = 5;

    // Opret renderer
    renderer = new THREE.WebGLRenderer({ alpha: true });
    renderer.setSize(400, 400);
    document.getElementById('pet-container').appendChild(renderer.domElement);

    // Tilføj lys
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
    directionalLight.position.set(0, 1, 1);
    scene.add(directionalLight);

    // Tilføj kontroller
    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.enableZoom = false;

    // Opret ur til animationer
    clock = new THREE.Clock();

    // Indlæs kæledyrsmodel
    updatePetModel();

    // Start animationsloop
    animate();
}

// Animationsloop
function animate() {
    requestAnimationFrame(animate);

    // Opdater kontroller
    controls.update();

    // Opdater mixer til animationer
    if (mixer) {
        mixer.update(clock.getDelta());
    }

    renderer.render(scene, camera);
}

// Opdater stats
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

// Opdater genstande
function updateItems() {
    itemList.innerHTML = '';
    pet.items.forEach(item => {
        const img = document.createElement('img');
        img.src = `images/items/${item}.png`;
        img.alt = item;
        itemList.appendChild(img);
    });
}

// Spil-loop
function gameLoop() {
    setInterval(() => {
        pet.hunger = Math.max(0, pet.hunger - 1);
        pet.happiness = Math.max(0, pet.happiness - 1);
        pet.cleanliness = Math.max(0, pet.cleanliness - 1);
        pet.energy = Math.max(0, pet.energy - 1);
        updateStats();
        saveGame();
    }, 5000); // Reducer stats hver 5. sekund
}

// Kæledyrsvalg event lyttere
document.querySelectorAll('.animal-options img').forEach(img => {
    img.addEventListener('click', () => {
        pet.type = img.dataset.animal;
        pet.name = prompt('Navngiv dit kæledyr:') || 'Kæledyr';
        startGame();
    });
});

// Handlinger
feedBtn.addEventListener('click', () => {
    if (pet.hunger < 100) {
        pet.hunger = Math.min(100, pet.hunger + 10);
        pet.experience += 5;
        checkForItems();
        updateStats();
        saveGame();
        feedSound.play();
        animatePet('feed');
    } else {
        alert('Dit kæledyr er ikke sultent.');
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
        animatePet('play');
    } else if (pet.energy < 10) {
        alert('Dit kæledyr er for træt til at lege.');
    } else {
        alert('Dit kæledyr er allerede meget glad.');
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
        animatePet('clean');
    } else {
        alert('Dit kæledyr er allerede rent.');
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
        animatePet('sleep');
    } else {
        alert('Dit kæledyr er ikke træt.');
    }
});

// Tilpasning
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
        pet.color = color;
        updatePetModel();
        saveGame();
        customizationModal.style.display = 'none';
    });
});

// Animer kæledyret baseret på handling
function animatePet(action) {
    if (petModel) {
        switch (action) {
            case 'feed':
                gsap.to(petModel.position, { y: petModel.position.y + 0.5, duration: 0.5, yoyo: true, repeat: 1 });
                break;
            case 'play':
                gsap.to(petModel.rotation, { y: petModel.rotation.y + Math.PI * 2, duration: 1 });
                break;
            case 'clean':
                gsap.to(petModel.rotation, { x: petModel.rotation.x + Math.PI * 2, duration: 1 });
                break;
            case 'sleep':
                gsap.to(petModel.position, { y: petModel.position.y - 0.5, duration: 0.5, yoyo: true, repeat: 1 });
                break;
            // Tilføj flere animationer efter behov
        }
    }
}

// Tjek for erfaringbaserede genstande
function checkForItems() {
    const itemThresholds = [50, 100, 200, 400];
    itemThresholds.forEach(threshold => {
        if (pet.experience >= threshold && !pet.items.includes(`item${threshold}`)) {
            pet.items.push(`item${threshold}`);
            alert(`Du har optjent en ny genstand!`);
            updateItems();
        }
    });
    checkForLevelUp();
}

// Tjek for niveau-op
function checkForLevelUp() {
    const levelThresholds = [100, 300, 600];
    levelThresholds.forEach((threshold, index) => {
        if (pet.experience >= threshold && pet.level === index + 1) {
            pet.level += 1;
            alert(`Dit kæledyr har udviklet sig til Niveau ${pet.level}!`);
            petModel.scale.multiplyScalar(1.1);
        }
    });
}

// Opdater baggrund baseret på tid
function updateBackground() {
    const hour = new Date().getHours();
    if (hour >= 6 && hour < 18) {
        document.body.style.backgroundColor = '#f0f8ff'; // Dag
    } else {
        document.body.style.backgroundColor = '#2c3e50'; // Nat
    }
}

// Initialiser spillet
loadGame();
