//* TITLE View On Dash **//
//* VERSION 0.3 REV C **//
//* DESCRIPTION View blogs on your dash **//
//* DEVELOPER STUDIOXENIX **//
//* DETAILS This is a preview version of an extension, missing most features due to legal/technical reasons for now. It lets you view the last 20 posts a person has made on their blogs right on your dashboard. If you have User Menus+ installed, you can also access it from their user menu under their avatar. **//
//* FRAME false **//
//* BETA false **//

XKit.extensions.view_on_dash = new Object({

	running: false,
	key: "vgXl8u0K1syFSAue6b9C7honIojHjC98i5WsBgSZ66HfqB0DKl",
	
	preferences: {
		"show_sidebar_button": {
			text: "Show View on Dash button on the sidebar",
			default: true,
			value: true
		}
	},

	run: function() {
		this.running = true;
		XKit.tools.init_css("view_on_dash");
		
		if (XKit.interface.where().queue === true) { return; }
		
		if (this.preferences.show_sidebar_button.value === true) {
		
			if ($(".account_header").length > 0) {
				xf_html = '<ul class="controls_section" id="view_on_dash_ul">' + 
					'<li class="section_header selected">VIEW BLOGS</li>' +
					'<li class="no_push"><a href="#" onclick="return false;" id="view_on_dash_button">' +
						'<div class="hide_overflow">View on Dash<span class="sub_control link_arrow arrow_right"></span></div>' +
					'</a></li></ul>';
				$("ul.controls_section:eq(1)").before(xf_html);	
			}
		
			$("#view_on_dash_ul").click(function() {
		
				XKit.window.show("View on Dash","Enter the username of the blog you would like to view <input type=\"text\" maxlength=\"50\" placeholder=\"Enter a URL (example: xkit-extension)\" class=\"xkit-textbox\" id=\"xkit-view-on-dash-input-url\">", "question", "<div class=\"xkit-button default\" id=\"xkit-view-on-dash-ok\">Go!</div><div class=\"xkit-button\" id=\"xkit-close-message\">Cancel</div>");	
			
				$("#xkit-view-on-dash-ok").click(function() {
				
					to_add = $("#xkit-view-on-dash-input-url").val().toLowerCase();
				
					if ($.trim(to_add) === "") {
						XKit.window.close();
						return;
					}

					if (/^[a-zA-Z0-9\-]+$/.test(to_add) === false) {
						alert("Invalid username");
						return;
					}	
				
					XKit.window.close();
					XKit.extensions.view_on_dash.view(to_add);
				
				
				});
			
			});
		
		}
		
		if (typeof XKit.extensions.show_more !== "undefined") {

			setTimeout(function() {
			
				if (XKit.extensions.show_more.running === true) {
	
                			if (XKit.extensions.show_more.preferences.use_classic_menu.value === true) {

                				XKit.extensions.show_more.add_custom_menu("view_on_dash", function(data) {
                			
                					console.log(data);
                					var user_url = data.name;
                					
							$(document).off("click", ".xkit-view_on_dash-button-" + user_url, XKit.extensions.view_on_dash.menu_clicked);
							$(document).on("click", ".xkit-view_on_dash-button-" + user_url, XKit.extensions.view_on_dash.menu_clicked);
		
							return "<div data-url=\"" + user_url + "\" class=\"xkit-view_on_dash-button-" + user_url + " xkit-view-on-dashboard\">View on Dash</div>";		

                				});	
                			
                			} else {
                				
                				XKit.extensions.show_more.add_custom_menu("view_on_dash", function(data) {
                				
                					//console.log("******************************");
                					//console.log(data);
                					//console.log("******************************");
                					var user_url = data.name;
                					
							$(document).off("click", ".xkit-view_on_dash-button-" + user_url, XKit.extensions.view_on_dash.menu_clicked);
							$(document).on("click", ".xkit-view_on_dash-button-" + user_url, XKit.extensions.view_on_dash.menu_clicked);
							
							return "<li>" +
                						"<a data-url=\"" + user_url + "\" class=\"xkit-view_on_dash-button-" + user_url + " xkit-view-on-dashboard xkit-new-menu-fix\">" +
                							"<span class=\"hide_overflow\">View On Dash</span>" +
                						"</a>" +
                			 		 "</li>";	

                				});	
                			
                			}
		
				}
			 
			}, 2000);
			
		}
		
	},
	
	menu_clicked: function(e) {
		
		var m_object = $(e.target);

		if (!m_object.hasClass("xkit-view-on-dashboard")) {

			while (!m_object.hasClass("xkit-view-on-dashboard")) {
				m_object = m_object.parent();
			}			
			
		}
		
		$(".tumblelog_popover_glass").trigger('click');
		setTimeout(function() { $(".tumblelog_popover_glass").trigger('click'); }, 10);
		$(".popover").hide();
		XKit.extensions.show_more.hide_classic_menu();
		
		var user_url = $(m_object).attr('data-url');	
		
		XKit.extensions.view_on_dash.view(user_url);
		
	},
	
	show_error: function(message) {
	
		$("#view-on-dash-content").fadeOut('fast');
		$("#view-on-dash-background").fadeOut('slow', function() {
				
			$("#view-on-dash-content").remove();
			$("#view-on-dash-background").remove();
				
		});	

		XKit.window.show("View on Dash encountered an error", message, "error", "<div class=\"xkit-button default\" id=\"xkit-close-message\">OK</div>");	
		
	},
	
	get_photo: function(data, index, width) {
		
		for (var i=0;i<data.photos[index].alt_sizes.length;i++) {
			if (parseInt(data.photos[index].alt_sizes[i].width) === parseInt(width)) {	
				return data.photos[index].alt_sizes[i].url;
			}
		}	
		
		return data.photos[index].alt_sizes[0].url;
		
	},
	
	parse_item: function(data, username) {
		
		console.log(data);
		
		var m_html = "<li class=\"post_container\">";
		var post_class = "";
		var additional_classes_for_post = "";
		
		var post_tags = "";
		var post_contents = "";
		

		if (data.type === "text") { 
		
			post_class = "is_regular"; 
		
			if (data.title !== "" && data.title !== null) {
				post_contents = post_contents + "<div class=\"post_title\">" + data.title + "</div>";
			}
		
			if (data.body !== "" && data.body !== null) {
				post_contents = post_contents + "<div class=\"post_body\">" + data.body + "</div>";
			}
			
		}
		
		if (data.type === "quote") { 
		
			post_class = "is_quote"; 
		
			if (data["text"] !== "" && data["text"] !== null) {
				post_contents = post_contents + '<div class="post_title medium"><span class="quote">' + data["text"] + '</span></div>';
			}
		
			if (data["source"] !== "" && data["source"] !== null) {
				post_contents = post_contents + '<div class="post_body"><table class="quote_source_table"><tbody><tr><td valign="top" class="quote_source_mdash">&nbsp;</td><td valign="top" class="quote_source">' + data.source + '</td></tr></tbody></table></div>';
			}
			
		}
		
		if (data.type === "link") { 
		
			post_class = "is_link"; 
		
			post_contents = post_contents + '<div class="post_media"><div class="link_button clickable"><div class="link_thumbnail_container"><a href="' + data.url + '" target="_blank" class="link_thumbnail_click"><img class="link_thumbnail" src="' + data.link_image + '" alt=""></a></div><div class="link_text_container"><div class="link_text_outer"><div class="link_text"><a href="' + data.url + '" target="_blank" class="link_title">' + data.title + '</a><a href="' + data.url + '" target="_blank" class="link_source">' + data.url + '</a></div></div></div></div></div>';
			
		}
		
		if (data.type === "answer") { 
		
			post_class = "is_note"; 
		
			post_contents = post_contents + '<div class="post_body"><div class="note_item"><div class="text"><p class="asker"><span class="name">' + data.asking_name + '</span><span>&nbsp;asked:</span></p><p>' + data.question + '</p></div><div class="nipple"></div></div><div class="avatar"><img src="http://assets.tumblr.com/images/anonymous_avatar_96.gif" alt="" width="40" height="40"></div><div class="answer post_info">' + data.answer + '</div></div>';
			
		}
		
		if (data.type === "audio" ||data.type === "video") { 
		
			post_class = "is_unsupported"; 

			var m_post_inner_html = '<div class="view-on-dash-not-supported">' + data.type + ' posts are not currently supported.</div>';	
			
			post_contents = post_contents + "<div class=\"post_media\">" + m_post_inner_html + "</div>";
			
			if (data["caption"] !== "" && data["caption"] !== null) {
				post_contents = post_contents + "<div class=\"post_body\">" + data["caption"] + "</div>";
			}
			
		}
		
		if (data.type === "photo") { 
		
			post_class = "is_photo"; 
			
			//var m_post_inner_html = '<img class="image" width="500" alt="" src="' + data["photo-url-500"] + '" data-thumbnail="' + data["photo-url-100"] + '">';
			
			if (data.photos.length === 1) { post_class = "is_photo"; }else {post_class = "is_photoset"; }
			
			var m_post_inner_html = "";
			
			if (data.photos.length === 1) {
				
				m_post_inner_html = '<img class="image" width="500" alt="" src="' + XKit.extensions.view_on_dash.get_photo(data, 0, "500") + '" data-thumbnail="' + XKit.extensions.view_on_dash.get_photo(data, 0, "100") + '">';
				
			} else {
			
				m_post_inner_html = '<div class="view-on-dash-not-supported">Photosets are not currently supported.</div>';	
				
			}
			
			post_contents = post_contents + "<div class=\"post_media\">" + m_post_inner_html + "</div>";
			
			if (data["caption"] !== "" && data["caption"] !== null) {
				post_contents = post_contents + "<div class=\"post_body\">" + data["caption"] + "</div>";
			}
			
		}
		
		if (typeof data.tags !== "undefined") {
			
			post_tags = "<div class=\"post_tags\"><div class=\"post_tags_inner\">"
			
			for (var i=0;i<data.tags.length;i++) {
			
				var fixed_tag_url = XKit.tools.replace_all(data.tags[i], + " ", "-");
				post_tags = post_tags + "<a class=\"post_tag\" href=\"http://tumblr.com/tagged/" + fixed_tag_url + "\">#" + data.tags[i] + "</a>";
				
			}
			
			post_tags = post_tags + "</div></div>";	
			
		}
		
		var source_div = "";
		var reblog_div = "";
		
		if (data.source_url !== "" && typeof data.source_url !== "undefined") {
			
			source_div = '<div class="post_source"><a class="post_source_link" target="_blank" href="' + data.source_url + '" title="' + data.source_title + '">' + data.source_title + '</a><span class="post_source_name_prefix">Source: </span></div>';
			
		}
		
		if (data.reblogged_from_id !== "" && typeof data.reblogged_from_id !== "undefined") {
			
			reblog_div = '<span class="reblog_source"><span class="reblog_icon" title="' + username + ' reblogged ' + data.reblogged_from_name + '">reblogged</span><a target="_BLANK" title="' + data.reblogged_from_name + '" href="' + data.reblogged_from_url + '" style="">' + data.reblogged_from_name + '</a></span>';
			
		}
		
		m_html = m_html + "<div class=\"post post_full " + post_class + " same_user_as_last with_permalink no_source xkit_view_on_dash_post\" id=\"post_" + data.id + "\"  data-post-id='" + data.id + "' data-root-id='" + data.id + "' data-tumblelog-name='" + username + "' data-reblog-key='" + data.reblog_key + "' data-type='" + data.type + "'>" +
					"<div class=\"post_wrapper\">" + 
						"<div class=\"post_header\">" +
							"<div class=\"post_info\">" +
								"<a href=\"http://\">" + username + "</a>" +
								reblog_div +
							"</div>" +
							source_div +
						"</div>" +
						"<div class=\"post_content clearfix\">" +
							"<div class=\"post_content_inner clearfix\">" +
								"<div class=\"post_container\">" +
									post_contents +
								"</div>" +
							"</div>" +
						"</div>" +
						post_tags +
						"<div class=\"post_footer clearfix\">" +
							'<div class="post_notes"><div class="post_notes_inner"><div class="post_notes_label note_count"><span class="note_link_current">' + data.note_count + ' notes</span><div class="notes_outer_container popover popover_gradient nipple_on_left" style="display: none;"><div class="notes_container popover_inner"><div class="popover_scroll"><ol class="notes"></ol><div class="more_notes_link_container"><span class="notes_loading">Loading...</span><a class="more_notes_link" style="display:none;" data-next="" rel="nofollow" href="#">Show more notes</a></div></div></div></div></div></div></div>' +
							"<div class=\"post_controls\" role=\"toolbar\">" +
								"<div class=\"post_controls_inner\">" +
									"<a class=\"post_control reblog\" href=\"/reblog/" + data.id  + "/" + data["reblog-key"] + "?redirect_to=%2Fdashboard\"><span class=\"offscreen\">Reblog</span></a>" +
								"</div>" +
							"</div>" +
						"</div>" +
					"</div>" +
					"<a style=\"display: none; height: 0;\" class=\"post_permalink\" id=\"permalink_" + data.id + "\" href=\"" + data.url + "\" target=\"_blank\" title=\"View post - whatever\"></a>";
						
		//alert("<a style=\"display: none;\" class=\"post_permalink\" id=\"permalink_" + data.id + "\" href=\"" + data.url + "\" target=\"_blank\" title=\"View post - whatever\"></a>");
		m_html = m_html + "</div>";
		m_html = m_html + "</li>";

		//console.log(m_html);
		return m_html;
		
	},
	
	last_scroll_point: -1,
	
	render: function(obj) {
		
		return "<li class=\"post post_full\">yo.</li>";
		
	},
	
	view: function(username, offset, page) {
		
		$("#view-on-dash-background,#view-on-dash-content").remove();
		
		$("body").append("<div id=\"view-on-dash-background\">&nbsp;</div><div class=\"loading\" id=\"view-on-dash-content\">&nbsp;</div>");
		XKit.extensions.view_on_dash.last_scroll_point = $("body").scrollTop();
		
		$('html, body').animate({
    			scrollTop: 0
 		}, 500);	
 		
 		if (typeof offset === "undefined") { offset = 0; }
 		if (typeof page === "undefined") { page = 0; }
 		
		GM_xmlhttpRequest({
			method: "GET",
			url: "http://api.tumblr.com/v2/blog/" + username + ".tumblr.com/posts/?api_key=" + XKit.extensions.view_on_dash.key + "&reblog_info=true&offset=" + offset,
			json: false,
			onerror: function(response) {
				console.log("view-on-dash -> Error getting page.");
				XKit.extensions.view_on_dash.show_error("<b>Unable to get the blog information.</b><br/>Please try again later.<br/><br/>Error Code: VOD-230");
				return;
			},
			onload: function(response) {
				
				try {
					
					data = JSON.parse(response.responseText);
					$("#view-on-dash-content").removeClass("loading");
					
					var m_header = "<div id=\"view-on-dash-header\" data-username=\"" + username + "\" data-page=\"" + page + "\">" +
								"<img id=\"view-on-dash-avatar\" src=\"http://api.tumblr.com/v2/blog/" + username + ".tumblr.com/avatar/64\">" +
								"<div id=\"view-on-dash-title\">" + data.response.blog.title + "</div>" +
								"<div id=\"view-on-dash-username\">" + data.response.blog.name + "</div>" +
								"<a id=\"view-on-dash-open\" target=\"_BLANK\" href=\"http://" + username + ".tumblr.com\">Open</a>" +
								"<div id=\"view-on-dash-back\" class=\"disabled\">&nbsp;</div>" +
								"<div id=\"view-on-dash-forward\" class=\"disabled\">&nbsp;</div>" +
							"</div>";
					
					if (data.response.posts.length === 0) {
					
						$("#view-on-dash-content").html(m_header + "<div id=\"view-on-dash-no-posts\">No posts found.</div>");
						return;	
						
					}
					
					$("#view-on-dash-content").html(m_header + "<ol id=\"posts\" class=\"posts xkit-view-on-dash-ol\"></ol>");
					
					$("#view-on-dash-header").attr('data-total', data.response.blog.posts);
					
					for (var i=0;i<data.response.posts.length;i++) {
						
						$(".xkit-view-on-dash-ol").append(XKit.extensions.view_on_dash.parse_item(data.response.posts[i], username));
						
					}
					
					if (data.response.blog.posts > data.response.posts.length) {
					
						$("#view-on-dash-forward").removeClass("disabled");	
						
					}
					
					if (offset > 0) {
					
						$("#view-on-dash-back").removeClass("disabled");	
						
					}
					
					XKit.post_listener.run_callbacks();
					
					$("#view-on-dash-forward").click(function() {
						
						if ($(this).hasClass("disabled")) { return; }
						
						var page = parseInt($("#view-on-dash-header").attr('data-page')) + 1;	
						var username = $("#view-on-dash-header").attr('data-username');
						
						XKit.extensions.view_on_dash.view(username, (page * 20), page);
						
					});
					
					$("#view-on-dash-back").click(function() {
						
						if ($(this).hasClass("disabled")) { return; }
						
						var page = parseInt($("#view-on-dash-header").attr('data-page')) - 1;	
						var username = $("#view-on-dash-header").attr('data-username');
						
						XKit.extensions.view_on_dash.view(username, (page * 20), page);
						
					});
					
					$("#view-on-dash-background").click(function() {
			
						$("#view-on-dash-content").fadeOut('fast');
						$("#view-on-dash-background").fadeOut('slow', function() {
							
							try { 
							if (XKit.extensions.view_on_dash.last_scroll_point !== -1) {
								
								$('html, body').animate({
    									scrollTop: XKit.extensions.view_on_dash.last_scroll_point
 								}, 500);
								
							}
							} catch(e) {
								// meh.	
							}
							
							$("#view-on-dash-content").remove();
							$("#view-on-dash-background").remove();
				
						});
			
					});
					
				} catch(e) {
					console.log("view-on-dash -> Error parsing data. " + e.message);
					XKit.extensions.view_on_dash.show_error("<b>Unable to read JSON received from API calls.</b><br/>Please try again later.<br/><br/>Error Code: VOD-235");
					return;
				}

			}
		});	
		
	},
	
	view_old: function(username) {
		
		$("body").append("<div id=\"view-on-dash-background\">&nbsp;</div><div class=\"loading\" id=\"view-on-dash-content\">&nbsp;</div>");
		
		XKit.extensions.view_on_dash.last_scroll_point = $("body").scrollTop();
		
		$('html, body').animate({
    			scrollTop: 0
 		}, 500);	
		
		GM_xmlhttpRequest({
			method: "GET",
			url: "http://" + username + ".tumblr.com/api/read/json",
			json: false,
			onerror: function(response) {
				console.log("view-on-dash -> Error getting page.");
				XKit.extensions.view_on_dash.show_error("<b>Unable to get the blog information.</b><br/>Please try again later.<br/><br/>Error Code: VOD-230");
				return;
			},
			onload: function(response) {
				
				var data = response.responseText.substring(22, response.responseText.length - 2);
				
				try {
					
					data = JSON.parse(data);
					var do_continue_lads = true;
					var lad_count = -1;
					
					$("#view-on-dash-content").removeClass("loading");
					
					var m_header = "<div id=\"view-on-dash-header\">" +
								"<img id=\"view-on-dash-avatar\" src=\"http://api.tumblr.com/v2/blog/" + username + ".tumblr.com/avatar/64\">" +
								"<div id=\"view-on-dash-title\">" + data.tumblelog.title + "</div>" +
								"<div id=\"view-on-dash-username\">" + data.tumblelog.name + "</div>" +
								"<a id=\"view-on-dash-open\" target=\"_BLANK\" href=\"http://" + username + ".tumblr.com\">Open</a>" +
								"<div id=\"view-on-dash-back\" class=\"disabled\">&nbsp;</div>" +
								"<div id=\"view-on-dash-forward\" class=\"disabled\">&nbsp;</div>" +
							"</div>";
					
					$("#view-on-dash-content").html(m_header + "<ol id=\"posts\" class=\"posts xkit-view-on-dash-ol\"></div>");
					
					while (do_continue_lads) {
							
						lad_count++;
						if (lad_count >= 30) {break; }
						
						if (typeof data.posts[lad_count] !== "undefined") {
							$(".xkit-view-on-dash-ol").append(XKit.extensions.view_on_dash.parse_item(data.posts[lad_count], username));
						}
						
					}
					
					$("#view-on-dash-background").click(function() {
			
						$("#view-on-dash-content").fadeOut('fast');
						$("#view-on-dash-background").fadeOut('slow', function() {
							
							try { 
							if (XKit.extensions.view_on_dash.last_scroll_point !== -1) {
								
								$('html, body').animate({
    									scrollTop: XKit.extensions.view_on_dash.last_scroll_point
 								}, 500);
								
							}
							} catch(e) {
								// meh.	
							}
							
							$("#view-on-dash-content").remove();
							$("#view-on-dash-background").remove();
				
						});
			
					});
					
				} catch(e) {
					console.log("view-on-dash -> Error parsing data. " + e.message);
					XKit.extensions.view_on_dash.show_error("<b>Unable to read JSON received from API calls.</b><br/>Please try again later.<br/><br/>Error Code: VOD-235");
					return;
				}

			}
		});	
		
	},

	destroy: function() {
		this.running = false;
		$("#view_on_dash_ul").remove();
              	try {
              		XKit.extensions.show_more.remove_custom_menu("view_on_dash");		
              	} catch(e){
              		XKit.console.add("Can't remove custom menu, " + e.message);
              	}
	}

});