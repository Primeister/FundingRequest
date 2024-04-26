let googleApplicantEl = document.querySelector(".google--applicant");
let googleFundmanagerEl = document.querySelector(".google--fundmanager");
const apiRegister = "https://fundreq.azurewebsites.net/register";
let userType;
let userData;

function signinPage(){
    document.getElementById('Signin-form').style.display="none";
    document.getElementById('Signup-form').style.display="block";
}
function loginPage(){
    document.getElementById('Signin-form').style.display="block";
    document.getElementById('Signup-form').style.display="none";
}
function homepage(data) {
    let username = data.username;
    let userType = data.userType;
    let email = data.email;

    sessionStorage.setItem('username', data.name + ' '+ data.surname);
    sessionStorage.setItem('email', email);
    


    if (userType === "applicants") window.location.href = "applicants.html";

    if (userType === "funders") window.location.href = "fundmanagers.html";

    if (userType === "admins") window.location.href = "admin.html";
}
function handleCredentialResponse(response) {
    // decodeJwtResponse() is a custom function defined by you
    // to decode the credential response.
    const responsePayload = decodeJwtResponse(response.credential);


    let data = {
        "name": responsePayload.given_name,
        "surname": responsePayload.family_name,
        "email": responsePayload.email
    }
   
    userData = data;
    register({...data ,"userType": userType});
}


function setApplicant(){
    userType = "applicants";
}
function setFunder(){
    userType = "funders";
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
        if(result.message === "User registered successfully")homepage(data);
        else if(result.error === "Email already used, try signing in."){
            emailEl.style.borderColor = "red";
            alert(result.error);
        }
        else {alert(result.error);}
    }
    
    
function decodeJwtResponse(jwtToken) {
// Split the token into its parts (header, payload->userInfo, signature)
const parts = jwtToken.split('.');
const payload = JSON.parse(atob(parts[1]));
return payload;
}


function advertAreaShow()
{
    document.getElementById('landing-section').style.display="none";
    document.getElementById('advertiserFormSection').style.display="block";
}