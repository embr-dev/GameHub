import API from './api.js';

const filename = location.pathname.substring(location.pathname.lastIndexOf('/') + 1);
const isIndex = filename === 'index.html' || filename === 'index';
const isHTML = filename.includes('.html');

if (isIndex) window.location.href = window.location.href.replace('/' + filename, '');
else if (isHTML) window.location.href = window.location.href.replace('.html', '');

const showError = (errCode) => {
    fetch('/assets/JSON/errors.json')
        .then(resp => resp.json())
        .then(errs => {
            if (errs.includes(errCode)) fetch(`/assets/error/${errCode}.html`)
                .then(obj => obj.text())
                .then(error => {
                    document.documentElement.innerHTML = error;
                });
            else fetch('/assets/error/unknown.html')
                .then(obj => obj.text())
                .then(error => {
                    document.documentElement.innerHTML = error;
                });
        });
}

fetch('/assets/JSON/pages.json')
    .then(res => res.json())
    .then(async (pages) => {
        const isLogin = await API.validSession();
        const isMain = pages.main.includes(window.location.pathname);
        const isOther = pages.other.includes(window.location.pathname);

        if (!isMain && !isLogin) window.location.href = '/auth';

        if (!pages.all.includes(window.location.pathname)) showError(404);
    });

export default {};