#!/usr/bin/env python3
# coding=utf-8

import tornado.web

class PricingHandler(tornado.web.RequestHandler):
    def get(self):
        user_name = self.get_cookie("user_name")
        self.render("pricing.html", user_name=user_name)