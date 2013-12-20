//* TITLE Show Originals **//
//* VERSION 1.0 REV F **//
//* DESCRIPTION Only shows non-reblogged posts **//
//* DETAILS This is a really experimental extension allows you see original (non-reblogged) posts made by users on your dashboard. Please keep in mind that if you don't have enough people creating new posts on your dashboard, it might slow down your computer. **//
//* DEVELOPER STUDIOXENIX **//
//* FRAME false **//
//* BETA false **//
//* SLOW true **//

XKit.extensions.show_originals = new Object({

	running: false,
	slow: true,
	
	status: "false",
	lbl_on: "on",
	lbl_off: "off",
	dont_show_mine: false,

	run: function() {
		this.running = true;
		if (XKit.interface.where().dashboard !== true && XKit.interface.where().channel !== true) { return; }
		
		try {
			if (typeof XKit.extensions.tweaks !== "undefined") {
				if (XKit.extensions.tweaks.running === true) {
					if (XKit.extensions.tweaks.preferences.dont_show_mine_on_dashboard.value === true) {
						XKit.extensions.show_originals.dont_show_mine = true;
					}	
				}	
			}
		} catch(e) {
			console.log("show_originals -> can't read tweaks property: " + e.message);
			XKit.extensions.show_originals.dont_show_mine = false;
		}
		
		if (!$("body").hasClass("with_auto_paginate")) {
			if (XKit.storage.get("show_originals","shown_warning_about_scrolling","") !== "yass") {
				XKit.notifications.add("Show Originals only works when Endless Scrolling is turned on. Click here to learn more and disable this warning.", "warning", false, function() {
					XKit.window.show("Endless Scrolling required.","Show Originals require Endless Scrolling to be enabled on your dashboard. Click on the Tumblr Settings button (gear icon) on top-right of the page and then Dashboard > Enable endless scrolling.", "error", "<div class=\"xkit-button default\" id=\"xkit-close-message\">OK</div>");
					XKit.storage.set("show_originals","shown_warning_about_scrolling","yass");
				});
			}
			return;
		}
		
		XKit.extensions.show_originals.status = XKit.storage.get("show_originals","status","false");
		
		xf_html = '<ul class="controls_section" id="xshow_originals_ul">' + 
			'<li class="section_header selected">SHOW ORIGINALS</li>' +
			'<li class="no_push"><a href="#" onclick="return false;" id="xshoworiginals_button">' +
			'<div class="hide_overflow">Originals Only</div>' +
			'<div class="count" id="xshoworiginalsstatus">' + XKit.extensions.show_originals.lbl_off + '</div>' +
			'<div id="xshoworiginalsindicator">&nbsp;</div>' +
			'</a></li></ul>';
		$("ul.controls_section:eq(1)").before(xf_html);	
		
		XKit.extensions.show_originals.update_button();
		
		$("#xshow_originals_ul").click(function() {
			XKit.extensions.show_originals.toggle();
		});
		
		XKit.tools.init_css("show_originals");
		XKit.post_listener.add("show_originals", XKit.extensions.show_originals.do);
		XKit.extensions.show_originals.do();	
	},
	
	update_button: function() {
	
		if (XKit.extensions.show_originals.status == "true") {
			$("#xshoworiginalsindicator").addClass("on");
			$("#xshoworiginalsstatus").html(XKit.extensions.show_originals.lbl_on);
		} else {
			$("#xshoworiginalsindicator").removeClass("on");
			$("#xshoworiginalsstatus").html(XKit.extensions.show_originals.lbl_off);			
		}		
		
	},
	
	toggle: function() {
		
		if (XKit.extensions.show_originals.status == "true") {
			XKit.extensions.show_originals.status = "false";
			XKit.extensions.show_originals.do(true);
		} else {
			XKit.extensions.show_originals.status = "true";
			XKit.extensions.show_originals.do(false);
		}	
		
		XKit.extensions.show_originals.update_button();
		XKit.storage.set("show_originals", "status", XKit.extensions.show_originals.status);
		
	},
	
	do: function(force_shutdown) {
		
		if (force_shutdown || XKit.extensions.show_originals.status === "false") {
			$(".xkit-show-originals-checked").removeClass("xkit-show-originals-not-so-original").removeClass("xkit-show-originals-checked");
			$(".post.post_full").css("visibility","visible").css("display","block");
			return;
		}

		var size_changed = false;
		
		var posts = XKit.interface.get_posts("xkit-show-originals-checked");

		$(posts).each(function() {
			
			$(this).addClass("xkit-show-originals-checked");
			$(this).css("display","");
			
			var dont_show_this = false;
			if (XKit.extensions.show_originals.dont_show_mine === true) {
				if ($(this).hasClass("is_mine")) {
					dont_show_this = true;	
				}
			}
			
	  		if (!$(this).hasClass("is_original")) {
	  			$(this).addClass("xkit-show-originals-not-so-original");	
	  			size_changed = true;
	  		} else {
	  			$(this).addClass("xkit-show-originals-pretty-original");
	  		}
			
		});
		
		if (size_changed) {
		
			XKit.extensions.show_originals.call_tumblr_resize();
			
		}	
		
	},
	
	call_tumblr_resize: function() {
		
		XKit.tools.add_function(function() {
			Tumblr.Events.trigger("DOMEventor:updateRect");
		}, true, "");
		
	},
	
	destroy: function() {
		this.running = false;
	}

});