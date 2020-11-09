var axios = require('axios');
var cheerio = require("cheerio");
// var championNameList = [];
var compInfoList = [];
// var currentPatchVersion = "";


export var webscraper = async (event, context) => {

    await axios.get("https://lolchess.gg/meta").then(linkWithCompInfo => {
    var $ = cheerio.load(linkWithCompInfo.data);
    var currentPatchVersion = $(".guide-meta__group__header").text().replace('v','').replace(/\n/g,'').trim();
    compInfoList.push(currentPatchVersion);
    var eachCompData = $(".guide-meta__deck-box");

  // loop through each comp
      for (var i = 0; i < eachCompData.length; i++) {
          var currentCompData = eachCompData.eq(i);
          // to find the current comp name
          var currentCompName = currentCompData.find("div .guide-meta__deck__column.name.mr-3").text()
          .replace(/\n /g,'').replace(/NEW/g,'').replace(/UPDATED/g,'').replace(/\n /g,'').replace(/ /g,'').replace(/([A-Z])/g, ' $1').trim();

          // to find the current comp champion in a list
          var currentCompChampionData = currentCompData.find(".tft-champion");
          var currentCompChampionNameList = [];
          for (var j = 0; j < 9; j++) {
              var currentChampionName = currentCompChampionData.find("img").eq(j).attr("alt");
              if (currentChampionName !== undefined){
                  currentCompChampionNameList.push(currentChampionName);
              }
          }

          // to find the current comp item in a list
          var currentCompItemData = currentCompData.find(".tft-items");
          var currentCompItemList = [];
          for (var k = 0; k < 9; k++) {
              var currentItemName = currentCompItemData.find("img").eq(k).attr("alt");
              if (currentItemName !== undefined){
                //   console.log(currentItemName);
                  currentCompItemList.push(currentItemName);
              }
          }

          // combine all current comp info in a dict
          var eachComp = {
              ID: String(i),
              CompName: currentCompName,
              ChampionList: currentCompChampionNameList,
              ItemList: currentCompItemList
          };
          // adds current comp info to comp info list
          compInfoList.push(eachComp);
      }
    });
    // console.log(currentPatchVersion);
    // setTimeout(() => { filewrite(); } ,3000);
    // await new Promise((resolve, reject) => setTimeout(resolve, 3000));
    // console.log(compInfoList);
    return compInfoList;
};

