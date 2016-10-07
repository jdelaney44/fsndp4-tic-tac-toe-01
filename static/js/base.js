/**
 * @fileoverview
 * Provides methods for the TicTacToe sample UI and interaction with the
 * Tic Tac Toe API in tactactoe_api.py
 *
 * 
 */
// TODO: File needs to be modularized, really ...
// TODO: Need to sort out a callback approach so the game message is more intuitive

/** fsnd global namespace for this project. */
var fsnd = fsnd || {};

/** Tic Tac Toe (t3) namespace for this project. */
fsnd.t3 = fsnd.t3 || {};

/**
 * Namespace global variables initialization
 */

fsnd.t3.gameKey = null;
fsnd.t3.gameStatus = null;

/**
 * Array for playing back previous game moves
 */
fsnd.t3.gameMoves = [];
fsnd.t3.currentMove = 0;
fsnd.t3.nextMove = 0;
fsnd.t3.lastMove = 0;

/**
 * Whether or not the user is signed in.
 */
fsnd.t3.SIGNED_IN = false;
/**
 * Whether or not the game will allow a user's move
 * Safety device to  prevent asynchronous calls to server
 */
fsnd.t3.waitingForMove = false;
/**
 * Scores array for the player
 */
fsnd.t3.scores = []; 

/**
 * String for the contents of the game board squares
 */
fsnd.t3.gameBoard = '';

/**
 * User message & label constants
 */
fsnd.t3.REPLAY_MESSAGE = 'Play Back Mode - Move# ';
fsnd.t3.REPLAY_GO_BACK_BTN = ' ' + '&#x25a0' + ' ';


/**
 * Event  handling functions
 * Allows for more flexible & modular use of other UI functions
 */

/**
 * Handles a game board square click.
 */
fsnd.t3.handleSquareClick = function(e) {
    $('body').css('cursor', 'progress');
    fsnd.t3.lockBoard();
    if (fsnd.t3.waitingForMove) {
        var button = e.target;
        button.innerHTML = 'X';
        button.onclick=fsnd.t3.handleSquareClick;
        var boardString = fsnd.t3.getBoardString();
        fsnd.t3.waitingForMove = false;
        fsnd.t3.getComputerMove(boardString);   
    }
    $('body').css('cursor', 'auto');
}

/**
 * Handles a click of the New Game button
 */
fsnd.t3.handleNewGameClick = function(e) {
    fsnd.t3.getNewGame();
    fsnd.t3.showMessage('Making A New Game ...');
    //fsnd.t3.hideGameMessage();
    fsnd.t3.lockBoard();
    fsnd.t3.hideCancelButton();
    fsnd.t3.hideResetButton();
}

/**
 * Handles a click of the Reset button
 */
fsnd.t3.handleResetGameClick = function(e) {
    fsnd.t3.resetGame();
    fsnd.t3.showMessage('Resetting Game ...');
    // fsnd.t3.hideGameMessage();
    fsnd.t3.lockBoard();
    fsnd.t3.hideCancelButton();
    fsnd.t3.hideResetButton();
}

/**
 * Handles click of the Cancel button
 */
fsnd.t3.handleCancelGameClick = function(e) {
    fsnd.t3.lockBoard();
    fsnd.t3.showMessage('Cancelling Game ...');
    // fsnd.t3.hideGameMessage();
    fsnd.t3.hideCancelButton();
    fsnd.t3.hideResetButton();
    fsnd.t3.cancelGame();
}

/**
 * Handles a click on the Hide button in the Games tab
 */
fsnd.t3.handleHideGamesClick = function(e) {
    if (document.querySelector('input[name="hide_game"]:checked')){
        fsnd.t3.lockHideGamesBtn();
        fsnd.t3.deactivateGames();
    } else {
	fsnd.t3.showMessage('Please select a game first');
    };
}

/**
 * Handles a click on the Replay Game button in the Games tab
 */
fsnd.t3.handleReplayGameClick = function(e) {
    var radio_buttons = document.querySelectorAll('input.replay_game');
    //
    if (document.querySelector('input[name="replay_game"]:checked')){
        for (var i = 0; i < radio_buttons.length; i++) {
            var rb = radio_buttons[i];
            rb.disabled = "true";
        }
        fsnd.t3.getGameHistory();
        fsnd.t3.setForwardButton();
        fsnd.t3.hideResetButton();
        fsnd.t3.lockHideGamesBtn();
        fsnd.t3.setGoBack();
    } else {
	fsnd.t3.showMessage('Please select a game first');
	
    };
}

/**
 * Handles a click on the Exit button that is present in replay mode
 */
fsnd.t3.handleReplayGoBackClick = function(e) {
    fsnd.t3.setBoardEnablement(true);
    fsnd.t3.initBoard();
    fsnd.t3.lockBoard();
    //fsnd.t3.queryScores();
    fsnd.t3.setHideGamesBtn();
    fsnd.t3.setReplayGameBtn();
    fsnd.t3.enableGameRadios();
    fsnd.t3.showMessage("Click New Game To Play More");
}

/**
 * Handles a click on the Next Move >> button that is present in replay mode
 */
fsnd.t3.handleGameForwardClick = function(e) {
    num_moves = fsnd.t3.gameMoves.length;
    if (fsnd.t3.nextMove < num_moves) {
        fsnd.t3.lastMove = fsnd.t3.lastMove + 1;
        fsnd.t3.currentMove = fsnd.t3.currentMove + 1;
        fsnd.t3.nextMove = fsnd.t3.nextMove + 1;
    } else {
        fsnd.t3.lastMove = num_moves;
        fsnd.t3.currentMove = 1;
        fsnd.t3.nextMove = 2;
    }
    board_string = fsnd.t3.gameMoves[fsnd.t3.currentMove].board;
    fsnd.t3.fillBoard(board_string);
    fsnd.t3.deactivateSquares();
    fsnd.t3.showMessage(fsnd.t3.REPLAY_MESSAGE + fsnd.t3.currentMove);
}

/**
 * The next three functions are for clicks on the tabs on the lower table
 */

fsnd.t3.handleLnTab1Click = function(e) {
    var button = document.querySelector("#tab-ln-1");
    var buttons = document.querySelectorAll(".li-ln");
    for (var i = 0; i < buttons.length; i++) {
        buttons[i].classList.remove("active")
    }
    fsnd.t3.queryScores();
    button.classList.add("active");
}

fsnd.t3.handleLnTab2Click = function(e) {
    var button = document.querySelector("#tab-ln-2");
    var buttons = document.querySelectorAll(".li-ln");
    for (var i = 0; i < buttons.length; i++) {
        buttons[i].classList.remove("active")
    }
    fsnd.t3.queryHighScores();
    button.classList.add("active");
}

fsnd.t3.handleLnTab3Click = function(e) {
    var button = document.querySelector("#tab-ln-3");
    if (button){
        var buttons = document.querySelectorAll(".li-ln");
        for (var i = 0; i < buttons.length; i++) {
            buttons[i].classList.remove("active")
        }
        fsnd.t3.queryRankedPlayers();
        button.classList.add("active");
    }
}

/**
 * Functions to set various element states
 */

/**
 * Sets the Game Message that appears below the board
 */
fsnd.t3.setGameMessage = function() {
    var game_message = document.querySelector('#game_message');
    game_message.setAttribute("style", "display:table-cell;");
}

/**
 * Hides the Game Message below the board
 */
fsnd.t3.hideGameMessage = function() {
    var game_message = document.querySelector('#game_message');
    game_message.setAttribute("style", "display:none;");
}

/**
 * Sets the New Game button
 */
fsnd.t3.setNewGameButton = function() {
    var button = document.querySelector('#board_btn_left_2');
    if (button){
        button.innerHTML = '<a>New Game</a>';
        button.onclick=fsnd.t3.handleNewGameClick;
        button.style.display = 'inline-block';
        button.style.minWidth = '7em';
    }
}

/**
 * Sets the Reset button
 */
fsnd.t3.setResetButton = function() {
    var button = document.querySelector('#board_btn_left_1');
    button.onclick=fsnd.t3.handleResetGameClick;
    button.innerHTML = '<a>Reset</a>';
    button.style.display = 'inline-block';
    button.style.minWidth = '7em';
}

/**
 * Hides the Reset button
 */
fsnd.t3.hideResetButton = function() {
    var button = document.querySelector('#board_btn_left_1');
    button.onclick = '';
    button.setAttribute("style", "display:none;");
}

/**
 * Sets the cancel button
 */
fsnd.t3.setCancelButton = function() {
    var button = document.querySelector('#board_btn_right_1');
    button.onclick=fsnd.t3.handleCancelGameClick;
    button.innerHTML = '<a>Cancel</a>';
    button.style.display = 'inline-block';
    button.style.minWidth = '7em';
}

/**
 * Hides the cancel button
 */
fsnd.t3.hideCancelButton = function() {
    var button = document.querySelector('#board_btn_right_1');
    button.onclick='';
    button.setAttribute("style", "display:none;");
}

/**
 * Sets the button used to hide games from the Games tab
 */
fsnd.t3.setHideGamesBtn = function() {
    var button = document.querySelector('#hide_button');
    button.onclick=fsnd.t3.handleHideGamesClick;
    button.blur();
}

/**
 * Locks the button used to hide games from the Games tab
 */
fsnd.t3.lockHideGamesBtn = function(){
    var button = document.querySelector('#hide_button');
    button.onclick=''; 
    button.blur();
}

/**
 * Sets the replay button
 */
fsnd.t3.setReplayGameBtn = function() {
    var button = document.querySelector('#replay_button');
    button.onclick=fsnd.t3.handleReplayGameClick;
    button.innerHTML = '<a>Get Game</a>';
    button.blur();
};

/**
 * Locks the replay button
 */
fsnd.t3.lockReplayGame = function() {
    var button = document.querySelector('#replay_button');
    button.onclick='';
    button.blur();
}

/**
 * Sets the button used to exit from the game replay mode
 */
fsnd.t3.setGoBack = function() {
    var button = document.querySelector('#replay_button');
    var button1 = document.querySelector('#board_btn_left_1');
    button.onclick=fsnd.t3.handleReplayGoBackClick;
    button.innerHTML = '<a>' + fsnd.t3.REPLAY_GO_BACK_BTN + '</a>';
    button1.onclick=fsnd.t3.handleReplayGoBackClick;
    button1.innerHTML = '<a>' + fsnd.t3.REPLAY_GO_BACK_BTN + '</a>';
    button1.style.display = 'inline-block';
    button1.style.minWidth = '5em';
    button.blur();
    button1.blur();
}

/**
 * Sets the button used for replaying previous game moves
 */
fsnd.t3.setForwardButton = function() {
    var button = document.querySelector('#board_btn_right_1');
    button.innerHTML = '<a>Next Move >></a>';
    button.onclick=fsnd.t3.handleGameForwardClick;
    button.style.display = 'inline-block';
    button.style.minWidth = '5em';
}

/**
 * The next three functions are for setting / resetting the state 
 * of the tabs on the lower table
 */

fsnd.t3.setLnTab1 = function() {
    var button = document.querySelector("#tab-ln-1");
    button.onclick=fsnd.t3.handleLnTab1Click;
    button.classList.add("active");
}

fsnd.t3.setLnTab2 = function() {
    var button = document.querySelector("#tab-ln-2");
    button.onclick=fsnd.t3.handleLnTab2Click;
    button.classList.remove("active");
}

fsnd.t3.setLnTab3 = function() {
    var button = document.querySelector("#tab-ln-3");
    button.onclick=fsnd.t3.handleLnTab3Click;
    button.classList.remove("active");
}

/**
 * Sets all the tabs on the lower table using the three previous functions
 */
fsnd.t3.setLowerNavButtons = function() {
    fsnd.t3.setLnTab1();
    fsnd.t3.setLnTab2();
    fsnd.t3.setLnTab3();
}

/**
 * Removes HTML from the lower table where scores & ranks are displayed
 */
fsnd.t3.clearLowerTableBody = function() {
    var lower_table_body = document.getElementById("lower_table_body");
    lower_table_body.innerHTML = "";
    return lower_table_body;
}


/**
 * Highlights the row in the lower score table to show which game is in either play
 * or is being replayed / played back
 */
fsnd.t3.markActiveRow = function(){
	var history = document.getElementById("lower_table_body");
	for (var i = 0; i < history.childElementCount; i++){
		row = history.children[i];
		if (row.title == fsnd.t3.gameKey){
			row.id = 'lower_row_active_game';
		} else {
			row.id = '';
		};
	};	
}


/**
 * Utility function to renable the radio buttons. This is to allow players
 * to switch back and forth between games
 */

fsnd.t3.enableGameRadios = function(){
	var radio_buttons = document.querySelectorAll('input.replay_game');
    if (document.querySelector('input[name="replay_game"]:checked')){
        for (var i = 0; i < radio_buttons.length; i++) {
            var rb = radio_buttons[i];
            rb.removeAttribute('disabled');
        };
    };
}


/**
 * Function for interacting with the UI & server during game play and
 * other user interactions
 */

/**
 * Get's game from server & puts it in name space vars
 */
fsnd.t3.getNewGame = function() {
	fsnd.t3.initBoard();
	fsnd.t3.lockBoard();
    fsnd.t3.ttt.new_game({
        'player_email': fsnd.t3.CurrentUserEmail
    }).execute(function(game) {
        fsnd.t3.gameKey = game.urlsafe_key;
        fsnd.t3.gameStatus = game.game_status;
        fsnd.t3.gameBoard = game.board;
        fsnd.t3.waitingForMove = true;
        fsnd.t3.queryScores();
        fsnd.t3.setResetButton();
        fsnd.t3.setCancelButton();           
        fsnd.t3.fillBoard(fsnd.t3.gameBoard);
        fsnd.t3.showMessage(game.message);
        
    });
};

/**
 * Resets the game board & game record on server
 */
fsnd.t3.resetGame = function() {
    // if we have a game then reset it on the server
    if (fsnd.t3.gameKey) {
    	fsnd.t3.lockBoard();
        fsnd.t3.ttt.reset_game({
            'game_key': fsnd.t3.gameKey
        }).execute(function(game) {
            if (game) {
            	fsnd.t3.initBoard();
                fsnd.t3.fillBoard(game.board);
                fsnd.t3.setResetButton();
                fsnd.t3.setCancelButton();
                fsnd.t3.waitingForMove = true;
                fsnd.t3.unLockBoard();
                fsnd.t3.showMessage(game.message);
            };
        });
    };
};

/**
 * Flags games (active = False)
 */
fsnd.t3.deactivateGames = function() {
    var check_boxes = document.querySelectorAll('input.deactivate_game');
    for (var i = 0; i < check_boxes.length; i++) {
        var cb = check_boxes[i];
        if (cb.checked) {
            fsnd.t3.ttt.deactivate_game({
                'game_key': cb.value
            }).execute();
        }
    }
    fsnd.t3.queryScores();
}

/**
 * Flags games as cancelled
 */
fsnd.t3.cancelGame = function() {
    if (fsnd.t3.gameKey) {
        fsnd.t3.ttt.cancel_game({
            'game_key': fsnd.t3.gameKey
        }).then(function(resp) {
            fsnd.t3.getNewGame();
        });
    }
}

/**
 * Gets the computer's move from the server
 */
fsnd.t3.getComputerMove = function(boardString) {
	fsnd.t3.lockBoard();
    fsnd.t3.showMessage("Machine's Turn ...");
    fsnd.t3.ttt.make_move({
        'game_key': fsnd.t3.gameKey,
        'board': boardString
    }).then(
        function(game) {
        	fsnd.t3.lockBoard();
            fsnd.t3.fillBoard(game.result.board);
            $('body').css('cursor', 'auto');
            fsnd.t3.showMessage(game.result.message);
            var status = game.result.game_status;
            if ((status == 'machine_win') || (status == 'player_win') || (status == 'tie')) {
                fsnd.t3.waitingForMove = false;
                fsnd.t3.hideCancelButton();
                fsnd.t3.hideResetButton();
                fsnd.t3.setNewGameButton();
                fsnd.t3.queryScores();
            } else {
                fsnd.t3.waitingForMove = true;
                row = document.getElementById('lower_row_active_game');
                count = row.children[2].innerHTML-0;
                count++;
                row.children[2].innerHTML = count;
                fsnd.t3.unLockBoard();
            };
        });
};

/**
 * Get's the scores for a player, active games
 */
fsnd.t3.getPlayerScore = function() {
    fsnd.t3.ttt.get_player_score({
        'player_email': fsnd.t3.CurrentUserEmail
    }).then(function(resp) {
        var label = document.getElementById("user_score");
        label.innerHTML = resp.result.player_score;
    });
}

/**
 * Get's the moves of a previous played game for replay
 */
fsnd.t3.getGameHistory = function() {
    var radio_buttons = document.querySelectorAll('input.replay_game');
    for (var i = 0; i < radio_buttons.length; i++) {
        var rb = radio_buttons[i];
        if (rb.checked) {
        	// if the game is started go play it
        	if(rb.value == 'started'){
        		fsnd.t3.ttt.get_game({
        			'game_key': rb.id
        		}).then(
        				function(game){
        		            if (game) {
        		            	fsnd.t3.gameKey = game.result.urlsafe_key;
        		            	fsnd.t3.lockBoard();
        		            	fsnd.t3.initBoard();
        		                fsnd.t3.fillBoard(game.result.board);
        		                fsnd.t3.setResetButton();
        		                fsnd.t3.setCancelButton();
        		                fsnd.t3.setReplayGameBtn();
        		                fsnd.t3.waitingForMove = true;
        		                fsnd.t3.showMessage(game.result.message);
        		                fsnd.t3.markActiveRow();
        		                fsnd.t3.enableGameRadios();
        		                fsnd.t3.unLockBoard();
        		                };
        				});
        	} else {
        		// go into replay / playback mode
        		fsnd.t3.gameKey = rb.id;
	            fsnd.t3.ttt.get_game_history({
	                'game_key': rb.id
	            }).then(
	                function(move_list) {
	                    fsnd.t3.gameMoves = move_list.result.items;
	                    if (fsnd.t3.gameMoves) {
	                        var moves = fsnd.t3.gameMoves.sort(function(a, b) {
	                            return a.move_number - b.move_number
	                        })
	                        board_string = fsnd.t3.gameMoves[1].board;
	                        fsnd.t3.fillBoard(board_string);
	                        fsnd.t3.deactivateSquares();
	                        fsnd.t3.markActiveRow();
	                        fsnd.t3.lastMove = move_list.length;
	                        fsnd.t3.currentMove = 1;
	                        fsnd.t3.nextMove = 2;
	                        fsnd.t3.showMessage(fsnd.t3.REPLAY_MESSAGE + fsnd.t3.currentMove);
	                    } else {
	                        fsnd.t3.showMessage("Server error, please refresh page");
	                    };
	                });
        	};
        };
    };
}

/**
 * Queries for results of previous games and populates the game history
 * element(s)
 */
fsnd.t3.queryScores = function() {
    var ltcl_1 = document.getElementById("ltcl_1");
    if(ltcl_1){
	    var ltcl_2 = document.getElementById("ltcl_2");
	    var ltcl_3 = document.getElementById("ltcl_3");
	    var ltcl_4 = document.getElementById("ltcl_4");
	    var ltcl_5 = document.getElementById("ltcl_5");
	    var ltcl_6 = document.getElementById("ltcl_6");
	    ltcl_1.innerHTML = "No.";
	    ltcl_2.innerHTML = "Status";
	    ltcl_3.innerHTML = "Moves";
	    ltcl_4.innerHTML = "<button type='button'" +
	        "class='btn btn-default btn-xs navbar-btn'" +
	        "id='replay_button' >" +
	        "Replay" +
	        "</button>";
	    ltcl_5.innerHTML = "<button type='button'" +
	        "class='btn btn-default btn-xs navbar-btn'" +
	        "id='hide_button' >" +
	        "Hide" +
	        "</button>";
	    //lower_table_body = fsnd.t3.clearLowerTableBody();
	    if (lower_table_body.childElementCount < 1){
	    	lower_table_body.innerHTML = "Please wait, getting scores ..."
	    };
	    fsnd.t3.setReplayGameBtn();
	    fsnd.t3.setHideGamesBtn();
	    fsnd.t3.getPlayerScore();
	    fsnd.t3.ttt.get_user_games({
	        "player_email": fsnd.t3.CurrentUserEmail
	    }).then(
	        function(resp) {
	            var history = document.getElementById("lower_table_body");
	            if (resp.result.items) {
	                lower_table_body = fsnd.t3.clearLowerTableBody();
	                var scores = resp.result.items.sort(function(a, b) {
	                    return b.game_number - a.game_number
	                })
	                for (var i = 0; i < scores.length; i++) {
	                    var si = scores[i];
	                    var score = document.createElement("tr");
	                    score.title = si.urlsafe_key;
	                    score.innerHTML = "<td>" + si.game_number + "</td>" +
	                        "<td>" + si.game_status + "</td>" +
	                        "<td name='count'>" + si.move_count + "</td>" +
	
	                        "<td>" + "<input type = 'radio' " +
	                        "name='replay_game' " +
	                        "class='replay_game' " +
	                        "id='" + si.urlsafe_key + "'" +
	                        "value='" + si.game_status + "'>" + "</td>" +
	
	                        "<td><input type='checkbox' " +
	                        "name='hide_game' " +
	                        "class='deactivate_game' " + 
	                        "value='" +  si.urlsafe_key + "'></td>";
	                    lower_table_body.appendChild(score);
	                    // need to set tab active as this function is not always called by clicking the tab
	                    fsnd.t3.setLowerNavButtons();
	                    if (fsnd.t3.waitingForMove){
	                    	fsnd.t3.markActiveRow();
	                    	fsnd.t3.unLockBoard();
	                    	}
	                };
	            } else {
	                var lower_table_body = document.getElementById("lower_table_body");
	                lower_table_body.innerHTML = "No games yet";
	            };
	            
	        });
    };
    
}





/**
 * Queries for ranked Players and populates the UI with them
 */
fsnd.t3.queryHighScores = function() {
    var ltcl_1 = document.getElementById("ltcl_1");
    var ltcl_2 = document.getElementById("ltcl_2");
    var ltcl_3 = document.getElementById("ltcl_3");
    var ltcl_4 = document.getElementById("ltcl_4");
    var ltcl_5 = document.getElementById("ltcl_5");
    ltcl_1.innerHTML = "No.";
    ltcl_2.innerHTML = "Player";
    ltcl_3.innerHTML = " Score";
    ltcl_4.innerHTML = " ";
    ltcl_5.innerHTML = " ";
    lower_table_body = fsnd.t3.clearLowerTableBody();
    lower_table_body.innerHTML = "Please wait, getting scores ..."
    fsnd.t3.ttt.get_high_scores({
        "num_req": 10
    }).execute(
        function(resp) {
            var history = document.getElementById("lower_table_body");
            var lower_table_body = document.getElementById("lower_table_body");
            lower_table_body = fsnd.t3.clearLowerTableBody();
            if (resp.items) {
                var players = resp.items.sort(function(a, b) {
                    return b.game_number - a.game_number
                })
                for (var i = 0; i < players.length; i++) {
                    var player = players[i];
                    var tbl_row = document.createElement("tr");
                    tbl_row.innerHTML = "<td>" + (i + 1) + "</td>" +
                        "<td>" + player.player_email + "</td>" +
                        "<td>" + player.player_score + "</td>" +
                        "<td><a></a></td>" +
                        "<td><a></a></td>";
                    lower_table_body.appendChild(tbl_row);
                };
            } else {
                var lower_table_body = document.getElementById("scoreTable");
                lower_table_body.innerHTML = "No games yet";
            };
        });
}

/**
 * Queries for ranked Players and populates the UI with them
 */
fsnd.t3.queryRankedPlayers = function() {
    var ltcl_1 = document.getElementById("ltcl_1");
    var ltcl_2 = document.getElementById("ltcl_2");
    var ltcl_3 = document.getElementById("ltcl_3");
    var ltcl_4 = document.getElementById("ltcl_4");
    var ltcl_5 = document.getElementById("ltcl_5");
    ltcl_1.innerHTML = "Rank";
    ltcl_2.innerHTML = "Player";
    ltcl_3.innerHTML = "Index";
    ltcl_4.innerHTML = " ";
    ltcl_5.innerHTML = " ";
    lower_table_body = fsnd.t3.clearLowerTableBody();
    lower_table_body.innerHTML = "Please wait, getting rankings ..."
    fsnd.t3.ttt.get_user_rankings({
        "num_req": 10
    }).execute(
        function(resp) {
            var history = document.getElementById("lower_table_body");
            var lower_table_body = document.getElementById("lower_table_body");
            lower_table_body = fsnd.t3.clearLowerTableBody();
            if (resp.items) {
                var players = resp.items.sort(function(a, b) {
                    return b.game_number - a.game_number
                })
                for (var i = 0; i < players.length; i++) {
                    var player = players[i];
                    var tbl_row = document.createElement("tr");
                    tbl_row.innerHTML = "<td>" + (i + 1) + "</td>" +
                        "<td>" + player.player_email + "</td>" +
                        "<td>" + player.player_rank + "</td>" +
                        "<td><a></a></td>" +
                        "<td><a></a></td>";
                    lower_table_body.appendChild(tbl_row);
                }
            } else {
                var lower_table_body = document.getElementById("lower_table_body");
                lower_table_body.innerHTML = "No games yet";
            };
        });
}


/**
 * Functions for UI set up & management below here
 */
fsnd.t3.deactivateSquares = function() {
    var buttons = document.querySelectorAll('td.square');
    for (var i = 0; i < buttons.length; i++) {
        var button = buttons[i];
        button.onclick='';
    };
}


/**
 * Locks the board between moves, games, etc.
 */
fsnd.t3.lockBoard = function() {
    var buttons = document.querySelectorAll('td.square');
    if (buttons.length>0){
	    for (var i = 0; i < buttons.length; i++) {
	        var button = buttons[i];
	        button.onclick='None';
	        if (button.style.backgroundColor == "rgb(255, 255, 255)") {
	            button.style.backgroundColor = "rgb(233, 233, 233)";
	        };
	    };
    };
}

/**
 * Unlocks the board for play
 */
fsnd.t3.unLockBoard = function() {
    var buttons = document.querySelectorAll('td.square');
    for (var i = 0; i < buttons.length; i++) {
        var button = buttons[i];
        button.onclick=fsnd.t3.handleSquareClick;
        if (button.style.backgroundColor == "rgb(233, 233, 233)") {
            button.style.backgroundColor = "rgb(255, 255, 255)";
        };
    };
}

/**
 * This consolidates the functions used to do the first UI initialization
 */
fsnd.t3.initBoard = function() {
    var buttons = document.querySelectorAll('td.square');
    if (buttons.length>0){
        for (var i = 0; i < buttons.length; i++) {
            var button = buttons[i];
            button.style.backgroundColor = "rgb(255, 255, 255)"
            button.innerHTML = '-';
        }
        fsnd.t3.setNewGameButton();
        fsnd.t3.hideCancelButton();
        fsnd.t3.hideResetButton();
        // fsnd.t3.setReplayGameBtn();
        // fsnd.t3.setHideGamesBtn();
        // fsnd.t3.setLowerNavButtons();
    };
}


/**
 * Shows or hides the board and game elements. Used for conditions such as the
 * game being initialized or after the game is over and is awaiting user action,
 * like a reset.
 */
fsnd.t3.setBoardEnablement = function(state) {
    if (!state) {
        var board = document.getElementById('board')
        if(board){
	        board.classList.add('hidden');
	        document.getElementById('lower_board_wrapper').classList.add('hidden');
	        document.getElementById('auth_warning').classList.remove('hidden');
        };
    } else {
        var board = document.getElementById('board')
        if(board){
            board.classList.remove('hidden');   
            document.getElementById('lower_board_wrapper').classList
                .remove('hidden');
            document.getElementById('auth_warning').classList.add('hidden');
        };
    }
}


/**
 * Fills the squares of the board with the contents of the boardString
 */
fsnd.t3.fillBoard = function(boardString) {
    // fsnd.t3.unLockBoard()
    var buttons = document.querySelectorAll('td.square');
    if (buttons){
        for (var i = 0; i < buttons.length; i++) {
            var button = buttons[i];
            button.innerHTML = boardString.charAt(i);
            //
            button.style.backgroundColor = "#ffffff";
            button.style.hover = "#D3E3E8";
            if (button.innerHTML == 'X') {
                button.onclick='';
                button.style.backgroundColor = "#b3d9ff";
            }
            if (button.innerHTML == 'O') {
                button.onclick='';
                button.style.backgroundColor = "#ffcc99";
            };
        };
    };
}

/**
 * Gets the current representation of the board from the HTML document
 */
fsnd.t3.getBoardString = function() {
    var boardStrings = [];
    var buttons = document.querySelectorAll('td.square');
    for (var i = 0; i < buttons.length; i++) {
        boardStrings.push(buttons[i].innerHTML);
    };
    return boardStrings.join('');
}


/**
 * Checks to see if a user exists, creates user if not
 */
fsnd.t3.createUser = function() {
    var user_email = fsnd.t3.CurrentUserEmail;
    var user_name = fsnd.t3.CurrentUserName;
    fsnd.t3.ttt.create_user({
        'user_name': user_name,
        'user_email': user_email
    }).execute(function(message) {
        fsnd.t3.queryScores();
        fsnd.t3.showMessage(message.message);
    });
}


/**
 * Displays response messages to player
 */
fsnd.t3.showMessage = function(message) {
    var game_message = document.getElementById('game_message');
    if (game_message){
	    game_message.innerHTML = message;
	    fsnd.t3.setGameMessage();
    };
};

/**
 * Initializes the application.
 */
fsnd.t3.init = function(apiRoot, email) {
    var callback = function() {
        fsnd.t3.ttt = gapi.client.tictactoe_api;
        document.getElementById('user_label').innerHTML = '<a>' + email + '</a>';
        fsnd.t3.setBoardEnablement(true);
        fsnd.t3.createUser();
        fsnd.t3.initBoard();
        fsnd.t3.lockBoard();

    };
    gapi.client.load('tictactoe_api', 'v1', callback, apiRoot);
}