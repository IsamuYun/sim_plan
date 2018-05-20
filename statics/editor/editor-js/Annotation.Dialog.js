/**
 * @author mrdoob / http://mrdoob.com/
 */

var AnnotationDialog = function ( editor ) {
    var signals = editor.signals;
    var annotation_count = editor.annotation_count;

	var container = new UI.Panel();
	container.setId('annotation-dialog-' + annotation_count);
    container.setClass("zs-annotation");

    var row = new UI.Row();
    var title = new UI.Text("注释框");
    title.setClass("title");
    row.add(title);
    container.add(row);

    var row = new UI.Row();
    var annotation_text = new UI.TextArea();
    annotation_text.setClass("text-area");
    annotation_text.setId("annotation-text-" + annotation_count);
    row.add(annotation_text);

    container.add(row);


    var row = new UI.Row();

    var confirm_button = new UI.Button("确定").setClass("ripple-effect confirm");
    confirm_button.onClick( function () {
        
        
    });
    row.add(confirm_button);

    var cancel_button = new UI.Button("取消" ).setClass("ripple-effect cancel");
    cancel_button.onClick( function() {
        var annotation_point = null;
        editor.scene.traverse(function(child) {
            if (child.name === "annotation-point-" + annotation_count) {
                annotation_point = child;
            }
        });
        if (annotation_point != null) {
            editor.execute(new RemoveObjectCommand( annotation_point ));
        }

        var dialog = document.getElementById("annotation-dialog-" + annotation_count);
        if (dialog != null) {
            document.body.removeChild(dialog);
        }
        

        editor.signals.sceneGraphChanged.dispatch();
    });
    row.add(cancel_button);

    container.add(row);

	return container;
};
