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
            const deadline = fundingOpportunity.Deadline;
            const requirements = fundingOpportunity.Requirements;

            const opportunityDiv = document.createElement('div');
            opportunityDiv.classList.add('opportunitySection')

            const nameHeading = document.createElement('h1');
            nameHeading.textContent = `${fundingName}`;
             const deadlineParagraph = document.createElement('p');
             deadlineParagraph.classList.add('deadline');
            deadlineParagraph.textContent = `Deadline: ${deadline}`;

            const seeMoreButton = document.createElement('button');
            seeMoreButton.classList.add('card-button')
            seeMoreButton.textContent = 'See More';

            seeMoreButton.addEventListener('click', function(){
                sessionStorage.setItem('FundingName', fundingName);
                sessionStorage.setItem('Requirements', requirements);
                window.location.href="applications.html";
            });

            const removeButton = document.createElement('button');
            removeButton.classList.add('card-button');
            removeButton.textContent = 'Remove';

           removeButton.addEventListener('click', function() {
                // Create a popup dialog
                const confirmationPopup = document.createElement('div');
                confirmationPopup.classList.add('confirmation-popup');
            
                const popupContent = document.createElement('div');
                popupContent.classList.add('popup-content');
            
                const warningMessage = document.createElement('p');
                warningMessage.textContent = "Are you sure you want to remove this funding opportunity? This action cannot be undone.";
            
                const confirmRemoveButton = document.createElement('button');
                confirmRemoveButton.textContent = 'Remove';
                confirmRemoveButton.classList.add('confirm-remove-button');
            
                confirmRemoveButton.addEventListener('click', async function() {
                    try {
                        const id = fundingOpportunity.id; // Assuming you have an 'id' property in your fundingOpportunity object
            
                        const response = await fetch(`https://fundreq.azurewebsites.net/deletefundOpp/${id}`, {
                            method: 'DELETE',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                        });
            
                        if (!response.ok) {
                            throw new Error("Failed to remove funding opportunity");
                        }
            
                        // If the deletion is successful, remove the corresponding card from the UI
                        opportunityDiv.remove();
                        
                        // Close the popup
                        confirmationPopup.remove();
                    } catch (error) {
                        console.error(error);
                    }
                });
            
                const cancelButton = document.createElement('button');
                cancelButton.textContent = 'Cancel';
                cancelButton.classList.add('cancel-button');
            
                cancelButton.addEventListener('click', function() {
                    // Close the popup
                    confirmationPopup.remove();
                });
            
                popupContent.appendChild(warningMessage);
                popupContent.appendChild(confirmRemoveButton);
                popupContent.appendChild(cancelButton);
                confirmationPopup.appendChild(popupContent);
            
                document.body.appendChild(confirmationPopup);
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
