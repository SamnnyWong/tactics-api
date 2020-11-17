import handler from "../libs/handler-lib";
import dynamoDb from "../libs/dynamodb-lib";
import patchChangePcgamesnCrawler from "../collector/web-crawler/patchChangePcgamesnCrawler";
// import constants from "../assets/constants";
console.log('Loading hello world function');
// var axios = require('axios');
// var cheerio = require("cheerio");

export const main = handler(async (event, context) => {

    const PATCH_VERSION_HISTORY_TABLE = "patch-version-history";
    const PATCH_UPDATE_HISTORY_TABLE  = "patch-update-history";

    // let response = {
    //     "latestPatchVersion": '',
    //     "message": '',
    //     "newSetVersionNumber": null
    // };

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

    // first scan puh and pvh
    // compare pvh.pv and puh.pv same: skip, diff: waiting for update?????????
    // check puh.status normal: write to puh, fkup: write fkup to puh


    if (currentPVHVersionNumber === currentPUHVersionNumber) {
        // if current PUH record is match with the PVH record, update last check field.
    }
    else {
        //id puh status is normal, put it into db

    };
});
