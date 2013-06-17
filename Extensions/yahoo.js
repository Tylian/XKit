//* TITLE Yoohoo! **//
//* VERSION 2.0 REV A **//
//* DESCRIPTION A taste of things to come **//
//* DEVELOPER STUDIOXENIX **//
//* FRAME false **//
//* DETAILS This is just a joke, don't look too much into it. Congrats to both companies from XKit. **//
//* BETA false **//

XKit.extensions.yahoo = new Object({

	running: false,
	

	preferences: {
		change_logo: {
			text: "Update the Tumblr logo",
			default: true,
			value: true
		},
		colours: {
			text: "Color selection",
			type: "separator"
		},		
	},
	
	current_color: XKit.storage.get("yahoo","color","#3f1c59"),

	run: function() {
		this.running = true;
		XKit.tools.init_css("yahoo");
		
		if (XKit.extensions.yahoo.preferences.change_logo.value === true) {
			XKit.tools.add_css("#logo a { background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMQAAAAtCAYAAADx7cQhAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMC1jMDYwIDYxLjEzNDc3NywgMjAxMC8wMi8xMi0xNzozMjowMCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNSBNYWNpbnRvc2giIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6N0VFRjVEMkFCQjk0MTFFMjlCOTNGRkUzMUI2Njc5QjciIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6N0VFRjVEMkJCQjk0MTFFMjlCOTNGRkUzMUI2Njc5QjciPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDo3RUVGNUQyOEJCOTQxMUUyOUI5M0ZGRTMxQjY2NzlCNyIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDo3RUVGNUQyOUJCOTQxMUUyOUI5M0ZGRTMxQjY2NzlCNyIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/Ppg9eYUAABjeSURBVHja7F0HWFRX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');}","yahoo_logo");
		}
		
		XKit.extensions.yahoo.current_color = XKit.storage.get("yahoo","color","#3f1c59");
		var m_color = XKit.extensions.yahoo.current_color;
		
		var m_css = "body, #content {      background: rgb(245,245,245);   } #content {      margin-top: 85px;   }  #posts .post_avatar,   #posts .post {      border-radius: 0 !important;      box-shadow: 0px 0px 1px 1px rgb(190,190,190);      box-sizing:border-box;   } #right_column:after,   .right_column {      background: transparent !important;   } #header {      background: " + m_color + ";      border-radius: 0px 0px 12px 12px;   } .small_links a {      color: " + m_color + " !important;   } .notification,   .controls_section {      background: " + m_color + ";   } #header_container {      background: " + m_color + ";      position: absolute;      top: 0; left: 0;      width: 100%;   } .selection_nipple {      display: none !important;   }";
		XKit.tools.add_css(m_css, "yahoo_main");
	},
	
	cpanel: function(m_div) {
		
		if ($("#xkit-yahoo-colors").length > 0) {
			// Panel already exists, probably in refresh mode.
			// Remove it first.
			$("#xkit-yahoo-colors").remove();	
		}	
		
		var m_html = 	"<div class=\"xyahoo-color\" data-color=\"#3f1c59\" style=\"background: #3f1c59;\">&nbsp;</div>" + 
				"<div class=\"xyahoo-color\" data-color=\"#1d91aa\" style=\"background: #1d91aa;\">&nbsp;</div>" + 
				"<div class=\"xyahoo-color\" data-color=\"#aa341d\" style=\"background: #aa341d;\">&nbsp;</div>" + 
				"<div class=\"xyahoo-color\" data-color=\"#aa1d77\" style=\"background: #aa1d77;\">&nbsp;</div>" + 
				"<div class=\"xyahoo-color\" data-color=\"#2a1daa\" style=\"background: #2a1daa;\">&nbsp;</div>" + 
				"<div class=\"xyahoo-color\" data-color=\"#1daa70\" style=\"background: #1daa70;\">&nbsp;</div>" + 
				"<div class=\"xyahoo-color\" data-color=\"#8aaa1d\" style=\"background: #8aaa1d;\">&nbsp;</div>" + 
				"<div class=\"xyahoo-color\" data-color=\"#375672\" style=\"background: #375672;\">&nbsp;</div>" + 
				"<div class=\"xyahoo-color\" data-color=\"#898989\" style=\"background: #898989;\">&nbsp;</div>" + 
				"<div class=\"xyahoo-color\" data-color=\"#515151\" style=\"background: #515151;\">&nbsp;</div>" + 
				"<div class=\"xyahoo-color\" data-color=\"#000000\" style=\"background: #000000;\">&nbsp;</div>" + 
				"<div class=\"xyahoo-color\" data-color=\"#1d91aa\" style=\"background: #1d91aa;\">&nbsp;</div>";
		
		$(m_div).append("<div id=\"xkit-yahoo-colors\">" + m_html + "</div>");
		
		$(".xyahoo-color").each(function() {
		
			if ($(this).attr("data-color") === XKit.extensions.yahoo.current_color) {
				$(this).addClass("selected");	
			}	
			
		});
		
		$(".xyahoo-color").click(function() {
		
			XKit.storage.set("yahoo","color",$(this).attr('data-color'));
			$(".xyahoo-color").not(this).removeClass("selected");
			$(this).addClass("selected");	
			XKit.extensions.xkit_preferences.restart_extension("yahoo");
			
		});
		
		// 
		
	},

	destroy: function() {
		this.running = false;
		XKit.tools.remove_css("yahoo_main");
		XKit.tools.remove_css("yahoo_logo");
		XKit.tools.remove_css("yahoo");
	}

});