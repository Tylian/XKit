//* TITLE Messaging Tweaks **//
//* VERSION 1.1.0 **//
//* DESCRIPTION Helpful tweaks for Tumblr IM **//
//* DETAILS This adds a few helpful tweaks to the Tumblr IM, for example minimising the chat, hiding the IM icon or changing the looks of the chat window. **//
//* DEVELOPER New-XKit **//
//* FRAME false **//
//* BETA false **//

XKit.extensions.messaging_tweaks = new Object({

	running: false,

	observer: null,
	chat_window_observer: null,
	last_chat_title: "",
	
	preferences: {
		
		"sep0": {
			text: "Messaging Popout & Button Tweaks",
			type: "separator",
		},
		"reveal_true_face": {
			text: "Tumbley the Tumblr",
			default: false,
			value: false
		},
		"hide_chat_bubble": {
			text: "Hide the chat bubble completely",
			default: false,
			value: false
		},
		
		"sep1": {
			text: "Chatbox Tweaks",
			type: "separator",
		},
		"move_self_to_right": {
			text: "Move your own messages to the right",
			default: true,
			value: true
		},
		"allow_minimising": {
			text: "Allow minimising a chat by clicking on the title",
			default: true,
			value: true
		},
		
		"sep2": {
			text: "CSS Tweaks",
			type: "separator"
		},
		"my_chat_bubble_background": {
			text: "Background for my chat bubbles",
			type: "text",
			default: "rgba(0,0,0,.05)",
			value: "rgba(0,0,0,.05)"
		},
		"other_chat_bubble_background": {
			text: "Background for other people's chat bubbles",
			type: "text",
			default: "rgba(0,0,0,.1)",
			value: "rgba(0,0,0,.1)"
		},
		"my_chat_bubble_text": {
			text: "Text color for my chat bubbles",
			type: "text",
			default: "rgb(68,68,68)",
			value: "rgb(68,68,68)"
		},
		"other_chat_bubble_text": {
			text: "Text color for other people's chat bubbles",
			type: "text",
			default: "rgb(68,68,68)",
			value: "rgb(68,68,68)"
		},
		"background_override": {
			text: "Change chat background color",
			type: "text",
			default: "",
			value: ""
		}
		
	},
	
	get_current_chat_user: function() {
		if($(".title").text().indexOf("+") !== -1) {
			return $($(".title").find("a").get(0)).data("js-tumblelog-name");
		} else {
			return XKit.tools.get_current_blog();
		}
	},
	
	do_messages: function() {
		XKit.extensions.messaging_tweaks.observer.disconnect();
		var icons = $(".messaging-conversation-popovers .avatar:not(.xkit-my_messaging_icon, .xkit-others_messaging_icon)");
		icons.each(function() {
			if($(this).attr("data-js-tumblelog-name") === XKit.extensions.messaging_tweaks.get_current_chat_user()) {
				$(this).addClass("xkit-my_messaging_icon");
				$(this).parents(".conversation-message").addClass("xkit-my_messaging_message");
			} else {
				$(this).addClass("xkit-others_messaging_icon");
				$(this).parents(".conversation-message").addClass("xkit-others_messaging_message");
			}
		});
		if(XKit.extensions.messaging_tweaks.preferences.move_self_to_right.value) {
			$(".xkit-my_messaging_icon").each(function() {
				$(this).parent().append($(this));
			});
		}
		
		if (XKit.extensions.messaging_tweaks.preferences.allow_minimising.value) {
			if(XKit.extensions.messaging_tweaks.last_chat_title !== $(".messaging-conversation-popovers .title").text()) {
				XKit.extensions.messaging_tweaks.last_chat_title = $(".messaging-conversation-popovers .title").text();
				$(".conversation-header-main").on("click.minimise_header", function(e) {
					if (e.target !== this) { return; }
					if (!$(this).hasClass("minimised")) {
						$(".messaging-conversation-popovers").animate({bottom: "-404px"});
						$(this).addClass("minimised");
					} else {
						$(".messaging-conversation-popovers").animate({bottom: "0px"});
						$(this).removeClass("minimised");
					}
				});
			}
		}
		
		if ($(".conversation-main").get(0) !== null && typeof($(".conversation-main").get(0)) !== "undefined") {
			XKit.extensions.messaging_tweaks.observer.observe($(".conversation-main").get(0), {subtree: true, childList: true});
		}
	},
	
	hook_chat_window: function() {
		XKit.extensions.messaging_tweaks.observer.observe($(".conversation-main").get(0), {subtree: true, childList: true});
	},
	
	run: function() {
		XKit.extensions.messaging_tweaks.observer = new MutationObserver(XKit.extensions.messaging_tweaks.do_messages);
		XKit.extensions.messaging_tweaks.chat_window_observer = new MutationObserver(function(mutations, observer) {
			mutations.forEach(function (mutation) {
				var i, node;
				// Check if Chat Window has been added
				if (mutation.addedNodes.length) {
					for (i = 0; i < mutation.addedNodes.length; i++) {
						node = $(mutation.addedNodes[i]);
						if(node.hasClass("messaging-conversation-popovers")) {
							XKit.extensions.messaging_tweaks.hook_chat_window();
							return;
						}
					}
				// Check if chat window has been removed
				} else if (mutation.removedNodes.length) {
					for (i = 0; i < mutation.removedNodes.length; i++) {
						node = $(mutation.removedNodes[i]);
						if(node.hasClass("messaging-conversation-popovers")) {
							XKit.extensions.messaging_tweaks.observer.disconnect();
							XKit.extensions.messaging_tweaks.last_chat_title = "";
							return;
						}
					}
				}
			});
		});
		XKit.extensions.messaging_tweaks.chat_window_observer.observe(document.body, {
			childList: true,
			subtree: true,
			attributes: false,
			characterData: false
		});
		XKit.tools.init_css("messaging_tweaks");
		if(XKit.extensions.messaging_tweaks.preferences.reveal_true_face.value) {
			$(".tab.iconic.tab_messaging .tab_anchor").addClass("true-icon");
		}
		if(XKit.extensions.messaging_tweaks.preferences.hide_chat_bubble.value) {
			$(".tab.iconic.tab_messaging").hide();
		}
		if(XKit.extensions.messaging_tweaks.preferences.background_override.value !== "") {
			XKit.tools.add_css(".conversation-main { background-color: " + XKit.extensions.messaging_tweaks.preferences.background_override.value + " !important; }", "messaging_tweaks");
		}
		if(XKit.extensions.messaging_tweaks.preferences.move_self_to_right.value) {
			XKit.tools.add_css(".xkit-my_messaging_icon { position: absolute; right: 0px; margin-right: 0px !important; }", "messaging_tweaks");
			XKit.tools.add_css(".xkit-my_messaging_message .message-bubble { margin-left: 0px !important; margin-right: 40px; text-align: right;}", "messaging_tweaks");
			XKit.tools.add_css(".xkit-my_messaging_message .message-container { justify-content: flex-end !important; }", "messaging_tweaks");
			XKit.tools.add_css(".xkit-my_messaging_message .message-bubble-header { justify-content: flex-end !important; }", "messaging_tweaks");
		}
		
		XKit.tools.add_css(".messaging-conversation .xkit-others_messaging_message .conversation-message-text .message-bubble { background-color: " + XKit.extensions.messaging_tweaks.preferences.other_chat_bubble_background.value + " !important; }", "messaging_tweaks");
		XKit.tools.add_css(".messaging-conversation .xkit-my_messaging_message .conversation-message-text .message-bubble { background-color: " + XKit.extensions.messaging_tweaks.preferences.my_chat_bubble_background.value + " !important; }", "messaging_tweaks");
		
		XKit.tools.add_css(".messaging-conversation .xkit-others_messaging_message .conversation-message-text .message-bubble { color: " + XKit.extensions.messaging_tweaks.preferences.other_chat_bubble_text.value + " !important; }", "messaging_tweaks");
		XKit.tools.add_css(".messaging-conversation .xkit-my_messaging_message .conversation-message-text .message-bubble { color: " + XKit.extensions.messaging_tweaks.preferences.my_chat_bubble_text.value + " !important; }", "messaging_tweaks");
		
		XKit.tools.add_css(".messaging-conversation .xkit-others_messaging_message .conversation-message-text .message-bubble-header a { color: " + XKit.extensions.messaging_tweaks.preferences.other_chat_bubble_text.value + " !important; }", "messaging_tweaks");
		XKit.tools.add_css(".messaging-conversation .xkit-my_messaging_message .conversation-message-text .message-bubble-header a { color: " + XKit.extensions.messaging_tweaks.preferences.my_chat_bubble_text.value + " !important; }", "messaging_tweaks");
		
		// There's either 1 or no messaging-conversation-popovers on extension start
		$(".messaging-conversation-popovers").each(function() {
			XKit.extensions.messaging_tweaks.hook_chat_window();
			XKit.extensions.messaging_tweaks.do_messages();
		});
		
		this.running = true;
	},

	destroy: function() {
		XKit.extensions.messaging_tweaks.observer.disconnect();
		XKit.extensions.messaging_tweaks.chat_window_observer.disconnect();
		XKit.extensions.messaging_tweaks.last_chat_title = "";
		if(!XKit.extensions.messaging_tweaks.preferences.move_self_to_right.value) {
			$(".xkit-my_messaging_icon").each(function() {
				$(this).parent().prepend($(this));
			});
		}
		$(".true-icon").removeClass("true-icon");
		$(".tab.iconic.tab_messaging").show();
		$(".xkit-others_messaging_message").removeClass("xkit-others_messaging_message");
		$(".xkit-others_messaging_icon").removeClass("xkit-others_messaging_icon");
		$(".xkit-my_messaging_message").removeClass("xkit-my_messaging_message");
		$(".xkit-my_messaging_icon").removeClass("xkit-my_messaging_icon");
		XKit.tools.remove_css("messaging_tweaks");
		if ($(".conversation-header-main").hasClass("minimised")) {
			$(".messaging-conversation-popovers").animate({bottom: "0px"});
			$(".conversation-header-main").removeClass("minimised");
		}
		$(".conversation-header-main").off("click.minimise_header");
		this.running = false;
	}

});
