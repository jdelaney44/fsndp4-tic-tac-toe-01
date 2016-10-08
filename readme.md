##Welcome to TicTacToe##
This is the repo for my Udacity FSND project 4 (old structure), Design a Game submittal. This project has been implemented as a Tic Tac Toe game. This game is deployed on `appspot.com`. URL forwarded to project reviewer privately.

Known Issues:

  Private / Incognito Modes:
    * This is not really an issue as much as it's a design limitation of private browsing. Since private browsing modes are specifically designed to prevent services from writing to or reading from local storage Google's Javascript API, which manages authentication, fails. I am researching ways, if any, around this. Seems like, yes, users should be able to have their cake and eat it too if possible. 

    I am going to have to learn more about the guts of the browser for sure. 

  Safari- 
    * In testing one user on an iPhone 6, IOS 10.0.2 cannot get past authentication. 

    Other than some inherent GAE slowness everything on Chrome & Firefox appears to work okay. I may move this to hybrid Google Firebase / GCP model or a more standard Linux, Apache, PostgreSQL, Python stack sometime in November of 2016 depending on other work load. 


Sections of this readme requiring additional information or detail will contain either links to 3rd party source documents or links to this project's Wiki pages. We're going to try to keep this readme brief but useful.

##Playing the game:##
Option One - Access the URL supplied in the submittal notes,
Option Two - Run the app locally under 'dev_appserver.py' which is supplied with the Google Cloud SDK. Instruction for this below.

##Assumptions:##
I am assuming the reader is knowledgable in the following:
1. Intermediate PC or Mac use including good familiarity with file system concepts and use
2. Use of Git and Github,
3. How to open & use a Unix or Windows shell / command line environment,
4. Operation of programs that are run from a command line,
5. Internet access & searching,
6. Some knowledge of Python, HTML, Javascript, and CSS although that is not required to start & play the game

Author's Note: This document is written from the perspective of a Mac OSX user. Hopefully most of the concepts tranfer to Windows fairly well.

##Installation & Testing:##
###Get the code:###
Fork this project to your git hub account and / or clone it to the working directory where you wish it to reside.

If you are not using Git then download the ZIP file from Github (look for the button up and to the right from this readme as displayed on Github). Then unzip it to your working directory.

###Install the Google Cloud Platform (GCP) SDK:###
* Download the SDK from Google [at ths link](https://cloud.google.com/sdk/?hl=en_US&_ga=1.113483911.1087382425.1473167080#download)
* Optionally
  * Check for where the app installed. You should be able to see a `/usr/local/google_appengine` directory.
  * Check your path to be sure there is an entry for `/usr/local/google_appengine:` You can do this at the command prompt with the command `echo $PATH`.

###Required Python Modules:###
No modules or packages are required for this project beyond those included by the Google Cloud environment and the local 'dev_appserver'. To be clear, this does not mean packages are not required, simply that Google has included all the packages used as builtins at this time.

##Running the app locally##
###Starting the dev_appserver###

1. In your command shell / terminal app `cd` to a directory one level above where the application files are located. The directory where the application is located is assumed to have the same name as the application. This would normally have been created by the `git clone` process mentioned above.

2. At the command prompt execute this:
  `dev_appserver.py fsndp4-tic-tac-toe-01`

The `dev_appserver` should start and the resulting output will look something like this. On the first run there may be some warnings about indexes being unreadable. Indexes are created after the data base is initialized, so this is normal and should resolve itself. 

```
INFO     2016-09-15 16:02:47,065 sdk_update_checker.py:229] Checking for updates to the SDK.
INFO     2016-09-15 16:02:47,227 sdk_update_checker.py:257] The SDK is up to date.
INFO     2016-09-15 16:02:47,256 api_server.py:205] Starting API server at: http://localhost:63107
INFO     2016-09-15 16:02:47,259 dispatcher.py:197] Starting module "default" running at: http://localhost:8080
INFO     2016-09-15 16:02:47,263 admin_server.py:116] Starting admin server at: http://localhost:8000
```
As the application is used, various messages will scroll through this window. This is your clue that `dev_appserver` is still running. 


###Accessing the game UI###
1. Open `http://localhost:8080/`
2. Click on the **Login** button on the upper right
3. Click on the New Game button as prompted, and away you go!

See the section on Game Play & Operation for some information on how the various user interface components, scoring, and ranking work. 

###Accessing the API Explorer###
See the section on API use & operation for detailed information on using the APIs
1. Open `http://localhost:8080/_ah/api/explorer`
2. Look at the right side of URL bar of Chrome. There should be a small icon there that looks like a small shield. Click on that.
3. Then click on the  **Allow unsafe scripts** button.<sup>1</sup>
4. On the page below the HTTP warning you should now see a selection for **tictactoe_api API**, click on that.
5. Now you should see a list of all the APIs.
6. At the bottom of the list clixk on `tictactoe_api.z_test_api_service` to test the API service.
7. No fields are required, click on **Authorize and execute** on the page and ***again*** in the pop up to make an API request.

The response should simply return `200 OK`

If all went as described above the local API service is working and the applications APIs are ready to use.

- - - 
##Game Play & Operation##
- - -
###Game Play###
A new game is signalled by a board with only dashes and a white background. You click in any square to begin play. The machine will respond with a move. User is always "X" with a blue background. The machine is always "O" with a light amber background.

Play proceeds until a win is detected. 

Then the game is saved & scored.

  **Canceling a game**

  A player can click on the Cancel button during a game. This will remove the game from view, scoring, and ranking. Partial games are kept for operational analysis later.

  **Reseting a game**

  A player can click on the Reset button during a game. This will clear the board of all moves and retain the same game. 

  **Refreshing the browser during a game**

  Refreshing the browser during a game, currently, has the effect of abandoning the game and leaving it in the scoring & ranking computations. It will be counted as a loss. Game recovery will be addressed in future versions. 

- - - 
###Game Operations###
- - - 
###Scoring###
Tic tac toe does not seem to have any uniform scoring methodologies. I have made one up as a result. Here's how this game is scoring.

- - -
**Winning Scores**

A players current cumulative score is displayed next to thge **Top** Ranks tab.

A players score is the six (6) minus the number of moves in the game you won, plus one bonus point for the win.

Machine scores are not tracked. 

Games are scored at the end of each game. Hiding games (below) does not impact either cumulative score or rankings.

- - -
**Loss, Tie, Cancel**

No score is recorded for games where the machine wins, there is a tie, or the game is cancelled. See Rankings for more in ties.

- - - 
###Ranking###
A players rank index is the cumulative score plus one point for each game won or tied. No rank is earned for lost games.

- - - 
###Game Replay###
By default or by clicking on the Games tab the players active game history is shown in a table below the game board. The the right are two columns one has a button called **Replay Game**

To replay the moves of a game, click on one of the round buttons in that column and click the ***Replay Game*** button.

Then a **Next Move >>** and an **Exit** button will appear below the board:
  * Clicking on the **Next Move >>** cycles through the moves of the selected game
  * Clicking on **Exit** return you to normal game play mode

- - -
###Hiding Games###
By default or by clicking on the Games tab the players active game history is shown in a table below the game board. The the right are two columns one has a button called **Hide**

To hide games from the grid click on one or more of the square check boxes in that column and then click on the **Hide** button. The games will be hidden. Again these games are retained in the data base for operational analysis. 

- - -
##API Use & Operation Overview##
There are several ways to access the APIs 
###API Explorer###
See above for how to access the API Explorer. This is useful for getting sense of the basic API arguments, returns, and order of operations

- - -
###Google JavaScript###
See the Demo Page section below for instructions on using the Google Javascript API to access the APIs programtically using Javascript.

- - - 
###Service Accounts###
Accessing the APIs programitically from some type of back end service is beyond the scope of this project currently. It is totally possible however. Your service will need to be able to authenticate using Google OAuth. Please see 
<span href="https://developers.google.com/identity/protocols/OAuth2ServiceAccount">this page as a start</span>

##The APIs - Introduction & Assumptions##
These APIs assume a developer is going to build something similar to the provided tic tac toe user interface or some other programmatic consumer. 

- - -
####Google authentication####
The APIs are secured using the Google endpoints API and the integrated Google OAuth libraries. Thus using them means the user or service accessing them must be authenticated with, typically via the Google plus API. I typilcally get authed by logging into Gmail, Google apps, or the Developers Console. 

If you are using API Explorer locally or on `appspot.com` to check these out you will be prompted to authenticate in case you are not logged in, so no worries there.

These APIs WILL FAIL if Google authenticated user credentials are not present in an auth object.

- - - 
####Order of operations:####
The APIs assume that two API calls are done in order, and before the rest of the APIs as follows:
1. create_user - must be called the first time a user / player is presented to the game
2. new_game - must be called after a user / player created and before many other APIs. new_game takes the players email as an argument and needs the e-mail to create a game. 
 
As you will see below, most of the APIs require either a user / player or game key / ID.

- - - 
- - -
##API Definition & Use Reference##

##User/Player & Game Setup, Play, and Management APIs##
- - -
##create_user##
- - -

**Args:**

user_name - string - The user's / player's name (optional)

user_email - string - The user's e-mail, must be unique to create a new user (required)

**http method** - "POST"

**Returns:**

message - string - Text message with the user / player key to be passed to UI or used programtically

**Example:**

```
{
 "message": "User Sponge Bob created! Click on New Game to begin"
}
```
On new user creation: `User [user_name] created! &#60;br&#62;Click on New Game to begin`
On submittal of duplicate: `Welcome back [user_name]! &#60;br&#62;Click on New Game to begin`

**About `create_user`**

If you don't have at least one user in the db, this needs to be called first.

It is intended to be passed a user's first and last name in `user_name` and the user's e-mail address in `user_email`.

Then `create_user` first checks the db for an existing e-mail.

  * If a match is found it returns a message as above.
  * If there is no match it puts a new user record to the db and returns a message as above.

The e-mail is independent of the authorized user so a service could be authenticated and create user records on behalf of it's users.

NOTE: for the ease in testing or playing in API Explorer any string will do (see below for notes on the one cron job that could be affected). In production, of course, you should ensure the e-mail is valid.

<!-- New Game ####################################################### -->

- - -
##new_game##
- - -

**Args:**

player_email - string - The player's e-mail

http method -** "POST"

**Returns:**

game - game - a list of the game fields. See below for a more detailed discussion of these


**Example:**

```
{
 "board": "---------",
 "game_status": "started",
 "message": "Click in any square to start.",
 "player_email": "email@gmail.com",
 "player_name": "name",
 "urlsafe_key": "ahlkZXZ-ZnNuZHA0LXRpYy10YWMtdG9lLTAxchELEgRHYW1lGICAgICAwK8KDA"
}
```

**About `new_game`**

When passed any string value in "player_email" it will attempt to find a user with an e-mail that matches the string. If successfull it will return a messsage containing the essential game fields.

As mentioned above the e-mail is independent of the authorized user so a service could be authenticated and create user records on behalf of it's users.

**Also**, `new_game` ques up a function called '_cache_average_attempts' which puts a value in the memchache in the key `MOVES_REMAINING`. This value is the average of the moves remaining in each game at completion.

The Game Fields - IMPORTANT**

`"board": "---------",`

This is a nine character representation of the game board. It must contain either "-" , "X", or "O". It is sequenced top to bottom, left to right, like so:

```
     0  |  1  |  2
   -----------------
     3  |  4  |  5
   -----------------  
     6  |  7  |  8
```

For example, a series of board strings leading to a 'machine_win' would be:
```
   "board": "---------"
   
   "board": "------X--"
   
   "board": "X-----X-O"
   
   "board": "XX-O--X-O"
   
   "board": "XXOOX-X-O"
```

This is discussed a bit more in `make_move`. At the bottom of the `make_move` section are several game string sequences to be used for testing

**Pros and Cons -** The advantage of doing it this way is that the entire board state is communcated at once. So you know that's what it should be. It's pretty easy to get the board from an HTML table or any visualization with elements that can be iterated. For instance an Excel range could be used.

The disadvantage is that it's not human friendly in the API Explorer and it initially seems difficult to visualize by looking at a series of board strings what moves were made. However it may be easier than reconstructing the moves from a series of key/value pairs such as [7,'X'].

I did assess the options and elected to go with the board string model deliberately based on the aforementioned data integrity argument. 

**Explanation of game fields**

`"game_status": "started",`

This is used to track the game status without having a bunch of boolean fields. Values are set server side and can be:

  * 'started' - This is the status when a game is created

  * 'player_win' - Status after the player has won, game is complete

  * 'machine_win' - Status after the machine has won, game is complete

  * 'cancelled' - Status after the `cancel_game` has been called 

`"message": "Click in any square to start.",`

Used to send messages from the server providing a more friendly status of what's going on with the game

  
`"player_email": "email@gmail.com",`

The email address of the player who owns the game


`"player_name": "name",`

The name of the player who owns the game


`"urlsafe_key": "ahlkZXZ-ZnNuZHA0LXRpYy10YWMtdG9lLTAxchELEgRHYW1lGICAgICAwK8KDA"`

The db key for the game. ***This is needed for several other APIs and should be stored somehow***


**Error Messages:**

"A User with that name does not exist." - This means a match for the submitted `player_email` could not be found. If this is the case, then `create_user` needs to be called first. This is a 404.

"Game could not be created by server." -  This means something really screwy was passed to the server or some other general failure occurred. I've actually not seen one of these but I expect it to be a 500 series.

<!-- Make Move ####################################################### --> 

- - -
##make_move##
- - - 

Makes a move. Returns the an updated "post move" game from the db
**Args:** 
game_key - string - a url safe db key for the game object
board - string - a nine character string representing the current state of the game board (see above).
Characters must be either "-", "X", or "O". See the return for an example.

**Returns:** 
game - a list of the game fields. See new_game for a more detailed discussion of these
**Example:**

```
{
 "board": "OX--O-XXO",
 "game_status": "machine_win",
 "message": "Sorry! Try again,  Human!",
 "player_email": "email@gmail.com",
 "player_name": "name",
 "urlsafe_key": "ahlkZXZ-ZnNuZHA0LXRpYy10YWMtdG9lLTAxchELEgRHYW1lGICAgICAyNcJDA"
}
```

**About `make_move`**

For purposes of using the API, once the arguement are submitted to it, assuming no errors, it returns a new game record with:


A `board_string` that has been populated with the machines move unless the player made a winning move. I which case the board_string would be the same as submitted.

A `game_status` populated with either 'started', 'player_win', or 'machine_win'

A `message` populated with one of the more user friendly game status messages

'Bad' Move Handling

Bad moves are:

  * An attempt to move 'over' a previous move. That would be an 'X' in a position where the last `board_string` passed back from an API had either an 'X' or an 'O' 

  * An attempt to pass in some other character besides a '-', 'X', or 'O'


When a bad move is submitted a message of "That move is not possible" is passed back out along with the current game record, which will have been unchanged (unless there was an asynchronous move executed somehow).

One way to leverage this is to pass the last returned boardstring to `make_move` to get hold of the game information between moves if needed. The all dashes board string is also safe since it would not modify a new game and would be a conflict for a game in progress. 

Basic Move Strategy

  * The functions called by make_move follow this basic sequence:

  * Check to see if the player made a winning move

  * Check to see if the machine can make a winning move and make it

  * Look for a blocking move and make that

  * See if any corners are available and move on one of those

  * See if any side spaces are open and move on one of those

  * Finally check the center space and take that if it's open


There is some randomness in the various sub functions to keep things interesting. First time users have been challenged to win. 

There are several other strategies that could be employed to ensure a machine win. These may be added at a later date. However, I feel if I make the machine stronger, I then need to introduce difficulty levels. That's a fairly large enhancement and I feel it's beyond the scope of the project.

- - -
**Testing Move Sequences
- - -

**Tie**
```
    "board": "---------",
    "board": "------X--",
    "board": "X-O---X--",
    "board": "X-OO--X-X",
    "board": "X-OO-XXOX",
    "board": "XXOOOXXOX",
```

**Player Win**
```
   "board": "---------",
   "board": "------X--",
   "board": "X-O---X--",
   "board": "X-OO--X-X",
   "board": "X-OOX-XOX",
```

**Machine Win##
```
   "board": "---------",
   "board": "------X--",
   "board": "O--X--X--",
   "board": "O-OX--XX-",
```


<!-- Reset Game ####################################################### -->
- - -
##reset_game##
- - - 

Retruns the game board to the initial state

**Args:**

game_key - string - a url safe db key for the game object

**Returns:** 

game - game - a JSON list of the game fields(see new_game). 'board' will be set to '---------' 


**About `reset_game`**

Calling `reset_game` with the `game_key` will cause the game to be set back to it's starting point and it will return the fresh game record as it did for `new_game`

<!-- Cancel Game ####################################################### -->
 
- - -
##cancel_game##
- - -

**Args:**

game_key - a url safe db key for the game object, this is first returned by new_game

**Returns:** 

game_key - string - a url safe db key for the game object

true_or_false - boolean - This is the value of Game.game_active not a success flag per se

```
{
 "game_key": "ahlkZXZ-ZnNuZHA0LXRpYy10YWMtdG9lLTAxchELEgRHYW1lGICAgICAwK8KDA",
 "true_or_false": false
}
```

**About `cancel_game`** </span>Pass the game_key to cancel_game and then it does this:

  * Sets the Game.game_active flag to False

  * Sets the Game.game_status to 'Cancelled'

  * Returns the game_key and a true_or_false field which now contains the value of Game.game_active, which is fetched after the game is cancelled. This is to provide verification that the game was infact cancelled.

<!-- Deactivate Game ####################################################### -->

- - -
##deactivate_game##
- - -

**Args:** 

game_key - a url safe db key for the game object

**Returns:**

game_key - string - a url safe db key for the game object

true_or_false - boolean - This is the value of Game.game_active not a success flag per se


**About `deactivate_game`** 

Calling `deactivate_game` with the `game_key` sets the `game_active` flag on the Game object to false. Like `cancel_game` it returns the `game_key` and the value of `game_active` as verification that the process completed.

- - - 
##Game Information Retrieval APIs##
- - - 
- - -

<!-- Get Average Attempts Remaining ####################################################### -->
- - -  
##get_average_attempts_remaining##
- - -

**Args:** 
None

**Returns:** 
message - string - In the form: "The average moves remaining is [average IE: 1.50]"

**About `get_average_attempts_remaining`** 

This retrieves the value previously stored in the memcache by `_cache_average_attempts` in the key `MOVES_REMAINING` when a new game was last created. 

<!-- Get Game History ####################################################### -->

- - -
##get_game_history##
- - -

**Args:** 
game_key - a url safe db key for the game object

**Returns:** 
items - A sorted list of the moves for a game
**Example:**
```
{
 "items": [
  {
   "board": "---------",
   "move_number": "0"
  },
  {
   "board": "------X--",
   "move_number": "1"
  },
  {
   "board": "X-----X-O",
   "move_number": "2"
  },
  {
   "board": "X--OX-X-O",
   "move_number": "3"
  },
  {
   "board": "X-OOX-XXO",
   "move_number": "4"
  }
 ]
}
```

**About `get_game_history`** 

This one is pretty simple. Returns a list of the moves for the game. It's just a query of the moves that were recorded when `make_move` was called.

This can be run for ant game that is active. 

<!-- Get High Scores ####################################################### -->

- - -
##get_high_scores##
- - -

**Args:** 
num_req - string - The maximum number of returns less than 100

**Returns:** 
items - A list in descending order of players and their scores
**Example:**
```
{
 "items": [
  {
   "player_email": "jdelaney",
   "player_score": "4"
  },
  {
   "player_email": "joe910",
   "player_score": "0"
  }
 ]
}
```

**About `get_high_scores`** 
Returns a sorted list of players and their cumulative scores. Maximum return of 100 players is set in code. The intent of this is to be used to produce something like a top ten player list by score.

<!-- Get Player Scores ####################################################### -->

- - -
##get_player_score##
- - -

**Args:** 
player_email - string - The player's e-mail

**Returns:** 
player_email - string - The player's e-mail
player_score - string - The player's cumulative score

**About `get_player_score`** 
Returns an individual User's current cumulative score. Not much to say here. This one does what it says.

<!-- Get Scores ####################################################### -->

- - - 
##get_scores##
- - -

**Args:** 
None

**Returns:** 
items - A list of game objects, for example:
```
{
 "items": [
  {
   "end_date": "2016-09-15 21:22:27.366892",
   "game_active": true,
   "game_number": "5",
   "game_status": "player_win",
   "move_count": "4",
   "player_name": "John Delaney",
   "start_date": "2016-09-15 21:22:19.138279",
   "urlsafe_key": "ahlkZXZ-ZnNuZHA0LXRpYy10YWMtdG9lLTAxchELEgRHYW1lGICAgICAyKcIDA"
  },
  {
   "end_date": "2016-09-15 20:11:53.874356",
   "game_active": true,
   "game_number": "1",
   "game_status": "player_win",
   "move_count": "4",
   "player_name": "John Delaney",
   "start_date": "2016-09-15 20:11:30.777685",
   "urlsafe_key": "ahlkZXZ-ZnNuZHA0LXRpYy10YWMtdG9lLTAxchELEgRHYW1lGICAgICAyOsIDA"
  }
 ]
}
```

**About `return_all_scores`** 

Return score records for ALL games regardless of status. The game record is discussed in under new_game.

<p style="color:purple;">WARNING - This is a dump of the game data and should be used with care </p>

<!-- Get User Games ####################################################### -->

- - -
##get_user_games##
- - -

**Args:** 
player_email - string - The player's e-mail

**Returns:** 
items - A list of game objects, see get_scores for an example

**About `get_user_games`** 

Returns all of an individual User's scores for active games. See also `deactivate_game`.

<!-- Get User Rankings ####################################################### -->
- - -
##get_user_rankings##
- - -

**Args:** 
num_req - string - The maximum number of returns less than 100

**Returns:** 
items - A list in descending order of players and their scores, see get_high_scores for an example

**About `get_user_rankings`** 
Returns a sorted list of players ranked by a rank index. Ties have been broken. Maximum return of 100 players


<!-- API Test ####################################################### -->

- - -
##z_test_api_service##
- - -

See if the API engine works. Returns message header and empty JSON
**Args:** 
None

**Returns:** 
None


**About  ** 


- - -
- - -
##Crons##
- - -
There is one cron job. It sends an e-mail to each user with an acrtive game in a "started" status. It is configured to run once a day.

**Need to reconfigure the e-mail address**

This cron is currently configured to send to a test account so we don't spam any real test users. This will have to be changed for either your test account or set so the player's email is used for an actual production situation. 

BTW - This is really a demo cron, it's probably not the greatest sort of thing to be e-mailing real users about. 

- - -
- - -
##The Demo Page##
- - -
###The included demo page & the Google Javascript API###
Providing a APIs as a web service is great. Were these simple,unsecured, open to anyone APIs it would be a simpler matter of sending them arguements baked in simple request via an html form. However, a multiuser game API, must, for all the usual reasons be secured to some level. We need to at least log users in so other users can see some info about who they are competing with. 

A full tutorial on how this works for an html UI is beyond the scope of this project currently. You can certainly examine the provided front end code. 

To provide some assistance, I have provided a simpler html / JavaScript file to aid in understanding. See - `/demo/API_demo_01.html`. See the files `/static/js/auth.js` and /static/js/base.js` for where the gapi & OAuth (auth2) objects are configed and instantiated.

The HTML and Javascript that might typically be used to access an API, once authenticated has been combined in the html file one file. This accesses only the the `create_user` API which is the easiest API on this project. It accepts two simple string arguments (see above).

***NOTE: If you elect to extend this app in anyway and deploy it in a public facing manner you really, really need to disable this demo. Disabling is explained in the Wiki page mentioned below.*** 

Full file path is `/demo/API_demo_01.html`

You can access it at `localhost:8080/demo'

This is discussed in more detail on the [project's Wiki page](https://github.com/jdelaney44/fsndp4-tic-tac-toe-01/wiki/**About  **-the-include-demo---API_demo_01.html).

- - -
- - -
##Setting up for cloud deployment & cloud deployment##
- - -
###Setting up your project on the  Google Cloud Platform (GCP)###
- - -
If you wish to actually deploy this projec to the GCP you are going to have to do some work to prepare your GCP developer 'space' , if you will, to receive it and run it. First and foremost you will need a Google login. You can get this at [Google Accounts](https://google.com/accounts) if you don't already have one.

Here are the steps at the high level:
  1. Set up the project in GCP
  2. Set credentials that the code needs to access the server:
    a. OAuth 2.0 client ID or just Client ID
    b. API Key
  3. Update the Python code and the JavaScript code with the Client ID and API Key

**Creating the project**

Pretty much first you need to set up the project at [the GCP cosole](https://console.cloud.google.com)

GIANT CAVEAT: The link provided tends to be volatile. It's changed a couple times in the past year. The old URLs usually work. If it does not for some reason just, uh, 'Google' something like "google cloud console new project". You should find something that'll get you there. 


If you land on the GCP Console page you'll see one of two ways to create a new project:
  
**CAREFUL HERE!** See below about project names, PLEASE.

  a. In the top nav bar to the right of "Google Cloud Platform" there should be a drop down labeled **Project**. Click on that, then click on Creat Project.

  b. 2nd or 3rd item from the bottom of the page is a link labeled **Create an empty project**, click on that and it should take you to the same place.

**CAREFUL HERE!**

  Once you click on one of those you get a pop up asking you for a Project name.

  **Project name here becomes your 
<span style="color:chocolate; font-weight:bold;">permanent</span> Project ID later and the starting part of the URL for your application.** The only way to change the ID is to delete and recreate the project. 

  Your projects url will at first be in the form: 

  **`https://[Project ID].appspot.com`**

  (There are ways to point your own domain name at it of course, but we are not covering that here.)

  Okay then, as you are typing in the Project Name you will see computed ***proejct IDs*** showing up below the Project Name box. This is because the ID has to be unique, so Google is helping you out there. I always try to come up with a name I like as an ID -vs- the computed values. 

  Once you have a project name & ID you are okay with, click on **Create**. It will take a minute or so for the project to be created. 

  Once it's done you'll see your project ID in the top nav bar. Done deal! On to credentials. 

- - -
**API Manager & Project credentials**
- - -

Getting to the right page here can be a bit convoluted. Here's how it's working today.

**Short 'path' Console >> API Manager >> Credentials >> Create credentials** 

Step by step:
  1. Login to Google
  2. Go to [`https://console.cloud.google.com`](https://console.cloud.google.com)
  3. To the right of "Google Cloud Platform" in the top nav bar you should see your projects ID. If not click on the drop down arrow and select it. If its not there, you are either in the wrong account ot the project did get created. 
  4. Now you have two options:
    
    a. To the left of the title are three bars
      * Click on the three bars
      * Click on API Manager

    OR ...

    b. Scroll down the dashboard & find "Enable APIs and get credentials like keys", click on that.

    You should now be at the **API Manager / Dashboard**
  5. Look for **Credentials** in the left nav bar & click on that
  6. Now you should be at the **Credentials** page with a pop up, click on the **Create credentials** button
  7. From this next pop up you need to pick which kind of credential to create ...

You are going to need two credentials for this app

  * **API Key**
  * **OAuth client ID**

- - -
**Setting the API Key:**
- - -

From the pop up click on ***API Key***
  * The key is automatically created & displayed
  * You should copy & paste this into a text editor or a comment in your code for now

<span style="font-size:smaller; margin-left: 3em;">Note: you don't need to rename the key unless you want to. The key name is not used by the JavaScript API.</span>

  * Click on **Restrict key** (you can open up the credential later to do this)
    * Click **HTTP referers (web sites)**
    * In the text box that appears below enter a fictional domain. It could, literally be, `somedumbdomain.net`.

>[See the Wiki for a discussion on this.](https://github.com/jdelaney44/fsndp4-tic-tac-toe-01/wiki/GCP-Project-API-Credential-Discussion)</a>

- - -
**Setting the OAuth client IDs**
- - -
_Note: This is the "Client ID" that is referred to in several Udacity and Google examples_

Okay, you shold be at the API Manager Credentials page. If not see above. 

  * Again, click the **Create credentials** button
  * Click on **OAuth client ID**
  * Select the **Web application** for the Application type (None of the others are relevant to this app)
  * The Name is not relevant, it's fine to leave the default of "Web client 1"
  
  *  **Now set the Authorized JavaScript Origins:**
    *  http://localhost:8080
    *  https://**[project_ID]**.appspot.com

  * **Authorized redirect URIs** are not required for this project as it dosen't rely on a call back

  * Click on **Create**

  * In the OAuth client pop up copy the **client ID** & paste it to a text document or into your code somewhere as a comment for now (or wherever else is good for you ...)

- - -
**Updating app.yaml, auth.js, and game_api.py with project information**
- - -

Information from the cloud project now needs to be entered into several application files:

  * **`auth.js`**
    * In **`auth.js`** (`/static/js/auth.js`) find the the line `var apiKey = 'AIzaSyApZi0GuVULxx5ZGc_RYR8BEdaF0eR3EWo'`
    * Replace `AIzaSyApZi0GuVULxx5ZGc_RYR8BEdaF0eR3EWo` with the API Key from above

  * **`game_api.py`**
    * In **`game_api.py`** (`/api/game_api.py`) find the line `WEB_CLIENT_ID = '182862607901-pbokfffrn24e7rb894ncjc2dtjtflf94.apps.googleusercontent.com`
    * Replace `182862607901-pbokfffrn24e7rb894ncjc2dtjtflf94.apps.googleusercontent.com` with the the OAuth Client ID you copied above.

  * **`app.yaml`**
    * In **`app.yaml`** (`/app.yaml`) find the line `application: fsndp4-tic-tac-toe-01`
    * Replace `fsndp4-tic-tac-toe-01` with the Project ID from above

- - -
##Deploying the app##
- - -
Once the project & credentials are set up in GCP and that information has been put in the files as above, you are ready to deploy the project GCP. 

  1. In your command shell / terminal app `cd` to a directory one level above where the application files are located. The directory where the application is located is assumed to have the same name as the application. This would normally have been created by the `git clone` process mentioned above.

  2. At the command prompt execute this:
    `appcfg.py update fsndp4-tic-tac-toe-01`

    The output looks like this:
```
11:07 AM Application: fsndp4-tic-tac-toe-01; version: 1
11:07 AM Host: appengine.google.com
11:07 AM Starting update of app: fsndp4-tic-tac-toe-01, version: 1
11:07 AM Getting current resource limits.
11:07 AM Scanning files on local disk.
11:07 AM Cloning 6 static files.
11:07 AM Cloning 36 application files.
11:07 AM Uploading 4 files and blobs.
11:07 AM Uploaded 4 files and blobs.
11:07 AM Compilation starting.
11:07 AM Compilation completed.
11:07 AM Starting deployment.
11:07 AM Checking if deployment succeeded.
11:07 AM Deployment successful.
11:07 AM Checking if updated app version is serving.
11:07 AM Checking if Endpoints configuration has been updated.
11:07 AM Will check again in 1 seconds.
```
******

```
11:08 AM Will check again in 16 seconds.
11:08 AM Checking if Endpoints configuration has been updated.
11:08 AM Completed update of app: fsndp4-tic-tac-toe-01, version: 1
11:08 AM Uploading index definitions.
11:08 AM Uploading cron entries.
```
Now you should be able to access the app at `[project ID].appspot.com`

Have fun!

- - -
- - -
**Attributions:**
- - -

[The Google App Engine Endpoints API Tic-Tac-Toe demo project.](https://github.com/GoogleCloudPlatform/appengine-endpoints-tictactoe-python.git)

[Udacity's Guess A Number starter project](https://github.com/udacity/FSND-P4-Design-A-Game)

##Notes & Citations##
<sup>1</sup> Use of unsafe scripts in a local host environment where you are only accessing the local host from the same machine or across a secure, controlled network should not be a problem. When the app is deployed the API Explorer is served from GCP over `https:` so this work around is not needed.
