//* TITLE Header Options **//
//* VERSION 2.0 REV A **//
//* DESCRIPTION Customize the header. **//
//* DEVELOPER STUDIOXENIX **//
//* DETAILS This extension adds your blogs on the top of the page, so you can easily switch between blogs. The blog limit on the header is five, but you can limit this to three blogs and turn off the blog title bubble from the settings. **//
//* FRAME false **//
//* BETA false **//

XKit.extensions.classic_header = new Object({

	running: false,
	slow: true,

	preferences: {
		"sep0": {
			text: "Header Appearance",
			type: "separator",
		},
		"fixed_width": {
			text: "Fixed width header",
			default: false,
			value: false
		},
		"fixed_position": {
			text: "Fixed position header (un-stickify)",
			default: false,
			value: false
		},
		"fix_color": {
			text: "Make the tab notification bubbles red again",
			default: false,
			value: false
		},
		"sep1": {
			text: "Blogs on the header",
			type: "separator",
		},
		"show_avatars": {
			text: "Show my blogs on the header",
			default: true,
			value: true
		},
		appearance: {
			text: "Avatar Appearance",
			default: "circle",
			value: "circle",
			type: "combo",
			values: [
				"Circle (default)", "circle",
				"Rounded Box", "box"
			],
		},
		maximum: {
			text: "Maximum blogs to show",
			default: "b3",
			value: "b3",
			type: "combo",
			values: [
				"1 Blog", "b1",
				"2 Blogs", "b2",
				"3 Blogs", "b3",
				"4 Blogs", "b4",
				"5 Blogs", "b5"
			],
		},
		"show_bubble": {
			text: "Show blog title bubble on hover",
			default: true,
			value: true
		}
	},

	run: function() {

		XKit.tools.init_css("classic_header");
		$("#xoldeheader").remove();
		
		if (XKit.extensions.classic_header.preferences.show_avatars.value == true) {
			XKit.extensions.classic_header.show_blogs();	
		}
		
		if (XKit.extensions.classic_header.preferences.fixed_width.value == true) {
			XKit.tools.add_css(" #search_query, .search_form_field, .search_form_row { width: 150px !important; } .ui_search { width: 160px !important; } .l-header { width: 925px !important; min-width: 925px !important; } .l-header.l-fixed-header { width: 925px !important; }", "classic_header_fixed_width");
			$(".l-header").addClass("l-fixed-header");
		}
		
		if (XKit.extensions.classic_header.preferences.fixed_position.value == true) {
			XKit.tools.add_css(" .l-header-container { position: absolute !important; }", "classic_header_fixed_position");
		}
		
		if (XKit.extensions.classic_header.preferences.fix_color.value == true) {
			XKit.tools.add_css(" .tab_notice { background: #bc5555 !important; } .selected .tab_notice { background: #bc3333 !important; }", "classic_header_fixed_color");
		}

	},
	
	show_blogs: function() {
	
		if (document.location.href.indexOf("/following") !== -1) {
			return;
		}
		var m_html = "";
		var m_counter = 0;
		var max_count = 6;
		
		if (XKit.extensions.classic_header.preferences.maximum.value !== "") {
			max_count = parseInt(XKit.extensions.classic_header.preferences.maximum.value.substring(1)) + 1;
		}
		
		if (XKit.extensions.classic_header.preferences.appearance.value === "box") {
			XKit.tools.add_css(".xoldeheader-item { border-radius: 7px !important; }", "classic_header_box");	
		} 

		try {
		if ($("#popover_button_blogs").length > 0) {
			$("#popover_blogs > .popover_inner").children(".item").not(":last-child").each(function(index, obj){
				mX = $(this).attr("id");
				mX = mX.substring(9, mX.length);
				m_counter++;
				var blog_icon = $(this).find(".blog_icon").css('background-image');
				if (m_counter >= max_count) {
					return false;
				}
				var blog_name = $(this).find("span").text();
				var is_private = "";
				if (typeof blog_icon === "undefined" || blog_icon === "none") {
					blog_icon = "no-repeat url(\"http://assets.tumblr.com/images/lock_avatar.png\") 50% / 8px";
				}
				m_html = m_html + '<div class="xoldeheader-item-container">' +
						'<a href="http://www.tumblr.com/blog/' + mX + '/" class="xoldeheader-item"' +
						' id="xoldeheader-item-' + mX + '"' + 
						' style=\'background: ' + blog_icon + '\' title="' + blog_name + '">&nbsp;</a>' + 
						' <div class="selection_nipple"></div></div>';
		
				//xset("xoldeheader_html",m_html);
				XKit.storage.set("classic_header","header_html",m_html);
			});
		} else {
			if (XKit.storage.get("classic_header", "header_html","") === "") {
				return;
			} else {
				m_html = XKit.storage.get("classic_header", "header_html","");
			}
		}
		$("#unread_tag_notice").remove();
		$("#user_tools").prepend('<div id="xoldeheader">' + m_html + '</div>');

		if (XKit.extensions.classic_header.preferences.show_bubble.value === true) {
			$(".xoldeheader-item").tipTip({maxWidth: "auto", edgeOffset: 10, delay: 10, edgeOffset: 5 });
		}

		//$(".search_form_row").css("width", "120px");
		//$(".ui_search").css("width", "120px");
		//$("#search_query").attr('placeholder','Search');
		//$("#search_query_submit").css("display","none");
		
		if (document.location.href.indexOf('/blog/') !== -1) {
	
			var user_url = document.location.href.substring(document.location.href.indexOf('/blog/') + 6);
			user_url = user_url.replace("#","");
			if (user_url.indexOf("/") !== -1) {
				user_url = user_url.substring(0,user_url.indexOf("/"));
			}
	
			$("#xoldeheader-item-" + user_url).addClass("selected");
			$("#xoldeheader-item-" + user_url).parent().addClass("selected");
			$("#home_button").removeClass("selected");
	
		}

		} catch(e) {
			XKit.console.add(e.message);
		}	
		
	},
	
	destroy: function() {
		XKit.tools.remove_css("classic_header");
		XKit.tools.remove_css("classic_header_fixed_color");
		XKit.tools.remove_css("classic_header_fixed_position");
		XKit.tools.remove_css("classic_header_fixed_width");
		$("#search_field").appendTo("#user_tools");
		$("#xoldeheader").remove();
		XKit.tools.remove_css("classic_header_box");
		//$("#search_query_submit").css("display","block");
		//$(".search_form_row").css("width", "215px");
		//$(".ui_search").css("width", "215px");
	}
	
});
