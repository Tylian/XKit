//* TITLE Find Blogs **//
//* VERSION 1.1 REV B **//
//* DESCRIPTION Lets you find similar blogs **//
//* DEVELOPER STUDIOXENIX **//
//* FRAME false **//
//* BETA false **//

XKit.extensions.find_blogs = new Object({

	running: false,
	
	key: "vgXl8u0K1syFSAue6b9C7honIojHjC98i5WsBgSZ66HfqB0DKl",
	form_key: "",
	
	preferences: {
		"strip_following": {
			text: "Don't show the blogs I already follow (might take a long time)",
			default: false,
			value: false
		}
	},

	run: function() {
		this.running = true;
		
		XKit.tools.init_css("find_blogs");
		XKit.extensions.find_blogs.form_key = XKit.interface.form_key();
		
		if (typeof XKit.extensions.show_more === "undefined") {
			XKit.extensions.find_blogs.show_ump_error();
			return;
		} else {
		
			setTimeout(function() {
			
				if (XKit.extensions.show_more.running !== true) {
					XKit.extensions.find_blogs.show_ump_error();
					return;	
				} else {
	
                			if (XKit.extensions.show_more.preferences.use_classic_menu.value === true) {

                				XKit.extensions.show_more.add_custom_menu("find_blogs", function(data) {
                			
                					console.log(data);
                					var user_url = data.name;
                					
							$(document).off("click", ".xkit-find_blogs-button-" + user_url, XKit.extensions.find_blogs.menu_clicked);
							$(document).on("click", ".xkit-find_blogs-button-" + user_url, XKit.extensions.find_blogs.menu_clicked);
		
							return "<div data-url=\"" + user_url + "\" class=\"xkit-find_blogs-button-" + user_url + " xkit-find_blogs\">Find Blogs</div>";		

                				});	
                			
                			} else {
                				
                				XKit.extensions.show_more.add_custom_menu("find_blogs", function(data) {
                				
                					var user_url = data.name;
                					
							$(document).off("click", ".xkit-find_blogs-button-" + user_url, XKit.extensions.find_blogs.menu_clicked);
							$(document).on("click", ".xkit-find_blogs-button-" + user_url, XKit.extensions.find_blogs.menu_clicked);
							
							return "<li>" +
                						"<a data-url=\"" + user_url + "\" class=\"xkit-find_blogs-button-" + user_url + " xkit-find_blogs xkit-new-menu-fix\">" +
                							"<span class=\"hide_overflow\">Find Blogs</span>" +
                						"</a>" +
                			 		 "</li>";	

                				});	
                			
                			}
		
				}
			 
			}, 2000);
			
		}
		
		if (XKit.interface.where().user_url === "") { return; }
		
		xf_html = '<ul class="controls_section" id="find_blogs_ul">' + 
			'<li class="section_header selected">FIND BLOGS</li>' +
			'<li class="no_push"><a href="#" onclick="return false;" id="find_blogs_button">' +
				'<div class="hide_overflow">Similar to ' + XKit.interface.where().user_url + '<span class="sub_control link_arrow arrow_right"></span></div>' +
			'</a></li></ul>';
		$("ul.controls_section:eq(1)").before(xf_html);	
		
		$("#find_blogs_button").click(function() {
		
			XKit.extensions.find_blogs.show(XKit.interface.where().user_url);	
			
		});

	},
	
	menu_clicked: function(e) {
		
		var m_object = $(e.target);

		if (!m_object.hasClass("xkit-find_blogs")) {

			while (!m_object.hasClass("xkit-find_blogs")) {
				m_object = m_object.parent();
			}			
			
		}
		
		$(".tumblelog_popover_glass").trigger('click');
		setTimeout(function() { $(".tumblelog_popover_glass").trigger('click'); }, 10);
		$(".popover").hide();
		XKit.extensions.show_more.hide_classic_menu();
		
		var user_url = $(m_object).attr('data-url');	
		
		XKit.extensions.find_blogs.show(user_url);
	
	},
	
	window_id: -1,
	
	show: function(url, m_window_id) {
		
		var m_window_id = XKit.tools.random_string();
		XKit.extensions.find_blogs.window_id = m_window_id;
		
		$("body").append("<div id=\"xkit-find-blogs-background\">&nbsp;</div><div id=\"xkit-find-blogs-window\" class=\"xkit-find-blogs-loading\"><div id=\"xkit-find-blogs-inner\"><div id=\"xkit-find-blogs-text\">I'm thinking, please wait...</div>" + XKit.progress.add("find-blogs-progress") + "<div id=\"xkit-find-blogs-subtext\">I'm gathering information about this blog..</div></div></div>");
		
		var people = new Array();
		
		$("#xkit-find-blogs-background").click(function() {
			
			$("#xkit-find-blogs-background").fadeOut('slow', function() { $(this).remove(); });
			$("#xkit-find-blogs-window").fadeOut('fast', function() { $(this).remove(); });	
			XKit.extensions.find_blogs.window_id = -1;
			
		});
		
		XKit.extensions.find_blogs.fetch(url, 0, m_window_id, people);
		
	},
	
	is_in_array: function(arr, username) {
	
		for (var i=0;i<arr.length;i++) {
			if (arr[i].url === username) {
				return i;	
			}	
		}	
		
		return -1;
		
	},
	
	check_if_following: function(m_url, callback) {
		
		GM_xmlhttpRequest({
			method: "GET",
			url: "http://www.tumblr.com/svc/tumblelog_popover/" + m_url + "?is_user_mention=false&form_key=" + XKit.extensions.find_blogs.form_key,
			json: false,
			onerror: function(response) {
				callback(false, m_url);
			},
			onload: function(response) {
				try {
					data = JSON.parse(response.responseText);
					if (data.following === true) { return callback(true, m_url); } else { return callback(false, m_url); }
				} catch(e) {
					return callback(false, m_url);
				}
				return callback(false, m_url);
			}
		});	
		
	},
	

	calculate: function(m_url, m_window_id, people) {
		
		if (XKit.extensions.find_blogs.window_id !== m_window_id) {return; }
		
		var container = new Array();
		
		var people_backup = people;
		
		while (people.length > 0) {
			
			var current = people.pop();	
			
			if (current === m_url) { continue; }
			
			var m_index = XKit.extensions.find_blogs.is_in_array(container, current);
			
			if (m_index !== -1) {
				container[m_index].count++;
			} else {
				var m_object = new Object();
				m_object.url = current;
				m_object.count = 1;
				container.push(m_object);	
			}
			
		}
		
		console.log("old container length = " + container.length);
		
		for (var i=0;i<container.length;i++) {
			if (container[i].count <= 2) {
				if (container.length >= 100) {
					container.splice(i,1);	
				}	
			}
		}
		
		console.log("new container length = " + container.length);
		
		container.sort(function(a,b) { return b.count-a.count; } );
		
		try {
			
			var compiled_array = new Array();
			
			for (var obj in container) {
				console.log(container[obj].url + ": " + container[obj].count);
				compiled_array.push(container[obj].url);
			}
			
			$("#xkit-find-blogs-text").html("Thinking even more...");
			XKit.extensions.find_blogs.already_following = 0;
			
			if (XKit.extensions.find_blogs.preferences.strip_following.value === true) {
				XKit.extensions.find_blogs.strip_following(m_url, compiled_array, 0, new Array(), m_window_id);
			} else {
				XKit.extensions.find_blogs.show_results(m_url, compiled_array, m_window_id);
			}
			
		} catch(e) {
			console.log(e);	
		}
		
	},
	
	already_following: 0,
	
	strip_following: function(m_url, m_array, index, adjusted_array, m_window_id) {
		
		if (XKit.extensions.find_blogs.window_id !== m_window_id) { return; }
		
		if (index > m_array.length || adjusted_array.length >= 8) {
			XKit.extensions.find_blogs.show_results(m_url, adjusted_array, m_window_id);
			return;	
		}
		
		var m_perc = (index * 100) / m_array.length;
		XKit.progress.value("find-blogs-progress", m_perc);
		
		if (typeof m_array[index] === "undefined" || m_array[index].indexOf(".") !== -1) {
			XKit.extensions.find_blogs.strip_following(m_url, m_array, (index + 1), adjusted_array, m_window_id);
			return;
		}
		
		console.log("Checking for " + m_array[index] + " ||index = " + index + " of " + m_array.length);
		
		XKit.extensions.find_blogs.check_if_following(m_array[index], function(ret, url) {
			console.log("|--- Done for " + m_array[index] + ", result is " + ret);
			if (ret === false) {
				console.log("|--- not following, adding to adjusted_array");
				adjusted_array.push(url);
			} else {
				XKit.extensions.find_blogs.already_following++;
				console.log("|--- following, skipping.");
			}
			if (XKit.extensions.find_blogs.already_following > 0) {
				$("#xkit-find-blogs-subtext").html("hmm..  you already follow " + XKit.extensions.find_blogs.already_following + " people I found..");
			} else {
				$("#xkit-find-blogs-subtext").html("thinking hard to present you a good list..");
			}
			setTimeout(function() { XKit.extensions.find_blogs.strip_following(m_url, m_array, (index + 1), adjusted_array, m_window_id); }, 300);
		});
		
	},
	
	show_results: function(m_url, m_array, m_window_id) {
		
		if (XKit.extensions.find_blogs.window_id !== m_window_id) { return; }
		
		var m_html = "<div class=\"xkit-find-blogs-separator\"><div>Similar blogs to " + m_url + "</div></div><div class=\"xkit-find-blogs-blog-list\">";
		
		var m_count = 0;
		
		for (var i=0;i<m_array.length;i++){
			if (m_count >= 8) {break; }
			var mx_html = 	"<a target=\"_BLANK\" href=\"http://" + m_array[i] + ".tumblr.com/\"><div class=\"xkit-find-blogs-blog\">" +
						"<img src=\"http://api.tumblr.com/v2/blog/" + m_array[i] + ".tumblr.com/avatar/32\" class=\"m_avatar\">" +
						"<div class=\"m_title\">" + m_array[i] + "</div>" +
					"</div></a>";
			m_html = m_html + mx_html;	
			m_count++;
		}
		
		if (m_count <= 7) {
			for (var i=m_count;i<8;i++){	
				var mx_html = 	"<div class=\"xkit-find-blogs-blog xkit-empty-slot\">" +
							"<div class=\"m_title\">&nbsp;</div>" +
						"</div>";
				m_html = m_html + mx_html;					
			}
		}
		
		m_html = m_html + "</div>";
		
		$("#xkit-find-blogs-window.xkit-find-blogs-loading").removeClass("xkit-find-blogs-loading").html(m_html);
		
			
		
	},
		
	fetch: function(m_url, page, m_window_id, people) {
		
		if (XKit.extensions.find_blogs.window_id !== m_window_id) {return; }
		
		var max_page = 15;
		var offset = page * 20;
		
		var m_perc = (page * 100) / (max_page * 2);
		XKit.progress.value("find-blogs-progress", m_perc);
		
		if (page == max_page * 3) {XKit.extensions.find_blogs.calculate(m_url, m_window_id, people); return; }

		GM_xmlhttpRequest({
			method: "GET",
			url: "http://api.tumblr.com/v2/blog/" + m_url + ".tumblr.com/posts/?api_key=" + XKit.extensions.find_blogs.key + "&reblog_info=true&offset=" + offset,
			json: false,
			onerror: function(response) {
				console.log("Error getting page.");
				XKit.extensions.find_blogs.display_error(m_window_id, "101");
				return;
			},
			onload: function(response) {
				
				if (XKit.extensions.find_blogs.window_id !== m_window_id) {return; }

				try {
					data = JSON.parse(response.responseText);
					
					for (var i=0;i<data.response.posts.length;i++) {
						
						var m_post = data.response.posts[i];
						
						try {
							if (typeof data.response.posts[i].reblogged_from_name !== "undefined") {
								people.push(data.response.posts[i].reblogged_from_name);	
							}
							if (typeof data.response.posts[i].source_title !== "undefined") {
								people.push(data.response.posts[i].source_title);
							}
						} catch(e) {
							console.log("Can't read post, " + e.message);	
						}	
						
					}
					
					setTimeout(function() { XKit.extensions.find_blogs.fetch(m_url, (page + 3), m_window_id, people); }, 400);
					
				} catch(e) {
					console.log("Error parsing data: " + e.message);
					XKit.extensions.find_blogs.display_error(m_window_id, "102");
					return;
				}

			}
		});	
		
	},
	
	display_error: function(m_window_id, err_code) {
		
		if (XKit.extensions.find_blogs.window_id !== m_window_id) {return; }
		
		$("#xkit-find-blogs-background").remove();
		$("#xkit-find-blogs-window").remove();	
		
		XKit.window.show("Oops.","An error prevented Find Blogs from finding similar blogs.<br/>Please try again later.<br/>Code: \"FINB" + err_code + "\"","error","<div id=\"xkit-close-message\" class=\"xkit-button default\">OK</div>");
		
	},
	
	average: function(posts) {
		
		
		
	},

	show_ump_error: function() {
		
		if (XKit.storage.get("find_blogs","shown_warning_about_show_more","") !== "yass") {
			XKit.window.show("Oops: User Menus+ is missing.", "<b>Find Blogs requires User Menus+ extension to be installed and enabled in order to work.</b> Please download User Menus+ from the extension gallery and refresh the page to start using find_blogs.","error","<div id=\"xkit-close-message\" class=\"xkit-button default\">OK</div>");
			XKit.storage.set("find_blogs","shown_warning_about_show_more","yass");
		}
		
	},

	destroy: function() {
		this.running = false;
	}

});