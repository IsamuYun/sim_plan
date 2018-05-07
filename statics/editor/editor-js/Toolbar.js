/**
 * @author mrdoob / http://mrdoob.com/
 */

var Toolbar = function ( editor ) {

	var signals = editor.signals;

	var container = new UI.Panel();
	container.setId( 'toolbar' );

	var label = new UI.Text( "全选" ).setPadding( "8px" );
	container.add( label );

	var select_all = true;
	var select_all_checkbox = new UI.Checkbox( select_all ).onChange( function() {
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
		editor.signals.sceneGraphChanged.dispatch();
	})
	select_all_checkbox.setWidth( "20px" );
	container.add( select_all_checkbox );

	var femur_label = new UI.Text( "股骨" );
	container.add( femur_label );

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
	container.add( femur_checkbox );

	var progress_bar = new UI.Progress();
	progress_bar.setId( "femur-load-progress" );
	progress_bar.setValue( 0 );
	container.add( progress_bar );

	
	var label = new UI.Text( "盆骨" );
	container.add( label );

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
	container.add( pelvis_checkbox );

	var progress_bar = new UI.Progress();
	progress_bar.setId( "pelvis-load-progress" );
	progress_bar.setValue( 0 );
	container.add( progress_bar );
	
	

	var label = new UI.Text( "新髋臼杯" );
	container.add( label );

	

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
	container.add( acetabular_checkbox );

	var progress_bar = new UI.Progress();
	progress_bar.setId( "new-acetabular-load-progress" );
	progress_bar.setValue( 0 );
	container.add( progress_bar );

	var label = new UI.Text( "髋臼内衬" );
	container.add( label );

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
	container.add( acetabular_inner_checkbox );

	var progress_bar = new UI.Progress();
	progress_bar.setId( "acetabular-inner-load-progress" );
	progress_bar.setValue( 0 );
	container.add( progress_bar );

	

	var label = new UI.Text( "股骨柄假体" );
	container.add( label );

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
	container.add( femur_hip_checkbox );

	var progress_bar = new UI.Progress();
	progress_bar.setId( "femur-hip-load-progress" );
	progress_bar.setValue( 0 );
	container.add( progress_bar );

	

	var label = new UI.Text( "股骨头假体" );
	container.add( label );

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
	container.add( femur_head_checkbox );

	var progress_bar = new UI.Progress();
	progress_bar.setId( "femur-head-load-progress" );
	progress_bar.setValue( 0 );
	container.add( progress_bar );

	

	return container;
};
