//* TITLE Read More Now **//
//* VERSION 1.3.0 **//
//* DESCRIPTION Read Mores in your dash **//
//* DETAILS This extension allows you to read 'Read More' posts without leaving your dash. Just click on the 'Read More Now!' button on posts and XKit will automatically load and display the post on your dashboard. **//
//* DEVELOPER STUDIOXENIX **//
//* FRAME false **//
//* BETA false **//

XKit.extensions.read_more_now = new Object({

	running: false,
	button_caption: "Read More Now!",
	apiKey: XKit.api_key, //*"fuiKNFp9vQFvjLNvx4sUwti4Yb5yGutBN4Xh10LXZhhRKjWlV4",**//

	preferences: {
		auto_open: {
			text: "Auto-open all Read More posts (not recommended)",
			default: false,
			value: false
		},
		inline_button: {
			text: "Show a smaller, inline button for Read More Now",
			default: false,
			value: false
		},
		process_keep_reading: {
			text: "Show Read More Now for Keep Reading links",
			experimental: true,
			default: false,
			value: false
		}
	},

	run: function() {
		this.running = true;

		if (XKit.interface.where().queue === true || XKit.interface.where().drafts === true) {
			return;
		}

		XKit.post_listener.add("read_more_now", XKit.extensions.read_more_now.do);
		XKit.extensions.read_more_now.do();
		$(document).on('click', '.xkit-read-more-now', function() {
			$(this).addClass("disabled");
			$(this).html("Retrieving post...");
			var m_url = $(this).attr('data-post-url');
			var json_page_parts = m_url.replace("http://","").split("/");
			var blog_name = json_page_parts[0];
			var post_id = json_page_parts[2];
			var m_cont = $(this);

			var api_url = "https://api.tumblr.com/v2/blog/" + blog_name + "/posts" + "?api_key=" + XKit.extensions.read_more_now.apiKey + "&id=" + post_id;

			GM_xmlhttpRequest({
				method: "GET",
				url: api_url,
				json: true,
			onerror: function() {
				$(m_cont).removeClass("disabled");
				$(m_cont).html(XKit.extensions.read_more_now.button_caption);
				XKit.extensions.read_more_now.show_failed();
			},
			onload: function(response) {
				var data = JSON.parse(response.responseText);
				var m_object = data.response;
				try {
					var m_contents = m_object.posts[0].body;

					if (m_object.posts[0].type === "photo") {
						m_contents = m_object.posts[0]["photo-caption"] ||
						             m_object.posts[0].caption;
					}

					if (m_object.posts[0].type === "answer") {
						m_contents = m_object.posts[0].answer;
					}

					if (m_object.posts[0].type === "link") {
						m_contents = m_object.posts[0].description;
					}

					if ($(m_cont).parent().parent().find(".post_title").length > 0) {
						var post_title = $(m_cont).parent().parent().find(".post_title")[0].outerHTML;
						$(m_cont).parent().parent().html(XKit.extensions.read_more_now.strip_scripts(post_title + m_contents));
					} else {
						$(m_cont).parent().parent().html(XKit.extensions.read_more_now.strip_scripts(m_contents));
					}
				} catch(e) {
					$(m_cont).removeClass("disabled");
					$(m_cont).html(XKit.extensions.read_more_now.button_caption);
					XKit.extensions.read_more_now.show_failed();
				}
			}});
		});
	},

	strip_scripts: function(s) {

		/*
			From:
			http://stackoverflow.com/questions/6659351/removing-all-script-tags-from-html-with-js-regular-expression
		*/

		var div = document.createElement('div');
		div.innerHTML = s;
		var scripts = div.getElementsByTagName('script');
		var i = scripts.length;
		while (i--) {
				scripts[i].parentNode.removeChild(scripts[i]);
		}
		return div.innerHTML;
	},

	show_failed: function() {

		XKit.window.show("Unable to fetch read more","Perhaps the user deleted the post?","error","<div class=\"xkit-button default\" id=\"xkit-close-message\">OK</div>");

	},

	do: function() {

		$(".post").not(".xread-more-now-done").each(function() {
			var post = $(this);
			if (post.hasClass("read_more_container")) {
				XKit.extensions.read_more_now.handle_read_more_post(post);
			}

			if (XKit.extensions.read_more_now.preferences.process_keep_reading.value) {
				post.find("a").each(function() {
					var a = $(this);
					if (a.text().trim() !== "Keep reading") {
						return;
					}
					// Url must be of the form http://something.tumblr.com/post/numbers/whatever
					if (!(/https?:\/\/[^.]+\.tumblr\.com\/post\/\d+/.test(a.attr("href")))) {
						return;
					}
					XKit.extensions.read_more_now.append_button_with_link(a.parent(), a.attr("href"));
				});
			}
		});
	},

	handle_read_more_post: function(post) {
		if (post.hasClass("xread-more-now-done")) {
			return;
		}
		post.addClass("xread-more-now-done");
		XKit.extensions.read_more_now.append_button_with_link(post, post.find(".read_more").attr("href"));
	},

	append_button_with_link: function(post, url) {
		var div = document.createElement("div");
		div.classList.add("xkit-read-more-now");
		div.classList.add("xkit-button");
		div.dataset.postUrl = url;
		div.innerHTML = XKit.extensions.read_more_now.button_caption;
		if (XKit.extensions.read_more_now.preferences.inline_button.value === true) {
			div.setAttribute("style", "display: inline-block; text-align: center; margin-left: 10px; margin-top: 0; float: right;");
		} else {
			div.setAttribute("style", "display: block; text-align: center; margin-top: 20px;");
		}
		post.append(div);

		if (XKit.extensions.read_more_now.preferences.auto_open.value === true) {
			setTimeout(function() { $(".xkit-read-more-now").trigger("click"); }, 250);
		}
	},

	destroy: function() {
		$(".xkit-read-more-now").remove();
		this.running = false;
	}

});
