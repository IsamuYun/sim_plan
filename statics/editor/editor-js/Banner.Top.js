/**
 * @author mrdoob / http://mrdoob.com/
 */

var BannerTop = function ( editor ) {

    var signals = editor.signals;

	var container = new UI.Panel();
	container.setId( 'banner-top' );
    
    var click_flag = false;

    var info_panel = new UI.Button( "面板" );
    info_panel.onClick( function () {
        var item_box = document.getElementById( "sidebar-item-box" );
        var scene_box = document.getElementById( "sidebar-scene-box" );
        var sidebar = document.getElementById( "sidebar" );
        if ( click_flag == false ) {
            item_box.style["right"] = "10px";
            scene_box.style["right"] = "10px";
            sidebar.style["display"] = "none";
            click_flag = true;
        }
        else {
            item_box.style["right"] = "310px";
            scene_box.style["right"] = "310px";
            sidebar.style["display"] = "";
            click_flag = false;
        }
        
    } );

    var button_2 = new UI.Button( "按钮2" );
    var button_3 = new UI.Button( "按钮3" );
    var button_4 = new UI.Button( "按钮4" );
    var cut = new UI.Button( "截面" );
    cut.onClick( function () {
        G_clip_point_1 = true;
        editor.scene.traverse( function ( object ) {
            if ( object.name === "股骨" ) {
                var femur = object;
                femur.material.clippingPlanes = [];

                editor.scene.traverse( function ( another_object ) {
                    if ( another_object.name === "切割预览" ) {
                
                        another_object.visible = false;
                        another_object.position.set(femur.position.x, femur.position.y, femur.position.z);
                        another_object.material.clippingPlanes = [];
                    }
                } );
            }
        } );

        editor.signals.sceneGraphChanged.dispatch();
    } );


    container.add( info_panel );
    container.add( button_2 );
    container.add( button_3 );
    container.add( button_4 );
    container.add( cut );
	return container;
};
