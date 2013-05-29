//* TITLE Reblog Yourself **//
//* VERSION 1.0 REV B **//
//* DESCRIPTION Allows you to reblog posts back to your blog **//
//* DEVELOPER STUDIOXENIX **//
//* FRAME false **//
//* BETA false **//
//* SLOW true **//

XKit.extensions.reblog_yourself = new Object({

	running: false,
	slow: true,

	run: function() {
		this.running = true;

		if (document.location.href.indexOf("http://www.tumblr.com/reblog/") !== -1) {
			XKit.extensions.reblog_yourself.fix_page();
		} else {
			XKit.extensions.reblog_yourself.fix_dashboard();
		}
	
		if ($(".post").length > 0) {
			$(document).on("click", ".reblog_button", function() {
				if ($(this).parentsUntil(".post").parent().hasClass("is_mine") === true) {
					XKit.extensions.reblog_yourself.fix_page();
				}
			});
		}

		XKit.post_listener.add("reblog_yourself", XKit.extensions.reblog_yourself.fix_dashboard);

	},

	fix_page_interval: "",

	fix_page: function() {

		if ($("#tumblelog_choices").length === 0) {
			setTimeout(function() { XKit.extensions.reblog_yourself.fix_page(); }, 300);
			return;
		}

		if ($("#popover_blogs").length === 0) {
			XKit.console.add("Can't run Reblog Yourself, popover_blogs not found.");
			return;
		}

		var m_blog_url = $("#popover_blogs").find(".popover_menu_item").first().attr('id').replace("menuitem-","");
		var m_blog_title = $("#popover_blogs").find(".popover_menu_item").first().find(".blog_title").find("span").html();

		var post_avatar = $("#new_post").find(".post_avatar").attr('data-avatar-url');

		var m_html = '<div class="option" data-facebook-on="false" data-twitter-on="false" data-facebook="false" data-twitter="false" data-is-password-protected="false" data-use-sub-avatar="" data-use-channel-avatar="0" data-blog-url="http://' + m_blog_url + '.tumblr.com/" data-avatar-url="' + post_avatar +'" data-user-avatar-url="' + post_avatar +'" data-option-value="'+ m_blog_url +'" title="'+ m_blog_title +'">' + m_blog_url + '</div>';

		$("#tumblelog_choices").find(".popover_inner").find("ul").prepend("<li>" + m_html + "</li>");

	},

	fix_dashboard: function() {

		if ($(".post").length == 0) { return; }

		/*
			blog_id +
			post_type +
			post_id + 
			reblog_key +
			user_form_key
			reblog_id
		*/

		var user_form_key = $("body").attr('data-form-key');
		
		$('li.is_mine').not(".xreblogyourself_done").each(function(index) {

			if ($(this).hasClass("xreblogyourself_done") === true) { return; }

	   		if ($(this).attr('id') === "new_post") { return; }
			if ($(this).hasClass("note") === true) { return; }
			if ($(this).hasClass("is_mine") === false) { return; }
	   		if ($(this).css('visibility') === "hidden") { return; } // tumblr savior hack.
	   		if ($(this).css('display') === "none") { return; } // tumblr savior hack.

			$(this).addClass("xreblogyourself_done");

	   		if ($(this).find('.post_controls').html().search('href="/reblog/') !== -1) { 
	   		   	// this user can reblog themselves?!
				XKit.console.add("This user can reblog themselves, quitting.");
	   		   	return false; 
	   		}

			var post_id = $(this).attr('data-post-id');
			var reblog_key = $(this).attr('data-reblog-key');
			var post_type = $(this).attr('data-type');
			var blog_id = $(this).attr('data-tumblelog-name');
			var reblog_id = $(this).attr('data-post-id');		
	
			if (post_id === "" ||reblog_key === "") {
				// Can't do this for some reason.
				return;
			}

			// <a class="post_control post_control_icon reblog_button" title="" data-tumblelog-name="xenix" data-post-type="regular" data-reblog-key="5XJmYn8f" data-reblog-id="50250451612" data-user-form-key="0Rk2VkO4FhIFHKYsHMXFFokI0QI" href="/reblog/50250451612/5XJmYn8f?redirect_to=%2Fdashboard">Reblog</a>

			var m_html = "<a class=\"added_by_xkit_reblog_yourself post_control post_control_icon reblog_button\" title=\"\" data-tumblelog-name=\"" + blog_id + "\" data-post-type=\"" + post_type + "\" data-reblog-key=\"" + reblog_key + "\" data-reblog-id=\"" + reblog_id + "\" data-user-form-key=\"" + user_form_key + "\" href=\"/reblog/" + post_id + "/" + reblog_key + "?redirect_to=%2Fdashboard\">Reblog</a>";
			$(this).find('.post_controls .delete_button').before(m_html);
		});
	
	},

	destroy: function() {
		XKit.post_listener.remove("reblog_yourself");
		$(".added_by_xkit_reblog_yourself").remove();
		$(".xreblogyourself_done").removeClass("xreblogyourself_done");
		this.running = false;
	}

});