function initMap() {
	var auckland = {lat: -36.848123, lng: 174.765588};
	var map = new google.maps.Map(document.getElementById('map'), {
		zoom: 16,
		center: auckland
	});

	var bikeLayer = new google.maps.BicyclingLayer();
    bikeLayer.setMap(map);

    var pinImage = new google.maps.MarkerImage("http://chart.apis.google.com/chart?chst=d_map_pin_letter_withshadow&chld=%E2%80%A2|ffeb3b",
        new google.maps.Size(40,37),
        new google.maps.Point(0,0),
        new google.maps.Point(11, 34));

    var pinImage2 = new google.maps.MarkerImage("http://chart.apis.google.com/chart?chst=d_map_pin_letter_withshadow&chld=%E2%80%A2|2765e0",
        new google.maps.Size(40,37),
        new google.maps.Point(0,0),
        new google.maps.Point(11, 34));
	// var infowindow = new google.maps.InfoWindow({
 //          content: 'Change the zoom level',
 //          position: auckland
 //        });
 //        infowindow.open(map);

 //        map.addListener('zoom_changed', function() {
 //          infowindow.setContent('Zoom: ' + map.getZoom());
 //        });

 	var pins = []

	var infowindow = new google.maps.InfoWindow({
		content: '1234',
		pixelOffset: new google.maps.Size(-8, 10)
	});

	$.getJSON(`https://cors-anywhere.herokuapp.com/https://app.onzo.co.nz/nearby/${auckland.lat}/${auckland.lng}/50.0`, function(json) {
		$('#overlay').remove()
		console.log(json.data)
		json.data.forEach(function(e){
			var marker = new google.maps.Marker({
				position: {lat: e.latitude, lng: e.longitude},
				//label: e.id + '',
				map: map,
				// icon: e.isLock == 0 ? pinImage2 : pinImage
				icon: pinImage
			});
			var date = new Date(e.createTime)
			marker.addListener('click', function() {
				infowindow.setContent(
					`<div><b>${e.producid}</b></div>
					<div>Unlocked times: ${e.unlockedTimes}</div>	
					<div>isLock: ${e.isLock}</div>
					<div>Created: ${date.getDate()}/${date.getMonth()+1}/${date.getFullYear()}</div>

													`)
				infowindow.open(map, marker);
			});
			pins.push(marker)
		})
		console.log(pins)
	});
}