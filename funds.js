

document.addEventListener("DOMContentLoaded", function(){

    var mainElement = document.getElementById("opportunityFunds");
    
    fetch('https://fundreq.azurewebsites.net/fundingOpportunities/' + email)
    .then(res => {
        return res.json();
    }).then( data =>{
        
        data.array.forEach(fundingOpp => {
            
        

            let opportunity = document.createElement('section');
            opportunity.style.backgroundColor = "grey";
            opportunity.style.paddingTop = "20px";
            opportunity.style.borderRadius = "10px";
            let lineBreak = document.createElement('br');
            let fundingName = document.createElement('h1');
            fundingName.style.color = "white";
            fundingName.textContent = fundingOpp.FundingName;
            let amount = document.createElement('h1');
            amount.style.color = "white";
            amount.textContent = "Allocated Funds: R0.00";
            let manageFundsButton =  document.createElement('button');
            manageFundsButton.textContent = "Manage Funds";
            
            opportunity.appendChild(fundingName);
            opportunity.appendChild(amount);
            opportunity.appendChild(lineBreak);
            opportunity.appendChild(manageFundsButton);

            mainElement.appendChild(opportunity);

        });
    }
    ).catch(error => console.log(error));
});

