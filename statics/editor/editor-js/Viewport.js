/**
 * @author mrdoob / http://mrdoob.com/
 */

var Viewport = function ( editor ) {

	var signals = editor.signals;

	var container = new UI.Panel();
	container.setId( 'viewport' );
	container.setPosition( 'absolute' );

	container.add( new Viewport.Info( editor ) );

	//

	var renderer = null;

	var camera = editor.camera;
	var scene = editor.scene;
	var sceneHelpers = editor.sceneHelpers;

	var objects = [];

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

	transformControls.addEventListener( 'mouseDown', function () {

		var object = transformControls.object;

		objectPositionOnDown = object.position.clone();
		objectRotationOnDown = object.rotation.clone();
		objectScaleOnDown = object.scale.clone();

		controls.enabled = false;

	} );
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

			// 更改geometry中的clip_plane
			if ( object.name === "截面" ) {
				var clip_plane = object.clone();

				var vec = Array();
				vec[0] = clip_plane.geometry.vertices[0].clone();
				vec[1] = clip_plane.geometry.vertices[1].clone();
				vec[2] = clip_plane.geometry.vertices[2].clone();

				var axis = new THREE.Vector3( 1, 0, 0 );
                var angle = clip_plane.rotation.x;
                vec[0].applyAxisAngle( axis, angle );
                vec[1].applyAxisAngle( axis, angle );
				vec[2].applyAxisAngle( axis, angle );
				
				var axis_y = new THREE.Vector3( 0, 0, 1 );
                var angle_y = clip_plane.rotation.y;
                vec[0].applyAxisAngle( axis_y, angle_y );
                vec[1].applyAxisAngle( axis_y, angle_y );
                vec[2].applyAxisAngle( axis_y, angle_y );

                var axis_z = new THREE.Vector3( 0, 1, 0 );
                var angle_z = clip_plane.rotation.z;
                vec[0].applyAxisAngle( axis_z, angle_z );
                vec[1].applyAxisAngle( axis_z, angle_z );
                vec[2].applyAxisAngle( axis_z, angle_z );

				var plane = new THREE.Plane( new THREE.Vector3( 0, 0, 0 ), 0);
				plane.setFromCoplanarPoints(vec[0], vec[1], vec[2]);
				
				var another_plane = new THREE.Plane( new THREE.Vector3( 0, 0, 0 ), 0);
				another_plane.normal.x = -plane.normal.x;
				another_plane.normal.y = -plane.normal.y;
				another_plane.normal.z = -plane.normal.z;

				editor.scene.traverse( function( child ) {
					if (child.name === "股骨" ) {
						var clip_object = child;

						var d1 = clip_plane.position;
						var d2 = clip_object.position;

						var d4 = new THREE.Vector3(0, 0, 0);
						var d5 = d1.add(d4);
						
						another_plane.translate( d5 );
						clip_object.material.clippingPlanes = [another_plane];

						this.editor.signals.sceneGraphChanged.dispatch();
					}
					if ( child.name === "切割预览" ) {
						var clip_object = child;
						clip_object.visible = true;

						var d1 = clip_plane.position;
						var d2 = clip_object.position;

						var d4 = new THREE.Vector3(0, 0, 0);
						var d5 = d1.add(d4);
						plane.translate( d5 );
						clip_object.material.clippingPlanes = [plane];
						
						this.editor.signals.sceneGraphChanged.dispatch();
					}

				} );
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

	function getMousePosition( dom, x, y ) {

		var rect = dom.getBoundingClientRect();
		return [ ( x - rect.left ) / rect.width, ( y - rect.top ) / rect.height ];

	}

	function handleMeasure(intersect_target) {
		if ( !editor.measure_begin ) {
			return;
		}
		if (intersect_target == null) {
			return;
		}
		var intersect_point = intersect_target.point;
		
		if (!editor.measure_pt_1) {
			editor.measure_pt_1 = true;
		}
	}

	function handleClick() {

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

				if ( object.name === "股骨" ) {
					if ( G_clip_point_1 == true ) {
						G_clip_point_1 = false;
						G_clip_point_2 = true;
						G_point_list[0] = intersects[0].point;
						editor.scene.traverse( function( child ) {
							if (child.name === "第1点") {
								child.position.set( G_point_list[0].x, G_point_list[0].y, G_point_list[0].z );
								child.visible = true;

								if ( editor.is_annotation ) {
									var annotation = document.getElementById( "point-1" );
									var vector = G_point_list[0].clone();
									vector.project( camera );
									vector.x = Math.round( (0.5 + vector.x / 2) * ((container.dom.offsetWidth - 300) / window.devicePixelRatio) );
									vector.y = Math.round( (0.5 - vector.y / 2) * (container.dom.offsetHeight / window.devicePixelRatio) );

									annotation.style.top = vector.y + "px";
									annotation.style.left = vector.x + "px";

									annotation.style["display"] = "table";
								}
							}
						} );

					}
					else if ( G_clip_point_2 == true ) {
						G_clip_point_2 = false;
						G_clip_point_3 = true;
						G_point_list[ 1 ] = intersects[ 0 ].point;
						editor.scene.traverse( function( child ) {
							if (child.name === "第2点") {
								child.position.set( G_point_list[1].x, G_point_list[1].y, G_point_list[1].z );
								child.visible = true;

								if ( editor.is_annotation ) {
									var annotation = document.getElementById( "point-2" );

									var vector = G_point_list[1].clone();
									vector.project( camera );
								
									vector.x = Math.round( (0.5 + vector.x / 2) * ((container.dom.offsetWidth - 300) / window.devicePixelRatio) );
									vector.y = Math.round( (0.5 - vector.y / 2) * (container.dom.offsetHeight / window.devicePixelRatio) );

									annotation.style.top = vector.y + "px";
									annotation.style.left = vector.x + "px";
								
									annotation.style["display"] = "table";
								}
							}
						} );
					}
					else if ( G_clip_point_3 == true ) {
						G_clip_point_3 = false;
						G_point_list[ 2 ] = intersects[ 0 ].point;
						
						if ( editor.is_annotation ) {
							var annotation = document.getElementById( "point-3" );

							var vector = G_point_list[2].clone();
							vector.project( camera );
								
							vector.x = Math.round( (0.5 + vector.x / 2) * ((container.dom.offsetWidth - 300) / window.devicePixelRatio) );
							vector.y = Math.round( (0.5 - vector.y / 2) * (container.dom.offsetHeight / window.devicePixelRatio) );

							annotation.style.top = vector.y + "px";
							annotation.style.left = vector.x + "px";
								
							annotation.style["display"] = "table";
						}
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
							}
						});
                
					}

				}


			} 
			else {
				editor.select( null );
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

		if ( intersects.length > 0 ) {

			var intersect = intersects[ 0 ];

			var select_object = intersects[0].object;
			// outlinePass.selectedObjects = select_object;
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
				editor.femur_helper.visible = false;
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

			selectionBox.setFromObject( object );
			transformControls.update();

			if ( object.name === "股骨" ) {
				editor.scene.traverse( function ( child ) {
					if ( child.name === "切割预览" ) {
						child.position.set( object.position.x, object.position.y, object.position.z );
					}
				});
			}

			if ( object.name === "第1点" || object.name === "第2点" || object.name === "第3点" ) {
				var femur_object = null;
				for (var i = 0; i < objects.length; i++) {
					if (objects[i].name === "股骨") {
						femur_object = objects[i];
					}
				}
				if (femur_object == null) {
					console.log("There is no femur");
					return;
				}

				var position = object.position.clone();
				var vector = new THREE.Vector3();
				camera.getWorldDirection(vector);
				raycaster.set(position, vector);
				// 根据位移的点，尝试获取新的相交的坐标点
				var intersects = raycaster.intersectObject(femur_object);
				
				var intersect_positions = [];
				if ( intersects.length > 0 ) {
					for (var i = 0; i < intersects.length; i++) {
						intersect_positions.push(intersects[i].point);
					}
				}

				if (intersect_positions.length == 0) {
					var camera_position = camera.position.clone();
					console.log("camera position");
					console.log(camera_position);
					raycaster.set(camera_position, vector);
					var intersects = raycaster.intersectObject(femur_object);
					if ( intersects.length > 0 ) {
						for (var i = 0; i < intersects.length; i++) {
							intersect_positions.push(intersects[i].point);
						}
					}
				}

				if (intersect_positions.length > 0) {
					var short_index = 0;
					for (var i = 0; i < intersect_positions.length - 1; i++) {
						if (intersect_positions[i].distanceTo(position) <= intersect_positions[i+1].distanceTo(position)) {
							short_index = i;
						}
						else {
							short_index = i+1;
						}
					}
					if ( object.name === "第1点" ) {
						G_point_list[ 0 ] = intersect_positions[short_index];
	
					}
					if ( object.name === "第2点" ) {
						G_point_list[ 1 ] = intersect_positions[short_index];
					}
					if ( object.name === "第3点" ) {
						G_point_list[ 2 ] = intersect_positions[short_index];
					}
					object.position.set(intersect_positions[short_index].x, intersect_positions[short_index].y, intersect_positions[short_index].z);
					transformControls.update();
					console.log("change position");
				}
				else {
					console.log("no position?");
					return;
				}

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
						// child.visible = true;
						if ( another_plane.normal.y <= 0.0 ) {
							child.material.clippingPlanes = [another_plane];
						}
						else {
							child.material.clippingPlanes = [plane];
						}
					}
				} );
			}
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

		renderer.setSize( container.dom.offsetWidth, container.dom.offsetHeight );
		
		

		render();

	} );

	signals.showGridChanged.add( function ( showGrid ) {

		grid.visible = showGrid;
		render();

	} );

	//

	function render() {

		sceneHelpers.updateMatrixWorld();
		scene.updateMatrixWorld();

		// 使渲染器支持平面截取
		renderer.localClippingEnabled = true;
		
		renderer.render( scene, camera );

		if ( renderer instanceof THREE.RaytracingRenderer === false ) {
			renderer.render( sceneHelpers, camera );
		}

		updateAnnotationOpacity();
		updateScreenPosition();
	}

	// 更新三个标签框的位置
	function updateAnnotationOpacity() {
		var femur_position = new THREE.Vector3( 0, 0, 0 );
		
		editor.scene.traverse( function ( child ) {
			if ( child.name === "股骨" ) {
				femur_position = child.position.clone();;
			}
		});
		var femur_distance = camera.position.distanceTo( femur_position );

		for (var i = 0; i < G_point_list.length; ++i) {
			var point_distance = camera.position.distanceTo( G_point_list[i] );
			sprite_behind_object[i] = point_distance > femur_distance;
		}
		
	}

	function updateScreenPosition() {
		for ( var i = 0; i < G_point_list.length; ++i ) {
			var annotation = document.getElementById( "point-" + (i + 1) );
			if (annotation === null) {
				break;
			}
			var canvas = renderer.domElement;
			var vector = G_point_list[i].clone();
			vector.project( camera );

			vector.x = Math.round( (0.5 + vector.x / 2) * ((canvas.width - 300) / window.devicePixelRatio) );
			vector.y = Math.round( (0.5 - vector.y / 2) * (canvas.height / window.devicePixelRatio) );

			annotation.style.top = vector.y + "px";
			annotation.style.left = vector.x + "px";
			annotation.style.opacity = sprite_behind_object[i] ? 0.25 : 1;

		}
		
	}

	return container;

};
