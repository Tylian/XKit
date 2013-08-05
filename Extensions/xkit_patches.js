//* TITLE XKit Patches **//
//* VERSION 1.1 REV B **//
//* DESCRIPTION Patches framework **//
//* DEVELOPER STUDIOXENIX **//
XKit.extensions.xkit_patches = new Object({

	running: false,

	run: function() {
		this.running = true;

		XKit.tools.init_css("xkit_patches");
		
		XKit.interface = new Object({
			
			post: function(obj) {
				
				var m_return = new Object();
				
				m_return.id = $(obj).attr('data-post-id');
				m_return.root_id = $(obj).attr('data-root-id');
				m_return.reblog_key = $(obj).attr('data-reblog-key');
				m_return.owner = $(obj).attr('data-tumblelog-name');
				
				m_return.liked = $(obj).find(".post_control.like").hasClass("liked");
				m_return.permalink = $(obj).find(".post_permalink").attr('href');
				
				m_return.type = $(obj).attr('data-type');
				
				if ($(obj).find(".post_body").length > 0) {
					m_return.body = $(obj).find(".post_body").html();
				} else {
					if ($(obj).find(".post_content_inner").length > 0) {
						m_return.body = $(obj).find(".post_content_inner").html();
					} else {
						m_return.body = "";	
					}	
				}
				m_return.is_reblogged = $(obj).hasClass("is_reblog");
				m_return.is_mine = $(obj).hasClass("is_mine");
				m_return.is_following = ($(obj).attr('data-following-tumblelog') === true);
				
				m_return.avatar = $(obj).find(".post_avatar_image").attr('src');
				
				m_return.tags = "";
				if ($(obj).find(".post_tags").length > 0) {
					var to_return = "";
					$(obj).find(".post_tags").find(".post_tag").each(function() {
						var m_tag = $(this).html().substring(1);
						if (to_return === "") {
							to_return = m_tag;	
						} else {
							to_return = to_return + "," + m_tag;	
						}
					});
					m_return.tags = to_return;
				}
				
				return m_return;
				
			}
			
		});
		
		XKit.init = function() {
	
			// Check page then return control to init_extension.
			if (document.location.href.indexOf('http://www.tumblr.com/xkit_reset') !== -1 || 
				document.location.href.indexOf('http://www.tumblr.com/xkit_log') !== -1 || 
				document.location.href.indexOf('http://www.tumblr.com/xkit_editor') !== -1 || 
				document.location.href.indexOf('http://www.tumblr.com/xkit_update=') !== -1) {
				XKit.page.xkit = true;
				XKit.init_extension();
				return;
			}
			XKit.init_flags();
			if (top === self && document.location.href.indexOf("http://www.tumblr.com/dashboard/iframe?") === -1) { 
				XKit.page.standard = true;
				XKit.init_extension();
			} else { 
				XKit.console.add("In IFRAME, location: " + document.location.href);
				if (document.location.href.indexOf("http://www.tumblr.com/send") === -1) { 
					XKit.page.standard = true;
				}
				if (document.location.href.indexOf("http://www.tumblr.com/dashboard/iframe?") !== -1) {
					XKit.page.blog_frame = true;
				}
				if (document.location.href.indexOf("http://www.tumblr.com/ask_form/") !== -1) {
					XKit.page.ask_frame = true;
				}
				XKit.init_extension();
			}
		};
		
		// New Post Listener for Posts_v2
		XKit.post_listener.check = function() {
			if ($("#posts").length === 0) {
				return;
			}
			var post_count = $("#posts .post").length;
			if (XKit.post_listener.count === 0) {
				XKit.post_listener.count = post_count;
			} else {
				if (post_count !== XKit.post_listener.count) {
					XKit.post_listener.count = post_count;
					XKit.post_listener.run_callbacks();
				}
			} 
			setTimeout(XKit.post_listener.check, 3500);
		
		};

		// Increasing storage for extensions from 50kb to 150kb.
		XKit.storage.max_area_size = 153600;

		// Patch notifications adder
		XKit.notifications.add = function(message, type, sticky, callback) {

				//alert($("#xkit-notifications").length);
				if($("#xkit-notifications").length <= 0) {
					setTimeout(function() { XKit.notifications.add(message,type,sticky,callback); }, 500);
					return;
				}

				XKit.notifications.count++;
			
				var m_class = "";
				if (type === "mail") { m_class = "notification-mail"; }
				if (type === "ok") { m_class = "notification-ok"; }
				if (type === "error") { m_class = "notification-error"; }
				if (type === "warning") { m_class = "notification-warning"; }
			
				if (sticky === true) {
					m_class = m_class + " sticky";
				}
			
				var m_html = 	"<div class=\"xkit-notification " + m_class + "\" id=\"xkit_notification_" + XKit.notifications.count + "\">" + 
									message + 
								"</div>";
			
				$("#xkit-notifications").append(m_html);
			
				XKit.console.add(" Notification > " + message);
			
				var m_notification_id = XKit.notifications.count;
				setTimeout(function() {
					$("#xkit_notification_" + m_notification_id).slideDown('slow');
				}, 100);
				$("#xkit_notification_" + m_notification_id).click(function() {
					if(typeof callback !== undefined) {
						try { 
							callback();
						} catch(e) {
							// Meh.
						}
					}
					$("#xkit_notification_" + m_notification_id).slideUp('slow');
				});
				if (sticky !== true) {
					setTimeout(function() {
						$("#xkit_notification_" + m_notification_id).slideUp('slow');
					}, 5000);
				}
			};

	},

	destroy: function() {
		XKit.tools.remove_css("xkit_patches");
		this.running = false;
	}
	
});