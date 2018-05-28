/**
 * @author mrdoob / http://mrdoob.com/
 */

var Menubar = function ( editor ) {

	var container = new UI.Panel();
	container.setId( 'menubar' );

	var menu_logo = new UI.Panel();
	menu_logo.setClass("menu zs-logo");

	container.add(menu_logo);

	container.add( new Menubar.File( editor ) );
	container.add( new Menubar.Edit( editor ) );
	// container.add( new Menubar.Import( editor ) );
	// container.add( new Menubar.Upload( editor ) );
	//  container.add( new Menubar.Play( editor ) );
	//  container.add( new Menubar.View( editor ) ); // VR Mode
	//  container.add( new Menubar.Examples( editor ) );
	//container.add( new Menubar.Help( editor ) );

	// container.add( new Menubar.Status( editor ) ); // 右侧的autosave标记和版本标记

	return container;

};
