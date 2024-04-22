document.addEventListener("DOMContentLoaded", function() {

    let username = sessionStorage.getItem('username');
    let email = sessionStorage.getItem('email');
    
    document.getElementById("username").textContent = username;

    fetch('https://fundreq.azurewebsites.net/fundManagers/' + email)
    .then(res => {
        return res.json();
    }).then( data =>{
        
        let alert = document.getElementById("alerts");
        let status = document.createElement('p'); 
        
        if(data.status == "approved"){
            status.textContent = "Your account was approved";
            alert.appendChild(status);
        }
        if(data.status == "rejected"){
            status.textContent = "Your account was rejected";
            alert.appendChild(status);
        }
        
    });
 });