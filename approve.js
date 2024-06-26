
let apiUpdate = 'https://fundreq.azurewebsites.net/update/status/';


document.addEventListener("DOMContentLoaded", function(){

    var mainElement = document.getElementById("profiles");
    
    fetch('https://fundreq.azurewebsites.net/fundManagers')
    .then(res => {
        return res.json();
    }).then( data =>{
        
        let newProfileId = 0;
    
        data.forEach(person => {
    
        // Get a reference to the <main> element
        let profileId = newProfileId.toString(); 
    
        var profile = document.createElement("section");
        profile.style.width = "300px";
        profile.style.marginLeft = "10px";
        profile.style.marginTop = "10px";
        profile.style.backgroundColor = "#e0e0e5";
        profile.style.borderRadius = "20px";
        profile.id = profileId;
        
        var profilePicSection = document.createElement("section");
        profilePicSection.style.backgroundColor = "white"
        profilePicSection.style.marginBottom = "10px"
        profilePicSection.style.display = "flex";
        profilePicSection.style.justifyContent = "center";
        profilePicSection.style.borderRadius = "0 20px 0 0";

        var profileIcon = document.createElement("img")
        profileIcon.src = "images/profileIcon.png"
        profileIcon.style.width = "150px"

        // Create a new button element
        var approveButton = document.createElement("button");
        approveButton.textContent = "approve"; // Set the button text
        approveButton.style.backgroundColor = "green";
        approveButton.style.width = "100px";
    
        var rejectButton = document.createElement("button");
        rejectButton.textContent = "reject"; // Set the button textlelet 
        rejectButton.style.backgroundColor = "red";
        rejectButton.style.width = "100px";
            
        let personId = person.id.toString();
        // Define the onclick function for the button
        approveButton.onclick = function() {
            data = {
                "id" : person.id,
                "newValue" : "approved"
            }

            var result = confirm("Are you sure you want to approve?");
            if (result){
                update(data, personId);
                document.getElementById(profileId).remove();
            }

            
            
        };
        
        rejectButton.onclick = function() {
            data = {
                "id" : person.id,
                "newValue" : "rejected"
            }

            var result = confirm("Are you sure you want to reject?");
            if (result){
                update(data, personId);
                document.getElementById(profileId).remove();
            }
            
        };
    
        var name = document.createElement('p');
        name.textContent = person.name + " " + person.surname;
        name.style.marginLeft = "10px";
        var email = document.createElement('p');
        email.textContent = person.email;
        email.style.marginLeft = "10px";

        profilePicSection.appendChild(profileIcon);
        profile.appendChild(profilePicSection);
    
        profile.appendChild(name);
        profile.appendChild(email);

        approveButton.style.marginLeft = "10px";
        rejectButton.style.marginLeft = "10px";

        approveButton.style.borderRadius = "0 5px 5px 20px";

        profile.appendChild(approveButton);
        profile.appendChild(rejectButton);
    
        // Append the new section to the main element
        mainElement.appendChild(profile);
    
        newProfileId = newProfileId + 1;
        });
    
        
    }
    ).catch(error => console.log(error));
});


    async function update(data, id){

        let bodyContent = JSON.stringify(data);
        let headersList = {
            "Accept" : "*/*",
            "Content-Type" : "application/json"
        }

        let response = await fetch(apiUpdate + id, {
            method: "PUT",
            node: "cors",
            headers: headersList,
            body: bodyContent
        });

        let result = await response.json();

        if(result.message === "Field updated successfully"){
            console.log(result.message);
            alert(result.message);
        }
        else{
            console.log(result.error);
            alert(result.error);
        }
    }
