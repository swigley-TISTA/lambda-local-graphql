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
    GraphQLFloat,
  } = require('graphql');
  
  const AWS = require('aws-sdk');
  AWS.config.update({
    region: "us-east-2",
    endpoint: "http://localhost:8000"
  });
  
  const dynamoDb = new AWS.DynamoDB.DocumentClient();

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
      zip: { type: GraphQLString },
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
  const getWeather2 = zip => testWeather;
    
  

  const getWeather = (zip) => 
    promisify(callback => 
      dynamoDb.query( 
        { TableName : "Weather",
          KeyConditionExpression: "#zip = :zip",
          ExpressionAttributeNames:{
              "#zip": "zip"
          },
          ExpressionAttributeValues: {
              ":zip": zip
          }
        }, callback)
    ).then( (data) => { 

      ret =  data.Items[0];
      console.log("GOt data: " + JSON.stringify(ret));
    });
  
  
  const updateWeather = (zip, temp, windspeed, humidity, bar_pressure) => promisify(callback =>
    dynamoDb.update({
      TableName: "Weather",
      Key: { zip },
      UpdateExpression: 'SET humidity = :humidity, temp = :temp, windspeed = :windspeed, bar_pressure = :bar_pressure',
      ExpressionAttributeValues: {
        ':temp': temp,
        ':windspeed': windspeed,
        ':humidity': humidity,
        ':bar_pressure': bar_pressure
      },
    }, callback))
    .then(() => weather);
  
    
  const schema = new GraphQLSchema({
    query: new GraphQLObjectType({
      name: 'RootQueryType', // an arbitrary name
      fields: {
        // the query has a field called 'weather'
        weather: {
          args: { zip: { name: 'zip', type: new GraphQLNonNull(GraphQLString) } },
          type: WeatherType,
          
          // resolve to a greeting message
          resolve: (parent, args) => getWeather2(args.zip)
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
          resolve: (parent, args) => updateWeather(args.zip, args.temp, args.windspeed, args.humidity, args.bar_pressure),
        },
      },
    }),
  });
  

/*
var schema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
      weather: {
        type: GraphQLString,
        resolve() {
          return 'world';
        },
      },
    },
  }),
});
*/
////////////
// We want to make a GET request with ?query=<graphql query>
  // The event properties are specific to AWS. Other providers will differ.


  exports.lambdaHandler = async (event, context, callback) => {
    
    let response = {};
    
    let body = JSON.parse(event.body);
    console.log("Sending qeury: " + JSON.stringify(body.query));
    graphql(schema, body.query).then( (result) => {
      // Prints
      // {
      //   data: { hello: "world" }
      // }

      console.log("Sending result: " + JSON.stringify(result));
      response = {
        'statusCode': 200,
        'body': JSON.stringify({
            'message': result
        })
      }
      callback(null,response);
    });
    
    return response;
};
