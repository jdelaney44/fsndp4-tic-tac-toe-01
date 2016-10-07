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
 * Initializes an instance Google JavaScript API auth object
 */
function initAuth() {
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
}

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
    gapi.load('client:auth2', initAuth);
}
