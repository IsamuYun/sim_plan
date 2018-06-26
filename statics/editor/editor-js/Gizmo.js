/**
 * @author Isamu 20180605
 */

 // 封装一个坐标系3D Gizmo

 function createLabel(text, x, y, z, size, color, backgroundColor, backgroundMargin) {
	if (!backgroundMargin) {
		backgroundMargin = 50;
	}
	var canvas = document.createElement("canvas");
	var context = canvas.getContext("2d");
	context.font = size + "pt Arial";

	var textWidth = context.measureText(text).width;
	canvas.width = textWidth + backgroundMargin;
	canvas.height = size + backgroundMargin;
	context = canvas.getContext("2d");
	context.font = size + "pt Arial";

	if (backgroundColor) {
		context.fillStyle = backgroundColor;
		context.fillRect(canvas.width / 2 - textWidth / 2 - backgroundMargin / 2, 
								  canvas.height / 2 - size / 2 - backgroundMargin / 2,
								  textWidth + backgroundMargin, size + backgroundMargin);
	}
	context.textAlign = "center";
	context.textBaseline = "middle";
	context.fillStyle = color;
	context.fillText(text, canvas.width / 2, canvas.height / 2);

	// context.strokeStyle = "black";
	// context.strokeRect(0, 0, canvas.width, canvas.height);

	var texture = new THREE.Texture(canvas);
	texture.needsUpdate = true;

	var material = new THREE.SpriteMaterial( { map: texture, useScreenCoordinates: false } );
	var sprite = new THREE.Sprite( spriteMaterial );
    sprite.scale.set(0.5 * size, 0.25 * size, 0.75 * size);
	// mesh.overdraw = true;
	//mesh.doubleSided = true;
	sprite.position.x = x - canvas.width;
	sprite.position.y = y - canvas.height;
	sprite.position.z = z;

	return sprite;
}


 var Gizmo = function(editor) {
    
    this.axesHelper = new THREE.AxesHelper( 15 );

    this.gizmo_x = createLabel("X", 70, 12, 9920, 12, "#FF0000", "#E6E6E6", 12);
		
		this.gizmo_y = createLabel("Y", 30, 70, 9920, 12, "#00FF00", "#E6E6E6", 12);
		
		this.gizmo_z = createLabel("Z", 30, 30, 9920, 12, "#00000FF", "#E6E6E6", 12);
    
    this.init = function () {
      this.axesHelper.position.set(0, 0, 10000);
      console.log(this.axesHelper);
      editor.scene.add( this.axesHelper );

      editor.scene.add( this.gizmo_x );
      editor.scene.add( this.gizmo_y );
      editor.scene.add( this.gizmo_z );

    };

    this.update = function() {
        var tempMatrix = new THREE.Matrix4();
        var worldRotation = new THREE.Euler( 0, 0, 0 );
        worldRotation.setFromRotationMatrix(tempMatrix.getInverse(tempMatrix.extractRotation(editor.camera.matrixWorld)));
        this.axesHelper.quaternion.setFromEuler( worldRotation );

        this.gizmo_x.quaternion.setFromEuler( worldRotation );
        this.gizmo_y.quaternion.setFromEuler( worldRotation );
        this.gizmo_z.quaternion.setFromEuler( worldRotation );

    };
 };