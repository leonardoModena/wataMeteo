import _ from 'lodash';
import './style.css';
import Logo from './img/logo.png';
import { resolve } from 'url';
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


//dynamic loader (credit: https://code-boxx.com/dynamically-load-javascript-css/)
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

//the actual location
let actualLocation;

//location defined by geolocation
let Geolocation;

/*************************************************************************************************************************************************************************/


//document ready callbacks
$(function() {

    console.log(Logo);

    start()

    //load bing map api script
    loader.js(`https://www.bing.com/api/maps/mapcontrol?callback=GetMap&key=${MAPS_KEY}`)

    getBackground();

    setFirstLocation();

});


//set a default or a gelocated first location
function setFirstLocation() {
    //try to get position by user
    getPosition();
    //set a default position
    setDefaultPosition();

}


// Geolocation function
function getPosition() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(savePosition);
    } else {
        console.log("Geolocation is not supported by this browser.");
    }
}


function savePosition(position) {
    setTimeout(() => {
        setGeolocationLocation(position.coords.latitude, position.coords.longitude)
    }, 200);
}

function showError(error) {
    switch (error.code) {
        case error.PERMISSION_DENIED:
            console.log("User denied the request for Geolocation.")
            GeoActive = false;
            break;
        case error.POSITION_UNAVAILABLE:
            console.log("Location information is unavailable.")
            GeoActive = false;
            break;
        case error.TIMEOUT:
            console.log("The request to get user location timed out.")
            GeoActive = false;
            break;
        case error.UNKNOWN_ERROR:
            console.log("An unknown error occurred.")
            GeoActive = false;
            break;
        default:
            GeoActive = false;
            break;
    }
}


// get default position and set it.
async function setDefaultPosition() {
    //let location = await getLocationClimacell("5f1575378bdd780012bcfec8")
    console.log(location);
    setMap(location.point.lat, location.point.lon)
}

//set the map and the name of the Geolocated location
function setGeolocationLocation(lat, long) {
    var map = new Microsoft.Maps.Map(document.getElementById('myMap'), {});
    Microsoft.Maps.loadModule('Microsoft.Maps.Search', function() {
        var searchManager = new Microsoft.Maps.Search.SearchManager(map);
        var reverseGeocodeRequestOptions = {
            callback: function(answer, userData) {
                map.setView({
                    center: new Microsoft.Maps.Location(Number.parseFloat(lat + ".0"), Number.parseFloat(long + ".0")),
                    mapTypeId: Microsoft.Maps.MapTypeId.aerial,
                });
                map.entities.push(new Microsoft.Maps.Pushpin(reverseGeocodeRequestOptions.location));
                Geolocation = new Location(`${answer.address.locality}  ${answer.address.adminDistrict}`, lat, long)
                console.log(Geolocation);

            }
        };
        searchManager.reverseGeocode(reverseGeocodeRequestOptions);
    });

}


function setMap(lat, long) {
    var map = new Microsoft.Maps.Map(document.getElementById('myMap'), {});
    map.setView({
        center: new Microsoft.Maps.Location(lat, long),
        mapTypeId: Microsoft.Maps.MapTypeId.aerial,
        zoom: 8
    });

}


function getLocationClimacell(id) {

    return new Promise(resolve => {
        async function myFetch() {
            let response = await fetch(`https://api.climacell.co/v3/locations/${id}?apikey=CLJxtO5VC6ZdfLB4rB8I2YPQ5LSTtKsQ`);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            } else {
                resolve(await response.json())

            }
        }
        myFetch()
            .catch(e => {
                console.log('There has been a problem with your fetch operation: ' + e.message);
            });
    });



}

function getBackground() {
    var d = new Date();
    let hour = d.getHours();

    (hour > 4) && (hour < 12) ? (setB("morning")) : (null);
    (hour > 11) && (hour < 17) ? (setB("afternoon")) : (null);
    (hour > 16) && (hour < 21) ? (setB("evening")) : (null);
    (hour > 20) && (hour < 5) ? (setB("night")) : (null);

}

const setB = (variable) => {
    $(".background").css("background-image", `var(--${variable})`);
    console.log(variable)
}

const setLocation = (location) => {

}

function start() {
    let logoIMG = document.getElementById("logo-big");
    logoIMG.src = Logo;

    setTimeout(() => {
        $("#logo-big").addClass("explodeLogo")
    }, 800);

    setTimeout(() => {
        $(".uga").addClass("displayApp");
    }, 1080);

    setTimeout(() => {
        $("#logo-big").hide();
        $(".uga").addClass("opacity");
    }, 1580);


}