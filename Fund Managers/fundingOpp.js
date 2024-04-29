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
            let opportunityDiv = document.createElement('div');
            opportunityDiv.classList.add('opportunity');

        // Create the inner div with class "title"
            let titleDiv = document.createElement('div');
            titleDiv.classList.add('title');

        // Create the h2 element with class "name"
            let nameHeading = document.createElement('h2');
            nameHeading.classList.add('name');
            nameHeading.textContent = opp.FundingName; // Set text content

        // Create the h4 element with class "deadline"
            let deadlineHeading = document.createElement('h4');
            deadlineHeading.classList.add('deadline');
            deadlineHeading.textContent = "Closes: " + opp.deadline;// Set text content

        // Create "See More" button
            let seeMoreButton = document.createElement('button');
            seeMoreButton.classList.add('see-more-button');
            seeMoreButton.textContent = 'See More';
            seeMoreButton.addEventListener('click', function() {
            // Redirect the user to the applications page
                window.location.href = 'applications.html';
            });

        // Append the "See More" button to the "opportunity" div
            opportunityDiv.appendChild(seeMoreButton);

            titleDiv.appendChild(nameHeading);
            titleDiv.appendChild(deadlineHeading);
            opportunityDiv.appendChild(titleDiv);


        // Append the "opportunity" div to the fundingOpportunitiesSection
            fundingOpportunitiesSection.appendChild(opportunityDiv);

            opportunityDiv.addEventListener('click', function() {
            // Your event handler code here
                descriptionParagraph.textContent = opp.FundingDescription;
            });
        });
    })
    .catch(error => console.error('Error:', error));
}else {
    console.log("Email not found in session storage.");
}
