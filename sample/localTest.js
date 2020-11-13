import handler from "../libs/handler-lib";
// import constants from "../assets/constants";
import patchChangePcgamesnCrawler from "../collector/web-crawler/patchChangePcgamesnCrawler";
console.log('Loading hello world function');
import fetch from "node-fetch";

export const main = handler(async (event, context) => {
    var currentTime = new Date();
    currentTime.setTime(currentTime.getTime());
    console.log(currentTime.toISOString());
    console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@");

    var dateObject = new Date();
    let isoDate = dateObject.toISOString();
    let currentTime2 = dateObject.toDateString();
    console.log(currentTime2);
    console.log(isoDate);
    console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@");


    let date1 = '2020-10-28T09:38:33.467Z';
    let date2 = '2020-10-27T09:38:33.467Z';
    console.log(date1 > date2);

    console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@");

    // let sup = [
    //     {
    //         patchVersion: '10.21',
    //         uuid: 'c4211c80-1422-11eb-8a9b-3b4a95d31ad8',
    //         createdAt: '2020-10-22T09:38:33.467Z',
    //         lastCheck: ''
    //     },
    //     {
    //         patchVersion: '10.21',
    //         uuid: '179131e0-16e7-11eb-9726-8987cce7d561',
    //         createdAt: '2020-10-25T09:38:33.467Z',
    //         lastCheck: ''
    //     },
    //     {
    //         patchVersion: '10.22',
    //         uuid: '9b91f020-19c0-11eb-ad43-d5bafe648571',
    //         createdAt: '2020-10-29T09:38:33.467Z',
    //         lastCheck: ''
    //     },
    //     {
    //         patchVersion: '10.22',
    //         uuid: '71180380-18f7-11eb-8c8c-0f2601913d2c',
    //         createdAt: '2020-10-28T09:38:33.467Z',
    //         lastCheck: ''
    //     },
    //     {
    //         patchVersion: '10.21',
    //         uuid: '46973910-182e-11eb-b765-2ba9eba7627b',
    //         createdAt: '2020-10-27T09:38:33.467Z',
    //         lastCheck: ''
    //     }
    // ];
    //
    // console.log(sup);


    // console.log(uuid.v1());

    let Items = [
        {
            patchVersion: '10.10',
            serviceId: 'PDH',
            serviceStatus: 'Service is operating normally',
            lastCheck: '2020-11-03T07:49:09.061Z',
            tacticsService: 'patch-data-history'
        },
        {
            patchVersion: '10.10',
            serviceId: 'PUH',
            serviceStatus: 'Service is operating normally',
            lastCheck: '2020-11-03T07:49:09.061Z',
            tacticsService: 'patch-update-history'
        },
        {
            serviceId: 'PVH',
            tacticsService: 'patch-version-history',
            lastCheck: '2020-11-03T07:49:09.061Z',
            patchVersion: '10.10',
            serviceStatus: 'Service is operating normally',
        }
    ];
    var PVHindex = Items.findIndex(obj => obj.serviceId=="PVH");
    var PDHindex = Items.findIndex(obj => obj.serviceId=="PDH");
    var PUHindex = Items.findIndex(obj => obj.serviceId=="PUH");
    console.log(`index of PVH is: ${PVHindex}`);
    console.log(`index of PDH is: ${PDHindex}`);
    console.log(`index of PUH is: ${PUHindex}`);

    // var db = "https://1ctjksg2k2.execute-api.us-east-1.amazonaws.com/Test";


    // let urrl = "https://f8brp6pbai.execute-api.ap-northeast-1.amazonaws.com/dev/latest-patch-version";
    let TSS_STATUS_URL = "https://f8brp6pbai.execute-api.ap-northeast-1.amazonaws.com/dev/tactics-service-status";
    let TSSResponse = await fetch(TSS_STATUS_URL);
    let result = await TSSResponse.json();
    console.log(result);
    console.log(result.serviceIsReady);
    //
    //
    // const a = "1";
    // const b = "1";
    // const c = "1";
    // const n = null;
    // const m = undefined;
    // console.log(a===b);
    // console.log(a===b===c);
    // console.log(!a);
    // console.log(n===true);
    // if (!n){
    //     console.log("here");
    // }
    // if (!m){
    //     console.log("here hrererer");
    // }

    let patchChangeResult = await patchChangePcgamesnCrawler({ patchVersion:"10.23" });
    console.log(patchChangeResult);
});
