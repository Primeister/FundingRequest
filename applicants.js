let data = {
    fundingName: "Name",
    fundingType: "Type",
    fundingDecription: "Description",
    fundingRequirements: "Requirements",
    deadline: "Deadline"
}
let bursaryOpp = document.getElementById("bursary-opp");
let businessOpp = document.getElementById("business-opp");
let eventOpp = document.getElementById("event-opp");
let opportunities = document.querySelectorAll('.opportunity');

    // Loop through each element and attach the event listener
    opportunities.forEach(function(opportunity) {
        opportunity.addEventListener('click', function() {
            // Your event handler code here
            popup.style.display = "block";
            console.log('Clicked: ' + opportunity.textContent);
        });
    });

const popupContainer = document.createElement("div");
popupContainer.classList.add("popup");
popupContainer.id = "popup";

// Create the popup content element
const popupContent = document.createElement("div");
popupContent.classList.add("popup-content");

// Create the close button element
const closeButton = document.createElement("span");
closeButton.classList.add("close");
closeButton.id = "closeBtn";
closeButton.innerHTML = "&times;";

// Create the description heading element
const descriptionHeading = document.createElement("h2");
descriptionHeading.textContent = "Description";

// Create the description paragraph element
const descriptionParagraph = document.createElement("p");
descriptionParagraph.textContent = "This is the description section of the popup.";
descriptionParagraph.classList.add("paragraph");
const reqHeading = document.createElement("h2");
reqHeading.textContent = "Requirements";

const reqParagraph = document.createElement("p");
reqParagraph.textContent = "This is the Requirements section of the popup.";
reqParagraph.classList.add("paragraph");
// Create the action button element
const applyButton = document.createElement("button");
applyButton.id = "actionBtn";
applyButton.textContent = "Apply Now";

// Append elements to the popup content
popupContent.appendChild(closeButton);
popupContent.appendChild(descriptionHeading);
popupContent.appendChild(descriptionParagraph);
popupContent.appendChild(reqHeading);
popupContent.appendChild(reqParagraph);
popupContent.appendChild(applyButton);

// Append the popup content to the popup container
popupContainer.appendChild(popupContent);

// Append the popup container to the document body
document.body.appendChild(popupContainer);
  
// Hide the popup when close button is clicked
closeBtn.addEventListener("click", () => {
    popup.style.display = "none";
});



let headersList = {
    "Accept": "*/*",
    "Content-Type": "application/json"
};

let requestOptions = {
    method: 'GET', // or 'POST' if you intend to send data
    headers: headersList,
    mode: "cors"
};

let response = fetch("https://fundreq.azurewebsites.net/getOpportunity/education", requestOptions)
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        console.log(data)
        data.forEach(opp => {
            let opportunityDiv = document.createElement('div');
            opportunityDiv.classList.add('opportunity');

            // Create the inner div with class "title"
            let titleDiv = document.createElement('div');
            titleDiv.classList.add('title');

            // Create the h2 element with class "name"
            let nameHeading = document.createElement('h2');
            nameHeading.classList.add('name');
            nameHeading.textContent = opp.FundingName; // Set text content

            // Create the h4 element with class "deadline"
            let deadlineHeading = document.createElement('h4');
            deadlineHeading.classList.add('deadline');
            deadlineHeading.textContent = "Closes: "+opp.Deadline; // Set text content

            // Append the h2 and h4 elements to the "title" div
            titleDiv.appendChild(nameHeading);
            titleDiv.appendChild(deadlineHeading);

            // Append the "title" div to the "opportunity" div
            opportunityDiv.appendChild(titleDiv);

            // Append the "opportunity" div to the document body or any other parent element
            bursaryOpp.appendChild(opportunityDiv);
            opportunityDiv.addEventListener('click', function() {
                // Your event handler code here
                popup.style.display = "block";
                descriptionParagraph.textContent = opp.FundingDescription;
                reqParagraph.textContent = opp.Requirements;
                sessionStorage.setItem("FundingName", opp.FundingName);
                sessionStorage.setItem("id", opp.id);
            });
        });
    
    
    
    })
    .catch(error => console.error('Error:', error));

let funding = fetch("https://fundreq.azurewebsites.net/getOpportunity/business", requestOptions)
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        console.log(data)
        data.forEach(opp => {
            let opportunityDiv = document.createElement('div');
            opportunityDiv.classList.add('opportunity');

            // Create the inner div with class "title"
            let titleDiv = document.createElement('div');
            titleDiv.classList.add('title');

            // Create the h2 element with class "name"
            let nameHeading = document.createElement('h2');
            nameHeading.classList.add('name');
            nameHeading.textContent = opp.FundingName; // Set text content

            // Create the h4 element with class "deadline"
            let deadlineHeading = document.createElement('h4');
            deadlineHeading.classList.add('deadline');
            deadlineHeading.textContent = "Closes: "+opp.Deadline; // Set text content

            // Append the h2 and h4 elements to the "title" div
            titleDiv.appendChild(nameHeading);
            titleDiv.appendChild(deadlineHeading);

            // Append the "title" div to the "opportunity" div
            opportunityDiv.appendChild(titleDiv);

            // Append the "opportunity" div to the document body or any other parent element
            businessOpp.appendChild(opportunityDiv);
            opportunityDiv.addEventListener('click', function() {
                // Your event handler code here
                popup.style.display = "block";
                descriptionParagraph.textContent = opp.FundingDescription;
                reqParagraph.textContent = opp.Requirements;
                sessionStorage.setItem("FundingName", opp.FundingName);
                sessionStorage.setItem("id", opp.id);
            });
        });
    
    
    
    })
    .catch(error => console.error('Error:', error));

let event = fetch("https://fundreq.azurewebsites.net/getOpportunity/event", requestOptions)
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        console.log(data)
        data.forEach(opp => {
            let opportunityDiv = document.createElement('div');
            opportunityDiv.classList.add('opportunity');

            // Create the inner div with class "title"
            let titleDiv = document.createElement('div');
            titleDiv.classList.add('title');

            // Create the h2 element with class "name"
            let nameHeading = document.createElement('h2');
            nameHeading.classList.add('name');
            nameHeading.textContent = opp.FundingName; // Set text content

            // Create the h4 element with class "deadline"
            let deadlineHeading = document.createElement('h4');
            deadlineHeading.classList.add('deadline');
            deadlineHeading.textContent = "Closes: "+opp.Deadline; // Set text content

            // Append the h2 and h4 elements to the "title" div
            titleDiv.appendChild(nameHeading);
            titleDiv.appendChild(deadlineHeading);

            // Append the "title" div to the "opportunity" div
            opportunityDiv.appendChild(titleDiv);

            // Append the "opportunity" div to the document body or any other parent element
            eventOpp.appendChild(opportunityDiv);
            opportunityDiv.addEventListener('click', function() {
                // Your event handler code here
                popup.style.display = "block";
                descriptionParagraph.textContent = opp.FundingDescription;
                reqParagraph.textContent = opp.Requirements;
                sessionStorage.setItem("FundingName", opp.FundingName);
                sessionStorage.setItem("id", opp.id);
            });
        });
    
    
    
    })
    .catch(error => console.error('Error:', error));

//Vutshila you must continue from here
applyButton.addEventListener('click', function() {
    alert(sessionStorage.getItem("FundingName"));
});








