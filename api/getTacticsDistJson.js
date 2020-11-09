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

    // first fetch service status

    // if ready: scan all tables then write to s3 bucket tactics-dist
    // if not ready, haults.
    // https://f8brp6pbai.execute-api.ap-northeast-1.amazonaws.com/dev/tactics-service-status
    //

    var bucketName = "tactics-dist";//change to corresponding bucket name
    var paramlist = {
        Bucket: bucketName,
    };
    const response = await s3.listObjectsV2(paramlist).promise();
    console.log(response);

    // // find the last version number of the current patch
    // try{
    //     const response = await s3.listObjectsV2(paramlist).promise();
    //     //sort files by last modified date
    //     var timesort = response.Contents.sort((a, b) => (a.LastModified < b.LastModified) ? 1 : -1);
    //     // console.log(timesort[0]); //return the file with last modified date
    //
    // } catch(e){
    //     console.error(e);
    // };
    // let response = {
    //     statusCode: responseCode,
    //     headers: {
    //         "x-custom-header" : "my custom header value"
    //     },
    //     body: JSON.stringify(responseBody)
    // };
    return response;
});

