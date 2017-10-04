//* TITLE Header Options **//
//* VERSION 2.5.0 **//
//* DESCRIPTION Customize the header. **//
//* DEVELOPER new-xkit **//
//* DETAILS This extension adds your blogs on the top of the page, so you can easily switch between blogs. The blog limit on the header is five, but you can limit this to three blogs and turn off the blog title bubble from the settings. **//
//* FRAME false **//
//* BETA false **//

XKit.extensions.classic_header = new Object({

	running: false,
	slow: true,

	preferences: {
		"sep0": {
			text: "Header Appearance",
			type: "separator",
		},
		"fixed_width": {
			text: "Reduce the max width of the header to match the dashboard",
			default: false,
			value: false,
			desktop_only: true
		},
		"fixed_position": {
			text: "Fixed position header (un-stickify)",
			default: false,
			value: false,
			desktop_only: true
		},
		"fix_color": {
			text: "Make the tab notification bubbles red again",
			default: false,
			value: false,
			desktop_only: true
		},
		"fix_logo": {
			text: "Display the whole \"tumblr\" logo",
			default: false,
			value: false,
			desktop_only: true
		},
		"hide_compose": {
			text: "Hide the compose button",
			default: false,
			value: false,
			desktop_only: true
		},
		"mobile_sticky": {
			text: "Scrolling header (like desktop)",
			default: false,
			value: false,
			mobile_only: true
		},
		"mobile_logout": {
			text: "Add logout button to menu",
			default: false,
			value: false,
			mobile_only: true
		},
		"sep1": {
			text: "Blogs on the header",
			type: "separator",
			desktop_only: true
		},
		"show_avatars": {
			text: "Show my blogs on the header",
			default: true,
			value: true,
			desktop_only: true
		},
		appearance: {
			text: "Avatar Appearance",
			default: "circle",
			value: "circle",
			type: "combo",
			values: [
				"Circle (default)", "circle",
				"Rounded Box", "box",
				"Square", "square"
			],
			desktop_only: true
		},
		maximum: {
			text: "Maximum blogs to show",
			default: "b3",
			value: "b3",
			type: "combo",
			values: [
				"1 Blog", "b1",
				"2 Blogs", "b2",
				"3 Blogs", "b3",
				"4 Blogs", "b4",
				"5 Blogs", "b5"
			],
			desktop_only: true
		},
		"show_bubble": {
			text: "Show blog title bubble on hover",
			default: true,
			value: true,
			desktop_only: true
		}
	},

	run: function() {

		XKit.tools.init_css("classic_header");
		$("#xoldeheader").remove();

		if (XKit.extensions.classic_header.preferences.show_avatars.value) {
			XKit.extensions.classic_header.show_blogs();
		}
		if (XKit.extensions.classic_header.preferences.fixed_width.value === true) {
			$( function() {
				var cwidth = $(".l-content").outerWidth() + 31;
				if (cwidth < 816) { return; }
				var lpad = 2;
				if (XKit.extensions.tweaks.preferences.old_sidebar_width.value && $("#right_column").length > 0) {
					lpad += 75;
				}
				XKit.tools.add_css(
				"@media screen and (min-width: " + cwidth + "px)" +
				"{.l-header {max-width: " + cwidth + "px!important; padding-left: " + lpad + "px !important;}}",
				"classic_header_fixed_width");
			});
		}

		if (XKit.extensions.classic_header.preferences.fix_logo.value) {
			XKit.tools.add_css(".logo .logo-anchor .png-logo { " +
			"background:" +
				"url('data:image/png;base64,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') " +
				"22px 10px/159px 34px " + 
				"no-repeat;" +
			"width: 159px; }",
			"classic_header_fix_logo");
			$(".png-logo").css("opacity", "1");
		}

		if (XKit.extensions.classic_header.preferences.hide_compose.value) {
			XKit.tools.add_css(".compose-button { display: none; }", "classic_header_hide_compose");
		}

		if (XKit.extensions.classic_header.preferences.fixed_position.value) {
			XKit.tools.add_css(" .l-header-container { position: absolute !important; box-shadow: none; }" +
								".post_avatar.post-avatar--sticky .post_avatar_wrapper { top: 15px; }" +
								"#xwidgets-drawer, #xwidgets-opener { transform: translate(0,-52px); z-index: 91 !important; }",
								"classic_header_fixed_position");
		}

		if (XKit.extensions.classic_header.preferences.fix_color.value) {
			XKit.tools.add_css(" .tab_notice_value { color: #ffffff !important; }" +
								".selected .tab_notice, .tab_notice { background: #bc3333 !important; }" +
								".tab_bar .tab.selected .tab_anchor::before { opacity: 0.5; }",
								"classic_header_fixed_color");
		}

		if (XKit.extensions.classic_header.preferences.mobile_sticky.value) {

			// The nav menu is written terribly. Thanks @staff.
			XKit.tools.add_css(" #container { position: absolute; top:44px; max-width: 800px; width: 100%; } .mobile-nav { position: fixed; top: 0; z-index: 99; left: 0; width: calc(100% + 1px); } .nav-menu .drawer, .nav-menu.active .sneeze-guard { height: calc(100vh - 44px); top:44px; }", "classic_header_mobile_sticky");

			$('#footer').insertAfter($('#load_more_posts'));

			if ($('.mh_post_buttons').length > 0) {
				$('.mh_post_buttons').insertBefore($('#content'));
			}

		}

		if (XKit.extensions.classic_header.preferences.mobile_logout.value) {
			var m_html = '<a class=\"nav-item with-icon\" href=\"/logout\"><span class=\"nav-text nav-item-goodbye\">Log Out</span></a>';
			$('.nav-site-sections').append(m_html);
		}

	},

	show_blogs: function() {

		if (document.location.href.indexOf("/following") !== -1) {
			return;
		}
		var m_html = "";
		var m_counter = 0;
		var max_count = 6;

		if (XKit.extensions.classic_header.preferences.maximum.value !== "") {
			max_count = parseInt(XKit.extensions.classic_header.preferences.maximum.value.substring(1)) + 1;
		}

		if (XKit.extensions.classic_header.preferences.appearance.value === "box") {
			XKit.tools.add_css(".xoldeheader-item { border-radius: 7px !important; }", "classic_header_box");
		} else if (XKit.extensions.classic_header.preferences.appearance.value === "square") {
			XKit.tools.add_css(".xoldeheader-item { border-radius: 0px !important; }", "classic_header_square");
		}

		try {
			var tab_blogs = $(".tab_blog");
			if (tab_blogs.length > 0) {
				tab_blogs.each(function(index) {
					var tab_blog = $(this);
					if (tab_blog.hasClass('tab_dashboard')) {
						return;
					}

					m_counter ++;

					if (m_counter >= max_count) {
						return;
					}

					var raw_id = tab_blog.attr('id');
				// Id has the form tab_blog_{blog-name}
					var blog_id = raw_id.substring('tab_blog_'.length, raw_id.length);
					var blog_icon = tab_blog.find('.blog_icon').css('background-image');
					if (!blog_icon || blog_icon === "none") {
						blog_icon = "no-repeat url(\"http://assets.tumblr.com/images/lock_avatar.png\") 50% / 8px";
					}

					var blog_name = tab_blog.find('.blog_name').text();
					var is_private = tab_blog.find('.blog_icon').hasClass('private');

					if (is_private) {
						blog_name += ' [private]';
					}

					m_html = m_html + '<div class="xoldeheader-item-container">' +
						'<a href="http://www.tumblr.com/blog/' + blog_id + '/" class="xoldeheader-item"' +
						' id="xoldeheader-item-' + blog_id + '"' +
						' style=\'background: ' + blog_icon + '\' title="' + blog_name + '">&nbsp;</a>' +
						' <div class="selection_nipple"></div></div>';
				});
				XKit.storage.set("classic_header", "header_html", m_html);
			} else {
				if (XKit.storage.get("classic_header", "header_html", "") === "") {
					return;
				} else {
					m_html = XKit.storage.get("classic_header", "header_html", "");
				}
			}

			$("#user_tools").prepend('<div id="xoldeheader">' + m_html + '</div>');

			if (XKit.extensions.classic_header.preferences.show_bubble.value === true) {
				$(".xoldeheader-item").tipTip({maxWidth: "auto", delay: 10, edgeOffset: 5 });
			}

			if (document.location.href.indexOf('/blog/') !== -1) {

				var user_url = document.location.href.substring(document.location.href.indexOf('/blog/') + 6);
				user_url = user_url.replace("#", "");
				if (user_url.indexOf("/") !== -1) {
					user_url = user_url.substring(0, user_url.indexOf("/"));
				}

				$("#xoldeheader-item-" + user_url).addClass("selected");
				$("#xoldeheader-item-" + user_url).parent().addClass("selected");
				$("#home_button").removeClass("selected");

			}

		} catch (e) {
			XKit.console.add(e.message);
		}

	},

	destroy: function() {
		XKit.tools.remove_css("classic_header");
		XKit.tools.remove_css("classic_header_fixed_color");
		XKit.tools.remove_css("classic_header_fixed_position");
		XKit.tools.remove_css("classic_header_fixed_width");
		XKit.tools.remove_css("classic_header_fix_logo");
		XKit.tools.remove_css("classic_header_hide_compose");
		XKit.tools.remove_css("classic_header_mobile_sticky");
		$(".nav-item-goodbye").remove();
		$("#xoldeheader").remove();
		XKit.tools.remove_css("classic_header_box");
		XKit.tools.remove_css("classic_header_square");
	}

});
