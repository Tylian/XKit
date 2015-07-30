//* TITLE Editable Reblogs **//
//* VERSION 1.0.7 **//
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

		var old_content = ""; // $(".editor:eq(2)").html(); // (for some reason this is broken)

		// This is actually get_content_html but noooo, some people aren"t updated yet.
		if (XKit.interface.post_window.get_content_html) {
			old_content = XKit.interface.post_window.get_content_html();
		} else {
			var content_editor = $(".post-form--form").find(".editor.editor-richtext");
			old_content = content_editor.html();
		}

		XKit.interface.post_window.set_content_html(reblog_content + old_content);

		$(".btn-remove-tree").click();

		XKit.tools.add_css(".control-reblog-tree {display: none; }", "editable_reblogs_remove_content_tree");
	},

	destroy: function() {
		this.running = false;
		XKit.tools.remove_css("editable_reblogs_remove_content_tree");
	}

});
