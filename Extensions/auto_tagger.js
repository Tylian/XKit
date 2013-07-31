//* TITLE Auto Tagger **//
//* VERSION 0.1 REV B **//
//* DESCRIPTION Tags posts automatically. **//
//* DEVELOPER STUDIOXENIX **//
//* DETAILS This extension allows you to automatically add tags to posts based on state (reblogged, original, queued) or post type (audio, video, etc) and keeping original tags while reblogging a post. **//
//* FRAME false **//
//* BETA false **//

XKit.extensions.auto_tagger = new Object({

	running: false,
	
	preferences: {
		
		"sep0": {
			text: "Keeping Tags",
			type: "separator",	
		},
		
		"keep_tags": {
			text: "Keep original tags when I'm reblogging a post",
			default: false,
			value: false
		},
		
		"sep1": {
			text: "Tags by Type",
			type: "separator",	
		},
		
		"tag_for_text": {
			text: "Tags for Text Posts",
			type: "text",	
			default: "",
			value: ""
		},
		
		"tag_for_photo": {
			text: "Tags for Photo/Photoset Posts",
			type: "text",	
			default: "",
			value: ""
		},
		
		"tag_for_quote": {
			text: "Tags for Quote Posts",
			type: "text",	
			default: "",
			value: ""
		},
		
		"tag_for_link": {
			text: "Tags for Link Posts",
			type: "text",	
			default: "",
			value: ""
		},

		"tag_for_chat": {
			text: "Tags for Chat Posts",
			type: "text",	
			default: "",
			value: ""
		},
		
		"tag_for_audio": {
			text: "Tags for Audio Posts",
			type: "text",	
			default: "",
			value: ""
		},
		
		"tag_for_video": {
			text: "Tags for Video Posts",
			type: "text",	
			default: "",
			value: ""
		},
		
		"sep2": {
			text: "Tags by State",
			type: "separator",	
		},
		
		"tag_for_original": {
			text: "Tags for posts I create",
			type: "text",	
			default: "",
			value: ""
		},
		
		"tag_for_reblogged": {
			text: "Tags for posts I reblog",
			type: "text",	
			default: "",
			value: ""
		},
		
		"tag_for_queued": {
			text: "Tags for Queued Posts",
			type: "text",	
			default: "",
			value: ""
		}
		
	},
	
	new_post_check_interval: 0,

	run: function() {
		this.running = true;
		new_post_check_interval = setInterval(function() { XKit.extensions.auto_tagger.new_post_check(); }, 1000);	
	},
	
	new_post_check: function() {
		
		if (document.location.href.indexOf("http://www.tumblr.com/new/") === -1) { return; }
		XKit.console.add("Auto Tagger -> new_post_check -> user in new post page!");	
		
		if($("#post_form").length <= 0) {
			XKit.console.add("Auto Tagger -> new_post_check -> delaying, not on page...");	
			return;		
		}
		
		if ($("#post_form").hasClass("xkit-auto-tagger-done") === true) {
			XKit.console.add("Auto Tagger -> new_post_check -> quitting, already done.");
			return;
		}
		
		XKit.console.add("Auto Tagger -> new_post_check -> page is shown.");	
		
		$("#post_form").addClass("xkit-auto-tagger-done");
		
		$("#post_form").addClass("xkit-auto-tagger-done-" + XKit.tools.random_string());
		
		var post_type = $("#post_form").attr('data-post-type');
		
		// Create fake post object:
		var m_post = new Object();
		m_post.type = post_type;
		
		var m_tags = "";
		
		if (XKit.extensions.auto_tagger.preferences.tag_for_original.value !== "") {
			m_tags = this.mreturn_add(m_tags, XKit.extensions.auto_tagger.preferences.tag_for_original.value);
		}
		
		if (XKit.extensions.auto_tagger.return_tag_based_on_type(m_post) !== "") {
			m_tags = this.mreturn_add(m_tags, XKit.extensions.auto_tagger.return_tag_based_on_type(m_post));
		}
		
		this.inject_to_window(m_tags);
		
		
	},
	
	return_tags_for_queue: function() {
	
		if (XKit.extensions.auto_tagger.preferences.tag_for_queued.value !== "") {
			return XKit.extensions.auto_tagger.preferences.tag_for_queued.value;
		} else {
			return "";	
		}	
		
	},
	
	return_tags: function(obj, original) {
		
		var to_return = "";
	
		if (typeof XKit.interface === "undefined") { return ""; }

		// Get the object from XKit interface.
		var m_post_object = XKit.interface.post(obj);
		
		if (XKit.extensions.auto_tagger.preferences.tag_for_reblogged.value !== "" && original !== true) {
			to_return = this.mreturn_add(to_return, XKit.extensions.auto_tagger.preferences.tag_for_reblogged.value);
		}
		
		if (XKit.extensions.auto_tagger.preferences.tag_for_original.value !== "" && original === true) {
			to_return = this.mreturn_add(to_return, XKit.extensions.auto_tagger.preferences.tag_for_original.value);
		}
		
		if (XKit.extensions.auto_tagger.return_tag_based_on_type(m_post_object) !== "") {
			to_return = this.mreturn_add(to_return, XKit.extensions.auto_tagger.return_tag_based_on_type(m_post_object));
		}
		
		if (XKit.extensions.auto_tagger.preferences.keep_tags.value === true && m_post_object.tags !== "") {	
			to_return = this.mreturn_add(to_return,  m_post_object.tags);
		}
		
		return to_return;
		
	},
	
	return_tag_based_on_type: function(obj) {
		
		if (obj.type === "regular" && XKit.extensions.auto_tagger.preferences.tag_for_text.value !== "") {
			return XKit.extensions.auto_tagger.preferences.tag_for_text.value;
		}	
		
		if (obj.type === "photo" && XKit.extensions.auto_tagger.preferences.tag_for_photo.value !== "") {
			return XKit.extensions.auto_tagger.preferences.tag_for_photo.value;
		}
		
		if (obj.type === "photoset" && XKit.extensions.auto_tagger.preferences.tag_for_photo.value !== "") {
			return XKit.extensions.auto_tagger.preferences.tag_for_photo.value;
		}
		
		if (obj.type === "quote" && XKit.extensions.auto_tagger.preferences.tag_for_quote.value !== "") {
			return XKit.extensions.auto_tagger.preferences.tag_for_quote.value;
		}
		
		if (obj.type === "link" && XKit.extensions.auto_tagger.preferences.tag_for_link.value !== "") {
			return XKit.extensions.auto_tagger.preferences.tag_for_link.value;
		}
		
		if (obj.type === "conversation" && XKit.extensions.auto_tagger.preferences.tag_for_chat.value !== "") {
			return XKit.extensions.auto_tagger.preferences.tag_for_chat.value;
		}
		
		if (obj.type === "audio" && XKit.extensions.auto_tagger.preferences.tag_for_audio.value !== "") {
			return XKit.extensions.auto_tagger.preferences.tag_for_audio.value;
		}
		
		if (obj.type === "video" && XKit.extensions.auto_tagger.preferences.tag_for_video.value !== "") {
			return XKit.extensions.auto_tagger.preferences.tag_for_video.value;
		}
		
		return "";
		
	},
	
	mreturn_add: function(m_return, tag) {
		if (m_return === "") {
			return tag;	
		} else {
			return m_return + "," + tag;	
		}
	},
	
	inject_to_window: function(to_add) {
		
		if($("#post_content").length <= 0) {
			setTimeout(function() {		
				XKit.extensions.auto_tagger.inject_to_window(to_add);
			}, 200);
			return;
		}

		var add_tag = "";
		var xas;
		var xae;
		var last_point = 0;
		var do_tags = true;
		var tag_to_be_added = "";
		var tags = to_add.split(",");
		for (i=0;i<tags.length;i++) {
			tag_to_be_added = tags[i];
			var old_tags = $("#post_content").find(".tags").find(".post_tags").val();
			$("#post_content").find(".tags").find(".post_tags").val(old_tags + "," + tag_to_be_added);
			$("#post_content").find(".tags").find(".editor_wrapper").before('<span class="tag">' + tag_to_be_added + '</span>');
		}
		$("#post_tags_label").css('display','none');
		$("#post_tags").val(to_add);
		
	},

	destroy: function() {
		this.running = false;
	}

});