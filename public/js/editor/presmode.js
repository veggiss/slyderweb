let fsEvents = {
	browserType: 'default',

	preventMenu: function(e) {
		if (presmode) {
			e.preventDefault();
		}
	},

	goFullScreen: function(page) {
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

	lockGrid: function(page, browserType) {
		domEvent.removeSelected();

		lastPage = currentPage;
		currentPage = page;
		presHeight = editGrid.style.height;
		presWidth = editGrid.style.width;
		init.loadContent();
		fsEvents.lockCursor();

		editGrid.style.borderStyle = "none";
		editGrid.style.width = screen.width + 'px';

		//Firefox can't use zoom attribute, so we need to transform all elements to scale
		if (browserType === 'moz') {
			fsEvents.firefoxTransformScale();
		} else {
			editGrid.style.left = "0px";
			editGrid.style.top = "0px";
			editGrid.style.zoom = (screen.height / editGrid.offsetHeight) * 100 +"%";
		}
		presmode = true;
		localStorage.setItem('livemode', 'true');
		localStorage.setItem('currentPage', currentPage);
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

		if (browserType != 'moz') {
			editGrid.style.zoom = "100%";
		}

		editGrid.style.height = presHeight;
		editGrid.style.width = presWidth;
		pageNav.style.top = (editGrid.offsetTop + editGrid.offsetHeight) + "px";
		presmode = false;
		localStorage.setItem('livemode', 'false');
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
	},

	firefoxTransformScale: function() {
		if(browserType === 'moz') {
			let scale = screen.height / parseInt(editGrid.style.height);
			editGrid.childNodes.forEach(item => {
				let trans = init.getTransform(item);
				item.style.transform = `scale(${scale * trans.scale}) rotate(${trans.rotate}deg)`;
				item.style.transformOrigin = '0 0';
				item.style.top = ((item.offsetTop * scale)) + 'px';
				item.style.left = ((item.offsetLeft * scale)) + 'px';
			});
		}
	}
}
