//* TITLE Soft Refresh **//
//* VERSION 0.2 REV A **//
//* DESCRIPTION Refresh without refreshing **//
//* DEVELOPER STUDIOXENIX **//
//* DETAILS This extension allows you to see new posts on your dashboard without refreshing the page. When you get the New Posts bubble, click on the Tumblr logo, and new posts will appear on your dashboard.<br><br>If you still want to refresh the page completely (perform a Hard Refresh), hold the ALT key while clicking on logo and the page will refresh.<br><br>Please note that this extension is highly experimental, and might not work properly all the time. **//
//* FRAME false **//
//* BETA false **//
//* SLOW true **//

XKit.extensions.soft_refresh = new Object({

	running: false,
	slow: true,
	loading: false,
	default_page_title: document.title,

	run: function() {
		this.running = true;
		
		XKit.tools.init_css("soft_refresh");
		if (document.location.href.indexOf("http://www.tumblr.com/dashboard") === -1) {
			// Not in dashboard, quit.
			return;	
		}
		
		$(".logo_anchor").attr('onclick','return false');
		$(".logo_anchor").attr('href', '#');
		$(document).on("click", ".logo_anchor", function(event) {
			if (event.altKey) {
				location.reload(true);
				return;	
			}
			XKit.extensions.soft_refresh.load_posts();	
		});
	},
	
	load_posts: function() {
		
		if (this.loading === true) { return; }
		this.loading = true;
		
		$("#new_post").after("<div id=\"xkit_soft_refresh\">Checking for new posts</div>");
		$("#xkit_soft_refresh").slideDown('fast');
		
		document.title = this.default_page_title;
		$("#new_post_notice_container").css("display","none");
		$("#new_post_notice_container .tab_notice_value").html("0");
	
		GM_xmlhttpRequest({
			method: "GET",
			url: "http://www.tumblr.com/dashboard/",
			onerror: function(response) {
				$("#xkit_soft_refresh").slideUp('fast', function(){ $(this).remove(); });
				XKit.extensions.soft_refresh.show_cant_load_error();
				XKit.extensions.soft_refresh.loading = false;
			},
			onload: function(response) {
				$("#xkit_soft_refresh").slideUp('fast', function(){ $(this).remove(); });
				var new_posts = $("ol#posts", response.responseText).html();
				
				var m_count = 0;
				$($("ol#posts .post", response.responseText).get().reverse()).each(function() {
					
					if ($(this).attr('id') === "new_post") { return; }
					if ($("ol#posts").find("#" + $(this).attr('id')).length > 0) { return; }
					
					m_count++;
					$("#new_post").after($(this)[0].outerHTML);
						
				});
				$("html, body").animate({ scrollTop: 0 }, "slow");
				if (m_count === 0) {
					XKit.notifications.add("No new posts found.","info");
				} else {
					XKit.notifications.add("Added " + m_count + " new posts.","ok");
				}
				XKit.extensions.soft_refresh.loading = false;
			}
		});	
		
	},
	
	show_cant_load_error: function() {
		
		XKit.window.show("Can't get new posts","I could not fetch the page requested. There might be a problem with Tumblr servers, please try again later, or click on the Refresh the Page button to refresh it manually.","error","<div class=\"xkit-button default\" id=\"xkit-close-message\">OK</div><a href=\"/dashboard/\" class=\"xkit-button\">Refresh the page</a>");
		
	},

	destroy: function() {
		XKit.tools.remove_css("soft_refresh");
		this.running = false;
	}

});