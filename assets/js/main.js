import { registerSiteNotification, registerError } from './notification.js';
import loadPageScripts from './page.js';
import analytics from './analytics.js';

registerSiteNotification('GameHub is still in public beta, pleas report all bugs to our <a href="https://discord.gg/RXBbxQ4wuJ">discord</a>.');
loadPageScripts(new URLSearchParams(window.location.search), window.location.hash.replace('#', ''));
analytics();

window.history.replaceState({}, '', window.location.pathname);
const scripts = {
    'cryptojs': 'https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.1.1/crypto-js.js'
}

const $navbarBurgers = Array.prototype.slice.call(document.querySelectorAll('.navbar-burger'), 0);
$navbarBurgers.forEach(el => {
    el.addEventListener('click', () => {
        const target = el.dataset.target;
        const $target = document.getElementById(target);

        el.classList.toggle('is-active');
        $target.classList.toggle('is-active');
    });
});

window.onerror = (e) => registerError(e);
window.console.error = (e) => registerError(e);
window.onmessageerror = (e) => registerError(e);

Object.keys(scripts).forEach(key => {
    const script = document.createElement('script');
    script.src = scripts[key];
    document.body.appendChild(script);
})

fetch('/assets/JSON/pages.json')
    .then(res => res.json())
    .then((pages) => {
        if (!pages.main.includes(window.location.pathname)) {
            const navmang = document.createElement('script');
            navmang.src = '/assets/js/nav.js';
            document.body.appendChild(navmang);

            setTimeout(() => {
                document.querySelector('#app').classList.remove('hidden');
                document.querySelector('#loader').classList.add('hidden');
                document.documentElement.classList.remove('noscroll');
            }, 1000);
        } else setTimeout(() => {
            document.querySelector('#app').classList.remove('hidden');
            document.querySelector('#loader').classList.add('hidden');
            document.documentElement.classList.remove('noscroll');
        }, 1000);
    });
