let request = new Request(`/user/:username${uriParams({
	username:'something'
})}`, {
	method: 'GET',
	timeout: 5000,
	headers:{
		"content-type":"application/json"
	}
});

fetch(request).then(res =>{
    return res.json();
}).then(res => {
    console.log(res);
}).catch(err => {
    printError(err);
});

function uriParams(params) {
	let esc = encodeURIComponent;
	let query = Object.keys(params).map(k => esc(k) + '=' + esc(params[k])).join('&');
	return '?' + query;
}