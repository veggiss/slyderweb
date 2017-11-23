let presmodeBtn = document.getElementById('presmodeBtn');
let previewmodeBtn = document.getElementById('previewmodeBtn');
let lastPage;

presmodeBtn.addEventListener('click', function(){
    goFullScreen(1);
});

previewmodeBtn.addEventListener('click', function(){
    goFullScreen(currentPage);
});

let fsEvents = {
	nextPageKeys: function(e) {
		if (presmode) {
			e.preventDefault();
			
			let key = e.which || e.keyCode;
			if (key === 39) {
				btnEvent.nextPage();
			} else if (key === 37) {
				btnEvent.prevPage();
			}

			lockCursor();
		}
	},

	nextPageClick: function(e) {
		if (presmode) {
			e.preventDefault();

			let click = e.which;

			if (click === 1) {
				btnEvent.nextPage();
			} else if (click === 3) {
				btnEvent.prevPage();
			}

			lockCursor();
		}
	},

	preventMenu: function(e) {
		if (presmode) {
			e.preventDefault();
		}
	}
}

function goFullScreen(page) {
	lockGrid(page);

	if(editGrid.requestFullscreen) {
		document.addEventListener('fullscreenchange', exitHandler);
		editGrid.requestFullscreen();
	} else if(editGrid.mozRequestFullScreen) {
		document.addEventListener('mozfullscreenchange', exitHandler);
		editGrid.mozRequestFullScreen();
	} else if(editGrid.webkitRequestFullscreen) {
		document.addEventListener('webkitfullscreenchange', exitHandler);
		editGrid.webkitRequestFullscreen();
	} else if(editGrid.msRequestFullscreen) {
		document.addEventListener('MSFullscreenChange', exitHandler);
		editGrid.msRequestFullscreen();
	}
}

//Issue #4 Firefox not scaling content properly
function lockGrid(page) {
	domEvent.removeSelected();

	lastPage = currentPage;
	currentPage = page;
	init.loadContent(currentPage);

	lockCursor();

	editGrid.style.right = "0px";
	editGrid.style.borderStyle = "none";
	editGrid.style.zoom = (screen.height / parseInt(editGrid.style.height)) * 100 + "%";

	presmode = true;
}

function lockCursor() {
	for (let e of content) {
		let element = domEvent.getParent(editGrid, e);
		element.style.cursor = "default";
	}
}

function resetGrid() {
	currentPage = lastPage;
	init.loadContent(currentPage);

	for (let e of content) {
		let element = domEvent.getParent(editGrid, e);
		element.style.borderStyle = "solid";
		element.style.cursor = "pointer";
	}

	editGrid.style.right = "-5%";
	editGrid.style.zoom = "100%";
	editGrid.style.borderStyle = "dashed";

	presmode = false;
}

function exitHandler() {
    if (document.webkitIsFullScreen === false) {
        resetGrid();
    } else if (document.mozFullScreen === false) {
        resetGrid();
    } else if (document.msFullscreenElement === false) {
        resetGrid();
    } else if (document.fullscreenElement === false) {
    	resetGrid();
    }
}

document.addEventListener('keydown', fsEvents.nextPageKeys);
document.addEventListener('mousedown', fsEvents.nextPageClick);
document.addEventListener('contextmenu', fsEvents.preventMenu);
