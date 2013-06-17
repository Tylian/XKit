//* TITLE Filter By Type **//
//* VERSION 2.0 REV A **//
//* DESCRIPTION Lets you filter the posts on your dashboard by type **//
//* DEVELOPER STUDIOXENIX **//
//* FRAME false **//
//* BETA false **//
//* SLOW true **//

XKit.extensions.filter_by_type = new Object({

	running: false,
	slow: true,

	ftr_str: ["All posts types",
		  "Only photo posts",
		  "Only text posts",
		  "Only quote posts",
		  "Only audio posts",
		  "Only video posts",
		  "Only link posts",
	  	  "Only chat posts"],

	ftr_lnk: ["/dashboard/",
		  "/show/photos/",
		  "/show/text/",
		  "/show/quotes/",
		  "/show/audio/",
		  "/show/videos/",
		  "/show/links/",
	  	  "/show/chats/"],

	ftr_typ: ["post",
		  "photo",
		  "regular",
		  "quote",
		  "link",
		  "chat",
		  "audio"], 

	current_filter: "0",
	scroller_working: false,
	current_page: 1,

	run: function() {

		this.running = true;
		if (XKit.extensions.filter_by_type.run_here() === false) { return; }
		XKit.tools.init_css("filter_by_type");

		var m_types = "";
		for (i=0;i<XKit.extensions.filter_by_type.ftr_str.length;i++) {
			m_types = m_types + "<div id=\"xfilter-type-" + i + "\" data-filter-id=\"" + i +  "\" class=\"xfilter-type\">" + XKit.extensions.filter_by_type.ftr_str[i] + "</div>";
		}


		xf_html = '<ul class="controls_section" id="xfilter_group">' +
			'<li class="no_push">' +
				'<a href="#" onclick="return false" class="queue" id="xfilter_button">' +
					'<div id="xfilter_status">' + XKit.extensions.filter_by_type.ftr_str[0] + '</div>' +
				'</a>' +
			'</li>' +
			'<li class="no_push" id="xfilter_types">' +
				m_types +
			'</li>' +
			'</ul>';

		$("ul.controls_section:eq(1)").before(xf_html);

		$("#xfilter_button").click(function() {

			$("#xfilter_types").slideToggle('fast');

		});

		$(".xfilter-type").click(function() {
			
			var old_filter = XKit.extensions.filter_by_type.current_filter;
			XKit.extensions.filter_by_type.current_filter = $(this).attr('data-filter-id');
			$(".xfilter-type").not(this).removeClass("selected");
			$(this).addClass("selected");
			$("#xfilter_status").html(XKit.extensions.filter_by_type.ftr_str[XKit.extensions.filter_by_type.current_filter]);
			if (old_filter === XKit.extensions.filter_by_type.current_filter) { return; }
			XKit.extensions.filter_by_type.filter();
			$("#xfilter_button").trigger('click');

		});

		$("#xfilter-type-0").trigger('click');

	},

	filter: function() {

		var m_type = XKit.extensions.filter_by_type.current_filter;
		var new_post_html = jQuery("#new_post").parent()[0].outerHTML;
		$("ol#posts").html(new_post_html + "<li id=\"xfilter-loading\" class=\"post_container\"><div class=\"post post_full\">Loading posts, please wait..</div></li>");

		XKit.extensions.filter_by_type.scroller_working = false;
		XKit.extensions.filter_by_type.current_page = 1;
		
		function xfilter_trigger_load() {
			
			if (typeof Tumblr === "undefined") {
				window.top.Tumblr.Events.trigger("posts:load");
				window.top.Tumblr.AudioPlayer.update_all();
			} else {
				Tumblr.Events.trigger("posts:load");
				Tumblr.AudioPlayer.update_all();
			}

		}
			
		function xfilter_stop_paginator () {
			Tumblr.AutoPaginator.stop();
		}

		if (XKit.extensions.filter_by_type.current_filter !== "0") {

			GM_xmlhttpRequest({
				method: "GET",
				url: "http://www.tumblr.com" + XKit.extensions.filter_by_type.ftr_lnk[XKit.extensions.filter_by_type.current_filter],
				onerror: function(response) {
					$("#xfilter-loading").slideUp('fast', function(){ $(this).remove(); });
					XKit.window.show("Can't fetch page","Filter By Type could not fetch the page requested. There might be a problem with Tumblr servers, please try again later.","error","<div class=\"xkit-button default\" id=\"xkit-close-message\">OK</div>");
				},
				onload: function(response) {
					$("#xfilter-loading").slideUp('fast', function(){ $(this).remove(); });
					if (XKit.extensions.filter_by_type.current_filter !== m_type) { return; }
					var new_posts = $("ol#posts", response.responseText).html();
					try {
						$("ol#posts").html(new_post_html + new_posts);
					} catch(e) {
						console.log(" -- Error while loading via Filter, " + e.message);	
					}
					$("html, body").animate({ scrollTop: 0 }, "slow");
					$("#auto_pagination_loader_failure").css("display","none");
					$("#auto_pagination_loader_loading").css("display","block");
				
					XKit.tools.add_function(xfilter_trigger_load, true,"");
					XKit.extensions.filter_by_type.check_embeds();
				}
			});

			$(window).scroll(function() {
   				if($(window).scrollTop() + $(window).height() == $(document).height()) {

					if (XKit.extensions.filter_by_type.scroller_working === true) { return; }
       					XKit.extensions.filter_by_type.scroller_working = true;
					XKit.extensions.filter_by_type.current_page++;

					GM_xmlhttpRequest({
						method: "GET",
						url: "http://www.tumblr.com" + XKit.extensions.filter_by_type.ftr_lnk[XKit.extensions.filter_by_type.current_filter] + XKit.extensions.filter_by_type.current_page,
						onerror: function(response) {
							XKit.extensions.filter_by_type.scroller_working = false;
							$("#auto_pagination_loader_failure").css("display","block");
							$("#auto_pagination_loader_loading").css("display","none");
						
						},
						onload: function(response) {
							XKit.extensions.filter_by_type.scroller_working = false;
							var new_posts = $("ol#posts", response.responseText).html();
							$("ol#posts").append(new_posts);
							$("#auto_pagination_loader_failure").css("display","none");
							$("#auto_pagination_loader_loading").css("display","block");
							
							XKit.tools.add_function(xfilter_trigger_load, true,"");
							XKit.extensions.filter_by_type.check_embeds();
							
						}
					});
					
   				}
			});

			XKit.tools.add_function(xfilter_stop_paginator, true,"");

			

		} else {

			GM_xmlhttpRequest({
				method: "GET",
				url: "http://www.tumblr.com" + XKit.extensions.filter_by_type.ftr_lnk[0],
				onerror: function(response) {
					$("#xfilter-loading").slideUp('fast', function(){ $(this).remove(); });
					XKit.window.show("Can't fetch page","Filter By Type could not fetch the page requested. There might be a problem with Tumblr servers, please try again later.","error","<div class=\"xkit-button default\" id=\"xkit-close-message\">OK</div>");
				},
				onload: function(response) {
					$("#xfilter-loading").slideUp('fast', function(){ $(this).remove(); });
					if (XKit.extensions.filter_by_type.current_filter !== m_type) { return; }
					var new_posts = $("ol#posts", response.responseText).html();
					$("html, body").animate({ scrollTop: 0 }, "slow");
				}
			});

		}

	},
	
	check_embeds: function() {
					
		if ($("body").find(".inline_embed").length > 0) {
			$("body").find(".inline_embed").each(function() {
						
				try { 
					var script = document.createElement("script");
					script.textContent = $(this).html();
					document.body.appendChild(script); 
				} catch(e) { 
					alert(e.message); 
				}
							
			});	
		}	
		
	},

	run_here: function() {

		if (document.location.href.indexOf("http://www.tumblr.com/dashboard") !== -1) {
			return true;
		}

		if (document.location.href.indexOf("http://www.tumblr.com/show/") !== -1) {
			return true;
		}

		return false;

	},

	destroy: function() {
		this.running = false;
		$("#xfilter_group").remove();
		XKit.tools.remove_css("filter_by_type");
	}

});