Store permanent data on user's computer.  
Note that the user can erase this by clicking on Reset Settings on XKit Control Panel.

## Information + Tips
* Each extension can store only up to 150kb data.
* If your extension exceeds that, XKit will warn the user and let them erase your storage, annoying you and the user.
* Never, ever piggyback on another extension's storage area. Always use your extension_id.

## Methods

### size(extension_id)
Returns the size of stored data by extension_id

### quota(extension_id)
Returns the storage space left for the extension

### get(extension_id, key, default_value)
Retrieves `key` from storage. If nothing is found, return `default_value`

### set(extension_id, key, value)
Sets `key` to `value`. Returns `true` on success.

### get_all(extension_id)
Returns everything stored in the storage area as an object.

### clear(extension_id)
Clear storage area for extension_id

## Usage Example

	// Set a value.
	XKit.storage.set("my_extension","name","xenixlet");
	
	// Retrieve it.
	var my_name = XKit.storage.get("my_extension","name","");
	if (my_name !== "") {
		alert("Your name is " + my_name);	
	}
	
	// Check the quota.
	if (XKit.storage.quota("my_extension") >= 300) {
		// Store a 300-character data here!	
	} else {
		// Clear the storage.
		XKit.storage.clear("my_extension");
	}