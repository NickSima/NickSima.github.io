const levels = [
	// level 1
	["flag", "tree", "", "", "rider",
	"fenceup", "tree", "", "", "rock",
	"", "water", "animate", "animate", "animate",
	"fenceup", "tree", "", "", "",
	"", "", "", "horseup", "",],
	
	// level 2
	// ["", "", "animate", "animate", "animate",
	// "fencedown", "water", "", "", "rider",
	// "flag", "tree", "", "", "",
	// "fenceup", "water", "animate", "animate", "animate",
	// "", "", "horseup", "", "",],
	
	// level 3
	["tree", "", "", "fenceside", "",
	"animate", "animate", "animate", "water", "",
	"", "rock", "", "water", "fencedown",
	"", "rock", "", "water", "",
	"rider", "tree", "horseup", "water", "flag",],
	
	// level 4
	["", "fenceside", "flag", "fenceside", "",
	"", "tree", "rider", "tree", "",
	"animate", "animate", "animate", "animate", "animate",
	"", "water", "water", "water", "",
	"", "", "horseup", "", "",],
	
	// level 5
	["", "", "flag", "", "",
	 "fenceup", "tree", "tree", "tree", "tree",
	 "", "", "rock", "rock", "rock",
	 "rider", "rock", "", "horseup", "",
	 "", "", "animate", "animate", "animate",],
	
	
	//level 6
	["horsedown", "rock", "rock", "flag", "",
	"", "tree", "", "tree", "fenceup",
	"animate", "animate", "animate", "animate", "animate",
	"", "tree", "tree", "tree", "",
	"", "water", "rider", "", "",],
	
	
	// level 7
	// ["", "water", "", "fenceside", "flag",
	// "animate", "", "rider", "animate", "animate",
	// "", "", "tree", "", "",
	// "animate", "animate", "tree", "animate", "animate",
	// "rock", "", "horseup", "", "rock",],
	 
	
]; //end of levels

const impassables = ["rock", "tree", "water"];

var gridBoxes;
var currentLevel = 0; //starting level
var riderOn = false; //is the rider on?
var canMove = true; //can move?
var currentLocationOfHorse = 0;
var currentAnimation; //allows 1 animation per level
var timerAnimation; //timer animation
var widthOfBoard = 5;
var ispaused = 0;

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
			if (currentLocationOfHorse % widthOfBoard !== 0 && canMove){
				tryToMove("left");
			}//if
			break;
		case 87:
		case 38://up
			if (currentLocationOfHorse >= widthOfBoard && canMove){
				tryToMove("up");
			}//if
			break;
		case 68:
		case 39://right
			if (currentLocationOfHorse % widthOfBoard < widthOfBoard - 1 && canMove){
				tryToMove("right");
			}//if
			break;
		case 83:
		case 40://down
			if (currentLocationOfHorse + widthOfBoard < widthOfBoard * widthOfBoard && canMove){
				tryToMove("down");
			}//if
			break;
		case 27: //escape
			if (canMove){
				pause(1);
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
	
	let nextLocation2 = 0; //target location after fence
	let nextClass2 = "";   //class of target location 2
	
	switch (direction) {
		case "left":
			nextLocation = currentLocationOfHorse - 1;
			break;
		case "right":
			nextLocation = currentLocationOfHorse + 1;
			break;
		case "up":
			nextLocation = currentLocationOfHorse - widthOfBoard;
			break;
		case "down":
			nextLocation = currentLocationOfHorse + widthOfBoard;
			break;
	}//switch
	
	nextClass = gridBoxes[nextLocation].className;
	
	//don't move if the obstacle is impassable
	if (impassables.includes(nextClass)) {return; }
	
	//don't move if horse encounters fence without rider
	if (!riderOn && nextClass.includes("fence")) {return; }
	
	//don't move if horse encounters flag without rider
	if (!riderOn && nextClass == "flag") {return;}
	
	//move two spaces with animation if horse encounters fence with a rider
	if (nextClass.includes("fence") && riderOn) {
		
		//find next location
		switch (direction) {
			case "left":
				nextLocation2 = nextLocation - 1;
				break;
			case "right":
				nextLocation2 = nextLocation + 1;
				break;
			case "up":
				nextLocation2 = nextLocation - widthOfBoard;
				break;
			case "down":
				nextLocation2 = nextLocation + widthOfBoard;
				break;
			
		}//switch
		
		//don't move if the obstacle is impassable
		if (impassables.includes(gridBoxes[nextLocation2].className)) {return; }
		
		//show correct images
		nextClass = "jump" + direction;
		nextClass2 = "horseride" + direction;
		
		//empty square horse was on (make sure not bridge though)
		gridBoxes[currentLocationOfHorse].className = "";
		oldClassName = gridBoxes[nextLocation].className;
		
		
		//show horse jumping
		gridBoxes[nextLocation].className = nextClass;
		
		//stop action
		canMove = false;
		
		setTimeout( function() {
			
			//set jump back to just a fence
			gridBoxes[nextLocation].className = oldClassName;
			
			//update current location of horse 2 spaces
			currentLocationOfHorse = nextLocation2;
			
			//get class of box
			nextClass = gridBoxes[currentLocationOfHorse].className;
			
			//show horse and rider after landing
			gridBoxes[currentLocationOfHorse].className = nextClass2;
			
			//if next box is a flag, go up a level
			if (nextClass == "flag") {
				levelUp(nextClass);
			}//if
			
			//reallow movement
			if (nextClass != "flag") {
				canMove = true;
			}
			
		}, 350);
		
		return;
		
	}//if
	
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
		newClass += " bridge";
	}//if
	
	//move
	currentLocationOfHorse = nextLocation;
	gridBoxes[currentLocationOfHorse].className = newClass;
	
	//encounters enemy
	if (nextClass.includes("enemy")) {
		gameOver("Enemy Encountered.");
		return;
	}//if
	
	//move to next level
	if (nextClass == "flag") {
		levelUp(nextClass);
	}//if
	
}//try to move


//level up
function levelUp(nextClass) {
	
	clearTimeout(currentAnimation);
	canMove = false;
	timer(-1);
	document.getElementById("pause").style.display = "none";
	
	//check for next level
	if(currentLevel < levels.length - 1){
		document.getElementById("levelup").style.display = "block";
	} else {
		document.getElementById("win").style.display = "block";
		return;
	}//if else
	
	//display next level text for 1 second
	setTimeout(function(){
		document.getElementById("levelup").style.display = "none";
		document.getElementById("pause").style.display = "inline-block";
		canMove = true;
		currentLevel++;
		loadLevel();
	}, 1000);
	
}//level up


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
	
	//start timer
	timer(10);
	
	animateBoxes = document.querySelectorAll(".animate");
	
	animateEnemy(animateBoxes, 0, "right");
	
}//loadLevel


//timer
function timer(time) {
	
	//reset timer (invisible)
	if (time == -1) {
		document.getElementById("timer").innerHTML = "";
		clearTimeout(timerAnimation);
		return;
	}//if
	
	//time up
	if (time <= 0) {
		document.getElementById("timer").innerHTML = "0";
		gameOver("Time Elapsed.");
		clearTimeout(timer);
		return;
	}//if
	
	//display
	document.getElementById("timer").innerHTML = "Time: " + Math.ceil(time);
	
	//repeat
	timerAnimation = setTimeout(function() {
		
		if(ispaused) {
			timer(time);
		} else {
			timer(time - 0.05);
		}//if else
		
	}, 50);//repeat
	
}//timer


//pause button functionality
function pause(status) {
	
	//pause
	if(status == 1) {
		ispaused = true;
		document.getElementById("pausemessage").style.display = "block";
	}//if
	
	//unpause
	if(status == 2) {
		ispaused = false;
		document.getElementById("pausemessage").style.display = "none";
	}//if
	
}//pause


//animate enemy left and right
function animateEnemy(boxes, index, direction) {
var currentLocationOfEnemy = 0;

	//exit function if no animation
	if (boxes.length <= 0) {return;}
	
	//wait if paused
	if(ispaused) {
		//wait
		setTimeout(function() {
			animateEnemy(boxes, index, direction);
		}, 750);
		return;
	}//if
	
	//end game if horse is on player
	for (i = 0; i < gridBoxes.length; i++) {
		if (levels[currentLevel][i].includes("animate")) {
			currentLocationOfEnemy = i + index;
			break;
		}
	}//for
	if (currentLocationOfEnemy == currentLocationOfHorse) {
		gameOver("Encountered by Enemy.");
		return;
	}//if
	
	//update images
	if (direction == "right") {
		boxes[index].classList.add("enemyright");
	} else if(direction == "left") {
		boxes[index].classList.add("enemyleft");
	} else if(direction == "up") {
		boxes[index].classList.add("enemyup");
	} else if(direction == "down") {
		boxes[index].classList.add("enemydown");
	}//if else
		
	//remove images from other boxes
	for (i = 0; i < boxes.length; i++) {
		if (i != index) {
			boxes[i].classList.remove("enemyright");
			boxes[i].classList.remove("enemyleft");
			boxes[i].classList.remove("enemyup");
			boxes[i].classList.remove("enemydown");
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
		
	//repeat
	currentAnimation = setTimeout(function() {
		animateEnemy(boxes, index, direction);
	}, 750);
		
}//animate Enemy


//display losing screen
function gameOver(reason) {
	
	//display losing message
	document.getElementById("lose").style.display = "block";
	document.getElementById("deathreason").innerHTML = reason;
	
	//stop action
	document.getElementById("pause").style.display = "none";
	clearTimeout(currentAnimation);
	timer(-1);
	canMove = false;

}//gameOver
