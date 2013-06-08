//* TITLE XKit Preferences **//
//* VERSION 1.1 REV D **//
//* DESCRIPTION Lets you customize XKit **//
//* DEVELOPER STUDIOXENIX **//
XKit.extensions.xkit_preferences = new Object({

	running: false,
	current_panel: "",

	default_extension_icon: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAIAAAD8GO2jAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMC1jMDYwIDYxLjEzNDc3NywgMjAxMC8wMi8xMi0xNzozMjowMCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNSBNYWNpbnRvc2giIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6NjNEQ0QyNTFBODhDMTFFMkFDMDJFMzk3N0RDMDc2NDQiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6NjNEQ0QyNTJBODhDMTFFMkFDMDJFMzk3N0RDMDc2NDQiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDo2M0RDRDI0RkE4OEMxMUUyQUMwMkUzOTc3REMwNzY0NCIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDo2M0RDRDI1MEE4OEMxMUUyQUMwMkUzOTc3REMwNzY0NCIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/Pp0ikDoAAAgNSURBVHjanFZZiCVX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",
	kernel_extension_icon: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAIAAAD8GO2jAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMC1jMDYwIDYxLjEzNDc3NywgMjAxMC8wMi8xMi0xNzozMjowMCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNSBNYWNpbnRvc2giIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6NjNEQ0QyNTVBODhDMTFFMkFDMDJFMzk3N0RDMDc2NDQiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6NjNEQ0QyNTZBODhDMTFFMkFDMDJFMzk3N0RDMDc2NDQiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDo2M0RDRDI1M0E4OEMxMUUyQUMwMkUzOTc3REMwNzY0NCIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDo2M0RDRDI1NEE4OEMxMUUyQUMwMkUzOTc3REMwNzY0NCIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/Pqxa0agAAAfqSURBVHjaTFZrbBTX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",

	run: function() {
		
		this.running = true;

		// Only load if header is somewhere to be found.
		if ($("#header").length == 0) { return; }

		XKit.tools.init_css("xkit_preferences");
		
		var m_html = "<div class=\"tab iconic\" id=\"xkit-control\">" +
			"<a href=\"#\" onclick=\"return false\">XKit Control Panel</a>" +
			"</div>";
			
		$("#header").find("#logout_button").before(m_html);
	
		if(XKit.storage.get("xkit_preferences", "shown_welcome_bubble") !== "true") {
			XKit.extensions.xkit_preferences.show_welcome_bubble();
		}
	
		$("#xkit-control").click(function() {
			XKit.extensions.xkit_preferences.open();
		});

		// Check and deliver initial messages.
		if (XKit.storage.get("xkit_preferences","initial_mail_sent","0") === "0") {
			var randomnumber = 1000 + Math.floor(Math.random()*100000);
			XKit.extensions.xkit_preferences.news.create(91111, "Welcome to XKit!", "<h1>Welcome, and thanks for installing XKit 7!</h1>In this panel, you will receive news and updates on XKit 7. These include, but not limited to, new features, bug fixes and things you should do if you experience problems with your XKit.<h2>Learn XKit</h2>Clicking on the My XKit tab will give you a list of all the extensions you have installed. You can read their descriptions, and click on <b>more information</b> link below their description (if available) to learn even more about them and how to use them.<h2>Customize XKit</h2>Nearly all extensions of XKit has settings that you can customize: from appearance to custom tags, you can toggle and change their settings from the My XKit tab.<h2>Expand XKit</h2>XKit automatically installs some default extensions, but if you want more, you can check the extension gallery for more. To do that, just click on the <b>Get Extensions</b> tab on the bottom of this window.<h2>Help XKit</h2>XKit is free of charge, and I'm not making any money off it in any way. If you are using XKit for the first time, give it a try for a few days, and if you like it, please donate by going to the About tab on this window to support free software. You can also share XKit with your followers and friends, spread the word and help me.<h2>Thanks for reading!</h2>Again, thanks for installing XKit, and I hope you enjoy using it!<br/><br/><i>Yours faithfully,<br/>Xenixlet #" + randomnumber + "<br/>Your Personal Xenixlet, XKit Assistant.</i>");
			XKit.storage.set("xkit_preferences","initial_mail_sent","1");
		}

		var unread_mail_count = XKit.extensions.xkit_preferences.news.unread_count();
		if (unread_mail_count > 0) {
			// English is a weird language, innit?
			var m_word = "messages";
			var m_word_2 = "them";
			if (unread_mail_count === 1) {
				m_word = "message";
				m_word_2 = "it";
			}
			XKit.notifications.add("<b>Unread messages</b><br/>You have <b>" + unread_mail_count + "</b> new XKit News " + m_word + " in your XKit News inbox. Click here to view " + m_word_2 + ".","mail",true, function() {
				XKit.extensions.xkit_preferences.open(true);
			});
		}
		XKit.extensions.xkit_preferences.news.update();

	},

	news: {

		update: function() {

			var lst_check = XKit.storage.get("xkit_preferences","last_news_check","0");
			if (lst_check === "") { lst_check = 0; }

			var check_for_updates = false;
			lst_check = parseInt(lst_check);

			var n_time = new Date();
			var n_ms = parseInt(n_time.getTime());

			if (parseInt(lst_check) == 0 || isNaN(parseInt(lst_check)) === true) {
				check_for_update = true;
			} else {
				lst_check = parseInt(lst_check);
				if (n_ms - lst_check > 9000000 || n_ms - lst_check < -2000000 || lst_check < 0) { // 648000
			       		check_for_update = true;
			   	} else {
			       		check_for_update = false;
			   	}
			}
	
			if (parseInt(lst_check) < 0) {
				check_for_update = true;
			}
			
			check_for_update = true;

			// SO!? What shall we do, flips?
			if (check_for_update === true) {
				// yep, we need to check for updates.
				XKit.console.add("Checking for XKit News");
				// set it so we don't have to ram the server.
				var to_save = n_ms.toString();
				XKit.storage.set("xkit_preferences","last_news_check",to_save);
			} else {
				XKit.console.add("Skipping News update check");
				return;
			}

			XKit.download.page("paperboy.php", function(mdata) {

				if (mdata.server_down === true) {
				
					XKit.window.show("Can't connect to server","XKit was unable to contact the servers in order to download XKit News. You might be using an outdated or buggy version of XKit. Please visit <a href=\"http://xkit-extension.tumblr.com\">the Official XKit Blog</a> for updates and details.","error","<div id=\"xkit-close-message\" class=\"xkit-button default\">OK</div>");
					return;
				}

				for(var news_item in mdata.news) {
					// (id, title, message, date)
					mdata.news[news_item].message = XKit.tools.replace_all(mdata.news[news_item].message, "\\\\'", "'");
					mdata.news[news_item].message = XKit.tools.replace_all(mdata.news[news_item].message, "\\\\\"", "\"");
					XKit.extensions.xkit_preferences.news.create(mdata.news[news_item].id, mdata.news[news_item].title, mdata.news[news_item].message);
				}

			});
			

		},

		unread_count: function() {

			var prev_objects_str = XKit.storage.get("xkit_preferences","news","");
			var prev_objects;
			try {
				prev_objects = JSON.parse(prev_objects_str);
			} catch(e) {
				XKit.console.add("Unread_Count failed, unknown/corrupt JSON");
				return 0;
			}

			var m_return = 0;
			for (i=0;i<prev_objects.length;i++) {
				if (prev_objects[i].read === false) {
					m_return++;
				}
			}

			return m_return;

		},

		check: function(id) {

			var prev_objects_str = XKit.storage.get("xkit_preferences","news","");
			var prev_objects;
			try {
				prev_objects = JSON.parse(prev_objects_str);
			} catch(e) {
				prev_objects = new Array();
			}

			for (i=0;i<prev_objects.length;i++) {
				
				if (prev_objects[i].id === id) {
					return true;
				}

			}

			return false;

		},

		create: function(id, title, message, date) {

			if (XKit.extensions.xkit_preferences.news.check(id) === true) {
				XKit.console.add("News " + id + " could not be pushed: already exists.");
				return;
			}

			if (typeof date === "undefined") {
				var foo = new Date; // Generic JS date object
				var unixtime_ms = foo.getTime(); // Returns milliseconds since the epoch
				var date = parseInt(unixtime_ms / 1000);
			}

			var news_object = new Object();
			news_object.id = id;
			news_object.title = title;
			news_object.message = message;
			news_object.date = date;
			news_object.read = false;

			var prev_objects_str = XKit.storage.get("xkit_preferences","news","");
			var prev_objects;
			try {
				prev_objects = JSON.parse(prev_objects_str);
			} catch(e) {
				prev_objects = new Array();
			}

			prev_objects.push(news_object);

			var m_result = XKit.storage.set("xkit_preferences","news",JSON.stringify(prev_objects));
			if (m_result === true) {
				XKit.console.add("News " + id + " pushed successfully.");
			} else {
				show_error_reset("Can not push news_object. Storage might be full.");
			}

		},

		list: function() {

			var prev_objects_str = XKit.storage.get("xkit_preferences","news","");
			var prev_objects;
			try {
				prev_objects = JSON.parse(prev_objects_str);
			} catch(e) {
				prev_objects = new Array();
			}

			if (prev_objects.length === 0) {
				return "";
			}

			var i = prev_objects.length;
			var m_return = "";

			while(i--) {

				var read_class = "unread";
				if (prev_objects[i].read === true) { read_class = "read"; }
				m_return = m_return + "<div data-news-id=\"" + prev_objects[i].id + "\"class=\"xkit-news-item xkit-extension " + read_class + " text-only\"><div class=\"xkit-mail-icon-" + read_class + "\">&nbsp;</div>" + prev_objects[i].title + "</div>";

			}

			return m_return;

		},

		open: function(id) {

			var prev_objects_str = XKit.storage.get("xkit_preferences","news","");
			var prev_objects;
			try {
				prev_objects = JSON.parse(prev_objects_str);
			} catch(e) {
				prev_objects = new Array();
			}

			var m_object;

			for (i=0;i<prev_objects.length;i++) {
				if (parseInt(prev_objects[i].id) === parseInt(id)) {
					m_object = prev_objects[i];
					prev_objects[i].read = true;
					break;
				}
			}

			if (typeof m_object === "undefined") {
				$("#xkit-extensions-panel-right-inner").html("Could not load message. Please try again later.");
				return;
			}

			var m_html = 	"<div class=\"xkit-message-info\">" +
						"Received on " + XKit.extensions.xkit_preferences.convert_time(m_object.date) +
					"</div>" +
					"<div class=\"xkit-message-display\">" + m_object.message + "</div>";
			$("#xkit-extensions-panel-right-inner").html(m_html);
			$("#xkit-extensions-panel-right").removeClass("xkit-no-message");
			$("#xkit-extensions-panel-right").nanoScroller();
			$("#xkit-extensions-panel-right").nanoScroller({ scroll: 'top' });

			var m_result = XKit.storage.set("xkit_preferences","news",JSON.stringify(prev_objects));
			if (m_result === true) {
				XKit.console.add("News " + id + " pushed successfully.");
			} else {
				show_error_reset("Can not save news_object with read flag. Storage might be full.");
			}

		},

		delete: function(id) {


		},

	},

	convert_time: function(UNIX_timestamp) {

 		var a = new Date(UNIX_timestamp*1000);
 		var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
     		var year = a.getFullYear();
     		var month = months[a.getMonth()];
     		var date = a.getDate();
     		var hour = a.getHours();
     		var min = a.getMinutes();
     		var sec = a.getSeconds();
		if (hour <= 9) { hour = "0" + hour; }
		if (min <= 9) { min = "0" + min; }
		if (sec <= 9) { sec = "0" + sec; }
     		var time = date+', '+month+' '+year+' '+hour+':'+min+':'+sec ;
     		return time;

	},
	
	bubble_tour_mode: false,

	show_welcome_bubble: function() {

		XKit.extensions.xkit_preferences.bubble_tour_mode = true;

		$("body").css("overflow","hidden");
		$("body").append("<div id=\"xkit-welcoming-bubble-shadow\" class=\"arrow-top\">&nbsp;</div><div id=\"xkit-welcoming-bubble\"><b>Welcome to XKit! Let's get started.</b><br/>Click me to customize your XKit and get more extensions.</div>");
		var position = $("#xkit-control").offset();

		$("#xkit-welcoming-bubble").css("top", position.top + 50 + "px");
		$("#xkit-welcoming-bubble").css("left", (position.left - ($("#xkit-welcoming-bubble").width() / 2)) + 10 + "px");

		$("#xkit-control").css('z-index','3000');
	
	},

	open: function(open_news) {

		if ($("#xkit-control-panel-shadow").length > 0) {
			$("#xkit-control-panel-shadow").remove();
		}

		if ($("#xkit-control-panel").length > 0) {
			$("#xkit-control-panel").remove();
		}

		var m_html = 	"<div id=\"xkit-control-panel\">" +
					"<div id=\"xkit-control-panel-inner\"></div>" +
					"<div id=\"xkit-control-panel-tabs\">" +
						"<div id=\"xkit-cp-tab-my-extensions\" class=\"selected\">My XKit</div>" +
						"<div id=\"xkit-cp-tab-get-extensions\">Get Extensions</div>" +
						"<div id=\"xkit-cp-tab-news\">News</div>" +
						"<div id=\"xkit-cp-tab-other\">Other</div>" +
						"<div id=\"xkit-cp-tab-about\">About + Support</div>" +
					"</div>" +
				"</div>" +
				"<div id=\"xkit-control-panel-shadow\">&nbsp;</div>";

		$("body").append(m_html);
		XKit.extensions.xkit_preferences.current_panel = "";

		$("body").css("overflow","hidden");
		$("#xkit-control-panel").animate({ marginTop: '-200px', opacity: 1}, 500);
		$("#xkit-control-panel-shadow").fadeIn('slow');
		$("#xkit-control-panel-shadow").click(function() {
			XKit.extensions.xkit_preferences.close();
		});	

		if (XKit.extensions.xkit_preferences.bubble_tour_mode == true) {

			XKit.extensions.xkit_preferences.bubble_tour_mode = false;
			$("#xkit-welcoming-bubble").remove();
			$("#xkit-welcoming-bubble-shadow").remove();

			XKit.storage.set("xkit_preferences", "shown_welcome_bubble", "true");

			XKit.window.show("Welcome to the control panel!", "<b>This is the My XKit panel.</b><br/>This is where you customize your XKit.<br/>You can turn on/off extensions or change their settings here.<br/><br/>New extensions are regularly added to the XKit Extension Gallery, which you can visit by clicking on the <b>Get Extensions</b> tab on the bottom.", "info","<div class=\"xkit-button default\" id=\"xkit-tour-continue-1\">Continue &rarr;</div><div class=\"xkit-button xkit-tour-cancel\">Cancel Tour</div>");

			$(document).on('click','.xkit-tour-cancel', function() {

				XKit.window.close();
				XKit.extensions.xkit_preferences.close();
		
			});

			$("#xkit-tour-continue-1").click(function() {

				XKit.window.show("Welcome to the control panel!", "<b>This is the News panel.</b><br/>Here, important information about XKit is provided to you. New extensions, features, bug fixes, status updates and a lot more will be posted here.", "info","<div class=\"xkit-button default\" id=\"xkit-tour-continue-2\">Continue &rarr;</div><div class=\"xkit-button xkit-tour-cancel\">Cancel Tour</div>");
				$("#xkit-cp-tab-news").trigger('click');

				$("#xkit-tour-continue-2").click(function() {

					XKit.window.show("Welcome to the control panel!", "<b>This is the Other panel.</b><br/>Here, you can Reset your XKit (deleting all it's settings so it can re-install again), update all your extensions at once, or if you are feeling nerd-ish, play with some advanced settings.", "info","<div class=\"xkit-button default\" id=\"xkit-tour-continue-3\">Continue &rarr;</div><div class=\"xkit-button xkit-tour-cancel\">Cancel Tour</div>");
					$("#xkit-cp-tab-other").trigger('click');

					$("#xkit-tour-continue-3").click(function() {

						XKit.window.show("Well, that's all.", "<b>This concludes our brief tour together.</b><br/><br/>You can check out the About + Support tab on the control panel for some helpful links.<br/><br/>I hope you enjoy XKit!", "info","<div class=\"xkit-button default xkit-tour-cancel\">End Tour</div>");
						XKit.extensions.xkit_preferences.close();

					});

				});

			});

		}

		$("#xkit-control-panel-tabs div").click(function() {

			$("#xkit-control-panel-tabs div").not(this).removeClass("selected");
			$(this).addClass("selected");

			var div_id = $(this).attr('id');
			
			if (div_id === "xkit-cp-tab-my-extensions") {
				XKit.extensions.xkit_preferences.show_my_extensions();
			}

			if (div_id === "xkit-cp-tab-get-extensions") {
				XKit.extensions.xkit_preferences.show_get();
			}

			if (div_id === "xkit-cp-tab-news") {
				XKit.extensions.xkit_preferences.show_news();
			}

			if (div_id === "xkit-cp-tab-other") {
				XKit.extensions.xkit_preferences.show_other();
			}

			if (div_id === "xkit-cp-tab-about") {
				XKit.extensions.xkit_preferences.show_about();
			}
		
		});

		if (open_news !== true) {
			XKit.extensions.xkit_preferences.show_my_extensions();
		} else {
			XKit.extensions.xkit_preferences.show_news();
			$("#xkit-cp-tab-news").trigger('click');
		}

	},

	close: function() {

		$("body").css("overflow","auto");
		$("#xkit-control-panel-shadow").fadeOut(400);
		$("#xkit-control-panel").animate({ marginTop: '-50px', opacity: 0}, 600, function() {
			$("#xkit-control-panel-shadow").remove();
			$("#xkit-control-panel").remove();
		});

	},


	show_news: function() {
	
		if (XKit.extensions.xkit_preferences.current_panel === "news") { return; }
		XKit.extensions.xkit_preferences.current_panel = "news";

		var m_html = 	"<div class=\"nano long\" id=\"xkit-extensions-panel-left\">" +
					"<div class=\"content\" id=\"xkit-extensions-panel-left-inner\"></div>" +
				"</div>" +
				"<div class=\"nano xkit-no-message\" id=\"xkit-extensions-panel-right\">" +
					"<div class=\"content\" id=\"xkit-extensions-panel-right-inner\"></div>" +
				"</div>";

		$("#xkit-control-panel-inner").html(m_html);

		var m_html = XKit.extensions.xkit_preferences.news.list();
		if (m_html === "") {
			$("#xkit-extensions-panel-left-inner").html("<div class=\"xkit-not-found-error\"><b>You have no mail.</b><br/>Once something exciting happens, you'll get news about it on this panel.</div>");
			return;
		} else {
			$("#xkit-extensions-panel-left-inner").html(m_html);
		}

		$("#xkit-extensions-panel-left").nanoScroller();
		$("#xkit-extensions-panel-right").nanoScroller();

		$("#xkit-extensions-panel-left .xkit-news-item").click(function() {

			$("#xkit-extensions-panel-left .xkit-news-item").not(this).removeClass("selected");
			$(this).addClass("selected");
			$(this).find(".xkit-mail-icon-unread").addClass("xkit-mail-icon-read");
			$(this).find(".xkit-mail-icon-unread").removeClass("xkit-mail-icon-unread");
		        XKit.extensions.xkit_preferences.news.open($(this).attr('data-news-id'));

		});

	},


	show_get: function() {
	
		if (XKit.extensions.xkit_preferences.current_panel === "get") { return; }
		XKit.extensions.xkit_preferences.current_panel = "get";

		var m_html = 	"<div class=\"nano xkit-wide-panel white\" id=\"xkit-extensions-panel-right\">" +
					"<div class=\"content\" id=\"xkit-extensions-panel-right-inner\"><div id=\"xkit-gallery-loading\">Loading gallery..</div></div>" +
				"</div>";

		$("#xkit-control-panel-inner").html(m_html);
		$("#xkit-extensions-panel-right").nanoScroller();
		$("#xkit-extensions-panel-right").nanoScroller({ scroll: 'top' });

		XKit.download.page("gallery.php", function(mdata) {

			if (XKit.extensions.xkit_preferences.current_panel !== "get") { return; }

			if (mdata.server_down === true) {
				
				$("#xkit-extensions-panel-right-inner").html("<div class=\"xkit-unable-to-load-extension-gallery\"><b>Unable to load extension gallery.<br/>Sorry about that.</b><br/><br/>XKit servers might be experiencing some problems. Please try again, and if you couldn't reach the servers for more than a few days, try resetting XKit.</div>");
				$("#xkit-extensions-panel-right").nanoScroller();
				$("#xkit-extensions-panel-right").nanoScroller({ scroll: 'top' });
				return;
			}

			var m_html = "";

			for(var extension in mdata.extensions) {

				m_html = m_html + XKit.extensions.xkit_preferences.gallery_parse_item(mdata.extensions[extension]);

			}

			$("#xkit-extensions-panel-right-inner").html(m_html + "<div class=\"xkit-gallery-clearer\">&nbsp;</div>");
			$("#xkit-extensions-panel-right").nanoScroller();
			$("#xkit-extensions-panel-right").nanoScroller({ scroll: 'top' });

			if ($("#xkit-extensions-panel-right-inner .xkit-gallery-extension").length == 0) {

				$("#xkit-extensions-panel-right-inner").html("<div class=\"xkit-unable-to-load-extension-gallery\"><b>No new extensions</b><br/><br/>It looks like you've installed all the currently available extensions.<br/>Come back later!</div>");
				return;

			}


			$("#xkit-extensions-panel-right").removeClass("white");


			$(".xkit-gallery-extension .more-info").click(function() {

				XKit.window.show("More information", $(this).attr('data-more-info'), "info", "<div class=\"xkit-button default\" id=\"xkit-close-message\">OK</div>");
				
			});

			$(".xkit-gallery-extension .xkit-install-extension").click(function() {

				$(this).parent().addClass("overlayed");

				XKit.install($(this).attr('data-extension-id'), function(mdata) {

					var m_extension_id = mdata.id;

					if (mdata.errors == true || mdata.script == "") {
						if (mdata.storage_error === true) {
							show_error_installation("[Code: 631] Can't store data on browser");
							return;
						}
						if (mdata.server_down === true) {
							show_error_installation("[Code: 101] Can't reach XKit servers");
						} else {
							if (mdata.file === "not_found") {
								show_error_installation("Can't download " + to_install + ": Not found");
							} else {
								show_error_installation("Can't download " + to_install);
							}
						}
						return;
					}

					$("#xkit-gallery-extension-" + mdata.id).find(".overlay").addClass("green");
					$("#xkit-gallery-extension-" + mdata.id).find(".overlay").html("installed!");

					try {
						eval(mdata.script);
						XKit.extensions[m_extension_id].run();
					} catch(e) {
						
					}

				});

			});

		});

	},

	gallery_parse_item: function(obj) {

		if (typeof obj.icon === "undefined" || obj.icon === "") {
			obj.icon = XKit.extensions.xkit_preferences.default_extension_icon;
		}

		if (XKit.installed.check(obj.name) === true) { return ""; }

		var m_html =	"<div class=\"xkit-gallery-extension\" id=\"xkit-gallery-extension-" + obj.name + "\" data-extension-id=\"" + obj.name + "\">" +
					"<div class=\"overlay\">downloading</div>" +	
					"<div class=\"title\">" + obj.title + "</div>" +
					"<div class=\"description\">" + obj.description + "</div>";

		if (obj.details !== "" && typeof obj.details !== "undefined") {
			m_html = m_html + "<div class=\"more-info\" data-more-info=\"" + obj.details + "\">more info</div>";
		}

		m_html = m_html + "<div class=\"icon\"><img src=\"" + obj.icon + "\"></div>" +	
					"<div class=\"xkit-button xkit-install-extension\" data-extension-id=\"" + obj.name + "\">Install</div>" +	
				"</div>";				

		return m_html;

	},

	show_my_extensions: function() {
	
		if (XKit.extensions.xkit_preferences.current_panel === "my") { return; }
		XKit.extensions.xkit_preferences.current_panel = "my";

		var m_html = 	"<div class=\"nano\" id=\"xkit-extensions-panel-left\">" +
					"<div class=\"content\" id=\"xkit-extensions-panel-left-inner\"></div>" +
				"</div>" +
				"<div class=\"nano\" id=\"xkit-extensions-panel-right\">" +
					"<div class=\"content\" id=\"xkit-extensions-panel-right-inner\"></div>" +
				"</div>" +
				"<input type=\"text\" id=\"xkit-extensions-panel-left-search\" placeholder=\"Search your extensions..\"/>";

		$("#xkit-control-panel-inner").html(m_html);

		$("#xkit-extensions-panel-left-search").keyup(function() {

			var m_value = $(this).val().toLowerCase();
			m_value = $.trim(m_value);
			if (m_value === "") {
				$("#xkit-extensions-panel-left-inner .xkit-extension").css("display","block");
				$("#xkit-extensions-panel-left-inner .xkit-not-found-error").remove();
			}

			var found_count = 0;
			$("#xkit-extensions-panel-left-inner .xkit-extension").each(function() {

				if ($(this).find(".title").html().toLowerCase().indexOf(m_value) !== -1) {
					found_count++;
					$(this).css("display","block");
				} else {
					$(this).css("display","none");
				}

			});

			if (found_count === 0) {
				if ($("#xkit-extensions-panel-left-inner .xkit-not-found-error").length == 0) {
					var m_html = "<div class=\"xkit-not-found-error\">No extensions found.</div>";
					$("#xkit-extensions-panel-left-inner").prepend(m_html);
				}
			} else {
				$("#xkit-extensions-panel-left-inner .xkit-not-found-error").remove();
			}

		});

		if (XKit.tools.get_setting("xkit_show_internals","false") === "false") {
			XKit.extensions.xkit_preferences.fill_extensions(false);
		} else {
			XKit.extensions.xkit_preferences.fill_extensions();
		}

	},

	fill_extensions: function(internal) {

		var installed = XKit.installed.list();

		var listed_count = 0;
		var m_first;
		var left_div_html = "";

		for (i=0;i<installed.length;i++) {

			if (internal === false && installed[i].substring(0,5) === "xkit_") {
				continue;
			}

			if (internal === true && installed[i].substring(0,5) !== "xkit_") {
				continue;
			}
			
			var m_extension = XKit.installed.get(installed[i]);
			var is_internal = installed[i].substring(0,5) === "xkit_";
			
			var extension_icon;
			if (m_extension.icon == "") {
				if (is_internal === true) {
					extension_icon = XKit.extensions.xkit_preferences.kernel_extension_icon;
				} else {
					extension_icon = XKit.extensions.xkit_preferences.default_extension_icon;
				}
			} else {
				extension_icon = m_extension.icon;
			}

			var extension_title = m_extension.title;
			if (extension_title = "") {
				extension_title = m_extension.id;
			}

			if (listed_count === 0) {
				m_first = m_extension.id;
			}

			var m_html = "<div class=\"xkit-extension\" data-extension-id=\"" + installed[i] + "\">" +
					"<img class=\"icon\" src=\"" + extension_icon + "\">" +
					"<div class=\"icon-mask\">&nbsp;</div>" +
					"<div class=\"title\">" + m_extension.title + "</div>" +
					"</div>";

			if (XKit.extensions.xkit_preferences.current_panel !== "my") { return; }
			$("#xkit-extensions-panel-left-inner").append(m_html);
			listed_count++;

		}

		if (listed_count >= 6) {
			$("#xkit-extensions-panel-left-inner .xkit-extension:last-child").css("border-bottom","0");
		}

		$("#xkit-extensions-panel-left").nanoScroller();
		$("#xkit-extensions-panel-left").nanoScroller({ scroll: 'top' });
		
		if (listed_count >= 1) {
			XKit.extensions.xkit_preferences.open_extension_control_panel(m_first);
			$("#xkit-extensions-panel-left-inner .xkit-extension").click(function() {
				var m_id = $(this).attr('data-extension-id');
				XKit.extensions.xkit_preferences.open_extension_control_panel(m_id);
			});
		} else {
			$("#xkit-extensions-panel-left").html("<div class=\"xkit-not-found-error\"><b>You have no extensions.</b><br/>Why don't you go to the Extension Gallery by clicking on the Get Extensions tab below?</div>");
		}
		
	
	},

	current_open_extension_panel: "",

	open_extension_control_panel: function(extension_id) {
	
		$("#xkit-extensions-panel-left-inner .xkit-extension").each(function() {

			if ($(this).attr('data-extension-id') === extension_id) {
				$(this).addClass("selected");
			} else {
				$(this).removeClass("selected");
			}

		});

		var this_is_internal = extension_id.substring(0,5) === "xkit_";
		var m_extension = XKit.installed.get(extension_id);

		XKit.extensions.xkit_preferences.current_open_extension_panel = extension_id;

		if (typeof XKit.extensions[extension_id] === "undefined") {
			// Something bad has happened. Let's check for this later.
			$("#xkit-extensions-panel-right-inner").html("<div class=\"xkit-unable-to-load-extension-panel\"><b>Unable to load extension panel.</b><br/>Please refresh the page and try again.<br/><br/>If this extension is causing trouble:<br/><div id=\"xkit-extension-delete-trouble\" class=\"xkit-button\">Delete this extension</div></div>");
			XKit.console.add("Can't load extension panel: Extension undefined.");
			$("#xkit-extension-delete-trouble").click(function() {

				if (this_is_internal === true) { return; }

				try { 
					XKit.extensions[XKit.extensions.xkit_preferences.current_open_extension_panel].destroy();
				} catch(e) {
					XKit.console.add("Unable to shutdown extension " + XKit.extensions.xkit_preferences.current_open_extension_panel);
				}
				XKit.tools.remove_css(XKit.extensions.xkit_preferences.current_open_extension_panel);
				setTimeout(function() {
					XKit.installed.remove(XKit.extensions.xkit_preferences.current_open_extension_panel);
					XKit.extensions.xkit_preferences.current_panel = "";
					XKit.extensions.xkit_preferences.show_my_extensions();
				}, 500);

			});

			$("#xkit-extensions-panel-right").nanoScroller();
			$("#xkit-extensions-panel-right").nanoScroller({ scroll: 'top' });
			return;
		}

		var m_html = 	"<div id=\"xkit-extensions-panel-top\">" +
					"<div class=\"title\">" + m_extension.title + "</div>" +
					"<div class=\"version\">" + m_extension.version + "</div>" +
					"<div class=\"more-info\" style=\"display: none;\" id=\"xkit-extension-more-info\">attributes</div>" +
					"<div class=\"developer\">by " + m_extension.developer + "</div>" +
					"<div class=\"description\">" + m_extension.description;

		if (m_extension.details !== "" && typeof m_extension.details !== "undefined") {
			m_html = m_html + "<div class=\"details\" id=\"xkit-extension-details\">more information</div>";
		}
		m_html = m_html + "</div><div class=\"buttons\">" +
						"<div class=\"xkit-button\" id=\"xkit-extension-update\">Update</div>";

		if (this_is_internal === false) {
			m_html = m_html + "<div class=\"xkit-button\" id=\"xkit-extension-uninstall\">Uninstall</div>";
			m_html = m_html + "<div class=\"xkit-button\" id=\"xkit-extension-reset\">Reset Settings</div>";

		}

		m_html = m_html + "</div>";
		

		if (this_is_internal === false) {

			if (XKit.installed.enabled(extension_id) === true) {
				m_html = m_html + "<div class=\"xkit-checkbox selected\" id=\"xkit-extension-enabled\"><b>&nbsp;</b>Enable " + m_extension.title + "</div>";
			} else {
				m_html = m_html + "<div class=\"xkit-checkbox\" id=\"xkit-extension-enabled\"><b>&nbsp;</b>Enable " + m_extension.title + "</div>";
			}

		} else {

			m_html = m_html + "<div id=\"xkit-extension-internal-label\">This extension is a part of XKit and can't be removed or disabled.</div>";

		}

		m_html = m_html + "</div>";

		if (XKit.extensions[extension_id].slow === true) {

			m_html = m_html + "<div id=\"xkit-extension-panel-slow-extension\">This extension might slow down your computer.<div class=\"xkit-more-info\">more information</div></div>";
		
		}

		if (typeof XKit.extensions[extension_id].preferences === "undefined" && typeof XKit.extensions[extension_id].cpanel === "undefined") {

			m_html = m_html + "<div id=\"xkit-extension-panel-no-settings\">No settings available for this extension.</div>";

		} else {

			// To-Do: Load Extension settings Here!
			// Check if custom control panel:
			if (typeof XKit.extensions[extension_id].cpanel === "undefined") {
				// Yes it is.
				m_html = m_html + "<div id=\"xkit-extension-panel-settings\">" + XKit.extensions.xkit_preferences.return_extension_settings(extension_id) + "</div>";
			} else {
				// Check if it also has standard options:
				if (XKit.installed.enabled(extension_id) === false) {
					
					m_html = m_html + "<div id=\"xkit-extension-panel-no-settings\">Please enable this extension to customize it.</div>";
					
				} else {
					if (typeof XKit.extensions[extension_id].preferences !== "undefined") {
						m_html = m_html + "<div id=\"xkit-extension-panel-settings\">" + XKit.extensions.xkit_preferences.return_extension_settings(extension_id) + "</div>";
					} else {
						m_html = m_html + "<div id=\"xkit-extension-panel-settings\"><div style=\"padding: 10px\">There is a problem loading the extension panel.<br/>Update the extension and again later.</div></div>";
					}
				}
			}
		}

		$("#xkit-extensions-panel-right-inner").html(m_html);
		
		// Pass control to the extension to draw custom control panel:
		if (typeof XKit.extensions[extension_id].cpanel !== "undefined") {
			// Call it:
			XKit.extensions[extension_id].cpanel($("#xkit-extension-panel-settings"));
		}

		$("#xkit-extension-update").click(function() {

			if ($(this).hasClass("disabled") === true) { return; }

			$("#xkit-extensions-panel-right-inner").html("<div id=\"xkit-extension-panel-no-settings\">Updating...</div>");

			if (typeof XKit.extensions.xkit_updates === "undefined" || typeof XKit.extensions.xkit_updates.update === "undefined") {
				XKit.window.show("Can't update", "It looks like \"XKit Updates\" extension is missing or not working properly. It is highly recommended that you reset XKit.","error", "<div id=\"xkit-close-message\" class=\"xkit-button default\">OK</div><a href=\"http://www.tumblr.com/xkit_reset\" class=\"xkit-button\">Reset XKit</a>");
				XKit.extensions.xkit_preferences.open_extension_control_panel(XKit.extensions.xkit_preferences.current_open_extension_panel);
				return;
			}
			
			$(this).addClass("disabled");
			
			XKit.extensions.xkit_updates.update(XKit.extensions.xkit_preferences.current_open_extension_panel, function(mdata) {

				if (mdata.errors === false) {
					XKit.window.show("Done!", "The extension is now up-to-date.","info", "<div id=\"xkit-close-message\" class=\"xkit-button default\">OK</div>");
					XKit.extensions.xkit_preferences.open_extension_control_panel(XKit.extensions.xkit_preferences.current_open_extension_panel);
					return;
				}

				XKit.window.show("Can't update", "Update manager returned the following message:<p>" + mdata.error + "</p>Please try again later or if the problem continues, reset XKit.","error", "<div id=\"xkit-close-message\" class=\"xkit-button default\">OK</div><a href=\"http://www.tumblr.com/xkit_reset\" class=\"xkit-button\">Reset XKit</a>");
				XKit.extensions.xkit_preferences.open_extension_control_panel(XKit.extensions.xkit_preferences.current_open_extension_panel);

			});

		});

		$("#xkit-extension-reset").click(function() {

			if (typeof XKit.extensions[extension_id] === "undefined") {
				return;
			}
			
			var m_ext = XKit.installed.get(XKit.extensions.xkit_preferences.current_open_extension_panel);

			XKit.window.show("Reset " + m_ext.title + "?", "This will delete all the settings and data this extension is saving on your computer.","question", "<div id=\"xkit-extension-yes-reset\" class=\"xkit-button default\">Yes, reset settings</div><div id=\"xkit-close-message\" class=\"xkit-button\">Cancel</div>");

			$("#xkit-extension-yes-reset").click(function() {

				if ($(this).hasClass("disabled") === true) { return; }

				$(this).addClass("disabled");
				$(this).html("Please wait, resetting...");

				XKit.storage.clear(XKit.extensions.xkit_preferences.current_open_extension_panel);
				XKit.extensions[XKit.extensions.xkit_preferences.current_open_extension_panel].destroy();
				XKit.tools.remove_css(XKit.extensions.xkit_preferences.current_open_extension_panel);
				setTimeout(function() {
					XKit.extensions.xkit_main.load_extension_preferences(XKit.extensions.xkit_preferences.current_open_extension_panel);
					XKit.extensions[XKit.extensions.xkit_preferences.current_open_extension_panel].run();
					XKit.window.close();
					XKit.extensions.xkit_preferences.open_extension_control_panel(XKit.extensions.xkit_preferences.current_open_extension_panel);
				}, 500);
			
			});

		});

		$("#xkit-extension-uninstall").click(function() {

			if (typeof XKit.extensions[extension_id] === "undefined") {
				return;
			}
			
			var m_ext = XKit.installed.get(XKit.extensions.xkit_preferences.current_open_extension_panel);

			XKit.window.show("Uninstall " + m_ext.title + "?", "This extension will be completely deleted from your computer. If you change your mind, you can re-download it from the extension gallery later.","question", "<div id=\"xkit-extension-yes-uninstall\" class=\"xkit-button default\">Yes, uninstall</div><div id=\"xkit-close-message\" class=\"xkit-button\">Cancel</div>");

			$("#xkit-extension-yes-uninstall").click(function() {

				if ($(this).hasClass("disabled") === true) { return; }

				$(this).addClass("disabled");
				$(this).html("Please wait, uninstalling...");

				XKit.extensions[XKit.extensions.xkit_preferences.current_open_extension_panel].destroy();
				XKit.tools.remove_css(XKit.extensions.xkit_preferences.current_open_extension_panel);
				setTimeout(function() {
					XKit.installed.remove(XKit.extensions.xkit_preferences.current_open_extension_panel);
					XKit.window.close();
					XKit.extensions.xkit_preferences.current_panel = "";
					XKit.extensions.xkit_preferences.show_my_extensions();
				}, 500);
			
			});


		});

		$("#xkit-extension-enabled").click(function() {

			if (typeof XKit.extensions[extension_id] === "undefined") {
				return;
			}

			var m_ext = XKit.extensions.xkit_preferences.current_open_extension_panel;
			if (XKit.installed.enabled(m_ext) === true) {
				XKit.installed.disable(m_ext);
				XKit.extensions[extension_id].destroy();
				$(this).removeClass("selected");
			} else {
				XKit.installed.enable(m_ext);
				XKit.extensions[extension_id].run();
				$(this).addClass("selected");
			}
			
			// Re-open the extension panel:
			XKit.extensions.xkit_preferences.current_open_extension_panel = "";
			XKit.extensions.xkit_preferences.open_extension_control_panel(m_ext);

		});

		$("#xkit-extension-panel-slow-extension .xkit-more-info").click(function() {

			XKit.window.show("Turtle Warning", "This extension manipulates the page a lot and/or makes calls to Tumblr servers and - depending on your computer, internet connection and browser - might or might not slow down your computer.<br/><br/>If XKit is making your browser slower, it is recommended that you disable the extensions with this warning message, or at least disable the features of it you don't use much.","warning", "<div id=\"xkit-close-message\" class=\"xkit-button default\">OK</div>");

		});

		$("#xkit-extension-details").click(function() {

			var m_extension = XKit.installed.get(XKit.extensions.xkit_preferences.current_open_extension_panel);
			XKit.window.show("More Information", m_extension.details, "info", "<div class=\"xkit-button default\" id=\"xkit-close-message\">OK</div>");		

		});

		$("#xkit-extension-more-info").click(function() {

			var m_extension = XKit.installed.get(XKit.extensions.xkit_preferences.current_open_extension_panel);

			var has_css = m_extension.css !== "";
			var has_icon = m_extension.icon !== "";
			var is_beta = m_extension.beta === true;
			var is_frame = m_extension.frame === true;	
			var extension_size = JSON.stringify(m_extension).length;
			var extension_size_kb = Math.round(extension_size / 1024);
			var storage_size = XKit.storage.size(XKit.extensions.xkit_preferences.current_open_extension_panel);
			var storage_quota = XKit.storage.quota(XKit.extensions.xkit_preferences.current_open_extension_panel);
			var is_internal = m_extension.id.substring(0,5) === "xkit_";
			var has_settings = false;
			if (typeof XKit.extensions[XKit.extensions.xkit_preferences.current_open_extension_panel].preferences !== "undefined") {
				has_settings = true;
			} 
			var is_enabled = XKit.installed.enabled(XKit.extensions.xkit_preferences.current_open_extension_panel);

			var m_html = 	"<b>Internal ID</b>: " + m_extension.id + "<br/>" + 
					"<b>Developer</b>: " + m_extension.developer + "<br/>" +
					"<b>Enabled</b>: " + is_enabled + "<br/>" +
					"<b>Internal</b>: " + is_internal + "<br/>" +
					"<b>Size</b>: " + extension_size_kb + "kb (" + extension_size + " bytes)<br/>" +
					"<b>Storage Size</b>: " + storage_size + "<br/>" +
					"<b>Storage Quota Left</b>: " + storage_quota + "<br/>" +
					"<b>Has Stylesheet</b>: " + has_css + "<br/>" +
					"<b>Has Icon</b>: " + has_icon + "<br/>" +
					"<b>Has Settings</b>: " + has_settings + "<br/>" +
					"<b>Beta Extension</b>: " + is_beta + "<br/>" +
					"<b>Frame Extension</b>: " + is_frame + "<br/>";

			XKit.window.show("Extension Information", m_html, "info", "<div class=\"xkit-button default\" id=\"xkit-close-message\">OK</div>");		

		});

		if ($("#xkit-extensions-panel-right-inner .xkit-extension-setting").length >= 4) {
			$("#xkit-extensions-panel-right-inner .xkit-extension-setting:last-child").css("border-bottom","0");
		}

		$("#xkit-extensions-panel-right").nanoScroller();
		$("#xkit-extensions-panel-right").nanoScroller({ scroll: 'top' });

		$(".xkit-extension-setting > .xkit-checkbox").click(function() {

			var extension_id = $(this).attr('data-extension-id');
			var preference_name = $(this).attr('data-setting-id');

			if ($(this).hasClass("selected") === true) {
				XKit.extensions[extension_id].preferences[preference_name].value = false;
				XKit.storage.set(extension_id, "extension__setting__" + preference_name, "false");
				$(this).removeClass("selected");
			} else {
				XKit.extensions[extension_id].preferences[preference_name].value = true;
				XKit.storage.set(extension_id, "extension__setting__" + preference_name, "true");
				$(this).addClass("selected");
			}

			XKit.extensions.xkit_preferences.restart_extension(extension_id);

		});

		$(".xkit-extension-setting > .xkit-textbox").change(function() {

			var extension_id = $(this).attr('data-extension-id');
			var preference_name = $(this).attr('data-setting-id');

			XKit.extensions[extension_id].preferences[preference_name].value = $(this).val();
			XKit.storage.set(extension_id, "extension__setting__" + preference_name, $(this).val());
			XKit.extensions.xkit_preferences.restart_extension(extension_id);

		});
	
	},

	restart_extension: function(extension_id) {

		try {
			XKit.extensions[extension_id].destroy();
			setTimeout(function() {
				try { 
					XKit.extensions[extension_id].run();	
				} catch(e) {
					XKit.console.add("Can not run " + extension_id + ": " + e.message);
				}
			}, 10);
		} catch(e){
			// Unknown what to do here.
			XKit.console.add("Can not run " + extension_id + ": " + e.message);
		}

	},

	return_extension_settings: function(extension_id) {

		var m_return = "";

		try {

		for(var pref in XKit.extensions[extension_id].preferences) {

			if (XKit.extensions[extension_id].preferences[pref].type === "text") {

				m_return = m_return + "<div class=\"xkit-extension-setting\" data-extension-id=\"" + extension_id + "\" data-setting-id=\"" + pref + "\">";

				if (typeof XKit.extensions[extension_id].preferences[pref].value === "undefined") {
					XKit.extensions[extension_id].preferences[pref].value = "";
				}
				
				if (XKit.extensions[extension_id].preferences[pref].value === "") {
					if (typeof XKit.extensions[extension_id].preferences[pref].default !== "undefined") {
						XKit.extensions[extension_id].preferences[pref].value = XKit.extensions[extension_id].preferences[pref].default;
					}
				}

				m_return = m_return + "<div class=\"title\">" + XKit.extensions[extension_id].preferences[pref].text + "</div>";

				m_placeholder = "Enter value and hit Enter";
				if (typeof XKit.extensions[extension_id].preferences[pref].placeholder !== "undefined") {
					m_placeholder = XKit.extensions[extension_id].preferences[pref].placeholder;
				}

				m_return = m_return + "<input data-extension-id=\"" + extension_id + "\" data-setting-id=\"" + pref + "\" class=\"xkit-textbox\" placeholder=\"" + m_placeholder + "\" value=\"" + XKit.extensions[extension_id].preferences[pref].value + "\">";

				m_return = m_return + "</div>";
				

			}

			if (XKit.extensions[extension_id].preferences[pref].type === "separator") {

				m_return = m_return + "<div class=\"xkit-extension-setting-separator\">" + XKit.extensions[extension_id].preferences[pref].text + "</div>";

			}


			if (typeof XKit.extensions[extension_id].preferences[pref].type === "undefined" ||  XKit.extensions[extension_id].preferences[pref].type === "" || XKit.extensions[extension_id].preferences[pref].type === "checkbox") {

				m_return = m_return + "<div class=\"xkit-extension-setting checkbox\" data-extension-id=\"" + extension_id + "\" data-setting-id=\"" + pref + "\">";

				if (typeof XKit.extensions[extension_id].preferences[pref].value === "undefined") {
					if (typeof XKit.extensions[extension_id].preferences[pref].default !== "undefined") {
						XKit.extensions[extension_id].preferences[pref].value = XKit.extensions[extension_id].preferences[pref].default;
					}
				}

				if (XKit.extensions[extension_id].preferences[pref].value === false) {
					m_return = m_return + "<div data-extension-id=\"" + extension_id + "\" data-setting-id=\"" + pref + "\" class=\"xkit-checkbox\" id=\"xkit-extension-enabled\"><b>&nbsp;</b>" + XKit.extensions[extension_id].preferences[pref].text + "</div>";
				} else {
					m_return = m_return + "<div data-extension-id=\"" + extension_id + "\" data-setting-id=\"" + pref + "\" class=\"xkit-checkbox selected\" id=\"xkit-extension-enabled\"><b>&nbsp;</b>" + XKit.extensions[extension_id].preferences[pref].text + "</div>";
				}

				m_return = m_return + "</div>";
				

			}



		}

		return m_return;

		} catch(e) {

			return "<div style=\"padding: 10px;\"><b>Unable to read extension preferences:</b><br/>" + e.message + "</div>";

		}

	},

	show_other: function() {

		if (XKit.extensions.xkit_preferences.current_panel === "other") { return; }
		XKit.extensions.xkit_preferences.current_panel = "other";

		var m_html = 	"<div class=\"nano long\" id=\"xkit-extensions-panel-left\">" +
					"<div class=\"content\" id=\"xkit-extensions-panel-left-inner\">" +
						"<div data-pname=\"reset\" class=\"xkit-extension text-only\">Reset XKit</div>" +
						"<div data-pname=\"update-all\" class=\"xkit-extension text-only\">Update All</div>" +
						"<div data-pname=\"storage\" class=\"xkit-extension text-only\">Storage</div>" +
						"<div data-pname=\"editor\" class=\"xkit-extension text-only\">Open Editor</div>" +
						"<div data-pname=\"console\" class=\"xkit-extension text-only\">Console</div>" +
						"<div data-pname=\"internal\" class=\"xkit-extension text-only\">Show Internals</div>" +
						"<div data-pname=\"flags\" class=\"xkit-extension text-only\">Flags</div>" +
					"</div>" +
				"</div>" +
				"<div class=\"nano\" id=\"xkit-extensions-panel-right\">" +
					"<div class=\"content\" id=\"xkit-extensions-panel-right-inner\">Hello world.</div>" +
				"</div>";

		$("#xkit-control-panel-inner").html(m_html);
		$("#xkit-control-panel-left").nanoScroller();

		$("#xkit-extensions-panel-left-inner > .xkit-extension").click(function() {

			$("#xkit-extensions-panel-left-inner > .xkit-extension").removeClass("selected");
			$(this).addClass("selected");

			if ($(this).attr('data-pname') === "reset") {
				XKit.extensions.xkit_preferences.show_others_panel_reset();
			}
			if ($(this).attr('data-pname') === "update-all") {
				XKit.extensions.xkit_preferences.show_others_panel_update_all();
			}
			if ($(this).attr('data-pname') === "console") {
				XKit.extensions.xkit_preferences.show_others_panel_console();
			}
			if ($(this).attr('data-pname') === "flags") {
				XKit.extensions.xkit_preferences.show_others_panel_flags();
			}
			if ($(this).attr('data-pname') === "editor") {
				XKit.extensions.xkit_preferences.show_others_panel_open_editor();
			}
			if ($(this).attr('data-pname') === "internal") {
				XKit.extensions.xkit_preferences.show_others_panel_show_internals();
			}
			if ($(this).attr('data-pname') === "storage") {
				XKit.extensions.xkit_preferences.show_others_panel_show_storage();
			}
				
		});

		$("#xkit-extensions-panel-left-inner > .xkit-extension:first-child").trigger("click");

	},

	show_others_panel_show_storage: function() {

		var m_html = 	"<div class=\"xkit-others-panel\">" +
				"<div class=\"title\">Storage</div>" +
				"<div class=\"description\">" +
					"XKit has it's own space on your browser, and gives most of this space away to the extensions you install on it. Since this space is not unlimited, you can check here how much space you have left." +
				"</div>" +
				"<div class=\"bottom-part\">";

		var free_zone = storage_max - storage_used;
		var percentage = Math.round((storage_used * 100) / storage_max);
		m_html = m_html + XKit.progress.add("storage_usage") + "You have used <b>" + percentage + "%</b> of your storage.";
		m_html = m_html + "</div><div class=\"bottom-part\" style=\"margin-top: 20px; line-height: 24px;\">";
		m_html = m_html + "<b>What should I do if I am running out of space?</b><br/>If you have used more than 80% of your storage, it is highly recommended that you uninstall the extensions you don't use often. Resetting settings of extensions from the My XKit panel also frees up space.";
		m_html = m_html + "</div><div class=\"bottom-part\" style=\"margin-top: 20px; line-height: 24px;\">";
		m_html = m_html + "<b>What happens if I use all my storage?</b><br/>If you fill up all the XKit storage area, your browser might prevent XKit from saving additional data, and prevent it from booting up. If that happens, you might need to reset XKit to get it to work properly again.";
		m_html = m_html + "</div>";

		$("#xkit-extensions-panel-right-inner").html(m_html);
		XKit.progress.value("storage_usage", percentage);

		$("#xkit-extensions-panel-right").nanoScroller();

	},

	show_others_panel_show_internals: function() {

		var m_html = 	"<div class=\"xkit-others-panel\">" +
				"<div class=\"title\">Show Internal Extensions</div>" +
				"<div class=\"description\">" +
					"\"Internal\"s are the extensions that are at the core of XKit: they are used to boot up and keep XKit up to date, and let you change it's settings. This control panel, for instance, is actually an XKit extension. These are normally hidden from you, but you can force XKit to show these on the \"My XKit\" tab by checking the box below." +
				"</div>" +
				"<div class=\"bottom-part\">" +		
					"<div id=\"xkit-panel-enable-internal-extensions\" class=\"xkit-checkbox\"><b>&nbsp;</b>Show Internal Extensions</div>" +
				"</div>" +		
				"</div>";

		$("#xkit-extensions-panel-right-inner").html(m_html);
		$("#xkit-extensions-panel-right").nanoScroller();

		if (XKit.tools.get_setting("xkit_show_internals","false") === "true") {
			$("#xkit-panel-enable-internal-extensions").addClass("selected");
		}

		$("#xkit-panel-enable-internal-extensions").click(function() {

			if (XKit.tools.get_setting("xkit_show_internals","false") === "false") {
				$("#xkit-panel-enable-internal-extensions").addClass("selected");
				XKit.tools.set_setting("xkit_show_internals","true");
			} else {
				$("#xkit-panel-enable-internal-extensions").removeClass("selected");
				XKit.tools.set_setting("xkit_show_internals","false");
			}

		});

	},

	show_others_panel_reset: function() {

		var m_html = 	"<div class=\"xkit-others-panel\">" +
				"<div class=\"title\">Reset XKit</div>" +
				"<div class=\"description\">" +
					"You can reset XKit to it's factory settings if it's acting weird, or you just want to make a fresh start. This will delete all your XKit settings and extensions, and you'll need to restart your browser." +
				"</div>" +
				"<div class=\"bottom-part\">" +		
					"<div id=\"xkit-panel-reset-xkit\" class=\"xkit-button block\">Reset XKit</div>" +
				"</div>" +		
				"</div>";

		$("#xkit-extensions-panel-right-inner").html(m_html);
		$("#xkit-extensions-panel-right").nanoScroller();

		$("#xkit-panel-reset-xkit").click(function() {
			XKit.special.reset();
			XKit.extensions.xkit_preferences.close();
		});

	},

	show_others_panel_console: function() {

		var m_html = 	"<div class=\"xkit-others-panel\">" +
				"<div class=\"title\">Console</div>" +
				"<div class=\"description\">" +
					"XKit comes with a console used to debug errors or see what's happening in the background, if you are the curious type. When filing a bug report, you should copy the error text on the console so I can fix the error sooner." +
				"</div>" +
				"<div class=\"bottom-part\">" +		
					"<div id=\"xkit-panel-enable-console\" class=\"xkit-checkbox\"><b>&nbsp;</b>Enable XKit Console</div>" +
				"</div>" +		
				"</div>";

		$("#xkit-extensions-panel-right-inner").html(m_html);
		$("#xkit-extensions-panel-right").nanoScroller();

		if (XKit.tools.get_setting("xkit_log_enabled","false") === "true") {
			$("#xkit-panel-enable-console").addClass("selected");
		}

		$("#xkit-panel-enable-console").click(function() {

			if (XKit.tools.get_setting("xkit_log_enabled","false") === "false") {
				$("#xkit-panel-enable-console").addClass("selected");
				XKit.tools.set_setting("xkit_log_enabled","true");
				XKit.console.show();
			} else {
				$("#xkit-panel-enable-console").removeClass("selected");
				XKit.tools.set_setting("xkit_log_enabled","false");
				XKit.console.hide();
			}

		});

	},


	show_others_panel_flags: function() {

		var m_html = 	"<div class=\"xkit-others-panel\">" +
				"<div class=\"title\">Flags</div>" +
				"<div class=\"description\">" +
					"Flags (or 'switches') are used to enable or disable parts of XKit that are experimental and/or optional. You can click on the View Flags button below to get a list of flags you can play with, but they come with no warranty: some flags can slow down XKit or make it behave weirdly. Please stop now if you don't know what you are doing." +
				"</div>" +
				"<div class=\"bottom-part\">" +		
					"<div id=\"xkit-panel-show-flags\" class=\"xkit-button block\">View Flags</div>" +
				"</div>" +		
				"</div>";

		$("#xkit-extensions-panel-right-inner").html(m_html);
		$("#xkit-extensions-panel-right").nanoScroller();

		$("#xkit-panel-show-flags").click(function() {

			XKit.extensions.xkit_preferences.flags();

		});

	},

	show_others_panel_update_all: function() {

		var m_html = 	"<div class=\"xkit-others-panel\">" +
				"<div class=\"title\">Update All</div>" +
				"<div class=\"description\">" +
					"If, for some reason, you can not receive XKit updates, click on the button below to force XKit to re-download and update all the extensions you have installed." +
				"</div>" +
				"<div class=\"bottom-part\">" +		
					"<div id=\"xkit-panel-reset-xkit\" class=\"xkit-button block\">Update all my extensions</div>" +
				"</div>" +		
				"</div>";

		$("#xkit-extensions-panel-right-inner").html(m_html);
		$("#xkit-extensions-panel-right").nanoScroller();

	},

	show_others_panel_open_editor: function() {

		var m_html = 	"<div class=\"xkit-others-panel\">" +
				"<div class=\"title\">Open Editor</div>" +
				"<div class=\"description\">" +
					"XKit comes with the Extension Editor embedded. This is used to write new extensions and update the existing. You can use it to write extensions if you are good with JavaScript and the XKit framework." +
				"</div>" +
				"<div class=\"bottom-part\">" +		
					"<a href=\"http://www.tumblr.com/xkit_editor\" class=\"xkit-button block\">Open Editor</a>" +
				"</div>" +		
				"</div>";

		$("#xkit-extensions-panel-right-inner").html(m_html);
		$("#xkit-extensions-panel-right").nanoScroller();

	},

	flags: function() {

		var m_html = 	"<div class=\"xkit-scary-warning\">" +
				"<b>This is for advanced users only.</b><br/>Please proceed with caution or leave if you are unsure of what you are doing.<br/>Support is not provided if you break something." +
				"</div><div id=\"xkit-flags-list\">";

		for(var flag in XKit.flags) {

			if (XKit.flags[flag] === true) {
				m_html = m_html + "<div data-flag-id=\"" + flag + "\" class=\"xkit-data-flag-button xkit-checkbox selected\"><b>&nbsp;</b>" + flag + "</div>";
			} else {
				m_html = m_html + "<div data-flag-id=\"" + flag + "\" class=\"xkit-data-flag-button xkit-checkbox\"><b>&nbsp;</b>" + flag + "</div>";
			}
			
		}

		m_html = m_html + "</div>";

		$("#xkit-extensions-panel-right-inner").html(m_html);

		$("#xkit-flags-list .xkit-data-flag-button").click(function() {

			var flag_id = $(this).attr('data-flag-id');
			if (XKit.read_flag(flag_id) === false) {
				XKit.set_flag(flag_id, true);
				$(this).addClass("selected");
			} else {
				XKit.set_flag(flag_id, false);
				$(this).removeClass("selected");
			}

		});

		$("#xkit-extensions-panel-right").nanoScroller();

	},

	show_about: function() {

		if (XKit.extensions.xkit_preferences.current_panel === "about") { return; }
		XKit.extensions.xkit_preferences.current_panel = "about";

		var m_html = 	"<div id=\"xkit-logo-big\">&nbsp;</div>" +
				"<div id=\"xkit-about-window-text\">" +
					"<div class=\"title\">XKit Version " + XKit.version + "</div>" +
					"<div class=\"subtitle\">The Extension Framework for Tumblr.</div>" +
					"<div class=\"copyright\">&copy; 2011 - 2013 STUDIOXENIX</div>" +
					"<div class=\"thanks\">STUDIOXENIX would like to thank all the beta testers, bug reporters, and people who support, suggest features, donate to and use XKit.</div>" +
				"</div>" +
				"<div id=\"xkit-about-window-links\">" +
					"<a href=\"http://www.xkit.info/seven\">XKit Website</a>" +
					"<a href=\"#\" onclick=\"return false\" id=\"xkit-open-credits\">Credits</a>" +
					"<a href=\"http://xkit-extension.tumblr.com\">Official XKit Blog</a>" +
					"<a href=\"http://www.xkit.info/seven/donate\">Donate to XKit</a>" +
					"<a href=\"http://www.xkit.info/seven/spread\">Spread XKit</a>" +
					"<a href=\"http://www.xkit.info/seven/support\">Support & Documentation</a>" +
					"<a href=\"http://www.xkit.info/eula\">Legal</a>" +
				"</div>";
		$("#xkit-control-panel-inner").html(m_html);

		$("#xkit-open-credits").click(function() {

			XKit.window.show("Credits","XKit uses <a href=\"www.jquery.com\">jQuery and jQuery UI</a> by jQuery Foundation, <a href=\"https://github.com/timrwood/moment/\">moment.js</a> by Tim Wood, <a href=\"http://code.drewwilson.com/entry/tiptip-jquery-plugin\">TipTip</a> by Drew Wilson and <a href=\"http://jamesflorentino.github.io/nanoScrollerJS/\">nanoScroll</a> by James Florentino. On Firefox, it uses the <a href=\"https://arantius.com/misc/greasemonkey/script-compiler.php\">User Script Compiler</a> by Arantius.<br/><br/>XKit is written by <a href=\"http://www.studioxenix.com/\">STUDIOXENIX</a>, a one-man entity.<br/><br/>All trademarks are the property of their respective owners.<br/>By using this software you are agreeing to <a href=\"http://www.xkit.info/eula\">XKit EULA</a>.", "info", "<div class=\"xkit-button default\" id=\"xkit-close-message\">OK</div>");

		});

	},

	destroy: function() {
		$("#xkit-control").remove();
		this.running = false;
	}
	
});
