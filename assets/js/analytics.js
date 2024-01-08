import API from './api.js';

export default () => {
    if (localStorage.getItem('analytics_website_id') !== 'not tracked') {
        if (localStorage.getItem('analytics_website_id')) {
            const analyticsScript = document.createElement('script');
            analyticsScript.setAttribute('data-website-id', localStorage.getItem('analytics_website_id'));
            analyticsScript.setAttribute('async', '');
            analyticsScript.src = 'https://analytics.embernet.work/script.js';
            document.head.insertBefore(analyticsScript, document.head.firstChild);

            analyticsScript.onload = () => window.analytics = window.umami;
        } else API.get(`/analytics/${window.location.hostname}`)
            .then(res => {
                if (typeof res === 'string') {
                    localStorage.setItem('analytics_website_id', res);
                    location.reload();
                } else {
                    localStorage.setItem('analytics_website_id', 'not tracked');
                    location.reload();
                }
            })
            .catch(e => {
                localStorage.setItem('analytics_website_id', 'not tracked');
                location.reload();
            });
    } else window.analytics = {
        track: (...args) => {},
        identify: (...args) => {}
    };
};