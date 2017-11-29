// User info
let userinfo_input = document.getElementById('userinfo_input');
let userinfo_btn = document.getElementById('userinfo_btn');

// Log in
let login_username = document.getElementById('login_username');
let login_password = document.getElementById('login_password');
let login_btn = document.getElementById('login_btn');
let hrfSignIn = document.getElementById('hrfSignIn');
let hrfSignOut = document.getElementById('hrfSignOut');
let hrfSignUp = document.getElementById('hrfSignUp');
let hrfProfile = document.getElementById('hrfProfile');


// Create user
let createuser_username = document.getElementById('createuser_username');
let createuser_password = document.getElementById('createuser_password');
let createuser_firstname = document.getElementById('createuser_firstname');
let createuser_lastname = document.getElementById('createuser_lastname');
let createuser_mail = document.getElementById('createuser_mail');
let createuser_btn = document.getElementById('createuser_btn');

//Main code

window.onload = function () {
	setSignedInOut();
}

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
	fetch(util.newRequest('GET', '/user', {
		username: username
	})).then(res => {
		return res.json();
	}).then(res => {
		console.log(res);
	}).catch(err => {
		util.printError(err);
	});
}

// Legger til sha1 hash passord kryptering fra klient side:
function login(username, password) {
	fetch(util.newRequest('POST', '/user/login', {
		username: username,
		password: sha1(password)
	})).then(res => {
		if (res.status === 200) {
			console.log('Login success');
			location.reload();
		}
	}).catch(err => {
		util.printError(err);
	});
}

//Denne funksjonen sjekker om brukeren er autentisert.
// er brukeren logget inn setter vi hrfSignOut og hrfSignIn riktig.
function setSignedInOut() {
	fetch(util.newRequest('GET', '/user/isLogged', {})).then(res => {
		if (res.status === 200) {
			hrfSignIn.style.display = 'none';
			hrfSignUp.style.display = 'none';
			hrfSignOut.style.display = 'inline';
			hrfProfile.style.display = 'inline';
		} else {
			hrfSignIn.style.display = 'inline';
			hrfSignUp.style.display = 'inline';
			hrfSignOut.style.display = 'none';
			hrfProfile.style.display = 'none';
		}
	}).catch(err => {
		util.printError(err);
	});
}

function newUser(user) {
	fetch(util.newRequest('POST', '/user', {
		username: user.username,
		password: sha1(user.password),
		firstname: user.firstname,
		lastname: user.lastname,
		mail: user.mail
	})).then(res => {
		if (res.status === 201) {
			console.log(`User '${user.username}' created`);
		}
	}).catch(err => {
		util.printError(err);
	});
}