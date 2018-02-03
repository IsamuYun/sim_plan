#!/usr/bin/env python3
# coding=utf-8

import tornado.web

class IndexHandler(tornado.web.RequestHandler):
    def get(self):
        username = self.get_cookie("user_name")
        if username is None:
            self.render("login.html")
        else:
            username = username.strip()
            if (len(username) <= 0):
                self.render("login.html")
            else:
                self.render("index.html", user_name=username)
    
            