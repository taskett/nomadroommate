if (!isAuthenticated()) window.location.href = '/index.html'

window.addEventListener('DOMContentLoaded', function () {
    var joinSlack = document.querySelector("#joinSlack");

    console.log("User id fetched: ", localStorage.getItem('userid'));
    
    joinSlack.innerHTML("with this username: " + localStorage.getItem('userid'))
});