const {Client} = require('pg');
//connectionString = process.env.DATABASE_URL <- Allways upload to git and heroku with this
const connectionString = process.env.DATABASE_URL;
const heroku = connectionString == process.env.DATABASE_URL;

function newClient() {
    let client = new Client({
        connectionString: connectionString,
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
        if (item == null || item == undefined) {
            state = false;
        } else if(!item.replace(/\s/g, "").length > 0) {
            state = false;
        }
    });

    return state;
}

function logEvent(req, res, next) {
    if (!heroku) {
        print(`New '${req.method}' request from '${req.ip}', Path: '${req.path}', Status: '${res.statusCode}', Message: '${res.statusMessage}'`);
    }

    if (res.err) {
        print(`${req.ip}: Query error (Code: ${res.err.code}, Message: ${res.err.message})`);
    }

    if (res.next) {
        next();
    }
}

function print(...lines) {
    let d = new Date();
    let date = `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;
    let time = `${t(d.getHours())}:${t(d.getMinutes())}:${t(d.getSeconds())}`;

    function t(i) {
        return (i < 10) ? "0" + i : i;
    }

    lines.forEach(item => {
        if (!heroku) {
            console.log(`\n${date} ${time}: ${item}`);
        } else {
            console.log(item);
        }
    });
}

module.exports = {
    noSymbols : noSymbols,
    isNotEmpty : isNotEmpty,
    print : print,
    newClient : newClient,
    logEvent : logEvent
}