//* TITLE Open In Tabs **//
//* VERSION 1.0 REV B **//
//* DESCRIPTION Changes links to open in new tabs **//
//* DETAILS <i>Warning: This is an experimental extension, and might cause problems. Please do not install if you are uncomfortable with this.</i><br/><br/>Open In Tabs allows you to open links on new tabs, useful if you don't like being confined to one tab. Since some links, if opened in new tabs, can break functionality, they are not effected by this extension. **//
//* DEVELOPER STUDIOXENIX **//
//* FRAME false **//
//* BETA false **//
//* SLOW true **//

XKit.extensions.open_in_new_tabs = new Object({

	running: false,
	slow: true,

	run: function() {
		this.running = true;

		$("#content area").attr('target','_blank');
		$(document).on("click", "#right_column a", XKit.extensions.open_in_new_tabs.do_open);

	},

	do_open: function(e) {

		var m_box = e.target;

		var m_url = $(m_box).attr('href');
		if (typeof m_url === "undefined") {
			m_url = $(m_box).parent().attr('href');
		}

		if (m_url === "#") { return; }
		if (typeof $(m_box).attr('onclick') !== "undefined" || typeof $(m_box).parent().attr('onclick') !== "undefined") { return; }
		if (typeof m_url === "undefined") { return; }
		if ($(m_box).hasClass("photoset_photo") === true) { alert("no3"); return; }

		try {
			var open_new_tab = false;
			if (typeof $(m_box).attr('target') === "undefined") {
				open_new_tab = true;
			} else {
				if($(m_box).attr('target').toLowerCase() !== "_blank") {
					open_new_tab = true;
				}
			}

			if(open_new_tab === true) {
				e.preventDefault();
				window.open(m_url);
			}

		} catch(e) {

			//alert(e.message);

		}

	},

	destroy: function() {
		this.running = false;
		$(document).off("click", "#right_column a", XKit.extensions.open_in_new_tabs.do_open);
	}

});