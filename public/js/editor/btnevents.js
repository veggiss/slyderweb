// -- Button functions
let btnEvent = {
	toggleBgPanel: function() {
		if(colorBgPanel.style.display === 'none') {
			colorBgPanel.style.display = 'inline-block';
		} else {
			colorBgPanel.style.display = 'none';
			textToolBar.style.display = 'none';
		}
	},

	addGradient: function(pushNew) {
		let div = document.createElement('div');
		let span = document.createElement('span');

		span.className = 'bg-colors';
		div.appendChild(span);
		gradientListDiv.appendChild(div);
		div.style.backgroundColor = 'white';
		div.setAttribute('name', 'gradientColor');
		if (pushNew != false ) {
			presentation.bgColors.push('white');
			domEvent.setBgColor();
		}

		div.addEventListener('click', e => {
			lastSelected = div;
			domEvent.toggleColorPicker(e);
		});

		return div;
	},

	removeGradient: function() {
		let gradDomList = gradientListDiv.querySelectorAll('div[name="gradientColor"]');

		if (gradDomList.length > 0) {
			gradDomList[gradDomList.length - 1].remove();
			presentation.bgColors.pop();
			domEvent.setBgColor();
		}
	},

	openMySlydes: function() {
		init.loadPresList();
	},

	openTemplates: function() {
		if (templatesModal.style.display == 'none') {
			templatesModal.style.display = 'inline-block';
		} else {
			templatesModal.style.display = 'none';
		}
	},

	loadTemplate(type, item) {
		if (type == 'arrange') {
			let presObject = presentation.body['page_' + currentPage];
			let templateObject = template_arrange.body[item.name];
			let templateContent = templateObject.content;
			if (template_arrange.originHeight != screen.height) {
				templateContent = init.transformTemplate(1080, templateObject.content);
			}
			presObject.content += templateContent;
			init.loadContent();
		} else if (type == 'background') {
			gradRotation = template_background[item.name].rotation;
			presentation.bgColors = template_background[item.name].color;
			domEvent.setBgColor();
		}
		templatesModal.style.display = 'none';
	},

	loadSelectedPres: function(uid) {
	    if (confirm("Save changes?") === true) {
	        btnEvent.saveCurrentPage();
	    }

		if (uid) {
			fetch(util.newRequest('GET', '/user/presentation', {
				uid: uid
			})).then(res => {
			    return res.json();
			}).then(res => {
				if (util.isNotEmpty(res.uid.toString(), res.author, res.name)) {
					currentPage = 1;
					presentation.uid = res.uid;
					presentation.author = res.author;
					presentation.name = res.name;
					presentation.presmode = 'false'
					presentation.bgColors = res.bgColors;
					presentation.originHeight = res.originHeight;
					presentation.body = res.body;
					init.loadContent();
				}
			}).catch(err => {
			    util.printError(err);
			});
		} else {
			util.printError('Could not get presentation: undefined values');
		}
	},

	deletePresentation: function() {
		if (presentation.uid) {
			if (confirm("Are you sure you want to delete slyde?") === true) {
				fetch(util.newRequest('DELETE', '/user/presentation', {
					uid: presentation.uid,
					name: presentation.name
				})).then(res => {
				    if(res.status === 200) {
				    	console.log('Slyde deleted');
				    }
				}).catch(err => {
				    util.printError(err);
				});
			}
		}
	},

	saveCurrentPage: function() {
		domEvent.removeSelected();

		fetch(util.newRequest('POST', '/user/presentation', {
			presentation: presentation
		})).then(res => {
			if (res.status == 401) {
				alert('You need to be logged in to do that!');
			} else {
				return res.json();
			}
		}).then(res => {
			if (res.uid) {
				presentation.uid = res.uid;
				presentation.author = res.author;
				presentation.name = res.name;
			}
		}).catch(err => {
		    util.printError(err);
		});
	},

	newPresentation: function() {
	    if (confirm("Are you sure?") === true) {
		    if (confirm("Save changes?") === true) {
		        btnEvent.saveCurrentPage();
		    }

		    currentPage = 1;
		    domEvent.removeGradColors();
		    presentation = init.newPresObject();
		    init.loadContent();
	    }
	},

	prevPage: function() {
		domEvent.removeSelected();
		if (currentPage > 1) {
			currentPage--;
			init.loadContent();
		}
	},

	nextPage: function() {
		domEvent.removeSelected();

		presLength = Object.keys(presentation.body).length;

		if (currentPage < presLength) {
			currentPage++;
			init.loadContent();
		}
	},

	newPage: function() {
		for (let i = presLength; i >= currentPage + 1; i--) {
			presentation.body['page_' + (i + 1)] = presentation.body['page_' + i];
		}

		presentation.body['page_' + (currentPage + 1)] = {
			content: '', 
			notes: ''
		};

		btnEvent.nextPage();
	},

	deletePage: function() {
		if (confirm("Are you sure you want to delete page?") === true) {
			let presLength = Object.keys(presentation.body).length;

			if (presLength == 1 && presLength == 1) {
				presentation.body['page_' + currentPage].content = '';
				presentation.body['page_' + currentPage].notes = '';
			} else {
				for (let i = currentPage; i <= presLength; i++) {
					presentation.body['page_' + i] = presentation.body['page_' + (i + 1)];
				}

				delete presentation.body['page_' + presLength];

				if (presLength == currentPage) {
					currentPage--;
				}
			}

			init.loadContent();
		}
	},

	layerUp: function() {
		if (selected) {
			let zindex = parseInt(selected.style.zIndex);
			if (zindex < 4) {
				zindex++;
				selected.style.zIndex = zindex.toString();
			}
		}
	},

	layerDown: function() {
		if (selected) {
			let zindex = parseInt(selected.style.zIndex);
			if (zindex > 1) {
				zindex--;
				selected.style.zIndex = zindex.toString();
			}
		}
	},

	newTextBox: function() {
		domEvent.removeSelected();

		let box = document.createElement('div');
		let top = parseInt(editGrid.style.height) / 2;
		let left = parseInt(editGrid.style.width) / 2;
		box.className = 'content';
		box.setAttribute('name', 'text');
		box.style = `font-size: 25px; width: 150px; z-index: 3; border-color: transparent; left: ${left - 75}px; top: ${top - 30}px; list-style-position: inside; transform: scale(1) rotate(0)`;
		box.innerHTML = 'Enter text';
		editGrid.appendChild(box);
		init.addDefaultEvents(box);
		init.addEventsText(box);
	},

	exportToFile: function() {
		domEvent.removeSelected();
		
		let presObject = btoa(JSON.stringify(presentation));
		let download = document.createElement('a');
		let presName = presNameInput.value.replace(/\s/g, "").length > 0 ? presNameInput.value : 'no_name';

		download.setAttribute('download', presName + '.slyderweb');
		download.setAttribute('href', 'data:text;charset=utf-8,' + presObject);
		editGrid.appendChild(download);
		download.click();
		editGrid.removeChild(download);
	}
}