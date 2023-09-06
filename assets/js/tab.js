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

const authNeeded = [
    '/app'
];

if (authNeeded.includes(location.pathname) && !await API.validSession()) window.location.href = '/auth';

export default {};