class Player {
    constructor (x = 1, y = 1, health = 100, element = undefined)
    {
        this.x = x;
        this.y = y;
        this.health = health;
        this.element = element;
    }

    // Gets the player's x and y coords
    get X() {
        return this.x;
    }

    get Y() {
        return this.y;
    }

    moveRight() { this.x++; }
	moveDown() { this.y++; }
	moveLeft() { this.x--; }
	moveUp() { this.y--; }
}

class Monster {
    constructor (x = 5, y = 5, health = 20, element = undefined)
    {
        this.x = x;
        this.y = y;
        this.health = health;
        this.element = element;
    }

    get X()
    {
        return this.x;
    }

    get Y()
    {
        return this.y;
    }

    moveRight() { this.x++; }
	moveDown() { this.y++; }
	moveLeft() { this.x--; }
	moveUp() { this.y--; }


    battle() {
        console.log("Time to duel");
    }
}