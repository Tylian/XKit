Show little notifications on the bottom-left corner of the screen.

## Warnings
* From what I could gather, users don't like to be notified much.

## Methods

### add(message, type, sticky, callback)
Show a notification.  
* Set sticky to `true` if you want it to stay on the screen until the user clicks on it.
* The "type" parameter can be "ok", "warning" and "error".
* Each notification, unless sticky, is shown for 5 seconds.

## Usage example

	XKit.notifications.add("Click me for something new!","ok",false,function() {
		XKit.notifications.add("Hehe, just kidding","ok");	
	});
