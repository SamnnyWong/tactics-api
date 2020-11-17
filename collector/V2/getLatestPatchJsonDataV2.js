import handler from "../../libs/handler-lib";
import fetch from "node-fetch";
import dynamoDb from "../../libs/dynamodb-lib";
import s3Bucket from "../../libs/s3bucket-libs";
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
    var dateObject = new Date();
    let isoTimeStamp = dateObject.toISOString();
    const PATCH_VERSION_HISTORY_TABLE = "patch-version-history";
    const PATCH_DATA_HISTORY_TABLE    = "patch-data-history";

    let response = {
        "latestPatchVersion": '',
        "message": '',
        "newSetVersionNumber": null
    };

    var PVHParams = {
        TableName: PATCH_VERSION_HISTORY_TABLE,// give it your table name
        Select: "ALL_ATTRIBUTES"
    };

    var PDHParams = {
        TableName: PATCH_DATA_HISTORY_TABLE,// give it your table name
        Select: "ALL_ATTRIBUTES"
    };
    console.log("###Tactics Log###: Searching for latest patch version: Scanning PVH and PDH...");
    let scanPVHResponse = await dynamoDb.scan(PVHParams);
    let scanPDHResponse = await dynamoDb.scan(PDHParams);

    if (!scanPVHResponse || !scanPDHResponse) {
        throw Error('###Tactics Log###: Can not get PVH/PDH record: Service Terminating...');
    }
    scanPVHResponse.Items.sort(function(a, b) {
        return (a.createdAt < b.createdAt) ? -1 : ((a.createdAt > b.createdAt) ? 1 : 0);
    });

    scanPDHResponse.Items.sort(function(a, b) {
        return (a.createdAt < b.createdAt) ? -1 : ((a.createdAt > b.createdAt) ? 1 : 0);
    });
    let currentPVHRecord  = scanPVHResponse.Items.pop();
    let currentPDHRecord  = scanPDHResponse.Items.pop();
    let currentPVHVersionNumber = currentPVHRecord.patchVersion;
    let currentPDHVersionNumber = currentPDHRecord.patchVersion;
    var currentPDHRecordSetVersioNumber = currentPDHRecord.setVersioNumber;
    console.log(`###Tactics Log###: Scanning PVH and PDH completed.`);
    console.log(`###Tactics Log###: latest PVH record: ${currentPVHVersionNumber}, latest PDH record: ${currentPDHVersionNumber}.`);


    if (currentPVHVersionNumber === currentPDHVersionNumber) {
        // if its the same, update a last check time stamp.
        console.log(`###Tactics Log###: Skipping update...`);
        var updatedCurrectPDHRecord = {
            TableName: PATCH_DATA_HISTORY_TABLE,
            Key: {
                "uuid": currentPDHRecord.uuid,
                "createdAt": currentPDHRecord.createdAt,
            },
            UpdateExpression: "set lastCheck = :x",
            ExpressionAttributeValues: {
                ":x": isoTimeStamp,
            },
            ReturnValues: updatedCurrectPDHRecord //what does thi do?
        };
        console.log("###Tactics Log###: Updating the current PDH record...");
        let updateDBResponse = await dynamoDb.update(updatedCurrectPDHRecord);
        console.log(updateDBResponse); //2020-10-30T21:10:42.987Z	713f8110-5d56-4782-9921-786ce3ff6a9a	INFO	{} ?????????????
        let message = JSON.stringify(`PDH is up-to-date, PDH record: ${currentPDHRecord.uuid} lastCheck time: ${isoTimeStamp}`);
        response.latestPatchVersion = currentPVHVersionNumber;
        response.message = message;
    }
    else {
        // if latest PVH and PDH has different patch version number:
        // fetch the latest cdragon json file
        // construct the latest PDH record
        // compare the set number
        // if same, fire the web crawler
        // if diff, fire the createNewTable
        console.log(`###Tactics Log###: Initializing update...`);

        console.log("###Tactics Log###: Fetching latest patch data from cdragon...");
        let cdragonPatchDataURL = `http://raw.communitydragon.org/${currentPVHVersionNumber}/cdragon/tft/en_us.json`;

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
        var latestSetVersioNumber = setNumbers.pop(); //4
        console.log(`###Tactics Log###: Fetch cdragon patch data success, version: ${currentPVHVersionNumber} @ set ` + latestSetVersioNumber);

        /////////////////// putting into s3 bucket
        console.log(`###Tactics Log###: Putting latest patch file into S3 Bucket, service initializing...`);
        let s3ObjectKey =  currentPVHVersionNumber + '_en_us.json';
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

        console.log(`###Tactics Log###: Constructing PVH  record, putting in PVH, service initializing...`);
        let latestPDHRecord = {
            "TableName": PATCH_DATA_HISTORY_TABLE,
            "Item": {
                "uuid":                uuid.v1(),
                "createdAt":           isoTimeStamp,
                "cdragonPatchDataURL": cdragonPatchDataURL,
                "patchVersion":        currentPVHVersionNumber,
                "setVersioNumber":     latestSetVersioNumber,
                "s3ObjectKey":         s3ObjectKey,
                "lastCheck":           ""
            }
        };
        let putDBResponse = await dynamoDb.put(latestPDHRecord);
        if (! putDBResponse) {
            throw Error('###Tactics Log###: Putting in DB failed, service terminating...');
        }
        console.log("###Tactics Log###: Putting into DynamoDB success.");
        let successMessage = JSON.stringify(`Params: ${JSON.stringify(latestPDHRecord)} put into PDH success.`);
        response.latestPatchVersion = currentPVHVersionNumber;
        response.message = successMessage;
    };
    if (latestSetVersioNumber == currentPDHRecordSetVersioNumber){
        response.newSetVersionNumber = false;
    }
    else{
        response.newSetVersionNumber = true;
    };
    return response;
});

