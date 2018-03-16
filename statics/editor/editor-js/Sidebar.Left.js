/**
 * @author mrdoob / http://mrdoob.com/
 */

var SidebarLeft = function ( editor ) {

    var signals = editor.signals;

	var container = new UI.Panel();
	container.setId( 'sidebar-left' );

    var buttons = new UI.Panel();
	container.add( buttons );

	// translate / rotate / scale

	var translate = new UI.Button( '移动' );
	translate.dom.title = 'W';
    translate.dom.className = 'Button selected';
    translate.dom.textContent = "移动";
	translate.onClick( function () {

		signals.transformModeChanged.dispatch( 'translate' );

	} );
    buttons.add( translate );
    
    var cut = new UI.Button( '切割' )
    cut.onClick( function() {
        updateSelectedButton( "cut" );

        var scope = this;
        
		editor.scene.traverse( function ( child ) {
            if ( child.name === "股骨" ) {
                var plane = new THREE.Plane( new THREE.Vector3( 0, 0, 0 ), 0.0 );
                
                var plane_width = 6;
		        var plane_height = 6;
                var plane_geometry = new THREE.PlaneGeometry( plane_width, plane_height );
                var plane_material = new THREE.MeshBasicMaterial( {color: 0xA9E2F3, opacity: 0.5, transparent: true, side: THREE.DoubleSide} );
		        var plane_mesh = new THREE.Mesh( plane_geometry, plane_material );
		        plane_mesh.name = "截面";
                plane_mesh.position.set( child.position.x + 4.0, child.position.y - 3, child.position.z - 3.7 );
		        plane_mesh.rotation.set( Math.PI / 180 * 35, 0, 0 );
               
                var v1 = plane_mesh.geometry.vertices[0].clone();
                var v2 = plane_mesh.geometry.vertices[1].clone();
                var v3 = plane_mesh.geometry.vertices[2].clone();

                var v4 = plane_mesh.geometry.vertices[0].clone();
                var v5 = plane_mesh.geometry.vertices[1].clone();
                var v6 = plane_mesh.geometry.vertices[2].clone();

                var axis = new THREE.Vector3( 1, 0, 0 );
                var angle = plane_mesh.rotation.x;
                v1.applyAxisAngle( axis, angle );
                v2.applyAxisAngle( axis, angle );
                v3.applyAxisAngle( axis, angle );

                

                plane.setFromCoplanarPoints( v1, v2, v3 );
                plane.constant = 5.0;
                
                var axis = new THREE.Vector3( -1, 0, 0 );
                var angle =  -(Math.PI / 180 * 145);
                v4.applyAxisAngle( axis, angle );
                v5.applyAxisAngle( axis, angle );
                v5.applyAxisAngle( axis, angle );
                
                var another_plane = new THREE.Plane( new THREE.Vector3( 0, 0, 0 ), 0.0 );
                another_plane.constant = -5.0
                another_plane.normal.x = -plane.normal.x;
                another_plane.normal.y = -plane.normal.y;
                another_plane.normal.z = -plane.normal.z;
                child.material.clippingPlanes = [another_plane];
                console.log(child.material);

                
                editor.scene.traverse( function ( object ) {
                    if ( object.name === "切割预览" ) {
                        
                        object.visible = true;
                        object.position.set(child.position.x, child.position.y, child.position.z);
                        object.material.clippingPlanes = [plane];
                    }
                });
                
                editor.execute( new AddObjectCommand( plane_mesh ) );

            }
            
        } );
        
    } );
    buttons.add( cut );

    var measure = new UI.Button( '测量' );
	measure.dom.title = 'E';
	measure.onClick( function () {
        updateSelectedButton( 'measure' );
	} );
    buttons.add( measure );

    var comment = new UI.Button( '注释' );
    comment.onClick( function() {
        updateSelectedButton( "comment" );

        
        editor.scene.traverse( function ( child ) {
            if ( child.name == "切割预览" ) {
                if (child.visible === true) {
                    child.visible = false;
                }
                else {
                    child.visible = true;
                }
                editor.signals.sceneGraphChanged.dispatch();
            }
        } );

    } );
    buttons.add( comment );

    var zoom = new UI.Button( "放大" );
    zoom.onClick( function() {
        updateSelectedButton( "zoom" );
        var acetabular_cup_close_x = 0.0;
        var acetabular_cup_close_y = -0.98;
        var acetabular_cup_close_z = 2.99;

        var acetabular_cup_expand_x = 0;
        var acetabular_cup_expand_y = 3;
        var acetabular_cup_expand_z = 2.49;

        var hip_implant_close_x = -0.59;
        var hip_implant_close_y = -4.35;
        var hip_implant_close_z = 5.67;

        var hip_implant_expand_x = -0.59;
        var hip_implant_expand_y = -4.85;
        var hip_implant_expand_z = 5.67;
        var scope = this;

        editor.scene.traverse( function( child )  {
            if ( child.name === "髋臼杯" ) {
                if ( child.position.x == acetabular_cup_close_x ) {
                    child.position.x = acetabular_cup_expand_x;
                }
                else if ( child.position.x == acetabular_cup_expand_x ) {
                    child.position.x = acetabular_cup_close_x;
                }
                else {
                    child.position.x = acetabular_cup_close_x;
                }

                if ( child.position.y == acetabular_cup_close_y ) {
                    child.position.y = acetabular_cup_expand_y;
                }
                else if ( child.position.y == acetabular_cup_expand_y ) {
                    child.position.y = acetabular_cup_close_y;
                }
                else {
                    child.position.y = acetabular_cup_close_y;
                }

                if ( child.position.z == acetabular_cup_close_z ) {
                    child.position.z = acetabular_cup_expand_z;
                }
                else if ( child.position.z == acetabular_cup_expand_z ) {
                    child.position.z = acetabular_cup_close_z;
                }
            }

            if ( child.name === "髋关节植入体" ) {
                if ( child.position.x == hip_implant_close_x ) {
                    child.position.x = hip_implant_expand_x;
                }
                else {
                    child.position.x = hip_implant_close_x;
                }

                if ( child.position.y == hip_implant_close_y ) {
                    child.position.y = hip_implant_expand_y;
                }
                else {
                    child.position.y = hip_implant_close_y;
                }

                if ( child.position.z == hip_implant_close_z ) {
                    child.position.z = hip_implant_expand_z;
                }
                else {
                    child.position.z = hip_implant_close_z;
                }
            }
        });
        editor.signals.objectChanged.dispatch( editor.selected );

       

    } );
    buttons.add( zoom );

    function updateSelectedButton( mode ) {
        translate.dom.classList.remove( 'selected' );
		measure.dom.classList.remove( 'selected' );
        cut.dom.classList.remove( 'selected' );
        comment.dom.classList.remove( 'selected' );
        zoom.dom.classList.remove( "selected" );

        switch ( mode ) {
            case "measure":
                measure.dom.classList.add( "selected" );
                break;
            case "cut":
                cut.dom.classList.add( "selected" );
                break;
            case "comment":
                comment.dom.classList.add( "selected" );
                break;
            case "zoom":
                zoom.dom.classList.add( "selected" );
                break;
        }
    };
    
    signals.transformModeChanged.add( function ( mode ) {

		translate.dom.classList.remove( 'selected' );
		measure.dom.classList.remove( 'selected' );
        cut.dom.classList.remove( 'selected' );
        comment.dom.classList.remove( 'selected' );
        zoom.dom.classList.remove( "selected" );

		switch ( mode ) {
        	case 'translate': translate.dom.classList.add( 'selected' ); break;
			//case 'rotate': rotate.dom.classList.add( 'selected' ); break;
            // case 'scale': scale.dom.classList.add( 'selected' ); break;
           
        }

    } );

    
    
	return container;

};
