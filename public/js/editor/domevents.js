// -- Element events
let domEvent = {
	removeGradColors: function() {
		let gradDomList = gradientListDiv.querySelectorAll('div[name="gradientColor"]');

		gradDomList.forEach(item => {
			item.remove();
		});
	},

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

	toggleColorPicker: function(e) {
		if (colorPicker.style.display == "none") {
			shadowPicker.style.display = "none";
			let top = parseInt(textToolBar.style.top);
			let left = parseInt(textToolBar.style.left);
			colorPicker.style.top = (e.clientY - 220) + "px";
			colorPicker.style.left = (e.clientX) + "px";
			colorPicker.style.display = "inline-block";
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
		} else {
			colorPicker.style.display = "none";
			shadowPicker.style.display = "none";
		}
	},

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
			if (element === textToolBar || element === colorPicker || element === shadowPicker) {
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
		let presObject = presentation.body["page_" + currentPage];
		presObject.content = editGrid.innerHTML;
		presObject.notes = notesTxt.innerHTML;
	},

	loadFile: function(files) {
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
						img.style.transform = 'scale(1) rotate(0)';
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
						presentation = JSON.parse(atob(decoded));
						currentPage = 1;
						init.updateBgSidebar();
						init.loadContent();
					});
				} else {
					alert(`Could not import file '${obj.name}' :(`);
				}
			}
		}
	},

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
				this.removeEditMode(selected);

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
	}
}