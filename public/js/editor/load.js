//Editor area
let editGrid				= document.getElementById('editGrid');
//Sidebar buttons
let newPresentationBtn 		= document.getElementById('newPresentationBtn');
let savePageBtn 			= document.getElementById('savePageBtn');
let loadprevBtn 			= document.getElementById('loadprevBtn');
let loadnextBtn 			= document.getElementById('loadnextBtn');
let newTextBoxBtn 			= document.getElementById('newTextBoxBtn');
let presNameInput 			= document.getElementById('presNameInput');
let currentPageTxt 			= document.getElementById('currentPageTxt');
let notesTxt 				= document.getElementById('notesTxt');
let pageNav 				= document.getElementById('pageNav');
let mySlydesModal 			= document.getElementById('mySlydesModal');
let mySlydesBtn 			= document.getElementById('mySlydesBtn');
let mySlydesContent 		= document.getElementById('mySlydesContent');
let importBtn 				= document.getElementById('importBtn');
let changeBgBtn 			= document.getElementById('changeBgBtn');
let gradRotationRange 		= document.getElementById('gradRotationRange');
let colorBgPanel 			= document.getElementById('colorBgPanel');
let scaleRange 				= document.getElementById('scaleRange');
let borderRange 			= document.getElementById('borderRange');
let rotationRange 			= document.getElementById('rotationRange');
let addImageBtn 			= document.getElementById('addImageBtn');
let addIframeBtn 			= document.getElementById('addIframeBtn');
//Text toolbar stuff
let textToolBar 			= document.getElementById('textToolBar');
let toolbar_font 			= document.getElementById('toolbar_font');
let toolbar_fontSize 		= document.getElementById('toolbar_fontSize');
let toolbar_bold 			= document.getElementById('toolbar_bold');
let toolbar_italic 			= document.getElementById('toolbar_italic');
let toolbar_shadow 			= document.getElementById('toolbar_shadow');
let toolbar_txtColor 		= document.getElementById('toolbar_txtColor');
let toolbar_hiliteColor		= document.getElementById('toolbar_hiliteColor');
let toolbar_bgColor 		= document.getElementById('toolbar_bgColor');
let toolbar_underline 		= document.getElementById('toolbar_underline');
let toolbar_bulletList 		= document.getElementById('toolbar_bulletList');
let toolbar_numberList 		= document.getElementById('toolbar_numberList');
let toolbar_alignLeft 		= document.getElementById('toolbar_alignLeft');
let toolbar_alignCenter 	= document.getElementById('toolbar_alignCenter');
let toolbar_alignRight 		= document.getElementById('toolbar_alignRight');
//Background color bar stuff
let bgColorDiv 				= document.getElementById('bgColorDiv');
let addGradientBtn 			= document.getElementById('addGradientBtn');
let removeGradientBtn 		= document.getElementById('removeGradientBtn');
let gradientListDiv 		= document.getElementById('gradientListDiv');
//Add image bar stuff
let addImagePanel 			= document.getElementById('addImagePanel');
let addImgFromLinkBtn 		= document.getElementById('addImgFromLinkBtn');
let addImgFromLocalBtn 		= document.getElementById('addImgFromLocalBtn');
//Extra stuff for toolbar
let colorPicker 			= document.getElementById('colorPicker');
let shadowPicker 			= document.getElementById('shadowPicker');
//Presmode stuff
let presmodeBtn 			= document.getElementById('presmodeBtn');
let previewmodeBtn 			= document.getElementById('previewmodeBtn');
//Various vars
let fileDialog 				= document.createElement('input');
let originX, originY, gradRotation   = 0;
let editing, presmode, pressedDelKey = false;
//Presentation object
let currentPage 			= 1;
let presentation 			= init.newPresObject();
//To be defined later
let selected, copySelected, scale, content, presLength, lastSelected, lastPage, originTop, originLeft, presWidth, presHeight;
//Button events
savePageBtn.onclick 		= btnEvent.saveCurrentPage;
newPresentationBtn.onclick 	= btnEvent.newPresentation;
loadprevBtn.onclick 		= btnEvent.prevPage;
loadnextBtn.onclick 		= btnEvent.nextPage;
newPageBtn.onclick 			= btnEvent.newPage;
newTextBoxBtn.onclick 		= btnEvent.newTextBox;
exportToFileBtn.onclick 	= btnEvent.exportToFile;
mySlydesBtn.onclick 		= btnEvent.openMySlydes;
addGradientBtn.onclick 		= btnEvent.addGradient;
removeGradientBtn.onclick	= btnEvent.removeGradient;
changeBgBtn.onclick			= btnEvent.toggleBgPanel;
//Load everything
init.loadGrid();
init.loadContent();
init.loadToolbar();