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
            headerCell.classList.add('tableHeadersClass');
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
            modalButton.textContent = 'Review';

            modalButton.addEventListener('click', function(){
                showModal(application);
                table.style.display = 'none';
                const modalContent = document.querySelector('.applicantModalClass');
                modalContent.style.display = 'block'; // Show the modal content when the button is clicked
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

function showModal(application) {
    const requirements = sessionStorage.getItem("Requirements");

    let existingModal = document.querySelector('.applicantModalClass');
    if (existingModal) {
        existingModal.remove();
    }
    const applicantName = `${application.firstname} ${application.surname}`;
    const applicantMobile = application.mobile;
    const applicantEmail = application.email;
    const applicantID = application.id_number;
    const applicantDOB = application.dob;
    const applicantCitizen = application.citizenship;

    const applicantArticle = document.createElement('article');
    applicantArticle.classList.add('applicantModalClass');

    const tabsContainer = document.createElement('div');
    tabsContainer.classList.add('tabs');

    const sections = [
        { name: 'Personal Information', content: `
            <h2 class="titleClass">Personal Information</h2>
            <p>Name: ${applicantName}</p>
            <p>Mobile: ${applicantMobile}</p>
            <p>Email: ${applicantEmail}</p>
            <p>ID number: ${applicantID}</p>
            <p>Date of birth: ${applicantDOB}</p>
            <p>Citizenship: ${applicantCitizen}</p>
        ` },
        { name: 'Educational Background', content: `
            <h2 class="titleClass">Educational Background</h2>
            <!-- Add educational background fields -->
        ` },
        { name: 'Professional Experience', content: `
            <h2 class="titleClass">Professional Experience</h2>
            <!-- Add professional experience fields -->
        ` },
        { name: 'Project/Proposal Details', content: `
            <h2 class="titleClass">Project/Proposal Details</h2>
            <!-- Add project/proposal details fields -->
        ` },
        { name: 'Budget and Financial Information', content: `
            <h2 class="titleClass">Budget and Financial Information</h2>
            <!-- Add budget and financial information fields -->
        ` },
        { name: 'Supporting Documents', content: `
            <h2 class="titleClass">Supporting Documents</h2>
            <!-- Add supporting documents fields -->
        ` },
        { name: 'References or Referrals', content: `
            <h2 class="titleClass">References or Referrals</h2>
            <!-- Add references or referrals fields -->
        ` },
        { name: 'Declaration and Consent', content: `
            <h2 class="titleClass">Declaration and Consent</h2>
            <!-- Add declaration and consent fields -->
        ` }
    ];


    sections.forEach(section => {
        const tab = document.createElement('div');
        tab.classList.add('tab');
        tab.textContent = section.name;
        tab.addEventListener('click', function() {
            showTabContent(section.name);
        });
        tabsContainer.appendChild(tab);

        const tabContent = document.createElement('div');
        tabContent.classList.add('tab-content');
        tabContent.innerHTML = section.content;
        tabContent.classList.add(section.name.split(' ').join('-')); // Add class based on section name
        applicantArticle.appendChild(tabContent);
    });

    tabsContainer.firstChild.classList.add('active'); // Activate first tab by default
    applicantArticle.appendChild(tabsContainer);

    let applicantSection = document.getElementById('applicantInfo');
    applicantSection.innerHTML = ''; // Clear existing content
    applicantSection.classList.add('applicantSectionClass');
    applicantSection.appendChild(applicantArticle);


    //aside info for the eligibility criteria
    // Dynamically create checkboxes for requirements
    const requirementsSection = document.createElement('aside');
    requirementsSection.classList.add('eachApplicantMain');
    requirementsSection.id = 'FundOppCriteria';

    const requirementsTitle = document.createElement('h2');
    requirementsTitle.textContent = 'Eligibility Criteria';
    requirementsSection.appendChild(requirementsTitle);
    
    // const requirementsLabel = document.createElement('label');
    // requirementsLabel.htmlFor = 'requirementsCheckbox';
    // requirementsLabel.textContent = 'Criteria';
    
    requirements.split('\n\n').forEach(requirement => {
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.id = 'requirementsCheckbox';
        checkbox.name = 'requirements';
        checkbox.classList.add('checkbox');
        
        const requirementLabel = document.createElement('label');
        requirementLabel.textContent = requirement;
        requirementLabel.classList.add('checkbox-label');
        
        requirementsSection.appendChild(checkbox);
        requirementsSection.appendChild(requirementLabel);
        requirementsSection.appendChild(document.createElement('br'));
    });

    let applSection = document.getElementById('reqClass');
    applSection.classList.add('requirements');
    applSection.appendChild(requirementsSection);
}
function showTabContent(tabName) {
    const tabs = document.querySelectorAll('.tab');
    const tabContents = document.querySelectorAll('.tab-content');

    tabs.forEach(tab => {
        tab.classList.remove('active');
    });
    tabContents.forEach(content => {
        content.classList.remove('active');
    });

    // Add 'active' class to all active tabs
    tabs.forEach(tab => {
        if (tab.textContent === tabName) {
            tab.classList.add('active');
        }
    });

    document.querySelector(`.tab-content.${tabName.split(' ').join('-')}`).classList.add('active');
    document.querySelector(`.tab.${tabName}`).classList.add('active');
}
