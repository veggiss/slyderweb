// User info
let header = {
	//userinfo_input: 			document.getElementById('userinfo_input'),
	//userinfo_btn: 				document.getElementById('userinfo_btn'),

	// Log in
	login_username: 			document.getElementById('login_username'),
	login_password: 			document.getElementById('login_password'),
	login_btn: 					document.getElementById('login_btn'),
	hrfSignOut: 				document.getElementById('hrfSignOut'),
	hrfSignUp: 					document.getElementById('hrfSignUp'),
	hrfProfile: 				document.getElementById('hrfProfile'),


	// Create user
	createuser_username: 		document.getElementById('createuser_username'),
	createuser_password: 		document.getElementById('createuser_password'),
	createuser_firstname: 		document.getElementById('createuser_firstname'),
	createuser_lastname: 		document.getElementById('createuser_lastname'),
	createuser_mail: 			document.getElementById('createuser_mail'),
	createuser_btn: 			document.getElementById('createuser_btn'),

	// Get the modal
	modal_signIn: 				document.getElementById('modal_signIn'),
	modal_createUser: 			document.getElementById('modal_createUser'),

	// Get the button that opens the modal
	openSignInModalbtn: 		document.getElementById("openSignInModalbtn"),
	openCreateUserModalbtn: 	document.getElementById("openCreateUserModalbtn"),
	cancel_btn_login: 			document.getElementById("cancel_btn_login"),
	cancel_btn_createUser: 		document.getElementById("cancel_btn_createUser"),

	// When the user clicks on the button, open the modal 
	//openSignInModalbtn.onclick = openModal(modal_SignIn);
	init: function() {
		window.onload = function () {
			header.setSignedInOut();
		}

		login_btn.addEventListener("click", () => {
			let inputs = [login_username, login_password];
			let passInputs = true;

			inputs.forEach(input => {
				input.style.borderColor = 'initial';
				if (!util.isNotEmpty(input.value)) {
					passInputs = false;
					input.style.borderColor = 'red';
				}
			});

			if (!util.noSymbols(inputs[0].value)) {
				passInputs = false;
				inputs[0].borderColor = 'red';
			}

			if (passInputs) {
				header.login(inputs[0].value, inputs[1].value);
			}
		});

		createuser_btn.addEventListener("click", () => {
			let passInputs = true;

			let user = {
				username: createuser_username,
				password: createuser_password,
				firstname: createuser_firstname,
				lastname: createuser_lastname,
				mail: createuser_mail
			}

			Object.keys(user).forEach(idx => {
				user[idx].style.borderColor = 'initial';
				if(util.isNotEmpty(user[idx].value)) {
					if(idx != 'password' && idx != 'mail') {
						if(!util.noSymbols(user[idx].value)) {
							passInputs = false;
							user[idx].style.borderColor = 'red';
						} else {
							user[idx] = user[idx].value;
						}
					} else {
						user[idx] = user[idx].value;
					}
				} else {
					passInputs = false;
					user[idx].style.borderColor = 'red';
				}
			});

			if (passInputs) {
				header.newUser(user);
			}
		});

		openSignInModalbtn.onclick = function () {
			modal_createUser.style.display = "none";
			modal_signIn.style.display = "block";
		}

		openCreateUserModalbtn.onclick = function () {
			modal_signIn.style.display = "none";
			modal_createUser.style.display = "block";
		}

		cancel_btn_login.onclick = function () {
			modal_signIn.style.display = "none";
		}

		cancel_btn_createUser.onclick = function () {
			modal_createUser.style.display = "none";
		}

		// When the user clicks anywhere outside of the modal, close it
		modal_signIn.onclick = function (event) {
			if (event.target == modal_signIn) {
				modal_signIn.style.display = "none";
			}
		}

		modal_createUser.onclick = function (event) {
			if (event.target == modal_createUser) {
				modal_createUser.style.display = "none";
			}
		}
	},

	// Legger til sha1 hash passord kryptering fra klient side:
	login: function(username, password) {
		fetch(util.newRequest('POST', '/user/login', {
			username: username,
			password: sha1(password)
		})).then(res => {
			if (res.status === 200) {
				location.reload();
			} else if (res.status === 401) {
				login_password.style.borderColor = 'red';
			} else if (res.status === 404) {
				login_username.style.borderColor = 'red';
			}
		}).catch(err => {
			util.printError(err);
		});
	},

	//Denne funksjonen sjekker om brukeren er autentisert.
	setSignedInOut: function() {
		fetch(util.newRequest('GET', '/user/isLogged', {})).then(res => {
			if (res.status === 200) {
				openSignInModalbtn.style.display = 'none';
				hrfSignOut.style.display = 'inline';
				hrfProfile.style.display = 'inline';
			} else {
				openSignInModalbtn.style.display = 'inline';
				hrfSignOut.style.display = 'none';
				hrfProfile.style.display = 'none';
			}
		}).catch(err => {
			util.printError(err);
		});
	},

	newUser: function(user) {
		let hashedPassword = sha1(user.password);

		fetch(util.newRequest('POST', '/user', {
			username: user.username,
			password: hashedPassword,
			firstname: user.firstname,
			lastname: user.lastname,
			mail: user.mail
		})).then(res => {
			if (res.status === 201) {
				openSignInModalbtn.click();
			}
		}).catch(err => {
			util.printError(err);
		});
	}
}

header.init();