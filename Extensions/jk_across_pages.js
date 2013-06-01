//* TITLE J/K Across Pages **//
//* VERSION 1.0 REV A **//
//* DESCRIPTION Allow Tumblr's J/K navigation to move between pages **//
//* DEVELOPER beiju **//
//* FRAME false **//
//* BETA true **//

XKit.extensions.jk_across_pages = new Object({
	/*
	 * If the top of the last post is this far below the top of the screen or less, j will move to the next page.
	 * If the bottom of first post is this far below the top of the screen or more, k will move to the previous page.
	 */
	scrollBuffer: 20,
	$posts: false,

	running: false,

	run: function() {
		// If #auto_pagination_loader exists, endless scrolling is enabled and this extension is useless
		if (jQuery('#auto_pagination_loader').length > 0) return;

		var that = this;
		jQuery(document.body).bind('keydown.xkit_jk_across_pages', function(evt) {
			if (!evt.shiftKey && !evt.ctrlKey && !evt.altKey && !evt.metaKey) {
				if (!(that.$posts instanceof jQuery)) {
					that.$posts = jQuery('.post_container').not('#new_post_buttons');
				}
				var key = evt.charCode ? evt.charCode : evt.keyCode;

				//console.log('key code', key, 
				//	'buffer', that.scrollBuffer, 
				//	'bottom scroll', that.$posts.last().offset().top - window.scrollY, 
				//	'top scroll', that.$posts.first().offset().top + that.$posts.first().height() - window.scrollY);
				

				if (key === 74 /* j */ && that.$posts.last().offset().top - window.scrollY <= that.scrollBuffer) {
					//console.log("Moving to next page");
					if (jQuery('#next_page_link').length > 0) window.location = jQuery('#next_page_link').attr('href');
				} else if (key === 75 /* k */ && that.$posts.first().offset().top + that.$posts.first().height() - window.scrollY >= that.scrollBuffer) {
					//console.log("Moving to previous page (if available)", jQuery('#previous_page_link'));
					if (jQuery('#previous_page_link').length > 0) window.location = jQuery('#previous_page_link').attr('href');
				}
			}
		});
		this.running = true;
	},

	destroy: function() {
		jQuery(document.body).unbind('keydown.xkit_jk_across_pages');
		this.running = false;
	}

});