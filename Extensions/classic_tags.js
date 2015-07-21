//* TITLE Tags on Sidebar **//
//* VERSION 1.3.1 REV A **//
//* DESCRIPTION Shows your tracked tags on your sidebar **//
//* DEVELOPER STUDIOXENIX **//
//* FRAME false **//
//* BETA false **//

XKit.extensions.classic_tags = new Object({

	running: false,
	slow: true,

	preferences: {
		"only_new_tags": {
			text: "Only show tags with new posts",
			default: false,
			value: false
		},
		"open_in_new_tab": {
			text: "Open the tag results in a new window",
			default: false,
			value: false
		},
		"turn_off_warning": {
			text: "Turn off 'Too Many Tracked Tags' warning",
			default: false,
			value: false
		},
	},

	run: function() {

		try {

			XKit.tools.init_css("classic_tags");
			if ($("#dashboard_index").length === 0) {
				if (document.location.href.indexOf('/tagged') === -1) {
					return;
				}
			}

			if ($(".tracked_tags").length > 0) {
				XKit.extensions.classic_tags.show();
			}

		} catch(e) {

			XKit.console.add("Can't run Classic Tags:" + e.message);

		}
	},

	show: function() {
		if ($("#dashboard_index").length === 0) {
			if (document.location.href.indexOf('/tagged') === -1) {
				return;
			}
		}

		var show_this_tag = false;
		var extra_classes = "";
		var m_html = "";

		var total_tag_count = 0;

		$(".tracked_tag").each(function() {

			total_tag_count++;

		});

		if (total_tag_count >= 21 && XKit.extensions.classic_tags.preferences.turn_off_warning.value !== true) {

			m_html = "<div class=\"classic-tags-too-much-tags-error\"><b>Too Many Tracked Tags:</b><br> After around 20 tags, Tumblr stops updating the status of all your tracked tags until you untrack some. Please track less than 20 tags for this extension to work.</div>";
			m_html = '<ul class="controls_section" id="xtags"><li class=\"section_header selected\">TRACKED TAGS</li>' + m_html + '</ul>';

			if (document.location.href.indexOf('/tagged/') !== -1) {

				$("#right_column").append(m_html);

			} else {

				if ($("ul.controls_section:eq(1)").length > 0) {
					if ($("#xim_small_links").length > 0) {
						$("#xim_small_links").after(m_html);
					} else {
						$("ul.controls_section:eq(1)").after(m_html);
					}
				} else {
					$("#right_column").prepend(m_html);
				}
			}

			return;

		}

		$(".tracked_tag").each(function() {

			if (parseInt($(this).find(".count").html()) > 0) {
				show_this_tag = true;
			} else {
				if (XKit.extensions.classic_tags.preferences.only_new_tags.value === true) {
					if (total_tag_count >= 21 && XKit.extensions.classic_tags.preferences.turn_off_warning.value == true) {
						// Show everything!
					} else {
						return;
					}
				}
			}

			var result = $(this).find(".result_link");
			var tag = result.attr('data-tag-result');
			var href = result.attr('href');

			if ($("body").attr('data-page-root') === href) {
				extra_classes = "selected";
			} else {
				extra_classes = "";
			}

			var m_title = $(this);

			if (XKit.extensions.classic_tags.preferences.open_in_new_tab.value === true) {
				result.attr('target','_BLANK');
			} else {
				result.attr('target','');
			}
			var result_title = $(m_title).find(".result_title");
			result_title.html(result_title.html().replace("#",""));

			m_html = m_html + '<li class="xtag ' + extra_classes + '"><div class="hide_overflow">' + $(m_title).html() + '</div></li>';

		});

		if (m_html !== "") {

			m_html = '<ul class="controls_section" id="xtags"><li class=\"section_header selected\">TRACKED TAGS</li>' + m_html + '</ul>';

			if (document.location.href.indexOf('/tagged/') !== -1) {

				$("#right_column").append(m_html);

			} else {
				var sections = $("ul.controls_section");
				if (sections.length > 0) {
					var section = sections[0];
					if (sections.length > 1) {
						section = sections[1];
					}
					if ($("#xim_small_links").length > 0) {
						$("#xim_small_links").after(m_html);
					} else {
						$(section).after(m_html);
					}
				} else {
					$("#right_column").prepend(m_html);
				}
			}

			$(".xtag").each(function() {
				$(this).find(".count").html(parseInt($(this).find(".count").html()));
			});

		}

	},

	destroy: function() {
		XKit.tools.remove_css("classic_tags");
		$("#xtags").remove();
	}

});
