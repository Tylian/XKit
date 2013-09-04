//* TITLE Panorama **//
//* VERSION 1.2 REV C **//
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
		
		$(window).on('resize', XKit.extensions.panaroma.resized);
		XKit.extensions.panaroma.resized();
	},
	
	resized: function() {
		
		var m_width = $(".post .post_body").width() - 60;
		$(".post .note_item").css("width", m_width + "px");	
		
	},

	destroy: function() {
		XKit.tools.remove_css("panaroma");
		XKit.tools.remove_css("panaroma_str");
		$(window).off('resize', XKit.extensions.panaroma.resized);
		this.running = false;
	}

});