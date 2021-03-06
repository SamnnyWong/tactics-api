import AWS from "aws-sdk";
const s3 = new AWS.S3();
export default {
    getObject   : (params) => s3.getObject(params).promise(),
    putObject   : (params) => s3.putObject(params).promise(),
    listObjectsV2   : (params) => s3.listObjectsV2(params).promise(),
    copyObject   : (params) => s3.copyObject(params).promise(),

};

// const client = new AWS.DynamoDB.DocumentClient();
// export default {
//     get   : (params) => client.get(params).promise(),
//     put   : (params) => client.put(params).promise(),
//     query : (params) => client.query(params).promise(),
//     update: (params) => client.update(params).promise(),
//     delete: (params) => client.delete(params).promise(),
//     scan  : (params) => client.scan(params).promise(),
// };
