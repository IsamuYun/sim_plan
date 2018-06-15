/**
 * @author mrdoob / http://mrdoob.com/
 */

var Viewport = function ( editor ) {

	var signals = editor.signals;

	var container = new UI.Panel();
	container.setId( 'viewport' );
	container.setPosition( 'absolute' );
	// Viewport.Info 2018年5月2日关闭
	// container.add( new Viewport.Info( editor ) );
	
	var renderer = null;
	var gizmo_renderer = null;

	var camera = editor.camera;
	var scene = editor.scene;
	var sceneHelpers = editor.sceneHelpers;

	var gizmo_camera = editor.gizmo_camera;

	var objects = [];
	var measure_position = null;

	// helpers

	var grid = new THREE.GridHelper( 100, 100 );
	//sceneHelpers.add( grid );
	
	var box = new THREE.Box3();

	var selectionBox = new THREE.BoxHelper();
	selectionBox.material.depthTest = false;
	selectionBox.material.transparent = true;
	
	selectionBox.visible = true;
	//sceneHelpers.add( selectionBox );

	var objectPositionOnDown = null;
	var objectRotationOnDown = null;
	var objectScaleOnDown = null;

	// 判定标签是否半透明
	var sprite_behind_object = new Array();
	// measure_line_begin
	var measure_line_begin_1 = null;
	var measure_line_begin_2 = null;
	var measure_behind_object = null;

	var inset_width = 100;
	var inset_height = 100;

	var annotation_point_list = [];

	var transformControls = new THREE.TransformControls( camera, container.dom );
	transformControls.addEventListener( 'change', function () {

		var object = transformControls.object;

		if ( object !== undefined ) {

			selectionBox.setFromObject( object );

			if ( editor.helpers[ object.id ] !== undefined ) {

				editor.helpers[ object.id ].update();

			}

			signals.refreshSidebarObject3D.dispatch( object );
		}

		render();
	} );

	transformControls.addEventListener('mouseDown', function () {
		var object = transformControls.object;

		objectPositionOnDown = object.position.clone();
		objectRotationOnDown = object.rotation.clone();
		objectScaleOnDown = object.scale.clone();

		controls.enabled = false;
	});

	transformControls.addEventListener( 'mouseUp', function () {

		var object = transformControls.object;

		if ( object !== undefined ) {
			switch ( transformControls.getMode() ) {
				case 'translate':
					if ( ! objectPositionOnDown.equals( object.position ) ) {
						editor.execute( new SetPositionCommand( object, object.position, objectPositionOnDown ) );
					}
					break;

				case 'rotate':
					if ( ! objectRotationOnDown.equals( object.rotation ) ) {
						editor.execute( new SetRotationCommand( object, object.rotation, objectRotationOnDown ) );
					}
					break;

				case 'scale':
					if ( ! objectScaleOnDown.equals( object.scale ) ) {
						editor.execute( new SetScaleCommand( object, object.scale, objectScaleOnDown ) );
					}
					break;
			}
		}

		controls.enabled = true;
	} );

	sceneHelpers.add( transformControls );

	

	// object picking

	var raycaster = new THREE.Raycaster();
	var mouse = new THREE.Vector2();

	// events

	function getIntersects( point, objects ) {

		mouse.set( ( point.x * 2 ) - 1, - ( point.y * 2 ) + 1 );

		raycaster.setFromCamera( mouse, camera );

		return raycaster.intersectObjects( objects );

	}

	var onDownPosition = new THREE.Vector2();
	var onUpPosition = new THREE.Vector2();
	var onDoubleClickPosition = new THREE.Vector2();

	//var gizmo = new Gizmo(editor);
	//gizmo.init();

	// 鼠标移动后的坐标点
	var onMovePosition = new THREE.Vector2();

	function getMousePosition( dom, x, y ) {
		var rect = dom.getBoundingClientRect();
		return [ ( x - rect.left ) / rect.width, ( y - rect.top ) / rect.height ];
	}

	function getAnotherMousePosition( dom, x, y ) {
		var rect = dom.getBoundingClientRect();
		return [ (x - rect.left) / (rect.width - rect.left), (y - rect.top) / (rect.bottom - rect.top)  ];
	}

	function removeMeasureInfo() {
		var begin_name = "measure-1-1";
        var end_name = "measure-1-2";
        var line_name = "measure-line-1"; 
        var begin_point = null;
        var end_point = null;
        var measure_line = null;
		
		editor.scene.traverse(function(child) {
            if (child.name === begin_name) {
                begin_point = child;
            }
            if (child.name === end_name) {
                end_point = child;
            }
            if (child.name === line_name) {
                measure_line = child;
            }
        });
        var measure_annotation = document.getElementById("measure-annotation-1");
        if (measure_annotation != null) {
            measure_annotation.outerHTML = "";
        }
        if ( begin_point != null ) {
            editor.execute( new RemoveObjectCommand( begin_point ) );
        }
        if ( end_point != null ) {
            editor.execute( new RemoveObjectCommand( end_point ) );
        }
        if ( measure_line != null ) {
            editor.execute( new RemoveObjectCommand( measure_line ) );
		}
		editor.measure_count = 0;
		editor.measure_pt_1 = false;
	}

	function handleMeasure(intersect_target) {
		if ( editor.measure_begin == false ) {
			return;
		}
		if (intersect_target == null) {
			return;
		}
		
		var intersect_point = intersect_target.point;
		if (intersect_point == null) {
			return;
		}

		if (editor.measure_pt_1 == false) {
			removeMeasureInfo();
			editor.measure_count++;
			editor.measure_pt_1 = true;
			// 创建一个点
			var geometry = new THREE.SphereGeometry( 0.25, 64, 64 );;
			var material = new THREE.MeshPhongMaterial( {
				color: 0xDA81F5,
				shininess: 80,
				side: THREE.DoubleSide,
				specular: 0xDA81F5,
			});
			var point = new THREE.Mesh( geometry, material );
			point.name = "measure-1-1";
			point.visible = true;
			point.position.copy(intersect_point);
			editor.execute( new AddObjectCommand( point ) );
			
			measure_position = intersect_point.clone();
			measure_line_begin_1 = intersect_point.clone();
			measure_line_begin_2 = measure_line_begin_1.clone();
			var origin_point = new THREE.Vector3(0, 0, 0);
			camera.getWorldDirection( origin_point );
			if ( origin_point.z <= 0.0 ) {
				measure_line_begin_2.z += 2;
			}
			else {
				measure_line_begin_2.z -= 2;
			}
		}
		else {
			editor.measure_pt_1 = false;
			// 创建一个点
			var geometry = new THREE.SphereGeometry( 0.25, 64, 64 );;
			var material = new THREE.MeshPhongMaterial( {
				color: 0xDA81F5,
				shininess: 80,
				side: THREE.DoubleSide,
				specular: 0xDA81F5,
			});
			var point = new THREE.Mesh( geometry, material );
			point.name = "measure-1-2";
			point.visible = true;
			point.position.copy(intersect_point);
			editor.execute( new AddObjectCommand( point ) );
			var distance = point.position.distanceTo(measure_position);
			distance = distance * 10;
			distance = Math.round(distance * 1000) / 1000;
			var measure_annotation = document.createElement("div");
			measure_annotation.id = "measure-annotation-1";
			measure_annotation.className = "zs-measure-annotation";
			measure_annotation.innerHTML = "Distance: " + distance + " mm";

			var vector = measure_line_begin_1.clone();
			vector.project( camera );

			vector.x = Math.round( (0.5 + vector.x / 2) * ((container.dom.offsetWidth - 300) / window.devicePixelRatio) );
			vector.y = Math.round( (0.5 - vector.y / 2) * (container.dom.offsetHeight / window.devicePixelRatio) );

			measure_annotation.style.top = vector.y + "px";
			measure_annotation.style.left = vector.x + "px";
			document.body.appendChild(measure_annotation);

			var material = new THREE.LineBasicMaterial({
				color: 0x0000FF
			});
			
			var measure_line_end_1 = intersect_point.clone();
			var measure_line_end_2 = measure_line_end_1.clone();
			var origin_point = new THREE.Vector3(0, 0, 0);
			camera.getWorldDirection( origin_point );
			if ( origin_point.z <= 0.0 ) {
				measure_line_end_1.z += 2;
			}
			else {
				measure_line_end_1.z -= 2;
			}

			var geometry = new THREE.Geometry();
			geometry.vertices.push(
				measure_line_begin_1,
				measure_line_begin_2,
				measure_line_end_1,
				measure_line_end_2
			);
			
			var line = new THREE.Line( geometry, material );
			line.name = "measure-line-1";
			editor.execute( new AddObjectCommand( line ) );
		}
		render();

	}

	function handleCutting(intersect_target) {
		if ( editor.cutting_begin == false ) {
			return;
		}
		if ( intersect_target == null ) {
			return;
		}
		var object = intersect_target.object;
		if ( object.name !== "股骨" ) {
			return;
		}
		if ( G_clip_point_1 == true ) {
			G_clip_point_1 = false;
			G_clip_point_2 = true;
			G_point_list[0] = intersect_target.point;
			editor.scene.traverse(function( child ){
				if (child.name === "第1点") {
					child.position.set( G_point_list[0].x, G_point_list[0].y, G_point_list[0].z );
					child.visible = true;
					console.log("point 1");
					console.log(child.position);
				}
			});
		}
		else if ( G_clip_point_2 == true ){
			G_clip_point_2 = false;
			G_clip_point_3 = true;
			G_point_list[1] = intersect_target.point;
			editor.scene.traverse( function( child ){
				if (child.name === "第2点") {
					child.position.set( G_point_list[1].x, G_point_list[1].y, G_point_list[1].z );
					child.visible = true;
					console.log("point 2");
					console.log(child.position);
				}
			});
		}
		else if ( G_clip_point_3 == true ) {
			G_clip_point_3 = false;
			G_point_list[ 2 ] = intersect_target.point;
			
			// 构造一个截面
			var plane = new THREE.Plane( new THREE.Vector3( 0, 0, 0 ), 0.0 );
			plane.setFromCoplanarPoints( G_point_list[0], G_point_list[1], G_point_list[2] );
				
			var another_plane = new THREE.Plane( new THREE.Vector3( 0, 0, 0 ), 0.0 );
			another_plane.normal.x = -plane.normal.x;
			another_plane.normal.y = -plane.normal.y;
			another_plane.normal.z = -plane.normal.z;
			another_plane.constant = -plane.constant;
			if ( another_plane.normal.y <= 0.0 ) {
				object.material.clippingPlanes = [another_plane];
			}
			else {
				object.material.clippingPlanes = [plane];
			}

			editor.scene.traverse(function( child ) {
				if ( child.name === "切割预览" ) {
					child.visible = true;
					child.position.set(object.position.x, object.position.y, object.position.z);
					if ( another_plane.normal.y <= 0.0 ) {
						child.material.clippingPlanes = [plane];
					}
					else {
						child.material.clippingPlanes = [another_plane];
					}
					
				}
				if ( child.name === "第3点" ) {
					child.visible = true;
					child.position.set( G_point_list[2].x, G_point_list[2].y, G_point_list[2].z );
					console.log("point 3");
					console.log(child.position);
				}
			});
		}
	}

	function handleAnnotation(intersect_target) {
		if (editor.is_annotation === false ) {
			return;
		}
		if (intersect_target == null) {
			return;
		}
		var intersect_point = intersect_target.point;
		if (intersect_point == null) {
			return;
		}
		editor.annotation_count++;
		var annotation_count = editor.annotation_count;

		var geometry = new THREE.SphereGeometry( 0.25, 64, 64 );;
		var material = new THREE.MeshPhongMaterial({
			color: 0xFF8000,
			shininess: 60,
			side: THREE.DoubleSide,
			specular: 0xFFFFFF,
		});
		var point = new THREE.Mesh( geometry, material );
		point.name = "annotation-point-" + annotation_count;
		point.visible = true;
		point.position.copy(intersect_point);
		editor.execute( new AddObjectCommand( point ) );

		// 创建对话框
		var annotation_dialog = new AnnotationDialog(editor);

		

		var vector = intersect_point.clone();
		vector.project( camera );
		
		vector.x = Math.round( ( 0.5 + vector.x / 2 ) * (container.dom.offsetWidth / window.devicePixelRatio) );
		vector.y = Math.round( ( 0.5 - vector.y / 2 ) * (container.dom.offsetHeight / window.devicePixelRatio) );
		
		var num = annotation_count %  2;
		
		var top_pos = 0;
		var left_pos = 0;
		// 奇数，左边
		if (num == 0) {
			top_pos = vector.y - 30;
			if (top_pos <= 20) {
				top_pos = 20;
			}
			else if (top_pos >= (container.dom.offsetHeight - 120)  / window.devicePixelRatio) {
				top_pos = (container.dom.offsetHeight - 120)  / window.devicePixelRatio;
			}

			left_pos = vector.x + 20;
			if (left_pos >= ((container.dom.offsetWidth - 120) / window.devicePixelRatio)) {
				left_pos = ((container.dom.offsetWidth - 120) / window.devicePixelRatio);
			}
			else if (left_pos <= 0) {
				left_pos = 0;
			}
		}
		else {
			top_pos = vector.y - 30;
			if (top_pos <= 20) {
				top_pos = 20;
			}
			else if (top_pos >= (container.dom.offsetHeight - 120)  / window.devicePixelRatio) {
				top_pos = (container.dom.offsetHeight - 120)  / window.devicePixelRatio;
			}

			left_pos = vector.x - 180;
			if (left_pos >= ((container.dom.offsetWidth - 120) / window.devicePixelRatio)) {
				left_pos = ((container.dom.offsetWidth - 120) / window.devicePixelRatio);
			}
			else if (left_pos <= 0) {
				left_pos = 0;
			}
		}

		vector.y = top.pos;
		vector.x = left_pos;

		annotation_point_list.push(intersect_point.clone());

		annotation_dialog.dom.style.top = top_pos + "px";
		annotation_dialog.dom.style.left = left_pos + "px";

		document.body.appendChild(annotation_dialog.dom);

	}

	function closeViewIconTab() {
		var front_view = document.getElementById("front-view-icon");
		var back_view = document.getElementById("back-view-icon");
		var left_view = document.getElementById("left-view-icon");
		var right_view = document.getElementById("right-view-icon");
		var top_view = document.getElementById("top-view-icon");
		var bottom_view = document.getElementById("bottom-view-icon");

		if (front_view == null || back_view == null || left_view == null 
			|| right_view == null || top_view == null || bottom_view == null ) {
			return;
		}

		editor.view_mode_change = editor.view_mode_change ? false : true;

		front_view.style["display"] = "none";
		back_view.style["display"] = "none";
		left_view.style["display"] = "none";
		right_view.style["display"] = "none";
		top_view.style["display"] = "none";
		bottom_view.style["display"] = "none";
	}

	function handleClick() {
		closeViewIconTab();

		
		if ( onDownPosition.distanceTo( onUpPosition ) === 0 ) {
			var intersects = getIntersects( onUpPosition, objects );

			if ( intersects.length > 0 ) {
				var object = intersects[0].object;
				
				if ( object.userData.object !== undefined ) {
					// helper
					editor.select( object.userData.object );
				}
				else {
					editor.select( object );
				}

				handleMeasure( intersects[0] );

				handleCutting( intersects[0] );

				handleAnnotation( intersects[0] );
			} 
			else {
				editor.select( null );
				editor.closeMeasureInfo();
			}
			render();
		}
	}

	function onMouseDown( event ) {

		event.preventDefault();

		var array = getMousePosition( container.dom, event.clientX, event.clientY );
		onDownPosition.fromArray( array );

		document.addEventListener( 'mouseup', onMouseUp, false );

	}

	function onMouseUp( event ) {

		var array = getMousePosition( container.dom, event.clientX, event.clientY );

		onUpPosition.fromArray( array );
		onMovePosition.fromArray( array );
		
		handleClick();

		document.removeEventListener( 'mouseup', onMouseUp, false );

	}

	function onTouchStart( event ) {

		var touch = event.changedTouches[ 0 ];

		var array = getMousePosition( container.dom, touch.clientX, touch.clientY );
		onDownPosition.fromArray( array );

		document.addEventListener( 'touchend', onTouchEnd, false );

	}

	function onTouchEnd( event ) {

		var touch = event.changedTouches[ 0 ];

		var array = getMousePosition( container.dom, touch.clientX, touch.clientY );
		onUpPosition.fromArray( array );

		handleClick();

		document.removeEventListener( 'touchend', onTouchEnd, false );

	}

	function onDoubleClick( event ) {

		var array = getMousePosition( container.dom, event.clientX, event.clientY );
		onDoubleClickPosition.fromArray( array );

		var intersects = getIntersects( onDoubleClickPosition, objects );
		return;
		if ( intersects.length > 0 ) {

			var intersect = intersects[ 0 ];

			var select_object = intersects[0].object;
			
			if ( select_object.name === "股骨" ) {
				if ( editor.femur_helper != null ) {
					editor.femur_helper.visible = true;
				}
			}
			else if ( select_object.name === "股骨外框" ) {
				if ( editor.femur_helper != null ) {
					editor.femur_helper.visible = false;
				}
			}
			else {
				if ( editor.femur_helper != null ) {
					editor.femur_helper.visible = false;
				}
			}
			signals.objectFocused.dispatch( intersect.object );
		}

	}

	container.dom.addEventListener( 'mousedown', onMouseDown, false );
	container.dom.addEventListener( 'touchstart', onTouchStart, false );
	container.dom.addEventListener( 'dblclick', onDoubleClick, false );
	
	// controls need to be added *after* main logic,
	// otherwise controls.enabled doesn't work.

	var controls = new THREE.EditorControls( camera, container.dom );
	controls.addEventListener( 'change', function () {

		transformControls.update();
		signals.cameraChanged.dispatch( camera );

	} );

	// signals

	signals.editorCleared.add( function () {
		// 在这里可以再进行一些初始化操作 
		controls.center.set( 0, 0, 0 );
		editor.select(null);
		render();

	} );

	signals.themeChanged.add( function ( value ) {

		switch ( value ) {

			case 'css/light.css':
				sceneHelpers.remove( grid );
				grid = new THREE.GridHelper( 60, 60, 0x444444, 0x888888 );
				sceneHelpers.add( grid );
				break;
			case 'css/dark.css':
				sceneHelpers.remove( grid );
				grid = new THREE.GridHelper( 60, 60, 0xbbbbbb, 0x888888 );
				sceneHelpers.add( grid );
				break;

		}

		render();

	} );

	signals.transformModeChanged.add( function ( mode ) {

		transformControls.setMode( mode );

	} );

	signals.snapChanged.add( function ( dist ) {

		transformControls.setTranslationSnap( dist );

	} );

	signals.spaceChanged.add( function ( space ) {

		transformControls.setSpace( space );

	} );

	signals.rendererChanged.add( function ( newRenderer ) {

		if ( renderer !== null ) {
			container.dom.removeChild( renderer.domElement );
		}
		if ( gizmo_renderer !== null ) {
			container.dom.removeChild( gizmo_renderer.domElement );
		}

		renderer = newRenderer;

		renderer.autoClear = false;
		renderer.autoUpdateScene = false;
		renderer.setPixelRatio( window.devicePixelRatio );
		renderer.setSize( container.dom.offsetWidth, container.dom.offsetHeight );

		container.dom.appendChild( renderer.domElement );

		render();

	} );

	signals.sceneGraphChanged.add( function () {

		render();

	} );

	signals.cameraChanged.add( function () {

		render();

	} );

	signals.objectSelected.add( function ( object ) {

		selectionBox.visible = false;
		transformControls.detach();

		if ( object !== null && object !== scene && object !== camera ) {

			box.setFromObject( object );

			if ( box.isEmpty() === false ) {
				selectionBox.setFromObject( object );
				selectionBox.visible = true;
			}

			transformControls.attach( object );

		}

		render();

	} );

	signals.objectFocused.add( function ( object ) {

		controls.focus( object );

	} );

	signals.geometryChanged.add( function ( object ) {

		if ( object !== undefined ) {

			selectionBox.setFromObject( object );

		}

		render();

	} );

	signals.objectAdded.add( function ( object ) {

		object.traverse( function ( child ) {

			objects.push( child );

		} );

	} );

	signals.objectChanged.add( function ( object ) {

		if ( editor.selected === object ) {

			if ( object.name === "股骨" ) {
				editor.scene.traverse( function ( child ) {
					if ( child.name === "切割预览" ) {
						child.position.set( object.position.x, object.position.y, object.position.z );
					}
				});
			}
			
			if ( object.name === "第1点" || object.name === "第2点" || object.name === "第3点" ) {
				var femur_object = null;
				var preview_object = null;
				var intersect_points = [];
				var intersect_point = null;
				
				var position = object.position.clone();
				object.visible = false;
				var point_raycaster = new THREE.Raycaster();
				var origin_point = new THREE.Vector3(0, 0, 0);
				camera.getWorldDirection( origin_point );
				
				position.x = position.x + camera.position.x;
				position.y = position.y + camera.position.y;
				position.z = position.z + camera.position.z;
				point_raycaster.set( position, origin_point );

				var intersects = point_raycaster.intersectObjects( objects );
				
				if (intersects.length > 0) {
					if (intersects[0].object.name === "股骨" || intersects[0].object.name === "切割预览") {
						intersect_point = intersects[0].point.clone();
					}
				}
				
				if (object.name === "第1点") {
					old_position = G_point_list[0];
				}
				if (object.name === "第2点") {
					old_position = G_point_list[1];
				}
				if (object.name === "第3点") {
					old_position = G_point_list[2];
				}
				
				if (intersect_point != null) {
					
					if ( object.name === "第1点" ) {
						G_point_list[0] = intersect_point;
					}
					if ( object.name === "第2点" ) {
						G_point_list[1] = intersect_point;
					}
					if ( object.name === "第3点" ) {
						G_point_list[2] = intersect_point;
					}
					object.position.set(intersect_point.x, intersect_point.y, intersect_point.z);
					
					console.log("change position, object position");
					console.log(object.position);
					
				}
				else {
					
					console.log("change position failed");
					console.log("change failed up position");
					console.log("no point to hook.");
						
					if ( object.name === "第1点" ) {
						object.position.set(G_point_list[0].x, G_point_list[0].y, G_point_list[0].z);
					}
					if ( object.name === "第2点" ) {
						object.position.set(G_point_list[1].x, G_point_list[1].y, G_point_list[1].z);
					}
					if ( object.name === "第3点" ) {
						object.position.set(G_point_list[2].x, G_point_list[2].y, G_point_list[2].z);
					}
				}
				object.visible = true;
				var plane = new THREE.Plane( new THREE.Vector3( 0, 0, 0 ), 0.0 );
				plane.setFromCoplanarPoints( G_point_list[0], G_point_list[1], G_point_list[2] );
				
				var another_plane = new THREE.Plane( new THREE.Vector3( 0, 0, 0 ), 0.0 );
				another_plane.normal.x = -plane.normal.x;
				another_plane.normal.y = -plane.normal.y;
				another_plane.normal.z = -plane.normal.z;
				another_plane.constant = -plane.constant;
				editor.scene.traverse( function( child ) {
					if ( child.name === "切割预览" ) {
						child.visible = true;
						if ( another_plane.normal.y <= 0.0 ) {
							child.material.clippingPlanes = [plane];
						}
						else {
							child.material.clippingPlanes = [another_plane];
						}
					}
					if ( child.name === "股骨" ) {
						child.visible = true;
						if ( another_plane.normal.y <= 0.0 ) {
							child.material.clippingPlanes = [another_plane];
						}
						else {
							child.material.clippingPlanes = [plane];
						}
					}
				} );
			}
			
			selectionBox.setFromObject( object );
			transformControls.update();
			
		}

		if ( object instanceof THREE.PerspectiveCamera ) {

			object.updateProjectionMatrix();

		}

		if ( editor.helpers[ object.id ] !== undefined ) {

			editor.helpers[ object.id ].update();

		}

		render();

	} );

	signals.objectRemoved.add( function ( object ) {

		object.traverse( function ( child ) {

			objects.splice( objects.indexOf( child ), 1 );

		} );

	} );

	signals.helperAdded.add( function ( object ) {

		objects.push( object.getObjectByName( 'picker' ) );

	} );

	signals.helperRemoved.add( function ( object ) {

		objects.splice( objects.indexOf( object.getObjectByName( 'picker' ) ), 1 );

	} );

	signals.materialChanged.add( function ( material ) {

		render();

	} );

	// fog

	signals.sceneBackgroundChanged.add( function ( backgroundColor ) {

		scene.background.setHex( backgroundColor );

		render();

	} );

	var currentFogType = null;

	signals.sceneFogChanged.add( function ( fogType, fogColor, fogNear, fogFar, fogDensity ) {

		if ( currentFogType !== fogType ) {

			switch ( fogType ) {

				case 'None':
					scene.fog = null;
					break;
				case 'Fog':
					scene.fog = new THREE.Fog();
					break;
				case 'FogExp2':
					scene.fog = new THREE.FogExp2();
					break;

			}

			currentFogType = fogType;

		}

		if ( scene.fog instanceof THREE.Fog ) {

			scene.fog.color.setHex( fogColor );
			scene.fog.near = fogNear;
			scene.fog.far = fogFar;

		} else if ( scene.fog instanceof THREE.FogExp2 ) {

			scene.fog.color.setHex( fogColor );
			scene.fog.density = fogDensity;

		}

		render();

	} );

	//

	signals.windowResize.add( function () {

		// TODO: Move this out?

		editor.DEFAULT_CAMERA.aspect = container.dom.offsetWidth / container.dom.offsetHeight;
		editor.DEFAULT_CAMERA.updateProjectionMatrix();

		camera.aspect = container.dom.offsetWidth / container.dom.offsetHeight;
		camera.updateProjectionMatrix();

		renderer.setViewport( 0, 0, container.dom.offsetWidth, container.dom.offsetHeight );
		renderer.setSize( container.dom.offsetWidth, container.dom.offsetHeight );
		
		inset_width = container.dom.offsetWidth / 10;
		inset_height = container.dom.offsetHeight / 10;
		
		//20180606 添加
		gizmo_camera.aspect = inset_width / inset_height; 
		gizmo_camera.updateProjectionMatrix();

		render();

	} );

	signals.showGridChanged.add( function ( showGrid ) {

		grid.visible = showGrid;
		render();

	} );

	//
	function gizmo_update(rotation, eye) {
		var tempMatrix = new THREE.Matrix4();
		var worldRotation = new THREE.Euler( 0, 0, 1 );
		var tempQuaternion = new THREE.Quaternion();
		var unitX = new THREE.Vector3( 1, 0, 0 );
		var unitY = new THREE.Vector3( 0, 1, 0 );
		var unitZ = new THREE.Vector3( 0, 0, 1 );
		var quaternionX = new THREE.Quaternion();
		var quaternionY = new THREE.Quaternion();
		var quaternionZ = new THREE.Quaternion();
		var eye = eye2.clone();
	}

	function render() {

		sceneHelpers.updateMatrixWorld();
		scene.updateMatrixWorld();

		// 使渲染器支持平面截取
		renderer.localClippingEnabled = true;
		renderer.clipIntersection = true;
		
		renderer.setSize( container.dom.offsetWidth, container.dom.offsetHeight );
		renderer.setViewport( 0, 0, container.dom.offsetWidth, container.dom.offsetHeight );
		renderer.render( scene, camera );
		
		window_width = container.dom.offsetWidth;
		window_height = container.dom.offsetHeight;

		renderer.setClearColor( 0xFFFFFF, 1 );
		renderer.clearDepth(); // important!
		renderer.setScissorTest( true );
		renderer.setScissor( 20, window_height - inset_height - 20, inset_width, inset_height );

		renderer.setViewport( 20, window_height - inset_height - 20, inset_width, inset_height );
		
		var tempMatrix = new THREE.Matrix4();
		var eye = new THREE.Vector3();
		eye.applyMatrix4( tempMatrix.extractRotation( camera.matrixWorld ) );
		
		editor.gizmo.update();
		
		renderer.render( scene, gizmo_camera );
		renderer.setScissorTest( false );
		
		
		if ( renderer instanceof THREE.RaytracingRenderer === false ) {
			//renderer.render( sceneHelpers, camera );
		}

		updateAnnotationOpacity();
		updateScreenPosition();

		updateAnnotationPosition();

		renderer.setViewport( 0, 0, container.dom.offsetWidth, container.dom.offsetHeight );
		renderer.setSize( container.dom.offsetWidth, container.dom.offsetHeight );
		
	}

	// 更新三个标签框的位置
	function updateAnnotationOpacity() {
		var measure_position = new THREE.Vector3( 0, 0, 0 );
		
		editor.scene.traverse( function ( child ) {
			if ( child.name === "measure-1-1" ) {
				measure_position = child.position.clone();;
			}
		});
		var distance = camera.position.distanceTo( measure_position );
		var point_distance = camera.position.distanceTo( new THREE.Vector3( 0, 0, 0 ) );
		measure_behind_object = point_distance > distance;
	}

	function updateScreenPosition() {
		var annotation = document.getElementById( "measure-annotation-1" );
		if (annotation === null) {
			return;
		}
		var canvas = renderer.domElement;
		var vector = measure_line_begin_1.clone();
		vector.project( camera );

		vector.x = Math.round( (0.5 + vector.x / 2) * ((canvas.width - 300) / window.devicePixelRatio) );
		vector.y = Math.round( (0.5 - vector.y / 2) * (canvas.height / window.devicePixelRatio) );

		annotation.style.top = vector.y + "px";
		annotation.style.left = vector.x + "px";
		annotation.style.opacity = measure_behind_object ? 1 : 0.35;
	}

	function updateAnnotationPosition() {
		var annotation_count = editor.annotation_count;
		for (var i = 1; i <= annotation_point_list.length; i++) {
			var annotation_id = "annotation-dialog-" + i;
			var annotation = document.getElementById(annotation_id);
			if (annotation != null) {
				var vector = annotation_point_list[i - 1];
				if (vector != null) {
					vector = vector.clone();
					vector.project(camera);
					vector.x = Math.round( ( 0.5 + vector.x / 2 ) * (container.dom.offsetWidth / window.devicePixelRatio) );
					vector.y = Math.round( ( 0.5 - vector.y / 2 ) * (container.dom.offsetHeight / window.devicePixelRatio) );
		
					var num = i %  2;

					var top_pos = 0;
					var left_pos = 0;
					// 奇数，左边
					if (num == 0) {
						top_pos = vector.y - 30;
						if (top_pos <= 20) {
							top_pos = 20;
						}
						else if (top_pos >= (container.dom.offsetHeight - 120)  / window.devicePixelRatio) {
							top_pos = (container.dom.offsetHeight - 120)  / window.devicePixelRatio;
						}

						left_pos = vector.x + 20;
						if (left_pos >= ((container.dom.offsetWidth - 120) / window.devicePixelRatio)) {
							left_pos = ((container.dom.offsetWidth - 120) / window.devicePixelRatio);
						}
						else if (left_pos <= 0) {
							left_pos = 0;
						}
					}
					else {
						top_pos = vector.y - 30;
						if (top_pos <= 20) {
							top_pos = 20;
						}
						else if (top_pos >= (container.dom.offsetHeight - 120)  / window.devicePixelRatio) {
							top_pos = (container.dom.offsetHeight - 120)  / window.devicePixelRatio;
						}

						left_pos = vector.x - 180;
						if (left_pos >= ((container.dom.offsetWidth - 120) / window.devicePixelRatio)) {
							left_pos = ((container.dom.offsetWidth - 120) / window.devicePixelRatio);
						}
						else if (left_pos <= 0) {
							left_pos = 0;
						}
					}

					annotation.style["top"] = top_pos + "px";
					annotation.style["left"] = left_pos + "px";
				}
			}
		}
	}

	return container;

};
