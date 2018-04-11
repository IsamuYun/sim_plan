/**
 * @author mrdoob / http://mrdoob.com/
 */

var SidebarCTBox = function ( editor ) {

    var signals = editor.signals;

	var container = new UI.Panel();
    container.setId( 'sidebar-ct-box' );
    
    var titleRow = new UI.Row();
    titleRow.add( new UI.Text( "物体" ).setClass( "title" ) );
    container.add( titleRow );

    var contentPanel = new UI.Panel().setClass( "content" );
    var typeRow = new UI.Row();
    typeRow.add( new UI.Text("类型").setClass( "td-header" ) );
    typeRow.add( new UI.Text("假体").setClass( "td-content" ) );
    contentPanel.add( typeRow );

    var xinghaoRow = new UI.Row();
    xinghaoRow.add( new UI.Text("型号").setClass( "td-header" ) );
    xinghaoRow.add( new UI.Text("嵌入式双螺旋 置换").setClass( "td-content" ) );
    contentPanel.add( xinghaoRow );

    var sizeRow = new UI.Row();
    sizeRow.add( new UI.Text("尺寸").setClass( "td-header" ) );
    sizeRow.add( new UI.Text("A111 B52 C38.5 D44 E21 sec 35").setClass( "td-content" ) );
    contentPanel.add( sizeRow );
    container.add( contentPanel );

    var detailRow = new UI.Row();
    detailRow.add( new UI.Text( "详情" ).setClass( "detail" ));
    container.add( detailRow );

    
	return container;
};
