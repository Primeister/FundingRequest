document.addEventListener("DOMContentLoaded", function() {

   let username = sessionStorage.getItem('username');
   document.getElementById("username").textContent = username;
});
