
// import handler from "./libs/handler-lib";
var AWS = require('aws-sdk');
var s3 = new AWS.S3();

export const main = async (event, context) => {

    var bucketName = "tactics-composition";//change to corresponding bucket name
    var paramlist = {
        Bucket: bucketName,
        Prefix:"10_22"// can change 10.22 to current patch version
    };
    // find the last version number of the current patch
    try{
        const response = await s3.listObjectsV2(paramlist).promise();
        //sort files by last modified date
        var timesort = response.Contents.sort((a, b) => (a.LastModified < b.LastModified) ? 1 : -1);
        // console.log(timesort[0]); //return the file with last modified date

    } catch(e){
        console.error(e);
    };
    //copy the last Comp version from bucket to bucket
    var sourceKey = timesort[0].Key;
    var params = {
        Bucket: "tactics-dist",
        CopySource: "/tactics-composition/" + sourceKey,
        Key: "tactics-dist-composition.json"
    };
    console.log(params);
    s3.copyObject(params, function(err, data) {
        if (err) console.log(err, err.stack); // an error occurred
        else     console.log(data);           // successful response
    });

};