import _ from 'lodash';
import './style.css';
import '@fortawesome/fontawesome-free/css/all.css';
import Logo from './img/logo.png';
import { resolve } from 'url';
const $ = require("jquery");

let MAPS_KEY = process.env.BING_MAPS_API_KEY;
let CLIMACELL_KEY = process.env.CLIMACELL_API_KEY;


/******************************************************************************************************************************************************************************/
//location prototype.
class Location {
    constructor(id, name, lat, lon) {
        this.id = id;
        this.name = name;
        this.point = {
            lon,
            lat
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

//boolean if geolocation is active
let geolocation

//the actual location
let actualLocation;

//boolean of the state of the search
let searchOpenClose = false

//interval
let i;

/*************************************************************************************************************************************************************************/

$(".search-box").click(() => {
    searchOpenClose ? $("#search-input").removeClass("search-input-open") : $("#search-input").addClass("search-input-open")
    searchOpenClose ? $(".search-box").removeClass("move-search") : $(".search-box").addClass("move-search")
        //searchOpenClose = !searchOpenClose
})

/*************************************************************************************************************************************************************************/



//document ready callbacks
$(async function() {

    await start()

    loadMicrosoft()

    //setFirstLocation();

});


//set a default or a gelocated first location
function setFirstLocation() {
    //try to get position by user
    setTimeout(() => {
        getPosition();
    }, 2000);

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
    geolocation = true
    setGeolocationLocation(position.coords.latitude, position.coords.longitude)
    getWeather(actualLocation);
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
    actualLocation = await getLocationClimacell("5f1575378bdd780012bcfec8")
    setMap(actualLocation.point.lat, actualLocation.point.lon)
    getWeather(actualLocation)
}

//set the map and the name of the Geolocated location
function setGeolocationLocation(lat, long) {
    var navigationBarMode = Microsoft.Maps.NavigationBarMode;
    var map = new Microsoft.Maps.Map(document.getElementById('myMap'), {
        navigationBarMode: navigationBarMode.square,
        supportedMapTypes: [Microsoft.Maps.MapTypeId.road, Microsoft.Maps.MapTypeId.aerial]
    });

    Microsoft.Maps.loadModule('Microsoft.Maps.Search', function() {
        var searchManager = new Microsoft.Maps.Search.SearchManager(map);
        var reverseGeocodeRequestOptions = {
            location: new Microsoft.Maps.Location(parseFloat(lat), parseFloat(long)),
            callback: function(answer, userData) {
                actualLocation = new Location("geloaction", `${answer.address.locality}  ${answer.address.adminDistrict}`, lat, long)
                map.setView({ bounds: answer.bestView });
                map.entities.push(new Microsoft.Maps.Pushpin(reverseGeocodeRequestOptions.location));
                getWeather(actualLocation);
            }
        };
        searchManager.reverseGeocode(reverseGeocodeRequestOptions);
    });


}


function setMap(lat, long) {
    var navigationBarMode = Microsoft.Maps.NavigationBarMode;
    var map = new Microsoft.Maps.Map(document.getElementById('myMap'), {
        navigationBarMode: navigationBarMode.square,
        supportedMapTypes: [Microsoft.Maps.MapTypeId.road, Microsoft.Maps.MapTypeId.aerial]
    });
    map.setView({ center: new Microsoft.Maps.Location(lat, long), mapTypeId: Microsoft.Maps.MapTypeId.aerial, zoom: 8 })


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



function start() {
    return new Promise(resolve => {
        getBackground();
        let logoIMG = document.getElementById("logo-big");
        logoIMG.src = Logo;

        setTimeout(() => {
            $("#logo-big").addClass("explodeLogo")
        }, 800);

        setTimeout(() => {
            $(".first-page").addClass("displayApp");
        }, 1080);

        setTimeout(() => {
            $(".initial-logo").hide();
            $(".first-page").addClass("opacity");
            $(".drower-bm").addClass("opacity");
            resolve();
        }, 1580);
    });
}


function loadMicrosoft() {
    setTimeout(() => {
        Microsoft.Maps.loadModule('Microsoft.Maps.AutoSuggest', {
            credentials: `${MAPS_KEY}`,
            callback: onLoad,
            errorCallback: onError
        });
    }, 2000);
}

function onLoad() {
    var options = { maxResults: 5 };
    var manager = new Microsoft.Maps.AutosuggestManager(options);
    manager.attachAutosuggest('#search-input', '#Sb', selectedSuggestion);
}

function onError(message) {
    console.log(message)
    loadMicrosoft();
}

function selectedSuggestion(suggestionResult) {
    console.log(suggestionResult.formattedSuggestion, suggestionResult.location.latitude, suggestionResult.location.longitude)
}

const getMinuteByMinute = (location) => {

    async function myFetch() {
        let response = await fetch(`https://api.climacell.co/v3/weather/realtime?lat=${location.point.lat}&lon=${location.point.lon}&unit_system=si&fields=temp%2Cfeels_like%2Cdewpoint%2Cprecipitation_type%2Cweather_code%2Csunrise%2Csunset%2Cprecipitation_probability%2Cprecipitation%2Cwind_speed%2Chumidity%2Cpm10&apikey=${CLIMACELL_KEY}`);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        } else {
            let res = await response.json()
            console.log(res)
            setMinuteByMinute(res);

        }
    }
    myFetch()
        .catch(e => {
            console.log('There has been a problem with your fetch operation: ' + e.message);
        });
}

const getHours = (location) => {
    let d = new Date();
    let dateUTCnow = `${d.getUTCFullYear()}-${d.getUTCMonth()}-${d.getUTCDay()}T${d.getUTCHours()}%3A${d.getUTCMinutes()}%3A${d.getUTCSeconds()}Z`;
    let dateUTCend = `${d.getUTCFullYear()}-${d.getUTCMonth()}-${d.getUTCDay()}T${d.getUTCHours() + 4}%3A${d.getUTCMinutes()}%3A${d.getUTCSeconds()}Z`;
    async function myFetch() {
        let response = await fetch(`https://api.climacell.co/v3/weather/forecast/hourly?lat=${location.point.lat}&lon=${location.point.lon}&unit_system=si&start_time=${dateUTCnow}&end_time=${dateUTCend}&apikey=CLJxtO5VC6ZdfLB4rB8I2YPQ5LSTtKsQ`);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        } else {
            let res = await response.json()
            console.log(res)
            setMinuteByMinute(res);

        }
    }
    myFetch()
        .catch(e => {
            console.log('There has been a problem with your fetch operation: ' + e.message);
        });
}

const setMinuteByMinute = (data) => {

    let deg = data.temp.value + "";

    $(".deg").html(`${deg.substring(0, 2)}°`);

    $(".deg-desc").html(getExpression(data.feels_like.value, data.precipitation_type.value));

}

function getExpression(percTmp, precp) {

    let tempExp;

    percTmp <= 7 ? tempExp = "cold" : null;
    percTmp > 7 && percTmp <= 20 ? tempExp = "chilly" : null;
    percTmp > 20 && percTmp <= 45 ? tempExp = "hot" : null;
    percTmp < 0 ? tempExp = "cold" : null;
    precp === "rain" ? tempExp = "rainy" : null;

    return tempExp;

}

function getWeather(location) {
    console.log(actualLocation)

    clearInterval(i);

    getMinuteByMinute(location);
    i = setInterval(() => {
        console.log(actualLocation)

        getMinuteByMinute(location);
    }, 60000);

    getHours(location);
}