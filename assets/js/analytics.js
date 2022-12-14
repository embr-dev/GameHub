var timeElapsed = 0;
var timeActive;

if (document.hasFocus()) {
    timeActive = setInterval(() => {
        timeElapsed++
    }, 1000)
}

window.addEventListener('focus', (event) => {
    timeActive = setInterval(() => {
        timeElapsed++
    }, 1000)
});

window.addEventListener('blur', (event) => {
    /*clearInterval(timeActive);
    timeDB.on('value', function (data) {
        //timeDB.set(data.val() + timeElapsed)
        timeElapsed = 0;
    })
    analyticsDB.on('value', function (data) {
        if (!logs) {
            console.log('ahsdgshdgah')
        }
        console.log(logs)
    });*/
});