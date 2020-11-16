const [result1, result2] = await Promise.all([task1(), task2()]);
////////////////////////////////////////////////////////////
const t1 = task1();
const t2 = task2();

const result1 = await t1;
const result2 = await t2;

////////////////////////////////////////////////////////////
const [t1, t2] = [task1(), task2()];
const [result1, result2] = [await t1, await t2];



//using Promise.all is worth it when it's only faster in the negative scenario (when some task fails)




await Promise.all([
    (async() => {
        let getToken = await fetch(url_for_getToken);
        let getTokenData = await getToken.json();

        let writeToDB = await fetch(url_for_writeToDB);
        let writeToDBData = await writeToDB.json();
    })(),
    (async() => {
        let frontEnd = await fetch(url_for_frontEnd);
        let frontEndData = await frontEnd.json();
    })()
]);



fetch(url_for_getToken)
    .then(getToken => getToken.json())
    .then(async getTokenData => {
        let writeToDB = await fetch(url_for_writeToDB);
        let writeToDBData = await writeToDB.json();
        // Carry on
    })

fetch(url_for_frontEnd)
    .then(frontEnd => frontEnd.json())
    .then(frontEndData => {
        // Carry on
    })





for(something){
    asyncCallA()
        .then((A) => {
            for(something){
                asyncCallB(A)
                    .then((B) => {
                        for(something){
                            asyncCallC(B)
                                .then((C) => {
                                    for(something){
                                        asyncCallD(C)
                                    }
                                })
                        }

                    })
            }
        })

}



asyncCallB(A)
    .then((B) => {
        asyncCallC(B)
            .then((C) => {
                asyncCallD(C)
            })
    })


asyncCallB(A).then(B => {
    return asyncCallC(B);
}).then(C => {
    return asyncCallD(C);
});

//////////////////////////////////////////////////////////
try {
    await this.basicAuthLogin(/*...*/);
} catch (e) {
    // Handle the fact something failed
}
//or
this.basicAuthLogin(/*...*/)
    .catch(e => { /* Handle the fact something failed */ });
