//* TITLE Panorama **//
//* VERSION 1.2 REV D **//
//* DESCRIPTION Widescreen dashboard **//
//* DEVELOPER STUDIOXENIX **//
//* FRAME false **//
//* DETAILS This extension extends your dashboard to fit the screen. It this an experimental extension, and no support for it provided yet. **//
//* BETA false **//
//* SLOW true **//

XKit.extensions.panaroma = new Object({

	running: false,
	slow: true,
	
	preferences: {
		stretch_images: {
			text: "Stretch images",
			default: false,
			value: false
		}
	},

	run: function() {
		this.running = true;
		XKit.tools.init_css("panaroma");
		
		if (XKit.extensions.panaroma.preferences.stretch_images.value === true) {
		
			XKit.tools.add_css("#posts .post .image_thumbnail.enlarged { width: 100% !important; height: auto !important; } #posts .post .flipcard, #posts .post .flipcard_front, #posts .post_content .image { width: 100% !important; height: auto !important; }", "panaroma_str");	
			
		}
		
		XKit.post_listener.add("panorama_resize", XKit.extensions.panaroma.resized_auto);
		$(window).on('resize', XKit.extensions.panaroma.resized);
		XKit.extensions.panaroma.resized();
	},
	
	resized_auto: function() {
		
		XKit.extensions.panaroma.resized(true);
		
	},
	
	resized: function(auto_mode) {
		
		var m_width = $(".post.is_note .post_wrapper").width() - 70;
		console.log(m_width);
		if (m_width <= 400) { m_width = 500; }
		$(".post.is_note .note_item").css("width", m_width + "px");	
		
	},

	destroy: function() {
		XKit.tools.remove_css("panaroma");
		XKit.tools.remove_css("panaroma_str");
		$(window).off('resize', XKit.extensions.panaroma.resized);
		XKit.post_listener.remove("panorama_resize");
		this.running = false;
	}

});