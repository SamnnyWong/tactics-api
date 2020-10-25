import handler from "../libs/handler-lib";
import fetch from "node-fetch";
// import * as uuid from "uuid";
// import dynamoDb from "./libs/dynamodb-lib";
var jmespath = require('jmespath');
// var jsonDiff = require('json-diff');
export const main = handler(async (event, context) => {
    // Load the full build.
    // var _ = require('lodash');

    console.log("!!!!!!!!!!!!!!!!!!!!!! function started.");
    var dataLink = "http://raw.communitydragon.org/10.14/cdragon/tft/en_us.json";
    const latestUpdate = await fetch(dataLink)
        .then(res => res.json())
        .then((jsonData) => {
            return jsonData;
        });
    const newChampions = jmespath.search(latestUpdate, `sets."3".champions[]`);

    var db = "https://1ctjksg2k2.execute-api.us-east-1.amazonaws.com/Test";
    const currentStats = await fetch(db)
        .then(res => res.json())
        .then((jsonData) => {
            return jsonData;
        });
    // load the whole damn thing from db
    // load the fking file from repo
    // loop through every object from the new patch file
    // for every fking object in the file find it in the fking db result
    // compare
    // if not diff, skip
    // if diff, fking go through every fking property and record the fking diff
    // generate the fking diff patch node then send it the fking db
    // fking done
    // console.log(res.length)
    var newChampionNumber = newChampions.length;
    var dbLength = currentStats.Items.length;
    console.log(`The new path data with total ${newChampionNumber} champions.`);
    console.log(`The DB data with total ${dbLength} champions.`);

    // var i;
    // for (i = 0; i < latestUpdate.length; i++) {
    //     var name = res1[i].name;
    //     jmespath.search(currentStats, 'Items[?Name == `Ahri`]');
    //     if (_.isEqual(res1[i], res2[i])){
    //
    //     }
    //     else {
    //
    //     }
    // };
    console.log("==========================================");
    // console.log(res1[0].name);
    // var Class = [‘Astro’, ‘Battlecast’, ’Celestial’, ‘Chrono’, ‘Cybernetic’, ‘Dark Star’, ‘Mech-Pilot’, ‘Rebel’, ‘Space Pirate’, ’Star Guardian’]
    //
    // var Origin = ['Blademaster', ‘Blaster’, ‘Brawler’, ‘Demolitionist’, ‘Infiltrator’, ’Mana-Rever’, ’Mercenary’,'Mystic', ‘Protector’, ‘Sniper’, ’Sorcerer’, ’Starship’, ’Vanguard’, ‘Paragon’]
    console.log(newChampions);
    // console.log(newChampions[1].traits);
    // console.log(newChampions[2].traits);
    // console.log(newChampions[3].traits);
    console.log("==========================================");
    console.log(currentStats.Items[0]);
    // console.log(jmespath.search(currentStats.Items, 'Items[?Name == `Ahri`]'));
    console.log("⇒");

    console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@");
    // var name = 'Ahri'
    console.log(jmespath.search(newChampions, '[?name == `Jhin`].ability.variables[]'));
    console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@");
    console.log(jmespath.search(currentStats, 'Items[?Name == `Jhin`].Ability.variables[]'));
    // console.log(currentStats.Items[0].Traits);
    // console.log(jmespath.search(currentStats, 'Items[?Traits == `[Star Guardian]`]'));
    // console.log(jmespath.search(currentStats, `Items[].Traits[?contain(@, 'Star Guardian') == 'true']`));
    // console.log(currentStats.Items.filter(Item => Item.Traits.includes("Star Guardian")));
    // console.log(res1[0].Name);
    // console.log(currentStats);
    // myarray[?contains(@, 'foo') == `true`]
    console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@");

    return 1;
});

// read local json file function
// var readJson = (path, cb) => {
//     fs.readFile(require.resolve(path), (err, data) => {
//         if (err)
//             cb(err)
//         else
//             cb(null, JSON.parse(data))
//     })
// }
