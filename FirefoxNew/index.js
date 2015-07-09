var self = require('sdk/self');
var pageMod = require('sdk/page-mod');

console.log('Yes, I exist');

var scripts = ['jquery.js', 'moment.js', 'nano.js', 'tiptip.js', 'xkit.js',
               'editor.js', 'bootstrap.js'].map(function(url) {
  return self.data.url(url);
});

pageMod.PageMod({
  include: '*.tumblr.com',
  contentScriptFile: scripts,
  contentStyleFile: self.data.url('xkit.css')
});
