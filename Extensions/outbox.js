//* TITLE Outbox **//
//* VERSION 0.1 REV C **//
//* DESCRIPTION Saves your last 20 sent private replies. **//
//* DETAILS This extension stores and lets you view the last 20 asks you've answered privately. Please keep in mind that this is a highly experimental extension, so if you hit a bug, please send the XKit blog an ask with the problem you've found. **//
//* DEVELOPER STUDIOXENIX **//
//* FRAME false **//
//* BETA false **//

XKit.extensions.outbox = new Object({

	running: false,

	run: function() {
		this.running = true;
		
		if ($("body").hasClass("dashboard_messages_inbox") !== true && $("body").hasClass("dashboard_messages_submissions") !== true) {
			return;
		}
		
		XKit.tools.init_css("outbox");
		
		xf_html = '<ul class="controls_section" id="xkit_outbox_ul">' + 
			'<li class=""><a href="#" onclick="return false;" id="xkit-outbox-button">' +
				'<div class="hide_overflow">Outbox</div>' +
			'</a></li></ul>';
		$("ul.controls_section:eq(1)").before(xf_html);	

		$("#xkit-outbox-button").click(function() {

			if ($(this).parent().hasClass("xkit-selected") == false) {
			
				$(this).parent().addClass("xkit-selected");
				$(this).parent().addClass("selected");
				XKit.extensions.outbox.start();
	
			} else {	

				$(this).parent().removeClass("xkit-selected");
				$(this).parent().removeClass("selected");
				XKit.extensions.outbox.end();

			}

		});
		
		var form_key = $("body").attr('data-form-key');
		if (form_key === "" ||typeof form_key === "undefined") {
			XKit.notifications.add("Can't load Outbox, data-form-key not defined.","error");
			return;
		}
		
		$(document).on("click", "[id^='ask_answer_link_']", function() {
			
			var m_parent = $(this).parentsUntil(".post").parent();
			
			var private_button = $(m_parent).find('[id^="private_answer_button_"]');
			
			$(private_button).click(XKit.extensions.outbox.save);
			
		});

	},
	
	save: function(e) {
		
		var obj = e.target || e.srcElement;
		
		var m_parent = $(obj).parentsUntil(".post").parent();
		
		var m_avatar = $(m_parent).find(".post_avatar_image").attr('src');
		var m_username = $(m_parent).find(".post_info").find("a").html();
		var m_message = $(m_parent).find(".post_body").html();
		var m_to = $(m_parent).attr('data-tumblelog-name');
		
		var post_id = $(m_parent).attr('data-post-id');
		XKit.extensions.outbox.poke_tinymce(post_id);
		
		if (m_message.indexOf("<div id=\"ask_answer_") !== -1) {
		
			m_message = m_message.substring(0, m_message.indexOf("<div id=\"ask_answer_"));
			
		}
		
		var m_answer = $('#ask_answer_field_' + post_id).val();
		setTimeout(function() {
			
			m_answer = $('#ask_answer_field_' + post_id).val();
			
			var form_key = $("body").attr('data-form-key');
			var m_messages = XKit.storage.get("outbox", "messages_" + form_key, "");
		
			var m_messages_array = "";
		
			try {
				m_messages_array = JSON.parse(m_messages);
				if (m_messages_array.length >= 20) {
					// remove the last element.
					m_messages_array.pop();
				}
			} catch(e) {
				m_messages_array = new Array();
			}
			
			var m_obj = new Object();
			m_obj.avatar = m_avatar;
			m_obj.username = m_username;
			m_obj.message = m_message;
			m_obj.answer = m_answer;
			m_obj.to = m_to;
			
			m_messages_array.unshift(m_obj);
			XKit.storage.set("outbox", "messages_" + form_key, JSON.stringify(m_messages_array));
			XKit.notifications.add("Saved to outbox.","ok");
			
		}, 1);
		
	},
	
	poke_tinymce: function(post_id) {
		source = " if (tinyMCE && tinyMCE.get('ask_answer_field_" + post_id + "')) {  " + 
						" document.getElementById('ask_answer_field_" + post_id + "').value = (tinyMCE.get('ask_answer_field_" + post_id + "').getContent()); " +
				 " } ";
	
		if ('function' == typeof source) {
				source = '(' + source + ')();'
		}
	
		var script = document.createElement('script');
		script.setAttribute("type", "application/javascript");
		script.textContent = source;
		document.body.appendChild(script);
	},
	
	start: function() {
		
		XKit.tools.add_css(" .post { display: none; } .post.by-xkit-outbox { display: block !important; }", "outbox_additional");
		
		var form_key = $("body").attr('data-form-key');
		if (form_key === "" ||typeof form_key === "undefined") {
			XKit.extensions.outbox.show_empty("Can't load messages,<br/>data-form-key not found.");
			return;	
		}
		
		var m_messages = XKit.storage.get("outbox", "messages_" + form_key, "");
		
		if (m_messages === "") {
			XKit.extensions.outbox.show_empty();	
			return;
		}
		
		var messages_array;
		try {
			messages_array = JSON.parse(m_messages);	
			XKit.extensions.outbox.show(messages_array);
		} catch(e) {
			XKit.extensions.outbox.show_empty("Can't load messages,<br/>" + e.message);	
		}
		
	},
	
	show: function(m_array) {
		
		var m_html = "";
		for (var m_message in m_array) {
			
			var m_obj = m_array[m_message];
			
			m_html = m_html + XKit.extensions.outbox.render(m_obj);	
			
		}
		
		$("#posts").prepend(m_html);
		
	},
	
	render: function(obj) {
		
		var to_return = "<li class=\"post_container\"><div class=\"post post_full by-xkit-outbox is_mine is_original is_private_answer no_source\">";
	
		var m_link = "<a href=\"http://" + obj.username + ".tumblr.com/\">" + obj.username + "</a>";
		
		var av_link = "<a href=\"http://" + obj.username + ".tumblr.com/\"><img width=\"24\" height=\"24\" src=\"" + obj.avatar + "\"></a>";
		var av_text = "<a href=\"http://" + obj.username + ".tumblr.com/\" class=\"post_question_asker\">" + obj.username + "</a>";
		
		to_return = to_return + "<div class=\"post-wrapper\">" +
				"<div class=\"post_header\"><div class=\"post_info\">You've sent to " + m_link + "</div></div>" +
				"<div class=\"post_content clearfix\"><div class=\"post_content_inner clearfix\">" +
					"<div class=\"post_body\">" +
						"<div class=\"clear\">&nbsp;</div>" +
						"<div class=\"post_question\">" + obj.message + "</div>" +
						"<div class=\"asking_avatar\">" +
							av_link +
							av_text +
						"</div>" +
						"<div class=\"post_answer_bar\" style=\"margin-top: 15px; padding-top: 15px; border-top: 1px solid #e7eaec\">" + obj.answer + "</div>" +
					"</div>" +
				"</div></div>" +
			    "</div>";
		
		to_return = to_return + "</div></li>";
		
		return to_return;
		
	},
	
	show_empty: function(m_message) {
		
		var m_error = "No messages on outbox yet.";
		if (typeof m_message !== "undefined" &&m_message !== "") {
			m_error = m_message;	
		}
		
		$(".no_posts_found").remove();
		$("#posts").before("<div id=\"xkit-outbox-no-posts\" class=\"no_posts_found\" style=\"padding-top: 234px; padding-bottom: 234px;\">" +
                  		  		"<i class=\"icon_mail\"></i>" +
                				m_error  +
                			"</div>");	
		
	},
	
	end: function() {
	
		$(".by-xkit-outbox").parent().remove();
		$("#xkit-outbox-no-posts").remove();
		XKit.tools.remove_css("outbox_additional");
		
	},

	destroy: function() {
		this.running = false;
	}

});