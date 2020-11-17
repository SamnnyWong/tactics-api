import handler from "../libs/handler-lib";
import dynamoDb from "../libs/dynamodb-lib";
var AWS = require('aws-sdk');
var s3 = new AWS.S3();
// import constants from "../assets/constants";

// service api: https://f8brp6pbai.execute-api.ap-northeast-1.amazonaws.com/dev/latest-patch-version
export const main = handler(async (event, context, callback) => {
    const PATCH_VERSION_HISTORY_TABLE  = "patch-version-history";
    const PATCH_UPDATE_HISTORY_TABLE   = "patch-update-history";
    const PATCH_DATA_HISTORY_TABLE     = "patch-data-history";
    const TACTICS_SERVICE_STATUS_TABLE = "tactics-service-status";
    var bucketName = "tactics-composition";//change to corresponding bucket name

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

    var COMPParams = {
        Bucket: bucketName,
    };

    console.log("###Tactics Log###: Scanning PVH PDH and PUH...");
    let scanPVHResponse = await dynamoDb.scan(PVHParams);
    let scanPDHResponse = await dynamoDb.scan(PDHParams);
    let scanPUHResponse = await dynamoDb.scan(PUHParams);
    // scan the s3
    let scanS3Response = await s3.listObjectsV2(COMPParams).promise();

    if (!scanPVHResponse || !scanPDHResponse || !scanPUHResponse) {
        throw Error('###Tactics Log###: Can not get PVH/PDH/PUH record: Service Terminating...');
    }

    console.log("###Tactics Log###: Scanning PVH PDH and PUH success.");
    scanPVHResponse.Items.sort(function(a, b) {
        return (a.createdAt < b.createdAt) ? -1 : ((a.createdAt > b.createdAt) ? 1 : 0);
    });

    scanPDHResponse.Items.sort(function(a, b) {
        return (a.createdAt < b.createdAt) ? -1 : ((a.createdAt > b.createdAt) ? 1 : 0);
    });

    scanPUHResponse.Items.sort(function(a, b) {
        return (a.createdAt < b.createdAt) ? -1 : ((a.createdAt > b.createdAt) ? 1 : 0);
    });

    var COMPtimeSorted = scanS3Response.Contents.sort((a, b) => (a.LastModified < b.LastModified) ? 1 : -1);

    let currentPVHRecord  = scanPVHResponse.Items.pop();
    let currentPDHRecord  = scanPDHResponse.Items.pop();
    let currentPUHRecord  = scanPUHResponse.Items.pop();
    let currentCOMPRecord = COMPtimeSorted[0].Key.split("/")[0].replace("_", ".");
    console.log(currentCOMPRecord);
    // scanTSSResponse
    var updateCurrentCOMPRecord = {
        TableName: TACTICS_SERVICE_STATUS_TABLE,
        Key:{
            "serviceId": "COMP",
        },
        UpdateExpression: "set lastCheck = :x, patchVersion = :y, serviceStatus = :z",
        ExpressionAttributeValues:{
            ":x": isoTimeStamp,
            ":y": currentCOMPRecord,
            ":z": "service is operating normally",
        },
    };

    var updateCurrentPVHRecord = {
        TableName: TACTICS_SERVICE_STATUS_TABLE,
        Key:{
            "serviceId": "PVH",
        },
        UpdateExpression: "set lastCheck = :x, patchVersion = :y, serviceStatus = :z",
        ExpressionAttributeValues:{
            ":x": isoTimeStamp,
            ":y": currentPVHRecord.patchVersion,
            ":z": "service is operating normally",
        },
    };

    var updateCurrentPDHRecord = {
        TableName: TACTICS_SERVICE_STATUS_TABLE,
        Key:{
            "serviceId": "PDH",
        },
        UpdateExpression: "set lastCheck = :x, patchVersion = :y, serviceStatus = :z",
        ExpressionAttributeValues:{
            ":x": isoTimeStamp,
            ":y": currentPDHRecord.patchVersion,
            ":z": "service is operating normally",
        },
    };

    var updateCurrentPUHRecord = {
        TableName: TACTICS_SERVICE_STATUS_TABLE,
        Key:{
            "serviceId": "PUH",
        },
        UpdateExpression: "set lastCheck = :x, patchVersion = :y, serviceStatus = :z",
        ExpressionAttributeValues:{
            ":x": isoTimeStamp,
            ":y": currentPUHRecord.patchVersion,
            ":z": currentPUHRecord.serviceStatus,
        },
    };

    let updatePVHResponse = await dynamoDb.update(updateCurrentPVHRecord);
    let updatePDHResponse = await dynamoDb.update(updateCurrentPDHRecord);
    let updatePUHResponse = await dynamoDb.update(updateCurrentPUHRecord);
    let updateCOMPResponse = await dynamoDb.update(updateCurrentCOMPRecord);

    console.log(updatePVHResponse, updatePDHResponse, updatePUHResponse, updateCOMPResponse);
    let message = JSON.stringify(`Tactics service updated successfully.`);
    response.message = message;

    return response;
});
