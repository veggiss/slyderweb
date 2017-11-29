let DEBUG = false;

let util = {
	newRequest: function(type, path, params) {
		let request;

		if (type == "GET" || type == 'PUT') {
			request = new Request(path + this.uriParams(params), {
				method: type,
				credentials: 'same-origin',
				headers:{
					"content-type":"application/json"
				}
			});
		} else if (type == 'POST' || type == 'DELETE') {
			request = new Request(path, {
				method: type,
				credentials: 'same-origin',
				body: JSON.stringify(params),
				headers:{
					"Content-type":"application/json"
				}
			});
		}

		return request;
	},

	getPresList: function() {
		let list = fetch(util.newRequest('GET', '/user/preslist', {})).then(res => {
			if (res.status == 401) {
				alert('You need to be logged in to do that!');
			} else {
				return res.json();
			}
		}).then(res => {
			return res;
		}).catch(err => {
		    util.printError(err);
		});

		return list;
	},

	isNotEmpty: function(...str) {
	    let state = true;

	    str.forEach(item => {
	        if (item == null || item == undefined) {
	            state = false;
	        } else if(!item.replace(/\s/g, "").length > 0) {
	            state = false;
	        }
	    });

	    return state;
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