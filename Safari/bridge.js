var framework_version = "";
var storage_max = 500 * 1024 * 1024;
var storage_used = -1;
(function(){

if (typeof XBridge !== "undefined") { return; }

XBridge = {
	version: "1.0.0",
	framework_version: "",
	request_callbacks: new Array(),

	init: function() {
		// Fetch framework version.
		storage_used = get_storage_used();
		safari.self.addEventListener("message", XBridge.message, false);
		safari.self.tab.dispatchMessage("framework_version");
	},
	
	message: function(ev) {
	
		if (ev.name === "framework_version") {
			framework_version = ev.message;
			XBridge.framework_version = ev.message;
			XKit.version = framework_version;
			XKit.init();
		}
		
		if (ev.name === "http_response") {
			/*
				m_to_return.request = request;
				m_to_return.status = request.status;
				m_to_return.settings = settings;
			*/
			
			for (var i=0;i<XBridge.request_callbacks.length;i++) {
			
				if (XBridge.request_callbacks[i].id === ev.message.request_id) {

					if (ev.message.status === 200) {
						if (typeof XBridge.request_callbacks[i].onload !== "undefined") {
							XBridge.request_callbacks[i].onload(ev.message.request, ev.message.request);
						}
					} else {
						if (typeof XBridge.request_callbacks[i].onerror !== "undefined") {
							XBridge.request_callbacks[i].onerror(ev.message.request, ev.message.request);
						}			
					}
					
					XBridge.request_callbacks.splice(i, 1);
					break;
				}
			
			}
			
		}
	
	}
	
};

	XBridge.init();

}());

function make_request_id()
{
	var text = "";
	var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

	for( var i=0; i < 50; i++ )
		text += possible.charAt(Math.floor(Math.random() * possible.length));

	return text;
}

function GM_xmlhttpRequest(settings) {

	console.log("Sending http_request...");
	var to_send = new Object();
	to_send.settings = settings;
	to_send.request_id = make_request_id();

	
	var m_callbacks = new Object();
	m_callbacks.id = to_send.request_id;
	m_callbacks.onload = settings['onload'];
	m_callbacks.onerror = settings['onerror'];
  
  // Safari 7 will refuse to send the message if functions are present (I think)
  settings['onload'] = !!settings['onload']; // convert to boolean
  settings['onerror'] = !!settings['onerror']; // convert to boolean
	
	XBridge.request_callbacks.push(m_callbacks);

	safari.self.tab.dispatchMessage("http_request",to_send);

}

function getBridgeError() {

	return "";

}

function get_storage_used() {

	var to_count = GM_listValues();
	var to_return = 0;
	
	for (var i=0;i<to_count.length;i++) {
		to_return = to_return + to_count[i].length;
	}
	
	return to_return;

}

function GM_deleteAllValues(callback) {

	var to_delete = GM_listValues();
	
	for (var i=0;i<to_delete.length;i++) {
		GM_deleteValue(to_delete[i]);
	}
	
	callback();

}

function GM_getValue(name, defaultValue) {

	var value = localStorage.getItem(name);
	if (!value)
		return defaultValue;
	var type = value[0];
	value = value.substring(1);
	switch (type) {
		case 'b':
			return value === 'true';
		case 'n':
			return Number(value);
		default:
			return value;
	}

}

function GM_deleteValue(name) {
	localStorage.removeItem(name);
}

function GM_log(message) {
	console.log(message);
}

function GM_openInTab(url) {
	return window.open(url, "_blank");
}

function GM_listValues() {
	var list = [];
	var reKey = new RegExp("^" + "");
	for (var i = 0, il = window.localStorage.length; i < il; i++) {
			// only use the script's own keys
			var key = window.localStorage.key(i);
			if (key.match(reKey)) {
				list.push(key);
			}
	}
	return list;
}

function GM_setValue(name, value) {
	value = (typeof value)[0] + value;
	localStorage.setItem(name, value);
}