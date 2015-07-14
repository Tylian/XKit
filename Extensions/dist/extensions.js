/* jshint esnext: true */

var fs = require('fs');

const extensionPath = process.argv[2] || '..';
const distributionPath = process.argv[3] || '.';

processExtensions();

function processExtensions() {
  var extensionFiles = fs.readdirSync(extensionPath);
  var extensions = [];

  extensionFiles.forEach(function(fileName) {
    // Look only for files for the form [a-z_]+.js, which exclues icon and css
    // files
    var fileNameParts = fileName.split('.');
    if (fileNameParts.length !== 2) {
      return;
    }
    var fileType = fileNameParts[1];
    if (fileType !== 'js') {
      return;
    }
    var extensionId = fileNameParts[0];

    extensions.push(processExtension(extensionId));
  });

  writeGalleryFile(extensions);
  writeListFile(extensions);
}

function readExtensionFile(path) {
  return fs.readFileSync(extensionPath + '/' + path, {
    encoding: 'utf8'
  });
}

function writeDistributionFile(path, contents) {
  fs.writeFileSync(distributionPath + '/' + path, contents);
}

function writePageFile(path, content) {
  writeDistributionFile('page/' + path, content);
}

function existsExtensionFile(path) {
  return fs.existsSync(extensionPath + '/' + path);
}

function getScriptAttribute(script, attribute) {
  attribute = attribute.toUpperCase();
  // Match the attribute followed by its value wrapped in /*  **/
  var regex = new RegExp('/\\*\\s*' + attribute + '\\s*(.+?)\\s*\\*\\*?/');
  var match = script.match(regex);
  if (!match) {
    console.log('Warning, could not find attribute ' + attribute);
    return null;
  }
  return match[1];
}

function processExtension(extensionId) {
  console.log('BEGIN ' + extensionId);
  // Each extension has the following fields
  // {string}  script - source of the js file
  // {string}  id - file name sans .js
  // {string}  icon - source of the `id`.icon.js file
  // {string}  css - source of the `id`.css file
  // {string}  title - value of the TITLE field in `script`
  // {string}  version - value of the VERSION field in `script`
  // {string}  description - value of the DESCRIPTION field in `script`
  // {string}  details - value of the DETAILS field in `script`
  // {string}  developer - value of the DEVELOPER field in `script`
  // {boolean} frame - value of the FRAME field in `script`
  // {boolean} beta - value of the optional BETA field in `script`
  // {boolean} slow - value of the optional SLOW field in `script`
  var extension = {
    id: extensionId
  };
  extension.script = readExtensionFile(extensionId + '.js');
  if (existsExtensionFile(extensionId + '.icon.js')) {
    extension.icon = readExtensionFile(extensionId + '.icon.js');
  }
  if (existsExtensionFile(extensionId + '.css')) {
    extension.css = readExtensionFile(extensionId + '.css');
  }

  var attributes = ['title', 'description', 'developer', 'version', 'frame',
                    'beta', 'slow', 'details'];
  attributes.forEach(function(attribute) {
    var value = getScriptAttribute(extension.script, attribute);
    if (value !== null) {
      extension[attribute] = value;
    }
  });

  extension.file = 'found';
  extension.server = 'up';
  extension.errors = false;

  ['frame', 'beta', 'slow'].forEach(function(falseDefault) {
    if (!extension.hasOwnProperty(falseDefault)) {
      extension[falseDefault] = 'false';
    }
  });

  writeDistributionFile(extensionId + '.json', JSON.stringify(extension));

  return extension;
}

function writeGalleryFile(extensions) {
  var gallery = {server: 'up', extensions: []};
  extensions.forEach(function(extension) {
    var galleryExtension = {
      name: extension.id,
      title: extension.title,
      version: extension.version,
      description: extension.description
    };
    if (extension.icon) {
      galleryExtension.icon = extension.icon;
    }
    gallery.extensions.push(galleryExtension);
  });

  // The gallery should display in sorted order because otherwise it is
  // bothersome
  gallery.extensions.sort(function(exA, exB) {
    if (exA.title > exB.title) {
      return 1;
    }
    if (exA.title < exB.title) {
      return -1;
    }
    return 0;
  });

  writePageFile('gallery.json', JSON.stringify(gallery));
}

function writeListFile(extensions) {
  var list = {server: 'up', extensions: []};
  extensions.forEach(function(extension) {
    list.extensions.push({
      name: extension.id,
      version: extension.version
    });
  });
  writePageFile('list.json', JSON.stringify(list));
}
