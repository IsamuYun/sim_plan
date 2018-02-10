#!/usr/bin/env python

"""Usage: python file_receiver.py

Demonstrates a server that receives a multipart-form-encoded set of files in an
HTTP POST, or streams in the raw data of a single file in an HTTP PUT.

See file_uploader.py in this directory for code that uploads files in this format.
"""

import logging

try:
    from urllib.parse import unquote
except ImportError:
    # Python 2.
    from urllib import unquote

import tornado.web

import os

class POSTHandler(tornado.web.RequestHandler):
    def post(self):
        #for field_name, files in self.request.files.items():
       #     for info in files:
       #         filename, content_type = info['filename'], info['content_type']
       #         body = info['body']
       #         logging.info('POST "%s" "%s" %d bytes',
       #                      filename, content_type, len(body))

        #self.write('OK')
        file_dir = os.path.join(os.path.dirname(__file__), "uploads")
        for field_name, files in self.request.files.items():
            for info in files:
                file_name = info["filename"]
                content_type = info["content_type"]
                body = info["body"]
                output_file = open(file_dir + "/" + file_name, "wb")
                output_file.write(body)
                self.write("file: " + file_name + " is uploaded")


@tornado.web.stream_request_body
class PUTHandler(tornado.web.RequestHandler):
    def initialize(self):
        self.bytes_read = 0

    def data_received(self, chunk):
        self.bytes_read += len(chunk)

    def put(self, filename):
        filename = unquote(filename)
        mtype = self.request.headers.get('Content-Type')
        logging.info('PUT "%s" "%s" %d bytes', filename, mtype, self.bytes_read)
        self.write('OK')