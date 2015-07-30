//* TITLE Editable Reblogs **//
//* VERSION 1.0.2 **//
//* DESCRIPTION	Restores ability to edit previous reblogs of a post **//
//* DEVELOPER dlmarquis **//
//* FRAME false **//
//* BETA false **//

XKit.extensions.editable_reblogs = new Object({

	running: false,

	run: function() {
		this.running = true;

		XKit.interface.post_window_listener.add("editable_reblogs", XKit.extensions.editable_reblogs.post_window);
	},

	post_window: function() {
		var reblog_tree = $(".reblog-tree");
		if (reblog_tree.length <= 0) {
			return;
		}

		var reblog_content = reblog_tree.html();

		var old_content = XKit.interface.post_window.get_content_html();
		XKit.interface.post_window.set_content_html(reblog_content + old_content);

		$(".btn-remove-tree").click();

		XKit.tools.add_css(".control-reblog-tree {display: none; }", "editable_reblogs_remove_content_tree");
	},

	destroy: function() {
		this.running = false;
		XKit.tools.remove_css("editable_reblogs_remove_content_tree");
	}

});
