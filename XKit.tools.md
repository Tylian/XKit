## Blogs

### get_blogs() as array
Returns an array of the URLs of the blogs the user has.

## CSS

### remove_css(extension_name)
Removes the CSS added by _extension_name_  
For more information, [check the Stylesheets page](https://github.com/atesh/XKit/wiki/Stylesheets)

### add_css(css, extension_name)
Adds _css_ to the page, with id _extension_name_  
`add_css("body { background: red; }", "my_extension");`  
For more information, [check the Stylesheets page](https://github.com/atesh/XKit/wiki/Stylesheets)

### init_css(extension_name)
Loads the CSS written using the stylesheet tab of the XKit Editor.  
For more information, [check the Stylesheets page](https://github.com/atesh/XKit/wiki/Stylesheets)


## Misc.
### random_string()
Returns a random 30-character string.

### add_function(func, execute, add_t)
Adds the function `func` to the page, and executes it if execute is `true`.  
add_t fills "add_tag" variable, so just pass an empty string there.