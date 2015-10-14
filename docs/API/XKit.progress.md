Add a progress bar to one of your DIVs or windows.

## Methods

### add(id)
Set id to something random and it will return a string containing the HTML code you should be using.

### value(id, value)
Set the "progress" of the progress bar. Value is a number between 0 and 100.

## Usage Example

	var m_progress = XKit.progress.add("my-extension-progress-bar");
	XKit.window.show("Wait, please!","Installing something. " + m_progress, "info");
	XKit.progress.value("my-extension-progress-bar", 50);
	
## Tips
* Add a prefix to all your `id`s.