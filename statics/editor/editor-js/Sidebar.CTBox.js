/**
 * @author yunchunnan
 */

 /* CornerstoneWebImageLoader 配置开始 */
cornerstoneWebImageLoader.external.cornerstone = cornerstone;
    
cornerstoneWebImageLoader.configure({
    beforeSend: function(xhr) {
        // Add custom headers here (e.g. auth tokens)
        //xhr.setRequestHeader('x-auth-token', 'my auth token');
    }
});

/* CornerstoneWebImageLoader 配置结束 */

/* 定义三个数组 */
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


function init_x_image_url_list() {
    const host_name = window.location.origin;
    const folder_name = "/static/img/hipdicom/x/slice_";
    const file_name_ex = ".png";

    for (i = 0; i < NUM_X; i++) {
        image_url_x[i] = host_name + folder_name + i + file_name_ex;
    }

    var slider = document.getElementById('slice-range-x');
    slider.step = 1;
    slider.min = 1;
    slider.max = NUM_X;
}

function init_y_image_url_list() {
    const host_name = window.location.origin;
    const folder_name = "/static/img/hipdicom/y/slice_";
    const file_name_ex = ".png";

    for (i = 0; i < NUM_Y; i++) {
        image_url_y[i] = host_name + folder_name + i + file_name_ex;
    }
    var slider = document.getElementById('slice-range-y');
    slider.step = 1;
    slider.min = 1;
    slider.max = NUM_Y;
}

function init_z_image_url_list() {
    const host_name = window.location.origin;
    const folder_name = "/static/img/hipdicom/z/slice_";
    const file_name_ex = ".png";

    for (i = 0; i < NUM_Z; i++) {
        image_url_z[i] = host_name + folder_name + i + file_name_ex;
    }
    var slider = document.getElementById('slice-range-z');
    slider.step = 1;
    slider.min = 1;
    slider.max = NUM_Z;
}

// 初始化数组

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
    //document.getElementById('zoom-text-x').textContent = "Zoom: " + viewport.scale.toFixed(2);

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
    var new_image_index = parseInt(event.currentTarget.value, 10);

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

            cornerstoneTools.wwwc.activate(image_x, 1);
            //cornerstoneTools.zoomWheel.activate(image_x);
            cornerstoneTools.pan.activate(image_x, 4);
            
        });
    }
}

// Bind the range slider events
var slice_range_x = document.getElementById('slice-range-x');
slice_range_x.addEventListener("input", selectImageX);



// Enable the dicomImage element and the mouse inputs
cornerstone.enable(image_x);
cornerstoneTools.mouseInput.enable(image_x);
cornerstoneTools.mouseWheelInput.enable(image_x);
cornerstone.loadImage(image_url_x[stack_x.currentImageIdIndex]).then(function(image) {
    // Display the image
    cornerstone.displayImage(image_x, image);

    // Set the stack as tool state
    cornerstoneTools.addToolState(image_x, 'stack', stack_x);

    // Enable all tools we want to use with this element
    cornerstoneTools.scrollIndicator.enable(image_x);

    cornerstoneTools.wwwc.activate(image_x, 1);
    // cornerstoneTools.zoomWheel.activate(image_x);
    cornerstoneTools.pan.activate(image_x, 4);

});

/* 定义 Y 和 Z */

const image_y = document.getElementById('dicom-image-y');

/*该函数似乎是在图像显示之后*/
function onImageRenderedY(e) {
    var eventData = e.detail;
    var viewport = eventData.viewport;
    //document.getElementById('zoom-text-y').textContent = "Zoom: " + viewport.scale.toFixed(2);

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

            cornerstoneTools.scrollIndicator.enable(targetElement);

            cornerstoneTools.wwwc.activate(image_y, 1);
            // cornerstoneTools.zoomWheel.activate(image_y);
            cornerstoneTools.pan.activate(image_y, 4);

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

    
    cornerstoneTools.scrollIndicator.enable(image_y);

    cornerstoneTools.wwwc.activate(image_y, 1);
    //cornerstoneTools.zoomWheel.activate(image_y);
    cornerstoneTools.pan.activate(image_y, 4);

});





/* image-y over */

const image_z = document.getElementById('dicom-image-z');


/*该函数似乎是在图像显示之后*/
function onImageRenderedZ(e) {
    var eventData = e.detail;
    var viewport = eventData.viewport;
    //document.getElementById('mr-bottom-left').textContent = "WW/WC: " + Math.round(viewport.voi.windowWidth) + "/" + Math.round(viewport.voi.windowCenter);
    //document.getElementById('zoom-text-z').textContent = "Zoom: " + viewport.scale.toFixed(2);

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

            cornerstoneTools.scrollIndicator.enable(targetElement);
            cornerstoneTools.wwwc.activate(image_z, 1);
            // cornerstoneTools.zoomWheel.activate(image_z);
            cornerstoneTools.pan.activate(image_z, 4);
            
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
    cornerstoneTools.addToolState(image_z, 'stack', stack_z);

    cornerstoneTools.scrollIndicator.enable(image_z);
    cornerstoneTools.wwwc.activate(image_z, 1);
    // cornerstoneTools.zoomWheel.activate(image_z);
    cornerstoneTools.pan.activate(image_z, 4);
    
});
