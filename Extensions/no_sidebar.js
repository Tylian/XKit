//* TITLE No Sidebar **//
//* VERSION 1.1 REV G **//
//* DESCRIPTION Disables the blog preview sidebar. **//
//* DEVELOPER STUDIOXENIX **//
//* FRAME false **//
//* BETA false **//

XKit.extensions.no_sidebar = new Object({

	running: false,

	run: function() {
		this.running = true;

		if (document.location.href.indexOf('/mega-editor/') != -1)
			return;

		XKit.post_listener.add("no_sidebar", XKit.extensions.no_sidebar.do);
		XKit.extensions.no_sidebar.do();
	},

	do: function() {

		$("a").off("click", XKit.extensions.no_sidebar.click);
		$("a").on("click", XKit.extensions.no_sidebar.click);

		$(".note_link_current").off("click", XKit.extensions.no_sidebar.click_notes);
		$(".note_link_current").on("click", XKit.extensions.no_sidebar.click_notes);

	},

	click_notes: function(e) {

		if ($(".notes_container").length == 0) {
			setTimeout(function() { XKit.extensions.no_sidebar.click_notes(e); }, 100);
		}

		XKit.extensions.no_sidebar.do();

	},

	click: function(e) {

		var link = $(this).attr('href');
		if (link == "#" || typeof link == "undefined" || link == "")
			return;

		var open_in_tab = false;
		var tmp_link = link.replace("http://","").replace("https://","");
		var link_components = tmp_link.split(".");

		if (link_components.length == 3)
			open_in_tab = true;

		if ($(this).hasClass("post_info_link") || $(this).hasClass("post_avatar_link"))
			open_in_tab = true;

		if ($(this).hasClass("tumblelog"))
			open_in_tab = true;

		if ($(this).hasClass("xoldeheader-item") || $(this).hasClass("tab_anchor"))
			open_in_tab = false;

		if (link.indexOf("://www.tumblr.com") != -1)
			open_in_tab = false;

		if (open_in_tab) {
			e.preventDefault();
			window.open($(this).attr('href'));
			return false;
		}

	},

	destroy: function() {
		this.running = false;
		$(".note_link_current").off("click", XKit.extensions.no_sidebar.click_notes);
		$("a").off("click", XKit.extensions.no_sidebar.click);
	}

});