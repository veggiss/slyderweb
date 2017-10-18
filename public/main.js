fetch("/user/:username").then(res =>{
    return res.json();
}).then(json => {
    console.log(item);
}).catch(err => {
    printError(err);
});