
var firmalar = document.querySelectorAll("#dropdown1 .dropdown-item");
var firmaSubmitBtn = document.querySelector("#firma_add_btn");
var firmaAddInput = document.querySelector("#id_CompanyName_Clients");
var firmaAddLabel = document.querySelector("#firma_add_label");
var firmaForm = document.querySelector("#firma_form");
var firmaAddBtn = document.getElementById("paying-firma-add-btn");
var clientFirmaAddModal = document.getElementById("clientFirmaAdd-modal");
var clientFirmaAddWindow = document.querySelector(".clientFirmaAddWindow");
var form = document.querySelector("#my-form");
var createBtn = document.querySelector("#project-create-btn");
var reqInputs = document.querySelectorAll("#id_CompanyName, #id_ProjectName, #id_ProjectCode");
var reqLabels = document.querySelectorAll("#firma_adi_span, #proje_adi_span, #proje_kodu_span");
var startDateInput = document.querySelector("#tarih");
var finishDateInput = document.querySelector("#tarih2");
var isBedeliInput = document.querySelector("#id_Cost_NotIncludingKDV");
var hesaplananMaliyetInput = document.querySelector("#id_CalculatedCost_NotIncludingKDV");
var acPowerInput = document.querySelector("#id_AC_Power");
var dcPowerInput = document.querySelector("#id_DC_Power");
const kdvRateInput = document.getElementById("id_KDV_Rate");



//                  TARİH İNPUTLARI FORMATLAMA

startDateInput.addEventListener('input', function(event) {
    var userInput = startDateInput.value; 
   if (event.inputType !== 'deleteContentBackward') {
    startDateInput.value = formatDate(userInput);
   }
  });
  finishDateInput.addEventListener('input', function(event) {
    var userInput = finishDateInput.value; 
   if (event.inputType !== 'deleteContentBackward') {
    finishDateInput.value = formatDate(userInput);
   }
  });

//                  INPUTLARI FORMATLAMA

inputForFormat(isBedeliInput);
inputForFormat(hesaplananMaliyetInput);
inputForFormat(acPowerInput);
inputForFormat(dcPowerInput);


//                  FORM SUBMİT ETME

createBtn.addEventListener("click", function(event) {
    event.preventDefault();          
    if(requiredInputs(reqInputs, reqLabels)){
        startDateInput.value = formatDateForSubmit(startDateInput.value);
        finishDateInput.value = formatDateForSubmit(finishDateInput.value);
        isBedeliInput.value = clearForSubmit(isBedeliInput.value);
        hesaplananMaliyetInput.value = clearForSubmit(hesaplananMaliyetInput.value);
        acPowerInput.value = clearForSubmit(acPowerInput.value);
        dcPowerInput.value = clearForSubmit(dcPowerInput.value);
        form.submit();
    }    
}); 

//                   FİRMA ADD FORM

firmaAddBtn.addEventListener("click", function() {
    clientFirmaAddWindow.style.display = "flex";
});
    clientFirmaAddModal.addEventListener("click", function() {
     clientFirmaAddWindow.style.display = "none";
});

//                   FİRMA SUBMİT KONTROL

firmaSubmitBtn.addEventListener("click", function(event){
    event.preventDefault();       
    if(firmaCount(firmalar, firmaAddInput) == 0 && firmaAddInput.value.trim() != ""){
        firmaAddLabel.style.color = "black";
        firmaAddLabel.style.fontWeight = "500";
        firmaForm.submit();
    }
    else{
        firmaAddLabel.style.color = "red";
        firmaAddLabel.style.fontWeight = "600";
    }   
});

//                   KDV % EKLEME

addPercentageSymbol(kdvRateInput);
kdvRateInput.addEventListener("input", function () {
  addPercentageSymbol(kdvRateInput);
});
function addPercentageSymbol(input) {
  let enteredValue = input.value;
  let numericValue = enteredValue.replace(/[^0-9,.]/g, "");
  let formattedValue =  "%" + numericValue;
  input.value = formattedValue;
}