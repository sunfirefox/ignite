//[
// Copyright (c) 2011, Richard Miller-Smith & David Hammond.
// All rights reserved. Redistribution and use in source and binary forms, 
// with or without modification, are permitted provided that the following 
// conditions are met:
//
//     * Redistributions of source code must retain the above copyright
//       notice, this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above
//       copyright notice, this list of conditions and the following
//       disclaimer in the documentation and/or other materials provided
//       with the distribution.
//     * Neither the name of the ignite.js project, nor the names of its
//       contributors may be used to endorse or promote products derived
//       from this software without specific prior written permission.
//
// THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS
// "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT
// LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR
// A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT
// OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
// SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
// LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
// DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY
// THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
// (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
// OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//]

//
// This example queries the [Yahoo! Weather RSS feed](http://developer.yahoo.com/weather/) 
// for locations in a list of major cities, displaying the 
// returned weather conditions for each.
//
// The state machines only state, `MajorCityWeather`, uses the 
// [each][EACH] plug-in to iterate over a list of 
// WOEID ([Where On Earth ID](http://developer.yahoo.com/geo/geoplanet/guide/concepts.html)) 
// codes representing the city locations. At each iteration the 
// `yahooapis.request` function is called with arguments
// generated by the [`fnArgs`][EACH_FNARGS] function.
//
// When a response from any RSS request is received the 
// [`iterator`][EACH_ITR] function is called which simply dumps 
// the returned data to the console. The [`par`][EACH_PAR] 
// parameter is used to set the maximum number of requests 
// made in parallel to no more than 6.
//
// Example Output:
// $ ./bin/ignite examples/plugins/each/weather_yahooapis.js
// Running examples/plugins/each/weather_forecast.js
// London, United Kingdom: 18C Partly Cloudy
// Paris, France: 20C Mostly Cloudy
// Mosco, Mexico: 16C Mostly Cloudy
// Beijing, China: 26C Fair
// Tokyo, Japan: 29C Mostly Cloudy
// Mumbai, India: 31C Haze
// San Fransisco, Spain: 27C Partly Cloudy
// New York, United States: 23C Partly Cloudy
// Barcelona, Spain: 27C Partly Cloudy
// Texas, United States: 21C Fair
// Seoul, South Korea: 27C Cloudy
// Sao Paulo, Brazil: 11C Fair
// Jakarta, Indonesia: 29C Partly Cloudy
// Karachi, Pakistan: 33C Mostly Cloudy
// Istanbul, Turkey: 28C Partly Cloudy
// Mexico, Mexico: 16C Mostly Cloudy
// Shanghai, China: 30C Mostly Cloudy
// Bangkok, Thailand: 31C Light Rain
// New Delhi, India: 31C Fog
// Hong Kong, Hong Kong: 33C Partly Cloudy
// run: examples/plugins/each/weather_forecast.js Exited with no error.
// $ _
//

var yahooapis = require('../../weather_yahooapis');

function weatherForecast (fire, woeidArray) {
  this.startState = 'MajorCityWeather';
  this.states = {
    MajorCityWeather: {
      each: {
        fn: 'request',
        fnArgs: function (woied) {
          return { 'w': woied, 'u': 'c' };
        },        
        iterator: function (itr, err, data) {
          if (err) {
            console.error(err);
          } else {
            console.log('%s', data);
          }
        },
        par: 6
      },
      actions: {
        '.done': '@exit'
      }
    }
  };
};

weatherForecast.defaults = {
  imports: { request: yahooapis.request },
  args: [ yahooapis.majorCities ]
};

module.exports = weatherForecast;
