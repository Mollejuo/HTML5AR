var scene,camera,renderer,controls,raycaster,mouse,indicator;
var pois=[];
var cube;
var found=0;
var degree=0; 
var watchGeoID=null;
window.compassslow=0;
var pin_index=1;
var strDownloadMime = "image/octet-stream";
var pin=[{"name":"N Block", "lat":31.477228, "lng":74.311368}];
var tapped=false;
function ecef(lat,lon){
	var R=1000;
	var x = R * Math.cos(lat) * Math.cos(lon);
	var y = R * Math.cos(lat) * Math.sin(lon);
	var z = R *Math.sin(lat);
	return {x:x,y:y,z:z};
}

var AR={
initAr:function(){
	scene = new THREE.Scene();
	camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
	//controls = new THREE.DeviceOrientationControls( camera );
	
	renderer = new THREE.WebGLRenderer( { alpha: true ,preserveDrawingBuffer: true} );


	renderer.shadowMapEnabled = true;
	renderer.shadowMapSoft = true;   
	// camera.position.x = -30;
	// camera.position.y = 40;
	// camera.position.z = 30;
	camera.lookAt(scene.position);
	
	var textureLoader = new THREE.TextureLoader();
	
	var texture0 = textureLoader.load( 'textures/1.png' );
	var texture1 = textureLoader.load( 'textures/2.png' );
	var texture2 = textureLoader.load( 'textures/3.png' );
	var texture3 = textureLoader.load( 'textures/4.png' );
	var texture4 = textureLoader.load( 'textures/5.png' );
	var texture5 = textureLoader.load( 'textures/6.png' );
	
	var materials = [
		new THREE.MeshBasicMaterial( { map: texture0 } ),
		new THREE.MeshBasicMaterial( { map: texture1 } ),
		new THREE.MeshBasicMaterial( { map: texture2 } ),
		new THREE.MeshBasicMaterial( { map: texture3 } ),
		new THREE.MeshBasicMaterial( { map: texture4 } ),
		new THREE.MeshBasicMaterial( { map: texture5 } )
	];
	
	var geometry = new THREE.BoxGeometry( 10, 10, 10 );

	raycaster = new THREE.Raycaster();
    mouse = new THREE.Vector2();


	document.addEventListener('mousedown', onDocumentMouseDown, false);
	//document.addEventListener('touchstart', onDocumentTouchStart, false);

	function onDocumentMouseDown( event ) {	
			//event.preventDefault();
			if(!tapped){		
				mouse.x = ( event.clientX / renderer.domElement.clientWidth ) * 2 - 1;
				mouse.y = - ( event.clientY / renderer.domElement.clientHeight ) * 2 + 1;		
				raycaster.setFromCamera( mouse, camera );	
				var dir = raycaster.ray.direction;
				var mesh = new THREE.Mesh( geometry, materials );	
				mesh.position.x =dir.x*100;
				mesh.position.y =dir.y*100;
				mesh.position.z = dir.z*100;	
				scene.add( mesh );		
				$('.buttons').show();
				var objects=scene.children;	
				var intersects = raycaster.intersectObjects( objects ); 		
				if ( intersects.length > 0 ) {		
							
				}	
			}	
			tapped=true;
	}

	function onDocumentTouchStart(event) {
        event.preventDefault();
        event.clientX = event.touches[0].clientX;
        event.clientY = event.touches[0].clientY;
        onDocumentMouseDown(event);
    }

	
	function render() {
		requestAnimationFrame( render );
		for(var j=0;j<pois.length;j++){
			//pois[j].rotation.x -= 0.03;
			//pois[j].rotation.y -= 0.03;
			//pois[j].rotation.z += 0.03;
		
		}		
		renderer.render( scene, camera );					
	}
	render();
	//renderer.setClearColor(0xEEEEEE,1);
	renderer.setSize(window.innerWidth,window.innerHeight);
	document.body.appendChild(renderer.domElement);
	renderer.render(scene,camera);   
	

	// scene.children.map(function(item){
	// 		return item.visible=false;
	// });
	
 }   
};

function plus(){
	scene.children[0].scale.x+=0.2;
	scene.children[0].scale.y+=0.2;
	scene.children[0].scale.z+=0.2;
}
function minus(){
	scene.children[0].scale.x-=0.2;
	scene.children[0].scale.y-=0.2;
	scene.children[0].scale.z-=0.2;
}


function saveAsImage() {   
	var image_width=window.innerWidth, image_height=window.innerHeight;
	var canvas = document.getElementById('canvas');
	canvas.width=image_width;
	canvas.height = image_height;

	var context = canvas.getContext('2d');
	var video = document.getElementById('camera');
	context.drawImage(video, 0, 0, image_width, image_height);
	context.drawImage(renderer.domElement, 0, 0,image_width, image_height);
	var strMime = "image/jpeg";
	try {
	    imgData = canvas.toDataURL(strMime);
	    var strData=imgData.replace(strMime, strDownloadMime);
	    var filename="screenshot.jpg";
	    var link = document.createElement('a');
	    if (typeof link.download === 'string') {
		    document.body.appendChild(link); //Firefox requires the link to be in the body
	        link.download = filename;
	        link.href = strData;
	        link.click();
	        document.body.removeChild(link); //remove the link when done
		} else {
		    location.replace(uri);
	    }
	} catch (e) {
        console.log(e);
        return;
    }


}


AR.initAr();


