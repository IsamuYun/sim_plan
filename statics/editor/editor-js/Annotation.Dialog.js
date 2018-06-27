/**
 * @author mrdoob / http://mrdoob.com/
 */



var AnnotationDialog = function ( editor ) {
    var signals = editor.signals;
    var annotation_count = editor.annotation_count;

	var container = new UI.Div();
	container.setId('annotation-dialog-' + annotation_count);
    //container.setClass("zs-annotation-box min-h-screen min-v-screen bg-grey-lightest p-8");
    container.setClass("zs-annotation-box");
    var border = new UI.Div();
    //border.setClass("box border border-grey rounded flex flex-col shadow bg-white overflow-hidden");
    border.setClass("box border border-grey rounded flex flex-col bg-white overflow-hidden");

    var title_box = new UI.Div();
    title_box.setClass("inner-box");

    var title = new UI.Text("注释");
    title.setClass("text-grey-darker font-medium title-bar");
    //title.dom.innerHTML = "注释<span id=\'annotation-cancel-" + annotation_count + "\'><i class=\'fa fa-times\'></i></span><span id=\'annotation-cancel-" + annotation_count + "\'><i class=\'fa fa-check px-2\'></i></span>";
    
    var cancel_btn = new UI.Span("");
    cancel_btn.dom.innerHTML = "<i class=\'fa fa-times\'></i>";
    cancel_btn.onClick(function() {
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
    title.add(cancel_btn);

    var confirm_btn = new UI.Span("");
    
    confirm_btn.onClick(function() {
        var text_area = document.getElementById("annotation-text-" + annotation_count);
        /*
        if (text_area != null) {
            text_area.value = "The Annotation - " + annotation_count + "\n is pressed.";
        }
        */
    });
    confirm_btn.dom.innerHTML = "<i class=\'fa fa-check px-2\'></i>";
    title.add(confirm_btn);
    title_box.add(title);

    function onInput() {
        
        this.style.height = 'auto';
        this.style.height = (this.scrollHeight) + 'px';
        
        
        this.scrollTop = this.scrollHeight;
        window.scrollTo(window.scrollLeft, (this.scrollTop + this.scrollHeight));
        
    }

    var annotation_text = new UI.TextArea();
    annotation_text.setId("annotation-text-" + annotation_count);
    annotation_text.setClass("max-h-99 text-grey-darkest flex-1 bg-transparent text-box");
    annotation_text.dom.setAttribute("rows", "2");
    //annotation_text.dom.setAttribute("cols", "20");
    annotation_text.dom.setAttribute("v-autoresize", "");
    annotation_text.dom.setAttribute("placeholder", "输入注释内容...");
    annotation_text.dom.setAttribute("wrap", "virtual");
    annotation_text.dom.style["padding"] = "0";
    annotation_text.dom.addEventListener("input", onInput, false);
    title_box.add(annotation_text);

    border.add(title_box);
    container.add(border);

    /*
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
    */

    
	return container;
};



/*
Vue.directive('autoresize', {
    
    inserted: function (el) {
        el.style.height = el.scrollHeight + 'px';
        el.style.overflow.y = 'hidden';
        el.style.resize= 'none';
        
        el.addEventListener("input", OnInput, false);
    }
  });
  
  new Vue({
    el:'.app',
  })
*/


