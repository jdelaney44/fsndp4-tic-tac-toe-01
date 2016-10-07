"""
`appengine_config` gets loaded when starting a new application instance.
This code is not needed if there are no libs to add and will cause errors
on the server side if it is activated with no libs to add.
"""
# import sys
# import os.path
# from google.appengine.ext import vendor
# add `lib` subdirectory to `sys.path`, so our `main` module can load
# third-party libraries. Do not add this line if there are no 3rd party
# libs to add. 

# sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'lib'))
# vendor.add ('lib')