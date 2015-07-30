//* TITLE Editable Reblogs **//
//* VERSION 1.0.0 **//
//* DESCRIPTION	Restores ability to edit previous reblogs of a post **//
//* DEVELOPER dlmarquis **//
//* FRAME false **//
//* BETA false **//

XKit.extensions.editable_reblogs = new Object({

	running: false,

	run: function() {
		this.running = true;
		
		XKit.interface.post_window_listener.add("editable_reblogs", XKit.extensions.editable_reblogs.post_window);
		
	},
	
	post_window: function() {
	    
	    //alert("Entered post_window function!");
	    
	    var reblog_content = $(".reblog-tree").html();
	    
	    //alert(reblog_content);
	    
	    XKit.interface.post_window.set_content_html(reblog_content);
	    
	    //$(".reblog-tree).html("");
	    //window.setTimeout(function() {
	        $(".btn-remove-tree").click();
	    //}, 1000);
	    
	    XKit.tools.add_css(".control-reblog-tree {display: none; }", "editable_reblogs_remove_content_tree");
	    
	},

	destroy: function() {
		this.running = false;
		XKit.tools.remove_css("editable_reblogs_remove_content_tree");
	}

});
