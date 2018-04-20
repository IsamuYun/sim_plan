/**
 * @author mrdoob / http://mrdoob.com/
 */

var SidebarSceneBox = function ( editor ) {
	var a_limit_list = [97, 99, 101, 103, 105, 107, 109, 111, 113, 115, 117, 119];
	
	var b_limit_list = [[31, 34, 36, 37, 39, 40, 42, 44, 45, 48, 50], // 97
								   [33, 36, 38, 39, 41, 42, 44, 46, 47, 50, 52], // 99 
								   [33, 36, 38, 39, 41, 42, 44, 46, 47, 50, 52], // 101
								   [34, 37, 40, 42, 45, 48, 50, 53, 56], // 103
								   [34, 37, 40, 42, 45, 48, 50, 53, 56], // 105
								   [36, 39, 42, 44, 47, 50, 52, 55, 58], // 107
								   [36, 39, 42, 44, 47, 50, 52, 55, 58], // 109
								   [38, 41, 44, 46, 49, 52, 54, 57, 60], // 111
								   [38, 41, 44, 46, 49, 52, 54, 57, 60], // 113
								   [40, 43, 46, 48, 51, 54, 56, 59, 62], // 115
								   [40, 43, 46, 48, 51, 54, 56, 59, 62], // 117
								   [40, 43, 46, 48, 51, 54, 56, 59, 62]];// 119
	
	var c_limit_list = [[23, 25, 27, 30, 32, 34], // 97 
								   [24, 26, 28, 31, 33, 35], // 99
								   [25, 27, 29, 32, 34, 36], // 101
								   [26, 28, 30, 33, 35, 37], // 103
								   [26, 29, 31, 33, 35, 38], // 105
								   [28, 30, 32, 34, 37, 39], // 107
								   [28, 31, 33, 35, 37, 40], // 109
								   [30, 32, 34, 36, 39, 41], // 111
								   [30, 33, 35, 37, 39, 42], // 113
								   [32, 34, 36, 38, 41, 43], // 115
								   [32, 34, 36, 38, 41, 43], // 117
								   [32, 34, 36, 38, 41, 43]];// 119
	
	var d_limit_list = [[23, 27, 30, 31, 34, 37, 38, 41, 45], // 97
								   [25, 28, 32, 35, 36, 39, 42, 43, 46], // 99
								   [25, 28, 29, 32, 35, 36, 39, 42, 43, 46], // 101
								   [26, 30, 32, 33, 35, 37, 39, 40, 42, 44, 46, 49], // 103
								   [26, 30, 32, 33, 35, 37, 39, 40, 42, 44, 46, 49], // 105
								   [28, 32, 33, 35, 37, 39, 40, 42, 44, 46, 47, 51], // 107
								   [28, 32, 33, 35, 37, 39, 40, 42, 44, 46, 47, 51], // 109
								   [30, 34, 36, 37, 39, 41, 43, 44, 46, 48, 50, 53], // 111
								   [30, 34, 36, 37, 39, 41, 43, 44, 46, 48, 50, 53], // 113
								   [32, 35, 37, 39, 41, 42, 44, 46, 48, 49, 51, 55], // 115
								   [32, 35, 37, 39, 41, 42, 44, 46, 48, 49, 51, 55], // 117
								   [32, 35, 37, 39, 41, 42, 44, 46, 48, 49, 51, 55]];// 119

	function redraw() {
		var canvas = document.getElementById("myCanvas");
		const context = canvas.getContext('2d');

		context.clearRect(0, 0, canvas.width, canvas.height);
		context.save();
		context.scale(1.5, 1.5);
		
		context.restore();
		context.setLineDash([]);
		context.strokeStyle = "#000000";
	};

	var change_slider_a = function( event ) {
		redraw();
		var slider_a = document.getElementById("A");
		var slider_b = document.getElementById("B");
		var slider_c = document.getElementById("C");
		var slider_d = document.getElementById("D");
		var slider_alpha = document.getElementById("alpha");

		var box_a = document.getElementById("A-Number");
		var box_b = document.getElementById("B-Number");
		var box_c = document.getElementById("C-Number");
		var box_d = document.getElementById("D-Number");
		var box_alpha = document.getElementById("Alpha-Number");
		
		
		
		// 根据slider_a的值，要改变box_a，还有其他控件的值
		var a_index = parseInt(slider_a.value);
		var a_num = a_limit_list[a_index];
		box_a.value = a_num;

		slider_b.max = b_limit_list[a_index].length - 1; // slider b的位置应该不变
		slider_c.max = c_limit_list[a_index].length - 1;
		slider_d.max = d_limit_list[a_index].length - 1;

		if (slider_b.value > slider_b.max) {
			slider_b.value = slider_b.max;
		}
		if (slider_c.value > slider_c.max) {
			slider_c.value = slider_c.max;
		}
		if (slider_d.value > slider_d.max) {
			slider_d.value = slider_d.max;
		}

		var b_index = parseInt(slider_b.value);
		var b_num = b_limit_list[a_index][b_index];
		box_b.value = b_num;

		var c_index = parseInt(slider_c.value);
		var c_num = c_limit_list[a_index][c_index];
		box_c.value = c_num;

		var d_index = parseInt(slider_d.value);
		var d_num = d_limit_list[a_index][d_index];
		box_d.value = d_num;

		var alpha_num = parseInt(slider_alpha.value) + 100;
		// 这步其实多余
		// box_alpha.value = parseInt(alpha_num);

		console.log(a_num + ", " +  b_num + ", " + c_num + ", " + d_num + ", " + alpha_num);
		generate_2d_model(a_num, b_num, c_num, d_num, alpha_num);

		
	};

	var change_box_a = function( event ) {
		redraw();

		var slider_a = document.getElementById("A");
		var slider_b = document.getElementById("B");
		var slider_c = document.getElementById("C");
		var slider_d = document.getElementById("D");
		var slider_alpha = document.getElementById("alpha");

		var box_a = document.getElementById("A-Number");
		var box_b = document.getElementById("B-Number");
		var box_c = document.getElementById("C-Number");
		var box_d = document.getElementById("D-Number");
		var box_alpha = document.getElementById("Alpha-Number");

		// 根据box_a的值，要改变slider_a的值，还有其他控件的值
		var a_num = parseInt(box_a.value);
		var a_index = -1;
		if (a_num < a_limit_list[0] || a_num > a_limit_list[a_limit_list.length - 1]) {
			a_num = a_limit_list[0];
			a_index = 0;
		}
		else {
			for (var i = 0; i < a_limit_list.length; i++) {
				if (a_num == a_limit_list[i]) {
					a_index = i;
					break;
				}
			}
		}
		slider_a.value = a_index;
		
		var b_num = parseInt(box_b.value);
		var b_index = parseInt(slider_b.value);
		var b_index_max = b_limit_list[a_index].length - 1;
		slider_b.max = b_index_max;
		box_b.value = b_limit_list[a_index][b_index];
		box_b.min = b_limit_list[a_index][0];
		box_b.max = b_limit_list[a_index][b_index_max];
		 
		var c_num = parseInt(box_c.value);
		var c_index = parseInt(slider_c.value);
		var c_index_max = c_limit_list[a_index].length - 1;
		slider_c.max = c_index_max;
		box_c.value = c_limit_list[a_index][c_index];
		box_c.min = c_limit_list[a_index][0];
		box_c.max = c_limit_list[a_index][c_index_max];

		var d_num = parseInt(box_d.value);
		var d_index = parseInt(slider_d.value);
		var d_index_max = d_limit_list[a_index].length - 1;
		slider_d.max = d_index_max;
		box_d.value = d_limit_list[a_index][d_index];
		box_d.min = d_limit_list[a_index][0];
		box_d.max = d_limit_list[a_index][d_index_max];

		var alpha_num = parseInt(box_alpha.value);
		slider_alpha.value = alpha_num - 100;
		console.log(a_num + ", " +  b_num + ", " + c_num + ", " + d_num + ", " + alpha_num);
		generate_2d_model(a_num, b_num, c_num, d_num, alpha_num);

		
	};

	var get_model_value = function ( event ) {
		redraw();

		var a_index = parseInt(document.getElementById("A").value);
		var b_index = parseInt(document.getElementById("B").value);
		var c_index = parseInt(document.getElementById("C").value);
		var d_index = parseInt(document.getElementById("D").value);
		var alpha_index = parseInt(document.getElementById("alpha").value);

		var a_num = a_limit_list[a_index];
		var b_num = b_limit_list[a_index][b_index];
		var c_num = c_limit_list[a_index][c_index];
		var d_num = d_limit_list[a_index][d_index];
		var alpha_num = alpha_index + 100;

		document.getElementById("A-Number").value = a_num; 
		document.getElementById("B-Number").value = b_num;
		document.getElementById("C-Number").value = c_num;
		document.getElementById("D-Number").value = d_num;
		document.getElementById("Alpha-Number").value = alpha_num;
		
		console.log(a_num + ", " +  b_num + ", " + c_num + ", " + d_num + ", " + alpha_num);
		generate_2d_model(a_num, b_num, c_num, d_num, alpha_num);
	};

	var change_box_value = function(event) {
		redraw();

		var box_b = document.getElementById("B-Number");
		var box_c = document.getElementById("C-Number");
		var box_d = document.getElementById("D-Number");
		var box_alpha = document.getElementById("Alpha-Number");

		var a_num = parseInt(document.getElementById("A-Number").value);
		var b_num = parseInt(box_b.value);
		var c_num = parseInt(box_c.value);
		var d_num = parseInt(box_d.value);
		var alpha_num = parseInt(box_alpha.value);

		var a_index = parseInt(document.getElementById("A").value);
		var b_index = -1;
		var c_index = -1;
		var d_index = -1;

		var slider_b = document.getElementById("B");
		var slider_c = document.getElementById("C");
		var slider_d = document.getElementById("D");
		
		for (var i = 0; i < b_limit_list[a_index].length; i++) {
			if (b_num <= b_limit_list[a_index][i]) {
				b_index = i;
			}
		}
		if (b_index == -1) {
			slider_b.value = slider_b.max;
			b_num = b_limit_list[a_index][b_limit_list[a_index].length - 1];
			box_b.value = b_num;
		}
		else {
			slider_b.value = b_index;
		}

		for (var i = 0; i < c_limit_list[a_index].length; i++) {
			if (c_num <= c_limit_list[a_index][i]) {
				c_index = i;
			}
		}
		if (c_index == -1) {
			slider_c.value = slider_c.max;
			c_num = c_limit_list[a_index][c_limit_list[a_index].length - 1];
			box_c.value = c_num;
		}
		else {
			slider_c.value = c_index;
		}

		for (var i = 0; i < d_limit_list[a_index].length; i++) {
			if (d_num <= d_limit_list[a_index][i]) {
				d_index = i;
			}
		}
		if (d_index == -1) {
			slider_d.value = slider_d.max;
			d_num = d_limit_list[a_index][d_limit_list[a_index].length - 1];
			box_d.value = d_num;
		}
		else {
			slider_d.value = d_index;
		}

		document.getElementById("alpha").value = alpha_num - 100;

		console.log(a_num + ", " + b_num + ", " + c_num + ", " + d_num + ", " + alpha_num);
		generate_2d_model(a_num, b_num, c_num, d_num, alpha_num);

	}

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
	
	var a_index = parseInt(a_limit_list.length / 2);
	var slider_bar_dom = document.createElement( "input" );
	slider_bar_dom.id = "A";
	slider_bar_dom.type = "range";
	slider_bar_dom.value = a_index;
	slider_bar_dom.step = 1;
	slider_bar_dom.min = 0;
	slider_bar_dom.max = a_limit_list.length - 1;
	slider_bar_dom.onchange = change_slider_a;
	slider_area.dom.appendChild( slider_bar_dom );
	slider_row.add(slider_area);

	// 数据盒子
	var number_box_area = new UI.Div().setClass("input-box");
	var number_box = document.createElement( "input" );
	number_box.id = "A-Number";
	number_box.type = "number";
	number_box.value = a_limit_list[a_index];
	number_box.step = 2;
	number_box.min = a_limit_list[0];
	number_box.max = a_limit_list[a_limit_list.length - 1];
	number_box.onchange = change_box_a;
	number_box_area.dom.appendChild( number_box );
	slider_row.add( number_box_area );

	container.add( slider_row );

	var slider_row = new UI.Row();
	slider_row.add( new UI.Text("B: ").setClass("row-title"));
	
	var slider_area = new UI.Div().setClass("slider");
	var slider_bar_dom = document.createElement( "input" );
	slider_bar_dom.id = "B";
	slider_bar_dom.type = "range";
	var b_index = parseInt(b_limit_list[a_index].length / 2);
	slider_bar_dom.value = b_index;
	slider_bar_dom.step = 1;
	slider_bar_dom.min = 0;
	slider_bar_dom.max = b_limit_list[a_index].length - 1;
	slider_bar_dom.onchange = get_model_value;
	slider_area.dom.appendChild( slider_bar_dom );
	slider_row.add( slider_area );

	var number_box_area = new UI.Div().setClass("input-box");
	var number_box = document.createElement( "input" );
	number_box.id = "B-Number";
	number_box.type = "number";
	number_box.value = b_limit_list[a_index][b_index];
	number_box.step = 1;
	number_box.min = b_limit_list[a_index][0];
	number_box.max = b_limit_list[a_index][b_limit_list[a_index].length - 1];
	number_box.onchange = change_box_value;
	number_box_area.dom.appendChild( number_box );
	slider_row.add( number_box_area );

	container.add( slider_row );

	var slider_row = new UI.Row();
	slider_row.add( new UI.Text("C: ").setClass("row-title"));

	var slider_area = new UI.Div().setClass("slider");
	var slider_bar_dom = document.createElement( "input" );
	slider_bar_dom.id = "C";
	slider_bar_dom.type = "range";
	var c_index = parseInt(c_limit_list[a_index].length / 2);
	slider_bar_dom.value = c_index;
	slider_bar_dom.step = 1;
	slider_bar_dom.min = 0;
	slider_bar_dom.max = c_limit_list[a_index].length - 1;
	slider_bar_dom.onchange = get_model_value;
	slider_area.dom.appendChild( slider_bar_dom );
	slider_row.add( slider_area );
	
	var number_box_area = new UI.Div().setClass("input-box");
	var number_box = document.createElement( "input" );
	number_box.id = "C-Number";
	number_box.type = "number";
	number_box.value = c_limit_list[a_index][c_index];
	number_box.step = 1;
	number_box.min = c_limit_list[a_index][0];
	number_box.max = c_limit_list[a_index][c_limit_list[a_index].length - 1];
	number_box.onchange = change_box_value;
	number_box_area.dom.appendChild( number_box );
	slider_row.add( number_box_area );
	
	container.add( slider_row );

	
	var slider_row = new UI.Row();
	slider_row.add( new UI.Text("D: ").setClass("row-title"));
	var slider_area = new UI.Div().setClass("slider");

	var slider_bar_dom = document.createElement( "input" );
	slider_bar_dom.id = "D";
	slider_bar_dom.type = "range";
	var d_index = parseInt(d_limit_list[a_index].length / 2);
	slider_bar_dom.value = d_index;
	slider_bar_dom.step = 1;
	slider_bar_dom.min = 0;
	slider_bar_dom.max = d_limit_list[a_index].length - 1;
	slider_bar_dom.onchange = get_model_value;
	slider_area.dom.appendChild( slider_bar_dom );
	slider_row.add( slider_area );

	var number_box_area = new UI.Div().setClass("input-box");
	var number_box = document.createElement( "input" );
	number_box.id = "D-Number";
	number_box.type = "number";
	number_box.value = d_limit_list[a_index][d_index];
	number_box.step = 1;
	number_box.min = d_limit_list[a_index][0];
	number_box.max = d_limit_list[a_index][d_limit_list[a_index].length - 1];
	number_box.onchange = change_box_value;
	number_box_area.dom.appendChild( number_box );
	slider_row.add( number_box_area );


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

	var number_box_area = new UI.Div().setClass("input-box");
	var number_box = document.createElement( "input" );
	number_box.id = "Alpha-Number";
	number_box.type = "number";
	number_box.value = 130;
	number_box.step = 1;
	number_box.min = 120;
	number_box.max = 140;
	number_box.onchange = change_box_value;
	number_box_area.dom.appendChild( number_box );
	row.add( number_box_area );

	container.add( row );
	return container;
};
