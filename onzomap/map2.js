var map, pinImage, pinImage2, pinImage3, infowindow;
var lat, lng, zoom;
var pins = [];
var pins2 = [];
var pins3 = [];
var displayed = true;
var displayed2 = true;
var displayed3 = true;
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
		goCenterUI.classList.add('buttonUI')
		goCenterUI.title = 'Click to hide/show OnzO';
		controlDiv.appendChild(goCenterUI);

		// Set CSS for the control interior
		var goCenterText = document.createElement('div');
		goCenterText.id = 'goCenterText';
		goCenterText.classList.add('buttonText')
		goCenterText.innerHTML = 'OnzO';
		goCenterUI.appendChild(goCenterText);

		// Set CSS for the setCenter control border
		var setCenterUI = document.createElement('div');
		setCenterUI.id = 'setCenterUI';
		setCenterUI.classList.add('buttonUI')
		setCenterUI.title = 'Click to hide/show Nextbike';
		controlDiv.appendChild(setCenterUI);

		// Set CSS for the control interior
		var setCenterText = document.createElement('div');
		setCenterText.id = 'setCenterText';
		setCenterText.classList.add('buttonText')
		setCenterText.innerHTML = 'Nextbike';
		setCenterUI.appendChild(setCenterText);

		// Set CSS for the setCenter control border
		var button3UI = document.createElement('div');
		button3UI.id = 'button3UI';
		button3UI.classList.add('buttonUI')
		button3UI.title = 'Click to hide/show Button3';
		controlDiv.appendChild(button3UI);

		// Set CSS for the control interior
		var button3Text = document.createElement('div');
		button3Text.id = 'button3Text';
		button3Text.classList.add('buttonText')
		button3Text.innerHTML = 'Button3';
		button3UI.appendChild(button3Text);

		// Set up the click event listener for 'Center Map': Set the center of
		// the map
		// to the current center of the control.
		goCenterUI.addEventListener('click', function() {
			if (displayed){
				displayed = false;
				pins.forEach(e=>e.setMap(null))
				$('#goCenterText').removeClass('bold'); 
			} else {

				$('#goCenterText').addClass('bold'); 
				pins.forEach(e=>e.setMap(map))

				displayed = true;
			}
		});

		// Set up the click event listener for 'Set Center': Set the center of
		// the control to the current center of the map.
		setCenterUI.addEventListener('click', function() {
		  //var newCenter = map.getCenter();
		  //control.setCenter(newCenter);

			if (displayed2){
				displayed2 = false;
				pins2.forEach(e=>e.setMap(null))
				$('#setCenterText').removeClass('bold'); 
			} else {

				$('#setCenterText').addClass('bold'); 
				pins2.forEach(e=>e.setMap(map))

				displayed2 = true;
			}

		  
		  
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


	function RefreshControl(controlDiv, map){
		// Set CSS for the control border.
        var controlUI = document.createElement('div');
        controlUI.style.backgroundColor = '#fff';
        controlUI.style.border = '2px solid #fff';
        controlUI.style.borderRadius = '3px';
        controlUI.style.boxShadow = '0 2px 6px rgba(0,0,0,.3)';
        controlUI.style.cursor = 'pointer';
        controlUI.style.marginLeft = '10px';
        controlUI.style.marginBottom = '10px';
        controlUI.style.textAlign = 'center';
        controlUI.title = 'Reload bike info';
        controlDiv.appendChild(controlUI);

        // Set CSS for the control interior.
        var controlText = document.createElement('div');
        controlText.style.color = 'rgb(25,25,25)';
        controlText.style.fontFamily = 'Roboto,Arial,sans-serif';
        controlText.style.fontSize = '16px';
        controlText.style.lineHeight = '25px';
        // controlText.style.height = '25px';
        controlText.style.width = '25px';
        // controlText.style.paddingLeft = '5px';
        // controlText.style.paddingRight = '5px';
        controlText.innerHTML = '<i class="fa fa-refresh" title="Refresh"></i>';
        controlUI.appendChild(controlText);

        // Setup the click event listeners: simply set the map to Chicago.
        controlUI.addEventListener('click', function() {
        	updatePins()
        });
	}

function initMap() {
	var auckland = {lat: -36.848123, lng: 174.765588};

	
	
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
		center: {lat:lat, lng:lng},
		streetViewControl: false
	});

	var geoloccontrol = new klokantech.GeolocationControl(map, 17);
	console.log(geoloccontrol)

	var geocoder = new google.maps.Geocoder

	map.addListener('idle',function(){
		// console.log('zoom',map.getZoom())
		// console.log('lat',map.getCenter().lat())
		// console.log('lng',map.getCenter().lng())
		console.log(map.getBounds())

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

	pinImage4 = new google.maps.MarkerImage("https://chart.apis.google.com/chart?chst=d_map_pin_letter_withshadow&chld=%E2%80%A2|fd3d32",
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

	var centerControlDiv = document.createElement('div');
	var centerControl = new CenterControl(centerControlDiv, map, auckland);

	centerControlDiv.index = 1;
	centerControlDiv.style['padding-top'] = '10px';
	// map.controls[google.maps.ControlPosition.TOP_CENTER].push(centerControlDiv);


    // Create the DIV to hold the control and call the CenterControl()
    // constructor passing in this DIV.
    var refreshControlDiv = document.createElement('div');
    var refreshControl = new RefreshControl(refreshControlDiv, map);

    refreshControlDiv.index = 2;
    map.controls[google.maps.ControlPosition.LEFT_BOTTOM].push(refreshControlDiv);



	updatePins();
	setInterval(updatePins,1000*60*5);
}

function updatePins(){

	$('.fa-refresh').addClass('fa-spin')
	
	$.getJSON(`https://morning-brook-44398.herokuapp.com/https://app.onzo.co.nz/nearby/${aucklandLat}/${aucklandLng}/50.0`,
		function(json){
			pins.forEach(e=>e.setMap(null))
			pins = [];	
			$('#overlay').remove()
			$('.fa-refresh').removeClass('fa-spin')
			console.log(json)
			console.log(json.data)
			json.data.forEach(function(e){
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


				//console.log(date2)
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

		

		// $.getJSON("https://query.yahooapis.com/v1/public/yql",
		// {
		// 	q: `select * from json where url="https://api.reddygo.com.au/reddygo_http/nearbyBikes" and postdata='{"token":"","con":"AU","clientInfo":"12600,GoogleStore,1,71200","lang":"en","version":10206,"data":{"latitude":-33.86633496196667,"longitude":151.2062431499362,"billingModelIds":"5,1,10,3"}}'`,
		// 	format: "json"
		// },
/*
		$.post("https://morning-brook-44398.herokuapp.com/https://api.reddygo.com.au/reddygo_http/nearbyBikes",
		{

			data: `{"data":{"latitude":${lat},"longitude":${lng}}}`,
		},
			function(data){
				$('#overlay').remove()
				pins3.forEach(e=>e.setMap(null))
				pins3 = [];	
				console.log(data.data.bikes)
				data.data.bikes.forEach(function(e){
					const bike = this;
					console.log(e)
					// console.log(bike.getAttribute('lat'))
					// console.log(bike.getAttribute('lng'))
					// console.log(bike.getAttribute('bikes'))



					var marker = new google.maps.Marker({
						position: {lat: parseFloat(e.latitude), lng: parseFloat(e.longitude)},
						map: map,
						icon: pinImage4
					});

					marker.addListener('click', function() {
						infowindow.setContent(
							`<div><b>${e.no}</b></div>
							<div>billingid: ${e.billingId}</div>

							
															`)
						infowindow.open(map, marker);
					});

					// pins3.push(marker)

				})
				// console.log(xm)
			}
		)
*/
}