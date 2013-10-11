//* TITLE Blacklist **//
//* VERSION 2.5 REV C **//
//* DESCRIPTION Clean your dash **//
//* DETAILS This extension allows you to block posts based on the words you specify. If a post has the text you've written in the post itself or it's tags, it will be replaced by a warning, or won't be shown on your dashboard, depending on your settings. **//
//* DEVELOPER STUDIOXENIX **//
//* FRAME false **//
//* BETA false **//
//* SLOW true **//

XKit.extensions.blacklist = new Object({

	running: false,
	slow: true,
	
	control_panel_div: "",

	preferences: {
		"sep0": {
			text: "User interface options",
			type: "separator"
		},
		"shortcut": {
			text: "Enable alt + B shortcut for adding new words",
			default: false,
			value: false
		},
		"right_click": {
			text: "Enable alt + click on highlighted text to add words (experimental)",
			default: false,
			value: false
		},
		"mini_block": {
			text: "Enable mini-UI for blocked posts",
			default: false,
			value: false
		},
		"sep1": {
			text: "Blacklisting options",
			type: "separator"
		},
		"dont_display": {
			text: "Don't display blocked posts at all (not recommended)",
			default: false,
			value: false
		},
		"check_authors": {
			text: "Check author blog titles and usernames for blacklisted words",
			default: true,
			value: true
		},
		"dont_block_me": {
			text: "Don't block my own posts",
			default: true,
			value: true
		},
		"dont_block_liked": {
			text: "Don't block posts I've liked or replied to",
			default: false,
			value: false
		},
		"dont_show_cause": {
			text: "Don't show why the post was blocked",
			default: false,
			value: false
		},
		"use_improved": {
			text: "Use improved checking (might slow down your computer)",
			default: true,
			value: true
		},
		"sep1": {
			text: "Appearance options",
			type: "separator"
		},
		"show_tags": {
			text: "Show tags on blocked posts",
			default: false,
			value: false
		},
		"sep2": {
			text: "Blacklisted Words",
			type: "separator"
		}
	},	
	
	blacklisted: new Array(),
	whitelisted: new Array(),

	run: function() {
		this.running = true;
		XKit.tools.init_css("blacklist");
		
		/*if ($("body").hasClass("dashboard_messages_inbox") === true || $("body").hasClass("dashboard_messages_submissions") === true) {
			return;	
		}*/
		
		var m_blacklist = XKit.storage.get("blacklist","words","").split(",");
		var m_whitelist = XKit.storage.get("blacklist","words_whitelisted","").split(",");
		
		if (m_blacklist !== "") {
			this.blacklisted = m_blacklist;	
		}
		
		if (m_blacklist !== "") {
			this.whitelisted = m_whitelist;	
		}
		
		if (this.preferences.shortcut.value === true) {
			
			$(document).on('keydown', XKit.extensions.blacklist.key_down);	
			
		}
		
		$(document).on('click', ".xblacklist_open_post", XKit.extensions.blacklist.unhide_post);
		
		if (this.preferences.mini_block.value === true) {
			
			var mini_ui = 	" .xblacklist_blacklisted_post .post_avatar, .xblacklist_blacklisted_post .post_permalink { display: none !important; } " +
					" .xblacklist_blacklisted_post .xblacklist_excuse { " +
						" position: absolute; top: 0; left: 0; width: 100%; " +
						" color: rgba(255,255,255,.43); height: 27px !important; padding: 0px; !important; " +
						" line-height: 27px !important; padding-left: 15px; !important; } " +
					" .xblacklist_blacklisted_post .post_content { " +
						" background: transparent; color: rgba(255,255,255,.43); } " +
					" .xblacklist_blacklisted_post:hover .xblacklist_open_post { display: block; } " +
					" .xblacklist_blacklisted_post .xblacklist_open_post { " +
						" display: none; " +
					" } " +
					" .xblacklist_blacklisted_post { " +
						" height: 40px !important; " +
						" opacity: 1 !important; padding: 0px !important; " + 
						" box-shadow: inset 0px 1px 0px rgba(255,255,255,0.10); " +
						" border: 1px solid rgba(0,0,0,0.28); background: rgba(255,255,255,0.06);" +
					" }";
			
			XKit.tools.add_css(mini_ui, "xkit_blacklist_mini_ui");
			
		}
		
		if ($(".post").length > 0) {
			XKit.post_listener.add("blacklist", XKit.extensions.blacklist.check);	
			XKit.extensions.blacklist.check();
			
			if (XKit.extensions.blacklist.preferences.right_click.value === true) {
				$(document).on('mouseup', XKit.extensions.blacklist.get_selection);
			}
			
		}
		
	},
	
	key_down: function(e) {
		if (e.altKey === true) {
			if (e.which === 66) {
				var m_div = "";
				if ($("#xkit-control-panel").length > 0) {
					// Control panel is open.	
					if (XKit.extensions.blacklist.control_panel_div !== "") {
						m_div = XKit.extensions.blacklist.control_panel_div;
					}
				}
				XKit.extensions.blacklist.show_add("", m_div, true);
			}
		}	
		
	},
	
	get_selection: function(e) {
		
		if( e.altKey != true ) { return; }
		
		var text = "";
		
		try {
			
		if (top.getSelection) {
        		text = top.getSelection().toString();
        	} else if (document.selection && document.selection.type != "Control") {
        		text = document.selection.createRange().text;
   		}
   		
   		} catch(e) {
   			console.log("ho");	
   		}
        	
        	if (text === "" ||typeof text === "undefined"){
        		return;	
        	}
        	
        	text = $.trim(text);
        	
        	XKit.extensions.blacklist.show_add(text, "");
		
	},
	
	import: function(m_div) {
		
		XKit.window.show("Import","<b>You can import settings from Tumblr Savior.</b><br/>Go to your Tumblr Savior's Save/Load panel and paste the text below to import your blacklisted/whitelisted words.<input type=\"text\" placeholder=\"Paste preferences text here.\" class=\"xkit-textbox\" id=\"xkit-blacklist-import-words\">","question","<div class=\"xkit-button default\" id=\"xkit-blacklist-add-words\">Import!</div><div class=\"xkit-button\" id=\"xkit-close-message\">Cancel</div>")
		
		$("#xkit-blacklist-replace-on-import").click(function() {
			$(this).toggleClass("selected");	
		});

		$("#xkit-blacklist-add-words").click(function() {
				
			var m_to_add = $("#xkit-blacklist-import-words").val();
			
			if (m_to_add === "" ||$.trim(m_to_add) === "") {
				XKit.window.close();
				return;	
			}
			
			try {
				
				var m_obj = JSON.parse(m_to_add);
				
			} catch(e) {
				alert("Invalid/Corrupt JSON object found.\nImport can not continue.");
				return;		
			}
			
			var supported_ver = "0.4.7";
			
			if (m_obj.version !== supported_ver) {
				alert("XKit Blacklist can only import words from version " + supported_ver + " of Tumblr Savior.");	
				return;
			}
			
			var blacklist_count = 0;
			if (typeof m_obj.listBlack === "object") {
				for (var i=0;i<m_obj.listBlack.length;i++) {
					var m_word = m_obj.listBlack[i];
					m_word = $.trim(m_word);
					if (m_word.indexOf(",") !== -1) {
						m_word = XKit.tools.replace_all(m_word, ",", "");	
					}
					if (m_word.indexOf("\\") !== -1) {
						m_word = XKit.tools.replace_all(m_word, "\\\\", "");	
					}
					if (m_word.length <= 3) {
						m_word = m_word + "*";
					}
					if (XKit.extensions.blacklist.check_if_exists(m_word) !== true) {
						XKit.extensions.blacklist.blacklisted.push(m_word);
						blacklist_count++;
					}
				}
			}
			
			var whitelist_count = 0;
			if (typeof m_obj.listWhite === "object") {
				for (var i=0;i<m_obj.listWhite.length;i++) {
					var m_word = m_obj.listWhite[i];
					m_word = $.trim(m_word);
					if (m_word.indexOf(",") !== -1) {
						m_word = XKit.tools.replace_all(m_word, ",", "");	
					}
					if (m_word.indexOf("\\") !== -1) {
						m_word = XKit.tools.replace_all(m_word, "\\\\", "");	
					}
					if (m_word.length <= 3) {
						m_word = m_word + "*";
					}
					if (XKit.extensions.blacklist.check_if_exists(m_word) !== true) {
						XKit.extensions.blacklist.whitelisted.push(m_word);
						whitelist_count++;
					}
				}
			}
			
			XKit.window.close();
			
			if (blacklist_count > 0 ||whitelist_count > 0) {
			
				XKit.window.show("Results",	"<b>Imported from version " +  supported_ver + " of Tumblr Savior.</b><br/>" +
								"Added <b>" + blacklist_count + "</b> new words to the blacklist.<br/>" +
						 		"Added <b>" + whitelist_count + "</b> new words to the whitelist.<br/><br/>Words that already exist in your list are not added. Your settings are not carried from Tumblr Savior, so you might want to check the settings to configure Blacklist to your liking.","info","<div id=\"xkit-close-message\" class=\"xkit-button default\">OK</div>");
				
				XKit.extensions.blacklist.save_blacklist();
				
			} else {
			
				XKit.window.show("Results", "<b>No words were imported.</b><br/>It might be possible that all the words in your import was already in your blacklist or the settings file was corrupt.", "info","<div id=\"xkit-close-message\" class=\"xkit-button default\">OK</div>");	
			
			}
			
			XKit.extensions.blacklist.cpanel(m_div);
			XKit.extensions.xkit_preferences.restart_extension("blacklist");
			
			/*if (typeof m_text === "undefined" || m_text === "") {
				XKit.extensions.blacklist.cpanel(m_div);
			} else {
				XKit.notifications.add("Added to blacklist.","ok");	
			}
			XKit.extensions.xkit_preferences.restart_extension("blacklist");
			*/
			
		});	
		
	},
	
	show_add: function(m_text, m_div, from_shortcut) {
		
		XKit.window.show("Add word to blacklist/whitelist","<b>Enter the word you want to add.</b><br/>Your words can not contain commas or backslashes.<input type=\"text\" maxlength=\"50\" placeholder=\"Enter a word here.\" class=\"xkit-textbox\" id=\"xkit-blacklist-word\"><div class=\"xkit-checkbox\" id=\"xkit-blacklist-add-to-whitelist\"><b>&nbsp;</b>Add to whitelist</div><br/>Before adding a word, please check \"Tips\" section.","question","<div class=\"xkit-button default\" id=\"xkit-blacklist-add-word\">Add word</div><div class=\"xkit-button\" id=\"xkit-close-message\">Cancel</div>")
		
		if (typeof m_text !== "undefined" && m_text !== "") {
			$("#xkit-blacklist-word").val(m_text);
		}
		
		$("#xkit-blacklist-add-to-whitelist").click(function() {
			$(this).toggleClass("selected");	
		});

		$("#xkit-blacklist-add-word").click(function() {
				
			var m_to_add = $("#xkit-blacklist-word").val();
			
			if (m_to_add === "" ||$.trim(m_to_add) === "") {
				XKit.window.close();
				return;	
			}
			
			if (m_to_add.indexOf(",") !== -1) {
				alert("The word(s) you enter can not have commas in it.");	
				return;
			}
			
			if (m_to_add.indexOf("\\") !== -1) {
				alert("The word(s) you enter can not have backslashes in it.");	
				return;
			}
			
			if (m_to_add.length <= 1) {
				alert("Words must be at least two characters.");
				return;	
			}

			if (XKit.extensions.blacklist.check_if_exists(m_to_add) === true) {
				alert("This word is already in the blacklist.");
				return;	
			}
			
			if (!$("#xkit-blacklist-add-to-whitelist").hasClass("selected")) {
			
				XKit.extensions.blacklist.blacklisted.push(m_to_add);
				XKit.extensions.blacklist.save_blacklist();
				
			} else {
				
				XKit.extensions.blacklist.whitelisted.push(m_to_add);
				XKit.extensions.blacklist.save_blacklist();
				
			}
			
			if ((typeof m_text === "undefined" || m_text === "") &&from_shortcut !== true) {
				XKit.extensions.blacklist.cpanel(m_div);
			} else {
				if (!$("#xkit-blacklist-add-to-whitelist").hasClass("selected")) {
					XKit.notifications.add("Added to blacklist.","ok");	
				} else {
					XKit.notifications.add("Added to whitelist.","ok");	
				}
			}
			
			XKit.extensions.xkit_preferences.restart_extension("blacklist");
			XKit.window.close();
			
		});	
		
	},
	
	check: function() {
		
		var height_changed = false;
		
		$(".post").not(".xblacklist-done").each(function() {
			
			try {
			
				// Check if it's something we should not touch.
				if ($(this).attr('id') === "new_post") { return; }
				//if ($(this).css("display") === "none") { return; }
			
				// $(this).css("background","green");
			
				// if has no text content, no need to do this.
				// if ($(this).find(".post_content").length <= 0 && $(this).find(".post_body").length <=0 &&) { $(this).css("background","blue"); return; }
			
				// Add class to not do this twice.
				$(this).addClass("xblacklist-done");
			
				// Collect the tags
				var tag_array = new Array();
				if ($(this).find(".post_tag").length > 0) {
					$(this).find(".post_tag").each(function() {
						tag_array.push($(this).html().replace("#","").toLowerCase());	
					});
				}
				if ($(this).find(".tag").length > 0) {
					$(this).find(".tag").each(function() {
						tag_array.push($(this).html().replace("#","").toLowerCase());	
					});
				}
				
				//alert(tag_array);
			
				// Collect the title contents too.
				var m_title = "";
				if ($(this).find(".post_title").length > 0) {
					m_title = $(this).find(".post_title").html();
				}
			
				// Collect the author info, if the option is toggled.
				if (XKit.extensions.blacklist.preferences.check_authors.value == true) {
					var m_author = "";
					if ($(this).find(".post_info_fence a").length > 0) {
						m_author = $(this).find(".post_info_fence a").html();
					}
				
					if ($(this).find(".reblog_source").length > 0) {
						m_author = m_author + " " + $(this).find(".reblog_source a").html();
					}
				
					if ($(this).find(".post_source_link").length > 0) {
						m_author = m_author + " " + $(this).find(".post_source_link").html();
					}
			
					var m_bTitle = "";
					if ($(this).find(".post_avatar_link").attr("title").length > 0) {
						m_bTitle = $(this).find(".post_avatar_link").attr('title');
					}	
				}
			
				// Collect the content.
				var m_content = "";
			
				if ($(this).find(".post_text_wrapper").length > 0) {
					m_content = $(this).find(".post_text_wrapper").html();	
				}
			
				if ($(this).find(".post_body").length > 0) {
					m_content = $(this).find(".post_body").html();	
				}
			
				if ($(this).find(".caption").length > 0) {
					m_content = $(this).find(".caption").html();
				}
			
				m_content = m_content + " " + m_title;
			
				if (XKit.extensions.blacklist.preferences.check_authors.value == true) {
					m_content = m_content + m_author;
				}
			
				m_content = XKit.tools.replace_all(m_content, "&nbsp;", " ");
				m_content = m_content.toLowerCase();
			
				// Strip HTML tags.
				m_content = m_content.replace(/<(?:.|\n)*?>/gm, '');

				var m_result = XKit.extensions.blacklist.do_post($(this), m_content, tag_array);
				if (m_result !== "") {
					height_changed = true;
					//$(this).css("background","red");
					XKit.extensions.blacklist.hide_post($(this), m_result);	
				} else {
					//$(this).css("background","green");	
				}
			
			} catch(e) {
			
				XKit.console.add("Can't parse post: " + e.message);
				// $(this).css("background","red");	
			
			}
			
		});
		
		if (height_changed) {
			setTimeout(function() {
				
			XKit.tools.add_function(function() {
				try {
					if (typeof Tumblr === "undefined") {
						setTimeout(function() {
						
							try {
								Tumblr.Events.trigger("DOMEventor:updateRect");
							} catch(e) {
								console.log("!!! XKit blacklist ---> " + e.message);	
							}	
							
						}, 1000);
					}else {
						Tumblr.Events.trigger("DOMEventor:updateRect");
					}
				} catch(e) {
					console.log("!!! XKit blacklist ---> " + e.message);	
				}
			}, true, "");
			
			}, 300);
		}
		
		setTimeout(function() { XKit.extensions.blacklist.check(); }, 2000);
		
	},
	
	unhide_post: function(e) {
			
		m_this = e.target;
		var m_div = $("#" + $(m_this).attr('data-post-id'));
		$(m_div).removeClass("xblacklist_blacklisted_post");
		$(m_div).find(".post_info").css("display","block");
		$(m_div).find(".post_controls").css("display","block");
		$(m_div).find(".post_footer_links").css('display','block');
		$(m_div).find(".post_source").css('display','block');
		$(m_div).find(".post_tags").css('display','block');
		$(m_div).find(".post_footer").css('display','table');
			
		$(m_div).find(".post_answer").css("display","block");
			
		if ($(m_div).hasClass("xkit-shorten-posts-shortened") === true) {
			$(m_div).find(".xkit-shorten-posts-embiggen").css("display","block");
			var pre_hidden_height = $(m_div).attr('data-xkit-blacklist-old-height');	
			$(m_div).css("height", pre_hidden_height);
		}
			
		$(m_div).find(".xblacklist_excuse").remove();
		$(m_div).find(".post_content").html($(m_div).find(".xblacklist_old_content").html());
		
	},
	
	hide_post: function(obj, word) {
		
		if (XKit.extensions.blacklist.preferences.dont_block_me.value === true) {
			if ($(obj).hasClass("is_mine") === true) {
				return;
			}
		}
		
		if (XKit.extensions.blacklist.preferences.dont_block_liked.value === true) {
			if ($(obj).find('.post_control.like.liked').length > 0) { return; }
			if ($(obj).find('.post_answer_input').attr ('readonly')) { return; }
		}
		
		if (XKit.extensions.blacklist.preferences.dont_display.value === true) {
			// Wow this user must hate the words they've added.
			$(obj).addClass("xblacklist_hidden_post");
			return;	
		}
		
		var old_content = '<div style="display: none;" class="xblacklist_old_content">' + 
					$(obj).find(".post_content").html() + '</div>';
					
		var block_excuse = '<div class="xblacklist_excuse">' +
					'Blocked because of the word "<b>' + word + '</b>"' +
					'<div data-post-id="' + $(obj).attr('id') + '" class="xblacklist_open_post xkit-button">Show it anyway</div></div>';

		if (XKit.extensions.blacklist.preferences.dont_show_cause.value === true) {
			block_excuse = '<div class="xblacklist_excuse">' +
					'Post blocked.' +
					'<div data-post-id="' + $(obj).attr('id') + '" class="xblacklist_open_post xkit-button">Show it anyway</div></div>';
		}

		$(obj).addClass("xblacklist_blacklisted_post");
		$(obj).find(".post_info").css("display","none");
		$(obj).find(".post_controls").css("display","none");
		$(obj).find(".post_content").html(old_content + block_excuse);
		$(obj).find(".post_footer_links").css('display','none');
		$(obj).find(".post_source").css('display','none');
		
		if (XKit.extensions.blacklist.preferences.show_tags.value === true) {
			$(obj).find(".post_footer").css('display','none');
		} else {
			$(obj).find(".post_tags, .post_footer").css('display','none');	
		}
		
		if ($(obj).hasClass("xkit-shorten-posts-shortened") === true) {
		
			// This was also shortened.
			$(obj).attr('data-xkit-blacklist-old-height', $(obj).css("height"));
			$(obj).css("height","auto");
			$(obj).find(".xkit-shorten-posts-embiggen").css("display","none");	
			
		}
		
		$(obj).find(".post_answer").css("display","none");
		
	},
	
	do_post: function(obj, post_content, tags) {
		
		// if ($.trim(post_content) === "") { return ""; }	
		post_content = post_content.replace(new RegExp('\n','g'), ' ');
		var p_words = post_content.split(" ");
		
		var new_array = new Array();
		
		for (var i=0;i<p_words.length;i++) {
		
			if ($.trim(p_words[i]) !== "") {
				new_array.push(p_words[i].toLowerCase());	
			}
			
		}
		
		/*var new_tags = new Array(); 
		
		for (var i=0;i<tags.length;i++) {
		
			if ($.trim(tags[i]) !== "") {
				new_tags.push(tags[i].toLowerCase());	
			}
			
		}*/
		
		console.log(tags);
		
		// $(obj).css("background","blue"); return;
		
		if (XKit.extensions.blacklist.check_for_whitelist(new_array, post_content, tags) !== "") {
			// $(obj).css("background","cyan");
			console.log("Skipping because of " + XKit.extensions.blacklist.check_for_whitelist(new_array, post_content, tags));
			return "";
		}

		// Return our findings.
		// $(obj).find(".post_info").html("tags: " + tags);
		
		return XKit.extensions.blacklist.check_for_blacklist(new_array, post_content, tags);
		
		
	},
	
	check_contents: function(to_use, p_words, post_content, tags) {
		
		for (var i=0;i<to_use.length;i++) {
			
			var m_word = to_use[i].toLowerCase();
			if ($.trim(m_word) === "") { continue; }
			
			//console.log("blacklist -> current word is \"" + m_word + "\"");
			
			var m_word_wildcard = false;
			
			if (m_word.substring(m_word.length - 1) === "*") {
				// This word is wildcarded!	
				m_word_wildcard = true;
				m_word = m_word.substring(0, m_word.length - 1);
			}
			
			if (m_word.indexOf(" ") !== -1) {
				m_word_wildcard = true;	
			}
			
			var m_p_words = new Array();
			var tag_search_mode = false;
			
			if (m_word.substring(0,1) === "#") {
				// console.log("blacklist -> checking tags only...");
				if (tags.length === 0) { return ""; }
				m_word = m_word.substring(1);
				tag_search_mode = true;
				m_p_words = tags;
			} else {
				// console.log("blacklist -> checking tags + content...");	
				m_p_words = p_words;
				m_p_words = m_p_words.concat(tags);
				//console.log(m_p_words);
			}

			var m_post_content = post_content;
			
			if (tag_search_mode) {
				m_post_content = tags.join(" ");	
			} else {
				m_post_content = m_post_content + tags.join(" ");
			}

			if (m_word_wildcard === false) {
				
				// Well this one is easy:
				
				// First lets strip the dots or commas.
				
				if (m_p_words.indexOf(m_word) !== -1) {
					// We've found the word!
					if (tag_search_mode) {
						return "#" + m_word;	
					} else {
						return m_word;	
					}
				} else {
					if (XKit.extensions.blacklist.preferences.use_improved.value === true) {
						// This will use some CPU...
						if (m_post_content.indexOf(m_word) !== -1) {
							// console.log('%c  found on m_post_content.', 'background: #a5edae; color: black');
							for (var m=0;m<m_p_words.length;m++) {
								if (m_p_words[m].indexOf(m_word) !== -1) {
									mp_word = m_p_words[m].replace(/\./g, '');
									mp_word = mp_word.replace(/\,/g, '');
									mp_word = mp_word.replace(/\u2026/g, '');
									mp_word = mp_word.replace(/[\.,-\/#!$%\^&\*;:{}=\-_`~()]/g,"").replace(/\s{2,}/g," ");
									//console.log('%c  mp_word = ' + mp_word, 'background: #a5edae; color: black');
									if (m_word === mp_word) {
										if (tag_search_mode) {
											return "#" + m_word;	
										} else {
											return m_word;	
										}
									}	
								}
							}	
						}
					}	
				}	
				
			} else {
				
				// Ugh. Wildcarded. This will
				// require some processing power.
				// To save CPU time, let's run it in the
				// post_content first, continue only if
				// we can find it there.
				if (m_post_content.indexOf(m_word) !== -1) {
					
					// Ugh. Even worse, we've found it,
					// now we need to get into a loop.
					for (var m=0;m<m_p_words.length;m++) {
						
						if (m_p_words[m] === "") { continue; }
						if (m_p_words[m].indexOf(m_word) !== -1) {
							if (tag_search_mode) {
								return "#" + m_word;	
							} else {
								return m_word;	
							}
						}
						
						if (m < m_p_words.length) {
							var tmp_word = m_p_words[m] + " " + m_p_words[m + 1];
							
							// This is a dirty fix but it should work for now.
							if (m_p_words[m + 2] !== "" || typeof m_p_words[m + 2] !== "undefined") {
								tmp_word = tmp_word + " " + m_p_words[m + 2];
							}
							if (m_p_words[m + 3] !== "" || typeof m_p_words[m + 3] !== "undefined") {
								tmp_word = tmp_word + " " + m_p_words[m + 3];
							}
							if (m_p_words[m + 4] !== "" || typeof m_p_words[m + 4] !== "undefined") {
								tmp_word = tmp_word + " " + m_p_words[m + 4];
							}
							if (m_p_words[m + 5] !== "" || typeof m_p_words[m + 5] !== "undefined") {
								tmp_word = tmp_word + " " + m_p_words[m + 5];
							}
							if (m_p_words[m + 6] !== "" || typeof m_p_words[m + 6] !== "undefined") {
								tmp_word = tmp_word + " " + m_p_words[m + 6];
							}
							
							tmp_word = tmp_word.replace(/\,/g, '').replace(/\u2026/g, '');
							tmp_word = tmp_word.replace(/[\.,-\/#!$%\^&\*;:{}=\-_`~()]/g,"").replace(/\s{2,}/g," ");
														
							console.log("--------- " + tmp_word);
							
							if (tmp_word.indexOf(m_word) !== -1) {
								if (tag_search_mode) {
									return "#" + m_word;	
								} else {
									return m_word;	
								}
							}
						}
							
					}
						
				}	
			}
			
		}	
		
		return "";
		
	},
	
	check_for_whitelist: function(p_words, post_content, tags) {
		
		return XKit.extensions.blacklist.check_contents(XKit.extensions.blacklist.whitelisted, p_words, post_content, tags);
		
	},
	
	check_for_blacklist: function(p_words, post_content, tags) {
		
		return XKit.extensions.blacklist.check_contents(XKit.extensions.blacklist.blacklisted, p_words, post_content, tags);
		
	},

	destroy: function() {
		this.running = false;
		$(".xblacklist-done").each(function() {
			$(this).removeClass("xblacklist_blacklisted_post");
			$(this).find(".post_info").css("display","block");
			$(this).find(".post_controls").css("display","block");
			$(this).find(".post_tags").css('display','block');
			$(this).find(".post_source").css('display','block');
			$(this).find(".post_footer").css('display','table');
			$(this).find(".post_footer_links").css('display','block');
			$(this).find(".post_answer").css("display","block");	
			$(this).find(".xblacklist_excuse").remove();
			$(this).find(".post_content").html($(this).find(".xblacklist_old_content").html());	
			$(this).find(".xkit-shorten-posts-embiggen").css("display","block");
		});	
		$(".xblacklist-done").removeClass("xblacklist-done");
		$(".xblacklist_hidden_post").removeClass("xblacklist_hidden_post");
		$(".xblacklist_blacklisted_post").removeClass("xblacklist_blacklisted_post");
		XKit.tools.remove_css("xkit_blacklist_mini_ui");
		XKit.tools.remove_css("blacklist");
	},
	
	create_blacklist_div: function(word, on_whitelist) {
		
		var m_classes = "xkit-blacklisted-word";
		if (on_whitelist === true) {
			m_classes = m_classes + " xkit-whitelisted-word";
		}
		
		var m_html = "<div class=\"" + m_classes + "\">" + word + "<div data-word=\"" + word + "\" class=\"xkit-blacklisted-word-delete\">&#10006;</div></div>";
		return m_html;
		
	},
	
	check_if_exists: function(word) {
		
		if (XKit.extensions.blacklist.blacklisted.indexOf(word) !== -1 || XKit.extensions.blacklist.whitelisted.indexOf(word) !== -1) {
			return true;
		} else {
			return false;
		}	
		
	},
	
	save_blacklist: function() {
	
		XKit.storage.set("blacklist","words",this.blacklisted.join(","));
		XKit.storage.set("blacklist","words_whitelisted",this.whitelisted.join(","));
		
	},
	
	cpanel: function(m_div) {
		
		XKit.extensions.blacklist.control_panel_div = m_div;
		
		if ($("#xkit-blacklist-custom-panel").length > 0) {
			// Panel already exists, probably in refresh mode.
			// Remove it first.
			$("#xkit-blacklist-custom-panel").remove();	
		}
		
		var m_html = "<div id=\"xkit-blacklist-custom-panel\"><div id=\"blacklist-toolbar\"><div id=\"blacklist-add-button\" class=\"xkit-button\">Add new word..</div><div id=\"blacklist-populate-common\" class=\"xkit-button\">Auto-Populate</div><div id=\"blacklist-tips\" class=\"xkit-button\">Tips</div><div id=\"blacklist-import\" class=\"xkit-button\">Import</div><div id=\"blacklist-delete-all\" class=\"xkit-button\">Delete All</div></div>"
		
		m_html = m_html + "<div id=\"blacklist-word-container\"><div id=\"blacklist-words\"><div class=\"blacklist-words-title\">Blacklisted Words</div>";
		if (XKit.extensions.blacklist.blacklisted.length <= 1) {
			m_html = m_html + "<div class=\"xkit-blacklist-none\"><b>You have no blacklisted words.</b></div>";		
		} else {
			for (i=0;i<XKit.extensions.blacklist.blacklisted.length;i++) {
				if (XKit.extensions.blacklist.blacklisted[i] !== "") {
					m_html = m_html + XKit.extensions.blacklist.create_blacklist_div(XKit.extensions.blacklist.blacklisted[i]);
				}	
			}
		}
		
		
		m_html = m_html + "</div><div id=\"whitelist-words\"><div class=\"blacklist-words-title\">Whitelisted Words</div>";
		
		if (XKit.extensions.blacklist.whitelisted.length <= 1) {
			m_html = m_html + "<div class=\"xkit-blacklist-none\"><b>You have no whitelisted words.</b></div>";	
		} else {
			for (i=0;i<XKit.extensions.blacklist.whitelisted.length;i++) {
				if (XKit.extensions.blacklist.whitelisted[i] !== "") {
					m_html = m_html + XKit.extensions.blacklist.create_blacklist_div(XKit.extensions.blacklist.whitelisted[i], true);
				}	
			}
		}
		
		m_html = m_html + "</div><div class=\"xkit-blacklist-clear\">&nbsp;</div></div>";
		
		$(m_div).append(m_html);
		
		$(".xkit-blacklisted-word-delete").unbind("click");
		$(".xkit-blacklisted-word-delete").click(function() {
		
			if ($(this).parent().hasClass("xkit-whitelisted-word")) {

				var m_index = XKit.extensions.blacklist.whitelisted.indexOf($(this).attr('data-word'));
				if (m_index === -1) { return; }
			
				XKit.extensions.blacklist.whitelisted.splice(m_index, 1);	
				XKit.extensions.blacklist.save_blacklist();
				XKit.extensions.xkit_preferences.restart_extension("blacklist");
				
				var m_box = $(this).parent();
				$(this).parent().slideUp('slow', function() {
					$(m_box).remove();
				});

			} else {
		
				var m_index = XKit.extensions.blacklist.blacklisted.indexOf($(this).attr('data-word'));
				if (m_index === -1) { return; }
			
				XKit.extensions.blacklist.blacklisted.splice(m_index, 1);	
				XKit.extensions.blacklist.save_blacklist();
				XKit.extensions.xkit_preferences.restart_extension("blacklist");
				
				var m_box = $(this).parent();
				$(this).parent().slideUp('slow', function() {
					$(m_box).remove();
				});
			
			}
			
		});
		
		$("#blacklist-tips").click(function(){
			
			XKit.window.show("A few tips on blacklisting","<ul class=\"xkit-blacklist-add-margins-to-ul\">" +
				"<li>You can add \"*\" at the end of a word to wildcard it.</li>" +
				"<li>Wildcarded words match words that begin with it: for example, \"cat*\" will find \"category\", \"capital\" etc.</li>" +
				"<li>If you add something that contains 2 or more words, it will be wildcarded automatically</li>" +
				"<li>Adding too much words, especially wildcard ones, will slow your computer down dramatically.</li>" +
				"</ul>","info","<div class=\"xkit-button\" id=\"xkit-close-message\">OK</div>");
			
		});
		
		$("#blacklist-delete-all").click(function() {
			
			XKit.window.show("Delete list","Delete all your blacklisted words?","question","<div class=\"xkit-button default\" id=\"xkit-blacklist-delete-all-continue\">Yes, delete my list.</div><div class=\"xkit-button\" id=\"xkit-close-message\">Cancel</div>");	
			
			$("#xkit-blacklist-delete-all-continue").click(function() {
				
				var m_array = new Array();
				
				XKit.extensions.blacklist.blacklisted = m_array;
				XKit.extensions.blacklist.whitelisted = m_array;
				XKit.extensions.blacklist.save_blacklist();
				XKit.window.close();
				XKit.extensions.blacklist.cpanel(m_div);
				XKit.extensions.xkit_preferences.restart_extension("blacklist");
				
			});	
			
		});
		
		$("#blacklist-populate-common").click(function() {
			
			XKit.window.show("Populate list","<b>This will <i>delete</i> your existing list and replace it with some of the most common blocked words.</b><br/><br/>Note that this list might be incomplete, so please check it twice and add the ones you feel missing before using it.","question","<div class=\"xkit-button default\" id=\"xkit-blacklist-populate-continue\">Yes, populate my list.</div><div class=\"xkit-button\" id=\"xkit-close-message\">Cancel</div>");	
			
			$("#xkit-blacklist-populate-continue").click(function() {
				
				var m_array = ["tw:*","nsfw","trigger*","porn*","naked","cut*","rape","sex*","gay*","lesbian*","nude*","ass*","horny*","xxx","adult","amateur","tit*","fuck*","boob*","cock","cunt","pussy*","anal*","hardcore"];
				
				XKit.extensions.blacklist.blacklisted = m_array;
				XKit.extensions.blacklist.save_blacklist();
				XKit.window.close();
				XKit.extensions.blacklist.cpanel(m_div);
				XKit.extensions.xkit_preferences.restart_extension("blacklist");
				
			});	
			
		});
		
		$("#blacklist-add-button").click(function() {
			
			XKit.extensions.blacklist.show_add("",m_div);
			
		});

		$("#blacklist-import").click(function() {
			
			XKit.extensions.blacklist.import(m_div);
			
		});		
	
		
		$("#xkit-extensions-panel-right").nanoScroller();
		$("#xkit-extensions-panel-right").nanoScroller({ scroll: 'top' });
		
	}

});