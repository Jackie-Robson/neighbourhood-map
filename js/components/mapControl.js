var map;


var infowindow = new google.maps.InfoWindow()

function initMap() {
	map = new google.maps.Map( document.getElementById( 'map' ), {
		center: {
			lat: 51.4983118,
			lng: -0.0626111
		},
		zoom: 14
	} );
};

var populateInfoWindow = function( marker, infowindow ) {
	if ( infowindow.marker != marker ) {
		infowindow.marker = marker;

		var streetViewLocation = marker.search;
		var streetView = 'http://maps.googleapis.com/maps/api/streetview?size=200x100&location='+streetViewLocation+'&key=AIzaSyCPQHFprpz7RDVGh5OymViX72s7XRCgQHs';

		marker.setAnimation(google.maps.Animation.BOUNCE)
		setTimeout(function() {
			infowindow.marker.setAnimation(null)},800)

		infowindow.setContent( '<img class="infowindowImg" src='+streetView+'><h5>'+marker.title+ '<h5><div>' + marker.content + '</div> <ul id="articles"></ul>'  );
		infowindow.open( map, marker );

		var url = "https://api.nytimes.com/svc/search/v2/articlesearch.json";
		url += '?' + $.param({
			'api-key': "f26215c383b340848fd37840fdd3cc09",
			'fq': infowindow.marker.nyTimesQuery
		});

		// this code block handles the newyork times article api

		$.ajax({
			url: url,
			method: 'GET',
			success: function(data) {
				var articles = data.response.docs;
				for(var i=0; i < 2; i++){
					var article = articles[i];
					$('#articles').append('\n\
					<li class="article"> \n\
						<a href="'+article.web_url+'">'+article.headline.main+'</a> \n\
						<p>'+article.snippet+'</p> \n\
					</li> \n\
					');
				}
			},
			error : function(){
				$("#articles").replaceWith('<h3 class="nytimes-header"> Data could not load! </h3>')
			}, fail : function(err) {
				throw err;
			}

		})
		infowindow.addListener( 'closeclick', function() {
			infowindow.close();
		} )
	}
}





initMap()
