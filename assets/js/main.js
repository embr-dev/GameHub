const queryString = window.location.search;
const hash = window.location.hash.replace('#', '');
window.history.pushState({}, '', window.location.pathname);
const urlParams = new URLSearchParams(queryString);
const action = urlParams.get('action');
const isNewUser = urlParams.get('newuser');

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

var loaded = 0;

fetch('/assets/js/codec.js')
    .then(obj => obj.text())
    .then(data => {
        const codecmang = document.createElement('script');
        codecmang.innerHTML = data;
        document.body.insertBefore(codecmang, document.body.firstChild);
    });

if (isNewUser == 'true') {
    const welcomeModal = document.createElement('div');
    welcomeModal.classList = 'modal is-active';
    welcomeModal.innerHTML = `
    <div class="modal-background"></div>
    <div class="modal-content">
        <div class="card">
            <div style="padding: 50px">
                <h1 class="title is-center">Welcome ${urlParams.get('username')}!</h1>
                <p class="text is-center">GameHub is a place to play unblocked games and have fun with the community.</p>
                <br>
                <p class="text is-center">Before you continue please agree to the <a href="https://gamehub88.github.io/GameHub/terms-of-service" target="_blank">Terms Of Service</a> and <a href="https://gamehub88.github.io/GameHub/comunity-guidelines" target="_blank">Comunity Guidelines</a>.</p>
                <br>
                <label class="checkbox">
                    <input type="checkbox" id="agreetoterms">
                    I agree
                </label>
                <br>
                <br>
                <button class="button is-danger is-rounded" disabled id="closemodal">Continue</button>
            </div>
        </div>
    </div>`;
    document.querySelector('.hidden').appendChild(welcomeModal);
    document.body.classList.add('noscroll');

    setTimeout(() => {
        document.querySelector('#agreetoterms').addEventListener('change', (e) => {
            if (document.querySelector('#agreetoterms').checked) {
                document.querySelector('#closemodal').disabled = false;
            } else {
                document.querySelector('#closemodal').disabled = true;
            }
        })

        document.querySelector('#closemodal').addEventListener('click', (e) => {
            welcomeModal.remove();
            document.body.classList.remove('noscroll');
        })
    }, 3000)
}

document.addEventListener('DOMContentLoaded', () => {
    const tabmang = document.createElement('script');
    tabmang.src = '/assets/js/tab.js';
    document.body.appendChild(tabmang);
    const pagemang = document.createElement('script');
    pagemang.src = '/assets/js/page.js';
    document.body.appendChild(pagemang);

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
})