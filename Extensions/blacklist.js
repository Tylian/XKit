//* TITLE Blacklist **//
//* VERSION 1.0 REV B **//
//* DESCRIPTION Clean your dash **//
//* DETAILS This extension allows you to block posts based on the words you specify. If a post has the text you've written in the post itself or it's tags, it will be replaced by a warning, or won't be shown on your dashboard, depending on your settings. **//
//* DEVELOPER STUDIOXENIX **//
//* FRAME false **//
//* BETA false **//
//* SLOW true **//

XKit.extensions.blacklist = new Object({

	running: false,
	slow: true,
	
	preferences: {
		"sep0": {
			text: "Blacklisting options",
			type: "separator"
		},
		"dont_display": {
			text: "Don't display blocked posts at all (not recommended)",
			default: false,
			value: false
		},
		"sep1": {
			text: "Blacklisted Words",
			type: "separator"
		}
	},	
	
	blacklisted: new Array(),

	run: function() {
		this.running = true;
		XKit.tools.init_css("blacklist");
		var m_blacklist = XKit.storage.get("blacklist","words","").split(",");
		if (m_blacklist !== "") {
			this.blacklisted = m_blacklist;	
		}
		
		if ($("ol#posts").length > 0) {
			XKit.post_listener.add("blacklist", XKit.extensions.blacklist.check);	
			XKit.extensions.blacklist.check();
		}
		
	},
	
	check: function() {
		
		$(".post").not(".mine").not(".xblacklist-done").each(function() {
			
			// Check if it's something we should not touch.
			if ($(this).attr('id') === "new_post") { return; }
			if ($(this).css("display") === "none") { return; }
			
			// Add class to not do this twice.
			$(this).addClass("xblacklist-done");
			
			// if has no text content, no need to do this.
			if ($(this).find(".post_content").length <= 0) { return; }
			
			// Collect the tags
			var m_tags = "";
			if ($(this).find(".tag").length > 0) {
				$(this).find(".tag").each(function() {
					m_tags = m_tags + " " + $(this).html().replace("#","");
				});
			}
			
			// Collect the title contents too.
			var m_title = "";
			if ($(this).find(".post_title").length > 0) {
				m_title = $(this).find(".post_title").html();
			}
			
			// Collect the content.
			var m_content = "";
			
			if ($(this).find(".post_text_wrapper").length > 0) {
				m_content = $(this).find(".post_text_wrapper").html();	
			}
			
			if ($(this).find(".caption").length > 0) {
				m_content = $(this).find(".caption").html();
			}
			
			m_content = m_content + " " + m_title + " " + m_tags;
			m_content = XKit.tools.replace_all(m_content, "&nbsp;", " ");
			m_content = m_content.toLowerCase();
			
			// Strip HTML tags.
			m_content = m_content.replace(/<(?:.|\n)*?>/gm, '');
			
			var m_result = XKit.extensions.blacklist.do_post(m_content);
			if (m_result !== "") {
				XKit.extensions.blacklist.hide_post($(this), m_result);	
			}
			
			
		});
		
		$(".xblacklist_open_post").unbind("click");
		$(".xblacklist_open_post").bind("click", function() {
		
			var m_div = $("#" + $(this).attr('data-post-id'));
			$(m_div).removeClass("xblacklist_blacklisted_post");
			$(m_div).find(".post_info").css("display","block");
			$(m_div).find(".post_controls").css("display","block");
			$(m_div).find(".post_footer_links").css('display','block');
			$(m_div).find(".full_answer_container_wrapper").css("display","block");	
			
			$(m_div).find(".xblacklist_excuse").remove();
			$(m_div).find(".post_content").html($(m_div).find(".xblacklist_old_content").html());
			
		});
		
	},
	
	hide_post: function(obj, word) {
		
		if (XKit.extensions.blacklist.preferences.dont_display.value === true) {
			// Wow this user must hate the words they've added.
			$(obj).addClass("xblacklist_hidden_post");
			return;	
		}
		
		var old_content = '<div style="display: none;" class="xblacklist_old_content">' + 
					$(obj).find(".post_content").html() + '</div>';

		var block_excuse = '<div class="xblacklist_excuse">' +
					'Blocked because of the word "<b>' + word + '</b>"' +
					'<a href="#" onClick="return false" data-post-id="' + $(obj).attr('id') + '" class="xblacklist_open_post xkit-button">Show it anyway</a></div>';

		$(obj).addClass("xblacklist_blacklisted_post");
		$(obj).find(".post_info").css("display","none");
		$(obj).find(".post_controls").css("display","none");
		$(obj).find(".post_content").html(old_content + block_excuse);
		$(obj).find(".post_footer_links").css('display','none');
		$(obj).find(".full_answer_container_wrapper").css("display","none");
		
	},
	
	do_post: function(post_content) {
		
		if ($.trim(post_content) === "") { return ""; }		
		var p_words = post_content.split(" ");

		for (var i=0;i<XKit.extensions.blacklist.blacklisted.length;i++) {
			
			var m_word = XKit.extensions.blacklist.blacklisted[i].toLowerCase();
			if ($.trim(m_word) === "") { continue; }
			
			var m_word_wildcard = false;
			
			if (m_word.substring(m_word.length - 1) === "*") {
				// This word is wildcarded!	
				m_word_wildcard = true;
				m_word = m_word.substring(0, m_word.length - 1);
			}
			
			if (m_word.indexOf(" ") !== -1) {
				m_word_wildcard = true;	
			}

			if (m_word_wildcard === false) {
				
				// Well this one is easy:
				
				if (p_words.indexOf(m_word) !== -1) {
					// We've found the word!
					return m_word;	
				}	
				
			} else {
				
				// Ugh. Wildcarded. This will
				// require some processing power.
				// To save CPU time, let's run it in the
				// post_content first, continue only if
				// we can find it there.
				if (post_content.indexOf(m_word) !== -1) {
					
					// Ugh. Even worse, we've found it,
					// now we need to get into a loop.
					for (var m=0;m<p_words.length;m++) {
						
						if (p_words[m] === "") { continue; }
						if (p_words[m].indexOf(m_word) !== -1) {
							return m_word;	
						}
						
						if (m < p_words.length) {
							var tmp_word = p_words[m] + " " + p_words[m + 1];	
							if (tmp_word.indexOf(m_word) !== -1) {
								return m_word;	
							}
						}
							
					}
						
				}	
			}
			
		}
		
		// Found nothing.
		return "";
		
		
	},

	destroy: function() {
		this.running = false;
		$(".xblacklist-done").each(function() {
			$(this).removeClass("xblacklist_blacklisted_post");
			$(this).find(".post_info").css("display","block");
			$(this).find(".post_controls").css("display","block");
			$(this).find(".post_footer_links").css('display','block');
			$(this).find(".full_answer_container_wrapper").css("display","block");	
			$(this).find(".xblacklist_excuse").remove();
			$(this).find(".post_content").html($(this).find(".xblacklist_old_content").html());	
		});	
		$(".xblacklist-done").removeClass("xblacklist-done");
		$(".xblacklist_hidden_post").removeClass("xblacklist_hidden_post");
		$(".xblacklist_blacklisted_post").removeClass("xblacklist_blacklisted_post");
		XKit.tools.remove_css("blacklist");
	},
	
	create_blacklist_div: function(word) {
		
		var m_html = "<div class=\"xkit-blacklisted-word\">" + word + "<div data-word=\"" + word + "\" class=\"xkit-blacklisted-word-delete\">&#10006;</div></div>";
		return m_html;
		
	},
	
	check_if_exists: function(word) {
		
		if (XKit.extensions.blacklist.blacklisted.indexOf(word) !== -1) {
			return true;
		} else {
			return false;
		}	
		
	},
	
	save_blacklist: function() {
	
		XKit.storage.set("blacklist","words",this.blacklisted.join(","));
		
	},
	
	cpanel: function(m_div) {
		
		if ($("#xkit-blacklist-custom-panel").length > 0) {
			// Panel already exists, probably in refresh mode.
			// Remove it first.
			$("#xkit-blacklist-custom-panel").remove();	
		}
		
		var m_html = "<div id=\"xkit-blacklist-custom-panel\"><div id=\"blacklist-toolbar\"><div id=\"blacklist-add-button\" class=\"xkit-button\">Add a new word..</div><div id=\"blacklist-populate-common\" class=\"xkit-button\">Auto-Populate</div><div id=\"blacklist-tips\" class=\"xkit-button\">Tips on Blacklisting</div><div id=\"blacklist-delete-all\" class=\"xkit-button\">Delete All</div></div><div id=\"blacklist-words\">";
		if (XKit.extensions.blacklist.blacklisted.length <= 1) {
			m_html = m_html + "<div id=\"xkit-blacklist-none\"><b>You have no blacklisted words.</b><br/>Click on the button above to add new words to your blacklist.</div>";		
		} else {
			for (i=0;i<XKit.extensions.blacklist.blacklisted.length;i++) {
				if (XKit.extensions.blacklist.blacklisted[i] !== "") {
					m_html = m_html + XKit.extensions.blacklist.create_blacklist_div(XKit.extensions.blacklist.blacklisted[i]);
				}	
			}
		}
		
		m_html = m_html + "</div></div>";
		$(m_div).append(m_html);
		
		$(".xkit-blacklisted-word-delete").unbind("click");
		$(".xkit-blacklisted-word-delete").click(function() {
		
			var m_index = XKit.extensions.blacklist.blacklisted.indexOf($(this).attr('data-word'));
			if (m_index === -1) { return; }
			
			XKit.extensions.blacklist.blacklisted.splice(m_index, 1);	
			XKit.extensions.blacklist.save_blacklist();
			XKit.extensions.blacklist.cpanel(m_div);
			XKit.extensions.xkit_preferences.restart_extension("blacklist");
			
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
			
			XKit.window.show("Add word to blacklist","<b>Enter the word you want to add.</b><br/>Your words can not contain commas or backslashes.<input type=\"text\" maxlength=\"50\" placeholder=\"Enter a word here.\" class=\"xkit-textbox\" id=\"xkit-blacklist-word\"><br/>Before adding a word, please check \"Tips on Blacklisting\" section.","question","<div class=\"xkit-button default\" id=\"xkit-blacklist-add-word\">Add word</div><div class=\"xkit-button\" id=\"xkit-close-message\">Cancel</div>")	
			
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
				
				if (m_to_add.length <= 2) {
					alert("Words must be at least three characters.");
					return;	
				}
				
				if (XKit.extensions.blacklist.check_if_exists(m_to_add) === true) {
					alert("This word is already in the blacklist.");
					return;	
				}
				
				XKit.extensions.blacklist.blacklisted.push(m_to_add);
				XKit.extensions.blacklist.save_blacklist();
				XKit.window.close();
				XKit.extensions.blacklist.cpanel(m_div);
				XKit.extensions.xkit_preferences.restart_extension("blacklist");
				
			});
			
		});
		
		$("#xkit-extensions-panel-right").nanoScroller();
		$("#xkit-extensions-panel-right").nanoScroller({ scroll: 'top' });
		
	}

});