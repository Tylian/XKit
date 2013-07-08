XKit Control Panel renders your extensions' settings depending on the "preferences" object of your extension. Your extension panel can have separators, text input and checkboxes. If you need more, you can write your own custom control panel by adding a `cpanel` function.

### How to add preferences using standard controls (recommended)
Example:
	`XKit.extensions.my_extension = new Object({

		running: false,
		slow: true,
	
		preferences: {
			"sep0": {
				text: "A cool separator",
				type: "separator"
			},
			"blink": {
				text: "Blink on everything",
				default: false,
				value: false
			},
			"show_message": {
				text: "Show an alert message every time I refresh the page",
				default: false,
				value: false
			},
			"show_message_text": {
				text: "Message to be shown",
				default: false,
				value: false,
				type: "text"
			},
			"sep1": {
				text: "Another separator",
				type: "separator"
			},
			"show_tags": {
				text: "This should be checked by default",
				default: true,
				value: true
			},

	},	`