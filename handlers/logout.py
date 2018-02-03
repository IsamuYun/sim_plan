#!/usr/bin/env python3
# coding=utf-8

import tornado.web

class LogoutHandler(tornado.web.RequestHandler):
    def get(self):
        self.set_cookie("user_name", "")
        self.redirect("./login")