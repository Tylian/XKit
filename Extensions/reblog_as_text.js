//* TITLE Reblog As Text **//
//* VERSION 1.0 REV B **//
//* DESCRIPTION Text posts remain text **//
//* DETAILS This post allows you to always reblog text posts as text posts, and not as links. **//
//* DEVELOPER STUDIOXENIX **//
//* FRAME false **//
//* BETA false **//

XKit.extensions.reblog_as_text = new Object({

	running: false,

	run: function() {
		this.running = true;
		
		if (document.location.href.indexOf("http://www.tumblr.com/reblog/") !== -1) {
			setTimeout(function() { XKit.extensions.reblog_as_text.fix_page(); }, 10);
		}
	
		if ($(".post").length > 0) {
			$(document).on("click", ".reblog_button, .post_control.reblog", XKit.extensions.reblog_as_text.fix_page);
		}
		
	},
	
	fix_page: function() {
		
		if ($("#tumblelog_choices").length === 0 ||$(".mceEditor").length === 0) {
			XKit.console.add("Reblog window Not active yet, delaying..");
			setTimeout(function() { XKit.extensions.reblog_as_text.fix_page(); }, 100);
			return;
		}
		
		if ($("#reblog_as").length === 0) {
			// Already probably reblogging as a text.
			XKit.console.add("\"Reblog As\" div not found, quitting.");
			return;
		}	
		
		XKit.console.add("Switching to reblog as text mode.");
		var do_this = false;
		if ($("#reblog_select").find(".option:first-child").attr('data-option-value') === "text") {
			do_this = true;	
		}
		
		if ( do_this === true ) {
			
			function m_function() {
				xkit_do_switch_to_text();
				
				function xkit_do_switch_to_text() {
					if (jQuery(".mceLayout").length <= 0) {
						setTimeout(function() { xkit_do_switch_to_text() },100);
						return;
					}
               	 			var l = jQuery(".post_form_wrapper_inner");
               	     			var k = l.height();
               	     			l.empty().append(jQuery('<div class="dummy"/>').height(k));
               	     			if (this.destroy_preview) {
               	         			this.destroy_preview()
               	     			}
					Tumblr.PostForms.change_reblog_type("text",jQuery('body').attr('data-page-root'),l,k,"");
				}
			}
					
			try { var script = document.createElement("script");
			script.textContent = script.textContent + (true ? "(" : "") + m_function.toString() + (true ? ")();" : "");
			document.body.appendChild(script); } catch(e) { alert(e.message); }
			
			// If reblog yourself is installed, call it.
			if (typeof XKit.extensions.reblog_yourself !== "undefined") {
				if (XKit.extensions.reblog_yourself.running === true) {
					setTimeout(function() {
						XKit.extensions.reblog_yourself.fix_page();
					}, 500);
				}	
			}
		
		}
			
		
		
	},

	destroy: function() {
		$(document).off("click", ".reblog_button, .post_control.reblog", XKit.extensions.reblog_as_text.fix_page);
		this.running = false;
	}

});