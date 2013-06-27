//* TITLE Show More **//
//* VERSION 1.2 REV A **//
//* DESCRIPTION More options on the user menu **//
//* DEVELOPER STUDIOXENIX **//
//* DETAILS This extension adds additional options to the user menu (the one that appears under user avatars on your dashboard), such as Avatar Magnifier, links to their Liked Posts page if they have them enabled. Note that this extension, especially the Show Likes and Show Submit options use a lot of network and might slow your computer down. **//
//* FRAME false **//
//* BETA false **//
//* SLOW true **//

XKit.extensions.show_more = new Object({

	running: false,
	slow: true,
	
	likes_available: new Object(),
	submit_available: new Object(),
	anon_available: new Object(),

	preferences: {
		"show_magnetizer": {
			text: "Show Magnifier button to see a bigger version of their avatars",
			default: true,
			value: true
		},
		"show_likes": {
			text: "Show Likes button if user is sharing their liked posts",
			default: true,
			value: true
		},
		"show_submits": {
			text: "Show Submit button if user has their submit box enabled",
			default: false,
			value: false
		},
		"sep1": {
			text: "In-Dashboard Asks",
			type: "separator",	
		},
		"enable_anon": {
			text: "Enable sending anonymous messages from the dashboard",
			default: true,
			value: true
		}
		/*,"enable_in_dash_asks_on_inbox": {
			text: "Enable In-Dashboard asks on Inbox too",
			default: true,
			value: true			
		}*/	
	},

	run: function() {
		this.running = true;
		XKit.tools.init_css("show_more");
		XKit.post_listener.add("show_more", XKit.extensions.show_more.do_posts);
		XKit.extensions.show_more.do_posts();
		
		/*if (this.preferences.enable_in_dash_asks_on_inbox.value === true) {
			if ($("body").hasClass("dashboard_messages_inbox") === true || $("body").hasClass("dashboard_messages_submissions") === true) {
				$.getScript("http://assets.tumblr.com/assets/scripts/dashboard_ask.js?_v=" + XKit.tools.random_string(), function(data, textStatus, jqxhr) {
   					console.log('Load of dashboard_ask.js complete.');
   					
   					XKit.tools.add_function(function() {
   						Tumblr.DashboardAsk.initialize();
   					}, true, ""); 
				});
			}
		}*/
		
	},
	
	do_posts: function() {
		
		$('.tumblelog_menu_button').unbind('click', XKit.extensions.show_more.add_links);
		$('.tumblelog_menu_button').bind('click', XKit.extensions.show_more.add_links);	

		if (XKit.extensions.show_more.preferences.show_submits.value === true) {
			
			var m_delay_count = 0;
			
			$(".post_avatar").not(".xkit-show-more-submits-done").each(function() {
			
				$(this).addClass("xkit-show-more-submits-done");

				var username = $(this).parent().attr('data-tumblelog-name');

				if (XKit.extensions.show_more.submit_available[username] === true || 
					XKit.extensions.show_more.submit_available[username] === false) {
					return;	
				}
				
				var m_url = "http://" + username + ".tumblr.com/submit/";
				
				if (typeof username === "undefined" || username === "") {
					return;
				}
				
				// Temporarily set it to false while we fetch pages.
				XKit.extensions.show_more.submit_available[username] = false;
				
				setTimeout(function() {
					
					$.ajax({
 						url: m_url,
  						success: function(data, xhr) {	
							XKit.extensions.show_more.submit_available[username] = true;
  						}
					});
					
				}, 100 + (m_delay_count * 100));
				
				m_delay_count++;
				
			});	
			
		}
		
		if (XKit.extensions.show_more.preferences.enable_anon.value === true) {
			
			var m_delay_count = 0;
			
			$(".post_avatar").not(".xkit-show-more-anons-done").each(function() {
			
				$(this).addClass("xkit-show-more-anons-done");

				var username = $(this).parent().attr('data-tumblelog-name');

				if (XKit.extensions.show_more.anon_available[username] === true || 
					XKit.extensions.show_more.anon_available[username] === false) {
					return;	
				}
				
				var m_url = "http://www.tumblr.com/ask_form/" + username + ".tumblr.com";
				
				if (typeof username === "undefined" || username === "") {
					return;
				}
				
				// Temporarily set it to false while we fetch pages.
				XKit.extensions.show_more.anon_available[username] = false;
				
				setTimeout(function() {
					
					$.ajax({
 						url: m_url,
  						success: function(data, xhr) {	
  							if ($("#ask_anonymously", data).length > 0) {
								XKit.extensions.show_more.anon_available[username] = true;
							} else {
								XKit.console.add("No anon messages for " + username);	
							}
  						}
					});
					
				}, 100 + (m_delay_count * 100));
				
				m_delay_count++;
				
			});	
			
		}
		
		if (XKit.extensions.show_more.preferences.show_likes.value === true) {
			
			var m_delay_count = 0;
			
			$(".post_avatar").not(".xkit-show-more-likes-done").each(function() {
			
				$(this).addClass("xkit-show-more-likes-done");
				if ($(this).find(".xkit-likes").length > 0) { return;}
				
				var username = $(this).parent().attr('data-tumblelog-name');

				if (XKit.extensions.show_more.likes_available[username] === true || 
					XKit.extensions.show_more.likes_available[username] === false) {
					return;	
				}
				
				var m_url = "http://www.tumblr.com/liked/by/" + username;
				
				if (typeof username === "undefined" || username === "") {
					return;
				}
				
				// Temporarily set it to false while we fetch pages.
				XKit.extensions.show_more.likes_available[username] = false;
				
				setTimeout(function() {
					
					$.ajax({
 						url: m_url,
  						success: function(data, xhr) {	
							XKit.extensions.show_more.likes_available[username] = true;
  						}
					});
					
				}, 100 + (m_delay_count * 100));
				
				m_delay_count++;
				
			});	
			
		}
		
	},
	
	add_links: function(e) {

		var menu_box = $(e.target).parent().find(".tumblelog_menu_popover");
		var user_url = $(menu_box).parent().find(".tumblelog_menu_link").attr('data-tumblelog-name');
		var m_class = "";
                
                var m_html = "";
                
                $(menu_box).find(".xkit-submit").parent().remove();
                $(menu_box).find(".xkit-likes").parent().remove();
                
                if (XKit.extensions.show_more.anon_available[user_url] === true) {
                
                	$(menu_box).find(".tumblelog_menu_link.ask").attr('data-anonymous-ask','1');
                
                }
                
                if (XKit.extensions.show_more.preferences.show_likes.value === true && XKit.extensions.show_more.likes_available[user_url] === true) {
                	
                	var m_likes_url = "http://www.tumblr.com/liked/by/" + user_url;
                	
                	m_html = m_html + "<div class=\"popover_menu_item\">" +
                			"<a href=\"" + m_likes_url + "\" class=\"tumblelog_menu_link likes xkit-likes\">" +
                				"<span class=\"hide_overflow\">Likes</span>" +
                			"</a>" +
                		  "</div>";
                	
                }
                
                if (XKit.extensions.show_more.preferences.show_submits.value === true && XKit.extensions.show_more.submit_available[user_url] === true) {
                	
                	var m_likes_url = "http://" + user_url + ".tumblr.com/submit";
                	
                	m_html = m_html + "<div class=\"popover_menu_item\">" +
                			"<a target=\"_new\" href=\"" + m_likes_url + "\" class=\"tumblelog_menu_link likes xkit-submit\">" +
                				"<span class=\"hide_overflow\">Submit</span>" +
                			"</a>" +
                		  "</div>";
                	
                }
                
                $(menu_box).find(".xkit-avatar-magnetizer").parent().remove();
                
                if (XKit.extensions.show_more.preferences.show_magnetizer.value === true) {
                	
                	var avatar_url = $(menu_box).parentsUntil(".post_avatar").parent().find(".post_avatar_image").attr('src');
                	
                	if (avatar_url !== "" && typeof avatar_url !== "undefined") {
                		m_html = m_html + "<div class=\"popover_menu_item\">" +
                				"<a onclick=\"return false;\" data-avatar-url=\"" + avatar_url + "\" class=\"tumblelog_menu_link xkit-avatar-magnetizer xkit-avatar-magnetizer-button-" + user_url + "\" data-user-url=\"" + user_url + "\">" +
                					"<span class=\"hide_overflow\">Magnifier</span>" +
                				"</a>" +
                			  "</div>";
                	}
                	
                }
                					
		$(menu_box).find(".open_in_tab").parent().before(m_html);
		
		var m_target = e.target;
		
		$(".xkit-avatar-magnetizer-button-" + user_url).unbind('click');
		$(".xkit-avatar-magnetizer-button-" + user_url).bind('click', function() {
		
			XKit.extensions.show_more.show_avatar($(this).attr('data-avatar-url'));
			setTimeout(function() { $("#glass_overlay").trigger('click'); }, 10);

			$(m_target).trigger('click');
			//$("#glass_overlay").removeClass("show");
			
		});
		
	},
	
	show_avatar: function(avatar_url) {
		
		if ($("#xkit-avatar-magnetizer-shadow").length > 0) {
			$("#xkit-avatar-magnetizer-shadow").remove();
			$("#xkit-avatar-magnetizer-window").remove();	
		}
		
		avatar_url = avatar_url.replace("_64.gif","_512.gif");
		avatar_url = avatar_url.replace("_64.jpg","_512.jpg");
		avatar_url = avatar_url.replace("_64.png","_512.png");
		
		var m_html = 	"<div id=\"xkit-avatar-magnetizer-shadow\">&nbsp;</div>" +
				"<div id=\"xkit-avatar-magnetizer-window\">" +
					"<img src=\"" + avatar_url + "\">" +
					"<p>Click on the picture or the page to close</p>" +
				"</div>";
		
		$("body").append(m_html);
		
		$("#xkit-avatar-magnetizer-shadow").fadeIn('fast');
		$("#xkit-avatar-magnetizer-window").fadeIn('slow');
		
		$("#xkit-avatar-magnetizer-window, #xkit-avatar-magnetizer-shadow").click(function() {
			
			$("#xkit-avatar-magnetizer-shadow").fadeOut('slow');
			$("#xkit-avatar-magnetizer-window").fadeOut('fast');
					
		});
		
	},

	destroy: function() {
		$(".xkit-likes").parent().remove();
		$(".xkit-submit").parent().remove();
		$(".xkit-avatar-magnetizer").parent().remove();
		this.running = false;
	}

});