var dateInput = document.querySelector("#id_ChekDate_Incomes");
var lastDateInput = document.querySelector("#id_LastChekDate_Incomes");
var amountInput = document.querySelector("#id_Amount_Incomes");
var reqInputs = document.querySelectorAll("#id_CompanyName_Pay_Incomes, #id_ProjectName_Incomes");
var reqLabels = document.querySelectorAll("#odeme_yapan_firma_span, #proje_adi_span");
var createBtn = document.querySelector("#project-create-btn");
const paymentTypeInput = document.getElementById('id_PaymentType_Incomes');
var chekLastDateBox = document.querySelector(".chek-last-date-box");




//                  TARİH İNPUTLARI FORMATLAMA

dateInput.addEventListener('input', function(event) {
    var userInput = dateInput.value;    
    if (event.inputType !== 'deleteContentBackward') {
        dateInput.value = formatDate(userInput);
    }
});
lastDateInput.addEventListener('input', function(event) {
    var userInput = lastDateInput.value;    
    if (event.inputType !== 'deleteContentBackward') {
        lastDateInput.value = formatDate(userInput);
    }
});

//                  INPUT FORMATLAMA

inputForFormat(amountInput);
onPageLoad(amountInput);
dateInputFormat(dateInput);
dateInputFormat(lastDateInput);

//                  FORM SUBMİT ETME

createBtn.addEventListener("click", function(event) {
    event.preventDefault();       
    if(requiredInputs(reqInputs, reqLabels)){
        dateInput.value = formatDateForSubmit(dateInput.value);
        lastDateInput.value = formatDateForSubmit(lastDateInput.value);
        amountInput.value = clearForSubmit(amountInput.value);
        form.submit();
    }  
}); 

//                  ÇEK SON KULLANIM İNPUT

if (paymentTypeInput.value == "Çek") {
    chekLastDateBox.style.display = "block";
} else {
    chekLastDateBox.style.display = "none";
}
paymentTypeInput.addEventListener('change', ()=>{
    const selectedOption = paymentTypeInput.options[paymentTypeInput.selectedIndex].text;
    if (selectedOption.startsWith('Çek')) {
        chekLastDateBox.style.display = "block";
    } else {
        chekLastDateBox.style.display = "none";
    }
});

