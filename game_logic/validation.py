
def moves_valid(request, last_board):
    """Checks that a requested move is okay"""
    is_valid = True
    space_holders = ('X', 'O')
    board = request.board
    if board == last_board:
        return False
    else:
        i = 0
        while i < len(last_board):
            if last_board[i] in space_holders:
                if last_board[i] == board[i]:
                    is_valid = True
                else:
                    is_valid = False
                    break
            i = i+1
    return is_valid
