/**
 * @author Isamu 20180528
 */

 function onCloseHelpPanel() {
	 var panel = document.getElementById("zs-help-panel");
	 if (panel !== null) {
		 panel.style["display"] = "none";
	 }
 }


Menubar.Help = function ( editor ) {

	var container = new UI.Panel();
	container.setClass( 'menu' );

	var title = new UI.Panel();
	title.setClass( 'title' );
	title.setTextContent( '帮助' );
	container.add( title );

	var options = new UI.Panel();
	options.setClass( 'options' );
	container.add( options );

	// 帮助

	var option = new UI.Row();
	option.setClass( 'option' );
	option.setTextContent( '使用说明' );
	option.onClick( function () {
		var panel = document.getElementById("zs-help-panel");
		if (panel !== null) {
			panel.style["display"] = "inline-block";
		}
	} );
	options.add( option );

	

	return container;

};
