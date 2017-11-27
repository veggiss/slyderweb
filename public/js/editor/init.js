// -- Initalize content
let init = {
	loadGrid: function() {
		colorPicker.style.display 	= "none";
		shadowPicker.style.display 	= "none";
		colorBgPanel.style.display 	= 'none';
		fileDialog.type 			= 'file';
		fileDialog.accept 			= '.slyderweb';
		editGrid.style.width		= (screen.width * 0.65) + 'px';
		editGrid.style.height		= (screen.height * 0.65) + 'px';
		pageNav.style.top 			= (editGrid.offsetTop + editGrid.offsetHeight) + "px";

		//We need this for hsla coloring with execCommand
		document.execCommand('styleWithCSS', false, true);

		document.addEventListener('contextmenu', fsEvents.preventMenu);
		document.addEventListener('keydown', init.keyEvents);
		document.addEventListener('mousedown', init.mouseEvent);
		
		document.addEventListener('keyup', e => {
			pressedDelKey = false;
		});

		document.addEventListener('click', e => {
			if (e.target == mySlydesModal) {
				mySlydesModal.style.display = 'none';
			}
		});

		editGrid.addEventListener('dragenter', e => {
			e.preventDefault();
		});

		editGrid.addEventListener('dragover', e => {
			e.preventDefault();
		});

		editGrid.addEventListener('drop', e => {
			e.preventDefault();
			domEvent.loadFile(e.dataTransfer.files);
		});

		presNameInput.addEventListener('input', e => {
			presentation.name = presNameInput.value.trim();
		});

		notesTxt.addEventListener('input', e => {
			presentation.body["page_" + currentPage].notes = notesTxt.innerHTML;
		});

		fileDialog.addEventListener('change', e => {
			domEvent.loadFile(e.target.files);
		});

		importBtn.addEventListener('click', e => {
			fileDialog.click();
		});

		bgColorDiv.addEventListener('click', e => {
			lastSelected = bgColorDiv;
			domEvent.toggleColorPicker(e);
		});

		gradRotationRange.addEventListener('input', e => {
			gradRotation = e.target.value;
			domEvent.setBgColor();
		});

		presmodeBtn.addEventListener('click', e => {
			fsEvents.goFullScreen(1);
		});

		previewmodeBtn.addEventListener('click', e => {
			fsEvents.goFullScreen(currentPage);
		});

		scaleRange.addEventListener('input', e => {
			if(selected != undefined) {
				let trans = init.getTransform(selected);
				selected.style.transform = `scale(${e.target.value}) rotate(${trans.rotate}deg)`;
				selected.style.transformOrigin = '0 0';
			}
		});

		rotationRange.addEventListener('input', e => {
			if(selected != undefined) {
				let trans = init.getTransform(selected);
				selected.style.transform = `scale(${trans.scale}) rotate(${e.target.value}deg)`;
				selected.style.transformOrigin = '0 0';
			}
		});
	},

	getTransform(element) {
		let scale = element.style.transform.split('scale(')[1];
		scale = scale.split(')')[0];
		let rotate = element.style.transform.split('rotate(')[1];
		rotate = rotate.split(')')[0];
		return {
			scale: parseFloat(scale),
			rotate: parseFloat(rotate)
		}
	},

	mouseEvent: function(e) {
		if ((e.target === editGrid || e.target === document.documentElement) && selected != undefined) {
			domEvent.removeSelected();
		}

		if (presmode) {
			e.preventDefault();

			let click = e.which;

			if (click === 1) {
				btnEvent.nextPage();
			} else if (click === 3) {
				btnEvent.prevPage();
			}

			fsEvents.lockCursor();
		}
	},

	keyEvents: function(e) {
		let key = e.which || e.keyCode;
		
		if (!pressedDelKey && !presmode) {
			let key = e.which || e.keyCode;
			if (key == 46) {
				if (!editing && selected != undefined) {
					selected.remove();
					domEvent.savePage();
					pressedDelKey = true;
				}
			} else if (key == 27) {
				if (colorPicker.style.display != 'none') {
					colorPicker.style.display = 'none';
					shadowPicker.style.display = 'none';
				} else if (textToolBar.style.display != 'none') {
					textToolBar.style.display = 'none';
					if (editing) {
						domEvent.removeEditMode(selected);
					}
				} else if (mySlydesModal.style.display != 'none') {
					mySlydesModal.style.display = 'none';
				} else if (colorBgPanel.style.display != 'none') {
					colorBgPanel.style.display = 'none';
				}//ctrl 17 c 67 - v 86
			} else if (e.ctrlKey && key == 67) {
				if (selected != undefined) {
					copySelected = selected.cloneNode(true);
				}
			} else if (e.ctrlKey && key == 86) {
				if (copySelected != undefined) {
					let newCopy = copySelected.cloneNode(true);
					newCopy.style.top = (editGrid.offsetTop / 2) + 'px';
					newCopy.style.left = (editGrid.offsetLeft / 2) + 'px';
					init.addDefaultEvents(newCopy);
					init.addEventsText(newCopy);
					editGrid.appendChild(newCopy);
					domEvent.setSelected(newCopy);
				}
			}
		} else if (presmode) {
			if (key === 39 || key === 37) {
				e.preventDefault();
				if (key === 39) {
					btnEvent.nextPage();
				} else if (key === 37) {
					btnEvent.prevPage();
				}
				fsEvents.lockCursor();
			}
		}
	},

	loadToolbar: function() {
		// Add font size options to selector
		let toolbar_fontSize_selector = toolbar_fontSize.firstElementChild;
		let colorPickerChildren = colorPicker.getElementsByTagName('input');
		let shadowPickerChildren = shadowPicker.getElementsByTagName('input');
		let colorPickerSat = colorPicker.querySelector('[name = sat]');
		let removeShadowBtn = document.getElementById('removeShadowBtn');

		let colors = {
			hue: 150,
			light: 50,
			alpha: 1.0,
			sat: 50
		}

		let shadows = {
			cordX: 5,
			cordY: 5,
			feather: 5
		}

		colorPickerSat.style = `background-color: hsla(${colors.hue}, ${colors.light}%, ${colors.sat}%, ${colors.alpha});`;

		for (let i = 1; i <= 7; i ++) {
			toolbar_fontSize_selector.innerHTML += `<option value=${i}>${i}</option>`;
		}

		toolbar_font.addEventListener('change', e => {
			document.execCommand("fontName", false, e.target.value);
		});

		toolbar_fontSize.addEventListener('change', e => {
			document.execCommand("fontSize", false, parseInt(e.target.value));
		});

		toolbar_bold.addEventListener('mousedown', e => {
			document.execCommand('bold');
		});	

		toolbar_italic.addEventListener('mousedown', e => {
			document.execCommand('italic');
		});

		toolbar_underline.addEventListener('mousedown', e => {
			document.execCommand('underline');
		});

		toolbar_shadow.addEventListener('mousedown', e => {
			lastSelected = toolbar_shadow;
			domEvent.toggleShadowPicker();
		});

		toolbar_txtColor.addEventListener('mousedown', e => {
			lastSelected = toolbar_txtColor;
			domEvent.toggleColorPicker(e);
		});

		toolbar_hiliteColor.addEventListener('mousedown', e => {
			lastSelected = toolbar_hiliteColor;
			domEvent.toggleColorPicker(e);
		});

		toolbar_bgColor.addEventListener('mousedown', e => {
			lastSelected = toolbar_bgColor;
			domEvent.toggleColorPicker(e);
		});

		for (let element of colorPickerChildren) {
			element.addEventListener('input', e => {
				let name = element.parentElement.getAttribute('name');
				colors[name] = element.value;
				
				let shadow = `${shadows.cordX}px ${shadows.cordY}px ${shadows.feather}px`;
				let hsla = `hsla(${colors.hue}, ${colors.light}%, ${colors.sat}%, ${colors.alpha})`;
				colorPickerSat.style.backgroundColor = hsla;

				if (lastSelected === toolbar_txtColor) {
					document.execCommand('foreColor', false, hsla);
				} else if (lastSelected === toolbar_hiliteColor) {
					document.execCommand('HiliteColor', false, hsla);
				} else if (lastSelected === toolbar_shadow) {
					selected.style.textShadow = `${shadow} ${hsla}`;
				} else if (lastSelected === toolbar_bgColor) {
					selected.style.backgroundColor = hsla;
				} else if (lastSelected === bgColorDiv) {
					bgColorDiv.style.backgroundColor = hsla;
					presentation.bgColors[0] = hsla;
					domEvent.setBgColor();
				} else if (lastSelected.getAttribute('name') == 'gradientColor') {
					let gradChildren = gradientListDiv.querySelectorAll('[name = gradientColor]');
					let index;

					gradChildren.forEach((item, i) => {
						if(lastSelected === item) {
							index = i;
						}
					});

					if (index != undefined) {
						presentation.bgColors[index + 1] = hsla;
						lastSelected.style.backgroundColor = hsla;
						domEvent.setBgColor();
					}
				}
			});
		}

		for (let element of shadowPickerChildren) {
			element.addEventListener('input', e => {
				let name = element.parentElement.getAttribute('name');
				shadows[name] = element.value;

				let shadow = `${shadows.cordX}px ${shadows.cordY}px ${shadows.feather}px`;
				let hsla = `hsla(${colors.hue}, ${colors.light}%, ${colors.sat}%, ${colors.alpha})`;

				if (lastSelected === toolbar_shadow) {
					selected.style.textShadow = `${shadow} ${hsla}`;
				}
			});
		}

		removeShadowBtn.addEventListener('click', e => {
			selected.style.textShadow = '';
		});

		toolbar_bulletList.addEventListener('mousedown', e => {
			document.execCommand("insertunorderedlist");
		});

		toolbar_numberList.addEventListener('mousedown', e => {
			document.execCommand("insertorderedlist");
		});

		toolbar_alignLeft.addEventListener('mousedown', e => {
			document.execCommand("JustifyLeft", false);
		});

		toolbar_alignCenter.addEventListener('mousedown', e => {
			document.execCommand("JustifyCenter", false);
		});

		toolbar_alignRight.addEventListener('mousedown', e => {
			document.execCommand("JustifyRight", false);
		});
	},

	loadContent: function() {
		let presObject = presentation.body["page_" + currentPage];
		notesTxt.innerHTML = "";

		editGrid.innerHTML = presObject.content;
		presNameInput.value = presentation.name;
		notesTxt.innerHTML = presObject.notes;

		content = editGrid.getElementsByTagName("*");
		presLength = Object.keys(presentation.body).length;
		currentPageTxt.innerHTML = `filter_${currentPage}filter_${presLength}`;
		domEvent.setBgColor();
		init.transformScale();

		for (let element of content) {
			let parent = domEvent.getParent(editGrid, element);
			let name = parent.getAttribute("name");

			this.addDefaultEvents(parent);

			if (name === "text") {
				this.addEventsText(parent);
			}
		}
	},

	loadPresList() {
		Promise.resolve(util.getPresList()).then((res) => {
			if (res) {
				mySlydesContent.innerHTML = "";
				res.forEach(item => {
					let optionDom = document.createElement('section');
					optionDom.classList.add('mySlydesContent')
					optionDom.innerHTML = "&emsp;Title: " + item.name;
					mySlydesContent.appendChild(optionDom);
					optionDom.addEventListener('click', e => {
						btnEvent.loadSelectedPres(item.name, item.id);
						mySlydesModal.style.display = 'none';
					});
					mySlydesModal.style.display = 'inline-block';
				});
			}
		});
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
			e.preventDefault();

			let element = domEvent.getParent(editGrid, e.target);
			domEvent.setEditMode(element, true);
		});
	},

	updateBgSidebar: function() {
		domEvent.removeGradColors();

		presentation.bgColors.forEach((item, i) => {
			if (i > 0) {
				let gradDom = btnEvent.addGradient(false);
				gradDom.style.backgroundColor = item;
			}
		});
	},

	transformScale: function() {
		let max = Math.max(presentation.originHeight, screen.height);
		let min = Math.min(presentation.originHeight, screen.height);
		let scale;

		if (screen.height < presentation.originHeight) {
			scale = min / max;
		} else {
			scale = max / min;
		}

		editGrid.childNodes.forEach(item => {
			let trans = init.getTransform(item);
			item.style.transform = `scale(${scale * trans.scale}) rotate(${trans.rotate}deg)`;
			item.style.transformOrigin = '0 0';
			item.style.top = (parseInt(item.style.top) * scale) + 'px';
			item.style.left = (parseInt(item.style.left) * scale) + 'px';
		});
	},

	newPresObject: function() {
		return {
			uid: '',
			author: '',
			name: '',
			presmode: 'false',
			bgColors: ['white'],
			originHeight: screen.height,
			body: {
				page_1: {
					content: '',
					notes: ''
				}
			}
		}
	}
}