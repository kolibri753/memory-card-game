window.onload = function () {
	let game_toggle = false;
	let levels = document.querySelectorAll("#level");
	let levels_container = document.getElementById("levels-container");
	let game = document.getElementById("game");
	let game_container = document.getElementById("game-container");
	let button_goback = document.getElementById("button-goback");
	let stats_moves = document.querySelectorAll("#stats-moves");
	let stats_time = document.querySelectorAll("#stats-time");
	let level_modal = document.getElementById("curr-level");
	let button_share = document.getElementById("share-btn");

	let btnModalWindowClose = document.getElementById("modal-close");
	let modalWindow = document.querySelector(".modal-overlay");
	let modalStars = document.querySelectorAll(".modal__star");

	let stars = document.querySelectorAll(".level .star-icon");

	let card_clicked = [];
	let steps;
	let steps_to_finish;
	let date;
	let current_level;
	let current_size
	let current_star_stats;
	let current_column_size;

	let is_goback_blocked = false;

	let cards = [];

	updateStarStats();

	//modal window
	function openModalWindow() {
		console.log(modalStars);
		for (let s = 0; s < modalStars.length; s++) {
			let star = modalStars[s];
			console.log(star);
			if (current_star_stats > s) star.classList.add("yellow");
			else star.classList.remove("yellow");
		}
		modalWindow.classList.add("open-modal");
	}
	function closeModalWindow() {
		modalWindow.classList.remove("open-modal");
		is_goback_blocked = false;
		button_goback.classList.remove("blocked");
	}
	btnModalWindowClose.addEventListener("click", closeModalWindow);

	const shareData = {
		title: "Can you beat me?",
		text: `I did it only using ${steps} moves and my time is ${stats_time[0].innerText}`,
		url: "https://memory-improving-card-game.netlify.app/",
	};

	button_share.addEventListener("click", async () => {
		try {
			await navigator.share(shareData);
			console.log("MDN shared successfully");
		} catch (err) {
			console.log(err);
		}
	});

	// level click event
	for (let i = 0; i < levels.length; i++) {
		let level = levels[i];
		level.addEventListener("click", (event) => {
			current_level = event.currentTarget.getAttribute("data-level");
			generate_game(current_level);
			let data_level = event.currentTarget.getAttribute("data-level");
			level_modal.innerText = data_level[0] + " ✖ " + data_level[1];
			toggle_game();
		});
	}

	// go back event
	button_goback.addEventListener("click", () => {
		if (is_goback_blocked) return;
		toggle_game();
		clear_game();
	});

	let timer;

	function toggle_game() {
		steps = 0;
		if (!game_toggle) {
			game.classList.remove("hide-block");
			levels_container.classList.add("hide-block");
			game_toggle = true;
			date = new Date();
			timer = setInterval(() => {
				var diff_in_second = Math.floor(
					(new Date().getTime() - date.getTime()) / 1000
				);
				var seconds = diff_in_second % 60;
				var minutes = (diff_in_second - seconds) / 60;
				if (seconds < 10) seconds = "0" + seconds;
				stats_time.forEach((element) => {
					element.innerText = minutes + ":" + seconds;
				});
			}, 1000);
		} else {
			game.classList.add("hide-block");
			updateStarStats();
			levels_container.classList.remove("hide-block");
			game_toggle = false;
			clear_game();
		}
	}

	function generate_game(levels) {
		current_column_size = levels % 10;
		let row_size = (levels - current_column_size) / 10;
		game_container.setAttribute("data-columns", current_column_size);
		current_size = row_size * current_column_size;
		steps_to_finish = current_size;
		/* create card template *
			<div class="card" id="card" data-open="false" data-value="36">
				<div class="card__front main-font_medium">
					<p>36</p>
				</div>
				<div class="card__back">
					<p>photo 36</p>
				</div>
			</div>
		*/

		// replace it with sprite in future !!!
		let img_names = [
			"bear",
			"bison",
			"buffalo",
			"cow",
			"crocodile",
			"deer",
			"elephant",
			"flamingo",
			"fox",
			"giraffe",
			"hedgehog",
			"hippopotamus",
			"horse",
			"pig",
			"rabbit",
			"rhinoceros",
			"tiger",
			"zebra",
		];
		let base_src = "/img/cards/animals/128/";
		let ext = ".png";
		let img_for_game = [];

		for (let i = 0; i < current_size / 2; i++) {
			let random_name = img_names[Math.floor(Math.random() * img_names.length)];
			img_names.splice(img_names.indexOf(random_name), 1);
			for (let a = 0; a < 2; a++) {
				let random_position = Math.floor(Math.random() * img_for_game.length);
				img_for_game.splice(random_position, 0, random_name);
			}
		}

		for (let i = 0; i < img_for_game.length; i++) {
			let img_name = img_for_game[i];
			let card = document.createElement("div");
			card.classList.add("card");
			card.id = "card";
			card.setAttribute("data-open", "false");
			card.setAttribute("data-value", img_name);

			let front = document.createElement("div");
			front.classList.add("card__front");
			let desc = document.createElement("p");
			desc.classList.add("main-font_medium");
			desc.innerText = i + 1;
			front.appendChild(desc);

			let back = document.createElement("div");
			back.classList.add("card__back");
			let img = document.createElement("img");
			img.src = base_src + img_name + ext;
			img.setAttribute("alt", img_name + " icon");
			back.appendChild(img);

			card.appendChild(front);
			card.appendChild(back);

			// add wrapper
			let wrapper = document.createElement("div");
			cards.push(wrapper);
			wrapper.classList.add("game__wrapper");
			wrapper.appendChild(card);
			game_container.appendChild(wrapper);
		}

		configureGrid();
		add_event_to_card();
	}

	function clear_game() {
		cards = [];
		game_container.innerHTML = "";
		stats_moves.forEach((element) => {
			element.innerText = "0";
		});
		clearInterval(timer);
		stats_time.forEach((element) => {
			element.innerText = "0:0";
		});
	}

	function add_event_to_card() {
		let cards = document.querySelectorAll("#card");

		// card click event
		for (let i = 0; i < cards.length; i++) {
			let card = cards[i];
			card.addEventListener("click", () => {
				let is_active = card.classList.contains("active");
				if (is_active) return;

				// add class active
				card.classList.add("active");
				steps += 1;
				stats_moves.forEach((element) => {
					element.innerText = steps;
				});

				// save card
				card_clicked.push(card);

				// if two card -> compare
				if (card_clicked.length == 2) {
					compare_card();
				}
			});
		}
	}

	function configureGrid() {
		// viewport width without vertical scrollbar
		let base_viewport_width = document.documentElement.clientWidth;
		const max_width = 1300;
		base_viewport_width = (base_viewport_width > max_width) ? 1300 : base_viewport_width;
		let viewport_padding_size = (base_viewport_width > 768) ? 40 : 10;
		let viewport_width = base_viewport_width - viewport_padding_size;

		let padding = (viewport_width > 768) ? 10 : 4; 

		const max_card_width = 210;
		const max_card_height = 130;
		let card_width = (viewport_width / current_column_size) - padding;
		card_width = (card_width > max_card_width) ? max_card_width : card_width;
		let card_height = max_card_height/max_card_width * card_width;

		let new_max_width = card_width * current_column_size + viewport_padding_size;
		game_container.style.maxWidth = new_max_width + "px";

		for (let i = 0; i < cards.length; i++) {
			let card = cards[i];
			card.style.width = card_width + "px";
			card.style.height = card_height + "px";
		}
	}

	addEventListener("resize", configureGrid);

	function compare_card() {
		let card1 = card_clicked[0];
		let card2 = card_clicked[1];
		let val1 = card1.getAttribute("data-value");
		let val2 = card2.getAttribute("data-value");
		// if equal -> set data-open="true"
		if (val1 == val2) {
			card1.setAttribute("data-open", "true");
			card2.setAttribute("data-open", "true");
			steps_to_finish -= 2;
			if (steps_to_finish == 0) {
				win();
			}
		} else {
			setTimeout(() => {
				card1.classList.add("animated");
				card1.classList.remove("active");
				card2.classList.add("animated");
				card2.classList.remove("active");
				setTimeout(() => {
					card1.classList.remove("animated");
					card2.classList.remove("animated");
				}, 1600);
			}, 1000);
		}
		card_clicked = [];
	}

	function win() {
		is_goback_blocked = true;
		button_goback.classList.add("blocked");
		saveStarStatsData();
		clearInterval(timer);
		setTimeout(openModalWindow, 1600);
	}

	function calculate_star() {
		let the_best_steps = current_size * 2;
		if (steps <= the_best_steps) current_star_stats = 3;
		else if (steps <= the_best_steps + current_size / 2) current_star_stats = 2;
		else current_star_stats = 1;
	}

	function saveStarStatsData() {
		let star_stats = JSON.parse(window.localStorage.getItem("star-stats"));
		if (star_stats === null) star_stats = {};
		calculate_star();
		star_stats[current_level] = current_star_stats;
		window.localStorage.setItem("star-stats", JSON.stringify(star_stats));
	}
	
	function cleanLocalStorage() {
		let star_stats = JSON.parse(window.localStorage.getItem("star-stats"));

		let data_level_arr = [];
		let is_need_update = false;

		// build data_level_arr
		for(let i = 0; i < levels.length; i++) {
			let level = levels[i];
			let data_level = level.getAttribute("data-level");
			if (data_level != null) data_level_arr.push(data_level);
		}

		// review local storage
		for (let level in star_stats) {
			if(!data_level_arr.includes(level)) {
				delete star_stats[level];
				is_need_update = true;
			}
		}

		// update storage if levels is not exist
		if (is_need_update) {
			window.localStorage.setItem("star-stats", JSON.stringify(star_stats));
		}
	}

	function updateStarStats() {
		let star_stats = JSON.parse(window.localStorage.getItem("star-stats"));

		if (star_stats === null) return;

		for (let level_index = 0; level_index < levels.length; level_index++) {
			let data_level = levels[level_index].getAttribute("data-level");
			if (data_level == null) continue;
			// set level stars
			let stats = star_stats[data_level];
			let index_first_star = level_index * 3;

			if (stats > 0) {
				// set first
				stars[index_first_star].classList.add("yellow");

				// set second
				if (stats > 1) stars[index_first_star + 1].classList.add("yellow");
				else stars[index_first_star + 1].classList.remove("yellow");

				// set third
				if (stats == 3) stars[index_first_star + 2].classList.add("yellow");
				else stars[index_first_star + 2].classList.remove("yellow");
			}
		}
	}

	cleanLocalStorage();
};
