# ee-image

[![Greenkeeper badge](https://badges.greenkeeper.io/eventEmitter/ee-images.svg)](https://greenkeeper.io/)

not yet functional.. will be ready tomorrow!

based on picha & opencv

## installation

	sudo apt-get install libcv-dev
	npm install ee-image


## usage


	var Images = require( "ee-images" );


	var images = new Images( {
		  maxWorkers: 	10 		// dont work ( do actual computations ) on more than 10 images at any time
		, maxWaiting: 	10000 	// start failing when more than 10k images are wating for being processed
		, filter:		 "cubic|lanczos|catmulrom|mitchel|box|triangle" 			// which algorithm to use for resizing images
	} );


	// load an image typeof jpeg, gif or png24
	var image = images.load( buffer );

	// crop image
	image.crop( { 
		  height: 	200
		, width: 	200
		, top: 		0
		, left: 	0
		, right: 	0
		, bottom: 	0
	} );

	// resize image
	image.resize( { 
		  height: 	1000
		, width: 	300
		, mode: 	"fit|crop|distort"
		, faces: 	[] 
	} );



	// return image as jpeg or png24
	image.toBuffer( "jpeg", function( err, buffer ){} );

	// detect faces on the image
	image.detectFaces( function( err, faces ){} );