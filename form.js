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

    // Retrieve the fund manager's email from sessionStorage
    let email = sessionStorage.getItem('email');

    if (!email) {
        console.error("Fund manager email not found in sessionStorage");
        return;
    }
    console.log("Fund manager email:", email);

    // Prepare notification data
    let notificationData = {
        fundManagerEmail: email,
        fundingOpportunityName: data.funding_name,
        applicantName: `${data.firstname} ${data.surname}`
    };
    console.log(notificationData);

    await postData(data);
    await postNotification(notificationData);

    window.location.href = "applicants.html";
}

async function postData(data) {
    let bodyContent = JSON.stringify(data);
    let headersList = {
        "Accept": "*/*",
        "Content-Type": "application/json"
    };

    // POST the application data to the server
    let response = await fetch("https://fundreq.azurewebsites.net/application/post", {
        method: "POST",
        mode: "cors",
        headers: headersList,
        body: bodyContent
    });

    if (!response.ok) {
        console.error("Failed to submit application");
        return;
    }

    let result = await response.json();
    console.log(result);
}

async function postNotification(notificationData) {
    let bodyContent = JSON.stringify(notificationData);
    let headersList = {
        "Accept": "*/*",
        "Content-Type": "application/json"
    };

    // POST the notification data to the server
    let response = await fetch("https://fundreq.azurewebsites.net/notifications/add", {
        method: "POST",
        mode: "cors",
        headers: headersList,
        body: bodyContent
    });

    if (!response.ok) {
        console.error("Failed to add notification");
        return;
    }

    let result = await response.json();
    console.log(result.message);
}

module.exports = {
    PostForm,
    postData,
    postNotification
}
