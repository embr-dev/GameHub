const queryString = window.location.search;
const hash = window.location.hash.replace('#', '');
window.history.pushState({}, '', window.location.pathname);
const urlParams = new URLSearchParams(queryString);
const action = urlParams.get('action');

window.onerror = (errorMsg, url, lineNumber) => {
    console.log('Error: ' + errorMsg + '\n\nUrl: ' + url + '\n\nLine:' + lineNumber);
    alert('Error: ' + errorMsg + '\n\nUrl: ' + url + '\n\nLine:' + lineNumber);
}

function error(errCode) {
    fetch('/assets/JSON/errors.json')
        .then(resp => resp.json())
        .then(errs => {
            if (errs.includes(errCode)) {
                fetch(`/assets/error/${errCode}.html`)
                    .then(obj => obj.text())
                    .then(error => {
                        document.documentElement.innerHTML = error;
                    });
            } else {
                fetch('/assets/error/unknown.html')
                    .then(obj => obj.text())
                    .then(error => {
                        document.documentElement.innerHTML = error;
                    });
            }
        });
}

let loaded = 0;

const tabmang = document.createElement('script');
tabmang.src = '/assets/js/tab.js';
document.body.appendChild(tabmang);

const pagemang = document.createElement('script');
pagemang.src = '/assets/js/page.js';
document.body.appendChild(pagemang);

const analyticsmang = document.createElement('script');
analyticsmang.src = '/assets/js/analytics.js';
document.body.appendChild(analyticsmang);

/*const codec = document.createAttribute('script');
codec.src = 'https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.1.1/crypto-js.min.js';
document.body.appendChild(codec);*/

const devtools = document.createElement('script');
devtools.src = "https://cdnjs.cloudflare.com/ajax/libs/eruda/2.11.3/eruda.js";
document.body.appendChild(devtools);
devtools.onload = () => {
    eruda.init();
}

fetch('/assets/JSON/pages.json')
    .then(res => res.json())
    .then((pages) => {
        const isMain = pages.main.includes(window.location.pathname);

        if (!isMain) {
            const navmang = document.createElement('script');
            navmang.src = '/assets/js/nav.js';
            document.body.appendChild(navmang);
            const profilemang = document.createElement('script');
            profilemang.src = '/assets/js/profile.js';
            document.body.appendChild(profilemang);

            loaded++

            var timeout = setTimeout(() => {
                if (loaded < 4) {
                    error('408');
                }
            }, 60000)

            var check = setInterval(() => {
                if (loaded > 3) {
                    clearInterval(check);
                    clearTimeout(timeout);
                    document.querySelector('.hidden').classList.remove('hidden');
                    document.querySelector('.square-loader').classList.add('hidden');
                }
            }, 1000);
        } else {
            loaded++

            var timeout = setTimeout(() => {
                if (loaded < 4) {
                    error('408');
                }
            }, 60000)

            var check = setInterval(() => {
                if (loaded > 2) {
                    clearInterval(check);
                    clearTimeout(timeout);
                    document.querySelector('.hidden').classList.remove('hidden');
                    document.querySelector('.square-loader').classList.add('hidden');
                }
            }, 1000);
        }
    });