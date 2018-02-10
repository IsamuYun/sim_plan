#!/usr/bin/env python3
# coding=utf-8

import tornado.web

class UnitTestHandler(tornado.web.RequestHandler):
    def get(self):
        self.render("unit-test.html")