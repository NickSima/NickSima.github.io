const levels = [
	//level 0
	["flag", "rock", "", "", "",
	"fenceside", "rock", "", "", "rider",
	"", "tree", "animate", "animate", "animate",
	"", "water", "", "", "",
	"", "fence", "", "horseup", "",],
	
	//level 1
	["flag", "water", "", "", "",
	"fenceside", "water", "", "", "rider",
	"animate", "bridge animate", "animate", "animate", "animate",
	"", "water", "", "", "",
	"", "water", "horseup", "", "",],
	
	//level 2
	["tree", "tree", "flag", "tree", "tree",
	"animate", "animate", "animate", "animate", "animate",
	"water", "bridge", "water", "water", "water",
	"", "", "", "fence", "",
	"rider", "rock", "", "", "horseup",]
]; //end of levels

const impassables = ["rock", "tree", "water"];

var gridBoxes;
var currentLevel = 0; //starting level
var riderOn = false; //is the rider on?
var currentLocationOfHorse = 0;
var currentAnimation; //allows 1 animation per level
var widthOfBoard = 5;

//start game
window.addEventListener("load", function () {
	gridBoxes = document.querySelectorAll("#gameBoard div");
	loadLevel();
});//load listener

//move horse
document.addEventListener("keydown", function(e){
	switch (e.keyCode) {
		case 65:
		case 37://left
			if (currentLocationOfHorse % widthOfBoard !== 0){
				tryToMove("left");
			}//if
			break;
		case 87:
		case 38://up
			if (currentLocationOfHorse >= widthOfBoard){
				tryToMove("up");
			}//if
			break;
		case 68:
		case 39://right
			if (currentLocationOfHorse % widthOfBoard < widthOfBoard - 1){
				tryToMove("right");
			}//if
			break;
		case 83:
		case 40://down
			if (currentLocationOfHorse + widthOfBoard < widthOfBoard * widthOfBoard){
				tryToMove("down");
			}//if
			break;
	}//switch
});//key listener

//try to move horse
function tryToMove(direction) {
	
	//location before move
	let oldLocation = currentLocationOfHorse;
	
	//class of old location
	let oldClassName = gridBoxes[oldLocation].className;
	
	let nextLocation = 0; //target location
	let nextClass = "";   //class of target location
	let newClass = "";    //new class on target location if move successful
	
	switch (direction) {
		case "left":
			console.log("move left");
			nextLocation = currentLocationOfHorse - 1;
			break;
		case "right":
			console.log("move right");
			nextLocation = currentLocationOfHorse + 1;
			break;
		case "up":
			console.log("move up");
			nextLocation = currentLocationOfHorse - widthOfBoard;
			break;
		case "down":
			console.log("move down");
			nextLocation = currentLocationOfHorse + widthOfBoard;
			break;
	}//switch
	
	nextClass = gridBoxes[nextLocation].className;
	
	//don't move if the obstacle is impassable
	if (impassables.includes(nextClass)) {return; }
	
	//don't move if horse encounters fence without rider
	if (!riderOn && nextClass.includes("fence")) {return; }
	
	//move two spaces with animation if horse encounters fence with a rider
	
	
	//add rider if there is a rider
	if (nextClass == "rider") {
		riderOn = true;
	}//if
	
	//keep bridge if it is in old location
	if (oldClassName.includes("bridge")) {
		gridBoxes[oldLocation].className = "bridge";
	} else {
		gridBoxes[oldLocation].className = "";
	}//if else
	
	//build name of new class
	newClass = (riderOn) ? "horseride" : "horse";
	newClass += direction;
	
	//keep bridge if it is in new location
	if(gridBoxes[nextLocation].classList.contains("bridge")) {
		newClasss += " bridge";
	}//if
	
	//move
	currentLocationOfHorse = nextLocation;
	gridBoxes[currentLocationOfHorse].className = newClass;
	
	//encounters enemy
	if (nextClass.includes("enemy")) {
		console.log("Lost");
	}//if
	
	//move to next level
	
	
}//try to move

//load levels 0 - max level
function loadLevel(){
	let levelMap = levels[currentLevel];
	let animateBoxes;
	riderOn = false;
	
	//load board
	for (i = 0; i < gridBoxes.length; i++) {
		gridBoxes[i].className = levelMap[i];
		if (levelMap[i].includes("horse")) currentLocationOfHorse = i;
	}//for
	
	animateBoxes = document.querySelectorAll(".animate");
	
	animateEnemy(animateBoxes, 0, "right");
	
}//loadLevel

//animate enemy left and right
function animateEnemy(boxes, index, direction) {
	//exit function if no animation
	if (boxes.length <= 0) {return;}
	
	//update images
	if(direction == "right") {
		boxes[index].classList.add("enemyright");
	} else if(direction == "left") {
		boxes[index].classList.add("enemyleft");
	}//if else
		
	//remove images from other boxes
	for (i = 0; i < boxes.length; i++) {
		if (i != index) {
			boxes[i].classList.remove("enemyright");
			boxes[i].classList.remove("enemyleft");
		}//if
	}//for
	
	//moving
	if (direction == "left") {
		//turn around if hit side
		if (index == 0){
			index++;
			direction = "right";
		} else {
			index--;
		}
	} else if (direction == "right") {
		//turn around if hit side
		if (index == boxes.length - 1){
			index--;
			direction = "left";
		} else {
			index++;
		}//if else
		
	}//if else
	
	currentAnimation = setTimeout(function() {
		animateEnemy(boxes, index, direction);
	}, 750);
	
}//animate Enemy