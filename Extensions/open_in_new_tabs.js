//* TITLE Open In Tabs **//
//* VERSION 1.1.2 **//
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
		$(document).on("click", XKit.extensions.open_in_new_tabs.do_open);
		
		$("a.post_info_link").addClass("xkit_open_in_new_tabs_in");
		$("a.post_avatar_link").addClass("xkit_open_in_new_tabs_av");
		$("a.post__avatar").addClass("xkit_open_in_new_tabs_sa");
		$("a.avatar_frame").addClass("xkit_open_in_new_tabs_af");
		
		$("a.xkit_open_in_new_tabs_in").removeClass("post_info_link");
		$("a.xkit_open_in_new_tabs_av").removeClass("post_avatar_link");
		$("a.xkit_open_in_new_tabs_sa").removeClass("post_sub_avatar");
		//$("a.xkit_open_in_new_tabs_af").removeClass("avatar_frame");
		
		$("a.xkit_open_in_new_tabs_in").attr('target','_blank');
		$("a.xkit_open_in_new_tabs_av").attr('target','_blank');
		$("a.xkit_open_in_new_tabs_sa").attr('target','_blank');
		$("a.xkit_open_in_new_tabs_af").attr('target','_blank');
		
		XKit.tools.add_css(".xkit_open_in_new_tabs_in{color: #A1A1A1; word-wrap: normal; white-space: nowrap;}" +
            ".xkit_open_in_new_tabs_av{background: #36465D none no-repeat scroll 50% 50% / cover; display: block; height: 64px; width: 64px; border-radius: 3px; overflow: visible;}" +
            ".xkit_open_in_new_tabs_sa{box-shadow: 0px 1px 1px rgba(0, 0, 0, 0.1); background-size: cover; text-decoration: none; position: absolute; border-radius: 3px; display: block; height: 30px; width: 30px; bottom: -3px; right: -3px;}" +
            ".xkit_open_in_new_tabs_af{font-family: \"tumblr-icons\",\"Blank\"; font-style: normal; font-weight: normal; font-variant: normal; text-transform: none; line-height: 1; font-size: 20px; color: #FFF; position: absolute; top: 10px; left: 10px; z-index: 2; float: left; border-radius: 3px;", +
            "open_in_new_tabs_css");
		
		/*$(document).on("click", ".note_link_current", function() {
		    $("a.avatar_frame").addClass("xkit_open_in_new_tabs_af");
		    $("a.xkit_open_in_new_tabs_af").removeClass("avatar_frame");
		    $("a.xkit_open_in_new_tabs_af").attr('target','_blank');
		    XKit.tools.add_css(".xkit_open_in_new_tabs_af {width: 25px; height: 25px; float: left;}", "open_in_new_tabs_note_css");
		}, true); */

	},

	do_open: function(e) {
	    
	    //XKit.window.show("do_open!", JSON.stringify(e.target), "info", "<div class=\"xkit-button default\" id=\"xkit-close-message\">OK</div>");
	    //return;

        
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
				window.open(m_url, "_blank");
			}

		} catch(e) {

			//alert(e.message);

		}

	},

	destroy: function() {
		this.running = false;
		$(document).off("click", "#right_column a", XKit.extensions.open_in_new_tabs.do_open);
		XKit.tools.remove_css("open_in_new_tabs_css");
		XKit.tools.remove_css("open_in_new_tabs_note_css");
	}

});
