import handler from "../libs/handler-lib";
import dynamoDb from "../libs/dynamodb-lib";
import patchChangePcgamesnCrawler from "../collector/web-crawler/patchChangePcgamesnCrawler";
import * as uuid from "uuid";
// import constants from "../assets/constants";
console.log('Loading hello world function');
// var axios = require('axios');
// var cheerio = require("cheerio");

export const main = handler(async (event, context) => { var dateObject = new Date();
    let isoTimeStamp = dateObject.toISOString();
    const source = "pcgamesn.com";
    const PATCH_VERSION_HISTORY_TABLE = "patch-version-history";
    const PATCH_UPDATE_HISTORY_TABLE  = "patch-update-history";

    let response = {
        "latestPUHPatchVersion": '',
        "PUHStatus": '',
        "message": '',
    };

    var PVHParams = {
        TableName: PATCH_VERSION_HISTORY_TABLE,// give it your table name
        Select: "ALL_ATTRIBUTES"
    };

    var PUHParams = {
        TableName: PATCH_UPDATE_HISTORY_TABLE,// give it your table name
        Select: "ALL_ATTRIBUTES"
    };
    console.log("###Tactics Log###: Searching for latest patch version: Scanning PVH and PUH...");
    let scanPVHResponse = await dynamoDb.scan(PVHParams);
    let scanPUHResponse = await dynamoDb.scan(PUHParams);

    if (!scanPVHResponse || !scanPUHResponse) {
        throw Error('###Tactics Log###: Can not get PVH/PDH record: Service Terminating...');
    }
    scanPVHResponse.Items.sort(function(a, b) {
        return (a.createdAt < b.createdAt) ? -1 : ((a.createdAt > b.createdAt) ? 1 : 0);
    });

    scanPUHResponse.Items.sort(function(a, b) {
        return (a.createdAt < b.createdAt) ? -1 : ((a.createdAt > b.createdAt) ? 1 : 0);
    });
    let currentPVHRecord  = scanPVHResponse.Items.pop();
    let currentPUHRecord  = scanPUHResponse.Items.pop();
    let currentPVHVersionNumber = currentPVHRecord.patchVersion;
    let currentPUHVersionNumber = currentPUHRecord.patchVersion;

    console.log(`###Tactics Log###: Scanning PVH and PUH completed.`);
    console.log(`###Tactics Log###: latest PVH record: ${currentPVHVersionNumber}, latest PUH record: ${currentPUHVersionNumber}.`);

    console.log(`###Tactics Log###: Fetching patch change from source: ${source}.`);
    let patchChangeResult = null;
    try {
        patchChangeResult = await patchChangePcgamesnCrawler({ patchVersion: currentPVHVersionNumber });
    }
    catch (e) {
        console.log(`###Tactics Log###: Shit happened, updating db with a failed status code.`);
        // skip here
    };
    if (!patchChangeResult) {
        console.log(`###Tactics Log###: Fetch patch change failed.`);
    }

////////////////////////////////////////////////////////////////////////////
    if (currentPVHVersionNumber === currentPUHVersionNumber) {
        let updatedCurrentPUHRecord = {};
        if (currentPUHRecord.serviceStatus.statusCode === "200" || !patchChangeResult) {
            // update lastCheck timestamp
            updatedCurrentPUHRecord = {
                TableName: PATCH_UPDATE_HISTORY_TABLE,
                Key:{
                    "uuid": currentPUHRecord.uuid,
                    "createdAt": currentPUHRecord.createdAt,
                },
                UpdateExpression: "set lastCheck = :x, sourceURL = :c",
                ExpressionAttributeValues:{
                    ":x": isoTimeStamp,
                    ":c": patchChangeResult.sourceURL
                },
            };
        }
        // else if (currentPUHRecord.serviceStatus.statusCode === "500" && !patchChangeResult) {
        //     // update lastCheck timestamp
        //     var updatedCurrentPUHRecord = {
        //         TableName: PATCH_VERSION_HISTORY_TABLE,
        //         Key:{
        //             "uuid": currentPUHRecord.uuid,
        //             "createdAt": currentPUHRecord.createdAt,
        //         },
        //         UpdateExpression: "set lastCheck = :x",
        //         ExpressionAttributeValues:{
        //             ":x": isoTimeStamp,
        //         },
        //         ReturnValues: updatedCurrentPUHRecord //what does this do?
        //     };
        // }
        else if (currentPUHRecord.serviceStatus.statusCode === "500" && patchChangeResult) {
            updatedCurrentPUHRecord = {
                TableName: PATCH_UPDATE_HISTORY_TABLE,
                Key:{
                    "uuid": currentPUHRecord.uuid,
                    "createdAt": currentPUHRecord.createdAt,
                },
                // UpdateExpression: "set lastCheck = :x, serviceStatus = :y, traits = :z, champions = :a ,weapons = :b, sourceURL = :c, rawData = :d ",
                UpdateExpression: "set lastCheck = :x, serviceStatus = :y, rawData = :d, sourceURL = :c ",
                ExpressionAttributeValues:{
                    ":x": isoTimeStamp,
                    ":y": { "statusCode": "200", "statusMessage": `fetch patch change from source ${patchChangeResult.sourceURL} successfully.`},
                    // ":z": "1",
                    // ":a": "1",
                    // ":b": "1",
                    ":c": patchChangeResult.sourceURL,
                    ":d": patchChangeResult.updateList

                },
            };
        }
        console.log("###Tactics Log###: Updating the current PUH record...");
        let updateDBResponse = await dynamoDb.update(updatedCurrentPUHRecord);
        console.log(updateDBResponse);

        console.log("###Tactics Log###: Updating the current PUH record success.");
        let message = JSON.stringify(`PUH is up-to-date, PUH record: ${currentPUHRecord.uuid} lastCheck time: ${isoTimeStamp}`);
        // response.latestPUHPatchVersion = currentPVHVersionNumber;
        response.message = message;

    }
    else if (currentPVHVersionNumber !== currentPUHVersionNumber) {
        let latestPUHRecord = {
            "TableName": PATCH_UPDATE_HISTORY_TABLE,
            "Item": {
                "uuid": uuid.v1(),
                "createdAt": isoTimeStamp,
                "lastCheck": "",
                "patchVersion": currentPVHVersionNumber,
                "sourceURL": "https://www.pcgamesn.com/teamfight-tactics/tft-patch-1025",
            }
        };
        if (patchChangeResult) {
            latestPUHRecord.Item.serviceStatus = { "statusCode": "200", "statusMessage": `fetch patch change from source ${source} successfully.`};
            latestPUHRecord.Item.traits = 1;
            latestPUHRecord.Item.champions = 1;
            latestPUHRecord.Item.weapons = 1;
        }
        else if (!patchChangeResult) {
            latestPUHRecord.Item.serviceStatus = { "statusCode": "500", "statusMessage": `waiting for source ${source} to update content.`};
        }
        console.log("###Tactics Log###: Updating the current PUH record...");
        let putDBResponse = await dynamoDb.put(latestPUHRecord);
        if (! putDBResponse) {
            throw Error('###Tactics Log###: Putting in DB failed, service terminating...');
        }
        console.log("###Tactics Log###: Putting into PUH success.");

        let message = JSON.stringify(`PUH is up-to-date, PUH record: ${latestPUHRecord.uuid} lastCheck time: ${isoTimeStamp}`);
        response.latestPUHPatchVersion = currentPVHVersionNumber;
        // response.PUHStatus = currentPUHRecord.status;
        response.message = message;
    }
    else {
        console.log("idk wtf is going on..");
    }
    return response;
    // define the following code as a plugin, if one fails, the back up will up.
    // schedule the state machine to run with different crawler plugins.....
    // crawler choice list...
    // what doesnt change is the crawler's output file format.
    // only intake is the patch version number.
    // main function only feed it with the regular form, (i.e. "10.22")
    // crawler then convert it into website's requirment respectivly...
    // possibility: every plugin crawler as a single service with a dedicated DataBase ready to serve the crawled content.
    // if one down, the next one is up.
});


// {
//     "uuid": "xxxxx-00000-xxxxxx-00000"
//     "createdAt": "2020-11-02T03:36:19.678Z",
//     "lastCheck": "",
//     "patchVersion": "10.10",
//     "sourceURL": "https://www.pcgamesn.com/teamfight-tactics/tft-patch-1022",
//     "status": {
//         "code"   : "200",
//         "message": "waiting for source website: pcgamesn.com to update content."
//     },

//     "traits": "",
//     "champions": "[Azir, Cassiopia, Diana, Nidalee, Riven, Sett, Thresh, Vi, Warick, Yummi, Sylas]",
//     "items": "",
// }
