"""
email_crons.py - This file contains handlers related to email tasks that 
are called by taskqueue and/or cronjobs.
"""

import webapp2
from google.appengine.api import mail, app_identity
from api import game_api
from models.user import User
from models.game import Game


class SendReminderEmail(webapp2.RequestHandler):

    def get(self):
        """Send a reminder email to each User with an email about games.
        Called every hour using a cron job"""
        pass
#         app_id = app_identity.get_application_id()
#         users = User.query(User.email != None)
#         for player in users:
#             player_games = Game.query(Game.player == player.key)
#             for game in player_games:
#                 if game.game_status == 'started' and\
#                     game.game_active == True:
#                     subject = 'You have unfinished Tic-Tac-Toe games!'
#                     body = 'Hello {}, you have unfinished games that'.\
#                                 format(player.name) +\
#                             ' need to be cleaned up in Tic-Tac-Toe! - ' +\
#                             str(game.key)
#                     # This will send test emails, the arguments to send_mail are:
#                     # from, to, subject, body
#                     mail.send_mail('noreply@{}.appspotmail.com'.format(app_id),
#                                    'jpatricktest01@gmail.com',
#                                    subject,
#                                    body)
#                     break
