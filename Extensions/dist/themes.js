/* jshint esnext: true */

var fs = require('fs');
var path = require('path');

/**
 * Build the themes in `themePath`, writing the distribution json file
 * into `distributionPath`.
 * @param {String} themePath
 * @param {String} distributionPath
 * @exported
 */
function build(themePath, distributionPath) {
	var builder = new ThemeBuilder(themePath, distributionPath);
	builder.processThemes();
}
exports.build = build;

/**
 * @constructor
 * @param {String} themePath - Path from which to read theme files
 * @param {String} distributionPath - Path in which to write theme file
 */
function ThemeBuilder(themePath, distributionPath) {
	this.themePath = themePath;
	this.distributionPath = distributionPath;
}

/**
 * Process all themes found in `themePath`
 */
ThemeBuilder.prototype.processThemes = function() {
	var themeFiles = fs.readdirSync(this.themePath);
	var themes = [];

	themeFiles.forEach(function(fileName) {
		// Look only for css files
		var fileNameParts = fileName.split('.');
		if (fileNameParts.length !== 2) {
			return;
		}
		var fileType = fileNameParts[1];
		if (fileType !== 'css') {
			return;
		}
		var themeId = fileNameParts[0];

		themes.push(this.processTheme(themeId));
	}.bind(this));

	this.writeThemesFile(themes);
};

/**
 * Read a file in the themes directory
 * @param {String} path - Relative path of file in directory
 * @return {String} content in file
 */
ThemeBuilder.prototype.readThemeFile = function(relPath) {
	return fs.readFileSync(path.join(this.themePath, relPath), {
		encoding: 'utf8'
	});
};

/**
 * Write a file in the distribution directory
 * @param {String} relPath - Relative path of file in directory
 * @param {String} content - content in file
 */
ThemeBuilder.prototype.writeDistributionFile = function(relPath, content) {
	fs.writeFileSync(path.join(this.distributionPath, relPath), content);
};

/**
 * Write a file in the page directory, a child of the distribution directory
 * @param {String} relPath - Relative path of file in directory
 * @param {String} content - content in file
 */
ThemeBuilder.prototype.writePageFile = function(relPath, content) {
	this.writeDistributionFile(path.join('page', relPath), content);
};

/**
 * @param {String} content - contents of theme file
 * @param {String} attribute - attribute to attempt to read from the script
 * @return {String?} value of attribute
 */
function getAttribute(content, attribute) {
	attribute = attribute.toUpperCase();
	// Match the attribute followed by its value wrapped in /*	**/
	var regex = new RegExp('/\\*\\s*' + attribute + '\\s*(.+?)\\s*\\*\\*?/');
	var match = content.match(regex);
	if (!match) {
		return null;
	}
	return match[1];
}

/**
 * Process a single theme
 * @param {String} themeId - ID of the theme
 */
ThemeBuilder.prototype.processTheme = function(themeId) {
	// Each theme has the following fields
	// {string} title - value of the TITLE field in `script`
	// {string} version - value of the VERSION field in `script`
	// {string} description - value of the DESCRIPTION field in `script`
	// {string} developer - value of the DEVELOPER field in `script`
	var theme = {
		file: themeId + '.css'
	};
	theme.contents = this.readThemeFile(theme.file);

	var attributes = ['name', 'version', 'description', 'developer'];
	attributes.forEach(function(attribute) {
		var value = getAttribute(theme.contents, attribute);
		if (value !== null) {
			theme[attribute] = value;
		}
	});

	return theme;
};

/**
 * Generate and write the theme.json file
 * @param {Array<Object>} themes - Themes to include
 */
ThemeBuilder.prototype.writeThemesFile = function(themes) {
	var themeFile = {
		server: 'up',
		themes: themes
	};

	// The themes should display in sorted order because otherwise it is
	// bothersome
	themeFile.themes.sort(function(exA, exB) {
		if (exA.title > exB.title) {
			return 1;
		}
		if (exA.title < exB.title) {
			return -1;
		}
		return 0;
	});

	this.writePageFile('themes.json', JSON.stringify(themeFile));
};
