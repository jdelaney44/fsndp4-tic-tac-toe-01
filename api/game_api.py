# -*- coding: utf-8 -*-`
"""
tictactoe_api.py - Creates and configure the Game API to expose the resources.
This does not contain game logic. See game_logic.py for the game logic
"""
# Python imports
# none

# Google imports
import endpoints
from protorpc import remote
from google.appengine.api import memcache
from google.appengine.api import taskqueue
from google.appengine.ext import ndb

# Local imports
from models.score import Score

# from models.move import Move_Record
from models.user import User
from models.game import Game

# import resource containers
from api.api_messages import USER_REQUEST, NEW_GAME_REQUEST,\
    MAKE_MOVE_REQUEST, PLAYER_SCORE_REQUEST, NUM_REQUEST, GAME_REQUEST

# import message forms
from api.api_messages import GameForm, GameFunctionForm,\
    GameFormResponse, MovesForm, PlayerScoreResponse, \
    PlayerScoresResponse, ScoreForms, NumRequest,\
    PlayersRankResponse, NothingHere, StringMessage


# Constant Declarations
TIME_FORMAT_STRING = '%b %d, %Y %H:%M'

WEB_CLIENT_ID =\
    '182862607901-pbokfffrn24e7rb894ncjc2dtjtflf94.apps.googleusercontent.com'

# NOTE: It seems to fail if there are dashes in the API. EG:
# name='tictactoe-api'


@endpoints.api(name='tictactoe_api',
               version='v1',
               allowed_client_ids=[
                   WEB_CLIENT_ID, endpoints.API_EXPLORER_CLIENT_ID],
               auth_level=endpoints.AUTH_LEVEL.REQUIRED,
               audiences=[WEB_CLIENT_ID])
# see: https://cloud.google.com/appengine/docs/python/endpoints/create_api
class TicTacToeAPI(remote.Service):

    """Top level Tic Tac Toe Game  API"""

    def check_auth(self):
        current_user = endpoints.get_current_user()
        if current_user is None:
            print '\nAuthentication Error Encountered - Unauthorized \
            user or no user is authenticated\n'
            raise endpoints.UnauthorizedException('No current_user found')

    @endpoints.method(USER_REQUEST,
                      StringMessage,
                      path='create_user/{user_name}/{user_email}',
                      name='create_user',
                      http_method='POST')
    def create_user(self, request):
        """Create a User. Requires a unique e-mail"""
        self.check_auth()
        if User.query(User.email == request.user_email).get():
            return StringMessage(
                message='Welcome back {} ! <br>'.format(
                    request.user_name)+'Click on New Game to begin')
        else:
            user = User(name=request.user_name, email=request.user_email)
            user.put()
            return StringMessage(
                message='User {} created! <br>'.format(
                    request.user_name) + 'Click on New Game to begin')

    @endpoints.method(NEW_GAME_REQUEST,
                      GameFormResponse,
                      path='new_game/{player_email}',
                      name='new_game',
                      http_method='POST')
    def new_game(self, request):
        """Creates new game"""
        self.check_auth()
        user_key = User.query(User.email == request.player_email)
        user = user_key.get()
        if not user:
            raise endpoints.NotFoundException(
                'A User with that name does not exist.')
        try:
            game = Game.new_game(user.key)
        except ValueError:
            raise endpoints.BadRequestException(
                'Game could not be created by server.')

        # Use a task queue to update the average attempts remaining.
        # This operation is not needed to complete the creation of a new game
        # so it is performed out of sequence.

        # taskqueue.add(url='/tasks/cache_average_attempts')

        return game.to_form('Click in any square to start.')

    @endpoints.method(GAME_REQUEST,
                      GameFormResponse,
                      path='reset/{game_key}',
                      name='reset_game',
                      http_method='PUT')
    def reset_game(self, request):
        """Retruns the game board to the initial state"""
        self.check_auth()
        game = Game.reset_game(request.game_key)
        return game.to_form('You may play, Human')

    @endpoints.method(GAME_REQUEST,
                      GameFunctionForm,
                      path='deactivate/{game_key}',
                      name='deactivate_game',
                      http_method='PUT')
    def deactivate_game(self, request):
        """Sets the active flag on a game record to false"""
        self.check_auth()
        game = Game.deactivate_game(request.game_key)
        form = GameFunctionForm()
        form.game_key = game.key.urlsafe()
        form.true_or_false = game.game_active
        return form

    @endpoints.method(GAME_REQUEST,
                      GameFunctionForm,
                      path='cancel/{game_key}',
                      name='cancel_game',
                      http_method='PUT')
    def cancel_game(self, request):
        """
        Sets the active flag on a game record to false and sets the
        status to 'cancelled'
        """
        self.check_auth()
        game = Game.cancel_game(request.game_key)
        form = GameFunctionForm()
        form.game_key = game.key.urlsafe()
        form.true_or_false = game.game_active
        return form

    @endpoints.method(GAME_REQUEST,
                      GameFormResponse,
                      path='get/{game_key}',
                      name='get_game',
                      http_method='GET'
                      )
    def get_game(self, request):
        game = Game.get_game(request.game_key)
        return game.to_form('You may play, Human')


    @endpoints.method(MAKE_MOVE_REQUEST,
                      GameFormResponse,
                      path='game/{game_key}/{board}',
                      name='make_move',
                      http_method='PUT')
    def make_move(self, request):
        """Makes a move. Returns the game from the db"""
        self.check_auth()
        game = Game.make_move(request)
        if game:
            gs = game.game_status
            if gs == 'player_win':
                return game.to_form('You Win!')
            elif gs == 'machine_win':
                return game.to_form('Sorry! Try again,  Human!')
            elif gs == 'tie':
                return game.to_form('Almost got you! One more time?')
            else:
                return game.to_form('Your turn ...')
        else:
            gk = ndb.Key(urlsafe=request.game_key)
            game = gk.get()
            return game.to_form('That move is not possible')

    @endpoints.method(GAME_REQUEST,
                      MovesForm,
                      path='history/{game_key}',
                      name='get_game_history',
                      http_method='GET')
    def get_game_history(self, request):
        """Returns a list of moves for the game"""
        self.check_auth()
        gk = ndb.Key(urlsafe=request.game_key)
        game = gk.get()
        return game.moves_to_form()

    @endpoints.method(PLAYER_SCORE_REQUEST,
                      PlayerScoreResponse,
                      path='games/player_score/{player_email}',
                      name='get_player_score',
                      http_method='GET')
    def get_player_score(self, request):
        """Returns all of an individual User's scores"""
        self.check_auth()
        player = User.query(User.email == request.player_email).get()
        if not player:
            raise endpoints.NotFoundException(
                'A player with that email does not exist!')
        score_form = PlayerScoreResponse()
        score_form.player_email = player.key.get().email
        score_form.player_score = player.key.get().cumulative_score
        return score_form

    @endpoints.method(response_message=ScoreForms,
                      path='scores',
                      name='get_scores',
                      http_method='GET')
    def get_scores(self, request):
        """Return all scores"""
        return ScoreForms(items=[score.to_form() for score in Score.query()])

    @endpoints.method(PLAYER_SCORE_REQUEST,
                      ScoreForms,
                      path='games/user/{player_email}',
                      name='get_user_games',
                      http_method='GET')
    def get_user_games(self, request):
        """Returns all of an individual User's games and scores"""
        self.check_auth()
        player = User.query(User.email == request.player_email).get()
        if not player:
            raise endpoints.NotFoundException(
                'A player with that email does not exist!')
        scores = Score.player_scores(player.key)
        items = []
        score_forms = ScoreForms()
        for scr in scores:
            if scr.game_active:
                items.append(scr.to_form())
            else:
                pass
        score_forms.items = items
        return score_forms

    @endpoints.method(NUM_REQUEST,
                      PlayerScoresResponse,
                      path='get_high_scores/{num_req}',
                      name='get_high_scores',
                      http_method='GET')
    def get_high_scores(self, request):
        """
        Returns a sorted list of players and their cumulative scores
        Maximum return of 100 players
        """
        self.check_auth()
        return User.high_scores(request.num_req)

    @endpoints.method(NUM_REQUEST,
                      PlayersRankResponse,
                      path='get_user_rankings/{num_req}',
                      name='get_user_rankings',
                      http_method='GET')
    def get_user_rankings(self, request):
        """
        Returns a sorted list of players ranked by a rank index.
        Ties have been broken. Maximum return of 100 players
        """
        self.check_auth()
        return User.ranked_players_form(request.num_req)

    @endpoints.method(response_message=StringMessage,
                      path='games/average_attempts',
                      name='get_average_attempts_remaining',
                      http_method='GET')
    def get_average_attempts(self, request):
        """Get the cached average moves remaining"""
        self.check_auth()
        avg_attmpts = memcache.get('MOVES_REMAINING')
        if avg_attmpts:
            return StringMessage(message=avg_attmpts)
        else:
            return StringMessage(message='Average not set')

    @staticmethod
    def _cache_average_attempts():
        """
        Populates memcache with the average moves remaining of Games
        """
        scores = Score.query(Score.game_status != 'started').fetch()
        if scores:
            scount = len(scores)
            total_attempts_remaining = sum([(6-score.move_count)
                                            for score in scores])
            average = float(total_attempts_remaining)/scount
            memcache.set('MOVES_REMAINING',
                         'The average moves remaining is {:.2f}'.
                         format(average))
        else:
            memcache.set('MOVES_REMAINING',
                         'No games recorded')

    @endpoints.method(response_message=NothingHere,
                      name='z_test_api_service',
                      http_method='GET')
    def z_test_api_service(self, request):
        '''
        See if the API engine works. Returns message header  & empty JSON
        '''
        print "\nPING! API Service Is Working\n"

        void_form = NothingHere()
        return void_form
