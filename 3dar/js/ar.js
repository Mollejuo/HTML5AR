var scene,camera,renderer,controls,raycaster,mouse,indicator;
var pois=[];
var cube;
var found=0;
var degree=0; 
var watchGeoID=null;
window.compassslow=0;
var pin_index=1;
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
	
	renderer = new THREE.WebGLRenderer( { alpha: true } );


	renderer.shadowMapEnabled = true;
	renderer.shadowMapSoft = true;   
	camera.position.x = -30;
	camera.position.y = 40;
	camera.position.z = 30;
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

	for(var i=0;i<pin.length;i++){		
		// Combine the geometry and material into a mesh
		var mesh = new THREE.Mesh( geometry, materials );	
		mesh.position.x =pin[i].x;//2;
		mesh.position.y =pin[i].y;//20;
		mesh.position.z = 0;
		mesh.name=pin[i].name;
		mesh.pinData=pin[i];
		mesh.callback = function() { alert(this.name); };
		// Add the mesh to the scene		
		scene.add( mesh );
		pois.push(scene.children[i]);
	}

	raycaster = new THREE.Raycaster();
    mouse = new THREE.Vector2();
	document.addEventListener('mousedown', onDocumentMouseDown, false);
	document.addEventListener('touchstart', onDocumentTouchStart, false);

	function onDocumentMouseDown( event ) {		
			event.preventDefault();		
			mouse.x = ( event.clientX / renderer.domElement.clientWidth ) * 2 - 1;
			mouse.y = - ( event.clientY / renderer.domElement.clientHeight ) * 2 + 1;		
			raycaster.setFromCamera( mouse, camera );	
			var objects=scene.children;	
			var intersects = raycaster.intersectObjects( objects ); 		
			if ( intersects.length > 0 ) {		
				intersects[0].object.callback();		
			}		
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
			pois[j].rotation.x -= 0.03;
			//pois[j].rotation.y -= 0.03;
			pois[j].rotation.z += 0.03;
		
		}		
		renderer.render( scene, camera );					
	}
	render();
	//renderer.setClearColor(0xEEEEEE,1);
	renderer.setSize(window.innerWidth,window.innerHeight);
	document.body.appendChild(renderer.domElement);
	renderer.render(scene,camera);   
	

	scene.children.map(function(item){
			return item.visible=false;
	});

	// var map = new THREE.TextureLoader().load( "images/indi.png" );
	// var material = new THREE.SpriteMaterial( { map: map, color: 0xffffff, fog: true } );
	// var sprite = new THREE.Sprite( material );
	// sprite.position.y=33;
	// sprite.scale.x = 3;
	// sprite.scale.y = 3;
	// var l=scene.children.length;
	// scene.add( sprite );
	// indicator=scene.children[l];


	// var gm = new THREE.BoxGeometry( 10, 10, 10 );
	// indicator = new THREE.Mesh( gm, new THREE.MeshBasicMaterial( { color: 0x444444 } ) );	
	// indicator.position.y=33;
	// var l=scene.children.length;
	// scene.add( indicator );
	// indicator=scene.children[l];
	
 }   
};




