var startDateInput = document.querySelector("#id_StartDate");
var finishDateInput = document.querySelector("#id_FinishDate");
var kdvRateInput = document.getElementById("id_KDV_Rate");
var isBedeliInput = document.querySelector("#id_Cost_NotIncludingKDV");
var hesaplananMaliyetInput = document.querySelector("#id_CalculatedCost_NotIncludingKDV");
var acPowerInput = document.querySelector("#id_AC_Power");
var dcPowerInput = document.querySelector("#id_DC_Power");
var createBtn = document.querySelector("#project-create-btn");
var reqInputs = document.querySelectorAll("#id_CompanyName");
var reqLabels = document.querySelectorAll("#firma_adi_span");
var form = document.querySelector("#my-form");





//                  INPUTLARI FORMATLAMA

inputForFormat(isBedeliInput);
inputForFormat(hesaplananMaliyetInput);
inputForFormat(acPowerInput);
inputForFormat(dcPowerInput);

dateInputFormat(startDateInput);
dateInputFormat(finishDateInput);
onPageLoad(isBedeliInput);
onPageLoad(hesaplananMaliyetInput);
onPageLoad(acPowerInput);
onPageLoad(dcPowerInput);

//                  TARİH İNPUTLARI FORMATLAMA

startDateInput.addEventListener('input', function (event) {
  var userInput = startDateInput.value;
  if (event.inputType !== 'deleteContentBackward') {
    startDateInput.value = formatDate(userInput);
  }
});
finishDateInput.addEventListener('input', function (event) {
  var userInput = finishDateInput.value;
  if (event.inputType !== 'deleteContentBackward') {
    finishDateInput.value = formatDate(userInput);
  }
});

//                  FORM SUBMİT ETME

createBtn.addEventListener("click", function (event) {
  event.preventDefault();
  if (requiredInputs(reqInputs, reqLabels)) {
    startDateInput.value = formatDateForSubmit(startDateInput.value);
    finishDateInput.value = formatDateForSubmit(finishDateInput.value);
    isBedeliInput.value = clearForSubmit(isBedeliInput.value);
    hesaplananMaliyetInput.value = clearForSubmit(hesaplananMaliyetInput.value);
    acPowerInput.value = clearForSubmit(acPowerInput.value);
    dcPowerInput.value = clearForSubmit(dcPowerInput.value);
    form.submit();
  }
});

//                  KDV % DEĞERİ KOYMA

addPercentageSymbol(kdvRateInput);
kdvRateInput.addEventListener("input", function () {
  addPercentageSymbol(kdvRateInput);
});

function addPercentageSymbol(input) {
  let enteredValue = input.value;
  let numericValue = enteredValue.replace(/[^0-9,.]/g, "");
  let formattedValue = "%" + numericValue;
  input.value = formattedValue;
}

