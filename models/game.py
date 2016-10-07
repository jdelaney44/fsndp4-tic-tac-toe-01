
# Python imports
from __builtin__ import classmethod
import datetime

# GAE imports
from google.appengine.ext import ndb
from google.appengine.api.datastore import STRONG_CONSISTENCY
from api.api_messages import GameFormResponse, GameFunctionForm,\
    MoveForm, MovesForm

# Local Imports
from game_logic.make_move import make_move
from game_logic.validation import moves_valid
from score import Score
from models.move import Move


class Game(ndb.Model):

    """Game object"""
    board = ndb.StringProperty(required=False, default='---------')
    game_status = ndb.StringProperty(required=True, default='started')
    player = ndb.KeyProperty(required=True, kind='User')
    score_key = ndb.KeyProperty(required=False, kind=Score)
    move_record_keys = ndb.KeyProperty(
        required=False, repeated=True, kind=Move)
    game_active = ndb.BooleanProperty(required=True, default=True)
    game_number = ndb.IntegerProperty(required=True, default=0)

    @classmethod
    def new_game(cls, player):
        """Creates and returns a new game"""
        # 'player' is actually a user.key value for the
        # relationship (KeyProperty) to the user entity
        # pacific=timezone('US/Pacific')
        now = datetime.datetime.now()
        game = Game(player=player)
        # print ('\nNew game object is :' + str(game) + '\n')
        # set up the score record
        game_key = game.put()
        score = Score(
            game_key=game_key,
            player=player,
            start_date=now,
            end_date=now,
            move_count=0,
            parent=game.key)
        score_key = score.put()
        game.score_key = score_key
        # set up the move records
        move_record = (Move(game_key=game_key))
        move_record_key = move_record.put()
        # print move_record_key
        move_record_keys = []
        move_record_keys.append(move_record_key)
        game.move_record_keys = move_record_keys
        # set the game number
        game.game_number = game.get_max_game_number(player) + 1
        game.put()
        return game

    @classmethod
    def get_game(cls, url_key):
        """Gets a  game"""
        # Convert the urlsafe key back to a key
        game_key = ndb.Key(urlsafe=url_key)
        # Use the key to get the game object
        game = game_key.get()
        return game


    @classmethod
    def reset_game(cls, url_key):
        """Resets & returns a  game"""
        # 'player' is actually a user.key value for the
        # relationship (KeyProperty) to the user entity
        #
        # Convert the urlsafe key back to a key
        game_key = ndb.Key(urlsafe=url_key)
        # Use the key to get the game object
        game = game_key.get()
        score_key = game.score_key
        score = score_key.get()
        if game.game_status == 'started':
            print ('\nResetting game object: ' + str(game) + '\n')
            game.board = '---------'
            game.game_status = 'started'
            game.put()
            score.move_count = 0
            score.put()
        else:
            print '\nGame over, will not be reset'

        return game

    @classmethod
    def deactivate_game(cls, url_key):
        """ Sets the game_active flag to False"""
        game_key = ndb.Key(urlsafe=url_key)
        game = game_key.get()
        game.game_active = False
        game.put()
        return game

    @classmethod
    def cancel_game(cls, url_key):
        """Updates the game_status field as 'cancelled'"""
        game_key = ndb.Key(urlsafe=url_key)
        game = game_key.get()
        game.game_active = False
        game.game_status = 'cancelled'
        game.put()
        return game

    @classmethod
    def make_move(cls, request):
        """Processes a move request"""
        game_key = ndb.Key(urlsafe=request.game_key)
        # Use the key to get the game object
        game = game_key.get()
        if game.game_status == 'started':
            last_board = game.board
            if moves_valid(request, last_board):
                game.board = request.board
            else:
                return False
            # Get the keys for the past moves
            move_record_keys = game.move_record_keys
            i = len(move_record_keys)
            # Get a new a move record
            move_record = (Move(
                game_key=game_key,
                board_string=request.board,
                move_number=i
            )
            )
            move_record_key = move_record.put()
            # Update the move record keys on the game
            move_record_keys.append(move_record_key)
            game.move_record_keys = move_record_keys
            game.put()
            game_key = make_move(game_key)
            game = game_key.get()
            return game
        else:
            return False

    def to_form(self, message):
        """Puts a game into a message for return via API"""
        form = GameFormResponse()
        form.urlsafe_key = self.key.urlsafe()
        form.board = self.board
        form.message = message
        form.player_name = self.player.get().name
        form.player_email = self.player.get().email
        form.game_status = self.game_status
        return form

    def game_active_form(self):
        """
        Returns game key & boolean indicating active state of game
        Uses the generic GameFunctionForm
        """
        form = GameFunctionForm()
        form.game_key = self.key.urlsafe()
        form.true_or_false = self.game_active
        return form

    def moves_to_form(self):
        """Puts the moves into a message for return via API"""
        moves_qry = Move.query(
            Move.game_key == self.key).order(Move.move_number)
        form_items_list = []
        moves = moves_qry.fetch(read_policy=STRONG_CONSISTENCY)
        i = 1
        for move in moves:
            move_form = MoveForm()
            move_form.board = move.board_string
            move_form.move_number = move.move_number
            form_items_list.append(move_form)
            i = i+1
        moves_form = MovesForm()
        moves_form.items = form_items_list
        return moves_form

    def get_max_game_number(self, player_key):
        """Returns the last game for a player in the db"""
        max_game = Game.query(
            Game.player == player_key).order(-Game.game_number).fetch(1)
        if max_game:
            return max_game[0].game_number
        else:
            return 0
