(function(){

if (typeof XBridge !== "undefined") { return; }

XBridge = {
	version: "1.0.1",
	framework_version: "",
	console: {
		cservice: "",
		log: function(text) {
			XBridge.console.cservice.logStringMessage(text);
		}
	},
	to_load: ["jquery.js", "moment.js", "nano.js", "tiptip.js", "xkit.js", "editor.js"],
	tmp_loaded: "",
	tmp_loaded_css: "",
	display_error: function(e) {
		//alert("XKit Bridge Error:\n" + e.message);
		XBridge.console.log(e.message);
	},
	init: function() {
		try {
			XBridge.console.cservice = Components.classes["@mozilla.org/consoleservice;1"].getService(Components.interfaces.nsIConsoleService);
			XBridge.console.log("XBridge for Firefox version " + XBridge.version);
			Components.utils.import("resource://gre/modules/AddonManager.jsm");
			AddonManager.getAddonByID("xkit@studioxenix.com", function(addon) {
				XBridge.framework_version = addon.version;
			});
			XBridge.storage.init();
			window.addEventListener('load', XBridge.events.load, false);
			window.addEventListener('unload', XBridge.events.unload, false);
		} catch(e) {
			XBridge.display_error(e);
		}
	},
	destroy: function() {
		window.removeEventListener('unload', XBridge.events.unload, false);
		var appcontent=window.document.getElementById("appcontent");
		appcontent.removeEventListener("DOMContentLoaded", XBridge.events.window, false);
		XBridge = null;
	},
	check: function(url) {
		var scheme=Components.classes["@mozilla.org/network/io-service;1"]
			.getService(Components.interfaces.nsIIOService)
			.extractScheme(url);
		return (
			(scheme == "http" || scheme == "https" || scheme == "file") &&
			!/hiddenWindow\.html$/.test(url)
		);
	},
	events: {
		load: function() {
			// Browser start event.
			// Remove listener, no longer required, apparently.
			window.removeEventListener('load', XBridge.events.load, false);
			var appcontent=window.document.getElementById("appcontent");
			if (appcontent && !appcontent.xkit_bridge) {
				appcontent.xkit_bridge=true;
				appcontent.addEventListener("DOMContentLoaded", XBridge.events.window, false);
			}
		},
		unload: function() {
			// Browser shutdown event
			window.removeEventListener('load', XBridge.events.load, false);
			window.removeEventListener('unload', XBridge.events.unload, false);
			//window.document.getElementById("appcontent").removeEventListener("DOMContentLoaded", XBridge.events.window, false);
			XBridge.run(e);
		},
		window: function(e) {
			// New window event
			try {
				var unsafeWin=e.target.defaultView;
				if (unsafeWin.wrappedJSObject) unsafeWin=unsafeWin.wrappedJSObject;
				var unsafeLoc=new XPCNativeWrapper(unsafeWin, "location").location;
				var href=new XPCNativeWrapper(unsafeLoc, "href").href;
				try {
					if (XBridge.check(href) && (/^http:\/\/www\.tumblr\.com\/.*$/.test(href) || /^https:\/\/www\.tumblr\.com\/.*$/.test(href))) {
						// if (!( /^http:\/\/www\.tumblr\.com\/upload\/image.*$/.test(href)) {
							XBridge.run(e);
						// }
					}
				} catch(e) {
					alert(e.message);
				}
			} catch(e) {
				XBridge.console.log("Error on XBridge, window event: " + e.message);
			}
		}
	},
	retrieve: function(aUrl) {

		// Based on Userscript Compiler tool.

		var	ioService=Components.classes["@mozilla.org/network/io-service;1"]
			.getService(Components.interfaces.nsIIOService);
		var	scriptableStream=Components
			.classes["@mozilla.org/scriptableinputstream;1"]
			.getService(Components.interfaces.nsIScriptableInputStream);
		var unicodeConverter=Components
			.classes["@mozilla.org/intl/scriptableunicodeconverter"]
			.createInstance(Components.interfaces.nsIScriptableUnicodeConverter);
		unicodeConverter.charset="UTF-8";

		var	channel=ioService.newChannel(aUrl, "UTF-8", null);
		var	input=channel.open();
		scriptableStream.init(input);
		var	str=scriptableStream.read(input.available());
		scriptableStream.close();
		input.close();

		try {
			return unicodeConverter.ConvertToUnicode(str);
		} catch (e) {
			return str;
		}

	},
	storage: {
		prefs: "",
		prefs_service: "",
		max_size: 5 * 1024 * 1024,
		init: function() {
			XBridge.prefs_service = Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefService);
			XBridge.prefs = XBridge.prefs_service.getBranch("extensions.xkit7.");
		},
		get_used: function() {
			var children = XBridge.prefs.getChildList("", {});
			var m_size = 0;
			for (var i=0;i<children.length;i++) {
				m_size = m_size + XBridge.storage.get(children[i], "").length;
			}
			//alert(m_size);
			return m_size;
		},
		set: function(name, value) {
			// This fucking sucks ass.
			// If you are reading this and come up
			// with something better, let me know please.
			XBridge.prefs.setCharPref(name, value);
		},
		get: function(name, default_value) {
			try {
				var value = XBridge.prefs.getCharPref(name);
				if (typeof value !== "undefined") {
					return value;
				} else {
					return default_value;
				}
			} catch(e) {
				return default_value;
			}
		},
		delete_all: function(callback) {
			XBridge.prefs.deleteBranch("");
			callback();
		},
		delete: function(name) {
			XBridge.prefs.clearUserPref(name);
		}
	},
	errors: {
		get: function() {
			var m_object = new Object();
			m_object.errors = false;
			return m_object;
		}
	},
	objects: {
		httpRequester: function(window, unsafeWindow) {
			this.window = window;
			this.unsafeWindow = unsafeWindow;
		}
	},
	sandbox: "",
	run: function(evt) {
		if (!evt.originalTarget instanceof HTMLDocument) {
			return;
		}

		var view = evt.originalTarget.defaultView;
		if (!view) {
			return;
		}

		var sandbox = new Components.utils.Sandbox(view, { sandboxPrototype: view, wantXrays: true, wantExportHelpers: true });
		XBridge.sandbox = sandbox;
		sandbox.unsafeWindow = view.window.wrappedJSObject;
		sandbox.window = view.window;
		sandbox.document = sandbox.window.document;
		sandbox.__proto__ = sandbox.window;

		var http_requester = new XBridge.objects.httpRequester(window, sandbox.unsafeWindow);

		sandbox.framework_version = XBridge.framework_version;
		sandbox.getBridgeError = XBridge.errors.get;
		sandbox.bridge_version = XBridge.version;
		sandbox.storage_used = XBridge.storage.get_used();
		sandbox.storage_max = -1;
		sandbox.GM_xmlhttpRequest = http_requester.request;
		sandbox.GM_setValue = XBridge.storage.set;
		sandbox.GM_getValue = XBridge.storage.get;
		sandbox.GM_deleteValue = XBridge.storage.delete;
		sandbox.GM_deleteAllValues = XBridge.storage.delete_all;

		sandbox.window.GM_xmlhttpRequest = sandbox.GM_xmlhttpRequest;

		for (var i=0;i<XBridge.to_load.length;i++) {
			var m_script = XBridge.retrieve('chrome://xkit/content/' + XBridge.to_load[i]);
			Components.utils.evalInSandbox(m_script, sandbox, "1.8", "resource://xkit/" + XBridge.to_load[i]);
		}

		var fileref = sandbox.document.createElement("link");
		fileref.setAttribute("rel", "stylesheet");
		fileref.setAttribute("type", "text/css");
		fileref.setAttribute("href", "resource://xkit/resources/xkit.css");
		sandbox.document.getElementsByTagName("head")[0].appendChild(fileref);

		Components.utils.evalInSandbox("XKit.init();", sandbox);

		return;

		setTimeout(function() {

		try {

			if (typeof sandbox.XKit === "undefined" || typeof sandbox.$ === "undefined") {
				setTimeout(function() {
					if (typeof sandbox.XKit === "undefined" || typeof sandbox.$ === "undefined") {
						sandbox.XKit.init();
					} else {
						// Give up here?
					}
				}, 1500);
			} else {
				sandbox.XKit.init();
			}

		} catch(e) {
			XBridge.display_error(e);
		}

		}, 200);

	}
};

	XBridge.init();

}());

XBridge.objects.httpRequester.prototype.request = function(settings) {

	try {

	var request = new this.window.XMLHttpRequest();
	request.mwindow = this.window;

	var msettings = settings.wrappedJSObject;

	console.log("[XBHTTPREQUEST] Request for " + settings['url'] + " from CS to XBridge");

	if (settings['method'] === "POST") {
		request.open('POST', settings['url'], true);
	} else {
		request.open('GET', settings['url'], true);
	}

	console.log("[XBHTTPREQUEST] Opened request.");

	if (typeof msettings == "undefined") {
		msettings = settings;
	}

	request.onreadystatechange = function (oEvent) {
	  if (request.readyState === 4) {
	    if (request.status === 200) {
	    console.log(msettings);
	    console.log(msettings.onload);
		if (typeof msettings.onload != "undefined") {

				console.log("[XBHTTPREQUEST] Completed successfully.");
			    // Since Firefox is a bitch, we have to create our own
	    		// fake XMLHttpRequest object.

	    		try {

	    			//var fake_request = request;
	    			//fake_request.__exposedProps__: { responseText: "r", status: "r" };
	    			var m_XMLHttpRequest = { real_request: request, responseText : request.responseText, status: 200, __exposedProps__ : { getResponseHeader: "r", responseText: "r", status: "r" } };
	      			m_XMLHttpRequest.getResponseHeader = function(requested_header) {
	      				return this.real_request.getResponseHeader(requested_header);
	      			};
	      			msettings['onload'](m_XMLHttpRequest, m_XMLHttpRequest, m_XMLHttpRequest);

	      		} catch(e) {
	      				var m_XMLHttpRequest = { real_request: request, responseText : request.responseText, status: 200, __exposedProps__ : { getResponseHeader: "r", responseText: "r", status: "r" } };
	      				msettings['onload'](m_XMLHttpRequest, m_XMLHttpRequest, m_XMLHttpRequest);
	      				XBridge.console.log(" -- XML Request error 13:" + e.message);
	      		}
		} else {
			console.log("[XBHTTPREQUEST] Completed but can't call the function back.");
		}
	    } else {
		if (typeof msettings['onerror'] != "undefined") {

	    		console.log("[XBHTTPREQUEST] Error.");
	    		try {

	    			var m_XMLHttpRequest = { real_request: request, responseText : request.responseText, status: request.status, __exposedProps__ : { getResponseHeader: "r", responseText: "r", status: "r" } };
	      			m_XMLHttpRequest.getResponseHeader = function(requested_header) {
	      				return this.real_request.getResponseHeader(requested_header);
	      			};
	      			msettings['onerror'].call(m_XMLHttpRequest, m_XMLHttpRequest, m_XMLHttpRequest);

	      		} catch(e) {
	      				XBridge.console.log(" -- XML Request error 12:" + e.message);
	      		}
		} else {
			console.log("[XBHTTPREQUEST] Error but can't call the function back.");
		}
	    }
	  }
	};

	if (typeof settings['headers'] !== "undefined") {
		for (var obj in settings['headers']) {
			request.setRequestHeader(obj, settings['headers'][obj]);
		}
	}

	console.log("[XBHTTPREQUEST] Sending data.");

	if (settings['method'] === "POST") {
		if (settings['json'] === true) {
			request.setRequestHeader('Content-Type', "application/json");
			XBridge.console.log(" -- Bridge requesting post with json mode on");
		} else {
			request.setRequestHeader('Content-Type', "application/x-www-form-urlencoded");
			XBridge.console.log(" -- Bridge requesting post with json mode off");
		}
		request.send(settings['data']);
	} else {
		request.send(null);
	}

	} catch(e) {
		XBridge.console.log(" -- XML Request error 11:" + e.message);
		XBridge.console.log("Bridge can not make request: " + e.message);
	}

}