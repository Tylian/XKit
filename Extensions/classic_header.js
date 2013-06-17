//* TITLE Classic Header **//
//* VERSION 1.0 REV B **//
//* DESCRIPTION Switch between blogs from the header **//
//* DEVELOPER STUDIOXENIX **//
//* DETAILS This extension adds your blogs on the top of the page, so you can easily switch between blogs. The blog limit on the header is five, but you can limit this to three blogs and turn off the blog title bubble from the settings. **//
//* FRAME false **//
//* BETA false **//

XKit.extensions.classic_header = new Object({

	running: false,
	slow: true,

	preferences: {
		"sep0": {
			text: "Appearance",
			type: "separator",
		},
		"show_bubble": {
			text: "Show blog title bubble on hover",
			default: true,
			value: true
		},
		"show_max_three": {
			text: "Show maximum 3 blogs",
			default: true,
			value: true
		},
	},

	run: function() {

		XKit.tools.init_css("classic_header");

		if (document.location.href.indexOf("/following") !== -1) {
			return;
		}
		var m_html = "";
		var m_counter = 0;
		var max_count = 6;
		if (XKit.extensions.classic_header.preferences.show_max_three.value === true) {
			max_count = 4;
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
				if (typeof blog_icon === "undefined") {
					blog_icon = "url(\"http://assets.tumblr.com/images/lock_avatar.png\")";
				}
				m_html = m_html + '<div class="xoldeheader-item-container">' +
						'<a href="http://www.tumblr.com/blog/' + mX + '/" class="xoldeheader-item"' +
						' id="xoldeheader-item-' + mX + '"' + 
						' style=\'background-image: ' + blog_icon + '\' title="' + blog_name + '">&nbsp;</a>' + 
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

		$(".search_form_row").css("width", "120px");
		$(".ui_search").css("width", "120px");
		$("#search_query").attr('placeholder','Search');
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
		$("#search_field").appendTo("#user_tools");
		$("#xoldeheader").remove();
		$("#search_query_submit").css("display","block");
		$(".search_form_row").css("width", "215px");
		$(".ui_search").css("width", "215px");
	}
	
});