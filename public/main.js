const DEBUG = false;

// User info
let userinfo_input = document.getElementById('userinfo_input');
let userinfo_btn = document.getElementById('userinfo_btn');

// Log in
let login_username = document.getElementById('login_username');
let login_password = document.getElementById('login_password');
let login_btn = document.getElementById('login_btn');

// Create user
let createuser_username = document.getElementById('createuser_username');
let createuser_password = document.getElementById('createuser_password');
let createuser_firstname = document.getElementById('createuser_firstname');
let createuser_lastname = document.getElementById('createuser_lastname');
let createuser_mail = document.getElementById('createuser_mail');
let createuser_btn = document.getElementById('createuser_btn');

userinfo_btn.addEventListener("click", () => {
	getUser(userinfo_input.value);
});

login_btn.addEventListener("click", () => {
	login(login_username.value, login_password.value);
});

createuser_btn.addEventListener("click", () => {
	let user = {
		username: createuser_username.value,
		password: createuser_password.value,
		firstname: createuser_firstname.value,
		lastname: createuser_lastname.value,
		mail: createuser_mail.value
	}

	newUser(user);
});


function getUser(username) {
	fetch(newRequest('GET', '/user', {
		username: username
	})).then(res =>{
	    return res.json();
	}).then(res => {
	    console.log(res);
	}).catch(err => {
	    printError(err);
	});
}

function login(username, password) {
	fetch(newRequest('GET', '/user/login', {
		username: username,
		password: password
	})).then(res =>{
	    return res.json();
	}).then(res => {
	    console.log(res);
		setLastlogin(username);
	}).catch(err => {
	    printError(err);
	});
}

function setLastlogin(username) {
	fetch(newRequest('PUT', '/user/lastlogin', {
		username: username
	})).catch(err => {
	    printError(err);
	});
}

function newUser(user) {
	fetch(newRequest('POST', '/user', {
		username: user.username,
		password: user.password,
		firstname: user.firstname,
		lastname: user.lastname,
		mail: user.mail
	})).catch(err => {
	    printError(err);
	});
}

function newRequest(type, path, params) {
	let request;

	if (type == "GET") {
		request = new Request(path + uriParams(params), {
			method: 'GET',
			headers:{
				"content-type":"application/json"
			}
		});
	} else if (type == 'PUT') {
		request = new Request(path + uriParams(params), {
			method: 'PUT',
			headers:{
				"Content-type":"application/json"
			}
		});
	} else if (type == 'POST') {
		request = new Request(path, {
			method: 'POST',
			body: JSON.stringify(params),
			headers:{
				"Content-type":"application/json"
			}
		});
	}

	return request;
}

function uriParams(params) {
	let esc = encodeURIComponent;
	let query = Object.keys(params).map(k => esc(k) + '=' + esc(params[k])).join('&');
	return '?' + query;
}

function printError(...lines) {
	if(DEBUG){
		lines.forEach(item => {
			console.error(item);
		});
	}
}