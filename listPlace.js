if (!isAuthenticated()) window.location.href = '/index.html'


window.addEventListener('DOMContentLoaded', function () {
    console.log("listPlace loaded");

    function fetchUserData() {
        return {
            name: localStorage.getItem('username'),
            picture: localStorage.getItem('userpicture'),
            userid: localStorage.getItem('userid')
        }
    }

    var loginStatus = document.querySelector('.container h4');
    var loginBtn = document.getElementById('btn-login');
    var logoutBtn = document.getElementById('btn-logout');
    var loginStatus = document.querySelector('.container h4');

    // Write API
    var form = document.querySelector("#voting-form");
    var select_gender = document.querySelector("#gender");
    var input_location = document.querySelector("#location");
    var select_price = document.querySelector("#price");
    var select_rooms = document.querySelector("#rooms");
    var input_start = document.querySelector("#start");
    var input_end = document.querySelector("#end");


    console.log("Initializing Firebase...");
    var database = firebase.database()
    var apiKey;
    // get request
    database.ref('/key/').once('value').then(function (res) {
        console.log('Initialized Firebase');
        apiKey = res.node_.value_
    });


    function displayButtons() {
        if (isAuthenticated()) {
            loginBtn.style.display = 'none';
            logoutBtn.style.display = 'inline-block';
        } else {
            loginBtn.style.display = 'inline-block';
            logoutBtn.style.display = 'none';
        }
    }

    function requestSlackUsers(userid) {
        console.log("starting tinkering with slakc: ");
        var BotUserOAuthAccessToken = "xoxb-391940790484-436111857888-JjgHp2gvcxKFIurey5PaSW8O"
        return axios.post('https://slack.com/api/users.list?token=' + BotUserOAuthAccessToken)
            .then(function (res) {
                var mem = res.data.members.filter(function (a) {
                    return a.name == userid;
                })
                return mem[0];
            })
            .catch(function (error) {
                console.log("error from slack: ", error);
            })
    }

    // on form submit
    form.addEventListener("submit", function (event) {
        event.preventDefault();

        if (!apiKey) {
            console.log("Please wait for the database to be connected and try again");
            //TODO: Show message to user? 
            loginStatus.innerHTML = "Please wait for the database to be connected and try again"
            return
        }


        if (isAuthenticated()) {
            loginStatus.innerHTML = 'You are logged in!';

            const app_id = "appo2qL96FI9YS6Tj";
            const app_key = apiKey;
            var userData = fetchUserData();

            console.log("userData", userData);

            requestSlackUsers(userData.userid).then(function (res) {
                if (!res) {
                    console.log("Please signup with slack before listing a new place");
                    //TODO: Show message to user? 
                    loginStatus.innerHTML = "Please signup with slack before listing a new place with username: " + userData.userid + " <a href='https://join.slack.com/t/nomadroommate/shared_invite/enQtNDM2MTMyNzkwMjcyLTdjYmU3MmYxOGNlOTVmMDY1ZWVlODkyZDA4MjhiZDZjODcyYzAxZmRiNDkzNTViZGI4YjZmYzllYjA0NTc0OTU'>Click here to join slack</a>"
                    return
                }

                axios.post('https://api.airtable.com/v0/' + app_id + '/Table?api_key=' + app_key, {
                        fields: {
                            "Genders": select_gender.options[select_gender.selectedIndex].value,
                            "Location": input_location.value,
                            "Price": select_price.options[select_price.selectedIndex].value,
                            "Rooms": select_rooms.options[select_rooms.selectedIndex].value,
                            "Start": input_start.value,
                            "End": input_end.value,
                            "Username": userData.name,
                            "Userphoto": userData.picture,
                            "SlackMessage": "https://nomadroommate.slack.com/messages/" + userData.userid,
                        }
                    })
                    .then(function (record) {
                        console.log("response from airtable: ", record);
                        alert(record.data.fields.Location + " just added!");
                    })
                    .catch(function (error) {
                        console.log(error);
                    })
            });


        } else {
            console.log("You must be logged in to submit a listing!");
        }
    });

    displayButtons()

});