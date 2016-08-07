//* TITLE Alternate Audio Player **//
//* VERSION 0.1.0 **//
//* DESCRIPTION	Adds an alternative (working) audio player to audio posts. **//
//* DETAILS This extension adds a native HTML5 audio player to every audio post, which should always work as well as enabling looping, downloading, and better seeking. **//
//* DEVELOPER akunohomu **//
//* FRAME false **//
//* BETA true **//

XKit.extensions.alternate_audio_player = new Object({

	running: false,

	preferences: {
		"default_volume": {
			text: "Default volume",
			default: 1.0,
			value: 1.0,
			type: "combo",
			values: [
				"100%", 1.0,
				"75%", 0.75,
				"50%", 0.50,
				"25%", 0.25
			],
			desktop_only: true
		}
	},

	run: function() {
		"use strict";
		this.running = true;
		XKit.post_listener.add("alternate_audio_player", this.add_audio);
		this.add_audio();
	},

	add_audio: function() {
		"use strict";
		jQuery(".audio_player_container").not(".xkit-audio-added").each(function(index) {
			const ob = jQuery(this);
			ob.addClass("xkit-audio-added");
			const url = ob.attr("data-stream-url");
			const key = ob.attr("data-post-key");
			if (typeof url !== "undefined" && typeof key !== "undefined") {
				const player = jQuery("<audio class='xkit-audio-player' src='" + url + "?play_key=" + key +
					"' preload='none' style='width:100%;margin-top:8px;' controls><p>No audio support detected</p></audio>")
				player.prop("volume", XKit.extensions.alternate_audio_player.preferences.default_volume.value);
				ob.parent().append(player);
			}
		})
	},

	destroy: function() {
		"use strict";
		XKit.post_listener.remove("alternate_audio_player");
		jQuery(".xkit-audio-added").removeClass("xkit-audio-added");
		jQuery(".xkit-audio-player").remove();
		this.running = false;
	}

});
