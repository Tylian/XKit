/*

	Bridge2 for XKit
	Version 2.1
	
	(c) 2011 - 2013 STUDIOXENIX
	
*/

var bridge_error = false;
var bridge_error_object;
var xkit_storage = {};

try {
	var storage = chrome.storage.local;
	var storage_loaded = false;
	var framework_version = getVersion();
	var storage_used = -1;
	var storage_max = -1;
	init_bridge();
} catch(e) {
	console.log("[XKIT] Caught bridge error: " + e.message);
	bridge_error_object = e;
	bridge_error = true;
	try { 
		call_xkit();
	} catch(em) {
		alert("Fatal XKit Error:\n" + em.message + "\n\nPlease go to xkit-extension.tumblr.com for support.");
		console.log("[XKIT] Caught bridge error: " + em.message);
	}
}

function getBridgeError() {
	var m_object = new Object();
	m_object.errors = bridge_error;
	m_object.error = bridge_error_object;
	return m_object;
}

function getVersion() { 
	var version = 'NaN'; 
	var xhr = new XMLHttpRequest(); 
	xhr.open('GET', chrome.extension.getURL('manifest.json'), false); 
	xhr.send(null); 
	var manifest = JSON.parse(xhr.responseText); 
	return manifest.version; 
} 

function call_xkit() {
	if(typeof XKit !== "undefined") {
		XKit.init();
	} else {
		setTimeout(function() { call_xkit(); }, 1);
	}
}

function init_bridge() {

	console.log("[XKit Bridge] Retrieving storage..");
	
	storage.get(function(items) {
	
		for (key in items) {
			xkit_storage[key] = items[key];
		}	
		storage_loaded = true;
		console.log("[XKit Bridge] Storage loaded, calling XKit.. bye!");
		call_xkit();
		
	});
	storage.getBytesInUse(function(bytes) {
		storage_used = bytes;
		storage_max = storage.QUOTA_BYTES;
	});
}

function GM_deleteAllValues(callback) {

	storage.get(function(items) {
  		for (key in items) {
			storage.remove(key);
  		}	
  		storage.clear();
  		callback();
	});

}

function GM_getValue(name, defaultValue) {

	//console.log("Bridge : GM_getValue for " + name);
	var value = xkit_storage[name];
	if (!value) {
		// console.log("   --- Returning default value.");
		return defaultValue;
	} else {
		// console.log("   --- Returning " + value.substring(0,60) + "...");
		return value;
	}

}

function GM_deleteValue(name) {

	//console.log("Bridge : GM_deleteValue for " + name);
	storage.remove(name);

}

function GM_setValue(name, value) {

	var m_object = new Object();
	var m_name = name;
	m_object[ m_name ] = value;
	xkit_storage[name] = value;
	storage.set(m_object);	
	return true;

}
 
function GM_log(message) {
    
    console.log(message);

}

function GM_openInTab(url) {
    
    return window.open(url, "_blank");
    
}

function GM_listValues() {

	// // console.log("Bridge : GM_listValues");
	try {
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
	} catch(e) {
		return "";
	}

}

function GM_xmlhttpRequest(settings) {

	try {
	
	var request = new XMLHttpRequest();

	if (settings['method'] === "POST") {
		request.open('POST', settings['url'], true);
	} else {
		request.open('GET', settings['url'], true);
	}

	request.onreadystatechange = function (oEvent) {  
	  if (request.readyState === 4) {  
	    if (request.status === 200) {  
		if (typeof settings['onload'] !== "undefined") {
	      		settings['onload'].call(request, request);
		}
	    } else {  
		if (typeof settings['onerror'] !== "undefined") {
	      		settings['onerror'].call(request, request);
		}
	    }  
	  }  
	};  

	if (settings['method'] === "POST") {
		if (settings['json'] === true) {
			request.setRequestHeader('Content-Type', "application/json");
			console.log(" -- Bridge requesting post with json mode on");
		} else {
			request.setRequestHeader('Content-Type', "application/x-www-form-urlencoded");
			console.log(" -- Bridge requesting post with json mode off");
		}
		request.send(settings['data']);
	} else {
		request.send(null);
	}

	} catch(e) {
		console.log("Bridge can not make request: " + e.message);
	}

}