//* TITLE NotificationBlock **//
//* VERSION 1.0 REV D **//
//* DESCRIPTION Blocks notifications from a post **//
//* DEVELOPER STUDIOXENIX **//
//* DETAILS One post got way too popular and now just annoying you? Click on the notification block icon on that post to hide the notifications from that post. If you have Go-To-Dash installed, you can click on a notification, then click View button on top-right corner to quickly go back to the post on your dashboard.  **//
//* FRAME false **//
//* BETA false **//

XKit.extensions.notificationblock = new Object({

	running: false,
	button_icon: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABMAAAATCAYAAAByUDbMAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMC1jMDYwIDYxLjEzNDc3NywgMjAxMC8wMi8xMi0xNzozMjowMCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNSBNYWNpbnRvc2giIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6NjUxNjI3RkQxNjVDMTFFM0E2RkFCMjhCQTdGQjEwOTAiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6NjUxNjI3RkUxNjVDMTFFM0E2RkFCMjhCQTdGQjEwOTAiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDo2NTE2MjdGQjE2NUMxMUUzQTZGQUIyOEJBN0ZCMTA5MCIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDo2NTE2MjdGQzE2NUMxMUUzQTZGQUIyOEJBN0ZCMTA5MCIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PgYk6NEAAAEhSURBVHjaYmDAD44C8Q5ckv///0fBjFjUWILUAfEJKA0CjLgMIwS+AvEnmHokA1cD8QJSXYbsGnQ2CDPhchkTA2mAEZ8kqYbBQAMQFxCjEDmccLH/AfEXSsMMhQ00AEO/OxC3ADEfmgt0kNi6WFzJCWUrAfFdWGR8hEouQDMMF+5Bcog/ED8C4g8ww85CFYHCwYKAQfVIBn1BEm+EGVaKJHgGj0GiUEMEoBbDxM8DMS/MMBEg/kbIe1DFpVjk5qMn4GkEDDsCVfwJi9wPIH6CbJgKEP8mwmUgcAqL/Fr0rDWBgOuYsMT2e1hOQDeMF5RecBi0FKp4LZIYyIUm+IojUOJ8jsUwKahiGP8qELMRU7ZJQMuur8heRDIsBVdBCRBgAOnA+a8Ss3qFAAAAAElFTkSuQmCC",
	button_ok: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABMAAAATCAYAAAByUDbMAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMC1jMDYwIDYxLjEzNDc3NywgMjAxMC8wMi8xMi0xNzozMjowMCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNSBNYWNpbnRvc2giIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6N0FDNkNDNzYxNkVEMTFFM0E2RkFCMjhCQTdGQjEwOTAiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6N0FDNkNDNzcxNkVEMTFFM0E2RkFCMjhCQTdGQjEwOTAiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDo3QUM2Q0M3NDE2RUQxMUUzQTZGQUIyOEJBN0ZCMTA5MCIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDo3QUM2Q0M3NTE2RUQxMUUzQTZGQUIyOEJBN0ZCMTA5MCIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PhNHAxwAAAFhSURBVHjaYsxeqs2ABxwF4s9A7IFLwZSoK3A2CxZ5SyD+D8QngNiKgQSAzbA9QPwXiPnQxFcD8VcgTiDFMC4cakOgLsZpGBMDaYARnySphsFAAxAXEONNYkAdEH8D4gnUcBnIu9zYvOkOxC1YYk8Hia2LK6JylukoAfFdmDdXQQ2SQYupy0jsS0jsHqSI8AfiyTCHgFx2ByoRB8QWRAR8CZT9BYg3ALEsEE+EuWwFEBtBbZuCxyAxIH4NxAJA/A7JdRegrgW7bD4Qf4dKGOMxDGRQKRC/R0tvF4D58zPMsDdAvICA945C6VoscpHACHiCnDT6gPgPHsOsoTQooE+jybED8Ulkw0CRMJWA62BqTZHEPgBxIdCbweiJFuSFezgMWgbE/4B4LZIYyIWuQIMmYMsBoEAMAOIXWAwrhdJBUPoaENsA8Rl82QmUUA2BeA0078EAsgWpQAwqnn+h2wgQYAAh60jncAp2xAAAAABJRU5ErkJggg==",
	blacklisted: new Array(),
	
	preferences: {
		
		ask: {
			text: "Show the confirmation window",
			default: true,
			value: true
		}	
		
	},
	
	run: function() {
		
		this.running = true;
		
		if (XKit.interface.where().inbox === true) {
			return;	
		}
		
		try {
			var m_blacklist = XKit.storage.get("notificationblock","posts","").split(",");
			if (m_blacklist !== "") {
				this.blacklisted = m_blacklist;	
			}
		} catch(e) {
			XKit.storage.set("notificationblock","posts","");
			this.blacklisted = new Array();	
		}
		
		if ($("#posts").length > 0 ||$(".notification").length > 0 ||$(".ui_note").length > 0) {
			$(document).on('click','.xnotificationblockbutton', XKit.extensions.notificationblock.on_click);
			XKit.interface.create_control_button("xnotificationblockbutton", this.button_icon, "NotificationBlock", "", this.button_ok);
			XKit.post_listener.add("notificationblock", XKit.extensions.notificationblock.do);
			XKit.extensions.notificationblock.do();	
		}
		
		if (XKit.interface.where().activity === true) {
			console.log("In activity, repeat block mode");
			setInterval(function() { XKit.extensions.notificationblock.do() }, 1500);	
		}
		
	},
	
	unblock: function(post_id) {
		
		var m_index = XKit.extensions.notificationblock.blacklisted.indexOf(post_id);
		if (m_index !== -1) {
			XKit.extensions.notificationblock.blacklisted.splice(m_index, 1);
			XKit.storage.set("notificationblock","posts",XKit.extensions.notificationblock.blacklisted.join(","));
		}
		$(".notification.xnotificationblockchecked").removeClass("xnotificationblockchecked");
		XKit.extensions.notificationblock.do();
	
	},
	
	block: function(post_id) {
		
		if (XKit.extensions.notificationblock.blacklisted.indexOf(post_id) === -1) {
			XKit.extensions.notificationblock.blacklisted.push(post_id);
			XKit.storage.set("notificationblock","posts",XKit.extensions.notificationblock.blacklisted.join(","));
		}
		$(".notification.xnotificationblockchecked").removeClass("xnotificationblockchecked");
		XKit.extensions.notificationblock.do();
		
	},
	
	on_click: function(e) {
		
		var obj = e.target || e.srcElement;
		var parent = $(obj).parentsUntil("#posts");
		
		if (XKit.extensions.notificationblock.preferences.ask.value === false) {
			
			if ($(obj).hasClass("xkit-interface-completed")) {
				XKit.extensions.notificationblock.unblock($(obj).attr('data-post-id'));
				XKit.interface.completed_control_button($(obj), false);
			} else {
				XKit.extensions.notificationblock.block($(obj).attr('data-post-id'));
				XKit.interface.completed_control_button($(obj), true);
			}	
			
			return;
			
		}
		
		if ($(obj).hasClass("xkit-interface-completed")) {
			// Already blocked, user trying to unblock it.	
			
			XKit.window.show("Unblock notifications from this post?","Notifications from this post will be shown.<br/>You'll need to refresh the page for changes to take effect.","question","<div class=\"xkit-button default\" id=\"xkit-notification-block-ok\">Unblock Notifications</div><div class=\"xkit-button\" id=\"xkit-close-message\">Cancel</div>");
		
			$("#xkit-notification-block-ok").click(function() {
			
				XKit.window.close();
				XKit.extensions.notificationblock.unblock($(obj).attr('data-post-id'));
				XKit.interface.completed_control_button($(obj), false);
				
			});
			
		} else {
		
			XKit.window.show("Block notifications from this post?","Notifications originating from this post will be blocked on the dashboard, Old Notifications and Activity page, without any indication that is was blocked.","question","<div class=\"xkit-button default\" id=\"xkit-notification-block-ok\">Block Notifications</div><div class=\"xkit-button\" id=\"xkit-close-message\">Cancel</div>");
		
			$("#xkit-notification-block-ok").click(function() {
			
				XKit.window.close();
				XKit.extensions.notificationblock.block($(obj).attr('data-post-id'));
				XKit.interface.completed_control_button($(obj), true);

			});
		
		}
		
	},
	
	do: function() {
		
		$(".notification").not(".xnotificationblockchecked").each(function() {
			
			$(this).addClass("xnotificationblockchecked");
			
			var target_url = $(this).find(".notification_target").attr('href');
			
			if ($(this).attr('data-url-original') !== "undefined" && $(this).attr('data-url-original') !== "") {
				target_url = target_url + " " +	$(this).attr('data-url-original');
			}
			
			if ($(this).find(".preview_frame").attr('href') !== "undefined") {
				target_url = target_url + " " +	$(this).find(".preview_frame").attr('href');
			}
			
			for (var i=0;i<XKit.extensions.notificationblock.blacklisted.length;i++) {
				if (XKit.extensions.notificationblock.blacklisted[i] == "") { continue; }
				if (target_url.indexOf("/post/" + XKit.extensions.notificationblock.blacklisted[i]) !== -1) {
					console.log("Blocking notification because of post " + XKit.extensions.notificationblock.blacklisted[i]);
					$(this).remove();
					return;
				}
			}
			
		});
		
		$(".ui_note").not(".xnotificationblockchecked").each(function() {
			
			$(this).addClass("xnotificationblockchecked");
			
			var target_url = $(this).find(".part_glass").attr('href') + "  " + $(this).find(".ui_post_badge").attr('href');
			//$(this).css("background","green");

			for (var i=0;i<XKit.extensions.notificationblock.blacklisted.length;i++) {
				if (XKit.extensions.notificationblock.blacklisted[i] == "") { continue; }
				if (target_url.indexOf("/post/" + XKit.extensions.notificationblock.blacklisted[i]) !== -1) {
					console.log("Blocking notification because of post " + XKit.extensions.notificationblock.blacklisted[i]);
					$(this).remove();
					//$(this).css("background","red");
					return;
				}
			}
			
		});
		
		$(".xkit-old-notifications, .notification").first().addClass("first_notification");		
		$(".xkit-old-notifications, .notification").first().each(function() {
			if ($(this).is(":last")) {
				$(this).removeClass("first_notification").addClass("single_notification");
			}
		});
		

		if ($(".post").length > 0) {
		
			var posts = XKit.interface.get_posts("xnotificationblockchecked");
		
			$(posts).each(function() {
			
				$(this).addClass("xnotificationblockchecked");
				
		  		var m_post = XKit.interface.post($(this));
		  		if (m_post.is_mine !== true) { return; }	
	
				var this_id = m_post.id;
				
				XKit.interface.add_control_button(this, "xnotificationblockbutton", "data-root-id=\"" + this_id + "\"");
					
				if (XKit.extensions.notificationblock.blacklisted.indexOf(this_id) !== -1) {
					
					XKit.interface.completed_control_button($(this).find(".xnotificationblockbutton"), true);		
				
				}
			
			

			});	
			
		}
		
	},

	destroy: function() {
		this.running = false;
		XKit.post_listener.remove("notificationblock");
		$(".xnotificationblockbutton").remove();
		$(".xnotificationblockchecked").removeClass("xnotificationblockchecked");
	}

});