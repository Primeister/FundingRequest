document.addEventListener("DOMContentLoaded", function() {
  fetchNotifications();

  const tabs = document.querySelectorAll('.tab');
  tabs.forEach(tab => {
    tab.addEventListener('click', function() {
      tabs.forEach(t => t.classList.remove('active'));
      this.classList.add('active');
      filterNotifications(this.id);
    });
  });

  document.getElementById('tab-all').classList.add('active');
  
  document.getElementById('inboxLink').addEventListener('click', function() {
    showInbox();
  });
});

async function fetchNotifications() {
  try {
    const response = await fetch('https://fundreq.azurewebsites.net/notifications/2549192@students.wits.ac.za');
    if (!response.ok) {
      throw new Error("Failed to fetch notifications");
    }
    const notifications = await response.json();
    window.notifications = notifications; // Store notifications globally
    displayNotifications(notifications);
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

    // Add the checkbox
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.classList.add('checkbox');

    // Add the star icon
    const starIcon = document.createElement('span');
    starIcon.classList.add('star');
    starIcon.innerHTML = '★'; // Unicode star character

    const applicantLink = document.createElement('a');
    applicantLink.href = '#';
    applicantLink.textContent = notification.applicantName;
    applicantLink.addEventListener('click', function() {
      // Store the notification details in sessionStorage
      sessionStorage.setItem("applicant_email", notification.applicantEmail);
      sessionStorage.setItem("FundingName", notification.fundOppName);

      // Prepare the application object for showModal
      const application = {
        firstname: notification.applicantName.split(' ')[0],
        surname: notification.applicantName.split(' ')[1],
        mobile: notification.applicantMobile || '',
        email: notification.applicantEmail,
        id_number: notification.applicantID || '',
        dob: notification.applicantDOB || '',
        citizenship: notification.applicantCitizen || ''
      };

      // Call showModal with the prepared application object
      showModal(application);
    });

    applicantCell.appendChild(checkbox);
    applicantCell.appendChild(starIcon);
    applicantCell.appendChild(applicantLink);
    notificationRow.appendChild(applicantCell);

    const fundingCell = document.createElement('td');
    fundingCell.textContent = notification.fundOppName;
    notificationRow.appendChild(fundingCell);

    const timestampCell = document.createElement('td');
    timestampCell.textContent = new Date(notification.timestamp).toLocaleString();
    notificationRow.appendChild(timestampCell);

    notificationsContainer.appendChild(notificationRow);
  });
}

function filterNotifications(filterId) {
  let filteredNotifications;
  switch (filterId) {
    case 'tab-unread':
      filteredNotifications = window.notifications.filter(n => !n.read);
      break;
    case 'tab-read':
      filteredNotifications = window.notifications.filter(n => n.read);
      break;
    case 'tab-starred':
      filteredNotifications = window.notifications.filter(n => n.starred);
      break;
    case 'tab-all':
    default:
      filteredNotifications = window.notifications;
  }
  displayNotifications(filteredNotifications);
}

function showModal(application) {
  // Function to display the modal with application details
  console.log(application); // For debugging purposes
}

function showInbox() {
  // Hide other sections
  document.querySelectorAll('.classMain > section').forEach(section => {
    section.style.display = 'none';
  });
  // Show inbox section
  document.getElementById('inbox-section').style.display = 'block';
  // Fetch notifications if not already fetched
  if (!window.notifications) {
    fetchNotifications();
  } else {
    displayNotifications(window.notifications);
  }
}
