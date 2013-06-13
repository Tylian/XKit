//* TITLE XInbox **//
//* VERSION 1.0 REV D **//
//* DESCRIPTION Enhances your Inbox experience **//
//* DEVELOPER STUDIOXENIX **//
//* DETAILS XInbox allows you to tag posts before posting them, and see all your messages at once, and lets you delete multiple messages at once using the Mass Editor mode. To use this mode, go to your Inbox and click on the Mass Editor Mode button on your sidebar, click on the messages you want to delete then click the Delete Messages button.  **//
//* FRAME false **//
//* BETA false **//

XKit.extensions.xinbox = new Object({

	running: false,

	preferences: {
		"sep0": {
			text: "Tagging while publishing",
			type: "separator"
		},
		"tag_usernames": {
			text: "Tag published asks with their usernames",
			default: true,
			value: true
		},
		"anon_tag": {
			text: "Tag to use when the asker is anonymous",
			default: "Anonymous",
			value: "Anonymous",
			type: "text"
		},
		"tag_custom": {
			text: "Tag published asks with the custom tag below:",
			default: false,
			value: false
		},
		"custom_tag": {
			text: "Custom tag for asks",
			default: "",
			value: "",
			type: "text"
		},
		"sep1": {
			text: "Appearance",
			type: "separator"
		},
		"slim_fan_mail": {
			text: "Slim Fan Mail",
			default: false,
			value: false
		},
		"hide_fan_mail_button": {
			text: "Hide 'Send Fan Mail' button",
			default: false,
			value: false
		},
		"sep2": {
			text: "Inbox Tools",
			type: "separator"
		},
		"mass_editor": {
			text: "Enable Mass Inbox Editor",
			default: true,
			value: true
		}
	},

	run: function() {
		this.running = true;
		XKit.tools.init_css("xinbox");

		if(XKit.extensions.xinbox.preferences.custom_tag.value === true || XKit.extensions.xinbox.preferences.tag_usernames.value === true) {
			XKit.extensions.xinbox.init_tags();
		}

		if(XKit.extensions.xinbox.preferences.hide_fan_mail_button.value === true && $("#right_column > .send_fan_mail").length > 0) {
			XKit.tools.add_css("#right_column > .send_fan_mail { display: none; } #right_column .controls_section { margin-top: 0 !important; margin-bottom: 18px; } ", "xkit_inbox_hide_fan_mail_button");
		}
		
		if(XKit.extensions.xinbox.preferences.slim_fan_mail.value === true) {
			var m_css = " .fan_mail .message { " +
						" background: white !important; " +
						" padding-left: 20px !important; padding-right: 20px !important; " +
						" padding-bottom: 37px !important; padding-top: 20px !important; " +
						" border-radius: 6px !important; " +
						" font: normal 14px/1.4 \"Helvetica Neue\",\"HelveticaNeue\",Helvetica,Arial,sans-serif !important; " +
					" }" + 
					" #posts .post.fan_mail .controls { " +
						" left: 0px !important; right: 20px !important; " +
						" color: #818b98 !important; " +
					"}" + 
					" .xkit-paper-cut-thingy {" +
						" display: none;" +
					" }" + 
					" #posts .post.fan_mail .controls .controls_link { " +
						" color: #818b98 !important; " +
					" }";
			XKit.tools.add_css(m_css, "xkit_inbox_slim_fan_mail");
		}

		if(XKit.extensions.xinbox.preferences.mass_editor.value === true) {
			XKit.extensions.xinbox.init_mass_editor();
		}

	},

	init_mass_editor: function() {

		if ($("body").hasClass("dashboard_messages_inbox") !== true && $("body").hasClass("dashboard_messages_submissions") !== true) {
			return;
		}

		xf_html = '<ul class="controls_section" id="xinbox_sidebar">' +
			'<li class="" id="xinbox_mass_edit_li">' +
				'<a href="#" class="customize" id="xinbox_mass_edit_button">' +
					'<div class="hide_overflow">Mass Edit Mode</div>' +
				'</a>' +
			'</li>' +
			'</ul>';

		$("ul.controls_section:eq(0)").before(xf_html);

		$("#xinbox_mass_edit_button").click(function() {

			if ($(this).parent().hasClass("xkit-selected") == false) {
			
				$(this).parent().addClass("xkit-selected");
				$(this).parent().addClass("selected");
				XKit.extensions.xinbox.start_mass_editor();
	
			} else {	

				$(this).parent().removeClass("xkit-selected");
				$(this).parent().removeClass("selected");
				XKit.extensions.xinbox.stop_mass_editor();

			}

		});

	},

	stop_mass_editor: function() {

		XKit.tools.remove_css("xinbox_mass_editor");
		$("#xinbox_mass_text").remove();
		$(document).off("click", ".post");

	},

	start_mass_editor: function() {


		var button_default = "No messages selected";
		var button_selected = "Delete %s Messages";
		var button_selected_first = "Delete 1 Message";
	
		XKit.tools.add_css(" #posts { padding: 0; margin: 0; } .xtimestamp { display: none; } .post_controls { display: none; }" +
				" .post:last-child { display: block; } #left_column { min-height: 120%; } " +
				" .post:active { position: relative; top: 1px; } " +
				" .post { -moz-user-select: none; user-select: none; -webkit-user-select: none; float: left !important; width: 160px !important; height: 130px !important; " + 
				"    opacity: 0.53; " + 
				"    display: inline-block !important; clear: none !important; overflow: hidden !important; " + 
				"    margin: 0px 4px 8px 4px !important; } " +
				" .fan_mail { display: none !important; } " +
				" #xkit_delete_selected:hover { background: rgba(255,255,255,0.12); cursor: pointer; } " +
				" #xkit_delete_selected.disabled { opacity: 0.5; cursor: default; " +
				" background: rgba(255,255,255,0.08) !important; top: 0 !important; } " +
				" #xkit_delete_selected:active { background: rgba(0,0,0,0.12); " +
				" box-shadow: inset 0px 1px 2px rgba(0,0,0,0.43); position: relative; top: 1px; } " +
				" #xkit_delete_selected { border: 1px solid rgba(0,0,0,0.32); border-radius: 6px; " +
				" box-shadow: inset 0px 1px 0px rgba(255,255,255,0.12), 0px 1px 0px rgba(255,255,255,0.12); " +
				" padding: 5px 15px; background: rgba(255,255,255,0.08); display: inline-block; margin-top: 5px;} " +
				" .post a { pointer-events: none; cursor: default; } " +
				" .post.xpost-selected { opacity: 1; } " +
				" .post.xpost-working { animation: xpost-working-ani 1s infinite; " + 
				" -webkit-animation: xpost-working-ani 1s infinite; " +
				" -webkit-animation: xpost-working-ani 1s infinite; } " +
				" @-moz-keyframes xpost-working-ani { from { opacity: 1; } 50% { opacity: 0.32; } to { opacity: 1; } } " +
				" @-webkit-keyframes xpost-working-ani { from { opacity: 1; } 50% { opacity: 0.32; } to { opacity: 1; } } ", "xinbox_mass_editor");

		$("#left_column").prepend("<div class=\"dashboard_options_form\" id=\"xinbox_mass_text\">" +
				"<b>Welcome to Mass Edit Mode.</b><br/>" +
				"Select the messages you want deleted and click the button below." +
				"<div style=\"margin-top: 8px;\">" + 
				"<div id=\"xkit_delete_selected\" class=\"disabled\">No messages selected</div>" +
				"</div></div>");

		$("#xkit_delete_selected").click(function() {

			if ($(this).hasClass("disabled") === true) {
				return;
			}

			$(this).addClass("disabled");

			var msg_count = 0;
			$(".xpost-selected").each(function() {
				msg_count++;
			});

			XKit.extensions.xinbox.delete_msg_count = msg_count;
			XKit.extensions.xinbox.delete_msg_index = 0;
			XKit.extensions.xinbox.mass_editor_working = true;

			var m_html = $("body").html();
			var m_key_start = m_html.indexOf("key = '", m_html.indexOf("deny_post(")) + 7;
			var m_key_end = m_html.indexOf("';", m_key_start);
			var m_key = m_html.substring(m_key_start, m_key_end);
		
			XKit.extensions.xinbox.delete_key = m_key
			XKit.extensions.xinbox.mass_editor_delete();

		});

		$(document).on("click", ".post", function(event) {
			if (XKit.extensions.xinbox.mass_editor_working === true) { return; }
			event.preventDefault();
			if ($(this).hasClass("xpost-selected") === true) {
				XKit.extensions.xinbox.selected_post_count = XKit.extensions.xinbox.selected_post_count - 1;
			} else {
				XKit.extensions.xinbox.selected_post_count++;
			}
			$(this).toggleClass("xpost-selected");
			if (XKit.extensions.xinbox.selected_post_count === 0) {
				$("#xkit_delete_selected").html(button_default);
				$("#xkit_delete_selected").addClass("disabled");
			} else {
				// English is a weird language, innit?
				$("#xkit_delete_selected").removeClass("disabled");
				if (XKit.extensions.xinbox.selected_post_count === 1) {
					$("#xkit_delete_selected").html(button_selected_first);
				} else {
					$("#xkit_delete_selected").html(button_selected.replace("%s", XKit.extensions.xinbox.selected_post_count));
				}
			}
		});


	},

	selected_post_count: 0,
	mass_editor_working: false,
	delete_msg_index: 0,
	delete_msg_count: 0,
	delete_key: "",

	mass_editor_delete: function() {

		var button_working = "Deleting message %s of %m";
		var current_msg = XKit.extensions.xinbox.delete_msg_index + 1;
		var msg_count = XKit.extensions.xinbox.delete_msg_count;

		var button_default = "No messages selected";

		if (current_msg > msg_count) {
			selected_post_count = 0;
			XKit.window.show("Done!","All messages deleted successfully.","info","<div id=\"xkit-close-message\" class=\"xkit-button default\">OK</div>");
			$("#xkit_delete_selected").html(button_default);
			$("#xkit_delete_selected").addClass("disabled");
			XKit.extensions.xinbox.mass_editor_working = false;
			return;
		}

		var m_key = XKit.extensions.xinbox.delete_key;
		$("#xkit_delete_selected").html(button_working.replace("%m", msg_count).replace("%s", current_msg));

		$(".xpost-selected:eq(0)").addClass("xpost-working");
		var m_id = $(".xpost-selected:eq(0)").attr('id').replace("post_","");

		setTimeout(function() {

		GM_xmlhttpRequest({
			method: "POST",
			url: "http://www.tumblr.com/deny_submission/",
			data: "form_key=" + m_key + "&pid=" + m_id,
			headers: {
					"Content-Type": "application/x-www-form-urlencoded"
			},
			onerror: function(response) {
				alert("XInbox can not fetch the required page:\n\n" + 
				"There might be a connection problem, or the extension might need updating.\n\n" +
				"Please try again later, and if the problem continues, disable XInbox from \n" +
				"the XKit Control Panel (X icon > XInbox > Disable this Extension) to answer\n" +
				"your asks while this problem is being fixed.");
			},
			onload: function(response) {
				XKit.extensions.xinbox.delete_msg_index = current_msg;
				var post_div = $(".xpost-selected:eq(0)");
				$(post_div).fadeOut('fast', function() { $(this).remove(); });
				setTimeout(function() { XKit.extensions.xinbox.mass_editor_delete(); }, 500);
			}
		});

		}, 700);

	},

	init_tags: function() {

		try { 
			$(document).on("click", "[id^='ask_answer_link_']", function() {
	
				var m_parent = $(this).parentsUntil(".post").parent();
				var post_id = $(m_parent).attr('id').replace("post_","");

				// Disable default buttons.
				var submit_button = $(m_parent).find('[id^="ask_publish_button_"]');
				$(submit_button).attr('onclick','return false;');
	
				var this_obj = m_parent;
				var m_box_id = "xinbox_tags_" + post_id;
			
				var asker = XKit.extensions.xinbox.preferences.anon_tag.value;
				var respondant = $(m_parent).attr('data-tumblelog-name');
				if (m_parent.find(".post_info").find("a").length > 0) {
					asker = m_parent.find(".post_info").find("a").html();

					// If the ask is anonymous there is no link to their blog to parse.
					// If the blog is secondary there will be a link to respondant's own blog
					// and this will be found instead. Reset asker to anoymous if this is the case.
					if(asker === respondant){
						asker = XKit.extensions.xinbox.preferences.anon_tag.value;
					}
				}
			
				$(submit_button).attr('onclick','');
				$(submit_button).bind("click",function(event) {
				
					event.preventDefault();
					var m_tags = $("#" + m_box_id).val();
				
					var tags_to_add = asker;
					if(XKit.extensions.xinbox.preferences.tag_usernames.value !== true) {
						tags_to_add = "";
					}
				
					if (m_tags !== "") {
						tags_to_add = tags_to_add + "," + m_tags;
					}

					if(XKit.extensions.xinbox.preferences.tag_custom.value === true) {
						if (XKit.extensions.xinbox.preferences.custom_tag.value !== "") {
							tags_to_add = tags_to_add + "," + XKit.extensions.xinbox.preferences.custom_tag.value;
						}
					}
				
					XKit.extensions.xinbox.poke_tinymce(post_id);
					setTimeout(function() {
						XKit.extensions.xinbox.publish_ask(this_obj, post_id, tags_to_add);
					}, 200);
				
				});
	
				$(m_parent).find(".xinbox_tag_box").remove();
	
				// Add our tag box here.
				var m_html = 	'<div class="xinbox_tag_box">' + 
						'<input class="xinbox_tag_box_input" id="' + m_box_id + '" ' +
							' placeholder="Tags, comma separated" />' +
						'</div>';
	
				if ($(m_parent).find(".private_answer_button").length > 0) {
					$(m_parent).find(".private_answer_button").after(m_html);
				} else {
					$(m_parent).find(".ask_publish_button").after(m_html);
				}

			});
	
		} catch(e) {
			XKit.notifications.add("<b>Can't run " + this.title + ":</b><br/>" + e.message, "error");
		}

	},

	publish_ask: function(post_div, post_id, tags) {
	
		XKit.extensions.xinbox.poke_tinymce(post_id);

		var answer = $('#ask_answer_field_' + post_id).val();

		if (answer === "") {
			// Check if the user really wants to post this.
			if (!confirm("XInbox is curious:\nYou didn't enter an answer. Send it anyway?")){
				return;
			}
		}
		
		var load_box = $('#post_control_loader_' + post_id);

		$(post_div).find('.xinbox_tag_box_input').attr('disabled','disabled');
		$(post_div).find('[id^="ask_publish_button_"]').attr('disabled','disabled');
		$(post_div).find('[id^="ask_cancel_button_"]').attr('disabled','disabled');
		$(post_div).find('[id^="ask_queue_button_"]').attr('disabled','disabled');
		$(post_div).find('[id^="ask_draft_button_"]').attr('disabled','disabled');
		$(post_div).find('[id^="private_answer_button_"]').attr('disabled','disabled');
		$(load_box).css("display","block");
	
		var form_key = $("body").attr('data-form-key');

		var m_object = new Object();
		
		m_object.post_id = parseInt(post_id);
		m_object.form_key = form_key;
		m_object.post_type = false;

		GM_xmlhttpRequest({
			method: "POST",
			url: "http://www.tumblr.com/svc/post/fetch",
			data: JSON.stringify(m_object),
			json: true,
			onerror: function(response) {
				XKit.extensions.xinbox.show_error("I was unable to reach Tumblr servers, or the server returned an error.");
				return;
			},
			onload: function(response) {
				// We are done!
				try {
					var mdata = $.parseJSON(response.responseText);
				} catch(e) {
					XKit.extensions.xinbox.show_error("Server returned a non-JSON object. Maybe server overloaded, try again later. Error: " + e.message);
					return;
				}
				if (mdata.errors === false) {
					XKit.extensions.xinbox.send_publish_request(mdata, answer, tags, post_div, form_key, post_id);
				} else {
					XKit.extensions.xinbox.show_error("Server returned an error message. Maybe you hit your post limit or your account was suspended.");
				}
			}
		});
	
	},

	send_publish_request: function(mdata, answer, tags, post_div, form_key, post_id) {
		
		var m_object = new Object;
		
		m_object.form_key = form_key;
		m_object.channel_id = mdata.post_tumblelog.name_or_id;
		
		m_object.post_id = post_id;
		m_object.edit = false;
		m_object.detached = true;
		m_object.errors = false;
		m_object.created_post = false;
		m_object.context_page = "dashboard";
		m_object.post_context_page = "dashboard";
		m_object.silent = false;
		m_object.context_id = "";
		m_object.editor_type = "rich";
		
		m_object["is_rich_text[one]"] = "0";
		m_object["is_rich_text[two]"] = "1";
		m_object["is_rich_text[three]"] = "0";
	
		m_object["post[type]"] = "note";
		m_object["post[slug]"] = "";
		m_object["post[date]"] = "";
		
		m_object["post[two]"] = answer;
		m_object["post[tags]"] = "," + tags;
		m_object["post[publish_on]"] = "";
		m_object["post[state]"] = "";
		
		GM_xmlhttpRequest({
			method: "POST",
			url: "http://www.tumblr.com/svc/post/update",
			data: JSON.stringify(m_object),
			json: true,
			onerror: function(response) {
				XKit.extensions.xinbox.show_error("I was unable to reach Tumblr servers, or the server returned an error.");
			},
			onload: function(response) {
				// We are done!
				try {
					var mdata = $.parseJSON(response.responseText);
				} catch(e) {
					XKit.extensions.xinbox.show_error("Server returned a non-JSON object. Maybe server overloaded, try again later. Error: " + e.message);
					return;
				}
				if (mdata.errors === false) {
					$(post_div).fadeOut('slow', function() {
						$(post_div).remove();
					});
					XKit.notifications.add("Published ask.","ok");
				} else {
					XKit.extensions.xinbox.show_error("Server returned an error message. Maybe you hit your post limit or your account was suspended.");
				}
			}
		});
	
	
	},

	show_error: function(msg) {

		XKit.window.show("Can't publish ask","Something went wrong and prevented XKit from publishing this ask. You might want to disable XInbox (or at least the tagging options of XInbox) if this is related to a recent Tumblr change.<br/><p>" + msg + "</p>Try refreshing the page and trying again, or disable XInbox extension and file a bug report.", "error", "<div id=\"xkit-close-message\" class=\"xkit-button default\">OK</div>");

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

	destroy: function() {
		$("#xinbox_sidebar").remove();
		$(document).off("click", "[id^='ask_answer_link_']");
		XKit.tools.remove_css("xkit_inbox_slim_fan_mail");
		XKit.tools.remove_css("xkit_inbox_hide_fan_mail_button");
		XKit.tools.remove_css("xinbox");
		this.running = false;
	}

});
