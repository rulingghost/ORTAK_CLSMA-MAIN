var reqInputs = document.querySelectorAll("#id_Client_Card_Copy, #id_Person_Deal");
var reqLabels = document.querySelectorAll("#firma_adi_span, #ilgilenen_kisi_span");
var createBtn = document.querySelector("#project-create-btn");
var dateInput = document.querySelector("#tarih");
var form = document.querySelector("#my-form");

var offerCostInput = document.querySelector("#id_Offer_Cost_NotIncludingKDV_Card");
var unitOfferInput = document.querySelector("#id_UnitOffer_NotIncludingKDV");
var acPowerInput = document.querySelector("#id_AC_Power_Card");
var dcPowerInput = document.querySelector("#id_DC_Power_Card");
var totalCostInput = document.querySelector("#id_Cost_NotIncludingKDV_Card");
var unitCostInput = document.querySelector("#id_UnitCost_NotIncludingKDV");
var roofCostInput = document.querySelector("#id_Roof_Cost_Card");

var mySelect = document.getElementById("id_Terrain_Roof_Card");
var araziBedeliInput = document.querySelector("#id_Roof_Cost_Card");
var araziSpan = document.querySelector(".arazi-span");

var firmaAddBtn = document.getElementById("paying-firma-add-btn");
var clientFirmaAddModal = document.getElementById("clientFirmaAdd-modal");
var clientFirmaAddWindow = document.querySelector(".clientFirmaAddWindow");

let teklifBedeliCalc = document.querySelector("#teklif_bedeli_btn");
let birimTeklifCalc = document.querySelector("#br_tek_btn");
let toplamMaliyetCalc = document.querySelector("#total_mal_btn");
let birimMaliyetCalc = document.querySelector("#br_mal_btn");
let dcGucCalc = document.querySelector("#dc_guc_btn");  

var firmaSubmitBtn = document.querySelector("#firma_add_btn");
var firmaAddInput = document.querySelector("#id_CompanyName_Clients");
var firmaAddLabel = document.querySelector("#firma_add_label");
var firmalar = document.querySelectorAll("#dropdown1 .dropdown-item");
var firmaForm = document.querySelector("#firma_form");


//                  TARİH İNPUTLARI FORMATLAMA

dateInput.addEventListener('input', function(event) {
    var userInput = dateInput.value; 
   if (event.inputType !== 'deleteContentBackward') {
    dateInput.value = formatDate(userInput);
   }
});

//                  INPUTLARI FORMATLAMA

inputForFormat(offerCostInput);
inputForFormat(unitOfferInput);
inputForFormat(acPowerInput);
inputForFormat(dcPowerInput);
inputForFormat(totalCostInput);
inputForFormat(unitCostInput);
inputForFormat(roofCostInput);


//                  FORM SUBMİT ETME

createBtn.addEventListener("click", function(event) {
    event.preventDefault();          
    if(requiredInputs(reqInputs, reqLabels)){
        dateInput.value = formatDateForSubmit(dateInput.value);
        offerCostInput.value = clearForSubmit(offerCostInput.value);
        unitOfferInput.value = clearForSubmit(unitOfferInput.value);
        acPowerInput.value = clearForSubmit(acPowerInput.value);
        dcPowerInput.value = clearForSubmit(dcPowerInput.value);        
        totalCostInput.value = clearForSubmit(totalCostInput.value);
        unitCostInput.value = clearForSubmit(unitCostInput.value);
        roofCostInput.value = clearForSubmit(roofCostInput.value);
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

//                  ARAZİ/ÇATI İNPUT SEÇİMİ

mySelect.addEventListener('change', function(){
  var selectedIndex = mySelect.selectedIndex;
  var selectedText = mySelect.options[selectedIndex].text;
if (selectedText=="Arazi") {
  araziBedeliInput.style.display = "block";
  araziSpan.style.display = "block";
} else {
  araziBedeliInput.style.display = "none";
  araziSpan.style.display = "none";
}
});

//                  MALİYET HESAPLAMA İŞLEMLERİ
var teklifBedeliInput = document.querySelector("#id_Offer_Cost_NotIncludingKDV_Card");
var dcGucInput = document.querySelector('#id_DC_Power_Card');
var birimTeklifInput = document.querySelector("#id_UnitOffer_NotIncludingKDV");

var birimBasiMaliyetInput = document.querySelector("#id_UnitCost_NotIncludingKDV");
var isBedeliInput = document.querySelector("#id_Cost_NotIncludingKDV_Card");




teklifBedeliCalc.addEventListener("click", ()=> {
  if(!(clear2(birimTeklifInput.value) == "") && !(clear2(dcGucInput.value) == "")){
    var value = clear2(birimTeklifInput.value) * clear2(dcGucInput.value); 
    teklifBedeliInput.value = formatNumber(value, 2);              
  }
});
birimTeklifCalc.addEventListener("click", ()=> {
  if(!(clear2(teklifBedeliInput.value) == "") && !(clear2(dcGucInput.value) == "")){
    var value = clear2(teklifBedeliInput.value) / clear2(dcGucInput.value); 
    birimTeklifInput.value = formatNumber(value, 2);              
  }
});
toplamMaliyetCalc.addEventListener("click", ()=> {
  if(!(clear2(birimBasiMaliyetInput.value) == "") && !(clear2(dcGucInput.value) == "")){
    var value = clear2(birimBasiMaliyetInput.value) * clear2(dcGucInput.value); 
    isBedeliInput.value = formatNumber(value, 2);              
  }
});
birimMaliyetCalc.addEventListener("click", ()=> {
  if(!(clear2(isBedeliInput.value) == "") && !(clear2(dcGucInput.value) == "")){
    var value = clear2(isBedeliInput.value) / clear2(dcGucInput.value); 
    birimBasiMaliyetInput.value = formatNumber(value, 2);              
  }
});
dcGucCalc.addEventListener("click", ()=> {
  if(!(clear2(teklifBedeliInput.value) == "") && !(clear2(birimTeklifInput.value) == "")){
    var value = clear2(teklifBedeliInput.value) / clear2(birimTeklifInput.value); 
    dcGucInput.value = formatNumber(value, 2);                
  }
  if(!(clear2(isBedeliInput.value) == "") && !(clear2(birimBasiMaliyetInput.value) == "")){
    var value = clear2(isBedeliInput.value) / clear2(birimBasiMaliyetInput.value); 
    dcGucInput.value = formatNumber(value, 2);              
  }
});