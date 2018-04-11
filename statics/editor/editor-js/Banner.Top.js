/**
 * @author mrdoob / http://mrdoob.com/
 */

var BannerTop = function ( editor ) {
    var signals = editor.signals;

	var container = new UI.Panel();
	container.setId( 'banner-top' );
    
    var click_flag = false;

    var info_panel = new UI.Button( "面板" );
    info_panel.setClass( "ripple-effect" );
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

    var ct_button = new UI.Button( "CT" ).setClass( "ripple-effect" );
    ct_button.onClick( function() {

    } );


    var button_3 = new UI.Button( "按钮3" ).setClass( "ripple-effect" );
    var button_4 = new UI.Button( "按钮4" ).setClass( "ripple-effect" );
    
    var cut = new UI.Button( "按钮4" ).setClass( "ripple-effect" );
    cut.onClick( function () {
        
    } );


    container.add( info_panel );
    container.add( ct_button );
    container.add( button_3 );
    container.add( button_4 );
    container.add( cut );
	return container;
};
