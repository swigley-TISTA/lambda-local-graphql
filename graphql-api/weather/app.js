// const axios = require('axios')
// const url = 'http://checkip.amazonaws.com/';
let response;
require('dotenv').config();
console.log("Loading node envoronment: " + JSON.stringify(process.env.NODE_ENV));

const {
    graphql,
    GraphQLSchema,
    GraphQLObjectType,
    GraphQLString,
    GraphQLInt,
    GraphQLNonNull,
    GraphQLList,
    GraphQLScalarType,
    GraphQLFloat
  } = require('graphql');
  
  const AWS = require('aws-sdk');
  AWS.config.update({
    region: "us-east-2",
    endpoint: "http://localhost:8000"
  });
  
  const dynamoDb = new AWS.DynamoDB.DocumentClient();

  const weatherController = require('./controllers/weather');

/**
 *
 * Event doc: https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html#api-gateway-simple-proxy-for-lambda-input-format
 * @param {Object} event - API Gateway Lambda Proxy Input Format
 *
 * Context doc: https://docs.aws.amazon.com/lambda/latest/dg/nodejs-prog-model-context.html 
 * @param {Object} context
 *
 * Return doc: https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html
 * @returns {Object} object - API Gateway Lambda Proxy Output Format
 * 
 */
  
  const promisify = foo => new Promise((resolve, reject) => {
    foo((error, result) => {
      if (error) {
        reject(error);
      } else {
        resolve(result);
      }
    });
  });

     
  var WeatherType = new GraphQLObjectType({
    name: 'Weather',
    fields: {
      zip: { type: GraphQLInt },
      temp: { type: GraphQLInt },
      windspeed: { type: GraphQLInt },
      humidity: { type: GraphQLFloat },
      bar_pressure: { type: GraphQLInt },
      formatted: {
        type: GraphQLString,
        resolve(obj) {
          return obj.zip + ' ' + obj.temp + ' ' + obj.windspeed + ' ' + obj.humidity + ' ' + obj.bar_pressure
        }
      }
    }
  });

// this should be better than what we're getting.  The function call sholud be fixed
//.
  const testWeather = { "zip": 38419,
    "temp" : 79,
    "windspeed" : 44,
    "humidity" : 0.45,
    "bar_pressure" : 42
    };


  const getWeather = async (zip) => await weatherController.find({"zip": zip});
  
  
  const updateWeather = (zip, temp, windspeed, humidity, bar_pressure) => {
    var w1 =  weatherController.create(zip, temp, windspeed, humidity, bar_pressure);
    console.log("Adding weather: " + JSON.stringify(w1));
    weatherController.add(w1);

  }
  
    
  const schema = new GraphQLSchema({
    query: new GraphQLObjectType({
      name: 'RootQueryType', // an arbitrary name
      fields: {
        // the query has a field called 'weather'
        weather: {
          args: { zip: { name: 'zip', type: new GraphQLNonNull(GraphQLInt) } },
          type: WeatherType,
          // resolve to a greeting message
          resolve: async (parent, args) => await getWeather(Number(args.zip))
        },
      },
    }),
    mutation: new GraphQLObjectType({
      name: 'RootMutationType', // an arbitrary name
      fields: {
        updateWeather: {
          args: {
            temp: { name: 'temp', type: new GraphQLNonNull(GraphQLInt) },
            windspeed: { name: 'windspeed', type: new GraphQLNonNull(GraphQLInt) },
            humidity: { name: 'humidity', type: new GraphQLNonNull(GraphQLInt) },
            bar_pressure: { name: 'bar_pressure', type: new GraphQLNonNull(GraphQLInt) },
          },
          type: GraphQLString,
          resolve: (parent, args) => updateWeather(args.zip, args.temp, args.windspeed, args.humidity, args.bar_pressure)
        },
      },
    }),
  });
  

////////////
// We want to make a GET request with ?query=<graphql query>
  // The event properties are specific to AWS. Other providers will differ.


  exports.lambdaHandler = async (event, context, callback) => {
    
    let response = {};
    
    let body = JSON.parse(event.body);
    console.log("Sending qeury: " + JSON.stringify(body.query));
    
    
    
    return response;
};
