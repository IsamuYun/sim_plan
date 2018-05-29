/**
 * @author Isamu 20180528
 */

Menubar.ViewMode = function ( editor ) {

	var container = new UI.Panel();
	container.setClass( 'menu' );

	var title = new UI.Panel();
	title.setClass( 'title' );
	title.setTextContent( '视图' );
	container.add( title );

	var options = new UI.Panel();
	options.setClass( 'options' );
	container.add( options );

	// VR mode

	var option = new UI.Row();
	option.setClass( 'option' );
	option.setTextContent( '显示CT' );
	option.onClick( function () {
        banner_ct();
	} );
	options.add( option );

    var option = new UI.Row();
	option.setClass( 'option' );
	option.setTextContent( '半透明' );
	option.onClick( function () {
        banner_transparency();
	} );
	options.add( option );

    var option = new UI.Row();
	option.setClass( 'option' );
	option.setTextContent( '正视图' );
	option.onClick( function () {
        banner_front_view();
	} );
    options.add( option );

    var option = new UI.Row();
	option.setClass( 'option' );
	option.setTextContent( '后视图' );
	option.onClick( function () {
        banner_back_view();
	} );
	options.add( option );

    var option = new UI.Row();
	option.setClass( 'option' );
	option.setTextContent( '左视图' );
	option.onClick( function () {
        banner_left_view();
	} );
	options.add( option );


    var option = new UI.Row();
	option.setClass( 'option' );
	option.setTextContent( '右视图' );
	option.onClick( function () {
        banner_right_view();
	} );
	options.add( option );

    var option = new UI.Row();
	option.setClass( 'option' );
	option.setTextContent( '顶视图' );
	option.onClick( function () {
        banner_top_view();
	} );
	options.add( option );

    var option = new UI.Row();
	option.setClass( 'option' );
	option.setTextContent( '底视图' );
	option.onClick( function () {
        banner_bottom_view();
	} );
    options.add( option );
    
	return container;
};
