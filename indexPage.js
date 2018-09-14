window.addEventListener('DOMContentLoaded', function () {
    var btnListNewItems = document.getElementById('roommate');
    var btnListNewItemsLoggedin = document.getElementById('roommate_loggedin');
    var loginStatus = document.querySelector('.container h4');

    
    function displayButtons() {
        if (isAuthenticated()) {
            btnListNewItemsLoggedin.style.display = 'block';
            btnListNewItems.style.display = 'none';
        } 
        else {
            btnListNewItemsLoggedin.style.display = 'none';
            btnListNewItems.style.display = 'block';
            loginStatus.innerHTML =
                'You are not logged in! Please log in to continue.';
        }
    }

    btnListNewItems.addEventListener('click', function (e) {
        e.preventDefault();
        webAuth.authorize();
    });

    displayButtons();
})