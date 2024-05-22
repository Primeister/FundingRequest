function displayNotifications(notifications) {
  const notificationsContainer = document.getElementById('notifications');
  notificationsContainer.innerHTML = ''; // Clear existing notifications

  notifications.forEach(notification => {
    const notificationRow = document.createElement('tr');

    const applicantCell = document.createElement('td');


    const applicantLink = document.createElement('a');
    applicantLink.href = '#';
    applicantLink.textContent = notification.applicantName;
    applicantLink.addEventListener('click', function() {
      // Store the notification details in sessionStorage
      sessionStorage.setItem("applicantName", notification.applicantName);
      sessionStorage.setItem("FundingName", notification.fundOppName);
      console.log("Funding Name: " + notification.fundOppName);
      console.log("Applicant Name: " + notification.applicantName);

      const applicantInfoSection = document.getElementById('applicantInfo');
      applicantInfoSection.style.display = 'block';

      const eligibilityCriteriaSection = document.getElementById('FundOppCriteria');
      eligibilityCriteriaSection.style.display = 'block';

      fetchApplicants(notification.fundOppName);
    });

    applicantCell.appendChild(applicantLink);
    notificationRow.appendChild(applicantCell);

    const fundingCell = document.createElement('td');
    fundingCell.textContent = notification.fundOppName;
    notificationRow.appendChild(fundingCell);

    const timestampCell = document.createElement('td');
    // Convert timestamp to local time
    const localTime = convertToLocalTime(notification.timestamp);
    timestampCell.textContent = localTime;
    notificationRow.appendChild(timestampCell);

    notificationsContainer.appendChild(notificationRow);
  });
}

async function fetchApplicants(fundingName) {
  try {
    // Hides the inbox section
    document.getElementById('inbox-section').style.display = 'none';

    let fundingName = sessionStorage.getItem('FundingName');
    console.log("Funding Name: " + fundingName);
    if (!fundingName) {
      throw new Error("Funding Name not found in sessionStorage");
    }
    const response = await fetch(`https://fundreq.azurewebsites.net/applications/${fundingName}`);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    console.log('Applicants:', data);

    const applicantName = sessionStorage.getItem("applicantName");
    const specificApplicant = data.find(applicant => `${applicant.firstname} ${applicant.surname}` === applicantName);
    console.log('Specific Applicant:', specificApplicant);

    // If specific applicant is found, you can do further processing
    if (specificApplicant) {
      // Do something with specificApplicant, such as showing modal
      showModal(specificApplicant);
    } else {
      console.log('Applicant not found');
      // Handle case where applicant is not found
    }
  } catch (error) {
    console.error('Error fetching applicants:', error);
  }
}

function convertToLocalTime(timestamp) {
  const date = new Date(timestamp + 'Z'); // Append 'Z' to indicate UTC time
  return date.toLocaleString();
}

function showInbox() {
  // Hide other sections
  document.querySelectorAll('.classMain > section').forEach(section => {
    section.style.display = 'none';
  });
  // Hide the entire section
  const applicantInfoSection = document.getElementById('applicantInfo');
  applicantInfoSection.style.display = 'none';
  
  const eligibilityCriteriaSection = document.getElementById('FundOppCriteria');
  eligibilityCriteriaSection.style.display = 'none';

  // Show inbox section
  document.getElementById('inbox-section').style.display = 'block';
  // Fetch notifications if not already fetched
  if (!window.notifications) {
    fetchNotifications();
  } else {
    displayNotifications(window.notifications);
  }
}

function countUnreadNotifications(notifications) {
  const unreadCount = notifications.filter(notification => !notification.read).length;
  const inboxLink = document.getElementById('inboxLink');
  let countElement = document.getElementById('unread-count');

  if (!countElement) {
    countElement = document.createElement('span');
    countElement.id = 'unread-count';
    countElement.style.background = 'red';
    countElement.style.color = 'white';
    countElement.style.borderRadius = '50%';
    countElement.style.padding = '2px 6px';
    countElement.style.position = 'absolute';
    countElement.style.top = '0';
    countElement.style.right = '0';
    countElement.style.fontSize = '12px';
    inboxLink.appendChild(countElement);
  }

  countElement.textContent = unreadCount;
}

// Function to count the number of applicants per day
function countApplicantsPerDay(notifications) {
  const counts = notifications.reduce((acc, notification) => {
    const date = new Date(notification.timestamp + 'Z').toISOString().split('T')[0]; // Extract date part only
    acc[date] = (acc[date] || 0) + 1;
    return acc;
  }, {});
  return counts;
}

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
  // requirementsSection.innerHTML='';
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
  acceptRejectSection.classList.add('acceptRejectClass');

  const acceptButton = document.createElement('button');
  acceptButton.classList.add('acceptButtonClass');
  acceptButton.textContent = 'Accept';

  acceptButton.addEventListener('click', function() {
    fetch(`https://fundreq.azurewebsites.net/applications/${applicantEmail}/accept`, { method: 'PUT' })
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        console.log('Application accepted:', data);
      })
      .catch(error => {
        console.error('Error accepting application:', error);
      });
  });

  const rejectButton = document.createElement('button');
  rejectButton.classList.add('rejectButtonClass');
  rejectButton.textContent = 'Reject';

  rejectButton.addEventListener('click', function() {
    fetch(`https://fundreq.azurewebsites.net/applications/${applicantEmail}/reject`, { method: 'PUT' })
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        console.log('Application rejected:', data);
      })
      .catch(error => {
        console.error('Error rejecting application:', error);
      });
  });

  acceptRejectSection.appendChild(acceptButton);
  acceptRejectSection.appendChild(rejectButton);

  let applicantSection2 = document.getElementById('acceptReject');
  applicantSection2.appendChild(acceptRejectSection);

  // Initially show the first tab content
  showTabContent(sections[0].name);
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
document.addEventListener("DOMContentLoaded", fetchApplicants);
