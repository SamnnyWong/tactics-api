import handler from "./libs/handler-lib";

export const main = handler(async (event, context) => {
    const timeString = '2020-10-30T21:34:54.653Z';
    var newDate = new Date(timeString).toLocaleString("en-US", {timeZone: "Asia/Shanghai"});
    console.log(newDate);
    return newDate
});