// get all the patch history from db
// then send it to the mobile client

// service api-gateway:
// table name:
// table arn
import handler from "../libs/handler-lib";
import s3Bucket from "../libs/s3bucket-libs";
// import constants from "../assets/constants";
console.log('Loading hello world function');
export const main = handler(async (event, context) => {
    let response = {
    };
    var TACTICS_DIST_BUCKET = "tactics-dist";
    const DIST_COMPS_JSON = "tactics_dist_composition.json";
    var params2 = {
        Bucket: TACTICS_DIST_BUCKET,
        Key: DIST_COMPS_JSON,
        // Etag: '251a76342e3e6c39274582bbc257b582'
    };
    let file = await s3Bucket.getObject(params2);

    let objectData = file.Body.toString('utf-8');
    let jsonObj = JSON.parse(objectData);

    console.log(jsonObj);
    response.Contents = jsonObj;
    return response;
});

