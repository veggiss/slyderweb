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

	editGrid.style.bottom = "0";
	editGrid.style.right = "0"
	editGrid.style.zoom = (screen.height / 360) * 100 + "%";
	editGrid.style.borderStyle = "none";
	for (let e of content) {
		e.style.borderStyle = "none";
	}
	presmode = true;

}

function exitHandler() {
	function resetSize() {
		editGrid.style.bottom = "50px";
		editGrid.style.right = "50px"
		editGrid.style.zoom = "100%";
		editGrid.style.borderStyle = "dashed";
		for (let e of content) {
			e.style.borderStyle = "solid";
		}
		presmode = false;
	}

    if (document.webkitIsFullScreen === false) {
        resetSize();
    } else if (document.mozFullScreen === false) {
        resetSize();
    } else if (document.msFullscreenElement === false) {
        resetSize();
    } else if (document.fullscreenElement === false) {
    	resetSize();
    }
}