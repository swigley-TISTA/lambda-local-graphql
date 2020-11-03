

const Weather = require('../../models/weather');


const faker = require('faker');


/**
 * Generate an object which container attributes needed
 * to successfully create a weather instance.
 *
 * @param  {Object} props Properties to use for the weather.
 *
 * @return {Object}       An object to build the weather from.
 */
const data =  (props = {}) => {
    console.log("getting data..")
    const defaultProps = {
        zip: faker.random.number(99999),
        temp: faker.random.number(100),
        humidity: faker.random.float(),
        windspeed: faker.random.number(100),
        bar_pressure: faker.random.number(100)
    };
   // (props = {}) => 
   console.log("props: " + JSON.stringify(props));
   return new Weather(props.zip, props.temp, props.humidity, props.windspeed, props.bar_pressure);
};

module.exports.createWeatherObject =  (props = {}) => {
   return  data(props);
}

/**
 * Generates a weather instance from the properties provided.
 *
 * @param  {Object} props Properties to use for the weather.
 *
 * @return {Object}       A weather instance
 */

const data2 = async (props = {}) => {
    const defaultProps = {
        zip: faker.random.number(99999),
        temp: faker.random.number(100),
        humidity: faker.random.float(),
        windspeed: faker.random.number(100),
        bar_pressure: faker.random.number(100)
    };
    console.log("Generated values for weather: " + JSON.stringify(defaultProps));
    console.log("assigning props: " + JSON.stringify(props));
    return  Object.assign({},props);
};

module.exports.createWeather = (zip, temp, humidity, windspeed, bar_pressure) => Weather.create({
    'zip': 12344, 
    'temp': 3, 
    'humidity': 0.4, 
    'windspeed': 21, 
    'bar_pressure': 31
});
