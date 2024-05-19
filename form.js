    // Fetch fund manager's email 
    async function fetchEmail() {
        try {
            fundName= sessionStorage.getItem("FundingName");
            console.log(fundName);
          const response = await fetch('https://fundreq.azurewebsites.net/fundManager/' + fundName);
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          } else {
            const data = await response.json();
            if (data.length > 0) {
              const email = data[0].FundManager;
              document.getElementById('emailId').textContent = `email: ${email}`;
              console.log(email);
              console.log("Successfully fetched email: " + email);
              return email;
            } else {
              console.log("No data found");
              return null;
            }
          }
        } catch (error) {
          console.log('Error:', error);
        }
    }

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

    // Prepare notification data
    const fundManagerEmail = await fetchEmail();
    if (fundManagerEmail === null) {
        console.error("No fund manager email retrieved, cannot proceed with notification.");
        return;
    }
    
    let notificationData = {
        fundManagerEmail: fundManagerEmail,
        fundingOpportunityName: data.funding_name,
        applicantName: `${data.firstname} ${data.surname}`
    };

    console.log(notificationData); // To verify the notification data

    // Post data and notification
    await postData(data);
    await postNotification(notificationData);

    // Redirect after posting
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
