Returns data about the browser.

### Returns
* name 
* version - not reliable on Safari/Opera
* chrome, safari, firefox, opera - booleans
* name - user-readable browser name

### Usage example

	var m_browser = XKit.browser();
	
	if (m_browser.chrome) {
		alert("You are on Chrome! Yay!");
		alert("You are also on Chrome " + m_browser.version + "!");	
	}
	
	if (m_browser.firefox || m_browser.safari) {
		alert("Boo.");
	}