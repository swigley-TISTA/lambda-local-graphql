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
  
    var schema = new GraphQLSchema({
      query: new GraphQLObjectType({
        name: 'RootQueryType',
        fields: {
          hello: {
            type: GraphQLString,
            resolve() {
              return 'world';
            },
          },
        },
      }),
    });


////////////
// We want to make a GET request with ?query=<graphql query>
  // The event properties are specific to AWS. Other providers will differ.


  exports.lambdaHandler = async (event, context, callback) => {
    var query = '{ hello }';
    let response = {};
    graphql(schema, query).then( (result) => {
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

  