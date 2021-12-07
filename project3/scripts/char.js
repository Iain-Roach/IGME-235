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
    constructor(x = 5, y = 5, element = undefined) {
        this.x = x;
        this.y = y;
        this.health = 20;
        this.element = element;
        this.class = cssClass.MONSTER3;
        this.alive = true;
        this.turn = false;
        this.attack = 5;
        this.desc = "The Shard Keeper lumbers towards you, twirling its massive polearm. Good Luck";
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

    get Desc() {
        return this.desc;
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
    
    // enemyTurn()
    // {
    //     let text = document.querySelector("#battleDesc");
    //     text.innerHTML += "Fus ro dah";
    //     player.takeDamage(this.attack);
    // }
}

class Medusa extends Monster {
    constructor(x, y, element = undefined,) {
        super(x, y ,element);
        //super(y);
        //super(element);
        this.class = cssClass.MONSTER3;
        this.health = 20;
        this.name = "Medusa";
        this.attack = 5;
        this.greeting = "A Medusa slithers towards you, the snakes on its head poised to strike";
        this.move = "The Medusa lunges forwards biting you for 5 damage";
    }

    get Greeting() {
        return this.greeting;
    }

    enemyTurn() {
        let text = document.querySelector("#battleDesc");
        text.innerHTML += this.move;
        player.takeDamage(this.attack);
    }
}

class Bee extends Monster {
    constructor(x, y, element = undefined,) {
        super(x, y ,element);
        //super(y);
        //super(element);
        this.class = cssClass.BEE01;
        this.health = 15;
        this.name = "Bee";
        this.attack = 8;
        this.greeting = "A giant bee buzzes forward, brandishing a giant stinger";
        this.move = "The bee stabs you with its stinger for 8 damage";
    }

    get Greeting() {
        return this.greeting;
    }

    enemyTurn() {
        let text = document.querySelector("#battleDesc");
        text.innerHTML += this.move;
        player.takeDamage(this.attack);
    }
}