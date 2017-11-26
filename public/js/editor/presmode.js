let fsEvents = {
	preventMenu: function(e) {
		if (presmode) {
			e.preventDefault();
		}
	},

	goFullScreen: function(page) {
		let browser;

		if(editGrid.requestFullscreen) {
			document.addEventListener('fullscreenchange', fsEvents.exitHandler);
			editGrid.requestFullscreen();
			browserType = 'default';
		} else if(editGrid.mozRequestFullScreen) {
			document.addEventListener('mozfullscreenchange', fsEvents.exitHandler);
			editGrid.mozRequestFullScreen();
			browserType = 'moz';
		} else if(editGrid.webkitRequestFullscreen) {
			document.addEventListener('webkitfullscreenchange', fsEvents.exitHandler);
			editGrid.webkitRequestFullscreen();
			browserType = 'webkit';
		} else if(editGrid.msRequestFullscreen) {
			document.addEventListener('MSFullscreenChange', fsEvents.exitHandler);
			editGrid.msRequestFullscreen();
			browserType = 'ms';
		}

		fsEvents.lockGrid(page, browserType);
	},

	//Issue #4 Firefox not scaling content properly
	lockGrid: function(page, browserType) {
		domEvent.removeSelected();

		lastPage = currentPage;
		currentPage = page;
		init.loadContent(currentPage);

		fsEvents.lockCursor();

		editGrid.style.borderStyle = "none";

		//Since firefox is hipster, it needs a special transformation for scaling
		if (browserType === 'moz') {
			let scale = screen.height / parseInt(editGrid.style.height);
			editGrid.style.transform = `scale(${scale}`;
			editGrid.style.transformOrigin = '0 0';
			editGrid.style.top = (parseInt(editGrid.style.top) * scale) + 'px';
			editGrid.style.left = (parseInt(editGrid.style.left) * scale) + 'px';
			editGrid.childNodes.forEach(item => {
				item.style.transform = editGrid.style.transform;
				item.style.transformOrigin = '0 0';
				item.style.top = (parseInt(item.style.top) * scale) + 'px';
				item.style.left = (parseInt(item.style.left) * scale) + 'px';
			});
		} else {
			editGrid.style.left = "0px";
			editGrid.style.zoom = (screen.height / parseInt(editGrid.style.height)) * 100 + "%";
		}


		presmode = true;
	},

	lockCursor: function() {
		for (let e of content) {
			let element = domEvent.getParent(editGrid, e);
			element.style.cursor = "default";
		}
	},

	resetGrid: function() {
		currentPage = lastPage;
		init.loadContent(currentPage);

		for (let e of content) {
			let element = domEvent.getParent(editGrid, e);
			element.style.borderStyle = "solid";
			element.style.cursor = "pointer";
		}

		editGrid.style.left = "15%";
		editGrid.style.borderStyle = "dashed";

		if (browserType === 'moz') {
			editGrid.style.transform = `scale(${1}`;
			editGrid.style.transformOrigin = '0 0';
			let children = editGrid.childNodes;
			children.forEach(item => {
				item.style.transform = editGrid.style.transform;
				item.style.transformOrigin = '0 0';
			});
		} else {
			editGrid.style.zoom = "100%";
		}

		presmode = false;
	},

	exitHandler: function() {
	    if (document.webkitIsFullScreen === false) {
	        fsEvents.resetGrid();
	    } else if (document.mozFullScreen === false) {
	        fsEvents.resetGrid();
	    } else if (document.msFullscreenElement === false) {
	        fsEvents.resetGrid();
	    } else if (document.fullscreenElement === false) {
	    	fsEvents.resetGrid();
	    }
	}
}
