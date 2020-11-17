// var axios = require('axios');
// var cheerio = require("cheerio");
// export default async function patchChangePcgamesnCrawler (event, context) {
//     var result = {};
//     var updateList = [];
//     const patchVersion = "1022";
//     // const url = `https://www.pcgamesn.com/teamfight-tactics/tft-patch-1022${latestVersionNumber}`;
//     let pcgamesn_PATCH_CHANGE_URL = 'https://www.pcgamesn.com/teamfight-tactics/tft-patch-1022';
//     var linkWithPatchInfo = await axios.get(pcgamesn_PATCH_CHANGE_URL);
//     // console.log(linkWithPatchInfo);
//     var $ = cheerio.load(linkWithPatchInfo.data);
//     var mainContent = $(".entry-content");
//     var Counter = 1;
//     var pContent = mainContent.find("p").find("strong");
//     while (Counter < pContent.length + 1) {
//
//         var ulContent = mainContent.find(`ul:nth-of-type(${Counter})`).eq(0);
//         // combine all current comp info in a dict
//         var eachChange = {
//             ID: String(Counter),
//             ChampName: (pContent.eq(Counter - 1).text().split(' – ')[0] || "changed"),
//             Change: ulContent.text().split('\n'),
//             type: pContent.eq(Counter - 1).text().split(' – ')[1],
//         };
//         updateList.push(eachChange);
//         Counter ++;
//     }
//     // console.log(updateList);
//     result.patchVersion = patchVersion;
//     result.updateList = updateList;
//     return result;
// };


var axios = require('axios');
var cheerio = require("cheerio");
// export default async function patchChangePcgamesnCrawler (event, context) {
export var patchCrawler = async (patchVersion) => {
    let reqPatchVersion = patchVersion.replace(".","");
    // console.log(reqPatchVersion);
    var result = {};
    var updateList = [];
    // const sourceURL = `https://www.pcgamesn.com/teamfight-tactics/tft-patch-1021`;
    var sourceURL = `https://www.pcgamesn.com/teamfight-tactics/tft-patch-${reqPatchVersion}`;
    // console.log(sourceURL);
    var linkWithPatchInfo = await axios.get(sourceURL);
    // console.log(linkWithPatchInfo);
    var $ = cheerio.load(linkWithPatchInfo.data);
    var mainContent = $(".entry-content");
    var category = "Champion";
    var Counter = 1;
    var pContent = mainContent.find("p").find("strong");
    var ChampOrderError = 0;
    var bodyOrederError = 0;
    if (pContent.eq(0).text().split(' – ')[0] === "Update") ChampOrderError = 1;

    //Adjusting order for the champion change content
    var nofiltered = mainContent.find('h2, ul, .twitter-tweet');
    var bodyList = [];

    for (var i=0; i<nofiltered.length; i++){
        var currentBody = nofiltered.eq(i).text().split('\n').filter(x => x);
        bodyList.push(currentBody);
    }

    var filterItem = mainContent.find('ul').find('ul');
    for (var j=0; j<filterItem.length; j++){
        var currentFilter = filterItem.eq(j).text().split('\n').filter(x => x);
        bodyList = bodyList.filter(
            function(e) {
              return this.indexOf(e[0]) < 0;
            },
            currentFilter
        );
    }
    //separating champion traits item
    // var h3 = mainContent.find("h2");
    // console.log(h3.text());
    while(Counter < pContent.length + 1 - ChampOrderError){

        // var ulContent = mainContent.find(`ul:nth-of-type(${Counter}), .twitter-tweet`).eq(0);
        // var ulContent = mainContent.find('ul, div .twitter-tweet').eq(Counter+1);
        var ChampNameContent = (pContent.eq(Counter - 1 + ChampOrderError).text().split(' – ')[0]);
        var typeContent = pContent.eq(Counter - 1 + ChampOrderError).text().split(' – ')[1];
        // console.log(bodyList[Counter-1]);
        if (bodyList[Counter - 1 + bodyOrederError][0].toUpperCase().includes("CHAMPION BALANCE")){
            console.log("CHAMPION BALANCE");
            bodyOrederError += 1;
            category = "Champion";
        } else if (bodyList[Counter - 1 + bodyOrederError][0].toUpperCase().includes("TRAIT BALANCE")){
            console.log("TRAIT BALANCE");
            bodyOrederError += 1;
            category = "Trait";
        } else if (bodyList[Counter - 1 + bodyOrederError][0].toUpperCase().includes("ITEM BALANCE")){
            console.log("ITEM BALANCE");
            bodyOrederError += 1;
            category = "Item";
        };
        // combine all current comp info in a dict
        var eachChange = {
            ID: String(Counter),
            ChampName: ChampNameContent,
            // Change: ulContent.text().split('\n'),
            Change: bodyList[Counter - 1 + bodyOrederError],
            Type: typeContent,
            Category: category
        };
        updateList.push(eachChange);
        Counter ++;
    }
    result.patchVersion = patchVersion;
    result.updateList = updateList;
    result.sourceURL = sourceURL;
    return result;
};

