// lagrer resultatet fra anonym function, dette blir gjort for å forhindre navn konflikt (at ikke ting henter det samme)
const settings = (function (elms)
{// ===============================================================
	const { firstName, lastName, userName, email, image, btnSaveName, oldPassword,
	password, repeatPassword, btnSavePassword, btnDelete } = elms;

  let options;
	
  // valid test på navn endringer, sjekkes om det ikke er tomt og at det inneholder bokstaver og/eller tall
	function isValidName     (str) { return !!(str && (/^[a-zA-Z0-9]+$/).test(str)) }
  // valid test på url endringer, sjekkes om det ikke er tomt og at filtypen på url er korrekt 
  function isValidImgUrl   (str) { return !!(str && (/\.(jpeg|jpg|gif|png)$/).test(str)) }
  // valid test på passord endringer, sjekkes om det ikke er tomt og at det ikke er kun mellom i passord
	function isValidPassword (str) { return !!(str && !((/^\s*$/).test(str))) }

  // fillPasswordForm ------------------------------------------------------
	function fillPasswordForm (data, opt) {
  	btnSavePassword.onclick = (event) => {
      if (!opt.onSavePassword) return; // returner når ingen handler er mottatt.
      
      const oldPass  = oldPassword.value;
      const newPass1 = password.value;
      const newPass2 = repeatPassword.value;
      
      // sjekker om det nye passordet er valid, derretter blir nytt passord og 
      //repeate passord sjekket om de er like. og om nytt passord er ulikt gammelt
      if (isValidPassword(newPass1) && newPass1 === newPass2 && newPass1 !== oldPass) {
      	// TODO: Implement validation feedback ?
      	opt.onSavePassword({
        	password: newPass1,
          passwordOld: oldPass,
        });
      }
    };
  }

  // prepDelete ------------------------------------------------------
	function prepDelete (data, opt) {
	  if (opt.onDelete) {
  	  btnDelete.onclick = (event) => { opt.onDelete && opt.onDelete(data) };
	  }
	  else {
	    btnDelete.disabled = true;
	  }
  }
  
  // fillMainForm ------------------------------------------------------
	function fillMainForm (data, opt) { // Fylle inn existerende bruker-informasjon
    firstName.value = data.firstName;
    lastName.value  = data.lastName;
    userName.value  = data.username;
    email.value     = data.mail;
    image.value     = data.profileImg;

    // TODO: Add image preview or rely on page already showing (?)
    // image.value = data.profileImg;

    btnSaveName.onclick = (event) => {
      if (!opt.onSave) return; // returner når ingen handler er mottatt.
      
      const newfirstName = firstName.value;
      const newlastName  = lastName.value;
      const newimage     = image.value;

			const newData = {};
      
      // sjekker at det nye navnet er valid og om det som står i inputfeltet er endret på
      if (isValidName(newfirstName) && newfirstName !== data.firstName) {
      	// TODO: Implement validation feedback ?
      	newData.firstName = newfirstName;
      }
      
      if (isValidName(newlastName) && newlastName !== data.lastName) {
      	// TODO: Implement validation feedback ?
      	newData.lastName = newlastName;
      }
      
      if (isValidImgUrl(newimage) && newimage !== data.profileImg) {
      	// TODO: Implement validation feedback ?
      	newData.profileImg = newimage;
      }

			if (Object.keys(newData).length) {
      	opt.onSave(newData);
        //update();
      }
    };
  }

  //init: function ({ onDeleteHandler }) {
  function init (opt) {
    options = opt;
    //update()
  }

  function updateData (data) {
    const opt = options;
    //getData().then((data) => {
      fillMainForm(data, opt);
      fillPasswordForm(data, opt);
      prepDelete(data, opt);
    //}).catch((err) => {console.error(err)})
  }

  return {
  	init,
  	updateData,
  };

}// ===============================================================
)({
	firstName:        document.getElementById("firstname"),
	lastName:         document.getElementById("lastname"),
	userName:         document.getElementById("username"),
	email:            document.getElementById("email"),
	image:            document.getElementById("image"),
	btnSaveName:      document.getElementById("saveChanges"),

	oldPassword:      document.getElementById("password_old"),
	password:         document.getElementById("password_new"),
	repeatPassword:   document.getElementById("password_new_repeat"),
	btnSavePassword:  document.getElementById("save_password"),

	btnDelete:        document.getElementById("btnDelete"),
});