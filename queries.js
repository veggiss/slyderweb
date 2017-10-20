const {Client} = require('pg');
const sqlstr = require('sqlstring');

function newClient() {
    let client = new Client({
        connectionString:'postgres://qmmmxfpbnkmfuu:61353f3ff055d0833425f0eb668e4eeae4455cbc102ce1703bdf7a0371a466ee@ec2-46-51-187-253.eu-west-1.compute.amazonaws.com:5432/dau7n64ghf76jc',
        ssl:true
    });

    return client;
}

function getUser(req, res) {
    let username = req.query.username;

    if (noSymbols(username) && isNotEmpty(username)) {
        console.log(`\nGetting info from user '${username}'`);

        let client = newClient();
        let sql = sqlstr.format('SELECT * FROM users WHERE username = ?', [username]);

        client.connect();

        client.query(sql, (err, query) => {
            if (query.rows.length > 0) {
                let clientResponse = {
                    lastlogin: query.rows[0].lastlogin,
                    firstname: query.rows[0].firstname,
                    lastname: query.rows[0].lastname,
                    mail: query.rows[0].mail,
                    presentations: query.rows[0].presentations,
                    profileimg: query.rows[0].profileimg
                }

                res.send(clientResponse);
            } else {
                res.statusMessage = 'Could not find user';
                res.status(401).end();
            }

            if(err) {
                res.send(err);
            }

            client.end();
        });
    } else {
        res.statusMessage = 'Username contains no or illigal characters';
        res.status(403).end();
    }
}

function loginUser(req, res) {
    let username = req.query.username;
    let password = req.query.password;

    if (noSymbols(username) && isNotEmpty(username)) {
        console.log(`\nUser '${username}' is trying to log in`);

        let success = false;
        let client = newClient();
        let sql = sqlstr.format('SELECT * FROM users WHERE username = ?', [username]);
        client.connect();

        client.query(sql, (err, query) => {
            if (query.rows.length > 0) {
                if(query.rows[0].password === password) {
                    res.send(JSON.stringify('Success!'));
                    success = true;
                } else {
                    res.statusMessage = 'Wrong password';
                    res.status(401).end();
                }
            } else {
                res.statusMessage = 'Could not find user';
                res.status(401).end();
            }
            client.end();
        });
    } else {
        res.statusMessage = 'Username contains no or illigal characters';
        res.status(403).end();
    }
}

function setLastlogin(req, res) {
    let username = req.query.username;

    if (noSymbols(username) && isNotEmpty(username)) {
        console.log(`\nSetting lastlogin on user '${username}'`);

        let client = newClient();
        let sql = sqlstr.format('UPDATE users SET lastlogin = ? WHERE username = ?', [Date.now(), username]);
        client.query(sql, (err, query, er) => {
            console.log("\nError: " + err);
            console.log("\nQuesry: " + query);
            console.log("\nEr: " + er);
            console.log("oiasjdoaisdjo");
            if (!err) {
                res.statusMessage = 'Timestamp set';
                res.status(201);
            } else {
                res.statusMessage = 'There was a problem setting lastlogin.';
                res.status(500);
            }
            client.end();
        });
    }
}

function noSymbols(str) {
    return /^[a-zA-Z0-9]+$/.test(str);
}

function isNotEmpty(str) {
    return str.replace(/\s/g, "").length > 0;
}

module.exports = {
	getUser : getUser,
    loginUser : loginUser,
    setLastlogin : setLastlogin
}