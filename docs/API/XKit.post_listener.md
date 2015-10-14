_For more information, visit [Post Listener page](https://github.com/atesh/XKit/wiki/Post-Listener), which includes examples._

### add(extension_id, func)
Adds `func` to the callback list.  
`XKit.post_listener.add("my_extension", XKit.extensions.my_extension.to_be_called);`

### remove(extension_id)
Removes the previously added callback.  
`XKit.post_listener.remove("my_extension");`