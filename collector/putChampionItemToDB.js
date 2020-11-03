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
    let latestPatchDataSetVersioNumber = latestPatchDataRecord.setVersioNumber;
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
    var champions = jmespath.search(jsonObj, `sets."`+ latestPatchDataSetVersioNumber +`".champions[]`);
    var items = jmespath.search(jsonObj, `items`);

    async function myFunction1(champions) {
        var i;
        for (i=0; i < champions.length; i++) {
            var champion = champions[i];
            var params = {
                "TableName": "tactics-champion-pool",
                "Item": {
                    "uuid": uuid.v1(),
                    "Name": champion.name,
                    "Icon": champion.icon,
                    "Cost": champion.cost,
                    "Ability": champion.ability,
                    "Stats": champion.stats,
                    "Class": champion.traits[0],
                    "Origin": champion.traits[1],
                }
            };
            await dynamoDb.put(params);
            // console.log(putDBResponse);
        };
        return 'done';
    };

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
            await dynamoDb.put(params3);
            // console.log(putDBResponse);
        };
        return 'done';
    };
    let championssss = await myFunction1(champions);
    let ressss = await myFunction2(items);
    console.log(`###Tactics Log###: !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!`);
    console.log(ressss, championssss);
    console.log(`###Tactics Log###: !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!`);
    return (ressss, championssss);
});
