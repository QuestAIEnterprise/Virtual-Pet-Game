// pet.js

class Pet {
    constructor(data) {
        this.name = data.name || '';
        this.type = data.type || '';
        this.color = data.color || '';
        this.age = data.age || 0; // Alder i måneder
        this.hunger = data.hunger || 50;
        this.happiness = data.happiness || 50;
        this.cleanliness = data.cleanliness || 50;
        this.energy = data.energy || 50;
        this.experience = data.experience || 0;
        this.level = data.level || 1;
        this.items = data.items || [];
        this.inventory = data.inventory || [];
        this.ageTimer = data.ageTimer || 0;
    }

    save() {
        localStorage.setItem('pet', JSON.stringify(this));
    }

    static load() {
        const savedPet = JSON.parse(localStorage.getItem('pet'));
        if (savedPet) {
            return new Pet(savedPet);
        }
        return null;
    }

    updateStats() {
        // Opdater stats over tid
        this.hunger = Math.max(0, this.hunger - 1);
        this.happiness = Math.max(0, this.happiness - 1);
        this.cleanliness = Math.max(0, this.cleanliness - 1);
        this.energy = Math.max(0, this.energy - 1);

        // Aldring
        this.ageTimer += 5;
        if (this.ageTimer >= 60) {
            this.age += 1;
            this.ageTimer = 0;
        }

        // Niveauopstigning
        this.checkForLevelUp();

        this.save();
    }

    checkForLevelUp() {
        const levelThresholds = [100, 300, 600, 1000];
        levelThresholds.forEach((threshold, index) => {
            if (this.experience >= threshold && this.level === index + 1) {
                this.level += 1;
                alert(`Dit kæledyr har nået niveau ${this.level}!`);
                // Opdater kæledyrsmodel eller udseende efter behov
            }
        });
    }

    addExperience(amount) {
        this.experience += amount;
        this.checkForLevelUp();
    }

    useItem(item) {
        if (item.type === 'food') {
            this.hunger = Math.min(100, this.hunger + item.effect);
            // Afspil fodringslyd
        } else if (item.type === 'toy') {
            this.happiness = Math.min(100, this.happiness + item.effect);
            // Afspil legelyd
        }
        this.addExperience(5);
        // Fjern genstand fra inventar
        this.inventory = this.inventory.filter(i => i !== item);
        this.save();
    }
}

export default Pet;
