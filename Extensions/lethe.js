//* TITLE Lethe **//
//* VERSION 1.0 REV A **//
//* DESCRIPTION Forgets posts once they scroll off the screen. **//
//* DEVELOPER hobinjk **//
//* FRAME false **//
//* BETA false **//


/** Export Lethe */
XKit.extensions.lethe = new Lethe();

function Lethe() {
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

  this.posts.nextSibling or whatever
  for (var pb of document.querySelectorAll('.post_media')) { var rect = pb.getBoundingClientRect(); var newt = document.createElement('div'); newt.style.width = rect.width + 'px'; newt.style.height = rect.height + 'px'; pb.parentNode.replaceChild(newt, pb); }
};

/**
 * Hide a post, storing it for later
 * @param {DOMElement} post
 */


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
