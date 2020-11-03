'use strict';

class Weather {

    constructor(zip, temp, humidity, bar_pressure, windspeed) {
        this.zip = zip;
        this.temp = temp;
        this.humidity = humidity;
        this.bar_pressure = bar_pressure;
        this.windspeed = windspeed; 
    }
    validate() {
        if (this.zip > 9999 && this.zip < 100000) {
            return true;
        } else return false;
        
    }

}

module.exports = Weather;
