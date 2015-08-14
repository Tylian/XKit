//* TITLE satsukimous **//
//* VERSION 1.0.1 **//
//* DESCRIPTION SATSUKI **//
//* DEVELOPER SATSUKI **//
//* FRAME false **//
//* BETA false **//

XKit.extensions.satsukimous = new Object({

	running: false,

	satsuki: function() {
		$( "img" ).filter(function( index ) {
			return $( this ).attr( "src" ).indexOf( "anonymous_avatar" ) !== -1;
		}).attr( "src", "https://31.media.tumblr.com/avatar_0bc380bccba7_64.png" );
		$( "div.post_avatar_link" ).filter(function( index ) {
			return $( this ).attr( "style" ).indexOf( "anonymous_avatar" ) !== -1;
		}).attr( "style", "background-image: url('https://31.media.tumblr.com/avatar_0bc380bccba7_64.png');" );
	},
	
	run: function() {
		this.running = true;
		
		XKit.post_listener.add( "SATSUKI", XKit.extensions.satsukimous.satsuki );
		XKit.extensions.satsukimous.satsuki();
	},

	destroy: function() {
		this.running = false;
		XKit.post_listener.remove( "SATSUKI" );
	}

});
