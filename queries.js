const {Client} = require('pg');

function newClient() {
    let client = new Client({
        connectionString:process.env.DATABASE_URL,
        ssl:true
    });

    return client;
}

function newUser(req, res) {
	let user = req.body;
}

function getUser(req, res) {
	let username = req.query.username;
	let client = newClient();

    client.connect();

    client.query(`SELECT * FROM users WHERE username=${username}`, (err, qRes) => {
        if (qRes.rows.length > 0) {
            let clientResponse = {
                lastlogin: qRes.rows[0].lastlogin,
                firstname: qRes.rows[0].firstname,
                lastname: qRes.rows[0].lastname,
                mail: qRes.rows[0].mail,
                presentations: qRes.rows[0].presentations,
                profileimg: qRes.rows[0].profileimg
            }
            res.send(clientResponse);
        } else {
            res.status(401).send(JSON.stringify('Could not find user :('));
        }
    });

    client.end();
}

module.exports = {
	getUser : getUser
}