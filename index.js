const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const session = require('express-session');
const pgSession = require('connect-pg-simple')(session);
const appRoot = path.resolve(__dirname);

global.ut = require(appRoot + '/bin/util');
const db = require(appRoot + '/bin/queries');
const app = express();
const pgPool = ut.newPool();

app.enable('trust proxy');
app.set('port', (ut.connectionPort));
app.use(express.static('public'));
app.use(bodyParser.json());
app.use(ut.corsSettings);
app.use(session({
    store: new pgSession({
        pool : pgPool,
        tableName: 'sessions'
    }),
    secret: 'uia2017mm200slyderweb',
    resave: false,
    saveUninitialized: false,
    //Secure should only be true with https connections (e.g heroku)
    cookie: {maxAge: 60 * 60 * 1000, secure: false}
}));

// Get
app.get('/user', db.getUser, ut.logEvent);
app.get('/user/preslist', ut.userAuth, db.getPresList, ut.logEvent);
app.get('/user/presentation', ut.userAuth, db.getPresenation, ut.logEvent);

// Page navigation
app.get('/editor', (req, res) => {
    if (req.session.username) {
        res.sendFile(appRoot + '/view/editor.html');
    } else {
        res.redirect('/');
    }
});
app.get('/', (req, res) => {
    res.sendFile(appRoot + '/view/index.html');
});

// Post
app.post('/user', db.newUser, ut.logEvent);
app.post('/user/login', db.loginUser, ut.logEvent, db.setLastlogin, ut.logEvent);
app.post('/user/presentation', ut.userAuth, db.updatePresentation, ut.logEvent, db.newPresentation, ut.logEvent);

app.listen(app.get('port'), function() {
    ut.print('-----------------------------');
    ut.print('       Server started');
    ut.print(`    http://localhost:${ut.connectionPort}`);
    ut.print('-----------------------------');
});