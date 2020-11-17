// export const paymentMethods = {
//     STRIPE: {
//         key: 'STRIPE',
//         value: 1,
//         title: 'Stripe Payment',
//     },
//     PAYPAL: {
//         key: 'PAYPAL',
//         value: 2,
//         title: 'Paypal Payment',
//     },
//     AMAZON_PAYMENT: {
//         key: 'AMAZON_PAYMENT',
//         value: 3,
//         title: 'Amazon Payment',
//     }
// };
//
// const shippingMethods = {
//     SKYNET: 'SKYNET',
//     GDEX: 'GDEX',
//     DHL: 'DHL',
//     UPS: 'UPS',
// };
//
export default {
    getsss: "Supp!",
    GITHUB_NA_VERSION_NUMBER_URL: "https://api.github.com/repos/CommunityDragon/Data/commits?path=/patches.json",
    EXPRESSION_FILTER_VERSION_NUMBER: `[0].commit.message`,
    // CHAMPION_STATS_JSON_FILE_URL: `http://raw.communitydragon.org/${versionNumber}/cdragon/tft/en_us.json`,
    getURL: (versionNumber) => `http://raw.communitydragon.org/${versionNumber}/cdragon/tft/en_us.json`,
};

//
// //const = function patchFileLink(versionNumber)
// // directly use it by somehow pass the version number to it?
// function patchFileLink(versionNumber) {
//     return `http://raw.communitydragon.org/${versionNumber}/cdragon/tft/en_us.json`;
// }
// const patchFileLink = "http://raw.communitydragon.org/10.14/cdragon/tft/en_us.json";
