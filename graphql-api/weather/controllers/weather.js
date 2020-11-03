const WeatherModel = require('../models/weather');

var dynamoose = require('dynamoose');
dynamoose.aws.sdk.config.update({
    //accessKeyId: config.awsdb.accessKeyId,
    //secretAccessKey: config.awsdb.secretAccessKey,
    region: "us-east-2"
  });

dynamoose.aws.ddb.local();
const Schema = dynamoose.Schema;
const weatherSchema = new Schema ({
    zip: {
        type: Number,
        hashKey: true
    },
    temp: {
        type: Number
    },
    humidity: {
        type: Number
    },
    windspeed: {
        type: Number
    },
    bar_pressure: {
        type: Number
    },
});

const Model = dynamoose.model("Weather", 
weatherSchema,
{
    create: false,
    update: false,
});

async function add(obj) {  
    try {
        //let m = new Model({'zip': this.zip, 'temp': this.temp, 'humidity': this.humidity, 'bar_pressure': this.bar_pressure, 'windspeed': this.windspeed})
        console.log("Adding weather: " + JSON.stringify(obj));
        //console.log("MOdel is: " + JSON.stringify(m));
        //m.save();
       await Model.update({"zip": obj.zip, "temp": obj.temp, "bar_pressure": obj.bar_pressure, "humidity": obj.humidity, "windspeed": obj.windspeed});
      // Model.batchPut()
     
    } catch (e) {
        console.error(e);
    }
}

async function create(zip,temp,humidity, windspeed, bar_pressure) {
    return new WeatherModel(zip, temp, humidity, bar_pressure,windspeed);
}

async function remove(obj) {  
    try {
        //let m = new Model({'zip': this.zip, 'temp': this.temp, 'humidity': this.humidity, 'bar_pressure': this.bar_pressure, 'windspeed': this.windspeed})
        console.log("Deleting weather: " + JSON.stringify(obj));
        //console.log("MOdel is: " + JSON.stringify(m));
        //m.save();
       await Model.delete({"zip": obj.zip});
      // Model.batchPut()
     
    } catch (e) {
        console.error(e);
    }
}

async function find(obj) {  
    try {
        //let m = new Model({'zip': this.zip, 'temp': this.temp, 'humidity': this.humidity, 'bar_pressure': this.bar_pressure, 'windspeed': this.windspeed})
        console.log("finding weather: " + JSON.stringify(obj));
        //console.log("MOdel is: " + JSON.stringify(m));
        //m.save();
       //Model.update({"zip": obj.zip, "temp": obj.temp, "bar_pressure": obj.bar_pressure, "humidity": obj.humidity, "windspeed": obj.windspeed});
      
       var retVal = await Model.query("zip").eq(obj.zip).exec();
       console.log("Retval is: " + JSON.stringify(retVal));

       return retVal;
      // Model.batchPut()
     
    } catch (e) {
        console.error(e);
    }
}


module.exports = {
    create,
    add,
    remove,
    find
}