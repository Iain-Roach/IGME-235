"use strict";

// I. VARIABLES
const cellWidth = 32;
const cellSpacing = 0;
const container = document.querySelector("#gridContainer");
const cells = []; // the HTML elements - our "view"
let enemies = []; // list of enemies in the level
let player = new Player(1, 1, 100);

// World nav variables
let worldX = 0;
let worldY = 0;
let playerWorldX = 14;
let playerWorldY = 13;

// faking an enumeration here
const keyboard = Object.freeze({
	SHIFT: 16,
	SPACE: 32,
	LEFT: 37,
	UP: 38,
	RIGHT: 39,
	DOWN: 40
});

// this is an enumeration for gameworld levels
const worldTile = Object.freeze({
	FLOOR: 0,
	WALL: 1,
	GRASS: 2,
	WATER: 3,
	GROUND: 4,
	DIRT: 5,
	SHORTGRASS: 6,
	BUSH: 7,
	CRACK: 8,
});

// the "thud" sound that plays when the player attempts to move into a wall or water square
let effectAudio = undefined;
// Sound of sword swing
let attackAudio = undefined;
// Sound of fireball
let fireAudio = undefined;
// Sound of crumbling brick
let crumbleAudio = undefined;
// Sound of interaction
let interactAudio = undefined;


// level data is over in gamedata.js
let currentLevelNumber = 1;
let currentGameWorld = undefined;   // a 2D array - the grid:  walls, floors, water, etc...
let currentGameObjects = undefined; // a 1D array - stuff that's on top of the grid and can move: monsters, treasure, keys, etc...

// the player - uses ES6 object literal syntax
// const player = Object.seal({
// 	x: -1,
// 	y: -1,
// 	element: undefined,
// 	moveRight() { this.x++; },
// 	moveDown() { this.y++; },
// 	moveLeft() { this.x--; },
// 	moveUp() { this.y--; },
// });
let playerX = player.x;
let playerY = player.y;

// II. INIT code
window.onload = () => {
	NextLevel();

	//clearGameObjects();
}

// III. FUNCTIONS
// the elements on the screen that won't change - our "view"
function createGridElements(numRows, numCols) {
	const span = document.createElement('span');
	span.className = 'cell';
	for (let row = 0; row < numRows; row++) {
		cells.push([]);
		for (let col = 0; col < numCols; col++) {
			let cell = span.cloneNode();
			cell.style.left = `${col * (cellWidth + cellSpacing)}px`;
			cell.style.top = `${row * (cellWidth + cellSpacing)}px`;
			container.appendChild(cell);
			cells[row][col] = cell;
		}
	}
}

// Clears grid and loads the next level using world x and y
function NextLevel() {
	document.querySelector("#gridContainer").innerHTML = "";
	currentGameWorld = gameworld["world" + worldX + worldY];
	let numCols = currentGameWorld[0].length;
	let numRows = currentGameWorld.length;
	createGridElements(numRows, numCols);
	drawGrid(currentGameWorld);
	loadLevel(worldX, worldY);
	drawGameObjects(currentGameObjects);
	audioSetup();
	setupEvents();

}

// set up audio
function audioSetup() {
	effectAudio = document.querySelector("#effectAudio");
	effectAudio.volume = 0.2;
	attackAudio = document.querySelector("#attackAudio");
	attackAudio.volume = 0.2;
	fireAudio = document.querySelector("#fireAudio");
	fireAudio.volume = 0.2;
	crumbleAudio = document.querySelector("#crumbleAudio");
	crumbleAudio.volume = 0.2;
	interactAudio = document.querySelector("#interactAudio");
	interactAudio.volume = 0.2;
}

// the elements on the screen that can move and change - also part of the "view"
function loadLevel(wX, wY) {
	currentGameObjects = []; // clear out the old array
	enemies = []; // clear out old level's enemy array
	const node = document.createElement("span");
	node.className = "gameObject";

	// now initialize our player
	player.x = playerWorldX;
	player.y = playerWorldY;
	player.element = node.cloneNode(true);
	player.element.classList.add("player");
	container.appendChild(player.element);
	createEnemyList();
	for (let e of enemies) {
		if (e.alive) {
			e.element = node.cloneNode(true);
			e.element.classList.add(e.class);
			container.appendChild(e.element);
		}
	}

	/* let's instantiate our game objects */
	// pull the current level data
	const levelObjects = allGameObjects["level" + wX + wY];

	// loop through this level's objects ... 
	for (let obj of levelObjects) {
		if (obj.type != "monster") {
			if (!player.inventory.includes(obj.type))
			{
			const clone = Object.assign({}, obj); 		// clone the object
			clone.element = node.cloneNode(true); 		// clone the element
			clone.element.classList.add(obj.className); // add the className so we see the right image
			currentGameObjects.push(clone);				// add to currentGameObjects array  (so it gets moved onto the map)
			container.appendChild(clone.element);		// add to DOM tree (so we can see it!)
			}
		}
	}

}

// Called at end of battle to return to level
function battleEnd() {
	document.querySelector("#gridContainer").innerHTML = "";
	let numCols = currentGameWorld[0].length;
	let numRows = currentGameWorld.length;
	createGridElements(numRows, numCols);
	drawGrid(currentGameWorld);

	container.appendChild(player.element);
	for (let obj of currentGameObjects) {
		if(!player.inventory.includes(obj.type))
		{
			container.appendChild(obj.element);
		}

	}

	for (let enemy of enemies) {
		if (enemy.alive) {
			container.appendChild(enemy.element);
		}
	}
	drawGameObjects(currentGameObjects);
	audioSetup();
	setupEvents();
}

// Creates a list of monsters from the currentGameObjects array
function createEnemyList() {
	for (let mon of allMonsters["level" + worldX + worldY]) {
		let enemy;
		switch (mon.type) {
			case "Medusa":
				enemy = new Medusa(mon.x, mon.y);
				enemies.push(enemy);
				break;
			case "Bee":
				enemy = new Bee(mon.x, mon.y);
				enemies.push(enemy);
				break;
			case "Knight":
				enemy = new Knight(mon.x, mon.y);
				enemies.push(enemy);
				break;
			case "Boss":
				enemy = new Boss(mon.x, mon.y);
				enemies.push(enemy);
				break;
		}
	}
}

function drawGrid(array) {

	const numCols = array[0].length;
	const numRows = array.length;
	for (let row = 0; row < numRows; row++) {
		for (let col = 0; col < numCols; col++) {
			const tile = array[row][col];
			const element = cells[row][col];

			switch (tile) {
				case worldTile.FLOOR:
					element.classList.add("floor")
					break;

				case worldTile.WALL:
					element.classList.add("wall");
					break;

				case worldTile.GRASS:
					element.classList.add("grass");
					break;

				case worldTile.WATER:
					element.classList.add("water");
					break;

				case worldTile.GROUND:
					element.classList.add("ground");
					break;

				case worldTile.DIRT:
					element.classList.add("dirt");
					break;

				case worldTile.SHORTGRASS:
					element.classList.add("shortGrass");
					break;

				case worldTile.BUSH:
					element.classList.add("bush");
					break;
				case worldTile.CRACK:
					element.classList.add("crack");
					break;
			}
		}
	}
}


function drawGameObjects(array) {
	// player
	player.element.style.left = `${player.x * (cellWidth + cellSpacing)}px`;
	player.element.style.top = `${player.y * (cellWidth + cellSpacing)}px`;

	// game object
	for (let gameObject of array) {
		gameObject.element.style.left = `${gameObject.x * (cellWidth + cellSpacing)}px`;
		gameObject.element.style.top = `${gameObject.y * (cellWidth + cellSpacing)}px`;
	}

	// enemies
	for (let enemy of enemies) {
		enemy.element.style.left = `${enemy.x * (cellWidth + cellSpacing)}px`;
		enemy.element.style.top = `${enemy.y * (cellWidth + cellSpacing)}px`;
	}

}


function movePlayer(e) {
	let nextX;
	let nextY;
	switch (e.keyCode) {
		case keyboard.RIGHT:
			nextX = player.x + 1;
			nextY = player.y;
			if (checkIsLegalMove(nextX, nextY)) player.moveRight();
			//if (document.querySelector("#textDiv")) { document.querySelector("#textDiv").remove() }
			break;

		case keyboard.DOWN:
			nextX = player.x;
			nextY = player.y + 1;
			if (checkIsLegalMove(nextX, nextY)) player.moveDown();
			//if (document.querySelector("#textDiv")) { document.querySelector("#textDiv").remove() }
			break;

		case keyboard.LEFT:
			nextX = player.x - 1;
			nextY = player.y;
			if (checkIsLegalMove(nextX, nextY)) player.moveLeft();
			//if (document.querySelector("#textDiv")) { document.querySelector("#textDiv").remove() }
			break;

		case keyboard.UP:
			nextX = player.x;
			nextY = player.y - 1;
			if (checkIsLegalMove(nextX, nextY)) player.moveUp();
			//if (document.querySelector("#textDiv")) { document.querySelector("#textDiv").remove() }
			break;

		case keyboard.SPACE:
			interact();
			break;
	}

	// Checks to see if player is on an object and performs an action depending on that object
	function interact() {
		if (document.querySelector("#textDiv"))
		{
			textDiv.remove();
		}
		// currentGameObjects gives list of all game objects from level
		for (let object of currentGameObjects) {
			// Checks to see if player.x and player.y is on any gameObject
			if (object.x == player.x && object.y == player.y) {
				if(document.querySelector("#textDiv"))
				{
					let text = document.querySelector("#textDiv");
					text.remove();
				}
				
				switch (object.className) {
					case "scroll00":
						if(!player.inventory.includes("scroll00"))
						{
						container.removeChild(object.element);
						interactText("scroll00", "Welcome to Island Explorer, thank you for trying out my game :D");
						}
						
						interactAudio.play();
						break;
					case "firestaff":
						if(!player.inventory.includes("firestaff"))
						{
						container.removeChild(object.element);
						interactText("firestaff", "This staff seems to be able to shoot fireballs");
						}
						interactAudio.play();
						break;
					case "talisman":
						if(!player.inventory.includes("talisman"))
						{
						container.removeChild(object.element);
						interactText("talisman", "The bell shines with a radiant aura");
						}
						interactAudio.play();
						break;
					case "strgaunt":
						if(!player.inventory.includes("strgaunt"))
						{
						container.removeChild(object.element);
						interactText("strgaunt", "As you equip these gauntlets you feel much stronger");
						player.Attack += 5;
						}
						interactAudio.play();
						break;
					case "crystalball":
						if(!player.inventory.includes("crystalball"))
						{
						container.removeChild(object.element);
						interactText("crystalball", "You stare into the crystal ball, you feel as if you have increased your understanding for magic");
						player.Magic += 5;
						}
						interactAudio.play();
						break;
					case "ring":
						if(!player.inventory.includes("ring"))
						{
						container.removeChild(object.element);
						interactText("ring", "This ring shines brightly has you pick it up, As you slide it onto your finger you feel your faith increase");
						player.Faith += 5;
						}
						interactAudio.play();
						break;
					case "apple":
						if(!player.inventory.includes("apple"))
						{
						container.removeChild(object.element);
						interactText("apple", "You devour the delicous apple, you feel much more hearty");
						player.MaxHealth += 50;
						player.Health = player.MaxHealth;
						}
						interactAudio.play();
						break;
				}
			}
		}
		
	}

	// Helper function to display text
	function interactText(objectType, itemDesc)
	{
			player.pickUp(objectType);
			if (!document.querySelector("#textDiv")) {
				let textDiv = document.createElement('div');
				textDiv.id = "textDiv";
				container.appendChild(textDiv);
				let scrollText = document.createElement('p');
				scrollText.id = "scrollText";
				scrollText.innerHTML = itemDesc;
				textDiv.appendChild(scrollText);
			}
			else {
				textDiv.remove();
			}
	}

	// Checks to see if player can move to the next tile
	function checkIsLegalMove(nextX, nextY) {
		let nextTile = currentGameWorld[nextY][nextX];
		if (document.querySelector("#textDiv"))
		{
			textDiv.remove();
		}

		for (let enemy of enemies) {
			if (enemy.x == nextX && enemy.y == nextY && enemy.alive) {
				playerWorldX = player.x;
				playerWorldY = player.y;
				battle(enemy);
			}
		}
		if (nextTile != worldTile.WALL && nextTile != worldTile.WATER && nextTile != worldTile.BUSH && nextTile != worldTile.CRACK) {
			//Exits top of screen
			if (nextY == 0) {
				playerWorldX = player.x;
				playerWorldY = 19;
				worldY += 1;
				console.log("Hit top transfer zone");
				console.log("Going to zone" + worldX + "|" + worldY);
				NextLevel();
			}
			//Exits bottom of screen
			else if (nextY == 19) {
				playerWorldX = player.x
				playerWorldY = 0;
				worldY -= 1;
				console.log("Hit bottom transfer zone");
				console.log("Going to zone" + worldX + "|" + worldY);
				NextLevel();
			}
			//Exits right of screen
			else if (nextX == 29 && nextTile != worldTile.CRACK) {
				playerWorldY = player.y;
				playerWorldX = 0;
				worldX += 1;
				console.log("Hit right transfer zone");
				console.log("Going to zone" + worldX + "|" + worldY);
				NextLevel();
			}
			//Exits left of screen
			else if (nextX == 0) {
				playerWorldY = player.y;
				playerWorldX = 29;
				worldX -= 1;
				console.log("Hit left transfer zone");
				console.log("Going to zone" + worldX + "|" + worldY);
				NextLevel();
			}
			return true;
		}
		else if(nextTile == worldTile.CRACK) {
			if(player.Attack > 10)
			{
				playerWorldY = player.y;
				playerWorldX = 0;
				worldX += 1;
				console.log("Hit right transfer zone");
				console.log("Going to zone" + worldX + "|" + worldY);
				NextLevel();
			}
			else
			{
				console.log("you are to weak");
				if (!document.querySelector("#textDiv")) {
					console.log("DIED");
					let textDiv = document.createElement('div');
					textDiv.id = "textDiv";
					container.appendChild(textDiv);
					let scrollText = document.createElement('p');
					scrollText.id = "scrollText";
					scrollText.innerHTML = "You are too weak to break down the crumbling wall";
					textDiv.appendChild(scrollText);
				}
				else {
					textDiv.remove();
				}
			}
		}
		else {
			effectAudio.play();
			return false;
		}
	}
}


// IV. EVENTS
function setupEvents() {
	window.onmouseup = (e) => {
		e.preventDefault();
		gridClicked(e);
	};

	window.onkeydown = (e) => {
		//console.log("keydown=" + e.keyCode);

		// checking for other keys - ex. 'p' and 'P' for pausing
		var char = String.fromCharCode(e.keyCode);
		if (char == "p" || char == "P") {

		}
		movePlayer(e);
		drawGameObjects(currentGameObjects);
	};
}

function gridClicked(e) {
	let rect = container.getBoundingClientRect();
	let mouseX = e.clientX - rect.x;
	let mouseY = e.clientY - rect.y;
	let columnWidth = cellWidth + cellSpacing;
	let col = Math.floor(mouseX / columnWidth);
	let row = Math.floor(mouseY / columnWidth);
	let selectedCell = cells[row][col];
	// selectedCell.classList.add('cellSelected');
	console.log(`${col},${row}`);
}

// Starts the battle scene
function battle(enemy) {
	console.log(enemy.name);
	createBattleScene(enemy);
}

// Constructs the battle scene and all the buttons
function createBattleScene(enemy) {
	document.querySelector("#gridContainer").innerHTML = "";
	let battleDiv = document.createElement("div");
	battleDiv.id = "battleDiv";
	container.appendChild(battleDiv);

	let enemySide = document.createElement("div");
	enemySide.id = "enemySide";
	battleDiv.appendChild(enemySide);

	let playerSide = document.createElement("div");
	playerSide.id = "playerSide";
	battleDiv.appendChild(playerSide);

	let playerStats = document.createElement("div");
	playerStats.id = "playerStats";
	playerSide.appendChild(playerStats);

	let playerOptions = document.createElement("div");
	playerOptions.id = "playerOptions";
	playerSide.appendChild(playerOptions);

	let enemyText = document.createElement("div");
	enemyText.id = "enemyText";
	enemySide.appendChild(enemyText);

	let battleDesc = document.createElement("div");
	battleDesc.id = "battleDesc";
	battleDesc.innerHTML = enemy.Greeting;
	enemyText.appendChild(battleDesc);

	let playerHP = document.createElement("div");
	playerHP.id = "playerHP";
	playerHP.className = "stat";
	playerHP.innerHTML = "Health: " + player.Health;
	playerStats.appendChild(playerHP);

	let playerAttack = document.createElement("div");
	playerAttack.id = "playerAttack";
	playerAttack.className = "stat";
	playerAttack.innerHTML = "Attack: " + player.Attack;
	playerStats.appendChild(playerAttack);

	let playerMagic = document.createElement("div");
	playerMagic.id = "playerMagic";
	playerMagic.className = "stat";
	playerMagic.innerHTML = "Magic: " + player.Magic;
	playerStats.appendChild(playerMagic);


	let playerFaith = document.createElement("div");
	playerFaith.id = "playerFaith";
	playerFaith.className = "stat";
	playerFaith.innerHTML = "Faith: " + player.Faith;
	playerStats.appendChild(playerFaith);

	// Button to attack
	let attackButton = document.createElement("button");
	attackButton.id = "attackButton";
	attackButton.className = "button";
	attackButton.innerHTML = "FIGHT";
	attackButton.onclick = function (e) {
		battleDesc.innerHTML +=
			`<p class='combat-text'>You attack the monster with your long-sword for ${player.Attack} damage</p>`;
		enemy.takeDamage(player.Attack);
		if (enemy.alive) {
			enemy.enemyTurn();
		}
		attackAudio.play();
	}
	playerOptions.appendChild(attackButton)

	// Button to run from the battle
	let leaveBattle = document.createElement("button");
	leaveBattle.id = "leaveBattle";
	leaveBattle.className = "button";
	leaveBattle.innerHTML = "RUN";
	leaveBattle.onclick = function (e) {
		//currentGameObjects.find(e => e.className == this.name)
		//currentGameObjects = currentGameObjects.filter(e => e.className != this.name);
		battleEnd();
		stepAudio.play();
	}
	playerOptions.appendChild(leaveBattle);

	// Button to cast fireBall
	let magicButton = document.createElement("button");
	magicButton.id = "magicButton";
	magicButton.className = "button";
	magicButton.innerHTML = "FIREBALL";
	magicButton.onclick = function (e) {
		console.log("Fireballs Shall be cast");
		battleDesc.innerHTML +=
			`<p class='combat-text'>You channel a fireball at the end of your staff and fire it towards the monster, the monster is burned for ${player.Magic} damage</p>`;
		enemy.takeDamage(player.Magic);
		fireAudio.play();
		if (enemy.alive) {
			enemy.enemyTurn();
		}
	}
	// IF player.inventory contains fireBall Staff append button else dont
	if (player.inventory.includes("firestaff")) {
		playerOptions.appendChild(magicButton);
	}


	let prayerButton = document.createElement("button");
	prayerButton.id = "prayerButton";
	prayerButton.className = "button";
	prayerButton.innerHTML = "PRAY";
	prayerButton.onclick = function (e) {
		battleDesc.innerHTML +=
			`<p class='combat-text'>You ring your bell, and light shines around you, you are healed for ${player.Faith} health</p>`;
		player.Health = player.Health + player.Faith;
		if(player.Health >= player.MaxHealth)
		{
			player.Health = player.MaxHealth;
		}
		if (enemy.alive) {
			enemy.enemyTurn();
		}
	}
	// IF player.inventory contains talisman append button else don't
	if(player.inventory.includes("talisman"))
	{
		playerOptions.appendChild(prayerButton);
	}


}

// When player dies
function gameOver()
{
	document.querySelector("#gridContainer").innerHTML = "";
	worldX = 0;
	worldY = 0;

	playerWorldX = 14;
	playerWorldY = 13;

	player = new Player(1, 1, 100);


	let gameOverText = document.createElement("h2");
	gameOverText.id = "gameOverText";
	gameOverText.innerHTML = "GAME OVER";
	let gameOverDiv = document.createElement("div");
	gameOverDiv.id = "gameOverDiv";
	gameOverDiv.appendChild(gameOverText);
	document.querySelector("#gridContainer").appendChild(gameOverDiv);
	let restartButton = document.createElement("button");
	restartButton.id = "restartButton";
	restartButton.className = "button";
	restartButton.innerHTML = "Play Again";
	restartButton.onclick = function (e) {
		NextLevel();
	}
	gameOverDiv.appendChild(restartButton);


}
// When player beats the game
function endGame() {
	document.querySelector("#gridContainer").innerHTML = "";
	worldX = 0;
	worldY = 0;

	playerWorldX = 14;
	playerWorldY = 13;

	player = new Player(1, 1, 100);


	let gameOverText = document.createElement("h2");
	gameOverText.id = "gameOverText";
	gameOverText.innerHTML = "You have cleared the island";
	let gameOverDiv = document.createElement("div");
	gameOverDiv.id = "gameOverDiv";
	gameOverDiv.appendChild(gameOverText);
	document.querySelector("#gridContainer").appendChild(gameOverDiv);
	let restartButton = document.createElement("button");
	restartButton.id = "restartButton";
	restartButton.className = "button";
	restartButton.innerHTML = "Play Again";
	restartButton.onclick = function (e) {
		NextLevel();
	}
	gameOverDiv.appendChild(restartButton);
}
