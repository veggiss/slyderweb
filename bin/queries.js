const ut = require(appRoot + '/bin/util');

// Returns user info
function getUser(req, res, next) {
    let username = req.query.username;

    // Check query not containing no or illigal characters
    if (ut.isNotEmpty(username) && ut.noSymbols(username)) {
        // Prepare query strings and connection
        let client = ut.newClient();
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
                    res.statusMessage = 'User found';
                    res.status(200).end();
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
            // Call middleware (logging)
            next();
        });
    } else {
        // Either username was empty or contained illigal symbols
        res.statusMessage = 'Username contains no or illigal characters';
        res.status(403).end();
    }
}
// Lagt til salting og ny sha1 hashing av passord, ikke helt ferdig.
function loginUser(req, res, next) {
    let username = req.body.username;
    let password = req.body.password;
    let salt = "1234567890";
    password = salt + password;
    password = sha1(password);

    if (ut.isNotEmpty(username, password) && ut.noSymbols(username)) {
        let client = ut.newClient();
        let sql = 'SELECT * FROM users WHERE username = $1';
        let params = [username];

        client.connect();

        client.query(sql, params, (err, query) => {
            if (!err) {
                if (query.rows.length > 0) {
                    if(query.rows[0].password === password) {
                        res.statusMessage = 'Login success';
                        res.status(200).end();
                        res.next = true;
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
            next();
        });
    } else {
        res.statusMessage = 'Username contains no or illigal characters';
        res.status(403).end();
    }
}

function setLastlogin(req, res, next) {
    let username = req.body.username;

    if (ut.isNotEmpty(username) && ut.noSymbols(username)) {
        let client = ut.newClient();
        let sql = 'UPDATE users SET lastlogin = $1 WHERE username = $2';
        let params = [Date.now(), username];

        client.connect();

        client.query(sql, params, (err, query) => {
            if (!err) {
                res.statusMessage = 'Timestamp set';
                res.status(201).end();
            } else {
                res.statusMessage = 'There was a problem setting lastlogin';
                res.status(500).end();
            }
            client.end();
            next();
        });
    } else {
        res.statusMessage = 'Username contains no or illigal characters';
        res.status(403).end();
    }
}

function newUser(req, res, next) {
    let username = req.body.username;
    let password = req.body.password;
    let firstname = req.body.firstname;
    let lastname = req.body.lastname;
    let mail = req.body.mail;

    if (ut.isNotEmpty(username, password, firstname, lastname, mail) && ut.noSymbols(username, firstname, lastname)) {
        let client = ut.newClient();
        let sql = 'INSERT INTO users(username, password, firstname, lastname, mail) VALUES($1, $2, $3, $4, $5)';
        let params = [username, password, firstname, lastname, mail];

        client.connect();

        client.query(sql, params, (err, query) => {
            if (!err) {
                res.statusMessage = 'New user created';
                res.status(201).end();
            } else {
                if (err.code === '23505') {
                    if (err.constraint.includes('username')) {
                        res.statusMessage = `Username already registered`;
                    } else if (err.constraint.includes('mail')) {
                        res.statusMessage = `Mail already registered`;
                    }
                    res.status(409).end();
                } else {
                    res.statusMessage = `There was a problem creating new user`;
                    res.status(500).end();
                }

                res.err = err;
            }
            client.end();
            next();
        });
    } else {
        res.statusMessage = 'Something contains no or illigal characters';
        res.status(403).end();
    }
}

module.exports = {
    getUser : getUser,
    loginUser : loginUser,
    setLastlogin : setLastlogin,
    newUser : newUser
}