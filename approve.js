let apiUpdate = 'https://fundreq.azurewebsites.net/update/status/';

function getFundManagers(){

    var mainElement = document.getElementById("main-section");
    mainElement.innerHTML = "";
    var headingSection = document.createElement("section");
    headingSection.style.display = "flex";
    headingSection.style.flexDirection = "row";
    headingSection.style.justifyContent = "center";
    var heading = document.createElement('h1');
    heading.textContent = "Approve Fund Managers";
    headingSection.style.fontSize = "30px";
    var line = document.createElement('hr');
    line.style.marginBottom = "60px"
    headingSection.appendChild(heading);
    
    mainElement.appendChild(headingSection);
    mainElement.appendChild(line);
    var lineBreak = document.createElement("br");
    
    
    
    fetch('https://fundreq.azurewebsites.net/fundManagers')
    .then(res => {
        return res.json();
    }).then( data =>{
        
        let approveButtonId = 0;
    
        data.forEach(person => {
    
        let rejectButtonId = approveButtonId + 1;
    
    
        // Get a reference to the <main> element
        
    
        var newSection = document.createElement("section");
        newSection.style.display = "flex";
        newSection.style.flexDirection = "row";
        newSection.style.justifyContent = "center";
        newSection.style.borderWidth = "5px";
        newSection.style.marginBottom = "50px";
        newSection.style.backgroundColor = "white";
        
        var innerSection = document.createElement("section");
        innerSection.style.paddingRight = "100px"
        innerSection.style.width = "25%";
    
        // Create a new button element
        var approveButton = document.createElement("button");
        approveButton.textContent = "approve"; // Set the button text
        approveButton.style.backgroundColor = "green";
        approveButton.style.width = "100px";
        let id = approveButtonId.toString();
        approveButton.id = id;
    
        var rejectButton = document.createElement("button");
        rejectButton.textContent = "reject"; // Set the button textlelet 
        rejectButton.style.backgroundColor = "red";
        rejectButton.style.width = "100px";
        let id2 = rejectButtonId.toString();
        rejectButton.id = id2;
            
        let personId = person.id.toString();
        // Define the onclick function for the button
        approveButton.onclick = function() {
            data = {
                "id" : person.id,
                "newValue" : "approved"
            }

            update(data, personId);

            document.getElementById(id).disabled = true;
            document.getElementById(id2).disabled = true;
        };
        

        rejectButton.onclick = function() {
            data = {
                "id" : person.id,
                "newValue" : "rejected"
            }

            update(data, personId);

            document.getElementById(id).disabled = true;
            document.getElementById(id2).disabled = true;
            
        };
    
    
        // Apply styling to the section
        newSection.style.display = "flex";
        newSection.style.flexDirection = "row";
        newSection.style.borderColor = "black";
        
    
        var name = document.createElement('p');
        name.textContent = person.name + " " + person.surname;
        var email = document.createElement('p');
        email.textContent = person.email;
    
        innerSection.appendChild(name);
        innerSection.appendChild(email);
    
        newSection.appendChild(innerSection);
        // Append the button to the section
        newSection.appendChild(approveButton);
        newSection.appendChild(rejectButton);
    
    
    
        // Append the new section to the main element
        mainElement.appendChild(newSection);
    
        approveButtonId = approveButtonId + 1;
        });
    
        
    }
    ).catch(error => console.log(error));
    }

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

        let result = await response.json;

        if(result.message == "Field updated successfully"){
            console.log(result.message);
            alert(result.message);
        }
        else{
            console.log(result.error);
            alert(result.error);
        }
    }
