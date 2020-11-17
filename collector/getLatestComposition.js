import * as webdata from "./web-crawler/compositionCrawlerLolchess";
// import handler from "./libs/handler-lib";
var AWS = require('aws-sdk');
var s3 = new AWS.S3();
// const DDB = new AWS.DynamoDB.DocumentClient(); //for DynamoDB use
// import dynamoDb from "../libs/dynamodb-lib";
// import { stringify } from "uuid";
export const main = async (event, context) => {
    // get the last version number
    // const PATCH_VERSION_HISTORY_TABLE = "patch-version-history";

    // var PVHParams = {
    //     TableName: PATCH_VERSION_HISTORY_TABLE,// give it your table name
    //     Select: "ALL_ATTRIBUTES"
    // };


    // console.log("###Tactics Log###: Searching for latest patch version: Scanning PVH ");
    // let scanPVHResponse = await dynamoDb.scan(PVHParams);

    // if (!scanPVHResponse) {
    //     throw Error('###Tactics Log###: Can not get PVH/PDH record: Service Terminating...');
    // }
    // scanPVHResponse.Items.sort(function(a, b) {
    //     return (a.createdAt < b.createdAt) ? -1 : ((a.createdAt > b.createdAt) ? 1 : 0);
    // });
    let s3data = await webdata.webscraper();
    // console.log(s3data["patchVersion"].replace(".","_"));
    // let currentPVHRecord  = scanPVHResponse.Items.pop();
    // let currentPVHVersionNumber = currentPVHRecord.patchVersion.replace(".","_");
    let currentVersionNumber = s3data["patchVersion"].replace(".","_");
    // console.log(currentVersionNumber);

    var bucketName = "tactics-composition";//change to corresponding bucket name
    var paramlist = {
        Bucket: bucketName,
        // Prefix:"10_22"// can change 10.22 to current patch version
        Prefix: currentVersionNumber
    };
    // find the last version number of the current patch
    try{
        const response = await s3.listObjectsV2(paramlist).promise();
        //sort files by last modified date
        var timesort = response.Contents.sort((a, b) => (a.LastModified < b.LastModified) ? 1 : -1);
        // console.log(timesort[0].Key.split("/")[0].replace("_", ".")); //return the file with last modified date

    } catch(e){
        console.error(e);
    };
    //initial condition
    var lastKey = "v0";
    var lastSize = 0;
    if (timesort[0] !== undefined) {
        lastKey = timesort[0].Key;
        lastSize = timesort[0].Size;
    };
    var lastVersion = Number(lastKey.split("v")[1].replace(".json",""));
    var currentVersion = lastVersion + 1;
    // if (lastVersion == undefined) currentVersion = 0;
    var fileName = currentVersionNumber + '_v' + currentVersion.toString() + '.json';// can change 10.22 to current patch version
    var keyName = getKeyName(currentVersionNumber, fileName);// can change 10.22 to current patch version
    // var content = JSON.stringify(Object.assign({}, s3data));
    s3data["fileName"] = fileName;
    var content = JSON.stringify(Object.assign({}, s3data));
    // var lastFileKey =  (lastKey);
    // if (timesort[0].Key == undefined) lastFileKey =  "10-22/v0.json";
    // console.log('#####################');
    // console.log(lastFileKey, lastSize, content.length);
    // console.log('#####################');
    // var paramLast = { Bucket: bucketName, Key: lastFileKey};

    // s3.getObject(paramLast, async function (err, data) {
    //     if (err)
    //         console.log(err, err.stack); // an error occurred
    //     else {
    //         console.log(data.ContentLength);
    //         console.log("##################");

    if (Math.abs(lastSize - content.length) <= 5) console.log("comp is up to date");
    else {
        var params = { Bucket: bucketName, Key: keyName, Body: content };

        try{
            const s3response = await s3.putObject(params).promise();
            console.log(s3response);

        }
        catch (error) {
            console.log(error);
        }
        // this part is to store Data in DynamoDB

        // const tableName = process.env.tableName;
        // const DBdata = JSON.parse(content);
        // console.log(Object.keys(DBdata).length);
        // for (var x = 0; x < Object.keys(DBdata["composition"]).length; x++) {
        //     var paramsDB = {
        //         TableName: tableName,
        //         Item: DBdata["composition"][x]
        //     };
        //     console.log(paramsDB);
        //     let putDBResponse = await documentClient.put(paramsDB).promise();
        //     // throwing this error might not have effect on the overall service functionality.
        //     // need to throw/handle dynamoDb.put original error properly
        //     // need to clarify how to return success message when put in db on success
        //     if (! putDBResponse) {
        //         throw Error('###Tactics Log###: Putting in DB failed, service terminating...');
        //     }
        // }
        return {
            headers:{
                "x-custom-header" : "my custom header value"
            },
            statusCode: 200,
            body: content
        };
    };
        // };
    // });

};
function getKeyName(folder, filename) {
    return folder + '/' + filename;
}
