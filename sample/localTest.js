import handler from "../libs/handler-lib";
// import constants from "../assets/constants";
console.log('Loading hello world function');

export const main = handler(async (event, context) => {
    var currentTime = new Date();
    currentTime.setTime(currentTime.getTime());
    console.log(currentTime.toISOString());
    console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@");

    var dateObject = new Date();
    let isoDate = dateObject.toISOString();
    let currentTime2 = dateObject.toDateString();
    console.log(currentTime2);
    console.log(isoDate);
    console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@");


    let date1 = '2020-10-28T09:38:33.467Z';
    let date2 = '2020-10-27T09:38:33.467Z';
    console.log(date1 > date2);

    console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@");

    // let sup = [
    //     {
    //         patchVersion: '10.21',
    //         uuid: 'c4211c80-1422-11eb-8a9b-3b4a95d31ad8',
    //         createdAt: '2020-10-22T09:38:33.467Z',
    //         lastCheck: ''
    //     },
    //     {
    //         patchVersion: '10.21',
    //         uuid: '179131e0-16e7-11eb-9726-8987cce7d561',
    //         createdAt: '2020-10-25T09:38:33.467Z',
    //         lastCheck: ''
    //     },
    //     {
    //         patchVersion: '10.22',
    //         uuid: '9b91f020-19c0-11eb-ad43-d5bafe648571',
    //         createdAt: '2020-10-29T09:38:33.467Z',
    //         lastCheck: ''
    //     },
    //     {
    //         patchVersion: '10.22',
    //         uuid: '71180380-18f7-11eb-8c8c-0f2601913d2c',
    //         createdAt: '2020-10-28T09:38:33.467Z',
    //         lastCheck: ''
    //     },
    //     {
    //         patchVersion: '10.21',
    //         uuid: '46973910-182e-11eb-b765-2ba9eba7627b',
    //         createdAt: '2020-10-27T09:38:33.467Z',
    //         lastCheck: ''
    //     }
    // ];
    //
    // console.log(sup);


    // console.log(uuid.v1());
    const a = undefined;
    console.log(a);
    console.log(!a);
});
