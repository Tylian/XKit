//* TITLE Mute! **//
//* VERSION 1.1 REV D **//
//* DESCRIPTION Better than 'shut up!' **//
//* DETAILS This extension allows you to hide text and answer posts by an user while still seeing their other posts. Useful if a blogger has nice posts but a bad personality. Please note that you'll need to re-mute them if a user changes their URL. **//
//* DEVELOPER STUDIOXENIX **//
//* FRAME false **//
//* BETA false **//
//* SLOW true **//

XKit.extensions.mute = new Object({

	running: false,
	slow: true,
	
	preferences: {
		"title": {
			text: "Muted users",
			type: "separator"
		}	
	},
	
	muted: new Array(),

	run: function() {
		this.running = true;
		XKit.tools.init_css("mute");
		var m_list = XKit.storage.get("mute", "muted_list", "");
		if (m_list === "") {
			XKit.extensions.mute.muted = new Array();	
		} else {
			try {
				XKit.extensions.mute.muted = JSON.parse(m_list);	
			} catch(e) {
				XKit.extensions.mute.muted = new Array();
				XKit.extensions.mute.save();
			}
		}

		XKit.post_listener.add("mute", XKit.extensions.mute.do_posts);
		XKit.extensions.mute.do_posts();
	},
	
	do_posts: function(rethink) {
	
		$('.tumblelog_menu_button').unbind('click', XKit.extensions.mute.add_mute_link);
		$('.tumblelog_menu_button').bind('click', XKit.extensions.mute.add_mute_link);
	
		if (rethink === true) {
		
			$('.post.is_regular, .post.is_note').each(function() {
			
				var m_username = $(this).attr('data-tumblelog-name');
				$(this).addClass("xmute-done");
				
				if (XKit.extensions.mute.muted.indexOf(m_username) !== -1) {
					$(this).addClass("xmute-muted");	
				} else {
					$(this).removeClass("xmute-muted");	
				}
			
			});	
			
		} else {
	
			$('.post.is_regular, .post.is_note').not(".xmute-done").each(function() {
			
				var m_username = $(this).attr('data-tumblelog-name');
				$(this).addClass("xmute-done");
				
				if (XKit.extensions.mute.muted.indexOf(m_username) !== -1) {
					$(this).addClass("xmute-muted");	
				}
			
			});
		
		}
		
	},
	
	add_mute_link: function(e) {

		var menu_box = $(e.target).parent().find(".tumblelog_menu_popover");
		var user_url = $(menu_box).parent().find(".tumblelog_menu_link").attr('data-tumblelog-name');
		var m_class = "";
		
		var m_sentence = "Mute";
		if (XKit.extensions.mute.muted.indexOf(user_url) !== -1) {
			m_sentence = "Unmute";	
			m_class = "already_muted";
		}
		
		if ($(menu_box).find(".xkit-mute-button").length > 0) {
			// Remove first.
			$(menu_box).find(".xkit-mute-button").parent().remove();
		};
		
		/*
		
		The new menu structure:
		
		<div class="popover_menu_item">
                    <a class="user_menu_toggle_follow tumblelog_menu_link unfollow">
                        <span class="hide_overflow">
                            <span class="follow">Follow</span>
                            <span class="unfollow">Unfollow</span>
                        </span>
                    </a>
                </div>
                
                */
                
                var m_html = 	"<div class=\"popover_menu_item\">" +
                			"<a onclick=\"return false;\" class=\"tumblelog_menu_link xkit-mute-button " + m_class + " xkit-mute-button-" + user_url + "\" data-user-url=\"" + user_url + "\">" +
                				"<span class=\"hide_overflow\">" + m_sentence + "</span>" +
                			"</a>" +
                		"</div>";
                					
		$(menu_box).find(".open_in_tab").parent().before(m_html);
		
		var m_target = e.target;
		
		$(".xkit-mute-button-" + user_url).unbind('click');
		$(".xkit-mute-button-" + user_url).bind('click', function() {
		
			XKit.extensions.mute.toggle_mute(user_url);
			setTimeout(function() { $("#glass_overlay").trigger('click'); }, 10);
			$("#glass_overlay").removeClass("show");
			$(m_target).trigger('click');
			
		});
		
	},
	
	toggle_mute: function(user_url) {
	
		if (XKit.extensions.mute.muted.indexOf(user_url) !== -1) {
			
			// Unmute!
			var m_index = XKit.extensions.mute.muted.indexOf(user_url);
			XKit.extensions.mute.muted.splice(m_index, 1);
			XKit.extensions.mute.save();
			XKit.extensions.mute.do_posts(true);
		
		} else {
		
			// Mute!
			if (XKit.extensions.mute.muted.length >= 101) {
				XKit.window.show("Can't mute.","You have over a hundred muted blogs.<br/>Please remove some before muting people.","error","<div class=\"xkit-button default\" id=\"xkit-close-message\">OK</div>");
				return;
			}
			
			XKit.extensions.mute.muted.push(user_url);
			XKit.extensions.mute.save();
			XKit.extensions.mute.do_posts(true);
		
		}	
		
	},
	
	save: function() {
		
		XKit.storage.set("mute", "muted_list", JSON.stringify(XKit.extensions.mute.muted));
		
	},

	destroy: function() {
		this.running = false;
		XKit.tools.remove_css("mute");
		$('.user_menu_info_button').unbind('click', XKit.extensions.mute.add_mute_link);
		$(".xkit-mute-button").remove();
		$(".xmute-muted").removeClass("xmute-muted");	
	},
	
	create_div: function(ud) {
	
		return "<div class=\"xkit-muted-user\">" + ud + "<div class=\"xkit-unmute-user-button\" data-user-name=\"" + ud + "\">&#10006;</div></div>";	
		
	},
	
	cpanel: function(mdiv) {
	
		if ($("#xkit-control-panel-mute").length > 0) {
			$("#xkit-control-panel-mute").remove();
		}	
		
		if (XKit.extensions.mute.muted.length <= 0) {
			var m_html = "<div id=\"xkit-control-panel-mute\" class=\"no-muted-users\"><b>You have no muted users.</b><br/>You can add some using the \"i\" menu on their avatars on your dashboard.<br/>Hover over their avatar, click on the \"i\", then Mute.</div>";
			$(mdiv).append(m_html);
			return;
		}
		
		var m_html = "";
		for(var i=0;i<XKit.extensions.mute.muted.length;i++) {
			m_html = m_html + XKit.extensions.mute.create_div(XKit.extensions.mute.muted[i]);		
		}
		
		$(mdiv).append("<div id=\"xkit-control-panel-mute\">" + m_html + "</div>");
		
		$(".xkit-unmute-user-button").unbind("click");
		$(".xkit-unmute-user-button").bind("click", function() {
		
			var m_username = $(this).attr('data-user-name');
			var m_index = XKit.extensions.mute.muted.indexOf(m_username);
			XKit.extensions.mute.muted.splice(m_index, 1);
			XKit.extensions.mute.save();
			XKit.extensions.mute.do_posts(true);
			XKit.extensions.mute.cpanel(mdiv);
			
		});
		
	}

});