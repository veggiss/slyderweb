//Editor related
let editGrid	= document.getElementById('editGrid');
let savePageBtn = document.getElementById('savePageBtn');
let loadprevBtn = document.getElementById('loadprevBtn');
let loadnextBtn = document.getElementById('loadnextBtn');
let newTextBoxBtn = document.getElementById('newTextBoxBtn');
let presNameInput = document.getElementById('presNameInput');

//Text toolbar stuff
let textToolBar			 = document.getElementById('textToolBar');
let toolbar_parent		 = document.getElementById('toolbar_parent');
let toolbar_font		 = document.getElementById('toolbar_font');
let toolbar_fontSize	 = document.getElementById('toolbar_fontSize');
let toolbar_bold		 = document.getElementById('toolbar_bold');
let toolbar_italic		 = document.getElementById('toolbar_italic');
let toolbar_underline	 = document.getElementById('toolbar_underline');
let toolbar_bulletList	 = document.getElementById('toolbar_bulletList');
let toolbar_numberList	 = document.getElementById('toolbar_numberList');
let toolbar_alignLeft	 = document.getElementById('toolbar_alignLeft');
let toolbar_alignCenter	 = document.getElementById('toolbar_alignCenter');
let toolbar_alignRight	 = document.getElementById('toolbar_alignRight');

//Globals
let presentation = {
	page_1: {
		content: ''
	}
}

let originX = 0;
let originY = 0;
let editing = false;
let presmode = false;
let currentPage = 1;
let selected, content, presLength;

// -- Initalize content
let init = {
	loadGrid: function() {
		let pressedDelKey = false;
		editGrid.style.width = (screen.width * 0.5) + "px";
		editGrid.style.height = (screen.height * 0.5) + "px";

		editGrid.addEventListener('click', e => {
			if (e.target === editGrid && selected != undefined) {
				domEvent.removeSelected();
			}
		});

		editGrid.addEventListener('dragenter', e => {
			e.preventDefault();
		});

		editGrid.addEventListener('dragover', e => {
			e.preventDefault();
		});

		editGrid.addEventListener('drop', e => {
			domEvent.dropFile(e);
		});

		editGrid.addEventListener('input', e => {
			// Save events coming
		});

		document.addEventListener('keydown', e => {
			if (!pressedDelKey) {
				let key = e.which || e.keyCode;
				if (key == 46) {
					if (!editing && selected != undefined) {
						selected.remove();
						domEvent.savePage();
					}
				}
				pressedDelKey = true;
			}
		});
		document.addEventListener('keyup', e => {
			pressedDelKey = false;
		});
	},

	loadToolbar: function() {
		// Add font size options to selector
		let toolbar_fontSize_selector = toolbar_fontSize.firstElementChild;
		for (let i = 1; i <= 7; i ++) {
			toolbar_fontSize_selector.innerHTML += `<option value=${i}>${i}</option>`;
		}

		toolbar_font.addEventListener('change', e => {
			document.execCommand("fontName", false, e.target.value);
		});

		toolbar_fontSize.addEventListener('change', e => {
			document.execCommand("fontSize", false, parseInt(e.target.value));
		});

		toolbar_bold.addEventListener('click', e => {
			document.execCommand('bold');
		});	

		toolbar_italic.addEventListener('click', e => {
			document.execCommand('italic');
		});

		toolbar_underline.addEventListener('click', e => {
			document.execCommand('underline');
		});

		toolbar_bulletList.addEventListener('click', e => {
			document.execCommand("insertunorderedlist");
		});

		toolbar_numberList.addEventListener('click', e => {
			document.execCommand("insertorderedlist");
		});

		toolbar_alignLeft.addEventListener('click', e => {
			document.execCommand("JustifyLeft", false);
		});

		toolbar_alignCenter.addEventListener('click', e => {
			document.execCommand("JustifyCenter", false);
		});

		toolbar_alignRight.addEventListener('click', e => {
			document.execCommand("JustifyRight", false);
		});
	},

	loadContent: function() {
		editGrid.innerHTML = presentation["page_" + currentPage].content;
		content = editGrid.getElementsByTagName("*");
		presLength = Object.keys(presentation).length;

		for (let element of content) {
			let parent = domEvent.getParent(editGrid, element);
			let name = parent.getAttribute("name");

			this.addDefaultEvents(parent);

			if (name === "text") {
				this.addEventsText(parent);
			}
		}
	},

	addDefaultEvents: function(element) {
		element.addEventListener('mousedown', e => {
			if (!editing && e.target != undefined) {
				let element = domEvent.getParent(editGrid, e.target);
				originX = e.clientX;
				originY = e.clientY;
				domEvent.setSelected(element);
				document.onmousemove = (e) => {
					domEvent.dragElement(e, selected);
				}
			}
		});

		element.addEventListener('mouseup', e => {
			domEvent.closeDragElement(e);
		});

		element.addEventListener('blur', e => {
			if (!domEvent.checkClickedToolbar()) {
				domEvent.removeEditMode(e.target);
			} else if (editing && selected != undefined) {
				selected.focus();
			}
		});
	},

	addEventsText: function(element) {
		element.addEventListener('dblclick', e => {
			let element = domEvent.getParent(editGrid, e.target);
			domEvent.setEditMode(element, true);
		});

		//Deprecated stuff
		/*element.addEventListener('keypress', e => {
			let key = e.which || e.keyCode;
			if (key == 13) {
				// This was needed when selection was not parent of selected element
				//e.preventDefault();
				//domEvent.addBr();
			}
		});*/
	}
}

// -- Button functions
let btnEvent = {
	saveCurrentPage: function() {
		domEvent.removeSelected();
	},

	prevPage: function() {
		domEvent.removeSelected();

		if (currentPage > 1) {
			currentPage--;
			init.loadContent(currentPage);
		}
	},

	nextPage: function() {
		domEvent.removeSelected();

		if (currentPage < presLength) {
			currentPage++;
			init.loadContent(currentPage);
		}
	},

	newTextBox: function() {
		domEvent.removeSelected();

		let box = document.createElement('div');
		let top = parseInt(editGrid.style.height) / 2;
		let left = parseInt(editGrid.style.width) / 2;
		box.className = 'content';
		box.setAttribute('name', 'text');
		box.style = `font-size: 25px; width: 150px; border-color: transparent; left: ${left - 75}px; top: ${top - 30}px;`;
		box.innerHTML = 'Enter text';
		editGrid.appendChild(box);
		init.addDefaultEvents(box);
		init.addEventsText(box);
	},

	exportToFile: function() {
		domEvent.removeSelected();
		
		let presObject = JSON.stringify(presentation);
		let download = document.createElement('a');
		let presName = presNameInput.value.replace(/\s/g, "").length > 0 ? presNameInput.value : 'no_name';

		download.setAttribute('download', presName + '.slyderweb');
		download.setAttribute('href', 'data:text;charset=utf-8,' + presObject);
		editGrid.appendChild(download);
		download.click();
		editGrid.removeChild(download);
	}
}

// -- Element events
let domEvent = {
	setToolbarPos: function(element) {
		let top = parseInt(element.style.top);
		let left = parseInt(element.style.left);
		let offsetTop = parseInt(editGrid.offsetTop);
		let offsetLeft = parseInt(editGrid.offsetLeft);
		textToolBar.style.top = (top + offsetTop - 50) + "px";
		textToolBar.style.left = (left + offsetLeft) + "px";
	},

	checkClickedToolbar: function() {
		let clicked = false;
		let mTarget = document.querySelectorAll(":hover");
			
		for (let element of mTarget) {
			if (element === textToolBar) {
				clicked = true;
			}
		}

		return clicked;
	},

	getParent: function(parent, element) {
		if (parent != undefined && element != undefined) {
			while (element.parentElement != parent) {
				element = element.parentElement;
			}
			return element;
		}
	},

	savePage: function() {
		presentation["page_" + currentPage].content = editGrid.innerHTML;
	},

	dropFile: function(e) {
		e.preventDefault();

		let files = e.dataTransfer.files;

		for (let obj of files) {
			if (parseInt(obj.size) > 10485760) {
				alert('Files over 10mb is not allowed');
			} else {
				if (obj.type.includes("image")) {
					let reader = new FileReader();
					
					reader.readAsDataURL(obj);

					reader.onload = (e => {
						let img = document.createElement('img');

						img.className = 'content'
						img.name = 'img';
						img.src = e.target.result;
						img.style.width = "250px";
						img.style.height = "auto";
						img.draggable = false;

						editGrid.appendChild(img);
						init.addDefaultEvents(img);
					});
				} else if (obj.name.split('.').pop() === 'slyderweb') {
					let reader = new FileReader();
					
					reader.readAsDataURL(obj);

					reader.onload = (e => {
						let result = e.target.result;
						let base64 = result.split(',').pop();
						let decoded = window.atob(base64);
						presentation = JSON.parse(decoded);
						currentPage = 1;
						init.loadContent();
					});
				} else {
					console.log(`Cannot import file '${obj.name}' :'(`);
				}
			}
		}
	},


	setEditMode: function(element, editable) {
		if(!presmode) {
			element.setAttribute("contenteditable", editable);
			element.focus();
			element.style.resize = "both";
			element.style.cursor = "auto";
			textToolBar.style.display = "inline-block";
			this.setToolbarPos(element);

			editing = true;
		}
	},

	removeEditMode: function(element) {
		if(!presmode) {
			element.contentEditable = false;
			element.style.resize = "none";
			element.style.cursor = "pointer";
			textToolBar.style.display = "none";

			editing = false;
		}
	},

	setSelected: function(element) {
		if(!presmode) {
			if (selected != undefined) {
				this.removeSelected();
			}

			selected = element;
			selected.style.borderColor = "lightblue";
		}
	},

	removeSelected: function() {
		if(!presmode) {
			if (selected != undefined) {
				selected.readonly = true;
				selected.style.borderColor = "transparent";
				selected = undefined;

				this.savePage();
			}
		}
	},

	dragElement: function(e, element) {
		if(!presmode && element != undefined) {
			document.onmouseup = this.closeDragElement;

		    let x = originX - e.clientX;
		    let y = originY - e.clientY;
		    let offsetX = element.offsetLeft - x;
		    let offsetY = element.offsetTop - y;

		    originX = e.clientX;
		    originY = e.clientY;
		    element.style.left = offsetX + "px";
		    element.style.top = offsetY + "px";
	    }
	},

	closeDragElement: function(e) {
		if(!presmode) {
			document.onmouseup = null;
			document.onmousemove = null;
		}
	},

	//Deprecated
	addBr: function() {
		if(!presmode) {
			let selection = window.getSelection();
			let range = selection.getRangeAt(0);
			let br = document.createElement("br");
			range.deleteContents();
			range.insertNode(br);
			range.setStartAfter(br);
			range.setEndAfter(br);
			range.collapse(false);
			selection.removeAllRanges();
			selection.addRange(range);
		}
	}
}

savePageBtn.onclick = btnEvent.saveCurrentPage;
loadprevBtn.onclick = btnEvent.prevPage;
loadnextBtn.onclick = btnEvent.nextPage;
newTextBoxBtn.onclick = btnEvent.newTextBox;
exportToFileBtn.onclick = btnEvent.exportToFile;

init.loadGrid();
init.loadContent();
init.loadToolbar();