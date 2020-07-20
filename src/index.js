import _ from 'lodash';
import './style.css';
const $ = require("jquery");

let MAPS_KEY = process.env.BING_MAPS_API_KEY;


/******************************************************************************************************************************************************************************/
//location prototype.
class Location {

    constructor(name, lat, long) {
        this.name = name;
        this.point = {
            lat,
            long
        }
    }

}

/******************************************************************************************************************************************************************************/


//dynamic loader
var loader = {
    js: function(url, loaded) {
        // loader.js() : load the specified JS file
        // PARAM url : target JS file to load
        //       loaded : function to call on script loaded

        var tag = document.createElement("script");
        if (typeof loaded == "function") {
            tag.onload = loaded;
        }
        tag.src = url;
        document.head.appendChild(tag);
    },

    css: function(url, loaded) {
        // loader.css() : load the specified CSS file
        // PARAM url : target CSS file to load
        //       loaded : function to call on script loaded

        var tag = document.createElement("link");
        if (typeof loaded == "function") {
            tag.onload = loaded;
        }
        tag.rel = "stylesheet";
        tag.type = "text/css";
        tag.media = "all";
        tag.href = url;
        document.head.appendChild(tag);
    }
};



/*************************************************************************************************************************************************************************/
//VARIABLES

let Geolocation;

/*************************************************************************************************************************************************************************/


//document ready callbacks
$(function() {
    //try to get position by user
    getPosition();

    if (typeof Geo != "object") {

    } else {
        getDefaultPosition();
    }
});


// Geolocation function
function getPosition() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(savePosition);
    } else {
        console.log("Geolocation is not supported by this browser.");
    }
}

function savePosition(position) {
    setGeolocationLocation(position.coords.latitude, position.coords.longitude)
}

function showError(error) {
    switch (error.code) {
        case error.PERMISSION_DENIED:
            console.log("User denied the request for Geolocation.")
            break;
        case error.POSITION_UNAVAILABLE:
            console.log("Location information is unavailable.")
            break;
        case error.TIMEOUT:
            console.log("The request to get user location timed out.")
            break;
        case error.UNKNOWN_ERROR:
            console.log("An unknown error occurred.")
            break;
    }
}


// get default position and set it.
const getDefaultPosition = () => {
    var data = null;

    var xhr = new XMLHttpRequest();

    xhr.addEventListener("readystatechange", function() {
        if (this.readyState === this.DONE) {

            setLocation(JSON.parse(this.responseText));
        }
    });

    xhr.open("GET", "https://api.climacell.co/v3/locations/5f1575378bdd780012bcfec8?apikey=CLJxtO5VC6ZdfLB4rB8I2YPQ5LSTtKsQ");

    xhr.send(data);
}

//find a name of a specified (lat,long) position
function setGeolocationLocation(lat, long) {
    var map = new Microsoft.Maps.Map(document.getElementById('myMap'), {});
    Microsoft.Maps.loadModule('Microsoft.Maps.Search', function() {
        var searchManager = new Microsoft.Maps.Search.SearchManager(map);
        var reverseGeocodeRequestOptions = {
            location: new Microsoft.Maps.Location(Number.parseFloat(lat + ".0"), Number.parseFloat(long + ".0")),
            callback: function(answer, userData) {
                map.setView({ bounds: answer.bestView });
                map.entities.push(new Microsoft.Maps.Pushpin(reverseGeocodeRequestOptions.location));
                Geolocation = new Location(`${answer.address.locality}  ${answer.address.adminDistrict}`, lat, long)
                console.log(Geolocation);
            }
        };
        searchManager.reverseGeocode(reverseGeocodeRequestOptions);
    });

}


const setLocation = (location) => {

}