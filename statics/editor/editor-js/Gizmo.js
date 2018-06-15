/**
 * @author Isamu 20180605
 */

 // 封装一个坐标系3D Gizmo

 var Gizmo = function(editor) {
    
    this.axesHelper = new THREE.AxesHelper( 15 );
    this.init = function () {
        
        
		this.axesHelper.position.set(-5, -5, 10000);
		editor.scene.add( this.axesHelper );

    };

    this.update = function() {
        var tempMatrix = new THREE.Matrix4();
        var worldRotation = new THREE.Euler( 0, 0, 0 );
        worldRotation.setFromRotationMatrix(tempMatrix.getInverse(tempMatrix.extractRotation(editor.camera.matrixWorld)));
        this.axesHelper.quaternion.setFromEuler( worldRotation );

    };
 };