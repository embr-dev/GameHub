const dropdownTabs = document.querySelectorAll('.is-dropdown');
const dropdown = document.querySelector('.navbar-item.has-dropdown');
const navbar = document.querySelector(".navbar");
const sticky = navbar.offsetTop;
dropdown.style.color = '#fff';

dropdown.addEventListener('mouseover', (e) => {
    dropdown.style.color = '#fff';
    dropdown.style.backgroundColor = '#AC3CDE'
});
dropdown.addEventListener('mouseout', (e) => {
    dropdown.style.color = '#fff';
    dropdown.style.backgroundColor = 'transparent';
});


for (let i = 0; i < dropdownTabs.length; i++) {
    dropdownTabs[i].style.color = '#000';
    dropdownTabs[i].addEventListener('mouseover', (e) => {
        dropdownTabs[i].style.color = '#fff';
    });
    dropdownTabs[i].addEventListener('mouseout', (e) => {
        dropdownTabs[i].style.color = '#000';
    });
};

window.onscroll = function() {
    if (window.pageYOffset > sticky) {
        navbar.classList.add("sticky")
    } else {
        navbar.classList.remove("sticky");
    }
}

loaded++