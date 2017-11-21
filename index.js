const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const session = require('express-session');
const pgSession = require('connect-pg-simple')(session);

global.appRoot = path.resolve(__dirname);
global.ut = require(appRoot + '/bin/util');
const db = require(appRoot + '/bin/queries');
const app = express();
const pgPool = ut.newPool();

app.enable('trust proxy');
app.set('port', (process.env.PORT || 8080));
app.use(express.static('public'));

app.use(bodyParser.json());
app.use(session({
    store: new pgSession({
        pool : pgPool,
        tableName: 'sessions'
    }),
    secret: 'uia2017mm200slyderweb',
    resave: false,
    saveUninitialized: false,
    cookie: {maxAge: 60 * 60 * 1000, secure: false} //Secure should only be true with https connections
}));

// Get
app.get('/user', db.getUser, ut.logEvent);

// Post
app.post('/user', db.newUser, ut.logEvent);
app.post('/user/login', db.loginUser, ut.logEvent, db.setLastlogin, ut.logEvent);
app.post('/user/presentation', ut.userAuth, db.updatePresentation, ut.logEvent, db.newPresentation, ut.logEvent);

app.listen(app.get('port'), function() {
    ut.print('-----------------------------');
    ut.print('       Server started');
    ut.print(`    http://localhost:${app.get('port')}`);
    ut.print('-----------------------------');
});


// Unnecessary ?
/*function formatTime(seconds) {
    seconds = Number(seconds);
    let hours = Math.floor(seconds / 3600);
    let minutes = Math.floor(seconds % 3600 / 60);
    seconds = Math.floor(seconds % 3600 % 60);

    function t(i) {
        return (i < 10) ? "0" + i : i;
    }

    return (`${t(hours)}:${t(minutes)}:${t(seconds)}`); 
}

function serverUpkeep() {
	let uptime = process.uptime();
	process.stdout.write('\rServer uptime: ' + formatTime(uptime));
}

setInterval(serverUpkeep, 1000);*/