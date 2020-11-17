import handler from "../libs/handler-lib";
// import fetch from "node-fetch";
import dynamoDb from "../libs/dynamodb-lib";
import s3Bucket from "../libs/s3bucket-libs";
import * as uuid from "uuid";
var jmespath = require('jmespath');

// import * as uuid from "uuid";

// import constants from "../assets/constants";

// get latest version number from db
// construct the url then get the patch json file from cdragon
// then store it into dynamo db

// service api-gateway:
// table name:
// table arn

export const main = handler(async (event, context) => {
    const PATCH_DATA_HISTORY_TABLE = "patch-data-history";
    // const TACTICS_TRAITS_POOL = "tactics-traits-pool";
    const TACTICS_UPLOAD_BUCKET = 'tactics-uploads';
    var scanPDHParams = {
        TableName: PATCH_DATA_HISTORY_TABLE,
        Select: "ALL_ATTRIBUTES"
    };

    console.log("###Tactics Log###: Searching for latest patch version: Scanning table 'patch-data-history'...");
    let scanPDHResponse = await dynamoDb.scan(scanPDHParams);
    // error
    let latestPatchDataRecord  = scanPDHResponse.Items.pop();

    // console.log(`###Tactics Log###: Scanning DB completed, latest version from DataBase is ${latestVersionNumber}`);
    // let latestPatchDataRecordCdragonURL = latestPatchDataRecord.cdragonPatchDataURL;
    let latestPatchDataVersionNumber = latestPatchDataRecord.patchVersion;
    let latestPatchDataSetVersionNumber = latestPatchDataRecord.setVersionNumber;
    let latestPatchDataS3ObjectKey = latestPatchDataRecord.s3ObjectKey;
    console.log(`###Tactics Log###: Scan PDH completed, latest PDH patch version is ${latestPatchDataVersionNumber} @ set ${latestPatchDataSetVersionNumber}`);
    console.log(`###Tactics Log###: Getting patch data from bucket ${TACTICS_UPLOAD_BUCKET}, service initializing...`);
    var getTUParams = {
        Bucket: TACTICS_UPLOAD_BUCKET,
        Key: latestPatchDataS3ObjectKey,
        // Etag: '251a76342e3e6c39274582bbc257b582'
    };
    let putTUResponse = await s3Bucket.getObject(getTUParams);
    let objectData = putTUResponse.Body.toString('utf-8');
    if ( !objectData ) throw Error('###Tactics Log###: Putting in DB failed, service terminating...');

    console.log(`###Tactics Log###: Retrieve patch data json file success, analyzing patch data json file...`);
    let jsonObj = JSON.parse(objectData);
    var champions = jmespath.search(jsonObj, `sets."`+ latestPatchDataSetVersionNumber +`".champions[]`);
    var items = jmespath.search(jsonObj, `items`);
    var traits = jmespath.search(jsonObj, `sets."`+ latestPatchDataSetVersionNumber +`".traits[]`);

    console.log(`###Tactics Log###: champions, items, traits data extracted from json file successfully, putting into TCP, TIP and TTP`);

    async function putChampsToTCP(champions) {
        var i;
        for (i=0; i < champions.length; i++) {
            var champion = champions[i];
            var params = {
                "TableName": "tactics-champion-pool",
                "Item": {
                    uuid   : uuid.v1(),
                    name   : champion.name,
                    icon   : champion.icon,
                    cost   : champion.cost,
                    ability: champion.ability,
                    stats  : champion.stats,
                    class  : champion.traits[0],
                    origin : champion.traits[1],
                }
            };
            await dynamoDb.put(params);
            // console.log(putDBResponse);
        };
        return 'put TCP done';
    };

    async function putItemsToTIP(items) {
        var i;
        for (i=0; i < items.length; i++) {
            var item = items[i];
            var params3 = {
                "TableName": "tactics-item-pool",
                "Item": {
                    uuid   : uuid.v1(),
                    effects: item.effects,
                    from   : item.from,
                    icon   : item.icon,
                    id     : item.id,
                    name   : item.name,
                    desc   : item.desc,
                }
            };
            await dynamoDb.put(params3);
            // console.log(putDBResponse);
        };
        return 'put TIP done';
    };

    async function putTraitsToTTP(traits) {
        var i;
        for (i=0; i < traits.length; i++) {
            var trait = traits[i];
            var params3 = {
                "TableName": "tactics-traits-pool",
                "Item": {
                    "uuid": uuid.v1(),
                    "name": trait.name,
                    "desc": trait.desc,
                    "effects": trait.effects,
                    "icon": trait.icon,
                }
            };
            await dynamoDb.put(params3);
        };
        return 'put TTP done';
    };
    let putTCPResponse = await putChampsToTCP(champions);
    let putTIPReponse  = await putItemsToTIP(items);
    let putTTPResponse = await putTraitsToTTP(traits);
    return (putTCPResponse, putTIPReponse, putTTPResponse);
});

