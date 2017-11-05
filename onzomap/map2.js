function initMap() {
	// var auckland = {lat: -36.848123, lng: 174.765588};
	const aucklandLat = -36.848123;
	const aucklandLng = 174.765588;
	var lat = parseFloat(localStorage.getItem('lat')) || aucklandLat
	var lng = parseFloat(localStorage.getItem('lng')) || aucklandLon
	var zoom = parseInt(localStorage.getItem('zoom')) || 16

	console.log(lat, lng, zoom)
	var map = new google.maps.Map(document.getElementById('map'), {
		zoom: zoom,
		center: {lat:lat, lng:lng}
	});

	map.addListener('bounds_changed',function(){
		console.log('zoom',map.getZoom())
		console.log('lat',map.getCenter().lat())
		console.log('lng',map.getCenter().lng())
		localStorage.setItem('zoom', map.getZoom())
		localStorage.setItem('lat', map.getCenter().lat())
		localStorage.setItem('lng', map.getCenter().lng())
	})

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
// https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20json%20where%20url%3D%22https%3A%2F%2Fapp.onzo.co.nz%2Fnearby%2F-36.848123%2F174.765588%2F50.0%22&format=json&diagnostics=true&callback=
	// $.getJSON(`https://cors-anywhere.herokuapp.com/https://app.onzo.co.nz/nearby/${auckland.lat}/${auckland.lng}/50.0`, function(json) {
	$.getJSON("http://query.yahooapis.com/v1/public/yql",
		{
			q: `select * from json where url="https://app.onzo.co.nz/nearby/${aucklandLat}/${aucklandLng}/50.0"`,
			format: "json"
		},
		function(json){	
			$('#overlay').remove()
			console.log(json)
			console.log(json.query.results.json.data)
			json.query.results.json.data.forEach(function(e){
				//console.log(e)
				//console.log(e.latitude, e.longitude)
				var marker = new google.maps.Marker({
					position: {lat: parseFloat(e.latitude), lng: parseFloat(e.longitude)},
					//label: e.id + '',
					map: map,
					// icon: e.isLock == 0 ? pinImage2 : pinImage
					icon: pinImage
				});
				var date = new Date(parseInt(e.createTime))
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