let DEBUG = false;

let util = {
	newRequest: function(type, path, params) {
		let request;

		if (type == "GET") {
			request = new Request(path + this.uriParams(params), {
				method: 'GET',
				headers:{
					"content-type":"application/json"
				}
			});
		} else if (type == 'PUT') {
			request = new Request(path + this.uriParams(params), {
				method: 'PUT',
				headers:{
					"Content-type":"application/json"
				}
			});
		} else if (type == 'POST') {
			request = new Request(path, {
				method: 'POST',
				body: JSON.stringify(params),
				headers:{
					"Content-type":"application/json"
				}
			});
		}

		return request;
	},

	uriParams: function(params) {
		let esc = encodeURIComponent;
		let query = Object.keys(params).map(k => esc(k) + '=' + esc(params[k])).join('&');
		return '?' + query;
	},

	printError: function(...lines) {
		if(DEBUG){
			lines.forEach(item => {
				console.error(item);
			});
		}
	}
}