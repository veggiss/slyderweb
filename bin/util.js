const pg = require('pg');
const {Client} = pg;
const {Pool} = pg;
//connectionString = process.env.DATABASE_URL <- Allways upload to git and heroku with this
const connectionString = 'postgres://qmmmxfpbnkmfuu:61353f3ff055d0833425f0eb668e4eeae4455cbc102ce1703bdf7a0371a466ee@ec2-46-51-187-253.eu-west-1.compute.amazonaws.com:5432/dau7n64ghf76jc';
const connectionPort = process.env.PORT || 8080;
const heroku = connectionString == process.env.DATABASE_URL;

function newClient() {
    let client = new Client({
        connectionString: connectionString,
        ssl: true,
    });

    return client;
}

function newPool() {
    let pool = new Pool({
        connectionString: connectionString,
        ssl: true,
        max: 3,
        min: 0,
        idleTimeoutMillis: 30 * 1000,
        connectionTimeoutMillis: 2 * 1000
    });

    return pool;
}

function corsSettings(req, res, next) {
    res.header('Access-Control-Allow-Origin', `http://localhost:${connectionPort}`);
    res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE');
    res.header('Access-Control-Allow-Headers', 'content-type');
    res.header('Access-Control-Allow-Credentials', true);
    next();
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

function userAuth(req, res, next) {
    if (req.session.username) {
        res.authenticated = true;
        next();
    } else {
        res.authenticated = false;
        res.statusMessage = 'User not logged in';
        res.status(401).end();
    }
}

module.exports = {
    noSymbols : noSymbols,
    isNotEmpty : isNotEmpty,
    print : print,
    newClient : newClient,
    newPool : newPool,
    logEvent : logEvent,
    userAuth : userAuth,
    connectionPort : connectionPort,
    corsSettings : corsSettings
}