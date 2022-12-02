var timeElapsed = 0;
var timeActive;

//firebase.initialize({
//    projectName: 'GameHub'
//});
//const logs = firebase.database().ref('log');

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
    logs.on('value', function(log) {
        if (!log) {
            console.log('ahsdgshdgah')
        }
        console.log(log)
    });
});