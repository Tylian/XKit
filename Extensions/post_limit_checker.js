//* TITLE Post Limit Checker **//
//* VERSION 0.1 REV A **//
//* DESCRIPTION Are you close to the limit? **//
//* DETAILS Shows you how many posts you can reblog today. **//
//* DEVELOPER STUDIOXENIX **//
//* FRAME false **//
//* BETA false **//

XKit.extensions.post_limit_checker = new Object({

	running: false,
	key: "vgXl8u0K1syFSAue6b9C7honIojHjC98i5WsBgSZ66HfqB0DKl",

	run: function() {
		this.running = true;
		
		XKit.tools.init_css("post_limit_checker");
		
		// if (XKit.interface.where().dashboard !== true && XKit.interface.where().channel !== true) { return; }
		if (XKit.interface.where().user_url === "") { return; }
		
		var xf_html = 	'<ul class="controls_section" id="post_limit_checker_ul">' + 
					'<li class="section_header selected">Post Limit</li>' +
					'<li class="no_push"><a href="#" onclick="return false;" id="post_limit_checker_view">' +
						'<div class="hide_overflow">Check Post Limit</div>' +
					'</a></li>' +
				'</ul>';
		
		if ($("#xstats_ul").length > 0) {
				
			xf_html = 	'<li class="no_push"><a href="#" onclick="return false;" id="post_limit_checker_view">' +
						'<div class="hide_overflow">Check Post Limit</div>' +
					'</a></li>';
					
			$("#xstats_ul").append(xf_html);	
			
		} else {
			
			$("ul.controls_section:eq(1)").before(xf_html);	
			
		}
		
		$("#post_limit_checker_view").click(function() { XKit.extensions.post_limit_checker.start(); });
		
		// this.get_time(0, []);
		
	},
	
	window_id: 0,
	
	start: function() {
		
		var shown_message = XKit.storage.get("post_limit_checker","shown_warning","");
		
		var m_html = 	"<div id=\"xkit-plc-list\" class=\"nano\"><div id=\"xkit-plc-list-content\" class=\"content\">" +
					"<div class=\"xkit-warning-plc-text\"><b>Deleted posts</b><br/>Deleted posts are count by Tumblr, but this tool can't count them. For example, if you've made 250 posts since the last reset but then deleted 50 of them, this tool will tell you that you have 50 more posts to go, but in reality you've already hit your post limit.</div>" +
					"<div class=\"xkit-warning-plc-text\"><b>Sideblogs</b><br/>Posts you've made on sideblogs also count, but this tool only checks posts made on the blog currently selected. So again, if you've made 200 posts on this blog, and 50 more on your sideblog, you've already hit the post limit, but this tool will tell you that you are allowed to make 50 more posts.</div>" +
					"<div class=\"xkit-warning-plc-text\"><b>Original photo posts</b><br/>There is a separate, 75 uploads per day limit for photo posts. This extension does not check for that.</div>" +
					"<div class=\"xkit-warning-plc-text\"><b>No Guarantee</b><br/>The XKit Guy is not making any guarantees about the reliability of this tool.</div>" +
				"</div></div>";
		
		XKit.window.show("Important!","Before beginning, please read the following carefully." + m_html,"warning","<div class=\"xkit-button default\" id=\"xkit-plc-continue\">Continue</div><div class=\"xkit-button default\" id=\"xkit-close-message\">Cancel</div>");
		
		$("#xkit-plc-list").nanoScroller();
		$("#xkit-plc-list").nanoScroller({ scroll: 'top' });
		
		$("#xkit-plc-continue").click(function() {

			XKit.extensions.post_limit_checker.window_id = XKit.tools.random_string();

			XKit.window.show("Please wait","Gathering the information I need..." + XKit.progress.add("post-limit-checker-progress"),"info");
		
			XKit.extensions.post_limit_checker.next(0, [], XKit.extensions.post_limit_checker.window_id);
		
		});
		
	},
	
	get_time: function(m_window_id, posts) {
		
		if (m_window_id !== XKit.extensions.post_limit_checker.window_id) { console.log("wrong window id. 03"); return; }
		
		XKit.download.page("ts.php?rnd=" + XKit.tools.random_string() + XKit.tools.random_string(), function(mdata) {
		
			console.log(mdata);
			
			if (mdata.server_down === true) { XKit.extensions.post_limit_checker.display_error(m_window_id, "751");return; }
			if (mdata.errors === "true") { XKit.extensions.post_limit_checker.display_error(m_window_id, "752"); return; }
			
			try {
				
				XKit.extensions.post_limit_checker.calculate(m_window_id, posts, mdata.time);
				
			} catch(e) {
				
				XKit.extensions.post_limit_checker.display_error(m_window_id, "759");
				console.log(e.message);
				
			}	
			
		});
		
	},
	
	calculate: function(m_window_id, posts, time) {
		
		// Calculate the date according to NY time.
		// To-do: DST calculations?
		var date = XKit.extensions.post_limit_checker.convert_timezone(time * 1000, -5);
		
		// Now we need to figure out when the next reset is.
		var next_reset = new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1, 0, 0, 0);
		
		var difference = (next_reset - date);
		var hours = Math.round((difference % 86400000) / 3600000);
		var minutes = Math.round(((difference % 86400000) % 3600000) / 60000);
		
		// Now get when the last reset was. Lazy coding.
		var last_reset = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0);
		
		var posts_since_reset = 0;
		
		for (var i=0;i<posts.length;i++) {
			
			var m_timestamp = XKit.extensions.post_limit_checker.convert_timezone(posts[i].timestamp * 1000, -5);
			
			if ((m_timestamp.getTime() <= next_reset.getTime() && m_timestamp.getTime() >= last_reset.getTime()))  {
				posts_since_reset++;	
			}
			
		}
		
		var remaining = 250 - posts_since_reset;

		var remaining_color = "#298a51";
		if (remaining <= 60) { remaining_color = "#de8c00"; }
		if (remaining <= 30) { remaining_color = "#ec0000"; }
		
		if (remaining === 0) { remaining = "None"; }
		
		var reset_str = hours + " hours and " + minutes + " minutes";
		if (hours === 0) {
			reset_str = minutes + " minutes";
		}
		if (minutes <= 1) {
			reset_str = "a few seconds";
		}
		if (hours >= 1 && minutes === 0) {
			reset_str = hours + " hours";
		}
		
		var m_html = 	"<div class=\"xkit-plc-division\">" +
					"<div class=\"xkit-plc-title\">Posts Made</div>" +
					"<div class=\"xkit-plc-value\">" + posts_since_reset + "</div>" +
				"</div>" +
				"<div class=\"xkit-plc-division\">" +
					"<div class=\"xkit-plc-title\">Posts Remaining</div>" +
					"<div class=\"xkit-plc-value\" style=\"font-weight: bold; color: " + remaining_color + "\">" + remaining + "</div>" +
				"</div>" +
				"<div class=\"xkit-plc-division\">" +
					"<div class=\"xkit-plc-title\">Next reset in</div>" +
					"<div class=\"xkit-plc-value\">" + reset_str + "</div>" +
				"</div>";
		
		XKit.window.show("Results", "Here is what I could gather:" + m_html, "info", "<div class=\"xkit-button default\" id=\"xkit-close-message\">OK</div>");
		
	}, 
	
	convert_timezone: function(time, offset) {
		
		// From:
		// http://www.techrepublic.com/article/convert-the-local-time-to-another-time-zone-with-this-javascript/
		
    		// create Date object for current location
    		d = new Date(time);
    		

    		// convert to msec
    		// add local time zone offset
    		// get UTC time in msec
    		utc = d.getTime() + (d.getTimezoneOffset() * 60000);

    		// create new Date object for different city
    		// using supplied offset
    		nd = new Date(utc + (3600000*offset));

    		// return time as a string
    		return nd;
    		
    	},
	
	next: function(page, posts, m_window_id) {

		if (m_window_id !== XKit.extensions.post_limit_checker.window_id) { console.log("wrong window id. 01"); return; }
		
		var offset = page * 20;
		
		GM_xmlhttpRequest({
			method: "GET",
			url: "http://api.tumblr.com/v2/blog/" + XKit.interface.where().user_url + ".tumblr.com/posts/?api_key=" + XKit.extensions.post_limit_checker.key + "&offset=" + offset + "&rnd=" + XKit.tools.random_string(),
			json: false,
			cache: false,
			onerror: function(response) {
				console.log("Error getting page.");
				XKit.extensions.post_limit_checker.display_error(m_window_id, "501");
				return;
			},
			onload: function(response) {
				
				if (XKit.extensions.post_limit_checker.window_id !== m_window_id) { console.log("wrong window id. 02"); return; }

				try {
					
					data = JSON.parse(response.responseText);
					
					for (var i=0;i<data.response.posts.length;i++) {
					
						// I would check the date here but I'm a lazy man.
						posts.push(data.response.posts[i]);

					}
					
					XKit.progress.value("post-limit-checker-progress", (posts.length / 2.5) - 10);
					
					if (posts.length >= 250 || data.response.posts.length == 0) {
						XKit.extensions.post_limit_checker.get_time(m_window_id, posts);
					} else {
						setTimeout(function() { XKit.extensions.post_limit_checker.next((page + 1), posts, m_window_id); }, 400);
					}
					
				} catch(e) {
					console.log("Error parsing page, " + e.message);
					XKit.extensions.post_limit_checker.display_error(m_window_id, "551");
					return;
				}

			}
		});
		
	},
	
	display_error: function(m_window_id, err_code) {
		
		if (XKit.extensions.post_limit_checker.window_id !== m_window_id) { return; }
		XKit.window.show("Oops.","An error prevented me from gathering the information needed.<br/>Please try again later.<br/>Code: \"XPLC" + err_code + "\"","error","<div id=\"xkit-close-message\" class=\"xkit-button default\">OK</div>");
		
	},

	destroy: function() {
		$("#post_limit_checker_ul").remove();
		$("#post_limit_checker_view").remove();
		this.running = false;
	}

});