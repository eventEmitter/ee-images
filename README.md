# ee-image

not yet functional.. will be ready tomorrow!

## installation

	sudo apt-get install libcv-dev
	npm install ee-image


## usage


	var Images = require( "ee-images" );


	var images = new Images( {
		  maxWorkers: 10 		// dont work ( do actual computations ) on more than 10 images at any time
		, maxWaiting: 10000 	// start failing when more than 10k images are wating for being processed
	} );


	// load an image typeof jpeg, gif or png24
	var imageInstance = images.load( buffer );

	// crop image
	imageInstance.crop( { 
		  faceDetection: 	true
		, height: 			200
		, width: 			200
		, offsetTop: 		0
		, offsetLeft: 		0
		, offsetRight: 		0
		, offsetBottom: 	0
		, position: 		"center|verticalCenter|horizontalCenter|..."
	} );

	// resize image
	imageInstance.resize( { height: 1000, width: 300, mode: "fit", faces: [] } );

	// return image as jpeg or png24
	imageInstance.toBuffer( "jpeg", function( err, buffer ){} );

	// detect faces on the image
	imageInstance.detectFaces( function( err, faces ){} );