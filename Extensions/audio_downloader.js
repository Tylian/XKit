//* TITLE Audio Downloader **//
//* VERSION 1.0 REV B **//
//* DESCRIPTION Lets you download audio posts hosted on Tumblr **//
//* DEVELOPER STUDIOXENIX **//
//* FRAME false **//
//* BETA false **//
//* SLOW true **//
//* DETAILS This extension allows you to download audio posts as MP3 files on your computer. Please note that it only works on audio hosted on Tumblr. If they were posted from Spotify, SoundCloud, YouTube or any other service, it won't work. **//

XKit.extensions.audio_downloader = new Object({

	slow: true,
	running: false,

	run: function() {
		
		XKit.tools.init_css("audio_downloader");

		if (XKit.storage.get("audio_downloader","shown_welcome","false") === "false") {
			XKit.window.show("Welcome to Audio Downloader!", "If an audio post is downloadable, an arrow will appear next to the Like button that allows you to download the audio post as an MP3 file.<br/><br/><small>Please note that Audio Downloader only works on MP3 files hosted on Tumblr: any file shared on Tumblr from other services such as Spotify or SoundCloud can not be downloaded. In that case, the download arrow will not appear on the post.</small>", "info", "<div id=\"xkit-close-message\" class=\"xkit-button\">OK</div>");
			XKit.storage.set("audio_downloader","shown_welcome","true");
		}
		
		if ($("#posts").length > 0) {
			
			$(document).on("click", ".xgetaudiobutton", function() {
		
				if ($(this).hasClass("xkit-audio-downloader-working") === true) {
					return;
				}
				
				$(this).addClass("xkit-audio-downloader-working");
				XKit.extensions.audio_downloader.download($(this));
				
			});
			
			XKit.extensions.audio_downloader.check_posts();
			
		}
		
	},
	
	download: function(obj) {
	
		//var obj_id = "#" + $(obj).attr('id').replace("xgetaudio_download_post_","post_");
		var obj_id = "#" + $(obj).attr('data-post-id');
		var div_html = $(obj_id).find(".post_content").html();

		var this_control_html = $(obj_id).children('.post_controls').html();
		var permalink = $(obj_id).find(".permalink").attr('href');

		var json_page = permalink.replace("/post/", "/api/read/json?id=");
		json_page = json_page.replace("/private/", "/api/read/json?id=");


		GM_xmlhttpRequest({
			method: "GET",
			url: json_page,
			onload: function(response) {
				$(obj).removeClass("xkit-audio-downloader-working");
				if (response.responseText.indexOf("?audio_file=") == -1) {
					show_error("Can't fetch audio information", "I'm sorry but I could not fetch information needed to download this file. Please try again later.", "error", "<div id=\"xkit-close-message\" class=\"xkit-button\">OK</div>");
					return;
				}
				var m_start = response.responseText.indexOf("?audio_file=") + 12;
				var m_end = response.responseText.indexOf("\\\"", m_start);
				var m_url = decodeURIComponent(response.responseText.substring(m_start, m_end));
				if (m_url.indexOf('&color=') !== -1) {
					m_url = m_url.substring(0, m_url.indexOf('&color='));
				}
				
				m_url = m_url + "?plead=please-dont-download-this-or-our-lawyers-wont-let-us-host-audio";
				var m_id = "audio_" + XKit.extensions.audio_downloader.make_id();
				XKit.window.show("The Big-Bro Warning", "This functionality is provided in good faith. Please keep in mind the laws while using it: if you think downloading this file might be a copyright violation, please hit Cancel Download now.", "warning", "<a href=\"" + m_url + "\" download=\"" + m_id + "\" id=\"xkit-get-audio-button-start\" class=\"xkit-button default\">Download File</a><div id=\"xkit-close-message\" class=\"xkit-button\">Cancel</div>");
				
				$("#xkit-get-audio-button-start").click(function() {
				
					XKit.notifications.add("Your download will begin any second now.", "ok");
					XKit.window.close();
				
				});
				
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
		
	check_posts: function() {
	
		$("li.audio").not(".xgetaudioed").each(function() {

			$(this).addClass("xgetaudioed");
			if ($(this).find('.post_controls').html().indexOf('class="xgetaudiobutton"') !== -1) { return; }

			if ($(this).find(".soundcloud_audio_player").length > 0) {
				return;
			}

			if ($(this).find(".spotify_player").length > 0) {
				return;
			}

			this_id = $(this).attr('id');
			add_html =	'<a href="#" title="Download this Audio Post" onclick="return false;"' +
					 'class="xgetaudiobutton post_control" data-post-id="' + this_id + '">&nbsp</a>';
			$(this).find('.post_controls').find('.like_button').before(add_html);

		});
		
		setTimeout(function() { XKit.extensions.audio_downloader.check_posts(); }, 3000);
	
	},
	
	destroy: function() {
		XKit.tools.remove_css("audio_downloader");
		$(".xgetaudiobutton").remove();
	}
	
});