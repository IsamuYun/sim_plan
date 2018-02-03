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

    setImageBoxSize();
}


window.onload = setViewerMainSize;
window.onresize = function() {
    //

    if (document.fullscreenElement ||
        document.webkitFullscreenElement ||
        document.mozFullScreenElement ||
        document.msFullscreenElement ) {

    }
    else {
        setViewerMainSize();
        window.location.reload(true);
    }
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
    zs_image_x.style.top = ((image_box_height - 320) / 2) + "px";

    zs_image_y.style.left = ((image_box_width - 320) / 2 + 20) + "px";
    zs_image_y.style.top = ((image_box_height - 320) / 2) + "px";

    zs_image_z.style.left = ((image_box_width - 320) / 2 + 20) + "px";
    zs_image_z.style.top = ((image_box_height - 320) / 2) + "px";

    //change_image_x();
}

var RGBChange = function() {
	console.log("Something is change.");
};


var slice_range_x = $('#slice-range-x').slider().on('slide', selectImageX).data('slider');

var slice_range_y = $('#slice-range-y').slider().on('slide', selectImageY).data('slider');

var slice_range_z = $('#slice-range-z').slider().on('slide', selectImageZ).data('slider');
    
/* CornerstoneWebImageLoader 配置开始 */
cornerstoneWebImageLoader.external.cornerstone = cornerstone;
    
cornerstoneWebImageLoader.configure({
    beforeSend: function(xhr) {
        // Add custom headers here (e.g. auth tokens)
        //xhr.setRequestHeader('x-auth-token', 'my auth token');
    }
});

/* CornerstoneWebImageLoader 配置结束 */

/* 定义一个数组 */
var image_url_x = new Array();
var image_url_y = new Array();
var image_url_z = new Array();

const NUM_X = 512;
const NUM_Y = 512;
const NUM_Z = 400;

var coord_x = NUM_X / 2;
var coord_y = NUM_Y / 2;
var coord_z = NUM_Z / 2;

var coord_x_x = NUM_X / 2;    // X轴坐标系坐标值
var coord_x_y = NUM_X / 2;    // X轴坐标系坐标值

var coord_y_x = NUM_Y / 2;    // Y视图的X坐标值
var coord_y_y = NUM_Y / 2;    //  Y视图的Y坐标值

var coord_z_x = NUM_Z / 2;  // Z视图的X坐标值 
var coord_z_y = NUM_Z / 2;  // Z视图的Y坐标值

var length_on = false;
var wwwc_on = true;
var probe_on = false;
var pizhu_on = false;

function init_x_image_url_list() {
    const host_name = window.location.origin;
    const folder_name = "/static/img/hipdicom/x/slice_";
    const file_name_ex = ".png";

    for (i = 0; i < NUM_X; i++) {
        image_url_x[i] = host_name + folder_name + i + file_name_ex;
    }
}

function init_y_image_url_list() {
    const host_name = window.location.origin;
    const folder_name = "/static/img/hipdicom/y/slice_";
    const file_name_ex = ".png";

    for (i = 0; i < NUM_Y; i++) {
        image_url_y[i] = host_name + folder_name + i + file_name_ex;
    }
}

function init_z_image_url_list() {
    const host_name = window.location.origin;
    const folder_name = "/static/img/hipdicom/z/slice_";
    const file_name_ex = ".png";

    for (i = 0; i < NUM_Z; i++) {
        image_url_z[i] = host_name + folder_name + i + file_name_ex;
    }
}

init_x_image_url_list();
init_y_image_url_list();
init_z_image_url_list();

/* 初始化slice-range */
var stack_x = {
    currentImageIdIndex: image_url_x.length / 2,
    imageIds: image_url_x
};

var stack_y = {
    currentImageIdIndex: image_url_y.length / 2,
    imageIds: image_url_y
};

var stack_z = {
    currentImageIdIndex: image_url_z.length / 2,
    imageIds: image_url_z
};


const image_x = document.getElementById('dicom-image-x');

/*该函数是在图像显示之后*/
function onImageRenderedX(e) {
    var eventData = e.detail;
    var viewport = eventData.viewport;
    document.getElementById('zoom-text-x').textContent = "Zoom: " + viewport.scale.toFixed(2);

    // 在这里，监控一个数值，画十字线
    cornerstone.setToPixelCoordinateSystem(e.detail.enabledElement, e.detail.canvasContext);
    var context = e.detail.canvasContext;
    context.beginPath(); 
    context.lineWidth = 1 / e.detail.viewport.scale;
    context.strokeStyle = "rgb(255, 255, 255)";
    context.strokeRect((coord_x_x) - 5, (coord_x_y) - 5, 10, 10);
    context.moveTo(coord_x_x, 0);
    context.lineTo(coord_x_x, 512);
    context.moveTo(0, coord_x_y);
    context.lineTo(512, coord_x_y);

    context.stroke();

};

image_x.addEventListener('cornerstoneimagerendered', onImageRenderedX);

// 更换新图片的时候
function onNewImageX(e) {
    var eventData = e.detail;
    var new_image_index = stack_x.currentImageIdIndex;

    // Update the slider value
    var slider = document.getElementById('slice-range-x');
    slider.value = new_image_index;

    // Populate the current slice span
    var currentValueSpan = document.getElementById("slice-text-x");
    currentValueSpan.textContent = "Image: " + (new_image_index + 1) + "/" + image_url_x.length;

}

image_x.addEventListener('cornerstonenewimage', onNewImageX);


function selectImageX(event) {
    var targetElement = document.getElementById("dicom-image-x");

    // Get the range input value
    // var new_image_index = parseInt(event.currentTarget.value, 10);

    new_image_index = slice_range_x.getValue();

    // 设定Y轴坐标系和Z轴坐标系的坐标
    coord_x = new_image_index;

    coord_y_x = coord_x;
    coord_y_y = coord_y;
    coord_z_x = coord_y;
    coord_z_y = coord_x;

    // update
    cornerstone.draw(document.getElementById("dicom-image-y"));
    cornerstone.draw(document.getElementById("dicom-image-z"));

    // Get the stack data
    var stackToolDataSource = cornerstoneTools.getToolState(targetElement, 'stack');
    if ((typeof stackToolDataSource) === "undefined") {
        console.warn("stack undefined");
        return;
    }
    var stackData = stackToolDataSource.data[0];

    // Switch images, if necessary
    if (new_image_index !== stackData.currentImageIdIndex && stackData.imageIds[new_image_index] !== undefined) {
        cornerstone.loadAndCacheImage(stackData.imageIds[new_image_index]).then(function(image) {
            var viewport = cornerstone.getViewport(targetElement);
            stackData.currentImageIdIndex = new_image_index;
            cornerstone.displayImage(targetElement, image, viewport);

            cornerstoneTools.addToolState(targetElement, 'stack', stack_x);

            // Enable all tools we want to use with this element
            // cornerstoneTools.stackScroll.activate(targetElement, 1);
            // cornerstoneTools.stackScrollWheel.activate(targetElement);

            cornerstoneTools.scrollIndicator.enable(targetElement);

            //cornerstoneTools.wwwc.activate(image_x, 1);
            cornerstoneTools.zoomWheel.activate(image_x);
            cornerstoneTools.pan.activate(image_x, 4);

            if  (wwwc_on)
    {
        cornerstoneTools.wwwc.activate(image_x, 1);
    }
    if (pizhu_on)
    {
        cornerstoneTools.arrowAnnotate.activate(image_x, 1);
    }
    if (length_on)
    {
        cornerstoneTools.length.activate(image_x, 1);
    }
    if (probe_on)
    {
        cornerstoneTools.probe.activate(image_x, 1);
    }
            
            function activate(id) {
                document.querySelectorAll('a').forEach(function(elem) { elem.classList.remove('active'); });
                document.getElementById(id).classList.add('active');
            }
        });
    }
}

// Bind the range slider events
document.getElementById('slice-range-x').addEventListener("input", selectImageX);

/* */


// Enable the dicomImage element and the mouse inputs
cornerstone.enable(image_x);
cornerstoneTools.mouseInput.enable(image_x);
cornerstoneTools.mouseWheelInput.enable(image_x);
cornerstone.loadImage(image_url_x[stack_x.currentImageIdIndex]).then(function(image) {
    // Display the image
    cornerstone.displayImage(image_x, image);

    // Set the stack as tool state
    // cornerstoneTools.addStackStateManager(element, ['stack', 'playClip']);
    cornerstoneTools.addToolState(image_x, 'stack', stack_x);

    // Enable all tools we want to use with this element
    // cornerstoneTools.stackScroll.activate(image_x, 1);
    // cornerstoneTools.stackScrollWheel.activate(image_x);

    cornerstoneTools.scrollIndicator.enable(image_x);

    // cornerstoneTools.wwwc.activate(image_x, 1);
    cornerstoneTools.zoomWheel.activate(image_x);
    cornerstoneTools.pan.activate(image_x, 4);

    if  (wwwc_on)
    {
        cornerstoneTools.wwwc.activate(image_x, 1);
    }
    if (pizhu_on)
    {
        cornerstoneTools.arrowAnnotate.activate(image_x, 1);
    }
    if (length_on)
    {
        cornerstoneTools.length.activate(image_x, 1);
    }
    if (probe_on)
    {
        cornerstoneTools.probe.activate(image_x, 1);
    }
    
    function activate(id) {
        document.querySelectorAll('a').forEach(function(elem) { elem.classList.remove('active'); });
        document.getElementById(id).classList.add('active');
    }
    
});

/* 定义 Y 和 Z */

const image_y = document.getElementById('dicom-image-y');

/*该函数似乎是在图像显示之后*/
function onImageRenderedY(e) {
    var eventData = e.detail;
    var viewport = eventData.viewport;
    //document.getElementById('mr-bottom-left').textContent = "WW/WC: " + Math.round(viewport.voi.windowWidth) + "/" + Math.round(viewport.voi.windowCenter);
    document.getElementById('zoom-text-y').textContent = "Zoom: " + viewport.scale.toFixed(2);

    // 在这里，监控一个数值，画十字线
    cornerstone.setToPixelCoordinateSystem(e.detail.enabledElement, e.detail.canvasContext);
    var context = e.detail.canvasContext;
    context.beginPath(); 
    context.lineWidth = 1 / e.detail.viewport.scale;
    context.strokeStyle = "rgb(255, 255, 255)";
    context.strokeRect((coord_y_x) - 5, (coord_y_y) - 5, 10, 10);
    context.moveTo(coord_y_x, 0);
    context.lineTo(coord_y_x, 512);
    context.moveTo(0, coord_y_y);
    context.lineTo(512, coord_y_y);
    context.stroke(); 
};

image_y.addEventListener('cornerstoneimagerendered', onImageRenderedY);

// 更换新图片的时候
function onNewImageY(e) {
    var eventData = e.detail;
    var new_image_index = stack_y.currentImageIdIndex;

    // Update the slider value
    var slider = document.getElementById('slice-range-y');
    slider.value = new_image_index;

    // Populate the current slice span
    var currentValueSpan = document.getElementById("slice-text-y");
    currentValueSpan.textContent = "Image: " + (new_image_index + 1) + "/" + image_url_y.length;

}

image_y.addEventListener('cornerstonenewimage', onNewImageY);

function selectImageY(event) {
    var targetElement = document.getElementById("dicom-image-y");

    // Get the range input value
    var new_image_index = parseInt(event.currentTarget.value, 10);

    // 设定Y轴坐标系和Z轴坐标系的坐标
    coord_y = new_image_index;

    coord_x_x = coord_y;
    coord_x_y = coord_x;
    coord_z_x = coord_y;
    coord_z_y = coord_x;

    // update
    cornerstone.draw(document.getElementById("dicom-image-x"));
    cornerstone.draw(document.getElementById("dicom-image-z"));

    // Get the stack data
    var stackToolDataSource = cornerstoneTools.getToolState(targetElement, 'stack');
    if ((typeof stackToolDataSource) === "undefined") {
        console.warn("stack undefined");
        return;
    }
    var stackData = stackToolDataSource.data[0];

    // Switch images, if necessary
    if (new_image_index !== stackData.currentImageIdIndex && stackData.imageIds[new_image_index] !== undefined) {
        cornerstone.loadAndCacheImage(stackData.imageIds[new_image_index]).then(function(image) {
            var viewport = cornerstone.getViewport(targetElement);
            stackData.currentImageIdIndex = new_image_index;
            cornerstone.displayImage(targetElement, image, viewport);

            cornerstoneTools.addToolState(targetElement, 'stack', stack_y);

            // Enable all tools we want to use with this element
            // cornerstoneTools.stackScroll.activate(targetElement, 1);
            // cornerstoneTools.stackScrollWheel.activate(targetElement);

            cornerstoneTools.scrollIndicator.enable(targetElement);

            cornerstoneTools.wwwc.activate(image_y, 1);
            cornerstoneTools.zoomWheel.activate(image_y);
            cornerstoneTools.pan.activate(image_y, 4);

            /*
            function activate(id) {
                document.querySelectorAll('a').forEach(function(elem) { elem.classList.remove('active'); });
                document.getElementById(id).classList.add('active');
            }
            */
        });
    }
}

// Bind the range slider events
document.getElementById('slice-range-y').addEventListener("input", selectImageY);

// Enable the dicomImage element and the mouse inputs
cornerstone.enable(image_y);
cornerstoneTools.mouseInput.enable(image_y);
cornerstoneTools.mouseWheelInput.enable(image_y);
cornerstone.loadImage(image_url_y[stack_y.currentImageIdIndex]).then(function(image) {
    // Display the image
    cornerstone.displayImage(image_y, image);

    // Set the stack as tool state
    // cornerstoneTools.addStackStateManager(element, ['stack', 'playClip']);
    cornerstoneTools.addToolState(image_y, 'stack', stack_y);

    // Enable all tools we want to use with this element
    // cornerstoneTools.stackScroll.activate(image_y, 1);
    // cornerstoneTools.stackScrollWheel.activate(image_x);

    cornerstoneTools.scrollIndicator.enable(image_y);

    cornerstoneTools.wwwc.activate(image_y, 1);
    cornerstoneTools.zoomWheel.activate(image_y);
    cornerstoneTools.pan.activate(image_y, 4);

    /*
    function activate(id) {
        document.querySelectorAll('a').forEach(function(elem) { elem.classList.remove('active'); });
        document.getElementById(id).classList.add('active');
    }
    */
});





/* image-y over */

const image_z = document.getElementById('dicom-image-z');



/*该函数似乎是在图像显示之后*/
function onImageRenderedZ(e) {
    var eventData = e.detail;
    var viewport = eventData.viewport;
    //document.getElementById('mr-bottom-left').textContent = "WW/WC: " + Math.round(viewport.voi.windowWidth) + "/" + Math.round(viewport.voi.windowCenter);
    document.getElementById('zoom-text-z').textContent = "Zoom: " + viewport.scale.toFixed(2);

    // 在这里，监控一个数值，画十字线
    cornerstone.setToPixelCoordinateSystem(e.detail.enabledElement, e.detail.canvasContext);
    var context = e.detail.canvasContext;
    context.beginPath(); 
    context.lineWidth = 1 / e.detail.viewport.scale;
    context.strokeStyle = "rgb(255, 255, 255)";
    context.strokeRect((coord_z_x) - 5, (coord_z_y) - 5, 10, 10);
    context.moveTo(coord_z_x, 0);
    context.lineTo(coord_z_x, 512);
    context.moveTo(0, coord_z_y);
    context.lineTo(512, coord_z_y);

    context.stroke(); 

};

image_z.addEventListener('cornerstoneimagerendered', onImageRenderedZ);

// 更换新图片的时候
function onNewImageZ(e) {
    var eventData = e.detail;
    var new_image_index = stack_z.currentImageIdIndex;

    // Update the slider value
    var slider = document.getElementById('slice-range-z');
    slider.value = new_image_index;

    // Populate the current slice span
    var currentValueSpan = document.getElementById("slice-text-z");
    currentValueSpan.textContent = "Image: " + (new_image_index + 1) + "/" + image_url_z.length;
}

image_z.addEventListener('cornerstonenewimage', onNewImageZ);



function selectImageZ(event) {
    var targetElement = document.getElementById("dicom-image-z");

    // Get the range input value
    var new_image_index = parseInt(event.currentTarget.value, 10);

    // 设定Y轴坐标系和Z轴坐标系的坐标
    coord_z = new_image_index;

    coord_x_x = coord_x;
    coord_x_y = coord_z;
    coord_y_x = coord_x;
    coord_y_y = coord_z;
    
    // update
    cornerstone.draw(document.getElementById("dicom-image-x"));
    cornerstone.draw(document.getElementById("dicom-image-y"));

    // Get the stack data
    var stackToolDataSource = cornerstoneTools.getToolState(targetElement, 'stack');
    if ((typeof stackToolDataSource) === "undefined") {
        console.warn("stack undefined");
        return;
    }
    var stackData = stackToolDataSource.data[0];

    // Switch images, if necessary
    if (new_image_index !== stackData.currentImageIdIndex && stackData.imageIds[new_image_index] !== undefined) {
        // 
        cornerstone.loadAndCacheImage(stackData.imageIds[new_image_index]).then(function(image) {
            var viewport = cornerstone.getViewport(targetElement);
            stackData.currentImageIdIndex = new_image_index;
            cornerstone.displayImage(targetElement, image, viewport);

            cornerstoneTools.addToolState(targetElement, 'stack', stack_z);

            // Enable all tools we want to use with this element
            // cornerstoneTools.stackScroll.activate(targetElement, 1);
            // cornerstoneTools.stackScrollWheel.activate(targetElement);

            cornerstoneTools.scrollIndicator.enable(targetElement);
            cornerstoneTools.wwwc.activate(image_z, 1);
            cornerstoneTools.zoomWheel.activate(image_z);
            cornerstoneTools.pan.activate(image_z, 4);
            /*
            function activate(id) {
                document.querySelectorAll('a').forEach(function(elem) { elem.classList.remove('active'); });
                document.getElementById(id).classList.add('active');
            }
            */
        });
    }
}

// Bind the range slider events
document.getElementById('slice-range-z').addEventListener("input", selectImageZ);

// Enable the dicomImage element and the mouse inputs
cornerstone.enable(image_z);
cornerstoneTools.mouseInput.enable(image_z);
cornerstoneTools.mouseWheelInput.enable(image_z);
cornerstone.loadImage(image_url_z[stack_z.currentImageIdIndex]).then(function(image) {
    // Display the image
    cornerstone.displayImage(image_z, image);
    

    // Set the stack as tool state
    // cornerstoneTools.addStackStateManager(element, ['stack', 'playClip']);
    cornerstoneTools.addToolState(image_z, 'stack', stack_z);

    // Enable all tools we want to use with this element
    //cornerstoneTools.stackScroll.activate(image_z, 1);
    // cornerstoneTools.stackScrollWheel.activate(image_x);

    cornerstoneTools.scrollIndicator.enable(image_z);
    cornerstoneTools.wwwc.activate(image_z, 1);
    cornerstoneTools.zoomWheel.activate(image_z);
    cornerstoneTools.pan.activate(image_z, 4);
    /*
    function activate(id) {
        document.querySelectorAll('a').forEach(function(elem) { elem.classList.remove('active'); });
        document.getElementById(id).classList.add('active');
    }
    */
    
});

function disableAllTools() {
    cornerstoneTools.wwwc.deactivate(image_x, 1);
    cornerstoneTools.wwwc.deactivate(image_y, 1);
    cornerstoneTools.wwwc.deactivate(image_z, 1);

    //cornerstoneTools.pan.deactivate(image_x, 4);
    //cornerstoneTools.pan.deactivate(image_y, 4);
    //cornerstoneTools.pan.deactivate(image_z, 4);

    //cornerstoneTools.zoomWheel.deactivate(image_x);
    //cornerstoneTools.zoomWheel.deactivate(image_y);
    //cornerstoneTools.zoomWheel.deactivate(image_z);

    cornerstoneTools.arrowAnnotate.deactivate(image_x, 1);
    cornerstoneTools.arrowAnnotate.deactivate(image_y, 1);
    cornerstoneTools.arrowAnnotate.deactivate(image_z, 1);

    cornerstoneTools.length.deactivate(image_x, 1);
    cornerstoneTools.length.deactivate(image_y, 1);
    cornerstoneTools.length.deactivate(image_z, 1);

    cornerstoneTools.probe.deactivate(image_x, 1);
    cornerstoneTools.probe.deactivate(image_y, 1);
    cornerstoneTools.probe.deactivate(image_z, 1);

    pizhu_on = false;
    wwwc_on = false;
    probe_on = false;
    length_on = false;
}

/* 实现了批注功能 */
document.getElementById('zs-toolbar-annotation-btn').addEventListener('click', function() {
    disableAllTools();
    // Try commenting this out to see the default behaviour
    // By default, the tool uses Javascript's Prompt function
    // to ask the user for the annotation. This example uses a
    // slightly nicer HTML5 dialog element.
    // cornerstoneTools.arrowAnnotate.setConfiguration(config);

    // Enable all tools we want to use with this element
    cornerstoneTools.arrowAnnotate.activate(image_x, 1);
    cornerstoneTools.arrowAnnotate.activate(image_y, 1);
    cornerstoneTools.arrowAnnotate.activate(image_z, 1);
    
    pizhu_on = true;
    return false;
});

// 对比度按钮
document.getElementById("zs-toolbar-wwwc-btn").addEventListener("click", function() {
    disableAllTools();

    cornerstoneTools.wwwc.activate(image_x, 1);
    cornerstoneTools.wwwc.activate(image_y, 1);
    cornerstoneTools.wwwc.activate(image_z, 1);

    wwwc_on = true;
});



// 长度按钮
document.getElementById("zs-toolbar-length-btn").addEventListener("click", function() {
    disableAllTools();
    
    cornerstoneTools.length.activate(image_x, 1);
    cornerstoneTools.length.activate(image_y, 1);
    cornerstoneTools.length.activate(image_z, 1);

    length_on = true;
});

// 探针按钮
document.getElementById("zs-toolbar-probe-btn").addEventListener("click", function() {
    disableAllTools();

    cornerstoneTools.probe.activate(image_x, 1);
    cornerstoneTools.probe.activate(image_y, 1);
    cornerstoneTools.probe.activate(image_z, 1);

    probe_on = true;
});


document.getElementById("zs-image-box-x").addEventListener("dblclick", function() {
    if (screenfull.enabled)
    {
        screenfull.request(document.getElementById("zs-image-box-x"));

        var image_box_x = document.getElementById("zs-image-box-x");
        image_box_x.style.width = "99%";
        image_box_x.style.height = "99%";

        var dicom_x = document.getElementById("dicom-image-x");
        dicom_x.style.width = "512px";
        dicom_x.style.height = "512px";
        dicom_x.style.left =  ((width - 512) / 2) + "px";
        dicom_x.style.top = ((height - 512) / 2) + "px";

        cornerstone.resize( dicom_x, true);
        cornerstone.loadImage(image_url_x[stack_x.currentImageIdIndex]).then(function(image) {
                // Display the image
                cornerstone.displayImage(dicom_x, image);
            
                // Set the stack as tool state
                // cornerstoneTools.addStackStateManager(element, ['stack', 'playClip']);
                cornerstoneTools.addToolState(dicom_x, 'stack', stack_x);
            
                // Enable all tools we want to use with this element
                // cornerstoneTools.stackScroll.activate(image_x, 1);
                // cornerstoneTools.stackScrollWheel.activate(image_x);
            
                cornerstoneTools.scrollIndicator.enable(dicom_x);
                if  (wwwc_on)
                {
                    cornerstoneTools.wwwc.activate(dicom_x, 1);
                }
                if (pizhu_on)
                {
                    cornerstoneTools.arrowAnnotate.activate(dicom_x, 1);
                }
                if (length_on)
                {
                    cornerstoneTools.length.activate(dicom_x, 1);
                }
                if (probe_on)
                {
                    cornerstoneTools.probe.activate(dicom_x, 1);
                }
                
                cornerstoneTools.zoomWheel.activate(dicom_x);
                cornerstoneTools.pan.activate(dicom_x, 4);
                
                function activate(id) {
                    document.querySelectorAll('a').forEach(function(elem) { elem.classList.remove('active'); });
                    document.getElementById(id).classList.add('active');
                }
            });
                
    }
});

// Y的放大功能 

document.getElementById("zs-image-box-y").addEventListener("dblclick", function() {
    if (screenfull.enabled)
    {
        
        var image_box = document.getElementById("zs-image-box-y");
        screenfull.request(image_box);
        image_box.style.width = "99%";
        image_box.style.height = "99%";
        image_box.style.left = "0px";
        image_box.style.top = "0px";

        

        var dicom = document.getElementById("dicom-image-y");
        dicom.style.width = "512px";
        dicom.style.height = "512px";
        dicom.style.left =  ((width - 512) / 2) + "px";
        dicom.style.top = ((height - 512) / 2) + "px";

        cornerstone.resize(dicom, true);
        cornerstone.loadImage(image_url_y[stack_y.currentImageIdIndex]).then(function(image) {
                // Display the image
                cornerstone.displayImage(dicom, image);
            
                // Set the stack as tool state
                cornerstoneTools.addToolState(dicom, 'stack', stack_y);
            
                // Enable all tools we want to use with this element
                // cornerstoneTools.stackScroll.activate(image_x, 1);
                // cornerstoneTools.stackScrollWheel.activate(image_x);
            
                cornerstoneTools.scrollIndicator.enable(dicom);
                if  (wwwc_on)
                {
                    cornerstoneTools.wwwc.activate(dicom, 1);
                }
                if (pizhu_on)
                {
                    cornerstoneTools.arrowAnnotate.activate(dicom, 1);
                }
                if (length_on)
                {
                    cornerstoneTools.length.activate(dicom, 1);
                }
                if (probe_on)
                {
                    cornerstoneTools.probe.activate(dicom, 1);
                }
                
                cornerstoneTools.zoomWheel.activate(dicom);
                cornerstoneTools.pan.activate(dicom, 4);
                
                function activate(id) {
                    document.querySelectorAll('a').forEach(function(elem) { elem.classList.remove('active'); });
                    document.getElementById(id).classList.add('active');
                }
            });
                
    }
});

// Z 放大

document.getElementById("zs-image-box-z").addEventListener("dblclick", function() {
    if (screenfull.enabled)
    {
        
        var image_box = document.getElementById("zs-image-box-z");
        screenfull.request(image_box);
        
        image_box.style.width = "99%";
        image_box.style.height = "99%";

        image_box.style.left = "0px";
        image_box.style.top = "0px";
        

        var dicom = document.getElementById("dicom-image-z");
        dicom.style.width = "512px";
        dicom.style.height = "512px";
        dicom.style.left =  ((width - 512) / 2) + "px";
        dicom.style.top = ((height - 512) / 2) + "px";

        cornerstone.resize(dicom, true);
        cornerstone.loadImage(image_url_z[stack_z.currentImageIdIndex]).then(function(image) {
                // Display the image
                cornerstone.displayImage(dicom, image);
            
                // Set the stack as tool state
                cornerstoneTools.addToolState(dicom, 'stack', stack_z);
            
                // Enable all tools we want to use with this element
                // cornerstoneTools.stackScroll.activate(image_x, 1);
                // cornerstoneTools.stackScrollWheel.activate(image_x);
            
                cornerstoneTools.scrollIndicator.enable(dicom);
                if  (wwwc_on)
                {
                    cornerstoneTools.wwwc.activate(dicom, 1);
                }
                if (pizhu_on)
                {
                    cornerstoneTools.arrowAnnotate.activate(dicom, 1);
                }
                if (length_on)
                {
                    cornerstoneTools.length.activate(dicom, 1);
                }
                if (probe_on)
                {
                    cornerstoneTools.probe.activate(dicom, 1);
                }
                
                cornerstoneTools.zoomWheel.activate(dicom);
                cornerstoneTools.pan.activate(dicom, 4);
                
                function activate(id) {
                    document.querySelectorAll('a').forEach(function(elem) { elem.classList.remove('active'); });
                    document.getElementById(id).classList.add('active');
                }
            });
                
    }
});


document.getElementById("zs-image-box-3d").addEventListener("dblclick", function() {
    if (screenfull.enabled)
    {
        
        var image_box = document.getElementById("zs-image-box-3d");
        screenfull.request(image_box);
        
        image_box.style.width = "99%";
        image_box.style.height = "99%";

        image_box.style.left = "0px";
        image_box.style.top = "0px";
    }
});





function is_fullscreen_enabled()
{
    if (document.fullscreenEnabled || document.webkitFullscreenEnabled || document.mozFullscreenEnabled)
    {
        console.log("Can Full Screen.");
        return true;
    }
    else
    {
        console.log("Can not Full Screen.");
        return false;
    }
}

function launchFullScreen(element) {  
    if (element.requestFullscreen) {
        console.log("Default Full Screen.");
        //element.requestFullscreen();  
    }
    else if (element.mozRequestFullScreen) {  
        console.log("Moz Full Screen.");
        element.mozRequestFullScreen();  
    }
    else if (element.webkitRequestFullscreen) {  
        console.log("WebKit Full Screen.");
        element.webkitRequestFullscreen();  
    }
    else if(element.msRequestFullscreen) {  
        console.log("Ms Full Screen.");
        element.msRequestFullscreen();  
    }  
  }  
    

  /*
var image_box_x = document.getElementById("zs-image-box-x");
// 全凭
image_box_x.ondblclick = function() {
    var flag = is_fullscreen_enabled();
    launchFullScreen(image_box_x);
                image_box_x.style.width = width + "px";
                image_box_x.style.height = height + "px";
            
                var zs_image_x = document.getElementById("dicom-image-x");
                var zs_image_y = document.getElementById("dicom-image-y");
                var zs_image_z = document.getElementById("dicom-image-z");
            
                zs_image_x.style.width = "512px";
                zs_image_x.style.height = "512px";
                zs_image_x.style.left = "50px";
                zs_image_x.style.top = "50px";
            
                //cornerstone.resize(zs_mage_x, true);

};
*/
