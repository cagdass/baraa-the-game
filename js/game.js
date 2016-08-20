// Create the canvas
var canvas = document.createElement("canvas");
var ctx = canvas.getContext("2d");

// Height&Width
canvas.width = 800;
canvas.height = 800;

var gameOn = true;

// Background image
var bgReady = false;
var bgImage = new Image();
bgImage.onload = function () {
	bgReady = true;
};
bgImage.src = "images/background.png";

document.body.appendChild(canvas);

/* Map function to return letter grade given the value of the grade */
var mapper = function(grade) {
	if(grade == 4) {
		return 'A';
	}
	else if(grade == 3.7) {
		return 'A-';
	}
	else if(grade == 3.3) {
		return 'B+';
	}
	else {
		return 'C+';
	}
}

/* CS Courses taken by Baraa Orabi */
var classes = [101, 102, 201, 202, 223, 224, 315, 319, 342, 353, 476, 473, 470, 464, 421, 461, 425]
var credits = [4,4,3,3,4,4,3,4,4,3,3,3,3,3,3,3,3]
/* And his grades respectively */
var grades = [4, 4, 4, 4, 4, 4, 4, 4, 3.7, 4, 4, 4, 4, 4, 3.3, 2.3, 4]
var letterGrades = grades.map(grade => mapper(grade));

// Baraa got an A (or A-/B+) image.

var baraaAReady = false;
var baraaAImage = new Image();
baraaAImage.onload = function() {
	baraaAReady = true;
}
baraaAImage.src = 'images/baraa_a.png';

// Baraa hunting image.
var baraaReady = false;
var baraaImage = new Image();
baraaImage.onload = function() {
	baraaReady = true;
}
baraaImage.src = 'images/baraa.png';

// Varol Akman image.
var olReady = false;
var olImage = new Image();
olImage.onload = function() {
	olReady = true;
}
olImage.src = 'images/vakman.jpg';

// Game objects
var baraa = {
	speed: 250, // movement in pixels per second
	credits: 0,
	points: 0,
	x: canvas.width / 2,
	y: canvas.height / 2
};

var monsters = [];
var monstersCaught = 0;

var pushMonster = function() {
	// Get a random course.
	var index = Math.floor(Math.random() * classes.length);

	// Don't introduce the boss too early.
	if(monstersCaught < 16) {
		while(classes[index] == 461) {
			index = Math.floor(Math.random() * classes.length);
		}
	}

	var [x, y] = [Math.floor(Math.random() * (canvas.width - 100)), 80 + Math.floor(Math.random() * (canvas.height - 150))];

  // Course object.
	var monster = {
		course: 'CS' + classes[index],
		credit: credits[index],
		letterGrade: letterGrades[index],
		letterGradeInt: grades[index],
		x: x,
		y: y,
	}

	classes.splice(index, 1);
	letterGrades.splice(index, 1);
	grades.splice(index, 1);
	credits.splice(index, 1);

	monsters.push(monster);
}

// Handle keyboard controls
var keysDown = {};

addEventListener("keydown", function (e) {
	keysDown[e.keyCode] = true;
}, false);

addEventListener("keyup", function (e) {
	delete keysDown[e.keyCode];
}, false);

// Reset the game when the player catches a monster
var reset = function () {
		pushMonster();
		setTimeout(function() {
			baraaImage.src = 'images/baraa.png';
		}, 800)
};

// Update game objects
var update = function (modifier) {
	// console.log(gameOn);
	if(gameOn) {
		// Player holding up
		if (38 in keysDown) {
			baraa.y -= baraa.speed * modifier;
			if(baraa.y < 0){
				baraa.y = canvas.height;
			}
		}
		// Player holding down
		if (40 in keysDown) {
			baraa.y += baraa.speed * modifier;
			if(baraa.y > canvas.height) {
				baraa.y = 0;
			}
		}
		// Player holding left
		if (37 in keysDown) {
			baraa.x -= baraa.speed * modifier;
			if(baraa.x < 0) {
				baraa.x = canvas.width;
			}
		}
		// Player holding right
		if (39 in keysDown) {
			baraa.x += baraa.speed * modifier;
			if(baraa.x > canvas.width) {
				baraa.x = 0;
			}
		}

		// Is Baraa touching a course?
		for(var i = 0; i < monsters.length; i++) {
			var monster = monsters[i];

			if (
				baraa.x <= (monster.x + 60)
				&& monster.x <= (baraa.x + 60)
				&& baraa.y <= (monster.y + 60)
				&& monster.y <= (baraa.y + 60)
			) {
				++monstersCaught;

				baraaImage.src = 'images/baraa_a.png';

				baraa.credits += monster.credit;
				baraa.points += monster.credit * monster.letterGradeInt;

				if(monster.course ===  'CS461') {
					console.log("got it");
					gameOn = false;
					bgImage.src = 'images/vakman.jpg';
					alert('You got C+');
				}

				monsters.splice(i, 1);

				reset();
			}
		}
	}
};

// Draw everything
var render = function () {
	if(gameOn) {


		if (bgReady) {
			ctx.drawImage(bgImage, 0, 0);
		}

		if (baraaReady) {
			ctx.drawImage(baraaImage, baraa.x, baraa.y);
		}

		for(var i = 0; i < monsters.length; i++) {
			ctx.fillText(monsters[i].course, monsters[i].x, monsters[i].y);
		}

		// Score
		ctx.fillStyle = "rgb(250, 250, 250)";
		ctx.font = "24px Helvetica";
		ctx.textAlign = "left";
		ctx.textBaseline = "top";
		ctx.fillText("Courses taken: " + monstersCaught, 32, 32);
		ctx.fillText("Major GPA: " + ((baraa.points / baraa.credits || 0).toFixed(2)) , 32, 64);
	}
	else {
		ctx.fillStyle = "rgb(255, 255, 255)";
		ctx.fillRect(0,0,800,800);

		if (bgReady) {
			ctx.drawImage(bgImage, 0, 0);
		}

		if (baraaReady) {
			baraaImage.src = 'images/baraa_sad.png';
			ctx.drawImage(baraaImage, 0, 250);
		}

		// Score
		ctx.fillStyle = "rgb(250, 250, 250)";
		ctx.font = "24px Helvetica";
		ctx.textAlign = "left";
		ctx.textBaseline = "top";
		ctx.fillText("Courses taken: " + monstersCaught, 32, 32);
		ctx.fillText("Major GPA: " + ((baraa.points / baraa.credits || 0).toFixed(2)) , 32, 64);
		ctx.font = "40 Helvetica";
		ctx.fillText('You got C+' , 170, 200);
	}

};

// The main game loop
var main = function () {
	var now = Date.now();
	var delta = now - then;

	update(delta / 600);
	render();

	then = now;

	// Request to do this again ASAP
	requestAnimationFrame(main);
};

// Cross-browser support for requestAnimationFrame
var w = window;
requestAnimationFrame = w.requestAnimationFrame || w.webkitRequestAnimationFrame || w.msRequestAnimationFrame || w.mozRequestAnimationFrame;

// Let's play this game!
var then = Date.now();
reset();
main();
