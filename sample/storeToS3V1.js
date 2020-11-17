import fetch from "node-fetch";
import dynamoDb from "../libs/dynamodb-lib";

var AWS = require('aws-sdk');
var s3 = new AWS.S3();

//2 inputs: BucketName and Content
// bucketname: tactics-dist
export const  main = handler(async (event, context) => {
    // scan item pool table
    // scan champions pool table
    // scan traits and class pool table
    // scan galaxy table (if possible)
    // this is a scheduled service
    // first fetch service status
    // if ready: scan all tables then write to s3 bucket tactics-dist
    // if not ready, haults.
    // https://f8brp6pbai.execute-api.ap-northeast-1.amazonaws.com/dev/tactics-service-status
    let TSS_STATUS_URL = "https://f8brp6pbai.execute-api.ap-northeast-1.amazonaws.com/dev/tactics-service-status";
    let TSSResponse = await fetch(TSS_STATUS_URL);
    let result = await TSSResponse.json();
    console.log(result);
    console.log(result.serviceIsReady);
    const TACTICS_ITEM_POOL_TABLE = "tactics-item-pool";
    const TACTICS_CHAMPION_POOL_TABLE = "tactics-champion-pool";
    const TACTICS_TRAITS_POOL = "tactics-traits-pool";

    if (!result || !result.serviceIsReady) {
        //fking shut it down
    }
    else {
        var IPTParams = {
            TableName: TACTICS_ITEM_POOL_TABLE,// give it your table name
            Select: "ALL_ATTRIBUTES"
        };

        var TCPParams = {
            TableName: TACTICS_CHAMPION_POOL_TABLE,// give it your table name
            Select: "ALL_ATTRIBUTES"
        };

        var TTPParams = {
            TableName: TACTICS_TRAITS_POOL,// give it your table name
            Select: "ALL_ATTRIBUTES"
        };

        console.log("###Tactics Log###: Scanning PVH PDH and PUH...");
        let scanIPTResponse = await dynamoDb.scan(IPTParams);
        let scanTCPResponse = await dynamoDb.scan(TCPParams);
        let scanTTPResponse = await dynamoDb.scan(TTPParams);

        if (!scanIPTResponse || !scanTCPResponse || !scanTTPResponse) {
            throw Error('###Tactics Log###: Can not get IPT/TCP/TTP record: Service Terminating...');
        }
    }
    var bucketName = event.BucketName //create the bucket first
    var fileName = 's3stored.json';
    let s3data = await event.Content;
    var content = JSON.stringify(Object.assign({}, s3data));

    var params = { Bucket: bucketName, Key: fileName, Body: content };
    try{
        const s3response = await s3.putObject(params).promise();
        console.log(s3response);

    }
    catch (error) {
        console.log(error);
    }

    return content;

});
