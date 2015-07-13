/* jshint moz: true */
let self = require('sdk/self');
let pageMod = require('sdk/page-mod');
let prefs = require('sdk/preferences/service');

let scripts = [
  'bridge.js',
  'xkit/jquery.js',
  'xkit/moment.js',
  'xkit/nano.js',
  'xkit/tiptip.js',
  'xkit/xkit.js',
  'xkit/editor.js',
  'storage.js',
  'bootstrap.js'
].map(function(url) {
  return self.data.url(url);
});

pageMod.PageMod({
  include: '*.tumblr.com',
  contentScriptFile: scripts,
  contentStyleFile: self.data.url('xkit/xkit.css'),
  onAttach: onAttach
});

let prefRoot = 'extensions.xkit7.';


function onAttach(worker) {
  let port = worker.port;
  port.on('set', function(data) {
    console.log('set(' + data.name + ', ' + data.value + ')');
    prefs.set(prefRoot + data.name, data.value);
  });
  port.on('reset', function(data) {
    console.log('reset(' + data.name + ')');
    prefs.reset(prefRoot + data.name);
  });

  port.on('reset_all', function(data) {
    console.log('reset_all()');
    let existingKeys = prefs.keys(prefRoot);
    for (let name of existingKeys) {
      prefs.reset(name);
    }
  });

  // Get all and broadcast set
  let existingKeys = prefs.keys(prefRoot);
  for (let properName of existingKeys) {
    let name = properName.substring(prefRoot.length);
    let value = prefs.get(properName, null);

    port.emit('set', {
      name: name,
      value: value
    });
  }
  // God forgive me for this is a sin
  port.emit('loading_complete', {});
}
