document.addEventListener("DOMContentLoaded", function() {

    const apiLogin = "https://fundreq.azurewebsites.net/login";

    var loginForm = document.getElementById("Signin-form");


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
        if(result.message === "Login successful")
        {
            data.username = result.username;
            data.userType = result.userType ;

            homepage(data);
        
            console.log(result);
            alert(result);
        }
        else{alert(result.error);}
    }
    
});