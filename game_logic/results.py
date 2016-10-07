
import datetime


def record_result(game_key, game_status):
    game_key = game_key.get()
    score_key = game_key.score_key.get()
    player_key = game_key.player.get()
    now = datetime.datetime.now()
    mv_count = score_key.move_count
    mv_count = mv_count + 1
    score_key.move_count = mv_count
    # update the game_status
    game_key.game_status = game_status

    if game_status != 'started':
        # if the game is complete do this
        score = 6-mv_count
        # update No. of games played for player
        games_played = player_key.games_played
        games_played = games_played + 1
        player_key.games_played = games_played
        # set the end date & time of the game
        score_key.end_date = now
        # set the score of the game
        score_key.score = score

        if game_status == 'tie':
            rank_index = player_key.rank_index
            rank_index = rank_index + 1
            player_key.rank_index = rank_index

        elif game_status == 'player_win':
            # update player score fields
            cumulative_score = player_key.cumulative_score
            cumulative_score = cumulative_score + score
            player_key.cumulative_score = cumulative_score
            games_won = player_key.games_won
            games_won = games_won + 1
            player_key.games_won = games_won
            rank_index = cumulative_score + games_won + 1
            player_key.rank_index = rank_index

        elif game_status == 'machine_win':
            games_lost = player_key.games_lost
            games_lost = games_lost + 1
            player_key.games_lost = games_lost

    game_key.put()
    player_key.put()
    # put score_key last due to computed fields on Score object
    score_key.put()
