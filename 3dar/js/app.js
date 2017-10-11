var pin = [];        
var markersArray = [], bounds;
var myLat = 0, myLng = 0; 
var bearing, distance;
var dataStatus = 0; 
var deviceorientationinterval=null;  
var compassstatus=true;
var c=0;
// setup map and listen to deviceready        
$( document ).ready(function() {
    $.get('js/data.json',function(data){
        pin=data;
    }).complete(function (data) {
         onDeviceReady();
    });   

});
// start device compass, accelerometer and geolocation after deviceready        
function onDeviceReady() {
    setupMap();
    startAccelerometer();
    startCompass();    
    startGeolocation();
}

// setup google maps api        
function setupMap(){
    $("#map").height($(window).height()-60);
    var mapOptions = {
        zoom: 13,
        mapTypeControl: false,
        streetViewControl: false,
        navigationControl: true,
        scrollwheel: false,
        navigationControlOptions: {style: google.maps.NavigationControlStyle.SMALL},
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    map = new google.maps.Map(document.getElementById("map"), mapOptions);
}        
// toggle between list view and map view        
function toggleView(){
    if($(".listView").is(":visible")){
        $(".listView").hide();
        $("#map").height($(window).height()-60);
        $(".mapView").fadeIn(
            function(){
                google.maps.event.trigger(map, "resize");
                map.fitBounds(bounds);});
        $("#viewbtn").html("List");
    } else {
        $(".mapView").hide();
        $(".listView").fadeIn();
        $("#viewbtn").html("Map");
    }
}
// get data from API and store in array, add to list view and create markers on map, calculate         
function loadData(){
    dataStatus = "loading";
    markersArray = [];
    bounds = new google.maps.LatLngBounds();
    // add blue gps marker
    var icon = new google.maps.MarkerImage('http://www.google.com/intl/en_us/mapfiles/ms/micons/blue-dot.png',new google.maps.Size(30, 28),new google.maps.Point(0,0),new google.maps.Point(9, 28));
    var gpsMarker = new google.maps.Marker({position: new google.maps.LatLng(myLat, myLng), map: map, title: "My Position", icon:icon});
    bounds.extend(new google.maps.LatLng(myLat, myLng));
    markersArray.push(gpsMarker);
    // add all location markers to map and list view and array
    for(var i=0; i< pin.length; i++){
        $(".listItems").append("<div class='item'>"+pin[i].name+"</div>");
        addMarker(i);
        relativePosition(i);
    }
    map.fitBounds(bounds);
    google.maps.event.trigger(map, "resize");
    dataStatus = "loaded";   
    AR.initAr();
}
// add marker to map and in array        
function addMarker(i){
    var marker = new google.maps.Marker({position: new google.maps.LatLng(pin[i].lat, pin[i].lng), map: map, title: pin[i].name});
    bounds.extend(new google.maps.LatLng(pin[i].lat, pin[i].lng));
    markersArray.push(marker);
} 
// clear all markers from map and array        
function clearMarkers() {
    while (markersArray.length) {
        markersArray.pop().setMap(null);
    }
}        
// calulate distance and bearing value for each of the points wrt gps lat/lng        
function relativePosition(i){
    var pinLat = pin[i].lat;
    var pinLng = pin[i].lng;
    var dLat = (myLat-pinLat)* Math.PI / 180;
    var dLon = (myLng-pinLng)* Math.PI / 180;
    var lat1 = pinLat * Math.PI / 180;
    var lat2 = myLat * Math.PI / 180;
    var y = Math.sin(dLon) * Math.cos(lat2);
    var x = Math.cos(lat1)*Math.sin(lat2) - Math.sin(lat1)*Math.cos(lat2)*Math.cos(dLon);
    bearing = Math.atan2(y, x) * 180 / Math.PI;
    bearing = bearing + 180;
    pin[i]['bearing'] = bearing;    
    var a = Math.sin(dLat/2) * Math.sin(dLat/2) + Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(lat1) * Math.cos(lat2); 
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    distance = 3958.76  * c;
    pin[i]['distance'] = distance;   
 
    pin[i]['x'] = x;
    pin[i]['y'] = y;
    
}
// calculate direction of points and display        
function calculateDirection(degree){
    
    var detected = 0;
    var f=0;
    if(compassstatus==false){
        setTimeout(function(){
            compassstatus=true;
            document.getElementById('log').innerHTML = c++;
        },150);
        return;
    }
    $("#spot").html("");    
    for(var i=0;i<pin.length;i++){
        var bearing=parseFloat(pin[i].bearing);
        var t=Math.abs(bearing - degree);
        if(t <= 40){
            var bt=degree+45;
            document.getElementById('info').innerHTML = bt;
            //$('#direction-arrow').html(degree).show();
            $('#direction-arrow').find('img').css({
                '-ms-transform': 'rotate('+bt+'deg)',
                '-webkit-transform': 'rotate('+bt+'deg)',
                'transform': 'rotate('+bt+'deg)'
            });
            $('#direction-arrow').show();
        }
        f=1;
        if(t <= 40){
            detected = 1;
            scene.children[i].position.x=(pin[i].bearing - degree)/pin.length;
            scene.children[i].visible=true;
        } else {
           
           if(scene && scene.children.length>=i)
              scene.children[i].visible=false;
            if(!detected){
                $("#spot").html("");
            }
        }
    }
    compassstatus=false;

}
function get3dhtml(){
    return "<a-scene embedded arjs='sourceType: webcam;'>"+
            "<a-box position='0 0.2 0' material='opacity: 0.5;'></a-box>"+
            "<a-marker-camera preset='hiro'></a-marker-camera>"+
            "</a-scene>";
    return '<iframe style="float:left;" src="d3.php" width="100" height="100" frameborder="0" allowfullscreen="true"></iframe>';
}
$(document).on('click','.poi',function(e){

    var i=$(this).attr('data-i');
    var poi_detail=pin[i];
    var dist=poi_detail.distance.toFixed(3);
    $('#poi-name').html(poi_detail.name);
    $('#poi-distance').html(dist+" miles away");
    $('#poi-lat').html(poi_detail.lat);
    $('#poi-lon').html(poi_detail.lng);
    //alert(name);
     $('#poi-detail').animate({
        "left": "0px",
        "width":$(window).width(),
        "height":$(window).height()
    }, "slow");

});

$(document).on('click','.poi-close',function(){
    $('#poi-detail').animate({
        "left": "-1000px"
    }, "slow");
});
// Start watching the geolocation        
function startGeolocation(){
    var options = { timeout: 30000 };
    watchGeoID = navigator.geolocation.watchPosition(onGeoSuccess, onGeoError, options);
}
        
// Stop watching the geolocation
function stopGeolocation() {
    if (watchGeoID) {
        navigator.geolocation.clearWatch(watchGeoID);
        watchGeoID = null;
    }
}
        
// onSuccess: Get the current location
function onGeoSuccess(position) {
    document.getElementById('geolocation').innerHTML = 'Latitude: ' + position.coords.latitude + '<br />' + 'Longitude: ' + position.coords.longitude;
    myLat = position.coords.latitude;
    myLng = position.coords.longitude;
    if(!dataStatus){
        loadData();
    }
}
// onError: Failed to get the location
function onGeoError() {
    document.getElementById('log').innerHTML += "onError=.";
} 
    
// Start watching the compass
var old_compass_degree=0;
var jkk=0;
var compass_process=true;
function startCompass() {
    if (window.DeviceOrientationEvent) {
        window.addEventListener('deviceorientation', onCompassSuccess,true);                 
    }   
}
// Stop watching the compass
function stopCompass() {
    if (watchCompassID) {
        navigator.compass.clearWatch(watchCompassID);
        watchCompassID = null;
    }
}
// onSuccess: Get the current heading
function onCompassSuccess(eventdata) {
    if(event.webkitCompassHeading) {                      
        compassdir = event.webkitCompassHeading;  
    }else{
        compassdir = event.alpha; 
    }                
    var directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW', 'N'];
    var direction = directions[Math.abs(parseInt((compassdir) / 45) + 1)];
    document.getElementById('compass').innerHTML = compassdir + "<br>" + direction;
    //document.getElementById('direction').innerHTML = direction;
    var degree = Math.round(compassdir);                  
    calculateDirection(degree);                 
  }
// onError: Failed to get the heading
function onCompassError(compassError) {
    document.getElementById('log').innerHTML += "onError=."+compassError.code;
}        
        
// Start checking the accelerometer
function startAccelerometer() {
    if(window.DeviceMotionEvent){
        window.addEventListener("devicemotion", onAccelerometerSuccess, false);
    }
}
// Stop checking the accelerometer
function stopAccelerometer() {
    if (watchAccelerometerID) {
        navigator.accelerometer.clearWatch(watchAccelerometerID);
        watchAccelerometerID = null;
    }
}
// onSuccess: Get current accelerometer values
function onAccelerometerSuccess(acceleration) {
    // for debug purpose to print out accelerometer values
    var element = document.getElementById('accelerometer');
    element.innerHTML = 'Acceleration X: ' + acceleration.accelerationIncludingGravity.x + '<br />' +
                        'Acceleration Y: ' + acceleration.accelerationIncludingGravity.y + '<br />' +
                        'Acceleration Z: ' + acceleration.accelerationIncludingGravity.z ;
    if(acceleration.accelerationIncludingGravity.y > 7){
        $("#arView").fadeIn();
        $("#topView").hide();
        document.getElementById('body').style.background = "#d22";
        document.getElementById('body').style.background = "transparent";
    } 
}
// onError: Failed to get the acceleration
function onAccelerometerError() {
    document.getElementById('log').innerHTML += "onError.";
}

