import handler from "../libs/handler-lib";
// import fetch from "node-fetch";
// import * as uuid from "uuid";
// import dynamoDb from "./libs/dynamodb-lib";
// var jmespath = require('jmespath');
export const main = handler(async (event, context) => {

    var dataLink1 = "http://raw.communitydragon.org/10.15/cdragon/tft/en_us.json";
    await fetch(dataLink1)
        .then(res => res.json())
        .then((jsonData) => {
            // console.log('Checkout this JSON! ', out)
            // console.log(jmespath.search(jsonData, `sets."3".champions[0].apiName`));
            var newChampions = jmespath.search(jsonData, `sets."3".champions[]`);
            // console.log(names[0].name);
            function myFunction(item) {
                var i;
                for (i=0; i < newChampions.length; i++) {
                    if (newChampions[i].traits > 2) {

                    }
                    else {

                    }
                };

                dynamoDb.put(
                    {
                        "TableName": "Demo",
                        "Item": {
                            "DemoId": uuid.v1(),
                            "Name": item.name,
                            "Icon": item.icon,
                            "Cost": item.cost,
                            "Ability": item.ability,
                            "Stats": item.stats,
                            "Class": item.traits[0],
                            "Origin": item.traits[1],
                        }
                    }, function(result) {
                        result.on('data', function(chunk) {
                            console.log("" + chunk);
                        });
                    });

                dynamoDb.put(
                    {
                        "TableName": "Demo",
                        "Item": {
                            "Class": item.traits[0],
                            "Origin": item.traits[1],
                        }
                    }, function(result) {
                        result.on('data', function(chunk) {
                            console.log("" + chunk);
                        });
                    });



            };

            newChampions.forEach(myFunction);
            throw 'Something went wrong'; //?
        });


    // below is for updating single new champion
    // var AWS = require("aws-sdk");
    // var docClient = new AWS.DynamoDB.DocumentClient();
    //
    // var params = {
    //     TableName:"Demo",
    //     Key:{
    //         "DemoId": "c3c9fd00-cfe0-11ea-97f7-f940d3590e56",
    //     },
    //     UpdateExpression: "set Cost = :x, Stats.armor = :y",
    //     ExpressionAttributeValues:{
    //         ":x": 5,
    //         ":y": 100000000
    //     },
    //     ReturnValues:"UPDATED_NEW"
    // };
    //
    // console.log("Updating the item...");
    // docClient.update(params, function(err, data) {
    //     if (err) {
    //         console.error("Unable to update item. Error JSON:", JSON.stringify(err, null, 2));
    //     } else {
    //         console.log("UpdateItem succeeded:", JSON.stringify(data, null, 2));
    //     }
    // });

    return 1;
});

// restriction on adding new fields
// ability to modify or remove chammps
// ???


// "UpdateHistory": {
//     "PatchVersion": "xx",
//         "PatchDate": "xx",
//         "Change": "xx"
// }



//two update mechanism
// get data from cd repo
// crawl data from patch note update
