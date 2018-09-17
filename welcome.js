if (!isAuthenticated()) window.location.href = '/index.html'

window.addEventListener('DOMContentLoaded', function () {
    document.getElementById("joinSlack").innerHTML = "with this username: " + localStorage.getItem('userid');
});