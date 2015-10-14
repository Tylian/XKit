## Methods

### extension(extension_id, callback)
Download extension_id and return the results to callback.

### page(page_url, callback)
Download page_url from XKit servers and call the callback afterwards.

## Usage Example:

	XKit.download.page("some_page.php", function(obj) {
	
		// Check if the server was down?
		if (obj.server_down === true) {
			alert("Can't reach!");
			return;	
		}
		
		alert(obj.some_data);
		
	});

## Things to how about XKit.download
* Everything is JSON-ized.
* XKit.download loops thru the server list, giving up after 8 tries.
* Always check for `errors` and `server_down`