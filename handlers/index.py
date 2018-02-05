#!/usr/bin/env python3
# coding=utf-8

import tornado.web

class IndexHandler(tornado.web.RequestHandler):
    def get(self):
        username = self.get_cookie("user_name")
        if username is None:
            self.set_cookie("user_name", "")
            self.redirect("./login")
        else:
            username = username.strip()
            if (len(username) <= 0):
                self.redirect("./login")
            else:
                self.render("index.html", user_name=username)
    
            