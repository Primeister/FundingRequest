function signinPage(){
    document.getElementById('Signin-form').style.display="none";
    document.getElementById('Signup-form').style.display="block";
}
function loginPage(){
    document.getElementById('Signin-form').style.display="block";
    document.getElementById('Signup-form').style.display="none";
}
function homepage(data) {
    let { username, name, surname, email, password, userType } = data;

    if (userType === "applicants") window.location.href = "applicants.html";

    if (userType === "funders") window.location.href = "fundmanagers.html";

    if (userType === "admins") window.location.href = "admin.html";

}
