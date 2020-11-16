import handler from "../libs/handler-lib";
import fetch from "node-fetch";
// import constants from "../assets/constants";

var AWS = require('aws-sdk');
var s3 = new AWS.S3();

//get latestVersionNumber = "https://f8brp6pbai.execute-api.ap-northeast-1.amazonaws.com/dev/latest-patch-version";
// service url: https://f8brp6pbai.execute-api.ap-northeast-1.amazonaws.com/dev/save-patch-file/?

// take in a version number from url then output the required file path
// List all available(downloaded in s3 bucket) version in main db

'use strict';
console.log('Loading hello world function');
export const main = handler(async (event, context) => {
    let name = "you";
    let city = 'World';
    let time = 'day';
    let day = '';
    let id = '';
    let responseCode = 200;

    // let patchVersionNumber = "";
    // let dataLink1 = "";
    var dataLink2 = `http://raw.communitydragon.org/10.20/cdragon/tft/en_us.json`;

    // var dataLink1 = "http://raw.communitydragon.org/10.15/cdragon/tft/en_us.json";
    // console.log("request: " + JSON.stringify(event));

    // let latestPatchVersion = "https://f8brp6pbai.execute-api.ap-northeast-1.amazonaws.com/dev/latest-patch-version";
    // await fetch(jsonFileUrl)
    //     .then(res => res.json())
    //     .then((jsonData) => {
    //         console.log('The latest version number is: ', jsonData);
    //         // let patchVersionNumber = jsonData;
    //         dataLink1 = `http://raw.communitydragon.org/${jsonData}/cdragon/tft/en_us.json`;
    //         // console.log(jsonData);
    //     }
    //     );
    // if (dataLink1) {
    var bucketName = "tactics-uploads";
    var keyName = "filename.txt";
    var content = 'This is a sample text file';
    var params = { Bucket: bucketName, Key: keyName, Body: content };

    // var bucket = "tactics-uploads";
    // var key = "10.21_en_us.json";
    await fetch(dataLink2)
        .then(res => res.json())
        .then((jsonData) => {
                console.log('Checkout this JSON! ', jsonData);
                var params = {
                    Bucket : bucket,
                    Key : key,
                    Body : JSON.stringify(jsonData)
                };
                console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!123");
                s3.putObject(params, function(err, data) {
                    console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!123");
                    console.log("Uploading objects to s3");
                    console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!123");
                    if (err) console.log(err, err.stack); // an error occurred
                    else     console.log(data);           // successful response

                    console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@");
                    console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@");
                    console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@");

                    // let responseBody = {
                    //     message: greeting,
                    // };
                    let response = {
                        statusCode: responseCode,
                        headers: {
                            "x-custom-header" : "my custom header value"
                        },
                        body: JSON.stringify(data)
                    };
                    return response;
                    context.done();
                });
            }
        );
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
