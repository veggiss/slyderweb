// -- Element events
let domEvent = {
	// Updates the gradient labels in side bar
	removeGradColors: function() {
		let gradDomList = gradientListDiv.querySelectorAll('div[name="gradientColor"]');

		gradDomList.forEach(item => {
			item.remove();
		});
	},

	//Sets background color to the editor
	setBgColor: function() {
		let gradDomList = gradientListDiv.querySelectorAll('div[name="gradientColor"]');
		let colorsLength = presentation.bgColors.length - 1;
		//Prepare a string to add to editor background if there are more than one color (gradients)
		let gradString = `linear-gradient(${gradRotation}deg,${presentation.bgColors[0]},`;
		presentation.bgColors.forEach((item, i) => {
			if (i == 0) {
				editGrid.style.background = "";
				editGrid.style.backgroundColor = item;
				bgColorDiv.style.backgroundColor = item;
			} else if (i == colorsLength) {
				gradString += item + ')';
				editGrid.style.background = gradString;
			} else {
				gradString += item + ',';
			}
		});
	},

	// Toggle the picker; say that three times very fast
	toggleColorPicker: function(e) {
		if (colorPicker.style.display == "none") {
			shadowPicker.style.display = "none";
			let top = parseInt(textToolBar.style.top);
			let left = parseInt(textToolBar.style.left);
			colorPicker.style.top = (e.clientY - 220) + "px";
			colorPicker.style.left = (e.clientX) + "px";
			colorPicker.style.display = "inline-block";

			if(colorPicker.offsetTop < 0) {
				colorPicker.style.top = 0;
			}

		} else {
			colorPicker.style.display = "none";
			shadowPicker.style.display = "none";
		}
	},

	toggleShadowPicker: function() {
		if (shadowPicker.style.display == "none" && colorPicker.style.display == "none") {
			let top = parseInt(textToolBar.style.top);
			let left = parseInt(textToolBar.style.left);
			colorPicker.style.top = (top - 220) + "px";
			colorPicker.style.left = (left) + "px";
			colorPicker.style.display = "inline-block";
			shadowPicker.style.top = colorPicker.style.top;
			shadowPicker.style.left = (left + parseInt(colorPicker.offsetWidth) + 2) + "px";
			shadowPicker.style.display = "inline-block";

			if(colorPicker.offsetTop < 0) {
				colorPicker.style.top = 0;
				shadowPicker.style.top = 0;
			}
		} else {
			colorPicker.style.display = "none";
			shadowPicker.style.display = "none";
		}
	},

	//Sets the toolbar position over selected element
	setToolbarPos: function(element) {
		let top = element.offsetTop;
		let left = element.offsetLeft;
		let offsetTop = parseInt(editGrid.offsetTop);
		let offsetLeft = parseInt(editGrid.offsetLeft);
		textToolBar.style.top = (top + offsetTop - 50) + "px";
		textToolBar.style.left = (left + offsetLeft) + "px";

		if ((textToolBar.offsetLeft + textToolBar.offsetWidth) > window.innerWidth) {
			textToolBar.style.left = textToolBar.offsetLeft - ((textToolBar.offsetLeft + textToolBar.offsetWidth) - window.innerWidth) + "px";
		}
	},

	// Checks if the mouse was hovering the toolbar when clicked
	checkClickedToolbar: function() {
		let clicked = false;
		let mTarget = document.querySelectorAll(":hover");
			
		for (let element of mTarget) {
			if (element === textToolBar || element === colorPicker || element === shadowPicker) {
				clicked = true;
			}
		}

		return clicked;
	},

	// Iterate backwards recursively(?) to see if the parent matches the element
	// This is mostly used to select items correctly
	getParent: function(parent, element) {
		if (parent != undefined && element != undefined) {
			while (element.parentElement != parent) {
				element = element.parentElement;
			}
			return element;
		}
	},

	// Save the page to the presentation object, and cache it
	savePage: function() {
		let presObject = presentation.body["page_" + currentPage];
		presObject.content = editGrid.innerHTML;
		presObject.notes = notesTxt.innerHTML;
		localStorage.setItem('presentation', JSON.stringify(presentation));
	},

	// Adds a new image to the editor
	newImage: function(src) {
		let img = document.createElement('img');

		img.className = 'content'
		img.name = 'img';
		img.src = src;
		img.style.transform = 'scale(1) rotate(0)';
		img.style.width = "250px";
		img.style.height = "auto";
		img.style.zIndex = "3";
		img.draggable = false;
		//Firefox is hipster
		img.ondragstart = e => {
			return false;
		}

		return img;
	},

	// Adds a new iframe element to the editor
	newIframe: function(src) {
		let container = document.createElement('div');
		let iframe = document.createElement('iframe');

		container.className = 'content'
		iframe.src = src;
		container.style.transform = 'scale(1) rotate(0)';
		iframe.draggable = false;
		iframe.style.height = '250px';
		container.draggable = false;
		container.appendChild(iframe);
		container.style.width = "auto";
		container.style.height = ((parseInt(iframe.style.height)) + 50) + 'px';
		container.style.zIndex = "3";

		return container;
	},

	// Loads either image or presentation flatfiles
	loadFile: function(files) {
		for (let obj of files) {
			if (parseInt(obj.size) > 26214400) {
				alert('That file is be too big!');
			} else {
				if (obj.type.includes('image')) {
					let reader = new FileReader();
					
					reader.readAsDataURL(obj);

					reader.onload = (e => {
						let img = domEvent.newImage(e.target.result);
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
						presentation = JSON.parse(atob(decoded));
						currentPage = 1;
						init.loadContent();
					});
				} else {
					alert(`Could not import file '${obj.name}' :(`);
				}
			}
		}
	},

	// Sets an element to editable or uneditabuleble
	setEditMode: function(element, editable) {
		if(!presmode && !editing) {
			element.setAttribute("contenteditable", editable);
			element.focus();
			element.style.resize = "both";
			element.style.cursor = "auto";
			textToolBar.style.display = "inline-block";
			this.setToolbarPos(element);

			editing = true;
		}
	},

	// Removes edit mode
	removeEditMode: function(element) {
		if(!presmode && editing) {
			element.contentEditable = false;
			element.style.resize = "none";
			element.style.cursor = "pointer";
			textToolBar.style.display = "none";
			colorPicker.style.display = "none";
			shadowPicker.style.display = "none";

			editing = false;
		}
	},

	// Sets the passed element as the selected element
	setSelected: function(element) {
		if(!presmode) {
			if (selected != undefined) {
				this.removeSelected();
			}

			selected = element;
			selected.style.borderColor = "lightblue";
		}
	},

	//Removes the selected item and declare the variable undefined
	removeSelected: function() {
		if(!presmode) {
			if (selected != undefined) {
				this.removeEditMode(selected);

				selected.readonly = true;
				selected.style.borderColor = "transparent";
				selected = undefined;

				this.savePage();
			}
		}
	},

	// Updates an element to the mouse cursor
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

	// Close dragging on mouse up
	closeDragElement: function(e) {
		if(!presmode) {
			document.onmouseup = null;
			document.onmousemove = null;
		}
	}
}