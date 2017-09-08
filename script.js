
//Constants
const myAPI = 'ee984a64f0776301d789b07e922c4cbf ';

//Views
var currentMainWeatherValue = document.getElementById('main_weather_value_display');
var currentWeatherWordDescription = document.getElementById('word_description');
var currentWeahterWordDescriptionInDetails = document.getElementById('word_description_in_details');
var currentTemperatureInDetails = document.getElementById('today_temperature_in_details');
var weatherImage = document.getElementById('weather_image');
var weatherImageInDetails = document.getElementById('weather_image_in_details');
var dropDownList = document.getElementById('myList');
var days = document.getElementsByClassName('day_of_week');
var forecastWeatherValues = document.getElementsByClassName('day_of_week_weather_value');
var forecastWeatherImages = document.getElementsByClassName('day_of_week_weather_image');
var backgroundContainer = document.getElementById('background_container');

//Variables
var imageClass = 'wi wi-na';
var selectedCity = 'Cluj-Napoca';
var currentTemperature = 'N/A';
var currentWeatherWordDescriptionActual = 'N/A';
var currentWeatherImageId = '';

//Weekdays name array
var weekday = new Array(7);
weekday[0] = "Sun";
weekday[1] = "Mon";
weekday[2] = "Tue";
weekday[3] = "Wed";
weekday[4] = "Thu";
weekday[5] = "Fri";
weekday[6] = "Sat";

//URL Array
var urlList = new Array(5);
urlList[0] = 'url(https://images.pexels.com/photos/434203/pexels-photo-434203.jpeg?w=1260&h=750&auto=compress&cs=tinysrgb)';//Cluj
urlList[1] = 'url(https://images.pexels.com/photos/427679/pexels-photo-427679.jpeg?w=1260&h=750&auto=compress&cs=tinysrgb)';//London
urlList[2] = 'url(https://images.pexels.com/photos/219692/pexels-photo-219692.jpeg?w=1260&h=750&auto=compress&cs=tinysrgb)';//Bucharest
urlList[3] = 'url(https://images.pexels.com/photos/534757/pexels-photo-534757.jpeg?w=1260&h=750&auto=compress&cs=tinysrgb)';//New York
urlList[4] = 'url(https://images.pexels.com/photos/275202/pexels-photo-275202.jpeg?w=1260&h=750&auto=compress&cs=tinysrgb)';//Berlin

//Our custom weekdays array
var ourWeekDays = new Array(5);

//Show the details for Cluj by default until the user changes it
getWeatherForCity();
updateBackground(selectedCity);

dropDownList.onchange = function () {

    //Start updating the views when the user changes the location
    var selectedItem = dropDownList.selectedIndex;
    selectedCity = dropDownList.options[selectedItem].text;
    updateBackground(selectedCity);
    getWeatherForCity();
}

function getWeatherForCity() {

    //Current day weather
    var apiCall = 'http://api.openweathermap.org/data/2.5/weather?q=' + selectedCity + '&units=metric&appid=' + myAPI;
    $.getJSON(apiCall, weatherCallBack);

    function weatherCallBack(weatherData) {
        currentTemperature = Math.round(weatherData.main.temp);
        currentWeatherWordDescriptionActual = weatherData.weather[0].main;
        currentWeatherImageId = weatherData.weather[0].id;
        imageClass = 'wi-owm-' + currentWeatherImageId;
        updateViewsForToday();
    }

    //5 day forecast
    var apiCall = 'http://api.openweathermap.org/data/2.5/forecast?q=' + selectedCity + '&units=metric&appid=' + myAPI;
    $.getJSON(apiCall, forecastCallBack)

    function forecastCallBack(weatherData) {
        updateForecastWeatherData(weatherData);
        updateForecastDays();
    }
}

function updateViewsForToday() {

    currentMainWeatherValue.innerHTML = currentTemperature + '�';
    currentWeatherWordDescription.innerHTML = currentWeatherWordDescriptionActual;
    currentWeahterWordDescriptionInDetails.innerHTML = currentWeatherWordDescriptionActual;
    currentTemperatureInDetails.innerHTML = currentTemperature + '�';
    weatherImage.className = 'wi ' + imageClass;
    weatherImageInDetails.className = 'wi '+ imageClass;
}

function updateForecastDays() {

    const d = new Date();
    createNextFiveDays(d.getDay());

    //Update the days
    for (var i = 0; i < 5; i++) {
        days[i + 1].innerHTML = ourWeekDays[i];
    }
}

/*
     Note: the last weather value from the weather forecast will never change
    beacause the API does not supply enought data, but the one before might change
    depending on whether or not the API will supply the required data, if it does
    then the views will update accordingly if not they will remain unchanged;
*/
function updateForecastWeatherData(weatherData) {

    const firstHourOfForecast = new Date(weatherData.list[0].dt_txt);

    /* The weather forecast object offers data for the current day too, so we make sure we are not
        using the current day's weather for the forecast.
       I consider 15:00 as the middle of the day and use the value from that hour to update the views with
    */

    var isAfterMiddleOfDay = firstHourOfForecast.getHours > 15;
    var date;
    var cont = 0;

    for (var i = 0; i < weatherData.list.length; i++) {
        date = new Date(weatherData.list[i].dt_txt);

        if (date.getHours() == 15 && !isAfterMiddleOfDay) {
            //After going over the first 15:00 of the current day the next will be good to use in order
            isAfterMiddleOfDay = true;
        } else if (date.getHours() == 15 && isAfterMiddleOfDay) {
            forecastWeatherValues[cont].innerHTML = Math.round(weatherData.list[i].main.temp) + '�';
            var image = forecastWeatherImages[cont].getElementsByTagName('i');
            image[0].className = 'wi wi-owm-' + weatherData.list[i].weather[0].id;
            cont++;
        }
    }
}

function createNextFiveDays(dayNumber) {

    //Increment the day number with 2 to get the day after tomorrow
    if (dayNumber == 5) {
        dayNumber = 0;
    } else if (dayNumber == 6) {
        dayNumber = 1;
    } else {
        dayNumber += 2;
    }

    //Save that day in our custom array and continue adding
    ourWeekDays[0] = weekday[dayNumber];
    dayNumber++;

    for (var i = 1; i < 5; i++) {
        //If it reaches the end of the week reset it to the first day
        if (dayNumber == 7) {
            dayNumber = 0;
        }
        ourWeekDays[i] = weekday[dayNumber];
        dayNumber++;
    }
}

function updateBackground(city) {

    switch (city){
        case 'Cluj-Napoca': {
            backgroundContainer.style.backgroundImage = urlList[0];
            break;
        }
        case 'London': {
            backgroundContainer.style.backgroundImage = urlList[1];
            break;
        }
        case 'Bucharest': {
            backgroundContainer.style.backgroundImage = urlList[2];
            break;
        }
        case 'New York': {
            backgroundContainer.style.backgroundImage = urlList[3];
            break;
        }
        case 'Berlin': {
            backgroundContainer.style.backgroundImage = urlList[4];
            break;
        }
        default: {
            backgroundContainer.style.backgroundImage = urlList[1];
        }
    }
}