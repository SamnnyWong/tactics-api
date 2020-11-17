import handler from "../libs/handler-lib";
import fetch from "node-fetch";
import dynamoDb from "../libs/dynamodb-lib";
import s3Bucket from "../libs/s3bucket-libs";
import * as uuid from "uuid";
var jmespath = require('jmespath');

// import * as uuid from "uuid";

// var AWS = require('aws-sdk');
// var s3 = new AWS.S3();

// import constants from "../assets/constants";

// get latest version number from db
// construct the url then get the patch json file from cdragon
// then store it into dynamo db

// service api-gateway:
// table name:
// table arn


export const main = handler(async (event, context) => {
    // s1: query latest version number from table `patch-version-history`
    // s2: construct the cDragon url and fetch the json data
    // s4: upload the patch data to s3 bucket "tactics-upload"

    // s6: only return the following params and put into db when s - s is all succeed.


    const PATCH_VERSION_HISTORY_TABLE = "patch-version-history";
    const PATCH_DATA_HISTORY_TABLE = "patch-data-history";

    var params3 = {
        TableName: PATCH_VERSION_HISTORY_TABLE,// give it your table name
        Select: "ALL_ATTRIBUTES"
    };

    console.log("###Tactics Log###: Searching for latest patch version: Scanning DataBase...");
    let scanDBResponse = await dynamoDb.scan(params3);
    // error
    let latestVersionNumber  = scanDBResponse.Items.pop().patchVersion;

    console.log(`###Tactics Log###: Scanning DB completed, latest version from DataBase is ${latestVersionNumber}`);

    console.log("###Tactics Log###: Fetching latest patch data from cdragon...");
    let cdragonPatchDataURL = `http://raw.communitydragon.org/${latestVersionNumber}/cdragon/tft/en_us.json`;

    // console.log(`###Tactics Log###: !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!`);
    // // console.log(`###Tactics Log###: ${JSON.stringify(scanDBResponse)}`);
    // console.log(`###Tactics Log###: ${JSON.stringify(scanDBResponse.Items)}`);
    // console.log(`###Tactics Log###: !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!`);
    // console.log(`###Tactics Log###: ${JSON.stringify(scanDBResponse.Items[0])}`);



    let latestPatchJsonData = await fetch(cdragonPatchDataURL);
    let result = await latestPatchJsonData.json();

    // console.log(result);
    // var names = jmespath.search(result, `sets."`+ latestSetNumberw +`".champions[]`);
    // var names = jmespath.search(result, `sets."3".champions[]`);
    var sets = jmespath.search(result, `sets`);
    var setNumbers = [];
    for(var k in sets) setNumbers.push(k);
    var latestSetNumber = setNumbers.pop(); //4
    console.log(`###Tactics Log###: Fetch patch data success, current patch version: set ` + latestSetNumber);

    /////////////////// putting into s3 bucket
    console.log(`###Tactics Log###: Putting latest patch file into S3 Bucket, service initializing...`);
    let s3ObjectKey =  latestVersionNumber + '_en_us.json';
    var params = {
        Bucket: "tactics-uploads",
        Key: s3ObjectKey,
        Body: JSON.stringify(result)
    };
    const s3Response = await s3Bucket.putObject(params);
    // s3Bucket
    // const s3Response = await s3.putObject(params).promise();
    console.log("returning s3 response");
    console.log(s3Response);
    console.log("returning s3 response");
    console.log(`###Tactics Log###: Put into s3 bucket success. Object etag: `+ JSON.stringify(s3Response));

    console.log(`###Tactics Log###: Constructing patch-version-history node, putting in db, service initializing...`);
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();
    today = yyyy + '-' + mm + '-' + dd;
    let patchVersionNode = {
        "TableName": PATCH_DATA_HISTORY_TABLE,
        "Item": {
            "uuid": uuid.v1(),
            "date": today,
            "cdragonPatchDataURL": cdragonPatchDataURL,
            "patchVersion": latestVersionNumber,
            "setVersionNumber": latestSetNumber,
            "s3ObjectKey": s3ObjectKey
        }
    };
    let putDBResponse = await dynamoDb.put(patchVersionNode);
    if (! putDBResponse) {
        throw Error('###Tactics Log###: Putting in DB failed, service terminating...');
    }
    console.log("###Tactics Log###: Putting into DynamoDB success.");
    let successMessage = JSON.stringify(`Params: ${JSON.stringify(patchVersionNode)} put into table: ${PATCH_DATA_HISTORY_TABLE} success.`);
    let response = {
        "latestPatchVersion": latestVersionNumber,
        "message": successMessage
    };
    return response;
});

