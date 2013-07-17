//* TITLE PostBlock **//
//* VERSION 0.1 REV B **//
//* DESCRIPTION Block the posts you don't like **//
//* DETAILS This is an experimental extension that blocks posts you don't like on your dashboard. When you block a post, it will be hidden completely, including reblogs of it. **//
//* DEVELOPER STUDIOXENIX **//
//* FRAME false **//
//* SLOW true **//
//* BETA false **//

XKit.extensions.postblock = new Object({

	running: false,
	slow: true,
	blacklisted: new Array(),

	run: function() {
		this.running = true;
		XKit.tools.init_css("postblock");
		
		if ($("body").hasClass("dashboard_messages_inbox") === true || $("body").hasClass("dashboard_messages_submissions") === true) {
			return;	
		}
		
		var m_blacklist = XKit.storage.get("postblock","posts","").split(",");
		if (m_blacklist !== "") {
			this.blacklisted = m_blacklist;	
		}
		
		console.log("total of " + this.blacklisted.length + " posts blocked");
		
		if ($("#posts").length > 0) {
			$(document).on('click','.xpostblockbutton', XKit.extensions.postblock.on_click);
			XKit.post_listener.add("postblock", XKit.extensions.postblock.do);
			XKit.extensions.postblock.do();	
		}
	},
	
	on_click: function(e) {
		
		var obj = e.target || e.srcElement;
		var parent = $(obj).parentsUntil("#posts");
		
		XKit.window.show("Block this post?","This post (including reblogs) will be blocked from your dashboard forever, without any indication that is was blocked.","question","<div class=\"xkit-button default\" id=\"xkit-post-block-ok\">Block Post</div><div class=\"xkit-button\" id=\"xkit-close-message\">Cancel</div>");
		
		$("#xkit-post-block-ok").click(function() {
			
			XKit.window.close();
			$(parent).fadeOut('slow', function() {
				$(parent).remove();
				XKit.extensions.postblock.call_tumblr_resize();	
			});
			if (XKit.extensions.postblock.blacklisted.indexOf($(obj).attr('data-root-id')) === -1) {
				XKit.extensions.postblock.blacklisted.push($(obj).attr('data-root-id'));
				XKit.storage.set("postblock","posts",XKit.extensions.postblock.blacklisted.join(","));
			}
			
		});

		
	},
	
	call_tumblr_resize: function() {
		
		XKit.tools.add_function(function() {
			Tumblr.Events.trigger("DOMEventor:updateRect");
		}, true, "");
		
	},
	
	do: function() {
		
		var size_changed = false;
		
		$(".post").not(".xpostblocked").not(".is_mine").each(function() {
			
			$(this).addClass("xpostblocked");
			
			this_id = $(this).attr('data-root-id');
			
			if (XKit.extensions.postblock.blacklisted.indexOf(this_id) !== -1) {
				$(this).parent().remove();
				size_changed = true;
				return;	
			}
			
			add_html = '<div class="xpostblockbutton post_control" data-root-id="' + this_id + '"></div>';
			
			if ($(this).find('.post_controls').find('.like_button').length > 0) {
				$(this).find('.post_controls').prepend(add_html);
			} else {
				$(this).find('.post_controls_inner').prepend(add_html);
			}
			
		});
		
		if (size_changed) {
		
			XKit.extensions.postblock.call_tumblr_resize();
			
		}	
		
	},

	destroy: function() {
		this.running = false;
		XKit.post_listener.remove("postblock");
		$(".xpostblockbutton").remove();
	}

});