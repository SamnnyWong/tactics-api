import handler from "../libs/handler-lib";
import dynamoDb from "../libs/dynamodb-lib";
import s3Bucket from "../libs/s3bucket-libs";
import fetch from "node-fetch";
// import constants from "../assets/constants";

// service api: https://f8brp6pbai.execute-api.ap-northeast-1.amazonaws.com/dev/latest-patch-version
export const main = handler(async (event, context, callback) => {
    let response = {};

    const bucketName = "tactics-dist";
    // scan ipool tpool cpool write to dist
    // copy comp to dist

    // get tss: https://f8brp6pbai.execute-api.ap-northeast-1.amazonaws.com/dev/tactics-service-status
    // if true,

    // var dateObject = new Date();
    // let isoTimeStamp = dateObject.toISOString();

    let TSS_STATUS_URL = "https://f8brp6pbai.execute-api.ap-northeast-1.amazonaws.com/dev/tactics-service-status";
    let TSSResponse = await fetch(TSS_STATUS_URL);
    let result = await TSSResponse.json();
    console.log(result);
    console.log(result.serviceIsReady);
    if (!result.serviceIsReady) {
        // service terminating
        response.message = `Tactics services is not ready, service terminating...`;
    }
    else {
        const TACTICS_ITEM_POOL = "tactics-item-pool";
        var TIPParams1 = {
            TableName: TACTICS_ITEM_POOL,// give it your table name
            Select: "ALL_ATTRIBUTES"
        };
        let scanTIPResponse = await dynamoDb.scan(TIPParams1);
        // console.log(scanTIPResponse.Items);
        // console.log(scanTIPResponse);
        // console.log(scanTIPResponse);
        //
        var TIPParams2 = { Bucket: bucketName, Key: "tactics_dist_items.json", Body: JSON.stringify(scanTIPResponse.Items) };
        const putTIPS3Response = await s3Bucket.putObject(TIPParams2);
        if (! putTIPS3Response) {
            throw Error(`###Tactics Log###: Putting in bucket ${bucketName} failed, service terminating...`);
        }
        console.log(`###Tactics Log###: Put into bucket: ${bucketName} success. Object etag: `+ putTIPS3Response);

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        const TACTICS_CHAMPION_POOL = "tactics-champion-pool";
        var TCPParams1 = {
            TableName: TACTICS_CHAMPION_POOL,// give it your table name
            Select: "ALL_ATTRIBUTES"
        };
        let scanTCPResponse = await dynamoDb.scan(TCPParams1);
        var TCPParams2 = { Bucket: bucketName, Key: "tactics_dist_champions.json", Body: JSON.stringify(scanTCPResponse.Items) };
        const putTCPS3Response = await s3Bucket.putObject(TCPParams2);
        if (! putTCPS3Response) {
            throw Error(`###Tactics Log###: Putting in bucket ${bucketName} failed, service terminating...`);
        }
        console.log(`###Tactics Log###: Put into bucket: ${bucketName} success. Object etag: `+ putTCPS3Response);
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        const TACTICS_TRAITS_POOL = "tactics-traits-pool";
        var TTPParams1 = {
            TableName: TACTICS_TRAITS_POOL,// give it your table name
            Select: "ALL_ATTRIBUTES"
        };
        let scanTTPResponse = await dynamoDb.scan(TTPParams1);
        var TTPParams2 = { Bucket: bucketName, Key: "tactics_dist_traits.json", Body: JSON.stringify(scanTTPResponse.Items) };
        const putTTPS3Response = await s3Bucket.putObject(TTPParams2);
        if (! putTTPS3Response) {
            throw Error(`###Tactics Log###: Putting in bucket ${bucketName} failed, service terminating...`);
        }

        var paramlist = {
            Bucket: "tactics-composition",
            // Prefix:"10_22"// can change 10.22 to current patch version
        };
        // find the last version number of the current patch
        try{
            var AWS = require('aws-sdk');
            var s3 = new AWS.S3();
            const s3response = await s3.listObjectsV2(paramlist).promise();
            //sort files by last modified date
            var timesort = s3response.Contents.sort((a, b) => (a.LastModified < b.LastModified) ? 1 : -1);
            // console.log(timesort[0]); //return the file with last modified date

        } catch(e){
            console.error(e);
        };
        //copy the last Comp version from bucket to bucket
        var sourceKey = timesort[0].Key;
        var params = {
            Bucket: "tactics-dist",
            CopySource: "/tactics-composition/" + sourceKey,
            Key: "tactics_dist_composition.json"
        };
        s3.copyObject(params, function(err, data) {
            if (err) console.log(err, err.stack); // an error occurred
            else     console.log(data);           // successful response
        });

        console.log(`###Tactics Log###: Put into bucket: ${bucketName} success. Object etag: `+ putTTPS3Response);
        console.log(putTIPS3Response);
        console.log(putTCPS3Response);
        console.log(putTTPS3Response);
        response.message = JSON.stringify(putTIPS3Response) + JSON.stringify(putTCPS3Response) + JSON.stringify(putTTPS3Response);
    };
    return response;
});
