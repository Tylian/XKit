`XKit.tools`: Utility functions for XKit.

<a name="get_blogs" href="XKit.tools.md#get_blogs">#</a> XKit.tools.**get_blogs**()

Returns an array of the URLs of the blogs the user has.

<a name="remove_css" href="XKit.tools.md#remove_css">#</a> XKit.tools.**remove_css**(_extension_id_)

Removes the CSS added by `extension_id`.

For more information, [check the Stylesheets page](../extensions/Stylesheets.md)

<a name="add_css" href="XKit.tools.md#add_css">#</a> XKit.tools.**add_css**(_css_, _extension_id_)

Adds `css` to the page with id `extension_id`.

For more information, [check the Stylesheets page](../extensions/Stylesheets.md)

Example usage:

```javascript
XKit.tools.add_css("body { background: red; }", "my_extension");
```

<a name="init_css" href="XKit.tools.md#init_css">#</a> XKit.tools.**init_css**(_extension_id_)

Loads the extension's CSS into the page.

For more information, [check the Stylesheets page](../extensions/Stylesheets.md)

<a name"random_string" href="XKit.tools.md#random_string">#</a> XKit.tools.**random_string**()

Returns a random 30-character string.

<a name="add_function" href="XKit.tools.md#add_function">#</a> XKit.tools.**add_function**(_func_, _execute_, _add_t_)

Adds the function `func` to the page, and executes it if `execute` is `true`.
`add_t` contains data that is passed along with `func` to be available as the variable `add_tag` in the context of the browser page.

<a name="parse_version" href="XKit.tools.md#parse_version">#</a> XKit.tools.**parse_version**(_version_string_)

Parses `version_string` in format `<MAJOR>.<MINOR>.<PATCH>`, `<MAJOR>.<MINOR>`, or `<MAJOR>.<MINOR> REV <N>` and returns a Semver-styled object:

```
{
  major,
  minor,
  patch
}
```
