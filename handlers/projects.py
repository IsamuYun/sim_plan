#!/usr/bin/env python3
# coding=utf-8

import tornado.web

class ProjectsHandler(tornado.web.RequestHandler):
    def get(self):
        user_name = self.get_cookie("user_name")
        self.render("projects.html", user_name=user_name)