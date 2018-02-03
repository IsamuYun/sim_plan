#!/usr/bin/env python3
# coding=utf-8

import tornado.web
import methods.user_db as user_db

class AccountHandler(tornado.web.RequestHandler):
    def get(self):
        username = self.get_cookie("user_name")
        self.render("account_info.html", user_name=username)

    
class AccountRegisterHandler(tornado.web.RequestHandler):
    def get(self):
        self.render("register.html")

    def post(self):
        username = self.get_argument("username")
        email = self.get_argument("email")
        password_1 = self.get_argument("password1")
        password_2 = self.get_argument("password2")

        username = username.strip()
        email = email.strip()

        if (len(username) <= 0):
            self.write("用户名不能为空，请确认")
            #self.redirect("./register")
        elif  (len(email) <= 0):
            self.write("电子邮件不能为空，请确认")
            #self.redirect("./register")
        elif (password_1 != password_2):
            self.write("密码输入不一致，请确认")
            #self.redirect("./register")


        user_infos = user_db.select_table(table="user_info", column="user_uid, user_name", condition="user_name", value=username)
        if user_infos:
            self.write("用户名已经被使用")
            #self.redirect("./register")
        else:
            user_db.insert_user(username, email, password_1)
            self.set_cookie("user_name", username)
            self.write("注册成功")
            self.redirect("./")

        
        
