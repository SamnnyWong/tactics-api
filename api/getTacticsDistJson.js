// get all the patch history from db
// then send it to the mobile client

// service api-gateway:
// table name:
// table arn
import handler from "../libs/handler-lib";
// import constants from "../assets/constants";
var AWS = require('aws-sdk');
var s3 = new AWS.S3();
console.log('Loading hello world function');
export const main = handler(async (event, context) => {

    // DAVID_TO_DO:///////////////////////////////////////////////////////////////////////////////////////////
    // get all file from s3 bucket: tactics-dist, total 4 files,
    // serve it to the mobile front-end
    // 2 way to do this:
    // either: open all of these four files then return its content in response
    // or: simply serve the file as a whole, mobile front end download then open it locally.
    // this probably need to test with vue frontend
    var bucketName = "tactics-dist";//change to corresponding bucket name
    var paramlist = {
        Bucket: bucketName,
    };
    const response = await s3.listObjectsV2(paramlist).promise();
    console.log(response);
    return response;
});

