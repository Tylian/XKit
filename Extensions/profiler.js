//* TITLE Profiler **//
//* VERSION 1.1 REV A **//
//* DESCRIPTION The User Inspection Gadget **//
//* DETAILS Select Profiler option from the User Menu to see information such as when they started blogging, how many posts they have, timezone, and more.<br><br>Requires User Menus+ to be installed. **//
//* DEVELOPER STUDIOXENIX **//
//* FRAME false **//
//* BETA false **//

XKit.extensions.profiler = new Object({

	running: false,
	
	preferences: {
		"show_nicknames": {
			text: "Show Nicknames / Descriptions on Dashboard",
			default: true,
			value: true,
			slow: true
		}
	},
	
	add_nicks: function() {
		
		var posts = XKit.interface.get_posts("profiler-nicknamed");

		$(posts).each(function() {
			
			$(this).addClass("profiler-nicknamed");
			
	  		var m_post = XKit.interface.post($(this));
	  		
	  		if (XKit.interface.where().inbox !== true) {
	  			if (m_post.is_mine === true) { return; }
	  		}
	  		
	  		console.log(m_post);
	  		
	  		var post_owner = m_post.owner;
	  		
	  		if (m_post.type === "note" && XKit.interface.where().inbox === true) {
	  			var m_json_info = $(this).find(".post_avatar_link").attr('data-tumblelog-popover');
	  			try {
	  				var m_json_obj = JSON.parse(m_json_info);
	  				post_owner = m_json_obj.name;
	  			} catch(e) {
	  				return;	
	  			}	
	  		}
	  		
	  		var m_storage = XKit.storage.get("profiler","nick-for--" + post_owner, "");
	  		
	  		if (m_storage === "") { return; }
	  			  		
	  		var name_div_container;
	  		var name_div;

	  		if ($(this).find(".post_info_fence").length > 0) {
	  			name_div_container = $(this).find(".post_info_fence");
	  		} else {
	  			name_div_container = $(this).find(".post_info");
	  		}
	  		
	  		if (name_div_container.find("a").length > 0) {
	  			name_div = name_div_container.find("a").first();
	  			$(name_div).after("<span class=\"xkit-profiler-nickname\">(" + m_storage + ")</div>");
	  		} else {
	  			name_div = name_div_container;
	  			$(name_div).append("<span class=\"xkit-profiler-nickname\">(" + m_storage + ")</div>");
	  		}
			
		});	
		
	},
	
	redo_nicks: function() {
		
		$(".post .xkit-profiler-nickname").remove();
		$(".post.profiler-nicknamed").removeClass("profiler-nicknamed");
		XKit.extensions.profiler.add_nicks();
		
	},

	run: function() {
		this.running = true;
	
		XKit.tools.init_css("profiler");	
		//XKit.extensions.profiler.show("xenixlet");
		
		if (XKit.extensions.profiler.preferences.show_nicknames.value === true) {
		
			XKit.post_listener.add("profiler", XKit.extensions.profiler.add_nicks);
			XKit.extensions.profiler.add_nicks();		
			
		}
		
		if (typeof XKit.extensions.show_more === "undefined") {
			XKit.extensions.profiler.show_ump_error();
			return;
		} else {
		
			setTimeout(function() {
			
				if (XKit.extensions.show_more.running !== true) {
					XKit.extensions.profiler.show_ump_error();
					return;	
				} else {
	
                			if (XKit.extensions.show_more.preferences.use_classic_menu.value === true) {

                				XKit.extensions.show_more.add_custom_menu("profiler", function(data) {
                			
                					console.log(data);
                					var user_url = data.name;
                					
							$(document).off("click", ".xkit-profiler-button-" + user_url, XKit.extensions.profiler.menu_clicked);
							$(document).on("click", ".xkit-profiler-button-" + user_url, XKit.extensions.profiler.menu_clicked);
		
							return "<div data-url=\"" + user_url + "\" class=\"xkit-profiler-button-" + user_url + " xkit-profiler\">Profiler</div>";		

                				});	
                			
                			} else {
                				
                				XKit.extensions.show_more.add_custom_menu("profiler", function(data) {
                				
                					console.log("******************************");
                					console.log(data);
                					console.log("******************************");
                					var user_url = data.name;
                					
							$(document).off("click", ".xkit-profiler-button-" + user_url, XKit.extensions.profiler.menu_clicked);
							$(document).on("click", ".xkit-profiler-button-" + user_url, XKit.extensions.profiler.menu_clicked);
							
							return "<li>" +
                						"<a data-url=\"" + user_url + "\" class=\"xkit-profiler-button-" + user_url + " xkit-profiler xkit-new-menu-fix\">" +
                							"<span class=\"hide_overflow\">Profiler</span>" +
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

		if (!m_object.hasClass("xkit-profiler")) {

			while (!m_object.hasClass("xkit-profiler")) {
				m_object = m_object.parent();
			}			
			
		}
		
		$(".tumblelog_popover_glass").trigger('click');
		setTimeout(function() { $(".tumblelog_popover_glass").trigger('click'); }, 10);
		$(".popover").hide();
		XKit.extensions.show_more.hide_classic_menu();
		
		var user_url = $(m_object).attr('data-url');	
		
		XKit.extensions.profiler.show(user_url);
		
	},
	
	window_id: "",
	
	show: function(user_url) {
		
		var m_window_id = XKit.tools.random_string();
		XKit.extensions.profiler.window_id = m_window_id;
		
		var m_html = 	"<div id=\"xkit-profiler-contents\" class=\"nano\">" +
					"<div id=\"xkit-profiler-text\" class=\"content\">" +
						"<div class=\"xkit-profiler-line separator\">" +
							"Blog Information" +
						"</div>" +
						"<div class=\"xkit-profiler-line\">" +
							"Title" +
							"<div id=\"xkit-profiler-title\"></div>" +
						"</div>" +
						"<div class=\"xkit-profiler-line\">" +
							"Nickname / Description" +
							"<div id=\"xkit-profiler-nickname\"></div>" +
						"</div>" +
						"<div class=\"xkit-profiler-line\">" +
							"Blogging Since" +
							"<div id=\"xkit-profiler-since\"></div>" +
						"</div>" +
						"<div class=\"xkit-profiler-line\">" +
							"Timezone" +
							"<div id=\"xkit-profiler-timezone\"></div>" +
						"</div>" +
						"<div class=\"xkit-profiler-line\">" +
							"Is Following You?" +
							"<div id=\"xkit-profiler-is-following\"></div>" +
						"</div>" +
						"<div class=\"xkit-profiler-line separator\">" +
							"Posts" +
						"</div>" +
						"<div class=\"xkit-profiler-line\">" +
							"Total Posts" +
							"<div id=\"xkit-profiler-total\"></div>" +
						"</div>" +	
						"<div class=\"xkit-profiler-line\">" +
							"Text Posts" +
							"<div id=\"xkit-profiler-regular\"></div>" +
						"</div>" +
						"<div class=\"xkit-profiler-line\">" +
							"Photo / Photoset Posts" +
							"<div id=\"xkit-profiler-photo\"></div>" +
						"</div>" +
						"<div class=\"xkit-profiler-line\">" +
							"Chat Posts" +
							"<div id=\"xkit-profiler-chat\"></div>" +
						"</div>" +
						"<div class=\"xkit-profiler-line\">" +
							"Quote Posts" +
							"<div id=\"xkit-profiler-quote\"></div>" +
						"</div>" +
						"<div class=\"xkit-profiler-line\">" +
							"Audio Posts" +
							"<div id=\"xkit-profiler-audio\"></div>" +
						"</div>" +
						"<div class=\"xkit-profiler-line\">" +
							"Video Posts" +
							"<div id=\"xkit-profiler-video\"></div>" +
						"</div>" +
					"</div>" +
				"</div>";
				
		XKit.window.show("Profiler for " + user_url, m_html, "info", "<div id=\"xkit-profiler-close\" class=\"xkit-button default\">Close Window</div><div id=\"xkit-profiler-rename\" class=\"xkit-button\">Rename Person</div>");
		
		$(".xkit-profiler-line div").addClass("loading-up");
		
		$("#xkit-profiler-contents").nanoScroller();
		$("#xkit-profiler-contents").nanoScroller({ scroll: 'top' });
		
		$("body").css("overflow","hidden");
		
		$("#xkit-profiler-close").click(function() {
			
			XKit.window.close();
			$("body").css("overflow","auto");	
			
		});
		
		$("#xkit-profiler-rename").click(function() {
			
			var new_name = prompt("Enter a nickname/title/description for this person");
			
			if (new_name !== null) {
				XKit.storage.set("profiler","nick-for--" + user_url, new_name);
				$("#xkit-profiler-nickname").removeClass("loading-up").html(new_name);
			} else {
				console.log("Nothing entered.");	
			}
			
			XKit.extensions.profiler.redo_nicks();
			
		});
		
		var m_nickname = XKit.storage.get("profiler","nick-for--" + user_url, "");
		if (m_nickname === "") {
			$("#xkit-profiler-nickname").removeClass("loading-up").html("Not set");
		} else {
			$("#xkit-profiler-nickname").removeClass("loading-up").html(m_nickname);	
		}
		
		var m_blogs = XKit.tools.get_blogs();
		for(i=0;i<m_blogs.length;i++) {
			if (m_blogs[i] !== "") {
				blog_id = m_blogs[i];
				break;	
			}	
		}
		
		$.ajax({
			type: "POST",
			url: "/check_if_user_is_friend",
			data: "tumblelog=" + blog_id + "&query=" + user_url,
		}).done(function( msg ) {
			if (XKit.extensions.profiler.window_id !== m_window_id) {return; }
			if (msg === "1") {
				// This user is following us!
				$("#xkit-profiler-is-following").removeClass("loading-up").html("Yes");
			} else {
				// Nope.
				$("#xkit-profiler-is-following").removeClass("loading-up").html("No");
			}
		});
		
		GM_xmlhttpRequest({
			method: "GET",
			url: "http://" + user_url + ".tumblr.com/archive/",
			json: false,
			onerror: function(response) {
				XKit.extensions.profiler.display_error(m_window_id);
				return;
			},
			onload: function(response) {
				
				if (XKit.extensions.profiler.window_id !== m_window_id) {return; }
				
				var last_year = $(".year .current_year", response.responseText).last().html();
				
				$("#xkit-profiler-since").removeClass("loading-up").html(last_year);
				
				XKit.extensions.profiler.get_json_p1(user_url, m_window_id);
				
			}
		});
		
	},
	
	get_json_p1: function(user_url, m_window_id) {
		
		GM_xmlhttpRequest({
			method: "GET",
			url: "http://" + user_url + ".tumblr.com/api/read/json",
			json: false,
			onerror: function(response) {
				console.log("Error getting page.");
				XKit.extensions.profiler.display_error(m_window_id);
				return;
			},
			onload: function(response) {
				
				if (XKit.extensions.profiler.window_id !== m_window_id) {return; }
				
				var data = response.responseText.substring(22, response.responseText.length - 2);
				
				try {
					data = JSON.parse(data);
				} catch(e) {
					console.log("Error parsing data.");
					XKit.extensions.profiler.display_error(m_window_id);
					return;
				}

				$("#xkit-profiler-total").removeClass("loading-up").html(data["posts-total"]);
				$("#xkit-profiler-timezone").removeClass("loading-up").html(data.tumblelog.timezone);
				$("#xkit-profiler-title").removeClass("loading-up").html(data.tumblelog.title);
				
				XKit.extensions.profiler.get_json_p2(user_url, m_window_id, 1);
				
			}
		});
		
	}, 
	
	get_json_p2: function(user_url, m_window_id, part) {
		
		var to_get = "";
		if (part === 1) { to_get = "regular"; }
		if (part === 2) { to_get = "photo"; }
		if (part === 3) { to_get = "quote"; }
		if (part === 4) { to_get = "link"; }
		if (part === 5) { to_get = "chat"; }
		if (part === 6) { to_get = "audio"; }
		if (part === 7) { to_get = "video"; }
		if (part === 8) { return; }
		
		GM_xmlhttpRequest({
			method: "GET",
			url: "http://" + user_url + ".tumblr.com/api/read/json?type=" + to_get,
			json: false,
			onerror: function(response) {
				console.log("Error getting page.");
				XKit.extensions.profiler.display_error(m_window_id);
				return;
			},
			onload: function(response) {
				
				if (XKit.extensions.profiler.window_id !== m_window_id) {return; }
				
				var data = response.responseText.substring(22, response.responseText.length - 2);
				
				try {
					data = JSON.parse(data);
				} catch(e) {
					console.log("Error parsing data.");
					XKit.extensions.profiler.display_error(m_window_id);
					return;
				}

				$("#xkit-profiler-" + to_get).removeClass("loading-up").html(data["posts-total"]);
				
				XKit.extensions.profiler.get_json_p2(user_url, m_window_id, (part + 1));
				
			}
		});
		
	}, 
	
	display_error: function(m_window_id) {
		
		if (XKit.extensions.profiler.window_id !== m_window_id) {return; }
		
		$("#xkit-profiler-contents").addClass("error-box");
		$("#xkit-profiler-contents").html("<div class=\"padding-top: 50px;\">Can't fetch blog information.<br/>Please try again later.</div>");
		$("#xkit-profiler-contents").nanoScroller();
		$("#xkit-profiler-contents").nanoScroller({ scroll: 'top' });	
		
	},
	
	show_ump_error: function() {
		
		if (XKit.storage.get("profiler","shown_warning_about_show_more","") !== "yass") {
			XKit.window.show("Oops: User Menus+ is missing.", "<b>Profiler requires User Menus+ extension to be installed and enabled in order to work.</b> Please download User Menus+ from the extension gallery and refresh the page to start using Profiler.","error","<div id=\"xkit-close-message\" class=\"xkit-button default\">OK</div>");
			XKit.storage.set("profiler","shown_warning_about_show_more","yass");
		}
		
	},

	destroy: function() {
		this.running = false;
              	try {
              		XKit.extensions.show_more.remove_custom_menu("profiler");		
              	} catch(e){
              		XKit.console.add("Can't remove custom menu, " + e.message);
              	}
	}

});