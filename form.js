async function PostForm() {
    let data = {

        
        "surname": document.getElementById("surname").value,
      
        "firstname": document.getElementById("firstname").value,
      
        "mobile": document.getElementById("mobile").value,
      
        "email": document.getElementById("email").value,
      
        "id_number": document.getElementById("idnumber").value,
      
        "dob": document.getElementById("dob").value,
      
        "citizenship": document.getElementById("citizenship").value,

        "funding_name": sessionStorage.getItem("FundingName")
        
    };

    await post(data);

    window.location.href = "applicants.html";
}

async function post(data) {
    let bodyContent = JSON.stringify(data);
    let headersList = {
        "Accept": "*/*",
        "Content-Type": "application/json"
    };

    let response = await fetch("http://localhost:3000/application/post" , {
        method: "POST",
        mode: "cors",
        headers: headersList,
        body: bodyContent
    });

    let result = await response.json();
    console.log(result);
}
