/**
 * @author mrdoob / http://mrdoob.com/
 */

function createLabel(text, x, y, z, size, color, backgroundColor, backgroundMargin) {
	if (!backgroundMargin) {
		backgroundMargin = 50;
	}
	var canvas = document.createElement("canvas");
	var context = canvas.getContext("2d");
	context.font = size + "pt Arial";

	var textWidth = context.measureText(text).width;
	canvas.width = textWidth + backgroundMargin;
	canvas.height = size + backgroundMargin;
	context = canvas.getContext("2d");
	context.font = size + "pt Arial";

	if (backgroundColor) {
		context.fillStyle = backgroundColor;
		context.fillRect(canvas.width / 2 - textWidth / 2 - backgroundMargin / 2, 
								  canvas.height / 2 - size / 2 - backgroundMargin / 2,
								  textWidth + backgroundMargin, size + backgroundMargin);
	}
	context.textAlign = "center";
	context.textBaseline = "middle";
	context.fillStyle = color;
	context.fillText(text, canvas.width / 2, canvas.height / 2);

	// context.strokeStyle = "black";
	// context.strokeRect(0, 0, canvas.width, canvas.height);

	var texture = new THREE.Texture(canvas);
	texture.needsUpdate = true;

	var material = new THREE.MeshBasicMaterial({map: texture});
	var mesh = new THREE.Mesh(new THREE.PlaneGeometry(canvas.width, canvas.height), material);
	// mesh.overdraw = true;
	mesh.doubleSided = true;
	mesh.position.x = x - canvas.width;
	mesh.position.y = y - canvas.height;
	mesh.position.z = z;

	return mesh;
}

var Editor = function () {

	this.DEFAULT_CAMERA = new THREE.PerspectiveCamera( 50, 1, 0.1, 1000 );
	this.DEFAULT_CAMERA.name = 'Camera';
	this.DEFAULT_CAMERA.position.set( 0, 0, 30 );
	this.DEFAULT_CAMERA.lookAt( new THREE.Vector3() );

	this.GIZMO_CAMERA = new THREE.PerspectiveCamera( 50, 1, 0.1, 1000 );
	this.GIZMO_CAMERA.name = "Gizmo Camera";
	this.GIZMO_CAMERA.position.set(0, 0, 10030);
	this.GIZMO_CAMERA.lookAt( new THREE.Vector3() );
	

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
	this.gizmo_camera = this.GIZMO_CAMERA.clone();

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
	// 股骨
	this.femur_helper = null;
	// 是否开始测量
	this.measure_begin = false;
	this.measure_pt_1 = false;
	this.measure_count = 0;

	// 是否开始切割
	this.cutting_begin = false;

	// 是否开启注释功能
	this.is_annotation = false;
	this.annotation_count = 0;
	// 扩展功能
	this.is_explod = false;
	// 切割预览
	this.is_preview = false;

	//// 顶部按钮表
	// CT图是否显示
	this.ct_box = false;
	// 半透明
	this.bone_transparency = false;
	// 试图模式
	this.view_mode_change = false;
	this.view_mode_type = 1;	// 具有1 - 6
	this.gizmo = new Gizmo(this);

	// 新增加三个场景
	this.capsScene = new THREE.Scene();
	this.backStencil = new THREE.Scene();
	this.frontStencil = new THREE.Scene();
};

Editor.prototype = {

	clearMeasureInfo: function () {
		var measure_annotation = document.getElementById("measure-annotation-1");
		if (measure_annotation != null) {
			measure_annotation.outerHTML = "";
		}
	},

	closeMeasureInfo: function () {
		var measure_annotation = document.getElementById("measure-annotation-1");
		if (measure_annotation != null) {
			if (measure_annotation.style.display == "none") {
				measure_annotation.style.display = "inline-block";
			}
			else {
				measure_annotation.style.display = "none";
			}
		}
		var measure_point_1 = null;
		var measure_point_2 = null;
		var measure_line = null;

		editor.scene.traverse(function(child) {
			if (child.name === "measure-1-1") {
				measure_point_1 = child;
			}
			if (child.name === "measure-1-2") {
				measure_point_2 = child;
			}
			if (child.name === "measure-line-1") {
				measure_line = child;
			}
		});

		if (measure_point_1 != null) {
			measure_point_1.visible = measure_point_1.visible ? false : true;
		}
		if (measure_line != null) {
			measure_line.visible = measure_line.visible ? false : true;
		}
		if (measure_point_2 != null) {
			measure_point_2.visible = measure_point_2.visible ? false : true;
		}
	},

	clearExtraSetting: function () {
		this.cutting_begin = false;
		this.measure_begin = false;
		this.measure_pt_1 = false;
		this.measure_count = 0;
		this.is_annotation = false;
		this.annotation_count = 0;
	},

	clearTopBannerSetting: function () {
		this.ct_box = false;
		this.bone_transparency = false;
		this.view_mode_change = false;
		this.view_mode_type = 1;
	},

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
			if ( object.name != "第1点" && object.name != "第2点" && object.name != "第3点" )
			{
				return;
			}
			else {
				if (G_clip_point_1 === true || G_clip_point_2 === true || G_clip_point_3 === true) {
					return;
				}
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

		// 清除所有的测量长度信息
		this.clearMeasureInfo();
		this.clearExtraSetting();
		this.clearTopBannerSetting();
		
		var light = new THREE.AmbientLight( 0xFFFFFF, 0.30 ); // soft white light
		light.name = "环境光";
		light.position.set( 20.0, 20.0, 7.5 );
		
		this.scene.add( light );

		var spotLight = new THREE.SpotLight( 0xFFFFFF, 0.24 );
		spotLight.position.set( 0, 12.0, 12.0 );
		spotLight.castShadow = true;
		spotLight.shadow.mapSize.width = 1024;
		spotLight.shadow.mapSize.height = 1024;
		spotLight.name = "聚光灯";
		
		this.scene.add( spotLight );
		
		var spotLight = new THREE.SpotLight( 0xffffff, 0.24 );
		spotLight.position.set( 0, 12.0, -12.0 );
		spotLight.name = "聚光灯";
		
		this.scene.add( spotLight );
		
		var spotLight = new THREE.SpotLight( 0xffffff, 0.24 );
		spotLight.position.set( 12.0, 12.0, 0.0 );
		spotLight.name = "聚光灯";
		this.scene.add( spotLight );
		
		var spotLight = new THREE.SpotLight( 0xffffff, 0.24 );
		spotLight.position.set( -12.0, 12.0, 0.0 );
		spotLight.name = "聚光灯";
		this.scene.add( spotLight );
		
		const host_name = window.location.origin;
		const folder_name = "/static/models/";

		THREE.ShaderLib[ 'phong' ].fragmentShader = THREE.ShaderLib[ 'phong' ].fragmentShader.replace(
			"gl_FragColor = vec4( outgoingLight, diffuseColor.a );",
		
			"vec4 fragColor = vec4(0.09, 0.67, 0.92, 1.0);gl_FragColor = ( gl_FrontFacing ) ? vec4( outgoingLight, diffuseColor.a ) : fragColor;"
		);
		

		var material = new THREE.MeshPhongMaterial( {
			color: 0xFFFFFF,
			depthWrite: true,
			depthTest: true, 
			shininess: 80,
			side: THREE.DoubleSide,
			specular: 0xB9B9B9,
			// ***** Clipping setup (material): *****
			clippingPlanes: [],
			clipShadows: true,
			clipIntersection: true,
			transparent: false,
			renderOrder: 0,
		});

		var faker_material =  new THREE.MeshPhongMaterial( {
			color: 0xF73711,
			shininess: 100,
			side: THREE.DoubleSide,
			// ***** Clipping setup (material): *****
			// clippingPlanes: [ another_plane ],
			clipShadows: true,
			clipIntersection: true
		});

		var femur_material = new THREE.MeshPhongMaterial( {
			color: 0xF0F0F0,
			depthWrite: true,
			depthTest: true, 
			shininess: 80,
			side: THREE.DoubleSide,
			specular: 0xB9B9B9,
			// ***** Clipping setup (material): *****
			clippingPlanes: [],
			clipShadows: true,
			clipIntersection: true,
			transparent: false,
			renderOrder: 1,
		});

		/*
		var femur_material = new THREE.ShaderMaterial({
			uniforms: {
				p: {type: "f", value: 2},
				glowColor: {type: "c", value: new THREE.Color(0x84CCFF)},
			},
			vertexShader: document.getElementById('XrayVertexShader').textContent,
			fragmentShader: document.getElementById('XrayFragmentShader').textContent,
			side: THREE.DoubleSide,
			//blending: THREE.AdditiveBlending,
			transparent: false,
			depthTest: false,
			depthWrite: true,
			clipping: true,
			clippingPlanes : []
		});
		*/

		// 添加股骨
		// var url = host_name + folder_name + "femur.stl";
		var url = "../../static/models/femur.stl"; 
		
		var loader = new THREE.STLLoader();

		var onFemurLoadProgress = function (e) {
			var percentage = Math.round((e.loaded / e.total * 100));
			var progress_bar = document.getElementById( "femur-load-progress" );
			progress_bar.value = percentage;
		};

		loader.load( url, function ( geometry ) {
			
			var mesh = new THREE.Mesh( geometry,  femur_material );
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
			mesh.position.set( 0, 0, 0 );
			mesh.rotation.x = -Math.PI / 180 * 90;
			mesh.rotation.y = 0;
			mesh.rotation.z = 0;
			
			this.editor.execute( new AddObjectCommand( mesh ) );
			
			/*
			editor.femur_helper = new THREE.EdgesHelper( mesh, 0x5FCAA7 );
			editor.femur_helper.scale.set( mesh.scale.x, mesh.scale.y, mesh.scale.z );
			editor.femur_helper.position.set( mesh.position.x, mesh.position.y, mesh.position.z );
			editor.femur_helper.rotation.set( mesh.rotation.x, mesh.rotation.y, mesh.rotation.z );
			editor.femur_helper.name = "股骨外框";
			editor.femur_helper.visible = false;
			this.editor.execute( new AddObjectCommand( editor.femur_helper ) );
			*/

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
		//var url = host_name + folder_name + "pelvis.stl";
		var url = "../../static/models/pelvis.stl"; 
		var loader = new THREE.STLLoader();

		var onPelvisLoadProgress = function (e) {
			var percentage = Math.round((e.loaded / e.total * 100));
			var progress_bar = document.getElementById( "pelvis-load-progress" );
			progress_bar.value = percentage;
		};

		loader.load( url, function ( geometry ) {
			var mesh = new THREE.Mesh( geometry, material.clone() );
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
			mesh.position.set( 0, 0, 0 );
			mesh.rotation.x = -Math.PI / 2;
			mesh.rotation.y = 0;
			mesh.rotation.z = 0;

			this.editor.execute( new AddObjectCommand( mesh ) );
			
		}, onPelvisLoadProgress);
		

		// 2018年3月26日 新增载入四个STL
		// 载入新髋臼杯
		var url = host_name + folder_name + "髋臼杯.stl";
		var loader = new THREE.STLLoader();

		var onNewAcetabularLoadProgress = function (e) {
			var percentage = Math.round((e.loaded / e.total * 100));
			var progress_bar = document.getElementById( "new-acetabular-load-progress" );
			progress_bar.value = percentage;
		};

		loader.load( url, function ( geometry ) {
			var mesh = new THREE.Mesh( geometry, material.clone() );
			mesh.name = "新髋臼杯";

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
			mesh.rotation.set ( -(Math.PI / 2), 0, 0 );
			
			this.editor.execute( new AddObjectCommand( mesh ) );
			
		}, onNewAcetabularLoadProgress);

		// 载入髋臼内衬
		var url = host_name + folder_name + "髋臼内衬.stl";
		var loader = new THREE.STLLoader();

		var onAcetabularInnerLoadProgress = function (e) {
			var percentage = Math.round((e.loaded / e.total * 100));
			var progress_bar = document.getElementById( "acetabular-inner-load-progress" );
			progress_bar.value = percentage;
		};

		loader.load( url, function ( geometry ) {
			
			var mesh = new THREE.Mesh( geometry, material.clone() );
			mesh.name = "髋臼内衬";

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
			mesh.rotation.set ( -(Math.PI / 2), 0, 0 );
			
			this.editor.execute( new AddObjectCommand( mesh ) );
			
		}, onAcetabularInnerLoadProgress);

		// 载入股骨头假体
		var url = host_name + folder_name + "股骨头假体.stl";
		var loader = new THREE.STLLoader();

		var onFemurHeadLoadProgress = function (e) {
			var percentage = Math.round((e.loaded / e.total * 100));
			var progress_bar = document.getElementById( "femur-head-load-progress" );
			progress_bar.value = percentage;
		};

		loader.load( url, function ( geometry ) {
			
			var mesh = new THREE.Mesh( geometry, material.clone() );
			mesh.name = "股骨头假体";

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
			mesh.rotation.set ( -(Math.PI / 2), 0, 0 );
			
			this.editor.execute( new AddObjectCommand( mesh ) );
			
		}, onFemurHeadLoadProgress);

		// 载入股骨柄假体
		var url = host_name + folder_name + "股骨柄假体.stl";
		var loader = new THREE.STLLoader();

		var onFemurHipLoadProgress = function (e) {
			var percentage = Math.round((e.loaded / e.total * 100));
			var progress_bar = document.getElementById( "femur-hip-load-progress" );
			progress_bar.value = percentage;
		};

		loader.load( url, function ( geometry ) {
			
			var mesh = new THREE.Mesh( geometry, material.clone() );
			mesh.name = "股骨柄假体";

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
			mesh.rotation.set ( -(Math.PI / 2), 0, 0 );
			
			this.editor.execute( new AddObjectCommand( mesh ) );
			
		}, onFemurHipLoadProgress);

		
		
		// 增加第一点和第二点，将它们设为隐身
		var geometry = new THREE.SphereGeometry( 0.45, 64, 64 );;
		var p1_material = new THREE.MeshPhongMaterial( {
			color: 0x58D68D,
			shininess: 80,
			side: THREE.DoubleSide,
			specular: 0x58D68D,
		});
		var cone = new THREE.Mesh( geometry, p1_material );
		cone.name = "第1点";
		cone.visible = false;
		editor.execute( new AddObjectCommand( cone ) );

		var geometry = new THREE.SphereGeometry( 0.45, 64, 64 );;
		var p2_material = new THREE.MeshPhongMaterial( {
			color: 0x58D68D,
			shininess: 80,
			side: THREE.DoubleSide,
			specular: 0x58D68D
		});
		var cone = new THREE.Mesh( geometry, p2_material );
		cone.name = "第2点";
		cone.visible = false;
		editor.execute( new AddObjectCommand( cone ) );

		var geometry = new THREE.SphereGeometry( 0.45, 64, 64 );;
		var p3_material = new THREE.MeshPhongMaterial( {
			color: 0x58D68D,
			shininess: 80,
			side: THREE.DoubleSide,
			specular: 0x58D68D
		});
		var cone = new THREE.Mesh( geometry, p3_material );
		cone.name = "第3点";
		cone.visible = false;
		editor.execute( new AddObjectCommand( cone ) );


		



		this.signals.editorCleared.dispatch();

		this.gizmo = new Gizmo(this);
		this.gizmo.init();

		

		
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

	},

	

};
