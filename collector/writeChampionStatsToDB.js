import handler from "../libs/handler-lib";
// import fetch from "node-fetch";
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
    const PATCH_DATA_HISTORY_TABLE = "patch-data-history";
    const TACTICS_BUCKET = 'tactics-uploads';
    var params = {
        TableName: PATCH_DATA_HISTORY_TABLE,
        Select: "ALL_ATTRIBUTES"
    };


    console.log("###Tactics Log###: Searching for latest patch version: Scanning table 'patch-data-history'...");
    let scanDBResponse = await dynamoDb.scan(params);
    // error
    let latestPatchDataRecord  = scanDBResponse.Items.pop();

    // console.log(`###Tactics Log###: Scanning DB completed, latest version from DataBase is ${latestVersionNumber}`);
    // let latestPatchDataRecordCdragonURL = latestPatchDataRecord.cdragonPatchDataURL;
    // let latestPatchDataVersionNumber = latestPatchDataRecord.patchVersion;
    // let latestPatchDataSetVersioNumber = latestPatchDataRecord.setVersioNumber;
    let latestPatchDataS3ObjectKey = latestPatchDataRecord.s3ObjectKey;

    var params2 = {
        Bucket: TACTICS_BUCKET,
        Key: latestPatchDataS3ObjectKey,
        // Etag: '251a76342e3e6c39274582bbc257b582'
    };
    let file = await s3Bucket.getObject(params2);
    console.log(`###Tactics Log###: !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!`);
    // returns {
    //   AcceptRanges: 'bytes',
    //   LastModified: 'Wed, 06 Apr 2016 20:04:02 GMT',
    //   ContentLength: '1602862',
    //   ETag: '9826l1e5725fbd52l88ge3f5v0c123a4"',
    //   ContentType: 'application/octet-stream',
    //   Metadata: {},
    //   Body: <Buffer 01 00 00 00  ... > }


    let objectData = file.Body.toString('utf-8');
    let jsonObj = JSON.parse(objectData);

    //jmespath search for item and champion
    // put into db
    // console.log(jsonObj);
    // var champions = jmespath.search(jsonObj, `sets."`+ latestPatchDataSetVersioNumber +`".champions[]`);
    var items = jmespath.search(jsonObj, `items`);

    // function myFunction1(item) {
    //     var params = {
    //         "TableName": "Demo",
    //         "Item": {
    //             "DemoId": uuid.v1(),
    //             "Name": item.name,
    //             "Icon": item.icon,
    //             "Cost": item.cost,
    //             "Ability": item.ability,
    //             "Stats": item.stats,
    //             "Class": item.traits[0],
    //             "Origin": item.traits[1],
    //         }
    //     };
    //
    //     var i;
    //     for (i=0; i < newChampions.length; i++) {
    //     };
    // };
    //
    async function myFunction2(items) {
        var i;
        for (i=0; i < items.length; i++) {
            var item = items[i];
            var params3 = {
                "TableName": "tactics-item-pool",
                "Item": {
                    "uuid": uuid.v1(),
                    "effects": item.effects,
                    "from": item.from,
                    "icon": item.icon,
                    "id": item.id,
                    "name": item.name,
                    "desc": item.desc,
                }
            };
            let putDBResponse = await dynamoDb.put(params3);
            console.log(putDBResponse);
        };
        return 'done';
    };
    let ressss = await myFunction2(items);
    console.log(`###Tactics Log###: !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!`);
    console.log(ressss);
    console.log(`###Tactics Log###: !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!`);

    // let item = items[1];
    // var params3 = {
    //     "TableName": "tactics-item-pool",
    //     "Item": {
    //         "uuid": uuid.v1(),
    //         "effects": item.effects,
    //         "from": item.from,
    //         "icon": item.icon,
    //         "id": item.id,
    //         "name": item.name,
    //     }
    // };
    // let putDBResponse = await dynamoDb.put(params3);
    // console.log(putDBResponse);
    // // items.forEach(myFunction2);
    // // console.log(champions);
    // // console.log(items);
    // console.log(item);
    //
    // var params4 = {
    //     TableName: 'tactics-item-pool',
    //     Select: "ALL_ATTRIBUTES"
    // };
    // let scanDBResponse2 = await dynamoDb.scan(params4);
    // // error
    // // let latestPatchDataRecord2  = scanDBResponse2.Items;
    // console.log(`###Tactics Log###: !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!`);
    // console.log(JSON.stringify(scanDBResponse2));
    // console.log(`###Tactics Log###: !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!`);

    //
    //
    // // console.log(result);
    // // var names = jmespath.search(result, `sets."`+ latestSetNumberw +`".champions[]`);
    // // var names = jmespath.search(result, `sets."3".champions[]`);
    // var sets = jmespath.search(result, `sets`);
    // var setNumbers = [];
    // for(var k in sets) setNumbers.push(k);
    // var latestSetNumber = setNumbers.pop(); //4
    // console.log(`###Tactics Log###: Fetch patch data success, current patch version: set ` + latestSetNumber);
    //
    // /////////////////// putting into s3 bucket
    // console.log(`###Tactics Log###: Putting latest patch file into S3 Bucket, service initializing...`);
    // let s3ObjectKey =  latestVersionNumber + '_en_us.json';
    // var params = {
    //     Bucket: "tactics-uploads",
    //     Key: s3ObjectKey,
    //     Body: JSON.stringify(result)
    // };
    // const s3Response = await s3Bucket.putObject(params);
    // // s3Bucket
    // // const s3Response = await s3.putObject(params).promise();
    // console.log("returning s3 response");
    // console.log(s3Response);
    // console.log("returning s3 response");
    // console.log(`###Tactics Log###: Put into s3 bucket success. Object etag: `+ JSON.stringify(s3Response));
    //
    // console.log(`###Tactics Log###: Constructing patch-version-history node, putting in db, service initializing...`);
    // var today = new Date();
    // var dd = String(today.getDate()).padStart(2, '0');
    // var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    // var yyyy = today.getFullYear();
    // today = yyyy + '-' + mm + '-' + dd;
    // let patchVersionNode = {
    //     "TableName": PATCH_DATA_HISTORY_TABLE,
    //     "Item": {
    //         "uuid": uuid.v1(),
    //         "date": today,
    //         "cdragonPatchDataURL": cdragonPatchDataURL,
    //         "patchVersion": latestVersionNumber,
    //         "setVersioNumber": latestSetNumber,
    //         "s3ObjectKey": s3ObjectKey
    //     }
    // };
    // let putDBResponse = await dynamoDb.put(patchVersionNode);
    // if (! putDBResponse) {
    //     throw Error('###Tactics Log###: Putting in DB failed, service terminating...');
    // }
    // console.log("###Tactics Log###: Putting into DynamoDB success.");
    // let successMessage = JSON.stringify(`Params: ${JSON.stringify(patchVersionNode)} put into table: ${PATCH_DATA_HISTORY_TABLE} success.`);
    // let response = {
    //     "latestPatchVersion": latestVersionNumber,
    //     "message": successMessage
    // };
    // return response;
});

