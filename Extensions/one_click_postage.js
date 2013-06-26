//* TITLE One-Click Postage **//
//* VERSION 2.0 REV E **//
//* DESCRIPTION Lets you easily reblog, draft and queue posts **//
//* DEVELOPER STUDIOXENIX **//
//* FRAME false **//
//* BETA false **//

XKit.extensions.one_click_postage = new Object({

	running: false,
	
	preferences: {
		"sep_1": {
			text: "Appearance",
			type: "separator",
		},
		"show_reverse_ui": {
			text: "Use the Reverse UI on the popup-window (window on top of reblog button)",
			default: true,
			value: true
		},
		"show_blog_selector": {
			text: "Show blog selector",
			default: true,
			value: true
		},
		"show_caption_remover": {
			text: "Show the Remove Caption button",
			default: true,
			value: true
		},
		"show_small_ui": {
			text: "Use the Slim User Interface on the pop-up window",
			default: false,
			value: false
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
		"sep_2": {
			text: "Tags",
			type: "separator",
		},
		"keep_tags": {
			text: "Keep original tags while reblogging using One-Click Postage",
			default: false,
			value: true
		},
		"keep_tags_dashboard": {
			text: "Keep original tags while reblogging manually (experimental)",
			default: false,
			value: true
		},
		"auto_tag": {
			text: "Auto-tag queued posts",
			default: false,
			value: true
		},
		"auto_tag_text": {
			text:  "Tags for queued posts (comma separated)",
			type: "text",
			default: "",
			value: ""
		}
	},
	
	last_object: new Object(),
	last_icon_object: new Object(),
	last_post_id: 0,
	user_on_box: false,
	menu_closer_int: 0,
	default_blog_id: "",

	run: function() {
	
		/*XKit.extensions.one_click_postage.previous_div_id = "";*/
		XKit.tools.init_css("one_click_postage");
		
		if (this.preferences.keep_tags_dashboard.value === true) {
			this.init_keep_tags_dashboard();	
		}
		
		if (this.preferences.show_small_ui.value === true) {
		
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

		$(document).on("mouseover",".reblog_button,.post_control.reblog", function(event) {
			if ($(this).hasClass("radar_button") === true) {return; }
			clearTimeout(XKit.extensions.one_click_postage.menu_closer_int);
			XKit.extensions.one_click_postage.user_on_box = true;
			XKit.extensions.one_click_postage.open_menu($(this));
		});
		
		$(document).on("mouseout",".reblog_button,.post_control.reblog", function() {
			if ($(this).hasClass("radar_button") === true) {return; }
			XKit.extensions.one_click_postage.user_on_box = false;
			XKit.extensions.one_click_postage.close_menu($(this));
		});
		
		$(document).on("click",".reblog_button,.post_control.reblog", function() {
			XKit.extensions.one_click_postage.user_on_box = false;
			XKit.extensions.one_click_postage.close_menu($(this), true);
		});
		
		$(document).on("mouseover","#x1cpostage_box", function() {
			clearTimeout(XKit.extensions.one_click_postage.menu_closer_int);
			XKit.extensions.one_click_postage.user_on_box = true;
		});
		
		$(document).on("mouseout","#x1cpostage_box", function() {
			XKit.extensions.one_click_postage.user_on_box = false;
			XKit.extensions.one_click_postage.close_menu($(this));
		});
		
		$("#x1cpostage_tags").bind("keydown", function(event) {
			event.stopPropagation();
			event.stopImmediatePropagation();
		});

		$("#x1cpostage_caption").bind("keydown", function(event) {
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
			XKit.extensions.one_click_postage.post(0);
		});
		
		$("#x1cpostage_queue").click(function() {
			XKit.extensions.one_click_postage.post(2);
		});
		
		$("#x1cpostage_draft").click(function() {
			XKit.extensions.one_click_postage.post(1);
		});
	},
	destroy: function() {
		$(document).off('click', '.reblog_button,.post_control.reblog', XKit.extensions.one_click_postage.process_click);
		XKit.tools.remove_css("one_click_postage");
		XKit.tools.remove_css("x1cpostage_reverse_ui");
		$("#x1cpostage_box").remove();
		XKit.tools.remove_css("one_click_postage_slim");	
	},
	
	init_keep_tags_dashboard: function() {
	
		$(document).on('click', '.reblog_button,.post_control.reblog', XKit.extensions.one_click_postage.process_click);
		
	},
	
	process_click: function(e) {
	
		var parent_div = $(this).parent().parent();
		if ($(parent_div).find(".tag").length > 0) {
			var tags_text = "";
			$(parent_div).find(".tag").each(function() {
				if (tags_text === "") {
					tags_text = $(this).html().replace("#","");
				} else {
					tags_text = tags_text + "," + $(this).html().replace("#","");
				}
			});
			if (tags_text !== "") {
				setTimeout(function() {		
					XKit.extensions.one_click_postage.try_to_inject_tags(tags_text);
				}, 200);
			}

		} else {
			
			// This is an ungodly-ugly hack. We should fix this.
			
			if ($(parent_div).parent().parent().find(".post_tag").length > 0) {
				var tags_text = "";
				$(parent_div).parent().parent().find(".post_tag").each(function() {
					if (tags_text === "") {
						tags_text = $(this).html().replace("#","");
					} else {
						tags_text = tags_text + "," + $(this).html().replace("#","");
					}
				});
				if (tags_text !== "") {
					setTimeout(function() {		
						XKit.extensions.one_click_postage.try_to_inject_tags(tags_text);
					}, 200);
				}
			}
			
		}

	},
	
	try_to_inject_tags: function(to_add) {
	
		if($("#post_content").length <= 0) {
			setTimeout(function() {		
				XKit.extensions.one_click_postage.try_to_inject_tags(to_add);
			}, 200);
			return;
		}

		var add_tag = "";
		var xas;
		var xae;
		var last_point = 0;
		var do_tags = true;
		var tag_to_be_added = "";
		var tags = to_add.split(",");
		for (i=0;i<tags.length;i++) {
			tag_to_be_added = tags[i];
			var old_tags = $("#post_content").find(".tags").find(".post_tags").val();
			$("#post_content").find(".tags").find(".post_tags").val(old_tags + "," + tag_to_be_added);
			$("#post_content").find(".tags").find(".editor_wrapper").before('<span class="tag">' + tag_to_be_added + '</span>');
		}
		$("#post_tags_label").css('display','none');
		$("#post_tags").val(to_add);
		
	},
	
	open_menu: function(obj) {
		
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
		
		// Keep tags patch.
		if (XKit.extensions.one_click_postage.preferences.keep_tags.value === true) {
			if ($(parent_box).find(".tag").length > 0) {
				var tags_text = "";
				$(parent_box).find(".tag").each(function() {
					if (tags_text === "") {
						tags_text = $(this).html().replace("#","");
					} else {
						tags_text = tags_text + "," + $(this).html().replace("#","");
					}
				});
				if(window.location.pathname.indexOf("tagged/") != -1){
					if(tags_text != ""){ tags_text += ","; }
					tags_text += $("#search_query").val();
				}
				if (tags_text !== "") {
					$("#x1cpostage_tags").val(tags_text);
				}
			} else {
			
				if ($(parent_box).find(".post_tag").length > 0) {
					var tags_text = "";
					$(parent_box).find(".post_tag").each(function() {
						if (tags_text === "") {
							tags_text = $(this).html().replace("#","");
						} else {
							tags_text = tags_text + "," + $(this).html().replace("#","");
						}
					});
					if(window.location.pathname.indexOf("tagged/") != -1){
						if(tags_text != ""){ tags_text += ","; }
						tags_text += $("#search_query").val();
					}
					if (tags_text !== "") {
						$("#x1cpostage_tags").val(tags_text);
					}
				}	
				
			}
		}
		
		$(obj).attr('title','');
		/*XKit.extensions.one_click_postage.previous_div_id = box_id;*/
		
		// Determine where we are going to show the box.
		var offset = $(obj).offset();

		// Box position
		
		var box_left = offset.left - ($("#x1cpostage_box").width() / 2) + 10;
		var box_top = offset.top + 30;
		
		if (XKit.extensions.one_click_postage.preferences.show_reverse_ui.value === true) {
		
			box_top = (offset.top - $("#x1cpostage_box").height()) - 5;	
			
		}

		$("#x1cpostage_box").css("top", box_top + "px");
		$("#x1cpostage_box").css("left", box_left + "px");
		
		if (XKit.extensions.one_click_postage.preferences.show_reverse_ui.value === true) {
			$("#x1cpostage_box").fadeIn('fast');
		} else {
			$("#x1cpostage_box").slideDown('fast');
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
	post: function(state) {
		if (XKit.extensions.one_click_postage.preferences.show_reverse_ui.value === true) {
			$("#x1cpostage_box").fadeOut('fast');
		} else {
			$("#x1cpostage_box").slideUp('fast');
		}
		var post_id = $(XKit.extensions.one_click_postage.last_object).attr('data-post-id');
		var form_key = $("body").attr('data-form-key');
		var reblog_key = $(XKit.extensions.one_click_postage.last_object).attr('data-reblog-key');
		var post_type = $(XKit.extensions.one_click_postage.last_object).attr('data-type');

		var m_object = new Object();
		
		m_object.reblog_id = parseInt(post_id);
		m_object.reblog_key = reblog_key;
		m_object.form_key = form_key;
		m_object.post_type = post_type;

		var blog_id = XKit.extensions.one_click_postage.default_blog_id;
		if ($("#x1cpostage_blog").length > 0) {
			blog_id = $("#x1cpostage_blog").val();
		}
		
		$(XKit.extensions.one_click_postage.last_object).find(".reblog_button, .post_control.reblog").addClass("xkit-one-click-reblog-working");
		
		var m_button = $(XKit.extensions.one_click_postage.last_object).find(".reblog_button, .post_control.reblog");
		var caption = $("#x1cpostage_caption").val();
		var tags = $("#x1cpostage_tags").val();

		GM_xmlhttpRequest({
			method: "POST",
			url: "http://www.tumblr.com/svc/post/fetch",
			data: JSON.stringify(m_object),
			json: true,
			onerror: function(response) {
				
				if (response.status === 401) {
					//xkit_error(XKit.language.one_click_postage.status_error_title, XKit.language.generic_errors.unauthorized);
					XKit.window.show("Unable to process request","Please check that you have not used today's posting limit and your queue is not full (the limit is 301) and send me an ask if this continues.<br/><br/>The error code to report is <b>OCP99</b>. Thank you.","error","<div class=\"xkit-button default\" id=\"xkit-close-message\">OK</div><a href=\"http://xkit-extension.tumblr.com/ask\" class=\"xkit-button\">Send an ask</a>");
				} else {
					if (response.status === 404) {
						XKit.window.show("Unable to process request","Looks like this post was removed by the user.","error","<div class=\"xkit-button default\" id=\"xkit-close-message\">OK</div>");
					//	xkit_error(XKit.language.one_click_postage.status_error_title, XKit.language.generic_errors.notfound);
					} else {
					//	xkit_error(XKit.language.one_click_postage.status_error_title, XKit.language.generic_errors.cant_reach);
						if (retry_mode !== true) {
							XKit.extensions.one_click_postage.process(data, state, form_key, "", post_id, caption, tags, reblog_key, m_button, true);
						} else {
							XKit.window.show("Unable to process request","Please check that you have not used today's posting limit and your queue is not full (the limit is 301) and send me an ask if this continues.<br/><br/>The error code to report is <b>OCP43-" + response.status + "</b>. Thank you.","error","<div class=\"xkit-button default\" id=\"xkit-close-message\">OK</div><a href=\"http://xkit-extension.tumblr.com/ask\" class=\"xkit-button\">Send an ask</a>");
						}
					}
				}
				
				//xkit_error(XKit.language.one_click_postage.status_error_title, XKit.language.generic_errors.cant_reach);
				//XKit.window.show("Unable to process request","Please check that you have not used today's posting limit and your queue is not full (the limit is 301) and send me an ask if this continues.<br/><br/>The error code to report is <b>OCP11</b>. Thank you.","error","<div class=\"xkit-button default\" id=\"xkit-close-message\">OK</div><a href=\"http://xkit-extension.tumblr.com/ask\" class=\"xkit-button\">Send an ask</a>");
				$(m_button).removeClass("xkit-one-click-reblog-working");
				return;
			},
			onload: function(response) {
				// We are done!
				try {
					var mdata = jQuery.parseJSON(response.responseText);
				} catch(e) {
					//xkit_error(XKit.language.one_click_postage.status_error_title, XKit.language.generic_errors.not_json);
					XKit.window.show("Unable to process request","Please check that you have not used today's posting limit and your queue is not full (the limit is 301) and send me an ask if this continues.<br/><br/>The error code to report is <b>OCP01</b>. Thank you.","error","<div class=\"xkit-button default\" id=\"xkit-close-message\">OK</div><a href=\"http://xkit-extension.tumblr.com/ask\" class=\"xkit-button\">Send an ask</a>");
					$(m_button).removeClass("xkit-one-click-reblog-working");
					return;
				}
				if (mdata.errors === false) {
					XKit.extensions.one_click_postage.process(mdata, state, form_key, blog_id, post_id, caption, tags, reblog_key, m_button);
				} else {
					XKit.window.show("Unable to process request","Please check that you have not used today's posting limit and your queue is not full (the limit is 301) and send me an ask if this continues.<br/><br/>The error code to report is <b>OCP02</b>. Thank you.","error","<div class=\"xkit-button default\" id=\"xkit-close-message\">OK</div><a href=\"http://xkit-extension.tumblr.com/ask\" class=\"xkit-button\">Send an ask</a>");
					//xkit_error(XKit.language.one_click_postage.status_error_title, XKit.language.generic_errors.server_error);
					$(m_button).removeClass("xkit-one-click-reblog-working");
				}
			}
		});
		
	},
	process: function(data, state, form_key, blog_id, post_id, caption, tags, reblog_key, m_button, retry_mode) {

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

		if (typeof data.post.two === "undefined") {
			data.post.two = "";
		}
		
		if ($("#x1cpostage_caption").hasClass("x1cpostage_remove_caption_on") === true) {
		
			// User wishes to remove caption.
			m_object["post[two]"] = "";
			
		} else {
			
			if (caption !== "" && typeof caption !== "undefined") {
				if ($("#x1cpostage_replace").hasClass("selected") === false) {
					m_object["post[two]"] = data.post.two + "<p>" + caption + "</p>";
				} else {
					m_object["post[two]"] = caption;
				}
			} else {
				m_object["post[two]"] = data.post.two;
			}
			
		}

		
		if (tags !== "" && typeof tags !== "undefined") {
			m_object["post[tags]"] = tags;
		} else {
			m_object["post[tags]"] = "";
		}
		
		if (state === 2) {
			if (this.preferences.auto_tag.value === true && this.preferences.auto_tag_text.value !== "") {
				m_object["post[tags]"] = m_object["post[tags]"] + "," + this.preferences.auto_tag_text.value;
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
					//xkit_error(XKit.language.one_click_postage.status_error_title, XKit.language.generic_errors.unauthorized);
					// XKit.window.show("Unable to process request","Please check that you have not used today's posting limit and your queue is not full (the limit is 301) and send me an ask if this continues.<br/><br/>The error code to report is <b>OCP42</b>. Thank you.","error","<div class=\"xkit-button default\" id=\"xkit-close-message\">OK</div><a href=\"http://xkit-extension.tumblr.com/ask\" class=\"xkit-button\">Send an ask</a>");
					XKit.extensions.one_click_postage.process(data, state, form_key, "", post_id, caption, tags, reblog_key, m_button, true);
				} else {
					if (response.status === 404) {
						XKit.window.show("Unable to process request","Looks like this post was removed by the user.","error","<div class=\"xkit-button default\" id=\"xkit-close-message\">OK</div>");
					//	xkit_error(XKit.language.one_click_postage.status_error_title, XKit.language.generic_errors.notfound);
					} else {
					//	xkit_error(XKit.language.one_click_postage.status_error_title, XKit.language.generic_errors.cant_reach);
						if (retry_mode !== true) {
							XKit.extensions.one_click_postage.process(data, state, form_key, "", post_id, caption, tags, reblog_key, m_button, true);
						} else {
							XKit.window.show("Unable to process request","Please check that you have not used today's posting limit and your queue is not full (the limit is 301) and send me an ask if this continues.<br/><br/>The error code to report is <b>OCP43-" + response.status + "</b>. Thank you.","error","<div class=\"xkit-button default\" id=\"xkit-close-message\">OK</div><a href=\"http://xkit-extension.tumblr.com/ask\" class=\"xkit-button\">Send an ask</a>");
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
					XKit.window.show("Unable to process request","Please check that you have not used today's posting limit and your queue is not full (the limit is 301) and send me an ask if this continues.<br/><br/>The error code to report is <b>OCP03</b>. Thank you.","error","<div class=\"xkit-button default\" id=\"xkit-close-message\">OK</div><a href=\"http://xkit-extension.tumblr.com/ask\" class=\"xkit-button\">Send an ask</a>");
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
						if (XKit.extensions.one_click_postage.preferences.dim_posts_after_reblog.value === true) {
							$(m_button).addClass("xkit-one-click-reblog-done");
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
					XKit.window.show("Unable to process request","Please check that you have not used today's posting limit and your queue is not full (the limit is 301) and send me an ask if this continues.<br/><br/>The error code to report is <b>OCP04<br/>" + m_error + "</b>. Thank you.","error","<div class=\"xkit-button default\" id=\"xkit-close-message\">OK</div><a href=\"http://xkit-extension.tumblr.com/ask\" class=\"xkit-button\">Send an ask</a>");
					$(m_button).removeClass("xkit-one-click-reblog-working");
				}
			}
		});
	
	}
	
});