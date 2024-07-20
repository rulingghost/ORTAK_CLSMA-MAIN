
var phoneNumberInput = document.querySelector("#id_PhoneNumber");
var companyNameInput = document.querySelector("#id_CompanyName_Clients_New");
var companyNameLabel = document.querySelector("#firma_adi_span");
var amountInputReformatBtn = document.querySelector("#kaydet_btn");
var form = document.querySelector("#myForm");

//                  TELEFON NUMARASI FORMATLAMA

var contryNumber = "+90";
phoneNumberInput.value = formatPhoneNumberByCountryCode(
  phoneNumberInput.value,
  contryNumber
);
phoneNumberInput.addEventListener("input", function (event) {
  if (event.inputType !== "deleteContentBackward") {
    phoneNumberInput.value = formatPhoneNumberByCountryCode(
      phoneNumberInput.value,
      contryNumber
    );
  }
});

//                  ZORUNLU İNPUTLAR

amountInputReformatBtn.addEventListener("click", function (event) {
  event.preventDefault();
  if (companyNameInput.value != "") {
    form.submit();
  }else{
    companyNameLabel.style.color = "red"
    companyNameLabel.style.fontWeight = "600"
  }
});
