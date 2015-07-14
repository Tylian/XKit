//* TITLE No Recommended **//
//* VERSION 2.0 REV A **//
//* DESCRIPTION Removes recommended posts **//
//* DETAILS This extension removes recommended posts from your dashboard. To remove Recommended Blogs on the sidebar, please use Tweaks extension. **//
//* DEVELOPER STUDIOXENIX **//
//* FRAME false **//
//* BETA false **//

XKit.extensions.norecommended = new Object({

	running: false,

	run: function() {
		this.running = true;
		XKit.post_listener.add("norecommended", XKit.extensions.norecommended.do);
		XKit.extensions.norecommended.do();		
	},

	preferences: {
		"no_liked": {
			text: "Get rid of recommended likes",
			default: false,
			value: false
		}
	},

	do: function() {

		if (XKit.extensions.norecommended.preferences.no_liked.value == true) {
			XKit.tools.add_css(" .rapid-recs {display: none;}", "norecommended_no_liked");
		}
		
		var doResize = false;
		
		$(".post").not(".norecommended-done").each(function() {
			
			$(this).addClass(".norecommended-done");
			
			if ($(this).hasClass("is_recommended") || $(this).find(".post_info_recommended").length > 0) {
				$(this).remove();	
				doResize = true;
			}
			
		});	
		
		if (doResize) {
			XKit.extensions.norecommended.call_tumblr_resize();	
		}
		
	},
	
	call_tumblr_resize: function() {
		
		XKit.tools.add_function(function() {
			Tumblr.Events.trigger("DOMEventor:updateRect");
		}, true, "");
		
	},

	destroy: function() {
		this.running = false;
		
		XKit.tools.remove_css("norecommended_no_liked");
	}

});
