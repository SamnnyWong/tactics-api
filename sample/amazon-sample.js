'use strict';
import handler from "../libs/handler-lib";
// import constants from "../assets/constants";
var AWS = require('aws-sdk');
var s3 = new AWS.S3();
console.log('Loading hello world function');
export const main = handler(async (event, context) => {
    let name = "you";
    let city = 'World';
    let time = 'day';
    let day = '';
    let id = '';
    let responseCode = 200;

    var bucketName = "tactics-uploads";
    var keyName = "filename.txt";
    var content = 'This is a sample text file';
    var params = { Bucket: bucketName, Key: keyName, Body: content };

    try
    {
        const s3Response = await s3.putObject(params).promise();
        console.log(s3Response);
        // if succeed
        // handle response here
    }
    catch (ex)
    {
        // if failed
        // handle response here (obv: ex object)
        // you can simply use logging
        console.error(ex);
    }
    let greeting = `Good ${time}, ${name} of ${city}. id is ${id}`;
    if (day) greeting += ` Happy ${day}!`;

    let responseBody = {
        message: greeting,
    };
    let response = {
        statusCode: responseCode,
        headers: {
            "x-custom-header" : "my custom header value"
        },
        body: JSON.stringify(responseBody)
    };
    return response;
});

