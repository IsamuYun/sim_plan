/**
 * @author mrdoob / http://mrdoob.com/
 */

var Toolbar = function ( editor ) {

	var signals = editor.signals;

	var container = new UI.Panel();
	container.setId( 'toolbar' );

	var icon = new UI.Panel().setClass("three-layers");
	container.add(icon);

	var mesh_list = new UI.Panel().setClass("mesh_process");

	var label = new UI.Text("全选").setClass("toolbar-title");
	mesh_list.add(label);

	var select_all = true;
	var select_all_checkbox = new UI.Checkbox(select_all).onChange( function() {
		select_all = select_all ? false : true;
		editor.scene.traverse( function(child) {
			if (child.name === "股骨") {
				child.visible = select_all;
			}
			if (child.name === "切割预览" ) {
				child.visible = false;
			}
			if (child.name === "盆骨") {
				child.visible = select_all;
			}
			if (child.name === "新髋臼杯") {
				child.visible = select_all;
			}
			if (child.name === "髋臼内衬") {
				child.visible = select_all;
			}
			if (child.name === "股骨柄假体") {
				child.visible = select_all;
			}
			if (child.name === "股骨头假体") {
				child.visible = select_all;
			}
		});
		femur_checkbox.setValue(select_all);
		femur_visible = select_all;
		pelvis_checkbox.setValue(select_all);
		pelvis_visible = select_all;
		acetabular_checkbox.setValue(select_all);
		acetabular_visible = select_all;
		acetabular_inner_checkbox.setValue(select_all);
		acetabular_inner_visible = select_all;
		femur_hip_checkbox.setValue(select_all);
		femur_hip_visible = select_all;

		femur_head_checkbox.setValue(select_all);
		femur_head_visible = select_all;

		editor.signals.sceneGraphChanged.dispatch();
	});
	select_all_checkbox.setClass("toolbar-checkbox");
	mesh_list.add( select_all_checkbox );

	var femur_label = new UI.Text( "股骨" ).setClass("toolbar-title");
	mesh_list.add( femur_label );

	var femur_visible = true;
	var femur_checkbox = new UI.Checkbox( femur_visible  ).onChange( function () {
		femur_visible = femur_visible ? false : true;
		editor.scene.traverse( function( child ) {
			if (child.name === "股骨") {
				child.visible = femur_visible;
			}
			if (child.name === "切割预览" ) {
				child.visible = false;
			}
		});
		editor.signals.sceneGraphChanged.dispatch();
	} );
	femur_checkbox.setClass("toolbar-checkbox");
	mesh_list.add( femur_checkbox );

	var progress_bar = new UI.Progress();
	progress_bar.setId( "femur-load-progress" );
	progress_bar.setValue( 0 );
	mesh_list.add( progress_bar );

	var label = new UI.Text("盆骨").setClass("toolbar-title");
	mesh_list.add( label );

	var pelvis_visible = true;
	var pelvis_checkbox = new UI.Checkbox( pelvis_visible ).onChange( function() {
		pelvis_visible = pelvis_visible ? false : true;
		editor.scene.traverse( function( child ) {
			if (child.name === "盆骨") {
				child.visible = pelvis_visible;
			}
		});
		editor.signals.sceneGraphChanged.dispatch();
	});
	pelvis_checkbox.setClass("toolbar-checkbox");
	mesh_list.add(pelvis_checkbox);

	var progress_bar = new UI.Progress();
	progress_bar.setId("pelvis-load-progress");
	progress_bar.setValue(0);
	mesh_list.add(progress_bar);
	
	var label = new UI.Text("新髋臼杯").setClass("toolbar-title");
	mesh_list.add(label);

	var acetabular_visible = true;
	var acetabular_checkbox = new UI.Checkbox( acetabular_visible ).onChange( function() {
		acetabular_visible = acetabular_visible ? false : true;
		editor.scene.traverse( function( child ) {
			if (child.name === "新髋臼杯") {
				child.visible = acetabular_visible;
			}
		});
		editor.signals.sceneGraphChanged.dispatch();
	});
	acetabular_checkbox.setClass("toolbar-checkbox");
	mesh_list.add(acetabular_checkbox);

	var progress_bar = new UI.Progress();
	progress_bar.setId("new-acetabular-load-progress");
	progress_bar.setValue(0);
	mesh_list.add(progress_bar);

	var label = new UI.Text("髋臼内衬").setClass("toolbar-title");
	mesh_list.add(label);

	var acetabular_inner_visible = true;
	var acetabular_inner_checkbox = new UI.Checkbox( acetabular_inner_visible ).onChange( function() {
		acetabular_inner_visible = acetabular_inner_visible ? false : true;
		editor.scene.traverse( function( child ) {
			if (child.name === "髋臼内衬") {
				child.visible = acetabular_inner_visible;
			}
		});
		editor.signals.sceneGraphChanged.dispatch();
	});
	acetabular_inner_checkbox.setClass("toolbar-checkbox");
	mesh_list.add(acetabular_inner_checkbox);

	var progress_bar = new UI.Progress();
	progress_bar.setId("acetabular-inner-load-progress");
	progress_bar.setValue(0);
	mesh_list.add(progress_bar);

	var label = new UI.Text("股骨柄假体").setClass("toolbar-title");
	mesh_list.add( label );

	var femur_hip_visible = true;
	var femur_hip_checkbox = new UI.Checkbox( femur_hip_visible ).onChange( function() {
		femur_hip_visible = femur_hip_visible ? false : true;
		editor.scene.traverse( function( child ) {
			if (child.name === "股骨柄假体") {
				child.visible = femur_hip_visible;
			}
		});
		editor.signals.sceneGraphChanged.dispatch();
	});
	femur_hip_checkbox.setClass("toolbar-checkbox");
	mesh_list.add(femur_hip_checkbox);

	var progress_bar = new UI.Progress();
	progress_bar.setId( "femur-hip-load-progress" );
	progress_bar.setValue( 0 );
	mesh_list.add( progress_bar );

	var label = new UI.Text("股骨头假体").setClass("toolbar-title");
	mesh_list.add( label );

	var femur_head_visible = true;
	var femur_head_checkbox = new UI.Checkbox( femur_head_visible ).onChange( function() {
		femur_head_visible = femur_head_visible ? false : true;
		editor.scene.traverse( function( child ) {
			if (child.name === "股骨头假体") {
				child.visible = femur_head_visible;
			}
		});
		editor.signals.sceneGraphChanged.dispatch();
	});
	femur_head_checkbox.setClass("toolbar-checkbox");
	mesh_list.add(femur_head_checkbox);

	var progress_bar = new UI.Progress();
	progress_bar.setId("femur-head-load-progress");
	progress_bar.setValue(0);
	mesh_list.add(progress_bar);

	container.add(mesh_list);

	var information_bar = new UI.Panel().setClass("information-bar").setId("toolbar-information");
	var information_icon = new UI.Panel().setClass("toolbar-information");
	information_bar.add(information_icon);
	var information_text = new UI.Text("").setId("tip-message");;
	information_bar.add(information_text);

	container.add(information_bar);

	return container;
};
