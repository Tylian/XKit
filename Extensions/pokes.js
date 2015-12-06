//* TITLE Pokés **//
//* VERSION 0.4.0 **//
//* DESCRIPTION Gotta catch them all! **//
//* DETAILS Randomly spawns Pokémon on your dash for you to collect. **//
//* DEVELOPER new-xkit **//
//* FRAME false **//
//* BETA true **//
//* SLOW true **//

XKit.extensions.pokes = {
	running: false,
	pokedex_url: "https://new-xkit.github.io/XKit/Extensions/dist/page/pokedex.json",

	preferences: {
		"catch_backgrounds": {
			text: "Give Pokémon a background (for visibility)",
			default: false,
			value: false
		}
	},

	run: function() {
		this.running = true;
		XKit.tools.init_css('pokes');
		XKit.post_listener.add('pokes', XKit.extensions.pokes.checkEligibility);
		XKit.extensions.pokes.checkEligibility();
	},

	fetch_pokedex: function(callback, error) {
		if (!XKit.extensions.pokes.gist_cache) {
			GM_xmlhttpRequest({
				method: "GET",
				url: XKit.extensions.pokes.pokedex_url,
				json: true,
				onerror: function(response) {
					console.log("Poke data could not be retrieved. Skipping instance.");
					if (error) { error(response); }
				},
				onload: function(response) {
					var mdata = {};
					try {
						mdata = JSON.parse(response.responseText);
						XKit.extensions.pokes.gist_cache = mdata;
						callback(mdata);
					} catch(e) {
						console.log("Poke data received was not valid JSON. Skipping instance.");
						if (error) { error(response); }
					}
				}
			});
		} else {
			callback(XKit.extensions.pokes.gist_cache);
		}
	},

	checkEligibility: function() {
		$(".post_avatar:not(.poked):not(.unpokable)").each(function() {
			if (XKit.extensions.pokes.chanceGen()) {
				$(this).addClass("poked");
			} else {
				$(this).addClass("unpokable");
			}
		});

		$(".poked:not(.poke_spawned)").each(function() {
			var pokeNr = XKit.extensions.pokes.pokeGen();
			XKit.extensions.pokes.fetchPoke(pokeNr, $(this));
			$(this).addClass("poke_spawned");
		});
	},

	parse_pokemon: function(mdata, db_nr, pokedThing) {
		var poke_name = mdata[db_nr].name;
		var poke_sprite = mdata[db_nr].sprite;
		var m_f_ratio = parseInt(mdata[db_nr].gender_rate);
		var rarity = parseInt(mdata[db_nr].rarity);

		var poke_gender = "undefined";
		if (m_f_ratio === -1) {
			poke_gender = "genderless";
		} else {
			var rnd_nr = Math.random();
			var male_ratio = (m_f_ratio / 8);
			if (rnd_nr <= male_ratio) {
				poke_gender = "female";
			} else {
				poke_gender = "male";
			}
		}

		var rarityPicker = Math.floor(Math.random() * 255);
		if (rarityPicker >= 0 && rarityPicker <= rarity) {
			var poke_html;
			if (XKit.extensions.pokes.preferences.catch_backgrounds.value) {
				poke_html = '<div class="poke poke_background" data-pokeid="'+db_nr+'" data-pokename="'+poke_name+'" data-pokegender="'+poke_gender+'">'+
				'<img src="'+poke_sprite+'" alt="'+poke_name+'"/>'+'</div>';
			} else {
				poke_html = '<div class="poke" data-pokeid="'+db_nr+'" data-pokename="'+poke_name+'" data-pokegender="'+poke_gender+'">'+
				'<img src="'+poke_sprite+'" alt="'+poke_name+'"/>'+'</div>';
			}
			pokedThing.after(poke_html);
			pokedThing.parent().find(".poke").click(function(event) {
				if (XKit.storage.get("pokes","pokemon_storage","") === "") {
					XKit.storage.set("pokes","pokemon_storage","[]");
				}

				try {
					var storage_array = JSON.parse(XKit.storage.get("pokes","pokemon_storage", ""));
					if (storage_array !== "") {
						var poke_id = $(this).data("pokeid");
						var poke_gender = $(this).data("pokegender");
						var poke_name = $(this).data("pokename");
						var poke_wiki_name = poke_name;

						if (poke_name.indexOf(" ") > -1) {
							var firstWord = poke_name.split(" ")[0];
						if (firstWord == "Mega" || firstWord == "Primal") {
								poke_wiki_name = poke_name.split(" ")[1];
							} else if (firstWord == "Cosplay") {
								poke_wiki_name = "Cosplay Pikachu";
							} else {
								poke_wiki_name = firstWord;
							}
						}

						var old_amount = 0;
						for (var i = 0; i < storage_array.length; i++) {
							if (storage_array[i].id === poke_id && storage_array[i].gender === poke_gender) {
								old_amount = storage_array[i].amount;
								storage_array.splice(i, 1);
							}
						}
						storage_array.push({id: poke_id, gender: poke_gender, amount: old_amount + 1});
						XKit.storage.set("pokes","pokemon_storage",JSON.stringify(storage_array));
						XKit.notifications.add("You caught a " + poke_gender + " " + poke_name.charAt(0).toUpperCase() + poke_name.substr(1) + "!","pokes", false, function () {
							window.open("http://bulbapedia.bulbagarden.net/wiki/" + poke_wiki_name);
						});
						$(this).hide();
					} else {
						XKit.window.show("Catching failed!", "Something went wrong trying to catch the Pokémon. Please try again.<br/><br/>Error code: PKMN-001","error","<div class=\"xkit-button default\" id=\"xkit-close-message\">OK</div>");
					}
				} catch(e) {
					XKit.window.show("Catching failed!", "Something went wrong trying to catch the Pokémon. Please try again.<br/><br/>Error code: PKMN-002","error","<div class=\"xkit-button default\" id=\"xkit-close-message\">OK</div>");
				}
			});
		} else {
			XKit.extensions.pokes.parse_pokemon(mdata, XKit.extensions.pokes.pokeGen(), pokedThing);
		}
	},

	fetchPoke: function(db_nr, pokedThing) {
		XKit.extensions.pokes.fetch_pokedex(function(mdata) {
			XKit.extensions.pokes.parse_pokemon(mdata, db_nr, pokedThing);
		});
	},

	chanceGen: function() {
		var rnd_nr = Math.floor(Math.random() * 101);
		if (rnd_nr >= 0 && rnd_nr <= 8) {
			return true;
		}
		else {
			return false;
		}
	},

	pokeGen: function() {
		return Math.floor(Math.random() * 889);
	},

	destroy: function() {
		this.running = false;
		XKit.post_listener.remove("pokes");
	},

	cpanel: function(m_div) {
		m_div.append('<div id="xkit-loading_pokemon">Loading Pokémon, please wait...</div>');
		XKit.extensions.pokes.fetch_pokedex(function(mdata) {
			var caught = JSON.parse(XKit.storage.get("pokes","pokemon_storage","[]"));
			var m_html = "You caught " + caught.length + " of " + mdata.length + " Pokémon!";
			m_html = m_html + "<table id=\"xkit-pokes-custom-panel\" class='pokemon_display'>";
			$.each(caught, function(index, value) {
				m_html = m_html + "<tr class='caught' data-pokegender='" + value.gender + "'><td class='poke_sprite'><div><img src='" + mdata[value.id].sprite + "'></div></td><td class='poke_gender'><div></div></td><td class='poke_stats'><div>Name: " + mdata[value.id].name + "</div></td></tr>";
			});
			m_html = m_html + "</table>";

			$("#xkit-loading_pokemon").html(m_html);
		}, function(response) {
			$("#xkit-loading_pokemon").html("<div id='xkit-pokes-custom-panel'>Failed to load Pokémon Data!<br>Please refresh the page or try again later!</div>");
		});

		$("#xkit-extensions-panel-right").nanoScroller();
		$("#xkit-extensions-panel-right").nanoScroller({ scroll: 'top' });

	}
};
