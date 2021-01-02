// let myCities = [
//   {
//     cityName: "Houston",
//     lon: "-95.36",
//     lat: "29.76"
//   },
//   {
//     cityName: "Seoul",
//     lon: "126.98",
//     lat: "37.57"
//   }
// ]

//let currHour = moment().format('H');
let currHour = 7;
//console.log(currHour);
switch (currHour) {
  case currHour < 8:
    $('document.body').addClass('moonlitnight');
    break;
  case currHour >= 8 && currHour < 16:
    $('document.body').addClass('coolsky');
    break;
  case currHour >= 16:
    $('document.body').addClass('noontodusk');
    break;
}



let APIkey = '3d865cbadda85d3313ed6811a5f0f35d';
let queryURL = '';
let arrCities = [];
//let searchCity = '';
//let UVindex = '';
//let buttons = 'testing';

// myCities.forEach(function(thisCity){
//   const city = $('<div>').attr({'class': 'row'}, {'id': 'myCities.id'});
//   const cityEl = $('<div>').attr({'class': 'col-12 cityBtn'});
//   $('#cities').append(city);
//   const cityBtn = $('<button>').attr({'class': 'col-12 btn-primary cityButton capitalise'}).text(`${thisCity.cityName}: ${thisCity.desc}`);
//   //cityBtn = text.toUpperCase();
//   cityEl.append(cityBtn);
//   city.append(cityEl);
// });

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
      //UVindex = 8;
      //console.log(UVindex);
      //let date = unixTime(giveDaily.daily[1].dt);
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
          ${date}
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
      queryURL = `https://api.openweathermap.org/data/2.5/weather?zip=${zipcode}&appid=${APIkey}`;
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
      //addCity(response.name, response.weather[0].description);
      if (response.name in arrCities) {
        console.log(response.name);
      } else {
        addCityName(response.name);
        $('.cityButton').on('click', (function () {
          searchWeather($(this).text(), false)
        }));
        console.log(response.name);
        console.log(arrCities);
      };
      
      getUVindex(currLatitude, currLongitude);
    });
  });
}

function addCity(name, desc) {
  let addCity = $('<div>');
  let cityName = $('<button>').text(`${name} : ${desc}`).attr('class', 'cityButton col-12 bg-primary').prop('value', `${name}`);
  //let cityName = $('<button>').text(`${name}`).attr('class', 'col-12 bg-primary cityButton');
  addCity.append(cityName);
  $('#cities').append(addCity);
}

function addCityName(name) {
  let cityName = $('<button>').text(`${name}`).attr('class', 'cityButton col-12 bg-primary').prop('value', `${name}`);
  $('#cities').append(cityName);
}

function unixTime(uTime) {
  let unixTime = uTime;
  let milliseconds = unixTime * 1000;
  let dateObject = new Date(milliseconds);
  let humanDateFormat = dateObject.toLocaleDateString();
  return humanDateFormat;
}

function kelvin2F (temp) {
  temp = (temp - 273.15) * 1.80 + 32;
  temp = parseFloat(temp).toFixed(2);
  return temp;
}

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