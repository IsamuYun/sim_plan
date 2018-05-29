/**
 * @author Isamu 20180528
 */

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
	option.setTextContent( '帮助' );
	option.onClick( function () {

	} );
	options.add( option );

	// 关于

	var option = new UI.Row();
	option.setClass( 'option' );
	option.setTextContent( '关于' );
	option.onClick( function () {

	} );
	options.add( option );

	return container;

};
