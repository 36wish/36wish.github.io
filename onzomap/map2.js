var map, pinImage, pinImage2, infowindow;
var pins = [];
const aucklandLat = -36.848123;
const aucklandLng = 174.765588;
const pageTitle = document.title;

function updateHash(map){
	const rnd = 6
	console.log('zoom',map.getZoom())
	console.log('lat',map.getCenter().lat().toFixed(rnd))
	console.log('lng',map.getCenter().lng().toFixed(rnd))
	window.location.hash = `${map.getCenter().lat().toFixed(rnd)}/${map.getCenter().lng().toFixed(rnd)}/${map.getZoom()}`
}
function isSublocale(i){
	return i.types.includes('sublocality')
}
function initMap() {
	// var auckland = {lat: -36.848123, lng: 174.765588};

	var lat, lng, zoom;
	
	if (/#-\d+.?\d*\/\d+.?\d*\/\d{1,2}/.test(window.location.hash)){
		hash = window.location.hash.slice(1).split('/')
		lat = parseFloat(hash[0]);
		lng = parseFloat(hash[1]);
		zoom = parseInt(hash[2])
	}else{
		lat = parseFloat(localStorage.getItem('lat')) || aucklandLat
		lng = parseFloat(localStorage.getItem('lng')) || aucklandLng
		zoom = parseInt(localStorage.getItem('zoom')) || 16
	}
	console.log(lat, lng, zoom)
	map = new google.maps.Map(document.getElementById('map'), {
		zoom: zoom,
		center: {lat:lat, lng:lng}
	});

	var geocoder = new google.maps.Geocoder

	map.addListener('idle',function(){
		// console.log('zoom',map.getZoom())
		// console.log('lat',map.getCenter().lat())
		// console.log('lng',map.getCenter().lng())
		localStorage.setItem('zoom', map.getZoom())
		localStorage.setItem('lat', map.getCenter().lat())
		localStorage.setItem('lng', map.getCenter().lng())
		updateHash(map)
		if (map.getZoom() >= 16) {
			geocoder.geocode({'location': map.getCenter()}, function(results, status) {
			if (status === 'OK') {
			console.log(results)
			i = results.find(isSublocale)
				if (i) {
						console.log(i.formatted_address)
						document.title = pageTitle + ' - ' + 
										 i.formatted_address.substring(0,i.formatted_address.indexOf(','))

					}else{
						console.log('No results found');
						document.title = pageTitle
					}
				} else {
					console.log('Geocoder failed due to: ' + status);
					document.title = pageTitle
				}
		  	});
		}else{
			document.title = pageTitle
		}
	})

	// window.onhashchange = function(e){
	// 	console.log(e)
	// 	hash = window.location.hash.slice(1).split('/')
	// 	console.log(hash)
	// 	// map.setZoom(parseInt(hash[3]))
	// 	// map.setCenter({lat:parseFloat(hash[0]), lng:parseFloat(hash[1])})
	// }

	var bikeLayer = new google.maps.BicyclingLayer();
	bikeLayer.setMap(map);

	pinImage = new google.maps.MarkerImage("http://chart.apis.google.com/chart?chst=d_map_pin_letter_withshadow&chld=%E2%80%A2|ffeb3b",
		new google.maps.Size(40,37),
		new google.maps.Point(0,0),
		new google.maps.Point(11, 34));

	pinImage2 = new google.maps.MarkerImage("http://chart.apis.google.com/chart?chst=d_map_pin_letter_withshadow&chld=%E2%80%A2|2765e0",
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

	

	infowindow = new google.maps.InfoWindow({
		content: '1234',
		pixelOffset: new google.maps.Size(-8, 10)
	});
// https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20json%20where%20url%3D%22https%3A%2F%2Fapp.onzo.co.nz%2Fnearby%2F-36.848123%2F174.765588%2F50.0%22&format=json&diagnostics=true&callback=
	// $.getJSON(`https://cors-anywhere.herokuapp.com/https://app.onzo.co.nz/nearby/${auckland.lat}/${auckland.lng}/50.0`, function(json) {
	
	// setInterval()
	updatePins();
	setInterval(updatePins,1000*60*5);
}

function updatePins(){
	$.getJSON("https://query.yahooapis.com/v1/public/yql",
		{
			q: `select * from json where url="https://app.onzo.co.nz/nearby/${aucklandLat}/${aucklandLng}/50.0"`,
			format: "json"
		},
		function(json){
			pins.forEach(e=>e.setMap(null))
			pins = [];	
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
			//console.log(pins)
		});
}