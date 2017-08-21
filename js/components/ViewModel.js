var menuBtn = $( '#menuBtn' );
var menu = $( '#menu' );
var mapContainer = $( '#map' );
var filterForm = $( '#filterForm' );
var openMenu = function() {
	menu.toggleClass( 'open' );
	mapContainer.toggleClass( 'open' );
};

var hide = function() {
	markerDrop.toggleClass( 'hide' );
};

var listClick = function( e ) {
	google.maps.event.trigger( e, 'click' );
};

var infowindow = new google.maps.InfoWindow();


var populateInfoWindow = function( marker, infowindow ) {
	if ( infowindow.marker != marker ) {
		infowindow.marker = marker;

		var streetViewLocation = marker.search;
		var streetView = 'http://maps.googleapis.com/maps/api/streetview?size=200x100&location=' + streetViewLocation + '&key=AIzaSyCPQHFprpz7RDVGh5OymViX72s7XRCgQHs';

		marker.setAnimation( google.maps.Animation.BOUNCE );
		setTimeout( function() {
			infowindow.marker.setAnimation( null );
		}, 800 );

		var url = "https://api.nytimes.com/svc/search/v2/articlesearch.json";
		url += '?' + $.param( {
			'api-key': "f26215c383b340848fd37840fdd3cc09",
			'fq': infowindow.marker.nyTimesQuery
		} );

		// this code block handles the newyork times article api
		var articleList = [];

		$.ajax( {
			url: url,
			method: 'GET',
			success: function( data ) {
				var articles = data.response.docs;
				for ( var i = 0; i < 2; i++ ) {
					var article = articles[ i ];
					$( '#articles' ).append( '<li class="article"><a href="' + article.web_url + '">' + article.headline.main + '</a><p>' + article.snippet + '</p></li>' );
				}
			},
		} ).fail( function( err ) {
			infowindow.setContent( '<img class="infowindowImg" src=' + streetView + '><h5>' + marker.title + '<h5><div>' + marker.content + '</div> <h3> New York Times data could not load.</h3>' );
			throw err;
		} );
		infowindow.addListener( 'closeclick', function() {
			infowindow.close();
		} );


		var contentStr = '<img class="infowindowImg" src=' + streetView + '><h5>' + marker.title + '<h5><div>' + marker.content + '</div> <ul id="articles"></ul>';


		setTimeout( 300, infowindow.setContent( contentStr ) );
		infowindow.open( map, marker );
	}
};



var typeOfLocation = [];


function ViewModel() {
	var self = this;

	self.open = openMenu;
	self.center = listClick;
	this.hideForm = hide;
	self.markers = ko.observableArray( [] );
	self.filter = ko.observable( '' );
	self.filterItems = ko.utils.arrayFilter();
	self.initMarkers = function initMarkers() {
		for ( var i = 0; i < locations.length; i++ ) {
			var position = locations[ i ].location;
			var title = locations[ i ].title;
			var content = locations[ i ].content;
			var type = locations[ i ].type;
			var center = locations[ i ].center;
			var search = locations[ i ].search;
			var nyTimesQuery = locations[ i ].nyTimesQuery;

			var marker = new google.maps.Marker( {
				position: position,
				map: map,
				title: title,
				animation: google.maps.Animation.DROP,
				id: i,
				content: content,
				type: type,
				search: search,
				nyTimesQuery: nyTimesQuery
			} );
			self.markers.push( marker );
		}
		self.listeners();
	};
	self.listeners = function() {
		self.markers().forEach( function( marker ) {
			marker.addListener( 'click', function() {
				populateInfoWindow( marker, infowindow );
			} );
		} );
	};
	self.filteredItems = ko.computed( () => ko.utils.arrayFilter( self.markers(), ( marker ) => {
		// Check if title matches search
		if ( marker.title.toLowerCase().indexOf( self.filter().toLowerCase() ) !== -1 ) {
			// Display matching Markers
			if ( marker ) {
				marker.setMap( map );
			}
		} else if ( marker ) {
			marker.setMap( null );
		}
		return marker.title.toLowerCase().indexOf( self.filter().toLowerCase() ) !== -1;
	} ), self );

	self.initMarkers();
}


ko.applyBindings( new ViewModel() );
