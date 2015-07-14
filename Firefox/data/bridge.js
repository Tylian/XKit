var framework_version = '7.4.4';
var Tumblr = unsafeWindow.Tumblr;

function getBridgeError() {
  return {};
}

function GM_flushStorage(callback) {
  GM_deleteAllValues(callback);
}

function GM_deleteAllValues(callback) {
  AddonStorage.resetAll();
  if (callback) {
    callback();
  }
}

function GM_getValue(name, defaultValue) {
  return '' + AddonStorage.get(name, defaultValue);
}

function GM_deleteValue(name) {
  AddonStorage.reset(name);
}

function GM_setValue(name, value) {
  AddonStorage.set(name, '' + value);
}

function GM_log(message) {
  console.log(message);
}

function GM_openInTab(url) {
  return window.open(url, '_blank');
}

function GM_listValues() {
  return AddonStorage.listKeys();
}

function GM_xmlhttpRequest(settings) {
  function httpsify() {
    settings.url = settings.url.replace('http://', 'https://');
  }

  var request = new XMLHttpRequest();
  var timeout = 1;

  if (settings.url.indexOf('http://') != -1 &&
      settings.url.indexOf('tumblr.com/svc/') != -1) {
    httpsify();
  }

  settings.url = settings.url.replace('http://api.tumblr.com',
                                            'https://api.tumblr.com');

  if (settings.url.indexOf('http://www.tumblr.com/') === 0) {
    console.log(' -- Bridge forwarding to HTTPS! (Dashboard)');
    httpsify();
  }

  setTimeout(function() {
    if (settings.method === 'POST') {
      request.open('POST', settings.url, true);
    } else {
      request.open('GET', settings.url, true);
    }

    request.onreadystatechange = function(oEvent) {
      if (request.readyState === 4) {
        if (request.status === 200) {
          if (typeof settings.onload !== 'undefined') {
              settings.onload.call(request, request);
          }
        } else {
          if (typeof settings.onerror !== 'undefined') {
              settings.onerror.call(request, request);
          }
        }
      }
    };

    if (typeof settings.headers !== 'undefined') {
      for (var obj in settings.headers) {
        request.setRequestHeader(obj, settings.headers[obj]);
      }
    }

    if (settings.method === 'POST') {
      if (settings.json === true) {
        request.setRequestHeader('Content-Type', 'application/json');
        console.log(' -- Bridge requesting post with json mode on');
      } else {
        request.setRequestHeader('Content-Type',
            'application/x-www-form-urlencoded');
        console.log(' -- Bridge requesting post with json mode off');
      }
      request.send(settings.data);
    } else {
      request.send(null);
    }
  }, timeout);
}

// Implement an only-once delivery mechanism for CORS requests
var corsCallbacks = {};

self.port.on('cors-update', function(data) {
  var callback = corsCallbacks[data.requestId];
  if (!callback) {
    return;
  }
  if (data.type === 'load') {
    callback.onload(data.text);
  } else {
    callback.onerror();
  }
  corsCallbacks[data.requestId] = null;
});

function GM_xmlhttpCorsRequest(settings) {
  var requestId = Math.floor(Math.random() * 4294967296);
  self.port.emit('cors-request', {
    method: settings.method,
    url: settings.url,
    requestId: requestId
  });

  corsCallbacks[requestId] = {
    onload: settings.onload,
    onerror: settings.onerror
  };
}
