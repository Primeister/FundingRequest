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

    newSection.appendChild(categoryParagraph);
    newSection.appendChild(removeButton);
    mainElement.appendChild(newSection)

    categoryAmount.value = "";
    categoryName.value = "";
}
   
}

function updateApplicantFunds(){
    
    let applicantAmount = document.getElementById("applicantFunds");
    let newApplicantAmount = document.getElementById("applicantFundsInput");

    if(!(newApplicantAmount.value == "")){
        applicantAmount.textContent = "R" + newApplicantAmount.value.toString();
        newApplicantAmount.value = "";
    }
}