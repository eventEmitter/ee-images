


	var   Class 		= require( "ee-class" )
		, log 			= require( "ee-log" )
		, fs 			= require( "fs" )
		, assert 		= require( "assert" );



	var   Images 		= require( "./" )
		, images 		= new Images()
		, image 		= images.load( fs.readFileSync( "./test/1.jpg" ) )
		, image2 		= images.load( fs.readFileSync( "./test/2.jpg" ) );

/*
	image.faces( function( err, faces ){
		if ( err )log.trace( err );
		else log( faces );
	} );
*/

	image2.crop( { height: 300, width: 400, top: 50 }, function( err, data ){
		if ( err ) log.trace( err );
		else {
			fs.writeFile( "./out.jpg", data );
		}
	} );