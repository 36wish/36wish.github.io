function initMap() {
	var auckland = {lat: -36.848123, lng: 174.765588};
	var map = new google.maps.Map(document.getElementById('map'), {
		zoom: 16,
		center: auckland
	});

	var bikeLayer = new google.maps.BicyclingLayer();
    bikeLayer.setMap(map);

    var pinColor = 'ffeb3b';
    var pinImage = new google.maps.MarkerImage("http://chart.apis.google.com/chart?chst=d_map_pin_letter_withshadow&chld=%E2%80%A2|" + pinColor,
        new google.maps.Size(21, 34),
        new google.maps.Point(0,0),
        new google.maps.Point(10, 34));

	// var infowindow = new google.maps.InfoWindow({
 //          content: 'Change the zoom level',
 //          position: auckland
 //        });
 //        infowindow.open(map);

 //        map.addListener('zoom_changed', function() {
 //          infowindow.setContent('Zoom: ' + map.getZoom());
 //        });

 
	$.getJSON(`https://cors-anywhere.herokuapp.com/https://app.onzo.co.nz/nearby/${auckland.lat}/${auckland.lng}/50.0`, function(json) {
		$('#overlay').remove()
		console.log(json.data)
		json.data.forEach(function(e){
			var marker = new google.maps.Marker({
				position: {lat: e.latitude, lng: e.longitude},
				//label: e.id + '',
				map: map,
				icon: pinImage
			});
		})
	});
}