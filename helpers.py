

def save_board(board_list, game_key):
    """ Saves the board state to db """
    game = game_key.get()
    board = list_to_string(board_list)
    game.board = board
    game.put()


def string_to_list(string_in):
    """ Converts a string to a list """
    list_out = []
    for ch in string_in:
        list_out.append(ch)
    return list_out


def list_to_string(list_in):
    """ Converts a list to a string """
    string_out = ''
    for tu in list_in:
        string_out = string_out + str(tu)
    return string_out
