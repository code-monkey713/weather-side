let myCities = [
  {
    id: "0",
    cityName: "Houston",
    lon: "-95.36",
    lat: "29.76",
    desc: "scattered clouds"
  },
  {
    id: "1",
    cityName: "Seoul",
    lon: "126.98",
    lat: "37.57",
    desc: "overcast clouds"
  }
]

let currLongitude;
let currLatitude;
let currCity;
let currDesc;
let APIkey = '3d865cbadda85d3313ed6811a5f0f35d';
let searchCity = 'Houston';
let queryURL = `https://api.openweathermap.org/data/2.5/weather?q=${searchCity}&units=imperial&appid=${APIkey}`;
let UVindex = '';

myCities.forEach(function(thisCity){
  const city = $('<div>').attr({'class': 'row'}, {'id': 'myCities.id'});
  const cityEl = $('<div>').attr({'class': 'col-12 cityBtn'});
  $('#cities').append(city);
  const cityBtn = $('<button>').attr({'class': 'col-12 btn-primary cityButton capitalise'}).text(`${thisCity.cityName}: ${thisCity.desc}`);
  //cityBtn = text.toUpperCase();
  cityEl.append(cityBtn);
  city.append(cityEl);
});

// var arr = [
//   "Hi",
//   "Hello",
//   "Bonjour"
// ];
// arr.push("Hola");
// console.log(arr[3]);

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
        //console.log(date);
        //$(`#day${i}.class"fDate"`).html(date);
        //$("#day1").html(date);
        let icon = giveDaily.daily[i].weather[0].icon;
        //console.log(icon);
        let temp = kelvin2F(giveDaily.daily[i].temp.eve);
        //console.log(temp);
        let humidity = giveDaily.daily[i].humidity;
        //console.log(humidity);
        $(`#day${i}`).html(`<div>
          ${date}
          <img src="http://openweathermap.org/img/w/${icon}.png"></img>
          <p>Temp: ${temp} °F</p>
          Humidity: ${humidity}%
          </div>
        `);
      }
      
      //getForecast();
    })
  })
}

function getForecast(i) {
  //console.log('This is function to get the forecast.');

}

$(document).ready(function () {
  $.ajax({
    url: queryURL,
    method: 'GET'
  }).then(function (response) {
    console.log(response);
    let currDate = moment().format('L');
    $('#city').html(`${response.name} (${currDate})`);
    $('#temperature').html(response.main.temp + '°F');
    $('#weather_image').attr('src', 'http://openweathermap.org/img/w/' + response.weather[0].icon + '.png');
    // $("#main_weather").html(response.weather[0].main);
    // $("#description_weather").html(response.weather[0].description);
    // $("#pressure").html(response.main.pressure);
    $("#humidity").html(response.main.humidity);
    $("#wind-speed").html(response.wind.speed);
    $("#UVindex").html(UVindex);
    currLongitude = response.coord.lon;
    //console.log(currLongitude);
    currLatitude = response.coord.lat;
    //console.log(currLatitude);
    getUVindex(currLatitude, currLongitude);
    //getForecast();
  });
});

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

// $( document ).ready(function() {
//   var appID = "3d865cbadda85d3313ed6811a5f0f35d";

//   $(".query_btn").click(function(){
//       var query_param = $(this).prev().val();
//   })
// });

// $( document ).ready(function() {
//   var appID = "3d865cbadda85d3313ed6811a5f0f35d";

//   $(".query_btn").click(function(){

//       var query_param = $(this).prev().val();

//       if ($(this).prev().attr("placeholder") === "City") {
//           var weather = "http://api.openweathermap.org/data/2.5/weather?q=" + query_param + "&APPID=" + appID;
//           // console.log(weather);
//       } else if ($(this).prev().attr("placeholder") === "Zip Code") {
//           var weather = "http://api.openweathermap.org/data/2.5/weather?zip=" + query_param + "&APPID=" + appID;
//           console.log(weather);
//       }
//   })
// });

// $( document ).ready(function() {
//   var appID = "3d865cbadda85d3313ed6811a5f0f35d";

//   $(".query_btn").click(function(){
//       var query_param = $(this).prev().val();

//       if ($(this).prev().attr("placeholder") === "City") {
//           var weather = "http://api.openweathermap.org/data/2.5/weather?q=" + query_param + "&APPID=" + appID;
//           console.log(weather);
//           // let searchData = localStorage.setItem(weather);
//           let searchData = [];
//           searchData = localStorage.setItem('weather', JSON.stringify(weather));
//           console.log(searchData);
//       } else if ($(this).prev().attr("placeholder") === "Zip Code") {
//           var weather = "http://api.openweathermap.org/data/2.5/weather?zip=" + query_param + "&APPID=" + appID;
//           // console.log(weather);
//       }

//       $.getJSON(weather,function(json){
//           $("#city").html(json.name);
//           $("#main_weather").html(json.weather[0].main);
//           $("#description_weather").html(json.weather[0].description);
//           $("#weather_image").attr("src", "http://openweathermap.org/img/w/" + json.weather[0].icon + ".png");
//           $("#temperature").html(json.main.temp);
//           $("#pressure").html(json.main.pressure);
//           $("#humidity").html(json.main.humidity);
//           // let searchData = localStorage.setItem(json);
//           // console.log(searchData);
//       });
//   })