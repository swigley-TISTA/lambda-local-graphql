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
  
  const getWeather = zip => promisify(callback =>
    dynamoDb.get({
      TableName: process.env.DYNAMODB_TABLE,
      Key: { zip },
    }, callback))
    .then((result) => {
      if (!result.Item) {
        return zip;
      }
      return result.Item;
    })
    .then(name => `Hello, ${name}.`);
  
  const updaetWeather = (zip, temp, windspeed, humidity, bar_pressure) => promisify(callback =>
    dynamoDb.update({
      TableName: process.env.DYNAMODB_TABLE,
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
        // the query has a field called 'greeting'
        greeting: {
          // we need to know the user's name to greet them
          args: { zip: { name: 'zip', type: new GraphQLNonNull(GraphQLString) } },
          // the greeting message is a string
          type: GraphQLString,
          // resolve to a greeting message
          resolve: (parent, args) => getWeather(args.zip),
        },
      },
    }),
    mutation: new GraphQLObjectType({
      name: 'RootMutationType', // an arbitrary name
      fields: {
        updaetWeather: {
          args: {
            temp: { name: 'temp', type: new GraphQLNonNull(GraphQLInt) },
            windspeed: { name: 'windspeed', type: new GraphQLNonNull(GraphQLInt) },
            humidity: { name: 'humidity', type: new GraphQLNonNull(GraphQLInt) },
            bar_pressure: { name: 'bar_pressure', type: new GraphQLNonNull(GraphQLInt) },
          },
          type: GraphQLString,
          resolve: (parent, args) => updaetWeather(args.zip, args.temp, args.windspeed, args.humidity, args.bar_pressure),
        },
      },
    }),
  });
  


////////////
// We want to make a GET request with ?query=<graphql query>
  // The event properties are specific to AWS. Other providers will differ.


exports.lambdaHandler = (event, context, callback) =>
graphql(schema, event.queryStringParameters.query)
.then(
  result => callback(null, { statusCode: 200, body: JSON.stringify(result) }),
  err => callback(err)
);
  