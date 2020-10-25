// list all files in the s3 bucket named tft-uploads

import handler from "../libs/handler-lib";
export const main = handler(async (event, context, callback) => {
    // TODO implement
    console.log("!!!!!!!!!!!!!!!!!!!!!! function started.");
    const aws = require('aws-sdk');
    const s3 = new aws.S3();

    // var params = {
    //     Bucket: 'tactics-uploads',
    // };

    try{
        const response = await s3.listObjectsV2({ Bucket: 'tactics-uploads'}).promise();
        console.log(response);

    } catch(e){
        console.error(e);
    };

    console.log("!!!!!!!!!!!!!!!!!!!!!! function exit.");

    // debugger;
    // return response;
});

// exports.handler = async (event) => {
//     // TODO implement
//     const response = {
//         statusCode: 200,
//         body: JSON.stringify('Hello from Lambda!'),
//     };
//     return response;
// };


// sample response
// { IsTruncated: false,
//     Contents:
//     [ { Key: '10.20_en_us.json',
//         LastModified: 2020-10-05T20:59:39.000Z,
//     ETag: '"9c778ef4060c078723c497db17f4200d"',
//     Size: 453903,
//     StorageClass: 'STANDARD' },
//     { Key: 'filename.json',
//         LastModified: 2020-10-19T22:45:16.000Z,
//         ETag: '"251a76342e3e6c39274582bbc257b582"',
//         Size: 156662,
//         StorageClass: 'STANDARD' },
//     { Key: 'filename.txt',
//         LastModified: 2020-10-19T22:37:48.000Z,
//         ETag: '"251a76342e3e6c39274582bbc257b582"',
//         Size: 156662,
//         StorageClass: 'STANDARD' } ],
//     Name: 'tactics-uploads',
//         Prefix: '',
//     MaxKeys: 1000,
//     CommonPrefixes: [],
//     KeyCount: 3 }
