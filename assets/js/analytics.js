var timeElapsed = 0;
var timeActive;
const logsDB = database.ref('logs');

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
    clearInterval(timeActive);
    console.log(timeElapsed)
    timeElapsed = 0;
    logsDB.on('value', function(data) {
        const logs = data.val();

        if (!logs) {
            console.log('ahsdgshdgah')
        }
        console.log(logs)
    });
});