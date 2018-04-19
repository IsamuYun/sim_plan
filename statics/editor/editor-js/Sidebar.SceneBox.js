/**
 * @author mrdoob / http://mrdoob.com/
 */

var SidebarSceneBox = function ( editor ) {

	var get_model_value = function ( event ) {
		var canvas = document.getElementById("myCanvas");
		const context = canvas.getContext('2d');

		context.clearRect(0, 0, canvas.width, canvas.height);
		context.save();
		context.scale(1.5, 1.5);
		context.restore();


		var model_a = parseInt(document.getElementById("A").value);
		model_a += 80;
		var model_b = parseInt(document.getElementById("B").value);
		var model_c = parseInt(document.getElementById("C").value);
		var model_d = parseInt(document.getElementById("D").value);
		var model_alpha = parseInt(document.getElementById("alpha").value);
		model_alpha += 100;
		console.log(model_a + ", " +  model_b + ", " + model_c + ", " + model_d + ", " + model_alpha);
		generate_2d_model(model_a, model_b, model_c, model_d, model_alpha);
	};

    var signals = editor.signals;

	var container = new UI.Panel();
	container.setId( 'sidebar-scene-box' );
	
	var titleRow = new UI.Row().setClass();
	titleRow.add( new UI.Text( "场景" ).setClass( "title" ) );

	container.add( titleRow );
	var image = new UI.Div();

	var image_dom = document.createElement( "canvas" );
	image_dom.alt = "场景截图";
	image_dom.id = "myCanvas";
	image_dom.width = 180;
	image_dom.height = 240;

	image.dom.appendChild(image_dom);

	container.add( image );

	
	var slider_row = new UI.Row();
	slider_row.add( new UI.Text("A: ").setClass("row-title"));
	var slider_area = new UI.Div().setClass("slider");

	
	var slider_bar_dom = document.createElement( "input" );
	slider_bar_dom.id = "A";
	slider_bar_dom.type = "range";
	slider_bar_dom.value = 27;
	slider_bar_dom.step = 1;
	slider_bar_dom.min = 17;
	slider_bar_dom.max = 39;
	slider_bar_dom.onchange = get_model_value;
	slider_area.dom.appendChild( slider_bar_dom );
	slider_row.add(slider_area);
	container.add( slider_row );

	var slider_row = new UI.Row();
	slider_row.add( new UI.Text("B: ").setClass("row-title"));
	var slider_area = new UI.Div().setClass("slider");

	var slider_bar_dom = document.createElement( "input" );
	slider_bar_dom.id = "B";
	slider_bar_dom.type = "range";
	
	slider_bar_dom.value = 36;
	slider_bar_dom.step = 1;
	slider_bar_dom.min = 31;
	slider_bar_dom.max = 62;
	slider_bar_dom.onchange = get_model_value;
	slider_area.dom.appendChild( slider_bar_dom );
	slider_row.add( slider_area );
	container.add( slider_row );

	var slider_row = new UI.Row();
	slider_row.add( new UI.Text("C: ").setClass("row-title"));
	var slider_area = new UI.Div().setClass("slider");

	var slider_bar_dom = document.createElement( "input" );
	slider_bar_dom.id = "C";
	slider_bar_dom.type = "range";
	
	slider_bar_dom.value = 30;
	slider_bar_dom.step = 1;
	slider_bar_dom.min = 23;
	slider_bar_dom.max = 43;
	slider_bar_dom.onchange = get_model_value;
	slider_area.dom.appendChild( slider_bar_dom );
	slider_row.add( slider_area );
	container.add( slider_row );
	
	var slider_row = new UI.Row();
	slider_row.add( new UI.Text("D: ").setClass("row-title"));
	var slider_area = new UI.Div().setClass("slider");

	var slider_bar_dom = document.createElement( "input" );
	slider_bar_dom.id = "D";
	slider_bar_dom.type = "range";
	
	slider_bar_dom.value = 32;
	slider_bar_dom.step = 1;
	slider_bar_dom.min = 23;
	slider_bar_dom.max = 55;
	slider_bar_dom.onchange = get_model_value;
	slider_area.dom.appendChild( slider_bar_dom );
	slider_row.add( slider_area );
	container.add( slider_row );

	var row = new UI.Row();
	row.add( new UI.Text("Alpha:").setClass("row-title"));
	var area = new UI.Div().setClass("slider");

	var slider_bar = document.createElement( "input" );
	slider_bar.id = "alpha";
	slider_bar.type = "range";
	
	slider_bar.value = 30;
	slider_bar.step = 1;
	slider_bar.min = 20;
	slider_bar.max = 40;
	slider_bar.onchange = get_model_value;
	area.dom.appendChild( slider_bar );
	row.add( area );
	container.add( row );
	return container;
};
