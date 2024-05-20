document.addEventListener("DOMContentLoaded", function() {
  fetchApplicants();

  const inboxLink = document.getElementById('inboxLink');
  if (inboxLink) {
      inboxLink.addEventListener('click', function() {
          document.getElementById('landing-section').style.display = 'none';
          document.getElementById('inbox-section').style.display = 'block';
          fetchNotifications();
      });
  }

  const tabs = document.querySelectorAll('.tab');
  tabs.forEach(tab => {
      tab.addEventListener('click', function() {
          tabs.forEach(t => t.classList.remove('active'));
          this.classList.add('active');
          filterNotifications(this.id);
      });
  });

  document.getElementById('tab-all').classList.add('active');
});

async function fetchNotifications() {
  try {
    let email = sessionStorage.getItem("email");
    if (!email) {
      console.error("Email not found in sessionStorage");
      return;
    }
    console.log(email);
      const response = await fetch('https://fundreq.azurewebsites.net/notifications/${email}');
      
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
              mobile: notification.applicantMobile || '', // Provide default empty string if not present
              email: notification.applicantEmail,
              id_number: notification.applicantID || '', // Provide default empty string if not present
              dob: notification.applicantDOB || '', // Provide default empty string if not present
              citizenship: notification.applicantCitizen || '' // Provide default empty string if not present
          };

          // Call showModal with the prepared application object
          showModal(application);
      });

      applicantCell.appendChild(checkbox);
      applicantCell.appendChild(starIcon);
      applicantCell.appendChild(applicantLink);
      notificationRow.appendChild(applicantCell);

      const fundingCell = document.createElement('td');
      fundingCell.textContent = notification.fundOppName; // Modify if you have different funding names
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
      case 'tab-all':
          filteredNotifications = window.notifications;
          break;
      case 'tab-unread':
          filteredNotifications = window.notifications.filter(n => !n.read);
          break;
      case 'tab-read':
          filteredNotifications = window.notifications.filter(n => n.read);
          break;
      case 'tab-starred':
          filteredNotifications = window.notifications.filter(n => n.starred);
          break;
      default:
          filteredNotifications = window.notifications;
  }
  displayNotifications(filteredNotifications);
}

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

      let table = document.createElement('table');
      table.classList.add('applicant-table');

      data.forEach(application => {
          let row = table.insertRow();

          let nameCell = row.insertCell();
          const nameLink = document.createElement('a');
          nameLink.href = '#';
          nameLink.textContent = `${application.firstname} ${application.surname}`;
          nameLink.addEventListener('click', function() {
              showModal(application);
          });
          nameCell.appendChild(nameLink);

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
