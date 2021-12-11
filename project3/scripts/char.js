class Player {
    constructor(x = 1, y = 1, health = 100, element = undefined) {
        this.x = x;
        this.y = y;
        this.health = health;
        this.maxHealth = health;
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

    get MaxHealth() {
        return this.maxHealth;
    }

    set MaxHealth(val) {
        this.maxHealth = val;
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
        setStats();
        if(this.health <= 0)
        {
            // Game Over Screen

            gameOver();

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
            this.alive = false;
            battleEnd();
        }
    }
    
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

class Knight extends Monster {
    constructor(x, y, element = undefined,) {
        super(x, y ,element);
        //super(y);
        //super(element);
        this.class = cssClass.KNIGHT;
        this.health = 35;
        this.name = "Knight";
        this.attack = 15;
        this.greeting = "A large knight stands at the ready";
        this.move = "The knight winds up and slams you with his heavy fist for 15 damage.";
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
class Boss extends Monster {
    constructor(x, y, element = undefined,) {
        super(x, y ,element);
        //super(y);
        //super(element);
        this.class = cssClass.BOSS;
        this.health = 60;
        this.name = "Boss";
        this.attack = 25;
        this.greeting = "A fully-armoured knight waits hands resting on his sword's pommel";
        this.move = "The knight slashes with his sword dealing, 25 damage";
    }

    get Greeting() {
        return this.greeting;
    }

    enemyTurn() {
        let text = document.querySelector("#battleDesc");
        text.innerHTML += this.move;
        player.takeDamage(this.attack);
    }

    takeDamage(damage) {
        this.health -= damage;
        if(this.health <= 0)
        {
            this.alive = false;
            endGame();
        }
    }
}