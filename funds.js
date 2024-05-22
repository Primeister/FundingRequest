

let apiUpdateAmount = 'https://fundreq.azurewebsites.net/update/amount/';
let apiUpdateTotalAmount = 'https://fundreq.azurewebsites.net/update/total/amount/';
let apiDeleteCategory = 'https://fundreq.azurewebsites.net/delete/category';

document.addEventListener("DOMContentLoaded", function(){

    var mainElement = document.getElementById("opportunityFunds");

    fetch('https://fundreq.azurewebsites.net/fundManagers/' + email)
    .then(result => {
        return result.json();
    }).then(data => {
        if(data.Funds == null){

        }
        else{
            document.getElementById("totalFunds").textContent = "R" + data.Funds.toString();
        }
    }).catch(error => console.log(error));
    
    fetch('https://fundreq.azurewebsites.net/fundingOpportunities/' + email)
    .then(res => {
        return res.json();
    }).then( data =>{
        
        let amountID = 0;

        data.forEach(fundingOpp => {
            
            let stringAmountID = amountID.toString();

            let opportunity = document.createElement('section');
            opportunity.style.backgroundColor = "purple";
            opportunity.style.paddingTop = "20px";
            opportunity.style.borderRadius = "10px";
            let lineBreak = document.createElement('br');
            let lineBreak2 = document.createElement('br');
            let fundingName = document.createElement('h1');
            fundingName.textContent = fundingOpp.FundingName;
            let amount = document.createElement('h1');
            let allocatedAmount = fundingOpp.Amount.toString(); 
            amount.textContent = "Allocated Funds: R" + allocatedAmount;
            amount.id = stringAmountID;
            let manageFundsButton =  document.createElement('button');
            manageFundsButton.textContent = "Manage Funds";

            manageFundsButton.onclick = function() {
                
                sessionStorage.setItem('amountID', stringAmountID);
                sessionStorage.setItem('fundingName', fundingOpp.FundingName);
                document.getElementById("budgetSection").style.display = "none";
                document.getElementById("editOppAmountSection").style.display = "block";
                if(!(fundingOpp.ApplicantAmount == null)){
                document.getElementById("applicantFunds").textContent = "R" + fundingOpp.ApplicantAmount.toString();
                }
                getCategories(fundingOpp.FundingName);
               
            };
            
            opportunity.appendChild(fundingName);
            opportunity.appendChild(lineBreak);
            opportunity.appendChild(amount);
            opportunity.appendChild(lineBreak2);
            opportunity.appendChild(manageFundsButton);

            mainElement.appendChild(opportunity);

            amountID = amountID + 1;

        });
    }
    ).catch(error => console.log(error));
});


function updateTotalFunds(){

    document.getElementById("totalFunds").textContent = "R" + document.getElementById("allocatedTotalFunds").value.toString();

    let data = {
        "amount": document.getElementById("allocatedTotalFunds").value
    }

    updateTotalAmount(data, email);

    document.getElementById("allocatedTotalFunds").value = "";
}

async function updateTotalAmount(data, email){

    let bodyContent = JSON.stringify(data);
    let headersList = {
        "Accept" : "*/*",
        "Content-Type" : "application/json"
    }

    let response = await fetch(apiUpdateTotalAmount + email, {
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


function updateOppFunds(){
    let amountID = sessionStorage.getItem('amountID');
    let fundingName = sessionStorage.getItem('fundingName');
    document.getElementById(amountID).textContent = "Allocated funds: R" + document.getElementById("allocatedOppFunds").value.toString();

    let data = {
        "amount": document.getElementById("allocatedOppFunds").value
    }

    updateOppAmount(data, fundingName);

    document.getElementById("allocatedOppFunds").value = "";
}



async function updateOppAmount(data, fundingName){

    let bodyContent = JSON.stringify(data);
    let headersList = {
        "Accept" : "*/*",
        "Content-Type" : "application/json"
    }

    let response = await fetch(apiUpdateAmount + fundingName, {
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

function getCategories(fundingName){

    fetch('https://fundreq.azurewebsites.net/categories/' + fundingName)
    .then(res => {
        return res.json();
    }).then( data =>{
        
        let sectionID = 0;
        let mainElement = document.getElementById("categories");
        mainElement.innerHTML = "";

        data.forEach(Category => {

            let newSection = document.createElement('section');
            let categoryParagraph = document.createElement('p');
            let removeButton = document.createElement('button');

            //styles

            newSection.style.marginTop = "20px";
            newSection.id = Category.category;

            categoryParagraph.style.display ="inline";
            categoryParagraph.textContent = Category.category;
            removeButton.textContent = "Remove";
            removeButton.style.backgroundColor = "red";
            removeButton.style.marginLeft = "20px";

            removeButton.onclick = function() {
            
                document.getElementById(Category.category).remove();

                data = {
                    "category": Category.category
                }
                deleteCategory(data);
                
            };

            let hrLine = document.createElement('hr');
            let lineBreak = document.createElement('br');

            newSection.appendChild(categoryParagraph);
            newSection.appendChild(removeButton);
            newSection.appendChild(lineBreak);
            newSection.appendChild(hrLine);
            mainElement.appendChild(newSection);

            sectionID = sectionID + 1;
        });
    }
    ).catch(error => console.log(error));
    
}

async function deleteCategory(data){

    let bodyContent = JSON.stringify(data);
    let headersList = {
        "Accept" : "*/*",
        "Content-Type" : "application/json"
    }

    let response = await fetch(apiDeleteCategory, {
        method: "DELETE",
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



