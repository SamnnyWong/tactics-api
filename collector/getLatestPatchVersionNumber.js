import handler from "../libs/handler-lib";
import constants from "../assets/constants";
import fetch from "node-fetch";
var jmespath = require('jmespath');
import dynamoDb from "../libs/dynamodb-lib";
import * as uuid from "uuid";

// service api: https://f8brp6pbai.execute-api.ap-northeast-1.amazonaws.com/dev/latest-patch-version
export const main = handler(async (event, context, callback) => {
    const PATCH_VERSION_HISTORY_TABLE = "patch-version-history";
    var dateObject = new Date();
    let isoTimeStamp = dateObject.toISOString();

    let response = {
        "latestPatchVersion": '',
        "message": ''
    };

    // latestVersionNumber ///////////////////////////////////////////////////////////////////////////////////////////////////////
    // latestVersionNumber ///////////////////////////////////////////////////////////////////////////////////////////////////////
    // step one getting gh vn, possible error: gh connection timeout, gh commit format message change, gh repo dead,
    console.log("###Tactics Log###: Fetching commit message...");
    let githubCommitMessages = await fetch(constants.GITHUB_NA_VERSION_NUMBER_URL);
    let result = await githubCommitMessages.json();
    // console.log(result);

    if (!githubCommitMessages || !result) {
        throw Error('###Tactics Log###: Fetching commit message failed: Service Terminating...');
    }
    let commitMessage = jmespath.search(result, constants.EXPRESSION_FILTER_VERSION_NUMBER);
    let latestVersionNumber = commitMessage.replace(/[^0-9\.]/g, "");
    if (!commitMessage || !latestVersionNumber) {
        throw Error('###Tactics Log###: Can not get version number from commit message: Service Terminating...');
    }
    console.log(`###Tactics Log###: Fetch commit message success, Latest version number is ${latestVersionNumber}.`);
    // latestVersionNumber ///////////////////////////////////////////////////////////////////////////////////////////////////////
    // latestVersionNumber ///////////////////////////////////////////////////////////////////////////////////////////////////////
    // step two: getting pvh vn, possible error: dynamo db connection timeout

    var PVHParams = {
        TableName: PATCH_VERSION_HISTORY_TABLE,// give it your table name
        Select: "ALL_ATTRIBUTES"
    };
    console.log("###Tactics Log###: Searching for current patch version number: Scanning table 'patch-version-history'...");
    let scanDBResponse = await dynamoDb.scan(PVHParams);
    if (!scanDBResponse) {
        throw Error('###Tactics Log###: Can not get PVH record: Service Terminating...');
    }
    scanDBResponse.Items.sort(function(a, b) {
        return (a.createdAt < b.createdAt) ? -1 : ((a.createdAt > b.createdAt) ? 1 : 0);
    });

    console.log(scanDBResponse);
    let currentPVHRecord  = scanDBResponse.Items.pop();
    let currentPVHVersionNUmber = currentPVHRecord.patchVersion;
    if (currentPVHVersionNUmber == latestVersionNumber) {
        console.log(`###Tactics Log###: Current PVH record is ${currentPVHVersionNUmber}, latest GH is ${latestVersionNumber}, skipping update...`);
        // if its the same, update a last check time stamp.
        var updateCurrentPVHRecord = {
            TableName: PATCH_VERSION_HISTORY_TABLE,
            Key:{
                "uuid": currentPVHRecord.uuid,
                "createdAt": currentPVHRecord.createdAt,
            },
            UpdateExpression: "set lastCheck = :x",
            ExpressionAttributeValues:{
                ":x": isoTimeStamp,
            },
        };

        console.log("###Tactics Log###: Updating the current PVH record...");
        // dynamoDb.update(updatedCurrentPVHRecord, function(err, data) {
        //     if (err) {
        //         console.error("###Tactics Log###: Unable to update item. Error JSON:", JSON.stringify(err, null, 2));
        //     } else {
        //         console.log("###Tactics Log###: UpdateItem succeeded:", JSON.stringify(data, null, 2));
        //     }
        // });
        let updateDBResponse = await dynamoDb.update(updateCurrentPVHRecord);
        console.log(updateDBResponse); //2020-10-30T21:10:42.987Z	713f8110-5d56-4782-9921-786ce3ff6a9a	INFO	{} ?????????????
        response.latestPatchVersion = latestVersionNumber;
        response.message = `PVH is up-to-date, PVH record: ${currentPVHRecord.uuid} lastCheck time: ${isoTimeStamp}`;
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
        response.latestPatchVersion = latestVersionNumber;
        response.message = `Params: ${JSON.stringify(latestPVHRecord)} put into table: ${PATCH_VERSION_HISTORY_TABLE} success.`;
    }
    return response;
});
