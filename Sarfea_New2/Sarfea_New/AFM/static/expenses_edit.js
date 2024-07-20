var reqInputs = document.querySelectorAll("#id_CompanyName_Paying_Expenses, #id_ProjectName_Expenses");
var reqLabels = document.querySelectorAll("#odeme_yapilan_firma_span, #proje_adi_span");

var dateInput = document.querySelector("#id_Date_Expenses");
var form = document.querySelector("#my-form");
var amountInput = document.querySelector("#id_Amount_Expenses");
var createBtn = document.querySelector("#project-create-btn");



var kurInput = document.querySelector("#id_Dollar_Rate_Expenses");  
var dateForKur = document.querySelector("#id_Date_Expenses");  
var timeForKur = document.querySelector("#kur-time");     

var firmalar = document.querySelectorAll("#dropdown1 .dropdown-item");
var payingFirmaInput = document.querySelector("#id_CompanyName_Paying_Expenses");
var payingFirmaLabel = document.querySelector("#odeme_yapilan_firma_span");
var details = document.querySelectorAll("#dropdown2 .dropdown-item");
var detailsInput = document.querySelector("#id_ExpensDetails_Expenses");
var detailsLabel = document.querySelector("#gider_detay_span");






//                  INPUTLARI FORMATLAMA

inputForFormat(amountInput);
onPageLoad(amountInput);
dateInputFormat(dateInput);

 //                  TARİH İNPUT FORMATLAMA

 dateInput.addEventListener('input', function(event) {
    var userInput = dateInput.value;   
   if (event.inputType !== 'deleteContentBackward') {
    dateInput.value = formatDate(userInput);
   }
 });

 //                  FORM SUBMİT ETME

createBtn.addEventListener("click", function(event) {
    event.preventDefault();           
    if(requiredInputs(reqInputs, reqLabels)){
      console.log("asd")
        dateInput.value = formatDateForSubmit(dateInput.value);
        amountInput.value = clearForSubmit(amountInput.value);
        form.submit();
    }    
}); 




