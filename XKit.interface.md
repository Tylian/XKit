"Interface" returns information about stuff going on on the dashboard.

In the past, each XKit extension used jQuery selectors to get information about objects such as a post. When Tumblr changes something, this renders all the extensions useless. By centralizing these calls, we can just change the Interface object, and the other extensions can work without modification.

## Usage

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