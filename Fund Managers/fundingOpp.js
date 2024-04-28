let data = {
    fundingName: "Name",
    fundingType: "Type",
    fundingDecription: "Description",
    fundingRequirements: "Requirements",
    deadline: "Deadline"
}

// Define the email address of the fund manager
const fundManagerEmail = "athinimgagule03@gmail.com"; // Replace this with the fund manager's email address

// Fetch opportunities for the specified fund manager's email address
let response = fetch(`https://fundreq.azurewebsites.net/getOpportunityByManager/${encodeURIComponent(fundManagerEmail)}`, requestOptions)
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        console.log(data);
        const fundingOpportunitiesSection = document.getElementById('funding-opportunities');

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
            deadlineHeading.textContent = "Closes: " + opp.Deadline;// Set text content

            // Create "See More" button
            let seeMoreButton = document.createElement('button');
            seeMoreButton.classList.add('see-more-button');
            seeMoreButton.textContent = 'See More';
            seeMoreButton.addEventListener('click', function() {
                // Redirect the user to the applications page
                window.location.href = 'applications.html'; // Replace 'applications.html' with the URL of your applications page
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
