#GAE Imports
from google.appengine.ext import ndb


class Move(ndb.Model):
    game_key = ndb.KeyProperty(required=True)
    board_string = ndb.StringProperty(default='---------', required=True)
    move_number = ndb.IntegerProperty(default=0, required=True)
