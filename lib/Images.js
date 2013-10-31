

	var   Class 		= require( "ee-class" )
		, ResourcePool 	= require( "ee-resource-pool" )
		, Options 		= require( "ee-options" )
		, type 			= require( "ee-types" )
		, log 			= require( "ee-log" );

	var Image 			= require( "./Image" );



	module.exports = new Class( {



		init: function( options ){
			var o = new Options( this, options );
			o( "maxWorkers", "number", 10 );
			o( "maxWaiting", "number", 10 );
			o( "filter", "string", "lanczos" );

			this.pool = new ResourcePool( {
				  max: 			this.maxWorkers
				, maxWaiting: 	this.maxWaiting
			} );
		}


		, load: function( buffer ){
			if ( type.buffer( buffer ) ){
				return new Image( { 
					  image: 	buffer
					, pool: 	this.pool
					, filter: 	this.filter 
				} );
			}
			else {
				throw new Error( "Expected buffer, got «"+type( buffer )+"» instead!" ).setName( "InvalidArgumentException" );
			}
		}
	} );