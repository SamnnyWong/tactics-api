import handler from "../libs/handler-lib";
import constants from "../assets/constants";
import fetch from "node-fetch";
var jmespath = require('jmespath');
import dynamoDb from "../libs/dynamodb-lib";
import * as uuid from "uuid";
var aws = require('aws-sdk');
var lambda = new aws.Lambda({
    region: 'us-east-1' //change to your region
});

// import AWS from "aws-sdk";

// service api: https://f8brp6pbai.execute-api.ap-northeast-1.amazonaws.com/dev/latest-patch-version
export const main = handler(async (event, context, callback) => {
//     // TODO implement
//     // fetch all version number from CDragon version repo, at index 0 return the letest version number
    const  VERSION_HISTORY_TABLE = "patch-version-history";
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();
    today = yyyy + '-' + mm + '-' + dd;

    // try {
    console.log("###Tactics Log###: Fetching commit message...");
    let githubCommitMessages = await fetch(constants.GITHUB_NA_VERSION_NUMBER_URL);
    // error
    let result = await githubCommitMessages.json();
    // console.log(result);

    if (!githubCommitMessages || !result) {
        throw Error('###Tactics Log###: Fetching commit message failed: Service Terminating...');
    }
    else {
        var commitMessage = jmespath.search(result, constants.EXPRESSION_FILTER_VERSION_NUMBER);
        var latestVersionNumber = commitMessage.replace(/[^0-9\.]/g, "");
    }
    if (!commitMessage || !latestVersionNumber) {
        throw Error('###Tactics Log###: Can not get version number from commit message: Service Terminating...');
    }

    var param = {
        Key: {"patchVersion": latestVersionNumber},
        TableName: VERSION_HISTORY_TABLE
    };
    let checkDBversion = await dynamoDb.get(param);
    if (!checkDBversion["Item"]) {
        console.log(`###Tactics Log###: Fetch commit message success, Latest version number is ${latestVersionNumber}.`);
        console.log("###Tactics Log###: Puting into DynamoDB: Initializing Parameter...");
<<<<<<< HEAD
        let params = {
=======

        let params2 = {
>>>>>>> e48fa27d22931e9eb9b1a6d9acb1f135715f11d2
            "TableName": VERSION_HISTORY_TABLE,
            "Item": {
            "uuid": uuid["v1"](),
            "patchVersion": latestVersionNumber,
            "createdAt": today,
            "updatedAt": today,
            "date": today
            }
        };
        console.log("###Tactics Log###: Puting into DynamoDB: Service Pending.u..");
<<<<<<< HEAD
        let putDBResponse = await dynamoDb.put(params); // throwing this error might not have effect on the overall service functionality.
=======
        let putDBResponse = await dynamoDb.put(params2);
        // throwing this error might not have effect on the overall service functionality.
>>>>>>> e48fa27d22931e9eb9b1a6d9acb1f135715f11d2
        // need to throw/handle dynamoDb.put original error properly
        // need to clarify how to return success message when put in db on success

        if (!putDBResponse) {
            throw Error('###Tactics Log###: Putting in DB failed, service terminating...');
        }

        console.log("###Tactics Log###: Putting into DynamoDB success.");
<<<<<<< HEAD
        let successMessage = JSON.stringify(`Params: ${JSON.stringify(params)} put into table: ${VERSION_HISTORY_TABLE} success.`);
=======
        let successMessage = JSON.stringify(`Params: ${JSON.stringify(params2)} put into table: ${VERSION_HISTORY_TABLE} success.`);

>>>>>>> e48fa27d22931e9eb9b1a6d9acb1f135715f11d2
        let response = {
            "latestPatchVersion": latestVersionNumber,
            "message": successMessage
        };
        let lambdaparam = {
            FunctionName: 'DavidDemo-dev-getLatestPatchJsonData',
            InvocationType: 'Event',
            Payload: JSON.stringify(event, null, 2)
        };
        await lambda.invoke(lambdaparam, function(error, data){
            if (error) console.log(error);
            else console.log(data);
        }).promise();
        return response;

    } else {
        console.log("patch version is up to date");
    }

});
