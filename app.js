
// Initialize Firebase
var firebaseConfig = {
  apiKey: "AIzaSyAqEoG596HvXLXFi5KQzc9IOK5N34ejjnA",
  authDomain: "nomad-roommate.firebaseapp.com",
  databaseURL: "https://nomad-roommate.firebaseio.com",
  projectId: "nomad-roommate",
  storageBucket: "nomad-roommate.appspot.com",
  messagingSenderId: "311257395463"
};


function isAuthenticated() {
  // Check whether the current time is past the
  // Access Token's expiry time
  var expiresAt = JSON.parse(localStorage.getItem('expires_at'));
  return new Date().getTime() < expiresAt;
}

 var authDomain = 'nomadroommate.auth0.com'
 var authAudience = 'https://nomadroommate.auth0.com/userinfo'
 var authClientId = 'xz8vlaLPpNVnFZDhtXLe2ouuBGGqEu2J'

 // Init variables
 var webAuth = new auth0.WebAuth({
   domain: authDomain,
   clientID: authClientId,
   responseType: 'token id_token',
   audience: authAudience,
   scope: 'openid profile',
   redirectUri: window.location.href
 });


window.addEventListener('DOMContentLoaded', function () {
  
  var homeViewBtn = document.getElementById('btn-home-view');
  var loginBtn = document.getElementById('btn-login');
  var logoutBtn = document.getElementById('btn-logout');
  var loginStatus = document.querySelector('.container h4');
  var loginView = document.getElementById('login-view');
  var homeView = document.getElementById('home-view');
  var btnListNewItems = document.getElementById('roommate');
  var btnListNewItemsLoggedin = document.getElementById('roommate_loggedin');


  firebase.initializeApp(firebaseConfig);

  // Functions to be used
  function handleAuthentication() {
    webAuth.parseHash(function (err, authResult) {
      if (authResult && authResult.accessToken && authResult.idToken) {
        if (err) return console.log("on webauth start: ", err);
        
        console.log("user logging in...");

        window.location.hash = '';
        
        setSession(authResult);

        console.log("authResult: ", authResult.idTokenPayload);
        
        displayButtons();
        // window.location.href = '/welcome.html'
      } 
      else if (err) {
        console.log(err);
        alert(
          'Error: ' + err.error + '. Check the console for further details.'
        );
        displayButtons();
      }
    });
  }

  function setSession(authResult) {
    var tempstring = authResult.idTokenPayload.sub.split("|")
    var userid = tempstring[1]
    // Set the time that the Access Token will expire at
    var expiresAt = JSON.stringify(
      authResult.expiresIn * 1000 + new Date().getTime()
    );
    localStorage.setItem('access_token', authResult.accessToken);
    localStorage.setItem('id_token', authResult.idToken);
    localStorage.setItem('username', authResult.idTokenPayload.name);
    localStorage.setItem('userpicture', authResult.idTokenPayload.picture);
    localStorage.setItem('userid', userid);
    localStorage.setItem('expires_at', expiresAt);
  }

  function displayButtons() {
    if (isAuthenticated()) {
      loginBtn.style.display = 'none';
      logoutBtn.style.display = 'inline-block';
      loginStatus.innerHTML = 'You are logged in!';

      if (btnListNewItemsLoggedin && btnListNewItems) {
        btnListNewItemsLoggedin.style.display = 'block';
        btnListNewItems.style.display = 'none';
      }
    } 
    else {
      loginBtn.style.display = 'inline-block';
      logoutBtn.style.display = 'none';
      loginStatus.innerHTML =
        'You are not logged in! Please log in to continue.';
      
        if (btnListNewItemsLoggedin && btnListNewItems) {
          btnListNewItemsLoggedin.style.display = 'none';
          btnListNewItems.style.display = 'block';
      }
    }
  }

  if (btnListNewItemsLoggedin && btnListNewItems) {
    btnListNewItems.addEventListener('click', function (e) {
      e.preventDefault();
      webAuth.authorize();
    });
  }
  // init event listeners
  homeViewBtn.addEventListener('click', function () {
    homeView.style.display = 'inline-block';
    loginView.style.display = 'none';
  });

  logoutBtn.addEventListener('click', function () {
    console.log("user logged out");
    //TODO: add message for user
    // upselling to get them to come back?

    // Remove tokens and expiry time from localStorage
    localStorage.removeItem('access_token');
    localStorage.removeItem('id_token');
    localStorage.removeItem('expires_at');
    displayButtons();
  });

  loginBtn.addEventListener('click', function (e) {
    e.preventDefault();
    webAuth.authorize();
  });


  displayButtons();

  // Application starts HERE
  handleAuthentication();

  displayButtons();

  console.log("app loaded 31");
});