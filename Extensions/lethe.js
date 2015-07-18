//* TITLE Lethe **//
//* VERSION 1.0 REV A **//
//* DESCRIPTION Forgets posts once they scroll off the screen. **//
//* DEVELOPER hobinjk **//
//* FRAME false **//
//* BETA true **//


/** Export Lethe */
XKit.extensions.lethe = new Lethe();

function Lethe() {
  this.TOP_CUTOFF = -500;
  this.running = false;
  this.scrollWaiting = false;
  this.hiddenPosts = [];
  this.preferences = {
    'sep0': {
      text: 'Options',
      type: 'separator'
    }
  };

}

/**
 * Run Lethe
 */
Lethe.prototype.run = function() {
  this.running = true;
  this.handleScroll = this.handleScroll.bind(this);
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

  var postMedias = document.querySelectorAll('.post_wrapper');
  var i;
  for (i = 0; i < postMedias.length; i++) {
    var postMedia = postMedias[i];
    if (postMedia.querySelector('.playing')) {
      continue;
    }
    var rect = postMedia.getBoundingClientRect();

    if (rect.bottom > this.TOP_CUTOFF) {
      // Rect is fully on screen, we want to keep it
      break;
    }
    this.hidePost(postMedia);
  }

  for (i = this.hiddenPosts.length - 1; i > -1; i--) {
    var hiddenMedia = this.hiddenPosts[i];
    if (hiddenMedia.absoluteBottom < window.scrollY + this.TOP_CUTOFF) {
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
  var rect = post.getBoundingClientRect();
  var placeholder = document.createElement('div');
  placeholder.classList.add('post_wrapper_hidden');
  placeholder.style.width = rect.width + 'px';
  placeholder.style.height = rect.height + 'px';

  var parentNode = post.parentNode;
  parentNode.replaceChild(placeholder, post);

  var absoluteBottom = rect.bottom + window.scrollY;

  this.hiddenPosts.push({
    absoluteBottom: absoluteBottom,
    html: post.outerHTML,
    parent: parentNode
  });
};

/**
 * Show a post, removing it from hidden posts
 * @param {DOMElement} hiddenPost
 */
Lethe.prototype.showPost = function(hiddenPost) {
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
