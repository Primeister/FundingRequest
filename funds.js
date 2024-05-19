

document.addEventListener("DOMContentLoaded", function(){

    var mainElement = document.getElementById("opportunityFunds");
    
    fetch('https://fundreq.azurewebsites.net/fundingOpportunities/' + email)
    .then(res => {
        return res.json();
    }).then( data =>{
        
        data.forEach(fundingOpp => {
            
        

            let opportunity = document.createElement('section');
            opportunity.style.backgroundColor = "purple";
            opportunity.style.paddingTop = "20px";
            opportunity.style.marginTop = "20px";
            opportunity.style.borderRadius = "10px";
            let lineBreak = document.createElement('br');
            let lineBreak2 = document.createElement('br');
            let fundingName = document.createElement('h1');
            fundingName.textContent = fundingOpp.FundingName;
            let amount = document.createElement('h1');
            let allocatedAmount = fundingOpp.Amount.toString(); 
            amount.textContent = "Allocated Funds: R" + allocatedAmount;
            let manageFundsButton =  document.createElement('button');
            manageFundsButton.textContent = "Manage Funds";

            manageFundsButton.onclick = function() {
                
                document.getElementById("budgetSection").style.display = "none";
                document.getElementById("editOppAmountSection").style.display = "block";
                  
            };
            
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

