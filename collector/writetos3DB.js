import * as webdata from "../datafolder/webdatafile";


var AWS = require('aws-sdk');
var s3 = new AWS.S3();
const documentClient = new AWS.DynamoDB.DocumentClient();
export const  main = handler(async (event, context) => {
    var bucketName = "davidtestlist"; //create the bucket
    var fileName = 'news3storetesting.json';
    var keyName = getKeyName("testfolder", fileName);
    let s3data = await webdata.webscraper();
    var content = JSON.stringify(Object.assign({}, s3data));
    const tableName = process.env.tableName;
    const DBdata = JSON.parse(content);
    var params = { Bucket: bucketName, Key: keyName, Body: content };
    try{
        const s3response = await s3.putObject(params).promise();
        console.log(s3response);

    }
    catch (error) {
        console.log(error);
    }

    // console.log(Object.keys(DBdata).length);
    for (var x = 0; x < Object.keys(DBdata).length; x++) {
        var paramsDB = {
            TableName: tableName,
            Item: DBdata[x]
        };
        console.log(paramsDB);
        let putDBResponse = await documentClient.put(paramsDB).promise();
        // throwing this error might not have effect on the overall service functionality.
        // need to throw/handle dynamoDb.put original error properly
        // need to clarify how to return success message when put in db on success
        if (! putDBResponse) {
            throw Error('###Tactics Log###: Putting in DB failed, service terminating...');
        }
    }
    return content;
    // s3.putObject(params, function (err, data) {
    //     if (err)
    //         console.log(err);
    //     else
    //         console.log("Successfully saved object to " + bucketName + "/" + keyName);
    // });
    // var fs = require('fs');
    // fs.writeFile('myjsonfile.json', jsondata, 'utf8');
};
function getKeyName(folder, filename) {
    return folder + '/' + filename;
}