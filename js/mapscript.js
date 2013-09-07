var map;
var hasStarted = false; // if hasStarted is true, user can now input amenities choices
var choices_latlon = []; // User's input of amenities location in lat and lon
var houses_latlon = []; // Houses' lat and lon that are scraped

/** START CONTROL BUTTON */
function StartControl(controlDiv, map) {

  controlDiv.style.padding = '3px';
  controlDiv.style.backgroundColor = 'white';

  // Set CSS for the Start button border
  var controlUI = document.createElement('div');
  controlUI.setAttribute ("id", "start-button");
  
  /* unnecessary now, all in css
  controlUI.style.backgroundColor = 'white';
  controlUI.style.borderStyle = 'dotted';
  controlUI.style.borderWidth = '2px';
  controlUI.style.opacity = '0.7';
  controlUI.style.cursor = 'pointer';
  controlUI.style.textAlign = 'center';
  */
  
  controlUI.title = 'Click to start adding points';
  controlDiv.appendChild(controlUI);

  // Set CSS for the Start button text
  var controlText = document.createElement('div');
  controlText.setAttribute ("id", "start-button-smaller");
  
  /* unnecessary now, all in css
  controlText.style.fontFamily = 'Arial,sans-serif';
  controlText.style.fontSize = '14px';
  controlText.style.paddingLeft = '4px';
  controlText.style.paddingRight = '4px';
  */
  
  controlText.innerHTML = '<b>Start</b>';
  controlUI.appendChild(controlText);

  // Setup the click event listeners
  google.maps.event.addDomListener(controlUI, 'click', function() {
  if (!hasStarted) {
    controlText.innerHTML = '<b>End</b>';
    }
	else {
		controlText.innerHTML = '<b>Start</b>';
		// After clicking end the panel of suggested locations will slide out from the side
	}
	hasStarted = !hasStarted;
  });
  
  google.maps.event.addDomListener(controlUI, 'mouseover', function() {
  	controlUI.style.opacity = '1.0';
  });
  
    google.maps.event.addDomListener(controlUI, 'mouseout', function() {
  	controlUI.style.opacity = '0.7';
  });
  }

/** PLACE MARKER MODE */
function placeMarker(position, map) {
if (hasStarted) {
  var marker = new google.maps.Marker({
    position: position,
    map: map,
    draggable: false,
    animation: google.maps.Animation.DROP
  });
  map.panTo(position);
	choices_latlon.push(position);
  }
}

/** DISPLAY HOUSE MARKER */
function displayHouseMarker(position, map) {
	var marker = new google.maps.Marker({
    position: position,
    map: map
  });
}

/** GEOCODING OF SCRAPED DATA */
d3.csv("data/sublets.csv", function(housedata) {

// As of now, we will read in data from a file. We hope to do it from the server.
for (var i = 0; i < housedata.length; i++) {
	var geocoder = new google.maps.Geocoder();
	var address = housedata[i].address + ", Pennsylvania";

	geocoder.geocode( { 'address': address}, function(results, status) {

  		if (status == google.maps.GeocoderStatus.OK) {
   		 var latitude = results[0].geometry.location.lat();
  		  var longitude = results[0].geometry.location.lng();
  		  var house_position = new google.maps.LatLng(latitude,longitude);
 		  	displayHouseMarker(house_position, map);

 		  	houses_latlon.push(house_position);
 		 }  
	}); 
	}
});
function initialize() {
  var mapOptions = {
    zoom: 16,
    center: new google.maps.LatLng(39.9539, -75.1930),
    mapTypeId: google.maps.MapTypeId.ROADMAP
  };
  map = new google.maps.Map(document.getElementById('map-canvas'),
      mapOptions);

	// Place Marker event
  google.maps.event.addListener(map, 'click', function(e) {
if (hasStarted) {
	var geocoder = new google.maps.Geocoder();
	geocoder.geocode({'latLng': e.latLng}, function(results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
          if (results[1]) {
    var newDiv = "<h3>" +results[1].formatted_address + "</h3><div><p><label>Importance:</label></p></div>";
    $('#locationsdiv').append(newDiv)
    $('#locationsdiv').accordion("refresh");
            }
        } else {
           alert("Geocoder failed due to: " + status);
       }
    });
}
    placeMarker(e.latLng, map);
  });
  
   // Start Control Button clicked event
  var StartControlDiv = document.createElement('div');
  StartControlDiv.setAttribute ("id", "start-button-bigger");
  var startControl = new StartControl(StartControlDiv, map);
  StartControlDiv.index = 1;
  map.controls[google.maps.ControlPosition.BOTTOM_CENTER].push(StartControlDiv);
  

}
google.maps.event.addDomListener(window, 'load', initialize);

