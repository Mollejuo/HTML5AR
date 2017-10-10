var scene,camera,renderer,controls;
var pois=[];
var cube;
var found=0;
var degree=0; 
var watchGeoID=null;
window.compassslow=0;

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
    var cubeGeometry = new THREE.BoxGeometry(12,12,12);  
	
	for(var i=0;i<pin.length;i++){
		var c=(i+5)/100 * 0xffffff;
		var cubeMaterial = new THREE.MeshBasicMaterial({color: c}); 
		cube = new THREE.Mesh(cubeGeometry,cubeMaterial);
		//cube.castShadow = true;
		cube.position.x = pin[i].x*100;//2;
		cube.position.y =Math.abs(pin[i].y*100000);//20;
		cube.position.z = 0;
		scene.add(cube);		
		pois.push(cube);
		//scene.children[i].visible=false;	
	}

	
	function render() {
		requestAnimationFrame( render );
		for(var j=0;j<pois.length;j++){
			pois[j].rotation.x += 0.03;
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
	
 }   
};




