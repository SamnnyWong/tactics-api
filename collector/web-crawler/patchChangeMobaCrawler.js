
var axios = require('axios');
var cheerio = require("cheerio");
// export default async function main (event, context) {

export default async function patchChangeMobaCrawler (event, context) {
// export var patchscraper = async (event, context) => {
    var result = {};
    var updateList = [];
// <<<<<<< HEAD
//     // var data = [];
// =======
//     const patchVersion = event.patchVersion;
// >>>>>>> ffcba47fdf90c3efea607269a6811ec064c0bfad
    var linkWithPatchInfo = await axios.get('https://mobalytics.gg/blog/tft-patch-notes/');
    // console.log(linkWithPatchInfo);
    var $ = cheerio.load(linkWithPatchInfo.data);
    var mainContent = $(".post-body");
    var Counter = 1;
    var pContent = mainContent.find("li");
    const mobaPatchVersion  = mainContent.find("h2").text().split("Notes ")[1].replace("!","");
    console.log(mobaPatchVersion);

    var data = mainContent.find("h3, h4");
    console.log(data.text());
    // let texts = $('h3').map((i, el) => {
    //     let text = "";
    //     el = $(el);
    //         while(true){
    //             el = el.next();
    //             if(el.length === 0 || el.prop('tagName') === 'h3') break;
    //             text += el.text() + "\n";
    //         }
    //     return text;
    // });
    // console.log(texts);

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
    result.patchVersion = mobaPatchVersion;
    result.updateList = updateList;
    // console.log(result);
    // return result;
};

