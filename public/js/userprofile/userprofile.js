// lagrer resultatet fra anonym function, dette blir gjort for å forhindre navn konflikt (at ikke ting henter det samme)
const profile = (function ()
{// ================================================

	const PAGE_ID_PREFIX          = "page-";
	const PAGE_CLASS              = "page";
	const PAGE_CLASS_VISIBLE      = "page-visible";
	const MENU_ITEM_CLASS         = "menu-item";
	const MENU_ITEM_CLASS_CURRENT = "menu-item-current";

	const pages = {
		// info:    document.getElementById(PAGE_ID_PREFIX + "info"),
		slides:  document.getElementById(PAGE_ID_PREFIX + "slides"),
		setting: document.getElementById(PAGE_ID_PREFIX + "setting"),
	};

	return {
		pages:      pages,
		hashString: window.location.hash,

		update: function () {
		  if (!window.location.hash) {
		    window.location.hash = "#slides";
		    return;
		  }
			// window.location.hash = (window.location.hash ? window.location.hash : "#info");
		  // window.location.hash = (window.location.hash ? window.location.hash : "#slides");

			for (let key in pages) {
				pages[key].classList.remove(PAGE_CLASS_VISIBLE);
			}
			this.showPage(window.location.hash);

			//
			const menuItems = document.getElementsByClassName(MENU_ITEM_CLASS);
			for (let i = 0; i < menuItems.length; i++) {
				const elm  = menuItems[i];


				// her blir hash sjekket om den er lik href, er dette tilfellet blir classList lagt til
				if (elm.hash === window.location.hash) {
					elm.classList.add(MENU_ITEM_CLASS_CURRENT);
				} else {
					elm.classList.remove(MENU_ITEM_CLASS_CURRENT);
				}
			}
		},

		showPage: function (pageId) {

			// sjekker om user info linker er aktive
			// if (pageId === "#info") {
			// 	console.warn('PAGE:', 'info');
			// 	pages.info.classList.add(PAGE_CLASS_VISIBLE);
			// }
		  // else
			// sjekker om Presentations linken er aktive
			if (pageId === "#slides") {
				pages.slides.classList.add(PAGE_CLASS_VISIBLE);
			}
			// sjekker om settings linken er active
			else if (pageId === "#setting") {
				pages.setting.classList.add(PAGE_CLASS_VISIBLE);
			}
		},
	};

}// ================================================
)();


//===========================================
function initialize () {//====================

  profile.update();
  
  window.onhashchange = function () {
  	profile.update();
  };

	settings.init({
		onSave:          onSaveHandler, // TODO: må fikse slik en kan lagre endring av navn og bilde
		onSavePassword:  onSaveHandler, // TODO: må fikse slik en kan lagre nytt passord
		//onDelete:        clickHandler, //   TODO: må fikse slik at en kan slette brukerprofilen
	});  

  slides.init({
    //onDelete:        clickHandler, // TODO: har ikke mulighet til å slette slides fra brukerprofil
    //onOpenInEditor:  clickHandler, // TODO: har ikke mulighet til å åpne i editor fra brukerprofilen
  });

  function onSaveHandler (data) {
    // fetch(util.newRequest('PUT', '/user', {
    //   // username: username // TODO: trenger brukernavn får å vite hvem som er logget inn, for å kunne gjøre endringer
    //   ...data
    // }))
    Promise.resolve(res) // bytt med fetch ovenfor
      .then(() => {
        consol.log(res);
        update();
      })
      .catch((err) => {
        util.printError(err);
      });

    clickSaveHandler(data);
  }
  update();

}//===========================================

function update () {//====================

	Promise.resolve(util.getPresList()).then((res) => {
		slides.updateData(res);
	});

    Promise.resolve(util.getUser()).then((res) => {
    	settings.updateData(res);
    });

}//===========================================
initialize();
