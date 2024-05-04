async function fetchData() {
    try {
         //Get the email address from sessionStorage
         let email = sessionStorage.getItem('email');
         console.log(email)
        
         // Check if email exists
         if (!email) {
             throw new Error("Email not found in sessionStorage");
         } 

        const response = await fetch(`https://fundreq.azurewebsites.net/fundingOpportunities/${email}`);

        if (!response.ok) {
            throw new Error("Could not fetch resource");
        }
        
        const data = await response.json();

        data.forEach((fundingOpportunity,index) => {
            const fundingName = fundingOpportunity.FundingName;
            // const fundingType = fundingOpportunity.FundingType;
            // const fundingDescription = fundingOpportunity.FundingDescription;
            // const requirements = fundingOpportunity.Requirements;
            const deadline = fundingOpportunity.Deadline;

            const opportunityDiv = document.createElement('div');
            opportunityDiv.classList.add('opportunitySection')

            const nameHeading = document.createElement('h1');
            nameHeading.textContent = `${fundingName}`;
            // const typeParagraph = document.createElement('p');
            // typeParagraph.textContent = `Funding Type: ${fundingType}`;
            // const descriptionParagraph = document.createElement('p');
            // descriptionParagraph.textContent = `Description: ${fundingDescription}`;
            // const requirementsParagraph = document.createElement('p');
            // requirementsParagraph.textContent = `Requirements: ${requirements}`;
             const deadlineParagraph = document.createElement('p');
             deadlineParagraph.classList.add('deadline');
            deadlineParagraph.textContent = `Deadline: ${deadline}`;

            const seeMoreButton = document.createElement('button');
            seeMoreButton.classList.add('card-button')
            seeMoreButton.textContent = 'See More';

            seeMoreButton.addEventListener('click', function(){
                sessionStorage.setItem('FundingName', fundingName);
                //fetchApplicants();
                window.location.href="applications.html";
            });

            const removeButton = document.createElement('button');
            removeButton.classList.add('card-button');
            removeButton.textContent = 'Remove';

            removeButton.addEventListener('click', function(){
                //
            });
            // Add alternating class based on index
            if (index % 2 === 0) {
                seeMoreButton.classList.add('card-button-violet');
                removeButton.classList.add('card-button-violet');
            } else {
                seeMoreButton.classList.add('card-button-purple');
                removeButton.classList.add('card-button-purple');
            }
            opportunityDiv.appendChild(nameHeading);
            // opportunityDiv.appendChild(typeParagraph);
            // opportunityDiv.appendChild(descriptionParagraph);
            // opportunityDiv.appendChild(requirementsParagraph);
            opportunityDiv.appendChild(deadlineParagraph);
            opportunityDiv.appendChild(seeMoreButton);
            opportunityDiv.appendChild(removeButton);

            let fundingOpportunitiesSection = document.getElementById('landing-section');
            fundingOpportunitiesSection.appendChild(opportunityDiv);
        });
    } catch (error) {
        console.error(error);
    }
}
document.addEventListener("DOMContentLoaded", fetchData);


module.exports = {
    fetchData
}
