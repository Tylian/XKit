//* TITLE TagViewer **//
//* VERSION 0.1 REV B **//
//* DESCRIPTION View post tags easily **//
//* DEVELOPER STUDIOXENIX **//
//* DETAILS This extension allows you to see what tags people added to a post while they reblogged it. It also provides access to the post, and to Tumblr search pages to find similar posts.<br><br>Based on the work of <a href='http://inklesspen.tumblr.com'>inklesspen</a> **//
//* FRAME false **//
//* BETA false **//
//* SLOW false **//

XKit.extensions.tagviewer = new Object({

	running: false,
	slow: false,
	apiKey: "fuiKNFp9vQFvjLNvx4sUwti4Yb5yGutBN4Xh10LXZhhRKjWlV4",

	run: function() {

		this.running = true;
		if (document.location.href.indexOf('http://www.tumblr.com/dashboard') !== -1 || document.location.href.indexOf('http://www.tumblr.com/blog/') !== -1) {
			XKit.tools.init_css("tagviewer");
			XKit.extensions.tagviewer.init();
				XKit.post_listener.add("tagviewer", XKit.extensions.tagviewer.do);
				XKit.extensions.tagviewer.do();
		}
		
	},

	init: function() {

		$(document).on("click", ".xkit_tagviewer_button", function(event) {
			var post_id = $(this).attr('data-xkit-tagviewer-post-id');
			var tumblelog_key = $(this).attr('data-xkit-tagviewer-tumblelog-key');
			var tumblelog_name = $(this).attr('data-xkit-tagviewer-tumblelog-name');
			XKit.extensions.tagviewer.view_tags(post_id, tumblelog_key, tumblelog_name);
		});

	},
	
	notes_url: "",
	notes_url_from: "",
	found_count: 0,
	last_page: false,
	loading_more: false,
	post_id: "",
	init_id: "",

	view_tags: function(post_id, tumblelog_key, tumblelog_name, from) {

		// Set tag viewer up and show our window.
		
		XKit.extensions.tagviewer.init_id = XKit.tools.random_string();
		XKit.extensions.tagviewer.found_count = 0;
		XKit.extensions.tagviewer.post_id = post_id;
		XKit.extensions.tagviewer.last_page = false;
		XKit.extensions.tagviewer.loading_more = false;
		XKit.extensions.tagviewer.notes_url_from = "";
		XKit.extensions.tagviewer.notes_url = "http://www.tumblr.com/dashboard/notes/" + post_id + "/" + tumblelog_key + "/" + tumblelog_name;
		
		XKit.console.add("tagviewer -> init_id is " + XKit.extensions.tagviewer.init_id);
		
		// Create our window.
		var m_html = "<div class=\"nano\" id=\"tagviewer-window-outer\">" +
				"<div class=\"content\" id=\"tagviewer-window\">" +
					"<div id=\"tagviewer-loading\">Loading, please wait...</div>" +
			     	"</div></div><div id=\"tagviewer-loader-icon\">&nbsp;</div>";
			     
		$("#tagviewer-window").unbind('scroll');
		XKit.window.show("", m_html, "", "<div id=\"xkit-close-message\" class=\"xkit-button\">Close</div>");
		XKit.extensions.tagviewer.load_tags();

	},
	
	load_tags_no_api: function() {
		
		// Load the next set of notes and tags.
		
		var m_url = XKit.extensions.tagviewer.notes_url;
		var m_init_id = XKit.extensions.tagviewer.init_id;
		
		if (XKit.extensions.tagviewer.notes_url_from !== "") {
			m_url += "?from_c=" + XKit.extensions.tagviewer.notes_url_from;	
		}
		
		var m_post_id = XKit.extensions.tagviewer.post_id;
		
    		$.ajax({
      			url: m_url,
      			dataType: 'html'
    		}).error(function() {
    		
    			XKit.window.close();
    			XKit.window.show("Unable to fetch required data", "TagViewer could not get the required data from Tumblr servers. Please try again later or <a href=\"http://xkit-extension.tumblr.com/ask/\">file a bug report</a> by going to the XKit Blog.","error","<div class=\"xkit-button default\" id=\"xkit-close-message\">OK</div>");
    			
    		}).done(function(data, textStatus, jqXHR) {
    			
    			if (m_post_id !== XKit.extensions.tagviewer.post_id || m_init_id !== XKit.extensions.tagviewer.init_id) { 
    				XKit.console.add("tagviewer -> quitting, wrong post_id or init_id");
    				return; 
    			}
      			
      			var next_note = jqXHR.getResponseHeader('X-next-note');

      			var notes = $($.parseHTML(data));    			
      			var reblogs = notes.find("li.reblog");

      			$(reblogs).each(function() {
      				
      				var post_url = $(this).find(".action").attr('data-post-url');
      				
      				var blog_username = $(this).attr('data-tumblelog');
      				var blog_name = post_url.split("/")[2];
      				var post_id = post_url.split("/")[4];
      				var blog_avatar = $(this).find("img.avatar").attr('src');
      				
      				// var api_url = "http://api.tumblr.com/v2/blog/" + blog_name + "/posts/text";
      				var api_url = "http://" + blog_name + "/api/read/json?id=" + post_id;
      				
      				GM_xmlhttpRequest({
					method: "GET",
					url: api_url,
					onerror: function(response) {
						XKit.console.add("tagviewer -> Can't fetch page " + api_url);
					},
					onload: function(response) {
						
    						if (m_post_id !== XKit.extensions.tagviewer.post_id || m_init_id !== XKit.extensions.tagviewer.init_id) { 
    							XKit.console.add("tagviewer -> quitting, wrong post_id or init_id");
    							return; 
    						}
    			
						var data = response.responseText.substring(22, response.responseText.length - 2);
						try {
							
							data = JSON.parse(data);
							var post = data.posts[0];
							
							if (typeof post.tags !== "undefined") {
  								if (post.tags.length > 0) {
      									XKit.extensions.tagviewer.add_tags(blog_username, post.tags, post_url, blog_avatar);
      									XKit.extensions.tagviewer.found_count++;
      								}
      							}
							
						} catch(e) {
							XKit.console.add("tagviewer -> Can't parse JSON at " + api_url + " -> " + e.message);
						}
						
						
					}
				});
      				
      			});
      			
      			if (next_note > 0) {
      				XKit.extensions.tagviewer.notes_url_from = next_note;
      				XKit.console.add("Another page found.");
      				if (XKit.extensions.tagviewer.found_count <= 7) {
      					XKit.console.add(" -- Not enough posts loaded, auto-loading..");
      					setTimeout(function() {
      						XKit.extensions.tagviewer.load_tags();
      					}, 1400);
      					XKit.extensions.tagviewer.show_loader();
      				} else {
      					XKit.extensions.tagviewer.hide_loader();
      					XKit.extensions.tagviewer.loading_more = false;
      					XKit.console.add(" -- Enough loaded, waiting for user to scroll down.");
      					XKit.extensions.tagviewer.activate_endless_scroll();	
      				}
      			} else {
      				if (XKit.extensions.tagviewer.found_count == 0) {
      					$("#tagviewer-loading").html("No posts with tags found.");
      				}
      				XKit.extensions.tagviewer.last_page = true;
      				XKit.console.add("Last page, quitting.");
      				XKit.extensions.tagviewer.hide_loader();	
      			}
		
      		});
		
	},
	
	load_tags: function() {
		
		// Load the next set of notes and tags.
		// This uses APIv2, which I do not have a key and can't gather
		// thanks to Tumblr's license agreement, which sounds like it was
		// written especially to prevent XKit from using it.
		
		XKit.extensions.tagviewer.load_tags_no_api();
		return;
		
		// v--- old code as follows:
		
		var m_url = XKit.extensions.tagviewer.notes_url;
		
		if (XKit.extensions.tagviewer.notes_url_from !== "") {
			m_url += "?from_c=" + XKit.extensions.tagviewer.notes_url_from;	
		}
		
    		$.ajax({
      			url: m_url,
      			dataType: 'html'
    		}).error(function() {
    		
    			XKit.window.close();
    			XKit.window.show("Unable to fetch required data", "TagViewer could not get the required data from Tumblr servers. Please try again later or <a href=\"http://xkit-extension.tumblr.com/ask/\">file a bug report</a> by going to the XKit Blog.","error","<div class=\"xkit-button default\" id=\"xkit-close-message\">OK</div>");
    			
    		}).done(function(data, textStatus, jqXHR) {
      			
      			var next_note = jqXHR.getResponseHeader('X-next-note');

      			var notes = $($.parseHTML(data));    			
      			var reblogs = notes.find("li.reblog");
      			
      			XKit.extensions.tagviewer.loading_more = false;
      			
      			if (next_note > 0) {
      				XKit.extensions.tagviewer.notes_url_from = next_note;
      				XKit.console.add("Another page found.");
      				if (XKit.extensions.tagviewer.found_count <= 10) {
      					XKit.console.add(" -- Not enough posts loaded, auto-loading..");
      					setTimeout(function() {
      						XKit.extensions.tagviewer.load_tags();
      					}, 1400);
      				} else {
      					XKit.console.add(" -- Enough loaded, waiting for user to scroll down.");
      					XKit.extensions.tagviewer.activate_endless_scroll();	
      				}
      			} else {
      				XKit.extensions.tagviewer.last_page = true;
      				XKit.console.add("Last page, quitting.");	
      			}

      			$(reblogs).each(function() {
      				
      				var post_url = $(this).find(".action").attr('data-post-url');
      				
      				var blog_username = $(this).attr('data-tumblelog');
      				var blog_name = post_url.split("/")[2];
      				var post_id = post_url.split("/")[4];
      				var blog_avatar = $(this).find("img.avatar").attr('src');
      				
      				var api_url = "http://api.tumblr.com/v2/blog/" + blog_name + "/posts/text";
      				
      				$.getJSON(api_url, {api_key: XKit.extensions.tagviewer.apiKey, id: post_id}, function(data) {
      					
      					try {
      					
      						var post = data.response.posts[0];
      						
      						if (post.tags.length > 0) {
      							XKit.extensions.tagviewer.add_tags(blog_username, post.tags, post_url, blog_avatar);
      							XKit.extensions.tagviewer.found_count++;
      						}
      						
      					} catch(e) {
      					
      						XKit.console.add("Can't load post at " + api_url + ": " + e.message);	
      						
      					}
      					
      				});
      				
      			});
		
      		}).get();
		
	},
	
	activate_endless_scroll: function() {
		
		$("#tagviewer-window").unbind('scroll');	
		$("#tagviewer-window").bind('scroll', function() {
			
			var c_height = 0;
			$("#tagviewer-window").children().each(function(){
    				c_height = c_height + $(this).outerHeight(true);
			});
			
			if($("#tagviewer-window").scrollTop() >= c_height - 400) {	
			
				if (XKit.extensions.tagviewer.loading_more) {return; }
				
				XKit.extensions.tagviewer.loading_more = true;
				XKit.extensions.tagviewer.found_count = 0;
				
				XKit.extensions.tagviewer.show_loader();
				
				$("#tagviewer-window-outer").nanoScroller();
				setTimeout(function() { XKit.extensions.tagviewer.load_tags();	}, 2000);
				
			}
			
		});
	
	},
	
	show_loader: function() {
		
		$("#tagviewer-loader-icon").css("display","block");	
		
	},
	
	hide_loader: function() {
		
		$("#tagviewer-loader-icon").css("display","none");	
		
	},
	
	add_tags: function(by, tags, link, avatar) {
		
		$("#tagviewer-loading").slideUp('slow', function() { $(this).remove(); });
		
		var m_html = "<div class=\"tagviewer-tag\">" +
				"<div class=\"tagviewer-by\">" +
					"<a target=\"_blank\" href=\"" + link + "\" class=\"tagviewer-by-link\">" + by + "</a>" +
					"<img class=\"tagviewer-by-avatar\" src=\"" + avatar + "\">" +
				"</div>" +
				"<div class=\"tagviewer-tag-tags\">";
		
		for (var i=0;i<tags.length;i++) {
			var formatted_tag = XKit.tools.replace_all(tags[i], " ", "+");
			m_html = m_html + "<a target=\"_blank\" href=\"http://www.tumblr.com/tagged/" + formatted_tag + "/\" class=\"tagviewer-tag-tag\">#" + tags[i] + "</a>";	
		}
		
		m_html = m_html + "</div></div>";
		
		if ($("#tagviever-mini-loader").length > 0) {
			$("#tagviewer-window").before(m_html);
		} else {
			$("#tagviewer-window").append(m_html);
		}
		
		$("#tagviewer-window-outer").nanoScroller();
		
	},

	do: function() {

		$(".post").not(".note").not(".xtagviewer_done").each(function() {
			
			$(this).addClass("xtagviewer_done");
			
	  		var post_id = $(this).attr('data-post-id');
	  		var tumblelog_key = $(this).attr('data-tumblelog-key');
	  		var tumblelog_name = $(this).attr('data-tumblelog-name');
	  		
	  		if ($(this).find(".note_link_current").length > 0) {
	  			if ($(this).find(".note_link_current").html() == "") {
	  				// This post has no notes, skip.
	  				return;	
	  			}
	  		}

	  		var m_html = "<a class=\"post_control post_control_icon xtagviewer_post_icon xkit_tagviewer_button\" data-xkit-tagviewer-post-id=\"" + post_id + "\" data-xkit-tagviewer-tumblelog-key=\"" + tumblelog_key + "\" data-xkit-tagviewer-tumblelog-name=\"" + tumblelog_name + "\" onclick=\"return false\">t</a>";
	  		
	  		if ($(this).find(".post_controls_inner").length > 0) {
				m_html = "<a class=\"post_control post_control_icon xtagviewer_post_icon xkit_new_dashboard xkit_tagviewer_button\" data-xkit-tagviewer-post-id=\"" + post_id + "\" data-xkit-tagviewer-tumblelog-key=\"" + tumblelog_key + "\" data-xkit-tagviewer-tumblelog-name=\"" + tumblelog_name + "\" onclick=\"return false\"></a>";
				$(this).find(".post_controls_inner").prepend(m_html);
	  		} else {
				$(this).find(".post_controls").prepend(m_html);
	  		}
	  		
		}); 

	},

	destroy: function() {
		$(".xtagviewer_post_icon").remove();
		XKit.tools.remove_css("tagviewer");
		XKit.post_listener.remove("tagviewer");
		this.running = false;
	}

});