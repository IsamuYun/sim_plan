/**
 * @author mrdoob / http://mrdoob.com/
 */

var SidebarSceneBox = function ( editor ) {
	var a_limit_list = [97, 99, 101, 103, 105, 107, 109, 111, 113, 115, 117, 119];
	
	var b_limit_list = [[31, 34, 36, 39, 42, 44, 37, 40, 42, 45, 48, 50], // 97
								   [33, 36, 38, 41, 44, 46, 39, 42, 44, 47, 50, 52], // 99 
								   [33, 36, 38, 41, 44, 46, 39, 42, 44, 47, 50, 52], // 101
								   [34, 37, 40, 42, 45, 48, 42, 45, 48, 50, 53, 56], // 103
								   [34, 37, 40, 42, 45, 48, 42, 45, 48, 50, 53, 56], // 105
								   [36, 39, 42, 44, 47, 50, 44, 47, 50, 52, 55, 58], // 107
								   [36, 39, 42, 44, 47, 50, 44, 47, 50, 52, 55, 58], // 109
								   [38, 41, 44, 46, 49, 52, 46, 49, 52, 54, 57, 60], // 111
								   [38, 41, 44, 46, 49, 52, 46, 49, 52, 54, 57, 60], // 113
								   [40, 43, 46, 48, 51, 54, 48, 51, 54, 56, 59, 62], // 115
								   [40, 43, 46, 48, 51, 54, 48, 51, 54, 56, 59, 62], // 117
								   [40, 43, 46, 48, 51, 54, 48, 51, 54, 56, 59, 62]];// 119
	
	var c_limit_list = [[23, 25, 27, 30, 32, 34, 23, 25, 27, 30, 32, 34], // 97 
								   [24, 26, 28, 31, 33, 35, 24, 26, 28, 31, 33, 35], // 99
								   [25, 27, 29, 32, 34, 36, 25, 27, 29, 32, 34, 36], // 101
								   [26, 28, 30, 33, 35, 37, 26, 28, 30, 33, 35, 37], // 103
								   [26, 29, 31, 33, 35, 38, 26, 29, 31, 33, 35, 38], // 105
								   [28, 30, 32, 34, 37, 39, 28, 30, 32, 34, 37, 39], // 107
								   [28, 31, 33, 35, 37, 40, 28, 31, 33, 35, 37, 40], // 109
								   [30, 32, 34, 36, 39, 41, 30, 32, 34, 36, 39, 41], // 111
								   [30, 33, 35, 37, 39, 42, 30, 33, 35, 37, 39, 42], // 113
								   [32, 34, 36, 38, 41, 43, 32, 34, 36, 38, 41, 43], // 115
								   [32, 34, 36, 38, 41, 43, 32, 34, 36, 38, 41, 43], // 117
								   [32, 34, 36, 38, 41, 43, 32, 34, 36, 38, 41, 43]];// 119
	
	var d_limit_list = [[23, 27, 30, 34, 37, 41, 27, 31, 34, 38, 41, 45], // 97
								   [25, 28, 32, 35, 39, 42, 29, 32, 36, 39, 43, 46], // 99
								   [25, 28, 32, 35, 39, 42, 29, 32, 36, 39, 43, 46], // 101
								   [26, 30, 33, 37, 40, 44, 32, 35, 39, 42, 46, 49], // 103
								   [26, 30, 33, 37, 40, 44, 32, 35, 39, 42, 46, 49], // 105
								   [28, 32, 35, 39, 42, 46, 33, 37, 40, 44, 47, 51], // 107
								   [28, 32, 35, 39, 42, 46, 33, 37, 40, 44, 47, 51], // 109
								   [30, 34, 37, 41, 44, 48, 36, 39, 43, 46, 50, 53], // 111
								   [30, 34, 37, 41, 44, 48, 36, 39, 43, 46, 50, 53], // 113
								   [32, 35, 39, 42, 46, 49, 37, 41, 44, 48, 51, 55], // 115
								   [32, 35, 39, 42, 46, 49, 37, 41, 44, 48, 51, 55], // 117
								   [32, 35, 39, 42, 46, 49, 37, 41, 44, 48, 51, 55]];// 119

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
		var b_index = parseInt(slider_b.value);
		var c_index = parseInt(slider_c.value);
		var d_index = parseInt(slider_d.value);

		var a_num = a_limit_list[a_index];
		box_a.value = a_num;

		slider_b.max = b_limit_list[a_index].length - 1; // slider b的位置应该不变
		slider_c.max = c_limit_list[a_index].length - 1;
		slider_d.max = d_limit_list[a_index].length - 1;

		var b_num = parseInt(box_b.value);
		var c_num = parseInt(box_c.value);
		var d_num = parseInt(box_d.value);

		if (b_num < b_limit_list[a_index][0]) {
			box_b.value = b_limit_list[a_index][0];
			box_c.value = c_limit_list[a_index][0];
			box_d.value = d_limit_list[a_index][0];
			b_num = b_limit_list[a_index][0];
			c_num = c_limit_list[a_index][0];
			d_num = d_limit_list[a_index][0];
		}
		else if (b_num > b_limit_list[a_index][slider_b.max]) {
			box_b.value = b_limit_list[a_index][slider_b.max];
			box_c.value = c_limit_list[a_index][slider_c.max];
			box_d.value = d_limit_list[a_index][slider_d.max];
			b_num = b_limit_list[a_index][slider_b.max];
			c_num = c_limit_list[a_index][slider_c.max];
			d_num = d_limit_list[a_index][slider_d.max];
		}

		box_b.min = b_limit_list[a_index][0];
		box_b.max = b_limit_list[a_index][slider_b.max];
		
		box_c.min = c_limit_list[a_index][0];
		box_c.max = c_limit_list[a_index][slider_c.max];

		box_d.min = d_limit_list[a_index][0];
		box_d.max = d_limit_list[a_index][slider_d.max];

		var alpha_num = parseInt(slider_alpha.value) + 100;
		
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
		// box_b.value = b_limit_list[a_index][b_index];
		box_b.min = b_limit_list[a_index][0];
		box_b.max = b_limit_list[a_index][b_index_max];
		 
		var c_num = parseInt(box_c.value);
		var c_index = parseInt(slider_c.value);
		var c_index_max = c_limit_list[a_index].length - 1;
		slider_c.max = c_index_max;
		// box_c.value = c_limit_list[a_index][c_index];
		box_c.min = c_limit_list[a_index][0];
		box_c.max = c_limit_list[a_index][c_index_max];

		var d_num = parseInt(box_d.value);
		var d_index = parseInt(slider_d.value);
		var d_index_max = d_limit_list[a_index].length - 1;
		slider_d.max = d_index_max;
		// box_d.value = d_limit_list[a_index][d_index];
		box_d.min = d_limit_list[a_index][0];
		box_d.max = d_limit_list[a_index][d_index_max];

		var alpha_num = parseInt(box_alpha.value);
		slider_alpha.value = alpha_num - 100;
		console.log(a_num + ", " +  b_num + ", " + c_num + ", " + d_num + ", " + alpha_num);
		generate_2d_model(a_num, b_num, c_num, d_num, alpha_num);

		
	};

	var get_model_value = function ( event ) {
		redraw();
		
		var change_index = parseInt(event.target.value);

		var slider_b = document.getElementById("B");
		var slider_c = document.getElementById("C");
		var slider_d = document.getElementById("D");

		var a_index = parseInt(document.getElementById("A").value);
		var alpha_index = parseInt(document.getElementById("alpha").value);

		slider_b.value = change_index;
		slider_c.value = change_index;
		slider_d.value = change_index;

		var a_num = a_limit_list[a_index];
		var b_num = b_limit_list[a_index][change_index];
		var c_num = c_limit_list[a_index][change_index];
		var d_num = d_limit_list[a_index][change_index];
		var alpha_num = alpha_index + 100;

		document.getElementById("A-Number").value = a_num; 
		document.getElementById("B-Number").value = b_num;
		document.getElementById("C-Number").value = c_num;
		document.getElementById("D-Number").value = d_num;
		document.getElementById("Alpha-Number").value = alpha_num;
		
		console.log(a_num + ", " +  b_num + ", " + c_num + ", " + d_num + ", " + alpha_num);
		generate_2d_model(a_num, b_num, c_num, d_num, alpha_num);
	};

	var change_slider_alpha = function(event) {
		redraw();
		
		
		var slider_b = document.getElementById("B");
		var slider_c = document.getElementById("C");
		var slider_d = document.getElementById("D");

		var a_index = parseInt(document.getElementById("A").value);
		var alpha_index = parseInt(document.getElementById("alpha").value);
		var b_index = parseInt(slider_b.value);
		
		var a_num = a_limit_list[a_index];
		var b_num = b_limit_list[a_index][b_index];
		var c_num = c_limit_list[a_index][b_index];
		var d_num = d_limit_list[a_index][b_index];
		var alpha_num = alpha_index + 100;

		document.getElementById("A-Number").value = a_num; 
		document.getElementById("B-Number").value = b_num;
		document.getElementById("C-Number").value = c_num;
		document.getElementById("D-Number").value = d_num;
		document.getElementById("Alpha-Number").value = alpha_num;
		
		console.log(a_num + ", " +  b_num + ", " + c_num + ", " + d_num + ", " + alpha_num);
		generate_2d_model(a_num, b_num, c_num, d_num, alpha_num);
	};

	var change_box = function(event) {
		redraw();

		var change_id = event.target.id;
		var change_index = 0;

		var box_a = document.getElementById("A-Number");
		var box_b = document.getElementById("B-Number");
		var box_c = document.getElementById("C-Number");
		var box_d = document.getElementById("D-Number");
		var box_alpha = document.getElementById("Alpha-Number");

		var slider_b = document.getElementById("B");
		var slider_c = document.getElementById("C");
		var slider_d = document.getElementById("D");

		var a_num = parseInt(box_a.value);
		var b_num = parseInt(box_b.value);
		var c_num = parseInt(box_c.value);
		var d_num = parseInt(box_d.value);
		var alpha_num = parseInt(box_alpha.value);

		var a_index = parseInt(document.getElementById("A").value);

		if (change_id == "B-Number") {
			var b_index_max = b_limit_list[a_index].length;

			if (b_num < b_limit_list[a_index][0] || b_num > b_limit_list[a_index][b_index_max - 1]) {
				b_num = b_limit_list[a_index][0];
				change_index = 0;
				box_b.value = b_num;
				slider_b.value = 0;
				slider_b.max = b_index_max - 1;
			}
			else {
				for (var i = 0; i < b_index_max; i++) {
					if (b_num >= b_limit_list[a_index][i]) {
						b_index = i;
					}
				}
				change_index = b_index;
				slider_b.value = change_index;
				
				
			}
			slider_c.value = change_index;
			slider_d.value = change_index;
			c_num = c_limit_list[a_index][change_index];
			box_c.value = c_num;
			d_num = d_limit_list[a_index][change_index];
			box_d.value = d_num;
		
		}
		else if (change_id == "C-Number") {
			var c_index_max = c_limit_list[a_index].length;

			if (c_num < c_limit_list[a_index][0] || c_num > c_limit_list[a_index][c_index_max - 1]) {
				c_num = c_limit_list[a_index][0];
				change_index = 0;
				box_c.value = c_num;
				slider_c.value = 0;
				slider_c.max = c_index_max - 1;
			}
			else {
				for (var i = 0; i < c_index_max; i++) {
					if (c_num >= c_limit_list[a_index][i]) {
						c_index = i;
					}
				}
				change_index = c_index;
			}
			slider_b.value = change_index;
			slider_d.value = change_index;
			b_num = b_limit_list[a_index][change_index];
			box_b.value = b_num;
			d_num = d_limit_list[a_index][change_index];
			box_d.value = d_num;

		}
		else if (change_id == "D-Number") {
			var d_index_max = d_limit_list[a_index].length;

			if (d_num < d_limit_list[a_index][0] || d_num > d_limit_list[a_index][d_index_max - 1]) {
				d_num = d_limit_list[a_index][0];
				change_index = 0;
				box_d.value = c_num;
				slider_d.value = 0;
				slider_d.max = d_index_max - 1;
			}
			else {
				for (var i = 0; i < d_index_max; i++) {
					if (d_num >= d_limit_list[a_index][i]) {
						d_index = i;
					}
				}
				change_index = d_index;
			}
			slider_c.value = change_index;
			slider_b.value = change_index;
			c_num = c_limit_list[a_index][change_index];
			box_c.value = c_num;
			b_num = b_limit_list[a_index][change_index];
			box_b.value = b_num;
		}

		

		console.log(a_num + ", " + b_num + ", " + c_num + ", " + d_num + ", " + alpha_num);
		generate_2d_model(a_num, b_num, c_num, d_num, alpha_num);

	}

	

	

	var change_box_alpha = function(event) {
		redraw();

		var box_a = document.getElementById("A-Number");
		var box_b = document.getElementById("B-Number");
		var box_c = document.getElementById("C-Number");
		var box_d = document.getElementById("D-Number");
		var box_alpha = document.getElementById("Alpha-Number");

		var slider_b = document.getElementById("B");
		
		var a_num = parseInt(box_a.value);
		var b_num = parseInt(box_b.value);
		var c_num = parseInt(box_c.value);
		var d_num = parseInt(box_d.value);
		var alpha_num = parseInt(box_alpha.value);

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
	
	var a_index = 5;
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
	var b_index = 1;
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
	number_box.onchange = change_box;
	number_box_area.dom.appendChild( number_box );
	slider_row.add( number_box_area );

	container.add( slider_row );

	var slider_row = new UI.Row();
	slider_row.add( new UI.Text("C: ").setClass("row-title"));

	var slider_area = new UI.Div().setClass("slider");
	var slider_bar_dom = document.createElement( "input" );
	slider_bar_dom.id = "C";
	slider_bar_dom.type = "range";
	var c_index = 1;
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
	number_box.onchange = change_box;
	number_box_area.dom.appendChild( number_box );
	slider_row.add( number_box_area );
	
	container.add( slider_row );

	
	var slider_row = new UI.Row();
	slider_row.add( new UI.Text("D: ").setClass("row-title"));
	var slider_area = new UI.Div().setClass("slider");

	var slider_bar_dom = document.createElement( "input" );
	slider_bar_dom.id = "D";
	slider_bar_dom.type = "range";
	var d_index = 1;
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
	number_box.onchange = change_box;
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
	slider_bar.onchange = change_slider_alpha;
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
	number_box.onchange = change_box_alpha;
	number_box_area.dom.appendChild( number_box );
	row.add( number_box_area );

	container.add( row );

	var row = new UI.Row();
	var reset_btn = new UI.Button("重置").setClass("Button ripple-effect");
	reset_btn.onClick( function(event) {
		document.getElementById("A").value = 5;
		document.getElementById("B").value = 1;
		document.getElementById("C").value = 1;
		document.getElementById("D").value = 1;
		document.getElementById("alpha").value = 30;

		document.getElementById("A-Number").value = 107;
		document.getElementById("B-Number").value = 39;
		document.getElementById("C-Number").value = 30;
		document.getElementById("D-Number").value = 32;
		document.getElementById("Alpha-Number").value = 130;

		redraw();
		generate_2d_model(107, 39, 30, 32, 130);
	});
	row.add( reset_btn );

	container.add( row );

	return container;
};
