//* TITLE Read More Now **//
//* VERSION 1.1 REV A **//
//* DESCRIPTION Read Mores in your dash **//
//* DETAILS This extension allows you to read 'Read More' posts without leaving your dash. Just click on the 'Read More Now!' button on posts and XKit will automatically load and display the post on your dashboard. **//
//* DEVELOPER STUDIOXENIX **//
//* FRAME false **//
//* BETA false **//

XKit.extensions.read_more_now = new Object({

	running: false,
	button_caption: "Read More Now!",
	
	preferences: {
		auto_open: {
			text: "Auto-open all Read More posts (not recommended)",
			default: false,
			value: false
		}
	},

	run: function() {
		this.running = true;
		XKit.post_listener.add("read_more_now", XKit.extensions.read_more_now.do);
		XKit.extensions.read_more_now.do();
		$(document).on('click', '.xkit-read-more-now', function() {
			$(this).addClass("disabled");
			$(this).html("Retrieving post...");
			var m_url = $(this).parent().find(".read_more").attr('href').replace('/post/', '/api/read/json?id=');
			var m_part = m_url.substring(m_url.indexOf('?id=') + 4);
			if (m_part.indexOf('/') !== -1) {
				var m_tmp = m_url.substring(0, m_url.indexOf('?id=') + 4);
				m_part = m_part.substring(0, m_part.indexOf('/'));
				m_url = m_tmp + m_part;
			}
			var m_cont = $(this);
			GM_xmlhttpRequest({
				method: "GET",
				dataType: "json",
				url: m_url,
				onload: function(response) {
					var rs = (response.responseText).replace('var tumblr_api_read = ','');
					rs = rs.substring(0, rs.length - 2);
					try {
						var m_object = JSON.parse(rs);
						if ($(m_cont).parent().parent().find(".post_title").length > 0) {
							var post_title = $(m_cont).parent().parent().find(".post_title")[0].outerHTML;
							$(m_cont).parent().parent().html(post_title + m_object.posts[0]["regular-body"]);
						} else {
							$(m_cont).parent().parent().html(m_object.posts[0]["regular-body"]);
						}
					} catch(e) {
						$(m_cont).removeClass("disabled");
						$(m_cont).html(XKit.extensions.read_more_now.button_caption);
						XKit.extensions.read_more_now.show_failed();	
					}
				},
				onerror: function(response) {
					$(m_cont).removeClass("disabled");
					$(m_cont).html(XKit.extensions.read_more_now.button_caption);
					XKit.extensions.read_more_now.show_failed();
				}
			});
		});
	},
	
	show_failed: function() {
		
		XKit.window.show("Unable to fetch read more","Perhaps the user deleted the post?","error","<div class=\"xkit-button default\" id=\"xkit-close-message\">OK</div>");	
		
	},
	
	do: function() {
	
		$(".read_more_container").not(".xread-more-now-done").each(function() {
			
			if ($(this).hasClass("xread-more-now-done") === true) { return; }
			$(this).addClass("xread-more-now-done");
			$(this).append("<div class=\"xkit-read-more-now xkit-button\" style=\"display: block; text-align: center; margin-top: 20px;\">" + XKit.extensions.read_more_now.button_caption + "</div>");
			
		});	
		
		if (XKit.extensions.read_more_now.preferences.auto_open.value === true) {
			setTimeout(function() { $(".xkit-read-more-now").trigger("click"); }, 250);
		}
		
	},

	destroy: function() {
		$(".xkit-read-more-now").remove();
		this.running = false;
	}

});