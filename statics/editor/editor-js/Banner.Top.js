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
        if ( click_flag == false ) {
            item_box.style["display"] = "none";
            scene_box.style["display"] = "none";
            click_flag = true;
        }
        else {
            item_box.style["display"] = "";
            scene_box.style["display"] = "";
            click_flag = false;
        }
        
    } );

    var button_2 = new UI.Button( "按钮2" );
    var button_3 = new UI.Button( "按钮3" );
    var button_4 = new UI.Button( "按钮4" );
    var cut = new UI.Button( "截面" );
    cut.onClick( function () {
        G_clip_point_1 = true;
    } );


    container.add( info_panel );
    container.add( button_2 );
    container.add( button_3 );
    container.add( button_4 );
    container.add( cut );
	return container;
};
