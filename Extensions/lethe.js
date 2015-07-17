//* TITLE Lethe **//
//* VERSION 1.0 REV A **//
//* DESCRIPTION Forgets posts once they scroll off the screen. **//
//* DEVELOPER hobinjk **//
//* FRAME false **//
//* BETA false **//


/** Export Lethe */
XKit.extensions.lethe = new Lethe();

function Lethe() {
  this.TOP_CUTOFF = -3000;
  this.running = false;
  this.scrollWaiting = false;
  this.preferences = {};
  //   'sep0': {
  //     text: 'Options',
  //     type: 'separator'
  //   },
  // };
  //
  this.handleScroll = this.handleScroll.bind(this);
}

/**
 * Run Lethe
 */
Lethe.prototype.run = function() {
  this.running = true;
  window.addEventListener('scroll', this.handleScroll, false);
};

/**
 * Handle a scroll event, throttling to once every 100ms
 */
Lethe.prototype.handleScroll = function() {
  if (this.scrollWaiting) {
    return;
  }
  this.scrollWaiting = true;
  setTimeout(this.updatePosts.bind(this), 100);
};

/**
 * Update the list of tracked posts, removing ones that are above/outside the
 * viewport and adding ones that are inside or below the viewport.
 */
Lethe.prototype.updatePosts = function() {
  this.scrollWaiting = false;

  var postMedias = document.querySelectorAll('.post_media');
  var i;
  for (i = 0; i < postMedias.length; i++) {
    var postMedia = postMedias[i];
    var rect = postMedia.getBoundingClientRect();

    if (rect.top + rect.height > this.TOP_CUTOFF) {
      // Rect is fully on screen, we want to keep it
      break;
    }
    this.hidePost(postMedia);
  }

  for (i = this.hiddenPosts.length - 1; i > -1; i--) {
    var hiddenMedia = this.hiddenPosts[i];
    if (hiddenMedia.absoluteTop < window.scrollY + this.TOP_CUTOFF) {
      // hiddenMedia is higher than the current viewport
      // all other posts should also be higher
      break;
    }
    this.showPost(hiddenMedia);
  }
};

/**
 * Hide a post, storing it for later
 * @param {DOMElement} post
 */
Lethe.prototype.hidePost = function(post) {
  console.log('Hiding a post');
  var rect = post.getBoundingClientRect();
  var placeholder = document.createElement('div');
  placeholder.classList.add('post_media_hidden');
  placeholder.style.width = rect.width + 'px';
  placeholder.style.height = rect.height + 'px';
  post.parentNode.replaceChild(placeholder, post);

  var absoluteTop = rect.top + this.scrollY;
  if (absoluteTop < this.hiddenPosts[this.hiddenPosts.length - 1].absoluteTop) {
    throw new Error('Lethe post ordering invariant broken');
  }
  this.hiddenPosts.push({
    absoluteTop: absoluteTop,
    html: post.innerHTML,
    parent: post.parentNode
  });
};

/**
 * Show a post, removing it from hidden posts
 * @param {DOMElement} hiddenPost
 */
Lethe.prototype.showPost = function(hiddenPost) {
  console.log('Showing a post');
  // Overly conservative removal logic
  this.hiddenPosts = this.hiddenPosts.filter(function(post) {
    return post !== hiddenPost;
  });
  hiddenPost.parent.innerHTML = hiddenPost.html;
};



/**
 * Destroy Lethe
 */
Lethe.prototype.destroy = function() {
  if (!this.running) {
    return;
  }
  this.running = false;
  window.removeEventListener('scroll', this.handleScroll, false);
};
