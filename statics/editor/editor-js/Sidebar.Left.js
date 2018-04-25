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
    translate.dom.className = 'Button selected ripple-effect';
    translate.dom.textContent = "移动";
	translate.onClick( function () {

		signals.transformModeChanged.dispatch( 'translate' );

	} );
    buttons.add( translate );
    
    var cut = new UI.Button( '切割' );
    cut.dom.className = "Button ripple-effect";
    cut.onClick( function() {
        updateSelectedButton( "cut" );

        G_clip_point_1 = true;
        editor.scene.traverse( function ( object ) {
            if ( object.name === "股骨" ) {
                var femur = object;
                femur.material.clippingPlanes = [];

                editor.scene.traverse( function ( another_object ) {
                    if ( another_object.name === "切割预览" ) {
                
                        another_object.visible = false;
                        another_object.position.set(femur.position.x, femur.position.y, femur.position.z);
                        another_object.rotation.set(femur.rotation.x, femur.rotation.y, femur.rotation.z);
                        another_object.material.clippingPlanes = [];
                    }
                } );
            }
            if ( object.name === "第1点" || object.name === "第2点" || object.name === "第3点") {
                object.visible = false;
            }
        
        } );
        editor.select(null);

        var p1_annotation = document.getElementById( "point-1" );
        p1_annotation.style["display"] = "none";
        var p2_annotation = document.getElementById( "point-2" );
        p2_annotation.style["display"] = "none";
        var p3_annotation = document.getElementById( "point-3" );
        p3_annotation.style["display"] = "none";

        editor.signals.sceneGraphChanged.dispatch();
        
    } );
    
    buttons.add( cut );
    
    var measure = new UI.Button( '测量' );
    measure.dom.title = 'E';
    measure.dom.className = "Button ripple-effect";
	measure.onClick( function () {
        updateSelectedButton( 'measure' );
	} );
    buttons.add( measure );

    var comment = new UI.Button( '注释' ).setClass( "Button ripple-effect" );
    comment.onClick( function() {
        updateSelectedButton( "comment" );

        editor.is_annotation = editor.is_annotation ? false : true;
        
        if ( editor.is_annotation ) {
            for ( var i = 1; i <= 3; ++i ) {
                var point_comment = document.getElementById( "point-" + i );
                if ( point_comment != null ) {
                    if ( point_comment.style["display"] == "none" ) {
                        point_comment.style["display"] = "table";
                    }
                    else {
                        point_comment.style["display"] = "none";
                    }
                }
            }
        }
        else {
            for ( var i = 1; i <= 3; ++i ) {
                var point_comment = document.getElementById( "point-" + i );
                if ( point_comment != null ) {
                    point_comment.style["display"] = "none";
                }
            }
        }

        

    } );
    buttons.add( comment );

    var zoom = new UI.Button( "展开" ).setClass( "Button ripple-effect" );
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

    var preview = new UI.Button( "预览" ).setClass( "Button ripple-effect" );
    preview.onClick( function() {
        updateSelectedButton( "preview" );
   
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
    buttons.add( preview );

    function updateSelectedButton( mode ) {
        translate.dom.classList.remove( 'selected' );
		measure.dom.classList.remove( 'selected' );
        cut.dom.classList.remove( 'selected' );
        comment.dom.classList.remove( 'selected' );
        zoom.dom.classList.remove( "selected" );
        preview.dom.classList.remove( "selected" );

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
            case "preview":
                preview.dom.classList.add( "selected" );
                break;
        }
    };
    
    signals.transformModeChanged.add( function ( mode ) {

		translate.dom.classList.remove( 'selected' );
		measure.dom.classList.remove( 'selected' );
        cut.dom.classList.remove( 'selected' );
        comment.dom.classList.remove( 'selected' );
        zoom.dom.classList.remove( "selected" );
        preview.dom.classList.remove( "selected" );

		switch ( mode ) {
        	case 'translate': translate.dom.classList.add( 'selected' ); break;
			//case 'rotate': rotate.dom.classList.add( 'selected' ); break;
            // case 'scale': scale.dom.classList.add( 'selected' ); break;
           
        }

    } );

    
    
	return container;

};
