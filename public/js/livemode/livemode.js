let livemode = {
	livemodeContainer: 	document.getElementById('livemodeContainer'),
	statusTitle: 		document.getElementById('statusTitle'),
	currentPageText: 	document.getElementById('currentPage'),
	notesContainer: 	document.getElementById('notesContainer'),
	notesText: 			document.getElementById('notesText'),

	init: function() {
		let status = localStorage.getItem('livemode');
		livemode.livemodeContainer.style.display = 'none';

		if(status === 'true') {
			livemode.statusTitle.innerHTML = 'Live mode ON';
			livemode.startLiveMode();
		} else {
			livemode.statusTitle.innerHTML = 'Live mode OFF';
			livemode.endLiveMode();
		}

		window.addEventListener("storage", livemode.update);
	},

	update: function(e) {
		if (e.key === 'livemode') {
			let status = localStorage.getItem('livemode');

			if(status === 'true') {
				livemode.statusTitle.innerHTML = 'Live mode ON';
				livemode.startLiveMode();
			} else {
				livemode.statusTitle.innerHTML = 'Live mode OFF';
				livemode.endLiveMode();
			}
		}

		if (e.key === 'currentPage') {
			let status = localStorage.getItem('livemode');

			if(status === 'true') {
				let currentPage = localStorage.getItem('currentPage');
				let presObject = JSON.parse(localStorage.getItem('presentation'));

				if (presObject && currentPage) {
					let pageLength = Object.keys(presObject.body).length;
					currentPageText.innerHTML = 'Current page: ' + currentPage + ' of ' + pageLength;
					notesText.innerHTML = presObject.body['page_' + currentPage].notes;
				}
			}
		}
	},

	startLiveMode: function() {
		let currentPage = localStorage.getItem('currentPage');
		let presObject = JSON.parse(localStorage.getItem('presentation'));

		if(presObject && currentPage) {
			let pageLength = Object.keys(presObject.body).length;
			currentPageText.innerHTML = 'Current page: ' + currentPage + ' of ' + pageLength;
			notesText.innerHTML = presObject.body['page_' + currentPage].notes;
			notesContainer.style.fontSize = '25px';
		}

		livemode.livemodeContainer.style.display = 'block';
	},

	endLiveMode: function() {
		livemode.statusTitle.innerHTML = 'Live mode OFF';
		currentPageText.innerHTML = '';
		notesText.innerHTML = '';

		livemode.livemodeContainer.style.display = 'none';
	}
}

livemode.init();