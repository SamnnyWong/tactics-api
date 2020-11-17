import handler from "../libs/handler-lib";
import dynamoDb from "../libs/dynamodb-lib";
// var s3 = new AWS.S3();

// import constants from "../assets/constants";
console.log('Testing Query from dynamo db');
export const main = handler(async (event, context) => {

    const  VERSION_HISTORY_TABLE = "patch-version-history";
    // let params1 = {
    //     "TableName": VERSION_HISTORY_TABLE,
    //     "Item": {
    //         "uuid": uuid.v1(),
    //         "date": today,
    //         "patchVersion": latestVersionNumber,
    //     }
    // };
    // var params2 = {
    //     TableName: "YourTableName",
    //     Key: {
    //         "ColumnByWhichYouSearch": {
    //             S: "ValueThatYouAreQueriing"
    //         }
    //     }
    // };

    var params3 = {
        TableName: VERSION_HISTORY_TABLE,// give it your table name
        Select: "ALL_ATTRIBUTES"
    };

    let scanDBResponse = await dynamoDb.scan(params3);
    console.log(`###Tactics Log###: !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!`);
    // console.log(`###Tactics Log###: ${JSON.stringify(scanDBResponse)}`);
    console.log(`###Tactics Log###: ${JSON.stringify(scanDBResponse.Items)}`);
    console.log(`###Tactics Log###: !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!`);
    console.log(`###Tactics Log###: ${JSON.stringify(scanDBResponse.Items[0])}`);
    // the last one is the latest patch version number.
    //
    console.log(`###Tactics Log###: !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!`);

    dynamoDb.scan(params3, function(err, data) {
        if (err) {
            console.error("Unable to read item. Error JSON:", JSON.stringify(err, null, 2));
        } else {
            console.log("GetItem succeeded:", JSON.stringify(data, null, 2));
        }
    });


    // exports.handler = event => {
    //     return queryMyThings();
    // }
    //
    // const queryMyThings = async (event) => {
    //
    //     return await dynamoDb.sc
    //     return await dynamoDb.getItem(params).promise();
    // }

    // try
    // {
    //     const s3Response = await s3.putObject(params).promise();
    //     console.log(s3Response);
    //     // if succeed
    //     // handle response here
    // }
    // catch (ex)
    // {
    //     // if failed
    //     // handle response here (obv: ex object)
    //     // you can simply use logging
    //     console.error(ex);
    // }

    return 1;
});

// {"Items":[
//     {"patchVersion":"10.21","createdAt":"2020-10-22","uuid":"c4211c80-1422-11eb-8a9b-3b4a95d31ad8","date":"2020-10-10","updatedAt":"2020-10-22"},
//     {"patchVersion":"10.21","createdAt":"2020-10-22","uuid":"c4211c80-1422-11eb-8a9b-3b4a95d31ad8","date":"2020-10-11","updatedAt":"2020-10-22"},
//     {"patchVersion":"10.21","createdAt":"2020-10-22","uuid":"c4211c80-1422-11eb-8a9b-3b4a95d31ad8","date":"2020-10-12","updatedAt":"2020-10-22"},
//     {"patchVersion":"10.21","createdAt":"2020-10-22","uuid":"c4211c80-1422-11eb-8a9b-3b4a95d31ad8","date":"2020-10-13","updatedAt":"2020-10-22"},
//     {"patchVersion":"10.21","createdAt":"2020-10-22","uuid":"c4211c80-1422-11eb-8a9b-3b4a95d31ad8","date":"2020-10-14","updatedAt":"2020-10-22"},{
//     "patchVersion":"10.21","createdAt":"2020-10-22","uuid":"c4211c80-1422-11eb-8a9b-3b4a95d31ad8","date":"2020-10-15","updatedAt":"2020-10-22"},
//     {"patchVersion":"10.21","createdAt":"2020-10-22","uuid":"c4211c80-1422-11eb-8a9b-3b4a95d31ad8","date":"2020-10-16","updatedAt":"2020-10-22"},
//     {"patchVersion":"10.21","createdAt":"2020-10-22","uuid":"c4211c80-1422-11eb-8a9b-3b4a95d31ad8","date":"2020-10-17","updatedAt":"2020-10-22"},
//     {"patchVersion":"10.21","createdAt":"2020-10-22","uuid":"c4211c80-1422-11eb-8a9b-3b4a95d31ad8","date":"2020-10-22","updatedAt":"2020-10-22"}],
//     "Count":9,"ScannedCount":9}

