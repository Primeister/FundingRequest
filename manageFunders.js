let apiUpdateFunderPermission = 'https://fundreq.azurewebsites.net/update/funder/permission/';



document.addEventListener("DOMContentLoaded", function(){

    var mainElement = document.getElementById("funders");
    
    fetch('https://fundreq.azurewebsites.net/fundManagers/approved')
    .then(res => {
        return res.json();
    }).then( data =>{
        
        let newProfileId = 100;
    
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
        var blockButton = document.createElement("button");
        blockButton.textContent = "block"; // Set the button text
        blockButton.style.backgroundColor = "red";
        blockButton.style.width = "100px";
    
        var unblockButton = document.createElement("button");
        unblockButton.textContent = "unblock"; // Set the button textlelet 
        unblockButton.style.backgroundColor = "green";
        unblockButton.style.width = "100px";
            
        let personId = person.id.toString();
        // Define the onclick function for the button
        blockButton.onclick = function() {
            data = {
                "id" : person.id,
                "newValue" : "blocked"
            }

            var result = confirm("Are you sure you want to block?");
            if (result){
                updateFunderPermission(data, personId);
                
            }

            
            
        };
        
        unblockButton.onclick = function() {
            data = {
                "id" : person.id,
                "newValue" : "allowed"
            }

            var result = confirm("Are you sure you want to unblock?");
            if (result){
                updateFunderPermission(data, personId);
                
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

        blockButton.style.marginLeft = "10px";
        unblockButton.style.marginLeft = "10px";

        blockButton.style.borderRadius = "0 5px 5px 20px";
        unblockButton.style.borderRadius = "0 5px 5px 20px";

        if(person.permission == "allowed"){
        profile.appendChild(blockButton);
        }

        if(person.permission == "blocked"){
        profile.appendChild(unblockButton);
        }
        // Append the new section to the main element
        mainElement.appendChild(profile);
    
        newProfileId = newProfileId + 1;
        });
    
        
    }
    ).catch(error => console.log(error));
});


    async function updateFunderPermission(data, id){

        let bodyContent = JSON.stringify(data);
        let headersList = {
            "Accept" : "*/*",
            "Content-Type" : "application/json"
        }

        let response = await fetch(apiUpdateFunderPermission + id, {
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
