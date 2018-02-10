/**
 * @author isamu 20180209
 */

Menubar.Upload = function ( editor ) {

	var container = new UI.Panel();
	container.setClass( 'menu' );

	var title = new UI.Panel();
	title.setClass( 'title' );
	title.setTextContent( "STL文件上传" );
	container.add( title );

	var options = new UI.Panel();
	options.setClass( 'options' );
	container.add( options );

	

	// 文件上传

	var option = new UI.Row();
	option.setClass( 'option' );
	option.setTextContent( '上传' );
	option.onClick( function () {

        // do something
        const dlg = document.getElementById("upload-file");
        dlg.showModal();

        var close_button = document.getElementById("close");

        close_button.addEventListener("click", function(e) {
            dlg.close();
        });

	} );
	options.add( option );

	return container;

};