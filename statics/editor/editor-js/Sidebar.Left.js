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

	var translate = new UI.Button( '移动' ).setHeight( '80px' ).setWidth( '32px' );
	translate.dom.title = 'W';
	translate.dom.className = 'Button selected';
	translate.onClick( function () {

		signals.transformModeChanged.dispatch( 'translate' );

	} );
    buttons.add( translate );
    
    var rotate = new UI.Button( '旋转' ).setHeight( '80px' ).setWidth( '32px' );
	rotate.dom.title = 'E';
	rotate.onClick( function () {

		signals.transformModeChanged.dispatch( 'rotate' );

	} );
    buttons.add( rotate );
    
    var clipping_pane = new UI.Button( '截面' ).setHeight( '80px' ).setWidth( '32px' );
    clipping_pane.onClick( function() {
        translate.dom.classList.remove( 'selected' );
		rotate.dom.classList.remove( 'selected' );
        clipping_pane.dom.classList.remove( 'selected' );
        expand.dom.classList.remove( 'selected' );
        clipping_pane.dom.classList.add( 'selected' );


        var scope = this;

		editor.scene.traverse( function ( child ) {
            if ( child.name == "髋臼杯" ) {
                var plane = new THREE.Plane( new THREE.Vector3( 0, -1, 0 ), 0.0 );
                child.material.clippingPlanes = [plane];
                
                var another_plane = new THREE.Plane( new THREE.Vector3( 0, 1, 0 ), 0.0 );
                var clip_object = child.clone();
                var object_geometry = child.geometry.clone();
                var object_material =  new THREE.MeshPhongMaterial( {
                    color: 0xFF0000,
                    shininess: 100,
                    side: THREE.DoubleSide,
                    // ***** Clipping setup (material): *****
                    clippingPlanes: [ another_plane ],
                    clipShadows: true
                });
                var object = new THREE.Mesh( object_geometry, object_material );
                object.name = "clip 模拟";
                object.scale.set(clip_object.scale.x, clip_object.scale.y, clip_object.scale.z);

                editor.execute( new AddObjectCommand( object ) );

                var plane_width = 6;
		        var plane_height = 6;
		        var plane_geometry = new THREE.PlaneGeometry( plane_width, plane_height );
		        var plane_material = new THREE.MeshBasicMaterial( {color: 0xA9E2F3, opacity: 0.5, transparent: true, side: THREE.DoubleSide} );
		        var plane_mesh = new THREE.Mesh( plane_geometry, plane_material );
		        plane_mesh.position.set( 0, 0, 0 );
		        plane_mesh.rotation.set( Math.PI / 2, 0, 0 );
		        plane_mesh.name = "截面";

                editor.execute( new AddObjectCommand( plane_mesh ) );

            }

		} );
        
    } );
    buttons.add( clipping_pane );

    var expand = new UI.Button( '扩展' ).setHeight( '80px' ).setWidth( '32px' );
    expand.onClick( function() {
        translate.dom.classList.remove( 'selected' );
		rotate.dom.classList.remove( 'selected' );
        clipping_pane.dom.classList.remove( 'selected' );
        expand.dom.classList.remove( 'selected' );
        expand.dom.classList.add( 'selected' );
    } );
    buttons.add( expand );

    var close_clip = new UI.Button( "关闭/打开 " ).setHeight( "80px" ).setWidth( "32px" );
    close_clip.onClick( function() {
        translate.dom.classList.remove( "selected" );
        rotate.dom.classList.remove( "selected" );
        clipping_pane.dom.classList.remove( "selected" );
        expand.dom.classList.remove( "selected" );
        close_clip.dom.classList.remove( "selected" );
        close_clip.dom.classList.add( "selected" );

        var scope = this;
        editor.scene.traverse( function ( child ) {
            if ( child.name == "clip 模拟" ) {
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
    buttons.add( close_clip );
    
    signals.transformModeChanged.add( function ( mode ) {

		translate.dom.classList.remove( 'selected' );
		rotate.dom.classList.remove( 'selected' );
        // scale.dom.classList.remove( 'selected' );
        clipping_pane.dom.classList.remove( 'selected' );
        expand.dom.classList.remove( 'selected' );
        close_clip.dom.classList.remove( "selected" );

		switch ( mode ) {
        	case 'translate': translate.dom.classList.add( 'selected' ); break;
			case 'rotate': rotate.dom.classList.add( 'selected' ); break;
            // case 'scale': scale.dom.classList.add( 'selected' ); break;
           
        }

    } );

    
    
	return container;

};
