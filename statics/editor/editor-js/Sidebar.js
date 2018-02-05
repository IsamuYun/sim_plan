/**
 * @author mrdoob / http://mrdoob.com/
 */

var Sidebar = function ( editor ) {

	var container = new UI.Panel();
	container.setId( 'sidebar' );

	//
    var dicomTab = new UI.Text( "三维重构" ).onClick( onClick );
	var sceneTab = new UI.Text( "手术模拟" ).onClick( onClick );
	var projectTab = new UI.Text( "部件订制" ).onClick( onClick );
	var settingsTab = new UI.Text( "3D打印" ).onClick( onClick );

	var tabs = new UI.Div();
	tabs.setId( 'tabs' );
	tabs.add( dicomTab, sceneTab, projectTab, settingsTab );
	container.add( tabs );

	function onClick( event ) {

		select( event.target.textContent );

	}

	//
	var dicom = new UI.Span().add(

	);
	container.add( dicom );
	

	var scene = new UI.Span().add(
		new Sidebar.Scene( editor ),
		new Sidebar.Properties( editor ),
		new Sidebar.Animation( editor ),
		new Sidebar.Script( editor )
	);
	container.add( scene );

	var project = new UI.Span().add(
		new Sidebar.Project( editor )
	);
	// container.add( project );

	var settings = new UI.Span().add(
		//new Sidebar.Settings( editor ),
		//new Sidebar.History( editor )
	);
	container.add( settings );

	//

	function select( section ) {
		dicomTab.setClass( "" );
		sceneTab.setClass( '' );
		projectTab.setClass( '' );
		settingsTab.setClass( '' );

		dicom.setDisplay( "none" );
		scene.setDisplay( 'none' );
		project.setDisplay( 'none' );
		settings.setDisplay( 'none' );

		switch ( section ) {
			case "三维重构":
				dicomTab.setClass( "selected" );
				dicomTab.setDisplay( "" );
				break;
			case '手术模拟':
				sceneTab.setClass( 'selected' );
				scene.setDisplay( '' );
				break;
			case '部件订制':
				projectTab.setClass( 'selected' );
				// project.setDisplay( '' );
				break;
			case '3D打印':
				settingsTab.setClass( 'selected' );
				settings.setDisplay( '' );
				break;
		}

	}

	select( "手术模拟" );

	return container;

};
