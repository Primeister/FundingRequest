let requirementData = {};
let fundingData = {};

async function fetchData() {
    try {
        //Get the email address from sessionStorage
        let email = sessionStorage.getItem('email');
        console.log(email)
       
        // Check if email exists
        if (!email) {
            throw new Error("Email not found in sessionStorage");
        } 

        const response = await fetch(`https://fundreq.azurewebsites.net/fundingOpportunities/`+ email);

        if (!response.ok) {
            throw new Error("Could not fetch resource");
        }
        
        const data = await response.json();

        data.forEach((fundingOpportunity, index) => {
            const fundingName = fundingOpportunity.FundingName;
            const deadline = fundingOpportunity.Deadline;
            const requirements = fundingOpportunity.Requirements;

            requirementData[fundingName] = requirements;

            // Store funding names by type
            if (!fundingData[fundingType]) {
                fundingData[fundingType] = []; // Initialize array if it doesn't exist
            }
            fundingData[fundingType].push(fundingName);
            console.log("data to be stored: " + fundingData)

            const opportunityDiv = document.createElement('div');
            opportunityDiv.classList.add('opportunitySection');

            const nameHeading = document.createElement('h1');
            nameHeading.textContent = `${fundingName}`;
            const deadlineParagraph = document.createElement('p');
            deadlineParagraph.classList.add('deadline');
            deadlineParagraph.textContent = `Deadline: ${deadline}`;

            const seeMoreButton = document.createElement('button');
            seeMoreButton.classList.add('card-button');
            seeMoreButton.textContent = 'See More';

            seeMoreButton.addEventListener('click', function() {
                sessionStorage.setItem('FundingName', fundingName);
                sessionStorage.setItem('Requirements', requirements);
                window.location.href = "applications.html";
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

                // Add elements to modify the funding opportunity, excluding 'FundingName'
                const elementsToModify = ['FundingDescription', 'Requirements', 'Deadline'];
                elementsToModify.forEach(element => {
                    const option = document.createElement('a');
                    option.textContent = element;
                    option.href = '#';

                    option.addEventListener('click', async function(event) {
                        event.preventDefault();
                        await editOption(fundingOpportunity, element);
                        dropdownMenu.remove(); // Remove dropdown menu after editing
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
            opportunityDiv.appendChild(removeButton);
            opportunityDiv.appendChild(container);
            
            let fundingOpportunitiesSection = document.getElementById('landing-section');
            fundingOpportunitiesSection.appendChild(opportunityDiv);
        });
        // After collecting all the funding names
        sessionStorage.setItem('FundingData', JSON.stringify(fundingData));
        sessionStorage.setItem('RequirementData', JSON.stringify(requirementData));

    } catch (error) {
        console.error(error);
    }
}

async function fetchFundManagerStatus() {
    try {
        const email = sessionStorage.getItem('email');
        if (!email) {
            throw new Error("Funder email not found in session storage");
        }

        const response = await fetch(`https://fundreq.azurewebsites.net/funder/${email}`);

        if (!response.ok) {
            throw new Error("Could not fetch fund manager status");
        }

        const data = await response.json();
        const fundManagerStatus = document.getElementById('fundManagerStatus');
        fundManagerStatus.textContent = `Status: ${data.status}`;
        if(!(data.status == "approved")){
            document.getElementById("advertLink").remove();
        }
    } catch (error) {
        console.error('Error fetching fund manager status:', error);
        const fundManagerStatus = document.getElementById('fundManagerStatus');
        fundManagerStatus.textContent = 'Error loading status';
    }
}

async function editOption(fundingOpportunity, field) {
    console.log('Editing field:', field);  // Debugging log
    const currentValue = fundingOpportunity[field];
    console.log('Current value:', currentValue);  // Debugging log

    const newValue = await createPopup(`Enter the new ${field}:`, currentValue);
    if (newValue !== null) {
        try {
            const updatedData = await modifyFundOpp(fundingOpportunity.FundingName, field, newValue);
            console.log('Updated data:', updatedData);
        } catch (error) {
            console.error('Error modifying funding opportunity:', error);
        }
    }
}

function createPopup(message, defaultValue) {
    return new Promise((resolve) => {
        // Create modal elements
        const modalBackdrop = document.createElement('div');
        modalBackdrop.classList.add('modal-backdrop');

        const modal = document.createElement('div');
        modal.classList.add('modal');

        const modalContent = document.createElement('div');
        modalContent.classList.add('modal-content');

        const messageParagraph = document.createElement('p');
        messageParagraph.textContent = message;

        const textArea = document.createElement('textarea');
        textArea.value = defaultValue || ''; // Fallback to an empty string if defaultValue is undefined
        textArea.rows = 10; // Set the number of rows for the textarea to display multiple lines

        const buttonContainer = document.createElement('div');
        buttonContainer.classList.add('button-container');

        const confirmButton = document.createElement('button');
        confirmButton.textContent = 'Confirm';
        confirmButton.classList.add('confirm-remove-button');

        const cancelButton = document.createElement('button');
        cancelButton.textContent = 'Cancel';
        cancelButton.classList.add('cancel-button');

        // Event listeners for buttons
        confirmButton.addEventListener('click', () => {
            resolve(textArea.value);
            modalBackdrop.remove();
        });

        cancelButton.addEventListener('click', () => {
            resolve(null);
            modalBackdrop.remove();
        });

        // Append buttons to button container
        buttonContainer.appendChild(confirmButton);
        buttonContainer.appendChild(cancelButton);

        // Append elements to modal content
        modalContent.appendChild(messageParagraph);
        modalContent.appendChild(textArea);
        modalContent.appendChild(buttonContainer);
        modal.appendChild(modalContent);

        // Append modal to document body
        modalBackdrop.appendChild(modal);
        document.body.appendChild(modalBackdrop);
    });
}

async function modifyFundOpp(fundingName, field, newValue) {
    try {
        const url = `https://fundreq.azurewebsites.net/modifyFundOpp/${fundingName}`;
        const response = await fetch(url, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ aspect: field.toLowerCase(), newValue })
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

document.addEventListener("DOMContentLoaded", fetchData);
document.addEventListener("DOMContentLoaded", fetchFundManagerStatus);
module.exports = {
    fetchData, modifyFundOpp
}
