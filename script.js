let googleApplicantEl = document.querySelector(".google--applicant");
let googleFundmanagerEl = document.querySelector(".google--fundmanager");
const apiRegister = "https://fundreq.azurewebsites.net/register";
let userType = "applicants";
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

    sessionStorage.setItem('username', data.name + ' ' + data.surname);
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
    console.log({...data ,"userType": userType})
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
    document.querySelector(".classMain").style.display = "none";
    document.querySelector(".aboutClass").style.display = "none";
    document.getElementById("budgetSection").style.display = "none";
    document.getElementById("editOppAmountSection").style.display = "none";
    document.getElementById("editTotalAmountSection").style.display = "none";
    document.getElementById('advertiserFormSection').style.display="block";
}

function viewBudget(){
    document.querySelector(".classMain").style.display = "none";
    document.querySelector(".aboutClass").style.display = "none";
    document.getElementById('landing-section').style.display="none";
    document.getElementById('advertiserFormSection').style.display="none";
    document.getElementById("editOppAmountSection").style.display = "none";
    document.getElementById("editTotalAmountSection").style.display = "none";
    document.getElementById("budgetSection").style.display = "block";
}

function showApproveFunder(){
    document.querySelector(".classMain").style.display = "none";
    document.querySelector(".aboutClass").style.display = "none";
    document.getElementById("approve-fundManagers").style.display = "block";
    document.getElementById("manage-applicants").style.display = "none";
    document.getElementById("manage-funders").style.display = "none";
}

function openManageFunders(){
    document.querySelector(".classMain").style.display = "none";
    document.querySelector(".aboutClass").style.display = "none";
    document.getElementById("approve-fundManagers").style.display = "none";
    document.getElementById("manage-funders").style.display = "block";
}

function showMain(){
    document.querySelector(".classMain").style.display = "block";
    document.querySelector(".aboutClass").style.display = "none";
    document.getElementById("approve-fundManagers").style.display = "none";
    document.getElementById("manage-funders").style.display = "none";
    document.getElementById("manage-applicants").style.display = "none";
}

function openManageApplicants(){
    document.querySelector(".classMain").style.display = "none";
    document.querySelector(".aboutClass").style.display = "none";
    document.getElementById("approve-fundManagers").style.display = "none";
    document.getElementById("manage-applicants").style.display = "block";
}

function openEditor(){
    document.getElementById("budgetSection").style.display = "none";
    document.getElementById("editOppAmountSection").style.display = "none";
    document.getElementById("editTotalAmountSection").style.display = "block";
}

module.exports = {
    setApplicant,
    setFunder,
    signinPage,
    loginPage,
    advertAreaShow,
    handleCredentialResponse,
    homepage,
    register
}
