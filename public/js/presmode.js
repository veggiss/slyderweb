let presmodeBtn = document.getElementById("presmodeBtn");
let page = document.getElementById("editGrid");
let isFullscreen = false;

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

	isFullscreen = true;
}

function exitHandler()
{
    if (isFullscreen)
    {
    	console.log("lol");
    	isFullscreen = false;
    }
}