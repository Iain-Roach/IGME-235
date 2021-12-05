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
	BUSH: 7
});

// the "grunt" sound that plays when the player attempts to move into a wall or water square
let effectAudio = undefined;

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
// function makeLevel() {
// 	document.querySelector("#gridContainer").innerHTML = "";
// 	currentGameWorld = gameworld["world" + worldX + worldY];
// 	let numCols = currentGameWorld[0].length;
// 	let numRows = currentGameWorld.length;
// 	createGridElements(numRows, numCols);
// 	drawGrid(currentGameWorld);
// 	loadLevel(worldX, worldY);
// 	drawGameObjects(currentGameObjects);
// 	effectAudio = document.querySelector("#effectAudio");
// 	effectAudio.volume = 0.2;
// 	setupEvents();
// }

function NextLevel() {
	document.querySelector("#gridContainer").innerHTML = "";
	currentGameWorld = gameworld["world" + worldX + worldY];
	let numCols = currentGameWorld[0].length;
	let numRows = currentGameWorld.length;
	createGridElements(numRows, numCols);
	drawGrid(currentGameWorld);
	loadLevel(worldX, worldY);
	drawGameObjects(currentGameObjects);
	effectAudio = document.querySelector("#effectAudio");
	effectAudio.volume = 0.2;
	setupEvents();

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
	for(let e of enemies)
	{
		if(e.alive)
		{
		e.element = node.cloneNode(true);
		e.element.classList.add(e.name);
		container.appendChild(e.element);
		}
	}
	
	/* let's instantiate our game objects */
	// pull the current level data
	const levelObjects = allGameObjects["level" + wX + wY];

	// loop through this level's objects ... 
	for (let obj of levelObjects) {
		if(obj.type != "monster")
		{
		const clone = Object.assign({}, obj); 		// clone the object
		clone.element = node.cloneNode(true); 		// clone the element
		clone.element.classList.add(obj.className); // add the className so we see the right image
		currentGameObjects.push(clone);				// add to currentGameObjects array  (so it gets moved onto the map)
		container.appendChild(clone.element);		// add to DOM tree (so we can see it!)
		}
	}
	
}

// Called at end of battle to return to level
function battleEnd()
{
	document.querySelector("#gridContainer").innerHTML = "";
	let numCols = currentGameWorld[0].length;
	let numRows = currentGameWorld.length;
	createGridElements(numRows, numCols);
	drawGrid(currentGameWorld);

	container.appendChild(player.element);
	for(let obj of currentGameObjects)
	{
		container.appendChild(obj.element);
	}

	for(let enemy of enemies)
	{
		if(enemy.alive)
		{
			container.appendChild(enemy.element);
		}
	}
	drawGameObjects(currentGameObjects);
	effectAudio = document.querySelector("#effectAudio");
	effectAudio.volume = 0.2;
	setupEvents();
}

// Creates a list of monsters from the currentGameObjects array
function createEnemyList()
{
	for(let object of allGameObjects["level" + worldX + worldY])
	{
		if(object.type == "monster")
		{
			let enemy = new Monster(object.x, object.y, 20, object.className);
			enemies.push(enemy);
		}
	}
	// for(let i = 0; i< allGameObjects["level" + worldX + worldY].length; i++)
	// {
	// 	if(allGameObjects["level" + worldX + worldY][i].type == "monster")
	// 	allGameObjects["level" + worldX + worldY].splice(i, 1);
	// }
}

function drawGrid(array) {

	const numCols = array[0].length;
	const numRows = array.length;
	for (let row = 0; row < numRows; row++) {
		for (let col = 0; col < numCols; col++) {
			const tile = array[row][col];
			const element = cells[row][col];

			// ** can you figure our how to get rid of this switch? Maybe another enumeration, of the tile CSS classes? **
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
	for (let enemy of enemies)
	{
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
			if (document.querySelector("#textDiv")) {document.querySelector("#textDiv").remove()}
			break;

		case keyboard.DOWN:
			nextX = player.x;
			nextY = player.y + 1;
			if (checkIsLegalMove(nextX, nextY)) player.moveDown();
			if (document.querySelector("#textDiv")) {document.querySelector("#textDiv").remove()}
			break;

		case keyboard.LEFT:
			nextX = player.x - 1;
			nextY = player.y;
			if (checkIsLegalMove(nextX, nextY)) player.moveLeft();
			if (document.querySelector("#textDiv")) {document.querySelector("#textDiv").remove()}
			break;

		case keyboard.UP:
			nextX = player.x;
			nextY = player.y - 1;
			if (checkIsLegalMove(nextX, nextY)) player.moveUp();
			if (document.querySelector("#textDiv")) {document.querySelector("#textDiv").remove()}
			break;

		case keyboard.SPACE:
			interact();
			break;
	}

	function interact() {
		// currentGameObjects gives list of all game objects from level
		for (let object of currentGameObjects) {
			// Checks to see if player.x and player.y is on any gameObject
			if (object.x == player.x && object.y == player.y) {
				console.log("You are on the object");
				switch (object.className) {
					case "scroll00":
						console.log("ON SCROOOOLL00");
						if (!document.querySelector("#textDiv")) {
							let textDiv = document.createElement('div');
							textDiv.id = "textDiv";
							container.appendChild(textDiv);
							let scrollText = document.createElement('p');
							scrollText.id = "scrollText";
							scrollText.innerHTML = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque metus erat, dictum a nisi ut, accumsan hendrerit massa. Phasellus suscipit vitae lorem sed vulputate. Sed."
							textDiv.appendChild(scrollText);
						}
						else {
							textDiv.remove();
						}

						break;

					default:
						console.log("Not Scroll");
						break;
				}
			}
		}
		// console.log("Space is pressed");
		// let interactList = allGameObjects["level00"].map(x => x["className"]);
		// console.log(interactList); 


		// console.log(allGameObjects["level00"].find(x =>  x.className === cssClass.SCROLL));
	}

	function checkIsLegalMove(nextX, nextY) {
		let nextTile = currentGameWorld[nextY][nextX];

		// for(let object of currentGameObjects)
		// {
		// 	if(object.x == nextX && object.y == nextY)
		// 	{
		// 		if(object.className == "bee01")
		// 		{
		// 			console.log("its a bee");
		// 		}
		// 	}

		// }
		for(let enemy of enemies)
		{
			if(enemy.x == nextX && enemy.y == nextY && enemy.alive)
			{
				playerWorldX = player.x;
				playerWorldY = player.y;
				battle(enemy);
			}
		}
		if (nextTile != worldTile.WALL && nextTile != worldTile.WATER && nextTile != worldTile.BUSH) {

			// if (nextTile == worldTile.GROUND) {
			// 	console.log("Moved outside area");
			// 	NextLevel();
			//     //player.x = 1;
			//     //player.y = 1;
			// }
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
			else if (nextX == 29) {
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

function battle(enemy) {
	console.log("Time to duel");
	console.log(enemy.name);
	createBattleScene(enemy);
	
}

function createBattleScene(enemy)
{
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
	playerStats.id ="playerStats";
	playerSide.appendChild(playerStats);

	let playerOptions = document.createElement("div");
	playerOptions.id = "playerOptions";
	playerSide.appendChild(playerOptions);

	let enemyImage = document.createElement("div");
	enemyImage.id = "enemyImage";
	enemyImage.style.backgroundPositionX = -2000;
	enemySide.appendChild(enemyImage);


	// Button to run from the battle
	let leaveBattle = document.createElement("button");
	leaveBattle.id = "leaveBattle";
	leaveBattle.className = "button";
	leaveBattle.innerHTML = "RUN";
	leaveBattle.onclick = function (e) {
		console.log("Run Button was Clicked");
		//currentGameObjects.find(e => e.className == this.name)
		//currentGameObjects = currentGameObjects.filter(e => e.className != this.name);
		battleEnd();
	}
	playerOptions.appendChild(leaveBattle);
	

	// Button to attack
	let attackButton = document.createElement("button");
	attackButton.id = "attackButton";
	attackButton.className = "button";
	attackButton.innerHTML = "ATTACK";
	attackButton.onclick = function (e) {
		console.log("Attack Button Was Clicked")
		enemy.takeDamage(10);
		enemy.enemyTurn();
	}
	playerOptions.appendChild(attackButton)

}
