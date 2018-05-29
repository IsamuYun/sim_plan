/**
 * @author isamu 20180528
 */

Menubar.Tool = function ( editor ) {

	var container = new UI.Panel();
	container.setClass("menu");

	var title = new UI.Panel();
	title.setClass("title");
	title.setTextContent("工具");
	container.add( title );

	var options = new UI.Panel();
	options.setClass("options");
	container.add( options );

	// 切割
	var option = new UI.Row();
	option.setClass( "option" );
	option.setTextContent( '切割' );
	option.onClick( function () {
		left_cut();
	} );
	options.add( option );

	// 切割效果预览
	var option = new UI.Row();
	option.setClass( "option" );
	option.setTextContent( '预览' );
	option.onClick( function () {
		left_preview();
	} );
	options.add( option );

	// 测量
	var option = new UI.Row();
	option.setClass( "option" );
	option.setTextContent( '测量' );
	option.onClick( function () {
		left_measure();
	} );
	options.add( option );

	// 注释
	var option = new UI.Row();
	option.setClass( "option" );
	option.setTextContent( '注释' );
	option.onClick( function () {
		left_annotation();
	} );
	options.add( option );

	// 展开
	var option = new UI.Row();
	option.setClass( "option" );
	option.setTextContent( '展开' );
	option.onClick( function () {
		left_explod();
	} );
	options.add( option );
	
	return container;
};