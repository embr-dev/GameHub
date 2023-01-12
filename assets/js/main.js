const queryString = window.location.search;
const hash = window.location.hash.replace('#', '');
window.history.pushState({}, '', window.location.pathname);
const urlParams = new URLSearchParams(queryString);
const action = urlParams.get('action');

window.onerror = (errorMsg, url, lineNumber) => {
    console.log('Error: ' + errorMsg + '\n\nUrl: ' + url + '\n\nLine:' + lineNumber);
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

if (!localStorage.getItem('update1.01')) {
    localStorage.setItem('update1.01', true)
    location.reload()
}

function uid() {
    let a = new Uint32Array(3);
    window.crypto.getRandomValues(a);
    return (performance.now().toString(36) + Array.from(a).map(A => A.toString(36)).join("")).replace(/\./g, "");
}

const deviceId = localStorage.getItem('devid');
const isMaintenance = false;
const isDisabled = false;
var isMainLoaded;
var isAllowed;
var loaded = 0;

if (isMaintenance === true || isDisabled === true) {
    fetch('/assets/JSON/allowlist.json')
        .then(function (resp) {
            return resp.json();
        })
        .then(function (allowlist) {
            isAllowed = allowlist.includes(deviceId);
            isMainLoaded = true;
        });
} else {
    isAllowed = true;
    isMainLoaded = true;
}

fetch('/assets/js/codec.js')
    .then(obj => obj.text())
    .then(data => {
        const codecmang = document.createElement("script");
        codecmang.innerHTML = data;
        document.body.insertBefore(codecmang, document.body.firstChild);
    });

if (!localStorage.getItem('devid')) {
    localStorage.setItem('devid', uid());
    location.reload();
}

document.addEventListener('DOMContentLoaded', () => {
    const anayltics = document.createElement("script");
    anayltics.src = '/assets/js/analytics.js';
    document.body.appendChild(anayltics);
    const evaljs = document.createElement("script");
    evaljs.src = '/assets/js/eval.js';
    document.body.appendChild(evaljs);
    const dependancies = document.createElement("script");
    dependancies.src = '/assets/js/depend.js';
    document.body.appendChild(dependancies);
    var interval = setInterval(() => {
        if (isMainLoaded === true) {
            clearInterval(interval);
            if (isAllowed === true) {
                const tabmang = document.createElement("script");
                tabmang.src = '/assets/js/tab.js';
                document.body.appendChild(tabmang);
                const pagemang = document.createElement("script");
                pagemang.src = '/assets/js/page.js';
                document.body.appendChild(pagemang);

                fetch('/assets/JSON/pages.json')
                    .then(function (resp) {
                        return resp.json();
                    })
                    .then(function (pages) {
                        const isMain = pages.main.includes(window.location.pathname);
                        if (!isMain) {
                            const navmang = document.createElement("script");
                            navmang.src = '/assets/js/nav.js';
                            document.body.appendChild(navmang);
                            const profilemang = document.createElement("script");
                            profilemang.src = '/assets/js/profile.js';
                            document.body.appendChild(profilemang)
                            loaded++
                            var check = setInterval(() => {
                                if (loaded > 2) {
                                    clearInterval(check);
                                    document.querySelector('.hidden').classList.remove('hidden');
                                    document.querySelector('.square-loader').classList.add('hidden');
                                }
                            }, 1000);
                        } else {
                            loaded++
                            var check = setInterval(() => {
                                if (loaded > 0) {
                                    clearInterval(check);
                                    document.querySelector('.hidden').classList.remove('hidden');
                                    document.querySelector('.square-loader').classList.add('hidden');
                                }
                            }, 1000);
                        }
                    });
            } else {
                if (isMaintenance) {
                    error('503');
                    document.querySelector('.square-loader').classList.add('hidden');
                } else {
                    error('403');
                    document.querySelector('.square-loader').classList.add('hidden');
                }
            }
        }
    }, 10);
})