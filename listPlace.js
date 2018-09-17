
if (!isAuthenticated()) window.location.href = '/index.html'


window.addEventListener('DOMContentLoaded', function () {
    console.log("listPlace loaded");

    console.log(localStorage.getItem('userData'));
    

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

    // on form submit
    form.addEventListener("submit", function (event) {
        event.preventDefault();

        if (!apiKey) {
            console.log("Please wait for the database to be connected");
            //TODO: Show message to user? 
            loginStatus.innerHTML = "Please wait for the database to be connected"
            return
        }
        
        if (isAuthenticated()) {
            loginStatus.innerHTML = 'You are logged in!';

            const app_id = "appo2qL96FI9YS6Tj";
            const app_key = apiKey;
            
            axios.post('https://api.airtable.com/v0/' + app_id + '/Table?api_key=' + app_key, {
                fields: {
                    "Genders": select_gender.options[select_gender.selectedIndex].value,
                    "Location": input_location.value,
                    "Price": select_price.options[select_price.selectedIndex].value,
                    "Rooms": select_rooms.options[select_rooms.selectedIndex].value,
                    "Start": input_start.value,
                    "End": input_end.value,
                    "Username": globalVariable.userData.name,
                    "Userphoto": globalVariable.userData.picture,
                }
            })
            .then(function (record) {
                console.log("response from airtable: ", record);
                alert(record.data.fields.Location + " just added!");
            })
            .catch(function (error) {
                console.log(error);
            })
        } else {
            console.log("You must be logged in to submit a listing!");
        }
    });

     displayButtons()

});