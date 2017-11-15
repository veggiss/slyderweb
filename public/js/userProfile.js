// lagrer resultatet fra anonym function, dette blir gjort for å forhindre navn konflikt (at ikke ting henter det samme)
const profile = (function ()
{// ================================================
	const PAGE_ID_PREFIX          = "page-";
	const PAGE_CLASS              = "page";
	const PAGE_CLASS_VISIBLE      = "page-visible";
	const MENU_ITEM_CLASS         = "menu-item";
	const MENU_ITEM_CLASS_CURRENT = "menu-item-current";

  const pages = {
  	info:    document.getElementById(PAGE_ID_PREFIX + "info"),
    slides:  document.getElementById(PAGE_ID_PREFIX + "slides"),
    setting: document.getElementById(PAGE_ID_PREFIX + "setting"),
  }
  
  return {
  	pages:      pages,
		hashString: window.location.hash,

		update: function () {
    	window.location.hash = (window.location.hash ? window.location.hash : "#info");
      
    	for (let key in pages) {
      	pages[key].classList.remove(PAGE_CLASS_VISIBLE);
      }
      profile.showPage(window.location.hash);

			// 
      const menuItems = document.getElementsByClassName(MENU_ITEM_CLASS);
      for (let i = 0; i < menuItems.length; i++) {
        const elm  = menuItems[i];

        console.log({ wHash: window.location.hash, aHash: elm.hash, elm });
				
        // her blir hash sjekket om den er lik href, er dette tilfellet blir classList lagt til
        if (elm.hash === window.location.hash) {
      		elm.classList.add(MENU_ITEM_CLASS_CURRENT);
        } else {
        	elm.classList.remove(MENU_ITEM_CLASS_CURRENT);
        }
      }
		},

		showPage: function (pageId) {
    	console.log('[showPage]:', window.location.hash)
			console.log('[showPage]:', pageId);

			// sjekker om user info linker er aktive
			if (pageId === "#info") {
				console.warn('PAGE:', 'info');
        pages.info.classList.add(PAGE_CLASS_VISIBLE);
			}
			// sjekker om Presentations linken er aktive
			else if (pageId === "#slides") {
				console.warn('PAGE:', 'slides');
        pages.slides.classList.add(PAGE_CLASS_VISIBLE);
			}
      // sjekker om settings linken er active
			else if (pageId === "#setting") {
				console.warn('PAGE:', 'setting');
        pages.setting.classList.add(PAGE_CLASS_VISIBLE);
			}
      // kjøres når ingen andre alternativer stemmer, da blir info siden activ
			else {
      	console.error('Invalid hash:', pageId);
      	window.location.hash = "#info";
      }
		},
	};
}// ================================================
)();

profile.update();

window.onhashchange = function () {
	profile.update();
}


console.log(profile);