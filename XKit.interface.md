![Interface Logo](http://xkit.info/interface_logo_small.png)   

## Introduction
"Interface" returns information about stuff going on on the dashboard.

In the past, each XKit extension used jQuery selectors to get information about objects such as a post. When Tumblr changes something, this renders all the extensions useless. By centralizing these calls, we can just change the Interface object, and the other extensions can work without modification.

## Getting Posts

### XKit.interface.get_posts(string without_tag, boolean mine)
If without_tag is empty, all posts are returned. If it's not, posts NOT containing that tag will be returned (use this to add a tag to the posts you've already processed.) If mine is true, user's own posts will be returned. Returns an array of all posts found.

	var posts = XKit.interface.get_posts("quick-tags-not-done", true);
	$(posts).each(function() {  
	     // Do something here.  
	     $(this).css("background","red");	
	});
 
### XKit.interface.post(post)
Returns information about post on the dashboard. Takes one parameter, post object (ie: $(this))
Returns the following:

* **id**: Post ID (ie: 56977682463)
* **root_id**: Post Root ID
* **reblog_key**: Post Reblog key
* **owner**: Post owner URL (ie: xenix)
* **type**: Post Type. Can be one of the following:   
   * photo  
   * photoset  
   * quote
   * link
   * conversation
   * audio
   * video
   * note
* **tags**: Tags on the post, separated by commas.
* **liked**: True if the user liked this post.
* **permalink**: Permalink of the post (undefined in some cases)
* **is_reblogged**: True if this is a reblogged post
* **is_mine**: True if the post is user's
* **is_following**: True if the user is following the owner of this post.
* **avatar**: URL of the avatar image

For example:

	var posts = XKit.interface.get_posts("quick-tags-not-done", true);
	$(posts).each(function() {  
		// Do something here.  
		var m_post_object = XKit.interface.post(this);
		if (m_post_object.type === "regular") {
			$(this).css("background","red");	
		}
	});
  
This will get all the posts that is owned by the user, and turns the text posts red.

## Adding buttons

### XKit.interface.create_control_button(class_name, icon, text, func)
Called once to "create" a button. Pick a class_name that is unique, supply a base64-encoded image, and a text for the button and the function to be called when the user clicks on it. You must call this first before adding buttons to posts.

	XKit.interface.create_control_button("xkit-quick-tags", this.button_icon, "Quick Tags!", function() {
			alert("hello world!");
	});
 
### XKit.interface.add_control_button(obj, classname, additional)
Called for each post you want to add the button to. Obj is the post object, additional can be used to add data to the button, and classname is your unique ID.

	var posts = XKit.interface.get_posts("quick-tags-not-done", true);
	$(posts).each(function() {
		XKit.interface.add_control_button(this, "xkit-quick-tags", "");
	});
	
The added button will have the following attributes to make it easier to quickly reach most used properties of a post:
* **data-post-id**: Post ID
* **data-post-type**: Type of the post (see above)
* **data-post-permalink**: Permalink to the post

Data entered to additional field will be printed verbose to the button. Use it to add additional data you might need:

	XKit.interface.add_control_button(this, "xkit-quick-tags", "data-my-data=\"hello\" data-another-data=\"yo!\"");
	
	
## Authorization
### XKit.interface.form_key()
Returns the form key, used to authorize some transactions by Tumblr.

##User Information
### XKit.interface.user()
Returns data about the current blog selected.
* **posts**: Number of posts
* **followers**: Number of followers
* **drafts**: Number of drafts
* **queue**: Number of queued posts

	var m_user = XKit.interface.user();
	alert("You have " + m_user.followers + " followers! Congrats!");

## Page
### XKit.interface.where()
Returns information about which page the user is in.

* **dashboard**: True if user is in dashboard
* **inbox**: True if user is in inbox/messages
* **channel**: True if user is in tumblr.com/blog/[blog]   

		if (XKit.interface.where().dashboard === true) {
			alert("Hooray you are in dashboard now!");	
		}

## Other
### XKit.interface.revision
Returns an integer with the Interface version.

	if (XKit.interface.revision <= 2) {
		alert("I need XKit Interface 3 or above.");
	}