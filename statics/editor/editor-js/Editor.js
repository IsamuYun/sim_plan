/**
 * @author mrdoob / http://mrdoob.com/
 */

var Editor = function () {

	this.DEFAULT_CAMERA = new THREE.PerspectiveCamera( 50, 1, 0.1, 10000 );
	this.DEFAULT_CAMERA.name = 'Camera';
	this.DEFAULT_CAMERA.position.set( 20, 10, 20 );
	this.DEFAULT_CAMERA.lookAt( new THREE.Vector3() );

	var Signal = signals.Signal;

	this.signals = {

		// script

		editScript: new Signal(),

		// player

		startPlayer: new Signal(),
		stopPlayer: new Signal(),

		// actions

		showModal: new Signal(),

		// notifications

		editorCleared: new Signal(),

		savingStarted: new Signal(),
		savingFinished: new Signal(),

		themeChanged: new Signal(),

		transformModeChanged: new Signal(),
		snapChanged: new Signal(),
		spaceChanged: new Signal(),
		rendererChanged: new Signal(),

		sceneBackgroundChanged: new Signal(),
		sceneFogChanged: new Signal(),
		sceneGraphChanged: new Signal(),

		cameraChanged: new Signal(),

		geometryChanged: new Signal(),

		objectSelected: new Signal(),
		objectFocused: new Signal(),

		objectAdded: new Signal(),
		objectChanged: new Signal(),
		objectRemoved: new Signal(),

		helperAdded: new Signal(),
		helperRemoved: new Signal(),

		materialChanged: new Signal(),

		scriptAdded: new Signal(),
		scriptChanged: new Signal(),
		scriptRemoved: new Signal(),

		windowResize: new Signal(),

		showGridChanged: new Signal(),
		refreshSidebarObject3D: new Signal(),
		historyChanged: new Signal(),

		clipChanged: new Signal(),

	};

	
	this.config = new Config( 'threejs-editor' );
	this.history = new History( this );
	this.storage = new Storage();
	this.loader = new Loader( this );

	this.camera = this.DEFAULT_CAMERA.clone();

	this.scene = new THREE.Scene();
	this.scene.name = 'Scene';
	this.scene.background = new THREE.Color( 0xFFFFFF );

	this.sceneHelpers = new THREE.Scene();

	this.object = {};
	this.geometries = {};
	this.materials = {};
	this.textures = {};
	this.scripts = {};

	this.selected = null;
	this.helpers = {};

};

Editor.prototype = {

	setTheme: function ( value ) {

		document.getElementById( 'theme' ).href = value;

		this.signals.themeChanged.dispatch( value );

	},

	//

	setScene: function ( scene ) {

		this.scene.uuid = scene.uuid;
		this.scene.name = scene.name;

		if ( scene.background !== null ) this.scene.background = scene.background.clone();
		if ( scene.fog !== null ) this.scene.fog = scene.fog.clone();

		this.scene.userData = JSON.parse( JSON.stringify( scene.userData ) );

		// avoid render per object

		this.signals.sceneGraphChanged.active = false;

		while ( scene.children.length > 0 ) {

			this.addObject( scene.children[ 0 ] );

		}

		

		this.signals.sceneGraphChanged.active = true;
		this.signals.sceneGraphChanged.dispatch();

		


	},

	//

	addObject: function ( object ) {

		var scope = this;

		object.traverse( function ( child ) {

			if ( child.geometry !== undefined ) {
				scope.addGeometry( child.geometry );
			}
			if ( child.material !== undefined ) {
				scope.addMaterial( child.material );
			}
			scope.addHelper( child );

		} );

		this.scene.add( object );

		
		this.signals.objectAdded.dispatch( object );
		this.signals.sceneGraphChanged.dispatch();

	},

	moveObject: function ( object, parent, before ) {

		if ( parent === undefined ) {

			parent = this.scene;

		}

		parent.add( object );

		// sort children array

		if ( before !== undefined ) {

			var index = parent.children.indexOf( before );
			parent.children.splice( index, 0, object );
			parent.children.pop();

		}

		this.signals.sceneGraphChanged.dispatch();

	},

	nameObject: function ( object, name ) {

		object.name = name;
		this.signals.sceneGraphChanged.dispatch();

	},

	removeObject: function ( object ) {

		if ( object.parent === null ) return; // avoid deleting the camera or scene

		var scope = this;

		object.traverse( function ( child ) {

			scope.removeHelper( child );

		} );

		object.parent.remove( object );

		this.signals.objectRemoved.dispatch( object );
		this.signals.sceneGraphChanged.dispatch();

	},

	addGeometry: function ( geometry ) {

		this.geometries[ geometry.uuid ] = geometry;

	},

	setGeometryName: function ( geometry, name ) {

		geometry.name = name;
		this.signals.sceneGraphChanged.dispatch();

	},

	addMaterial: function ( material ) {

		this.materials[ material.uuid ] = material;

	},

	setMaterialName: function ( material, name ) {

		material.name = name;
		this.signals.sceneGraphChanged.dispatch();

	},

	addTexture: function ( texture ) {

		this.textures[ texture.uuid ] = texture;

	},

	//

	addHelper: function () {

		var geometry = new THREE.SphereBufferGeometry( 2, 4, 2 );
		var material = new THREE.MeshBasicMaterial( { color: 0xff0000, visible: false } );

		return function ( object ) {

			var helper;

			if ( object instanceof THREE.Camera ) {

				helper = new THREE.CameraHelper( object, 1 );

			} else if ( object instanceof THREE.PointLight ) {

				helper = new THREE.PointLightHelper( object, 1 );

			} else if ( object instanceof THREE.DirectionalLight ) {

				helper = new THREE.DirectionalLightHelper( object, 1 );

			} else if ( object instanceof THREE.SpotLight ) {

				helper = new THREE.SpotLightHelper( object, 1 );
				// 2018年3月14日添加
				return;

			} else if ( object instanceof THREE.HemisphereLight ) {

				helper = new THREE.HemisphereLightHelper( object, 1 );

			} else if ( object instanceof THREE.SkinnedMesh ) {

				helper = new THREE.SkeletonHelper( object );

			} else {

				// no helper for this object type
				return;

			}

			var picker = new THREE.Mesh( geometry, material );
			picker.name = 'picker';
			picker.userData.object = object;
			helper.add( picker );

			this.sceneHelpers.add( helper );
			this.helpers[ object.id ] = helper;

			this.signals.helperAdded.dispatch( helper );

		};

	}(),

	removeHelper: function ( object ) {

		if ( this.helpers[ object.id ] !== undefined ) {

			var helper = this.helpers[ object.id ];
			helper.parent.remove( helper );

			delete this.helpers[ object.id ];

			this.signals.helperRemoved.dispatch( helper );

		}

	},

	//

	addScript: function ( object, script ) {

		if ( this.scripts[ object.uuid ] === undefined ) {

			this.scripts[ object.uuid ] = [];

		}

		this.scripts[ object.uuid ].push( script );

		this.signals.scriptAdded.dispatch( script );

	},

	removeScript: function ( object, script ) {

		if ( this.scripts[ object.uuid ] === undefined ) return;

		var index = this.scripts[ object.uuid ].indexOf( script );

		if ( index !== - 1 ) {

			this.scripts[ object.uuid ].splice( index, 1 );

		}

		this.signals.scriptRemoved.dispatch( script );

	},

	getObjectMaterial: function ( object, slot ) {

		var material = object.material;

		if ( Array.isArray( material ) ) {

			material = material[ slot ];

		}

		return material;

	},

	setObjectMaterial: function ( object, slot, newMaterial ) {

		if ( Array.isArray( object.material ) ) {

			object.material[ slot ] = newMaterial;

		} else {

			object.material = newMaterial;

		}

	},

	//

	select: function ( object ) {
		
		if ( this.selected === object ) {
			
			return;
		}

		var uuid = null;

		if ( object !== null ) {
			uuid = object.uuid;
			if ( object.name === "切割预览" )
			{
				return;
			}
		}

		

		this.selected = object;

		this.config.setKey( 'selected', uuid );
		this.signals.objectSelected.dispatch( object );

	},

	selectById: function ( id ) {

		if ( id === this.camera.id ) {

			this.select( this.camera );
			return;

		}

		this.select( this.scene.getObjectById( id, true ) );

	},

	selectByUuid: function ( uuid ) {

		var scope = this;

		this.scene.traverse( function ( child ) {

			if ( child.uuid === uuid ) {

				scope.select( child );

			}

		} );

	},

	deselect: function () {
		this.select( null );
	},

	focus: function ( object ) {

		this.signals.objectFocused.dispatch( object );

	},

	focusById: function ( id ) {

		this.focus( this.scene.getObjectById( id, true ) );

	},

	clear: function () {

		this.history.clear();
		this.storage.clear();

		this.camera.copy( this.DEFAULT_CAMERA );
		this.scene.background.setHex( 0xE6E6E6 );
		this.scene.fog = null;

		var objects = this.scene.children;

		while ( objects.length > 0 ) {

			this.removeObject( objects[ 0 ] );

		}

		this.geometries = {};
		this.materials = {};
		this.textures = {};
		this.scripts = {};

		this.deselect();

		var light = new THREE.AmbientLight( 0xFFFFFF, 0.38 ); // soft white light
		light.name = "环境光";
		light.position.set( 20.0, 20.0, 7.5 );
		this.scene.add( light );

		var spotLight = new THREE.SpotLight( 0xFFFFFF, 0.3 );
		spotLight.position.set( 0, 12.0, 12.0 );
		spotLight.name = "聚光灯";
		
		this.scene.add( spotLight );
		
		var spotLight = new THREE.SpotLight( 0xffffff, 0.3 );
		spotLight.position.set( 0, 12.0, -12.0 );
		spotLight.name = "聚光灯";
		
		this.scene.add( spotLight );
		
		var spotLight = new THREE.SpotLight( 0xffffff, 0.3 );
		spotLight.position.set( 12.0, 12.0, 0.0 );
		spotLight.name = "聚光灯";
		this.scene.add( spotLight );
		
		var spotLight = new THREE.SpotLight( 0xffffff, 0.3 );
		spotLight.position.set( -12.0, 12.0, 0.0 );
		spotLight.name = "聚光灯";
		this.scene.add( spotLight );
		
		// 添加髋臼杯
		const host_name = window.location.origin;
    	const folder_name = "/static/models/";
		var url = host_name + folder_name + "acetabular cup.stl";
		var loader = new THREE.STLLoader();
		
		var onLoadProgress = function (e) {
			var percentage = Math.round((e.loaded / e.total * 100));
			var progress_bar = document.getElementById( "acetabular-load-progress" );
			progress_bar.value = percentage;
		};

		loader.load( url, function ( geometry ) {
			var material = new THREE.MeshPhongMaterial( {
				color: 0xFFFFFF,
				shininess: 80,
				side: THREE.DoubleSide,
				specular: 0xB9B9B9,
				// ***** Clipping setup (material): *****
				// clippingPlanes: [ localPlane ],
				clipShadows: true
			});
			var mesh = new THREE.Mesh( geometry, material );
			mesh.name = "髋臼杯";

			geometry.computeBoundingBox();

			var bb = geometry.boundingBox;
			// 计算得出以毫米为单位的计量
			var object3DWidth  = bb.max.x - bb.min.x;
			var object3DHeight = bb.max.y - bb.min.y;
			var object3DDepth  = bb.max.z - bb.min.z;

			var scale_x = 0.0;
			
			if (object3DWidth > 0 && object3DWidth < 10) {
				scale_x = 0.5;
			}
			else {
				scale_x = 0.1;
			}
			mesh.scale.set( scale_x, scale_x, scale_x );
			mesh.position.set( 0, -0.98, 2.99 );
			mesh.rotation.x = - ((Math.PI / 180) * 127.40);
			mesh.rotation.y = 0.0;
			mesh.rotation.z = 0.0;

			this.editor.execute( new AddObjectCommand( mesh ) );
			
		}, onLoadProgress);

		var url = host_name + folder_name + "hip implant.stl";

		var onHipLoadProgress = function (e) {
			var percentage = Math.round((e.loaded / e.total * 100));
			var progress_bar = document.getElementById( "hip-load-progress" );
			progress_bar.value = percentage;
		};

		loader.load( url, function ( geometry ) {
			var material = new THREE.MeshPhongMaterial( {
				color: 0xFFFFFF,
				shininess: 80,
				side: THREE.DoubleSide,
				specular: 0xB9B9B9,
				// ***** Clipping setup (material): *****
				// clippingPlanes: [ localPlane ],
				clipShadows: true
			});
			var mesh = new THREE.Mesh( geometry, material );
			mesh.name = "髋关节植入体";

			geometry.computeBoundingBox();

			var bb = geometry.boundingBox;
			// 计算得出以毫米为单位的计量
			var object3DWidth  = bb.max.x - bb.min.x;
			var object3DHeight = bb.max.y - bb.min.y;
			var object3DDepth  = bb.max.z - bb.min.z;

			var scale_x = 0.0;
			
			if (object3DWidth > 0 && object3DWidth < 10) {
				scale_x = 0.5;
			}
			else {
				scale_x = 0.1;
			}
			mesh.scale.set( scale_x, scale_x, scale_x );
			mesh.position.set( -0.59, -4.35, 5.67 );
			mesh.rotation.x = 0;
			mesh.rotation.y = -(Math.PI / 2);
			mesh.rotation.z = 0;

			this.editor.execute( new AddObjectCommand( mesh ) );
			
		}, onHipLoadProgress);

		// 添加股骨
		var url = host_name + folder_name + "femur.stl";
		
		var loader = new THREE.STLLoader();

		var onFemurLoadProgress = function (e) {
			var percentage = Math.round((e.loaded / e.total * 100));
			var progress_bar = document.getElementById( "femur-load-progress" );
			progress_bar.value = percentage;
		};

		loader.load( url, function ( geometry ) {
			var material = new THREE.MeshPhongMaterial( {
				color: 0xFFFFFF,
				shininess: 80,
				side: THREE.DoubleSide,
				specular: 0xB9B9B9,
				// ***** Clipping setup (material): *****
				// clippingPlanes: [ localPlane ],
				clipShadows: true
			});
			var mesh = new THREE.Mesh( geometry, material );
			mesh.name = "股骨";

			geometry.computeBoundingBox();

			var bb = geometry.boundingBox;
			// 计算得出以毫米为单位的计量
			var object3DWidth  = bb.max.x - bb.min.x;
			var object3DHeight = bb.max.y - bb.min.y;
			var object3DDepth  = bb.max.z - bb.min.z;

			var scale_x = 0.0;
			
			if (object3DWidth > 0 && object3DWidth < 10) {
				scale_x = 0.5;
			}
			else {
				scale_x = 0.1;
			}
			mesh.scale.set( scale_x, scale_x, scale_x );
			mesh.position.set( -8.06, 0, 7.72 );
			mesh.rotation.x = 0;
			mesh.rotation.y = Math.PI / 2;
			mesh.rotation.z = -(Math.PI / 2);

			this.editor.execute( new AddObjectCommand( mesh ) );

			//var another_plane = new THREE.Plane( new THREE.Vector3( 0, 1, 0 ), 0.0 );
            var faker_material =  new THREE.MeshPhongMaterial( {
                color: 0xF73711,
                shininess: 100,
                side: THREE.DoubleSide,
                // ***** Clipping setup (material): *****
                // clippingPlanes: [ another_plane ],
                clipShadows: true
            });
			
			var faker_object = new THREE.Mesh( geometry, faker_material );
            faker_object.name = "切割预览";
            faker_object.scale.set( mesh.scale.x, mesh.scale.y, mesh.scale.z);
            faker_object.position.set( mesh.position.x, mesh.position.y, mesh.position.z );
            faker_object.rotation.set( mesh.rotation.x, mesh.rotation.y, mesh.rotation.z );
			faker_object.parent = mesh;
			faker_object.visible = false;
			
			this.editor.execute( new AddObjectCommand( faker_object ) );
			
		}, onFemurLoadProgress);

		// 载入盆骨
		var url = host_name + folder_name + "pelvis.stl";
		var loader = new THREE.STLLoader();

		var onPelvisLoadProgress = function (e) {
			var percentage = Math.round((e.loaded / e.total * 100));
			var progress_bar = document.getElementById( "pelvis-load-progress" );
			progress_bar.value = percentage;
		};

		loader.load( url, function ( geometry ) {
			var material = new THREE.MeshPhongMaterial( {
				color: 0xFFFFFF,
				shininess: 80,
				side: THREE.DoubleSide,
				specular: 0xB9B9B9,
				// ***** Clipping setup (material): *****
				// clippingPlanes: [ localPlane ],
				clipShadows: true
			});
			var mesh = new THREE.Mesh( geometry, material );
			mesh.name = "盆骨";

			geometry.computeBoundingBox();

			var bb = geometry.boundingBox;
			// 计算得出以毫米为单位的计量
			var object3DWidth  = bb.max.x - bb.min.x;
			var object3DHeight = bb.max.y - bb.min.y;
			var object3DDepth  = bb.max.z - bb.min.z;

			var scale_x = 0.0;
			
			if (object3DWidth > 0 && object3DWidth < 10) {
				scale_x = 0.5;
			}
			else {
				scale_x = 0.1;
			}
			mesh.scale.set( scale_x, scale_x, scale_x );
			mesh.position.set( -0.66, -7.87, -5.00 );
			mesh.rotation.x = 0;
			mesh.rotation.y = 0;
			mesh.rotation.z = Math.PI / 2;

			this.editor.execute( new AddObjectCommand( mesh ) );
			
		}, onPelvisLoadProgress);



		this.signals.editorCleared.dispatch();

	},

	//

	fromJSON: function ( json ) {

		var loader = new THREE.ObjectLoader();

		// backwards

		if ( json.scene === undefined ) {

			this.setScene( loader.parse( json ) );
			return;

		}

		var camera = loader.parse( json.camera );

		this.camera.copy( camera );
		this.camera.aspect = this.DEFAULT_CAMERA.aspect;
		this.camera.updateProjectionMatrix();

		this.history.fromJSON( json.history );
		this.scripts = json.scripts;

		this.setScene( loader.parse( json.scene ) );

	},

	toJSON: function () {

		// scripts clean up

		var scene = this.scene;
		var scripts = this.scripts;

		for ( var key in scripts ) {

			var script = scripts[ key ];

			if ( script.length === 0 || scene.getObjectByProperty( 'uuid', key ) === undefined ) {

				delete scripts[ key ];

			}

		}

		//

		return {

			metadata: {},
			project: {
				gammaInput: this.config.getKey( 'project/renderer/gammaInput' ),
				gammaOutput: this.config.getKey( 'project/renderer/gammaOutput' ),
				shadows: this.config.getKey( 'project/renderer/shadows' ),
				vr: this.config.getKey( 'project/vr' )
			},
			camera: this.camera.toJSON(),
			scene: this.scene.toJSON(),
			scripts: this.scripts,
			history: this.history.toJSON()

		};

	},

	objectByUuid: function ( uuid ) {

		return this.scene.getObjectByProperty( 'uuid', uuid, true );

	},

	execute: function ( cmd, optionalName ) {

		this.history.execute( cmd, optionalName );

	},

	undo: function () {

		this.history.undo();

	},

	redo: function () {

		this.history.redo();

	}

};
