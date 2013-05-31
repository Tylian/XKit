//* TITLE Tweaks **//
//* VERSION 1.1 REV C **//
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

	preferences: {
		"sepm1": {
			text: "Posting tweaks",
			type: "separator",
		},
		"photo_replies": {
			text: "Auto-enable photo replies (might slow down your computer)",
			default: false,
			value: false
		},
		"sep0": {
			text: "Dashboard tweaks",
			type: "separator",
		},
		"always_show_move_to_top": {
			text: "Always show 'Move to top' button queue",
			default: true,
			value: true
		},
		"hide_blog_search": {
			text: "Hide blogs on the search bar suggestions",
			default: false,
			value: false
		},
		"hide_share": {
			text: "Hide the share button on posts",
			default: false,
			value: false
		},
		"fix_blockquotes": {
			text: "Slim block quotes for easier reading",
			default: false,
			value: false
		},
		"wrap_tags": {
			text: "Wrap tags for easier reading",
			default: true,
			value: true
		},
		"hide_follows": {
			text: "Hide the mini-follow buttons on posts and notifications",
			default: false,
			value: false
		},
		"hide_notes": {
			text: "Hide the notes on posts",
			default: false,
			value: false
		},
		"hide_bubble": {
			text: "Hide the new post bubble when you are not in dashboard*",
			default: false,
			value: false
		},
		"sep1": {
			text: "Navigation tweaks",
			type: "separator",
		},
		"redirect_to_everything": {
			text: "On popular tags, always show all posts, not just the popular ones (experimental)*",
			default: false,
			value: false
		},
		"sep2": {
			text: "Sidebar tweaks",
			type: "separator",
		},
		"slim_sidebar": {
			text: "Slim sidebar buttons",
			default: false,
			value: false
		},
		"hide_radar": {
			text: "Hide Tumblr radar",
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
			text: "Show Customize and Blog Settings buttons*",
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

		if (XKit.extensions.tweaks.preferences.hide_recommended.value === true) {
			$("#recommended_tumblelogs").css("display","none");
		}
		
		if (XKit.extensions.tweaks.preferences.hide_share.value === true) {
			XKit.tools.add_css("#posts .post .post_controls .share_social_button { display: none; } ", "xkit_tweaks_hide_share");
		}

		if (XKit.extensions.tweaks.preferences.hide_notes.value === true) {
			XKit.tools.add_css("#posts .post .post_controls .reblog_count { display: none; } ", "xkit_tweaks_hide_notes");
		}	

		if (XKit.extensions.tweaks.preferences.hide_find_blogs.value === true) {
			$("a.spotlight").parent().css("display","none");
		}
		
		if (XKit.extensions.tweaks.preferences.always_show_move_to_top.value === true) {
			XKit.tools.add_css("#posts .post .post_control.move_to_top { display: inline-block !important; } ", "always_show_move_to_top");
		}

		if (XKit.extensions.tweaks.preferences.slim_sidebar.value === true) {
			var m_css = ".controls_section li { height: 25px; } .controls_section li a { padding: 3px 13px 10px 40px; font-size: 13px; } .controls_section li>a:after { zoom: 0.80; left: 8px; top: -2px; } .controls_section a .count { top: 4px; } .controls_section .sub_control.link_arrow { margin-top: -2px; } #popover_button_blogs { height: auto; } #fan_mail_controls, #fan_mail_controls li, #recommended_tumblelogs li, #tag_editors li, #tag_contributors li { height: auto; }";
			XKit.tools.add_css(m_css, "xkit_tweaks_slim_sidebar");
		}

		if (XKit.extensions.tweaks.preferences.hide_follows.value === true) {
			XKit.tools.add_css(".notification_follow, .reblog_follow_button { display: none !important; }", "xkit_tweaks_hide_follows");
		}

		if (XKit.extensions.tweaks.preferences.fix_blockquotes.value === true) {
			XKit.tools.add_css("#posts .post_content blockquote { border-left: solid 3px #dcdcdc; padding-left: 8px; margin-left: 6px; }", "xkit_tweaks_fix_blockquotes");
		}		

		if (XKit.extensions.tweaks.preferences.wrap_tags.value === true) {
			XKit.tools.add_css(".post .tags { width: 500px !important; display: block !important; }  .post .footer_links.with_tags { overflow:visible !important; display: block !important; }.post .footer_links.with_tags span, .footer_links.with_tags .source_url { display:block !important; overflow:visible !important; } .source_url_gradient { display: none !important; } span.tags { white-space:normal !important; } span.with_blingy_tag a.blingy { height:auto !important; display:inline-block !important; }  .source_url, .post_tags_wrapper { display: block !important; } ", "xkit_tweaks_wrap_tags");
			XKit.tools.add_css("#posts .post.post_full .post_tags { white-space: normal; } .post .post_tags a { font-size: 12px; }", "xkit_tweaks_wrap_tags_v2");
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
			x_html= '<div class="small_links by-xkit">' +
           			'<a href="/mega-editor/' + user_url + '" target="_mass_post_editor">Mass Post Editor</a>' +
           			'<a href="/blog/' + user_url.replace("/","") + '/settings/" target="_mass_post_editor">Blog Settings</a>' +
				'</div>';
			if ($("#dashboard_controls_open_blog").length >= 1) {
				if ($(".small_links").length > 0 && document.location.href.indexOf("/blog/") !== -1) {
					$(".small_links:first").append('<a class=\"xkit-small-blog-setting-link\" href="/blog/' + user_url.replace("/","") + '/settings/" target="_mass_post_editor">Blog Settings</a>');
				} else {
					$("#dashboard_controls_open_blog").after(x_html);
				}
			}
			$("#dashboard_controls_open_blog").append(m_html);
		}	


	},

	destroy: function() {
		this.running = false;
		clearInterval(this.run_interval);	
		$(".xkit-small-blog-setting-link").remove();
		$(".small_links.by-xkit").remove();
		XKit.tools.remove_css("xkit_tweaks_hide_blog_search");
		XKit.tools.remove_css("xkit_tweaks_hide_share");
		XKit.tools.remove_css("xkit_tweaks_hide_notes");
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
	}

});
