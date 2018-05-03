/**
 * @author mrdoob / http://mrdoob.com/
 */

var BannerTop = function ( editor ) {
    var signals = editor.signals;

	var container = new UI.Panel();
	container.setId( 'banner-top' );
    
    var click_flag = false;
    var info_status = false;
    var transparency_status = false;

    var info_panel = new UI.Button( "CT" );
    info_panel.setClass( "ripple-effect" );
    info_panel.onClick( function () {
        info_status = info_status ? false : true;
        updateSelectedButton("info", info_status);
        var item_box = document.getElementById( "sidebar-item-box" );
        var scene_box = document.getElementById( "sidebar-scene-box" );
        var sidebar = document.getElementById( "sidebar-ct-box" );
        if ( click_flag == false ) {
            item_box.style["right"] = "10px";
            scene_box.style["right"] = "10px";
            sidebar.style["display"] = "none";
            click_flag = true;
        }
        else {
            item_box.style["right"] = "270px";
            scene_box.style["right"] = "270px";
            sidebar.style["display"] = "";
            click_flag = false;
        }
        
    } );

    var transparency_button = new UI.Button( "半透明" ).setClass( "ripple-effect" );
    transparency_button.onClick( function() {
        transparency_status = transparency_status ? false : true;
        updateSelectedButton("transparency", transparency_status);
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
    } );

    function updateSelectedButton( mode, status ) {
        
        
        switch ( mode ) {
            case "info":
                info_panel.dom.classList.remove( 'selected' );
                if (status == true) {
                    info_panel.dom.classList.add( "selected" );
                }
                
                break;
            case "transparency":
                transparency_button.dom.classList.remove( 'selected' );
                if (status == true) {
                    transparency_button.dom.classList.add( "selected" );
                }
                break;
        }
    };
    


    container.add( info_panel );
    container.add( transparency_button );
	return container;
};
