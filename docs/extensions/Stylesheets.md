# Stylesheets

Every extension needs some CSS. There are two ways you can include CSS in your extensions:

1. `init_css()` and the Stylesheet tab on the XKit Editor
2. `add_css()` to include CSS on-the-go

#### `init_css()`

If your CSS has code that you'll be using all the time, use the Stylesheet tab on XKit Editor, then call init_css function to let XKit load it to the page. Use `XKit.tools.remove_css` to remove it.

Example usage:

```css
/* my_extension.css */
#my_fancy_div {
    background: red;
    color: yellow;
}
```

```javascript
// my_extension.js
run: function() {
    XKit.tools.init_css("my_extension_name");
    $("body").append("<div id=\"my_fancy_div\">This will be red and yellow.</div>");
},

destroy: function() {
    XKit.tools.remove_css("my_extension_name");
}
```

#### `add_css()`

Include CSS code on the go.

Example usage:

```javascript
run: function() {
    var hide_post = true;
    if (hide_posts) {
        // Lets hide all posts.
        XKit.tools.add_css("#posts .post { display: none; }", "my_extension_name");
    }
},

destroy: function() {
    XKit.tools.remove_css("my_extension_name");
}
```

# Tips

* Always remove the CSS you've added when you are done with it, and on the `destroy` function.
* Name your class names/ids with a prefix to avoid conflicts with other extensions.
  * For example, do not use `.my_div`; instead use `.my_extension_my_div`
