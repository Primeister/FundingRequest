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
        let headers = ['Name', 'ID', 'DOB'];
        headers.forEach(headerText => {
            let headerCell = document.createElement('th');
            headerCell.textContent = headerText;
            headerRow.appendChild(headerCell);
        });

        data.forEach(application => {
            let row = table.insertRow();
            let nameCell = row.insertCell();
            nameCell.textContent = `${application.firstname} ${application.surname}`;
            let idCell = row.insertCell();
            idCell.textContent = application.id_number;
            let dobCell = row.insertCell();
            dobCell.textContent = application.dob;
        });

        let fundingOppTable = document.getElementById('fundingOppTable');
        fundingOppTable.innerHTML = ''; // Clear existing table content
        fundingOppTable.appendChild(table);

        // Hide the card container
        fundingOpportunitiesSection.classList.add('hide');

    } catch (error) {
        console.error('Error fetching applicants:', error);
    }
}

document.addEventListener("DOMContentLoaded", fetchApplicants);
