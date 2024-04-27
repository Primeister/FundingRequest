import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-app.js";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-auth.js";
const firebaseConfig = {
  apiKey: "AIzaSyBimMAQ7h3SjUEi8-WcONJf33Y3svkXo3Q",
  authDomain: "fund-x.firebaseapp.com",
  projectId: "fund-x",
  storageBucket: "fund-x.appspot.com",
  messagingSenderId: "597142915321",
  appId: "1:597142915321:web:ad25a4585f77732e7dfa28"
};

const app = initializeApp(firebaseConfig);
const provider = new GoogleAuthProvider();
const apiRegister = "https://fundreq.azurewebsites.net/register";
const apiLogin = "https://fundreq.azurewebsites.net/login";

function homepage(data) {
    let userType = data.userType;
    let email = data.email;

    sessionStorage.setItem('username', data.name + ' ' + data.surname);
    sessionStorage.setItem('email', email);
    


    if (userType === "applicants") window.location.href = "applicants.html";

    if (userType === "funders") window.location.href = "fundmanagers.html";

    if (userType === "admins") window.location.href = "admin.html";
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
    if(result.message === "User logged in successfully")
    {
        data.userType = result.userType ;

        homepage(data);
    
        console.log(result);
        alert(result);
    }
    else{alert(result.error);}
}

function advertAreaShow()
{
    document.getElementById('landing-section').style.display="none";
    document.getElementById('advertiserFormSection').style.display="block";
}

const auth = getAuth();
auth.languageCode = 'en';

const googleSignin = document.querySelector("#google-signin-btn");
const googleSigninFund = document.querySelector("#google-signin-btn-1");
const googleLogin = document.querySelector("#google-signin-btn2");



googleSignin.addEventListener("click", () => {
	signInWithPopup(auth, provider)
  .then((result) => {
    const credential = GoogleAuthProvider.credentialFromResult(result);
    const token = credential.accessToken;
    const user = result.user;
	let name = (user.displayName).split(" ");
	let firstName = name[0], surname = name[1];
	let data = {name: firstName, surname: surname, email: user.email, userType: "applicants"}
	register(data);
  });
  
});
googleSigninFund.addEventListener("click", () => {
	signInWithPopup(auth, provider)
  .then((result) => {
    const credential = GoogleAuthProvider.credentialFromResult(result);
    const token = credential.accessToken;
    const user = result.user;
	let name = (user.displayName).split(" ");
	let firstName = name[0], surname = name[1];
	let data = {name: firstName, surname: surname, email: user.email, userType: "funders"}
	register(data);
  });
});
  googleLogin.addEventListener("click", () => {
	signInWithPopup(auth, provider)
  .then((result) => {
    const credential = GoogleAuthProvider.credentialFromResult(result);
    const token = credential.accessToken;
    const user = result.user;
	console.log(user);
	let name = (user.displayName).split(" ");
	let firstName = name[0], surname = name[1];
	let data = {name: firstName, surname: surname, email: user.email}
	login(data);
  });
  
});
