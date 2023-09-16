import API from './api.js';

export default () => {
    if (localStorage.getItem('analytics_website_id') !== 'not tracked') {
        if (localStorage.getItem('analytics_website_id')) {
            const analytics = document.createElement('script');
            analytics.setAttribute('data-website-id', localStorage.getItem('analytics_website_id'));
            analytics.setAttribute('async', '');
            analytics.src = 'https://analytics.embernet.work/script.js';
            document.head.insertBefore(analytics, document.head.firstChild);
        } else API.get(`/analytics/${window.location.hostname}`)
            .then(res => {
                if (typeof res === 'string') {
                    localStorage.setItem('analytics_website_id', res);
                    location.reload();
                } else localStorage.setItem('analytics_website_id', 'not tracked');
            })
            .catch(e => localStorage.setItem('analytics_website_id', 'not tracked'));
    }
};