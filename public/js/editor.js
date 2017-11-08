let editGrid = document.getElementById('editGrid');

let originX = 0;
let originY = 0;
let editing = false;
let presmode = false;
let selected, content;

loadContent(1);

editGrid.addEventListener('mousedown', e => {
	if (e.target === editGrid) {
		removeSelected();
	}
});

function loadContent(page) {
	editGrid.innerHTML = presentation["page_" + page];
	content = editGrid.getElementsByTagName("*");


	for (let e of content) {
		let name = e.getAttribute("name");
		if (name === "text") {
			addEventsText(e);
		}
	}

	function addEventsText(e) {
		e.addEventListener('dblclick', e => {
			setEditMode(e.target);
		});

		e.addEventListener('keypress', e => {
			let key = e.which || e.keyCode;
			if (key == 13) {
				event.preventDefault();
				addBr();
			}
		});

		e.addEventListener('mousedown', e => {
			if (!editing) {
				originX = e.clientX;
				originY = e.clientY;
				setSelected(e.target);
				document.onmousemove = (e) => {
					dragElement(e, selected);
				}
			}
		});

		e.addEventListener('mouseup', e => {
			closeDragElement(e);
		});

		e.addEventListener('blur', e => {
			removeEditMode(e.target);
		});
	}
}

function setEditMode(element) {
	if(!presmode) {
		element.setAttribute("contenteditable", true);
		element.focus();
		element.style.resize = "both";
		editing = true;
	}
}

function removeEditMode(element) {
	if(!presmode) {
		element.contentEditable = false;
		element.style.resize = "none";
		editing = false;
	}
}

function setSelected(element) {
	if(!presmode) {
		if (selected != undefined) {
			selected.style.borderColor = "black";
		}

		selected = element;
		selected.style.borderColor = "blue";
	}
}

function removeSelected() {
	if(!presmode) {
		if (selected != undefined) {
			selected.readonly = true;
			selected.style.borderColor = "black";
			selected = undefined;
		}
	}
}

function dragElement(e, ele) {
	if(!presmode) {
		document.onmouseup = closeDragElement;

	    let x = originX - e.clientX;
	    let y = originY - e.clientY;
	    originX = e.clientX;
	    originY = e.clientY;
	    ele.style.left = (ele.offsetLeft - x) + "px";
	    ele.style.top = (ele.offsetTop - y) + "px";
    }
}

function closeDragElement(e) {
	if(!presmode) {
		document.onmouseup = null;
		document.onmousemove = null;
	}
}

function addBr() {
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