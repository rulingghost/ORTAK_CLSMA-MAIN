var amountInput = document.querySelector("#id_Amount_Expenses");
var createBtn = document.querySelector("#project-create-btn");
//var reqInputs = document.querySelectorAll("#id_CompanyName_Paying_Expenses");
//var reqLabels = document.querySelectorAll("#odeme_yapilan_firma_span");
var form = document.querySelector("#my-form");
var dateInput = document.querySelector("#id_Date_Expenses");


var kurInput = document.querySelector("#id_Dollar_Rate_Expenses"); 
var dateForKur = document.querySelector("#id_Date_Expenses"); 
var timeForKur = document.querySelector("#kur-time");             

var firmaAddBtn = document.getElementById("paying-firma-add-btn-2");
var clientFirmaAddWindow = document.querySelector(".payingFirmaAddWindow");
var clientFirmaAddModal = document.getElementById("payingFirmaAdd-modal");

var firmalar = document.querySelectorAll("#dropdown2 .dropdown-item");
var payingFirmaInput = document.querySelector("#id_CompanyName_Paying_Expenses");
var payingFirmaLabel = document.querySelector("#odeme_yapilan_firma_span");
var details = document.querySelectorAll("#dropdown3 .dropdown-item");
var detailsInput = document.querySelector("#id_ExpensDetails_Expenses");
var detailsLabel = document.querySelector("#gider_detay_span");

var firmaAddInput = document.querySelector("#id_CompanyName_Supplier");          
var firmaSubmitBtn = document.querySelector("#firma_add_btn");
var firmaForm = document.querySelector("#firma_form");
var firmaAddLabel = document.querySelector("#firma_add_label");



//                  INPUTLARI FORMATLAMA

inputForFormat(amountInput);

//                  FORM SUBMİT ETME

createBtn.addEventListener("click", function(event) {
    event.preventDefault();            
   if(payingFirmaInput.value != ""){
    dateInput.value = formatDateForSubmit(dateInput.value);
    amountInput.value = clearForSubmit(amountInput.value);
    form.submit();
   }
}); 

//                  TARİH İNPUT FORMATLAMA

dateInput.addEventListener('input', function(event) {
    var userInput = dateInput.value;   
   if (event.inputType !== 'deleteContentBackward') {
    dateInput.value = formatDate(userInput);
   }
 });

//                 FİRMA ADD FORM

firmaAddBtn.addEventListener("click", function() {
    clientFirmaAddWindow.style.display = "flex";
});
clientFirmaAddModal.addEventListener("click", function() {
    clientFirmaAddWindow.style.display = "none";
});

//                  FİRMA EKLEME İŞLEMİ


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
 
form.addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
        event.preventDefault(); 
    }
});