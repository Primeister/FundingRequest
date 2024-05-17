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

            const container = document.createElement('div');
            container.classList.add('dropdown');

            const modifyButton = document.createElement('button');
            modifyButton.classList.add('card-button');
            modifyButton.textContent = 'Modify';

            let dropdownMenu;
            modifyButton.addEventListener('mouseenter', function() {
                // Create dropdown menu
                dropdownMenu = document.createElement('div');
                dropdownMenu.classList.add('dropdown-content');

                // Add elements to modify the funding opportunity
                const elementsToModify = ['Edit Name', 'Edit Description', 'Edit Requirements', 'Edit Deadline'];
                elementsToModify.forEach(element => {
                    const option = document.createElement('a');
                    option.textContent = element;
                    option.href='#';
        
                    option.addEventListener('click', async function(event) {
                        event.preventDefault();
                        let newValue;
                        // Retrieve existing data based on the selected option
                        switch (element) {
                            case 'Edit Name':
                                newValue = prompt('Enter the new name:', fundingOpportunity.FundingName);
                                break;
                            case 'Edit Description':
                                newValue = prompt('Enter the new description:', fundingOpportunity.FundingDescription);
                                break;
                            case 'Edit Requirements':
                                newValue = prompt('Enter the new requirements:', fundingOpportunity.Requirements);
                                break;
                            case 'Edit Deadline':
                                newValue = prompt('Enter the new deadline:', fundingOpportunity.Deadline);
                                break;
                            default:
                                break;
                        }
                    
                        if (newValue !== null) {
                            try {
                                const updatedData = await modifyFundOpp(fundingOpportunity.FundingName, newValue);
                                // Optionally, update the UI with the updated data
                            } catch (error) {
                                // Handle any errors that occur during the modification process
                                console.error('Error modifying funding opportunity:', error);
                            }
                        }
                        dropdownMenu.remove();
                    });
                    
                    dropdownMenu.appendChild(option);
                });

                container.appendChild(dropdownMenu);
            });

            container.appendChild(modifyButton);

            container.addEventListener('mouseleave', function(event) {
                const isMouseOverButton = modifyButton.contains(event.relatedTarget);
                const isMouseOverDropdown = dropdownMenu && dropdownMenu.contains(event.relatedTarget);
                if (!isMouseOverButton && !isMouseOverDropdown && dropdownMenu) {
                    dropdownMenu.remove();
                }
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
                modifyButton.classList.add('card-button-violet');
                removeButton.classList.add('card-button-violet');
            } else {
                seeMoreButton.classList.add('card-button-purple');
                modifyButton.classList.add('card-button-purple');
                removeButton.classList.add('card-button-purple');
            }
            opportunityDiv.appendChild(nameHeading);
            opportunityDiv.appendChild(deadlineParagraph);
            opportunityDiv.appendChild(seeMoreButton);
            container.appendChild(removeButton);
            opportunityDiv.appendChild(container);
            
            let fundingOpportunitiesSection = document.getElementById('landing-section');
            fundingOpportunitiesSection.appendChild(opportunityDiv);
        });
    } catch (error) {
        console.error(error);
    }
}
document.addEventListener("DOMContentLoaded", fetchData);

async function modifyFundOpp(fundingName, newValue) {
    try {
         const url = `https://fundreq.azurewebsites.net/modifyFundOpp/${fundingName}`;
         const response = await fetch(url, {
             method: 'PUT',
             headers: {
                 'Content-Type': 'application/json'
             },
             body: JSON.stringify({ newValue })
         });

         if (!response.ok) {
             throw new Error('Failed to modify funding opportunity');
         }

         const data = await response.json();
         return data;
     } catch (error) {
         console.error('Error modifying funding opportunity:', error);
         throw error;
    }
}

module.exports = {
    fetchData, modifyFundOpp
}

