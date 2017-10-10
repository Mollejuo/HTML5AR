var ar=null;
function startAr(){	
		console.log('start ar');
	 ar = new AugmentedRealityViewer(function(here, callback) {
	    var xhr = new XMLHttpRequest();
	    xhr.open("GET", "js/data.json", true);
	    xhr.onload = function() { 
		try {
		    var data = JSON.parse(xhr.responseText);
		    callback(data);
		} catch (e) {
		    console.log(e);
		}	
	    };
	    xhr.send();
	});
	ar.setViewer(document.getElementById('camera'));
}

$(document).ready(function(){
	startAr();
});


$(window).on('resize orientationchange webkitfullscreenchange mozfullscreenchange fullscreenchange',  function(e){
	$('canvas').remove();
	startAr();
	start();	
	//alert("here");
});


