With XKit Packs, you can publish your extensions without getting them added to the XKit Extension Gallery or inspected by The XKit Guy.

### Advantages
1. No waiting for XKit Guy to inspect/add your extension.
2. No asking users to use XKit Editor.
3. Extensions are stored on XKit servers, and updated when you update them.

### Disadvantages
1. Your extension will not be listed on XKit Extension Gallery, you have to promote them yourself.
2. Your extension can't have several blacklisted words, including eval, document and script, even on comments.
3. Huge, scary warning message when installing XKit Packs.

## Quick Start
1. Go to [XCloud WebAccess](http://xkit.info/xcloud/webaccess/) page.
2. Click on Create XKit Pack.
3. Open [the XKit Editor](http://www.tumblr.com/xkit_editor)
4. Create a new extension (see below for naming your extension, it's important!)
5. After you are done writing your extension, go back to XCloud WebAccess page.
6. Click on My Packs
7. Select your pack, and paste your Script and CSS code, and include a 64x64/PNG icon.
8. Share the link to get users.

## Very Important: Extension Name
Your extension name **must** match the ID you gave to your pack, and you **must** prepend your XCloud ID to it while creating the extension using XKit Editor.  

For example, if your XCloud ID is **mrkittens** and you've ID'd your pack with **textextension**, the filename of the extension on XKit Editor **must** be **mrkittens_testextension**.  

Failure to name your extension with the format above will cause your extension to fail on run.


## Do's and Do Not Do's of XKit Packs

### Do
* Do write extensions that is useful to users, and provide a good experience.
* Do write good descriptions that assist the user on using the extension.
* Do pick a nice icon for your extension.
* Do be nice to your users and take their feedback seriously.

### Don't
* Don't write malicious code: that includes, but not limited to, displaying ads, posting stuff without user permission, trying to gain control of the user's account, modify/break other extensions. If you're found to write malicious code, your XCloud account will be terminated.
* Don't make excessive calls to Tumblr or XKit servers. Try to limit the calls, and store the data you receive using XKit store.
* Don't use HTML5 APIs if there is an XKit equivalent for it. (ie: don't use localStorage, but do use XKit.storage)
* Don't modify standard XKit objects.
* Don't write extensions that are simply links/ads to a website/service.
* Don't write "shock" extensions.
* Don't write extensions that modify XKit user interface.
* Don't write extensions that disable/enable/download extensions.
* Don't write extensions that might be used to harass users, such as a follower checker or "anon tracker".
* Don't write "follower train" extensions. Don't write extensions that follow/unfollow blogs.
* Don't write extensions that allow the user the change the source of a post.
* Don't write extensions that might get you, me, or the user in legal trouble.
* In short, don't do anything that might be considered "evil" or "jerk"-ish. Be nice.

**Please keep in mind that XKit Packs have a server-side kill switch that disables your extensions. Failure to follow the instructions above will result in your extension getting removed from XCloud and all the user's devices, and your XCloud account terminated, without prior notice.**