async function fetchEmail() {
    const fundName = sessionStorage.getItem("FundingName");
    if (!fundName) {
        console.error("FundingName not found in sessionStorage");
        return null;
    }
    console.log(fundName);

    try {
        const response = await fetch(`https://fundreq.azurewebsites.net/fundManager/${fundName}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        } else {
            const data = await response.json();
            if (data.length > 0) {
                const email = data[0].FundManager;
                console.log("Successfully fetched email: " + email);
                sessionStorage.setItem("FundManagerEmail", email);
                return email;
            } else {
                console.log("No data found");
                return null;
            }
        }
    } catch (error) {
        console.log('Error fetching email:', error);
        return null;
    }
}

document.addEventListener("DOMContentLoaded", function() {
    fetchEmail();
    document.getElementById("advertiserFormSection").addEventListener("submit", function(event) {
        event.preventDefault(); // Prevent default form submission
        PostForm();
    });
});

async function PostForm() {
    let fundManagerEmail = sessionStorage.getItem("FundManagerEmail");
    if (!fundManagerEmail) {
        fundManagerEmail = await fetchEmail();
    }
    
    if (!fundManagerEmail) {
        console.error("No fund manager email retrieved, cannot proceed with notification.");
        return;
    }

    const data = {
        "surname": document.getElementById("surname").value,
        "firstname": document.getElementById("firstname").value,
        "mobile": document.getElementById("mobile").value,
        "email": document.getElementById("email").value,
        "id_number": document.getElementById("idnumber").value,
        "dob": document.getElementById("dob").value,
        "citizenship": document.getElementById("citizenship").value,
        "funding_name": sessionStorage.getItem("FundingName"),
        "requested_amount": document.getElementById("requested-amount").value
    };

    const notificationData = {
        fundManagerEmail: fundManagerEmail,
        fundOppName: data.funding_name,
        applicantName: `${data.firstname} ${data.surname}`
    };

    console.log(notificationData); // To verify the notification data

    try {
        await postData(data);
        await postNotification(notificationData);

        // Navigate to applicants page after successful submission
        window.location.href = "applicants.html";
    } catch (error) {
        console.error("Error processing form:", error);
    }
}

async function postData(data) {
    try {
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
            throw new Error("Failed to submit application");
        }

        let result = await response.json();
        console.log(result);
    } catch (error) {
        console.error("Error in postData:", error);
        throw error;
    }
}

async function postNotification(notificationData) {
    try {
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
            throw new Error("Failed to add notification");
        }

        let result = await response.json();
        console.log(result.message);
    } catch (error) {
        console.error("Error in postNotification:", error);
        throw error;
    }
}

module.exports = {
    PostForm,
    postData,
    postNotification
};
