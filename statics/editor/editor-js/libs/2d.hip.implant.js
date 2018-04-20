function get_bottom_curve (A, B, C, D, alpha, x0, z0, L1, L2)
{
    var beta = (180 - alpha) * Math.PI / 180.0;
	var pz1, px1, px2, pz2, px3, pz3;

	px1 = x0 - (C - D * Math.cos(beta)) / Math.tan(beta);
	pz1 = z0 - C +  D*Math.cos(beta);
	px2 = px1 + L1 * Math.cos((alpha - 90.0) * Math.PI / 180.0);
	pz2 = pz1 - L1 * Math.sin((alpha - 90.0) * Math.PI / 180.0);
	px3 = px2;
	pz3 = pz1 - A;

	var qx1, qz1, qx2, qz2, qx3, qz3;

	qx1 = x0 + B - D * Math.sin(beta);
	qz1 = z0 + (B - D * Math.sin(beta)) * Math.tan(beta);
	qx2 = qx1 + L2 * Math.cos((alpha - 90.0) * Math.PI / 180.0);
	qz2 = qz1 - L2 * Math.sin((alpha-90.0)*Math.PI/180.0);
	qx3 = px3 + 8;
	qz3 = pz3;

	return [px1, pz1, px2, pz2,px3,pz3,qx1,qz1,qx2,qz2,qx3,qz3];
}

	function generate_2d_model (A, B, C, D, alpha)
	{
		var beta = (180.0 - alpha) * Math.PI / 180.0;
		var x1 = 0;
		var z1 = 0;
		var offset_x = 80; // adjust position of drawing on canvas
		var offset_z = -50;	// adjust position of drawing on canvas
		var x0 = x1 + D * Math.sin(beta);
		var z0 = z1 - D * Math.cos(beta);
        x0 += offset_x;
        z0 += offset_z;

		var L1 = 30;
		var L2 = 20;

		var d1 = 9;
		var d2 = 6;

		var dist1 = (C - D * Math.cos(beta)) / Math.sin(beta);
		var dist2 = (B - D * Math.sin(beta)) / Math.cos(beta);

		var diameter_1 = 12;
		var diameter_2 = 14;

		var px1 = -dist1;
		var pz1 = 0;
		var px2 = (-0.5)*diameter_1;
		var pz2 = 0;		
		var px3 = (-0.5)*diameter_1;
		var pz3 = d1;


		var px1_r = diameter_1 * 0.5;
		var pz1_r = d1;
		var px2_r = px1_r;
		var pz2_r = 0;
		var px3_r = dist2;
		var pz3_r = 0;
        
        var ref_pts = []; // for plotting
        ref_pts.push([0, D], [px3_r + 5,D], [px3_r + 5,0]);
		var coords = [];
		coords.push([px1, pz1], [px2, pz2], [px3, pz3])
		coords.push([-diameter_1*0.5, d1+d2], [-diameter_2*0.5, d1+d2], [-diameter_2*0.5, D],[diameter_2*0.5, D], [diameter_2*0.5, d1+d2], [diameter_1*0.5, d1+d2])	
		coords.push([px1_r, pz1_r], [px2_r, pz2_r], [px3_r, pz3_r])

		var rotation = [ [Math.cos(beta), Math.sin(beta)], [-Math.sin(beta), Math.cos(beta)] ];
        
		var transormed_coords = math.multiply(coords, rotation);
		var len = transormed_coords.length;
		for(var i =0; i< len; i++){
			transormed_coords[i][0] += x0;
			transormed_coords[i][1] = -(transormed_coords[i][1] + z0);
		}
        var ref_trans_pts = math.multiply(ref_pts,rotation);
		for(var i = 0; i< ref_trans_pts.length;i++){
            ref_trans_pts[i][0] += x0;
            ref_trans_pts[i][1] = -(ref_trans_pts[i][1] + z0);
		}

		// plot top portion
		var c = document.getElementById("myCanvas");
        var ctx = c.getContext("2d");
        ctx.save();
        ctx.scale(1.5, 1.5); // scale of drawing
        ctx.restore();

		ctx.beginPath();
		ctx.moveTo(transormed_coords[0][0], transormed_coords[0][1]);
		ctx.quadraticCurveTo(transormed_coords[1][0], transormed_coords[1][1], transormed_coords[2][0], transormed_coords[2][1]);
		for(var i=3;i<len-2;i++){
			ctx.lineTo(transormed_coords[i][0],transormed_coords[i][1]);
		}
		ctx.quadraticCurveTo(transormed_coords[len-2][0], transormed_coords[len-2][1], transormed_coords[len-1][0], transormed_coords[len-1][1]);  

		// plot bottom portion
		var vals = get_bottom_curve(A, B, C, D, alpha, x0, z0, L1, L2);
		ctx.moveTo(vals[0], -vals[1]);
        ctx.quadraticCurveTo(vals[2], -vals[3], vals[4], -vals[5]);
		ctx.moveTo(vals[6], -vals[7]);
        ctx.quadraticCurveTo(vals[8], -vals[9], vals[10], -vals[11]);
        var tip = 4;
        ctx.bezierCurveTo(vals[10], -vals[11]+tip, vals[4], -vals[5]+tip, vals[4], -vals[5]);

		ctx.stroke();


		// plot draft dimension
		ctx.setLineDash([3, 3]);
		ctx.strokeStyle = 'gray';
		ctx.font = "12px Georgia";

		var offset = 30;
		var offset_font = 10;
		ctx.beginPath();
        ctx.moveTo(vals[0], -vals[1]);
        ctx.lineTo(vals[0] - offset, -vals[1]);
        ctx.moveTo(vals[0] - offset + 5, -vals[1]);
        ctx.lineTo(vals[0] - offset + 5, -vals[5]+tip);       
        ctx.moveTo(vals[0] - offset, -vals[5]+tip);
        ctx.lineTo((vals[4]+vals[10])/2, -vals[5]+tip); 
        ctx.stroke();
		ctx.fillText("A", vals[0] - offset-offset_font, -(vals[1]+vals[5])/2);

		ctx.beginPath();
        ctx.moveTo(transormed_coords[5][0], transormed_coords[5][1]);
        ctx.lineTo(vals[0] - offset, transormed_coords[5][1]);
        ctx.moveTo(vals[0] - offset + 5, transormed_coords[5][1]);
        ctx.lineTo(vals[0] - offset + 5, -vals[1]);       
        ctx.stroke();
		ctx.fillText("C", vals[0] - offset-10, (-vals[1]+transormed_coords[5][1])/2 + 3);

		ctx.beginPath();
        ctx.moveTo(transormed_coords[len-1][0], transormed_coords[len-1][1]);
        ctx.lineTo(transormed_coords[len-1][0], ref_trans_pts[1][1] - 10);
        ctx.moveTo(ref_trans_pts[0][0], ref_trans_pts[0][1]);
        ctx.lineTo(ref_trans_pts[0][0], ref_trans_pts[1][1] - 10);   
        ctx.moveTo(ref_trans_pts[0][0], ref_trans_pts[1][1]-5);
        ctx.lineTo(transormed_coords[len-1][0], ref_trans_pts[1][1]-5); 
        ctx.stroke();
		ctx.fillText("B", (ref_trans_pts[0][0] + transormed_coords[len-1][0])/2 , ref_trans_pts[1][1]-10);

		ctx.beginPath();
        ctx.moveTo(transormed_coords[len-1][0], transormed_coords[len-1][1]);
        ctx.lineTo(ref_trans_pts[2][0], ref_trans_pts[2][1]);
        ctx.lineTo(ref_trans_pts[1][0], ref_trans_pts[1][1]);   
        ctx.lineTo(transormed_coords[6][0], transormed_coords[6][1]); 
        ctx.stroke();
		ctx.fillText("D", ref_trans_pts[2][0] - 10, (ref_trans_pts[2][1] + ref_trans_pts[1][1])/2);

		ctx.beginPath();
        ctx.moveTo(ref_trans_pts[0][0], ref_trans_pts[0][1]);
        ctx.lineTo(x0, -z0);
        ctx.lineTo(x0, -z0 + 30);   
        ctx.stroke();
		ctx.fillText("alpha", x0 + 5, -z0+5);

		return 1;

	}
