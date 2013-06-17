//* TITLE Glowing Follow **//
//* VERSION 1.0 REV A **//
//* DESCRIPTION Glowing plusses on blogs **//
//* DETAILS Makes the Follow button on people's blogs glow if they are following you and you are not following them. Before proceeding, please keep in mind that sometimes, ignorance is bliss. **//
//* DEVELOPER STUDIOXENIX **//
//* FRAME true **//
//* BETA false **//

XKit.extensions.glowing_follow = new Object({

	running: false,

	run: function() {
		this.running = true;
		XKit.tools.init_css("glowing_follow");
		
		if ($(".follow").length > 0) {

			// We got the follow button!
			var follow_button = $(".follow");

			// Are we already following this person?
			if (follow_button.hasClass("hidden") === true) {
				// Yeah. No need for this.
				return;
			}

			var username = document.location.href.indexOf("&name=");
			username = document.location.href.substring(username + 6); 

			if (username.indexOf("&") !== -1) {
				username = username.substring(0, username.indexOf("&"));
			}

			var blog_id = "";
			var m_blogs = XKit.tools.get_blogs();
			for(i=0;i<m_blogs.length;i++) {
				if (m_blogs[i] !== "") {
					blog_id = m_blogs[i];
					break;	
				}	
			}

			if (blog_id === "") {
				return;
			}

			// Check following status!
			$.ajax({
				type: "POST",
				url: "/check_if_user_is_friend",
				data: "tumblelog=" + blog_id + "&query=" + username,
			}).done(function( msg ) {
				if (msg === "1") {
					// This user is following us!
					$(".follow").addClass("xglow");
				}
			});

		}
		
	},

	destroy: function() {
		this.running = false;
	}

});