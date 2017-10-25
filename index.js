const express = require('express');
const bodyParser = require('body-parser');
const db = require('./queries');
const app = express();

app.set('port', (process.env.PORT || 8080));
app.use(express.static('public'));
app.use(bodyParser.json());

// Get
app.get('/user', db.getUser);

// Put
app.put('/user/lastlogin', db.setLastlogin);

// Post
app.post('/user', db.newUser); // <- Should this be a get request?
app.post('/user/login', db.loginUser);


app.listen(app.get('port'), function() {
    console.log('Server started on port: ', app.get('port'));
});



function formatTime(seconds) {
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

setInterval(serverUpkeep, 1000);