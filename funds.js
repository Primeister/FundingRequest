

let apiUpdateAmount = 'https://fundreq.azurewebsites.net/update/amount/';
let apiUpdateTotalAmount = 'https://fundreq.azurewebsites.net/update/total/amount/';

document.addEventListener("DOMContentLoaded", function(){

    var mainElement = document.getElementById("opportunityFunds");
    
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

