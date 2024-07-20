var reqInputs = document.querySelectorAll("#id_CompanyName_Paying_Expenses, #id_ProjectName_Expenses");
var reqLabels = document.querySelectorAll("#odeme_yapilan_firma_span, #proje_adi_span");

var dateInput = document.querySelector("#id_Date_Expenses");
var form = document.querySelector("#my-form");
var amountInput = document.querySelector("#id_Amount_Expenses");
var createBtn = document.querySelector("#project-create-btn");


var kurInput = document.querySelector("#id_Dollar_Rate_Expenses");  
var dateForKur = document.querySelector("#id_Date_Expenses");  
var timeForKur = document.querySelector("#kur-time");     

var clientFirmaAddModal = document.getElementById("payingFirmaAdd-modal");
var firmaAddBtn = document.getElementById("paying-firma-add-btn-2");
var clientFirmaAddWindow = document.querySelector(".payingFirmaAddWindow");

var firmalar = document.querySelectorAll("#dropdown2 .dropdown-item");
var projeler = document.querySelectorAll("#dropdown1 .dropdown-item");
var payingFirmaInput = document.querySelector("#id_CompanyName_Paying_Expenses");
var projeNameInput = document.querySelector("#id_ProjectName_Expenses");
var payingFirmaLabel = document.querySelector("#odeme_yapilan_firma_span");
var projeNameLabel = document.querySelector("#proje_adi_span");
var details = document.querySelectorAll("#dropdown3 .dropdown-item");
var detailsInput = document.querySelector("#id_ExpensDetails_Expenses");
var detailsLabel = document.querySelector("#gider_detay_span");

var firmaAddInput = document.querySelector("#id_CompanyName_Supplier");          
var firmaSubmitBtn = document.querySelector("#firma_add_btn");
var firmaForm = document.querySelector("#firma_form");
var firmaAddLabel = document.querySelector("#firma_add_label");
      


//                  INPUTLARI FORMATLAMA

inputForFormat(amountInput);

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
        dateInput.value = formatDateForSubmit(dateInput.value);
        amountInput.value = clearForSubmit(amountInput.value);
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