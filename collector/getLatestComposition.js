import * as webdata from "./web-crawler/compositionCrawlerLolchess";
import handler from "../libs/handler-lib";
import s3Bucket from "../libs/s3bucket-libs";

export const main = handler(async (event, context, callback) => {
    let response = {
    };
    let s3data = await webdata.webscraper();
    let currentVersionNumber = s3data["patchVersion"].replace(".","_");
    var bucketName = "tactics-composition";//change to corresponding bucket name
    var paramlist = {
        Bucket: bucketName,
        Prefix: currentVersionNumber
    };
    // find the last version number of the current patch
    try{
        const aws = require('aws-sdk');
        const s3 = new aws.S3();
        const listS3response = await s3.listObjectsV2(paramlist).promise();
        //sort files by last modified date
        var timesort = listS3response.Contents.sort((a, b) => (a.LastModified < b.LastModified) ? 1 : -1);

        //return the file with last modified date
        // console.log(timesort[0].Key.split("/")[0].replace("_", "."));

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

    //========================================================================================
    // function getKeyName(folder, filename) {
    //     return folder + '/' + filename;
    // }
    // var keyName = getKeyName(currentVersionNumber, fileName);// can change 10.22 to current patch version

    var keyName = currentVersionNumber + '/' + fileName;
    //========================================================================================
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

    if (Math.abs(lastSize - content.length) <= 5) {
        console.log("");
        console.log(`###Tactics Log###: composition patchVersion is up to date`);
        response.message = "composition patch version is up to date";
        response.COMPPatchVersion = currentVersionNumber;
    }
    else {
        var params = { Bucket: bucketName, Key: keyName, Body: content };
        const putS3Response = await s3Bucket.putObject(params);
        if (! putS3Response) throw Error(`###Tactics Log###: Putting in bucket ${bucketName} failed, service terminating...`);
        console.log(`###Tactics Log###: Put into bucket: ${bucketName} success. Object etag: `+ putS3Response);
        response.message = putS3Response;
        response.COMPPatchVersion = currentVersionNumber;
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
    };
    return response;
});
