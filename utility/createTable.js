import handler from "../libs/handler-lib";
var AWS = require('aws-sdk');
// Load credentials and set Region from JSON file
// AWS.config.loadFromPath('./config.json');

// Create DynamoDB service object
var ddb = new AWS.DynamoDB();
// const DB = new AWS.DynamoDB.DocumentClient();
export const main = handler(async (event, context) => {
    var tableParams = {
        AttributeDefinitions: [
            {
                AttributeName: 'ID',
                AttributeType: 'N'
            },
            {
                AttributeName: 'testColumn',
                AttributeType: 'S'
            }
        ],
        KeySchema: [
            {
                AttributeName: 'ID',
                KeyType: 'HASH'
            },
            {
                AttributeName: 'testColumn',
                KeyType: 'RANGE'
            }
        ],
        ProvisionedThroughput: {
            ReadCapacityUnits: 1,
            WriteCapacityUnits: 1
        },
        TableName: event.TableName, //pass in the table name in event function
        // TableName: event.TableName, //pass in the table name in event function
        StreamSpecification: {
            StreamEnabled: false
        }
    };

    var createTable = await ddb.createTable(tableParams, function(err, data) {
        if (err) {
            console.log("Error", err);
        } else {
            console.log("Success", data);

        }
    }).promise();
    // console.log(createTable);
    // console.log("##################################");
    // var paramsDB = {
    //     TableName: createTable.TableDescription.TableName,
    //     // TableName:"TABLE_DB_CREATE",
    //     Item: {
    //         ID: 1,
    //         testColumn:"Testing"
    //     }
    // };
    // while (true) {
    //     if (createTable.TableDescription.TableStatus == "ACTIVE"){
    //         let putDBResponse = await DB.put(paramsDB).promise();
    //         if (! putDBResponse) {
    //             throw Error('###Tactics Log###: Putting in DB failed, service terminating...');
    //         }
    //         break;
    //     } else {
    //         setTimeout(() => { console.log("### wait 3 seconds ###"); }, 3000);
    //     }
    // }
    // console.log(createTable.TableDescription);
    console.log("##################################");

    let response = {
        "message": createTable
    };
    return response;
});
