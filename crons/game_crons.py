"""
game_crons.py - This file contains handlers for game related tasks that 
are called by taskqueue and/or cron jobs.
"""

import webapp2
from api import game_api


class UpdateAverageMovesRemaining(webapp2.RequestHandler):

    def post(self):
        """Update game listing announcement in memcache."""
        game_api.TicTacToeAPI._cache_average_attempts()
        self.response.set_status(204)
