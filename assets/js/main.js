const queryString = window.location.search;
const hash = window.location.hash.replace('#', '');
window.history.pushState({}, '', window.location.pathname);
const urlParams = new URLSearchParams(queryString);
const action = urlParams.get('action');
const scripts = {
    'cryptojs': 'https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.1.1/crypto-js.js',
    'cookiejs': '/assets/js/cookie.js',
    'apijs': '/assets/js/api.js',
    'tabjs': '/assets/js/tab.js',
    'pagejs': '/assets/js/page.js',
    'analyticsjs': '/assets/js/analytics.js'
}

var ongamehub;

class RegisterGamehubError {
    constructor(e) {
        let notificationContainer = document.querySelector('.notifications');

        if (!notificationContainer) {
            notificationContainer = document.createElement('div');
            notificationContainer.classList = 'notifications';
            document.body.appendChild(notificationContainer);
        }

        const error = document.createElement('div');
        error.classList = 'notification error';
        if (e.message) {
            error.innerHTML = `<span>${e.message.toString()}</span>`;
        } else {
            error.innerHTML = `<span>An error occurred: ${e.toString()}</span>`;
        }
        notificationContainer.appendChild(error);

        error.onclick = () => {
            error.style.height = '0px';
            error.style.opacity = 0;
            error.style.padding = '0px';
            error.firstElementChild.style.fontSize = '0px';

            setTimeout(() => {
                error.remove();
            }, 500);
        }

        setTimeout(() => {
            error.style.height = '0px';
            error.style.opacity = 0;
            error.style.padding = '0px';
            error.firstElementChild.style.fontSize = '0px';

            setTimeout(() => {
                error.remove();
            }, 500);
        }, 8000);

        //throw new Error(e);
    }
}

window.onerror = (e) => {
    new RegisterGamehubError(e);
}

window.console.error = (e) => {
    new RegisterGamehubError(e);
}

window.onmessageerror = (e) => {
    new RegisterGamehubError(e);
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

Object.keys(scripts).forEach(key => {
    const script = document.createElement('script');
    script.src = scripts[key];
    document.body.appendChild(script);
})

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

        try {
            ongamehub();
        } catch (e) { }

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