/**
 * @author mrdoob / http://mrdoob.com/
 */

var SidebarSceneBox = function ( editor ) {

    var signals = editor.signals;

	var container = new UI.Panel();
	container.setId( 'sidebar-scene-box' );
	
	var titleRow = new UI.Row().setClass();
	titleRow.add( new UI.Text( "场景" ).setClass( "title" ) );

	container.add( titleRow );
	var image = new UI.Div();

	var image_dom = document.createElement( "img" );
	image_dom.src = "static/img/textures/scene_box.png";
	image_dom.alt = "场景截图";
	image_dom.width = 188;
	image_dom.height = 240;

	image.dom.appendChild(image_dom);

	container.add( image );

	var slider_area = new UI.Div();

	var slider_bar_dom = document.createElement( "input" );
	slider_bar_dom.type = "range";
	slider_bar_dom.className = "slider";
	slider_bar_dom.value = 10;
	slider_bar_dom.step = 1;
	slider_bar_dom.min = 1;
	slider_bar_dom.max = 100;
	slider_area.dom.appendChild( slider_bar_dom );
	container.add( slider_area );
	return container;
};
