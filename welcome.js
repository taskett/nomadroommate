//  if (!isAuthenticated()) window.location.href = '/index.html';

window.addEventListener('DOMContentLoaded', function () {
    var BotUserOAuthAccessToken = null;

    console.log("page loaded v1");

    firebase.database().ref('/slackkey/').once('value').then(function (res) {
        BotUserOAuthAccessToken = res.node_.value_;

        requestSlackUsers(localStorage.getItem('userid')).then(function (res) {
            if (!res) {
                document.getElementById("joinSlack").innerHTML = "with these numbers in the <b> field 'full name': " + localStorage.getItem('userid') + '</b>';
                loadingGif.style.display = 'none';
            } else {
                window.location.href = '/list_place.html' 
            }
        })
    });

    function requestSlackUsers(userid) {
        return axios.post('https://slack.com/api/users.list?token=' + BotUserOAuthAccessToken)
            .then(function (res) {
                var mem = res.data.members.filter(function (a) {
                    return a.profile.real_name == userid;
                })
                return mem[0];
            })
            .catch(function (error) {
                console.log("error from slack: ", error);
            })
    }
});