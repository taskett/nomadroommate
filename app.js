// app.js

window.addEventListener('load', function() {

    var webAuth = new auth0.WebAuth({
      domain: 'nomadroommate.auth0.com',
      clientID: 'xz8vlaLPpNVnFZDhtXLe2ouuBGGqEu2J',
      responseType: 'token id_token',
      audience: 'https://nomadroommate.auth0.com/userinfo',
      scope: 'openid',
      redirectUri: window.location.href
    });
  
    var loginBtn = document.getElementById('btn-login');
  
    loginBtn.addEventListener('click', function(e) {
      e.preventDefault();
      webAuth.authorize();
    });
  
  });