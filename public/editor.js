let editGrid = document.getElementById('editGrid');
let content = editGrid.getElementsByTagName("*");

let originX = 0;
let originY = 0;
let editing = false;
let selected;

editGrid.addEventListener('mousedown', e => {
	if (e.target === editGrid) {
		removeSelected();
	}
});

for (let e of content) {
	addEventsText(e);
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

function setEditMode(element) {
	element.setAttribute("contenteditable", true);
	element.focus();
	element.style.resize = "both";
	editing = true;
}

function removeEditMode(element) {
	element.contentEditable = false;
	element.style.resize = "none";
	editing = false;
}

function setSelected(element) {
	if (selected != undefined) {
		selected.style.borderColor = "black";
	}

	selected = element;
	selected.style.borderColor = "blue";
}

function removeSelected() {
	if (selected != undefined) {
		selected.readonly = true;
		selected.style.borderColor = "black";
		selected = undefined;
	}
}

function dragElement(e, ele) {
	document.onmouseup = closeDragElement;

    let x = originX - e.clientX;
    let y = originY - e.clientY;
    originX = e.clientX;
    originY = e.clientY;
    ele.style.left = (ele.offsetLeft - x) + "px";
    ele.style.top = (ele.offsetTop - y) + "px";
}

function closeDragElement(e) {
	document.onmouseup = null;
	document.onmousemove = null;
}

function addBr() {
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