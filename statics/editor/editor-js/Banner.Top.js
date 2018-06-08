/**
 * @author Isamu 20180529
 */

var banner_ct;
var banner_transparency;
var banner_front_view;
var banner_back_view;
var banner_left_view;
var banner_right_view;
var banner_top_view;
var banner_bottom_view;

var BannerTop = function ( editor ) {
    var signals = editor.signals;

	var container = new UI.Panel();
	container.setId("banner-top");
    
    banner_ct = function() {
        editor.ct_box = editor.ct_box ? false : true;
        
        updateSelectedButton("ct_box", editor.ct_box);
        
        var scene_box = document.getElementById( "sidebar-scene-box" );
        var sidebar = document.getElementById( "sidebar-ct-box" );

        if (scene_box == null || sidebar == null) {
            return;
        }

        if ( editor.ct_box == true ) {
            scene_box.style["right"] = "calc(18% + 10px)";
            sidebar.style["display"] = "";
        }
        else {
            scene_box.style["right"] = "10px";
            sidebar.style["display"] = "none";
        }
    };

    banner_transparency = function() {
        editor.bone_transparency = editor.bone_transparency ? false : true;
        updateSelectedButton("transparency", editor.bone_transparency);
        editor.scene.traverse( function( child ) {
            if ( child.name === "股骨" || child.name === "盆骨" ) {
                if ( child.material.opacity == 0.4 && child.material.transparent == true ) {
                    child.material.opacity = 1.0;
                    child.material.transparent = false;
                }
                else {
                    child.material.opacity = 0.4;
                    child.material.transparent = true;
                }
            }
            editor.signals.sceneGraphChanged.dispatch();
        });
    };

    banner_front_view = function() {
        updateViewMode("front");
        
        new_pos.x = middle_point.x;
        new_pos.y = middle_point.y;
        new_pos.z = middle_point.z;
        new_up = new THREE.Vector3(0, 1, 0);
        
        editor.camera.position.set(new_pos.x, new_pos.y, new_pos.z);
        editor.camera.up.copy(new_up);
        editor.camera.lookAt(new THREE.Vector3(0, 0, 0));

        editor.camera.rotation.copy(new_rotation);

        editor.signals.sceneGraphChanged.dispatch();
    };

    banner_back_view = function() {
        updateViewMode("back");
        new_up = new THREE.Vector3(0, 1, 0);
        new_pos.x = middle_point.x;
        new_pos.y = middle_point.y;
        new_pos.z = middle_point.z - 60.0;
        new_rotation = new THREE.Vector3(0, 0, 0);

        
        editor.camera.position.set(new_pos.x, new_pos.y, new_pos.z);
        editor.camera.up.copy(new_up);
        editor.camera.lookAt(new THREE.Vector3(0, 0, 0));
        editor.camera.rotation.copy(new_rotation);


        editor.signals.sceneGraphChanged.dispatch();
    };

    banner_left_view = function() {
        updateViewMode("left");

        new_up = new THREE.Vector3(0, 1, 0);
        new_pos.x = middle_point.x - 40.0;
        new_pos.y = middle_point.y;
        new_pos.z = middle_point.z;
        new_rotation = new THREE.Vector3(0, 0, 0);

        editor.camera.position.set(new_pos.x, new_pos.y, new_pos.z);
        editor.camera.up.copy(new_up);
        editor.camera.lookAt(new THREE.Vector3(0, 0, 0));
        editor.camera.rotation.copy(new_rotation);


        editor.signals.sceneGraphChanged.dispatch();
    };

    banner_right_view = function() {
        updateViewMode("right");

        new_up = new THREE.Vector3(0, 1, 0);
        new_pos.x = middle_point.x + 40.0;
        new_pos.y = middle_point.y;
        new_pos.z = middle_point.z;
        new_rotation = new THREE.Vector3(0, 0, 0);

        editor.camera.position.set(new_pos.x, new_pos.y, new_pos.z);
        editor.camera.up.copy(new_up);
        editor.camera.lookAt(new THREE.Vector3(0, 0, 0));
        editor.camera.rotation.copy(new_rotation);

        editor.signals.sceneGraphChanged.dispatch();
    };

    banner_top_view = function() {
        updateViewMode("top");

        new_up = new THREE.Vector3(0, 1, 0);
        new_pos.x = middle_point.x;
        new_pos.y = middle_point.y + 40;
        new_pos.z = middle_point.z - 30;
        new_rotation = new THREE.Vector3(0, 0, 0);

        editor.camera.position.set(new_pos.x, new_pos.y, new_pos.z);
        editor.camera.up.copy(new_up);
        editor.camera.lookAt(new THREE.Vector3(0, 0, 0));
        editor.camera.rotation.copy(new_rotation);


        editor.signals.sceneGraphChanged.dispatch();
    };

    banner_bottom_view = function() {
        updateViewMode("bottom");

        new_up = new THREE.Vector3(0, 1, 0);
        new_pos.x = middle_point.x;
        new_pos.y = middle_point.y - 40.0;
        new_pos.z = middle_point.z - 30;
        new_rotation = new THREE.Vector3(0, 0, 0);

        editor.camera.position.set(new_pos.x, new_pos.y, new_pos.z);
        editor.camera.up.copy(new_up);
        editor.camera.lookAt(new THREE.Vector3(0, 0, 0));
        editor.camera.rotation.copy(new_rotation);


        editor.signals.sceneGraphChanged.dispatch();
    };

    var ct_box = new UI.Button( "CT" );
    ct_box.setClass( "ripple-effect ct-blue" );
    ct_box.onClick( function () {
        banner_ct();
    } );

    var transparency_button = new UI.Button( "半透明" ).setClass("ripple-effect transparency-blue");
    transparency_button.onClick( function() {
        banner_transparency();
    } );

    var view_mode_button = new UI.Button("").setClass("ripple-effect view-default");
    view_mode_button.onClick(function() {
        editor.view_mode_change = editor.view_mode_change ? false : true;
        if (editor.view_mode_change) {
            if (front_view_button != null) {
                front_view_button.setDisplay("inline-block");
            }
            if (back_view_button != null) {
                back_view_button.setDisplay("inline-block");
            }
            if (left_view_button != null) {
                left_view_button.setDisplay("inline-block");
            }
            if (right_view_button != null) {
                right_view_button.setDisplay("inline-block");
            }
            if (top_view_button != null) {
                top_view_button.setDisplay("inline-block");
            }
            if (bottom_view_button != null) {
                bottom_view_button.setDisplay("inline-block");
            }
        }
        else {
            if (front_view_button != null) {
                front_view_button.setDisplay("none");
            }
            if (back_view_button != null) {
                back_view_button.setDisplay("none");
            }
            if (left_view_button != null) {
                left_view_button.setDisplay("none");
            }
            if (right_view_button != null) {
                right_view_button.setDisplay("none");
            }
            if (top_view_button != null) {
                top_view_button.setDisplay("none");
            }
            if (bottom_view_button != null) {
                bottom_view_button.setDisplay("none");
            }
        }
    });

    

    container.add(ct_box);
    container.add(transparency_button);
    container.add(view_mode_button);

    var middle_point = new THREE.Vector3(0, 0, 30);
    var new_pos = new THREE.Vector3(0, 0, 0);
    var new_up = new THREE.Vector3(0, 1, 0);
    var new_rotation = new THREE.Vector3(0, 0, 0);

    // 1. 前 2. 后 3.左 4.右 5.上 6.下
    var front_view_button = new UI.Button("").setClass("ripple-effect front-view-blue").setId("front-view-icon");
    front_view_button.setDisplay("none");
    front_view_button.onClick(function() {
        banner_front_view();
    });
    container.add(front_view_button);

    var back_view_button = new UI.Button("").setClass("ripple-effect back-view-blue").setId("back-view-icon");
    back_view_button.setDisplay("none");
    back_view_button.onClick(function() {
        banner_back_view();
    });
    container.add(back_view_button);

    var left_view_button = new UI.Button("").setClass("ripple-effect left-view-blue").setId("left-view-icon");
    left_view_button.setDisplay("none");
    left_view_button.onClick(function() {
        banner_left_view();
    });
    container.add(left_view_button);

    var right_view_button = new UI.Button("").setClass("ripple-effect right-view-blue").setId("right-view-icon");
    right_view_button.setDisplay("none");
    right_view_button.onClick(function() {
        banner_right_view();
    });
    container.add(right_view_button);

    var top_view_button = new UI.Button("").setClass("ripple-effect top-view-blue").setId("top-view-icon");
    top_view_button.setDisplay("none");
    top_view_button.onClick(function() {
        banner_top_view();
    });
    container.add(top_view_button);

    var bottom_view_button = new UI.Button("").setClass("ripple-effect bottom-view-blue").setId("bottom-view-icon");
    bottom_view_button.setDisplay("none");
    bottom_view_button.onClick(function() {
        banner_bottom_view();
    });
    container.add(bottom_view_button);

    function updateSelectedButton( mode, status ) {
        switch ( mode ) {
            case "ct_box":
                ct_box.dom.classList.remove("ct-blue");
                ct_box.dom.classList.remove("ct-white");
                if (status == true) {
                    ct_box.dom.classList.add("ct-white");
                }
                else {
                    ct_box.dom.classList.add("ct-blue");
                }
                break;
            case "transparency":
                transparency_button.dom.classList.remove("transparency-blue");
                transparency_button.dom.classList.remove("transparency-white");
                if (status == true) {
                    transparency_button.dom.classList.add("transparency-white");
                }
                else {
                    transparency_button.dom.classList.add("transparency-blue");
                }
                break;
        }
    };

    // 更换视图的CSS类
    function updateViewMode(mode) {
        front_view_button.dom.classList.remove("front-view-blue");
        front_view_button.dom.classList.remove("front-view-white");
        back_view_button.dom.classList.remove("back-view-blue");
        back_view_button.dom.classList.remove("back-view-white");
        left_view_button.dom.classList.remove("left-view-blue");
        left_view_button.dom.classList.remove("left-view-white");
        right_view_button.dom.classList.remove("right-view-blue");
        right_view_button.dom.classList.remove("right-view-white");
        top_view_button.dom.classList.remove("top-view-blue");
        top_view_button.dom.classList.remove("top-view-white");
        bottom_view_button.dom.classList.remove("bottom-view-blue");
        bottom_view_button.dom.classList.remove("bottom-view-white");

        switch(mode) {
            case "front":
                front_view_button.dom.classList.add("front-view-white");
                back_view_button.dom.classList.add("back-view-blue");
                left_view_button.dom.classList.add("left-view-blue");
                right_view_button.dom.classList.add("right-view-blue");
                top_view_button.dom.classList.add("top-view-blue");
                bottom_view_button.dom.classList.add("bottom-view-blue");
                break;
            case "back":
                front_view_button.dom.classList.add("front-view-blue");
                back_view_button.dom.classList.add("back-view-white");
                left_view_button.dom.classList.add("left-view-blue");
                right_view_button.dom.classList.add("right-view-blue");
                top_view_button.dom.classList.add("top-view-blue");
                bottom_view_button.dom.classList.add("bottom-view-blue");
                break;
            case "left":
                front_view_button.dom.classList.add("front-view-blue");
                back_view_button.dom.classList.add("back-view-blue");
                left_view_button.dom.classList.add("left-view-white");
                right_view_button.dom.classList.add("right-view-blue");
                top_view_button.dom.classList.add("top-view-blue");
                bottom_view_button.dom.classList.add("bottom-view-blue");
                break;
            case "right":
                front_view_button.dom.classList.add("front-view-blue");
                back_view_button.dom.classList.add("back-view-blue");
                left_view_button.dom.classList.add("left-view-blue");
                right_view_button.dom.classList.add("right-view-white");
                top_view_button.dom.classList.add("top-view-blue");
                bottom_view_button.dom.classList.add("bottom-view-blue");
                break;
            case "top":
                front_view_button.dom.classList.add("front-view-blue");
                back_view_button.dom.classList.add("back-view-blue");
                left_view_button.dom.classList.add("left-view-blue");
                right_view_button.dom.classList.add("right-view-blue");
                top_view_button.dom.classList.add("top-view-white");
                bottom_view_button.dom.classList.add("bottom-view-blue");
                break;
            case "bottom":
                front_view_button.dom.classList.add("front-view-blue");
                back_view_button.dom.classList.add("back-view-blue");
                left_view_button.dom.classList.add("left-view-blue");
                right_view_button.dom.classList.add("right-view-blue");
                top_view_button.dom.classList.add("top-view-blue");
                bottom_view_button.dom.classList.add("bottom-view-white");
                break;
        }
    }
    
    return container;
};
