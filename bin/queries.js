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
                        profileimg: query.rows[0].profileimg
                    }
                    res.statusMessage = 'User found';
                    res.status(200);
                    res.send(clientResponse);
                    res.end();
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

function isLogged(req, res, next) {
    if(req.session.username && res.authenticated) {
        res.statusMessage = 'User logged in';
        res.status(200).end();
    } else {
        res.statusMessage = 'Not logged in';
        res.status(401).end();
    }
}

function loginUser(req, res, next) {
    let username = req.body.username;
    let password = req.body.password;
    
    if (ut.isNotEmpty(username, password) && ut.noSymbols(username)) {
        let client = ut.newClient();
        let sql = 'SELECT * FROM users WHERE username = $1';
        let params = [username];

        client.connect();

        client.query(sql, params, (err, query) => {
            if (!err) {
                if (query.rows.length > 0) {
                    if(query.rows[0].password === password) {
                        req.session.username = username;
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
        res.statusMessage = 'Username or password contains no or illigal characters';
        res.status(403).end();
    }
}

function logoutUser(req, res) {
    req.session.destroy();
    res.redirect('/');
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

function updatePresentation(req, res, next) {
    let author = req.session.username;

    if (author) {
        let presObject = req.body.presentation;
        let uid = presObject.uid;
        let name = presObject.name;
        let bgColors = presObject.bgColors;
        let originHeight = presObject.originHeight;
        let body = presObject.body;

        if(ut.isNotEmpty(uid.toString())) {
            if (ut.isNotEmpty(body.toString(), author)) {
                let client = ut.newClient();
                let sql = 'UPDATE presentations SET body = $1, name = $2, bgcolors = $3, originheight = $4 WHERE author = $5 AND id = $6';
                let params = [body, name, bgColors, originHeight, author, uid];

                client.connect();

                client.query(sql, params, (err, query) => {
                    if (!err) {
                        if (query.rowCount > 0) {
                            res.statusMessage = `Presentation #${uid} saved`;
                            res.status(200).end();
                        } else {
                            res.statusMessage = "Presentation does not exist, proceed to create new";
                            res.status(200);
                            res.next = true;
                        }
                    } else {
                        res.err = err;
                        res.statusMessage = 'There was a problem saving presentation';
                        res.status(500).end();
                    }

                    client.end();
                    next();
                });
            } else {
                res.statusMessage = 'Presentation object malformed';
                res.status(403).end();
                next();
            }
        } else {
            res.statusMessage = "Presentation does not exist, proceed to create new";
            res.status(200);
            res.next = true;
            next();
        }
    } else {
        res.statusMessage = 'Not logged in';
        res.status(401).end();
    }
}

function newPresentation(req, res, next) {
    let presObject = req.body.presentation;
    let author = req.session.username;
    let name = ut.isNotEmpty(presObject.name) ? presObject.name : 'My presentation';
    let bgColors = presObject.bgColors;
    let originHeight = presObject.originHeight;
    let body = presObject.body;

    if(author) {
        let client = ut.newClient();
        let sql = 'INSERT INTO presentations(author, name, bgcolors, originheight, body) VALUES($1, $2, $3, $4, $5) RETURNING id';
        let params = [author, name, bgColors, originHeight, body];

        client.connect();

        client.query(sql, params, (err, query) => {
            if (!err) {
                if (query.rows.length > 0) {
                    res.statusMessage = 'New presentation added';
                    res.status(201);
                    res.send({
                        uid: query.rows[0].id,
                        author: author,
                        name: name
                    });
                    res.end();
                } else {
                    res.statusMessage = 'Query did not return id';
                    res.status(409).end();
                }
            } else {
                res.statusMessage = 'There was a problem creating new presentation';
                res.status(500).end();
                res.err = err;
            }

            client.end();
            next();
        });
    } else {
        res.statusMessage = 'Not logged in';
        res.status(401).end();
        next();
    }
}

function getPresList(req, res, next) {
    let username = req.session.username;

    if (username) {
        let client = ut.newClient();
        let sql = 'SELECT name, id FROM presentations WHERE author = $1';
        let params = [username];

        client.connect();

        client.query(sql, params, (err, query) => {
            if (!err) {
                res.statusMessage = 'Found some presentation';
                res.status(200);
                res.send(query.rows);
                res.end();
            } else {
                res.statusMessage = 'There was a problem getting presentation list';
                res.status(500).end();
                res.err = err;
                next();
            }

            client.end();
        });
    } else {
        res.statusMessage = 'Not logged in';
        res.status(401).end();
    }
}

function getPresenation(req, res, next) {
    let username = req.session.username;

    if (username) {
        let uid = req.query.uid;

        let client = ut.newClient();
        let sql = 'SELECT * FROM presentations WHERE author = $1 AND id = $2';
        let params = [username, uid];

        client.connect();

        client.query(sql, params, (err, query) => {
            if (!err) {
                if (query.rows.length > 0) {
                    let presentation = {
                        uid: query.rows[0].id,
                        author: query.rows[0].author,
                        name: query.rows[0].name,
                        presmode: query.rows[0].presmode,
                        bgColors: query.rows[0].bgcolors,
                        originHeight: query.rows[0].originheight,
                        body: query.rows[0].body
                    }

                    res.statusMessage = 'Found presentation';
                    res.status(200);
                    res.send(presentation);
                    res.end();
                } else {
                    res.statusMessage = `Could not find presentation '${presName}'`;
                    res.status(404).end();
                }
            } else {
                res.statusMessage = 'There was a problem getting presentation list';
                res.status(500).end();
                res.err = err;
            }

            client.end();
            next();
        });
    } else {
        res.statusMessage = 'Not logged in';
        res.status(401).end();
    }
}

function deletePresentation(req, res, next) {
    let username = req.session.username;

    if (username) {
        let uid = req.body.uid;
        let presName = req.body.name;

        let client = ut.newClient();
        let sql = 'DELETE FROM presentations WHERE author = $1 AND id = $2 AND name = $3';
        let params = [username, uid, presName];

        client.connect();

        client.query(sql, params, (err, query) => {
            if (!err) {
                res.statusMessage = 'Deleted presentation';
                res.status(200).end();
            } else {
                res.statusMessage = `Could not find presentation '${presName}'`;
                res.status(404).end();
            }
            client.end();
            next();
        });
    } else {
        res.statusMessage = 'Not logged in';
        res.status(401).end();
    }
}

module.exports = {
    getUser: getUser,
    loginUser: loginUser,
    setLastlogin: setLastlogin,
    newUser: newUser,
    updatePresentation: updatePresentation,
    newPresentation: newPresentation,
    getPresList: getPresList,
    getPresenation: getPresenation,
    deletePresentation: deletePresentation,
    logoutUser: logoutUser,
    isLogged: isLogged
}