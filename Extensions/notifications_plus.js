//* TITLE Notifications+ **//
//* VERSION 1.2 REV C **//
//* DESCRIPTION Enhances the notifications **//
//* DEVELOPER STUDIOXENIX **//
//* FRAME false **//
//* BETA false **//
//* DETAILS This extension replaces both XPreview and Only Replies extensions of XKit 6. Using this, you can hover over notifications to get post notes, and toggle the option that dims non-reply notifications. **//
//* SLOW true **//

XKit.extensions.notifications_plus = new Object({

	running: false,
	slow: true,
	
	last_post_id: "",
	last_post_notes: 0,
	current_post_id: "",
	
	preferences: {
		"sep_1": {
			text: "Notes",
			type: "separator",
		},
		"show_notes": {
			text: "Show notes when I hover on a notification",
			default: true,
			value: true
		},
		"sep_2": {
			text: "Dim Notifications",
			type: "separator",
		},
		"only_replies": {
			text: "Dim non-reply notifications",
			default: false,
			value: false
		},
		"dont_dim_on_reblogs": {
			text: "Don't dim notifications on reblogs with new text (might be slow)",
			default: false,
			value: false
		},
	},

	run: function() {
		this.running = true;
		
		if (XKit.extensions.notifications_plus.preferences.only_replies.value === true) {
			XKit.tools.add_css("ol#posts .notification { opacity: 0.29; } ol#posts .notification_answer, ol#posts .notification_reply, ol#posts .notification:hover { opacity: 1; } ", "notifications_plus_only_replies");
		}
		
		if (XKit.extensions.notifications_plus.preferences.dont_dim_on_reblogs.value === true) {
			XKit.post_listener.add("notifications_plus", XKit.extensions.notifications_plus.dedim);
			XKit.extensions.notifications_plus.dedim();
		}
		
		if (XKit.extensions.notifications_plus.preferences.show_notes.value === true) {
			XKit.tools.init_css("notifications_plus");
			XKit.extensions.notifications_plus.xpreview_init();
		}
	},
	
	dedim: function() {
	
		$(".notification_reblog").not("notifications-plus-done").each(function() {
		
			$(this).addClass(".notifications-plus-done");
			if ($(this).find("blockquote").length > 0) {
				$(this).css("opacity","1");	
			}
			
		});	
		
	},
	
	xpreview_init: function() {
	
		$("body").append("<div id=\"xpreview-container\"><div id=\"xpreview-notes\">&hearts; 302</div></div>");	
		
		$(document).on("mouseenter", ".notification", function(e){
			XKit.extensions.notifications_plus.xpreview_show($(this));	
		});
		
		$(document).on("mouseleave", ".notification", function(e){
			$("#xpreview-container").css("display","none");	
		});
		
	},
	
	xpreview_show: function(obj) {
		
		// get post URL.
		var post_url = $(obj).find(".preview_frame").attr('href');

		if (post_url === "") {
			// XReply is here! (Compatibility with XKit 6)
			post_url = $(obj).attr('data-old-href');
			if (post_url === "") {
				// Something awful happened.
				return;
			}
		}
		
		XKit.console.add("Notifications+: Post URL is " + post_url);

		// Break it down.
		post_url = post_url.replace('http://','');
		post_url = post_url.replace('.tumblr.com','');
	
		var parts = post_url.split('/');
		var blog_id = parts[0];
		var post_id = parts[2];
		

		// Position the window.
		var offset = $(obj).offset();
		// Box position
		var box_left = offset.left + $(obj).width();
		var box_top = offset.top + 7;	
		$("#xpreview-container").css("top",box_top + "px");
		$("#xpreview-container").css("left",box_left + "px");
		$("#xpreview-container").css("display","block");
		$("#xpreview-container").addClass("loading");
		$("#xpreview-notes").html("loading");
		
		XKit.extensions.notifications_plus.xpreview_load(post_id, blog_id);
		
	},
	
	xpreview_load: function(post_id, blog_id) {
		
		XKit.extensions.notifications_plus.current_post_id = post_id;
	
		if (XKit.extensions.notifications_plus.last_post === post_id) {
			$("#xpreview-notes").html("&hearts; " + XKit.extensions.notifications_plus.last_post_notes);
			$("#xpreview-container").removeClass("loading");
			return;
		}

		if (blog_id === "") {
			XKit.console.add("Can't do XPreview, no blog_id");
			$("#xpreview-container").css("display","none");
			$("#xpreview-container").removeClass("loading");
			return;
		}

		XKit.console.add("Getting http://" + blog_id + ".tumblr.com/api/read?id=" + post_id);

		GM_xmlhttpRequest({
  			method: "GET",
  			url: "http://" + blog_id + ".tumblr.com/api/read?id=" + post_id,
  			onerror: function() {
  				XKit.console.add("Can not load page to load notes.");	
  			},
  			onload: function(response) {
				var data = response.responseText;
       				var xstart = data.indexOf('unix-timestamp="');
				var xend = data.indexOf('"', xstart + 18);
				var xts = data.substring(xstart + 16, xend);
				xts = parseInt(xts) + 10;
				var new_url = "http://" + blog_id + ".tumblr.com/archive?before_time=" + xts;
				if (XKit.extensions.notifications_plus.current_post_id !== post_id) {
					return;	
				}
				XKit.console.add(" -- Getting " + new_url);
				GM_xmlhttpRequest({
  					method: "GET",
  					url: new_url,
  					onload: function(response) {
  						try {
							data = response.responseText;
							/*var post_cont = $("#post_" + post_id, data);
							var real_html = $(post_cont).find(".notes").html();
							if (real_html.indexOf(" ") !== -1) {
								real_html = real_html.substring(0, real_html.indexOf(" "));
							}
							if (XKit.extensions.notifications_plus.current_post_id !== post_id) {
								return;	
							}
							*/
							
							var real_html = "";
							
							$(".post",data).each(function() {
								var r_post_id = $(this).attr('data-id');
								if (r_post_id === post_id) {
									real_html = $(this).find(".post_notes").html();	
									return false;
								} 	
							});
							

							if (real_html.indexOf(" ") !== -1) {
								real_html = real_html.substring(0, real_html.indexOf(" "));
							}
							
							if (XKit.extensions.notifications_plus.current_post_id !== post_id) {
								return;	
							}
							
							$("#xpreview-container").removeClass("loading");
							$("#xpreview-notes").html("&hearts; " + real_html);
							XKit.extensions.notifications_plus.last_post = post_id;
							XKit.extensions.notifications_plus.last_post_notes = real_html;
						} catch(e) {
							XKit.console.add(e.message);	
						}
  					}
				});
			}
		});	
	
	},

	destroy: function() {
		this.running = false;
		XKit.post_listener.remove("notifications_plus");
		XKit.tools.remove_css("notifications_plus_only_replies");
	}

});