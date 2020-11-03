// list all files in the s3 bucket

import handler from "./libs/handler-lib";
export const main = handler(async (event, context, callback) => {
    // TODO implement
    console.log("!!!!!!!!!!!!!!!!!!!!!! function started.");
    const aws = require('aws-sdk');
    const s3 = new aws.S3();

    // var params = {
    //     Bucket: 'tactics-uploads',
    // };

    try{
        const response = await s3.listObjectsV2({ Bucket: 'davidtestlist'}).promise();
        //sort files by last modified date
        var timesort = response.Contents.sort((a, b) => (a.LastModified < b.LastModified) ? 1 : -1);
        console.log(timesort[0]); //return the file with last modified date

    } catch(e){
        console.error(e);
    };
    console.log("!!!!!!!!!!!!!!!!!!!!!! function success.");
    return timesort[0];
});

