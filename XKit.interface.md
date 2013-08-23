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

### XKit.interface.find_post(post_id)
Wrapper for interface.post. Supply the post ID, and if the post is in the dashboard, a Post Object will be returned. If not, a new object with the error set to true will be returned.

	var m_post = XKit.interface.find_post("30219394");
	if (m_post.error == false) {
		alert(m_post.id + " is the post id.");
	} else {
		alert("Oops.");	
	}

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
	
### XKit.interface.disable_control_button(obj, boolean disabled)
Turns the button into a disabled one, callback won't be called if disabled = true.

### XKit.interface.switch_control_button(obj, boolean working)
Makes the button show the spinning "working" icon, callback won't be called while working = true. Call this when you will be doing stuff like fetching a page, and let them know you are working, and when you don't want the user to click on it twice.
	
## Authorization
### XKit.interface.form_key()
Returns the form key, used to authorize some transactions by Tumblr.

## Post Window Listener
Just like Post Listener, executes functions when the user opens a new post / manual reblogging window. Each function is executed once on each window open.

### XKit.interface.post_window_listener.add(id, function)
Add a new function to execute on each window open. You must specify an ID for the function.

	XKit.interface.post_window_listener.add("quick_tags", XKit.extensions.quick_tags.post_window);

### XKit.interface.post_window_listener.remove(id)
Removes function from the list.

	XKit.interface.post_window_listener.remove("quick_tags");

## Post Window
Lets you manipulate or get information from Manual Reblogging / New Post Window 

### XKit.interface.post_window.state()
Returns an object, with the following:
* **publish**: true / false
* **draft**: true / false
* **queue**: true / false
* **private**: true / false
     
		var m_post_state = XKit.interface.post_window.state();
		if (m_post_state.queue === true) {
			alert("So you are gonna queue this eh?");	
		}

### XKit.interface.post_window.add_tag(tag) 
Tag can be an array or a string. Appends it to the tags list on the window.

	XKit.interface.post_window.add_tag("Hello!"); // will add #Hello! to the post.

### XKit.interface.post_window.tag_exists(tag)
Returns true if the tag (string) exists

### XKit.interface.post_window.remove_tag(tag) 
Removes specified tag (string) from the post

### XKit.interface.post_window.blog()
Returns the URL of the blog the post is going to get posted to.

	if (XKit.interface.post_window.blog() === "xenix") {
		alert("Yay, you are posting on my blog.. somehow?");
	}	 

### XKit.interface.post_window.open()
Returns true if the post window is still open.

### XKit.interface.post_window.switch_blog(url)
Changes blog to specified username. Returns true on success.

	XKit.interface.post_window.switch_blog("xkit-extension");
	
### XKit.interface.post_window.type()
Returns an object containing post type information:

	var post_type = XKit.interface.post_window.type();
	if (post_type.audio === true) {
		alert("Yay for audio!");	
	}
	
Object has the following properties: text, photo, quote, link, chat, video, audio.

### XKit.interface.post_window.origin()
Returns an object that allows you to check if the user is creating a new post or reblogging one.

	var origin = XKit.interface.post_window.origin();
	if (origin.is_reblog === true) {
		alert("Yay for reblogging!");	
	}	
	if (origin.is_original === true) {
		alert("Yay for creating new stuff!");	
	}	

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

## Fetching and Submitting
### XKit.interface.fetch(post_object, callback, reblog_mode)
Makes a request to the Tumblr server to return their post object. post_object must be the result you get from XKit.interface.post or XKit.interface.find_post. When it's done, the callback will be called, with the data or status information. reblog_mode **must be set to true** for posts not owned by the user.

	var m_post = XKit.interface.find_post("498392831");
	if (m_post.error == false) {
	
		XKit.interface.fetch(m_post, function(my_data) {
			if (data.error === true) {
				// Could not fetch anything!
				alert("Error: " + my_data.message + "\n" + my_data.status);	
			} else {
				alert("Post tags are: " + my_data.data.post.tags);
			}
		}, false);
		
	}

## Other
### XKit.interface.revision
Returns an integer with the Interface version.

	if (XKit.interface.revision <= 2) {
		alert("I need XKit Interface 3 or above.");
	}