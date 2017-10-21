const {Client} = require('pg');
const sqlstr = require('sqlstring');

function newClient() {
    let client = new Client({
        connectionString:process.env.DATABASE_URL,
        ssl:true
    });

    return client;
}

function getUser(req, res) {
    let username = req.query.username;

    if (noSymbols(username) && isNotEmpty(username)) {
        print(`Getting info from user '${username}'`);

        let client = newClient();
        let sql = sqlstr.format('SELECT * FROM users WHERE username = ?', [username]);

        client.connect();

        client.query(sql, (err, query) => {
            if (!err) {
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
                    res.status(404).end();
                }
            } else {
                res.statusMessage = 'There was a problem getting user';
                res.status(500).end();
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
        print(`User '${username}' is trying to log in`);

        let client = newClient();
        let sql = sqlstr.format('SELECT * FROM users WHERE username = ?', [username]);

        client.connect();

        client.query(sql, (err, query) => {
            if (!err) {
                if (query.rows.length > 0) {
                    if(query.rows[0].password === password) {
                        res.send(JSON.stringify('Success!'));
                    } else {
                        res.statusMessage = 'Wrong password';
                        res.status(401).end();
                    }
                } else {
                    res.statusMessage = 'Could not find user';
                    res.status(404).end();
                }
            } else {
                res.statusMessage = 'There was a problem logging in';
                res.status(500).end();
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
        print(`Setting lastlogin on user '${username}'`);

        let client = newClient();
        let sql = sqlstr.format('UPDATE users SET lastlogin = ? WHERE username = ?', [Date.now(), username]);

        client.connect();

        client.query(sql, (err, query) => { // <- Not working - never gets called
            if (!err) {
                res.statusMessage = 'Timestamp set';
                res.status(201).end();
            } else {
                res.statusMessage = 'There was a problem setting lastlogin';
                res.status(500).end();
            }
            client.end();
        });
    } else {
        res.statusMessage = 'Username contains no or illigal characters';
        res.status(403).end();
    }
}

function newUser(req, res) {
    let username = req.body.username;
    let password = req.body.password;
    let firstname = req.body.firstname;
    let lastname = req.body.lastname;
    let mail = req.body.mail;

    if (noSymbols(username, firstname, lastname) && isNotEmpty(username, password, firstname, lastname, mail)) {
        print(`Creating new user: '${username}'`);

        let client = newClient();
        let sql = sqlstr.format('INSERT INTO users(username, password, firstname, lastname, mail) VALUES(?, ?, ?, ?, ?)', [username, password, firstname, lastname, mail]);
        
        client.connect();

        client.query(sql, (err, query) => {
            if (!err) {
                res.statusMessage = 'New user created';
                res.status(201).end();
            } else {
                res.statusMessage = 'There was a problem creating new user';
                res.status(500).end();
            }
            client.end();
        });
    } else {
        res.statusMessage = 'Something contains no or illigal characters';
        res.status(403).end();
    }

    res.send(JSON.stringify('Success!'));
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
	getUser : getUser,
    loginUser : loginUser,
    setLastlogin : setLastlogin,
    newUser : newUser
}