//* TITLE One-Click Postage **//
//* VERSION 2.9 REV A **//
//* DESCRIPTION Lets you easily reblog, draft and queue posts **//
//* DEVELOPER STUDIOXENIX **//
//* FRAME false **//
//* BETA false **//

XKit.extensions.one_click_postage = new Object({

	running: false,
	
	qq_icon: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABMAAAATCAYAAAByUDbMAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMC1jMDYwIDYxLjEzNDc3NywgMjAxMC8wMi8xMi0xNzozMjowMCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNSBNYWNpbnRvc2giIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6QzgxMzAzQzIwRDZGMTFFM0IyOTBDRDZCRDY3Qzk1QTkiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6QzgxMzAzQzMwRDZGMTFFM0IyOTBDRDZCRDY3Qzk1QTkiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDpDODEzMDNDMDBENkYxMUUzQjI5MENENkJENjdDOTVBOSIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDpDODEzMDNDMTBENkYxMUUzQjI5MENENkJENjdDOTVBOSIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PpK36AkAAAFxSURBVHjalJSxS8NAFMZzJruuhSBCdHMISIcWhw4OAZfO/hHSySmFblnF2cH/wA6CDg5Oujg4dHJRUGinklWo1O/kO3h5Hkl88OOSd+++vHv3cma9XgfajDE9DEegD/ZBB8zBDDyCe6x7+rPQijlgCSjAwk7VsGBcUlkvhLrgukFEY+O7FTFmpIVeQQZiEHLM6NeCiRQrVEAe1Fuu4gtX+56qkRY6B8/gUNU3VzW0OsFYbU3bDeeOlVigtjze4PE7Ow3+ZzK+H7GPnM08CwzHXfTfAZ/fwFLF/+qsRKqhR+zO0xInnAuFbxWxs2NO2k7/VGJnYBt8gW/6liLe2VxnsQO25N/RYJnI7NY5U/AuJh6saAuxymk6pxUqwRCMOHnVIObts5SOiQi0mZU1Yt4/IBI1KkXd7PMm32MWt8PjvwB7QngKLuWX7OIXMOCX7PuUmbW/NWgjT+CkRsx7nxmRXcrMSm59gIAhuv6j7U37I8AABDEAB/datwYAAAAASUVORK5CYII=",
	qq_ok_icon: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABMAAAATCAYAAAByUDbMAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMC1jMDYwIDYxLjEzNDc3NywgMjAxMC8wMi8xMi0xNzozMjowMCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNSBNYWNpbnRvc2giIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6NzNGRkUyQzUwRDcwMTFFM0IyOTBDRDZCRDY3Qzk1QTkiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6NzNGRkUyQzYwRDcwMTFFM0IyOTBDRDZCRDY3Qzk1QTkiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDpDODEzMDNDNDBENkYxMUUzQjI5MENENkJENjdDOTVBOSIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDo3M0ZGRTJDNDBENzAxMUUzQjI5MENENkJENjdDOTVBOSIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PkDLUa4AAAG4SURBVHjalJQxSEJRFIafL/fcRNAKrIYSCsJBCWpwqK3WpgQ3IwgiQhKCJBocRBoFp5ptcwiqRYccJNxECgqkpWxsCPov/DdOh6fRgY93733n/Jx77rnXl72YdzwsAVIgCWIgBPqgAxrgGjSN4/lW5yfIr0SiIAPSIKj+hckayIIqqICedXCFcxwUwaGHkLYg/Yo7l7G4FjMZ5cCGCOiCdRDhDiKcd4WP8c9BMCrFMkooD2ZBHbyAL37rXM8rwYwVS7BGUqgg5iXQAstiraAE08gu4fLUgmJrBVWfabAExtV6QWzZxKdcHr+1Xed/Jv2TfvaRtY5HgE9laOwRvCn/mMuGtNb3EBtTtWux17R/yM+FsF3gqUk7ABPgk6fqMCtHJ2L7x9oUCICBWHsAc0Nq9qtEts8WwRNr8Q5uKfqXlcW4YcVqDN4Ee2CFNRplR2CG41dz+V1mNcngGr936kZ4CZ2IeRWvR9MvtjMQdRuIJg3zkEKsUVlkZHdVsU+Qqc8H2AZtcMP5FZ2fR2RohE6RVU9e9GOwQCGHWbVHiJganYF9CN3rx7HEDFe5xQDHDvtu6Esr7VuAAQC+Omj592980QAAAABJRU5ErkJggg==",
	
	preferences: {
		"sep_0": {
			text: "Shortcuts",
			type: "separator",
		},
		"enable_keyboard_shortcuts": {
			text: "Use keyboard shortcuts (R/Q/D to reblog/queue/draft, T to tag, escape to close)",
			default: false,
			value: false
		},
		"enable_quick_queue": {
			text: "Enable QuickQueue buttons on posts",
			default: false,
			value: false
		},
		"sep_5": {
			text: "AlreadyReblogged <a id=\"xkit-alreadyreblogged-help\" href=\"#\" onclick=\"return false\">what is this?</a>",
			type: "separator",
		},
		"enable_alreadyreblogged": {
			text: "Enable AlreadyReblogged for posts I reblog, queue or draft",
			default: false,
			value: false,
			experimental: true
		},
		"enable_hide_alreadyreblogged": {
			text: "Hide posts if they are AlreadyReblogged on my dashboard",
			default: false,
			value: false
		},
		"sep_1": {
			text: "Popup Options",
			type: "separator",
		},
		"show_blog_selector": {
			text: "Show blog selector",
			default: true,
			value: true
		},
		"enable_popup_html": {
			text: "Enable HTML in One-Click Postage popup",
			default: false,
			value: false
		},
		"show_caption_remover": {
			text: "Show the Remove Caption button",
			default: true,
			value: true
		},
		"show_reverse_ui": {
			text: "Use the Reverse UI on the popup-window (popup on top of reblog button)",
			default: true,
			value: true
		},
		"show_small_ui": {
			text: "Use the Slim User Interface on the pop-up window",
			default: false,
			value: false
		},
		"show_social": {
			text: "Show Post To Facebook and Twitter buttons",
			default: false,
			value: false
		},
		"allow_resize": {
			text: "Allow resizing of the caption box vertically (experimental)",
			default: false,
			value: false
		},
		"sep_2": {
			text: "Notifications",
			type: "separator",
		},
		"dim_posts_after_reblog": {
			text: "Turn the reblog button green after a successful reblog/queue/draft",
			default: true,
			value: true
		},
		"dont_show_notifications": {
			text: "Turn off the notifications displayed when successfully reblogged/queued/drafted",
			default: false,
			value: false
		},
		"sep_3": {
			text: "Tagging options",
			type: "separator",
		}
	},
	
	already_reblogged: new Array(),
	last_object: new Object(),
	last_icon_object: new Object(),
	last_post_id: 0,
	user_on_box: false,
	menu_closer_int: 0,
	default_blog_id: "",
	caption_height: 90,
	
	auto_tagger: false,
	auto_tagger_preferences: "",
	
	quick_tags: false,
	
	cpanel: function(obj) {
		
		$(obj).append("<div id=\"one_click_postage_warning_movage\">Tagging options are moved to a separate extension called \"Auto Tagger.\"</div>");
		
		$("#xkit-alreadyreblogged-help").click(function() {
		
			XKit.window.show("AlreadyReblogged","AlreadyReblogged keeps the track of the posts you reblog using One-Click Postage.<br/><br/>When you queue, draft or reblog a post using One-Click postage, the next time you refresh your page, the reblog button will turn green automatically.<br/><br/>Please note that this feature is experimental, and for now only keeps the last 3,000 posts.","info","<div class=\"xkit-button default\" id=\"xkit-close-message\">OK</div>");
			
		});	
		
	},
	
	get_autotagger: function() {
		
		if (XKit.installed.check("auto_tagger") === false) {
			XKit.extensions.one_click_postage.auto_tagger = false;
		} else {
			if (XKit.installed.enabled("auto_tagger") === true) {
				if (typeof XKit.extensions.auto_tagger	=== "undefined") {
					// Not booted up yet?	
					setTimeout(function() { XKit.extensions.one_click_postage.get_autotagger(); }, 100);
				} else {
					XKit.console.add("Auto tagger installed and found");
					XKit.extensions.one_click_postage.auto_tagger = true;
					XKit.extensions.one_click_postage.auto_tagger_preferences = XKit.extensions.auto_tagger.preferences;
				}
			} else {
				XKit.extensions.one_click_postage.auto_tagger = false;
			}
		}
		
	},
	
	get_quicktags: function() {
		
		if (XKit.installed.check("quick_tags") === false) {
			XKit.extensions.one_click_postage.quick_tags = false;
		} else {
			if (XKit.installed.enabled("quick_tags") === true) {
				if (typeof XKit.extensions.quick_tags	=== "undefined") {
					// Not booted up yet?	
					setTimeout(function() { XKit.extensions.one_click_postage.get_quicktags(); }, 100);
				} else {
					XKit.console.add("Quick Tags installed and found");
					XKit.extensions.one_click_postage.quick_tags = true;
				}
			} else {
				XKit.extensions.one_click_postage.quick_tags = false;
			}
		}
		
	},
	
	run: function() {

		/*XKit.extensions.one_click_postage.previous_div_id = "";*/
		XKit.tools.init_css("one_click_postage");
		
		// Let's first check if we have auto_tagger installed and active.
		XKit.extensions.one_click_postage.get_autotagger();
		
		// Then, check Quick Tags.
		XKit.extensions.one_click_postage.get_quicktags();

		if (this.preferences.allow_resize.value === true) {
			XKit.tools.add_css("#x1cpostage_caption { resize: vertical; }", "one_click_postage_resize");	
		}
		
		if (this.preferences.show_small_ui.value === true) {
		
			this.caption_height = 50;
			var slim_css = 	"#x1cpostage_caption { height: 50px; }" + 
					"#x1cpostage_reblog, #x1cpostage_queue, #x1cpostage_draft { height: 32px; }";
			XKit.tools.add_css(slim_css, "one_click_postage_slim");	
			
		}
		
		var m_remove_button = "<div id=\"x1cpostage_remove_caption\">remove caption</div>";
		
		if (this.preferences.show_caption_remover.value !== true) {
			m_remove_button = "";
		}	
		
		var m_html = "";	
		
		if (this.preferences.show_reverse_ui.value === true) {
			
			var m_html = "<div id=\"x1cpostage_box\">" + 
						"<input id=\"x1cpostage_tags\" placeholder=\"tags (comma separated)\" />" +
						"<textarea id=\"x1cpostage_caption\" placeholder=\"caption\"></textarea>" +
						"<div id=\"x1cpostage_replace\"><div>&nbsp;</div>replace caption, not append</div>" +
						m_remove_button + 
						"<div id=\"x1cpostage_reblog\">&nbsp;</div>" +
						"<div id=\"x1cpostage_queue\">&nbsp;</div>" +
						"<div id=\"x1cpostage_draft\">&nbsp;</div>" +
					"</div>";
					
			XKit.tools.add_css("#x1cpostage_draft { border-radius: 0px 0px 6px 0px; } #x1cpostage_reblog { border-radius: 0px 0px 0px 6px; } #x1cpostage_tags { border-radius: 6px 6px 0px 0px; border-bottom: 0; } #x1cpostage_replace { border-bottom: 0; } #x1cpostage_remove_caption { border-top: 1px solid #abafbc; border-bottom: 0; }","x1cpostage_reverse_ui");
			
			
		} else {
			
			var m_html = "<div id=\"x1cpostage_box\">" + 
						"<div id=\"x1cpostage_reblog\">&nbsp;</div>" +
						"<div id=\"x1cpostage_queue\">&nbsp;</div>" +
						"<div id=\"x1cpostage_draft\">&nbsp;</div>" +
						"<textarea id=\"x1cpostage_caption\" placeholder=\"caption\"></textarea>" +
						"<div id=\"x1cpostage_replace\"><div>&nbsp;</div>replace caption, not append</div>" +
						m_remove_button + 
						"<input id=\"x1cpostage_tags\" placeholder=\"tags (comma separated)\" />" +
					"</div>";
		}
					
		$("body").append(m_html);
		
		var m_blogs = XKit.tools.get_blogs();
		var m_blogselector_html = "";
		
		XKit.extensions.one_click_postage.default_blog_id = m_blogs[0];
		
		if (this.preferences.show_blog_selector.value === true) {
			for(i=0;i<m_blogs.length;i++) {
				if (m_blogs[i] !== "") {
					m_blogselector_html = m_blogselector_html + "<option value=\"" + 
							m_blogs[i] + "\">" + m_blogs[i] + "</option>";
				}
			}
			m_blogselector_html = "<select id=\"x1cpostage_blog\">" + m_blogselector_html + "</select>";
			if (this.preferences.show_reverse_ui.value === true) {
				$("#x1cpostage_reblog").before(m_blogselector_html);
			} else {
				$("#x1cpostage_caption").before(m_blogselector_html);
			}
		}
		
		if (this.preferences.show_social.value === true) {
			var m_html = "<div id=\"xkit-1cp-social\">" +
					"<div data-site=\"facebook\" id=\"xkit-1cp-social-facebook\">&nbsp;</div>" +
					"<div data-site=\"twitter\" id=\"xkit-1cp-social-twitter\">&nbsp;</div>" +	
				     "</div>";
			if (this.preferences.show_reverse_ui.value === true) {
				$("#x1cpostage_reblog").before(m_html);
			} else {
				$("#x1cpostage_draft").after(m_html);
			}
		}

		var share_fb = XKit.storage.get("one_click_postage","share_on_facebook", "false");
		var share_twitter = XKit.storage.get("one_click_postage","share_on_twitter", "false");

		if (share_fb === "true") { $("#xkit-1cp-social-facebook").addClass("selected"); }
		if (share_twitter === "true") { $("#xkit-1cp-social-twitter").addClass("selected"); }

		$("#xkit-1cp-social-facebook, #xkit-1cp-social-twitter").click(function() {
			$(this).toggleClass("selected");
			var m_value = "false";
			if ($(this).hasClass("selected") === true) { m_value = "true"; }
			XKit.storage.set("one_click_postage","share_on_" + $(this).attr('data-site'), m_value);
		});

		$(document).on("mouseover",".reblog_button,.post_control.reblog", function(event) {
			if ($(this).hasClass("radar_button") === true) {return; }
			clearTimeout(XKit.extensions.one_click_postage.menu_closer_int);
			XKit.extensions.one_click_postage.user_on_box = true;
			XKit.extensions.one_click_postage.open_menu($(this));
		});
		
		$(document).on("mouseout",".reblog_button,.post_control.reblog", function() {
			if ($(this).hasClass("radar_button") === true) {return; }
			XKit.extensions.one_click_postage.user_on_box = false;
			console.log("calling close_menu 1");
			XKit.extensions.one_click_postage.close_menu($(this));
		});
		
		$(document).on("click",".reblog_button,.post_control.reblog", function() {
			XKit.extensions.one_click_postage.user_on_box = false;
			console.log("calling close_menu 2");
			XKit.extensions.one_click_postage.close_menu($(this), true);
		});


		var cancel_menu_close = function() {
			clearTimeout(XKit.extensions.one_click_postage.menu_closer_int);
			XKit.extensions.one_click_postage.user_on_box = true;
		};

		var menu_close = function() {
			// Only close the menu if it doesn't have keyboard or mouse focus
			if ($("#x1cpostage_box").find('input:focus, textarea:focus').length == 0 && $('#x1cpostage_box:hover').length == 0) {
				XKit.extensions.one_click_postage.user_on_box = false;
				console.log("calling close_menu 3");
				XKit.extensions.one_click_postage.close_menu($(this));
			}
		};
		
		/*$("#x1cpostage_caption, #x1cpostage_tags").bind("focus", cancel_menu_close);
		$("#x1cpostage_caption, #x1cpostage_tags").bind("blur", function() { console.log("11"); menu_close() });
		*/
		
		$(document).on("mouseover","#x1cpostage_box", cancel_menu_close);
		$(document).on("mouseout","#x1cpostage_box", function() { console.log("1221"); menu_close() });
		
		$("#x1cpostage_tags, #x1cpostage_caption").bind("keydown", function(event) {
			if (XKit.extensions.one_click_postage.preferences.enable_keyboard_shortcuts.value === true
					&& event.which == 27) { // 27 = Escape
				$(this).blur();
				XKit.extensions.one_click_postage.user_on_box = false;
				console.log("calling close_menu 4");
				XKit.extensions.one_click_postage.close_menu($(this), true);
				event.preventDefault();
			}
			event.stopPropagation();
			event.stopImmediatePropagation();
		});
		
		$("#x1cpostage_remove_caption").click(function() {
			
			if (XKit.extensions.one_click_postage.preferences.show_reverse_ui.value === true) {
					
				$("#x1cpostage_remove_caption").css('display','none');
				$("#x1cpostage_caption").css('display','none');
				$("#x1cpostage_replace").css('display','none');
					
				// Determine where we are going to show the box.
				var obj = XKit.extensions.one_click_postage.last_icon_object;	
				var offset = $(obj).offset();
	
				// Box position
				var box_left = offset.left - ($("#x1cpostage_box").width() / 2) + 10;
				var box_top = (offset.top - $("#x1cpostage_box").height()) - 5;	
					
				$("#x1cpostage_box").css("top", box_top + "px");
				$("#x1cpostage_box").css("left", box_left + "px");


			} else {
				
				$("#x1cpostage_remove_caption").slideUp('fast');
				$("#x1cpostage_caption").slideUp('fast');
				$("#x1cpostage_replace").slideUp('fast');
				
			}
			

			$("#x1cpostage_caption").addClass("x1cpostage_remove_caption_on");
			$("#x1cpostage_tags").css("border-top","1px solid #abafbc");


		});
		
		$("#x1cpostage_replace").click(function() {
			$(this).toggleClass("selected");
		});
		
		$("#x1cpostage_reblog").click(function() {
			XKit.extensions.one_click_postage.post(0, false);
		});
		
		$("#x1cpostage_queue").click(function() {
			XKit.extensions.one_click_postage.post(2, false);
		});
		
		$("#x1cpostage_draft").click(function() {
			XKit.extensions.one_click_postage.post(1, false);
		});

		if (this.preferences.enable_keyboard_shortcuts.value === true) {
			$(document).on('keydown', XKit.extensions.one_click_postage.process_keydown);
			// Must use capture=true here to intercept Tumblr's default handlers, so we can't use jQuery's .on()
			window.addEventListener('keydown', XKit.extensions.one_click_postage.suspend_tumblr_key_commands, true);
		}
		
		this.init_keep_tags_dashboard();
		
		if (this.preferences.enable_alreadyreblogged.value === true) {
			
			var m_data = XKit.storage.get("one_click_postage","already_reblogged","");

			try {
				XKit.extensions.one_click_postage.already_reblogged = JSON.parse(m_data);
			} catch(e) {
				XKit.extensions.one_click_postage.already_reblogged = new Array();
			}
		
			XKit.post_listener.add("already_reblogged", XKit.extensions.one_click_postage.check_if_alreadyreblogged);
			XKit.extensions.one_click_postage.check_if_alreadyreblogged();	
			
		}
		
		if (this.preferences.enable_quick_queue.value === true) {
			
			if (XKit.interface.where().drafts === true || XKit.interface.where().queue === true) { return; }
			if ($("body").hasClass("is_private_channel")) {return; }
			
			XKit.interface.create_control_button("xkit-one-click-postage-quickqueue", this.qq_icon, "QuickQueue", "", this.qq_ok_icon);	
			XKit.post_listener.add("quick_queue_do_posts", XKit.extensions.one_click_postage.quick_queue_do_posts);
			XKit.extensions.one_click_postage.quick_queue_do_posts();
			
			$(document).on('click', '.xkit-one-click-postage-quickqueue', XKit.extensions.one_click_postage.quick_queue_button_clicked);	
			
		}
		
	},
	
	quick_queue_button_clicked: function(e) {
		
		var obj = $(e.target);
		
		if ($(obj).hasClass("xkit-interface-working") === true) { return; }
		
		var parent_box = $(e.target).parentsUntil('.post').parent();
		
		XKit.extensions.one_click_postage.last_object = parent_box;
		XKit.extensions.one_click_postage.last_icon_object = obj;
		XKit.extensions.one_click_postage.last_post_id = $(parent_box).attr('data-post-id');	
		
		XKit.interface.switch_control_button($(obj), true);
		XKit.extensions.one_click_postage.post(2, false, true);
		
	},
	
	quick_queue_do_posts: function() {
		
		var posts = XKit.interface.get_posts("xkit-1cp-quick-queue-done");
		
		if (XKit.interface.where().queue === true) { return; }

		$(posts).each(function() {
			
			$(this).addClass("xkit-1cp-quick-queue-done");
			
			if (XKit.interface.where().inbox === true) { return; }
			
			XKit.interface.add_control_button(this, "xkit-one-click-postage-quickqueue", "");

		});
		
	},
	
	check_if_alreadyreblogged: function() {
		
		$(".post").not(".xkit_already_reblogged_check").each(function() {
			
			var post_id = $(this).attr('data-root-id');
			$(this).addClass("xkit_already_reblogged_check");
			
			if (XKit.extensions.one_click_postage.is_alreadyreblogged(post_id)) {
				
				if (XKit.extensions.one_click_postage.preferences.enable_hide_alreadyreblogged.value === true) {
					if (XKit.interface.where().dashboard === true) { $(this).remove(); }	
				}
				
				$(this).find(".post_control.reblog").addClass("xkit-one-click-reblog-done");
				
			}
			
		});
		
	},
	
	destroy: function() {
		$(document).off('click', '.reblog_button,.post_control.reblog', XKit.extensions.one_click_postage.process_click)
			.off('keydown', XKit.extensions.one_click_postage.process_keydown);
		window.removeEventListener('keydown', XKit.extensions.one_click_postage.suspend_tumblr_key_commands);
		XKit.tools.remove_css("one_click_postage");
		XKit.post_listener.remove("already_reblogged");
		XKit.tools.remove_css("x1cpostage_reverse_ui");
		$("#x1cpostage_box").remove();
		XKit.tools.remove_css("one_click_postage_slim");
		XKit.tools.remove_css("one_click_postage_resize");	
	},
	
	init_keep_tags_dashboard: function() {
	
		$(document).on('click', '.reblog_button,.post_control.reblog', XKit.extensions.one_click_postage.process_click);
		
	},

	suspend_tumblr_key_commands: function(e) {
		// 82 = R
		if (e.metaKey || e.altKey || e.ctrlKey || e.shiftKey || e.keyCode !== 82) {
			return;
		}
		XKit.tools.add_function(function(){Tumblr.KeyCommands.suspend()}, true, '');
	},

	process_keydown: function(e) {
		// 68 = D, 81 = Q, 82 = R, 84 = T
		if (e.metaKey || e.altKey || e.ctrlKey || e.shiftKey
				|| (e.which !== 68 && e.which !== 81 && e.which !== 82 && e.which !== 84)
				|| $(e.target).is('input,textarea')) {
			return;
		}
		// Tumblr puts 7-8px padding at the top of the screen when you use J/K to navigate
		var screenPos = $(window).scrollTop() + 10;

		// Find the post at the top of the screen, if there is one
		$(".reblog_button,.post_control.reblog").filter(':visible').each(function() {
			if ($(this).hasClass("radar_button")) {return; }
			var parent_box = $(this).parentsUntil(".post").parent();
			var boxPos = parent_box.offset().top;
			if (boxPos <= screenPos && boxPos + parent_box.innerHeight() > screenPos) {
				switch (e.which) {
					case 68: // 68 = D
						XKit.extensions.one_click_postage.open_menu($(this), true);
						XKit.extensions.one_click_postage.post(1, false);
						break;
					case 81: // 81 = Q
						XKit.extensions.one_click_postage.open_menu($(this), true);
						XKit.extensions.one_click_postage.post(2, false);
						break;
					case 82: // 82 = R
						XKit.extensions.one_click_postage.open_menu($(this), true);
						XKit.extensions.one_click_postage.post(0, false);
						break;
					case 84: // 84 = T
						XKit.extensions.one_click_postage.user_on_box = true;
						XKit.extensions.one_click_postage.open_menu($(this), false, true);
						$('#x1cpostage_tags').focus();
						break;
				}
				e.preventDefault();
				return false;
			} else if (boxPos > screenPos) {
				// Post is too far down the screen, stop looking
				return false;
			}
		});
		// re-enable tumblr's key commands since we suspended them in suspend_tumblr_key_commands
		XKit.tools.add_function(function(){Tumblr.KeyCommands.resume()}, true, '');
	},
	
	process_click: function(e) {
		
		var parent_box = $(e.target).parentsUntil('.post').parent();
		
		if (XKit.extensions.one_click_postage.auto_tagger == true && typeof XKit.extensions.auto_tagger != "undefined") {
			// Call Auto Tagger for tags.
			var additional_tags = XKit.extensions.auto_tagger.return_tags($(parent_box));
			if (additional_tags !== "") {
				setTimeout(function() {		
					XKit.extensions.auto_tagger.inject_to_window(additional_tags);
				}, 200);	
			}
		}

	},
	
	open_menu: function(obj, hide_ui, force_on_screen) {
		
		if ($(obj).attr('x1cpostage_disabled') === "true" || $(obj).hasClass("xkit-one-click-reblog-working") === true) {
			// we are!
			return;
		}
	
		// Get the box ID.
		var parent_box = $(obj).parentsUntil(".post").parent();
		var box_id = $(parent_box).attr('id');
		var previous_id = $(XKit.extensions.one_click_postage.last_object).attr('id');
	
		// Let's first hide our previous box.
		// only if the current id != previous ID.
		if (box_id !== previous_id) {
			// It is not! Hide it.
			// Also, change all the settings.
			$("#x1cpostage_box").css('display','none');
			XKit.extensions.one_click_postage.reset_box();
		} else {
			// Lets see if the box is already open.
			if ($("#x1cpostage_box").css("display") === "block") {
				// It is. Let's end.
				return;
			}
		}
		
		// Re-show the caption stuff.
		$("#x1cpostage_caption").css("display","block");
		$("#x1cpostage_replace").css("display","block");
		$("#x1cpostage_remove_caption").css("display","block");
		$("#x1cpostage_caption").removeClass("x1cpostage_remove_caption_on");
		$("#x1cpostage_tags").css("border-top","0px");
		$("#x1cpostage_caption").css("height", XKit.extensions.one_click_postage.caption_height + "px");
		
		$(obj).attr('title','');
		/*XKit.extensions.one_click_postage.previous_div_id = box_id;*/
		
		if (XKit.extensions.one_click_postage.auto_tagger == true && typeof XKit.extensions.auto_tagger != "undefined") {
			// Call Auto Tagger for tags.
			var additional_tags = XKit.extensions.auto_tagger.return_tags($(parent_box));
			$("#x1cpostage_tags").val(additional_tags);
		}
		
		// Quick Tags?
		$("#x1cpostage_quick_tags").remove();
		if (XKit.extensions.one_click_postage.quick_tags === true  && typeof XKit.extensions.quick_tags != "undefined") {
			// Call Quick Tags to render our box.
			if (XKit.extensions.quick_tags.preferences.show_in_one_click_postage.value === true) {
				var m_html = "<div id=\"x1cpostage_quick_tags\">" + XKit.extensions.quick_tags.return_for_one_click_postage() + "</div>";
				if (XKit.extensions.one_click_postage.preferences.show_reverse_ui.value === true) {
					$("#x1cpostage_caption").before(m_html);	
				} else {
					$("#x1cpostage_tags").before(m_html);
					$("#x1cpostage_quick_tags").addClass("xkit-no-reverse-ui");	
				}
			}
		}
		
		if (hide_ui !== true) {
			// Determine where we are going to show the box.
			var offset = $(obj).offset();

			// Box position
			
			var box_left = offset.left - ($("#x1cpostage_box").width() / 2) + 10;
			var box_top = offset.top + 30;
			
			if (XKit.extensions.one_click_postage.preferences.show_reverse_ui.value === true) {
			
				box_top = (offset.top - $("#x1cpostage_box").height()) - 5;	
				
			}

			if (force_on_screen === true) {
				var window_top = $(window).scrollTop();
				var window_bottom = window_top + $(window).height();
				if (box_top < window_top) {
					box_top = window_top + 5;
				} else if (box_top + $("#x1cpostage_box").height() > window_bottom) {
					box_top = window_bottom - $("#x1cpostage_box").height() - 5
				}
			}

			$("#x1cpostage_box").css("top", box_top + "px");
			$("#x1cpostage_box").css("left", box_left + "px");
			
			if (XKit.extensions.one_click_postage.preferences.show_reverse_ui.value === true) {
				$("#x1cpostage_box").fadeIn('fast');
			} else {
				$("#x1cpostage_box").slideDown('fast');
			}
		}
		
		XKit.extensions.one_click_postage.last_object = parent_box;
		XKit.extensions.one_click_postage.last_icon_object = obj;
		XKit.extensions.one_click_postage.last_post_id = $(parent_box).attr('data-post-id');
		
		
	},
	reset_box: function() {
		$("#x1cpostage_caption").val("");
		$("#x1cpostage_tags").val("");
		$("#x1cpostage_tags").blur();
		$("#x1cpostage_caption").blur();
	},
	close_menu: function(obj, force) {
		
		console.log("Close menu called: XKit.extensions.one_click_postage.user_on_box = " + XKit.extensions.one_click_postage.user_on_box);
		clearTimeout(XKit.extensions.one_click_postage.menu_closer_int);
		
		if (force === true) {
			last_object = null;
			XKit.extensions.one_click_postage.user_on_box = false;
			if (XKit.extensions.one_click_postage.preferences.show_reverse_ui.value === true) {
				$("#x1cpostage_box").fadeOut('fast');
			} else {
				$("#x1cpostage_box").slideUp('fast');
			}
			return;	
		}
		
		XKit.extensions.one_click_postage.menu_closer_int = setTimeout(function() {
			console.log("CLOSING! XKit.extensions.one_click_postage.user_on_box = " + XKit.extensions.one_click_postage.user_on_box);
			if (XKit.extensions.one_click_postage.user_on_box === false) {
				last_object = null;
				if (XKit.extensions.one_click_postage.preferences.show_reverse_ui.value === true) {
					$("#x1cpostage_box").fadeOut('fast');
				} else {
					$("#x1cpostage_box").slideUp('fast');
				}
			}
		}, 700);
	},
	post: function(state, retry_mode, quick_queue_mode) {
		if (XKit.extensions.one_click_postage.preferences.show_reverse_ui.value === true) {
			$("#x1cpostage_box").fadeOut('fast');
		} else {
			$("#x1cpostage_box").slideUp('fast');
		}
		var post_id = $(XKit.extensions.one_click_postage.last_object).attr('data-post-id');
		var form_key = XKit.interface.form_key();
		var reblog_key = $(XKit.extensions.one_click_postage.last_object).attr('data-reblog-key');
		var post_type = $(XKit.extensions.one_click_postage.last_object).attr('data-type');
		var channel_id = $(XKit.extensions.one_click_postage.last_object).attr('data-tumblelog-name');
		
		var root_id = $(XKit.extensions.one_click_postage.last_object).attr('data-root-id');
		
		var m_object = new Object();
		
		/*
			{"channel_id":"neoplethora",
			 "reblog_id":"53347650122",
			 "reblog_key":"22Csj9mI",
			 "post_type":false,
			 "form_key":"FFR35OVIeHyFd2sr9EZasl2m8E"}:
		*/
		
		m_object.channel_id = channel_id;
		m_object.reblog_id = parseInt(post_id);
		m_object.reblog_key = reblog_key;
		m_object.form_key = form_key;
		m_object.post_type = post_type;

		var blog_id = XKit.extensions.one_click_postage.default_blog_id;
		if ($("#x1cpostage_blog").length > 0) {
			blog_id = $("#x1cpostage_blog").val();
		}
		
		if (quick_queue_mode !== true) {
			$(XKit.extensions.one_click_postage.last_object).find(".reblog_button, .post_control.reblog").addClass("xkit-one-click-reblog-working");
		}
		
		var m_button = $(XKit.extensions.one_click_postage.last_object).find(".reblog_button, .post_control.reblog");
		
		if (quick_queue_mode) {
			m_button = $(XKit.extensions.one_click_postage.last_object).find(".xkit-one-click-postage-quickqueue");
		}
		
		var caption = $("#x1cpostage_caption").val();
		var tags = $("#x1cpostage_tags").val();
		
		if (quick_queue_mode) {
			tags = "";
			caption = "";	
		}

		GM_xmlhttpRequest({
			method: "POST",
			url: "http://www.tumblr.com/svc/post/fetch",
			data: JSON.stringify(m_object),
			json: true,
			onerror: function(response) {
				
				if (response.status === 401) {
					XKit.extensions.one_click_postage.show_error("OCP01", state);
				} else {
					if (response.status === 404) {
						XKit.extensions.one_click_postage.show_error("OCP02 [Not Found]", state);
					} else {
						if (retry_mode !== true) {
							setTimeout(function() { XKit.extensions.one_click_postage.post(state, true, quick_queue_mode); }, 500);
						} else {
							XKit.extensions.one_click_postage.show_error("OCP03-" + response.status, state);
						}
					}
				}
				
				$(m_button).removeClass("xkit-one-click-reblog-working");
				return;
			},
			onload: function(response) {
				// We are done!
				try {
					var mdata = jQuery.parseJSON(response.responseText);
				} catch(e) {
					//xkit_error(XKit.language.one_click_postage.status_error_title, XKit.language.generic_errors.not_json);
					XKit.extensions.one_click_postage.show_error("OCP04", state);
					$(m_button).removeClass("xkit-one-click-reblog-working");
					return;
				}
				if (mdata.errors === false) {
					XKit.extensions.one_click_postage.process(mdata, state, form_key, blog_id, post_id, caption, tags, reblog_key, m_button, false, root_id, quick_queue_mode);
				} else {
					XKit.extensions.one_click_postage.show_error("OCP05", state);
					$(m_button).removeClass("xkit-one-click-reblog-working");
				}
			}
		});
		
	},
	process: function(data, state, form_key, blog_id, post_id, caption, tags, reblog_key, m_button, retry_mode, root_id, quick_queue_mode) {

		var m_object = new Object;

		if (blog_id === "" ||typeof blog_id === "undefined") {
			
			var m_blogs = XKit.tools.get_blogs();
			for(i=0;i<m_blogs.length;i++) {
				if (m_blogs[i] !== "") {
					blog_id = m_blogs[i];
					break;	
				}	
			}

			if (blog_id === "" || typeof blog_id === "undefined") {
				if ($("#tab_switching").length > 0) {
					var def_blog = $("#tab_switching").find(".tab_blog.item").not(".tab_dashboard").attr('id').replace("tab_blog_","");
					blog_id = def_blog;
					//alert("got id from def_blog");
				} else {
					XKit.window.show("Unable to process request","Unable to set Blog ID. Please return to the dashboard and try again, and send me an ask if this continues.<br/><br/>The error code to report is <b>OCP30</b>. Thank you.","error","<div class=\"xkit-button default\" id=\"xkit-close-message\">OK</div><a href=\"http://xkit-extension.tumblr.com/ask\" class=\"xkit-button\">Send an ask</a>");	
					return;
				}
			}
		}

		m_object.form_key = form_key;
		m_object.channel_id = blog_id;
		
		m_object.detached = true;
	
		m_object.reblog = true;
		m_object.reblog_id = parseInt(post_id);
		m_object.reblog_key = reblog_key;
	
		m_object.errors = false;
		m_object.created_post = data.created_post;
		m_object.context_page = data.post_context_page;
		m_object.post_context_page = data.post_context_page;
		m_object.silent = false;
		
		m_object.context_id = "";
		m_object.reblog_post_id = post_id;
	
		// Not sure about this part:
		m_object["is_rich_text[one]"] = "0";
		m_object["is_rich_text[two]"] = "1";
		m_object["is_rich_text[three]"] = "0";
	
		m_object["post[slug]"] = "";
		m_object["post[draft_status]"] = "";
		//m_object["post[source_url]"] =data.post.reblog_source;
		m_object["post[date]"] = "";
	
		m_object["post[type]"] = data.post.type;
		
		if (tags !== "" && typeof tags !== "undefined") {
			m_object["post[tags]"] = tags;
		} else {
			m_object["post[tags]"] = "";
		}

		if ($("#xkit-1cp-social-twitter").hasClass("selected") === true) {
			m_object["send_to_twitter"] = "on";
		}

		if ($("#xkit-1cp-social-facebook").hasClass("selected") === true) {
			m_object["send_to_fbog"] = "on";
		}

		if (typeof data.post.two === "undefined") {
			data.post.two = "";
		}
		
		var photo_post = false;
		if (data.post.type === "photo" || data.post.type === "photoset") {
			photo_post = true;	
		}
		
		caption = XKit.tools.replace_all(caption, "\n", "<br/>");
		
		var variable_to_use = "post[two]";
		var current_caption = data.post.two;
		
		if (data.post.type === "link" || data.post.type === "note") {
			variable_to_use = "post[three]";	
			current_caption = data.post.three;
		}
		
		if ($("#x1cpostage_caption").hasClass("x1cpostage_remove_caption_on") === true) {
			
			// User wishes to remove caption.
			m_object[variable_to_use] = "";
				
		} else {
				
			if (caption !== "" && typeof caption !== "undefined") {
				if ($("#x1cpostage_replace").hasClass("selected") === false) {
					if (XKit.extensions.one_click_postage.preferences.enable_popup_html.value !== true) {
						m_object[variable_to_use] = current_caption + "<p>" + caption.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;') + "</p>";
					} else {
						m_object[variable_to_use] = current_caption + "<p>" + caption + "</p>";
					}
				} else {
					if (XKit.extensions.one_click_postage.preferences.enable_popup_html.value !== true) {
						m_object[variable_to_use] = caption.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
					} else {
						m_object[variable_to_use] = caption;
					}
				}
			} else {
				m_object[variable_to_use] = current_caption;
			}
			
		}
		
		m_object[variable_to_use] = XKit.tools.replace_all(m_object[variable_to_use], "&lt;br&gt;", "<br/>");
		m_object[variable_to_use] = XKit.tools.replace_all(m_object[variable_to_use], "&lt;br/&gt;", "<br/>");

		if (tags !== "" && typeof tags !== "undefined") {
			m_object["post[tags]"] = tags;
		} else {
			m_object["post[tags]"] = "";
		}
		
		if (XKit.extensions.one_click_postage.auto_tagger == true && typeof XKit.extensions.auto_tagger != "undefined") {
			// Call Auto Tagger for tags.
			if (state === 2) {
				var additional_tags = XKit.extensions.auto_tagger.return_tags_for_queue();
				if (additional_tags !== "") {
					if (m_object["post[tags]"] === "") {
						m_object["post[tags]"] = additional_tags;	
					} else {
						m_object["post[tags]"] = m_object["post[tags]"] + "," + additional_tags;
					}
				}
			}
		}
		
		m_object["post[publish_on]"] ="";
		if (state === 0) {
			m_object["post[state]"] = "";
		} else {
			m_object["post[state]"] = state;
		}
		m_object.custom_tweet = "";

		GM_xmlhttpRequest({
			method: "POST",
			url: "http://www.tumblr.com/svc/post/update",
			data: JSON.stringify(m_object),
			json: true,
			onerror: function(response) {
				if (response.status === 401) {
					XKit.extensions.one_click_postage.show_error("OCP06", state);
				} else {
					if (response.status === 404) {
						XKit.extensions.one_click_postage.show_error("OCP07", state);
					} else {
						if (retry_mode !== true) {
							XKit.extensions.one_click_postage.process(data, state, form_key, "", post_id, caption, tags, reblog_key, m_button, true, root_id, quick_queue_mode);
						} else {
							XKit.extensions.one_click_postage.show_error("OCP08-" + response.status, state);
						}
					}
				}
				$(m_button).removeClass("xkit-one-click-reblog-working");
			},
			onload: function(response) {
				// We are done!
				try {
					var mdata = jQuery.parseJSON(response.responseText);
				} catch(e) {
					//xkit_error(XKit.language.one_click_postage.status_error_title, XKit.language.generic_errors.not_json);
					XKit.extensions.one_click_postage.show_error("OCP09-J", state);
					$(m_button).removeClass("xkit-one-click-reblog-working");
					return;
				}
				if (mdata.errors === false) {
					$(m_button).removeClass("xkit-one-click-reblog-working");
					if (mdata.message === "" || typeof mdata.message === "undefined") {
					/*	if (state === 0) { XKit.notifications.add(XKit.language.one_click_postage.status_ok_reblogged, "ok"); }
						if (state === 1) { XKit.notifications.add(XKit.language.one_click_postage.status_ok_drafted, "ok"); }
						if (state === 2) { XKit.notifications.add(XKit.language.one_click_postage.status_ok_queued, "ok"); } */
					} else {
						if (XKit.extensions.one_click_postage.preferences.enable_alreadyreblogged.value === true) {
							XKit.extensions.one_click_postage.add_to_alreadyreblogged(root_id);
						}
						if (XKit.extensions.one_click_postage.preferences.enable_alreadyreblogged.value === true ||XKit.extensions.one_click_postage.preferences.dim_posts_after_reblog.value === true) {
							if (quick_queue_mode !== true) {
								$(m_button).addClass("xkit-one-click-reblog-done");
							} else {
								XKit.interface.switch_control_button($(m_button), false);
								XKit.interface.completed_control_button($(m_button), true);	
							}
						}
						if (XKit.extensions.one_click_postage.preferences.dont_show_notifications.value !== true) {
							XKit.notifications.add(mdata.message, "ok");
						}
					}
				} else {
					// xkit_error(XKit.language.one_click_postage.status_error_title, XKit.language.generic_errors.server_error);
					var m_error = "Unknown error at svc/post/update";
					if (typeof mdata.error !== "undefined") {
						m_error = mdata.error;	
					}
					XKit.extensions.one_click_postage.show_error("OCP10", state);
					$(m_button).removeClass("xkit-one-click-reblog-working");
				}
			}
		});
	
	},
	
	add_to_alreadyreblogged: function(post_id) {
		
		if (XKit.extensions.one_click_postage.already_reblogged.indexOf(post_id) === -1) {
			XKit.extensions.one_click_postage.already_reblogged.push(post_id);
			XKit.extensions.one_click_postage.save_alreadyreblogged();
		}

	},
	
	is_alreadyreblogged: function(post_id) {
	
		if (XKit.extensions.one_click_postage.already_reblogged.indexOf(post_id) === -1) {
			return false;
		} else {
			return true;	
		}	
		
	},
	
	save_alreadyreblogged: function() {
		
		if (XKit.extensions.one_click_postage.already_reblogged.length >= 3000) {
			// Drop 20 posts.
			for (var i=0;i<20;i++) {
				XKit.extensions.one_click_postage.already_reblogged.shift();
			}	
		}
		
		XKit.storage.set("one_click_postage","already_reblogged", JSON.stringify(XKit.extensions.one_click_postage.already_reblogged));
		
	},
	
	show_error: function(code, state) {
		
		var m_word = "reblog";
		if (state === 1) { m_word = "draft"; }
		if (state === 2) { m_word = "queue"; }
		
		var m_causes =	"<ul class=\"xkit-one-click-postage-error-list\">" +
					"<li><b>You have used your post limit.</b><br/>The limit is 250 per day, set by Tumblr. Try again in 24 hours.</li>" +
					"<li><b>You've filled your queue.</b><br/>You can not queue more than 300 posts.</li>" +
					"<li><b>The post is deleted.</b><br/>The post you are trying to " + m_word + " is deleted by the user.</li>" +
					"<li><b>Your browser settings are denying XKit cookies.</b><br/>If you have disabled \"Third Party Cookies\", One-Click Postage can not work properly. Please enable them and try again.</li>" +
					"<li><b>There was a server error.</b><br/>Wait for a while and retry the " + m_word + " request.<br/>There might be some changes made to the Tumblr servers, in that case, a fix will be provided soon. Check the XKit blog for updates.</li>" +
				"</ul>";
		
		if (state === 2 && XKit.interface.user().queue >= 299) {
			m_causes = "<ul class=\"xkit-one-click-postage-error-list\">" +
					"<li><b>You've filled your queue.</b><br/>You can not queue more than 300 posts.</li>" +
				"</ul>";	
		}
		
		XKit.window.show("I could not " + m_word + " your post.","<b>One of the following might be the reason for that:</b>" + m_causes + "<b>If the tips above did not solve the problem,</b><br/>please send me an ask along with the error code <b>" + code + "</b>.","error","<div class=\"xkit-button default\" id=\"xkit-close-message\">OK</div><a href=\"http://xkit-extension.tumblr.com/\" class=\"xkit-button\">Visit the XKit Blog</a><a href=\"http://xkit-extension.tumblr.com/ask\" class=\"xkit-button\">Send an ask</a>");	
		
	}
	
});