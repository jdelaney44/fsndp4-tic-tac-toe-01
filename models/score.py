
# Python imports
from __builtin__ import classmethod

# GAE Imports
from google.appengine.ext import ndb
from google.appengine.api.datastore import STRONG_CONSISTENCY

# Local imports
from api.api_messages import ScoreForm


class Score(ndb.Model):

    """Score object"""
    game_key = ndb.KeyProperty(required=True)
    player = ndb.KeyProperty(required=True)
    score = ndb.IntegerProperty(required=False)
    start_date = ndb.DateTimeProperty(required=True)
    end_date = ndb.DateTimeProperty(required=True)
    move_count = ndb.IntegerProperty(required=True)
    player_name = ndb.ComputedProperty(
        lambda self: self.player.get(use_cache=False,
                                     use_memcache=False).name)
    game_number = ndb.ComputedProperty(
        lambda self: self.game_key.get(use_cache=False,
                                       use_memcache=False).game_number)
    game_status = ndb.ComputedProperty(
        lambda self: self.game_key.get(use_cache=False,
                                       use_memcache=False).game_status)
    game_active = ndb.ComputedProperty(
        lambda self: self.game_key.get(use_cache=False,
                                       use_memcache=False).game_active)

    @classmethod
    def player_scores(cls, player_key):
        """Returns the player's cumulative score"""
        scores_qry = Score.query(Score.player == player_key)
        scores = []
        for scr in scores_qry.fetch(read_policy=STRONG_CONSISTENCY):
            if scr.game_active:
                scores.append(scr)
        return scores

    def to_form(self):
        """Put a score record into a message for return via API"""
        form = ScoreForm()
        form.player_name = self.player_name
        form.start_date = str(self.start_date)
        form.end_date = str(self.end_date)
        form.game_status = self.game_status
        form.move_count = self.move_count
        form.urlsafe_key = self.game_key.urlsafe()
        form.game_active = self.game_active
        form.game_number = self.game_number
        return form
