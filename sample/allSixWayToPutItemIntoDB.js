////////////////////////////method 0
//         const client = new AWS.DynamoDB.DocumentClient();

// const docClient = new AWS.DynamoDB.DocumentClient({
//     sslEnabled: false,
//     paramValidation: false,
//     convertResponseTypes: false
// });
//
// docClient.put(params).promise()
//     .then(function(data) {
//         console.log(data);
//     })
//     .catch(function(err) {
//         console.log(err);
//     });


///////////////////////////////////method 0.00001
//     try
//     {
//         var putDBResponse = await dynamoDb.putItem(params);
//         //Handle your result here!
//         //
//         console.log("###T########################################");
//         console.log(putDBResponse);
//         console.log("###Tactics Log###: Puting into DynamoDB success. Returning putDBResponse.");
//     }
//     catch(err)
//     {
//         console.log(err);
//     }

////////////////////////////method 1
// // Create a promise object
// var putObjectPromise = dynamoDb.put(params);
//
// // If successful, do this:
// putObjectPromise.then(function(data) {
//
// console.log("###T########################################");
// console.log('PutObject succeeded' + data);
// console.log("###Tactics Log###: Puting into DynamoDB success. Returning putDBResponse.");
// return data;
// })
//
// // If the promise failed, catch the error:
// .catch(function(err) {
//     console.log(err); });


////////////////////////////method 2
//         dynamoDb.put(params , function(result) {
//                 result.on('data', function(chunk) {
//                     console.log("" + chunk);
//                 });
//             });
//         if ( ! result) {
//             throw new Error("put in db failed");
//         }

////////////////////////////method 3
//         let putDBResponse = await dynamoDb.put(params);
//
//         if (! putDBResponse) {
//             throw Error('###Tactics Log###: Putting in DB failed, service terminating...');
//         }
//         console.log(putDBResponse);
//         console.log("###Tactics Log###: Puting into DynamoDB success. Returning putDBResponse.");
//         return putDBResponse;

///////////////////////////// original function
//     const result =  await fetch(constants.GITHUB_NA_VERSION_NUMBER_URL)
//         .then(res => res.json())
//         .then((jsonData) => {
//             var commitMessage = jmespath.search(jsonData, constants.EXPRESSION_FILTER_VERSION_NUMBER);
//             var versionNumber = commitMessage.replace(/[^0-9\.]/g, "");
//             console.log(jsonData);
//             console.log(commitMessage);
//             console.log(versionNumber);
//             // const response  = {
//             //     statusCode: 200,
//             //     body: JSON.stringify(versionNumber),
//             // };
//             // return response;
//             return versionNumber;
//         });
// ////////////////////// PUTTING INTO DYNAMO DB
//             dynamoDb.put(
//                 {
//                     "TableName": VERSION_HISTORY_TABLE,
//                     "Item": {
//                         "uuid": uuid.v1(),
//                         "date": today,
//                         "patchVersion": result,
//                     }
//                 }, function(result) {
//                     result.on('data', function(chunk) {
//                         console.log("" + chunk);
//                     });
//                 });
//     if ( ! result) {
//         throw new Error("Item not found.");
//     }
//     return result;
// });

// below is the error happen once which needs to be handled
// possible Error handling:
// {
//     "statusCode": 500,
//     "headers": {
//     "Access-Control-Allow-Origin": "*",
//         "Access-Control-Allow-Credentials": true
// },
//     "body": "{\"error\":\"request to https://api.github.com/repos/CommunityDragon/Data/commits?path=/patches.json failed, reason: connect ECONNREFUSED 13.250.168.23:443\"}"
// }
// reason: connect ETIMEDOUT 192.30.255.117:443\

