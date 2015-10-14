Contains every extension installed.  
Used to reach objects/functions/variables on your extension, or sometimes, other extensions.

## Usage
	// Check if Themes is running, and shut it down.
	if (typeof XKit.extensions.themes !== "undefined") {
		if (XKit.extensions.themes.running === true) {
			XKit.extensions.themes.destroy();
		}
	}
	
## Tips
* Never assume an extension is installed (unless it's your own extension running right now.) Also, well, do not shut down other extensions.