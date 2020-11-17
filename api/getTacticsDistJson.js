// get all the patch history from db
// then send it to the mobile client

// service api-gateway:
// table name:
// table arn
import handler from "../libs/handler-lib";
import s3Bucket from "../libs/s3bucket-libs";
// import constants from "../assets/constants";
var AWS = require('aws-sdk');
var s3 = new AWS.S3();
console.log('Loading hello world function');
export const main = handler(async (event, context) => {
    let response = {
    }

    const DIST_COMPS_JSON = "tactics_dist_composition.json";
    const DIST_CHAMPIONS_JSON = "tactics_dist_champions.json";
    const DIST_ITEMS_JSON = "tactics_dist_items.json";
    const DIST_TRAITS_JSON = "tactics_dist_composition.json";

    // DAVID_TO_DO:///////////////////////////////////////////////////////////////////////////////////////////
    // get all file from s3 bucket: tactics-dist, total 4 files,
    // serve it to the mobile front-end
    // 2 way to do this:
    // either: open all of these four files then return its content in response
    // or: simply serve the file as a whole, mobile front end download then open it locally.
    // this probably need to test with vue frontend
    var bucketName = "tactics-dist";//change to corresponding bucket name
    var listS3Params = {
        Bucket: bucketName,
    };
    const listS3Response = await s3.listObjectsV2(listS3Params).promise();
    // console.log(listS3Response);

    let itemJsonFile = listS3Response.Contents[3];

    let itemJsonFileKey = "tactics-dist-champions.json";
    // let itemJsonFileKey = itemJsonFile.Key;
    console.log(itemJsonFile);
    console.log(itemJsonFileKey);
    var params2 = {
        Bucket: bucketName,
        Key: itemJsonFileKey,
        // Etag: '251a76342e3e6c39274582bbc257b582'
    };
    let file = await s3Bucket.getObject(params2);

    let objectData = file.Body.toString('utf-8');
    let jsonObj = JSON.parse(objectData);

    console.log(jsonObj);
    response.Contents = jsonObj;
    return response;
});

