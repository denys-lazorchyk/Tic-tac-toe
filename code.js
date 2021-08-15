const body = document.querySelector("body");
const player1 = document.querySelector(".player-1");
const player2 = document.querySelector(".player-2");

const spots = Array.from(document.querySelectorAll(".spot"));
const reset = document.querySelector(".reset");
const resetStat = document.querySelector(".reset-statistics");

const crosses = document.querySelectorAll(".cr");
const circles = document.querySelectorAll(".cir");

const wins_p1 = document.querySelector(".wins_p1");
const wins_p2 = document.querySelector(".wins_p2");
const ties = document.querySelector(".ties");

const r = document.querySelector(":root");

const animPropsBig = [
	[0, -420, 0],
	[0, -270, 0],
	[0, -120, 0],
	[-150, -270, 90],
	[0, -270, 90],
	[150, -270, 90],
	[0, -270, 45],
	[0, -270, -45],
];

const animPropsSmall = [
	[0, -290, 0],
	[0, -190, 0],
	[0, -90, 0],
	[-100, -200, 90],
	[0, -200, 90],
	[100, -200, 90],
	[0, -200, 45],
	[0, -200, -45],
];

const animPropsSmallExtra = [
	[0, -290, 0],
	[0, -190, 0],
	[0, -90, 0],
	[-100, -200, 90],
	[0, -200, 90],
	[100, -200, 90],
	[0, -200, 45],
	[0, -200, -45],
];

const animProps = {
	1: animPropsSmall,
	2: animPropsBig,
};

console.log(window.screen.width);
let game = {
	1: crosses,
	2: circles,
	field: [
		[true, 0],
		[true, 0],
		[true, 0],
		[true, 0],
		[true, 0],
		[true, 0],
		[true, 0],
		[true, 0],
		[true, 0],
	],
	continue: true,
};
let active_player = 1;

let resetHtmlStats = function () {
	wins_p1.innerHTML = localStorage.getItem("wins_p1");
	wins_p2.innerHTML = localStorage.getItem("wins_p2");
	ties.innerHTML = localStorage.getItem("ties");
};

let resetStatistics = function () {
	localStorage.setItem("wins_p1", 0);
	localStorage.setItem("wins_p2", 0);
	localStorage.setItem("ties", 0);
	resetHtmlStats();
};

const displayWinner = function (a, numberOfStruct) {
	game.continue = false;
	let screenChoice;

	if (window.screen.width >= 1200) {
		screenChoice = 2;
	} else {
		screenChoice = 1;
	}

	if (a === 1 || a === 2) {
		r.style.setProperty(
			"--animation-X",
			`${animProps[screenChoice][numberOfStruct][0]}px`
		);
		r.style.setProperty(
			"--animation-Y",
			`${animProps[screenChoice][numberOfStruct][1]}px`
		);
		r.style.setProperty(
			"--animation-rotate",
			`${animProps[screenChoice][numberOfStruct][2]}deg`
		);

		let key = `wins_p${active_player}`;

		if (active_player === 1) {
			localStorage.setItem(key, Number(localStorage.getItem(key)) + 1);
		} else {
			localStorage.setItem(key, Number(localStorage.getItem(key)) + 1);
		}

		reset.classList.toggle("active");
		reset.innerHTML = `P${active_player} won! Play again?`;
	} else {
		reset.innerHTML = "It is a tie, baby! Play again?";
		reset.style.fontSize = "23px";
		localStorage.setItem("ties", Number(localStorage.getItem("ties")) + 1);
	}

	wins_p1.innerHTML = localStorage.getItem("wins_p1");
	wins_p2.innerHTML = localStorage.getItem("wins_p2");
	ties.innerHTML = localStorage.getItem("ties");
};

const checkForWinner = function () {
	function check(struct, numberOfStruct) {
		if (struct.every((a) => a === struct[0] && a !== 0)) {
			displayWinner(active_player, numberOfStruct);
			return;
		}
	}

	let row1 = [game.field[0][1], game.field[1][1], game.field[2][1]];
	check(row1, 0);

	let row2 = [game.field[3][1], game.field[4][1], game.field[5][1]];
	check(row2, 1);

	let row3 = [game.field[6][1], game.field[7][1], game.field[8][1]];
	check(row3, 2);

	let col1 = [game.field[0][1], game.field[3][1], game.field[6][1]];
	check(col1, 3);

	let col2 = [game.field[1][1], game.field[4][1], game.field[7][1]];
	check(col2, 4);

	let col3 = [game.field[2][1], game.field[5][1], game.field[8][1]];
	check(col3, 5);

	let dia1 = [game.field[0][1], game.field[4][1], game.field[8][1]];
	check(dia1, 6);

	let dia2 = [game.field[2][1], game.field[4][1], game.field[6][1]];
	check(dia2, 7);

	let counter = 0;
	for (let i = 0; i < 9; i++) {
		if (!game.field[i][1]) {
			break;
		}
		counter++;
	}
	if (counter === 9) {
		displayWinner(3);
		return;
	}
};

let changeMe = function (spot) {
	if (game.continue) {
		let position = spots.indexOf(spot);

		if (game.field[position][0]) {
			game[active_player][position].style.display = "block";
			game.field[position][0] = false;
			game.field[position][1] = active_player;
		}
		checkForWinner();
		changeActive();
	}
};

let changeActive = function () {
	active_player = Math.trunc(active_player % 2) + 1;
	player1.classList.toggle("active");
	player2.classList.toggle("active");
};

let resetGame = function () {
	active_player = 1;
	reset.innerHTML = "Reset";
	crosses.forEach((a) => (a.style.display = "none"));
	circles.forEach((a) => (a.style.display = "none"));
	player1.classList.add("active");
	player2.classList.remove("active");
	reset.classList.remove("active");
	game.continue = true;
	game.field = [
		[true, 0],
		[true, 0],
		[true, 0],
		[true, 0],
		[true, 0],
		[true, 0],
		[true, 0],
		[true, 0],
		[true, 0],
	];
};

//game logic:
let game_itself = function () {
	if (!localStorage.getItem("wins_p1")) {
		resetStatistics();
	}

	resetHtmlStats();

	spots.forEach((spot) =>
		spot.addEventListener("click", () => {
			changeMe(spot);
		})
	);

	reset.addEventListener("click", resetGame);
	resetStat.addEventListener("click", () => {
		resetStatistics();
	});
};

game_itself();
