class Player {
    constructor(x = 1, y = 1, health = 100, element = undefined) {
        this.x = x;
        this.y = y;
        this.health = health;
        this.element = element;
        this.attack = 10;
        this.magic = 15;
        this.faith = 10;
        this.inventory = [];
    }

    // Gets the player's x and y coords
    get X() {
        return this.x;
    }

    get Y() {
        return this.y;
    }

    get Health() {
        return this.health;
    }
    set Health(val) {
        this.health = val;
    }

    get Attack() {
        return this.attack;
    }
    set Attack(val) {
        this.attack = val;
    }

    get Magic() {
        return this.magic;
    }
    set Magic(val) {
        this.magic = val;
    }

    get Faith() {
        return this.faith;
    }
    set Faith(val) {
        this.faith = val;
    }

    get Inventory() {
        return this.inventory;
    }

    moveRight() { if(!document.querySelector("#battleDiv"))this.x++; }
    moveDown() { if(!document.querySelector("#battleDiv"))this.y++; }
    moveLeft() { if(!document.querySelector("#battleDiv"))this.x--; }
    moveUp() { if(!document.querySelector("#battleDiv"))this.y--; }

    takeDamage(damage) {
        this.health -= damage;
        let playerHP = document.querySelector("#playerHP");
        playerHP.innerHTML = "Health: " + player.health;
        //Update hp on screen
        if(this.health <= 0)
        {
            // Game Over Screen\
            console.log("you are dead");
        }
    }

    pickUp(object){
        this.inventory.push(object);
    }
}

class Monster {
    constructor(x = 5, y = 5, health = 20, name, alive = true, element = undefined) {
        this.x = x;
        this.y = y;
        this.health = health;
        this.element = element;
        this.name = name;
        this.alive = alive;
        this.turn = false;
    }

    get X() {
        return this.x;
    }

    get Y() {
        return this.y;
    }

    get Health() {
        return this.health;
    }

    moveRight() { this.x++; }
    moveDown() { this.y++; }
    moveLeft() { this.x--; }
    moveUp() { this.y--; }



    // Need to separate enemy list from currentGameObjects as currentGameObjects gets
    // Recreated everytime loadLevel is called
    // So for the level create an enemy array once 

    

    takeDamage(damage)
    {
        this.health -= damage;
        if(this.health <= 0)
        {
            console.log("You won the battle");
            this.alive = false;
            battleEnd();
            // End battle Scene
            // Remove enemy from enemies array
            // Go back to level with enemy removed
            // 
        }
    }
    
    enemyTurn()
    {
        console.log("player took 10 damage");
        player.takeDamage(10);
    }
}