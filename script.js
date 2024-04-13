const apiRegister = "https://fundreq.azurewebsites.net/register";

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
    
    signupForm.addEventListener("submit", function(event) {
        event.preventDefault();
        data = {
            "name": document.getElementById("name").value,
            "surname": document.getElementById("surname").value,
            "username": document.getElementById("username").value,
            "password": document.getElementById("password").value,
            "userType": document.getElementById("userType").value + 's',
            "email": document.getElementById("email").value
        };
        console.log(data);
        
        register(data);
        Gohome();
        
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
}