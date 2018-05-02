/**
 * @author mrdoob / http://mrdoob.com/
 */

var SidebarLeft = function ( editor ) {

    var signals = editor.signals;

	var container = new UI.Panel();
	container.setId( 'sidebar-left' );

    var buttons = new UI.Panel();
    container.add( buttons );

    function recoverCutting() {
        G_clip_point_1 = false;
        G_clip_point_2 = false;
        G_clip_point_3 = false;

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
    };

    var cut = new UI.Button( '切割' );
    cut.dom.className = "Button ripple-effect";
    cut.onClick( function() {
        updateSelectedButton( "cut" );
        
        recoverCutting();

        G_clip_point_1 = true;
    } );
    
    buttons.add( cut );
    
    var measure = new UI.Button( '测量' );
    measure.dom.title = 'E';
    measure.dom.className = "Button ripple-effect";
	measure.onClick( function () {
        updateSelectedButton( 'measure' );
        
        if ( !editor.measure_begin ) {
            // 删除所有测量点，测量文字
            for (var i = 1; i <= editor.measure_count; i++) {
                var begin_name = "measure-" + i + "-1";
                var end_name = "measure-" + i + "-2";
                var line_name = "measure-line-" + i; 
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
                var measure_annotation = document.getElementById("measure-" + i);
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
                
                
                
            }
            editor.measure_count = 0;
            editor.signals.sceneGraphChanged.dispatch();
        }

	} );
    buttons.add( measure );

    var comment = new UI.Button( '注释' ).setClass( "Button ripple-effect" );
    comment.onClick( function() {
        updateSelectedButton( "comment" );
        
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

    var expand = new UI.Button( "展开" ).setClass( "Button ripple-effect" );
    expand.onClick( function() {
        updateSelectedButton( "expand" );
        
        var scope = this;
        var pelvis_mesh = null;
        var femur_mesh = null;
        var cut_preview_mesh = null; 
        var femur_helper = null;
        var acetabular_mesh = null;
        var acetabular_inner_mesh = null;
        var hip_header_mesh = null;
        var hip_mesh = null;

        editor.scene.traverse( function( child )  {
            if (child.name === "盆骨") {
                pelvis_mesh = child;
            }
            if (child.name === "股骨") {
                femur_mesh = child;
            }
            if (child.name === "切割预览") {
                cut_preview_mesh = child;
            }
            if (child.name === "股骨外框") {
                femur_helper = child;
            }
            if (child.name === "新髋臼杯") {
                acetabular_mesh =  child;
            }
            if (child.name === "髋臼内衬") {
                acetabular_inner_mesh = child;
            }
            if (child.name === "股骨头假体") {
                hip_header_mesh =  child;
            }
            if (child.name === "股骨柄假体") {
                hip_mesh = child;
            }
        });
        var zero_point = new THREE.Vector3(0, 0, 0);
        var acetabular_position = new THREE.Vector3(-6, 6, 0);
        var acetabular_inner_position = new THREE.Vector3(-4, 4, 0);
        var hip_header_position = new THREE.Vector3(-2, 2, 0);
        console.log("acetabular_mesh:");
        console.log(acetabular_mesh);
        console.log("acetabular_inner_mesh");
        console.log(acetabular_inner_mesh);
        console.log("hip_header_mesh");
        console.log(hip_header_mesh);
        console.log("hip_mesh");
        console.log(hip_mesh);

        if ( editor.is_explod ) {
            pelvis_mesh.visible = false;
            femur_mesh.visible = false;
            femur_helper.visible = false;
            cut_preview_mesh.visible = false;

            acetabular_mesh.position.copy(acetabular_position);
            acetabular_inner_mesh.position.copy(acetabular_inner_position);
            hip_header_mesh.position.copy(hip_header_position);
        }
        else {
            // 一切恢复原样
            pelvis_mesh.visible = true;
            femur_mesh.visible = true;
            femur_helper.visible = false;
            cut_preview_mesh.visible = false;
            acetabular_mesh.position.copy(zero_point);
            acetabular_inner_mesh.position.copy(zero_point);
            hip_header_mesh.position.copy(zero_point);
        }


        editor.signals.sceneGraphChanged.dispatch();

       

    });
    buttons.add( expand );

    var preview = new UI.Button( "预览" ).setClass( "Button ripple-effect" );
    preview.onClick( function(){
        updateSelectedButton( "preview" );

        editor.scene.traverse( function ( child ) {
            if ( child.name == "切割预览" ) {
                if ( editor.is_preview ) {
                    child.visible = true;
                    /*
                    if ( child.material.clippingPlanes == null || child.material.clippingPlanes == [] ) {
                        child.visible = false;
                    }
                    else {
                        
                    }
                    */
                }
                else {
                    child.visible = false;
                }
                editor.signals.sceneGraphChanged.dispatch();
            }
        } );
    } );
    buttons.add( preview );

    function updateSelectedButton( mode ) {
        measure.dom.classList.remove( 'selected' );
        cut.dom.classList.remove( 'selected' );
        comment.dom.classList.remove( 'selected' );
        expand.dom.classList.remove( "selected" );
        preview.dom.classList.remove( "selected" );

        switch ( mode ) {
            case "measure":
                editor.measure_begin = editor.measure_begin ? false : true;
                if ( editor.measure_begin ) {
                    measure.dom.classList.add( "selected" );
                }
                editor.is_annotation = false;
                editor.cutting_begin = false;
                editor.is_explod = false;
                editor.is_preview = false;

                editor.measure_pt_1 = false;
                recoverCutting();
                break;
            case "cut":
                editor.cutting_begin = editor.cutting_begin ? false : true;
                if ( editor.cutting_begin ) {
                    cut.dom.classList.add( "selected" );
                }
                editor.is_annotation = false;
                editor.measure_begin = false;
                editor.measure_pt_1 = false;
                editor.is_explod = false;
                editor.is_preview = false;
                break;
            case "comment":
                editor.is_annotation = editor.is_annotation ? false : true;
                if ( editor.is_annotation ) {
                    comment.dom.classList.add( "selected" );
                }
                editor.cutting_begin = false;
                editor.measure_begin = false;
                editor.measure_pt_1 = false;
                editor.is_explod = false;
                editor.is_preview = false;
                recoverCutting();
                break;
            case "expand":
                editor.is_explod = editor.is_explod ? false : true;
                if ( editor.is_explod ) {
                    expand.dom.classList.add( "selected" );
                }
                editor.cutting_begin = false;
                editor.measure_begin = false;
                editor.measure_pt_1 = false;
                editor.is_preview = false;
                recoverCutting();
                break;
            case "preview":
                editor.is_preview = editor.is_preview ? false : true;
                if ( editor.is_preview ) {
                    preview.dom.classList.add( "selected" );
                }
                editor.cutting_begin = false;
                editor.measure_begin = false;
                editor.measure_pt_1 = false;
                editor.is_explod = false;
                recoverCutting();
                break;
        }
    };
    
	return container;

};
