const {Client} = require('pg');
const util = require('./util');

function newClient() {
    let client = new Client({
        connectionString:process.env.DATABASE_URL,
        ssl:true
    });

    return client;
}


// Returns user info
function getUser(req, res) {
    let username = req.query.username;

    // Check query not containing no or illigal characters
    if (util.noSymbols(username) && util.isNotEmpty(username)) {
        util.print(`Getting info from user '${username}'`);

        // Prepare query strings and connection
        let client = newClient();
        let sql = 'SELECT * FROM users WHERE username = $1';
        let params = [username];

        client.connect();

        client.query(sql, params, (err, query) => {
            if (!err) {
                // If no error, and query returns a row, prepare a response
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
                    // If query did not return a row
                    res.statusMessage = 'Could not find user';
                    res.status(404).end();
                }
            } else {
                // If query returns an error
                res.statusMessage = 'There was a problem getting user';
                res.status(500).end();
            }

            // End connection for client
            client.end();
        });
    } else {
        // Either username was empty or contained illigal symbols
        res.statusMessage = 'Username contains no or illigal characters';
        res.status(403).end();
    }
}

function loginUser(req, res) {
    let username = req.body.username;
    let password = req.body.password;

    if (util.noSymbols(username) && util.isNotEmpty(username)) {
        util.print(`User '${username}' is trying to log in`);

        let client = newClient();
        let sql = 'SELECT * FROM users WHERE username = $1';
        let params = [username];

        client.connect();

        client.query(sql, params, (err, query) => {
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

    if (util.noSymbols(username) && util.isNotEmpty(username)) {
        util.print(`Setting lastlogin on user '${username}'`);

        let client = newClient();
        let sql = 'UPDATE users SET lastlogin = $1 WHERE username = $2';
        let params = [Date.now(), username];

        client.connect();

        client.query(sql, params, (err, query) => { // <- Not working - never gets called
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


    if (util.noSymbols(username, firstname, lastname) && util.isNotEmpty(username, password, firstname, lastname, mail)) {
        util.print(`Creating new user: '${username}'`);

        let client = newClient();
        let sql = 'INSERT INTO users(username, password, firstname, lastname, mail) VALUES($1, $2, $3, $4, $5)';
        let params = [username, password, firstname, lastname, mail];
        util.print(sql);

        client.connect();

        client.query(sql, params, (err, query) => {
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

module.exports = {
	getUser : getUser,
    loginUser : loginUser,
    setLastlogin : setLastlogin,
    newUser : newUser
}