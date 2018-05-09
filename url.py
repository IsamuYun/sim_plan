#!/usr/bin/env python3
# coding=utf-8
"""
the url structure of website
"""

import sys # utf-8 兼容汉字
from imp import reload
reload(sys)

from handlers.index import IndexHandler
from handlers.account import AccountHandler
from handlers.account import AccountRegisterHandler
from handlers.pricing import PricingHandler
from handlers.password import PasswordHandler
from handlers.projects import ProjectsHandler
from handlers.sim_plan import SimPlanHandler
from handlers.login import LoginHandler
from handlers.logout import LogoutHandler

from handlers.upload.file_receive import POSTHandler 

from handlers.unit_test import UnitTestHandler

from handlers.generator import GeneratorHandler

url = [
    (r'/', IndexHandler),
    (r"/login", LoginHandler),
    (r"/logout", LogoutHandler),
    (r"/account", AccountHandler),
    (r"/pricing", PricingHandler),
    (r"/password", PasswordHandler),
    (r"/projects", ProjectsHandler),
    (r"/sim-plan", SimPlanHandler),
    (r"/register", AccountRegisterHandler),
    (r"/upload", POSTHandler),
    (r"/test", UnitTestHandler),
    (r"/generator", GeneratorHandler)
]

