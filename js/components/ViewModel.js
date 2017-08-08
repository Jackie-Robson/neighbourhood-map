var menuBtn = $('#menuBtn');
var menu = $('#menu');
var mapContainer = $('#map');
var filterForm = $('#filterForm');

var openMenu = function(){
	menu.toggleClass('open');
	mapContainer.toggleClass('open');
};

var hide = function(){
	filterForm.toggleClass('hide');
};

var listClick = function(e){
	google.maps.event.trigger(e, 'click');
};



var typeOfLocation = [];



function ViewModel() {
	var self = this;

	self.open = openMenu;
	self.center = listClick;
	this.hideForm = hide;
	self.markers = ko.observableArray([]);
	self.filter = ko.observable('');
	self.filterItems = ko.utils.arrayFilter();
	self.initMarkers = function initMarkers(){
 	for ( var i = 0; i < locations.length; i++ ) {
 		var position = locations[ i ].location;
 		var title = locations[ i ].title;
 		var content = locations[i].content;
 		var type = locations[i].type;
 		var center = locations[i].center;
 		var search = locations[i].search;
 		var nyTimesQuery = locations[i].nyTimesQuery;

 		var marker = new google.maps.Marker( {
 			position: position,
 			map: map,
 			title: title,
 			animation: google.maps.Animation.DROP,
 			id: i,
 			content : content,
 			type : type,
 			search : search,
 			nyTimesQuery : nyTimesQuery
 		}
 	);
 		marker.addListener( 'click', populateInfoWindow( this, infowindow );
  	);
 		self.markers.push( marker );
 	}
};

<<<<<<< HEAD
	self.filteredItems = ko.computed(function(){ko.utils.arrayFilter(self.markers(), function(marker){
    if (marker.title.toLowerCase().indexOf(self.filter().toLowerCase()) !== -1) {
      if (marker) {
        marker.setMap(map);
      }
    } else if (marker) {
      marker.setMap(null);
    }
    return marker.title.toLowerCase().indexOf(self.filter().toLowerCase()) !== -1;
  })}, self);

	self.initMarkers();
=======
	self.filteredItems = ko.computed(function (location) {
	var filter = self.filter();
		if (!filter) {
				return self.markers();
		} else {
				var filtered = ko.utils.arrayFilter(self.markers, function (location) {
						return location === filter;
				});

				return self.markers = filtered
		}
	})
	self.initMarkers()
>>>>>>> parent of 2d5b6f3... Filter Fix and README

}


ko.applyBindings(new ViewModel());
