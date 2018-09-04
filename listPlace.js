window.addEventListener('DOMContentLoaded', function () {
    console.log("listPlace loaded");

    var loginStatus = document.querySelector('.container h4');

    // Write API
    var form = document.querySelector("#voting-form");
    var select_gender = document.querySelector("#gender");
    var input_location = document.querySelector("#location");
    var select_price = document.querySelector("#price");
    var select_rooms = document.querySelector("#rooms");
    var input_start = document.querySelector("#start");
    var input_end = document.querySelector("#end");
    
    // Initialize Firebase
    var config = {
        apiKey: "AIzaSyAqEoG596HvXLXFi5KQzc9IOK5N34ejjnA",
        authDomain: "nomad-roommate.firebaseapp.com",
        databaseURL: "https://nomad-roommate.firebaseio.com",
        projectId: "nomad-roommate",
        storageBucket: "nomad-roommate.appspot.com",
        messagingSenderId: "311257395463"
    };
    firebase.initializeApp(config);
    console.log("Initializing Firebase...");
    var database = firebase.database()
    var apiKey;
    // get request
    database.ref('/key/').once('value').then(function (res) {
        console.log('Initialized Firebase');
        apiKey = res.node_.value_
    });

    function isAuthenticated() {
        // Check whether the current time is past the
        // Access Token's expiry time
        var expiresAt = JSON.parse(localStorage.getItem('expires_at'));
        return new Date().getTime() < expiresAt;
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
        
        console.log("submit clicked", isAuthenticated());
        
        if ( true ) {
            loginStatus.innerHTML = 'You are logged in!';

            var app = new Vue({
                data: {
                    items: []
                },
                mounted: function () {
                    this.loadItems();
                },
                methods: {
                    loadItems: function () {
                        var app_id = "appo2qL96FI9YS6Tj";
                        var app_key = "key5a0jKwTyFl7Khg";
                        this.items = []
                        axios.post("https://api.airtable.com/v0/" + app_id + "/Table?view=Grid%20view", {
                            headers: {
                                Authorization: "Bearer " + app_key
                            }
                            },
                           { "fields": {
                                "Genders": "test"
                            }}
                       ) 
                        // axios.post(airtable_write_endpoint, {
                        //     "fields": {
                        //         "Genders": select_gender.options[select_gender.selectedIndex].value,
                        //         "Location": input_location.value,
                        //         "Price": select_price.options[select_price.selectedIndex].value,
                        //         "Rooms": select_rooms.options[select_rooms.selectedIndex].value,
                        //         "Start": input_start.value,
                        //         "End": input_end.value
                        //     }
                        // }) 
                        .then(function (response) {
                            console.log("response from airtable: ", response);
                        })
                        .catch(function (error) {
                            console.log(error);
                        })  
                    }
                }
            })    
        } else {
            console.log("You must be logged in to submit a listing!");
        }
    });

});