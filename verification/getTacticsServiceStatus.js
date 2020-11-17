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
    var COMPindex = TSSRecords.findIndex(obj => obj.serviceId=="COMP");
    let PVHRecord = TSSRecords[PVHindex];
    let PDHRecord = TSSRecords[PDHindex];
    let PUHRecord = TSSRecords[PUHindex];
    let COMPRecord = TSSRecords[COMPindex];
    response.serviceStatus = {
        PVH_patchVersion: PVHRecord.patchVersion,
        PDH_patchVersion: PDHRecord.patchVersion,
        PUH_patchVersion: PUHRecord.patchVersion,
        COMP_patchVersion: COMPRecord.patchVersion,
        PUH_serviceStatus: PUHRecord.serviceStatus,

    };
    if (PVHRecord.patchVersion === PDHRecord.patchVersion && PVHRecord.patchVersion === PUHRecord.patchVersion
        && PVHRecord.patchVersion === COMPRecord.patchVersion && PUHRecord.serviceStatus.statusCode === "200") {
        response.serviceIsReady = true;
    }

    else { response.serviceIsReady = false; }

    return response;
});

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
