let presmodeBtn = document.getElementById("presmodeBtn");
let page = document.getElementById("editGrid");
let sw = screen.width;
let sh = screen.height;
let scaleRatio = (sh / 360) * 100;

presmodeBtn.onclick = goFullScreen;



function goFullScreen() {
	if(page.requestFullscreen) {
		document.addEventListener('fullscreenchange', exitHandler);
		page.requestFullscreen();
	} else if(page.mozRequestFullScreen) {
		document.addEventListener('mozfullscreenchange', exitHandler);
		page.mozRequestFullScreen();
	} else if(page.webkitRequestFullscreen) {
		document.addEventListener('webkitfullscreenchange', exitHandler);
		page.webkitRequestFullscreen();
	} else if(page.msRequestFullscreen) {
		document.addEventListener('MSFullscreenChange', exitHandler);
		page.msRequestFullscreen();
	}

	page.style.bottom = "0";
	page.style.right = "0"
	page.style.zoom = scaleRatio + "%";
	page.style.borderStyle = "none";
	for (let e of content) {
		e.style.borderStyle = "none";
	}
	presmode = true;

}

function exitHandler()
{
	function resetSize() {
		page.style.bottom = "50px";
		page.style.right = "50px"
		page.style.zoom = "100%";
		page.style.borderStyle = "dashed";
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