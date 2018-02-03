var camera, scene, renderer;
var cube, sphere, torus, material;

var count = 0, cubeCamera1, cubeCamera2;
var lon = 0, lat = 0;
var phi = 0, theta = 0;

var textureLoader = new THREE.TextureLoader();
textureLoader.load( './static/img/textures/2294472375_24a3b8ef46_o.jpg', function ( texture ) {
	texture.mapping = THREE.UVMapping;
	init( texture );
	animate();
} );

function init( texture ) {
    camera = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 1, 1000 );
   
	scene = new THREE.Scene();
    
    var mesh = new THREE.Mesh( new THREE.SphereBufferGeometry( 500, 32, 16 ), new THREE.MeshBasicMaterial( { map: texture } ) );
    mesh.geometry.scale( - 1, 1, 1 );
    scene.background = new THREE.Color( 0xFFFFFF );
	// scene.add( mesh );
    
    camera.position.x = 450;
    camera.position.y = 150;
    camera.position.z = 150;
    camera.lookAt( scene.position );


    renderer = new THREE.WebGLRenderer( { antialias: true } );
    renderer.setPixelRatio( window.devicePixelRatio );
    var container = document.getElementById("zs-image-box-3d");
	var height = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
    var width = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
    var container_height = (height - 100) / 2;
    var container_width = (width - 300) / 2 - 2;
                
    renderer.setSize(container_width, container_height);
    
    cubeCamera1 = new THREE.CubeCamera( 1, 1000, 256 );
	cubeCamera1.renderTarget.texture.minFilter = THREE.LinearMipMapLinearFilter;
	scene.add( cubeCamera1 );
    
    cubeCamera2 = new THREE.CubeCamera( 1, 1000, 256 );
	cubeCamera2.renderTarget.texture.minFilter = THREE.LinearMipMapLinearFilter;
	scene.add( cubeCamera2 );
    
    document.getElementById("zs-image-box-3d").appendChild( renderer.domElement );
				//
    //material = new THREE.MeshBasicMaterial( {
	//	envMap: cubeCamera2.renderTarget.texture
    //} );
    
    var spotLight = new THREE.SpotLight(0xffffff);
    spotLight.position.set(450, 150, 150);
    scene.add(spotLight);


    material = new THREE.MeshLambertMaterial({color: 0xABDCFF});

	sphere = new THREE.Mesh( new THREE.IcosahedronBufferGeometry( 20, 3 ), material );
	//scene.add( sphere );
	//cube = new THREE.Mesh( new THREE.BoxBufferGeometry( 20, 20, 20 ), material );
    var loader = new THREE.STLLoader();
    cube = new THREE.Object3D();
    loader.load("./static/models/femur.stl", function (geometry) {
        console.log(geometry);
        cube = new THREE.Mesh( geometry, material );
        cube.scale.set(0.6, 0.6, 0.6);
        scene.add(cube);
    });

    
    torus = new THREE.Mesh( new THREE.TorusKnotBufferGeometry( 10, 5, 100, 25 ), material );
	//scene.add( torus );
    
    
    //
	document.addEventListener( 'mousedown', onDocumentMouseDown, false );
	document.addEventListener( 'wheel', onDocumentMouseWheel, false );
    
    window.addEventListener('resize', onWindowResized, false );
}
    

	function onWindowResized( event ) {
		renderer.setSize( window.innerWidth, window.innerHeight );
		camera.aspect = window.innerWidth / window.innerHeight;
		camera.updateProjectionMatrix();
	}
    
    function onDocumentMouseDown( event ) {
        switch (event.which) {
            case 1:
                onLeftMouseDown(event);
                console.log("left button click.");
                break;
            case 3:
                onRightMouseDown(event);
                console.log("Right Button clicked.");
                break;
            default:
                onLeftMouseDown(event);
                console.log("So Wired. But Default is on.");
        }
	}
    
    function onLeftMouseDown(event) {
        event.preventDefault();
		onPointerDownPointerX = event.clientX;
		onPointerDownPointerY = event.clientY;
        
        onPointerDownLon = lon;
		onPointerDownLat = lat;
		document.addEventListener( 'mousemove', onLeftMouseMove, false );
		document.addEventListener( 'mouseup', onLeftMouseUp, false );
    }

    function onRightMouseDown(event) {
        event.preventDefault();
		onPointerDownPointerX = event.clientX;
		onPointerDownPointerY = event.clientY;
        
        onPointerDownLon = lon;
		onPointerDownLat = lat;
		document.addEventListener( 'mousemove', onRightMouseMove, false );
		document.addEventListener( 'mouseup', onRightMouseUp, false );
    }


    function onLeftMouseMove( event ) {
		lon = ( event.clientX - onPointerDownPointerX ) * 0.1 + onPointerDownLon;
        lat = ( event.clientY - onPointerDownPointerY ) * 0.1 + onPointerDownLat;
        
        //camera.position.x += ( event.clientX - onPointerDownPointerX ) * 0.02;
        //camera.position.y += ( event.clientY - onPointerDownPointerY ) * 0.02;
        //camera.update(renderer, scene);
        cube.rotation.y -= ( event.clientX - onPointerDownPointerX ) * 0.00005;
        cube.rotation.x -= ( event.clientY - onPointerDownPointerY ) * 0.00005;
       
	}
    
    function onRightMouseUp( event ) {
		document.removeEventListener( 'mousemove', onRightMouseMove, false );
		document.removeEventListener( 'mouseup', onRightMouseUp, false );
    }
    
    function onRightMouseMove( event ) {
		lon = ( event.clientX - onPointerDownPointerX ) * 0.1 + onPointerDownLon;
        lat = ( event.clientY - onPointerDownPointerY ) * 0.1 + onPointerDownLat;
        
        //camera.position.x += ( event.clientX - onPointerDownPointerX ) * 0.02;
        //camera.position.y += ( event.clientY - onPointerDownPointerY ) * 0.02;
        //camera.update(renderer, scene);
        camera.position.x += ( event.clientX - onPointerDownPointerX ) * 0.005;
        camera.position.y += ( event.clientY - onPointerDownPointerY ) * 0.005;
        camera.position.z += ( event.clientX - onPointerDownPointerX ) * 0.003;
	}
    
    function onLeftMouseUp( event ) {
		document.removeEventListener( 'mousemove', onLeftMouseMove, false );
		document.removeEventListener( 'mouseup', onLeftMouseUp, false );
	}
    
    function onDocumentMouseWheel( event ) {
		var fov = camera.fov + event.deltaY * 0.05;
		camera.fov = THREE.Math.clamp( fov, 10, 75 );
		camera.updateProjectionMatrix();
	}
    
function animate() {
	requestAnimationFrame( animate );
	render();
}

function render() {
	var time = Date.now();
	lon += .15;
	lat = Math.max( - 85, Math.min( 85, lat ) );
	phi = THREE.Math.degToRad( 90 - lat );
    theta = THREE.Math.degToRad( lon );
    
    /*
				cube.position.x = Math.cos( time * 0.001 ) * 30;
				cube.position.y = Math.sin( time * 0.001 ) * 30;
                cube.position.z = Math.sin( time * 0.001 ) * 30;
                */
    cube.position.x = 50;
    cube.position.y = 50;
    cube.position.z = 30;
				//cube.rotation.x += 0.02;
                //cube.rotation.y += 0.03;
    //cube.rotation.x += 0.008;

				torus.position.x = Math.cos( time * 0.001 + 10 ) * 30;
				torus.position.y = Math.sin( time * 0.001 + 10 ) * 30;
				torus.position.z = Math.sin( time * 0.001 + 10 ) * 30;
				torus.rotation.x += 0.02;
				torus.rotation.y += 0.03;
                
                //camera.position.x = 100 * Math.sin( phi ) * Math.cos( theta );
				//camera.position.y = 100 * Math.cos( phi );
				//camera.position.z = 100 * Math.sin( phi ) * Math.sin( theta );
                
                
                //camera.lookAt( scene.position );
				sphere.visible = false;
                // pingpong
                /*
				if ( count % 2 === 0 ) {
					material.envMap = cubeCamera1.renderTarget.texture;
					cubeCamera2.update( renderer, scene );
				} else {
					material.envMap = cubeCamera2.renderTarget.texture;
					cubeCamera1.update( renderer, scene );
                }
                */
				count ++;
				sphere.visible = true;
				renderer.render( scene, camera );
}