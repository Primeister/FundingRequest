async function fetchApplicationData() {
    try {
        let email = storageSession("email");
        console.log("email: ", email);
        if (!email) {
            console.error("No email found in session storage.");
            alert("No email found in session storage.");
            return;
        }
        
        const response = await fetch('https://fundreq.azurewebsites.net/applications/status/' email);
        if (!response.ok) {
            throw new Error('Failed to fetch application data');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching application data:', error);
        return [];
    }
}

async function displayApplicationStatus() {
    let data = await fetchApplicationData();

    const mainContainer = document.querySelector('.classMain');
    const table = document.createElement('table');
    table.classList.add('status-table');

    const headerRow = document.createElement('tr');
    headerRow.innerHTML = `
        <th>Application Name</th>
        <th>Application Status</th>
        <th>Actions</th>
    `;
    table.appendChild(headerRow);

    data.forEach((application, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${application.funding_name}</td>
            <td>${application.status}</td>
            <td><button class="review-button" data-index="${index}">Review</button></td>
        `;
        table.appendChild(row);

        // Add event listener directly to the button
        const button = row.querySelector('.review-button');
        button.addEventListener('click', function() {
            // Hide the table
            table.style.display = 'none';
            displayApplicationDetails(application);
        });
    });

    mainContainer.insertBefore(table, document.getElementById('application-details-container'));
}

function displayApplicationDetails(application) {
    const detailsContainer = document.getElementById('application-details-container');
    detailsContainer.innerHTML = `
        <h2>Personal Information</h2>
        <p><strong>Name:</strong> ${application.surname} ${application.firstname}</p>
        <p><strong>Mobile:</strong> ${application.mobile}</p>
        <p><strong>Email:</strong> ${application.email}</p>
        <p><strong>ID number:</strong> ${application.id_number}</p>
        <p><strong>Date of birth:</strong> ${application.dob}</p>
        <p><strong>Citizenship:</strong> ${application.citizenship}</p>
        <hr>
    `;
}

document.addEventListener('DOMContentLoaded', function () {
    displayApplicationStatus();
});








