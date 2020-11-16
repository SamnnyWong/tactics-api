// export function bbbbbbbbar() {
//     return `this is a function from a custom modeule "utility"`;
// }


// list all files in the s3 bucket named tft-uploads

var jmespath = require('jmespath');
import handler from "../libs/handler-lib";
import s3Bucket from "../libs/s3bucket-libs";

export const main = handler(async (event, context, callback) => {
    // TODO implement

    var params = {
        Bucket: 'tactics-uploads',
        Key: 'filename.json',
        // Etag: '251a76342e3e6c39274582bbc257b582'
    };
        let file = await s3Bucket.getObject(params);
        console.log(`###Tactics Log###: !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!`);
        // returns {
        //   AcceptRanges: 'bytes',
        //   LastModified: 'Wed, 06 Apr 2016 20:04:02 GMT',
        //   ContentLength: '1602862',
        //   ETag: '9826l1e5725fbd52l88ge3f5v0c123a4"',
        //   ContentType: 'application/octet-stream',
        //   Metadata: {},
        //   Body: <Buffer 01 00 00 00  ... > }


        let objectData = file.Body.toString('utf-8');
        let jsonObj = JSON.parse(objectData);
        var sets = jmespath.search(jsonObj, `sets`);
        console.log(sets);
        console.log(`###Tactics Log###: !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!`);
});

// exports.handler = async (event) => {
//     // TODO implement
//     const response = {
//         statusCode: 200,
//         body: JSON.stringify('Hello from Lambda!'),
//     };
//     return response;
// };
