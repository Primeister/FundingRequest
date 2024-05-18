let username = sessionStorage.getItem('username');
let email = sessionStorage.getItem('email');

document.addEventListener("DOMContentLoaded", function() {

    
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

 function PostFunding(){
    let data = {
        "name": document.getElementById("fundingName").value,
        "type": document.getElementById("fundingType").value,
        "description": document.getElementById("description").value,
        "requirements": document.getElementById("requirements").value,
        "deadline": document.getElementById("deadline").value,
        "amount": document.getElementById("allocatedFunds").value
    };

    post(data);
 }

 async function post(data) {
    let bodyContent = JSON.stringify(data);
    let headersList = {
        "Accept": "*/*",
        "Content-Type": "application/json"
       }
    let response = await fetch("https://fundreq.azurewebsites.net/fundManagers/advert/post/" + email, {
        method: "POST",
        mode: "cors",
        headers: headersList,
        body: bodyContent
    });
    let result = await response.json();
    console.log(result);
    
}