var API_KEY = 'http://api.weatherapi.com/v1/forcast.json?key=c80f0b487abe478da12183413240612&q=cairo&days=3&aqi=no&alerts=no'; 
var DEFAULT_CITY = 'Alexandria';

var weatherIcons = {
    'Clear': 'fa-sun-o',
    'Clouds': 'fa-cloud',
    'Rain': 'fa-rain',
    'Snow': 'fa-snowflake-o',
    'Thunderstorm': 'fa-bolt',
    'Drizzle': 'fa-cloud-rain',
    'Mist': 'fa-smog'
};

function getWindDirection(degree) {
    var directions = ['North', 'NE', 'East', 'SE', 'South', 'SW', 'West', 'NW'];
    return directions[Math.round(degree / 45) % 8];
}

function updateCurrentWeather(data) {
    var currentCard = $('#currentWeather');
    currentCard.find('.location').text(data.name);
    currentCard.find('.temperature').text(Math.round(data.main.temp) + '°C');
    
    var iconClass = weatherIcons[data.weather[0].main] || 'fa-cloud';
    currentCard.find('.weather-icon i').attr('class', 'fa ' + iconClass);
    
    currentCard.find('.weather-info').text(data.weather[0].description);
    currentCard.find('.weather-details span:nth-child(1)').html(
        '<i class="fa fa-tint"></i>' + data.main.humidity + '%'
    );
    currentCard.find('.weather-details span:nth-child(2)').html(
        '<i class="fa fa-location-arrow"></i>' + Math.round(data.wind.speed * 3.6) + 'km/h'
    );
    currentCard.find('.weather-details span:nth-child(3)').html(
        '<i class="fa fa-compass"></i>' + getWindDirection(data.wind.deg)
    );
}

function searchWeather() {
    var city = $('#searchInput').val() || DEFAULT_CITY;
    $('.loading').show();
    $('.error-message').hide();
    
    $.ajax({
        url: 'http://api.weatherapi.com/v1/forcast.json?key=c80f0b487abe478da12183413240612&q=cairo&days=3&aqi=no&alerts=no',
        method: 'GET',
        data: {
            q: city,
            appid: '3b45f23816e21398a8707076714133bd' ,
            units: 'metric'
        },
        success: function(response) {
            updateCurrentWeather(response);
            getForecast(city);
        },
        error: function(xhr) {
            var message = 'Error fetching weather data';
            if (xhr.responseJSON && xhr.responseJSON.message) {
                message = xhr.responseJSON.message;
            }
            $('.error-message').text(message).show();
        },
        complete: function() {
            $('.loading').hide();
        }
    });
}

// Get forecast data
function getForecast(city) {
    $.ajax({
        url: 'http://api.weatherapi.com/v1/forcast.json?key=c80f0b487abe478da12183413240612&q=cairo&days=3&aqi=no&alerts=no',
        method: 'GET',
        data: {
            q: city,
            appid: '3b45f23816e21398a8707076714133bd',
            units: 'metric'
        },
        success: function(response) {
            // Update tomorrow's weather
            var tomorrow = response.list[8]; // 24 hours ahead
            var dayAfter = response.list[16]; // 48 hours ahead
            var twoDaysAfter = response.list[24]; // 72 hours ahead
            
            updateForecastCard('#tomorrowWeather', tomorrow);
            updateForecastCard('#dayAfterWeather', dayAfter);
            updateForecastCard('#twoDaysAfterWeather', twoDaysAfter);
        }
    });
}

// Update forecast card
function updateForecastCard(cardId, data) {
    var card = $(cardId);
    card.find('.temperature').text(Math.round(data.main.temp) + '°C');
    
    var iconClass = weatherIcons[data.weather[0].main] || 'fa-cloud';
    card.find('.weather-icon i').attr('class', 'fa ' + iconClass);
    
    card.find('.weather-info').text(data.weather[0].description);
    card.find('.weather-details').text(Math.round(data.main.temp_min) + '°');
}

// Event handlers
$(document).ready(function() {
    // Search button click
    $('.search-btn').click(function() {
        searchWeather();
    });

    // Enter key in search input
    $('#searchInput').keypress(function(e) {
        if (e.which == 13) {
            searchWeather();
        }
    });

    // Subscribe button
    $('.subscribe-btn').click(function() {
        var email = $('.subscribe-input').val();
        if (email) {
            alert('Thank you for subscribing: ' + email);
        }
    });

    // Load default city weather
    searchWeather();
});