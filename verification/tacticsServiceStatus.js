import handler from "../libs/handler-lib";
import constants from "../assets/constants";
import fetch from "node-fetch";
var jmespath = require('jmespath');
import dynamoDb from "../libs/dynamodb-lib";
import * as uuid from "uuid";

// service api: https://f8brp6pbai.execute-api.ap-northeast-1.amazonaws.com/dev/latest-patch-version
export const main = handler(async (event, context, callback) => {
    const PATCH_VERSION_HISTORY_TABLE = "patch-version-history";
    const PATCH_UPDATE_HISTORY_TABLE  = "patch-update-history";
    const PATCH_DATA_HISTORY_TABLE    = "patch-data-history";
    var dateObject = new Date();
    let isoTimeStamp = dateObject.toISOString();

    let response = {
        "latestPatchVersion": '',
        "message": ''
    };


    var PVHParams = {
        TableName: PATCH_VERSION_HISTORY_TABLE,// give it your table name
        Select: "ALL_ATTRIBUTES"
    };

    var PDHParams = {
        TableName: PATCH_DATA_HISTORY_TABLE,// give it your table name
        Select: "ALL_ATTRIBUTES"
    };
    var PUHParams = {
        TableName: PATCH_UPDATE_HISTORY_TABLE,// give it your table name
        Select: "ALL_ATTRIBUTES"
    };

    console.log("###Tactics Log###: Searching for latest patch version: Scanning PVH and PDH...");
    let scanPVHResponse = await dynamoDb.scan(PVHParams);
    let scanPDHResponse = await dynamoDb.scan(PDHParams);
    let scanPUHResponse = await dynamoDb.scan(PUHParams);

    if (!scanPVHResponse || !scanPDHResponse || !scanPUHResponse) {
        throw Error('###Tactics Log###: Can not get PVH/PDH/PUH record: Service Terminating...');
    }
    scanPVHResponse.Items.sort(function(a, b) {
        return (a.createdAt < b.createdAt) ? -1 : ((a.createdAt > b.createdAt) ? 1 : 0);
    });

    scanPDHResponse.Items.sort(function(a, b) {
        return (a.createdAt < b.createdAt) ? -1 : ((a.createdAt > b.createdAt) ? 1 : 0);
    });

    scanPUHResponse.Items.sort(function(a, b) {
        return (a.createdAt < b.createdAt) ? -1 : ((a.createdAt > b.createdAt) ? 1 : 0);
    });
    let currentPVHRecord  = scanPVHResponse.Items.pop();
    let currentPDHRecord  = scanPDHResponse.Items.pop();
    let currentPUHRecord  = scanPUHResponse.Items.pop();

    let currentPVHVersionNumber = currentPVHRecord.patchVersion;
    let currentPUHVersionNumber = currentPUHRecord.patchVersion;
    let currentPDHVersionNumber = currentPDHRecord.patchVersion;

    let currentPVHStatus = currentPVHRecord.patchVersion;
    let currentPUHStatus = currentPUHRecord.patchVersion;
    let currentPDHVStatus = currentPDHRecord.patchVersion;



    if (currentPVHVersionNUmber == latestVersionNumber) {
        console.log(`###Tactics Log###: Current PDH record is ${currentPVHVersionNUmber}, latest GH is ${latestVersionNumber}, skipping update...`);
        // if its the same, update a last check time stamp.
        var updatedCurrectPVHRecord = {
            TableName: PATCH_VERSION_HISTORY_TABLE,
            Key:{
                "uuid": currentPVHRecord.uuid,
                "createdAt": currentPVHRecord.createdAt,
            },
            UpdateExpression: "set lastCheck = :x",
            ExpressionAttributeValues:{
                ":x": isoTimeStamp,
            },
            ReturnValues: updatedCurrectPVHRecord //what does thi do?
        };

        console.log("###Tactics Log###: Updating the current PVH record...");
        // dynamoDb.update(updatedCurrectPVHRecord, function(err, data) {
        //     if (err) {
        //         console.error("###Tactics Log###: Unable to update item. Error JSON:", JSON.stringify(err, null, 2));
        //     } else {
        //         console.log("###Tactics Log###: UpdateItem succeeded:", JSON.stringify(data, null, 2));
        //     }
        // });
        let updateDBResponse = await dynamoDb.update(updatedCurrectPVHRecord);
        console.log(updateDBResponse); //2020-10-30T21:10:42.987Z	713f8110-5d56-4782-9921-786ce3ff6a9a	INFO	{} ?????????????
        let message = JSON.stringify(`PVH is up-to-date, PVH record: ${currentPVHRecord.uuid} lastCheck time: ${isoTimeStamp}`);
        response.latestPatchVersion = latestVersionNumber;
        response.message = message;
    }
    else {
        console.log("###Tactics Log###: Puting into DynamoDB: Initializing Parameter...");
        let latestPVHRecord = {
            "TableName": PATCH_VERSION_HISTORY_TABLE,
            "Item": {
                "uuid": uuid.v1(),
                "createdAt": isoTimeStamp,
                "lastCheck": "",
                "patchVersion": latestVersionNumber,
            }
        };
        console.log("###Tactics Log###: Puting into DynamoDB: Service Pending...");
        let putDBResponse = await dynamoDb.put(latestPVHRecord);
        // throwing this error might not have effect on the overall service functionality.
        // need to throw/handle dynamoDb.put original error properly
        // need to clarify how to return success message when put in db on success
        if (! putDBResponse) {
            throw Error('###Tactics Log###: Putting in DB failed, service terminating...');
        }
        console.log("###Tactics Log###: Putting into DynamoDB success.");
        let successMessage = JSON.stringify(`Params: ${JSON.stringify(latestPVHRecord)} put into table: ${PATCH_VERSION_HISTORY_TABLE} success.`);

        response.latestPatchVersion = latestVersionNumber;
        response.message = successMessage;
    }
    return response;
});
