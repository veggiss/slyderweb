const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

global.appRoot = path.resolve(__dirname);
const db = require(appRoot + '/bin/queries');
const ut = require(appRoot + '/bin/util');

const app = express();

app.set('port', (process.env.PORT || 8080));
app.use(express.static('public'));
app.use(bodyParser.json());
app.enable('trust proxy');

// Get
app.get('/user', db.getUser, ut.logEvent);

// Post
app.post('/user', db.newUser, ut.logEvent);
app.post('/user/login', db.loginUser, ut.logEvent, db.setLastlogin, ut.logEvent);


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