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

    // Fetch fund manager's email 
    async function fetchFundManagerEmail() {
        try {
            const response = await fetch(`https://fundreq.azurewebsites.net/fundManager/${data.funding_name}`);
            
            if (!response.ok) {
                throw new Error("Failed to fetch fund manager email");
            }
        
            const responseData = await response.json();
            // Assuming the response data is an array and you want the FundManager value of the first item
            const fundManagerEmail = responseData[0]?.FundManager;
            return fundManagerEmail;
        } catch (error) {
            console.error("Error fetching fund manager email:", error);
            return null; // Return null in case of error
        }
    }

    // Prepare notification data
    const fundManagerEmail = await fetchFundManagerEmail();
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
