window.onload = function () {
	var game_toggle = false;
	var levels = document.querySelectorAll("#level");
	var levels_container = document.getElementById("levels-container");
	var game = document.getElementById("game");
	var game_container = document.getElementById("game-container");
	var button_goback = document.getElementById("button-goback");
	var stats_moves = document.getElementById("stats-moves");
	var stats_time = document.getElementById("stats-time");

	// level click event
	for(var i = 0; i < levels.length; i++) {
		var level = levels[i];
		level.addEventListener("click", (event) => {
			generate_game(event.currentTarget.getAttribute("data-level"));
			toggle_game();
		});
	}

	// go back event
	button_goback.addEventListener("click", () => {
		toggle_game();
		clear_game();
	});

	function toggle_game() {
		if (!game_toggle) {
			game.classList.remove("hide-block");
			levels_container.classList.add("hide-block");
			game_toggle = true;
		}
		else {
			game.classList.add("hide-block");
			levels_container.classList.remove("hide-block");
			game_toggle = false;
		}
	}

	function generate_game(levels) {
		// create card template
		const div = document.createElement("div");

		// add card
		game_container.innerHTML = "example";
	}

	function clear_game() {
		game_container.innerHTML = "";
	}
}

