function noSymbols(...str) {
    let state = true;

    str.forEach(item => {
        if(!/^[a-zA-Z0-9]+$/.test(item)) {
            state = false;
        }
    });

    return state;
}

function isNotEmpty(...str) {
    let state = true;

    str.forEach(item => {
        if(!item.replace(/\s/g, "").length > 0) {
            state = false;
        }
    });

    return state;
}

function print(...lines) {
    let d = new Date();
    let date = `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;
    let time = `${t(d.getHours())}:${t(d.getMinutes())}:${t(d.getSeconds())}`;

    function t(i) {
        return (i < 10) ? "0" + i : i;
    }

    lines.forEach(item => {
        console.log(`\n${date} ${time}: ${item}`);
    });
}

module.exports = {
    noSymbols : noSymbols,
    isNotEmpty : isNotEmpty,
    print : print
}