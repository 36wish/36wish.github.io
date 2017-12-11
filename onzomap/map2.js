var map, pinImage, pinImage2, pinImage3, infowindow;
var pins = [];
var pins2 = [];
const aucklandLat = -36.848123;
const aucklandLng = 174.765588;
const pageTitle = document.title;
let padToTwo = number => number <= 99 ? ("0"+number).slice(-2) : number;

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

      /**
       * The CenterControl adds a control to the map that recenters the map on
       * Chicago.
       * @constructor
       * @param {!Element} controlDiv
       * @param {!google.maps.Map} map
       * @param {?google.maps.LatLng} center
       */
      function CenterControl(controlDiv, map, center) {
        // We set up a variable for this since we're adding event listeners
        // later.
        var control = this;

        // Set the center property upon construction
        control.center_ = center;
        controlDiv.style.clear = 'both';

        // Set CSS for the control border
        var goCenterUI = document.createElement('div');
        goCenterUI.id = 'goCenterUI';
        goCenterUI.title = 'Click to recenter the map';
        controlDiv.appendChild(goCenterUI);

        // Set CSS for the control interior
        var goCenterText = document.createElement('div');
        goCenterText.id = 'goCenterText';
        goCenterText.innerHTML = 'Center Map';
        goCenterUI.appendChild(goCenterText);

        // Set CSS for the setCenter control border
        var setCenterUI = document.createElement('div');
        setCenterUI.id = 'setCenterUI';
        setCenterUI.title = 'Click to change the center of the map';
        controlDiv.appendChild(setCenterUI);

        // Set CSS for the control interior
        var setCenterText = document.createElement('div');
        setCenterText.id = 'setCenterText';
        setCenterText.innerHTML = 'Set Center';
        setCenterUI.appendChild(setCenterText);

        // Set up the click event listener for 'Center Map': Set the center of
        // the map
        // to the current center of the control.
        goCenterUI.addEventListener('click', function() {
          var currentCenter = control.getCenter();
          map.setCenter(currentCenter);
        });

        // Set up the click event listener for 'Set Center': Set the center of
        // the control to the current center of the map.
        setCenterUI.addEventListener('click', function() {
          var newCenter = map.getCenter();
          control.setCenter(newCenter);
        });
      }

      /**
       * Define a property to hold the center state.
       * @private
       */
      CenterControl.prototype.center_ = null;

      /**
       * Gets the map center.
       * @return {?google.maps.LatLng}
       */
      CenterControl.prototype.getCenter = function() {
        return this.center_;
      };

      /**
       * Sets the map center.
       * @param {?google.maps.LatLng} center
       */
      CenterControl.prototype.setCenter = function(center) {
        this.center_ = center;
      };

function initMap() {
	var auckland = {lat: -36.848123, lng: 174.765588};

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

	pinImage = new google.maps.MarkerImage("https://chart.apis.google.com/chart?chst=d_map_pin_letter_withshadow&chld=%E2%80%A2|ffeb3b",
		new google.maps.Size(40,37),
		new google.maps.Point(0,0),
		new google.maps.Point(11, 34));

	pinImage2 = new google.maps.MarkerImage("https://chart.apis.google.com/chart?chst=d_map_pin_letter_withshadow&chld=%E2%80%A2|2765e0",
		new google.maps.Size(40,37),
		new google.maps.Point(0,0),
		new google.maps.Point(11, 34));

	pinImageDead = new google.maps.MarkerImage("https://chart.apis.google.com/chart?chst=d_map_pin_letter_withshadow&chld=X|fff282", //red fd3d32
		new google.maps.Size(40,37),
		new google.maps.Point(0,0),
		new google.maps.Point(11, 34));

	pinImage3 = {
		url: `https://chart.apis.google.com/chart?chst=d_map_pin_letter_withshadow&chld=|7079ff`,
		size: new google.maps.Size(40,37),
		origin: new google.maps.Point(0, 0),
		anchor: new google.maps.Point(40,37),
		labelOrigin: new google.maps.Point(10,10)
	};
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

	var centerControlDiv = document.createElement('div');
	var centerControl = new CenterControl(centerControlDiv, map, auckland);

	centerControlDiv.index = 1;
	centerControlDiv.style['padding-top'] = '10px';
	map.controls[google.maps.ControlPosition.TOP_CENTER].push(centerControlDiv);

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

				var date = new Date(parseInt(e.createTime))
				var date2 = new Date(parseInt(e.updateTime))
				const dateNow = new Date()

				date2.setHours(date2.getHours() - ((date2.getTimezoneOffset()/-60) - 8));		//time in UTC+8 timezone

				var marker = new google.maps.Marker({
					position: {lat: parseFloat(e.latitude), lng: parseFloat(e.longitude)},
					//label: e.id + '',
					map: map,
					// icon: e.isLock == 0 ? pinImage2 : pinImage
					// icon: pinImage 
					icon: ((date2-dateNow)/-60/1000).toFixed() < 60 ? pinImage : pinImageDead
				});


				console.log(date2)
				marker.addListener('click', function() {
					infowindow.setContent(
						`<div><b>${e.producid}</b></div>
						<div>Unlocked times: ${e.unlockedTimes}</div>	
						<div>isLock: ${e.isLock}</div>
						<div>Created: ${date.getDate()}/${date.getMonth()+1}/${date.getFullYear()}</div>
						<div>Updated: ${date2.getDate()}/${date2.getMonth()+1}/${date2.getFullYear()} ${date2.getHours()}:${padToTwo(date2.getMinutes())}:${padToTwo(date2.getSeconds())} (${((date2-dateNow)/-60/1000).toFixed()} min ago)</div>

														`)
					infowindow.open(map, marker);
				});
				// if (((date2-dateNow)/-60/1000).toFixed() < 60)
				// 	marker.setMap(null)
				pins.push(marker)
			})
			//console.log(pins)
		});
	$.get(`https://my.nextbike.net/maps/nextbike-live.xml?get_biketypes=1&entire_city=1&lat=${aucklandLat}&lng=${aucklandLng}&distance=50000&limit=2147483647`, 
		function(data){
			// $('#overlay').remove()
			pins2.forEach(e=>e.setMap(null))
			pins2 = [];	
			console.log(data)
			xml = $(data)
			console.log(xml.find('place'))
			xml.find('place').each(function(){
				const bike = this;
				// console.log(bike)
				// console.log(bike.getAttribute('lat'))
				// console.log(bike.getAttribute('lng'))
				// console.log(bike.getAttribute('bikes'))



				var marker = new google.maps.Marker({
					position: {lat: parseFloat(bike.getAttribute('lat')), lng: parseFloat(bike.getAttribute('lng'))},
					label: bike.getAttribute('bikes'),
					map: map,
					// icon: e.isLock == 0 ? pinImage2 : pinImage
					icon: pinImage3
				});

				marker.addListener('click', function() {
					infowindow.setContent(
						`<div><b>${bike.getAttribute('number')} ${bike.getAttribute('name')}</b></div>
						<div>Bikes: ${bike.getAttribute('bikes')}</div>	
						<div>Free racks: ${bike.getAttribute('free_racks')}</div>
														`)
					infowindow.open(map, marker);
				});

				pins2.push(marker)

			})
			// console.log(xm)
		}
		)

}