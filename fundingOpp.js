let data = {
    fundingName: "Name",
    fundingType: "Type",
    fundingDecription: "Description",
    fundingRequirements: "Requirements",
    deadline: "Deadline"
}

let headersList = {
    "Accept": "*/*",
    "Content-Type": "application/json"
};

let requestOptions = {
    method: 'GET', // or 'POST' if you intend to send data
    headers: headersList,
    mode: "cors"
};

let fundingOpportunitiesSection = document.getElementById('funding-opportunities');
let email = sessionStorage.getItem('email');
let fundingRequirements = '';

if(email){ 
    // Fetch opportunities for the specified fund manager's email address
    fetch(`https://fundreq.azurewebsites.net/fundingOpportunities/${encodeURIComponent(email)}`, requestOptions)
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        console.log(data);
    
        data.forEach(opp => {
            /*//used to get the requirements from the table
            fundingRequirements.textContent = opp.fundingRequirements;*/

            let opportunityArticle = document.createElement('article');
            opportunityArticle.classList.add('opportunitySection');

            // Create the h2 element with class "name"
            let nameHeading = document.createElement('h2');
            nameHeading.classList.add('name');
            nameHeading.textContent = opp.FundingName; // Set text content

            // Create the p element with class "description"
            let nameDescription = document.createElement('p');
            nameDescription.classList.add('description');
            nameDescription.textContent = "Description: " + opp.FundingDecription ;//set text content


            // Create the p element with class "deadline"
            let deadlineHeading = document.createElement('p');
            deadlineHeading.classList.add('deadline');
            deadlineHeading.textContent = "Deadline: " + opp.Deadline;// Set text content

            let seeMoreButton = document.createElement('button');
            seeMoreButton.textContent = "See More";
            seeMoreButton.classList.add('card-button');

            //onClick it calls the viewApplicant
            seeMoreButton.addEventListener('click', function () {
                let fundingOppName = opp.FundingName;
                fetchApplicants(fundingOppName);
            });

            opportunityArticle.appendChild(nameHeading);
            opportunityArticle.appendChild(deadlineHeading);
            opportunityArticle.appendChild(seeMoreButton);

            fundingOpportunitiesSection.appendChild(opportunityArticle);
        });
    })
    .catch(error => console.error('Error:', error));
}else {
    console.log("Email not found in session storage.");
}

let fundingOppTable = document.getElementById('myTable');
function fetchApplicants(fundingOppName) {
    fetch(`https://fundreq.azurewebsites.net/applications/${encodeURIComponent(fundingOppName)}`, requestOptions)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            // Clear existing table content
            fundingOppTable.innerHTML = '';

            // Create table header
            let headerRow = fundingOppTable.insertRow();
            let headers = ['Full Name', 'Submission Date', 'Application Status', '']; // Add empty string for the last column (See More)
            headers.forEach(headerText => {
                let headerCell = document.createElement('th');
                headerCell.textContent = headerText;
                headerRow.appendChild(headerCell);
            });

            // Populate table with application data
            data.forEach(application => {
                let row = fundingOppTable.insertRow();
                let fullNameCell = row.insertCell();
                fullNameCell.textContent = application.surname + ' ' + application.firstname; // Assuming 'surname' and 'firstname' are columns in your data
                let submissionDateCell = row.insertCell();
                submissionDateCell.textContent = application.submission_date; // Assuming 'submission_date' is a column in your data
                let statusCell = row.insertCell();
                statusCell.textContent = application.application_status; // Assuming 'application_status' is a column in your data
                let seeMoreCell = row.insertCell();
                let seeMoreButton = document.createElement('button');
                seeMoreButton.textContent = 'More Details';
                seeMoreButton.classList.add('table-button');
                seeMoreButton.addEventListener('click', function() {
                    moreDetails(application.surname + ' ' + application.firstname, mobile,email,id_number,dob,citizenship); // Call moreDetails function when button is clicked
                });
                seeMoreCell.appendChild(seeMoreButton);
            });
        })
        .catch(error => console.error('Error fetching applicants:', error));
}
/*
//function that gets called when the  More Details button gets clicked
function moreDetails(applicantName, mobile, email, idNumber, dob, citizenship){
    let mainElement = document.createElement('main');
    mainElement.classList.add('eachApplicantMain');

    let applicantDetailsSection = document.createElement('section');

    let fullName = document.createElement('h2');
    fullName.textContent = applicantName;

    let mobileElement = document.createElement('p');
    mobileElement.textContent = "Mobile: " + mobile;

    let emailElement = document.createElement('p');
    emailElement.textContent = "Email: " + email;

    let idNumberElement = document.createElement('p');
    idNumberElement.textContent = "ID Number: " + idNumber;

    let dobElement = document.createElement('p');
    dobElement.textContent = "Date of Birth: " + dob;

    let citizenshipElement = document.createElement('p');
    citizenshipElement.textContent = "Citizenship: " + citizenship;

    // Append applicant details to the section
    applicantDetailsSection.appendChild(fullName);
    applicantDetailsSection.appendChild(mobileElement);
    applicantDetailsSection.appendChild(emailElement);
    applicantDetailsSection.appendChild(idNumberElement);
    applicantDetailsSection.appendChild(dobElement);
    applicantDetailsSection.appendChild(citizenshipElement);

    // Append the applicant details section to the main container
    mainElement.appendChild(applicantDetailsSection);

    // Append the main element to the document body
    document.body.appendChild(mainElement);
} */
