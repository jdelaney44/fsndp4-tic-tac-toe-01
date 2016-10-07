""" ProtoRPC message class definitions for TicTicToe API. """

from protorpc import messages, message_types
import endpoints

"""Resource containers used for passing to the API from requester"""
"""Hopefully these names are self explanatory, nothing special here"""
GAME_REQUEST = endpoints.ResourceContainer(
    game_key=messages.StringField(1, required=True))


NEW_GAME_REQUEST = endpoints.ResourceContainer(
    player_email=messages.StringField(1, required=True))


MAKE_MOVE_REQUEST = endpoints.ResourceContainer(
    game_key=messages.StringField(1, required=True),
    board=messages.StringField(2, required=True))


USER_REQUEST = endpoints.ResourceContainer(
    user_name=messages.StringField(1),
    user_email=messages.StringField(2))


PLAYER_SCORE_REQUEST = endpoints.ResourceContainer(
    player_email=messages.StringField(1))


NUM_REQUEST = endpoints.ResourceContainer(
    num_req=messages.IntegerField(1, required=True))

""" Messages used for passing back from API to requester """


class BoardMessage(messages.Message):

    """ProtoRPC message definition to represent a board."""
    state = messages.StringField(1, required=True)


class GameFormResponse(messages.Message):

    """GameForm for outbound game state information"""
    urlsafe_key = messages.StringField(1, required=True)
    board = messages.StringField(2, required=True)
    message = messages.StringField(3, required=False)
    player_name = messages.StringField(4, required=True)
    player_email = messages.StringField(5, required=True)
    game_status = messages.StringField(6, required=True)


class GameForm(messages.Message):

    """Used to reset a game"""
    game_key = messages.StringField(1, required=True)


class GameFunctionForm(messages.Message):

    """Used for misc functions returning boolean only """
    game_key = messages.StringField(1, required=True)
    true_or_false = messages.BooleanField(2, required=True)


class MoveForm(messages.Message):

    """ With MovesForm used to return the moves of a completed game """
    board = messages.StringField(1, required=False)
    move_number = messages.IntegerField(2, required=False)


class MovesForm(messages.Message):

    """Return multiple MoveForm(s)"""
    items = messages.MessageField(MoveForm, 1, repeated=True)


class ScoreForm(messages.Message):

    """ScoreForm for outbound Score information"""
    player_name = messages.StringField(1, required=True)
    start_date = messages.StringField(2, required=True)
    end_date = messages.StringField(3, required=True)
    game_status = messages.StringField(4, required=True)
    move_count = messages.IntegerField(5, required=True)
    urlsafe_key = messages.StringField(6, required=True)
    game_active = messages.BooleanField(7, required=True)
    game_number = messages.IntegerField(8, required=True)


class ScoreForms(messages.Message):

    """Return multiple ScoreForm(s)"""
    items = messages.MessageField(ScoreForm, 1, repeated=True)


class StringMessage(messages.Message):

    """StringMessage-- outbound (single) string message"""
    message = messages.StringField(1, required=True)


class PlayerScoreResponse(messages.Message):

    """For returning player score"""
    player_email = messages.StringField(1, required=True)
    player_score = messages.IntegerField(2, required=True)


class PlayerScoresResponse(messages.Message):

    """For returning multiple PlayerScoreResponse(s)"""
    items = messages.MessageField(PlayerScoreResponse, 1, repeated=True)


class PlayerRankResponse(messages.Message):

    """For returning player rank"""
    player_email = messages.StringField(1, required=True)
    player_rank = messages.IntegerField(2, required=True)


class PlayersRankResponse(messages.Message):

    """For returning multiple PlayerRankResponse(s)"""
    items = messages.MessageField(PlayerRankResponse, 1, repeated=True)


class NumRequest(messages.Message):

    """Generic message for returning an integer"""
    num_req = messages.IntegerField(1, required=True)


class NothingHere(messages.Message):

    """Used for testing the API service"""
    pass
