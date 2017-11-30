// lagrer resultatet fra anonym function, dette blir gjort for å forhindre navn konflikt (at ikke ting henter det samme)
const slides = (function (elms)
{// ===============================================================
  const { root } = elms;

  let options;

  function _createIcon () {
  	const icon = document.createElement('i');
  	icon.classList.add(...['fa', 'fa-address-book-o', 'ic', 'ic-50']);
  	return icon;
  }
  
  function createSlideList (slides)
  {
  	const eSlideList = document.createElement("ul");
    for (let i = 0; i < slides.length; i++) {
    
      eSlideList.appendChild(_createSlideItem(
      	slides[i]
      ));
    }
    return eSlideList;
  }
  
  
  function _createSlideItem (data)
  {
    const {name, created, image = undefined} = data;
  
  	// lager en div der at innholdet skal være i med class "itemClass"
    const eItem = document.createElement("div");
    eItem.classList.add(options.itemClass || 'item');
  
    // setter opp en if slik at ikoner blir vist hvis det ikke er noen bilder
    let eImage;
  	if (!image) {
  		eImage = _createIcon();
    }
      
    // Etter if blir bilde plassert som child under eItem (div som ble laget for innholdet)
    eItem.appendChild(eImage);
  
  	// Titel på sliden blir plassert i en div, og er child under eItem
    const eTitle = document.createElement("div");
    eTitle.innerHTML = name;
    eItem.appendChild(eTitle);
  
  	// Tidspunket sliden ble lagret på blir lagt i en html tag <time>
    if (typeof created !== "undefined") {
      const eCreated = document.createElement("time");
      const date = new Date(created);
      eCreated.dateTime  = date.toISOString();
      // her blir dato gjort om til norsk skrive oppsett
      eCreated.innerHTML = date.toLocaleDateString("nb-NO");
      eItem.appendChild(eCreated);
    }
  
  	// if testen sjekker om deleteHandler er en function,
    // og er deleteHandler en function blir det laget et html element <button>
    if (typeof options.onDelete === "function") {
      const eDelete = document.createElement("button");
      eDelete.innerHTML = "Delete";
      eDelete.onclick   = (event) => { options.onDelete(data) };
      eItem.appendChild(eDelete);
    }
  
  	// if testen sjekker om deleteHandler er en function,
    // og er deleteHandler en function blir det laget et html element <button>
    if (typeof options.onOpenInEditor === "function") {
      const eOpenInEdit = document.createElement("button");
      eOpenInEdit.innerHTML = "OpenInEditor";
      eOpenInEdit.onclick   = (event) => { options.onOpenInEditor(data) };
      eItem.appendChild(eOpenInEdit);
    }
  
    return eItem;
  }
  
  function init (opt) {
    options = opt;
  }

  function updateData (data) {
    root.innerHTML = "";
    root.appendChild(createSlideList(data));
  }

  return {
  	init,
  	updateData,
  };

}// ===============================================================
)({
  root: document.getElementById('page-slides-root'),
});