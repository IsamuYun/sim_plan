#!/usr/bin/env python3
# coding=utf-8

import tornado.web
import methods.user_db as user_db

# 需要添加数据库操作

class PasswordHandler(tornado.web.RequestHandler):
    def get(self):
        user_name = self.get_cookie("user_name")
        self.render("password.html", user_name=user_name)

    def post(self):
        user_name = self.get_cookie("user_name")
        old_password = self.get_argument("old_password")
        new_password_1 = self.get_argument("new_password1")
        new_password_2 = self.get_argument("new_password2")

        old_password = old_password.strip()

        if (new_password_1 != new_password_2):
            self.write("新密码不一致")
        elif (len(old_password) <= 0):
            self.write("请输入当前的密码")
        
        user_infos = user_db.select_table(table="user_info", column="user_uid, user_name, password", condition="user_name", value=user_name)
        if user_infos:
            db_pwd = user_infos[0][2]
            if db_pwd == old_password:
                self.write("密码修改成功，请重新登录")
                user_db.change_password(user_name, new_password_1)
                
            else:
                self.write("当前密码错误，无法修改密码")
        else:
            self.write("查无此用户，无法修改密码") 
