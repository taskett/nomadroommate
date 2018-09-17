if (!isAuthenticated()) window.location.href = '/index.html'

window.addEventListener('DOMContentLoaded', function () {
    function fetchUserData() {
        return {
            name: localStorage.getItem('username'),
            picture: localStorage.getItem('userpicture'),
            userid: localStorage.getItem('userid')
        }
    }

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
    var input_photo = document.querySelector("#photo-link");

    console.log("Initializing Firebase...");
    var apiKey, BotUserOAuthAccessToken, airtableId;
    // get request
    firebase.database().ref('/key/').once('value').then(function (res) {
        apiKey = res.node_.value_
    });

    firebase.database().ref('/slackkey/').once('value').then(function (res) {
        BotUserOAuthAccessToken = res.node_.value_
    });

    firebase.database().ref('/airtableid/').once('value').then(function (res) {
        airtableId = res.node_.value_
    });

    function displayError(display, message) {
        console.log(display, message);
        
        if (display) {
            loginStatusContainer.style.display = 'block';
            loginStatus.innerHTML = message;
        } else {
            loginStatusContainer.style.display = 'none';
        }
    }

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

    // on form submit
    form.addEventListener("submit", function (event) {
        event.preventDefault();

        if (!apiKey) {
            console.log("Please wait for the database to be connected and try again");
            //TODO: Show message to user? 
            displayError(true, "Please wait for the database to be connected and try again");
            return
        }

        if (isAuthenticated()) {
            displayError(false);

            const app_id = airtableId;
            const app_key = apiKey;
            var userData = fetchUserData();

            requestSlackUsers(userData.userid).then(function (res) {
                if (!res) {
                    console.log("Please signup with slack before listing a new place");
                    //TODO: Show message to user? 

                    displayError(true, "Please signup with slack before listing a new place with real name: " + userData.userid + "  </br> <a href='https://join.slack.com/t/nomadroommate/shared_invite/enQtNDM2MTMyNzkwMjcyLTdjYmU3MmYxOGNlOTVmMDY1ZWVlODkyZDA4MjhiZDZjODcyYzAxZmRiNDkzNTViZGI4YjZmYzllYjA0NTc0OTU'>Click here to join slack</a>");
                    return
                }
                //if there is a slack user associated with the auth0 user
                else {
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
                                "PhotoLink": input_photo.value,
                            }
                        })
                        .then(function (record) {
                            console.log("response from airtable: ", record);

                            var messageToShow = record.data.fields.Location + " just added!"
                            displayError(true, messageToShow);
                            
                            window.location.href = '/listings.html'
                            return
                        })
                        .catch(function (error) {
                            console.log(error);
                        })
                }
            });

        } 
        //if not authenticated
        else {
            console.log("You must be logged in to submit a listing!");
        }
    });
    displayButtons()
});