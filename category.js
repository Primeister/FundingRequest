let apiUpdateApplicantAmount = 'https://fundreq.azurewebsites.net/update/applicant/amount/';


function addCategory(){

    let categoryName = document.getElementById("category");
    let categoryAmount = document.getElementById("categoryAmount");


    if(!((categoryName.value == "") || (categoryAmount.value == ""))){
    let mainElement = document.getElementById("categories");
    let newSection = document.createElement('section');
    let categoryParagraph = document.createElement('p');
    let removeButton = document.createElement('button');


    //styles

    newSection.style.marginTop = "20px";
    newSection.id = categoryName;

    categoryParagraph.style.display ="inline";
    categoryParagraph.textContent = categoryName.value.toString() + ": R" + categoryAmount.value.toString();
    removeButton.textContent = "Remove";
    removeButton.style.backgroundColor = "red";
    removeButton.style.marginLeft = "20px";

    removeButton.onclick = function() {
       
        document.getElementById(categoryName).remove();
         
    };

    let hrLine = document.createElement('hr');
    let lineBreak = document.createElement('br');

    newSection.appendChild(categoryParagraph);
    newSection.appendChild(removeButton);
    newSection.appendChild(lineBreak);  
    newSection.appendChild(hrLine);
    mainElement.appendChild(newSection)

    let fundingName1 = sessionStorage.getItem('fundingName');

    data = {
        "category": categoryName.value + ": R" + categoryAmount.value.toString(),
        "fundingName": fundingName1
    }

    postCategory(data);

    categoryAmount.value = "";
    categoryName.value = "";

    
}
   
}

function updateApplicantFunds(){
    
    let applicantAmount = document.getElementById("applicantFunds");
    let newApplicantAmount = document.getElementById("applicantFundsInput");

    if(!(newApplicantAmount.value == "")){
        applicantAmount.textContent = "R" + newApplicantAmount.value.toString();

        let fundingName2 = sessionStorage.getItem('fundingName');

        let data = {
            "applicantAmount": newApplicantAmount.value
        }

        updateApplicantAmount(data, fundingName2);

        newApplicantAmount.value = "";
    }

    

}

async function postCategory(data) {
    let bodyContent = JSON.stringify(data);
    let headersList = {
        "Accept": "*/*",
        "Content-Type": "application/json"
       }
    let response = await fetch("https://fundreq.azurewebsites.net/category", {
        method: "POST",
        mode: "cors",
        headers: headersList,
        body: bodyContent
    });
    let result = await response.json();
    console.log(result);
    
}

async function updateApplicantAmount(data, fundingName1){

    let bodyContent = JSON.stringify(data);
    let headersList = {
        "Accept" : "*/*",
        "Content-Type" : "application/json"
    }

    let response = await fetch(apiUpdateApplicantAmount + fundingName1, {
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
