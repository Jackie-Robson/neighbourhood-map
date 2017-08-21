var map;



function initMap() {
	map = new google.maps.Map( document.getElementById( 'map' ), {
		center: {
			lat: 51.4983118,
			lng: -0.0626111
		},
		zoom: 14,
		mapTypeId: google.maps.MapTypeId.ROADMAP,
		disableDefaultUI: true
	} );
}

function mapFail(){
	alert("google maps failed to load :(  ")
}
