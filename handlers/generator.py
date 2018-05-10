import tornado.web
import os

from methods.generate.ModelGenerator import generate_model

class GeneratorHandler(tornado.web.RequestHandler):
    def get(self):
        file_dir = os.path.join(os.path.dirname(__file__), "../statics/models/")
        A = int(self.get_argument("A"))
        B = int(self.get_argument("B"))
        C = int(self.get_argument("C"))
        D = int(self.get_argument("D"))
        alpha = self.get_argument("Alpha")
        alpha = float(alpha)
        mesh = generate_model(A, B, C, D, alpha)
        mesh.export(file_dir + "股骨柄假体.stl")

    def post(self):
        file_dir = os.path.join(os.path.dirname(__file__), "../statics/models/")
        A = int(self.get_argument("A"))
        B = int(self.get_argument("B"))
        C = int(self.get_argument("C"))
        D = int(self.get_argument("D"))
        alpha = self.get_argument("Alpha")
        alpha = float(alpha)
        mesh = generate_model(A, B, C, D, alpha)
        mesh.export(file_dir + "股骨柄假体.stl")
