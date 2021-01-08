// takes the current hour and apply body background according to the hour of the day
let currHour = moment().format('H');
if (currHour < 8) {
  document.body.className = 'moonlitnight';
} else if (currHour < 16) {
  document.body.className = 'coolsky';
} else {
  document.body.className = 'noontodusk';
};

let APIkey = '3d865cbadda85d3313ed6811a5f0f35d';
let queryURL = '';
let arrCities = [];

$(document).ready(function () {
  if (localStorage.getItem("lastSearch") != null) {
    lastCity = localStorage.getItem("lastSearch");
    searchWeather(lastCity, false);
  } 
});

function getUVindex(lat, lon) {
  let UVindexURL = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=hourly,minutely&appid=${APIkey}`;
  $(document).ready(function () {
    $.ajax({
      url: UVindexURL,
      method: 'GET'
    }).then(function (giveDaily) {
      console.log(giveDaily);
      let UVindex = giveDaily.current.uvi;
      $("#UVindex").html(UVindex);
      if (UVindex <= 2) {
        $('#UVindex').css('background-color', 'green');
      } else if (UVindex > 2 && UVindex <= 5) {
        $('#UVindex').css('background-color', 'yellow');
      } else if (UVindex > 5 && UVindex <= 7) {
        $('#UVindex').css('background-color', 'orange');
      } else if (UVindex > 7) {
        $('#UVindex').css('background-color', 'darkred');
      }

      //this is creating the 5-days forecast elements
      for (i = 1; i < 6; i++) {
        let date = unixTime(giveDaily.daily[i].dt);
        let icon = giveDaily.daily[i].weather[0].icon;
        let temp = kelvin2F(giveDaily.daily[i].temp.eve);
        let humidity = giveDaily.daily[i].humidity;
        $(`#day${i}`).html(`<div>
          <b>${date}</b>
          <img src="http://openweathermap.org/img/w/${icon}.png"></img>
          <p>Temp: ${temp} °F</p>
          Humidity: ${humidity}%
          </div>
        `);
      }
    })
  })
}

function searchWeather(city, zipcode) {
  $(document).ready(function () {
    if (zipcode === false) {queryURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${APIkey}`;
    } else {
      queryURL = `https://api.openweathermap.org/data/2.5/weather?zip=${zipcode}&units=imperial&appid=${APIkey}`;
    }
    $.ajax({
      url: queryURL, 
      method: 'GET'
    }).then(function (response) {
      console.log(response);
      let currDate = moment().format('L');
      $('#city').html(`${response.name} (${currDate})`);
      $('#temperature').html(response.main.temp + '°F');
      $('#weather_image').attr('src', 'http://openweathermap.org/img/w/' + response.weather[0].icon + '.png');
      $("#humidity").html(response.main.humidity);
      $("#wind-speed").html(response.wind.speed);
      $("#country").html(getCountryName(response.sys.country));
      $("#UVindex").html(UVindex);
      currLatitude = response.coord.lat;
      currLongitude = response.coord.lon;
      
      localStorage.setItem('lastSearch', `${response.name}`);

      // check if the city name is already in the array
      let history = false;
      for (let i = 0; i < arrCities.length; i++) {
        if (response.name.includes(arrCities[i].city)) {
          history = true;
        }
      }

      // only create city button if the city searched is not in the array
      if (history === false) {
        arrCities.push({
          city: response.name,
          desc: response.weather[0].description,
          lat: response.coord.lat,
          lon: response.coord.lon
        });
      }
      renderCities();
      getUVindex(currLatitude, currLongitude);
    });
  });
}

function renderCities() {
  console.log('This is creating the city list');
  $("#cities").empty();
  for (var i = 0; i < arrCities.length; i++) {
    let addCity = $('<div>');
    let cityName = $('<button>').text(`${arrCities[i].city} : ${arrCities[i].desc}`).attr('class', 'cityButton col-12 bg-primary').prop('value', arrCities[i].name);
    addCity.append(cityName);
    $('#cities').append(addCity);
    console.log('TESTING!!!');
    $('.cityButton').on('click', (function (event) {
      preventDefault();
      searchWeather($(this).arrCities.city, false);
      console.log('This is assigning the on click event!');
    }));
  }
}

// function to add the button with the city name and current weather description
function addCity(name, desc) {
  let addCity = $('<div>');
  let cityName = $('<button>').text(`${name} : ${desc}`).attr('class', 'cityButton col-12 bg-primary').prop('value', name);
  addCity.append(cityName);
  $('#cities').append(addCity);
  console.log('TESTING!!!');
  $('.cityButton').on('click', (function (event) {
    preventDefault();
    searchWeather($(this).arrCities.city, false);
    console.log('This is assigning the on click event!');
  }));
}

// function to convert UNIX time to standard local date format
function unixTime(uTime) {
  let unixTime = uTime;
  let milliseconds = unixTime * 1000;
  let dateObject = new Date(milliseconds);
  let humanDateFormat = dateObject.toLocaleDateString();
  return humanDateFormat;
}

// function to convert Kelvin degrees to Fehrenheit
function kelvin2F (temp) {
  temp = (temp - 273.15) * 1.80 + 32;
  temp = parseFloat(temp).toFixed(2);
  return temp;
}

// onclick events for the city search 
$('.citybtn').click(function(event) {
  event.preventDefault();
  let searchCity = $( '#cityText' ).val();
  searchWeather(searchCity, false);
});

$('#cityText').keypress(function (event) {
  if (event.keyCode === 13) {
    event.preventDefault();
    let searchCity = $( '#cityText' ).val();
    searchWeather(searchCity, false);
  }
});

// onclick events for the zip code search
$('.zipbtn').click(function(event) {
  event.preventDefault();
  let searchZip = $( '#zipText' ).val();
  searchWeather(false, searchZip);
});

$('#zipText').keypress(function (event) {
  if (event.keyCode === 13) {
    event.preventDefault();
    let searchZip = $( '#zipText' ).val();
    searchWeather(false, searchZip);
  }
});

// $(document).on("click", ".cityButton", alertMovieName);

//       // Calling the renderButtons function to display the initial buttons
//       renderButtons();