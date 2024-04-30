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
                viewApplicants();
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

function viewApplicants(){

}

function moreDetails(){

}
