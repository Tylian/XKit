//* TITLE One-Click-Reply **//
//* VERSION 1.2 REV A **//
//* DESCRIPTION Lets you reply to notifications **//
//* DEVELOPER STUDIOXENIX **//
//* DETAILS To use this extension, hover over a notification and click on the Reply button. **//
//* FRAME false **//
//* BETA false **//

XKit.extensions.one_click_reply = new Object({

	running: false,
	
	
	preferences: {
		"tag_people": {
			text: "Tag people by their usernames on my replies",
			default: true,
			value: true
		},
		"auto_tag": {
			text: "Auto-tag all my replies with a custom tag",
			default: false,
			value: true
		},
		"auto_tag_text": {
			text:  "Custom tag for all replies",
			type: "text",
			default: "",
			value: ""
		},
		"open_in_new_tab": {
			text: "Open reply windows in a new tab",
			default: false,
			value: false
		}
	},
	
	sentences: {
	
		"reblog": "<p><a href=\"%l\">%u</a> reblogged your post: <a href=\"%p\">%t</a></p>",
		"reblog_with_comments": "<p><a href=\"%l\">%u</a> reblogged your post <a href=\"%p\">%t</a> and added:</p><blockquote>%r</blockquote>",
		"like": "<p><a href=\"%l\">%u</a> liked your post: <a href=\"%p\">%t</a></p>",
		"follow": "<p><a href=\"%l\">%u</a> started following %b</p>",
		"reply": "<p><a href=\"%l\">%u</a> replied to your post: <a href=\"%p\">%t</a></p><blockquote>%r</blockquote>",
		"answer": "<p><a href=\"%l\">%u</a> answered your post: <a href=\"%p\">%t</a></p><blockquote>%r</blockquote>",	
		
	},
	
	added_css: false,
	added_css_pn: false,
	
	run: function() {
	
		try {
		
			XKit.tools.init_css("one_click_reply");

			if (document.location.href.indexOf("/new/text") !== -1) {
				XKit.extensions.one_click_reply.fill_post();
			}
			
			$(document).on("mouseleave",".post.is_mine .notes_container .note", XKit.extensions.one_click_reply.exit_pn);
			$(document).on("mouseenter",".post.is_mine .notes_container .note", XKit.extensions.one_click_reply.enter_pn);
			$(document).on("mouseenter",".notification", XKit.extensions.one_click_reply.enter);
			$(document).on("click",".xkit-reply-button", function() {
				var m_parent = $(this).parentsUntil(".notification").parent();
				XKit.extensions.one_click_reply.make_post(m_parent);
			});
			$(document).on("click",".xkit-reply-button-pn", function() {
				XKit.extensions.one_click_reply.make_post(this, true);
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
		
		if ($(n_box).hasClass("note") === false || $(n_box).hasClass("action") === true) {
			// Must be in a sub-div.
			if ($(n_box).hasClass("action") === true) {
				n_box = $(n_box).parent();
			} else {
				n_box = $(n_box).parentsUntil(".note").parent();
			}
		}

		if ($(n_box).find(".xkit-reply-button-pn").length <= 0) {
			var m_html = "<a href=\"#\" onclick=\"return false\" class=\"xkit-reply-button-pn\">reply</a>";
			$(n_box).append(m_html);
			var m_right = 30 + $(n_box).find(".xkit-reply-button-pn").width();
			if (XKit.extensions.one_click_reply.added_css_pn !== true) {
				XKit.tools.add_css(".notes_container .note .block { right: " + m_right + "px !important; }", "one_click_reply");
				XKit.extensions.one_click_reply.added_css_pn = true;
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
			var m_html = "<a href=\"#\" onclick=\"return false\" class=\"xkit-reply-button\">reply</a>";
			if ($(n_box).find(".block").length > 0) {
				$(n_box).find(".block").after(m_html);
			} else {
				$(n_box).find(".notification_sentence").append(m_html);
				$(n_box).find(".xkit-reply-button").css("top","12px");
				$(n_box).find(".xkit-reply-button").css("right","38px");
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
		
		m_sentence = m_sentence + "<p></p>";
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
	
	make_post_pn: function(obj) {
		
		obj = $(obj).parent();
		
		if ($(obj).hasClass("note") === false || $(obj).hasClass("action") === true) {
			// Must be in a sub-div.
			if ($(obj).hasClass("action") === true) {
				n_box = $(obj).parent();
			} else {
				n_box = $(obj).parentsUntil(".note").parent();
			}
		}
		
		// Let's first get the type:
		var m_post_type = "";
		var m_sentence = "";
		
		if ($(obj).hasClass("reply") === true) { m_post_type = "reply"; m_sentence = XKit.extensions.one_click_reply.sentences.reply; }
		if ($(obj).hasClass("like") === true) { m_post_type = "like"; m_sentence = XKit.extensions.one_click_reply.sentences.like;  }
		if ($(obj).hasClass("answer") === true) { m_post_type = "answer"; m_sentence = XKit.extensions.one_click_reply.sentences.answer;  }
		
		if ($(obj).hasClass("reblog") === true) { 
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
		
		m_sentence = m_sentence.replace("%l", user_url);
		m_sentence = m_sentence.replace("%u", user_name);
		m_sentence = m_sentence.replace("%p", post_url);
		m_sentence = m_sentence.replace("%r", commentary);
		m_sentence = m_sentence.replace("%t", post_contents);
		
		m_sentence = XKit.extensions.one_click_reply.strip_sentence(m_sentence);
		
		XKit.tools.set_setting("xkit_one_click_reply_sentence", m_sentence);
		XKit.tools.set_setting("xkit_one_click_reply_username", user_name);
		
		var m_url = "http://www.tumblr.com/new/text";
		
		if (document.location.href.indexOf("/blog/") !== -1) {
			// Maybe we can make this better?
			m_url = $("#new_post_label_text").attr('href');
		}
		
		if (this.preferences.tag_people.value === true) {
			m_url = m_url + "?tags=" + user_name;
			if (this.preferences.auto_tag.value === true && this.preferences.auto_tag_text.value !== "") {
				m_url = m_url + "," + this.preferences.auto_tag_text.value;
			}
		} else {
			if (this.preferences.auto_tag.value === true && this.preferences.auto_tag_text.value !== "") {
				m_url = m_url + "?tags=" + this.preferences.auto_tag_text.value;
			}		
		}
		
		if (this.preferences.open_in_new_tab.value === true) {
			window.open(m_url,'_BLANK');
		} else {
			document.location.href = m_url;
		}
		// document.location.href = m_url;
		
	},
	
	make_post: function(obj, pn_mode) {
		
		if (pn_mode === true) {
			XKit.extensions.one_click_reply.make_post_pn(obj);
			return;	
		}
		
	try {

	
		/*var username = "<a href=\"" + $(obj).find(".username").attr('href') + "\">" + $(obj).find(".username").html() + "</a>";
		var post_url = $(obj).next('.colon').find('a').html();
	
		var m_class = ""; 
		if (obj.hasClass("notification_reblog") === true) { m_class = "reblog"; }
		if (obj.hasClass("notification_like") === true) { 
			m_class = "like"; 
			var m_sentence = XKit.language.one_click_reply.sentences.like;
			m_sentence = m_sentence.replace("%u", username);
			m_sentence = m_sentence.replace("%p", post_url);	
			alert(m_sentence);
		}*/
		
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
		
		XKit.tools.set_setting("xkit_one_click_reply_sentence", m_sentence);
		XKit.tools.set_setting("xkit_one_click_reply_username", username);
		
		var m_url = "http://www.tumblr.com/new/text";
		
		if (document.location.href.indexOf("/blog/") !== -1) {
			// Maybe we can make this better?
			m_url = $("#new_post_label_text").attr('href');
		}
		
		if (this.preferences.tag_people.value === true) {
			m_url = m_url + "?tags=" + username;
			if (this.preferences.auto_tag.value === true && this.preferences.auto_tag_text.value !== "") {
				m_url = m_url + "," + this.preferences.auto_tag_text.value;
			}
		} else {
			if (this.preferences.auto_tag.value === true && this.preferences.auto_tag_text.value !== "") {
				m_url = m_url + "?tags=" + this.preferences.auto_tag_text.value;
			}		
		}
		
		if (this.preferences.open_in_new_tab.value === true) {
			window.open(m_url,'_BLANK');
		} else {
			document.location.href = m_url;
		}
		
	} catch(e) {
		alert(e.message);
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