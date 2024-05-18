

document.addEventListener("DOMContentLoaded", function(){

    var mainElement = document.getElementById("opportunityFunds");
    
    fetch('https://fundreq.azurewebsites.net/fundingOpportunities/2332600@students.wits.ac.za')
    .then(res => {
        return res.json();
    }).then( data =>{
        
        data.forEach(fundingOpp => {
            
        

            let opportunity = document.createElement('section');
            opportunity.style.backgroundColor = "purple";
            opportunity.style.paddingTop = "20px";
            opportunity.style.borderRadius = "10px";
            let lineBreak = document.createElement('br');
            let lineBreak2 = document.createElement('br');
            let fundingName = document.createElement('h1');
            fundingName.textContent = fundingOpp.FundingName;
            let amount = document.createElement('h1');
            amount.textContent = "Allocated Funds: R0.00";
            let manageFundsButton =  document.createElement('button');
            manageFundsButton.textContent = "Manage Funds";
            
            opportunity.appendChild(fundingName);
            opportunity.appendChild(lineBreak);
            opportunity.appendChild(amount);
            opportunity.appendChild(lineBreak2);
            opportunity.appendChild(manageFundsButton);

            mainElement.appendChild(opportunity);

        });
    }
    ).catch(error => console.log(error));
});

