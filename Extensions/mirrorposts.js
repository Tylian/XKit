//* TITLE Mirror Button **//
//* VERSION 1.0.0 **//
//* DESCRIPTION	A button to easily backup posts to archive.is or archive.org **//
//* DEVELOPER Legoben **//
//* FRAME false **//
//* BETA false **//

XKit.extensions.mirrorposts = new Object({

	running: false,

	preferences: {
		"archiveis": {
			text: "Use archive.is instead of The WayBack Machine",
			default: false,
			value: false
		},
		"menu": {
			text: "Archive posts through the share menu instead of having a button",
			default: true,
			value: false
		}
	},


	run: function () {
		this.running = true;
		XKit.tools.init_css("mirrorposts");
		XKit.post_listener.add("archivebutton_addButton", XKit.extensions.mirrorposts.addButton);
		XKit.extensions.mirrorposts.addButton();

	},

	destroy: function () {
		XKit.post_listener.remove("archivebutton_addButton");
		XKit.tools.remove_css("mirrorposts");
		$(".archivebutton-button").remove();

		$(".archivebutton_applied").removeClass("archivebutton_applied");

		this.running = false;

	},

	addButton: function () {
		$(".post").not(".archivebutton_applied").each(function () {
			$(this).addClass("archivebutton_applied");


			var posturl = $(".post_permalink", this).attr("href");

			var archiveurl;
			if(XKit.extensions.mirrorposts.preferences.archiveis.value){
				archiveurl = "https://archive.is/?run=1&url=" + encodeURIComponent(posturl);
			} else {
				archiveurl = "https://web.archive.org/save/" +posturl;
			}


			if(XKit.extensions.mirrorposts.preferences.menu.value){
				$(".share_social_button", this).click(function(){
					var menuitem = $('<li class="popover_menu_item"><a class="popover_menu_item_anchor">Archive this post</a></li>');


					$(menuitem).click(function(){
						window.open(archiveurl, '_blank');
					});

					setTimeout(function(){ //Make sure the pop-up has popped up
						$(".share_reddit", "#dashboard_index > div.popover--post-share-popover").after(menuitem);
					}, 10);
				});


			} else {
				var button = $("<div></div>");
				$(button).addClass("post_control archivebutton-button");
				$(button).attr("archiveurl", archiveurl);
				$(button).click(function () {
					window.open(archiveurl, '_blank');
				});
				$(".post_controls_inner", this).prepend(button);
			}

		});
	}

});
