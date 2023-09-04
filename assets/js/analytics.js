export default () => {
    if (location.hostname === 'gamehub.dev') {
        const analytics = document.createElement('script');
        analytics.setAttribute('data-domain', 'gamehub.dev');
        analytics.setAttribute('defer', '');
        analytics.src = 'https://analytics.embernet.work/js/script.js';
        document.head.insertBefore(analytics, document.head.firstChild);
    }
};