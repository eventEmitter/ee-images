

	var   Class 		= require( "ee-class" )
		, type 			= require( "ee-types" )
		, opencv 		= require( "opencv" )
		, picha 		= require( "picha" )
		, log 			= require( "ee-log" );



	module.exports = new Class( {


		  currentQueue: []


		, filters: [ "cubic", "lanczos", "catmulrom", "mitchel", "box", "triangle" ]
		, modes: [ "fit", "crop", "distort" ]


		, init: function( options ){
			this.filter = options.filter;
			this.pool 	= options.pool;
			this.image 	= options.image;

			
		}

		, crop: function( options ){
			if ( options ){
				this.currentQueue.push( {
					  action: 		"crop"
					, top: 			type.number( options.top ) ? options.top : null
					, left: 		type.number( options.left ) ? options.left : null
					, height: 		type.number( options.height ) ? options.height : null
					, width: 		type.number( options.width ) ? options.width : null
				} );
			}
		}

		, resize: function( options ){
			if ( options ){
				this.currentQueue.push( {
					  action: 		"resize"
					, height: 		type.number( options.height ) ? options.height : null
					, width: 		type.number( options.width ) ? options.width : null
					, faces: 		( type.array( options.faces ) || type.boolean( options.faces ) ) ? options.faces : null
					, mode: 		( type.string( options.mode ) && this.modes.indexOf( options.mode.toLowerCase().trim() ) >= 0 ) ? options.mode.toLowerCase().trim() : "crop"
					, filter: 		( type.string( options.filter ) && this.filters.indexOf( options.filter.toLowerCase().trim() >= 0 ) ? options.filter.toLowerCase().trim() : this.filter
					, background: 	
				} );
			}
		}



		, _resize: function( image, command, callback ){
			// first we need to know what we're going to do, there are basically 3 modes, from which one 
			// can be optimized using face detection
			// fit -> fits the image in the box specified in the command, there will be almost ceratin
			// a border one two sides of the resulting image
			// distort -> resize the image into the box specified by the command
			// crop -> crop the center part of time image at the biggest size possible without distorting 
			// the image and without borders on any of the sides. using face deection we can check where we
			// should crop the image

			if ( command.height === null || command.width === null ) callback( new Error( "Expected options width & height to be defined for resizing! One or both are missing or not typeof number!" ).setName( "InvalidArgumentException" ) );
			else {
				if ( command.mode === "crop" ){
					
				}
				else if ( command.mode === "fit" ){

				}
				else if ( command.mode === "distort" ){
					picha.resize( image, {
						  width: 	command.width
						, height: 	command.height
						, filter: 	command.filter
					}, callback );
				}
				else {
					throw new Error( "unknown resizing mode «"+command.mode+"»! this should never happen!" );
				}
			}
		}


		// actual resizing
		, __resize: function( image, options, callback ){
			this.getResource( function( err, resource ){
				if ( err ) callback( err );
				else {
					picha.resize( image, options, function( err, newImage ){
						callback( err, newImage );
						resource.free();
					}.bind( this ) );
				}
			}.bind( this ) );
		}



		// do the actual cropping
		, _crop: function( image, command, callback ){
			var options = {
				  top: 		null
				, left: 	null
				, height: 	null
				, width: 	null
			};

			this.stat( function( err, stats ){
				if ( err ) callback( err );
				else {
					if ( type.number( command.height ) ) 			options.height = command.height;
					if ( type.number( command.width ) ) 			options.width = command.width;
					if ( type.number( command.top ) ) 				options.top = command.top;
					if ( type.number( command.left ) ) 				options.left = command.left;

					if ( type.number( command.bottom ) ){
						if ( type.number( command.top ) ) 			options.height = stats.height - command.top - command.bottom;
						else if ( type.number( command.height ) ) 	options.top = stats.height - command.height - command.bottom;
						else {
							options.top = 0;
							options.height = stats.height - command.bottom;
						}								
					}

					if ( type.number( command.right ) ){
						if ( type.number( command.left ) ) 			options.width = stats.width - command.left - command.right;
						else if ( type.number( command.width ) ) 	options.left = stats.width - command.width - command.right;
						else {
							options.left = 0;
							options.width = stats.width - command.right;
						}								
					}

					if ( !type.number( options.top ) ) 				options.top = 0;
					if ( !type.number( options.left ) ) 			options.left = 0;

					if ( !type.number( options.height ) ) 			options.height = stats.height - options.top - ( options.bottom || 0 );
					if ( !type.number( options.width ) ) 			options.width = stats.width - options.left - ( options.right || 0 );

					if ( options.top + options.height > stats.height ) return callback( new Error( "Image too small for selected cropping options. Total image height is «"+stats.height+"», top «"+options.top+"» + height «"+options.height+"» is «"+(options.top + options.height )+"»" ).setName( "InvalidArgumentException" ) );
					if ( options.left + options.width > stats.width ) return callback( new Error( "Image too small for selected cropping options. Total image width is «"+stats.width+"», left «"+options.left+"» + width «"+options.width+"» is «"+(options.left + options.width )+"»" ).setName( "InvalidArgumentException" ) );

					callback( null, image.subView( options.left, options.top, options.width, options.height ) );
				}
			}.bind( this ) );
		}



		// stat the current image
		, stat: function( image ){
			if ( image ){
				// stat the unpacked image
				return {
					  height: 	image.height
					, width: 	image.width 
					, pixel: 	image.pixel 
					, stride: 	image.stride
				}
			}
			else {
				var stats = picha.stat( this.image );
				if ( stats ) return stats;
				else return new Error( "Failed to retreive image stats!" ).setName( "ImageFormatException" );
			}
		}



		, decode: function( callback ){
			this.getResource( function( err, resource ){
				if ( err ) callback( err );
				else {
					picha.decode( this.image, function( err, deocedImage ){
						if ( err ) callback( err );
						else {
							callback( null, deocedImage );
						}

						resource.free();
					}.bind( this ) );
				}
			}.bind( this ) );
		}



		, faces: function( callback ){
			this.getResource( function( err, resource ){
				if ( err ) callback( err );
				else {
					opencv.readImage( this.image, function( err, image ){
						if ( err ) {
							resource.free();
							callback( err );
						}
						else {
							image.detectObject( opencv.FACE_CASCADE, {}, function( err, faces ){
								if ( type.array( faces ) ) this.faces = faces;
								callback( err, faces );
								resource.free();
							}.bind( this ) );
						}
					}.bind( this ) );
				}
			}.bind( this ) );
		}




		, getResource: function( callback ){
			this.pool.get( callback );
		}
	} );