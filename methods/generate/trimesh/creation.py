'''
Create meshes from primitives, or with operations.
'''

from .base import Trimesh
from .constants import log, tol
from .triangles import normals
from .geometry import faces_to_edges
from .grouping import group_rows, unique_rows

from . import util

import numpy as np
import math

from collections import deque
from scipy.misc import comb

try:
    from shapely.geometry import Polygon
    from shapely.geometry.polygon import LinearRing
    from shapely.geometry import LineString
    from shapely.wkb import loads as load_wkb
except ImportError:
    log.warning('shapely.geometry.Polygon not available!')


def validate_polygon(obj):
    if util.is_instance_named(obj, 'Polygon'):
        polygon = obj
    elif util.is_shape(obj, (-1, 2)):
        polygon = Polygon(obj)
    elif util.is_string(obj):
        polygon = load_wkb(obj)
    else:
        raise ValueError('Input not a polygon!')

    if (not polygon.is_valid or
            polygon.area < tol.zero):
        raise ValueError('Polygon is zero- area or invalid!')
    return polygon


def extrude_polygon(polygon,
                    height,
                    **kwargs):
    '''
    Extrude a 2D shapely polygon into a 3D mesh

    Parameters
    ----------
    polygon: shapely.geometry.Polygon object
    height:  float, distance to extrude polygon along Z

    Returns
    ----------
    mesh: Trimesh object of result
    '''
    vertices, faces = triangulate_polygon(polygon, **kwargs)
    mesh = extrude_triangulation(vertices=vertices,
                                 faces=faces,
                                 height=height,
                                 **kwargs)
    return mesh


def extrude_triangulation(vertices,
                          faces,
                          height,
                          **kwargs):
    '''
    Turn a shapely.geometry Polygon object and a height (float)
    into a watertight Trimesh object.

    Parameters
    ----------
    vertices: (n,2) float, 2D vertices
    faces:    (m,3) int,   triangle indexes of vertices
    height:   float, distance to extrude triangulation 

    Returns
    ---------
    mesh: Trimesh object of result
    '''
    vertices = np.asanyarray(vertices, dtype=np.float64)
    faces = np.asanyarray(faces, dtype=np.int)
    height = float(height)

    if not util.is_shape(vertices, (-1, 2)):
        raise ValueError('Vertices must be (n,3)')
    if not util.is_shape(faces, (-1, 3)):
        raise ValueError('Faces must be (n,3)')
    if np.abs(height) < tol.zero:
        raise ValueError('Height must be nonzero!')

    # make sure triangulation winding is pointing up
    normal_test = normals(
        [util.three_dimensionalize(vertices[faces[0]])[1]])[0]

    # make sure the triangulation is aligned with the sign of
    # the height we've been passed
    if np.dot(normal_test,
              [0, 0, np.sign(height)]) < 0:
        faces = np.fliplr(faces)

    # stack the (n,3) faces into (3*n, 2) edges
    edges = faces_to_edges(faces)
    edges_sorted = np.sort(edges, axis=1)
    # edges which only occur once are on the boundary of the polygon
    # since the triangulation may have subdivided the boundary of the
    # shapely polygon, we need to find it again
    edges_unique = group_rows(edges_sorted, require_count=1)

    # (n, 2, 2) set of line segments (positions, not references)
    boundary = vertices[edges[edges_unique]]

    # we are creating two vertical  triangles for every 2D line segment
    # on the boundary of the 2D triangulation
    vertical = np.tile(boundary.reshape((-1, 2)), 2).reshape((-1, 2))
    vertical = np.column_stack((vertical,
                                np.tile([0, height, 0, height],
                                        len(boundary))))
    vertical_faces = np.tile([3, 1, 2, 2, 1, 0],
                             (len(boundary), 1))
    vertical_faces += np.arange(len(boundary)).reshape((-1, 1)) * 4
    vertical_faces = vertical_faces.reshape((-1, 3))

    # stack the (n,2) vertices with zeros to make them (n, 3)
    vertices_3D = util.three_dimensionalize(vertices, return_2D=False)

    # a sequence of zero- indexed faces, which will then be appended
    # with offsets to create the final mesh
    faces_seq = [faces[:, ::-1],
                 faces.copy(),
                 vertical_faces]
    vertices_seq = [vertices_3D,
                    vertices_3D.copy() + [0.0, 0, height],
                    vertical]

    mesh = Trimesh(*util.append_faces(vertices_seq,
                                      faces_seq),
                   process=True)
    return mesh


def triangulate_polygon(polygon, **kwargs):
    '''
    Given a shapely polygon, create a triangulation using meshpy.triangle

    Parameters
    ---------
    polygon: Shapely.geometry.Polygon
    kwargs: passed directly to meshpy.triangle.build:
            triangle.build(mesh_info,
                           verbose=False,
                           refinement_func=None,
                           attributes=False,
                           volume_constraints=True,
                           max_volume=None,
                           allow_boundary_steiner=True,
                           allow_volume_steiner=True,
                           quality_meshing=True,
                           generate_edges=None,
                           generate_faces=False,
                           min_angle=None)
    Returns
    --------
    mesh_vertices: (n, 2) float array of 2D points
    mesh_faces:    (n, 3) int array of vertex indicies representing triangles
    '''
    if not polygon.is_valid:
        raise ValueError('invalid shapely polygon passed!')

    # do the import here, as sometimes this import can segfault python
    # which is not catchable with a try/except block
    import meshpy.triangle as triangle

    def round_trip(start, length):
        '''
        Given a start index and length, create a series of (n, 2) edges which
        create a closed traversal.

        Example:
        start, length = 0, 3
        returns:  [(0,1), (1,2), (2,0)]
        '''
        tiled = np.tile(np.arange(start, start + length).reshape((-1, 1)), 2)
        tiled = tiled.reshape(-1)[1:-1].reshape((-1, 2))
        tiled = np.vstack((tiled, [tiled[-1][-1], tiled[0][0]]))
        return tiled

    def add_boundary(boundary, start):
        # coords is an (n, 2) ordered list of points on the polygon boundary
        # the first and last points are the same, and there are no
        # guarentees on points not being duplicated (which will
        # later cause meshpy/triangle to shit a brick)
        coords = np.array(boundary.coords)
        # find indices points which occur only once, and sort them
        # to maintain order
        unique = np.sort(unique_rows(coords)[0])
        cleaned = coords[unique]

        vertices.append(cleaned)
        facets.append(round_trip(start, len(cleaned)))

        # holes require points inside the region of the hole, which we find
        # by creating a polygon from the cleaned boundary region, and then
        # using a representative point. You could do things like take the mean of
        # the points, but this is more robust (to things like concavity), if
        # slower.
        test = Polygon(cleaned)
        holes.append(np.array(test.representative_point().coords)[0])

        return len(cleaned)

    # sequence of (n,2) points in space
    vertices = deque()
    # sequence of (n,2) indices of vertices
    facets = deque()
    # list of (2) vertices in interior of hole regions
    holes = deque()

    start = add_boundary(polygon.exterior, 0)
    for interior in polygon.interiors:
        try:
            start += add_boundary(interior, start)
        except:
            log.warn('invalid interior, continuing')
            continue

    # create clean (n,2) float array of vertices
    # and (m, 2) int array of facets
    # by stacking the sequence of (p,2) arrays
    vertices = np.vstack(vertices)
    facets = np.vstack(facets).tolist()

    # holes in meshpy lingo are a (h, 2) list of (x,y) points
    # which are inside the region of the hole
    # we added a hole for the exterior, which we slice away here
    holes = np.array(holes)[1:]

    # call meshpy.triangle on our cleaned representation of the Shapely polygon
    info = triangle.MeshInfo()
    info.set_points(vertices)
    info.set_facets(facets)
    info.set_holes(holes)

    # uses kwargs
    mesh = triangle.build(info, **kwargs)

    mesh_vertices = np.array(mesh.points)
    mesh_faces = np.array(mesh.elements)

    return mesh_vertices, mesh_faces


def box(extents=None, transform=None):
    '''
    Return a unit cube, centered at the origin with edges of length 1.0
    '''
    vertices = [0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 1,
                1, 1, 0, 0, 1, 0, 1, 1, 1, 0, 1, 1, 1]
    vertices = np.array(vertices, dtype=np.float64).reshape((-1, 3))
    vertices -= 0.5

    if extents is not None:
        extents = np.asanyarray(extents, dtype=np.float64)
        if extents.shape != (3,):
            raise ValueError('Extents must be (3,)!')
        vertices *= extents

    faces = [1, 3, 0, 4, 1, 0, 0, 3, 2, 2, 4, 0, 1, 7, 3, 5, 1, 4,
             5, 7, 1, 3, 7, 2, 6, 4, 2, 2, 7, 6, 6, 5, 4, 7, 5, 6]
    faces = np.array(faces, dtype=np.int64).reshape((-1, 3))

    face_normals = [-1, 0, 0, 0, -1, 0, -1, 0, 0, 0, 0, -1, 0, 0, 1, 0, -1,
                    0, 0, 0, 1, 0, 1, 0, 0, 0, -1, 0, 1, 0, 1, 0, 0, 1, 0, 0]
    face_normals = np.array(face_normals, dtype=np.float64).reshape(-1, 3)

    box = Trimesh(vertices=vertices,
                  faces=faces,
                  face_normals=face_normals,
                  process=False)
    if transform is not None:
        box.apply_transform(transform)

    return box

def get_cross_section_vertices(ntype,num_pts):
    vertices, center = cross_section_new(ntype,num_pts)
    if ntype is not 'circle':
        shift = np.tile(center,(len(vertices),1))
        vertices -= shift
        vertices = get_polygon_sampling_points(vertices,num_pts)
        vertices += np.tile(center,(len(vertices),1))

    return vertices, center

def get_polygon_sampling_points(vertices, num_pts):
    coords = [tuple(vertices[i]) for i in range(len(vertices))]
    ring = LinearRing(coords)    
    
    radius = 10
    num = num_pts + 1
    angle = np.linspace(0,2*np.pi,num)
    angle = angle[:-1] 
    vertices = np.array([])
    for i in range(len(angle)):
        line = LineString([(0, 0), (np.cos(angle)[i]*radius,np.sin(angle)[i]*radius)])
        intersectPt = ring.intersection(line)
        vertices = np.append(vertices,intersectPt.coords[0])
    vertices = np.array(vertices, dtype=np.float64).reshape((-1, 2))
    
    return vertices

def cross_section_new(ntype, num_pts):
    vertices = []
    center = [0.0, 0.0]
    if ntype == 'rectangle_angle':
        vertices = [0.5, 0, 0.5, 0.4, 0.4, 0.5, 0, 0.5,
                    -0.4, 0.5, -0.5, 0.4, -0.5, 0,
                    -0.5, -0.4, -0.4, -0.5, 0, -0.5,
                    0.4, -0.5, 0.5, -0.4]
        vertices = np.array(vertices, dtype=np.float64).reshape((-1, 2))        
    elif ntype == 'circle':
        radius = 0.5
        num = num_pts + 1
        angle = np.linspace(0,2*np.pi,num)
        angle = angle[:-1] 
        vertices = np.array([])
        for i in range(len(angle)):
            vertices = np.append(vertices,[np.cos(angle)[i]*radius,np.sin(angle)[i]*radius])
        vertices = np.array(vertices, dtype=np.float64).reshape((-1, 2))
    else:
       pass     
    
    center = np.array(center)
    return vertices, center

def get_centerline_input_slope(zmin,zmax,step, slope, point):
    centerpts = []
    angles = []
    steps = np.linspace(zmin,zmax,step)
    theta = 0.0
    x = 0.0
    for z in steps:
        if np.isclose(slope,np.inf):
            x = point[0]
        else:
            x = (z-point[2]+slope*point[0])/slope
        theta = np.arctan(slope)

        centerpts = np.append(centerpts,[x,0,z])
        if theta > 0:
            theta = np.pi*1.5 + theta
        else:
            theta = np.pi*0.5 + theta
        angles = np.append(angles,theta)        
        centerpts = np.array(centerpts, dtype=np.float64).reshape((-1, 3))
        angles = np.array(angles, dtype=np.float64).reshape((-1, 1))
        
    return centerpts, angles

def bernstein_poly(i, n, t):
    return comb(n, i) * ( t**(n-i) ) * (1 - t)**i


def bezier_curve(points, nTimes=10000):
    nPoints = len(points)
    xPoints = np.array([p[0] for p in points])
    yPoints = np.array([p[1] for p in points])

    t = np.linspace(0.0, 1.0, nTimes)

    polynomial_array = np.array([bernstein_poly(i, nPoints-1, t) for i in range(0, nPoints)])

    xvals = np.dot(xPoints, polynomial_array)
    yvals = np.dot(yPoints, polynomial_array)

    return xvals, yvals

def calcSlope(x1,z1,x2,z2):
    if np.isclose(x1,x2):
        return np.inf
    else:
        return (z2 - z1)/(x2 - x1)

def get_hip_implant_profile(A, B, C, D, alpha, x0, z0, L1 = 20.0, L2 = 20):
    beta = (180.0 - alpha)*np.pi/180.0
    sampleNum = 21

    pz1 = z0 - C + D*np.cos(beta)
    px1 = x0 - (C-D*np.cos(beta))/np.tan(beta)    
    px2 = px1 + L1*np.cos((alpha-90.0)*np.pi/180.0)
    pz2 = pz1 - L1*np.sin((alpha-90.0)*np.pi/180.0)
    px3 = px2
    pz3 = pz1 - A
    points_left = []
    points_left = np.append(points_left,[px1, pz1, px2, pz2, px3, pz3])
    points_left = points_left.reshape(-1,2)
    xvals_left, zvals_left = bezier_curve(points_left, nTimes=sampleNum)
    
    qx1 = x0 + B - D*np.sin(beta)
    qz1 = z0 + (B - D*np.sin(beta))*np.tan(beta)
    qx2 = qx1 + L2*np.cos((alpha-90.0)*np.pi/180.0)
    qz2 = qz1 - L2*np.sin((alpha-90.0)*np.pi/180.0)
    qx3 = px3 + 6
    qz3 = pz3
    points_right = []
    points_right = np.append(points_right,[qx1, qz1, qx2, qz2, qx3, qz3])
    points_right = points_right.reshape(-1,2)
    xvals_right, zvals_right = bezier_curve(points_right, nTimes=sampleNum)    

    return xvals_left, zvals_left, xvals_right, zvals_right


def rotation_matrix(axis, theta):
    axis = np.asarray(axis)
    axis = axis/math.sqrt(np.dot(axis, axis))
    a = math.cos(theta/2.0)
    b, c, d = -axis*math.sin(theta/2.0)
    aa, bb, cc, dd = a*a, b*b, c*c, d*d
    bc, ad, ac, ab, bd, cd = b*c, a*d, a*c, a*b, b*d, c*d
    return np.array([[aa+bb-cc-dd, 2*(bc+ad), 2*(bd-ac)],
                     [2*(bc-ad), aa+cc-bb-dd, 2*(cd+ab)],
                     [2*(bd+ac), 2*(cd-ab), aa+dd-bb-cc]])


def hip_implant_vertices_circle(ntype,zmin, zmax, scales_x_minus, scales_x_plus, scales_y_minus, scales_y_plus, slope, point,
                                ntype_bottom = None, sections = 30):
    vertices_original, top_cross_section_center = get_cross_section_vertices(ntype,sections)
    bottom_cross_section_center = top_cross_section_center 
    
    num = len(vertices_original)
    vertices_original = np.hstack((vertices_original,np.zeros((num,1))))
    
    step = 2
    centerpts, angles = get_centerline_input_slope(zmin,zmax,step,slope, point)
    
    size = len(scales_x_minus)
    if step != size:
        raise ValueError('size of import scales array not equal z range!')
    
    vertices_bottom = np.array([])
    if ntype_bottom is not None:
        vertices_bottom, bottom_cross_section_center = get_cross_section_vertices(ntype_bottom,sections)
        vertices_bottom = np.hstack((vertices_bottom,np.zeros((num,1)))) # 2D coordinates to 3D coordinates
        
    vertices = np.array([])
    surfacePts = np.array([])    
    rotate_axis =  [0,-1,0]
    
    for i in range(0,step):
        if ntype_bottom is not None:
            ratio = float(i)/(step-1)
            vertices_scaled = vertices_original*ratio + vertices_bottom*(1.0-ratio)
        else:
            vertices_scaled = np.copy(vertices_original)
            
        vertices_scaled[:,0][vertices_scaled[:,0]<0] *= scales_x_minus[i]
        vertices_scaled[:,0][vertices_scaled[:,0]>0] *= scales_x_plus[i] 
        vertices_scaled[:,1][vertices_scaled[:,1]<0] *= scales_y_minus[i]
        vertices_scaled[:,1][vertices_scaled[:,1]>0] *= scales_y_plus[i]  

        for j in range(0,num):
            vertices_transformed = np.dot(rotation_matrix(rotate_axis,angles[i]), vertices_scaled[j])+centerpts[i]
            vertices = np.append(vertices,vertices_transformed)

        if i == 0 or i == step-1:
            if i == 0:
               pts = np.copy(bottom_cross_section_center)
            else:
               pts = np.copy(top_cross_section_center)
               
            pts = np.hstack((pts,np.zeros(1)))
            
            if pts[0] < 0:
                pts[0] *= scales_x_minus[i]
            elif pts[0] > 0:
                pts[0] *= scales_x_plus[i]
            elif pts[1] < 0:
                pts[1] *= scales_y_minus[i]
            elif pts[1] > 0:
                pts[1] *= scales_y_plus[i]
            else:
                pass
            pts_transformed = np.dot(rotation_matrix(rotate_axis,angles[i]), pts)+centerpts[i]
            surfacePts = np.append(surfacePts,pts_transformed)
    
    vertices = np.array(vertices, dtype=np.float64).reshape((-1, 3))
    surfacePts = np.array(surfacePts, dtype=np.float64).reshape((-1, 3))

    return vertices, surfacePts


def hip_implant_tip(ntype,scale_x = 10, scale_y = 10,  length = 5, bottom_diameter = 6, ntype_bottom = None, sections = 30):
    vertices_original, top_cross_section_center = get_cross_section_vertices(ntype,sections)
    bottom_cross_section_center = top_cross_section_center
    
    num = len(vertices_original)
    vertices_original = np.hstack((vertices_original,np.zeros((num,1))))
    
    vertices_bottom = np.array([])
    if ntype_bottom is not None:
        vertices_bottom, bottom_cross_section_center = get_cross_section_vertices(ntype_bottom,sections)
        vertices_bottom = np.hstack((vertices_bottom,np.zeros((num,1))))

    pz1 = 0
    px1 = 0.5*scale_x    
    px2 = px1
    pz2 = pz1 - length
    px3 = bottom_diameter/2.0
    pz3 = pz2
    points_left = []
    points_left = np.append(points_left,[px1, pz1, px2, pz2, px3, pz3])
    points_left = points_left.reshape(-1,2)
    sampleNum = 3
    xvals_left, zvals_left = bezier_curve(points_left, nTimes=sampleNum)
    scales_x = xvals_left*2
    scales_y = scales_x *(scale_y/scale_x)
    step = len(scales_x)

    vertices = np.array([])
    surfacePts = np.array([])    
    for i in range(0,step):
        if ntype_bottom is not None:
            ratio = float(i)/(step-1)
            vertices_scaled = vertices_original*ratio + vertices_bottom*(1.0-ratio)
        else:
            vertices_scaled = np.copy(vertices_original)
            
        vertices_scaled[:,0][vertices_scaled[:,0]<0] *= scales_x[i]
        vertices_scaled[:,0][vertices_scaled[:,0]>0] *= scales_x[i]
        vertices_scaled[:,1][vertices_scaled[:,1]<0] *= scales_y[i]
        vertices_scaled[:,1][vertices_scaled[:,1]>0] *= scales_y[i]   
        
        vertices_scaled[:,2] += zvals_left[i]
        vertices = np.append(vertices,vertices_scaled)

        if i == 0 or i == step-1:
            if i == 0:
               pts = np.copy(bottom_cross_section_center)
            else:
               pts = np.copy(top_cross_section_center)
               
            pts = np.hstack((pts,np.zeros(1)))
            pts[2] += zvals_left[i]
            surfacePts = np.append(surfacePts,pts)
    
    vertices = np.array(vertices, dtype=np.float64).reshape((-1, 3))
    surfacePts = np.array(surfacePts, dtype=np.float64).reshape((-1, 3))

    return vertices, surfacePts

def hip_implant_two_splines(ntype, control_pts1, control_pts2, scales_y, nstep = 10, ntype_bottom = None, sections = 30):
    vertices_original, top_cross_section_center = get_cross_section_vertices(ntype,sections)
    bottom_cross_section_center = top_cross_section_center
    
    num = len(vertices_original)
    vertices_original = np.hstack((vertices_original,np.zeros((num,1))))
    
    vertices_bottom = np.array([])
    if ntype_bottom is not None:
        vertices_bottom, bottom_cross_section_center = get_cross_section_vertices(ntype_bottom,sections)
        vertices_bottom = np.hstack((vertices_bottom,np.zeros((num,1))))
    
    xvals_left, zvals_left = bezier_curve(control_pts1, nTimes=nstep)
    xvals_right, zvals_right = bezier_curve(control_pts2, nTimes=nstep)
    scales_x_minus = np.abs(xvals_left)*2
    scales_x_plus = np.abs(xvals_right)*2
    
    step = len(zvals_left)
    vertices = np.array([])
    surfacePts = np.array([])    
    for i in range(0,step):
        if ntype_bottom is not None:
            ratio = float(i)/(step-1)
            vertices_scaled = vertices_original*ratio + vertices_bottom*(1.0-ratio)
        else:
            vertices_scaled = np.copy(vertices_original)
 
        vertices_scaled[:,0][vertices_scaled[:,0]<0] *= scales_x_minus[i]
        vertices_scaled[:,0][vertices_scaled[:,0]>0] *= scales_x_plus[i]
        vertices_scaled[:,1][vertices_scaled[:,1]<0] *= scales_y[i]
        vertices_scaled[:,1][vertices_scaled[:,1]>0] *= scales_y[i]        
        
        vertices_scaled[:,2] += zvals_left[i]
        vertices = np.append(vertices,vertices_scaled)

        if i == 0 or i == step-1:
            if i == 0:
               pts = np.copy(bottom_cross_section_center)
            else:
               pts = np.copy(top_cross_section_center)
               
            pts = np.hstack((pts,np.zeros(1)))
            pts[2] += zvals_left[i]
            surfacePts = np.append(surfacePts,pts)
    
    vertices = np.array(vertices, dtype=np.float64).reshape((-1, 3))
    surfacePts = np.array(surfacePts, dtype=np.float64).reshape((-1, 3))
    
    return vertices, surfacePts


def hip_implant_vertices_input_two_curves(ntype,A, B, C, D, alpha, x0, z0, scales_y, L1 = 20.0, L2 = 20, ntype_bottom = None, sections = 30):
    xvals_left, zvals_left, xvals_right, zvals_right = get_hip_implant_profile(A, B, C, D, alpha, x0, z0, L1, L2)
    start_z = 0
    end_z = 20

    vertices_original, top_cross_section_center = get_cross_section_vertices(ntype,sections)
    bottom_cross_section_center = top_cross_section_center
    num = len(vertices_original)
    vertices_original = np.hstack((vertices_original,np.zeros((num,1))))
    
    centerpts = []
    angles = []
    scales_x = []
    steps = len(xvals_left)
    
    for i in range(0, steps):
        k = calcSlope(xvals_left[i],zvals_left[i],xvals_right[i],zvals_right[i])
        theta = np.arctan(k)
        angles = np.append(angles,theta)  
        centerpts = np.append(centerpts,[(xvals_left[i] + xvals_right[i])/2.0,0,(zvals_left[i] + zvals_right[i])/2.0])
        dist = np.sqrt((xvals_left[i]-xvals_right[i])*(xvals_left[i]-xvals_right[i]) + (zvals_left[i]-zvals_right[i])*(zvals_left[i]-zvals_right[i]))
        scales_x = np.append(scales_x, dist)

    centerpts = np.array(centerpts, dtype=np.float64).reshape((-1, 3))
    angles = np.array(angles, dtype=np.float64).reshape((-1, 1))
    scales_x = np.array(scales_x, dtype=np.float64).reshape((-1, 1))

    vertices_bottom = []
    if ntype_bottom is not None:
        vertices_bottom, bottom_cross_section_center = get_cross_section_vertices(ntype_bottom,sections)
        vertices_bottom = np.hstack((vertices_bottom,np.zeros((num,1))))
        
    vertices = []
    surfacePts = []    
    rotate_axis =  [0,-1,0]
    for i in range(start_z, end_z+1):
        if ntype_bottom is not None:
            ratio = float(i - start_z)/(end_z - start_z)
            vertices_scaled = vertices_original*ratio + vertices_bottom*(1.0-ratio)
        else:
            vertices_scaled = np.copy(vertices_original)
        
        vertices_scaled[:,0][vertices_scaled[:,0]<0] *= scales_x[i]
        vertices_scaled[:,0][vertices_scaled[:,0]>0] *= scales_x[i] 
        vertices_scaled[:,1][vertices_scaled[:,1]<0] *= scales_y[i]
        vertices_scaled[:,1][vertices_scaled[:,1]>0] *= scales_y[i]   

        for j in range(0,num):
            vertices_transformed = np.dot(rotation_matrix(rotate_axis,angles[i]), vertices_scaled[j])+centerpts[i]
            vertices = np.append(vertices,vertices_transformed)

        if i == start_z or i == end_z:
            if i == start_z:
               pts = np.copy(bottom_cross_section_center)
            else:
               pts = np.copy(top_cross_section_center)
               
            pts = np.hstack((pts,np.zeros(1)))
            pts[0] *= scales_x[i]
            pts[1] *= scales_y[i]
            pts_transformed = np.dot(rotation_matrix(rotate_axis,angles[i]), pts)+centerpts[i]
            surfacePts = np.append(surfacePts,pts_transformed)
    
    vertices = np.array(vertices, dtype=np.float64).reshape((-1, 3))
    surfacePts = np.array(surfacePts, dtype=np.float64).reshape((-1, 3))

    return vertices, surfacePts, centerpts, angles, scales_x

def generate_hip_implant(nstep, num_pts, vertices, escape_hole = False):
    step = nstep
    num = num_pts
    
    faces = np.array([])
    for i in range(0,step-1):
        for j in range(0,num):
            if j == num - 1:
                faces = np.append(faces,[i*num+j,i*num,(i+1)*num,(i+1)*num,(i+1)*num+j,i*num+j])
            else:
                faces = np.append(faces,[i*num+j,i*num+j+1,(i+1)*num+j+1,(i+1)*num+j+1,(i+1)*num+j,i*num+j]) 
    
    for j in range(0,num):
        if escape_hole == False:
            if j == num -1:
                faces = np.append(faces,[(step-1)*num+j,(step-1)*num,step*num+1])
                faces = np.append(faces,[step*num,0,j])
            else:
                faces = np.append(faces,[(step-1)*num+j,(step-1)*num+j+1,step*num+1])
                faces = np.append(faces,[step*num,j+1,j])          
        else: 
            if j == num -1:
                faces = np.append(faces,[(step-1)*num+j,(step-1)*num,step*num])
            else:
                faces = np.append(faces,[(step-1)*num+j,(step-1)*num+j+1,step*num])          

    vertices = np.array(vertices, dtype=np.float64).reshape((-1, 3))
    faces = np.array(faces, dtype=np.int64).reshape((-1, 3))
    
    mesh = Trimesh(vertices=vertices,
                  faces=faces,
                  process=False)

    return mesh    

def icosahedron():
    '''
    Create an icosahedron, a 20 faced polyhedron.

    '''
    t = (1.0 + 5.0**.5) / 2.0
    vertices = [-1, t, 0, 1, t, 0, -1, -t, 0, 1, -t, 0, 0, -1, t, 0, 1, t,
                0, -1, -t, 0, 1, -t, t, 0, -1, t, 0, 1, -t, 0, -1, -t, 0, 1]
    faces = [0, 11, 5, 0, 5, 1, 0, 1, 7, 0, 7, 10, 0, 10, 11,
             1, 5, 9, 5, 11, 4, 11, 10, 2, 10, 7, 6, 7, 1, 8,
             3, 9, 4, 3, 4, 2, 3, 2, 6, 3, 6, 8, 3, 8, 9,
             4, 9, 5, 2, 4, 11, 6, 2, 10, 8, 6, 7, 9, 8, 1]
    # make every vertex have radius 1.0
    vertices = np.reshape(vertices, (-1, 3)) / 1.9021130325903071
    faces = np.reshape(faces, (-1, 3))
    mesh = Trimesh(vertices=vertices,
                   faces=faces,
                   process=False)
    return mesh


def icosphere(subdivisions=3, radius=1.0):
    '''
    Create an isophere centered at the origin.

    Parameters
    ----------
    subdivisions: int, how many times to subdivide the mesh.
                  Note that the number of faces will grow as function of
                  4 ** subdivisions, so you probably want to keep this under ~5
    radius: float, radius of resulting sphere

    Returns
    ---------
    ico: trimesh.Trimesh object of sphere
    '''
    def refine_spherical():
        vectors = ico.vertices
        scalar = (vectors ** 2).sum(axis=1)**.5
        unit = vectors / scalar.reshape((-1, 1))
        offset = radius - scalar
        ico.vertices += unit * offset.reshape((-1, 1))
    ico = icosahedron()
    ico._validate = False
    for j in range(subdivisions):
        ico.subdivide()
        refine_spherical()
    ico._validate = True
    return ico


def uv_sphere(radius=1.0,
              count=[32, 32],
              theta=None,
              phi=None):
    '''
    Create a UV sphere (latitude + longitude) centered at the origin.

    Roughly one order of magnitude faster than an icosphere but slightly uglier.

    Parameters
    ----------
    radius: float, radius of sphere 
    count: (2,) int, number of lattitude and longitude lines
    theta: (n,) float, optional
    phi:   (n,) float, optional

    Returns
    ----------
    mesh: Trimesh object of UV sphere with specified parameters
    '''

    count = np.array(count, dtype=np.int)
    count += np.mod(count, 2)
    count[1] *= 2

    # generate vertices on a sphere using spherical coordinates
    if theta is None:
        theta = np.linspace(0, np.pi, count[0])
    if phi is None:
        phi = np.linspace(0, np.pi * 2, count[1])[:-1]
    spherical = np.dstack((np.tile(phi, (len(theta), 1)).T,
                           np.tile(theta, (len(phi), 1)))).reshape((-1, 2))
    vertices = util.spherical_to_vector(spherical) * radius

    # generate faces by creating a bunch of pie wedges
    c = len(theta)
    # a quad face as two triangles
    pairs = np.array([[c, 0, 1],
                      [c + 1, c, 1]])

    # increment both triangles in each quad face by the same offset
    incrementor = np.tile(np.arange(c - 1), (2, 1)).T.reshape((-1, 1))
    # create the faces for a single pie wedge of the sphere
    strip = np.tile(pairs, (c - 1, 1))
    strip += incrementor
    # the first and last faces will be degenerate since the first
    # and last vertex are identical in the two rows
    strip = strip[1:-1]

    # tile pie wedges into a sphere
    faces = np.vstack([strip + (i * c) for i in range(len(phi))])

    # poles are repeated in every strip, so a mask to merge them
    mask = np.arange(len(vertices))
    # the top pole are all the same vertex
    mask[0::c] = 0
    # the bottom pole are all the same vertex
    mask[c - 1::c] = c - 1

    # faces masked to remove the duplicated pole vertices
    # and mod to wrap to fill in the last pie wedge
    faces = mask[np.mod(faces, len(vertices))]

    # we save a lot of time by not processing again
    # since we did some bookkeeping mesh is watertight
    mesh = Trimesh(vertices=vertices, faces=faces, process=False)
    return mesh


def capsule(height=1.0,
            radius=1.0,
            count=[32, 32]):
    '''
    Create a mesh of a capsule, or a cylinder with hemispheric ends. 

    Parameters
    ----------
    height: float, center to center distance of two spheres
    radius: float, radius of the cylinder and hemispheres
    count:  (2,) int, number of sections on lattitude and longitude

    Returns
    ----------
    capsule: Trimesh of capsule with given properties
             - cylinder axis is along Z
             - one hemisphere is centered at the origin
             - other hemisphere is centered along the Z axis at specified height
    '''
    height = float(height)
    radius = float(radius)
    count = np.array(count, dtype=np.int)
    count += np.mod(count, 2)

    # create a theta where there is a double band around the equator
    # so that we can offset the top and bottom of a sphere to
    # get a nicely meshed capsule
    theta = np.linspace(0, np.pi, count[0])
    center = np.clip(np.arctan(tol.merge / radius), tol.merge, np.inf)
    offset = np.array([-center, center]) + (np.pi / 2)
    theta = np.insert(theta,
                      int(len(theta) / 2),
                      offset)

    capsule = uv_sphere(radius=radius,
                        count=count,
                        theta=theta)

    top = capsule.vertices[:, 2] > tol.zero
    capsule.vertices[top] += [0, 0, height]

    return capsule


def cylinder(radius=1.0, height=1.0, sections=32, transform=None):
    '''
    Create a mesh of a cylinder along Z centered at the origin.

    Parameters
    ----------
    radius: float, the radius of the cylinder
    height: float, the height of the cylinder
    sections: int, how many pie wedges should the cylinder be meshed as

    Returns
    ----------
    cylinder: Trimesh, resulting mesh
    '''

    # create a 2D pie out of wedges
    theta = np.linspace(0, np.pi * 2, sections)
    vertices = np.column_stack((np.sin(theta),
                                np.cos(theta))) * radius
    # the single vertex at the center of the circle
    # we're overwriting the duplicated start/end vertex
    vertices[0] = [0, 0]

    # whangle indexes into a triangulation of the pie wedges
    index = np.arange(1, len(vertices) + 1).reshape((-1, 1))
    index[-1] = 1
    faces = np.tile(index, (1, 2)).reshape(-1)[1:-1].reshape((-1, 2))
    faces = np.column_stack((np.zeros(len(faces), dtype=np.int), faces))

    # extrude the 2D triangulation into a Trimesh object
    cylinder = extrude_triangulation(vertices=vertices,
                                     faces=faces,
                                     height=height)
    # the extrusion was along +Z, so move the cylinder
    # center of mass back to the origin
    cylinder.vertices[:, 2] -= height * .5
    if transform is not None:
        # apply a transform here before any cache stuff is generated
        # and would have to be dumped after the transform is applied
        cylinder.apply_transform(transform)

    return cylinder


def random_soup(face_count=100):
    '''
    Return a random set of triangles as a Trimesh

    Parameters
    -----------
    face_count: int, number of faces in resultant mesh

    Returns
    -----------
    soup: Trimesh object with face_count random faces
    '''
    vertices = np.random.random((face_count * 3, 3)) - 0.5
    faces = np.arange(face_count * 3).reshape((-1, 3))
    soup = Trimesh(vertices=vertices, faces=faces)
    return soup


















