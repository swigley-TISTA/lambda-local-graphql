'use strict';

const chai = require('chai');
const Weather = require('../../models/weather');
const weatherController = require('../../controllers/weather');
require('dotenv').config();
console.log("Loading node envoronment: " + JSON.stringify(process.env.NODE_ENV));

const weatherFactory = require('../factories/weather');
const expect = chai.expect;
var event, context;


describe('Test Weather model remove instance', function () {
    it('creates a new weather instance with the given attributes', async () =>
        {
            console.log("test.")

            var w = new Weather(1111,1,2.0,3,4);

            

            console.log("Weather is: " + JSON.stringify(w));         
            await weatherController.remove(w);

            //const output = weatherFactory.createWeatherObject({"zip": "12345", "temp":80, "windspeed": 30, "humidity": 0.75, "bar_pressure": 20});
            console.log("test output count." + JSON.stringify(w));
        });
});


describe('Test Weather model create instance', function () {
    it('creates a new weather instance with the given attributes', async () =>
        {
            console.log("test.")

            var w = new Weather(1111,1,2.0,3,4);

            

            console.log("Weather is: " + JSON.stringify(w));         
            await weatherController.create(w);
            //const output = weatherFactory.createWeatherObject({"zip": "12345", "temp":80, "windspeed": 30, "humidity": 0.75, "bar_pressure": 20});
            //console.log("test output." + JSON.stringify(output));
        });
});

describe('Test Weather model find instance', function () {
    it('creates a new weather instance with the given attributes', async () =>
        {
            console.log("test.")

            var w = new Weather(1111,1,2.0,3,4);
            
            await weatherController.add(w)
            const actual = await weatherController.find({"zip": 1111});
            console.log("Found acutal: " + JSON.stringify(actual));
        });
});
