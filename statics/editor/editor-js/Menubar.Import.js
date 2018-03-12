/**
 * @author mrdoob / http://mrdoob.com/
 */

Menubar.Import = function ( editor ) {

	var container = new UI.Panel();
	container.setClass( 'menu' );

	var title = new UI.Panel();
	title.setClass( 'title' );
	title.setTextContent( '导入' );
	container.add( title );

	var options = new UI.Panel();
	options.setClass( 'options' );
	container.add( options );

	//

	var meshCount = 0;
	var lightCount = 0;
	var cameraCount = 0;

	editor.signals.editorCleared.add( function () {

		meshCount = 0;
		lightCount = 0;
		cameraCount = 0;

	} );

	var option = new UI.Row();
	option.setClass( "option" );
	option.setTextContent( "盆骨模型" );
	option.onClick( function() {
		var host_name = window.location.origin;
		var folder_name = "/static/models/";
		var url = host_name + folder_name + "pelvis.stl";

		var loader = new THREE.STLLoader();
		loader.load( url, function ( geometry ) {
			
			var material = new THREE.MeshLambertMaterial( {color: 0xF5DA81} );
			var mesh = new THREE.Mesh( geometry, material );
			mesh.name = "盆骨模型";

			geometry.computeBoundingBox();

			var bb = geometry.boundingBox;
			// 计算得出以毫米为单位的计量
			var object3DWidth  = bb.max.x - bb.min.x;
			var object3DHeight = bb.max.y - bb.min.y;
			var object3DDepth  = bb.max.z - bb.min.z;
			console.log("pelvis width: " + object3DWidth);
			console.log("pelvis height: " + object3DHeight);
			console.log("pelvis depth: " + object3DDepth);

			var scale_x = 0.0;
			
			if (object3DWidth > 0 && object3DWidth < 10) {
				scale_x = 0.5;
			}
			else {
				scale_x = 0.1;
			}
			mesh.scale.set( scale_x, scale_x, scale_x );
			mesh.position.set( -10.0, 3, -5 );
			mesh.rotation.y = Math.PI / 4;
			
			editor.execute( new AddObjectCommand( mesh ) );
		});
	});

	options.add(option);



	// 髋臼杯组合

	var option = new UI.Row();
	option.setClass( 'option' );
	option.setTextContent( '髋臼杯' );
	option.onClick( function () {
		const host_name = window.location.origin;
    	const folder_name = "/static/models/";
		var url = host_name + folder_name + "acetabular cup.stl";

		var loader = new THREE.STLLoader();
		loader.load( url, function ( geometry ) {

			// var localPlane = new THREE.Plane( new THREE.Vector3( 0, -1, 0 ), 0.5 );

			var material = new THREE.MeshPhongMaterial( {
				color: 0xABDCFF,
				shininess: 100,
				side: THREE.DoubleSide,
				// ***** Clipping setup (material): *****
				// clippingPlanes: [ localPlane ],
				clipShadows: true
			});
			var mesh = new THREE.Mesh( geometry, material );
			mesh.name = "髋臼杯";
			mesh.castShadow = true;

			geometry.computeBoundingBox();

			var bb = geometry.boundingBox;
			// 计算得出以毫米为单位的计量
			var object3DWidth  = bb.max.x - bb.min.x;
			var object3DHeight = bb.max.y - bb.min.y;
			var object3DDepth  = bb.max.z - bb.min.z;
			console.log("width: " + object3DWidth);
			console.log("height: " + object3DHeight);
			console.log("depth: " + object3DDepth);

			var scale_x = 0.0;
			
			if (object3DWidth > 0 && object3DWidth < 10) {
				scale_x = 0.5;
			}
			else {
				scale_x = 0.1;
			}
			mesh.scale.set( scale_x, scale_x, scale_x );
			mesh.position.set( 0, 0, 0 );
			/*
			mesh.rotation.x = - ((Math.PI / 180) * 150.42);
			mesh.rotation.y = - ((Math.PI / 180) * 1.82);
			mesh.rotation.z = Math.PI / 180 * 68.0;*/
			mesh.rotation.set(0, 0, 0);

			editor.execute( new AddObjectCommand( mesh ) );

		});
		
	} );
	options.add( option );

	//

	options.add( new UI.HorizontalRule() );

	// 髋关节植入体

	var option = new UI.Row();
	option.setClass( 'option' );
	option.setTextContent( '髋关节植入体' );
	option.onClick( function () {
		var host_name = window.location.origin;
    	var folder_name = "/static/models/";
		var url = host_name + folder_name + "hip implant.stl";

		

		var loader = new THREE.STLLoader();
		loader.load( url, function ( geometry ) {
			var material = new THREE.MeshLambertMaterial({color: 0xABDCFF});
			var mesh = new THREE.Mesh( geometry, material );
			mesh.name = "髋关节植入体";

			geometry.computeBoundingBox();

			var bb = geometry.boundingBox;
			// 计算得出以毫米为单位的计量
			var object3DWidth  = bb.max.x - bb.min.x;
			var object3DHeight = bb.max.y - bb.min.y;
			var object3DDepth  = bb.max.z - bb.min.z;
			console.log("hip implant width: " + object3DWidth);
			console.log("hip implant height: " + object3DHeight);
			console.log("hip implant depth: " + object3DDepth);

			var scale_x = 0.0;
			
			if (object3DWidth > 0 && object3DWidth < 10) {
				scale_x = 0.5;
			}
			else {
				scale_x = 0.1;
			}

			mesh.scale.set( scale_x, scale_x, scale_x );
			mesh.position.set( -0.59, 4.29, -1.86 );
			mesh.rotation.y = -(Math.PI / 2);


			
			editor.execute( new AddObjectCommand( mesh ) );
		});


		

	} );
	options.add( option );

	
	options.add( new UI.HorizontalRule() );

	// 截面
	var option = new UI.Row();
	option.setClass( "option" );
	option.setTextContent( "截面" );
	option.onClick( function() {
		var plane_width = 6;
		var plane_height = 6;
		var plane_geometry = new THREE.PlaneGeometry( plane_width, plane_height );
		var plane_material = new THREE.MeshBasicMaterial( {color: 0xA9E2F3, opacity: 0.5, transparent: true, side: THREE.DoubleSide} );
		var plane_mesh = new THREE.Mesh( plane_geometry, plane_material );
		plane_mesh.position.set( 0, 0, 0 );
		plane_mesh.rotation.x = Math.PI / 4;
		plane_mesh.rotation.y = Math.PI / 2;
		//plane_mesh.name = "截面" + ( ++meshCount );
		plane_mesh.name = "截面";
		editor.execute( new AddObjectCommand( plane_mesh ) );
	} );
	options.add( option ); 

	options.add( new UI.HorizontalRule() );
	
	// AmbientLight

	var option = new UI.Row();
	option.setClass( 'option' );
	option.setTextContent( '环境光' );
	option.onClick( function () {

		var color = 0xFFFFFF;
		var intensity = 1;

		var light = new THREE.AmbientLight( color, intensity );
		light.name = '环境光 ' + ( ++lightCount );
		//light.target.name = '环境光 ' + ( lightCount ) + ' Target';

		light.position.set( 20, 20, 7.5 );

		editor.execute( new AddObjectCommand( light ) );

	} );
	options.add( option );

	// DirectionalLight
	var option = new UI.Row();
	option.setClass( 'option' );
	option.setTextContent( '平行光' );
	option.onClick( function () {

		var color = 0xFFFFFF;
		var intensity = 1;

		var light = new THREE.DirectionalLight( color, intensity );
		light.name = '平行光 ' + ( ++lightCount );
		light.target.name = '平行光 ' + ( lightCount ) + ' Target';

		light.position.set( 5, 10, 7.5 );

		editor.execute( new AddObjectCommand( light ) );

	} );
	options.add( option );

	// HemisphereLight
	var option = new UI.Row();
	option.setClass( 'option' );
	option.setTextContent( '半球光' );
	option.onClick( function () {

		var sky_color = 0xFFFFBB;
		var ground_color = 0x080820;
		var intensity = 1;

		var light = new THREE.HemisphereLight( sky_color, ground_color, intensity );
		light.name = '半球光 ' + ( ++lightCount );

		light.position.set( 15, 15, 17.5 );

		editor.execute( new AddObjectCommand( light ) );

	} );
	options.add( option );

	// SpotLight
	var option = new UI.Row();
	option.setClass( 'option' );
	option.setTextContent( '聚光灯' );
	option.onClick( function () {

		var spotLight = new THREE.SpotLight( 0xffffff );
		spotLight.position.set( 60, 100, 100 );

		spotLight.castShadow = true;

		spotLight.shadow.mapSize.width = 1024;
		spotLight.shadow.mapSize.height = 1024;

		spotLight.shadow.camera.near = 500;
		spotLight.shadow.camera.far = 4000;
		spotLight.shadow.camera.fov = 30;

		spotLight.name = '聚光灯 ' + ( ++lightCount );
		spotLight.target.name = '聚光灯 ' + ( lightCount ) + ' Target';


		editor.execute( new AddObjectCommand( spotLight ) );

	} );
	options.add( option );



	return container;

};
