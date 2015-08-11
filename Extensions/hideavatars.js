//* TITLE Hide Avatars **//
//* VERSION 0.5.3 **//
//* DESCRIPTION Hides avatars on a per-url basis **//
//* DEVELOPER dlmarquis **//
//* FRAME false **//
//* BETA true **//

XKit.extensions.hideavatars = new Object({

	running: false,
	
	blognames: [],
	
	run: function() {

		this.running = true;

		XKit.tools.init_css("hideavatars");

		XKit.extensions.hideavatars.load_blogs();
		
	},
	
	load_blogs: function() {

		m_storage = XKit.storage.get("hideavatars", "blognames","");

		if (m_storage !== "") {
			try {
				XKit.extensions.hideavatars.blognames = JSON.parse(m_storage);
			} catch(e) {
				XKit.extensions.hideavatars.blognames = [];
			}
		} else {
			XKit.extensions.hideavatars.blognames = [];
		}
		
	},
	
	save_blogs: function() {

		try {
			console.log("Trying to save " + XKit.extensions.hideavatars.blognames.length + " blogs..");
			console.log(JSON.stringify(XKit.extensions.hideavatars.blognames));
			XKit.storage.set("hideavatars", "blognames", JSON.stringify(XKit.extensions.hideavatars.blognames));
		} catch(e) {
			XKit.window.show("Unable to save data","Hide Avatars could not save data<br/><br/>Error:<br/>" + e.message, "error", "<div class=\"xkit-button default\" id=\"xkit-close-message\">OK</div>");
			alert("Can't save data:\n" + e.message);
		}
		
	},
	
	cpanel: function(m_div) {

		XKit.extensions.hideavatars.load_blogs();

		if ($("#xkit-hideavatars-custom-panel").length > 0) {
			// Panel already exists, probably in refresh mode.
			// Remove it first.
			$("#xkit-hideavatars-custom-panel").remove();
		}

		var cat_list = "";

		if (XKit.extensions.hideavatars.blognames.length === 0) {
			cat_list = "<div class=\"xkit-hideavatars-no-blognames\">You have no blogs set.</div>";
		} else {

			for (var i=0;i<XKit.extensions.hideavatars.blognames.length;i++) {

				cat_list = cat_list + "<div class=\"xkit-hideavatars-cp-item\" data-id=\"" + XKit.extensions.hideavatars.blognames[i].id + "\">" + XKit.extensions.hideavatars.blognames[i].title + "</div>";

			}
		}

		var m_html = "<div id=\"xkit-hideavatars-custom-panel\">" +
					"<div id=\"xkit-hideavatars-custom-panel-toolbar\">" +
						"<div id=\"xkit-hideavatars-add-blogname\" class=\"xkit-button\">Add new blog</div>" +
					"</div>" +
					cat_list +
				"</div>";

		$(m_div).html(m_html);

		$("#xkit-extensions-panel-right").nanoScroller();
		$("#xkit-extensions-panel-right").nanoScroller({ scroll: 'top' });

		$("#xkit-hideavatars-add-blogname").click(function() {

			XKit.window.show("New blog","<b>Blog Name:</b><input type=\"text\" maxlength=\"40\" placeholder=\"\" class=\"xkit-textbox\" id=\"xkit-hideavatars-blogname-add-title\">","question","<div class=\"xkit-button default\" id=\"xkit-hideavatars-create-blogname\">Add Blog</div><div class=\"xkit-button\" id=\"xkit-close-message\">Cancel</div>");

			$("#xkit-hideavatars-create-blogname").click(function() {

				var m_title = $("#xkit-hideavatars-blogname-add-title").val();

				if ($.trim(m_title) === "") { XKit.window.close(); return; }

				if (XKit.extensions.hideavatars.blogname_exists(m_title)) {
					alert("You've already added this blog!");
					return;
				}

				var m_obj = {};
				m_obj.id = XKit.tools.random_string() + new Date().getTime();
				m_obj.title = m_title;

				XKit.extensions.hideavatars.load_blogs();

				XKit.extensions.hideavatars.blognames.push(m_obj);

				XKit.extensions.hideavatars.save_blogs();
				XKit.extensions.hideavatars.cpanel(m_div);
				XKit.window.close();

			});

		});

		$(".xkit-hideavatars-cp-item").click(function() {

			var m_cat_obj = XKit.extensions.hideavatars.get_blogname($(this).attr('data-id'));

			if (m_cat_obj === false) { alert("Unknown error HAV-124"); return; }

			XKit.window.show("Edit blog name","<b>Blog Name:</b><input type=\"text\" maxlength=\"40\" placeholder=\"\" class=\"xkit-textbox\" id=\"xkit-hideavatars-blogname-add-title\" value=\"" + m_cat_obj.title + "\"><br/>If you delete this blog, its avatar will show again \"Uncategorized.\"","question","<div class=\"xkit-button default\" id=\"xkit-hideavatars-save-blogname\">Save blogname</div><div class=\"xkit-button\" id=\"xkit-hideavatars-delete-blogname\">Delete</div><div class=\"xkit-button\" id=\"xkit-close-message\">Cancel</div>");

			$("#xkit-hideavatars-save-blogname").click(function() {

				XKit.extensions.hideavatars.load_blogs();

				for (var i=0;i<XKit.extensions.hideavatars.blognames.length;i++) {

					if (m_cat_obj.id === XKit.extensions.hideavatars.blognames[i].id) {

						XKit.extensions.hideavatars.blognames[i].title = $("#xkit-hideavatars-blogname-add-title").val();
						XKit.extensions.hideavatars.save_blogs();

						XKit.window.close();

						XKit.extensions.hideavatars.cpanel(m_div);

					}

				}

			});

			$("#xkit-hideavatars-delete-blogname").click(function() {

				XKit.window.show("You sure?","Delete blog <b>\"" + m_cat_obj.title + "\"</b>?","warning","<div class=\"xkit-button default\" id=\"xkit-hideavatars-delete-blogname-confirm\">Confirm</div><div class=\"xkit-button\" id=\"xkit-close-message\">Cancel</div>");

				$("#xkit-hideavatars-delete-blogname-confirm").click(function() {

					XKit.extensions.hideavatars.load_blogs();

					for (var j=0;j<XKit.extensions.hideavatars.blognames.length;j++) {

						if (m_cat_obj.id === XKit.extensions.hideavatars.blognames[j].id) {

							XKit.extensions.hideavatars.blognames.splice(j, 1);

						}

					}

					XKit.extensions.hideavatars.save_blogs();
					XKit.extensions.hideavatars.cpanel(m_div);
					XKit.window.close();

				});

			});

		});

	},
