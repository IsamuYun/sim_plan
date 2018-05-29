/**
 * @author mrdoob / http://mrdoob.com/
 */

var left_cut;
var left_preview;
var left_measure;
var left_annotation;
var left_explod;

var SidebarLeft = function ( editor ) {

    var signals = editor.signals;

	var container = new UI.Panel();
	container.setId( 'sidebar-left' );

    var buttons = new UI.Panel();
    container.add( buttons );

    function clearClipPoint() {
        G_clip_point_1 = false;
        G_clip_point_2 = false;
        G_clip_point_3 = false;

        editor.scene.traverse( function ( object ) {
            if ( object.name === "第1点" || object.name === "第2点" || object.name === "第3点") {
                object.visible = false;
            }
        
        } );
        editor.select(null);

        editor.signals.sceneGraphChanged.dispatch();
    }

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

        editor.signals.sceneGraphChanged.dispatch();
    };

    function clearMeasure() {
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
        editor.signals.sceneGraphChanged.dispatch();
    }
    var cut_tips = "选中股骨上的三个点进行切割";
    var preview_tips = "预览切割的效果";
    var measure_tips = "测量两点之间的距离";
    var annotation_tips = "添加额外的描述信息";
    var explod_tips = "展开假体组织";

    function display_tips(tips) {
        var tip = document.getElementById("tip-message");
        if (tip == null) {
            return;
        } 
        tip.style["display"] = "inline-block";
        tip.innerHTML = tips;
    }
    left_cut = function() {
        updateSelectedButton( "cut" );
        
        recoverCutting();

        G_clip_point_1 = true;

        display_tips(cut_tips);
    };

    var cut = new UI.Button( '' );
    cut.dom.innerHTML = "切<br />割";
    cut.dom.className = "Button ripple-effect cut-blue";
    cut.onClick( function() {
        left_cut();
    } );
    cut.onMouseOver( function() {
        display_tips(cut_tips);
    });
    buttons.add( cut );

    left_preview = function() {
        updateSelectedButton( "preview" );

        editor.scene.traverse( function ( child ) {
            if ( child.name == "切割预览" ) {
                if ( editor.is_preview ) {
                    child.visible = false;
                }
                else {
                    if (child.material.chippingPlanes != null ) {
                        if (child.material.chippingPlanes.length == 0) {
                            child.visible = false;
                        }
                        else {
                            child.visible = false;
                        }
                    }
                    else {
                        child.visible = true;
                    }
                }
                editor.signals.sceneGraphChanged.dispatch();
            }
        } );

        display_tips(preview_tips);
    };

    var preview = new UI.Button( "" ).setClass( "Button ripple-effect preview-blue" );
    preview.dom.innerHTML = "预<br />览";
    preview.onClick( function(){
        left_preview();
    } );
    preview.onMouseOver(function() {
        display_tips(preview_tips);
    });
    buttons.add( preview );

    left_measure = function() {
        updateSelectedButton( 'measure' );
        
        if ( !editor.measure_begin ) {
            clearMeasure();
        }
        display_tips(measure_tips);
    };
    
    var measure = new UI.Button( '' );
    measure.dom.innerHTML = "测<br />量";
    measure.dom.title = 'E';
    measure.dom.className = "Button ripple-effect measure-blue";
	measure.onClick( function () {
        left_measure();
    } );
    measure.onMouseOver(function() {
        display_tips(measure_tips);
    });
    buttons.add( measure );
    
    left_annotation = function() {
        updateSelectedButton( "comment" );
        var annotation_count = editor.annotation_count;
        for (var i = 0; i <= annotation_count; i++) {
            var annotation_point = null;
            var annotation_dialog = null;
            editor.scene.traverse(function(child) {
                if (child.name === ("annotation-point-" + i)) {
                    if (editor.is_annotation) {
                        child.visible = true;
                    }
                    else {
                        child.visible = false;
                    }
                }
            });
            annotation_dialog = document.getElementById("annotation-dialog-" + i);
            if (annotation_dialog != null) {
                if (editor.is_annotation) {
                    annotation_dialog.style["display"] = "inline-block";
                }
                else {
                    annotation_dialog.style["display"] = "none";
                }
            }
        }
        editor.signals.sceneGraphChanged.dispatch();
        display_tips(annotation_tips);
    };

    var comment = new UI.Button( '' ).setClass( "Button ripple-effect annotation-blue" );
    comment.dom.innerHTML = "注<br />释";
    comment.onClick( function() {
        left_annotation();
    } );
    comment.onMouseOver(function() {
        display_tips(annotation_tips);
    });
    buttons.add( comment );

    left_explod = function() {
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
        display_tips(explod_tips);
    };

    var expand = new UI.Button( "" ).setClass( "Button ripple-effect explod-blue" );
    expand.dom.innerHTML = "展<br />开";
    expand.onClick( function() {
        left_explod();
    });
    expand.onMouseOver(function() {
        display_tips(explod_tips);
    });
    buttons.add( expand );

    function reoverExplod() {
        var pelvis_mesh = null;
        var femur_mesh = null;
        var cut_preview_mesh = null; 
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
        
        if (pelvis_mesh == null || femur_mesh == null || cut_preview_mesh == null || acetabular_mesh == null || 
            acetabular_inner_mesh == null || hip_header_mesh == null) {
            return;
        }

        // 一切恢复原样
        pelvis_mesh.visible = true;
        femur_mesh.visible = true;
        cut_preview_mesh.visible = false;
        acetabular_mesh.position.copy(zero_point);
        acetabular_inner_mesh.position.copy(zero_point);
        hip_header_mesh.position.copy(zero_point);
        
        editor.signals.sceneGraphChanged.dispatch();
    };
   

    function updateSelectedButton( mode ) {
        measure.dom.classList.remove( 'selected' );
        measure.dom.classList.remove("measure-white");
        measure.dom.classList.add("measure-blue");
        cut.dom.classList.remove('selected');
        cut.dom.classList.remove('cut-white');
        cut.dom.classList.add('cut-blue');
        comment.dom.classList.remove('selected');
        comment.dom.classList.remove('annotation-white');
        comment.dom.classList.add('annotation-blue');
        expand.dom.classList.remove("selected");
        expand.dom.classList.remove("explod-white");
        expand.dom.classList.add("explod-blue");
        preview.dom.classList.remove("selected");
        preview.dom.classList.remove("preview-white");
        preview.dom.classList.add("preview-blue");
        
        switch ( mode ) {
            case "measure":
                editor.measure_begin = editor.measure_begin ? false : true;
                if ( editor.measure_begin ) {
                    measure.dom.classList.remove("measure-blue");
                    measure.dom.classList.add("selected");
                    measure.dom.classList.add("measure-white");
                }
                else {
                    measure.dom.classList.remove("measure-white");
                    measure.dom.classList.add("measure-blue");
                }
                editor.is_annotation = false;
                editor.cutting_begin = false;
                editor.is_explod = false;
                editor.is_preview = false;
                editor.measure_pt_1 = false;
                recoverCutting();
                reoverExplod();
                break;
            case "cut":
                editor.cutting_begin = editor.cutting_begin ? false : true;
                if ( editor.cutting_begin ) {
                    cut.dom.classList.remove('cut-blue');
                    cut.dom.classList.add("selected");
                    cut.dom.classList.add("cut-white");
                }
                else {
                    cut.dom.classList.remove('cut-white');
                    cut.dom.classList.add("cut-blue");
                }
                editor.is_annotation = false;
                editor.measure_begin = false;
                editor.measure_pt_1 = false;
                editor.is_explod = false;
                editor.is_preview = false;
                clearMeasure();
                reoverExplod();
                break;
            case "comment":
                editor.is_annotation = editor.is_annotation ? false : true;
                if ( editor.is_annotation ) {
                    comment.dom.classList.remove( 'annotation-blue' );
                    comment.dom.classList.add("selected");
                    comment.dom.classList.add("annotation-white");
                }
                else {
                    comment.dom.classList.remove( 'annotation-white' );
                    comment.dom.classList.add("annotation-blue");
                }
                editor.cutting_begin = false;
                editor.measure_begin = false;
                editor.measure_pt_1 = false;
                editor.is_explod = false;
                editor.is_preview = false;
                recoverCutting();
                clearMeasure();
                reoverExplod();
                break;
            case "expand":
                editor.is_explod = editor.is_explod ? false : true;
                if ( editor.is_explod ) {
                    expand.dom.classList.remove("explod-blue");
                    expand.dom.classList.add("selected");
                    expand.dom.classList.add("explod-white");
                }
                else {
                    expand.dom.classList.remove("explod-white");
                    expand.dom.classList.add("explod-blue");
                }
                editor.cutting_begin = false;
                editor.measure_begin = false;
                editor.measure_pt_1 = false;
                editor.is_preview = false;
                recoverCutting();
                clearMeasure();
                break;
            case "preview":
                editor.is_preview = editor.is_preview ? false : true;
                if ( editor.is_preview ) {
                    preview.dom.classList.remove("preview-blue");
                    preview.dom.classList.add("selected");
                    preview.dom.classList.add("preview-white");
                }
                else {
                    preview.dom.classList.remove("preview-white");
                    preview.dom.classList.add("preview-blue");
                }
                editor.cutting_begin = false;
                editor.measure_begin = false;
                editor.measure_pt_1 = false;
                editor.is_explod = false;
                clearClipPoint();
                clearMeasure();
                reoverExplod();
                break;
        }
    };
    
	return container;

};
