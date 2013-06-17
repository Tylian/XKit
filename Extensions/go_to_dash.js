//* TITLE Go-To-Dash **//
//* VERSION 1.0 REV D **//
//* DESCRIPTION View a post on a blog on your dashboard. **//
//* DEVELOPER STUDIOXENIX **//
//* DETAILS This extension adds a 'view' button on peoples blogs that allows you to go back to that post on your dashboard. This feature only works on the blogs you follow. If the post was made before you followed them, you might not see them on your dashboard when you click the view button. **//
//* FRAME true **//
//* BETA false **//

XKit.extensions.go_to_dash = new Object({

	running: false,

	run: function() {	

		if (XKit.page.blog_frame === false) {
			return;
		}

		var m_html = $('body').html();

		var go_ahead = false;
		if ($(".btn.edit").length > 0) {
			if ($(".btn.edit").hasClass("hidden") === false) {
				go_ahead = true;	
			}
		}
		
		if ($(".btn.unfollow").hasClass("hidden") === false ||go_ahead === true) {

			if ($("#xkit_gotodash").length > 0) { return; }

			var dash_icon = "data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAADUAAAAUCAYAAAAtFnXjAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMC1jMDYwIDYxLjEzNDc3NywgMjAxMC8wMi8xMi0xNzozMjowMCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNSBNYWNpbnRvc2giIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6NkQ1QTYyREI0NkM0MTFFMUEzQjVEQjI4QjkwNUUzQjkiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6NkQ1QTYyREM0NkM0MTFFMUEzQjVEQjI4QjkwNUUzQjkiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDo2RDVBNjJEOTQ2QzQxMUUxQTNCNURCMjhCOTA1RTNCOSIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDo2RDVBNjJEQTQ2QzQxMUUxQTNCNURCMjhCOTA1RTNCOSIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PuKKVjwAAAQpSURBVHja5FdNSGNXFM57STWJYfAnaB0TJ+OMP1DBH3BhO0rxZ/y3scNgC4IuVLBuxFpduOjSnXblQsHfVhHKIP6Ms1BnUBxQx4rgolqoYzRtTcbgWGM0ecnrd+2NvGYS35tNoemBS3LOfefe+53znXPfY2R/y3ey4JEWhgJyYpwHASA1RghLlfMgydIVDlYWhPL/BFVRURG9uLhYsbCwUNnc3Jz4XwiEQgzQ+Ph4bVhYmHplZeXnvr6+I+rjwuDFFm9sbDTwPM949f7+/tdS/HwlOzs7PCYmRjU5OfmHFH9v9zu5CdDS0tIvBQUFiy6XixSig4ISFQD6Vqg7HI7L6urqsenp6UOoHqmgJiYmPk1PTzckJyePQeVEfMNZsQxRQC8A6BJTl3RRyVJbW/uEYZhenU7Xt729bR4cHHwEs5LQmGSgoaHhrtFojKUBlsXHxyt9bSTbGGx5ebmuvr4+wWuXTD8hII7jPIiuZ2pq6hOFQsHhcB4Mv+nHZs/39vbO/NCDHIAzm8121OTC2tpaQ2lpqS43N/dWR0dH2c7OjgkZiJ+dnX3V1NS0BP2r4+Pjt5GRkeEmk+koJSXlewIKz+iHhoY+U6vVoW1tbRZiD1QG74Bqb2//mAC6mlQo2KKiomQpGYmIiHgFUBd+qMlT28X6+jqpCZlWqw31eDzyrq6uZwBhBzh5QkJCbH5+vl4JweGXd3d3z8CQ23g8lIAC0FP4/dDS0mLo6ekpgV0lWPtmUMXFxU9BOU1mZuY9oo+Ojm4dHh6eBsqQVxBVN+2MTKBiBt1ukV+r1epMSkrSdHZ2Pjw4OLCqVCqlxWL5E2COqqqqNltbW3NhC0UQfo2Li1MRUPA5hav75OTkjC4nD9SJ3wFlt9tdoMaT5eXlxxkZGQZQ5R4iOLm1tWUji96Ay02HX0CkVnp7e4ttNtvbubk5a3d39wM0jJ8qKytfgpKlYIeypKREC5ppExMTh/Ly8mJGRkaM2PtDQQd1syzL+VBb0j3FA5gjJyfnx83NzddRUVEa3FFGZI6km9DLHmA4/IEeHh7+HIf6en9//xsc2FBTUzNH9tjY2DCBXh/B/kVqamqcRqMJAdg3qBklAvglKJaH7L+Zn5+3iTUGyS2dzNH76XFaWtodcPqsrKxsbHV11SKSMWHzuO90Ogl95KCvG5H/jbbjqy5KuhlqSwEQp8hINOZNpEbq6urukJqDbibPZ2Vlqcg9NTMzY9Xr9UxhYWHswMDA7zTITt+WfhOoa2DYUEcORmoL2TuibV3KJUp4H0J/vU2DE3QtOS0BbyY8NGCsoDQ4gY2h/xnqy/kJsCgobzY/oIvwgoX492ADIwDlr+X7dkuZj4+v7jv3D1AKKS8GNMWMn41lEv15kXkpdl7q/qzg40rq4d773e1f/ki8jn5Qfc7/JcAA6Q/o/6P4jOcAAAAASUVORK5CYII=";

			var postid_start = document.location.href.search("&pid=");
			if (postid_start === -1) { return; }
			var postid_end =  document.location.href.indexOf("&", postid_start + 2);
			var post_id = document.location.href.substring(postid_start + 5, postid_end);

			var post_id = parseInt(post_id) + 1;

			var go_back_icon = '<a href="/dashboard/2/' + post_id + '" class="btn" target="_top" id="xkit_gotodash">View</a>';

			$(".dashboard").html("");
			
			if ($(".controls").find(".unfollow").length > 0) {
				$(".controls").find(".unfollow").before(go_back_icon);
			} else {
				$(".controls").find(".delete").before(go_back_icon);		
			}

		}

		this.running = true;
	},

	destroy: function() {
		this.running = false;
	}

});