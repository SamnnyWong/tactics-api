import handler from "../libs/handler-lib";
import fetch from "node-fetch";
// import constants from "../assets/constants";

var AWS = require('aws-sdk');
var s3 = new AWS.S3();

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

    // let jsonFileUrl = "https://f8brp6pbai.execute-api.ap-northeast-1.amazonaws.com/dev/latest-patch-version";
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
    var keyName = "filename2222.txt";
    var content = 'This is a sample text file';
    var params = { Bucket: bucketName, Key: keyName, Body: content };

    // var bucket = "tactics-uploads";
    // var key = "10.21_en_us.json";
    await fetch(dataLink2)
        .then(res => res.json())
        .then((jsonData) => {
            console.log('Checkout this JSON! ', jsonData);
            // var params = {
            //     Bucket : bucket,
            //     Key : key,
            //     Body : JSON.stringify(jsonData)
            // };
            // console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!123");
            // s3.putObject(params, function(err, data) {
            //     console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!123");
            //     console.log("Uploading objects to s3");
            //     console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!123");
            //     if (err) console.log(err, err.stack); // an error occurred
            //     else     console.log(data);           // successful response
            //
            //     console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@");
            //     console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@");
            //     console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@");
            //
            //     // let responseBody = {
            //     //     message: greeting,
            //     // };
            //     let response = {
            //         statusCode: responseCode,
            //         headers: {
            //             "x-custom-header" : "my custom header value"
            //         },
            //         body: JSON.stringify(data)
            //     };
            //     return response;
            //     context.done();
            // });
            }
        );
    // try
    // {
        const s3Response = await s3.putObject(params).promise();
        console.log(s3Response);
        // if succeed
        // handle response here
    // }
    // catch (e)
    // {
        // if failed
        // handle response here (obv: ex object)
        // you can simply use logging
    //     console.error(e);
    // }
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

// var AWS = require('aws-sdk');
// var s3 = new AWS.S3();
// console.log("onloading");
// export const main = handler(async (event, context, callback) => {
// // exports.handler = (event, context, callback) => {
//     var bucketName = "tactics-uploads";
//     var keyName = "filename";
//     var content = 'This is a sample text file';
//
//     var params = { Bucket: bucketName, Key: keyName, Body: content };
//     return s3.putObject(params).promise()
//         .then(res => {
//         callback(null, res);
//         })
//         .catch(err => {
//             callback(err, null);
//         });

//     function upload() {
//
//         console.log("s1 in uploading");
//         return new Promise((resolve, reject) => {
//
//
//             console.log("s2 right b4 upload");
//             s3.upload({
//                 Bucket: 'tactics-uploads',
//                 Key: "filename.json",
//                 Body: 'This is a sample text file'
//             }, function(err, data) {
//
//                 console.log("s3 in upload call back");
//                 if (err) {
//
//                     console.log("s4 in upload callback error");
//                     console.log("Error: ", err);
//                     return reject(err);
//                 }
//                 if (data) {
//                     console.log("Success: ", data.Location);
//                     return resolve();   //potentially return resolve(data) if you need the data
//                 }
//             });
//         });
//     }
//
//     upload()
//         .then(data => { //if you don't care for the data returned, you can also do .then(() => {
//             //handle success, do whatever else you want, such as calling callback to end the function
//
//             console.log("upload is called and on returning");
//             console.log("?????????");
//             console.log(data);
//             console.log("?????????");
//         })
//         .catch(error => {
//             //handle error
//             console.log("!!!!!!!!!!!!");
//             console.log("Error: ", error);
//
//             console.log("!!!!!!!!!!!!");
//         });
// });



//
// var bucketName = "tactics-uploads";
// var keyName = "filename.txt";
// var content = 'This is a sample text file';
// var params = { Bucket: bucketName, Key: keyName, Body: content };
//
// try
// {
//     const s3Response = await s3.putObject(params).promise();
//     console.log("returning s3 response");
//     console.log(s3Response);
//     console.log("returning s3 response");
//     // if succeed
//     // handle response here
// }
// catch (ex)
// {
//     // if failed
//     // handle response here (obv: ex object)
//     // you can simply use logging
//     console.error(ex);
// }
// var dataLink1 = "http://raw.communitydragon.org/10.21/cdragon/tft/en_us.json";
// var dataLink2 = "http://raw.communitydragon.org/10.14/cdragon/tft/en_us.json";

// var jsonData = require(dataLink2);
