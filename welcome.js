if (!isAuthenticated()) window.location.href = '/index.html'

window.addEventListener('DOMContentLoaded', function () {
    firebase.database().ref('/slackkey/').once('value').then(function (res) {
        BotUserOAuthAccessToken = res.node_.value_
    });

    function requestSlackUsers(userid) {
        var BotUserOAuthAccessToken = "xoxb-391940790484-436111857888-JjgHp2gvcxKFIurey5PaSW8O"
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

    requestSlackUsers(localStorage.getItem('userid')).then(function (res) { 
        if (!res) {
            document.getElementById("joinSlack").innerHTML = "with these numbers in the field 'full name': " + localStorage.getItem('userid');
        }
        else {
            window.location.href = '/list_place.html'
        }
    })
});