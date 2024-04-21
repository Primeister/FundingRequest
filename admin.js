document.addEventListener("DOMContentLoaded", function() {

   let username = document.getElementById("username");
    let username2 = localStorage.getItem('username');
    username.innerText = username2;
});
