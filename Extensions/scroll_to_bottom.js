//* TITLE Scroll To Bottom **//
//* VERSION 1.0 REV A **//
//* DESCRIPTION Scroll to the bottom of long lists, like the post queue. **//
//* DEVELOPER Jasper Clarkberg **//
//* FRAME false **//
//* BETA false **//

XKit.extensions.scroll_to_bottom = new Object({

  running: false,
  activated: false,
  
  post_listener: function() {
    if (XKit.extensions.scroll_to_bottom.activated === true) {
      $(document.body).scrollTop($("#container").height());
    }
  },
  
  toggle: function() {
    XKit.extensions.scroll_to_bottom.activated = !XKit.extensions.scroll_to_bottom.activated;
    if (XKit.extensions.scroll_to_bottom.activated) {
      $(document.body).scrollTop($("#container").height());
      $('.return_to_bottom').addClass("activated");
    } else {
      $('.return_to_bottom').removeClass("activated");
    }
  },
  
  run: function() {
    XKit.post_listener.add("scroll_to_bottom", XKit.extensions.scroll_to_bottom.post_listener);
    XKit.tools.init_css("scroll_to_bottom");

    var button = $('<a class="return_to_bottom"><div class="return_to_bottom_icon"></div></a>').appendTo("body");
    var return_to_top_visible = false;

    button.click(this.toggle);

    $(window).scroll(function(){
      if ($(document.body).scrollTop() >= 1500) {
            if (!return_to_top_visible) {
              return_to_top_visible = true;
              button.css("top", "90px");
            }
          } else {
            if (return_to_top_visible) {
              return_to_top_visible = false;
              button.css("top", "20px");
            }
          }
    });

    this.running = true;
  },
  
  destroy: function() {
    XKit.post_listener.remove("scroll_to_bottom");
    XKit.tools.remove_css("scroll_to_bottom");
    this.running = false;
  }

});