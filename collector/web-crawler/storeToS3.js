var AWS = require('aws-sdk');
var s3 = new AWS.S3();

//2 inputs: BucketName and Content
export const  main = handler(async (event, context) => {
    var bucketName = event.BucketName //create the bucket first
    var fileName = 's3stored.json';
    let s3data = await event.Content;
    var content = JSON.stringify(Object.assign({}, s3data));

    var params = { Bucket: bucketName, Key: fileName, Body: content };
    try{
        const s3response = await s3.putObject(params).promise();
        console.log(s3response);

    }
    catch (error) {
        console.log(error);
    }

    return content;

});
