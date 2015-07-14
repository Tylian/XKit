var extensions = listDir();

function processExtension(extensionId) {
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
  extension.script = readFile(extensionId + '.js');
  if (existsFile(extensionId + '.icon.js')) {
    extension.icon = readFile(extensionId + '.icon.js');
  }
  if (existsFile(extensionId + '.css')) {
    extension.css = readFile(extensionId + '.css');
  }

  var attributes = ['title', 'description', 'developer', 'version', 'frame',
                    'beta', 'slow', 'details'];
  attributes.forEach(function(attribute) {
    extension[attribute] = getScriptAttribute(extension.script, attribute);
  });

  writeFile(extensionId + '.json', JSON.stringify(extension));
}
