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
	//let username = req.query.username;
	let client = newClient();

    client.connect();

    client.query("select * from users", (err, res) => {
        
        console.log(res);

        client.end();
    });
}

module.exports = {
	getUser : getUser
}