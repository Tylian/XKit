//* TITLE One-Click-Reply **//
//* VERSION 1.5 REV E **//
//* DESCRIPTION Lets you reply to notifications **//
//* DEVELOPER STUDIOXENIX **//
//* DETAILS To use this extension, hover over a notification and click on the Reply button. If Multi-Reply is on, hold down the ALT key while clicking on the Reply button to select/deselect posts and reply to all of them at once. **//
//* FRAME false **//
//* BETA false **//

XKit.extensions.one_click_reply = new Object({

	running: false,
	
	
	preferences: {
		"sep0": {
			text: "Reply Options",
			type: "separator"	
		},
		"show_avatars": {
			text: "Show avatars on reply posts",
			default: false,
			value: false
		},
		"open_in_new_tab": {
			text: "Open reply windows in a new tab",
			default: false,
			value: false
		},
		"multi_reply": {
			text: "Enable replying to multiple notifications at once (experimental)",
			default: true,
			value: true
		},
		"sep1": {
			text: "Tagging Options",
			type: "separator"	
		},
		"tag_people": {
			text: "Tag people by their usernames on my replies",
			default: true,
			value: true
		},
		"auto_tag": {
			text: "Auto-tag the post with a custom one",
			default: false,
			value: true
		},
		"auto_tag_text": {
			text:  "Custom tag for Crush Posts",
			type: "text",
			default: "",
			value: ""
		}
	},
	
	sentences: {
	
		"reblog": "<p><a href=\"%l\">%u</a> reblogged your post: <a href=\"%p\">%t</a></p>",
		"reblog_with_comments": "<p><a href=\"%l\">%u</a> reblogged your post <a href=\"%p\">%t</a> and added:</p><blockquote>%r</blockquote>",
		"like": "<p><a href=\"%l\">%u</a> liked your post: <a href=\"%p\">%t</a></p>",
		"follow": "<p><a href=\"%l\">%u</a> started following %b</p>",
		"reply": "<p><a href=\"%l\">%u</a> replied to your post: <a href=\"%p\">%t</a></p><blockquote>%r</blockquote>",
		"answer": "<p><a href=\"%l\">%u</a> answered your post: <a href=\"%p\">%t</a></p><blockquote>%r</blockquote>",	
		
		"nt_reblog": "<p><a href=\"%l\">%u</a> reblogged your <a href=\"%p\">post</a></p>",
		"nt_reblog_with_comments": "<p><a href=\"%l\">%u</a> reblogged your <a href=\"%p\">post</a> and added:</p><blockquote>%r</blockquote>",
		"nt_like": "<p><a href=\"%l\">%u</a> liked your <a href=\"%p\">post</a></p>",
		"nt_reply": "<p><a href=\"%l\">%u</a> replied to your <a href=\"%p\">post:</a></p><blockquote>%r</blockquote>",
		"nt_answer": "<p><a href=\"%l\">%u</a> answered your <a href=\"%p\">post:</a></p><blockquote>%r</blockquote>",	
		
	},
	
	added_css: false,
	added_css_pn: false,
	added_css_pn_new: false,
	
	run: function() {
	
		try {
		
			XKit.tools.init_css("one_click_reply");

			if (document.location.href.indexOf("/new/text") !== -1) {
				XKit.extensions.one_click_reply.fill_post();
			}
			
			$(document).on("mouseleave",".post.is_mine .notes_container .note, .ui_notes .ui_note", XKit.extensions.one_click_reply.exit_pn);
			$(document).on("mouseenter",".post.is_mine .notes_container .note, .ui_notes .ui_note", XKit.extensions.one_click_reply.enter_pn);
			$(document).on("mouseenter",".notification", XKit.extensions.one_click_reply.enter);
			$(document).on("click",".xkit-reply-button", function(e) {
				var m_parent = $(this).parentsUntil(".notification").parent();
				XKit.extensions.one_click_reply.make_post(m_parent, false, e);
			});
			$(document).on("click",".xkit-reply-button-pn", function(e) {
				XKit.extensions.one_click_reply.make_post(this, true, e);
			});
		
		} catch(e) {
			alert(e.message);
		}
	},
	
	exit_pn: function(event) {
		
		var n_box = event.target;
		
		if ($(n_box).hasClass("note") === false || $(n_box).hasClass("action") === true) {
			// Must be in a sub-div.
			if ($(n_box).hasClass("action") === true) {
				n_box = $(n_box).parent();
			} else {
				n_box = $(n_box).parentsUntil(".note").parent();
			}
		}
		
		$(n_box).find(".xkit-reply-button-pn").css("display","none");
		
		
	},
	
	enter_pn: function(event) {
		
		var n_box = event.target;
		var new_style = false;
		var in_box = false;

		if ($(n_box).attr('class').indexOf("part_") !== -1 ||$(n_box).hasClass("xkit-activity-plus-timestamp")) {
			
			if ($(n_box).hasClass("xkit-activity-plus-timestamp")) {
				n_box = $(n_box).parent();
			} else {
				n_box = $(n_box).parentsUntil(".ui_note").parent();
			}
			
			new_style = true;

		} else {
		
			if ($(n_box).hasClass("note") === false || $(n_box).hasClass("action") === true) {
				// Must be in a sub-div.
				if ($(n_box).hasClass("action") === true) {
					n_box = $(n_box).parent();
				} else {
					n_box = $(n_box).parentsUntil(".note").parent();
				}
			}
			
		}
		
		if ($(n_box).parent().parent().hasClass('popover_scroll')) {
			in_box = true;
		}
		
		if (typeof $(n_box).attr('class') === "undefined") { return; }

		if ($(n_box).find(".xkit-reply-button-pn").length <= 0) {
			
			var m_html = "<a onclick=\"return false\" class=\"xkit-reply-button-pn\">reply</a>";
			if (new_style) {
				m_html = "<a onclick=\"return false\" class=\"xkit-reply-button-pn xkit-notes-new-style-fix\">reply</a>";
			}
			if (in_box) {
				var flush_to_right = false;
				if ($(n_box).find(".follow").length > 0) {
					if ($(n_box).find("a.follow").css("display") !== "block") {
						flush_to_right = true;
					}
				} else {
					flush_to_right = true;	
				}
				if ($(n_box).hasClass("reblog")) { flush_to_right = false; }
				m_html = "<a onclick=\"return false\" class=\"xkit-reply-button-pn xkit-notes-new-style-fix-pn\">reply</a>";
			}		
			
			$(n_box).append(m_html);
			
			if (flush_to_right) {
				$(n_box).find(".xkit-reply-button-pn").addClass("xkit-reply-button-flush-to-right");
			}
			
			var m_right = 30 + $(n_box).find(".xkit-reply-button-pn").width();
			var m_new_right = m_right + 5;
			
			if (in_box) {
				if (flush_to_right === true) {
					m_right = 17 + $(n_box).find(".xkit-reply-button-pn").width();	
				} else {
					m_right = 50 + $(n_box).find(".xkit-reply-button-pn").width();		
				}
				console.log("RIGHT => " + m_right + " ||push_to_right => " + flush_to_right);
				$(n_box).find("a.block").css("right", m_right + "px");
			}
			
			/*if (XKit.extensions.one_click_reply.added_css_pn !== true) {
				
				XKit.tools.add_css("#posts .notes_outer_container.popover .note.like a.block { right: " + m_right + "px !important; }", "one_click_reply");
				XKit.extensions.one_click_reply.added_css_pn = true;
			}*/
			
			if (XKit.extensions.one_click_reply.added_css_pn_new !== true) {
				XKit.tools.add_css(".ui_notes .ui_note .part_ignore { right: " + m_new_right + "px !important; }", "one_click_reply");
				XKit.extensions.one_click_reply.added_css_pn_new = true;
			}
			
		}
		
		$(n_box).find(".xkit-reply-button-pn").css("display","block");
		
		
	},
	
	enter: function(event) {
		
		var n_box = event.target;
		if ($(n_box).hasClass("notification") === false || $(n_box).hasClass("notification_inner") === true) {
			// Must be in a sub-div.
			if ($(n_box).hasClass("notification_inner") === true) {
				n_box = $(n_box).parent();
			} else {
				n_box = $(n_box).parentsUntil(".notification").parent();
			}
		}

		if ($(n_box).find(".xkit-reply-button").length < 1) {
			var m_html = "<a onclick=\"return false\" class=\"xkit-reply-button\">reply</a>";
			if ($(n_box).find(".block").length > 0) {
				$(n_box).find(".block").after(m_html);
			} else {
				$(n_box).find(".notification_sentence").append(m_html);
				$(n_box).find(".xkit-reply-button").css("top","12px");
				if ($(n_box).hasClass("stretchy_kid_container") === true) {
					$(n_box).find(".xkit-reply-button").css("right","8px");
				} else {
					$(n_box).find(".xkit-reply-button").css("right","38px");
				}
			}
			var m_right = 45 + $(n_box).find(".xkit-reply-button").width();
			if (XKit.extensions.one_click_reply.added_css !== true) {
				XKit.tools.add_css(".notification .block, .notification .ignore { right: " + m_right + "px !important; }", "one_click_reply");
				XKit.extensions.one_click_reply.added_css = true;
			}
		}
		
	},
	
	fill_post: function() {
	
		try {
		
		if ($("#post_content").length === 0) {
			setTimeout(function() {
				XKit.extensions.one_click_reply.fill_post();
			}, 1);
			return;
		}
		
		var m_sentence = XKit.tools.get_setting("xkit_one_click_reply_sentence", "");
		var username = XKit.tools.get_setting("xkit_one_click_reply_username", "");
		
		if (m_sentence === "" || username === "") {
			return;
		}
		
		if (m_sentence.substring(m_sentence.length - 7, m_sentence.length) !== "<p></p>") {
			m_sentence = m_sentence + "<p></p>";
		}
		m_sentence = $.trim(m_sentence);
		
		$("#post_two").val(m_sentence);
		setTimeout(function() {

			function set_post() {
				var post_two   = (tinyMCE && tinyMCE.get('post_two') && ! tinyMCE.get('post_two').plugins.spellchecker.active)
                                             ? tinyMCE.get('post_two').setContent(add_tag)
                                             : ($('post_two') ? $('post_two').value : add_tag);
				$('post_two').value = add_tag;
			}
		
			var mx_sentence = XKit.tools.replace_all(m_sentence, "\\\n", "");
			mx_sentence = XKit.tools.replace_all(m_sentence, "\\\r", "");
			mx_sentence = XKit.tools.replace_all(m_sentence, "'", "&#39;"); 
			//mx_sentence = XKit.tools.replace_all(m_sentence, "\"", "&#34;"); 
			XKit.tools.add_function(set_post, true, mx_sentence);
			
			XKit.tools.set_setting("xkit_one_click_reply_sentence", "");
			XKit.tools.set_setting("xkit_one_click_reply_username", "");
			
		}, 500);
		
		} catch(e) {
		
			alert(e.message);
		
		}
	
	},
	
	make_post_pn: function(obj, silent_mode) {
		
		obj = $(obj).parent();
		
		if ($(obj).hasClass("note") === false || $(obj).hasClass("action") === true) {
			// Must be in a sub-div.
			if ($(obj).hasClass("action") === true) {
				n_box = $(obj).parent();
			} else {
				n_box = $(obj).parentsUntil(".note").parent();
			}
		}
		
		if ($(obj).hasClass("ui_note")) {
			// New style notifications!
			return XKit.extensions.one_click_reply.make_post_activity(obj, silent_mode);
		}
		
		// Let's first get the type:
		var m_post_type = "";
		var m_sentence = "";
		
		if ($(obj).hasClass("is_reply") === true ||$(obj).hasClass("reply") === true) { m_post_type = "reply"; m_sentence = XKit.extensions.one_click_reply.sentences.reply; }
		if ($(obj).hasClass("is_like") === true || $(obj).hasClass("like") === true) { m_post_type = "like"; m_sentence = XKit.extensions.one_click_reply.sentences.like;  }
		if ($(obj).hasClass("is_answer") === true || $(obj).hasClass("answer") === true) { m_post_type = "answer"; m_sentence = XKit.extensions.one_click_reply.sentences.answer;  }
		if ($(obj).hasClass("is_reblog") === true || $(obj).hasClass("reblog") === true) { 
			m_post_type = "reblog"; 
			m_sentence = XKit.extensions.one_click_reply.sentences.reblog; 
			if ($(obj).hasClass("with_commentary") === true) {
				m_post_type = "reblog_text";
				m_sentence = XKit.extensions.one_click_reply.sentences.reblog_with_comments;	
			}
		}
		
		var post_div = $(obj).parentsUntil(".post").parent();
		var post_url = $(post_div).find(".post_permalink").attr('href');
		
		// Then the post contents:
		var post_contents = "";
		if ($(post_div).find(".post_title").length > 0) {
			// This post has a title! Let's use it.
			post_contents = $(post_div).find(".post_title").html();	
		} else {
			// Nope. Let's look at the contents.
			if ($(post_div).find(".post_text_wrapper").length > 0) {
				// This is a text post!
				post_contents = $(post_div).find(".post_text_wrapper").html();
			}else {
				// This is probably an image or audio post.
				if ($(post_div).find(".caption").length > 0) {
					// This is an image.
					post_contents = $(post_div).find(".caption").html();
				} else {
					if ($(post_div).find(".post_body").length > 0) {
						post_contents = $(post_div).find(".post_body").html();
					} else {
						if ($(post_div).find(".link_title").length > 0) {
							post_contents = $(post_div).find(".post_body").html();
						}	
					}
				}
			}
		}
		
		post_contents = post_contents.replace(/<(?:.|\n)*?>/gm, '');
		if (post_contents.length > 40) {
			post_contents = post_contents.substring(0, 38) + "...";	
		}
		
		// Example sentence:
		// "<p><a href=\"%l\">%u</a> reblogged <a href=\"%p\">your post</a> and added:</p><blockquote>%r</blockquote>"
		
		var sentence_p = post_url;
		
		var user_name = "";
		var user_url = "";
		var commentary = $(obj).find(".answer_content").html();
		if (m_post_type === "reblog_text") {
			commentary = $(obj).find("blockquote").html();	
			if ($(obj).find("blockquote").find("a").length > 0) {
				commentary = $(obj).find("blockquote").find("a").html();	
			}
		}
		
		if (m_post_type === "reblog" ||m_post_type === "reblog_text") {
			user_name = $(obj).find("a.tumblelog:first-child").html();
			user_url = $(obj).find("a.tumblelog:first-child").attr('href');
		}
		
		if (m_post_type === "like" || m_post_type === "reply" || m_post_type === "answer") {
			user_name = $(obj).find("a.tumblelog").html();	
			user_url = $(obj).find("a.tumblelog").attr('href');	
		}	
		
		if ($.trim(post_contents) === "") {
			
			if (m_post_type === "reply") {
				m_sentence = XKit.extensions.one_click_reply.sentences.nt_reply;	
			}
			
			if (m_post_type === "like") {
				m_sentence = XKit.extensions.one_click_reply.sentences.nt_like;	
			}
			
			if (m_post_type === "answer") {
				m_sentence = XKit.extensions.one_click_reply.sentences.nt_answer;	
			}

			if ($(obj).hasClass("reblog") === true) { 
				m_sentence = XKit.extensions.one_click_reply.sentences.nt_reblog; 
				if ($(obj).hasClass("with_commentary") === true) {
					m_sentence = XKit.extensions.one_click_reply.sentences.nt_reblog_with_comments;	
				}
			}	

		}	
		
		m_sentence = m_sentence.replace("%l", user_url);
		m_sentence = m_sentence.replace("%u", user_name);
		m_sentence = m_sentence.replace("%p", post_url);
		m_sentence = m_sentence.replace("%r", commentary);
		m_sentence = m_sentence.replace("%t", post_contents);
		
		m_sentence = XKit.extensions.one_click_reply.strip_sentence(m_sentence);
		
		if (XKit.extensions.one_click_reply.preferences.show_avatars.value === true) {
			// Fetch the avatar, slugify it to sentence.
			var avatar_url = $(obj).find(".avatar_frame").find(".avatar").attr('src');
			// This is ugly but it works:
			avatar_url_start = avatar_url.indexOf('.media.tumblr.com');
			if (avatar_url_start !== -1) {
				avatar_url = "http://" + avatar_url.substring(avatar_url_start + 1);	
			}
			m_sentence = "<img src=\"" + avatar_url + "\" class=\"image_thumbnail\">" + m_sentence;	
		}
		
		XKit.tools.set_setting("xkit_one_click_reply_sentence", m_sentence);
		XKit.tools.set_setting("xkit_one_click_reply_username", user_name);
		
		var m_url = "http://www.tumblr.com/new/text";
		
		if (document.location.href.indexOf("/blog/") !== -1) {
			// Maybe we can make this better?
			m_url = $("#new_post_label_text").attr('href');
		}
		
		if (m_url.indexOf('?') !== -1) {
			m_url = m_url.substring(0, m_url.indexOf('?'));
		}
		
		var m_tags_to_return = "";
		
		if (this.preferences.tag_people.value === true) {
			m_url = m_url + "?tags=" + user_name;
			m_tags_to_return = user_name;
			if (this.preferences.auto_tag.value === true && this.preferences.auto_tag_text.value !== "") {
				m_url = m_url + "," + this.preferences.auto_tag_text.value;
				m_tags_to_return = m_tags_to_return + "," + this.preferences.auto_tag_text.value;
			}
		} else {
			if (this.preferences.auto_tag.value === true && this.preferences.auto_tag_text.value !== "") {
				m_url = m_url + "?tags=" + this.preferences.auto_tag_text.value;
				m_tags_to_return = m_tags_to_return + "," + this.preferences.auto_tag_text.value;
			}		
		}

		if (silent_mode === true) {
		
			var obj_to_return = new Object();
			obj_to_return.sentence = m_sentence;
			obj_to_return.tags = m_tags_to_return;

			return obj_to_return;
			
		} else {
		
			if (this.preferences.open_in_new_tab.value === true) {
				window.open(m_url,'_BLANK');
			} else {
				document.location.href = m_url;
			}
		
		}

		// document.location.href = m_url;
		
	},
	
	make_post: function(obj, pn_mode, event, silent_mode) {
		
		if (XKit.extensions.one_click_reply.preferences.multi_reply.value === true && silent_mode !== true) {
			if (event.altKey) {
				var m_obj = $(obj);
				if (pn_mode === true) {
					m_obj = $(obj).parent();
					$(m_obj).toggleClass("xkit-reply-selected-pn");
				} else {
					$(m_obj).toggleClass("xkit-reply-selected");
				}
				return;	
			} else {
				if ($(".xkit-reply-selected").length > 0 || $(".xkit-reply-selected-pn").length > 0) {
					// There are selected posts!
					if ($(obj).hasClass("xkit-reply-selected") === false && $(obj).hasClass("xkit-reply-selected-pn") === false) {
						// Add this too.
						var m_obj = $(obj);
						if (pn_mode === true) {
							m_obj = $(obj).parent();
							$(m_obj).addClass("xkit-reply-selected-pn");
						} else {
							$(m_obj).addClass("xkit-reply-selected");
						}
					}
					
					var m_text = "";
					var m_tags = "";
					
					$(".notification.xkit-reply-selected, .xkit-reply-selected-pn").each(function() {
					
						// Cycle thru all the posts and gather information.
						
						if ($(this).hasClass("xkit-reply-selected-pn") === true) {
							var m_return = XKit.extensions.one_click_reply.make_post_pn($(this).find(".xkit-reply-button-pn"), true);
							m_tags = m_tags + "," + m_return.tags;
							m_text = m_text + m_return.sentence + "<p></p>";
							// m_text = m_text + XKit.extensions.one_click_reply.make_post_pn(this, true);	
						} else {
							var m_return = XKit.extensions.one_click_reply.make_post(this, pn_mode, "", true);
							m_tags = m_tags + "," + m_return.tags;
							m_text = m_text + m_return.sentence + "<p></p>";
						}
						
					});
					
					XKit.tools.set_setting("xkit_one_click_reply_sentence", m_text);
					XKit.tools.set_setting("xkit_one_click_reply_username", m_tags);
					
					var m_url = "http://www.tumblr.com/new/text";
					
					if (document.location.href.indexOf("/blog/") !== -1) {
						// Maybe we can make this better?
						if ($("#new_post_label_text").length > 0) {
							m_url = $("#new_post_label_text").attr('href');
						} else {
							m_url = $("body").attr('data-new-root') + "/new/text";	
						}
					}
					
					if (m_url.indexOf('?') !== -1) {
						m_url = m_url.substring(0, m_url.indexOf('?'));
					}
					
					if (this.preferences.tag_people.value === true) {
						m_url = m_url + "?tags=" + m_tags;
						if (this.preferences.auto_tag.value === true && this.preferences.auto_tag_text.value !== "") {
							m_url = m_url + "," + this.preferences.auto_tag_text.value;
						}
					} else {
						if (this.preferences.auto_tag.value === true && this.preferences.auto_tag_text.value !== "") {
							m_url = m_url + "?tags=" + this.preferences.auto_tag_text.value;
						}		
					}
					
					$(".xkit-reply-selected").removeClass("xkit-reply-selected");
					$(".xkit-reply-selected-pn").removeClass("xkit-reply-selected-pn");
					
					if (this.preferences.open_in_new_tab.value === true) {
						window.open(m_url,'_BLANK');
					} else {
						document.location.href = m_url;
					}
					
					return;
				}
				
			}
		}
		
		if (pn_mode === true) {
			XKit.extensions.one_click_reply.make_post_pn(obj);
			return;	
		}
		
	try {

		return XKit.extensions.one_click_reply.make_post_reg(obj, pn_mode, event, silent_mode);
		
	} catch(e) {
		alert("On 102: " + e.message);
	}
	},
	
	make_post_reg: function(obj, pn_mode, event, silent_mode) {
		
		var username = $(obj).find(".username").html();
		var m_sentence = "";
		if ( $(obj).find(".notification_sentence").find(".hide_overflow") > 0) {
		 	m_sentence = "<p>" + $(obj).find(".notification_sentence").find(".hide_overflow").html() + "</p>";
		} else {
			var tmp_div = $(obj).find(".notification_sentence");
			$(".xkit-reply-button", tmp_div).remove();
			var tmp_html = $(tmp_div).html();
			m_sentence = "<p>" + tmp_html + "</p>";
		}
		
		if ($(obj).find(".notification_sentence").find("blockquote").length > 0) {
			// m_sentence = m_sentence + "<blockquote>" + $(obj).find(".notification_sentence").find("blockquote").html() + "</blockquote>";
		}
		
		m_sentence = XKit.extensions.one_click_reply.strip_sentence(m_sentence);
		
		if (XKit.extensions.one_click_reply.preferences.show_avatars.value === true) {
			// Fetch the avatar, slugify it to sentence.
			var m_obj = $(obj);


			/*if ($(m_obj).hasClass("stretchy_kids") === true ||$(m_obj).hasClass("notification_follower") === true) {
				m_obj = $(m_obj).parent();	
			}
			
			if ($(m_obj).hasClass("stretchy_kid") === true || $(m_obj).hasClass("stretchy_kid_container") === true) {
				m_obj = $(m_obj).parent().parent();			
			}*/
			
			/*if ($(m_obj).hasClass("notification_follower") === true) {
					
			}*/
			
			console.log(" -- Now: " + $(m_obj).attr('class'));
			var avatar_url = $(m_obj).find(".avatar_frame").find(".avatar").attr('src');
			// This is ugly but it works:
			try { 
				avatar_url_start = avatar_url.indexOf('.media.tumblr.com');
			} catch(e) {
				console.log("Can't fetch avatar.");
			}	
			if (avatar_url_start !== -1) {
				avatar_url = "http://" + avatar_url.substring(avatar_url_start + 1);	
			}
			m_sentence = "<img src=\"" + avatar_url + "\" class=\"image_thumbnail\">" + m_sentence;	
		}
		
		XKit.tools.set_setting("xkit_one_click_reply_sentence", m_sentence);
		XKit.tools.set_setting("xkit_one_click_reply_username", username);
		
		var m_url = "http://www.tumblr.com/new/text";
		
		if (document.location.href.indexOf("/blog/") !== -1) {
			// Maybe we can make this better?
			m_url = $("#new_post_label_text").attr('href');
		}
		
		if (m_url.indexOf('?') !== -1) {
			m_url = m_url.substring(0, m_url.indexOf('?'));
		}

		var m_tags_to_return = "";
		
		if (this.preferences.tag_people.value === true) {
			m_url = m_url + "?tags=" + username;
			m_tags_to_return = username;
			if (this.preferences.auto_tag.value === true && this.preferences.auto_tag_text.value !== "") {
				m_url = m_url + "," + this.preferences.auto_tag_text.value;
				m_tags_to_return = m_tags_to_return + "," + this.preferences.auto_tag_text.value;
			}
		} else {
			if (this.preferences.auto_tag.value === true && this.preferences.auto_tag_text.value !== "") {
				m_url = m_url + "?tags=" + this.preferences.auto_tag_text.value;
				m_tags_to_return = m_tags_to_return + "," + this.preferences.auto_tag_text.value;
			}		
		}
		
		if (silent_mode === true) {
		
			var obj_to_return = new Object();
			obj_to_return.sentence = m_sentence;
			obj_to_return.tags = m_tags_to_return;
			return obj_to_return;
			
		} else {
		
			if (this.preferences.open_in_new_tab.value === true) {
				window.open(m_url,'_BLANK');
			} else {
				document.location.href = m_url;
			}
		
		}	
		
	},
	
	make_post_activity: function(obj, silent_mode) {
		
		var username = $(obj).attr('data-tumblelog-name');
		var post_url = $(obj).find(".part_glass").attr('href');
		
		var m_sentence = "";
		if ( $(obj).find(".part_main").length > 0) {
		 	m_sentence = "<p>" + $(obj).find(".part_main").html() + "</p>";
		} else {
			var tmp_div = $(obj).find(".notification_sentence");
			$(".xkit-reply-button", tmp_div).remove();
			var tmp_html = $(tmp_div).html();
			m_sentence = "<p>" + tmp_html + "</p>";
		}
		
		if ($(".summary", m_sentence).length > 0) {
			var m_new = $(m_sentence);
			$(m_new).find(".summary").html($(m_new).find(".summary").html());
			$(m_new).find(".summary").wrap("<a href=\"" + post_url + "\"></a>");
			$(m_new).find(".summary").parent().before(" ");
			m_sentence = $(m_new).html();
		}
		
		if ($(obj).find(".part_response").length > 0) {
			m_sentence = m_sentence + $(obj).find(".part_response").html();
		}
		
		m_sentence = XKit.extensions.one_click_reply.strip_sentence(m_sentence);
		
		if (XKit.extensions.one_click_reply.preferences.show_avatars.value === true) {
			// Fetch the avatar, slugify it to sentence.
			var m_obj = $(obj);
			
			console.log(" -- Now: " + $(m_obj).attr('class'));
			var avatar_url = $(m_obj).find(".part_avatar").find(".ui_avatar_link").attr('data-avatar-url');
			
			avatar_url = avatar_url.replace("_64.png","_40.png");
			avatar_url = avatar_url.replace("_64.gif","_40.gif");
			avatar_url = avatar_url.replace("_64.jpg","_40.jpg");
			avatar_url = avatar_url.replace("_128.png","_40.png");
			avatar_url = avatar_url.replace("_128.gif","_40.gif");
			avatar_url = avatar_url.replace("_128.jpg","_40.jpg");
			// This is ugly but it works:
			try { 
				avatar_url_start = avatar_url.indexOf('.media.tumblr.com');
			} catch(e) {
				console.log("Can't fetch avatar.");
			}	
			if (avatar_url_start !== -1) {
				avatar_url = "http://" + avatar_url.substring(avatar_url_start + 1);	
			}
			m_sentence = "<p><img src=\"" + avatar_url + "\" class=\"image_thumbnail\"></p>" + m_sentence;	
		}
		
		XKit.tools.set_setting("xkit_one_click_reply_sentence", m_sentence);
		XKit.tools.set_setting("xkit_one_click_reply_username", username);
		
		var m_url = "http://www.tumblr.com/new/text";
		
		if (document.location.href.indexOf("/blog/") !== -1) {
			// Maybe we can make this better?
			m_url = $("body").attr('data-new-root') + "/new/text";
		}
		
		if (m_url.indexOf('?') !== -1) {
			m_url = m_url.substring(0, m_url.indexOf('?'));
		}
		
		var m_tags_to_return = "";
		
		if (this.preferences.tag_people.value === true) {
			m_url = m_url + "?tags=" + username;
			m_tags_to_return = username;
			if (this.preferences.auto_tag.value === true && this.preferences.auto_tag_text.value !== "") {
				m_url = m_url + "," + this.preferences.auto_tag_text.value;
				m_tags_to_return = m_tags_to_return + "," + this.preferences.auto_tag_text.value;
			}
		} else {
			if (this.preferences.auto_tag.value === true && this.preferences.auto_tag_text.value !== "") {
				m_url = m_url + "?tags=" + this.preferences.auto_tag_text.value;
				m_tags_to_return = m_tags_to_return + "," + this.preferences.auto_tag_text.value;
			}		
		}
		
		if (silent_mode === true) {
		
			var obj_to_return = new Object();
			obj_to_return.sentence = m_sentence;
			obj_to_return.tags = m_tags_to_return;
			return obj_to_return;
			
		} else {
		
			if (this.preferences.open_in_new_tab.value === true) {
				window.open(m_url,'_BLANK');
			} else {
				document.location.href = m_url;
			}
		
		}	
		
	},
	
	strip_sentence: function(m_sentence) {
	
		m_sentence = XKit.tools.replace_all(m_sentence, "[[MORE]]", "");
		m_sentence = m_sentence.replace(/[^ -~]/g, function(chr) {
    			return "&#"+chr.charCodeAt(0)+";";
		});	
		
		return m_sentence;
		
	},
	
	destroy: function() {
		XKit.tools.remove_css("one_click_reply");
		XKit.extensions.one_click_reply.added_css = false;
		$(".xkit-reply-button").remove();
		$(document).off("mouseenter",".notification", XKit.extensions.one_click_reply.enter);
	}
	
});