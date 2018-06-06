/**
 * @author Isamu 20180605
 */

 // 封装一个坐标系3D Gizmo

 var Gizmo = function(editor) {
    
    var x_arrow;
    var y_arrow; 
    var z_arrow;

    var x_line; 
    var y_line; 
    var z_line; 

    var origin_point;

    var box;
    
    var color_red = 0xFB442C;
    var color_blue = 0x166ED3;
    var color_green = 0x35B71E;
    var color_orange= 0xFF8000;

    this.init = function () {
        var arrow_geometry = new THREE.CylinderGeometry(0, 5, 12, 16, 1, false);
        
        var camera_position = editor.gizmo_camera.position.clone();
        var base_point = new THREE.Vector3(camera_position.x - 20, camera_position.y - 20, camera_position.z - 100);
       
        var material = new THREE.MeshBasicMaterial({color: color_red});
        x_arrow = new THREE.Mesh(arrow_geometry, material);
        x_arrow.name = "X-Arrow";
        x_arrow.position.set(base_point.x + 40, base_point.y, base_point.z);
        x_arrow.rotation.set(0, 0, -Math.PI / 2);
        x_arrow.scale.set(1, 1, 1);
        editor.execute(new AddObjectCommand(x_arrow));
        
        var x_line_geometry = new THREE.Geometry();
        x_line_geometry.vertices.push(
            new THREE.Vector3(base_point.x + 40, base_point.y, base_point.z),
            new THREE.Vector3(base_point.x, base_point.y, base_point.z),
        );
        var x_line_material = new THREE.LineBasicMaterial({color: color_red});
        x_line = new THREE.Line(x_line_geometry, x_line_material);
        x_line.name = "X-Line";
        editor.execute(new AddObjectCommand(x_line));

        var y_material = new THREE.MeshBasicMaterial({color: color_blue});
        y_arrow = new THREE.Mesh(arrow_geometry, y_material);
        y_arrow.name = "Y-Arrow";
        y_arrow.position.set(base_point.x, base_point.y + 40, base_point.z);
        y_arrow.scale.set(1, 1, 1);
        editor.execute(new AddObjectCommand(y_arrow));

        var y_line_geometry = new THREE.Geometry();
        y_line_geometry.vertices.push(
            new THREE.Vector3(base_point.x, base_point.y, base_point.z),
            new THREE.Vector3(base_point.x, base_point.y + 40, base_point.z),
        );
        var y_line_material = new THREE.LineBasicMaterial({color: color_blue});
        y_line = new THREE.Line(y_line_geometry, y_line_material);
        y_line.name = "Y-Line";
        editor.execute(new AddObjectCommand(y_line));

        var z_material = new THREE.MeshBasicMaterial({color: color_green});
        z_arrow = new THREE.Mesh(arrow_geometry, z_material);
        z_arrow.name = "Z-Arrow";
        z_arrow.position.set(base_point.x, base_point.y, base_point.z - 40);
        z_arrow.scale.set(1, 1, 1);
        z_arrow.rotation.set(-Math.PI / 2, 0, 0);
        editor.execute(new AddObjectCommand(z_arrow));

        var z_line_geometry = new THREE.Geometry();
        z_line_geometry.vertices.push(
            new THREE.Vector3(base_point.x, base_point.y, base_point.z),
            new THREE.Vector3(base_point.x, base_point.y, base_point.z - 40),
        );
        var z_line_material = new THREE.LineBasicMaterial({color: color_green});
        z_line = new THREE.Line(z_line_geometry, z_line_material);
        z_line.name = "Z-Line";
        editor.execute(new AddObjectCommand(z_line));

        var box_geometry = new THREE.BoxBufferGeometry(5, 5, 5);
        var box_material = new THREE.MeshBasicMaterial({color: color_orange});
        box = new THREE.Mesh(box_geometry, box_material);
        box.name = "Box";
        box.position.set(base_point.x, base_point.y, base_point.z);
        box.scale.set(1, 1, 1);
        editor.execute(new AddObjectCommand(box));
    };

    this.update = function() {
        
    };
 };