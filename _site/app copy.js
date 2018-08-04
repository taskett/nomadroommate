
window.addEventListener('DOMContentLoaded', function() {

  var webAuth = new auth0.WebAuth({
    domain: 'nomadroommate.auth0.com',
    clientID: 'xz8vlaLPpNVnFZDhtXLe2ouuBGGqEu2J',
    responseType: 'token id_token',
    audience: 'https://nomadroommate.auth0.com/userinfo',
    scope: 'openid',
    redirectUri: window.location.href
  });
  
  // ...
  var loginStatus = document.querySelector('.container h4');
  var loginView = document.getElementById('login-view');
  var homeView = document.getElementById('home-view');

  // buttons and event listeners
  var homeViewBtn = document.getElementById('btn-home-view');
  var loginBtn = document.getElementById('btn-login');
  var logoutBtn = document.getElementById('btn-logout');

  homeViewBtn.addEventListener('click', function() {
    homeView.style.display = 'inline-block';
    loginView.style.display = 'none';
  });

  logoutBtn.addEventListener('click', logout);

  
   function handleAuthentication() {
    webAuth.parseHash(function(err, authResult) {
      if (authResult && authResult.accessToken && authResult.idToken) {
        window.location.hash = '';
        setSession(authResult);
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
    // Set the time that the Access Token will expire at
    var expiresAt = JSON.stringify(
      authResult.expiresIn * 1000 + new Date().getTime()
    );
    localStorage.setItem('access_token', authResult.accessToken);
    localStorage.setItem('id_token', authResult.idToken);
    localStorage.setItem('expires_at', expiresAt);
  }

  function logout() {
    // Remove tokens and expiry time from localStorage
    localStorage.removeItem('access_token');
    localStorage.removeItem('id_token');
    localStorage.removeItem('expires_at');
    displayButtons();
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

  var loginBtn = document.getElementById('btn-login');

  loginBtn.addEventListener('click', function(e) {
    e.preventDefault();
    webAuth.authorize();
  });

  // ...
  handleAuthentication();

  
    document.getElementById("buttonz").addEventListener("click", popUp);

    function popUp() {
      if (isAuthenticated()) {
        loginStatus.innerHTML = 'You are logged in!';
      } else {
        alert("You must be logged in to submit a listing!");
      }
    } 

    console.clear();
        
            var airtable_write_endpoint = "https://api.airtable.com/v0/appo2qL96FI9YS6Tj/Table?api_key=key07Up8Mf6tdrd2n";
        
            // Write API
            var form = document.querySelector("#voting-form");
            var select_gender = document.querySelector("#gender");
            var input_location = document.querySelector("#location");
            var select_price = document.querySelector("#price");
            var select_rooms = document.querySelector("#rooms");
            var input_start = document.querySelector("#start");
            var input_end = document.querySelector("#end");
        
            form.addEventListener("submit", function (event) {
            event.preventDefault();
        
            axios.post(airtable_write_endpoint, {
                "fields": {
                "Genders": select_gender.options[select_gender.selectedIndex].value,
                "Location": input_location.value,
                "Price": select_price.options[select_price.selectedIndex].value,
                "Rooms": select_rooms.options[select_rooms.selectedIndex].value,
                "Start": input_start.value,
                "End": input_end.value
                }
            }) .then(function (response) {
            console.log(response);
            alert("Success!");
          })
          .catch(function (error) {
            console.log(error);
            alert("Error");
          });
            
          });

}); 







                