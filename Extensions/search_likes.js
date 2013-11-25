//* TITLE Search Likes **//
//* VERSION 0.1 REV A **//
//* DESCRIPTION Lets you search likes **//
//* DEVELOPER STUDIOXENIX **//
//* DETAILS This is a very experimental extension that lets you search the posts you've liked by URL or text. Just go to your likes page, then click on Search button to get started. **//
//* FRAME false **//
//* BETA false **//

XKit.extensions.search_likes = new Object({

	running: false,

	run: function() {
		this.running = true;

		if (document.location.href.indexOf("http://www.tumblr.com/likes") !== -1) {
			
			
		XKit.tools.init_css("search_likes");
			
		var m_html = 	'<li id="xkit-search-likes-li">' +
				'<a href="#" class="customize" id="xkit-search-likes-button">' +
					'<div class="hide_overflow">Search liked posts</div>' +
				'</a>' +
				'</li>';

		var x_html = 	"<div id=\"xkit-search-likes-box\">" +
					"<input type=\"text\" placeholder=\"Enter URL/text...\" id=\"xkit-search-likes-input\">" +
				"</div>";
		
		m_html = '<ul class="controls_section" id="xkit-search-likes-ul"><li class=\"section_header selected\">SEARCH LIKES</li>' + m_html + '</ul>';
		
		$("ul.controls_section:eq(1)").after(m_html);
		$("#xkit-search-likes-ul").before(x_html);
		
		$("#xkit-search-likes-button").bind("click", function() {
			
			XKit.extensions.search_likes.search_start();	
			
		});
		
		$("#xkit-search-likes-input").keyup(function() {

			var m_value = $(this).val().toLowerCase();
			m_value = $.trim(m_value);
			
			$(".xkit-search-likes-done").removeClass("xkit-search-likes-done");
			XKit.extensions.search_likes.term = m_value;
			XKit.extensions.search_likes.search_do_posts();
			
			$(".xkit-search-likes-done").removeClass("xkit-search-likes-done").removeClass("xkit-search-likes-found");

		});
		
		}
		
	},
	
	term: "",
	
	update_rect: function() {
		
		XKit.tools.add_function(function() {
			Tumblr.Events.trigger("DOMEventor:updateRect");
		}, true, "");	
		
	},
	
	search_do_posts: function() {
		
		var m_term = XKit.extensions.search_likes.term;
		
		if (m_term.length <= 2) {
			
			// Show all.
			
			$(".post").parent().addClass("xkit-search-likes-force-found");
			$(".post").parent().slideDown('fast');
			
			$("#xkit-search-likes-status-bar").remove();

			XKit.extensions.search_likes.update_rect();
			$(".post:gt(30)").parent().remove();
			
			return;
		} else {
		
			$(".xkit-search-likes-force-found").removeClass("xkit-search-likes-force-found");	
			
		}
		
		var i_html = "Searching for <b>\"" + m_term + "\"</b><br/><span id=\"xkit-search-likes-found-count\">0</span> results found so far, inspected <span id=\"xkit-search-likes-total-count\">0</span> posts.<br/><small>Scroll down to load more posts and results.</small>";
		
		if ($("#xkit-search-likes-status-bar").length > 0) {
			$("#xkit-search-likes-status-bar").html(i_html);
		} else {
			$("#posts").before("<div id=\"xkit-search-likes-status-bar\">" + i_html + "</div>");
		}
		
		$(".post").not("xkit-search-likes-done").each(function() {
				
			var username = $(this).attr('data-tumblelog-name');
			var hide_this = false;
			
			$(this).addClass("xkit-search-likes-done");
			
			var to_search_in = $(this).find(".post_body").text().toLowerCase();

			if (typeof username !== "undefined") {
				to_search_in = to_search_in + username;
			}
			
			document.title = m_term;
			
			if (to_search_in.indexOf(m_term) === -1) {
				hide_this = true;
			}
			
			if (!hide_this) {
					
				$(this).parent().slideDown('fast');
				$(this).parent().addClass("xkit-search-likes-found");
				
				$(this).find(".post_body").find("mark").contents().unwrap();
				var m_html = XKit.extensions.search_likes.return_highlighted_html($(this).find(".post_body").html(), m_term);
				$(this).find(".post_body").html(m_html);
					
			} else {
					
				$(this).parent().slideUp('fast');
				$(this).parent().removeClass("xkit-search-likes-found");
				$(this).find(".post_body").find("mark").contents().unwrap();
					
			}	
				
		});
		
		$("#xkit-search-likes-found-count").html($(".xkit-search-likes-found").length);
		$("#xkit-search-likes-total-count").html($(".post").length);
		
	},
	
	return_highlighted_html: function(src_str, term) {
		
		/* from http://jsfiddle.net/UPs3V/ */
		
		try {
		
			term = term.replace(/(\s+)/,"(<[^>]+>)*$1(<[^>]+>)*");
			var pattern = new RegExp("("+term+")", "i");

			src_str = src_str.replace(pattern, "<mark>$1</mark>");
			src_str = src_str.replace(/(<mark>[^<>]*)((<[^>]+>)+)([^<>]*<\/mark>)/,"$1</mark>$2<mark>$4");
		
			return src_str;
		
		} catch(e) {
			
			return src_str;	
			
		}
		
	},
	
	search_start: function() {
		
		$("#xkit-search-likes-button").toggleClass("xkit-in-search");	
		
		if ($("#xkit-search-likes-button").hasClass("xkit-in-search")) {
		
			$("#xkit-search-likes-li").addClass("selected");
			
			XKit.extensions.search_likes.term = "";
			$("#xkit-search-likes-input").val("");
			
			$("#right_column").children().not("#xkit-search-likes-ul").not("#xkit-search-likes-box").slideUp('slow');	
			$("#xkit-search-likes-box").slideDown('slow');	
			
			XKit.post_listener.add("search_likes", XKit.extensions.search_likes.search_do_posts);
			XKit.extensions.search_likes.search_do_posts();
			
			XKit.tools.add_css(" #posts.posts>.post_container { display: none; } ", "search-likes-in-search");
			
		} else {
			
			$("#xkit-search-likes-li").removeClass("selected");
			
			XKit.post_listener.remove("search_likes", XKit.extensions.search_likes.search_do_posts);
			XKit.tools.remove_css("search-likes-in-search");
			
			$(".post").parent().addClass("xkit-search-likes-found");
			$(".post").parent().slideDown('fast');
			
			$(".xkit-search-likes-done").removeClass("xkit-search-likes-done");
			
			$("#xkit-search-likes-status-bar").slideUp('slow', function() { $(this).remove(); });

			XKit.extensions.search_likes.update_rect();
			
			$(".post:gt(30)").parent().remove();
			
			$("#right_column").children().not("#xkit-search-likes-ul").not("#xkit-search-likes-box").slideDown('slow');
			$("#xkit-search-likes-box").slideUp('slow');
			
		}
		
	},

	destroy: function() {
		this.running = false;
	}

});