An extension broke and it's time to fix it. Here's how!

## Basic Fixes
1. Open up the [XKit Editor](https://tumblr.com/xkit_editor)
2. Click on "Open Extension" and select the extension you want to change
3. Click "Save Extension" after making changes
4. Refresh any open Tumblr page to see if your changes worked
5. Once your changes are complete, open up your fork of New XKit and find the extension's file in the Extensions directory.
6. Edit this file using Github's editor, duplicating whatever changes you made in XKit's editor.
7. Commit the changes and submit a pull request.
[Github's documentation](https://help.github.com/articles/using-pull-requests/) has more information.

## Creating your own fork
This requires a bit of knowledge of git and pretty in-depth understanding of Github. This is only necessary if you 
want to see local changes to the Extensions directory without going through the XKit Editor.

Edit xkit.js, replacing `hobinjk` with your username in the `github_fetch` function. Run `npm install --dev-dependencies` to get the libraries required to rebuild the addon. Rebuild with the new xkit.js by running `./build.sh all` and reinstall using any of the finished products in the `build` directory.

Now you can edit the extension files in your local Extensions directory. To see your local changes run `create-extensions-dist.sh`.