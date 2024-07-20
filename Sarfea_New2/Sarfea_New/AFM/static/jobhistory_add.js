
var firmaAddBtn = document.getElementById("paying-firma-add-btn-2");
var clientFirmaAddWindow = document.querySelector(".payingFirmaAddWindow");
var clientFirmaAddModal = document.getElementById("payingFirmaAdd-modal");
var firmaSubmitBtn = document.querySelector("#firma_add_btn");
var firmalar = document.querySelectorAll("#dropdown2 .dropdown-item");
var firmaAddInput = document.querySelector("#id_CompanyName_Supplier");  
var firmaAddLabel = document.querySelector("#firma_add_label");
var firmaForm = document.querySelector("#firma_form");
var dateInput = document.querySelector("#id_Date_JobHistory");
var amountInput = document.querySelector("#id_Amount_JobHistory");
var reqInputs = document.querySelectorAll("#id_CompanyName_Job_JobHistory, #id_ProjectName_JobHistory");
var reqLabels = document.querySelectorAll("#is_yapilan_firma_span, #proje_adi_span");
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

//                  FORM SUBMİT ETME

createBtn.addEventListener("click", function(event) {
    event.preventDefault();       
    if(requiredInputs(reqInputs, reqLabels)){
        dateInput.value = formatDateForSubmit(dateInput.value);
        amountInput.value = clearForSubmit(amountInput.value);
        form.submit();
    }  
});  

//                  FİRMA EKLEME

firmaAddBtn.addEventListener("click", function() {
    clientFirmaAddWindow.style.display = "flex";
});
clientFirmaAddModal.addEventListener("click", function() {
    clientFirmaAddWindow.style.display = "none";
});

//                  FİRMA SUBMİT KONTROLÜ

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