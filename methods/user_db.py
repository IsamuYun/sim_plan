#!/usr/bin/env Python
# coding=utf-8

from methods.db import *

def select_table(table, column, condition, value):
    sql = "select " + column + " from " + table + " where " + condition + "='" + value + "'"
    cur.execute(sql)
    lines = cur.fetchall()
    return lines

def insert_user(username, email, password):
    sql = "INSERT INTO user_info (user_name, email, password) VALUES (%s, %s, %s)"
    cur.execute(sql, (username, email, password))
    conn.commit()

def change_password(user_name, password):
    sql = "UPDATE user_info SET password=%s WHERE user_name=%s"
    cur.execute(sql, (password, user_name))
    conn.commit()