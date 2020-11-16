import handler from "../libs/handler-lib";
import constants from "../assets/constants";
import latestVersionNumber from "./getLatestPatchVersionNumber";

export const main = handler(async (event, context) => {
    // get pacthnote version number
    // send patch version file to s3

    // MAJOR UPDATE
    // get latest patch version

    // what do i want to verify?
    // 1. to check if current db version is up to date
    // 2. check if the required patch version file is exist.
    // 3, check if item have exceeded the max number
    // 4. check if the current data verion in client side is match the main db patch version.]

    const getLastestPatchVersion = "https://f8brp6pbai.execute-api.ap-northeast-1.amazonaws.com/dev/latest-patch-version/";
    // get GET patch update file (en_us.json)
    // create a new table put new champion basic stats in it

    // BALANCE/REGULAR UPDATE
    // get latest patch version
    // get update difference from crawler
    // add to patch note update history (Db related)


    // server side self verification service:
    // bidirection verification: (run all service before update db)
    // sub-process1:

    let serverVerificationData = {
        "TableName": "serverSideStoreData",
        "Item": {
            "githublatestversion": uuid.v1(),
            "cdragonlatestversion": item.name,
            "currenpatchtversion": item.icon,
            "updatetime": item.cost,
            "validation": bool,
            "setnumber": item.stats,
            "patchFileS3URl": item.stats,
            "patchFileCDragonURl": item.stats,
        }
    }



    let versionNumer = [10.10, 10.11, 10.12];
    let patchFileCDragonURl = ['http://raw.communitydragon.org/10.20/cdragon/tft/en_us.json', 'http://raw.communitydragon.org/10.20/cdragon/tft/en_us.json', 'http://raw.communitydragon.org/10.20/cdragon/tft/en_us.json'];
    let patchFileS3URl = ['https://tactics-uploads.s3-ap-northeast-1.amazonaws.com/filename.txt','https://tactics-uploads.s3-ap-northeast-1.amazonaws.com/filename.txt']


    let clientVerificationData = {
        "TableName": "clientSideStoreData",
        "Item": {
            "clientVersion": uuid.v1(),
            "patchFileVersion": item.name,
            "lastUpdateTime": item.icon,
            "Cost": item.cost,
            "Ability": item.ability,
            "Stats": item.stats,
            "Class": item.traits[0],
            "Origin": item.traits[1],
        }
    }


    console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@");
    console.log(latestVersionNumber);
    console.log(constants.getURL(latestVersionNumber));
    console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@");

    return 1;
});
