//* TITLE Timestamps **//
//* VERSION 1.0 REV C **//
//* DESCRIPTION See when a post has been made. **//
//* DEVELOPER STUDIOXENIX **//
//* FRAME false **//
//* BETA false **//
//* SLOW true **//

XKit.extensions.timestamps = new Object({

	running: false,
	slow: true,

	preferences: {
		only_relative: {
			text: "Only show relative time (eg: 5 minutes ago)",
			default: false,
			value: false
		}
	},
	
	check_quota: function() {
	
		if (XKit.storage.quota("timestamps") <= 2000) {
			XKit.storage.clear("timestamps");
			if (XKit.extensions.timestamps.preferences.only_relative.value === true) {
				XKit.storage.set("timestamps", "extension__setting__only_relative", "true");
			}
		}	
		
	},

	run: function() {

		XKit.tools.init_css("timestamps");
		XKit.extensions.timestamps.check_quota();
		try {

			if (XKit.extensions.timestamps.is_compatible() === true) {
				XKit.tools.add_css('#posts .post .post_content { padding-top: 0px; }', "timestamps");
				XKit.post_listener.add("timestamps", XKit.extensions.timestamps.add_timestamps);
				XKit.extensions.timestamps.add_timestamps();
				
				$(document).on("click",".xkit-timestamp-failed-why", function() {
					XKit.window.show("Timestamp loading failed.", "This might be caused by several reasons, such as the post being removed, becoming private, or the Tumblr server having a problem that it can't return the page required by XKit to load you the timestamp.", "error", "<div id=\"xkit-close-message\" class=\"xkit-button\">OK</div></div>");
				});
			}
		
		} catch(e) {
		
			show_error_script("Timestamps: " + e.message);
			
		}
		
	
	},
	
	is_compatible: function() {
	
		if ($("body").hasClass("dashboard_drafts") === true || $("body").hasClass("dashboard_post_queue") === true) {
			return false;
		}
		return true;
		
	},
	
	add_timestamps: function() {

		if ($(".post").length === 0) {
			return;
		}
		
		XKit.extensions.timestamps.check_quota();
	
		$("#posts > .post").not(".xkit_timestamps").each(function() {
		
			try { 
			
				$(this).addClass("xkit_timestamps");
			
				if ($(this).attr('id') === "new_post" || $(this).hasClass("fan_mail") === true || 
					$(this).find('.private_label').length > 0  || $(this).hasClass("note") === true ||
					$(this).hasClass("submission") === true) {
					return;	
				}
			
				if ($(this).find('.permalink').length <= 0) { return; }

				var this_control_html = $(this).children('.post_controls').html();
				var permalink = $(this).find(".permalink").attr('href');

				var post_id = $(this).attr('id').replace("post_","");
				
				// Ugly but it works?
				var json_page_parts = permalink.replace("http://","").split("/");
				var json_page = "http://" + json_page_parts[0] + "/api/read/json?id=" + post_id;
			
				var m_html = '<div id="xkit_timestamp_' + post_id + '" class="xtimestamp xtimestamp_loading">&nbsp;</div>';
			
				$(this).find(".post_content").prepend(m_html);
				XKit.extensions.timestamps.fetch_timestamp($("#xkit_timestamp_" + post_id), json_page, post_id);
			
			} catch(e) {
			
				console.log(e.message);
			
			}
		
		});
	
	},
	
	fetch_timestamp: function(obj, json_page, post_id) {
	
		var nowdate = new Date();
		var nowdatem = moment(nowdate);
	
		var cached = XKit.storage.get("timestamps", "xkit_timestamp_cache_" + post_id, "");
		
		if (cached !== "") {
		
			try {
		
				var dtx = new Date(cached * 1000);
				var nowdate = new Date();
				var nowdatem = moment(nowdate);
				var dt = moment(dtx);
					
				if (XKit.extensions.timestamps.preferences.only_relative.value === true) {
    					$(obj).html(dt.from(nowdatem));
				} else {
					$(obj).html(dt.format('MMMM Do YYYY, h:mm:ss a') + " &middot; " + dt.from(nowdatem));
				}

				// $(obj).html(dt.format('MMMM Do YYYY, h:mm:ss a') + " &middot; " + dt.from(nowdatem));
				$(obj).removeClass('xtimestamp_loading');
				
			} catch(e) {
			
				XKit.extensions.timestamps.show_failed(obj);
			
			}
		
		} else {
	
		try {
			GM_xmlhttpRequest({
				method: "GET",
				dataType: "json",
				url: json_page,
				onload: function(response) {
					var rs = (response.responseText);
					var xs = rs.search('"unix-timestamp":');
					if (xs === -1) { XKit.extensions.timestamps.show_failed(obj); return; }
					var xe = rs.indexOf(',', xs + 17);
					if (xe === -1) { XKit.extensions.timestamps.show_failed(obj); return; }
					var xd = rs.substring(xs + 17, xe);
					var dtx = new Date(xd * 1000);
					var dt = moment(dtx);
					if (XKit.extensions.timestamps.preferences.only_relative.value === true) {
    						$(obj).html(dt.from(nowdatem));
					} else {
						$(obj).html(dt.format('MMMM Do YYYY, h:mm:ss a') + " &middot; " + dt.from(nowdatem));
					}
					$(obj).removeClass('xtimestamp_loading');
					XKit.storage.set("timestamps", "xkit_timestamp_cache_" + post_id, xd);
				},
				onerror: function(response) {
					XKit.extensions.timestamps.show_failed(obj);
				}
			});
		} catch(e) {
			alert(e.message);
		}
		
		}
	
	},
	
	show_failed: function(obj) {
	
		// Invalid file or change in format?
		$(obj).html("failed to load timestamp <div class=\"xkit-timestamp-failed-why\">why?</div>");
		$(obj).removeClass('xtimestamp_loading');
		return;	
	
	},
	
	destroy: function() {
		$(".xtimestamp").remove();
		$(".xkit_timestamps").removeClass("xkit_timestamps");
		XKit.tools.remove_css("timestamps");
		XKit.post_listener.remove("timestamps");
	}
	
});