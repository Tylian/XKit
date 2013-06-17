//* TITLE XKit Updates **//
//* VERSION 1.0 REV A **//
//* DESCRIPTION Provides automatic updating of extensions **//
//* DEVELOPER STUDIOXENIX **//
XKit.extensions.xkit_updates = new Object({

	running: false,

	default_interval: 18000000,
	min_interval: 3600000,
	max_interval: 86400000,

	preferences: {
		"show_notifications": {
			text: "Show update notifications",
			default: true,
			value: true
		},
		"check_interval": {
			text: "Update check interval (in milliseconds)",
			default: "18000000",
			value: "18000000",
			type: "text"
		},
	},

	run: function() {
		try {
			this.running = true;
			var d = new Date();
			var ms = d.getTime();
			var last_time = parseFloat(XKit.storage.get("xkit_updates", "last_update_check", "0"));
			var difference = ms - last_time;
			XKit.console.add("Updates: difference = " + difference);
			if (isNaN(XKit.extensions.xkit_updates.preferences.check_interval.value) === true) {
				XKit.console.add("Invalid check interval, reverting to default: not a number.");
				XKit.extensions.xkit_updates.preferences.check_interval.value = XKit.extensions.xkit_updates.default_interval;
			} else {
				var m_interval = XKit.extensions.xkit_updates.preferences.check_interval.value;
				if (m_interval > XKit.extensions.xkit_updates.max_interval || m_interval < XKit.extensions.xkit_updates.min_interval) {
					XKit.extensions.xkit_updates.preferences.check_interval.value = XKit.extensions.xkit_updates.default_interval;
					XKit.console.add("Invalid check interval, reverting to default: too small or big.");
				} 
			} 
			if (difference <= -1 ||difference >= XKit.extensions.xkit_updates.preferences.check_interval.value) {
				XKit.console.add("Starting update checking..");
				XKit.extensions.xkit_updates.get_list();
			} else {
				XKit.console.add("Skipping update checking.");
			}
		} catch(e) {
			XKit.extensions.xkit_updates.show_update_failure();
		}
	},

	to_update: "",
	to_update_index: 0,
	updated_list: "",
	updated_list_versions: "",

	get_list: function() {

		XKit.download.page("list.php", function(mdata) {

			if (mdata.server_down === true) {
				
				XKit.extensions.xkit_updates.show_update_failure();
				return;
			}

			XKit.extensions.xkit_updates.to_update_index = 0;
			XKit.extensions.xkit_updates.to_update = new Array();
			XKit.extensions.xkit_updates.updated_list = new Array();
			XKit.extensions.xkit_updates.updated_list_versions = new Array();

			for(var extension in mdata.extensions) {

				if (mdata.extensions[extension].version !== XKit.installed.get(mdata.extensions[extension].name).version) {
					if (XKit.installed.check(mdata.extensions[extension].name) === true) {
						XKit.extensions.xkit_updates.to_update.push(mdata.extensions[extension].name);
					}
				}

			}

			if (XKit.extensions.xkit_updates.to_update.length > 0) {
				XKit.notifications.add("Auto-update in progress..","warning");
				XKit.extensions.xkit_updates.update_next();
			} else {
				var d = new Date();
				var ms = d.getTime();
				XKit.storage.set("xkit_updates", "last_update_check", ms);
				XKit.console.add("Update complete: no new extensions");
			}

		});

	},

	show_update_failure: function() {

		XKit.notifications.add("<b>Could not update XKit:</b><br/>I could not reach the XKit servers to update myself. You might be running an old and buggy version of XKit. Click here for details.", "error", true, function() {

			XKit.window.show("Auto-Update failed.","XKit automatically updates itself from time to time in the background to bring you the latest features and bug fixes. Unfortunately, it was unable to contact the servers and download the latest updates. This might be a temporary server error or a problem with your connection.<br/><br/><b>If you have received this message more than twice in the last three days, it is highly recommended that you reset XKit.</b> If you don't, you'll be running an out-of-date XKit which might not work properly and cause problems.","error","<div class=\"xkit-button default\" id=\"xkit-close-message\">OK</div><a href=\"http://www.tumblr.com/xkit_reset\" class=\"xkit-button\">Reset XKit</a>");

		});

	},

	update_next: function() {

		if (XKit.extensions.xkit_updates.to_update_index >= XKit.extensions.xkit_updates.to_update.length) {

			var d = new Date();
			var ms = d.getTime();
			XKit.storage.set("xkit_updates", "last_update_check", ms);

			// Completed all?
			XKit.notifications.add("XKit updated " + XKit.extensions.xkit_updates.updated_list.length + " extension(s). Click here to view them.", "ok", true, function() {
				var m_result = "";
				for (i=0;i<XKit.extensions.xkit_updates.updated_list.length;i++) {
					m_result = m_result + "<br/>" + XKit.extensions.xkit_updates.updated_list[i] + " &middot; " + XKit.extensions.xkit_updates.updated_list_versions[i];
				}
				XKit.window.show("Auto-Update results","<b>XKit updated the following extension(s):</b>" + m_result, "info", "<div class=\"xkit-button default\" id=\"xkit-close-message\">OK</div>");
			});
			return;
		}

		XKit.extensions.xkit_updates.update(XKit.extensions.xkit_updates.to_update[XKit.extensions.xkit_updates.to_update_index], function(mdata) {

			if (mdata.errors === true) {
				if (mdata.error_not_found === true) {
					// Probably removed.
					XKit.console.add("Can not update " + XKit.extensions.xkit_updates.to_update[XKit.extensions.xkit_updates.to_update_index] + ": not found.");
				}else{
					XKit.extensions.xkit_updates.show_update_failure();
					return;
				}
			}

			XKit.extensions.xkit_updates.updated_list.push(mdata.title);
			XKit.extensions.xkit_updates.updated_list_versions.push(mdata.version);
			XKit.console.add("Updated " + XKit.extensions.xkit_updates.to_update[XKit.extensions.xkit_updates.to_update_index]);
			XKit.extensions.xkit_updates.to_update_index++;
			XKit.extensions.xkit_updates.update_next();

		});

	},

	update: function(extension_id, callback) {

		var m_result = new Object();
		

		XKit.install(extension_id, function(mdata) {
		
			if (mdata.errors == true || mdata.script == "") {
				if (mdata.storage_error === true) {
					m_result.errors = true;
					m_result.error = "Can't store data on browser";
					callback(m_result);
					return;
				}
				if (mdata.server_down === true) {
					m_result.errors = true;
					m_result.error = "Can't reach servers";
					callback(m_result);
				} else {
					if (mdata.file === "not_found") {
						m_result.errors = true;
						m_result.error_not_found = true;
						m_result.error = "Extension can't be found: It might've been removed from the extension gallery.";
						callback(m_result);
					} else {
						m_result.errors = true;
						m_result.error = "Unknown error. Code: #UPDATE-1026";
						callback(m_result);
					}
				}
				return;
			}
		
			try {
				// Try evaling the script.
				// If it's working, then move to the next one.
				m_result.errors = false;
				m_result.error = "";
				m_result.title = mdata.title;
				m_result.version = mdata.version;
				callback(m_result);
			} catch(e) {
				m_result.errors = true;
				m_result.error = "UP-ER:" + e.message;
				callback(m_result);
			}
		
		});

	},

	destroy: function() {
		this.running = false;
	}
	
});