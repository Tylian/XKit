//* TITLE Scroll To Bottom **//
//* VERSION 1.0 REV A **//
//* DESCRIPTION Scroll to the bottom of long lists, like the post queue. **//
//* DEVELOPER Jasper Clarkberg http://jasper.clarkberg.org/ **//
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
      $("#return_to_bottom_bar").show();
    } else {
      $('.return_to_bottom').removeClass("activated");
      $("#return_to_bottom_bar").hide();
    }
  },
  
  run: function() {
    if ($('.post_container').length < 1) { return; }
    XKit.post_listener.add("scroll_to_bottom", XKit.extensions.scroll_to_bottom.post_listener);
    XKit.tools.init_css("scroll_to_bottom");

    var button = $('<a class="return_to_bottom" id="return_to_bottom" ><div class="return_to_bottom_icon"></div></a>').appendTo("body");
    button.click(this.toggle);
    $('<div id="return_to_bottom_bar"></div>').appendTo("body").hide();

    this.running = true;
  },
  
  destroy: function() {
    XKit.post_listener.remove("scroll_to_bottom");
    XKit.tools.remove_css("scroll_to_bottom");
    $("#return_to_bottom").remove();
    $("#return_to_bottom_bar").remove();
    this.running = false;
    console.log("destroying");
  }

});