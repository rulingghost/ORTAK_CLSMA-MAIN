
var firmaAddBtn = document.getElementById("paying-firma-add-btn-2");
var firmalar = document.querySelectorAll("#dropdown2 .dropdown-item");
var dateInput = document.querySelector("#id_Date_JobHistory");
var amountInput = document.querySelector("#id_Amount_JobHistory");
var reqInputs = document.querySelectorAll("#id_CompanyName_FromJobMade_JobHistory, #id_CompanyName_Job_JobHistory");
var reqLabels = document.querySelectorAll("#is_yapan_firma_span, #is_yapilan_firma_span");
var createBtn = document.querySelector("#project-create-btn");
var form = document.querySelector("#my-form");




//                  TARİH İNPUTLARI FORMATLAMA

dateInput.addEventListener('input', function(event) {
    var userInput = dateInput.value;    
    if (event.inputType !== 'deleteContentBackward') {
        dateInput.value = formatDate(userInput);
    }
});

//                  INPUT FORMATLAMA

inputForFormat(amountInput);
onPageLoad(amountInput);
dateInputFormat(dateInput);

//                  FORM SUBMİT ETME

createBtn.addEventListener("click", function(event) {
    event.preventDefault();       
    if(requiredInputs(reqInputs, reqLabels)){
        dateInput.value = formatDateForSubmit(dateInput.value);
        amountInput.value = clearForSubmit(amountInput.value);
        form.submit();
    }  
});  

