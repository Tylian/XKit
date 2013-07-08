Called "Legacy" only because they've been use since XKit 0.4.x days, Legacy Headers are parsed by XKit servers and XKit itself to give the user information about the extension. They are required for all extensions (at least some of them are.)

### TITLE (required)
User-readable, fancy name for the extension.

### VERSION (required)
The versioning scheme is [major].[minor] REV [revision]  
eg: `1.0 REV A`

### DESCRIPTION (required)
A really short description of your extension

### DEVELOPER (required)
Your Github username  
eg: `atesh`

### DETAILS (optional)
A long description for your extension. Do not use slashes here.  
Simple formatting HTML is allowed.    
eg: `//* DETAILS This is my extension<br>Enjoy it. **//`

### FRAME (required)
Either `true` or `false`. If set to "true", your extension will only run on the Tumblr IFRAME on peoples blogs.

### SLOW (required)
Either `true` or `false`. Set to "true" if your extension manipulates DOM extensively.

### BETA (optional)
Not in use right now. Set to true anyways if it's in early beta/alpha.

## Example
	//* TITLE Tweaks **//  
	//* VERSION 2.0 REV A **//  
	//* DESCRIPTION Various little tweaks for your dashboard. **//  
	//* DEVELOPER STUDIOXENIX **//  
	//* DETAILS These are small little tweaks .... your computer. **//
	//* FRAME false **//
	//* SLOW true **//
	//* BETA false **//