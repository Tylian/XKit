var framework_version = "";
var storage_max = -1;
var storage_used = -1;

console.log("Yo!");

(function(){

if (typeof XBridge !== "undefined") { console.log("XBridge Already defined."); return; }

XBridge = {
	version: "1.0.2",
	framework_version: "",
	request_callbacks: new Array(),
	storage_area: "",

	init: function() {
		// Fetch framework version.
		if (top !== self) {
			if (typeof safari === "undefined") {
				console.log("XKit Bridge: Quitting, top!==self and safari is undefined.");
				return;
			}
			console.log("XKit Bridge: top !== self!");
		} else {
			console.log("XKit Bridge: top === self!");
		}
		$(document).ready(function() {
			try {
				setTimeout(function() {

					safari.self.addEventListener("message", XBridge.message, false);
					safari.self.tab.dispatchMessage("framework_version");

				}, 100);
			} catch(e) {
				console.log("XBridge error: " + e.message);
				try {
					// XKit.init();
				} catch(e) {
					console.log("XBridge error, recovery mode failed: " + e.message);
				}
			}
		});
	},

	message: function(ev) {

		if (ev.name === "framework_version") {
			console.log("Got framework version package, trying to init the extension.");
			framework_version = ev.message.version;
			XBridge.framework_version = ev.message.version;
			XKit.version = framework_version;
			XBridge.storage_area = ev.message.storage;
			storage_used = get_storage_used();
			//console.log("XKit Bridge: is window top? " + (top === self) + "\n" + document.location.href + "\nFramework_version = " + XBridge.framework_version);
			try {
				XKit.init();
			} catch(e) {
				console.log("Init Extension of XKit failed: " + e.message);
			}
		}

		if (ev.name === "http_response") {
			/*
				m_to_return.request = request;
				m_to_return.status = request.status;
				m_to_return.settings = settings;
			*/

			console.log("got event response from http request! - id is " + ev.message.request_id);
			console.log(ev.message);

			ev.message.request.f_headers = ev.message.headers.split("\r\n");

			ev.message.request.getResponseHeader = function(header) {

				for (var i=0; i<this.f_headers.length;i++) {
					if (this.f_headers[i].substring(0, header.length + 1) === header + ":") {
						return this.f_headers[i].substring(header.length + 2);
					}
				}

				return "";

			};

			console.log("Trying to call the callback with id " + ev.message.request_id);

			for (var i=0;i<XBridge.request_callbacks.length;i++) {

				console.log(" ---- Current Callback ID is " + XBridge.request_callbacks[i].id);
				if (XBridge.request_callbacks[i].id === ev.message.request_id) {

					if (ev.message.status === 200) {
						if (typeof XBridge.request_callbacks[i].onload !== "undefined") {
							XBridge.request_callbacks[i].onload(ev.message.request, ev.message.request, ev.message.request);
						}
					} else {
						if (typeof XBridge.request_callbacks[i].onerror !== "undefined") {
							XBridge.request_callbacks[i].onerror(ev.message.request, ev.message.request, ev.message.request);
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

	var to_send = new Object();
	to_send.settings = settings;
	to_send.request_id = make_request_id();

	console.log("Sending http_request for " + settings["url"]);

	console.log("Request ID is: " + to_send.request_id);

	var m_callbacks = new Object();
	m_callbacks.id = to_send.request_id;
	m_callbacks.onload = settings['onload'];
	m_callbacks.onerror = settings['onerror'];

	// Safari 7 will refuse to send the message if functions are present
	settings['onload'] = !!settings['onload']; // convert to boolean
	settings['onerror'] = !!settings['onerror']; // convert to boolean
	settings['headers'] = JSON.stringify(settings['headers']); // convert to boolean

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

	/*for (var i=0;i<to_delete.length;i++) {
		GM_deleteValue(to_delete[i], true);
	}*/

	for (var obj in XBridge.storage_area) {
		GM_deleteValue(obj, true);
	}

	safari.self.tab.dispatchMessage("save_storage", XBridge.storage_area);
	callback();

}

function GM_getValue(name, defaultValue) {
	try {
	//console.log(XBridge.storage_area);
	var value = XBridge.storage_area[name];
	//console.log("trying to get \"" + name + "\": value is: \"" + value + "\"");
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
	}catch(e) {
		console.log("GM_getValue error: " + e.message);
	}
}

function GM_deleteValue(name, no_save) {
	console.log("Deleting " + name);
	delete XBridge.storage_area[name];
	if (no_save !== true) {
		safari.self.tab.dispatchMessage("save_storage", XBridge.storage_area);
	}
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
	for (var i = 0, il = XBridge.storage_area.length; i < il; i++) {
			// only use the script's own keys
			try {
				var key = XBridge.storage_area.key(i);
				if (key.match(reKey)) {
					list.push(key);
				}
			} catch(e) {
				console.log("XKit Bridge: " + e.message);
			}
	}
	return list;
}

function GM_setValue(name, value) {
	value = (typeof value)[0] + value;
	XBridge.storage_area[name] = value;
	safari.self.tab.dispatchMessage("save_storage", XBridge.storage_area);
}