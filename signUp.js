document.addEventListener("DOMContentLoaded", function() {

    const apiRegister = "https://fundreq.azurewebsites.net/register";
    /*const verifyPasswordEl = document.getElementById("VerifyPassword");
    const emailEl = document.getElementById("email1");

    var signupForm = document.getElementById("Signup-form");
    
    signupForm.addEventListener("submit", function(event) {
        event.preventDefault();
        data = {
            "name": document.getElementById("name1").value,
            "surname": document.getElementById("surname1").value,
            "username": document.getElementById("username1").value,
            "password": document.getElementById("password1").value,
            "passwordVerification": document.getElementById("VerifyPassword").value,
            "userType": document.getElementById("userType1").value + 's',
            "email": document.getElementById("email1").value
        };

        if(data.passwordVerification === data.password){
            verifyPasswordEl.style.borderColor = "black";
            register(data);
        }
        else{
            verifyPasswordEl.style.borderColor = "red";
        }
            
        
    });
    */
    async function register(data) {
        let bodyContent = JSON.stringify(data);
        let headersList = {
            "Accept": "*/*",
            "Content-Type": "application/json"
           }
        let response = await fetch(apiRegister, {
            method: "POST",
            mode: "cors",
            headers: headersList,
            body: bodyContent
        });
        let result = await response.json();
        console.log(result);
        if(result.message === "User registered successfully")homepage(data);
        else if(result.error === "Email already used, try signing in."){
            emailEl.style.borderColor = "red";
            alert(result.error);
        }
        else {alert(result.error);}
    }
    
});