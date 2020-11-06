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
	
var gridBoxes;
var currentLevel = 0; //starting level
var riderOn = false; //is the rider on?
var currentLocationOfHorse = 0;
var currentAnimation; //allows 1 animation per level

//start game
window.addEventListener("load", function () {
	gridBoxes = document.querySelectorAll("#gameBoard div");
	loadLevel();
});

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
//boxes
//index
//direction
function animateEnemy(boxes, index, direction) {
	console.log("boxes.length " + boxes.length + " index " + index + " direction " + direction);
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
