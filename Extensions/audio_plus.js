//* TITLE Audio+ **//
//* VERSION 0.2 REV B **//
//* DESCRIPTION Enhancements for the Audio Player **//
//* DEVELOPER STUDIOXENIX **//
//* FRAME false **//
//* BETA false **//

XKit.extensions.audio_plus = new Object({

	running: false,

	check_current_interval: 0,

	run: function() {
		this.running = true;

		if (XKit.interface.where().inbox === true) {
			return;
		}

		if ($("#posts").length > 0) {
			XKit.tools.init_css("audio_plus");
			$(document).on("mousemove mousedown mouseup mouseout click", ".xkit-audio-plus-slider, .xkit-audio-plus-slider-back", XKit.extensions.audio_plus.slider_do);
			XKit.post_listener.add("audio_plus", XKit.extensions.audio_plus.do);
			setTimeout(function() { XKit.extensions.audio_plus.do(); }, 500);
			$("body").append("<div id=\"xkit-audio-plus-current-player\"></div>");
			XKit.extensions.audio_plus.check_current_interval = setInterval(function() { XKit.extensions.audio_plus.check_current(); }, 1000);
		}

	},

	slider_mouse_down: false,

	check_current: function() {

		XKit.tools.add_function(function() {

			try {
				var current_player = Tumblr.AudioPlayer.current_player_id;

				var m_object = new Object();
				m_object.defined = false;

				if (typeof current_player !== "undefined") {
					m_object.defined = true;
					m_object.title = audiojs.instances["audiojs" + current_player].audioplayer.$track_name.text();
					m_object.artist = audiojs.instances["audiojs" + current_player].audioplayer.$artist_name.text();
					m_object.playing = audiojs.instances["audiojs" + current_player].playing;
					m_object.id = parseInt(current_player);
					jQuery("#xkit-audio-plus-current-player").html("CU:" + JSON.stringify(m_object));
				} else {
					jQuery("#xkit-audio-plus-current-player").html("");
				}
			} catch(e){
				jQuery("#xkit-audio-plus-current-player").html("");
			}

		}, true, "");

		/*if (XKit.extensions.audio_plus.return_current_instance() === -1) {
			console.log("No player.");
		}else {
			console.log("Player:");
			console.log(XKit.extensions.audio_plus.return_current_instance());
		}*/

	},

	return_current_instance: function() {

		if ($("#xkit-audio-plus-current-player").html().substring(0,3) !== "CU:") {
			return -1;
		} else {
			try {
				return JSON.parse($("#xkit-audio-plus-current-player").html().substring(3));
			} catch(e) {
				return -1;
			}
		}

	},

	stop_current_instance: function() {

		if (XKit.extensions.audio_plus.return_current_instance() === -1) { return; }

		var m_object = new Object();
		m_object.id = XKit.extensions.audio_plus.return_current_instance().id;

		XKit.tools.add_function(function() {

			var add_tags = JSON.parse(add_tag);
			var m_object = audiojs.instances["audiojs" + add_tags.id];
			m_object.pause();

		}, true, JSON.stringify(m_object));

	},

	play_current_instance: function() {

		if (XKit.extensions.audio_plus.return_current_instance() === -1) { return; }

		var m_object = new Object();
		m_object.id = XKit.extensions.audio_plus.return_current_instance().id;

		XKit.tools.add_function(function() {

			var add_tags = JSON.parse(add_tag);
			var m_object = audiojs.instances["audiojs" + add_tags.id];
			m_object.play();

		}, true, JSON.stringify(m_object));

	},

	fucking_firefox_fix: function(obj, volume) {

		var __id = $(obj).attr('id');
		var m_object = new Object();
		m_object.id = __id;
		m_object.volume = volume;

		XKit.tools.add_function(function() {

			var add_tags = JSON.parse(add_tag);
			var m_object = audiojs.instances[add_tags.id];
			m_object.setVolume(add_tags.volume);

		}, true, JSON.stringify(m_object));

	},

	acknowledge_slider_change: function(m_obj, m_x) {

		var __volume = (m_x - $(m_obj).offset().left - 7) / 100;
		if (__volume <= 0) { __volume = 0; }

		$(m_obj).find(".xkit-audio-plus-slider").attr("title", parseInt(m_x - $(m_obj).offset().left - 7));

		if (XKit.browser().firefox === true) {
			// Firefox is a fucking piece of shit, and the IE of our time.
			XKit.extensions.audio_plus.fucking_firefox_fix($(m_obj).parentsUntil('.post').find("object"), __volume);
		} else {
			$(m_obj).parentsUntil('.post').find("audio").get(0).volume = __volume;
		}

	},

	slider_do: function(e) {

		var m_x = e.pageX;
		var m_y = e.pageY;

		var m_obj = e.target;
		var __kickback = false;

		if ($(m_obj).hasClass("xkit-audio-plus-slider")) {
			m_obj = $(m_obj).parent();
			__kickback = true;
		}

		if (e.type === "mousedown") {
			XKit.extensions.audio_plus.slider_mouse_down = true;
		}

		if (e.type === "mouseup" || e.type === "mouseout") {
			if (e.type === "mouseout") {
				var m_top = $(m_obj).offset().top;
				var __diff = m_top - m_y;
				if (__diff <= 0) { __diff = __diff * -1 };
				if (__diff <= 10) { return; }
			}
			XKit.extensions.audio_plus.slider_mouse_down = false;
		}

		if (e.type === "click") {
			XKit.extensions.audio_plus.slider_mouse_down = false;

			var __left = m_x - $(m_obj).offset().left - 7;

			if (__left + 14 >= 100) { __left = 100 - 14; }
			if (__left <= 0) { __left = 0; }

			$(m_obj).find(".xkit-audio-plus-slider").css("left", __left + "px");
			XKit.extensions.audio_plus.acknowledge_slider_change(m_obj, m_x);

		}

		if (e.type === "mousemove") {
			if (XKit.extensions.audio_plus.slider_mouse_down === false) {
				return;
			}

			var __left = m_x - $(m_obj).offset().left - 7;

			if (__left + 14 >= 100) { __left = 100 - 14; }
			if (__left <= 0) { __left = 0; }

			$(m_obj).find(".xkit-audio-plus-slider").css("left", __left + "px");
			XKit.extensions.audio_plus.acknowledge_slider_change(m_obj, m_x);
		}

	},

	do: function() {

		var posts = XKit.interface.get_posts("audio_plus_done");

		$(posts).each(function() {

			$(this).addClass("audio_plus_done");

			var m_post = XKit.interface.post($(this));
			if (m_post.type !== "audio") { return; }

			// Check if hosted by Tumblr:
			if ($(this).find(".audio_player").length === 0 || $(this).find(".audio_visualizer").length === 0) { return; }

			var slider_html = 	"<div data-post-id=\"" + m_post.id + "\" class=\"xkit-audio-plus-slider-container\">" +
							"<div class=\"xkit-audio-plus-slider-back\">" +
								"<div data-post-id=\"" + m_post.id + "\" title=\"somepeoplelikefish\" class=\"xkit-audio-plus-slider\">&nbsp;</div>" +
							"</div>" +
						"</div>";

			$(this).find(".post_media").append(slider_html);

			// console.log("Volume is => " + $(this).find("audio").get(0).volume);

		});

	},

	destroy: function() {
		this.running = false;
		clearInterval(XKit.extensions.audio_plus.check_current_interval);
		$("#xkit-audio-plus-current-player").remove();
		XKit.post_listener.remove("audio_plus");
	}

});