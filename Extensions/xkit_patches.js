//* TITLE XKit Patches **//
//* VERSION 2.2 REV D **//
//* DESCRIPTION Patches framework **//
//* DEVELOPER STUDIOXENIX **//

XKit.extensions.lang_english = {
		
	common: {
			
		"ok": "OK",
		"cancel": "Cancel"	
				
	}	
			
};

XKit.extensions.xkit_patches = new Object({

	running: false,
	
	preferences: {
		debug_mode: {
			text: "XKit Developer Mode",
			default: true,
			value: true
		}
	},
	
	check_unfollower_hater: function() {
		
		if ($("#unfollow_button").length > 0 || $("#pageCounter").length > 0) {
			
			if (XKit.storage.get("xkit_patches","shown_unfollower_hater_message","") === "true") { return; }
			
			XKit.window.show("Unfollower Hater found", "<b>Unfollower Hater causes problems with XKit, including but not limited to TagViewer and Quick Tags not working properly, and really slow page response on tumblr.com/blog/[url] pages.</b><br/><br/>You are not required to remove it in order to use XKit, but no support will be provided to you if you don't disable it.<br/><small style=\"color: rgb(120,120,120);\">This message will not be displayed again once you click \"OK\".</small>", "error", "<div id=\"xkit-patches-unfollower-hater-ok\" class=\"xkit-button default\">OK</div><a href=\"http://xkit-extension.tumblr.com/post/60595138775/quick-tags-tagviewer-and-unfollower-hater\" target=\"_BLANK\" class=\"xkit-button\">More information</a>");	
			
			$("#xkit-patches-unfollower-hater-ok").click(function() {
				
				XKit.storage.set("xkit_patches","shown_unfollower_hater_message","true");
				XKit.window.close();	
				
			});
			
		}	
		
	},

	do_support_links: function() {

		var yes_do_it = false;
                if (typeof XKit.extensions.show_more !== "undefined") {
                	if (XKit.extensions.show_more.running === false) {
				yes_do_it = true;
			} else {
				yes_do_it = false;
			}
		} else {
			yes_do_it = true;
		}

		//console.log("Doing support links? " + yes_do_it);

		if (yes_do_it) {

			$(document).on('click','.tumblelog_menu_btn', XKit.extensions.xkit_patches.patch_ask);

		}

	},

	patch_ask: function() {

		var m_parent;
		if ($(".tumblelog_popover_v1").length > 0) {
			m_parent = $(".tumblelog_popover_v1").find(".tumblelog_menu_popover").find("ul");
		} else {
			m_parent = $(".tumblelog_popover").find(".tumblelog_menu_popover").find("ul");
		}

		//console.log("->" + $(m_parent).html());

		if ($(m_parent).find(".ask").attr('data-tumblelog-name') === "xkit-extension") {
			
			$(m_parent).find(".ask").html("XKit Support");
			$(m_parent).find(".ask").addClass("xkit-support-ask");
			$(m_parent).find(".ask").removeClass("ask");

		}

	},

	run: function() {
		this.running = true;

		XKit.tools.init_css("xkit_patches");
		
		//Sorry, Atesh. I can't stand your spammy extension anymore. - Love, Ashish.

		XKit.debug = XKit.extensions.xkit_patches.preferences.debug_mode.value; //If set to true, it'll spam again
		XKit.debug_messages = []; //Holds debug messages
		XKit.log_back = console.log; //Make a backup before replacing it!

		XKit.out_to_console = function(text){
			//A bit messy, but it fixes the "TypeError: Illegal invocation" 
			console.log = XKit.log_back;
			console.log(text);
			console.log = XKit.log;
		}

		XKit.log = function(text) {
			if(XKit.debug){
				XKit.out_to_console(text);
			}
			XKit.debug_messages.push(text);
		}

		console.log = XKit.log; //Overload console.log

		XKit.get_debug_logs = function(){
			return XKit.debug_messages;
		}

		XKit.show_debug_logs = function(){
			var messages = XKit.get_debug_logs();
			for(var i = 0; i < messages.length; i++){
				XKit.out_to_console(messages[i]);
			}
		}
		
		try { 

			XKit.retina = window.devicePixelRatio > 1;

			if (XKit.retina === true) {
				console.log("Retina screen mode.");
			}

		} catch(e) {

			console.log("!!!!!!" + e.message);
	
		}
		
		setTimeout(function() { XKit.extensions.xkit_patches.check_unfollower_hater(); }, 1000);

		setTimeout(function() { XKit.extensions.xkit_patches.do_support_links(); }, 1500);
		
		var form_key_to_save = $("body").attr('data-form-key');
				
		if (typeof form_key_to_save !== "undefined" &&form_key_to_save !== "") {
			XKit.storage.set("xkit_patches", "last_stored_form_key", window.btoa(form_key_to_save));
		}
		
		XKit.iframe = {
			
			___resize: function(width, height) {
				
				try {
				
					var m_obj = {};
					m_obj.width = width;
					m_obj.height = height;
				
					XKit.tools.add_function(function() {
						try {
							add_tag = JSON.parse(add_tag);
			 				_t.postMessage(["resize_iframe", add_tag.width, add_tag.height, "body_class", "top_bar", _t.protocol_host()], "*", window.parent);
			 			} catch(e) {
			 				console.log("[!!!] XKit Patches: Unable to resize the iframe: " + e.message);
			 			}
					}, true, JSON.stringify(m_obj));
					
			 	} catch(e) {
			 		
			 		console.log("[!!!] XKit Patches: Unable to resize the iframe: " + e.message);
			 		
			 	}	
				
			},
			
			resize: function(width, height) {
				
				XKit.iframe.___resize(width, height);
				
			},
			
			full: function() {
				
				XKit.iframe.___resize("100%", "100%");
				
			},
			
			restore: function() {
				
				XKit.iframe.___resize(360, 26);
				
			}
			
		};
		
		if (XKit.frame_mode === true) {
			
			console.log("XKit Patches determined that it's in frame mode, resizing stuff!");
			
			$("#iframe_controls").css("width","auto");
			XKit.iframe.restore();	
			
		}
		
		XKit.window.close = function() {
			
			$("#xkit-window-shadow").fadeOut('fast');
			$("#xkit-window-old").fadeOut('fast');
			$("#tiptip_holder").css("z-index", "99999");
			$("#xkit-window").fadeOut('fast', function() {
				$(this).remove();
				$("#xkit-window-shadow").remove();
				$("#xkit-window-old").remove();
			});
			
		};
		
		XKit.window.show = function(title, msg, icon, buttons, wide) {

			if (typeof icon === "undefined") {
				icon = "";
			}
			
			var additional_classes = "";
			
			if (wide == true) {
				additional_classes = "xkit-wide-window";	
			}

			if ($("#xkit-window").length > 0) {
				$("#xkit-window").attr('id', "xkit-window-old");
				$("#xkit-window-old").fadeOut('fast', function() {
					$(this).remove();
				});
			}

			var m_html = 	"<div id=\"xkit-window\" class=\"" + icon + " " + additional_classes + "\" style=\"display: none;\">" +
								"<div class=\"xkit-window-title\">" + title + "</div>" +
								"<div class=\"xkit-window-msg\">" + msg + "</div>";
					
			if (typeof buttons !== "undefined") {
				m_html = m_html + "<div class=\"xkit-window-buttons\">" + buttons + "</div>";
			}
	
			if ($("#xkit-window-shadow").length == 0) {
				m_html = m_html + "</div><div id=\"xkit-window-shadow\"></div>";
			}
	
			$("body").prepend(m_html);
			
			$("#tiptip_holder").css("z-index", "99000000");
			
			centerIt($("#xkit-window"));
			$("#xkit-window").fadeIn('fast');
	
			$("#xkit-close-message").click(function() {
				$("#xkit-window-shadow").fadeOut('fast', function() {
					$(this).remove();
				});
				$("#xkit-window").fadeOut('fast', function() {
					$(this).remove();
				});
			});

		};
		
		XKit.dashboardGL = new Object({
			
			last_point: 0,
			is_working: false,
			interval: 0,
			
			scroll_top: $(window).scrollTop(),
			view_height: $(window).height(),
			
			list_id: new Array(),
			list_avatar: new Array(),
			
			blank_image: "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==",
			
			is_visible: function(elem, elemTop) {
				
				// From: http://stackoverflow.com/questions/487073/check-if-element-is-visible-after-scrolling
			
    				var docViewTop = XKit.dashboardGL.scroll_top;
    				var docViewBottom = XKit.dashboardGL.view_height;
    				
    				var elemBottom = elemTop + $(elem).height();

    				return ((elemBottom <= docViewBottom) && (elemTop >= docViewTop));
				
			},
			
			init: function() {
				
				XKit.console.add("Init XKit dashboardGL");	
				
				XKit.dashboardGL.interval = setInterval(XKit.dashboardGL.do, 750);
				
				$(window).resize(function() {
  					XKit.dashboardGL.view_height = $(window).height();
				});
				
			},
			
			do: function() {
				
				if (XKit.dashboardGL.is_working) { return; }
				
				//console.time('XKit dashboardGL');
				
				XKit.dashboardGL.is_working = true;
				
				XKit.dashboardGL.scroll_top = $(window).scrollTop();
			
				var current_point = $(window).scrollTop();
				
				// if (current_point === XKit.dashboardGL.last_point) { XKit.dashboardGL.last_point = current_point; XKit.dashboardGL.is_working = false; console.timeEnd('XKit dashboardGL'); return; }
				
				var m_difference = current_point - XKit.dashboardGL.last_point;
				if (m_difference <= -1) { m_difference = m_difference * -1; }
				if (m_difference >= 550) { console.timeEnd('XKit dashboardGL'); XKit.dashboardGL.last_point = current_point; XKit.dashboardGL.is_working = false; return; }
				
				XKit.dashboardGL.last_point = current_point;	
				
				var fix_count = 0;
				
				$(".post_avatar_link:visible").each(function() {
						
					var m_top = $(this).offset().top;
						
					if (m_top >= current_point + XKit.dashboardGL.view_height + 200) { return false; }
					if (m_top <= current_point - 300) { return; }
					
					if (m_top >= XKit.dashboardGL.view_height + 200) {
						if (XKit.dashboardGL.is_visible($(this), m_top) !== false) { return; }
					}
						
					if ($(this).css("background-image").indexOf(XKit.dashboardGL.blank_image) !== -1) {
						
						var post_id = $(this).parentsUntil('.post').parent().attr('data-post-id');
						var m_index = XKit.dashboardGL.list_id.indexOf(post_id);
						
						if (m_index !== -1) {
						
							$(this).css("background-image", "url('" + XKit.dashboardGL.list_avatar[m_index] + "')");	
							
						} else {
						
							XKit.dashboardGL.list_id.push(post_id);	
							XKit.dashboardGL.list_avatar.push($(this).attr('data-avatar-url'));
							$(this).css("background-image", "url('" + $(this).attr('data-avatar-url') + "')");	
							
						}			
						
			
						fix_count++; 
						//var m_object = $(this);
						//setTimeout(function() {
						//$(this).css("background-image", "url('" + $(this).attr('data-avatar-url') + "')");	
						//}, (fix_count * 10) + 100);
						
						
					}	
					
				});
				
				XKit.dashboardGL.is_working = false;
				//console.timeEnd('XKit dashboardGL');
				
				//console.log("Fixed " + fix_count + " avatars");
				
			}	
			
		});
		
		XKit.dashboardGL.init();
		
		XKit.lang = new Object({
			
			default: "english",
			current: "",
			
			init: function() {
				
				var lang = XKit.storage.get("xkit_patches","language","");
				
				if (lang === "" || typeof lang === "undefined") {
					lang = "english";	
				}	
				
				XKit.lang.current = lang;
				
			},
		
			get: function(path, par1, par2, par3) {
				
				var m_path = path.split(".");
				
				var m_lang = XKit.extensions["lang_" + XKit.lang.current];
				
				if (typeof m_lang == "undefined") {
					m_lang = XKit.extensions["lang_" + XKit.lang.default];
				}
				
				var m_obj = m_lang;
				var set_to_default = false;
				
				for (var i=0;i<m_path.length;i++) {
					
					if (typeof m_obj[m_path[i]] !== "undefined") {
						m_obj = m_obj[m_path[i]];
					} else {
						return "???";
					}
					
				}	
				
				if (typeof par1 === "undefined") { par1 = "???" }
				if (typeof par2 === "undefined") { par2 = "???" }
				if (typeof par3 === "undefined") { par3 = "???" }
				
				m_obj = m_obj.replace("%1", par1);
				m_obj = m_obj.replace("%2", par2);
				m_obj = m_obj.replace("%3", par3);
				
				return m_obj;
				
			}	
			
		});
		
		XKit.lang.init();
		
		XKit.interface = new Object({
			
			revision: 2,
			
			added_icon: new Array(),
			added_icon_icon: new Array(),
			added_icon_text: new Array(),
			
			post_window_listener_id: new Array(),
			post_window_listener_func: new Array(),
			post_window_listener_running: false,
			post_window_listener_window_id: 0,
			
			kitty: {
				
				stored: "",
				store_time: 0,
				expire_time: 600000,
				
				set: function(kitty) {
					
					if (typeof kitty === "undefined") { kitty = ""; }
					console.log("XKitty: Setting kitty to \"" + kitty + "\"");
					XKit.interface.kitty.stored = kitty;	
					
				},	
				
				get: function(callback) {
					
					var m_object = {};
					m_object.errors = false;
					m_object.kitten = "";
					
					var current_ms = new Date().getTime();
					var kitty_diff = current_ms - XKit.interface.kitty.store_time;
					
					if (XKit.interface.kitty.stored !== "") {
						if (kitty_diff >= XKit.interface.kitty.expire_time || kitty_diff < 0) {
							console.log("XKitty: Kitty expired? Let's try again.");
						} else {
							console.log("XKitty: Kitty already received, passing: " + XKit.interface.kitty.stored);
							m_object.kitten = XKit.interface.kitty.stored;
							callback(m_object);
							return;
						}
					}
					
					console.log("XKitty: Kitty blank / expired, requesting new feline.");
					
					$.ajax({
						type: "POST",
						url: "/svc/secure_form_key",
						headers: {
							"X-tumblr-form-key": XKit.interface.form_key(),	
						},
						success: function (data, status, res) {
							console.log("XKitty: YAY! Kitty request complete!");
							XKit.interface.kitty.store_time = new Date().getTime();
							XKit.interface.kitty.stored = res.getResponseHeader("X-tumblr-secure-form-key");
							m_object.kitten = XKit.interface.kitty.stored;
							callback(m_object);
						},
						error: function(data, status, res) {
							console.log("XKitty: DAMN IT! Kitty request FAILED!");
							m_object.errors = true;
							m_object.kitten = "";
							XKit.interface.kitty.stored = "";
							callback(m_object);
						}
					})
					
				},
				
				
			},
			
			post_window: {
				
				added_icon: new Array(),
				added_icon_icon: new Array(),
				added_icon_text: new Array(),
				
				create_control_button: function(class_name, icon, text, func) {
					
					XKit.interface.post_window.added_icon.push(class_name);
					XKit.interface.post_window.added_icon_icon.push(icon);
					XKit.interface.post_window.added_icon_text.push(text);				

					XKit.tools.add_css("." + class_name + " {" + 
							" background-image: url('" + icon + "') !important;" +
							" background-size: auto auto !important;" +
						   "}", "xkit_interface_post_window_icon___" + class_name);
						   
					$(document).on('click', '.' + class_name, function() {
						if ($(this).hasClass("xkit-interface-working") ||$(this).hasClass("xkit-interface-disabled")) { return; }
						if (typeof func === "function") { func.call(this, event); }	
					});
						
				},
				
				add_control_button: function(class_name, additional) {
					
					if (typeof additional == "undefined") {additional = ""; }
				
					if (XKit.interface.post_window.added_icon.indexOf(class_name) === -1) {
						XKit.console.add("Interface -> Can't add icon, button not created, use create_control_button.");
						return;	
					}
					
					var m_text = XKit.interface.post_window.added_icon_text[XKit.interface.post_window.added_icon.indexOf(class_name)];
					var m_html = "<div title=\"" + m_text + "\" class=\"xkit-interface-control-button " + class_name + "\" " + additional + "></div>";

		  			if ($("#post_controls").find("#xkit-interface-buttons").length > 0) {
						$("#post_controls").find("#xkit-interface-buttons").prepend(m_html);
		  			} else {
		  				$("#post_controls").append("<div id=\"xkit-interface-buttons\">" + m_html + "</div>");
		  			}	
					
				},
				
				add_tag: function(tag) {
					
					// Adds tags to the post window.
					// You can pass an array or a single string.
					
					if (typeof tag !== "string") {
						
						for (i=0;i<tag.length;i++) {
							tag_to_be_added = tag[i];
							if (tag_to_be_added.substring(0,1) === " ") {
								tag_to_be_added = tag_to_be_added.substring(1);	
							}
							var old_tags = $("#post_content").find(".tags").find(".post_tags").val();
							$("#post_content").find(".tags").find(".post_tags").val(old_tags + "," + tag_to_be_added);
							$("#post_content").find(".tags").find(".editor_wrapper").before('<span class="tag">' + tag_to_be_added + '</span>');
						}
						
					} else {
						
						var old_tags = $("#post_content").find(".tags").find(".post_tags").val();
						$("#post_content").find(".tags").find(".post_tags").val(old_tags + "," + tag);
						$("#post_content").find(".tags").find(".editor_wrapper").before('<span class="tag">' + tag + '</span>');
						
					}
					
					
				},
				
				tag_exists: function(tag) {
					
					var found = false;
					tag = tag.toLowerCase();
					
					$("#post_content").find(".tag").each(function() {
						var this_tag = $(this).html();
						this_tag = this_tag.toLowerCase();
						if (this_tag.substring(0) === "\"") {
							this_tag = this_tag.substring(1, this_tag.length - 1);
						}
						if (this_tag === tag) {
							found = true;
						}	
					});	
		
					return found;	
					
				},
				
				remove_all_tags: function() {
					
					$("#post_content").find(".tag").remove();
					$("#post_content").find(".tags").find(".post_tags").val("");
					
				},
				
				remove_tag: function(tag) {
					
					tag = tag.toLowerCase();
					
					
					$("#post_content").find(".tag").each(function() {

						var this_tag = $(this).html();
						this_tag = this_tag.toLowerCase();
						if (this_tag.substring(0) === "\"") {
							this_tag = this_tag.substring(1, this_tag.length - 1);
						}
						if (this_tag === tag) {
							$(this).remove();
						}
						
					});
	
					try {
		
						var m_tags = $("#post_content").find(".tags").find(".post_tags").val().split(",");
						if (m_tags.length === 0) { return; }
						var to_add = new Array();
		
						for (var i=0;i<m_tags.length;i++) {
							if (m_tags[i] !== tag) {
								to_add.push(m_tags[i]);
							}	
						}
						
						$("#post_content").find(".tags").find(".post_tags").val(to_add.join(","));
		
					} catch(e) {
						XKit.console.add("interface -> remove_tag -> " + e.message);	
					}
					
				},
				
				state: function() {
					
					var to_return = new Object();
					
					to_return.publish = $("#post_state").val() == "0";	
					to_return.draft = $("#post_state").val() == "1";
					to_return.queue = $("#post_state").val() == "2";
					to_return.private = $("#post_state").val() == "private";
					
					return to_return;
					
				},
				
				blog: function() {
					
					return $("#channel_id").val();	
					
				},
				
				switch_blog: function(url) {
					
					$("#tumblelog_choices").find(".option").each(function() {
						
						if ($(this).attr('data-option-value') === url) {
							$(this).trigger('click');
							return true;	
						}	
						
					});	
					
					return false;
					
				},
				
				open: function() {
					
					return XKit.interface.post_window_listener_window_id !== 0;
					
				}, 
				
				type: function() {
					
					var to_return = new Object();
					
					to_return.text = $("#post_content").find(".main_content").hasClass("regular_form") == true;	
					to_return.photo = $("#post_content").find(".main_content").hasClass("photo_form") == true;
					to_return.quote = $("#post_content").find(".main_content").hasClass("quote_form") == true;
					to_return.link = $("#post_content").find(".main_content").hasClass("link_form") == true;
					to_return.chat = $("#post_content").find(".main_content").hasClass("conversation_form") == true;
					to_return.audio = $("#post_content").find(".main_content").hasClass("audio_form") == true;
					to_return.video = $("#post_content").find(".main_content").hasClass("video_form") == true;
					
					return to_return;	
					
				},
				
				origin: function() {
					
					var to_return = new Object();
					
					to_return.is_reblog = $("#post_header").find(".reblog_source").length > 0;
					to_return.is_original = $("#post_header").find(".reblog_source").length <= 0;
					
					return to_return;
					
				}
				
			},
			
			post_window_listener: {
				
				run: function() {
					
					if (XKit.interface.post_window_listener_running) { console.log("yo2");  return; }
					
					XKit.interface.post_window_listener_running = true;
					XKit.interface.post_window_listener.set_listen();
					
				},
				
				set_listen: function() {
					
					setTimeout(function() { XKit.interface.post_window_listener.do(); }, 1000);
					
				},
				
				do: function() {
				
					if (!XKit.interface.post_window_listener_running) { XKit.interface.post_window_listener_window_id = 0; return XKit.interface.post_window_listener.set_listen(); }	
					
					if($("#post_content").length <= 0 ||$("#ask_form").length > 0) {
						// No post window yet. Do nothing.
						XKit.interface.post_window_listener_window_id = 0;
						return XKit.interface.post_window_listener.set_listen();
					}
					
					if (XKit.interface.post_window_listener_window_id !== 0) {
						// Already ran the functions here?
						return XKit.interface.post_window_listener.set_listen();	
					} else {
						XKit.interface.post_window_listener_window_id = XKit.tools.random_string();	
					}
					
					if (XKit.interface.post_window_listener_id.length === 0) {
						// We got not functions to run.
						return XKit.interface.post_window_listener.set_listen();
					}
					
					XKit.console.add("interface -> Post Window found, running attached functions. [" + XKit.interface.post_window_listener_window_id + "]");
					
					for (var i=0;i<XKit.interface.post_window_listener_id.length;i++) {
					
						if (typeof XKit.interface.post_window_listener_func[i] === "function") {
							
							try {
								XKit.interface.post_window_listener_func[i].call();	
							}catch(e) {
								XKit.console.add("interface -> post_window_listener -> can't run \"" + XKit.interface.post_window_listener_id[i] + "\": " + e.message);
							}
						}
						
					}
					
					XKit.interface.post_window_listener.set_listen();				
					
					
				},
				
				add: function(id, func) {
					
					// Call a function when the manual reblog window appears.
					
					XKit.interface.post_window_listener_id.push(id);
					XKit.interface.post_window_listener_func.push(func);
					XKit.interface.post_window_listener.run();
					
					
				},
				
				remove: function(id) {
					
					var m_id = XKit.interface.post_window_listener_id.indexOf(id);
					
					if (m_id === -1) { return; }
					
					XKit.interface.post_window_listener_id.splice(m_id, 1);
					XKit.interface.post_window_listener_func.splice(m_id, 1);
					
					
				}
				
				
			},
			
			update_view: {
				
				// Each function here requires a Interface Post Object,
				// you can get using interface.post.
				
				tags: function(post_obj, tags) {
					
					var post_div = $("#post_" + post_obj.id);

					var m_inner = "";
					var tags_array = tags.split(",");
					var added_tag_count = 0;
					
					for (var i=0;i<tags_array.length;i++) {
					
						var formatted = encodeURIComponent(tags_array[i]);
						
						if (tags_array[i] === "" || tags_array[i] === " ") { continue; }
						
						if (tags_array[i].substring(0,1) === " ") {
							tags_array[i] = tags_array[i].substring(1);	
						}
						
						m_inner = m_inner + "<a class=\"post_tag\" href=\"/tagged/" + formatted + "\">#" + tags_array[i] + "</a>";
						added_tag_count++;	
						
					}
					
					if (added_tag_count > 0) {
						$(post_div).removeClass("no_body");
					} else {
						$(post_div).addClass("no_body");
					}
					
					if ($(post_div).find(".post_tags").length > 0) {
						
						$(post_div).find(".post_tags").find("div:first-child").html(m_inner);
							
					} else {
						
						var m_html = 	"<div class=\"post_tags\"><div class=\"post_tags_inner\">" +
									m_inner +
								"</div>";
						$(post_div).find(".post_footer").before(m_html);
						
					}	
					
				}
				
			},
			
			edit_post_object: function(tumblr_object, settings) {
				
				// Used to modify a Tumblr Post Object.
				// NEVER edit it yourself, it might change in the
				// future rendering your code useless. Use this.	
				
				// Takes the Tumblr Object (get it using Fetch below, don't modify)
				// and a settings object. The settings object can have the following:
				
				/*
					[ settings] - object
						|
						|--- tags
						|--- caption
				*/
				
				if (typeof tumblr_object.post === "undefined") {
					// Jump one object in.
					tumblr_object = new Object();
					tumblr_object.error = true;
					tumblr_object.message = "Wrong/corrupt tumblr object, post object not found.";
					XKit.console.add(tumblr_object.message);
					return tumblr_object;
				}
				
				if (typeof settings.tags !== "undefined") {
				
					tumblr_object.post.tags = settings.tags;	
					
				}
				
				if (typeof settings.caption !== "undefined") {
				
					if (tumblr_object.post.type === "link") {
						tumblr_object.post.three = settings.caption;	
					} else {
						tumblr_object.post.two = settings.caption;	
					}
					
				}
				
				return tumblr_object;
				
			},
			
			edit: function(tumblr_object, func, retry_mode) {
				
				// Used to edit a post.
				// Takes a Tumblr Post Object (get it using Fetch.)
				
				var m_object = new Object();
				
				m_object.form_key = XKit.interface.form_key();
				m_object.channel_id = tumblr_object.post_tumblelog.name_or_id;
				m_object.context_id = tumblr_object.post_tumblelog.name_or_id;
				m_object.post_id = tumblr_object.post.id;
				
				m_object.edit = true;
				m_object.safe_edit = true; // whatever the fuck this is.
				m_object.errors = false;
				m_object.message = "Post edited on " + m_object.channel_id;
				m_object.silent = true;
				m_object.post_context_page = "dashboard";
				m_object.editor_type = "rich";
				
				// m_object.post = new Object();
				
				/*
				
					{
						"form_key": "----", --OK
						"channel_id": "xenix", -- OK
						"post_id": "58790345774", -- OK
						"edit": true, -- OK
						"safe_edit": true, -- OK
						"errors": false, -- OK
						"created_post": true, -- OK
						"context_page": "dashboard", -- OK
						"post_context_page": "dashboard", --- OK
						"message": "Post edited on xenix", --- OK
						"silent": true, --- OK
						"context_id": "xenix", --- OK
						"editor_type": "rich", --- OK
						"is_rich_text[one]": "0",
						"is_rich_text[two]": "1",
						"is_rich_text[three]": "0",
						"post[slug]": "", --- OK
						"post[date]": "Aug 20th, 2013 5:44pm",
						"MAX_FILE_SIZE": "10485760",
						"post[type]": "photo",	--- OK
						"post[two]": "", --- OK
						"post[tags]": "omg,hahah", --- OK
						"post[state]": "0", --- OK
						"post[photoset_layout]": "1",
						"post[photoset_order]": "o1",
						"images[o1]": ""
					}
				
				*/
				
				m_object.post = tumblr_object.post;
				
				m_object['post[type]'] = tumblr_object.post.type;
				
				if (tumblr_object.post.type === "regular") {
					m_object['post[one]'] = tumblr_object.post.one;
				}
				
				m_object['post[two]'] = tumblr_object.post.two;
				
				if (tumblr_object.post.type !== "photo" && tumblr_object.post.type !== "photoset") {
					if (typeof tumblr_object.post.three !== "undefined") {
						m_object['post[three]'] = tumblr_object.post.three;
					}
				}
				
				var m_tags = tumblr_object.post.tags;
				if (typeof m_tags === "undefined" || m_tags === "null") { m_tags = ""; }
				
				m_object['post[tags]'] = m_tags;	
				m_object['post[slug]'] = tumblr_object.post.slug;	
				
				if (tumblr_object.post.type === "photo" || tumblr_object.post.type === "photoset") {
				
					// This is retarded but it's whatever.
				
					m_object['post[photoset_layout]'] = "\"" + tumblr_object.post.photoset_layout + "\"";
				
					var m_photos = "";
					for (var photo in tumblr_object.post.photos) {
						if (m_photos === "") {
							m_photos = tumblr_object.post.photos[photo].id;
						} else {
							m_photos = m_photos + "," + tumblr_object.post.photos[photo].id;
						}
						m_object['images[' + tumblr_object.post.photos[photo].id + ']'] = "";
					}
				
					m_object['post[photoset_order]'] = m_photos;
					
				
				}
				
				var m_state = tumblr_object.post.state;
				if (isNaN(tumblr_object.post.state) === false) {
					m_state = tumblr_object.post.state.toString();
				}
				m_object['post[state]'] = m_state;
				
				// Not sure about this part:
				m_object["is_rich_text[one]"] = "0";
				m_object["is_rich_text[two]"] = "1";
				m_object["is_rich_text[three]"] = "0";

				m_object.created_post = tumblr_object.created_post;
				m_object.context_page = tumblr_object.post_context_page;
				m_object.post_context_page = tumblr_object.post_context_page;
				m_object.silent = false;
				m_object.errors = false;
				
				m_object.edit = true;
				
				var to_return = new Object();
				
				to_return.error = false;
				to_return.error_message = "";
				to_return.status = 200;
				to_return.data = "";

				XKit.interface.kitty.get(function(kitty_data) {

					if (kitty_data.errors === true) {

						// We fucked up. Let's try again.
						if (retry_mode === false) {
							XKit.interface.edit(tumblr_object, func, true);
						} else {

							to_return.error = true;
							to_return.status = response.status;
				
							if (response.status === 401) {
								to_return.message = "Permission Denied";
							} else {
								if (response.status === 404) {
									to_return.message = "Post Not Found";
								} else {
									to_return.message = "Unknown";
								}
							}
						
							func(to_return);

						}
		
						return;

					}
				
					GM_xmlhttpRequest({
						method: "POST",
						url: "http://www.tumblr.com/svc/post/update",
						data: JSON.stringify(m_object),
						json: true,
						headers: { 
							"X-tumblr-puppies": kitty_data.kitten,
							"X-tumblr-form-key": XKit.interface.form_key(),
						},
						onerror: function(response) {
							
							XKit.interface.kitty.set(response.getResponseHeader(""));
							to_return.error = true;
							to_return.status = response.status;
				
							if (response.status === 401) {
								to_return.message = "Permission Denied";
							} else {
								if (response.status === 404) {
									to_return.message = "Post Not Found";
								} else {
									to_return.message = "Unknown";
								}
							}
						
							func(to_return);

						},
						onload: function(response) {

							XKit.interface.kitty.set(response.getResponseHeader("X-tumblr-kittens"));						

							try {
								to_return.data = jQuery.parseJSON(response.responseText);
								func(to_return);
							} catch(e) {
								to_return.error = true;
								to_return.error_message = "Error parsing JSON";	
								func(to_return);
							}
						
						}
					});
				
				});
				
			},
			
			fetch: function(post_object, func, reblog_mode) {
				
				// Fetches internal Tumblr object for a post, then calls callback (func)
				// You need to feed this an Interface Post Object.
				
				var m_object = new Object();
				
				m_object.form_key = XKit.interface.form_key();

				if (reblog_mode === true) {
					m_object.post_type = false; // Not sure why.
					m_object.reblog_key = post_object.reblog_key;
					m_object.reblog_id = post_object.id;
					m_object.channel_id = post_object.owner;
				} else {
					m_object.post_type = false; // Not sure why.
					m_object.post_id = post_object.id;
					m_object.channel_id = post_object.owner;
				}

				var to_return = new Object();
				
				to_return.error = false;
				to_return.error_message = "";
				to_return.status = 200;
				to_return.data = "";
				
				GM_xmlhttpRequest({
					method: "POST",
					url: "http://www.tumblr.com/svc/post/fetch",
					data: JSON.stringify(m_object),
					json: true,
					onerror: function(response) {
						
						to_return.error = true;
						to_return.status = response.status;
				
						if (response.status === 401) {
							to_return.message = "Permission Denied";
						} else {
							if (response.status === 404) {
								to_return.message = "Post Not Found";
							} else {
								to_return.message = "Unknown";
							}
						}
						
						func(to_return);

					},
					onload: function(response) {
						
						try {
							to_return.data = jQuery.parseJSON(response.responseText);
							func(to_return);
						} catch(e) {
							to_return.error = true;
							to_return.error_message = e.message;	
							func(to_return);
						}
						
					}
				});	
				
			},
			
			switch_control_button: function(obj, working) {
				
				// Switches control button between "working" and normal.
				
				if (working) {
					$(obj).addClass("xkit-interface-working");	
				} else {
					$(obj).removeClass("xkit-interface-working");
				}
				
				
			},
			
			disable_control_button: function(obj, disabled) {
				
				// Switches control button between disabled and normal.
				
				if (disabled) {
					$(obj).addClass("xkit-interface-disabled");	
				} else {
					$(obj).removeClass("xkit-interface-disabled");
				}
				
				
			},
			
			completed_control_button: function(obj, completed) {
				
				// Switches control button between normal and "green/completed"
				
				if (completed) {
					$(obj).addClass("xkit-interface-completed");	
				} else {
					$(obj).removeClass("xkit-interface-completed");
				}
				
				
			},
			
			create_control_button: function(class_name, icon, text, func, ok_icon) {
				
				XKit.interface.added_icon.push(class_name);
				XKit.interface.added_icon_icon.push(icon);
				XKit.interface.added_icon_text.push(text);
				
				XKit.tools.add_css("." + class_name + ":after {" + 
							" background-image: url('" + icon + "') !important;" +
							" background-size: auto auto !important;" +
							" margin-top: -9px !important; " +
						   "}", "xkit_interface_icon___" + class_name);
						   
				if (typeof ok_icon !== "undefined") {
					XKit.tools.add_css("." + class_name + ".xkit-interface-completed:after {" + 
							" background-image: url('" + ok_icon + "') !important;" +
							" background-size: auto auto !important;" +
							" opacity: 1 !important; " +
						   "}", "xkit_interface_icon___completed___" + class_name);
				}
						   
				$(document).on('click', '.' + class_name, function() {
					if ($(this).hasClass("xkit-interface-working") ||$(this).hasClass("xkit-interface-disabled")) { return; }
					if (typeof func === "function") { func.call(this, event); }	
				});
				
			},
			
			add_control_button: function(obj, class_name, additional) {
				
				if (typeof additional == "undefined") {additional = ""; }
				
				if (XKit.interface.added_icon.indexOf(class_name) === -1) {
					XKit.console.add("Interface -> Can't add icon, button not created, use create_control_button.");
					return;	
				}
				
				var m_text = XKit.interface.added_icon_text[XKit.interface.added_icon.indexOf(class_name)];
		
				var post_obj = XKit.interface.post(obj);
				
				var post_id = post_obj.id;
				var post_type = post_obj.type;
				var post_permalink = post_obj.permalink;
				
				var m_data = "data-post-id = \"" + post_id + "\" data-post-type=\"" + post_type + "\" data-permalink=\"" + post_permalink + "\"";
				
				var m_html = "<div " + m_data + " title=\"" + m_text + "\" class=\"xkit-interface-control-button post_control post_control_icon " + class_name + "\" " + additional + "></div>";

				
	  			if ($(obj).find(".post_controls_inner").length > 0) {
					$(obj).find(".post_controls_inner").prepend(m_html);
	  			} else {
					$(obj).find(".post_controls").prepend(m_html);
	  			}				
				
			},
			
			get_posts: function(without_tag, mine) {
				
				var to_return = new Array();
				
				var selector = ".post";
				
				if (mine === true) {
					selector = ".post.is_mine";	
				}
				
				if (typeof without_tag !== "undefined") {
					
					$(selector).not(".new_post_buttons").not("." + without_tag).each(function() {
						to_return.push($(this));	
					});	
					
				} else {
				
					$(selector).not(".new_post_buttons").each(function() {
						to_return.push($(this));	
					});	
				
				}
				
				return to_return;
				
			},
			
			find_post: function(post_id) {
				
				// Return a post object based on post ID.

				if ($("body").find("#post_" + post_id).length > 0) {
					return XKit.interface.post($("#post_" + post_id));
				} else {
					var m_error = new Object();
					m_error.error = true;
					m_error.error_message = "Object not found on page.";
					return m_error;	
				}	
				
			},
			
			post: function(obj) {
				
				var m_return = new Object();
				
				if (typeof $(obj).attr('data-post-id') == "undefined") {
					// Something is wrong.
					m_return.error = true;
					return;	
				}
				
				m_return.error = false;
				
				m_return.id = $(obj).attr('data-post-id');
				m_return.root_id = $(obj).attr('data-root-id');
				m_return.reblog_key = $(obj).attr('data-reblog-key');
				m_return.owner = $(obj).attr('data-tumblelog-name');
				m_return.tumblelog_key = $(obj).attr('data-tumblelog-key');
				
				m_return.liked = $(obj).find(".post_control.like").hasClass("liked");
				m_return.permalink = $(obj).find(".post_permalink").attr('href');
				
				m_return.type = $(obj).attr('data-type');
				
				if ($(obj).find(".post_body").length > 0) {
					m_return.body = $(obj).find(".post_body").html();
				} else {
					if ($(obj).find(".post_content_inner").length > 0) {
						m_return.body = $(obj).find(".post_content_inner").html();
					} else {
						m_return.body = "";	
					}	
				}
				m_return.animated = $(obj).hasClass("is_animated");
				m_return.is_reblogged = $(obj).hasClass("is_reblog");
				m_return.is_mine = $(obj).hasClass("is_mine");
				m_return.is_following = ($(obj).attr('data-following-tumblelog') === true);
				
				if (m_return.is_reblogged) {
				
					try {
					
						m_return.reblog_link = $(obj).find(".reblog_source").find("a").first().attr('href');
						m_return.reblog_owner = $(obj).find(".reblog_source").find("a").first().text();
						m_return.reblog_original_id = m_return.reblog_link.split('/')[4];
						
					} catch(e) {
						
						
					}
					
				}
				
				var n_count = 0;
				
				if ($(obj).find(".note_link_current").length > 0) {
			  		if ($(obj).find(".note_link_current").html() == "") {
	  					n_count = 0;
	  				} else {
	  					n_count = $(obj).find(".note_link_current").html().replace(/\D/g,'');	
	  				}
	  			}	
				
				m_return.note_count = n_count;
				
				m_return.avatar = $(obj).find(".post_avatar_image").attr('src');
				
				m_return.tags = "";
				if ($(obj).find(".post_tags").length > 0) {
					var to_return = "";
					$(obj).find(".post_tags").find(".post_tag").each(function() {
						if ($(this).hasClass("post_ask_me_link") === true) { return; }
						var m_tag = $(this).html().substring(1);
						if (to_return === "") {
							to_return = m_tag;	
						} else {
							to_return = to_return + "," + m_tag;	
						}
					});
					m_return.tags = to_return;
				}
				
				return m_return;
				
			},
			
			form_key: function() {
				
				var to_return = $("body").attr('data-form-key');
			
				if (typeof to_return === "undefined" ||to_return === "") {
					console.log(" --- XKit Interface: Form Key could not be fetched, using stored one.");
					to_return = window.atob(XKit.storage.get("xkit_patches", "last_stored_form_key", ""));
				} else {
					console.log(" --- XKit Interface: Got form key, storing that one.");
					XKit.storage.set("xkit_patches", "last_stored_form_key", window.btoa(to_return));
				}
				return to_return;	
				
			},
			
			check_key: function() {
				
				return $("body").attr('data-form-key') + $("body").attr('data-form-key');	
				
			},
			
			user: function() {
				
				var m_return = new Object();
				
				if ($("#dashboard_controls_open_blog").find(".posts").find(".count").length > 0) {
					m_return.posts = parseInt($("#dashboard_controls_open_blog").find(".posts").find(".count").html().replace(",",""));
				} else {
					m_return.posts = 0;	
				}	
				
				if ($("#dashboard_controls_open_blog").find(".followers").find(".count").length > 0) {
					m_return.followers = parseInt($("#dashboard_controls_open_blog").find(".followers").find(".count").html().replace(",",""));
				} else {
					m_return.followers = 0;	
				}
				
				if ($("#dashboard_controls_open_blog").find(".drafts").find(".count").length > 0) {
					m_return.drafts = parseInt($("#dashboard_controls_open_blog").find(".drafts").find(".count").html().replace(",",""));
				} else {
					m_return.drafts = 0;	
				}	
				
				if ($("#dashboard_controls_open_blog").find(".queue").find(".count").length > 0) {
					m_return.queue = parseInt($("#dashboard_controls_open_blog").find(".queue").find(".count").html().replace(",",""));
				} else {
					m_return.queue = 0;	
				}	
				
				return m_return;	
				
			},
			
			where: function() {
				
				var m_return = new Object();
				
				m_return.inbox = false;	
				if ($("body").hasClass("dashboard_messages_inbox") === true || $("body").hasClass("dashboard_messages_submissions") === true) {
					m_return.inbox = true;
				} else {
					if (document.location.href.indexOf("www.tumblr.com/inbox") !== -1) {
						m_return.inbox = true;	
					} else {
						if (document.location.href.indexOf("www.tumblr.com/blog/") !== -1) {
							var m_array = document.location.href.split("/");
							if (m_array[5] === "messages") {
								m_return.inbox = true;	
							}
						}
					}
				}
				
				m_return.user_url = "";
				
				m_return.activity = false;
				if ($("body").hasClass("notifications_index") === true) {
					m_return.activity = true;
				} else {
					if (document.location.href.indexOf("www.tumblr.com/blog/") !== -1) {
						var m_array = document.location.href.split("/");
						if (m_array[5] === "activity") {
							m_return.activity = true;
							m_return.user_url = m_array[4].replace("#","");	
						}
					}
				}
				
				m_return.queue = false;
				if ($("body").hasClass("dashboard_post_queue") == true) {
					m_return.queue = true;
				} else {
					if (document.location.href.indexOf("www.tumblr.com/blog/") !== -1) {
						var m_array = document.location.href.split("/");
						if (m_array[5] === "queue") {
							m_return.queue = true;	
							m_return.user_url = m_array[4].replace("#","");
						}
					}
				}
				
				m_return.drafts = false;
				if ($("body").hasClass("dashboard_drafts") == true) {
					m_return.drafts = true;
				} else {
					if (document.location.href.indexOf("www.tumblr.com/blog/") !== -1) {
						var m_array = document.location.href.split("/");
						if (m_array[5] === "drafts") {
							m_return.drafts = true;	
							m_return.user_url = m_array[4].replace("#","");
						}
					}
				}
				
				m_return.followers = false;
				if ($("body").hasClass("dashboard_useraction_followers") == true) {
					m_return.followers = true;
				} else {
					if (document.location.href.indexOf("www.tumblr.com/blog/") !== -1) {
						var m_array = document.location.href.split("/");
						if (m_array[5] === "followers") {
							m_return.followers = true;
							m_return.user_url = m_array[4].replace("#","");	
						}
					}
				}
				
				if (document.location.href.indexOf("www.tumblr.com/blog/") !== -1) {
					var m_array = document.location.href.split("/");
					if (m_array[3] === "blog") {
						m_return.user_url = m_array[4].replace("#","");	
					}
				}
				
				m_return.dashboard = $("body").hasClass("is_dashboard") === true;	
				m_return.channel = $("body").hasClass("is_channel") === true;

				m_return.endless = $("body").hasClass("without_auto_paginate") === false;

				return m_return;	
				
			}
			
		});
		
		XKit.init = function() {
	
			// Check page then return control to init_extension.
			if (document.location.href.indexOf('http://www.tumblr.com/xkit_reset') !== -1 || 
				document.location.href.indexOf('http://www.tumblr.com/xkit_log') !== -1 || 
				document.location.href.indexOf('http://www.tumblr.com/xkit_editor') !== -1 || 
				document.location.href.indexOf('http://www.tumblr.com/xkit_update=') !== -1) {
				XKit.page.xkit = true;
				XKit.init_extension();
				return;
			}
			XKit.init_flags();
			if (top === self && document.location.href.indexOf("http://www.tumblr.com/dashboard/iframe?") === -1) { 
				XKit.page.standard = true;
				XKit.init_extension();
			} else { 
				XKit.console.add("In IFRAME, location: " + document.location.href);
				if (document.location.href.indexOf("http://www.tumblr.com/send") === -1) { 
					XKit.page.standard = true;
				}
				if (document.location.href.indexOf("http://www.tumblr.com/dashboard/iframe?") !== -1) {
					XKit.page.blog_frame = true;
				}
				if (document.location.href.indexOf("http://www.tumblr.com/ask_form/") !== -1) {
					XKit.page.ask_frame = true;
				}
				XKit.init_extension();
			}
		};
		
		// New Post Listener for Posts_v2
		XKit.post_listener.check = function(no_timeout) {
			if ($("#posts").length === 0) {
				return;
			}
			var post_count = $("#posts .post").length;
			if (no_timeout === true) { post_count = -1; }
			if (XKit.post_listener.count === 0) {
				XKit.post_listener.count = post_count;
			} else {
				if (post_count !== XKit.post_listener.count) {
					XKit.post_listener.count = post_count;
					XKit.post_listener.run_callbacks();
				}
			} 
			if (no_timeout !== true) {
				setTimeout(XKit.post_listener.check, 3500);
			}
		};
		
		if ($(".search_control.post_layout").length > 0) {
			
			setTimeout(function() { XKit.post_listener.check(true); }, 400);
			
		}

		// Increasing storage for extensions from 50kb to 150kb.
		XKit.storage.max_area_size = 153600;

		// Patch notifications adder
		XKit.notifications.add = function(message, type, sticky, callback) {

				//alert($("#xkit-notifications").length);
				if($("#xkit-notifications").length <= 0) {
					setTimeout(function() { XKit.notifications.add(message,type,sticky,callback); }, 500);
					return;
				}

				XKit.notifications.count++;
			
				var m_class = "";
				if (type === "mail") { m_class = "notification-mail"; }
				if (type === "ok") { m_class = "notification-ok"; }
				if (type === "error") { m_class = "notification-error"; }
				if (type === "warning") { m_class = "notification-warning"; }
			
				if (sticky === true) {
					m_class = m_class + " sticky";
				}
			
				var m_html = 	"<div class=\"xkit-notification " + m_class + "\" id=\"xkit_notification_" + XKit.notifications.count + "\">" + 
									message + 
								"</div>";
			
				$("#xkit-notifications").append(m_html);
			
				XKit.console.add(" Notification > " + message);
			
				var m_notification_id = XKit.notifications.count;
				setTimeout(function() {
					$("#xkit_notification_" + m_notification_id).slideDown('slow');
				}, 100);
				$("#xkit_notification_" + m_notification_id).click(function() {
					if(typeof callback !== undefined) {
						try { 
							callback();
						} catch(e) {
							// Meh.
						}
					}
					$("#xkit_notification_" + m_notification_id).slideUp('slow');
				});
				if (sticky !== true) {
					setTimeout(function() {
						$("#xkit_notification_" + m_notification_id).slideUp('slow');
					}, 5000);
				}
			};

	},

	destroy: function() {
		console.log = XKit.log_back;
		XKit.tools.remove_css("xkit_patches");
		this.running = false;
	}
	
});