/* jshint esnext: true */

var fs = require('fs');

/**
 * Build the extensions in `extensionPath`, writing the distribution json files
 * into `distributionPath`.
 * @param {String} extensionPath
 * @param {String} distributionPath
 * @exported
 */
function build(extensionPath, distributionPath) {
	var builder = new ExtensionBuilder(extensionPath, distributionPath);
	builder.processExtensions();
}
exports.build = build;

/**
 * @constructor
 * @param {String} extensionPath - Path from which to read extension files
 * @param {String} distributionPath - Path in whichw to write extension distribution files
 */
function ExtensionBuilder(extensionPath, distributionPath) {
	this.extensionPath = extensionPath;
	this.distributionPath = distributionPath;
}

/**
 * Process all extensions found in `extensionPath`
 */
ExtensionBuilder.prototype.processExtensions = function() {
	var extensionFiles = fs.readdirSync(this.extensionPath);
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

		extensions.push(this.processExtension(extensionId));
	}.bind(this));

	this.writeGalleryFile(extensions);
	this.writeListFile(extensions);
};

/**
 * Read a file in the extensions directory
 * @param {String} path - Relative path of file in directory
 * @return {String} content in file
 */
ExtensionBuilder.prototype.readExtensionFile = function(path) {
	return fs.readFileSync(this.extensionPath + '/' + path, {
		encoding: 'utf8'
	});
};

/**
 * Write a file in the distribution directory
 * @param {String} path - Relative path of file in directory
 * @param {String} content - content in file
 */
ExtensionBuilder.prototype.writeDistributionFile = function(path, content) {
	fs.writeFileSync(this.distributionPath + '/' + path, content);
};

/**
 * Write a file in the page directory, a child of the distribution directory
 * @param {String} path - Relative path of file in directory
 * @param {String} content - content in file
 */
ExtensionBuilder.prototype.writePageFile = function(path, content) {
	this.writeDistributionFile('page/' + path, content);
};

/**
 * @param {String} path - Relative path of extension file in directory
 * @return {Boolean} Whether the extension file exists
 */
ExtensionBuilder.prototype.existsExtensionFile = function(path) {
	return fs.existsSync(this.extensionPath + '/' + path);
};

/**
 * @param {String} script - contents of extension main script file (extension_id.js)
 * @param {String} attribute - attribute to attempt to read from the script
 * @return {String?} value of attribute
 */
function getScriptAttribute(script, attribute) {
	attribute = attribute.toUpperCase();
	// Match the attribute followed by its value wrapped in /*	**/
	var regex = new RegExp('/\\*\\s*' + attribute + '\\s*(.+?)\\s*\\*\\*?/');
	var match = script.match(regex);
	if (!match) {
		return null;
	}
	return match[1];
}

/**
 * Process a single extension
 * @param {String} extensionId - ID of the extension (`extension_id.js`)
 */
ExtensionBuilder.prototype.processExtension = function(extensionId) {
	// Each extension has the following fields
	// {string} script - source of the js file
	// {string} id - file name sans .js
	// {string} icon - source of the `id`.icon.js file
	// {string} css - source of the `id`.css file
	// {string} title - value of the TITLE field in `script`
	// {string} version - value of the VERSION field in `script`
	// {string} description - value of the DESCRIPTION field in `script`
	// {string} details - value of the DETAILS field in `script`
	// {string} developer - value of the DEVELOPER field in `script`
	// {boolean} frame - value of the FRAME field in `script`
	// {boolean} beta - value of the optional BETA field in `script`
	// {boolean} slow - value of the optional SLOW field in `script`
	var extension = {
		id: extensionId
	};
	extension.script = this.readExtensionFile(extensionId + '.js');
	if (this.existsExtensionFile(extensionId + '.icon.js')) {
		extension.icon = this.readExtensionFile(extensionId + '.icon.js');
	}
	if (this.existsExtensionFile(extensionId + '.css')) {
		extension.css = this.readExtensionFile(extensionId + '.css');
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

	this.writeDistributionFile(extensionId + '.json', JSON.stringify(extension));

	return extension;
};

/**
 * Generate and write the gallery.json file
 * @param {Array<Object>} extensions - Extensions to include in the gallery
 */
ExtensionBuilder.prototype.writeGalleryFile = function(extensions) {
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

	// WIP: Print out a gallery for embedding purposes
	// gallery.extensions.forEach(function(item) {
	//   console.log('<h2>' + item.title + ' v' + item.version + '</h2>');
	//   console.log('<small>' + item.description + '</small>');
	//   console.log('<h3>Known Issues</h3>');
	// });
	this.writePageFile('gallery.json', JSON.stringify(gallery));
};

/**
 * Generate and write the list.json file
 * @param {Array<Object>} extensions - Extensions to include in the list
 */
ExtensionBuilder.prototype.writeListFile = function(extensions) {
	var list = {server: 'up', extensions: []};
	extensions.forEach(function(extension) {
		list.extensions.push({
			name: extension.id,
			version: extension.version
		});
	});
	this.writePageFile('list.json', JSON.stringify(list));
};
