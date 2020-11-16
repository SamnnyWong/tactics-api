import handler from "../libs/handler-lib";
import fetch from "node-fetch";
// import * as uuid from "uuid";
// import dynamoDb from "./libs/dynamodb-lib";
var jmespath = require('jmespath');
export const main = handler(async (event, context) => {
    console.log("!!!!!!!!!!!!!!!!!!!!!! function started.");
    // var readJson = (path, cb) => {
    //     fs.readFile(require.resolve(path), (err, data) => {
    //         if (err)
    //             cb(err)
    //         else
    //             cb(null, JSON.parse(data))
    //     })
    // }

    var dataLink1 = "http://raw.communitydragon.org/10.14/cdragon/tft/en_us.json";
    // var dataLink2 = "http://raw.communitydragon.org/10.14/cdragon/tft/en_us.json";

    // var jsonData = require(dataLink2);

    await fetch(dataLink1)
        .then(res => res.json())
        .then((jsonData) => {
            // console.log('Checkout this JSON! ', out)
            // console.log(jmespath.search(jsonData, `sets."3".champions[0].apiName`));
            var names = jmespath.search(jsonData, `sets."3".champions[]`);
            console.log(names.name);

            // function myFunction(item) {
            //     dynamoDb.put(
            //         {
            //             TableName: "Demo",
            //             Item: {
            //                 "DemoId": uuid.v1(),
            //                 "Name": item.name,
            //                 "Traits": item.traits,
            //                 "Icon": item.icon,
            //                 "Cost": item.cost,
            //                 "Ability": item.ability,
            //                 "Stats": item.stats,
            //             }
            //         }, function(result) {
            //             result.on('data', function(chunk) {
            //                 console.log("" + chunk);
            //             });
            //         });
            // };
            //
            // names.forEach(myFunction);

            throw 'Something went wrong'; //?
        });
    return 1;
});

// restriction on adding new fields
// ability to modify or remove chammps
// ???
