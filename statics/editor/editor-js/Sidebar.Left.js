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
        console.log("截面");
        translate.dom.classList.remove( 'selected' );
		rotate.dom.classList.remove( 'selected' );
        clipping_pane.dom.classList.remove( 'selected' );
        expand.dom.classList.remove( 'selected' );
        clipping_pane.dom.classList.add( 'selected' );


        var scope = this;

		editor.scene.traverse( function ( child ) {
            if ( child.name == "髋臼杯" ) {
                var plane = new THREE.Plane( new THREE.Vector3( 0, -1, 0 ), 0.5 );
                child.material.clippingPlanes = [plane];

                var plane_width = 6;
		        var plane_height = 6;
		        var plane_geometry = new THREE.PlaneGeometry( plane_width, plane_height );
		        var plane_material = new THREE.MeshBasicMaterial( {color: 0xA9E2F3, opacity: 0.5, transparent: true, side: THREE.DoubleSide} );
		        var plane_mesh = new THREE.Mesh( plane_geometry, plane_material );
		        plane_mesh.position.set( 0, 0.5, 0 );
		        plane_mesh.rotation.set( Math.PI / 2, 0, 0 );
		        plane_mesh.name = "截面";

		        editor.execute( new AddObjectCommand( plane_mesh ) );
            }

		} );
        
    } );
    buttons.add( clipping_pane );

    var expand = new UI.Button( '扩展' ).setHeight( '80px' ).setWidth( '32px' );
    expand.onClick( function() {
        console.log("扩展");
        translate.dom.classList.remove( 'selected' );
		rotate.dom.classList.remove( 'selected' );
        clipping_pane.dom.classList.remove( 'selected' );
        expand.dom.classList.remove( 'selected' );
        expand.dom.classList.add( 'selected' );
    } );
    buttons.add( expand );
    
    signals.transformModeChanged.add( function ( mode ) {

		translate.dom.classList.remove( 'selected' );
		rotate.dom.classList.remove( 'selected' );
        // scale.dom.classList.remove( 'selected' );
        clipping_pane.dom.classList.remove( 'selected' );
        expand.dom.classList.remove( 'selected' );

		switch ( mode ) {
        	case 'translate': translate.dom.classList.add( 'selected' ); break;
			case 'rotate': rotate.dom.classList.add( 'selected' ); break;
            // case 'scale': scale.dom.classList.add( 'selected' ); break;
           
        }

    } );

    
    
	return container;

};
