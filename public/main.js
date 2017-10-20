let findUserInput = document.getElementById('findUserInput');
let findUserBtn = document.getElementById('findUserBtn');
let usernameInput = document.getElementById('usernameInput');
let passwordInput = document.getElementById('passwordInput');
let loginBtn = document.getElementById('loginBtn');

const DEBUG = false;

findUserBtn.onclick = () => {
	let username = findUserInput.value;
	if(username) {
		getUser(username);
	}
}

loginBtn.onclick = () => {
	let username = usernameInput.value;
	let password = passwordInput.value;
	if(username && password) {
		login(username, password);
	}
}

function login(username, password) {
	fetch(newRequest('GET', '/user/login', {
		username: username,
		password: password
	})).then(res =>{
	    return res.json();
	}).then(res => {
	    console.log(res);
		//setLastlogin(username); <- not working correctly.
	}).catch(err => {
	    printError(err);
	});
}

function setLastlogin(username) {
	fetch(newRequest('PUT', '/user/lastlogin', {
		username: username
	})).then(res => {
		return res.json();
	}).then(res => {
		console.log(res);
	}).catch(err => {
	    printError(err);
	});
}

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

function newUser(user) {
	fetch(newRequest('POST', '/user', {
		username: user.username,
		password: user.password,
		firstname: user.firstname,
		lastname: user.lastname,
		mail: user.mail
	})).then(res =>{
	    return res.json();
	}).then(res => {
	    console.log(res);
	}).catch(err => {
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
				"content-type":"application/json"
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