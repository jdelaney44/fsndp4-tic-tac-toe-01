/** 
 * fsnd global namespace for this project.
 */
var fsnd = fsnd || {};

/** 
 * Tic Tac Toe (t3) namespace for this project. 
 */
fsnd.t3 = fsnd.t3 || {};

/**
 * Enter an API key from the Google API Console:
 */
var apiKey = 'AIzaSyApZi0GuVULxx5ZGc_RYR8BEdaF0eR3EWo';

fsnd.t3.CLIENT_ID =
    '182862607901-pbokfffrn24e7rb894ncjc2dtjtflf94.apps.googleusercontent.com';

/**
 * OAuth authorization scopes
 */
var scopes = 'profile email';

/**
 * The Sign-In object.
 */
var authorizeButton = document.getElementById("authorize_button");
var signoutButton = document.getElementById("signout_button");

/**
 * Check to see if browser is allowing us to set storage
 * If not alert user that browser settings may be an issue
 */




/**
 * Initializes an instance Google JavaScript API auth object
 */
function initAuth() {
  if (typeof localStorage === 'object') {
    try {
        localStorage.setItem('localStorage', 1);
        localStorage.removeItem('localStorage');
    } catch (e) {
        Storage.prototype._setItem = Storage.prototype.setItem;
        Storage.prototype.setItem = function() {};
        alert('Bummer! .. Logging into the game is not working now.\n\n' +
            'Your browser security probably does not allow this.\n\n' +
            'Please check the security settings and try again.\n\n' + 
            '*Hint* - You may be in Private or Incognito mode.\n\n' + 
            'Or, maybe try a different kind of www browser. Thanks!');       
    }
  }
  
  
  
  try{
    gapi.client.setApiKey(apiKey);

    // Get the auth instance 

      gapi.auth2.init({
          client_id: fsnd.t3.CLIENT_ID,
          scope: scopes
      }).then(function () {
  
            auth_instance = gapi.auth2.getAuthInstance();
  
          // Listen for sign-in state changes.
          auth_instance.isSignedIn.listen(updateSigninStatus);
          // Handle the initial sign-in state.
          updateSigninStatus(auth_instance.isSignedIn.get()); 
          authorizeButton.onclick = handleAuthClick;
          signoutButton.onclick = handleSignoutClick;
      });


  } catch (e) {
    alert('Bummer! .. Logging into the game is not working now.\n\n' +
        'Your browser security probably does not allow this.\n\n' +
        'Please check the security settings and try again.\n\n' + 
        'Or, maybe try a different kind of www browser. Thanks!');
  };
};

/**
 * Updates the sign in status of the user in the "name space"
 */
function updateSigninStatus(isSignedIn) {
    if (isSignedIn) {
        authorizeButton.style.display = 'none';
        signoutButton.style.display = 'block';
        fsnd.t3.SIGNED_IN = true;
        fsnd.t3.CurrentUserName = auth_instance.currentUser.get().getBasicProfile().getName();
        fsnd.t3.CurrentUserEmail = auth_instance.currentUser.get().getBasicProfile().getEmail();
        api_root = '//' + window.location.host + '/_ah/api';
        fsnd.t3.init(api_root, fsnd.t3.CurrentUserEmail);
    } else {
        authorizeButton.style.display = 'block';
        signoutButton.style.display = 'none';
        user_label = document.getElementById('user_label');
        user_label.innerHTML = '<a>Not signed in</a>';
        fsnd.t3.SIGNED_IN = false;
    };
}

/**
 * Handles a click on the login button
 */
function handleAuthClick(event) {
    auth_instance.signIn();
}

/**
 * Handles a click on the logout button
 */
function handleSignoutClick(event) {
    fsnd.t3.setBoardEnablement(false);
    auth_instance.signOut();
}

/**
 * handleClientLoad is called from tictactoe.html
 * Loads the Google JavaScript API & initializes the OAuth object
 */
function handleClientLoad() {
    // Load the API client and auth library
  try{
    gapi.load('client:auth2', initAuth);
  } catch (e){
    alert('Your web browser seems to be in private mode.\n\n' +
        'Logging in to this game is not supported in this mode.\n\n' +
        'Please change settings and try again.');
  }
}
