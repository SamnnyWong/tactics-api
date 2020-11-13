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
export default async function patchChangePcgamesnCrawler (event, context) {
    let reqPatchVersion = event.patchVersion.replace(".","");
    console.log(reqPatchVersion);
    var result = {};
    var updateList = [];
    // const url = `https://www.pcgamesn.com/teamfight-tactics/tft-patch-1022${latestVersionNumber}`;
    var sourceURL = `https://www.pcgamesn.com/teamfight-tactics/tft-patch-${reqPatchVersion}`;
    var linkWithPatchInfo = await axios.get(sourceURL);
    // console.log(linkWithPatchInfo);
    var $ = cheerio.load(linkWithPatchInfo.data);
    var mainContent = $(".entry-content");
    var Counter = 1;
    var pContent = mainContent.find("p").find("strong");
    while(Counter < pContent.length + 1){

        var ulContent = mainContent.find(`ul:nth-of-type(${Counter})`).eq(0);
        // combine all current comp info in a dict
        var eachChange = {
            ID: String(Counter),
            ChampName: (pContent.eq(Counter-1).text().split(' – ')[0] || "changed"),
            // Change: ulContent.text().split('\n'),
            Change: ulContent.text().split('\n').filter(i => i),
            type:pContent.eq(Counter - 1).text().split(' – ')[1],
        };
        updateList.push(eachChange);
        Counter ++;
    }
    result.patchVersion = event.patchVersion;
    result.updateList = updateList;
    result.sourceURL = sourceURL;
    return result;
};

