import handler from "../libs/handler-lib";
import dynamoDb from "../libs/dynamodb-lib";

// service api: https://f8brp6pbai.execute-api.ap-northeast-1.amazonaws.com/dev/latest-patch-version
export const main = handler(async (event, context, callback) => {
    const TACTICS_SERVICE_STATUS = "tactics-service-status";

    let response = {
    };

    var TSSParams = {
        TableName: TACTICS_SERVICE_STATUS,
        Select: "ALL_ATTRIBUTES"
    };

    console.log("###Tactics Log###: Scanning TSS...");
    let scanTSSResponse = await dynamoDb.scan(TSSParams);

    if (!scanTSSResponse) {
        throw Error('###Tactics Log###: Can not get PVH/PDH/PUH record: Service Terminating...');
    }

    let TSSRecords = scanTSSResponse.Items;

    console.log("###Tactics Log###: scan TSS successfully.");
    var PVHindex = TSSRecords.findIndex(obj => obj.serviceId=="PVH");
    var PDHindex = TSSRecords.findIndex(obj => obj.serviceId=="PDH");
    var PUHindex = TSSRecords.findIndex(obj => obj.serviceId=="PUH");
    let PVHRecord = TSSRecords[PVHindex];
    let PDHRecord = TSSRecords[PDHindex];
    let PUHRecord = TSSRecords[PUHindex];
    response.serviceStatus = {
        "PVH patch version": PVHRecord.patchVersion,
        "PDH patch version": PDHRecord.patchVersion,
        "PUH patch version": PUHRecord.patchVersion,
        "PUH serviceStatus": PUHRecord.serviceStatus,

    };


    // DAVID_TO_DO:///////////////////////////////////////////////////////////////////////////////////////////
    var bucketName = "tactics-composition";//change to corresponding bucket name
    var paramlist = {
        Bucket: bucketName,
        Prefix:"10_22"// can change 10.22 to current patch version
    };
    // find the last version number of the current patch
    try{
        const response = await s3.listObjectsV2(paramlist).promise();
        //sort files by last modified date
        var timesort = response.Contents.sort((a, b) => (a.LastModified < b.LastModified) ? 1 : -1);
        // console.log(timesort[0]); //return the file with last modified date

    } catch(e){
        console.error(e);
    };
    var sourceKey = timesort[0].Key;
    // get the last version of comp file
    // open it, get the patch verion
    // if (PVHRecord.patchVersion === PDHRecord.patchVersion && PVHRecord.patchVersion === PUHRecord.patchVersion && PVHRecord.patchVersion === PACTHCVERIONFROMCOMP FILE && PUHRecord.serviceStatus.statusCode === "200") { //DAVID_TO_DO: compare the composition file patch version with PVHRecord.patchVersion
    // DAVID_TO_DO:///////////////////////////////////////////////////////////////////////////////////////////
    if (PVHRecord.patchVersion === PDHRecord.patchVersion && PVHRecord.patchVersion === PUHRecord.patchVersion && PUHRecord.serviceStatus.statusCode === "200") { //DAVID_TO_DO: compare the composition file patch version
        response.serviceIsReady = true;
    }
    else { response.serviceIsReady = false; }

    return response;
});

// get last comp versioon file from s3 get its patch version, compare it with pvh pdh and puh
// if true return true else return false

// Items: [
//     {
//         patchVersion: '10.10',
//         serviceId: 'PDH',
//         serviceStatus: 'Service is operating normally',
//         lastCheck: '2020-11-03T07:49:09.061Z',
//         tacticsService: 'patch-data-history'
//     },
//     {
//         patchVersion: '10.10',
//         serviceId: 'PUH',
//         serviceStatus: 'Service is operating normally',
//         lastCheck: '2020-11-03T07:49:09.061Z',
//         tacticsService: 'patch-update-history'
//     },
//     {
//         serviceId: 'PVH',
//         tacticsService: 'patch-version-history'
//         lastCheck: '2020-11-03T07:49:09.061Z',
//         patchVersion: '10.10',
//         serviceStatus: 'Service is operating normally',
//     }
// ]
