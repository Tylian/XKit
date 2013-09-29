//* TITLE Audio Downloader **//
//* VERSION 2.0 REV A **//
//* DESCRIPTION Lets you download audio posts hosted on Tumblr **//
//* DEVELOPER STUDIOXENIX **//
//* FRAME false **//
//* BETA false **//
//* SLOW true **//
//* DETAILS This extension allows you to download audio posts as MP3 files on your computer. Please note that it only works on audio hosted on Tumblr. If they were posted from Spotify, SoundCloud, YouTube or any other service, it won't work. **//

XKit.extensions.audio_downloader = new Object({

	slow: true,
	running: false,
	
	button_icon: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABMAAAATCAYAAAByUDbMAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMC1jMDYwIDYxLjEzNDc3NywgMjAxMC8wMi8xMi0xNzozMjowMCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNSBNYWNpbnRvc2giIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6QkY1MzdFN0ExNTU3MTFFMzlCNjJGNTNDQTgzRjc3M0UiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6QkY1MzdFN0IxNTU3MTFFMzlCNjJGNTNDQTgzRjc3M0UiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDpCRjUzN0U3ODE1NTcxMUUzOUI2MkY1M0NBODNGNzczRSIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDpCRjUzN0U3OTE1NTcxMUUzOUI2MkY1M0NBODNGNzczRSIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PuxbowMAAACcSURBVHja7NTBDYAgDABA6gKMQpzEURiFERyFERiFEZCamlTToqIvY5O+aO/RlEIpxUgBAOJDrQejxGBejB/7EobhcX0epl/3lZY2PoAiGhyzNXMHhD12hxHoOjC39e8wAv3dOakYgfMFaD72aRjOLzWgxOfUxNj8sjJwJ/WoGIGTgE1afRMjMDAotGoxQbu07OImurDj2VdaBBgAbglVZHbAZ/wAAAAASUVORK5CYII=",

	run: function() {
		
		XKit.tools.init_css("audio_downloader");

		if (XKit.storage.get("audio_downloader","shown_welcome","false") === "false") {
			XKit.window.show("Welcome to Audio Downloader!", "If an audio post is downloadable, an arrow will appear next to the Like button that allows you to download the audio post as an MP3 file.<br/><br/><small>Please note that Audio Downloader only works on MP3 files hosted on Tumblr: any file shared on Tumblr from other services such as Spotify or SoundCloud can not be downloaded. In that case, the download arrow will not appear on the post.</small>", "info", "<div id=\"xkit-close-message\" class=\"xkit-button\">OK</div>");
			XKit.storage.set("audio_downloader","shown_welcome","true");
		}
		
		if ($(".post").length > 0) {
			
			XKit.interface.create_control_button("xkit-audio-downloader", this.button_icon, "Audio Downloader", "");
			XKit.extensions.audio_downloader.init();
			XKit.post_listener.add("audio_downloader", XKit.extensions.audio_downloader.do);
			XKit.extensions.audio_downloader.do();
			
		}
		
	},
	
	init: function() {
		
		$(document).on("click", ".xkit-audio-downloader", function(event) {
			var post_id = $(this).attr('data-post-id');
			var username = $(this).attr('data-xkit-audio-downloader-tumblelog-name');
			XKit.extensions.audio_downloader.download(post_id, username);
		});
		
	},
	
	download: function(post_id, username) {
		
		var json_page = "http://" + username + ".tumblr.com/api/read/json?id=" + post_id;
		
		GM_xmlhttpRequest({
			method: "GET",
			url: json_page,
			onload: function(response) {
				
				var m_data = response.responseText.replace("var tumblr_api_read = {", "{");
				m_data = m_data.substring(0, m_data.length - 2);
				
				console.log(m_data);
				
				try {
					
					var obj = JSON.parse(m_data);
					
					if (typeof obj.posts[0] === "undefined") {
						return XKit.extensions.audio_downloader.show_error("13");
					}
					
					if (typeof obj.posts[0]["audio-player"] === "undefined" ||obj.posts[0]["audio-player"] === "") {
						return XKit.extensions.audio_downloader.show_error("14");
					}	
					
					var m_text = obj.posts[0]["audio-player"];
					
					var m_start = m_text.indexOf("?audio_file=") + 12;
					var m_end = m_text.indexOf("\"", m_start);
					var m_url = decodeURIComponent(m_text.substring(m_start, m_end));
					if (m_url.indexOf('&color=') !== -1) {
						m_url = m_url.substring(0, m_url.indexOf('&color='));
					}
					
					var m_id = "audio_" + XKit.extensions.audio_downloader.make_id();
					
					var audio_name = $("#post_" + post_id).find(".id3_tags").find(".track_name").html();
					var audio_author = $("#post_" + post_id).find(".id3_tags").find(".artist_name").html();
					
					if (typeof audio_author == "undefined" || audio_author == "") {
						audio_author = "unknown";
					}
					
					if (typeof audio_name !== "undefined" && audio_name !== "") {
						m_id = audio_name.replace(/\W/g, '') + "__" + audio_author.replace(/\W/g, '');
					}
					
					
					
					var m_titles = [ "You probably wouldn't steal a car.", "The Big-Bro Warning", "Watch it, they are watching you.", "Do you want Metallica to starve to death?", "Psst. Behind you.", "Would you download a car?", "You are too pretty to go to jail.", "Oh I hope you are not doing what I think you are doing.", "Xenixlet Sez: Buy music!", "You are downloading a Mitt Romney audio snippet, right?" ];
					var m_index = Math.floor(Math.random() * m_titles.length);
					
					var m_title = m_titles[m_index];
					
					if (XKit.browser().firefox === true || XKit.browser().safari === true) {
						XKit.window.show(m_title, "<b>This functionality is provided in good faith.</b><br/>Please keep in mind the laws while using it: if you think downloading this file might be a copyright violation, hit Cancel now.", "warning", "<a href=\"http://www.xkit.info/seven/helpers/audioget.php?fln=" + m_url + "&id=" + m_id + "\" id=\"xkit-get-audio-button-start\" class=\"xkit-button default\">Download File</a><div id=\"xkit-close-message\" class=\"xkit-button\">Cancel</div>");			
					} else {
						m_url = m_url + "?plead=please-dont-download-this-or-our-lawyers-wont-let-us-host-audio";
						XKit.window.show(m_title, "<b>This functionality is provided in good faith.</b><br/>Please keep in mind the laws while using it: if you think downloading this file might be a copyright violation, hit Cancel now.", "warning", "<a href=\"" + m_url + "\" download=\"" + m_id + "\" id=\"xkit-get-audio-button-start\" class=\"xkit-button default\">Download File</a><div id=\"xkit-close-message\" class=\"xkit-button\">Cancel</div>");	
					}			
					
					$("#xkit-get-audio-button-start").click(function() {

						XKit.notifications.add("Your download will begin any second now.", "ok");
						XKit.window.close();
				
					});	
				
				} catch(e) {
					
					XKit.extensions.audio_downloader.show_error("12 - " + e.message);
					
				}
				
			},
			onerror: function() {
			
				XKit.extensions.audio_downloader.show_error("11");
				
			}
		});
		
	},
	
	make_id: function() {
	
		var text = "";
		var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

		for( var i=0; i < 15; i++ )
			text += possible.charAt(Math.floor(Math.random() * possible.length));

		return text;
	
	},
	
	show_error: function(error_code) {
		
		XKit.window.show("Can't fetch audio information", "I'm sorry but I could not fetch information needed to download this file.<br/><br/>There might be a problem with Tumblr servers, or perhaps the user removed the post.<br/><br/>Please try again later.<br/>(Error " + error_code + ")", "error", "<div id=\"xkit-close-message\" class=\"xkit-button\">OK</div>");	
		
	},
	
	do: function() {
		
		var posts = XKit.interface.get_posts("xkit-audio-downloader-done");

		$(posts).each(function() {
			
			$(this).addClass("xkit-audio-downloader-done");
			
			// Check if hosted by Tumblr:
			if ($(this).find(".audio_player").length === 0) { return; }
			
	  		var m_post = XKit.interface.post($(this));
	  		
	  		// Post has no notes, skip.
	  		if (m_post.type !== "audio") { return; }

			XKit.interface.add_control_button(this, "xkit-audio-downloader", "data-xkit-audio-downloader-tumblelog-key=\"" + m_post.tumblelog_key + "\" data-xkit-audio-downloader-tumblelog-name=\"" + m_post.owner + "\"");

		});
	
	},
	
	destroy: function() {
		XKit.tools.remove_css("audio_downloader");
		$(".xgetaudiobutton").remove();
	}
	
});