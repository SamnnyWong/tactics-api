
var axios = require('axios');
var cheerio = require("cheerio");
// export default async function main (event, context) {
export var patchscraper = async (event, context) => {
    var result = {};
    var updateList = [];
    const patchVersion = "1023";
    // const url = `https://www.pcgamesn.com/teamfight-tactics/tft-patch-1022${latestVersionNumber}`;
    var linkWithPatchInfo = await axios.get('https://mobalytics.gg/blog/tft-patch-notes/');
    // console.log(linkWithPatchInfo);
    var $ = cheerio.load(linkWithPatchInfo.data);
    var mainContent = $(".post-body");
    var Counter = 1;
    var pContent = mainContent.find("li");


    while(Counter < pContent.length+1){

    //     var ulContent = mainContent.find(`ul:nth-of-type(${Counter})`).eq(0);
    //     // combine all current comp info in a dict
    //     var eachChange = {
    //         ID: String(Counter),
    //         ChampName: (pContent.eq(Counter).text().split(' – ')[0] || "changed"),
    //         // Change: ulContent.text().split('\n'),
    //         Change: ulContent.text().split('\n').filter(i => i),
    //         type:pContent.eq(Counter-1).text().split(' – ')[1],
    //     };
        updateList.push(pContent.eq(Counter).text());
        Counter ++;
    };
    result.patchVersion = patchVersion;
    result.updateList = updateList;
    console.log(result);
    return result;
};

