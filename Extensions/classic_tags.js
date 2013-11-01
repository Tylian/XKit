//* TITLE Tags on Sidebar **//
//* VERSION 1.2 REV B **//
//* DESCRIPTION Shows your tracked tags on your sidebar **//
//* DEVELOPER STUDIOXENIX **//
//* FRAME false **//
//* BETA false **//

XKit.extensions.classic_tags = new Object({

	running: false,
	slow: true,
	
	preferences: {
		"only_new_tags": {
			text: "Only show tags with new posts",
			default: false,
			value: false
		},
		"open_in_new_tab": {
			text: "Open the tag results in a new window",
			default: false,
			value: false
		}		
	},

	run: function() {
		
		try {
		
			XKit.tools.init_css("classic_tags");
			var str_sub = "";
			if (document.location.href.indexOf('/tagged') !== -1) {
				str_sub = document.location.href.substr(document.location.href.lastIndexOf("/")+1);
				str_sub = str_sub.replace("+"," ");
			}
		
			if ($("#dashboard_controls_open_blog").length === 0) {
				if (document.location.href.indexOf('/tagged') === -1) {
					return;
				}
			}
		
			if ($(".tracked_tags").length > 0) {
				XKit.extensions.classic_tags.show();	
			}
		
		} catch(e) {
		
			XKit.console.add("Can't run Classic Tags:" + e.message);
		
		}
	},
	
	show: function() {
	
		var str_sub = "";
		
		if (document.location.href.indexOf('/tagged') !== -1) {
			str_sub = document.location.href.substr(document.location.href.lastIndexOf("/")+1);
			str_sub = str_sub.replace("+"," ");
		}
		
		if ($("#dashboard_controls_open_blog").length === 0) {
			if (document.location.href.indexOf('/tagged') === -1) {
				return;
			}
		}
		
		str_sub = XKit.tools.replace_all(str_sub, "\\\+", " ");
	
		var show_this_tag = false;
		var extra_classes = "";
		var m_html = "";
		
		$(".tracked_tag").each(function() {
		
			if (parseInt($(this).find(".count").html()) > 0) {
				show_this_tag = true;	
			} else {
				if (XKit.extensions.classic_tags.preferences.only_new_tags.value === true) {
					return;
				}
			}
			
			var m_link = $(this).find(".result_link").attr('href').replace(/\+/g, '-');
			
			/*if ($(this).find(".hide_overflow").html() == "#" + str_sub) {
				extra_classes = "selected";
			} else {
				extra_classes = "";
			}*/
			
			// console.log("______________ " + m_link + "\n" + document.location.href);
			if ($("body").attr('data-page-root') === m_link) {
				extra_classes = "selected";
			} else {
				extra_classes = "";	
			}
			
			var m_title = $(this);
			
			if (XKit.extensions.classic_tags.preferences.open_in_new_tab.value === true) {
				$(m_title).find(".result_link").attr('target','_BLANK');	
			} else {
				$(m_title).find(".result_link").attr('target','');	
			}
			
			$(m_title).find(".result_title").html($(m_title).find(".result_title").html().replace("#",""));
			
			m_html = m_html + '<li class="xtag ' + extra_classes + '"><div class="hide_overflow">' + $(m_title).html() + '</div></li>';
		
		});
		
		if (m_html !== "") {
		
			m_html = '<ul class="controls_section" id="xtags"><li class=\"section_header selected\">TRACKED TAGS</li>' + m_html + '</ul>';
			
			if (document.location.href.indexOf('/tagged/') !== -1) {
				
				$("#right_column").append(m_html);
				
			} else {
		
				if ($("ul.controls_section:eq(1)").length > 0) {
					if ($("#xim_small_links").length > 0) {
						$("#xim_small_links").after(m_html);
					} else {
						$("ul.controls_section:eq(1)").after(m_html);
					}
				} else {
					$("#right_column").prepend(m_html);
				}
			}
			
			$(".xtag").each(function() {
				$(this).find(".count").html(parseInt($(this).find(".count").html()));
			});	
		
		}
	
	},
	
	destroy: function() {
		XKit.tools.remove_css("classic_tags");
		$("#xtags").remove();
	}
	
});