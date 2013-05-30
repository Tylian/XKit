//* TITLE XKit Patches **//
//* VERSION 1.0 REV C **//
//* DESCRIPTION Patches framework **//
//* DEVELOPER STUDIOXENIX **//
XKit.extensions.xkit_patches = new Object({

	running: false,

	run: function() {
		this.running = true;

		XKit.tools.init_css("xkit_patches");
		
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

		// Patch notifications adder
		XKit.notifications.add = function(message, type, sticky, callback) {
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
				$("#xkit_notification_" + m_notification_id).slideDown('slow');
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