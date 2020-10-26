import handler from "../libs/handler-lib";
import fetch from "node-fetch";
// var jmespath = require('jmespath');
// import * as utility from "../utility/putObjectToS3";
// import * as uuid from "uuid";
// import constants from "../assets/constants";
// import dynamoDb from "../libs/dynamodb-lib";

var AWS = require('aws-sdk');
var s3 = new AWS.S3();

//get latestVersionNumber = "https://f8brp6pbai.execute-api.ap-northeast-1.amazonaws.com/dev/latest-patch-version";
// service url: https://f8brp6pbai.execute-api.ap-northeast-1.amazonaws.com/dev/save-patch-file/?

// take in a version number from url then output the required file path
// List all available(downloaded in s3 bucket) version in main db

// this function retrieves latest version number from cdragon,
// then use the latest version number to get the lastest patch file
// lastly write the file to s3 bucket

'use strict';
console.log('Loading hello world function');
export const main = handler(async (event, context) => {
    // let patchVersionNumber = "";
    // var dataLink2 = `http://raw.communitydragon.org/10.20/cdragon/tft/en_us.json`;
    //
    // var bucketName = "tactics-uploads";
    // var keyName = "filename.txt";
    // var content = 'This is a sample text file';
    // var params = { Bucket: bucketName, Key: keyName, Body: content };

    // var bucket = "tactics-uploads";
    // var key = "10.21_en_us.json";


    // s1 via internal service: getting version number
    const latestVersionNumber = async () => {
        var latestVersionNumberURL = "https://f8brp6pbai.execute-api.ap-northeast-1.amazonaws.com/dev/latest-patch-version";
        return await fetch(latestVersionNumberURL)
            .then(res => res.json())
            .then((jsonData) => {
                return jsonData;
            });
    };


    const number = await latestVersionNumber();
    console.log(number.latestPatchVersion);


    // s2: getting file
    const latestPatchJsonFile = async () => {
        // const number = await latestVersionNumber();
        const number = "10.21";
        console.log('LLLLLLLLLLLLLLLLLLLLLLLLatest version number ', number);
        var latestVersionNumberURL = `http://raw.communitydragon.org/${number}/cdragon/tft/en_us.json`;
        // await fetch(latestVersionNumberURL)
        // .then(
        //     function(res) {
        //         res.json();
        //     })
        //     .then(
        //         function(jsonData) {
        //
        //             console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@");
        //
        //             // const res1 = jmespath.search(jsonData, `sets."3".champions[]`);
        //             console.log('Checkout this JSON! ', jsonData);
        //             console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@");
        //             console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@");
        //         }
        //     );


        return await fetch(latestVersionNumberURL)
            .then(res => res.json())
            .then((jsonData) => {
                // const newChampions = jmespath.search(jsonData, `sets."3".champions[]`);
                // console.log('Checkout this JSON! ', newChampions[1]);
                return jsonData;
            });
    };

    console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
    // this is top level function
    // handle error here


    try {
        const patchdata = JSON.stringify(await latestPatchJsonFile());
        // const newChampions = jmespath.search(patchdata, `sets."4".champions[]`);
        var params = {
            Bucket: "tactics-uploads",
            Key: "filename.json",
            Body: patchdata };
        const s3Response = await s3.putObject(params).promise();

        console.log("returning s3 response");
        console.log(s3Response);
        console.log("returning s3 response");

        // console.log(newChampions[1]);
        // console.log(s3Response);
    } catch (e) {
        // if get versionnumber or get patch file failed here, do something....

        console.log("Caught error: " + e.message);
    }

    // try
    // {
    //     const s3Response = await s3.putObject(params).promise();
    //     console.log(s3Response);
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

    // await fetch(dataLink2)
    //     .then(res => res.json())
    //     .then((jsonData) => {
    //             console.log('Checkout this JSON! ', jsonData);
    //             var params = {
    //                 Bucket : bucket,
    //                 Key : key,
    //                 Body : JSON.stringify(jsonData)
    //             };
    //             console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!123");
    //             s3.putObject(params, function(err, data) {
    //                 console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!123");
    //                 console.log("Uploading objects to s3");
    //                 console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!123");
    //                 if (err) console.log(err, err.stack); // an error occurred
    //                 else     console.log(data);           // successful response
    //
    //                 console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@");
    //                 console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@");
    //                 console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@");
    //
    //                 // let responseBody = {
    //                 //     message: greeting,
    //                 // };
    //                 let response = {
    //                     statusCode: responseCode,
    //                     headers: {
    //                         "x-custom-header" : "my custom header value"
    //                     },
    //                     body: JSON.stringify(data)
    //                 };
    //                 return response;
    //                 context.done();
    //             });
    //         }
    //     );


    let responseBody = {
        message: "HOWDY!",
    };
    let response = {
        // statusCode: responseCode,
        headers: {
            "x-custom-header" : "my custom header value"
        },
        body: JSON.stringify(responseBody)
    };
    return response;
});
