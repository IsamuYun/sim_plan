import numpy as np

import methods.generate.trimesh as trimesh

def generate_model(A, B, C, D, alpha): 
    beta = (180.0 - alpha)*np.pi/180.0
    x1 = 0
    z1 = 0
    x0 = x1 + D*np.sin(beta)
    z0 = z1 - D*np.cos(beta)
    L1 = 30
    L2 = 20
    nsteps = 0
    num_pts = 30 
    steps = 21
    y_scale = 12
    scales_y_stem = np.empty(steps)
    scales_y_stem.fill(y_scale)
    scale_y_max = y_scale
    scale_y_min = 6
    scales_y_taper = np.linspace(scale_y_min,scale_y_max,steps)
    scales_y_stem[0:steps] = scales_y_taper
    
    nsteps = 0
    vertices, surface_Pts, centerpts, angles, scales_x = trimesh.creation.hip_implant_vertices_input_two_curves('rectangle_angle', A-5, B, C, D, alpha, x0, z0,scales_y_stem, L1, L2)
    
    vertices_b, surface_Pts_b = trimesh.creation.hip_implant_tip('rectangle_angle',scales_x[0],scales_y_stem[0],5,4,'circle')
    hip_stem_with_tip = []
    rotate_axis =  [0,-1,0]
    for j in range(0,len(vertices_b)):
        vertices_transformed = np.dot(trimesh.creation.rotation_matrix(rotate_axis,angles[0]), vertices_b[j])+centerpts[0]
        hip_stem_with_tip = np.append(hip_stem_with_tip,vertices_transformed)
    
    surface_Pts_b_t = np.dot(trimesh.creation.rotation_matrix(rotate_axis,angles[0]), surface_Pts_b[0])+centerpts[0]
    nsteps  += np.int(len(vertices_b)/num_pts)
    newVerts = vertices[num_pts:-num_pts]
    hip_stem_with_tip = np.append(hip_stem_with_tip,newVerts)
    nsteps  += np.int(len(newVerts)/num_pts)
    
    hip_vertices2 = []
    hip_surface_pts2 = []
    d1 = 2
    d2 = 7
    d3 = 6
    input_parameters = []
    input_parameters = np.append(input_parameters,['circle',d1+d2,d1+d2+d3,12,12,12,12,None])
    input_parameters = np.append(input_parameters,['circle',d1+d2+d3,D,14,14,14,14,None])
    input_parameters = np.array(input_parameters).reshape((-1, 8))
    num_sections = len(input_parameters)
    sample_step = 6
    dist1 = (C - D*np.cos(beta))/np.sin(beta)
    dist2 = (B - D*np.sin(beta))/np.cos(beta)
    
    px1 = -input_parameters[0][3]*0.5  
    pz1 = d1 + d2
    px2 = px1
    pz2 = d1
    px3 = -dist1
    pz3 = d1
    px4 = -dist1 
    pz4 = 0   
    ctrl_pts1 = []
    ctrl_pts1 = np.append(ctrl_pts1,[px1, pz1, px2, pz2, px3, pz3,px4,pz4]).reshape(-1,2)
    
    px1_r = input_parameters[0][3]*0.5
    pz1_r = d1 + d2
    px2_r = px1_r
    pz2_r = d1
    px3_r = dist2
    pz3_r = d1
    px4_r = dist2
    pz4_r = 0  
    ctrl_pts2 = []
    ctrl_pts2 = np.append(ctrl_pts2,[px1_r, pz1_r, px2_r, pz2_r, px3_r, pz3_r,px4_r,pz4_r]).reshape(-1,2)
    scales_y = np.linspace(scales_y_stem[-1],input_parameters[0][5],sample_step).reshape((-1, 1))   
    vertices, surface_Pts = trimesh.creation.hip_implant_two_splines('circle', ctrl_pts1, ctrl_pts2, scales_y, sample_step, 'rectangle_angle')
    hip_vertices2 = np.append(hip_vertices2,vertices)
    nsteps += len(vertices)/num_pts
    
    point =  [0,0,0]
    slope = np.inf
    
    for i in range(0,num_sections): 
        ntype = input_parameters[i][0]
        zmin = np.float(input_parameters[i][1])
        zmax = np.float(input_parameters[i][2])
        scale_x_min = np.float(input_parameters[i][3])
        scale_x_max = np.float(input_parameters[i][4])
        scale_y_min = np.float(input_parameters[i][5])
        scale_y_max = np.float(input_parameters[i][6])
        ntype_bottom = input_parameters[i][7]
        step = 2
        scales_x = np.linspace(scale_x_min,scale_x_max,step)
        scales_x = np.array(scales_x, dtype=np.float64).reshape((-1, 1))
        scales_y = np.linspace(scale_y_min,scale_y_max,step)
        scales_y = np.array(scales_y, dtype=np.float64).reshape((-1, 1)) 
        vertices, surface_Pts = trimesh.creation.hip_implant_vertices_circle(ntype,zmin,zmax,scales_x,scales_x,scales_y,scales_y, slope, point, ntype_bottom) 
    
        if i == 0:
            vertices = vertices[num_pts:]        
        elif i == 1: 
            hip_surface_pts2 = np.append(hip_surface_pts2,surface_Pts[1])
    
        nsteps += len(vertices)/num_pts
        hip_vertices2 = np.append(hip_vertices2,vertices)
    
    hip_vertices2_t = []
    hip_surface_pts2_t = []
    center = np.array([x0,0,z0])
    hip_vertices2 = hip_vertices2.reshape(-1,3)
    hip_surface_pts2 = hip_surface_pts2.reshape(-1,3)
    for j in range(0,len(hip_vertices2)):
        vertices_transformed = np.dot(trimesh.creation.rotation_matrix(rotate_axis,angles[-1]), hip_vertices2[j])+center
        hip_vertices2_t = np.append(hip_vertices2_t,vertices_transformed)
    
    for j in range(0,len(hip_surface_pts2)):
        vertices_transformed = np.dot(trimesh.creation.rotation_matrix(rotate_axis,angles[-1]), hip_surface_pts2[j])+center
        hip_surface_pts2_t = np.append(hip_surface_pts2_t,vertices_transformed)
    
    hip_stem_with_tip = np.append(hip_stem_with_tip,hip_vertices2_t)
    hip_stem_with_tip = np.append(hip_stem_with_tip,surface_Pts_b_t)
    hip_stem_with_tip = np.append(hip_stem_with_tip,hip_surface_pts2_t)
    nsteps = np.int(nsteps)
    mesh_body = trimesh.creation.generate_hip_implant(nsteps, num_pts, hip_stem_with_tip)
    return mesh_body

# Example to generate a hip implant model
A = 107
B = 36
C = 30
D = 32
alpha = 130.0
mesh = generate_model(A, B, C, D, alpha)
mesh.export('test.stl')
    



