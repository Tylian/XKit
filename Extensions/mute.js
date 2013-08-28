//* TITLE Mute! **//
//* VERSION 1.2 REV B **//
//* DESCRIPTION Better than 'shut up!' **//
//* DETAILS This extension allows you to hide text and answer posts by an user while still seeing their other posts. Useful if a blogger has nice posts but a bad personality. Please note that you'll need to re-mute them if a user changes their URL. **//
//* DEVELOPER STUDIOXENIX **//
//* FRAME false **//
//* BETA false **//
//* SLOW true **//

XKit.extensions.mute = new Object({

	running: false,
	slow: true,
	
	preferences: {
		"sep1": {
			text: "Muting Options",
			type: "separator"
		},
		hide_chat_posts: {
			text: "Hide chat posts by muted users too",
			default: false,
			value: false
		},
		hide_link_posts: {
			text: "Hide link posts by muted users too",
			default: false,
			value: false
		},
		hide_quote_posts: {
			text: "Hide quote posts by muted users too",
			default: false,
			value: false
		},
		hide_photo_posts: {
			text: "Hide photo / photoset posts by muted users too",
			default: false,
			value: false
		},
		"title": {
			text: "Muted users",
			type: "separator"
		}	
	},
	
	muted: new Array(),
	
	frame_run: function() {

		if ($(".btn.icon.unfollow").length > 0) {
			
			XKit.extensions.mute.load_muted();
			
			$("#xkit-mute-button").remove();
			
			if ($(".btn.icon.unfollow").hasClass("hidden")) {
				return;
			}
			
			$(".btn.icon.dashboard, .btn.icon.unfollow, .btn.icon.reblog, .btn.icon.follow").html("");
			$(".btn.icon.dashboard, .btn.icon.unfollow, .btn.icon.reblog, .btn.icon.follow").addClass("no_label");
			
			var m_username = $(".btn.unfollow").attr('data-tumblelog-name');
			
			var m_caption = "Mute";
			
			if (XKit.extensions.mute.muted.indexOf(m_username) !== -1) {
				m_caption = "Unmute";	
			}
			
			var m_html = "<a data-username=\"" + m_username + "\" id=\"xkit-mute-button\" class=\"btn no_icon\" href=\"#\">" + m_caption + "</a>";
			
			$("#iframe_controls").find(".btn.icon.unfollow").before(m_html);
			
			$("#xkit-mute-button").click(function() {
			
				var m_username = $(this).attr('data-username');
				
				if (XKit.extensions.mute.muted.indexOf(m_username) !== -1) {
					// Unmute
					var m_index = XKit.extensions.mute.muted.indexOf(m_username);
					XKit.extensions.mute.muted.splice(m_index, 1);
					XKit.extensions.mute.save();	
				} else {
					// Mute
					if (XKit.extensions.mute.muted.length >= 101) {
						alert("Can't mute.\nYou have over a hundred muted blogs.<br/>Please remove some before muting people.");
						return;
					}
			
					XKit.extensions.mute.muted.push(m_username);
					XKit.extensions.mute.save();
				}	
				
				XKit.extensions.mute.frame_run();
				
			});
			
			
			
		} 

	},

	run: function() {
		this.running = true;
		XKit.tools.init_css("mute");
		
		XKit.extensions.mute.load_muted();

		XKit.post_listener.add("mute", XKit.extensions.mute.do_posts);
		XKit.extensions.mute.do_posts();
		
		setTimeout(function() {
			
                if (typeof XKit.extensions.show_more !== "undefined") {
                	if (XKit.extensions.show_more.running === true && XKit.extensions.show_more.preferences.use_classic_menu.value === true) {
                		console.log("-------------- OK!");
                		XKit.extensions.show_more.add_custom_menu("mute", function(data) {
                			
                			console.log(data);
                			var user_url = data.name;
                			
                			var m_class = "";
        				var m_sentence = "Mute";
					if (XKit.extensions.mute.muted.indexOf(user_url) !== -1) {
						m_sentence = "Unmute";	
						m_class = "already_muted";
					}
					
					$(document).off("click", ".xkit-mute-button-" + user_url, XKit.extensions.mute.menu_clicked);
					$(document).on("click", ".xkit-mute-button-" + user_url, XKit.extensions.mute.menu_clicked);

					return "<div data-url=\"" + user_url + "\" class=\"xkit-mute-button-" + user_url + " xkit-mute " + m_class + "\">" + m_sentence + "</div>";

                		});	
                	}
                }
                
                }, 2000);
		
	},
	
	menu_clicked: function(e) {
		
		var m_object = $(e.target);
		
		if (!m_object.hasClass("xkit-mute")) {

			while (!m_object.hasClass("xkit-mute")) {
				m_object = m_object.parent();
			}			
			
		}
		
		var user_url = $(m_object).attr('data-url');
		XKit.extensions.mute.toggle_mute(user_url);
		XKit.extensions.show_more.hide_classic_menu();
		
		var m_sentence = "muted.";
		if (XKit.extensions.mute.muted.indexOf(user_url) === -1) {
			m_sentence = "unmuted.";	
		}
		XKit.notifications.add("User " + user_url + " is now " + m_sentence,"ok");	
		
	},
	
	load_muted: function() {
		
		var m_list = XKit.storage.get("mute", "muted_list", "");
		if (m_list === "") {
			XKit.extensions.mute.muted = new Array();	
		} else {
			try {
				XKit.extensions.mute.muted = JSON.parse(m_list);	
			} catch(e) {
				XKit.extensions.mute.muted = new Array();
				XKit.extensions.mute.save();
			}
		}	
		
	},
	
	do_posts: function(rethink) {
	
		$('.tumblelog_menu_button').unbind('click', XKit.extensions.mute.add_mute_link);
		$('.tumblelog_menu_button').bind('click', XKit.extensions.mute.add_mute_link);
	
		var update_rects = false;
		
		var m_posts = ".post.is_regular, .post.is_note";
		
		if (XKit.extensions.mute.preferences.hide_chat_posts.value === true) {
			m_posts = m_posts + ", .post.is_conversation";
		}
		
		if (XKit.extensions.mute.preferences.hide_link_posts.value === true) {
			m_posts = m_posts + ", .post.is_link";
		}
		
		if (XKit.extensions.mute.preferences.hide_quote_posts.value === true) {
			m_posts = m_posts + ", .post.is_quote";
		}
		
		if (XKit.extensions.mute.preferences.hide_photo_posts.value === true) {
			m_posts = m_posts + ", .post.is_photo, .post.is_photoset";
		}
		
		if (rethink === true) {
		
			$(m_posts).each(function() {
			
				var m_username = $(this).attr('data-tumblelog-name');
				$(this).addClass("xmute-done");
				
				if (XKit.extensions.mute.muted.indexOf(m_username) !== -1) {
					$(this).addClass("xmute-muted");
					update_rects = true;	
				} else {
					$(this).removeClass("xmute-muted");
					update_rects = true;	
				}
			
			});	
			
		} else {
	
			$(m_posts).not(".xmute-done").each(function() {
			
				var m_username = $(this).attr('data-tumblelog-name');
				$(this).addClass("xmute-done");
				
				if (XKit.extensions.mute.muted.indexOf(m_username) !== -1) {
					$(this).addClass("xmute-muted");
					update_rects = true;	
				}
			
			});
		
		}
		
		if (update_rects === true) {
			XKit.tools.add_function(function() {
				Tumblr.Events.trigger("DOMEventor:updateRect");
			}, true, "");	
		}
		
	},
	
	add_mute_link: function(e) {

		var menu_box = $(e.target).parent().find(".tumblelog_menu_popover");
		var user_url = $(menu_box).parent().find(".tumblelog_menu_link").attr('data-tumblelog-name');
		var m_class = "";
		
		var m_sentence = "Mute";
		if (XKit.extensions.mute.muted.indexOf(user_url) !== -1) {
			m_sentence = "Unmute";	
			m_class = "already_muted";
		}
		
		if ($(menu_box).find(".xkit-mute-button").length > 0) {
			// Remove first.
			$(menu_box).find(".xkit-mute-button").parent().remove();
		};
		
		/*
		
		The new menu structure:
		
		<div class="popover_menu_item">
                    <a class="user_menu_toggle_follow tumblelog_menu_link unfollow">
                        <span class="hide_overflow">
                            <span class="follow">Follow</span>
                            <span class="unfollow">Unfollow</span>
                        </span>
                    </a>
                </div>
                
                */

                
                var m_html = 	"<div class=\"popover_menu_item\">" +
                			"<a onclick=\"return false;\" class=\"tumblelog_menu_link xkit-mute-button " + m_class + " xkit-mute-button-" + user_url + "\" data-user-url=\"" + user_url + "\">" +
                				"<span class=\"hide_overflow\">" + m_sentence + "</span>" +
                			"</a>" +
                		"</div>";
                					
		$(menu_box).find(".open_in_tab").parent().before(m_html);
		
		var m_target = e.target;
		
		$(".xkit-mute-button-" + user_url).unbind('click');
		$(".xkit-mute-button-" + user_url).bind('click', function() {
		
			XKit.extensions.mute.toggle_mute(user_url);
			setTimeout(function() { $("#glass_overlay").trigger('click'); }, 10);
			$("#glass_overlay").removeClass("show");
			$(m_target).trigger('click');
			
		});
		
	},
	
	toggle_mute: function(user_url) {
	
		if (XKit.extensions.mute.muted.indexOf(user_url) !== -1) {
			
			// Unmute!
			var m_index = XKit.extensions.mute.muted.indexOf(user_url);
			XKit.extensions.mute.muted.splice(m_index, 1);
			XKit.extensions.mute.save();
			XKit.extensions.mute.do_posts(true);
		
		} else {
		
			// Mute!
			if (XKit.extensions.mute.muted.length >= 101) {
				XKit.window.show("Can't mute.","You have over a hundred muted blogs.<br/>Please remove some before muting people.","error","<div class=\"xkit-button default\" id=\"xkit-close-message\">OK</div>");
				return;
			}
			
			XKit.extensions.mute.muted.push(user_url);
			XKit.extensions.mute.save();
			XKit.extensions.mute.do_posts(true);
		
		}	
		
	},
	
	save: function() {
		
		XKit.storage.set("mute", "muted_list", JSON.stringify(XKit.extensions.mute.muted));
		
	},

	destroy: function() {
		this.running = false;
		XKit.tools.remove_css("mute");
		$('.user_menu_info_button').unbind('click', XKit.extensions.mute.add_mute_link);
		$(".xkit-mute-button").remove();
		$(".xmute-muted").removeClass("xmute-muted");
		
		XKit.tools.add_function(function() {
			Tumblr.Events.trigger("DOMEventor:updateRect");
		}, true, "");	
		
              	try {
              		XKit.extensions.show_more.remove_custom_menu("mute");		
              	} catch(e){
              		XKit.console.add("Can't remove custom menu, " + e.message);
              	}
			
	},
	
	create_div: function(ud) {
	
		return "<div class=\"xkit-muted-user\">" + ud + "<div class=\"xkit-unmute-user-button\" data-user-name=\"" + ud + "\">&#10006;</div></div>";	
		
	},
	
	cpanel: function(mdiv) {
	
		if ($("#xkit-control-panel-mute").length > 0) {
			$("#xkit-control-panel-mute").remove();
		}	
		
		if (XKit.extensions.mute.muted.length <= 0) {
			var m_html = "<div id=\"xkit-control-panel-mute\" class=\"no-muted-users\"><b>You have no muted users.</b><br/>You can add some using the \"i\" menu on their avatars on your dashboard.<br/>Hover over their avatar, click on the \"i\", then Mute.</div>";
			$(mdiv).append(m_html);
			return;
		}
		
		var m_html = "";
		for(var i=0;i<XKit.extensions.mute.muted.length;i++) {
			m_html = m_html + XKit.extensions.mute.create_div(XKit.extensions.mute.muted[i]);		
		}
		
		$(mdiv).append("<div id=\"xkit-control-panel-mute\">" + m_html + "</div>");
		
		$(".xkit-unmute-user-button").unbind("click");
		$(".xkit-unmute-user-button").bind("click", function() {
		
			var m_username = $(this).attr('data-user-name');
			var m_index = XKit.extensions.mute.muted.indexOf(m_username);
			XKit.extensions.mute.muted.splice(m_index, 1);
			XKit.extensions.mute.save();
			XKit.extensions.mute.do_posts(true);
			XKit.extensions.mute.cpanel(mdiv);
			
		});
		
	}

});