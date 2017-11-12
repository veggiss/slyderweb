let presmodeBtn = document.getElementById("presmodeBtn");

presmodeBtn.onclick = goFullScreen;

function goFullScreen() {
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

	lockGrid();
}

function lockGrid() {
	if (selected != undefined) {
		domEvent.removeSelected();
	}

	for (let e of content) {
		let element = domEvent.getParent(editGrid, e);
		element.style.borderStyle = "none";
		element.style.cursor = "default";
	}

	editGrid.style.right = "0px";
	editGrid.style.zoom = (screen.height / parseInt(editGrid.style.height)) * 100 + "%";
	editGrid.style.borderStyle = "none";

	presmode = true;
}

function resetGrid() {
	for (let e of content) {
		let element = domEvent.getParent(editGrid, e);
		element.style.borderStyle = "solid";
		element.style.cursor = "pointer";
	}

	editGrid.style.right = "-25%";
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