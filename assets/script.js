// let myCities = [
//   {
//     id: "0",
//     cityName: "Houston",
//     lon: "-95.36",
//     lat: "29.76",
//     desc: "scattered clouds"
//   },
//   {
//     id: "1",
//     cityName: "Seoul",
//     lon: "126.98",
//     lat: "37.57",
//     desc: "overcast clouds"
//   }
// ]

let APIkey = '3d865cbadda85d3313ed6811a5f0f35d';
//let searchCity = '';
let UVindex = '';

// myCities.forEach(function(thisCity){
//   const city = $('<div>').attr({'class': 'row'}, {'id': 'myCities.id'});
//   const cityEl = $('<div>').attr({'class': 'col-12 cityBtn'});
//   $('#cities').append(city);
//   const cityBtn = $('<button>').attr({'class': 'col-12 btn-primary cityButton capitalise'}).text(`${thisCity.cityName}: ${thisCity.desc}`);
//   //cityBtn = text.toUpperCase();
//   cityEl.append(cityBtn);
//   city.append(cityEl);
// });

function getUVindex(lat, lon) {
  let UVindexURL = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=hourly,minutely&appid=${APIkey}`;
  $(document).ready(function () {
    $.ajax({
      url: UVindexURL,
      method: 'GET'
    }).then(function (giveDaily) {
      console.log(giveDaily);
      UVindex = giveDaily.current.uvi;
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
    let queryURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${APIkey}`;
    // let zipQuery = `https://api.openweathermap.org/data/2.5/weather?zip=${zipcode}&appid=${APIkey}`;
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
      
      // function to create row on #cities from search and set local storage for city name, temp desc, lat, lon


      getUVindex(currLatitude, currLongitude);
    });
  });
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