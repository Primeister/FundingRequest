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
    // Get the email address from sessionStorage
    let email = sessionStorage.getItem('email');
    console.log(email);
    
    // Check if email exists
    if (!email) {
        throw new Error("Email not found in sessionStorage");
    } 

    const response = await fetch('https://fundreq.azurewebsites.net/notifications/'+ email );
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
    // Convert timestamp to local time
    const localTime = convertToLocalTime(notification.timestamp);
    timestampCell.textContent = localTime;
    notificationRow.appendChild(timestampCell);

    notificationsContainer.appendChild(notificationRow);
  });
}

function convertToLocalTime(timestamp) {
  const date = new Date(timestamp + 'Z'); // Append 'Z' to indicate UTC time
  return date.toLocaleString();
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

//function to count the number of applicants per day
function countApplicantsPerDay(notifications) {
  const counts = notifications.reduce((acc, notification) => {
    const date = new Date(notification.timestamp + 'Z').toISOString().split('T')[0]; // Extract date part only
    acc[date] = (acc[date] || 0) + 1;
    return acc;
  }, {});
  return counts;
}
