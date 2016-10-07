# Python imports
from __builtin__ import classmethod, property
from helpers import string_to_list, list_to_string
import os
import random

# GAE Imports
from google.appengine.ext import ndb
from google.appengine.api.datastore import STRONG_CONSISTENCY

# Local imports
from api.api_messages import PlayerRankResponse, PlayersRankResponse,\
    PlayerScoreResponse, PlayerScoresResponse
from score import Score

# Constants
"""
MIN_SLICE_SIZE- lower limit when truncating email strings for
privacy purposes, prevents single or zero character strings
from ultimately appearing in the UI
CLIP_SIZE - the number of characters clipped from the end of the part of the
email string to the left of '@'
"""
MIN_SLICE_SIZE = 3
CLIP_SIZE = 2


class User(ndb.Model):

    """User profile"""
    name = ndb.StringProperty()
    email = ndb.StringProperty(required=True)
    cumulative_score = ndb.IntegerProperty(required=True, default=0)
    games_played = ndb.IntegerProperty(required=True, default=0)
    games_won = ndb.IntegerProperty(required=True, default=0)
    games_lost = ndb.IntegerProperty(required=True, default=0)
    rank_index = ndb.IntegerProperty(required=True, default=0)

    @classmethod
    def __promote_player(cls, player):
        """Promotes the player winning the tie breaker"""
        rank = player.rank_index
        rank = rank+1
        player.rank_index = rank
        player.put()

    @classmethod
    def __swap_players(cls, player, player_list, index):
        """Used to reorder players in a list during tie breaker"""
        # player0 is the player to be moved down the list one position
        # index is the current location of player0
        player_list.insert(index, player)
        player_list.pop(index+2)
        return player_list

    @classmethod
    def __roll_the_dice(cls, plyr0, plyr1, plyr_list, i):
        """Randomly chooses a player to promote in tie breaking"""
        # roll the dice!
        dice = [plyr0, plyr1]
        random.shuffle(dice)
        rand_plyr = dice[0]
        User.__promote_player(rand_plyr)
        # if rand_plyr is plyr1 then move plyr1 closer to top of list
        if rand_plyr.key == plyr1.key:
            User.__swap_players(plyr1, plyr_list, i+1)
        return plyr_list

    @classmethod
    def __get_ranked_list_no_ties(cls, return_limit):
        """Returns a ranked list of users with any ties resolved"""
        rank_query = User.query().order(-User.rank_index)
        plyrs_rnkd = rank_query.fetch(
            return_limit, read_policy=STRONG_CONSISTENCY)
        i = 0
        while (i < len(plyrs_rnkd)-1) and (len(plyrs_rnkd) > 1):
            plyr0 = plyrs_rnkd[i]
            plyr1 = plyrs_rnkd[i+1]
            # is there a tie?
            if (plyr0.rank_index == plyr1.rank_index):
                # can we do a win / loss calculation?
                if (plyr0.games_lost != 0) and (plyr1.games_lost != 0):
                    # attempt to resolve tie based on win / loss
                    plyr0wl = plyr0.games_won / plyr0.games_lost
                    plyr1wl = plyr1.games_won / plyr1.games_lost
                    if plyr1wl > plyr0wl:
                        User.__promote(plyr1)
                        plyrs_rnkd = User.__swap_players(plyr1,
                                                         plyrs_rnkd, i+1)
                    elif plyr0wl > plyr1wl:
                        User.promote(plyr0)
                    else:
                        plyrs_rnkd = User.__roll_the_dice(plyr0, plyr1,
                                                          plyrs_rnkd, i)
                else:
                    plyrs_rnkd = User.__roll_the_dice(plyr0, plyr1,
                                                      plyrs_rnkd, i)
            i = i+1
        plyrs_rnkd = rank_query.fetch(
            return_limit, read_policy=STRONG_CONSISTENCY)
        return plyrs_rnkd

    @classmethod
    def __clip_email(self, player_email):
        """Truncate e-mail as it may be displayed in a list or table"""
        slice_i = player_email.index('@')
        mllen = len(player_email)
        if slice_i > MIN_SLICE_SIZE:
            slice_i = slice_i - CLIP_SIZE
        short_email = player_email[:slice_i]
        short_email = string_to_list(short_email)
        random.shuffle(short_email)
        short_email = list_to_string(short_email)
        return short_email

    @classmethod
    def ranked_players_form(cls, return_limit):
        """Puts ranked player list into a message for the API to return"""
        if return_limit > 100:
            return_limit = 100
        ranked_list = User.__get_ranked_list_no_ties(return_limit)
        items = []
        for player in ranked_list:
            # populate message / form object with player rank data
            player_form = PlayerRankResponse()
            player_form.player_email = User.__clip_email(player.email)
            player_form.player_rank = player.rank_index
            items.append(player_form)
        players_form = PlayersRankResponse()
        players_form.items = items
        return players_form

    @classmethod
    def high_scores(cls, return_limit):
        """Returns a message containing the top scores"""
        if return_limit > 100:
            return_limit = 100
        scores_qry = User.query().order(-User.cumulative_score)
        items = []
        for scr in scores_qry.fetch(return_limit,
                                    read_policy=STRONG_CONSISTENCY):
            score_form = PlayerScoreResponse()
            score_form.player_email = User.__clip_email(scr.email)
            score_form.player_score = scr.cumulative_score
            items.append(score_form)
        scores_form = PlayerScoresResponse()
        scores_form.items = items
        return scores_form
