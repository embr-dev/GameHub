const registerError = (e) => {
    registerSiteNotification((e.message ? e.message.toString() : e.toString()), 'danger');

    if (e.stack) console.log('An error occurred:\n\n' + e.stack);
    else console.log('An error occurred:\n\n' + e);
}

const registerSiteNotification = (notification, type) => {
    var notificationContainer = document.querySelector('.notifications');

    if (!notificationContainer) {
        notificationContainer = document.createElement('div');
        notificationContainer.classList = 'notifications';
        document.body.appendChild(notificationContainer);
    }

    const notificationEl = document.createElement('div');
    notificationEl.classList = `notification is-${type || 'info'}`;
    notificationEl.innerHTML = `<button class="delete"></button>${notification}`;
    notificationContainer.appendChild(notificationEl);

    notificationEl.onclick = () => {
        notificationEl.style.height = '0px';
        notificationEl.style.opacity = 0;
        notificationEl.style.padding = '0px';
        notificationEl.firstElementChild.style.fontSize = '0px';

        setTimeout(() => {
            notificationEl.remove();
        }, 500);
    }

    setTimeout(() => {
        notificationEl.style.height = '0px';
        notificationEl.style.opacity = 0;
        notificationEl.style.padding = '0px';
        notificationEl.firstElementChild.style.fontSize = '0px';

        setTimeout(() => {
            notificationEl.remove();
        }, 500);
    }, 8000);
}

export { registerError, registerSiteNotification };