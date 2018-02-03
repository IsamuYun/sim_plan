#!/usr/bin/env python3
# coding=utf-8

import tornado.web
import methods.user_db as user_db

class LoginHandler(tornado.web.RequestHandler):
    def get(self):

        self.render("login.html")

    def post(self):
        username = self.get_argument("username")
        password = self.get_argument("password")
        user_infos = user_db.select_table(table="user_info", column="user_uid, user_name, password", condition="user_name", value=username)
        if user_infos:
            db_pwd = user_infos[0][2]
            if db_pwd == password:
                self.set_cookie("user_name", username)
                self.write("欢迎您的到来: " + username)
                self.redirect("./")
            else:
                self.write("密码错误")
        else:
            self.write("用户名错误") 