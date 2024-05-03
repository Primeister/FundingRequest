async function fetchApplicants(){
    const fundingName = sessionStorage.getItem("FundingName");
    if (!fundingName) {
        console.error("FundingName not found in sessionStorage");
        return;
    }

    try {
        const response = await fetch(`https://fundreq.azurewebsites.net/applications/${fundingName}`);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();

        let table = document.createElement('table');
        table.classList.add('applicant-table');

        let headerRow = table.insertRow();
        let headers = ['Name', 'DOB', 'CONTACT NUMBER', 'EMAIL', "STATUS", ''];
        headers.forEach(headerText => {
            let headerCell = document.createElement('th');
            headerCell.textContent = headerText;
            headerRow.appendChild(headerCell);
        });

        data.forEach(application => {
            let row = table.insertRow();
            let nameCell = row.insertCell();
            nameCell.textContent = `${application.firstname} ${application.surname}`;
            let dobCell = row.insertCell();
            dobCell.textContent = application.dob;
            let numberCell = row.insertCell();
            numberCell.textContent = application.mobile;
            let emailCell = row.insertCell();
            emailCell.textContent = application.email;
            let statusCell = row.insertCell();
            statusCell.textContent = application.status;
            let modalButtonCell = row.insertCell();
            let modalButton = document.createElement('button');
            modalButton.classList.add('modalButtonClass');
            modalButton.textContent = 'View More';

            modalButton.addEventListener('click', function(){
                //show modal dialog of each applicant
                function showModal(application){
                    
                }

            });
            modalButtonCell.appendChild(modalButton);
        });

        let fundingOppTable = document.getElementById('fundingOppTable');
        fundingOppTable.innerHTML = ''; // Clear existing table content
        fundingOppTable.appendChild(table);


    } catch (error) {
        console.error('Error fetching applicants:', error);
    }
}

document.addEventListener("DOMContentLoaded", fetchApplicants);
