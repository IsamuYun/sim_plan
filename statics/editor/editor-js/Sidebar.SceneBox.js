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


		var model_a = document.getElementById("A").value;
		var model_b = document.getElementById("B").value;
		var model_c = document.getElementById("C").value;
		var model_d = document.getElementById("D").value;
		var model_alpha = document.getElementById("alpha").value;
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
	image_dom.width = 188;
	image_dom.height = 200;

	image.dom.appendChild(image_dom);

	container.add( image );

	
	var slider_row = new UI.Row();
	slider_row.add( new UI.Text("A: ").setClass("row-title"));
	var slider_area = new UI.Div();

	
	var slider_bar_dom = document.createElement( "input" );
	slider_bar_dom.id = "A";
	slider_bar_dom.type = "range";
	slider_bar_dom.className = "slider";
	slider_bar_dom.value = 107;
	slider_bar_dom.step = 1;
	slider_bar_dom.min = 97;
	slider_bar_dom.max = 119;
	slider_bar_dom.onchange = get_model_value;
	slider_area.dom.appendChild( slider_bar_dom );
	slider_row.add(slider_area);
	container.add( slider_row );

	var slider_area = new UI.Div();

	var slider_bar_dom = document.createElement( "input" );
	slider_bar_dom.id = "B";
	slider_bar_dom.type = "range";
	slider_bar_dom.className = "slider";
	slider_bar_dom.value = 36;
	slider_bar_dom.step = 1;
	slider_bar_dom.min = 31;
	slider_bar_dom.max = 62;
	slider_bar_dom.onchange = get_model_value;
	slider_area.dom.appendChild( slider_bar_dom );
	container.add( slider_area );

	var slider_area = new UI.Div();

	var slider_bar_dom = document.createElement( "input" );
	slider_bar_dom.id = "C";
	slider_bar_dom.type = "range";
	slider_bar_dom.className = "slider";
	slider_bar_dom.value = 30;
	slider_bar_dom.step = 1;
	slider_bar_dom.min = 23;
	slider_bar_dom.max = 43;
	slider_bar_dom.onchange = get_model_value;
	slider_area.dom.appendChild( slider_bar_dom );
	container.add( slider_area );
	
	var slider_area = new UI.Div();

	var slider_bar_dom = document.createElement( "input" );
	slider_bar_dom.id = "D";
	slider_bar_dom.type = "range";
	slider_bar_dom.className = "slider";
	slider_bar_dom.value = 32;
	slider_bar_dom.step = 1;
	slider_bar_dom.min = 23;
	slider_bar_dom.max = 55;
	slider_bar_dom.onchange = get_model_value;
	slider_area.dom.appendChild( slider_bar_dom );
	container.add( slider_area );

	var slider_bar_dom = document.createElement( "input" );
	slider_bar_dom.id = "alpha";
	slider_bar_dom.type = "range";
	slider_bar_dom.className = "slider";
	slider_bar_dom.value = 130;
	slider_bar_dom.step = 1;
	slider_bar_dom.min = 120;
	slider_bar_dom.max = 140;
	slider_bar_dom.onchange = get_model_value;
	slider_area.dom.appendChild( slider_bar_dom );
	container.add( slider_area );


	return container;
};
