const verifyPasswordEl = document.getElementById("VerifyPassword");
const emailEl = document.getElementById("email1");
const apiRegister = "https://fundreq.azurewebsites.net/register";
const apiLogin = "https://fundreq.azurewebsites.net/login";

function signin()
{
    document.getElementById('mainSignup').style.display="none";
    document.getElementById('mainLanding').style.display="none";
    document.getElementById('mainLogin').style.display="block";
}
function Signup()
{
    document.getElementById('mainSignup').style.display="block";
    document.getElementById('mainLanding').style.display="none";
    document.getElementById('mainLogin').style.display="none";


    //grabbing the signup info from the form
    var signupForm = document.getElementById("Signup-form");
    var loginForm = document.getElementById("login-form");
    
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

    loginForm.addEventListener("submit", function(event) {
        event.preventDefault();
        data = {
            "username": document.getElementById("username2").value,
            "password": document.getElementById("password2").value,
            "userType": document.getElementById("userType2").value + 's',
        };
        
        login(data);
        
    });


}
function Gohome()
{
    document.getElementById('mainSignup').style.display="none";
    document.getElementById('mainLanding').style.display="block";
    document.getElementById('mainLogin').style.display="none";
}

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
    if(result.message === "User registered successfully")Gohome();
    else if(result.error === "Email already used, try signing in."){
        emailEl.style.borderColor = "red";
        alert(result.error);
    }
    else {alert(result.error);}
}

async function login(data) {
    let bodyContent = JSON.stringify(data);
    let headersList = {
        "Accept": "*/*",
        "Content-Type": "application/json"
       }
    let response = await fetch(apiLogin, {
        method: "POST",
        mode: "cors",
        headers: headersList,
        body: bodyContent
    });
    let result = await response.json();
    console.log(result);
    if(result.message === "Login successful")Gohome();
    else{alert(result.error);}
}
