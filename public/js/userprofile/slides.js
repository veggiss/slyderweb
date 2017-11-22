function createIcon () {
	const icon = document.createElement('i')
	icon.classList.add(...['fa', 'fa-address-book-o'])
	return icon
}

function createSlideList (slides, deleteHandler, itemClass = 'item')
{
	const eSlideList = document.createElement("ul");
  const arr = [];
  for (let i = 0; i < slides.length; i++) {
  	arr.push(
    	createSlideItem(
      	slides[i], 
        deleteHandler,
        itemClass
      )
    );
  }
  //console.log(arr);
  return arr;
}
//showList([data(), data(), data(), data()]);


function createSlideItem (data, deleteHandler, itemClass)
{
  const {name, created, image = undefined} = data;

	// lager en div der at innholdet skal være i med class "itemClass"
  const eItem = document.createElement("div");
  eItem.classList.add(itemClass);
    
  // setter opp en if slik at ikoner blir vist hvis det ikke er noen bilder
  let eImage;
	if (!image) {
		eImage = createIcon();
  }
  /* 
  else {// TODO: Finn ut ka trenge å lag
  	const eImage = document.createElement("img")
  }*/
  // Etter if blir bilde plassert som child under eItem (div som ble laget for innholdet)
  eItem.appendChild(eImage);

	// Titel på sliden blir plassert i en div, og er child under eItem
  const eTitle = document.createElement("div");
  eTitle.innerHTML = name;
  eItem.appendChild(eTitle);

	// Tidspunket sliden ble lagret på blir lagt i en html tag <time>
  const eCreated = document.createElement("time");
  const date = new Date(created);
  eCreated.dateTime  = date.toISOString();
  // her blir dato gjort om til norsk skrive oppsett 
  eCreated.innerHTML = date.toLocaleDateString("nb-NO");
  eItem.appendChild(eCreated);

	// if testen sjekker om deleteHandler er en function, 
  // og er deleteHandler en function blir det laget et html element <button>
  if (typeof deleteHandler === "function") {
    const eDelete = document.createElement("button");
    eDelete.innerHTML = "Delete";
    eDelete.onclick   = (event) => { deleteHandler(data) };
    eItem.appendChild(eDelete);
  }

  return eItem;
}