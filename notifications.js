document.addEventListener("DOMContentLoaded", function() {
  fetchNotifications();
  
  document.getElementById('inboxLink').addEventListener('click', function() {
    showInbox();
  });
});

async function fetchNotifications() {
  try {
    let email = sessionStorage.getItem('email');
    if (!email) {
      throw new Error("Email not found in sessionStorage");
    }

    const response = await fetch('https://fundreq.azurewebsites.net/notifications/' + email);
    if (!response.ok) {
      throw new Error("Failed to fetch notifications");
    }
    const notifications = await response.json();
    window.notifications = notifications; // Store notifications globally

    const applicantCounts = countApplicantsPerDay(notifications);
    sessionStorage.setItem('applicantCounts', JSON.stringify(applicantCounts));
    console.log("these are the inputs for the chart: " + applicantCounts);
    
    displayNotifications(notifications);
    countUnreadNotifications(notifications);

  } catch (error) {
    console.error("Error fetching notifications:", error);
  }
}

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
      
      const applicantInfoSection = document.getElementById('applicantInfo');
      applicantInfoSection.style.display = 'block';

      const eligibilityCriteriaSection = document.getElementById('FundOppCriteria');
      eligibilityCriteriaSection.style.display = 'block';
      
      sessionStorage.setItem("applicantName", notification.applicantName);
      sessionStorage.setItem("FundingName", notification.fundOppName);
      console.log("Funding Name: " + notification.fundOppName);
      console.log("Applicant Name: " + notification.applicantName);
      
      fetchApplicants(notification.fundOppName);
    });

    applicantCell.appendChild(applicantLink);
    notificationRow.appendChild(applicantCell);

    const fundingCell = document.createElement('td');
    fundingCell.textContent = notification.fundOppName;
    notificationRow.appendChild(fundingCell);

    const timestampCell = document.createElement('td');
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
  const date = new Date(timestamp + 'Z');
  return date.toLocaleString();
}

function showInbox() {
  document.querySelectorAll('.classMain > section').forEach(section => {
    section.style.display = 'none';
  });
  const applicantInfoSection = document.getElementById('applicantInfo');
  applicantInfoSection.style.display = 'none';
  
  const eligibilityCriteriaSection = document.getElementById('FundOppCriteria');
  eligibilityCriteriaSection.style.display = 'none';

  document.getElementById('inbox-section').style.display = 'block';
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

function countApplicantsPerDay(notifications) {
  const counts = notifications.reduce((acc, notification) => {
    const date = new Date(notification.timestamp + 'Z').toISOString().split('T')[0];
    acc[date] = (acc[date] || 0) + 1;
    return acc;
  }, {});
  return counts;
}

function showModal(application) {
  const fundingName = sessionStorage.getItem('FundingName');
  const requirementData = JSON.parse(sessionStorage.getItem('RequirementData'));
  const requirements = requirementData[fundingName];

  console.log('Requirements:', requirements);

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

  const section = {
    name: 'Personal Information',
    content: `
      <h2 class="titleClass">Personal Information</h2>
      <p>Name: ${applicantName}</p>
      <p>Mobile: ${applicantMobile}</p>
      <p>Email: ${applicantEmail}</p>
      <p>ID number: ${applicantID}</p>
      <p>Date of birth: ${applicantDOB}</p>
      <p>Citizenship: ${applicantCitizen}</p>
      <p>Amount Requested: R${applicantAmount}</p>
    `
  };

  const sectionDiv = document.createElement('div');
  sectionDiv.innerHTML = section.content;
  applicantArticle.appendChild(sectionDiv);

  let applicantSection = document.getElementById('applicantInfo');
  applicantSection.innerHTML = ''; // Clear existing content
  applicantSection.classList.add('applicantSectionClass');
  applicantSection.appendChild(applicantArticle);

  if (requirements) {
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

      console.log('Requirement:', requirement);
    });

    let applSection = document.getElementById('reqClass');
    applSection.innerHTML = ''; // Clear existing content
    applSection.classList.add('requirements');
    applSection.appendChild(requirementsSection);
  } else {
    console.log("No requirements found in sessionStorage.");
  }

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
  
  if(sessionStorage.getItem("Status") === "processing"){
      acceptRejectSection.appendChild(acceptApplicant);
      acceptRejectSection.appendChild(rejectApplicant);
  }
  else{
      const messageContainer = document.createElement('div');
      messageContainer.classList.add('message-container');
  
      const message = document.createElement('h2');
      message.classList.add('message');
      message.textContent = `Application has already been ${sessionStorage.getItem("Status")}.`;
  
      messageContainer.appendChild(message);
      acceptRejectSection.appendChild(messageContainer);
  }

  // Ensure the accept/reject section is appended to the applicant info section
  const eliClass = document.querySelector(".requirements");

  eliClass.insertAdjacentElement("afterend", acceptRejectSection);

  // Ensure the sections are visible
  document.getElementById('applicantInfo').style.display = 'block';
  document.getElementById('FundOppCriteria').style.display = 'block';

  acceptApplicant.addEventListener('click', () => {
    let headersList = {
        "Accept": "*/*",
        "Content-Type": "application/json" // Ensure correct content type
    };

    const bodyContent = JSON.stringify({
        "requested_amount": applicantAmount
    });

    

    fetch(`https://fundreq.azurewebsites.net/applications/${sessionStorage.getItem('FundingName')}/${applicantEmail}/accept`, { 
        method: "POST",
        mode: "cors",
        headers: headersList,
        body: bodyContent
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        if (data.error === "Applicant amount exceeds budget") {
            showInsufficientFundsPopup();
        } else {
            console.log('Applicant accepted:', data);
            showInbox(); // Show inbox after successful update
        }
    })
    .catch(error => console.error('Error accepting applicant:', error));
});

rejectApplicant.addEventListener('click', () => {
    fetch(`https://fundreq.azurewebsites.net/applications/${sessionStorage.getItem('FundingName')}/${applicantEmail}/reject`, {
        method: "POST",
        mode: "cors",
        headers: {
            "Accept": "*/*"
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        console.log("Applicant rejected:", data);
        showInbox(); // Show inbox after successful update
    })
    .catch(error => console.error('Error rejecting applicant:', error));
});
}

function showInsufficientFundsPopup() {
  alert('Insufficient funds to approve this application.');
}
document.addEventListener("DOMContentLoaded", fetchApplicants);
document.addEventListener("DOMContentLoaded", function() {
  fetchNotifications();
  
  document.getElementById('inboxLink').addEventListener('click', function() {
    showInbox();
  });
});

document.addEventListener('click', function() {
  document.querySelectorAll('.container').forEach(element => {
      element.style.display = 'none';
  });
});

async function fetchNotifications() {
  try {
    let email = sessionStorage.getItem('email');
    if (!email) {
      throw new Error("Email not found in sessionStorage");
    }

    const response = await fetch('https://fundreq.azurewebsites.net/notifications/' + email);
    if (!response.ok) {
      throw new Error("Failed to fetch notifications");
    }
    const notifications = await response.json();
    window.notifications = notifications; // Store notifications globally

    const applicantCounts = countApplicantsPerDay(notifications);
    sessionStorage.setItem('applicantCounts', JSON.stringify(applicantCounts));
    console.log("these are the inputs for the chart: " + applicantCounts);
    
    displayNotifications(notifications);
    countUnreadNotifications(notifications);

  } catch (error) {
    console.error("Error fetching notifications:", error);
  }
}

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
      
      const applicantInfoSection = document.getElementById('applicantInfo');
      applicantInfoSection.style.display = 'block';

      const eligibilityCriteriaSection = document.getElementById('FundOppCriteria');
      eligibilityCriteriaSection.style.display = 'block';
      
      sessionStorage.setItem("applicantName", notification.applicantName);
      sessionStorage.setItem("FundingName", notification.fundOppName);
      console.log("Funding Name: " + notification.fundOppName);
      console.log("Applicant Name: " + notification.applicantName);

      fetchApplicants(notification.fundOppName);
      markAsRead(notification);
    });

    applicantCell.appendChild(applicantLink);
    notificationRow.appendChild(applicantCell);

    const fundingCell = document.createElement('td');
    fundingCell.textContent = notification.fundOppName;
    notificationRow.appendChild(fundingCell);

    const timestampCell = document.createElement('td');
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
    sessionStorage.setItem("Status", specificApplicant.status);
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
  const date = new Date(timestamp + 'Z');
  return date.toLocaleString();
}

function showInbox() {
  document.querySelectorAll('.classMain > section').forEach(section => {
    section.style.display = 'none';
  });
  const applicantInfoSection = document.getElementById('applicantInfo');
  applicantInfoSection.style.display = 'none';
  
  const eligibilityCriteriaSection = document.getElementById('FundOppCriteria');
  eligibilityCriteriaSection.style.display = 'none';

  document.getElementById('inbox-section').style.display = 'block';
  if (!window.notifications) {
    fetchNotifications();
  } else {
    displayNotifications(window.notifications);
  }
}

function countUnreadNotifications(notifications) {
  const unreadCount = notifications.filter(notification => notification.status === 0).length;
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

function countApplicantsPerDay(notifications) {
  const counts = notifications.reduce((acc, notification) => {
    const date = new Date(notification.timestamp + 'Z').toISOString().split('T')[0];
    acc[date] = (acc[date] || 0) + 1;
    return acc;
  }, {});
  return counts;
}

function showModal(application) {
  const fundingName = sessionStorage.getItem('FundingName');
  const requirementData = JSON.parse(sessionStorage.getItem('RequirementData'));
  const requirements = requirementData[fundingName];

  console.log('Requirements:', requirements);

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

  const section = {
    name: 'Personal Information',
    content: `
      <h2 class="titleClass">Personal Information</h2>
      <p>Name: ${applicantName}</p>
      <p>Mobile: ${applicantMobile}</p>
      <p>Email: ${applicantEmail}</p>
      <p>ID number: ${applicantID}</p>
      <p>Date of birth: ${applicantDOB}</p>
      <p>Citizenship: ${applicantCitizen}</p>
      <p>Amount Requested: R${applicantAmount}</p>
    `
  };

  const sectionDiv = document.createElement('div');
  sectionDiv.innerHTML = section.content;
  applicantArticle.appendChild(sectionDiv);

  let applicantSection = document.getElementById('applicantInfo');
  applicantSection.innerHTML = ''; // Clear existing content
  applicantSection.classList.add('applicantSectionClass');
  applicantSection.appendChild(applicantArticle);

  if (requirements) {
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

      console.log('Requirement:', requirement);
    });

    let applSection = document.getElementById('reqClass');
    applSection.innerHTML = ''; // Clear existing content
    applSection.classList.add('requirements');
    applSection.appendChild(requirementsSection);
  } else {
    console.log("No requirements found in sessionStorage.");
  }

  const existingButtons = document.getElementById('acceptRejectSection');
    if (existingButtons) {
        existingButtons.remove();
    }

    const existingMessage = document.querySelector('.message-container');
    if (existingMessage) {
        existingMessage.remove();
    }

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
  
  if(sessionStorage.getItem("Status") === "processing"){
      acceptRejectSection.appendChild(acceptApplicant);
      acceptRejectSection.appendChild(rejectApplicant);
  }
  else{
      const messageContainer = document.createElement('div');
      messageContainer.classList.add('message-container');
  
      const message = document.createElement('h2');
      message.classList.add('message');
      message.textContent = `Application has already been ${sessionStorage.getItem("Status")}.`;
  
      messageContainer.appendChild(message);
      acceptRejectSection.appendChild(messageContainer);
  }

  // Ensure the accept/reject section is appended to the applicant info section
  const eliClass = document.querySelector(".requirements");

  eliClass.insertAdjacentElement("afterend", acceptRejectSection);

  acceptApplicant.addEventListener('click', () => {
    let headersList = {
        "Accept": "*/*",
        "Content-Type": "application/json" // Ensure correct content type
    };

    const bodyContent = JSON.stringify({
        "requested_amount": applicantAmount
    });

    fetch(`https://fundreq.azurewebsites.net/applications/${sessionStorage.getItem('FundingName')}/${applicantEmail}/accept`, { 
        method: "POST",
        mode: "cors",
        headers: headersList,
        body: bodyContent
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        if (data.error === "Applicant amount exceeds budget") {
            showInsufficientFundsPopup();
        } else {
            console.log('Applicant accepted:', data);
            showInbox(); // Show inbox after successful update
        }
    })
    .catch(error => console.error('Error accepting applicant:', error));
});

rejectApplicant.addEventListener('click', () => {
    fetch(`https://fundreq.azurewebsites.net/applications/${sessionStorage.getItem('FundingName')}/${applicantEmail}/reject`, {
        method: "POST",
        mode: "cors",
        headers: {
            "Accept": "*/*"
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        console.log("Applicant rejected:", data);
        showInbox(); // Show inbox after successful update
    })
    .catch(error => console.error('Error rejecting applicant:', error));
});
}

function showInsufficientFundsPopup() {
  alert('Insufficient funds to approve this application.');
}
document.addEventListener("DOMContentLoaded", fetchApplicants);

async function markAsRead(notificationData){
    let body = {
      "fundManagerEmail": sessionStorage.getItem("email"),
      "fundOppName": sessionStorage.getItem("FundingName"),
      "applicantName": sessionStorage.getItem("applicantName")
    }
    console.log("body:");
    console.log(body);
    let bodyContent = JSON.stringify(body);
    let headersList = {
        "Accept": "*/*",
        "Content-Type": "application/json"
    };

    // POST the notification data to the server
    let response = await fetch("https://fundreq.azurewebsites.net/notifications/update", {
        method: "POST",
        mode: "cors",
        headers: headersList,
        body: bodyContent
    });

    if (!response.ok) {
        throw new Error("Failed to add change status");
    }

    let result = await response.json();
    console.log(result.message);
}