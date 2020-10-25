///////////////////////////////////////////////////////////////////
// var name = "Annie";
// var result2 = jmespath.search(JSONdata, 'Items[?Name == `' + JSON.stringify(name).replace('`','\\`') + '`]');
// var names = jmespath.search(result, `sets."` + JSON.stringify(latestSetNumber) + `".champions[]`);
// console.log(latestSetNumber);
// function jmespath_escape(item) {
//     return '`' + JSON.stringify(name).replace('`','\\`') + '`';
// };

// var name = "Annie";
// var result = jmespath.search(JSONdata, 'Items[?Name == ' + jmespath_escape(name) + ']');
///////////////////////////////////////////////////////////////////


// var allChampions = jmespath.search(result, `sets."`+ latestSetNumber +`".champions[]`);
// var allChampions = jmespath.search(result, `sets."`+ latestSetNumber +`".champions[].name`);
// console.log(`###Tactics Log###: putting into db success.`);




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
