document.addEventListener("DOMContentLoaded", function(){
    //get references to the main and about class section
    var mainSection = document.querySelector(".classMain");
    var aboutSection = document.querySelector(".aboutClass");

    //get references to the about links ans other links
    var aboutLink = document.querySelector("#showPageLink");
    var otherLinks = document.querySelector(".topNav a");

    function showMainSection(){
        mainSection.style.display = "block";
        aboutSection.style.display = "none";
    }

    function showAboutSection(){
        mainSection.style.display = "none";
        aboutSection.style.display = "block";
    }

    //initially show main section and hide about class section
    showMainSection();

    //add event listener to the about link
    aboutLink.addEventListener("click", function(event){
        event.preventDefault();
        showAboutSection();
    });

    //add event listener to other links to show main section
    otherLinks.forEach(function(link){
        link.addEventListener("click", function(){
            showMainSection();
        });
    });

});

function isSmallScreen() {
    return window.innerWidth <= 768; // Adjust the value as needed
}

document.addEventListener('click', function(event) {
    if (isSmallScreen()) {
        var sideNav = document.querySelector('.sideNav');
        var menuButton = document.querySelector('.menuButton');

        // Check if the click is not on the sidebar or the menu button
        if (!sideNav.contains(event.target) && !menuButton.contains(event.target)) {
            sideNav.classList.remove('open');
            sideNav.style.display = 'none';
        }
    }
});

function toggleMenu() {
    var sideNav = document.querySelector('.sideNav');
    sideNav.classList.toggle('open');
    if (sideNav.classList.contains('open')) {
        sideNav.style.display = 'block';
    } else {
        sideNav.style.display = 'none';
    }
}

// Optional: Add an event listener to handle window resize and adjust the sidebar visibility accordingly
window.addEventListener('resize', function() {
    var sideNav = document.querySelector('.sideNav');
    if (!isSmallScreen()) {
        sideNav.style.display = 'block'; // Ensure sidebar is visible on larger screens
    } else if (!sideNav.classList.contains('open')) {
        sideNav.style.display = 'none'; // Ensure sidebar is hidden on smaller screens if not open
    }
});

