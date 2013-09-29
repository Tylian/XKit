//* TITLE Tweaks **//
//* VERSION 2.3 REV E **//
//* DESCRIPTION Various little tweaks for your dashboard. **//
//* DEVELOPER STUDIOXENIX **//
//* DETAILS These are small little tweaks that allows you customize your dashboard. If you have used XKit 6, you will notice that some of the extensions have been moved here as options you can toggle. Keep in mind that some of the tweaks (the ones marked with a '*') can slow down your computer. **//
//* FRAME false **//
//* SLOW true **//
//* BETA false **//

XKit.extensions.tweaks = new Object({

	running: false,
	slow: true,
	run_interval: 0,
	run_interval_2: 0,

	preferences: {

		"sep0": {
			text: "Popular tweaks",
			type: "separator",
		},
		"wrap_tags": {
			text: "Wrap tags for easier reading",
			default: true,
			value: true
		},
		"fix_blockquotes": {
			text: "Slim block quotes for easier reading",
			default: false,
			value: false
		},
		"small_quotes": {
			text: "Slim Quote post text on Dashboard",
			default: false,
			value: false
		},
		"hide_share": {
			text: "Hide the share button on posts",
			default: false,
			value: false
		},
		"hide_follows": {
			text: "Hide the mini-follow buttons on posts and notifications",
			default: false,
			value: false
		},
		"photo_replies": {
			text: "Auto-enable photo replies on all posts I create",
			default: false,
			value: false,
			experimental: true
		},
		"sep1": {
			text: "User Interface tweaks",
			type: "separator",
		},
		"show_new_on_secondary": {
			text: "Show new post icons on secondary dashboard pages",
			default: true,
			value: true	
		},
		"old_chat_posts": {
			text: "Show Chat posts in classic interface",
			default: false,
			value: false	
		},
		"scroll_new_posts": {
			text: "Scroll the new posts icons along with me",
			default: false,
			value: false	
		},
		"slim_popups": {
			text: "Slim down the popup menus such as the user menu",
			default: false,
			value: false	
		},
		"always_show_move_to_top": {
			text: "Always show 'Move to top' button on the queued posts page",
			default: true,
			value: true
		},
		"split_gear": {
			text: "Move the edit/remove buttons out of the gear menu",
			default: false,
			value: false,
			experimental: true
		},
		"sep2": {
			text: "Dashboard tweaks",
			type: "separator",
		},
		"hide_sponsored": {
			text: "Dim sponsored posts on dashboard (not recommended)",
			default: false,
			value: false
		},
		"dont_show_mine_on_dashboard": {
			text: "Don't show my own posts on my dashboard",
			default: false,
			value: false	
		},
		"dont_show_liked_on_dashboard": {
			text: "Don't show liked posts on my dashboard",
			default: false,
			value: false	
		},
		"hide_notes": {
			text: "Hide the notes on posts",
			default: false,
			value: false
		},
		"hide_tags": {
			text: "Hide the tags on posts",
			default: false,
			value: false
		},
		"hide_bubble": {
			text: "Hide the new post bubble when you are not in dashboard",
			default: false,
			value: false,
			slow: true
		},
		"sep3": {
			text: "Navigation and Search tweaks",
			type: "separator",
		},
		"redirect_to_everything": {
			text: "On popular tags, always show all posts, not just the popular ones",
			default: false,
			value: false,
			experimental: true
		},
		"hide_blog_search": {
			text: "Hide blogs on the search bar suggestions",
			default: false,
			value: false
		},
		"sep4": {
			text: "Sidebar tweaks",
			type: "separator",
		},
		"slim_sidebar": {
			text: "Slim sidebar buttons",
			default: false,
			value: false
		},
		"hide_activity": {
			text: "Hide the Activity button on sidebar",
			default: false,
			value: false
		},
		"hide_follower_count": {
			text: "Hide my follower count",
			default: false,
			value: false
		},
		"hide_post_count": {
			text: "Hide my post count",
			default: false,
			value: false
		},
		"hide_draft_count": {
			text: "Hide my drafted posts count",
			default: false,
			value: false
		},
		"hide_radar": {
			text: "Hide the Tumblr radar",
			default: false,
			value: false
		},
		"hide_find_blogs": {
			text: "Hide \"Find Blogs\" button",
			default: false,
			value: false
		},
		"hide_recommended": {
			text: "Hide Recommended blogs",
			default: false,
			value: false
		},
		"show_customize": {
			text: "Show Customize and Blog Settings buttons",
			default: true,
			value: true
		}
	},

	default_page_title: "",
	hide_bubble_interval: "",

	run: function() {
		this.running = true;

		if (XKit.extensions.tweaks.preferences.hide_bubble.value === true && document.location.href.indexOf("http://www.tumblr.com/dashboard") === -1) {

			XKit.extensions.tweaks.default_page_title = document.title;
			$("#new_post_notice_container").remove();
			hide_bubble_interval = setInterval(function() {
				document.title = XKit.extensions.tweaks.default_page_title;
			}, 1000);

		}

		if (XKit.extensions.tweaks.preferences.redirect_to_everything.value === true) {
			if (document.location.href.indexOf("http://www.tumblr.com/tagged/") !== -1) {
				var m_tag = document.location.href.replace("http://www.tumblr.com/tagged/","");
				m_tag = m_tag.replace("http://tumblr.com/tagged/","");
				m_tag = m_tag.replace("tumblr.com/tagged/","");
				m_tag = m_tag.replace("#","");
				var redirect_me = true;
				if (m_tag.substring(m_tag.length - 1) === "/") {
					m_tag = m_tag.substring(0, m_tag.length - 1);
				}
				if (m_tag.indexOf("/") !== -1) {
					var m_array = m_tag.split("/");
					if (m_array[m_array.length - 1] === "everything") {
						// Already on everything page.	
						redirect_me = false;
					}
				}
				if (redirect_me === true) {
					document.location.href = "http://tumblr.com/tagged/" + m_tag + "/everything";
				}
			}
		}


		if (XKit.extensions.tweaks.preferences.show_new_on_secondary.value === true) {
			
			if (document.location.href.indexOf('/dashboard') !== -1) {
			
				if ($("#new_post_buttons").length > 0) {
				
					// Save this.
					XKit.storage.set("tweaks","new_post_buttons", $("#new_post_buttons")[0].outerHTML);
					
				} else {
					
					var m_btn_html = XKit.storage.get("tweaks","new_post_buttons","");
					if (m_btn_html !== "" ||typeof m_btn_html !== "undefined") {
						$("#posts").prepend(m_btn_html);
					}
				}	
				
			}	
			
		}
		
		if (XKit.extensions.tweaks.preferences.hide_activity.value === true) {
			$("a.activity").parent().css("display","none");
		}

		if (XKit.extensions.tweaks.preferences.split_gear.value === true) {
			XKit.post_listener.add("tweaks_split_gear", XKit.extensions.tweaks.split_gear);
			XKit.extensions.tweaks.split_gear();
		}

		if (XKit.extensions.tweaks.preferences.hide_radar.value === true) {
			$("#tumblr_radar").css("display","none");
		}
		
		if (XKit.extensions.tweaks.preferences.photo_replies.value === true) {
			this.run_interval = setInterval(function() {
				$("#allow_photo_replies").attr('checked', true);
			}, 2000);
		}

		if (XKit.extensions.tweaks.preferences.hide_blog_search.value === true) {
			XKit.tools.add_css(".blog.search_results_section { display: none !important }", "xkit_tweaks_hide_blog_search");
		}
		
		if (XKit.extensions.tweaks.preferences.slim_popups.value === true) {
			XKit.tools.add_css(".tumblelog_menu_link { padding: 6px 10px 6px 34px !important; font-size: 13px !important; }" +
						".tumblelog_menu .tumblelog_menu_link:before { left: 7px !important; top: 5px !important; } ", "xkit_tweaks_slim_popups");
		}
		
		if (XKit.extensions.tweaks.preferences.hide_sponsored.value === true) {
			XKit.tools.add_css(".post.sponsored_post { opacity: 0.33 !important } .post.sponsored_post:hover { opacity: 1 !important }", "xkit_tweaks_hide_sponsored");
		}
		
	
		if (XKit.extensions.tweaks.preferences.small_quotes.value === true) {
			XKit.tools.add_css(".post.is_quote .post_title.large, .post.is_quote .post_title.extra_large { font-size: 20px; line-height: 22px; }", "xkit_tweaks_small_quotes");
		}

		if (XKit.extensions.tweaks.preferences.hide_recommended.value === true) {
			$("#recommended_tumblelogs").css("display","none");
		}
		
		if (XKit.extensions.tweaks.preferences.hide_share.value === true) {
			XKit.tools.add_css(".post .post_controls .share_social_button { display: none; } ", "xkit_tweaks_hide_share");
			XKit.post_listener.add("tweaks_check_for_share_on_private_posts", XKit.extensions.tweaks.check_for_share_on_private_posts);
			XKit.extensions.tweaks.check_for_share_on_private_posts();
		}

		if (XKit.extensions.tweaks.preferences.hide_notes.value === true) {
			XKit.tools.add_css(".post .post_notes { visibility: hidden; } ", "xkit_tweaks_hide_notes");
		}	
		
		if (XKit.extensions.tweaks.preferences.hide_tags.value === true) {
			XKit.tools.add_css(".post .post_tags { display: none; } ", "xkit_tweaks_hide_tags");
		}	
	

		if (XKit.extensions.tweaks.preferences.hide_find_blogs.value === true) {
			$("a.spotlight").parent().css("display","none");
		}
		
		if (XKit.extensions.tweaks.preferences.always_show_move_to_top.value === true) {
			XKit.tools.add_css("#posts .post .post_control.move_to_top { display: inline-block !important; } ", "always_show_move_to_top");
		}
		
		if (XKit.extensions.tweaks.preferences.hide_follower_count.value === true) {
			XKit.tools.add_css(".right_column .followers .count { display: none !important; } ", "xtweaks-hide_follower_count");
		}
		
		if (XKit.extensions.tweaks.preferences.hide_post_count.value === true) {
			XKit.tools.add_css(".right_column .posts .count { display: none !important; } ", "xtweaks-hide_post_count");
		}
		
		if (XKit.extensions.tweaks.preferences.hide_draft_count.value === true) {
			XKit.tools.add_css(".right_column .drafts .count { display: none !important; } ", "xtweaks-hide_drafts_count");
		}

		if (XKit.extensions.tweaks.preferences.slim_sidebar.value === true) {
			var m_css = ".controls_section li { height: 25px; } .controls_section li a { padding: 3px 13px 10px 40px; font-size: 13px; } .controls_section li>a:after { zoom: 0.80; left: 8px; top: -2px; } .controls_section a .count { top: 4px; } .controls_section .sub_control.link_arrow { margin-top: -2px; } #popover_button_blogs { height: auto; } #fan_mail_controls, #fan_mail_controls li, #recommended_tumblelogs li, #tag_editors li, #tag_contributors li { height: auto; }";
			XKit.tools.add_css(m_css, "xkit_tweaks_slim_sidebar");
		}

		if (XKit.extensions.tweaks.preferences.hide_follows.value === true) {
			XKit.tools.add_css(".notification_follow, .reblog_follow_button { display: none !important; } #posts .notes_outer_container.popover .note a.follow { display: none !important; } #posts .notes_outer_container.popover .note.like a.block { right: 16px; }", "xkit_tweaks_hide_follows");
		}

		if (XKit.extensions.tweaks.preferences.fix_blockquotes.value === true) {
			XKit.tools.add_css("#posts .post_content blockquote { border-left: solid 3px #dcdcdc; padding-left: 8px; margin-left: 6px; }", "xkit_tweaks_fix_blockquotes");
		}	
		
		if (XKit.extensions.tweaks.preferences.dont_show_liked_on_dashboard.value === true) {
			XKit.tools.add_css("#posts .post.is_liked { display: none !important; }", "xkit_tweaks_dont_show_liked");
			XKit.post_listener.add("tweaks_dont_show_liked", XKit.extensions.tweaks.check_for_liked_posts);
			XKit.extensions.tweaks.check_for_liked_posts();
		}	
		
		if (XKit.extensions.tweaks.preferences.old_chat_posts.value === true) {
			XKit.tools.add_css(".post_full.is_conversation .conversation_lines { border: 1px solid rgb(200,200,200); padding: 0px; font: normal 14px/1.4 \"Helvetica Neue\",\"HelveticaNeue\",Helvetica,Arial,sans-serif; } li.chat_line { padding: 10px 17px !important; border-bottom: 1px solid rgb(200,200,200); } li.chat_line:last-child { border-bottom: 0; }", "xkit_tweaks_fix_blockquotes");
		}
		
		if (XKit.extensions.tweaks.preferences.wrap_tags.value === true) {
			XKit.tools.add_css(".post .tags { width: 500px !important; display: block !important; }  .post .footer_links.with_tags { overflow:visible !important; display: block !important; }.post .footer_links.with_tags span, .footer_links.with_tags .source_url { display:block !important; overflow:visible !important; } .source_url_gradient { display: none !important; } span.tags { white-space:normal !important; } span.with_blingy_tag a.blingy { height:auto !important; display:inline-block !important; }  .source_url, .post_tags_wrapper { display: block !important; } ", "xkit_tweaks_wrap_tags");
			XKit.tools.add_css("#posts .post.post_full .post_tags { white-space: normal; } .post .post_tags a { font-size: 12px; } .post_full .post_tags:after { background: none !important; }", "xkit_tweaks_wrap_tags_v2");
			$(document).on('mouseup mousemove mouseover mousedown mouseout', '.post_tags_inner', function(e) {
				$(this).parent().removeClass("draggable");
				$(this).removeClass("post_tags_inner");
				$(this).addClass("xkit_post_tags_inner_add_back");
			});
		}
		
		if (document.location.href.indexOf('/dashboard') !== -1) {
		
			if (XKit.extensions.tweaks.preferences.dont_show_mine_on_dashboard.value === true) {
				XKit.tools.add_css("#posts .post.is_mine { display: none; } .new_post_buttons { display: block !important; }", "xkit_tweaks_dont_show_mine_on_dashboard");
				XKit.post_listener.add("tweaks_fix_hidden_post_height", XKit.extensions.tweaks.fix_hidden_post_height);
			}
			
		}
	
		if (XKit.extensions.tweaks.preferences.scroll_new_posts.value === true) {
			$(window).scroll(function () {
				if ($(window).scrollTop() >= 200) {
					$("#new_post").addClass("xkit-new-post-scrolls");	
				} else {
					$("#new_post").removeClass("xkit-new-post-scrolls");
				}
			});
			$("#new_post").click(function() {
			
				$('html, body').animate({
    					scrollTop: 30
 				}, 500);	
 				
 				$("#new_post").removeClass("xkit-new-post-scrolls");
				
			});
			XKit.tools.add_css(	"#new_post.xkit-new-post-scrolls { min-width: 540px; position: fixed; top: -5px; z-index: 100; opacity: 0.75; min-height: 88px !important; }" + 
						"#new_post.xkit-new-post-scrolls:hover { opacity: 1; }" + 
						"#new_post.xkit-new-post-scrolls #post_buttons { top: -5px !important; }" + 
						"#new_post.xkit-new-post-scrolls .post_avatar { display: none; }", "xkit_tweaks_scroll_new_posts");
		}

		if (XKit.extensions.tweaks.preferences.show_customize.value === true) {
			var user_url = "";
			if (document.location.href.indexOf('/blog') !== -1) {
				user_url = document.location.href.substring(document.location.href.indexOf('/blog/') + 6);
			} else {
				if ($("#open_blog_link").length > 0) {
					user_url = $("#open_blog_link").html().replace(".tumblr.com","");
				} else {
					return;
				}
			}
			if (typeof user_url === "undefined") { return; }
			user_url = user_url.replace("#","");
			
			if (user_url.indexOf("/") !== -1) {
				user_url = user_url.substring(0, user_url.indexOf("/"));
			}
			
			// Patch for custom domains.
			if ($("#popover_blogs > .popover_inner").length > 0) {
				user_url = $("#popover_blogs > .popover_inner").children(".item:first-child").attr('id').substring(9);
			}
			
			m_html = '<li class="no_push" id="xkit_customize_button">' +
				 '<a href="/customize/' + user_url + '" class="customize">' +
				 '<div class="hide_overflow">Customize</div>' +
				 '</a></li>';
				 
			$("#dashboard_controls_open_blog").append(m_html);
			
			var add_mega_link = true;	 
			if ($(".small_links").length > 0) {
				$(".small_links a").each(function() {
					var m_link = $(this).attr('href');
					if (m_link.indexOf('/mega-editor') !== -1) {
						add_mega_link = false;
						return false;
					}	
				});
			} else {
				add_mega_link = true;
			}
			
			if (add_mega_link) {
				x_html = '<div class="small_links by-xkit">' +
           					'<a href="/mega-editor/' + user_url + '" target="_mass_post_editor">Mass Post Editor</a>' +
           					'<a href="/blog/' + user_url.replace("/","") + '/settings/" target="_mass_post_editor">Blog Settings</a>' +
					'</div>';
			}
			
			if ($("#dashboard_controls_open_blog").length >= 1) {
				if ($(".small_links").length > 0 && add_mega_link === false) {
					$(".small_links:first").append('<a class=\"xkit-small-blog-setting-link\" href="/blog/' + user_url.replace("/","") + '/settings/" target="_blog_settings">Blog Settings</a>');
				} else {
					$("#dashboard_controls_open_blog").after(x_html);
				}
				
			}
			
		}	


	},
	
	check_for_liked_posts: function() {
		
		if (document.location.href.indexOf('/dashboard') === -1) {
			return;
		}
		
		var call_update_rect = false;
		$(".post").not(".xkit-tweaks-checked-for-likes").each(function() {
			$(this).addClass("xkit-tweaks-checked-for-likes");
			if ($(this).find(".post_control.like").hasClass("liked")) {
				$(this).addClass("is_liked");	
				call_update_rect = true;
			}
		});
		
		if (call_update_rect) {
			XKit.extensions.tweaks.fix_hidden_post_height();
		}
		
	},
	
	fix_hidden_post_height: function() {
	
		XKit.tools.add_function(function() {
			Tumblr.Events.trigger("DOMEventor:updateRect");
		}, true, "");	
		
	},
	
	split_gear: function() {
		
		$(".post.is_mine").not(".xkit-tweaks-split-gear-done").each(function() {
			$(this).addClass("xkit-tweaks-split-gear-done");
			
			// Remove captions
			$(this).find(".post_control.edit").html("<span class=\"offscreen\">Edit</span>");
			$(this).find(".post_control.delete").html("<span class=\"offscreen\">Delete</span>");
			$(this).find(".post_control.queue").html("<span class=\"offscreen\">Queue</span>");
			
			// Remove their menu-specific classes
			$(this).find(".post_control.edit, .post_control.queue, .post_control.delete").removeClass("show_label");

			$(this).find(".post_control.edit").appendTo($(this).find(".post_controls_inner"));
			$(this).find(".post_control.delete").appendTo($(this).find(".post_controls_inner"));
			$(this).find(".post_control.queue").appendTo($(this).find(".post_controls_inner"));
			$(this).find(".post_control.post_control_menu.creator").css("display","none");
		});	
		
	},

	check_for_share_on_private_posts: function() {
		
		$(".post.is_mine").not(".xtweaks-checked-share").each(function() {
		
			if ($(this).find(".private_label").length > 0) {
				
				$(this).find(".post_control.share").css("display","inline-block");
				$(this).addClass("xtweaks-checked-share");	
				
			}
			
		});	
		
	},
	
	upload_photos: function() {
		
		
		if (document.location.href.indexOf('/new/photo') !== -1) {
		
			XKit.console.add("Tweaks, upload_photos: user in photo page.");
			if ($("#post_content").length === 0) {
				alert("waitin ");
				XKit.console.add("Tweaks, upload_photos: waiting for panel.");
				setTimeout(function() {
					XKit.extensions.tweaks.upload_photos();
				}, 1);
				return;
			}	
			
			$("#post_two_image").css("background","red");
			$("#post_two_image").removeClass("mce_image");
			$("#post_two_image").addClass("mce_image_upload");
			$("#post_two_image").find(".mceIcon").addClass("mce_image_upload");
			$("#post_two_image").find(".mceIcon").removeClass("mce_image");
			$("#post_two_image_upload").attr('id','post_two_image_upload');
			$("#post_two_image_voice").attr('id','post_two_image_upload_voice');
			
			XKit.console.add("Tweaks, upload_photos: done.");
			
			XKit.tools.add_function(function() {
				Tumblr.Events.trigger("posts:load");
				tinyMCE.execCommand("mceRepaint");
				alert(JSON.stringify(tinyMCE.activeEditor.settings));
			}, true, "");
			
		}	
	
	},

	destroy: function() {
		this.running = false;
		XKit.post_listener.remove("tweaks_check_for_share_on_private_posts");
		XKit.post_listener.remove("tweaks_fix_hidden_post_height");
		XKit.post_listener.remove("tweaks_dont_show_liked");
		clearInterval(this.run_interval);
		clearInterval(this.run_interval_2);
		XKit.post_listener.remove("tweaks_split_gear");	
		$(".xkit-small-blog-setting-link").remove();
		$(".small_links.by-xkit").remove();
		XKit.tools.remove_css("xkit_tweaks_dont_show_liked");
		XKit.tools.remove_css("xkit_tweaks_dont_show_mine_on_dashboard");
		XKit.tools.remove_css("xkit_tweaks_slim_popups");
		XKit.tools.remove_css("xtweaks-hide_follower_count");
		XKit.tools.remove_css("xtweaks-hide_post_count");
		XKit.tools.remove_css("xtweaks-hide_drafts_count");
		XKit.tools.remove_css("xkit_tweaks_small_quotes");
		XKit.tools.remove_css("xkit_tweaks_hide_sponsored");
		XKit.tools.remove_css("xkit_tweaks_hide_blog_search");
		XKit.tools.remove_css("xkit_tweaks_hide_share");
		XKit.tools.remove_css("xkit_tweaks_hide_notes");
		XKit.tools.remove_css("xkit_tweaks_hide_tags");
		XKit.tools.remove_css("xkit_tweaks_slim_sidebar");
		XKit.tools.remove_css("xkit_tweaks_hide_follows");
		XKit.tools.remove_css("xkit_tweaks_fix_blockquotes");
		XKit.tools.remove_css("xkit_tweaks_wrap_tags");
		XKit.tools.remove_css("xkit_tweaks_wrap_tags_v2");
		XKit.tools.remove_css("always_show_move_to_top");
		$("#tumblr_radar").css("display","block");
		$("#xkit_customize_button").remove();
		$("a.spotlight").parent().css("display","block");
		$("#recommended_tumblelogs").css("display","block");
		$("a.activity").parent().css("display","block");
		$("xkit_post_tags_inner_add_back").addClass("post_tags_inner");
		$("xkit_post_tags_inner_add_back").removeClass("xkit_post_tags_inner_add_back");
	}

});