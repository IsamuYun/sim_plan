var width = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
var height = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;


var center_box_width = 0;
var right_box_width = 300;
var left_box_width = width - right_box_width - center_box_width;

function setViewerMainSize() {
    var zs_viewer_main = document.getElementById("zs-viewer-main");
    zs_viewer_main.style.height = height + "px";
    zs_viewer_main.style.width = width + "px";

    var zs_splitpane_left = document.getElementById("zs-splitpane-left");
    zs_splitpane_left.style.width = left_box_width + "px";
    
    var zs_splitpane_center = document.getElementById("zs-splitpane-center");
    zs_splitpane_center.style.marginLeft = left_box_width + "px";
    zs_splitpane_center.style.marginRight = right_box_width + "px";

    //setImageBoxSize();
}


window.onload = setViewerMainSize;
window.onresize = function() {
    setViewerMainSize();
    window.location.reload();
};

/* 调整窗口大小代码 */
function setImageBoxSize() {
    var zs_image_pane = document.getElementById("zs-image-pane");

    var zs_image_box_x = document.getElementById("zs-image-box-x");
    var zs_image_box_y = document.getElementById("zs-image-box-y");
    var zs_image_box_z = document.getElementById("zs-image-box-z");
    var zs_image_box_3d = document.getElementById("zs-image-box-3d");

    var zs_image_x = document.getElementById("dicom-image-x");
    var zs_image_y = document.getElementById("dicom-image-y");
    var zs_image_z = document.getElementById("dicom-image-z");

    var pane_width = left_box_width;
    var pane_height = height - 100;

    // 相框的宽度不用干预
    zs_image_pane.style.height = pane_height + "px";

    var image_box_width = (left_box_width - 10) / 2;
    var image_box_height = (pane_height - 10) / 2;

    

    // 
    zs_image_box_x.style.width = image_box_width + "px";
    zs_image_box_x.style.height = (image_box_height - 2) + "px";
    zs_image_box_x.style.left = "3px";
    zs_image_box_x.style.top = "3px";

    zs_image_box_y.style.width = (image_box_width + 3) + "px";
    zs_image_box_y.style.height = (image_box_height - 2) + "px";
    zs_image_box_y.style.left =  (image_box_width + 5) + "px";
    zs_image_box_y.style.top = "3px";

    zs_image_box_z.style.width = image_box_width  + "px";
    zs_image_box_z.style.height = (image_box_height + 4) + "px";
    zs_image_box_z.style.left =  "3px";
    zs_image_box_z.style.top = (image_box_height + 2) + "px";

    zs_image_box_3d.style.width = (image_box_width + 3) + "px";
    zs_image_box_3d.style.height = (image_box_height + 4 ) + "px";
    zs_image_box_3d.style.left =  (image_box_width + 5) + "px";
    zs_image_box_3d.style.top = (image_box_height + 2) + "px";
    // 开始图像位置的设定
    zs_image_x.style.left = ((image_box_width - 320) / 2 + 20) + "px";
    zs_image_x.style.top = "0px";

    zs_image_y.style.left = ((image_box_width - 320) / 2 + 20) + "px";
    zs_image_y.style.top = "0px";

    zs_image_z.style.left = ((image_box_width - 320) / 2 + 20) + "px";
    zs_image_y.style.top = "0px";
}

var RGBChange = function() {
	console.log("Something is change.");
};


