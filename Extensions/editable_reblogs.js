//* TITLE Editable Reblogs **//
//* VERSION 1.0.9 **//
//* DESCRIPTION	Restores ability to edit previous reblogs of a post **//
//* DEVELOPER dlmarquis **//
//* FRAME false **//
//* BETA false **//

XKit.extensions.editable_reblogs = new Object({

	running: false,

	run: function() {
		this.running = true;

		XKit.interface.post_window_listener.add("editable_reblogs", XKit.extensions.editable_reblogs.post_window);
		XKit.tools.add_css(".control-reblog-tree {display: none; }", "editable_reblogs_remove_content_tree");
	},

	post_window: function() {
		var reblog_tree = $(".reblog-tree");
		if (reblog_tree.length <= 0) {
			return;
		}

		// Guard against double evaluation by marking the tree as processed
		var processed_class = 'xkit-editable-reblogs-done';
		if (reblog_tree.hasClass(processed_class)) {
			return;
		}
		reblog_tree.addClass(processed_class);

		// Convert all of the user links to have class tumblr_blog
		var top_quote_link = reblog_tree.find('p:first-child > a:first-child');
		var quote_links = reblog_tree.find('blockquote > p:first-child > a:first-child');

		if (top_quote_link.length > 0) {
			$(top_quote_link[0]).addClass('tumblr_blog');
		}
		quote_links.each(function() {
			$(this).addClass('tumblr_blog');
		});

		var reblog_content = reblog_tree.html();

		var old_content = XKit.interface.post_window.get_content_html();
		XKit.interface.post_window.set_content_html(reblog_content + old_content);

		$(".btn-remove-tree").click();
	},

	destroy: function() {
		this.running = false;
		XKit.tools.remove_css("editable_reblogs_remove_content_tree");
		XKit.interface.post_window_listener.remove("editable_reblogs");
	}
});
