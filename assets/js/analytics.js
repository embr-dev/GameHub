export default () => {
    const analytics = document.createElement('script');
    analytics.setAttribute('data-domain', window.location.hostname);
    analytics.setAttribute('defer', '');
    analytics.src = 'https://analytics.embernet.work/js/script.js';
    document.head.insertBefore(analytics, document.head.firstChild);
};