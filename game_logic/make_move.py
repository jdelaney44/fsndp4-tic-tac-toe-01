from helpers import string_to_list, save_board
from results import record_result
from moves import check_for_win, win_or_block, corner_move,\
    center_move, side_move, winning__rows, player_mark, machine_mark


def make_move(game_key):
    """ This sequentially calls the move functions in a strategic order """

    game = game_key.get()
    game_status = 'started'

    # Let's do a little set up
    # Convert the board string to a list for processing
    board_list = string_to_list(game.board)

    # Check for winning move by player or a tie
    # move = False
    game_status = check_for_win(
        board_list, winning__rows, player_mark, game_status)
    record_result(game_key, game_status)
    game = game_key.get()
    if game.game_status == 'player_win':
        return game_key

    # Check for a winning move & make it
    [board_list, move] = win_or_block(board_list, winning__rows,
                                      machine_mark, machine_mark)

    if move:
        # The machine game_status at this point
        game_status = 'machine_win'
        save_board(board_list, game_key)
        record_result(game_key, game_status)
        return game_key

    # Check for a blocking move & make it if a game_status was not found
    if not move:
        [board_list, move] = win_or_block(board_list, winning__rows,
                                          player_mark, machine_mark)

    # Look for a corner move for the machine to make
    if not move:
        [board_list, move] = corner_move(board_list, machine_mark)

    # See if the center space is still open
    if not move:
        [board_list, move] = center_move(board_list, machine_mark)

    # Check the side spaces
    if not move:
        [board_list, move] = side_move(board_list, machine_mark)

    if not move:
        print '\nAll moves have been checked' + \
            'but a move does not seem to have been made\n'

    save_board(board_list, game_key)
    return game_key
