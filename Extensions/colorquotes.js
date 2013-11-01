//* TITLE Color Quotes **//
//* VERSION 1.0 REV A **//
//* DESCRIPTION Colored quotes for the dash **//
//* DETAILS Know those lines that appear when you reblog someone, when Tumblr quotes them? Sometimes, when a lot of people talk on the same post, it might be hard to keep track of those. This extension changes the color of each line (or their background, depending on your preferences) so you can read and differentiate them faster. **//
//* DEVELOPER STUDIOXENIX **//
//* FRAME false **//
//* BETA false **//

XKit.extensions.colorquotes = new Object({

	running: false,
	
	preferences: {
		"sep-0": {
			text: "Appearance",
			type: "separator"
		},
		"do_backgrounds": {
			text: "Use a faded color on block quote backgrounds too",
			default: false,
			value: false
		}
	},
	
	colors: ["ff1900","ff9000","ffd000","6adc13","00cd8b","00a5e7","001999","cc00b9","ff78e1"],

	run: function() {
		this.running = true;
		
		if ($("#posts").length > 0) {
			XKit.post_listener.add("colorquotes", XKit.extensions.colorquotes.do);
			XKit.extensions.colorquotes.do();	
		}
		
	},
	
	do: function() {
		
		var posts = XKit.interface.get_posts("xkit-color-quoted");

		$(posts).each(function() {
			
			$(this).addClass("xkit-color-quoted");
			
	  		var m_post = XKit.interface.post($(this));
	  		
	  		var count = 0;

			$(this).find("blockquote").each(function() {
				
				if (count > XKit.extensions.colorquotes.colors.length) { count = 0; }
				
				var m_color = XKit.extensions.colorquotes.hex_to_rgb(XKit.extensions.colorquotes.colors[count]);
				
				$(this).css("border-left-color", "#" + XKit.extensions.colorquotes.colors[count]);
				$(this).attr('xkit-border-color', JSON.stringify(m_color));
				$(this).addClass("xkit-colorquotes-border-item");
				
				if (XKit.extensions.colorquotes.preferences.do_backgrounds.value === true) {
					$(this).css("background", "rgba(" + m_color.r + "," + m_color.g + "," + m_color.b + ",0.1)");
				}
					
				count++;
				
			});
			

		});	
		
	},
	
	hex_to_rgb: function(hex) {
		
		// From: http://stackoverflow.com/questions/5623838/rgb-to-hex-and-hex-to-rgb
		
		var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
		return result ? {
        		r: parseInt(result[1], 16),
        		g: parseInt(result[2], 16),
        		b: parseInt(result[3], 16)
    		} : null;
    		
	},

	destroy: function() {
		$(".xkit-color-quoted").removeClass("xkit-color-quoted");
		$(".xkit-colorquotes-border-item").css("background","").css("border-left-color","");
		this.running = false;
	}

});