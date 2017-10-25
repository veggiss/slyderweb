const {Client} = require('pg');

function newClient() {
    let client = new Client({
        //process.env.DATABASE_URL <- Allways upload to git and heroku with this
        //connectionString:process.env.DATABASE_URL,
		connectionString:"postgres://qmmmxfpbnkmfuu:61353f3ff055d0833425f0eb668e4eeae4455cbc102ce1703bdf7a0371a466ee@ec2-46-51-187-253.eu-west-1.compute.amazonaws.com:5432/dau7n64ghf76jc",
        ssl:true
    });

    return client;
}

function noSymbols(...str) {
    let state = true;

    str.forEach(item => {
        if(!/^[a-zA-Z0-9]+$/.test(item)) {
            state = false;
        }
    });

    return state;
}

function isNotEmpty(...str) {
    let state = true;

    str.forEach(item => {
        if(!item.replace(/\s/g, "").length > 0) {
            state = false;
        }
    });

    return state;
}

function print(...lines) {
    let d = new Date();
    let date = `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;
    let time = `${t(d.getHours())}:${t(d.getMinutes())}:${t(d.getSeconds())}`;

    function t(i) {
        return (i < 10) ? "0" + i : i;
    }

    lines.forEach(item => {
        console.log(`\n${date} ${time}: ${item}`);
    });
}

module.exports = {
    noSymbols : noSymbols,
    isNotEmpty : isNotEmpty,
    print : print,
    newClient : newClient
}