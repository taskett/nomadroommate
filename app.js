
window.addEventListener('DOMContentLoaded', function() {

  console.log("app loaded");
  
  // Init variables
  var webAuth = new auth0.WebAuth({
    domain: 'nomadroommate.auth0.com',
    clientID: 'xz8vlaLPpNVnFZDhtXLe2ouuBGGqEu2J',
    responseType: 'token id_token',
    audience: 'https://nomadroommate.auth0.com/userinfo',
    scope: 'openid',
    redirectUri: window.location.href
  });
  
  var loginStatus = document.querySelector('.container h4');
  var loginView = document.getElementById('login-view');
  var homeView = document.getElementById('home-view');
  var homeViewBtn = document.getElementById('btn-home-view');
  var loginBtn = document.getElementById('btn-login');
  var logoutBtn = document.getElementById('btn-logout');
 
  // Initialize Firebase
  var config = {
      apiKey: "AIzaSyAqEoG596HvXLXFi5KQzc9IOK5N34ejjnA",
      authDomain: "nomad-roommate.firebaseapp.com",
      databaseURL: "https://nomad-roommate.firebaseio.com",
      projectId: "nomad-roommate",
      storageBucket: "nomad-roommate.appspot.com",
      messagingSenderId: "311257395463"
  };
  firebase.initializeApp(config);

  // Functions to be used
  function handleAuthentication() {
    console.log("user logging in...");

    webAuth.parseHash(function(err, authResult) {
      if (authResult && authResult.accessToken && authResult.idToken) {
        window.location.hash = '';
        setSession(authResult);
        console.log("user logged in");
        
        loginBtn.style.display = 'none';
        homeView.style.display = 'inline-block';
      } else if (err) {
        homeView.style.display = 'inline-block';
        console.log(err);
        alert(
          'Error: ' + err.error + '. Check the console for further details.'
        );
      }
      displayButtons();
    });
  } 

  function setSession(authResult) {
    console.log("authResult: ", authResult);
    
    // Set the time that the Access Token will expire at
    var expiresAt = JSON.stringify(
      authResult.expiresIn * 1000 + new Date().getTime()
    );
    localStorage.setItem('access_token', authResult.accessToken);
    localStorage.setItem('id_token', authResult.idToken);
    localStorage.setItem('expires_at', expiresAt);
  }

  function isAuthenticated() {
    // Check whether the current time is past the
    // Access Token's expiry time
    var expiresAt = JSON.parse(localStorage.getItem('expires_at'));
    return new Date().getTime() < expiresAt;
  }

  function displayButtons() {
    if (isAuthenticated()) {
      loginBtn.style.display = 'none';
      logoutBtn.style.display = 'inline-block';
      loginStatus.innerHTML = 'You are logged in!';
    } else {
      loginBtn.style.display = 'inline-block';
      logoutBtn.style.display = 'none';
      loginStatus.innerHTML =
        'You are not logged in! Please log in to continue.';
    }
  }

  // init event listeners
  homeViewBtn.addEventListener('click', function() {
    homeView.style.display = 'inline-block';
    loginView.style.display = 'none';
  });

  logoutBtn.addEventListener('click', function (){
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
  

  // Application starts HERE
  handleAuthentication();
}); 







                