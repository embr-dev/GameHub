const gtagJS = document.createElement('script');
gtagJS.src = 'https://www.googletagmanager.com/gtag/js?id=G-Z3LWXSKDCB';
gtagJS.setAttribute('async', true);
document.body.appendChild(gtagJS);

window.dataLayer = window.dataLayer || [];
function gtag() {
    dataLayer.push(arguments);
}
gtag('js', new Date());

gtag('config', 'G-Z3LWXSKDCB');

loaded++