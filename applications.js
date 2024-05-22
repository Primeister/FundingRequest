async function fetchApplicants() {
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
        console.log('Applicants:', data);

        // Create tabs for filtering
        createTabs();
        
        // Initially display all applications
        displayApplications(data, 'All');

        // Add event listeners to tabs
        document.getElementById('tab-all').addEventListener('click', () => displayApplications(data, 'All'));
        document.getElementById('tab-processing').addEventListener('click', () => displayApplications(data, 'Processing'));
        document.getElementById('tab-approved').addEventListener('click', () => displayApplications(data, 'Approved'));
        document.getElementById('tab-rejected').addEventListener('click', () => displayApplications(data, 'Rejected'));

    } catch (error) {
        console.error('Error fetching applicants:', error);
    }
}

function createTabs() {
    const tabContainer = document.createElement('div');
    tabContainer.classList.add('tab-container');

    const tabs = ['All', 'Processing', 'Approved', 'Rejected'];
    tabs.forEach(tab => {
        const tabButton = document.createElement('button');
        tabButton.textContent = tab;
        tabButton.id = `tab-${tab.toLowerCase()}`;
        tabButton.classList.add('tab-button');
        tabContainer.appendChild(tabButton);
    });

    const fundingOppTable = document.getElementById('fundingOppTable');
    fundingOppTable.innerHTML = ''; // Clear existing content
    fundingOppTable.appendChild(tabContainer);
}

function displayApplications(data, filter) {
    const table = document.createElement('table');
    table.classList.add('applicant-table');

    // Create table header
    let headerRow = table.insertRow();
    let headers = ['Name', 'DOB', 'CONTACT NUMBER', 'EMAIL', "STATUS", ''];
    headers.forEach(headerText => {
        let headerCell = document.createElement('th');
        headerCell.classList.add('tableHeadersClass');
        headerCell.textContent = headerText;
        headerRow.appendChild(headerCell);
    });

    let fundingOppTable = document.getElementById('fundingOppTable');
    fundingOppTable.innerHTML = ''; // Clear existing table content

    const filteredData = filter === 'All' ? data : data.filter(application => application.status.toLowerCase() === filter.toLowerCase());

    // Add new applicants
    filteredData.forEach(application => {
        let row = table.insertRow(); // Insert row at the end of the table
        row.classList.add('status-row');
        row.setAttribute('data-status', application.status);
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

        modalButton.addEventListener('click', function() {
            sessionStorage.setItem("applicant_email", application.email);
            showModal(application);
            // table.style.display = 'none';
            // tabContainer.style.display = 'none'; // Hide the container when the button is clicked
            document.getElementById('tabsandtableID').style.display = 'none'; // Hide the container when the button is clicked
            const modalContent = document.querySelector('.applicantModalClass');
            modalContent.style.display = 'block'; // Show the modal content when the button is clicked
        });

        modalButtonCell.appendChild(modalButton);
    });

    // Insert table header and body into the fundingOppTable
    fundingOppTable.appendChild(table);
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
    const applicantAmount = application.requested_amount;
    console.log('ApplicantAmount:', applicantAmount);

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
            <p>Amount Requested: R${applicantAmount}</p>
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

    // Dynamically create checkboxes for requirements
    const requirementsSection = document.createElement('aside');
    requirementsSection.classList.add('eachApplicantMain');
    requirementsSection.id = 'FundOppCriteria';

    const requirementsTitle = document.createElement('h2');
    requirementsTitle.textContent = 'Eligibility Criteria';
    requirementsSection.appendChild(requirementsTitle);

    requirements.split('\n').forEach(requirement => {
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

    const acceptRejectSection = document.createElement('div');
    acceptRejectSection.classList.add('requirements');
    acceptRejectSection.id = 'acceptRejectSection';
    const acceptApplicant = document.createElement('button');
    acceptApplicant.id = 'acceptButton';
    acceptApplicant.textContent = 'Accept';
    acceptApplicant.classList.add('acceptButton');
    const rejectApplicant = document.createElement('button');
    rejectApplicant.textContent = 'Reject';
    rejectApplicant.id ='rejectButton';
    rejectApplicant.classList.add('rejectButton');
    
    acceptRejectSection.appendChild(acceptApplicant);
    acceptRejectSection.appendChild(rejectApplicant);

    acceptApplicant.addEventListener('click', () => {
        const applicantEmail = sessionStorage.getItem('applicant_email');
        let headersList = {
            "Accept": "*/*"
        }

        const bodyContent = JSON.stringify({
            "requested_amount": applicantAmount
        });

        const response = fetch(`https://fundreq.azurewebsites.net/applications/${sessionStorage.getItem('FundingName')}/${applicantEmail}/accept`, { 
            method: "POST",
            mode: "cors",
            headers: headersList,
            body: bodyContent
        }).then(response => response.json());
        if(response.error === "Applicant amount exceeds budget"){
            showInsufficientFundsPopup();
        }
        
    });

    rejectApplicant.addEventListener('click', () => {
        const applicantEmail = sessionStorage.getItem('applicant_email');
        let headersList = {
            "Accept": "*/*"
        }

        fetch(`https://fundreq.azurewebsites.net/applications/${sessionStorage.getItem('FundingName')}/${applicantEmail}/reject`, { 
            method: "GET",
            headers: headersList
        });
    });

    applSection.insertAdjacentElement("afterend", acceptRejectSection);
    
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

    document.querySelector(`.tab-content.${tabName.split(' ').join('-')}`).classList.add('active');
    document.querySelector(`.tab.${tabName}`).classList.add('active');
}

function filterStatus(status) {
    var rows = document.getElementsByClassName('status-row');
  
    for (var i = 0; i < rows.length; i++) {
      var row = rows[i];
      var currentStatus = row.getAttribute('data-status');
  
      if (status === 'all' || currentStatus === status) {
        row.style.display = '';
      } else {
        row.style.display = 'none';
      }
    }
  }

  function showInsufficientFundsPopup() {
  // Create the popup container
  const popupContainer = document.createElement("div");
  popupContainer.classList.add("popup-container");

  // Create the popup content
  const popupContent = document.createElement("div");
  popupContent.classList.add("popup-content");

  // Create the message
  const message = document.createElement("p");
  message.textContent = "Insufficient Funds";

  // Create the link
  const link = document.createElement("a");
  link.href = "budget.html"; // Replace with the actual URL of the budget page
  link.textContent = "Go to Budget Page";

  // Append the message and link to the popup content
  popupContent.appendChild(message);
  popupContent.appendChild(link);

  // Append the popup content to the container
  popupContainer.appendChild(popupContent);

  // Append the popup container to the document body
  document.body.appendChild(popupContainer);

  // Add an event listener to close the popup when clicked outside
  popupContainer.addEventListener("click", function(event) {
    if (event.target === popupContainer) {
      popupContainer.remove();
    }
  });
}
  
