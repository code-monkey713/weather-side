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
let queryURL = `https://api.openweathermap.org/data/2.5/weather?q=${searchCity}&appid=${APIkey}`;
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

function getForecast(lat, lon) {
  console.log('This is the forecast function!');
  console.log(lat);
  console.log(lon);
  let forecastURL = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=hourly,minutely&appid=${APIkey}`;
  $(document).ready(function () {
    $.ajax({
      url: forecastURL,
      method: 'GET'
    }).then(function (giveFore) {
      console.log(giveFore);
      UVindex = giveFore.current.uvi;
      console.log(UVindex);
      $("#UVindex").html(UVindex);
    })
  })
}

$(document).ready(function () {
  $.ajax({
    url: queryURL,
    method: 'GET'
  }).then(function (response) {
    console.log(response);
    $('#city').html(`${response.name} Weather Details`);
    $("#temperature").html(response.main.temp);
    $("#weather_image").attr("src", "http://openweathermap.org/img/w/" + response.weather[0].icon + ".png");
    // $("#main_weather").html(response.weather[0].main);
    // $("#description_weather").html(response.weather[0].description);
    // $("#pressure").html(response.main.pressure);
    $("#humidity").html(response.main.humidity);
    $("#wind-speed").html(response.wind.speed);
    $("#UVindex").html(UVindex);
    currLongitude = response.coord.lon;
    console.log(currLongitude);
    currLatitude = response.coord.lat;
    console.log(currLatitude);
    getForecast(currLatitude, currLongitude);
    
  });
});

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

//   // Optional Code for temperature conversion
//   var fahrenheit = true;

//   $("#convertToCelsius").click(function() {
//       if (fahrenheit) {
//           $("#temperature").text(((($("#temperature").text() - 32) * 5) / 9));
//       }
//       fahrenheit = false;
//   });

//   $("#convertToFahrenheit").click(function() {
//       if (fahrenheit === false) {
//           $("#temperature").text((($("#temperature").text() * (9/5)) + 32));
//       }
//       fahrenheit = true;
//   });
// });