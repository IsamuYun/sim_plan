/**
 * @author mrdoob / http://mrdoob.com/
 */

var Toolbar = function ( editor ) {

	var signals = editor.signals;

	var container = new UI.Panel();
	container.setId( 'toolbar' );

	var acetabular_cup_label = new UI.Text("髋臼杯载入进度");
	container.add( acetabular_cup_label );

	var progress_bar = new UI.Progress();
	progress_bar.setId( "acetabular-load-progress" );
	progress_bar.setValue( 0 );

	container.add( progress_bar );

	var hip_implant_label = new UI.Text("植入体载入进度");
	container.add( hip_implant_label );

	var progress_bar = new UI.Progress();
	progress_bar.setId( "hip-load-progress" );
	progress_bar.setValue( 0 );

	container.add( progress_bar );

	var femur_label = new UI.Text( "股骨载入进度" );
	container.add( femur_label );

	var progress_bar = new UI.Progress();
	progress_bar.setId( "femur-load-progress" );
	progress_bar.setValue( 0 );
	container.add( progress_bar );

	var label = new UI.Text( "盆骨载入进度" );
	container.add( label );

	var progress_bar = new UI.Progress();
	progress_bar.setId( "pelvis-load-progress" );
	progress_bar.setValue( 0 );
	container.add( progress_bar );

	return container;
};
