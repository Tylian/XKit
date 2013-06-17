//* TITLE Shuffle Queue **//
//* VERSION 1.4 REV A **//
//* DESCRIPTION Shuffle items on your queue **//
//* DEVELOPER STUDIOXENIX **//
//* DETAILS Go to your queue and click on the Shuffle button on the sidebar to shuffle the posts. Note that only the posts you see will be shuffled. If you have more than 15 posts on your queue, scroll down and load more posts in order to shuffle them too. **//
//* FRAME false **//
//* BETA false **//

XKit.extensions.shuffle_queue = new Object({

	running: false,

	run: function() {

		if (document.location.href.indexOf("/queue") === -1) {
			return;
		}

		XKit.tools.init_css("shuffle_queue");

		this.running = true;

		xf_html = '<ul class="controls_section" id="xshufflequeue_sidebar">' +
			'<li class="">' +
				'<a href="#" class="queue" id="xshufflequeue_button">' +
					'<div class="hide_overflow">Shuffle</div>' +
					'<div class="count">&nbsp;</div>' +
				'</a>' +
			'</li>' +
			'</ul>';

		$("ul.controls_section:eq(1)").before(xf_html);

		$("#xshufflequeue_button").click(function(event) {
			event.preventDefault();
			XKit.extensions.shuffle_queue.shuffle();
		});

	},

	shuffle: function() {
		
		if ($("#xshufflequeue_button").hasClass("disabled") === true) {
			return;
		}
		var new_post_html = $("#new_post").parent()[0].outerHTML;
		$("#posts").html(XKit.extensions.shuffle_queue.shuffle_data($("#posts").children().not("#new_post_buttons").get()));
		$("#posts").prepend(new_post_html);
		$("#xshufflequeue_button").addClass("disabled");
		$("#xshufflequeue_button").find(".count").html("saving..");

		var m_url_arr = document.location.href.split("/");
		var m_url = m_url_arr[4];
		
		var IDs = [];
		$("#posts").find(".post").not("#next_post").each(function(){ 
			if ($(this).attr('data-post-id') !== "" && typeof $(this).attr('data-post-id') !== "undefined") {
				IDs.push($(this).attr('data-post-id')); 
			}
		});
		
		var to_send = encodeURIComponent(IDs.join(","));
		
		var form_key = $("body").attr('data-form-key');
		
		GM_xmlhttpRequest({
			method: "POST",
			url: "http://www.tumblr.com/blog/" + m_url + "/order_post_queue/",
			data: "post_ids=" + to_send + "&form_key=" + form_key,
			json: false,
			onerror: function(response) {
				XKit.window.show("Unable to save queue","I was unable to save the current order of the queue.<br/>Please try again later.","error","<div class=\"xkit-button default\" id=\"xkit-close-message\">OK</div>");
				$("#xshufflequeue_button").find(".count").html("&nbsp;");
				$("#xshufflequeue_button").removeClass("disabled");
			},
			onload: function(response) {
				$("#xshufflequeue_button").find(".count").html("&nbsp;");
				$("#xshufflequeue_button").removeClass("disabled");
				if (response.status !== 200) {
					XKit.window.show("Unable to save queue","I was unable to save the current order of the queue.<br/>Please try again later.","error","<div class=\"xkit-button default\" id=\"xkit-close-message\">OK</div>");	
				}
				
			}
		});

		setTimeout(function() { $("#xshufflequeue_button").parent().removeClass("selected"); },10);

	},
	
	shuffle_data: function(o) {
		for(var j, x, i = o.length; i; j = parseInt(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
		return o;	
	},

	destroy: function() {
		XKit.tools.remove_css("shuffle_queue");
		this.running = false;
	}

});