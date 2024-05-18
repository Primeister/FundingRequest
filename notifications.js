document.addEventListener("DOMContentLoaded", function() {
    fetchNotifications();
  
    const inboxLink = document.getElementById('inboxLink');
    inboxLink.addEventListener('click', function() {
      document.getElementById('landing-section').style.display = 'none';
      document.getElementById('inbox-section').style.display = 'block';
      fetchNotifications();
    });
  });
  
  async function fetchNotifications() {
    try {
        //Get the email address from sessionStorage
        let email = sessionStorage.getItem('email');
        console.log(email);

        // Check if email exists
        if (!email) {
            throw new Error("Email not found in sessionStorage");
        } 

        const response = await fetch('https://fundreq.azurewebsites.net/notifications/${email}');
        
      if (!response.ok) {
        throw new Error("Failed to fetch notifications");
      }
  
      const notifications = await response.json();
      const notificationsContainer = document.getElementById('notifications');
      notificationsContainer.innerHTML = ''; // Clear existing notifications
  
      notifications.forEach(notification => {
        const notificationDiv = document.createElement('div');
        notificationDiv.classList.add('notification');
        notificationDiv.textContent = `New application for ${notification.fundingOpportunityName} by ${notification.applicantName}`;
        notificationsContainer.appendChild(notificationDiv);
      });
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  }
  
