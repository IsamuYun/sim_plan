/**
 * @author mrdoob / http://mrdoob.com/
 */

var Toolbar = function ( editor ) {

	var signals = editor.signals;

	var container = new UI.Panel();
	container.setId( 'toolbar' );
	/*
	var acetabular_cup_label = new UI.Text( "髋臼杯" );
	container.add( acetabular_cup_label );

	var progress_bar = new UI.Progress();
	progress_bar.setId( "acetabular-load-progress" );
	progress_bar.setValue( 0 );

	container.add( progress_bar );

	var hip_implant_label = new UI.Text( "植入体" );
	container.add( hip_implant_label );

	var progress_bar = new UI.Progress();
	progress_bar.setId( "hip-load-progress" );
	progress_bar.setValue( 0 );

	container.add( progress_bar );
	*/

	var femur_label = new UI.Text( "股骨" );
	container.add( femur_label );

	var progress_bar = new UI.Progress();
	progress_bar.setId( "femur-load-progress" );
	progress_bar.setValue( 0 );
	container.add( progress_bar );

	
	var label = new UI.Text( "盆骨" );
	container.add( label );

	var progress_bar = new UI.Progress();
	progress_bar.setId( "pelvis-load-progress" );
	progress_bar.setValue( 0 );
	container.add( progress_bar );
	

	var label = new UI.Text( "新髋臼杯" );
	container.add( label );

	var progress_bar = new UI.Progress();
	progress_bar.setId( "new-acetabular-load-progress" );
	progress_bar.setValue( 0 );
	container.add( progress_bar );

	var label = new UI.Text( "髋臼内衬" );
	container.add( label );

	var progress_bar = new UI.Progress();
	progress_bar.setId( "acetabular-inner-load-progress" );
	progress_bar.setValue( 0 );
	container.add( progress_bar );

	var label = new UI.Text( "股骨柄假体" );
	container.add( label );

	var progress_bar = new UI.Progress();
	progress_bar.setId( "femur-hip-load-progress" );
	progress_bar.setValue( 0 );
	container.add( progress_bar );

	var label = new UI.Text( "股骨头假体" );
	container.add( label );

	var progress_bar = new UI.Progress();
	progress_bar.setId( "femur-head-load-progress" );
	progress_bar.setValue( 0 );
	container.add( progress_bar );


	return container;
};
