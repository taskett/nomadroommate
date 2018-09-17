if (!isAuthenticated()) window.location.href = '/index.html'

window.addEventListener('DOMContentLoaded', function () {

    function requestSlackUsers(userid) {
        console.log("starting tinkering with slack: ");
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
            document.getElementById("joinSlack").innerHTML = "with this username: " + localStorage.getItem('userid');
        }
        else {
            window.location.href = '/list_place.html'
        }
    })
});