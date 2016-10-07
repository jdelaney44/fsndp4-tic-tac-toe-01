
import random

winning__rows = [[0, 1, 2], [3, 4, 5], [6, 7, 8],
                 [0, 3, 6], [1, 4, 7], [2, 5, 8],
                 [2, 4, 6], [0, 4, 8]]

player_mark = 'X'
machine_mark = 'O'


def check_for_win(board, win_rows, player_mark, game_status):
    """ Checks to see if a winning row is present """
    row_list = []
    for row in win_rows:
        for s in row:
            row_list.append(board[s])
        # print 'row_list = ' + str(row_list)
        if row_list.count(player_mark) == 3:
            game_status = 'player_win'
            print('Player Won!')
            break
        else:
            row_list = []
        if game_status == 'started':
            if board.count("-") == 0:
                game_status = 'tie'
    return game_status


def win_or_block(board, win_rows, test_mark, move_mark):
    """
    Check for both a possible winning move or a possible
    blocking move that the machine should make & makes
    that move. Differentiate these moves with the space
    marking characters used for test_mark and move_mark.
    To check for a winning move the machine_mark is used for
    both. The check for a block use the player_mark for the
    test_mark.
    """

    msg = 'Blocking'
    if test_mark == move_mark:
        msg = 'Winning'
    print('\nChecking for ' + msg + ' move')
    move = False
    for row in win_rows:
        # print '\n>>> Row: ' + str(row)
        ms = -1
        c = 0
        row_string = ''
        for i in row:
            mark = board[i]
            # print 'mark: ' + mark
            row_string = row_string + mark
            # print ('row_string = ' + row_string)
            if mark == '-':
                ms = i

            ####

            if mark == test_mark:
                c = c + 1
                # print 'c = ' + str(c)
                if c == 2:
                    move = True
                    c = 0
        if move:
            # print('Attempting ' + msg + ' Move')
            # print 'ms = ' + str(ms)
            if ms >= 0:
                board[ms] = move_mark
                ms = -1
                break
            else:
                print('OK, No open space found in row,' +
                      'board is not being updated')
            move = False
        else:
            pass
            # print ('No ' + msg + ' move found in row\n')

    # needs to return game_status, right? No ...
    return board, move


def corner_move(board, move_mark):
    """ Check corners & make a corner move if open """
    corners = [0, 2, 6, 8]
    move = False
    i = 1
    while not move and i <= 20:
        ms = random.choice(corners)
        # print 'ms = ' + str(ms)
        if board[ms] == '-':
            board[ms] = move_mark
            move = True
            break
        i = i + 1
    return board, move


def center_move(board, move_mark):
    """ Check center square & make that move if open """
    move = False
    if board[4] == '-':
        board[4] = move_mark
        move = True
    return board, move


def side_move(board, move_mark):
    """ Check for a side move and make one if open """
    sides = [1, 3, 5, 7]
    move = False
    i = 1
    while not move and i <= 20:
        ms = random.choice(sides)
        # print 'ms = ' + str(ms)
        if board[ms] == '-':
            board[ms] = move_mark
            move = True
            break
        i = i + 1
    return board, move
