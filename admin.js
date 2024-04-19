document.addEventListener("DOMContentLoaded", function() {

   let username = document.getElementById("username");
    let username2 = sessionStorage.getItem('username');
    username.innerText = username2;
});