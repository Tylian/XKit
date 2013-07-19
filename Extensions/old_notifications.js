//* TITLE Old Notifications **//
//* VERSION 0.1 REV B **//
//* DESCRIPTION Notifications where they were **//
//* DETAILS This is a very experimental extension that brings back the notifications to your blog pages (ie: www.tumblr.com/blog/xkit-extension), just the way it was before Tumblr's Activity update. Only the last 10 notifications are displayed. **//
//* DEVELOPER STUDIOXENIX **//
//* FRAME false **//
//* BETA false **//

XKit.extensions.old_notifications = new Object({

	running: false,

	run: function() {
		this.running = true;
		
		if (document.location.href.indexOf("http://www.tumblr.com/blog/") !== -1 && $("body").attr('id') === "dashboard_index") {
			XKit.extensions.old_notifications.fetch();
			$(document).on('click','.notification.by-xkit-old-notifications', XKit.extensions.old_notifications.open_notification);	
		}
		
	},
	
	fetch_failed: function(err) {
		
		
		
	},
	
	open_notification: function(e) {
		
		var m_target = $(e.target);
		
		if ($(m_target).hasClass("xkit-reply-button") === true) {
			return;
		}
		
		var m_parent = $(m_target).parentsUntil(".notification").parent();
		window.open($(m_parent).find(".preview_frame").attr('href'));
		
	},
	
	alt_notification: false,
	max_notifications: 10,
	notification_count: 0,
	
	render_notification: function(obj) {
		
		var new_obj = $(obj);
		
		if ($(new_obj).find(".ui_note").length <= 0) { return ""; }
		
		$(new_obj).find(".date_header").remove();
		$(new_obj).find(".part_glass").remove();
		$(new_obj).find(".part_ignore").remove();
		$(new_obj).find(".note_follow").remove();
		
		$(new_obj).find(".ui_avatar").unwrap();
		
		$(new_obj).find(".ui_avatar").addClass("avatar_frame_temporary");
		$(new_obj).find(".ui_avatar").removeClass("ui_avatar");
		
		
		$(new_obj).find(".ui_note").addClass("notification");
		$(new_obj).find(".ui_note").removeClass("ui_note");
		
		$(new_obj).find(".stage").addClass("notification_inner clearfix");
		$(new_obj).find(".stage").removeClass("stage");
		
		$(new_obj).find(".part_icon").addClass("notification_right");
		$(new_obj).find(".part_icon").removeClass("part_icon");
	
		$(new_obj).find(".part_activity").addClass("notification_sentence");
		$(new_obj).find(".part_activity").removeClass("part_activity");
		
		$(new_obj).find(".ui_post_badge").addClass("preview_frame");
		$(new_obj).find(".ui_post_badge").removeClass("ui_post_badge");
		
		$(new_obj).find(".part_main").addClass("hide_overflow");
		$(new_obj).find(".part_main").removeClass("part_main");
		
		if ($(new_obj).find(".preview_frame").hasClass("photo")) {
			var m_src = $(new_obj).find(".preview_frame").css("background-image");
			// ugly but works:
			m_src = m_src.substring(4, m_src.length - 1); 
			$(new_obj).find(".preview_frame").append("<img src=\"" + m_src + "\">");	
		} else {
			$(new_obj).find(".preview_frame").addClass("icon");
		}
		
		$(new_obj).find(".activity").find("a:first-child").addClass("username");
		
		if ($(new_obj).find(".summary").length > 0) {
			$(new_obj).find(".activity").after("<span class=\"colon\">:</span>");
		}
		
		// Get avatar:
		$(new_obj).find(".avatar").addClass("old-avatar-div");
		var avatar_url = $(new_obj).find(".avatar").css("background-image");
		avatar_url = avatar_url.substring(4, avatar_url.length - 1);
		$(new_obj).find(".notification").append("<a class=\"avatar_frame\"> <img class=\"avatar\" src=\"" + avatar_url + "\" data-src=\"" + avatar_url + "\"></a>");
		
		$(new_obj).find(".avatar_frame_temporary").remove();
		
		if ($(new_obj).find(".part_response").length > 0) {
			var m_response = $(new_obj).find(".part_response").html();
			$(new_obj).find(".notification_sentence").find(".hide_overflow").after(m_response);
			$(new_obj).find(".part_response").remove();
		}
		// first_notification -- last_notification
		var additional_classes = "";
		
		if ($(new_obj).find(".notification").hasClass("is_answer"))
			additional_classes = additional_classes + " notification_answer ";
			
		if ($(new_obj).find(".notification").hasClass("is_reply"))
			additional_classes = additional_classes + " notification_reply ";
			
		if ($(new_obj).find(".notification").hasClass("is_reblog"))
			additional_classes = additional_classes + " notification_reblog ";
			
		if ($(new_obj).find(".notification").hasClass("is_like"))
			additional_classes = additional_classes + " notification_like";
					
		if (XKit.extensions.old_notifications.alt_notification)
			additional_classes = additional_classes + " alt ";
			
		if (XKit.extensions.old_notifications.notification_count === 0)
			additional_classes = additional_classes + " first_notification ";
			
		if (XKit.extensions.old_notifications.notification_count === XKit.extensions.old_notifications.max_notifications - 1)
			additional_classes = additional_classes + " last_notification ";
			 
		var m_html = "<li class=\"notification by-xkit-old-notifications " + additional_classes + "\">" + $(new_obj).html() + "</li>";
		
		XKit.extensions.old_notifications.alt_notification = !XKit.extensions.old_notifications.alt_notification;
		
		XKit.extensions.old_notifications.notification_count++;
		return m_html;
		
	},
	
	fetch_successful: function(data) {
		
		var m_html = "";
		$(".stage", data).each(function() {
			if (XKit.extensions.old_notifications.notification_count >= XKit.extensions.old_notifications.max_notifications) { return false; }
			m_html = m_html + XKit.extensions.old_notifications.render_notification("<div>" + $(this).parent()[0].outerHTML + "</div>");
		});
		$(".new_post_buttons_container").after(m_html);	
		
	},
	
	fetch: function() {
		
		var to_fetch = document.location.href.replace("/blog/","/activity/");
		
		GM_xmlhttpRequest({
			method: "GET",
			url: to_fetch,
			onerror: function(response) {
				XKit.extensions.old_notifications.fetch_failed(obj);
			},
			onload: function(response) {
				XKit.extensions.old_notifications.fetch_successful(response.responseText);
			}
		});
		
	},

	destroy: function() {
		this.running = false;
	}

});